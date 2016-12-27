from nba_py import game, Scoreboard
from datetime import datetime


def getGameID(month, day, year):
    """
    :param month:
    :param day:
    :param year:
    :return: List of Game IDs for the input date
    """
    s = Scoreboard(month, day, year)
    game_ids = [item['GAME_ID'] for item in s.game_header()]
    return game_ids


def getTeams(gameID):
    box = game.BoxscoreSummary(gameID)
    lineScore = box.line_score()
    teamCityNames = [item['TEAM_CITY_NAME'] for item in lineScore]
    teamNicknames = [item['TEAM_NICKNAME'] for item in lineScore]
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
    return game_ids


def getPointsbyQuarter(gameID):
    try:
        box = game.BoxscoreSummary(gameID)
        lineScore = (box.line_score())
        quarterPoints = []
        for quarter in range(1, 5):
            Qtr = 'PTS_QTR' + str(quarter)
            quarterPoints.extend(int(item[Qtr]) for item in lineScore) # This doesn't work in Python 2
        homeTeam = [0]  # initialize array with 0
        homeTeam.extend(quarterPoints[::2])
        awayTeam = [0]
        awayTeam.extend(quarterPoints[1:len(quarterPoints):2])
        # Append total points (PTS) to the quarterPoints arrays
        totalPoints = []
        totalPoints.extend(int(item["PTS"]) for item in lineScore)
        homeTeam.append(totalPoints[0])
        awayTeam.append(totalPoints[1])
        quarterPoints = [homeTeam, awayTeam]
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
        played = []
        teamID = []
        awayPlayers = []
        homePlayers = []
        awayScores = []
        homeScores = []
        for player in playerStats:
            if player['MIN'] != None:
                played.append(player['PLAYER_NAME'])
            if player['TEAM_ID'] not in teamID:
                teamID.append(player['TEAM_ID'])
            if player['TEAM_ID'] == teamID[0]:
                awayPlayers.append(player['PLAYER_NAME'])
                awayScores.append(player['PTS'])
            elif player['TEAM_ID'] == teamID[1]:
                homePlayers.append(player['PLAYER_NAME'])
                homeScores.append(player['PTS'])
            else:
                continue
        return [homePlayers, homeScores, awayPlayers, awayScores]
    except Exception as e:
        print(str(e))
        print("PLAYERS were not found.")


def getPlaybyPlay(gameID):
    try:
        pbp = game.PlayByPlay(gameID)
        plays = (pbp.info())
        """
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
        playList = list(zip(*playList)) # Dont need this for Python 2.7
        homeTeam = []
        awayTeam = []
        period_Data = []
        """
        for play in playList:
            score = (re.findall('\d+', play[4]))
            homeTeam.append(int(score[1]))
            awayTeam.append(int(score[0]))
            period_Data.append("Period: " + str(play[0]) + ", Time: " + str(play[1]))
        """
        for play in playList:
            homeTeam.append(int(play[4].split()[2]))
            awayTeam.append(int(play[4].split()[0]))
            period_Data.append("Period: " + str(play[0]) + ", Time: " + str(play[1]))
        return [homeTeam, awayTeam, period_Data]
    except Exception as e:
        print(str(e))
        print("PLAYBYPLAY is unavailible")


def main():
    id = getGameID(12, 20, 2016)
    #plays = getPlaybyPlay(id[1])
    #teams = getTeams(id[1])
    #idToday = getGameIDsToday()
    #ptsbyQ = getPointsbyQuarter(id[0])
    #players = getPlayers(id[0])
    pointsbyPlayer = getPointsbyPlayer(12, 20, 2016)


if __name__ == '__main__':
    main()