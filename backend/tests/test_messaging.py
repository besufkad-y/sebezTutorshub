import pytest
from rest_framework import status
from apps.accounts.models import User

@pytest.mark.django_db
def test_send_and_fetch_messages(api_client):
    user1 = User.objects.create_user(email='user1@test.com', password='password123', first_name='Alex', last_name='Rivera', role='student')
    user2 = User.objects.create_user(email='user2@test.com', password='password123', first_name='Becca', last_name='Tutor', role='tutor')

    api_client.force_authenticate(user=user1)

    # 1. Send message
    send_payload = {
        'receiver_id': user2.id,
        'message_content': 'Hello, are you free for math tutoring tomorrow?'
    }
    res = api_client.post('/api/messages/', send_payload, format='json')
    assert res.status_code == status.HTTP_201_CREATED
    assert res.json()['success'] is True

    # 2. User 2 replies
    api_client.force_authenticate(user=user2)
    reply_payload = {
        'receiver_id': user1.id,
        'message_content': 'Hi Alex, yes I have availability at 3 PM.'
    }
    res_reply = api_client.post('/api/messages/', reply_payload, format='json')
    assert res_reply.status_code == status.HTTP_201_CREATED

    # 3. Check conversation thread
    thread_res = api_client.get(f'/api/messages/{user1.id}/')
    assert thread_res.status_code == status.HTTP_200_OK
    messages = thread_res.json()['messages']
    assert len(messages) == 2
    assert messages[0]['message_content'] == 'Hello, are you free for math tutoring tomorrow?'
    assert messages[1]['message_content'] == 'Hi Alex, yes I have availability at 3 PM.'

    # 4. Check conversations list
    conv_res = api_client.get('/api/messages/conversations/')
    assert conv_res.status_code == status.HTTP_200_OK
    conversations = conv_res.json()['conversations']
    assert len(conversations) == 1
    assert conversations[0]['user_id'] == user1.id
    assert conversations[0]['name'] == 'Alex Rivera'
    assert conversations[0]['last_message'] == 'Hi Alex, yes I have availability at 3 PM.'

@pytest.mark.django_db
def test_send_message_empty_content_fails(api_client):
    user1 = User.objects.create_user(email='u1@test.com', password='p', first_name='U1', last_name='L1')
    user2 = User.objects.create_user(email='u2@test.com', password='p', first_name='U2', last_name='L2')
    api_client.force_authenticate(user=user1)

    res = api_client.post('/api/messages/', {'receiver_id': user2.id, 'message_content': '   '}, format='json')
    assert res.status_code == status.HTTP_400_BAD_REQUEST
    assert res.json()['success'] is False
