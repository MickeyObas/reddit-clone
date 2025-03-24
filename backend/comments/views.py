from rest_framework import status, parsers
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response

from .models import Comment
from .serializers import CommentSerializer
from posts.models import Post


@api_view(['GET'])
def all_comments(request):
    if not request.user.is_superuser:
        return Response({'error': 'YOU CANNOT PERFORM THIS ACTION'}, status=status.HTTP_403_FORBIDDEN)
    comments = Comment.objects.all()
    serializer = CommentSerializer(comments, many=True, context={"request": request})
    return Response(serializer.data)


@api_view(['GET', 'PATCH', 'DELETE'])
def comment_detail_update_delete(request, pk):
    try:
        comment = Comment.objects.get(id=pk)

        if request.method == 'GET':
            serializer = CommentSerializer(comment)
            return Response(serializer.data)
        
        elif request.method == 'PATCH':
            serializer = CommentSerializer(comment, data=request.data, partial=True, context={"request": request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        
        elif request.method == 'DELETE':
            comment.delete()
            return Response(status=204)
        
    except Comment.DoesNotExist:
        return Response({'error': 'Comment does not exist.'}, status=404)


@api_view(['GET', 'POST'])
@parser_classes([parsers.FormParser, parsers.MultiPartParser])
def comment_list_or_create(request, pk):
    try:
        post = Post.objects.get(id=pk)

        if request.method == 'GET':
            comments = post.comment_set.all()
            serializer = CommentSerializer(comments, many=True, context={"request": request})
            return Response(serializer.data)
        
        elif request.method == 'POST':
            data = request.data.copy()
            print(data)
            data['post'] = pk
            serializer = CommentSerializer(data=data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response({'message': 'Comment created successfully.'},  status=201)        
            return Response(serializer.errors, status=400)
        
    except Post.DoesNotExist:
        return Response({'error': 'Post does not exist.'}, status=404)
