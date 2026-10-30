from django.utils import timezone
from rest_framework import serializers
from .models import TutoringSession
from apps.accounts.models import User

class TutoringSessionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='session_id', read_only=True)
    tutor_name = serializers.SerializerMethodField()
    student_name = serializers.SerializerMethodField()

    class Meta:
        model = TutoringSession
        fields = [
            'id',
            'session_id',
            'tutor_id',
            'student_id',
            'tutor_name',
            'student_name',
            'session_date',
            'status',
            'notes',
            'created_at',
        ]
        read_only_fields = ['id', 'session_id', 'created_at']

    def get_tutor_name(self, obj):
        if obj.tutor:
            return f"{obj.tutor.first_name} {obj.tutor.last_name}"
        return 'Tutor'

    def get_student_name(self, obj):
        if obj.student:
            return f"{obj.student.first_name} {obj.student.last_name}"
        return 'Student'

    def validate_session_date(self, value):
        if value < timezone.now():
            raise serializers.ValidationError('Session date/time cannot be in the past.')
        return value
