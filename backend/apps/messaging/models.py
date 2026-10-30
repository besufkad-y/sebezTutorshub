from django.db import models
from django.conf import settings

class Message(models.Model):
    message_id = models.AutoField(primary_key=True)
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_messages'
    )
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='received_messages'
    )
    message_content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def id(self):
        return self.message_id

    def __str__(self):
        return f"Msg #{self.message_id} from {self.sender_id} to {self.receiver_id}"
