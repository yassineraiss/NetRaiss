from django.contrib.auth.models import User
from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    '''
    Why using the create() method ?
    By overriding the create method in the UserSerializer, I can utilize the create_user 
    method of the User model, which takes care of password hashing and any other user-specific
    creation logic.
    This override ensures that when a new user is created through the API, the password is 
    properly hashed and the user instance is created correctly.
    '''
    def create(self, validated_data):  
        user = User.objects.create_user(**validated_data)
        return user

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'content']