from rest_framework import serializers
from .models import TutorReview, WebsiteReview, ContactMessage

class TutorReviewSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()

    class Meta:
        model = TutorReview
        fields = [
            'id',
            'tutor_id',
            'student_id',
            'student_name',
            'rating',
            'comment',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']

    def get_student_name(self, obj):
        if obj.student:
            return f"{obj.student.first_name} {obj.student.last_name}"
        return 'Student'

class WebsiteReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = WebsiteReview
        fields = ['review_id', 'user_id', 'user_name', 'rating', 'review_text', 'created_at']
        read_only_fields = ['review_id', 'created_at']

    def get_user_name(self, obj):
        if obj.user:
            return f"{obj.user.first_name} {obj.user.last_name}"
        return 'Anonymous'

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['contact_id', 'name', 'email', 'subject', 'message', 'created_at']
        read_only_fields = ['contact_id', 'created_at']
