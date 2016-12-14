from __future__ import unicode_literals

from django.db import models

class Date(models.Model):
	date = models.CharField(max_length=30)
	# month = models.CharField(max_length=10)
	# day = models.CharField(max_length=10)
	# year = models.CharField(max_length=10)

	def __str__(self):
		return 'The date is %s' % (self.date) 

class Game(models.Model):
	gameDate = models.ForeignKey(Date, on_delete=models.CASCADE, null=True)
	gameID = models.CharField(max_length=20, unique=True)
	homeTeam = models.CharField(max_length=20, default='')
	awayTeam = models.CharField(max_length=20, default='')
	lineScore = models.CharField(max_length=200, default='')

	def __str__(self):
		return 'Game ID: %s' % (self.gameID)