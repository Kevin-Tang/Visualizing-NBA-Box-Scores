from nba_py import game, Scoreboard
from datetime import datetime
import re


def getGameID(month, day, year):
    """
    :param month:
    :param day:
    :param year:
    :return: List of Game IDs for the input date
    """
    # TODAY = datetime.today()
    s = Scoreboard(month, day, year)
    # game_ids = [item['GAME_ID'] for item in s.game_header()]  # This doesn't work in Python 2
    game_ids_column = s.game_header()['GAME_ID']
    # game_ids = [ str(item) for item in game_ids]
    game_ids = [str(item) for item in game_ids_column]
    # ['0021600331', '0021600332', '0021600333', '0021600334', '0021600335', '0021600336']
    return game_ids


def getTeams(gameID):
    box = game.BoxscoreSummary(gameID)
    lineScore = (box.line_score())
    teamCityNames_column = lineScore['TEAM_CITY_NAME']
    teamCityNames = [str(item) for item in teamCityNames_column]
    teamNicknames_column = lineScore['TEAM_NICKNAME']
    teamNicknames = [str(item) for item in teamNicknames_column]
    homeTeam = teamCityNames[0] + " " + teamNicknames[0]
    awayTeam = teamCityNames[1] + " " + teamNicknames[1]
    teams = [homeTeam, awayTeam]
    return teams


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
        Team1 = [0]  # initialize array with 0
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


def getPlayers(gameID):
    try:
        box = game.Boxscore(gameID)
        playerStats = box.player_stats()
        print (playerStats)
        played = []
        for index in range(len(playerStats)):
            if (playerStats['MIN'][index] != None):
                played.append(index)
        playersList1 = []
        playersList2 = []
        playersScores1 = []
        playersScores2 = []
        for index in played:
            if playerStats['TEAM_ID'][index] == playerStats['TEAM_ID'][0]:
                playersList1.append(str(playerStats['PLAYER_NAME'][index]))
                playersScores1.append(int(playerStats['PTS'][index]))
            else:
                playersList2.append(str(playerStats['PLAYER_NAME'][index]))
                playersScores2.append(int(playerStats['PTS'][index]))
        # playersScores = [int(shit) for shit in playerStats['PTS']]
        # print (playersList)
        # print (playersScores)
        # playersList = [str(item) for item in players_column if item['MIN'] is not None]
        # playersList = [item['PLAYER_NAME'] for item in playerStats if item['MIN'] is not None]
        return [playersList2, playersScores2, playersList1, playersScores1]

    except Exception as e:
        print(str(e))
        print("PLAYERS were not found.")


def getPlaybyPlay(gameID):
    try:
        pbp = game.PlayByPlay(gameID)
        plays = (pbp.info())
        playList = []
        for index, row in plays.iterrows():
            if row['SCORE'] is not None:
                data = [row['PERIOD'], row['PCTIMESTRING'], row['HOMEDESCRIPTION'], row['VISITORDESCRIPTION'], row['SCORE']]
                playList.append(data)
        """
        playList = [[item['PERIOD'] for item in plays if item['SCORE'] is not None],
                    [item['PCTIMESTRING'] for item in plays if item['SCORE'] is not None],
                    [item['HOMEDESCRIPTION'] for item in plays if item['SCORE'] is not None],
                    [item['VISITORDESCRIPTION'] for item in plays if item['SCORE'] is not None],
                    [item['SCORE'] for item in plays if item['SCORE'] is not None]
        ]

        playList = list(zip(*playList)) Dont need this for Python 2.7
        """
        team1_Data = []
        team2_Data = []
        period_Data = []
        for play in playList:
            score = (re.findall('\d+', play[4]))
            team1_Data.append(int(score[0]))
            team2_Data.append(int(score[1]))
            period_Data.append("Period: " + str(play[0]) + ", Time: " + str(play[1]))

        return [team1_Data, team2_Data, period_Data]
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
    id = getGameID(12, 20, 2016)
    plays = getPlaybyPlay(id[1])
    print (plays)


if __name__ == '__main__':
    main()