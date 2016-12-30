import json
from django.template import loader
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import HttpResponse
from . import getStats

@ensure_csrf_cookie  #This decorator forces a view to send the CSRF cookie.
def index(request):
    template = loader.get_template('NBAStats/index.html')
    return HttpResponse(template.render(request))

def populate_game_buttons(request):
    u_date = request.POST.get("date")  # unicode format of date
    date = str(u_date)  # convert from unicode to string

    u_month = request.POST.get("month")  # unicode format of month
    month = int(u_month)  # convert from unicode to int

    u_day = request.POST.get("day")
    day = int(u_day)

    u_year = request.POST.get("year")
    year = int(u_year)

    game_ids = getStats.getGameID(month, day, year)
    teamsList = []
    for ID in game_ids:
        teams = getStats.getTeams(ID)
        teamsList.append(teams)

    # for ID in game_ids:
    #     game = Game.objects.get_or_create(gameID=ID, gameDate=date)

    # game_set = Game.objects.filter(gameDate=date)
    # print (game_set)

    response_data = {}
    response_data['date'] = date
    response_data['game_ids'] = game_ids
    response_data['teamsList'] = teamsList

    return HttpResponse(
        json.dumps(response_data),
        content_type="application/json"
    )

def get_game_data(request):
    IDposted = str(request.POST.get("gameID"))
    # print (IDposted)

    ID = IDposted  # to be deleted later when server functions again
    # game = Game.objects.get(gameID=IDposted)
    # ID = game.gameID
    # print ("ID is %s" % ID)

    teams = getStats.getTeams(ID)

    quarterPoints = getStats.getPointsbyQuarter(ID)

    players = getStats.getPlayers(ID)

    playbyplay = getStats.getPlaybyPlay(ID)

    response_data = {'gameID': ID, 'quarterPoints': quarterPoints, 'teams': teams,
                     'players': players, 'playbyplay': playbyplay}

    return HttpResponse(
        json.dumps(response_data),
        content_type="application/json"
    )