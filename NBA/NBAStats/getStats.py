from nba_py import game, Scoreboard
from datetime import datetime

def getGameID(month, day, year):
    """
    :param month:
    :param day:
    :param year:
    :return: List of Game IDs for the input date
    """
    TODAY = datetime.today()
    s = Scoreboard(month, day, year)
    # game_ids = [item['GAME_ID'] for item in s.game_header()] # This doesn't work in Python 2
    game_ids_column = s.game_header()['GAME_ID']
    game_ids = [ str(item) for item in game_ids_column]
    # ['0021600331', '0021600332', '0021600333', '0021600334', '0021600335', '0021600336']
    return game_ids

def getGameIDsToday():
    """
    :return: List of Game IDs today
    """
    TODAY = datetime.today()
    s = Scoreboard(TODAY.month, TODAY.day, TODAY.year)
    game_ids = [item['GAME_ID'] for item in s.game_header()]
    # ['0021600331', '0021600332', '0021600333', '0021600334', '0021600335', '0021600336']
    return game_ids

def getPointsbyQuarter(gameID):
    try:
        box = game.BoxscoreSummary(gameID)
        lineScore = (box.line_score())
        print(lineScore)
        quarterPoints = []
        for quarter in range(1, 5):
            Qtr = 'PTS_QTR' + str(quarter)
            quarterPoints_column = lineScore[Qtr]
            quarterPoints.extend(int(item) for item in quarterPoints_column)
            # quarterPoints.extend(item[Qtr] for item in lineScore) # This doesn't work in Python 2
        print(quarterPoints)
        Team1 = [0] # initialize array with 0
        Team1.extend(quarterPoints[::2])
        Team2 = [0]
        Team2.extend(quarterPoints[1:len(quarterPoints):2])
        # Append total points (PTS) to the quarterPoints arrays
        totalPoints = []
        PTS_column = lineScore['PTS']
        totalPoints.extend(int(item) for item in PTS_column)
        Team1.append(totalPoints[0])
        Team2.append(totalPoints[1])
        quarterPoints = [Team1, Team2]
        return quarterPoints
    
    except Exception as e:
        print(str(e))
        print("POINTS was not found. Data is probably unavailble.")

def getPointsbyPlayer(month, day, year):
    try:
        game_ids = getGameID(month, day, year)
        box = game.Boxscore(game_ids[0])
        playerStats = (box.player_stats())
        print(playerStats)
        playerPoints = [item['PTS'] for item in playerStats if item['MIN'] is not None]
        return playerPoints

    except Exception as e:
        print(str(e))
        print("POINTS was not found. Data is probably unavailible")

def getPlayers(month, day, year):
    try:
        game_ids = getGameID(month, day, year)
        box = game.Boxscore(game_ids[0])
        playerStats = box.player_stats()
        playersList = [item['PLAYER_NAME'] for item in playerStats if item['MIN'] is not None]
        print(playersList)
        return True

    except Exception as e:
        print(str(e))
        print("PLAYERS were not found.")

def getPlaybyPlay(month, day, year):
    try:
        game_ids = getGameID(month, day, year)
        pbp = game.PlayByPlay(game_ids[0])
        plays = (pbp.info())
        #print(plays)
        playList = [[item['PERIOD'] for item in plays if item['SCORE'] is not None],
                    [item['PCTIMESTRING'] for item in plays if item['SCORE'] is not None],
                    [item['HOMEDESCRIPTION'] for item in plays if item['SCORE'] is not None],
                    [item['VISITORDESCRIPTION'] for item in plays if item['SCORE'] is not None],
                    [item['SCORE'] for item in plays if item['SCORE'] is not None]
        ]
        #for play in playList:
        #    print(len(play))
        return list(zip(*playList))

    except Exception as e:
        print(str(e))
        print("PLAYBYPLAY is unavailible")

def main():
    """
    quarterPoints = getPointsbyQuarter() # Uncomment to run
    pointsbyPlayer = getPointsbyPlayer() # Uncomment to run
    print(quarterPoints)
    print(pointsbyPlayer)
    """
    playbyPlay = getPointsbyQuarter(12, 7, 2016)
    print(playbyPlay)

if __name__ == '__main__':
    main()