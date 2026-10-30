from django.db.models import Q
from django.utils import timezone
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.accounts.models import User
from .models import TutoringSession
from .serializers import TutoringSessionSerializer

class SessionListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        sessions = TutoringSession.objects.filter(
            Q(tutor=user) | Q(student=user)
        ).select_related('tutor', 'student').order_by('-session_date')

        serializer = TutoringSessionSerializer(sessions, many=True)
        return Response({'success': True, 'sessions': serializer.data})

    def post(self, request):
        user = request.user
        data = request.data
        tutor_id = data.get('tutor_id')
        session_date_str = data.get('session_date')
        notes = data.get('notes', '')

        if not tutor_id or not session_date_str:
            return Response({'success': False, 'message': 'Missing required fields.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            tutor = User.objects.get(id=tutor_id, role='tutor')
        except User.DoesNotExist:
            return Response({'success': False, 'message': 'Tutor not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = TutoringSessionSerializer(data={
            'session_date': session_date_str,
            'notes': notes
        })

        if not serializer.is_valid():
            err_msg = 'Failed to book session.'
            if 'session_date' in serializer.errors:
                err_msg = str(serializer.errors['session_date'][0])
            return Response({'success': False, 'message': err_msg, 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        session = TutoringSession.objects.create(
            tutor=tutor,
            student=user,
            session_date=serializer.validated_data['session_date'],
            notes=notes
        )

        return Response({
            'success': True,
            'message': 'Session booked successfully!',
            'session': TutoringSessionSerializer(session).data
        }, status=status.HTTP_201_CREATED)

class SessionStatusUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data = request.data
        session_id = data.get('session_id')
        new_status = data.get('status')

        if not session_id or not new_status:
            return Response({'success': False, 'message': 'Missing required fields.'}, status=status.HTTP_400_BAD_REQUEST)

        if new_status not in ['scheduled', 'completed', 'cancelled']:
            return Response({'success': False, 'message': 'Invalid status.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            session = TutoringSession.objects.get(session_id=session_id)
        except TutoringSession.DoesNotExist:
            return Response({'success': False, 'message': 'Session not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Ensure requesting user is tutor or student of this session
        if session.tutor_id != request.user.id and session.student_id != request.user.id:
            return Response({'success': False, 'message': 'Unauthorized to modify this session.'}, status=status.HTTP_403_FORBIDDEN)

        session.status = new_status
        session.save()

        return Response({'success': True, 'message': 'Session status updated.', 'session': TutoringSessionSerializer(session).data})
