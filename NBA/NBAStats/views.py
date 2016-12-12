from django.shortcuts import render
from django.template import loader
from  import game, Scoreboard

from django.http import HttpResponse


def index(request):
	template = loader.get_template('NBAStats/index.html')
	return HttpResponse(template.render(request))

def populate_game_buttons(request):
	pass