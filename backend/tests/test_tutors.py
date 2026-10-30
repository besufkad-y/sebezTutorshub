import pytest
from rest_framework import status
from apps.accounts.models import User

@pytest.mark.django_db
def test_subjects_listing(api_client):
    from apps.tutors.models import Subject
    Subject.objects.create(name='Mathematics')
    Subject.objects.create(name='Physics')

    response = api_client.get('/api/subjects/')
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) == 2
    names = [s['name'] for s in data]
    assert 'Mathematics' in names
    assert 'Physics' in names

@pytest.mark.django_db
def test_tutors_listing_and_filtering(api_client):
    from apps.tutors.models import Subject, TutorProfile, RatingsSummary

    # Create 2 tutors and 1 student
    tutor1 = User.objects.create_user(email='t1@test.com', password='pass', first_name='Tutor', last_name='One', role='tutor')
    tutor2 = User.objects.create_user(email='t2@test.com', password='pass', first_name='Tutor', last_name='Two', role='tutor')
    User.objects.create_user(email='s1@test.com', password='pass', first_name='Student', last_name='One', role='student')

    TutorProfile.objects.create(tutor=tutor1, bio='Math wizard', hourly_rate=45.00)
    TutorProfile.objects.create(tutor=tutor2, bio='Physics expert', hourly_rate=55.00)

    RatingsSummary.objects.create(tutor=tutor1, average_rating=4.9, total_reviews=10)
    RatingsSummary.objects.create(tutor=tutor2, average_rating=4.2, total_reviews=5)

    math = Subject.objects.create(name='Mathematics')
    tutor1.taught_subjects.add(math)

    # 1. Listing all tutors
    res = api_client.get('/api/tutors/')
    assert res.status_code == status.HTTP_200_OK
    tutors = res.json()
    assert len(tutors) == 2

    # 2. Top rated filtering
    res_top = api_client.get('/api/tutors/?top_rated=1')
    assert res_top.status_code == status.HTTP_200_OK
    top = res_top.json()
    assert len(top) <= 3
    assert top[0]['user_id'] == tutor1.id

    # 3. Filter by subject
    res_sub = api_client.get(f'/api/tutors/?subject={math.id}')
    assert res_sub.status_code == status.HTTP_200_OK
    assert len(res_sub.json()) == 1
    assert res_sub.json()[0]['user_id'] == tutor1.id

@pytest.mark.django_db
def test_tutor_profile_update(api_client):
    from apps.tutors.models import Subject
    tutor = User.objects.create_user(email='tutor@test.com', password='password123', first_name='John', last_name='Doe', role='tutor')
    api_client.force_authenticate(user=tutor)

    sub1 = Subject.objects.create(name='English')
    sub2 = Subject.objects.create(name='Spanish')

    payload = {
        'first_name': 'Johnny',
        'last_name': 'Doe',
        'phone_number': '+1234567890',
        'address': '123 Learning Way',
        'bio': 'Passionate languages tutor',
        'education': 'MA Linguistics',
        'hourly_rate': '40.00',
        'availability': 'Mon, Wed, Fri',
        'subjects': [sub1.id, sub2.id]
    }

    res = api_client.post('/api/tutors/update-profile/', payload, format='json')
    assert res.status_code == status.HTTP_200_OK
    data = res.json()
    assert data['success'] is True
    assert data['user']['first_name'] == 'Johnny'

    # Check updated detail
    detail = api_client.get(f'/api/tutors/{tutor.id}/').json()
    assert detail['bio'] == 'Passionate languages tutor'
    assert 'English' in detail['subjects']
    assert 'Spanish' in detail['subjects']

@pytest.mark.django_db
def test_tutor_profile_subjects_limit(api_client):
    from apps.tutors.models import Subject
    tutor = User.objects.create_user(email='tutor7@test.com', password='password123', first_name='John', last_name='Doe', role='tutor')
    api_client.force_authenticate(user=tutor)

    # Creating 8 subjects
    subs = [Subject.objects.create(name=f'Sub {i}') for i in range(8)]
    payload = {
        'first_name': 'John',
        'last_name': 'Doe',
        'subjects': [s.id for s in subs]
    }
    res = api_client.post('/api/tutors/update-profile/', payload, format='json')
    assert res.status_code == status.HTTP_400_BAD_REQUEST
    assert 'limit' in res.json()['message'].lower() or 'maximum' in res.json()['message'].lower()
