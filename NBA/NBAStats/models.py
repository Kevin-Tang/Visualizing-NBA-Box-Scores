from __future__ import unicode_literals

from django.db import models

class Game(models.Model):
	gameID = models.CharField(max_length=50, unique=True)
	firstTeam = models.CharField(max_length=10)
	secondTeam = models.CharField(max_length=10)
	lineScore = models.CharField(max_length=200)

	def __str__(self):
		return 'Game ID: %s' % (self.gameID)

class Date(models.Model):
	date = models.DateTimeField("Date")
	gamesOfDate = models.ForeignKey(Game, related_name='gamesOfDate', on_delete=models.CASCADE)

	def __str__(self):
		return 'Date: %s' % (self.date)