from __future__ import print_function
from nba_py import shotchart
from nba_py import Scoreboard

scoreBoard = Scoreboard()
# game_ids_object = scoreBoard.game_header()['GAME_ID']
# game_ids_str = [ str(item) for item in game_ids_object]
# print(game_ids_str)
# print(game_ids_str[3])
date = scoreBoard._game_date
print(date)
print(type(date))


# game_ids = [item['GAME_ID'] for item in s.game_header()]

# chart = shotchart.ShotChart('203507')
# print(chart.shot_chart())

