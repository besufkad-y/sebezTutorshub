from django.db.models import Q
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.accounts.models import User
from .models import Message
from .serializers import MessageSerializer

class MessageCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        sender = request.user
        data = request.data
        receiver_id = data.get('receiver_id')
        content = (data.get('message_content') or '').strip()

        if not receiver_id or not content:
            return Response({'success': False, 'message': 'All fields required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            receiver = User.objects.get(id=receiver_id)
        except User.DoesNotExist:
            return Response({'success': False, 'message': 'Receiver not found.'}, status=status.HTTP_404_NOT_FOUND)

        message = Message.objects.create(
            sender=sender,
            receiver=receiver,
            message_content=content
        )

        return Response({
            'success': True,
            'message': 'Message sent successfully!',
            'data': MessageSerializer(message).data
        }, status=status.HTTP_201_CREATED)

class MessageThreadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, partner_id):
        user = request.user
        messages = Message.objects.filter(
            (Q(sender=user) & Q(receiver_id=partner_id)) |
            (Q(sender_id=partner_id) & Q(receiver=user))
        ).select_related('sender', 'receiver').order_by('created_at')

        serializer = MessageSerializer(messages, many=True)
        return Response({'success': True, 'messages': serializer.data})

class ConversationListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        # Fetch all messages where user is sender or receiver ordered by created_at DESC
        messages = Message.objects.filter(
            Q(sender=user) | Q(receiver=user)
        ).select_related('sender', 'receiver').order_by('-created_at')

        conversations = {}
        for msg in messages:
            partner = msg.receiver if msg.sender_id == user.id else msg.sender
            if partner.id not in conversations:
                conversations[partner.id] = {
                    'user_id': partner.id,
                    'name': f"{partner.first_name} {partner.last_name}",
                    'avatar': partner.profile_picture_url or '/images/users/1.jpg',
                    'role': partner.role,
                    'last_message': msg.message_content,
                    'last_time': msg.created_at.isoformat(),
                }

        return Response({'success': True, 'conversations': list(conversations.values())})
