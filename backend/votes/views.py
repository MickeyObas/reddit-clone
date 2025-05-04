from rest_framework import status, parsers
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.permissions import IsAuthenticated

from django.db import transaction
from django.db.models import F

from .models import Vote
from posts.models import Post
from accounts.models import User
from comments.models import Comment


@api_view(['POST'])
@permission_classes([IsAuthenticated])
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

        with transaction.atomic():
            if obj == 'p':
                post = Post.objects.select_for_update().get(id=obj_id)

                vote_qs = Vote.objects.select_for_update().filter(
                    owner=user,
                    post=post,
                )
                if vote_qs.exists():
                    existing_vote = vote_qs.get()
                    if existing_vote.type == dir:
                        existing_vote.delete()
                    else:
                        existing_vote.type = dir
                        existing_vote.save()
                else:
                    Vote.objects.create(
                        owner=user,
                        type=dir,
                        post=post, 
                    )
                new_vote_total = post.vote_count

            elif obj == 'c':
                comment = Comment.objects.select_for_update().get(id=obj_id)

                vote_qs = Vote.objects.select_for_update().filter(
                    owner=user,
                    comment=comment,
                )

                if vote_qs.exists():
                    existing_vote = vote_qs.get()
                    if existing_vote.type == dir:
                        existing_vote.delete()
                    else:
                        existing_vote.type = dir
                        existing_vote.save()
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
    
    except Exception as e:
        print(e)
        return Response({'error': f"Something went wrong -> {e}"})
    
