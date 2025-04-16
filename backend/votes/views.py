from rest_framework import status, parsers
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes

from .models import Vote
from posts.models import Post
from accounts.models import User
from comments.models import Comment


@api_view(['POST'])
def vote(request):
    try:
        obj = request.query_params.get('obj')  
        user_id = request.query_params.get('user_id')  
        obj_id = request.query_params.get('obj_id')  
        dir = int(request.query_params.get('dir'))

        if not obj in ['c', 'p'] or not user_id or not obj_id or dir not in [1, -1]:
            return Response({'error': 'Invalid request.'}, status=400)
        
        new_vote_total = None

        user = User.objects.get(id=user_id)

        if obj == 'p':
            post = Post.objects.get(id=obj_id)

            similar_vote = Vote.objects.filter(
                owner=user,
                post=post,
            )
            if similar_vote.exists():
                similar_vote = similar_vote.first()
                if similar_vote.type == dir:
                    similar_vote.delete()
                else:
                    similar_vote.type = dir
                    similar_vote.save()
            else:
                Vote.objects.create(
                    owner=user,
                    type=dir,
                    post=post, 
                )
            new_vote_total = post.vote_count

        elif obj == 'c':
            comment = Comment.objects.get(id=obj_id)

            similar_vote = Vote.objects.filter(
                owner=user,
                comment=comment,
            )

            if similar_vote.exists():
                similar_vote = similar_vote.first()
                if similar_vote.type == dir:
                    similar_vote.delete()
                else:
                    similar_vote.type = dir
                    similar_vote.save()
            else:
                Vote.objects.create(
                    owner=user,
                    type=dir,
                    comment=comment  
                )
            new_vote_total = comment.vote_count

        return Response({
            'message': 'Vote administered successfully.',
            'obj': obj,
            "count": new_vote_total
            })
    
    except User.DoesNotExist:
        return Response({'error': 'User does not exist'}, status=400)
    
    except Post.DoesNotExist:
        return Response({'error': 'Post does not exist.'}, status=400)
    
    except Comment.DoesNotExist:
        return Response({'error': 'Comment does not exist.'}, status=400)
    
