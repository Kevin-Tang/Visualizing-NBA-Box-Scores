from nba_py import game, Scoreboard
from datetime import datetime

def getPointsbyQuarter():
    try:
        TODAY = datetime.today()
        # TODAY = ((TODAY.month) + "-" + str(TODAY.day) + "-" + str(TODAY.year))
        s = Scoreboard(TODAY.month, TODAY.day - 1, TODAY.year)
        game_ids = [item['GAME_ID'] for item in s.game_header()] # ['0021600331', '0021600332', '0021600333', '0021600334', '0021600335', '0021600336']
        box = game.BoxscoreSummary(game_ids[0])
        lineScore = (box.line_score())
        print(lineScore)
        quarterPoints = []
        for quarter in range(1, 5):
            Qtr = 'PTS_QTR' + str(quarter)
            quarterPoints.extend(item[Qtr] for item in lineScore)
        Team1 = quarterPoints[::2]
        Team2 = quarterPoints[1:len(quarterPoints):2]
        Points = [Team1, Team2]
        return Points
    except Exception as e:
        print(str(e))
        print("Points wasn't found")

def getPointsbyPlayer():
    try:
        TODAY = datetime.today()
        # TODAY = ((TODAY.month) + "-" + str(TODAY.day) + "-" + str(TODAY.year))
        s = Scoreboard(TODAY.month, TODAY.day - 1, TODAY.year)
        game_ids = [item['GAME_ID'] for item in s.game_header()]  # ['0021600331', '0021600332', '0021600333', '0021600334', '0021600335', '0021600336']
        box = game.Boxscore(game_ids[0])
        playerStats = (box.player_stats())
        print(playerStats)
        playerPoints = [item['PTS'] for item in playerStats if item['MIN'] is not None]
        return playerPoints
    except Exception as e:
        print(str(e))

def getPlayers():
    try:
        TODAY = datetime.today()
        # TODAY = ((TODAY.month) + "-" + str(TODAY.day) + "-" + str(TODAY.year))
        s = Scoreboard(TODAY.month, TODAY.day - 1, TODAY.year)
        game_ids = [item['GAME_ID'] for item in s.game_header()]  # ['0021600331', '0021600332', '0021600333', '0021600334', '0021600335', '0021600336']
        box = game.Boxscore(game_ids[0])
        playerStats = box.player_stats()
        playersList = [item['PLAYER_NAME'] for item in playerStats if item['MIN'] is not None]
        print(playersList)
        return True
    except Exception as e:
        print(str(e))

def getPlaybyPlay():
    pbp = game.PlayByPlay('0041400122')
    plays = (pbp.info())
    #print(plays)
    playList = [[item['PERIOD'] for item in plays if item['SCORE'] is not None],
                [item['PCTIMESTRING'] for item in plays if item['SCORE'] is not None],
                [item['HOMEDESCRIPTION'] for item in plays if item['SCORE'] is not None],
                [item['VISITORDESCRIPTION'] for item in plays if item['SCORE'] is not None],
                [item['SCORE'] for item in plays if item['SCORE'] is not None]
                ]
    return list(zip(*playList))

def main():
    """
    quarterPoints = getPointsbyQuarter() # Uncomment to run
    pointsbyPlayer = getPointsbyPlayer() # Uncomment to run
    print(quarterPoints)
    print(pointsbyPlayer)
    """
    playbyPlay = getPlaybyPlay()
    print(playbyPlay)
if __name__ == '__main__':
    main()