from nba_py import game, shotchart

gameID = '0041400122'

def boxScore():
    boxscore = game.Boxscore(gameID)
    print(boxscore.team_stats())

    # advBoxscore = game.BoxscoreAdvanced(gameID)
    # print(advBoxscore.team_stats())

    # print(game.BoxscoreSummary(gameID).game_info())
    # print(game.BoxscoreSummary(gameID).game_summary())
    # print(game.BoxscoreSummary(gameID).line_score())
    # print(game.BoxscoreSummary(gameID).inactive_players())
    # print(game.BoxscoreSummary(gameID).season_series())

def main():
    boxScore()

if __name__ == '__main__':
    main()