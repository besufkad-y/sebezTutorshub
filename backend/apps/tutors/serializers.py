from rest_framework import serializers
from .models import Subject, TutorProfile, RatingsSummary, TutorSubject
from apps.accounts.models import User

class SubjectSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='subject_id', read_only=True)

    class Meta:
        model = Subject
        fields = ['id', 'subject_id', 'name', 'created_at']

class TutorDetailSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='id', read_only=True)
    bio = serializers.SerializerMethodField()
    education = serializers.SerializerMethodField()
    hourly_rate = serializers.SerializerMethodField()
    availability = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    total_reviews = serializers.SerializerMethodField()
    subjects = serializers.SerializerMethodField()
    subject_ids = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'user_id',
            'first_name',
            'last_name',
            'email',
            'role',
            'profile_picture_url',
            'phone_number',
            'address',
            'bio',
            'education',
            'hourly_rate',
            'availability',
            'average_rating',
            'total_reviews',
            'subjects',
            'subject_ids',
        ]

    def get_bio(self, obj):
        profile = getattr(obj, 'tutor_profile', None)
        return profile.bio if profile else ''

    def get_education(self, obj):
        profile = getattr(obj, 'tutor_profile', None)
        return profile.education if profile else ''

    def get_hourly_rate(self, obj):
        profile = getattr(obj, 'tutor_profile', None)
        return str(profile.hourly_rate) if (profile and profile.hourly_rate is not None) else None

    def get_availability(self, obj):
        profile = getattr(obj, 'tutor_profile', None)
        return profile.availability if profile else ''

    def get_average_rating(self, obj):
        summary = getattr(obj, 'ratings_summary', None)
        return float(summary.average_rating) if summary else 0.0

    def get_total_reviews(self, obj):
        summary = getattr(obj, 'ratings_summary', None)
        return summary.total_reviews if summary else 0

    def get_subjects(self, obj):
        return [ts.subject.name for ts in obj.tutor_subjects.select_related('subject').all()]

    def get_subject_ids(self, obj):
        return [ts.subject_id for ts in obj.tutor_subjects.all()]
