from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from .services import VoteService
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

        user = User.objects.get(id=user_id)
        if request.user != user:
            raise PermissionDenied("You cannot vote as another user.");
    
        vote_service = VoteService()
        new_vote_total = vote_service.vote(user, obj, obj_id, dir)

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
    
