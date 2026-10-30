from rest_framework import serializers
from .models import Message

class MessageSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='message_id', read_only=True)
    sender_name = serializers.SerializerMethodField()
    receiver_name = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = [
            'id',
            'message_id',
            'sender_id',
            'receiver_id',
            'sender_name',
            'receiver_name',
            'message_content',
            'created_at',
        ]
        read_only_fields = ['id', 'message_id', 'created_at']

    def get_sender_name(self, obj):
        if obj.sender:
            return f"{obj.sender.first_name} {obj.sender.last_name}"
        return 'User'

    def get_receiver_name(self, obj):
        if obj.receiver:
            return f"{obj.receiver.first_name} {obj.receiver.last_name}"
        return 'User'
