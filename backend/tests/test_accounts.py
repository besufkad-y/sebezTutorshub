import pytest
from rest_framework import status

@pytest.mark.django_db
def test_user_registration_success(api_client):
    payload = {
        'first_name': 'Alice',
        'last_name': 'Smith',
        'email': 'alice@example.com',
        'password': 'password123',
        'role': 'student'
    }
    response = api_client.post('/api/auth/register/', payload, format='json')
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data['success'] is True
    assert 'token' in data
    assert data['user']['email'] == 'alice@example.com'
    assert data['user']['role'] == 'student'
    assert 'password' not in data['user']

@pytest.mark.django_db
def test_user_registration_missing_fields(api_client):
    payload = {
        'first_name': 'Alice',
        'email': 'alice@example.com',
    }
    response = api_client.post('/api/auth/register/', payload, format='json')
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    data = response.json()
    assert data['success'] is False

@pytest.mark.django_db
def test_user_registration_duplicate_email(api_client):
    payload = {
        'first_name': 'Alice',
        'last_name': 'Smith',
        'email': 'alice@example.com',
        'password': 'password123',
        'role': 'student'
    }
    api_client.post('/api/auth/register/', payload, format='json')
    response2 = api_client.post('/api/auth/register/', payload, format='json')
    assert response2.status_code == status.HTTP_400_BAD_REQUEST
    data = response2.json()
    assert data['success'] is False

@pytest.mark.django_db
def test_user_login_success(api_client):
    reg_payload = {
        'first_name': 'Bob',
        'last_name': 'Jones',
        'email': 'bob@example.com',
        'password': 'password123',
        'role': 'tutor'
    }
    api_client.post('/api/auth/register/', reg_payload, format='json')

    login_payload = {
        'email': 'bob@example.com',
        'password': 'password123'
    }
    response = api_client.post('/api/auth/login/', login_payload, format='json')
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data['success'] is True
    assert 'token' in data
    assert data['user']['email'] == 'bob@example.com'

@pytest.mark.django_db
def test_user_login_invalid_credentials(api_client):
    login_payload = {
        'email': 'nobody@example.com',
        'password': 'wrongpassword'
    }
    response = api_client.post('/api/auth/login/', login_payload, format='json')
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    data = response.json()
    assert data['success'] is False
