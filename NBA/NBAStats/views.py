from django.shortcuts import render
from django.template import loader
import sys
# sys.path.append('Visualizing_NBA_Boxscores/nba_py_master')
sys.path.insert(0, 'Visualizing_NBA_Boxscores/nba_py_master')
from nba_py import Scoreboard, game
from . import getStats
from .models import Game

from django.views.decorators.csrf import ensure_csrf_cookie

from django.http import HttpResponse

import json

@ensure_csrf_cookie  #This decorator forces a view to send the CSRF cookie.
def index(request):
	template = loader.get_template('NBAStats/index.html')
	return HttpResponse(template.render(request))

def populate_game_buttons(request):
	u_date = request.POST.get("date")  # this is a unicode format of date
	date = str(u_date)  # convert from unicode to string

	u_month = request.POST.get("month")  # this is a unicode format of month
	month = int(u_month)  # convert from unicode to int

	u_day = request.POST.get("day")
	day = int(u_day)

	u_year = request.POST.get("year")
	year = int(u_year)

	game_ids = getStats.getGameID(month, day, year)
	print (game_ids)
	for ID in game_ids:
		game = Game.objects.get_or_create(gameID=ID, gameDate=date)

	game_set = Game.objects.filter(gameDate=date)
	print game_set

	response_data = {}
	response_data['date'] = date
	response_data['game_ids'] = game_ids

	return HttpResponse(
		json.dumps(response_data),
		content_type="application/json"
	)

def get_game_data(request):
	IDposted = str(request.POST.get("gameID"))
	print IDposted

	game = Game.objects.get(gameID=IDposted)
	ID = game.gameID
	print "ID is %s" % ID

	teams = getStats.getTeams(ID)

	quarterPoints = getStats.getPointsbyQuarter(ID)

	players = getStats.getPlayers(ID)
	
	response_data = {}
	response_data['gameID'] = ID
	response_data['quarterPoints'] = quarterPoints
	response_data['teams'] = teams
	response_data['players'] = players

	return HttpResponse(
		json.dumps(response_data),
		content_type="application/json"
	)