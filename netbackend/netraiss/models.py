from django.contrib.auth.models import User
from django.db import models

class Post(models.Model):
    user = models.ForeignKey(User, on_delete= models.CASCADE, related_name='posts')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            'id': self.id,
            'content': self.content,
            'user': self.user.username,
            'created_at': self.created_at.strftime("%b %d %Y, %I:%M %p")
        }

class Follow(models.Model):
    user = models.ForeignKey(User, on_delete= models.CASCADE, related_name='followings')
    friend = models.ForeignKey(User, on_delete= models.CASCADE, related_name='followers')

    def serialize(self):
        return {
            'id': self.id,
            'user': self.user.username,
            'friend': self.friend.username
        }
    
    def is_follow_valid(self):
        return self.user != self.friend

class Like(models.Model):
    user = models.ForeignKey(User, on_delete= models.CASCADE, related_name='liked_posts')
    post = models.ForeignKey(Post, on_delete= models.CASCADE, related_name='likes')

    def serialize(self):
        return {
            'id': self.id,
            'user': self.user.username,
            'post': self.post.id
        }