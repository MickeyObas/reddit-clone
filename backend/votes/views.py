from rest_framework import status, parsers
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes

from .models import Vote
from posts.models import Post
from accounts.models import User


@api_view(['POST'])
def post_vote(request):
    print(request.query_params) 
    user_id = request.query_params.get('user_id')  
    post_id = request.query_params.get('post_id')  
    dir = int(request.query_params.get('dir'))

    user = User.objects.get(id=user_id)
    post = Post.objects.get(id=post_id)

    similar_vote = Vote.objects.filter(
        owner=user,
        post=post,
        type=dir
    )

    if similar_vote.exists():
        similar_vote.delete()
    else:
        Vote.objects.create(
            owner=user,
            post=post,
            type=1 if dir == 1 else -1  
        )

    return Response({'test': 'test'})