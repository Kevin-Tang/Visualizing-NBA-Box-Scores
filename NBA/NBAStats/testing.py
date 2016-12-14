from __future__ import print_function
# import sys
# # sys.path.append('Visualizing_NBA_Boxscores/nba_py_master')
# sys.path.insert(0, 'Visualizing_NBA_Boxscores/nba_py_master')
# from nba_py import Scoreboard, game
import getStats

month = 12
day = 13
year = 2016

players = getStats.getPlayers('0021600368');
print (players)