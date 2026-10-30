import pytest
from datetime import datetime, timedelta, timezone
from rest_framework import status
from apps.accounts.models import User

@pytest.mark.django_db
def test_create_session_success(api_client):
    student = User.objects.create_user(email='student@test.com', password='password123', first_name='Sam', last_name='Student', role='student')
    tutor = User.objects.create_user(email='tutor@test.com', password='password123', first_name='Tom', last_name='Tutor', role='tutor')
    api_client.force_authenticate(user=student)

    future_date = (datetime.now(timezone.utc) + timedelta(days=2)).isoformat()
    payload = {
        'tutor_id': tutor.id,
        'session_date': future_date,
        'notes': 'Algebra review'
    }

    res = api_client.post('/api/sessions/', payload, format='json')
    assert res.status_code == status.HTTP_201_CREATED
    data = res.json()
    assert data['success'] is True
    assert data['session']['tutor_id'] == tutor.id
    assert data['session']['student_id'] == student.id
    assert data['session']['status'] == 'scheduled'

@pytest.mark.django_db
def test_create_session_past_date_fails(api_client):
    student = User.objects.create_user(email='student2@test.com', password='password123', first_name='Sam', last_name='Student', role='student')
    tutor = User.objects.create_user(email='tutor2@test.com', password='password123', first_name='Tom', last_name='Tutor', role='tutor')
    api_client.force_authenticate(user=student)

    past_date = (datetime.now(timezone.utc) - timedelta(days=2)).isoformat()
    payload = {
        'tutor_id': tutor.id,
        'session_date': past_date,
        'notes': 'Old date'
    }

    res = api_client.post('/api/sessions/', payload, format='json')
    assert res.status_code == status.HTTP_400_BAD_REQUEST
    data = res.json()
    assert data['success'] is False
    assert 'past' in data['message'].lower()

@pytest.mark.django_db
def test_list_and_update_session_status(api_client):
    from apps.sessions_app.models import TutoringSession
    student = User.objects.create_user(email='student3@test.com', password='password123', first_name='Sam', last_name='Student', role='student')
    tutor = User.objects.create_user(email='tutor3@test.com', password='password123', first_name='Tom', last_name='Tutor', role='tutor')

    future_date = datetime.now(timezone.utc) + timedelta(days=3)
    session = TutoringSession.objects.create(
        tutor=tutor,
        student=student,
        session_date=future_date,
        notes='Calculus prep'
    )

    # Student lists sessions
    api_client.force_authenticate(user=student)
    res = api_client.get('/api/sessions/')
    assert res.status_code == status.HTTP_200_OK
    assert len(res.json()['sessions']) == 1

    # Tutor updates status to 'completed'
    api_client.force_authenticate(user=tutor)
    update_res = api_client.post('/api/sessions/update-status/', {
        'session_id': session.session_id,
        'status': 'completed'
    }, format='json')
    assert update_res.status_code == status.HTTP_200_OK
    assert update_res.json()['success'] is True

    session.refresh_from_db()
    assert session.status == 'completed'
