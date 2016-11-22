from __future__ import unicode_literals

from django.db import models

# Create your models here.

class Team(models.Model):
	teamID = models.CharField(max_length=50, unique=True)
	winsLosses = models.CharField(max_length=10)
	teamName = models.CharField(max_length=50, unique=True)

	def __str__(self):
		return 'Team: %s' % (self.teamName)

class Game(models.Model):
	gameID = models.CharField(max_length=50, unique=True)
	firstTeam = models.ForeignKey(Team, related_name='firstTeam', on_delete=models.CASCADE)
	secondTeam = models.ForeignKey(Team, related_name='secondTeam', on_delete=models.CASCADE)

	def __str__(self):
		return 'Game ID: %s' % (self.gameID)

class Date(models.Model):
	date = models.DateTimeField("Date")
	gamesOfDate = models.ForeignKey(Game, related_name='gamesOfDate', on_delete=models.CASCADE)

	def __str__(self):
		return 'Date: %s' % (self.date)