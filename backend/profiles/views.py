from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework import status, parsers


from .models import Profile
from .serializers import ProfileSerializer


@api_view(['GET'])
def profile_list(request):
    profiles = Profile.objects.all()
    serializer = ProfileSerializer(profiles, many=True)
    return Response(serializer.data)


@api_view(['GET', 'PATCH'])
@parser_classes([parsers.FormParser, parsers.MultiPartParser])
def profile_detail_update(request, pk):
    try:
        profile = Profile.objects.get(id=pk)

        if request.method == 'GET':
            serializer = ProfileSerializer(profile)
            return Response(serializer.data)
        
        elif request.method == 'PATCH':
            serializer = ProfileSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({'message': 'Profile updated successfuly.'})
            return Response(serializer.errors, status=400)
    
    except Profile.DoesNotExist:
        return Response({'error': "Profile does not exist."}, status=404)