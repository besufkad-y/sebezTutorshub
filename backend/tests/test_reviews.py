import pytest
from rest_framework import status
from apps.accounts.models import User

@pytest.mark.django_db
def test_submit_tutor_review_and_ratings_summary_update(api_client):
    from apps.tutors.models import RatingsSummary
    student1 = User.objects.create_user(email='s1@test.com', password='pass', first_name='Student', last_name='One', role='student')
    student2 = User.objects.create_user(email='s2@test.com', password='pass', first_name='Student', last_name='Two', role='student')
    tutor = User.objects.create_user(email='t@test.com', password='pass', first_name='Tutor', last_name='One', role='tutor')

    # Student 1 submits a 5-star review
    api_client.force_authenticate(user=student1)
    res1 = api_client.post('/api/reviews/tutor/', {
        'tutor_id': tutor.id,
        'rating': 5,
        'comment': 'Amazing tutor!'
    }, format='json')
    assert res1.status_code == status.HTTP_201_CREATED
    assert res1.json()['success'] is True

    # RatingsSummary should be updated: avg=5.0, total=1
    summary = RatingsSummary.objects.get(tutor=tutor)
    assert float(summary.average_rating) == 5.0
    assert summary.total_reviews == 1

    # Student 2 submits a 3-star review
    api_client.force_authenticate(user=student2)
    res2 = api_client.post('/api/reviews/tutor/', {
        'tutor_id': tutor.id,
        'rating': 3,
        'comment': 'Good lessons.'
    }, format='json')
    assert res2.status_code == status.HTTP_201_CREATED

    summary.refresh_from_db()
    assert float(summary.average_rating) == 4.0
    assert summary.total_reviews == 2

    # Fetch tutor reviews
    reviews_res = api_client.get(f'/api/reviews/tutor/{tutor.id}/')
    assert reviews_res.status_code == status.HTTP_200_OK
    reviews = reviews_res.json()['reviews']
    assert len(reviews) == 2
    assert reviews[0]['student_name'] in ['Student One', 'Student Two']

@pytest.mark.django_db
def test_duplicate_review_by_same_student_fails(api_client):
    student = User.objects.create_user(email='s@test.com', password='pass', first_name='Student', last_name='Single', role='student')
    tutor = User.objects.create_user(email='t@test.com', password='pass', first_name='Tutor', last_name='Single', role='tutor')

    api_client.force_authenticate(user=student)
    api_client.post('/api/reviews/tutor/', {'tutor_id': tutor.id, 'rating': 5, 'comment': 'Great!'}, format='json')
    res = api_client.post('/api/reviews/tutor/', {'tutor_id': tutor.id, 'rating': 4, 'comment': 'Duplicate'}, format='json')
    assert res.status_code == status.HTTP_400_BAD_REQUEST
    assert 'already' in res.json()['message'].lower()

@pytest.mark.django_db
def test_contact_us_submission(api_client):
    payload = {
        'name': 'John Inquirer',
        'email': 'john@inquiry.com',
        'subject': 'Tutoring for high schooler',
        'message': 'Do you offer group discounts?'
    }
    res = api_client.post('/api/contact/', payload, format='json')
    assert res.status_code == status.HTTP_201_CREATED
    assert res.json()['success'] is True
