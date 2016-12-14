from django.shortcuts import render
from django.template import loader
import sys
# sys.path.append('Visualizing_NBA_Boxscores/nba_py_master')
sys.path.insert(0, 'Visualizing_NBA_Boxscores/nba_py_master')
from nba_py import Scoreboard, game

from django.views.decorators.csrf import ensure_csrf_cookie

from django.http import HttpResponse

import json

@ensure_csrf_cookie
def index(request):
	template = loader.get_template('NBAStats/index.html')
	return HttpResponse(template.render(request))

def populate_game_buttons(request):
	date = request.POST.get("date")
	month = request.POST.get("month")
	day = request.POST.get("day")
	year = request.POST.get("year")

	# gameDate = Date(date=date)
	# gameDate.save()

	# s = Scoreboard(month, day, year)
	# game_ids_column = scoreBoard.game_header()['GAME_ID']
	# game_ids_str = [ str(item) for item in game_ids_object]

	response_data = {}
	response_data['date'] = date

	return HttpResponse(
		json.dumps(response_data),
		content_type="application/json"
	)



