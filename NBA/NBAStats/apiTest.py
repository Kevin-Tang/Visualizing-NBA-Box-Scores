from nba_py import Scoreboard, game

month = 12
day = 19
year = 2016

def testScoreboard():
	s = Scoreboard(month, day, year)

	print ("\n\n\ngame_header\n")
	print (s.game_header())

	print ("\n\n\nline_score\n")
	print (s.line_score())

	print("\n\n\nseries_standings\n")
	print (s.series_standings())

	print("\n\n\nlast_meetting\n")
	print (s.last_meeting())

	print("\n\n\neast_conf_standings_by_day\n")
	print (s.east_conf_standings_by_day())

	print("\n\n\nwest_conf_standings_by_day\n")
	print (s.west_conf_standings_by_day())

	print("\n\n\navailable\n")
	print (s.available())

def testBoxscoreSummary(gameID):
	g = game.BoxscoreSummary(gameID)

	print ("\n\n\ngame_summary\n")
	print (g.game_summary())

	print ("\n\n\nother_stats\n")
	print (g.other_stats())

	# print ("\n\n\nofficials\n")
	# print (g.officials())

	# print ("\n\n\ngame_info\n")
	# print (g.game_info())

	print ("\n\n\nline_score\n")
	print (g.line_score())



