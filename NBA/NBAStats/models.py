from __future__ import unicode_literals

from django.db import models

# Create your models here.

class Team(models.Model):
	teamID = models.CharField(max_length=50, unique=True)
	winsLosses = models.CharField(max_length=10)
	teamName = models.CharField(max_length=50, unique=True)

class Game(models.Model):
	gameDate = models.DateTimeField('Date of Game')
	gameID = models.CharField(max_length=50, unique=True)
	firstTeam = models.ForeignKey(Team, related_name='firstTeam', on_delete=models.CASCADE)
	secondTeam = models.ForeignKey(Team, related_name='secondTeam', on_delete=models.CASCADE)