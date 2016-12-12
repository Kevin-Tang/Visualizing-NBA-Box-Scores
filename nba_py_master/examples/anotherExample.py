from __future__ import print_function
from nba_py import Scoreboard, game
from datetime import datetime, timedelta
import getStats

TODAY = datetime.today()

# print(TODAY.month)
# print(TODAY.day)
# print(TODAY.year)

stat = getStats.getGameID(12, 07, 2016)
print(stat)


# scoreBoard = Scoreboard(TODAY.month, 7)
# game_ids_column = scoreBoard.game_header()['GAME_ID']
# print(game_ids_column)
# game_ids_str = [ str(item) for item in game_ids_object]
# print(game_ids_str)
# print(game_ids_str[3])
# # date = scoreBoard._game_date
# print(date)
# print(type(date))

# pbp = game.PlayByPlay('0041400122')
# print(pbp.info())



# summary = game.BoxscoreSummary('0021600322')
# # print(summary.game_summary())
# print ("\n\n\n\n")
# lineScore = summary.line_score()
# # print(lineScore)
# # print(lineScore.columns)
# # print(type(lineScore))
# # print ("\n\n\n\n")
# print(lineScore[['PTS_QTR1', 'PTS_QTR2', 'PTS_QTR3', 'PTS_QTR4', 'PTS']])
# print ("\n\n\n\n")
# print(lineScore.get(['PTS_QTR1', 'PTS_QTR2', 'PTS_QTR3', 'PTS_QTR4', 'PTS']))




# game_ids = [item['GAME_ID'] for item in s.game_header()]

# chart = shotchart.ShotChart('203507')
# print(chart.shot_chart())