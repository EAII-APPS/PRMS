# views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, permissions
from monApp.models import  Comment, Reply
from .models import PlanDocument
from userApp.models import User
from monApp.serializers import CommentSerializerForPlan, ReplySerializer

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def plan_doc_comment(request, id=None):
    planDocument_id = request.query_params.get('planDocument_id')  # Get planDocument_id from query params

    if request.method == 'GET':
        if id:
            try:
                comments = Comment.objects.get(id=id, planDocument_id=planDocument_id)
                serializer = CommentSerializerForPlan(comments)
            except Comment.DoesNotExist:
                return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)
            return Response(serializer.data)
        else:
            # Filter comments by planDocument_id
            comments = Comment.objects.filter(planDocument_id=planDocument_id)
            serializer = CommentSerializerForPlan(comments, many=True)
            return Response(serializer.data)

    elif request.method == 'POST':
        data = request.data.copy()
        data['user_id'] = request.user.id
        data['username'] = request.user.username
        serializer = CommentSerializerForPlan(data=data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    elif request.method == 'PUT':
        try:
            comment = Comment.objects.get(id=id)
        except Comment.DoesNotExist:
            return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)
        if comment.user != request.user:
            return Response({'error': 'You can only edit your own comments'}, status=status.HTTP_403_FORBIDDEN)
        data = request.data.copy()
        data['user'] = request.user.id  # Ensure the user field is not modified
        if 'planDocument' in data:
            data['tracking'] = None  # Ensure tracking is set to null if planDocument is present
        serializer = CommentSerializerForPlan(comment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        try:
            comment = Comment.objects.get(id=id)
        except Comment.DoesNotExist:
            return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)
        if comment.user != request.user:
            return Response({'error': 'You can only delete your own comments'}, status=status.HTTP_403_FORBIDDEN)
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def comment_reply(request, comment_id=None, id=None):
    if request.method == 'GET':
        if id:
            try:
                reply = Reply.objects.get(id=id)
                serializer = ReplySerializer(reply)
            except Reply.DoesNotExist:
                return Response({'error': 'Reply not found'}, status=status.HTTP_404_NOT_FOUND)
            return Response(serializer.data)
        else:
            replies = Reply.objects.filter(comment_id=comment_id)
            serializer = ReplySerializer(replies, many=True)
            return Response(serializer.data)
    
    if request.method == 'POST':
        data = request.data.copy()
        print("Here is the reply data", data.get('comment_id'))
        
        data['user'] = request.user.id  # Automatically set the user to the current user
        data['comment'] = data.get('comment')  # Ensure this is the correct field
        data['username']= request.user.username
        serializer = ReplySerializer(data=data)
        
        if serializer.is_valid():
            serializer.save(user=request.user, comment_id=data['comment'])
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == 'PUT':
        try:
            reply = Reply.objects.get(id=id)
        except Reply.DoesNotExist:
            return Response({'error': 'Reply not found'}, status=status.HTTP_404_NOT_FOUND)
        if reply.user != request.user:
            return Response({'error': 'You can only edit your own replies'}, status=status.HTTP_403_FORBIDDEN)
        data = request.data.copy()
        data['user'] = request.user.id  # Ensure the user field is not modified
        serializer = ReplySerializer(reply, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == 'DELETE':
        try:
            reply = Reply.objects.get(id=id)
        except Reply.DoesNotExist:
            return Response({'error': 'Reply not found'}, status=status.HTTP_404_NOT_FOUND)
        if reply.user != request.user:
            return Response({'error': 'You can only delete your own replies'}, status=status.HTTP_403_FORBIDDEN)
        reply.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
