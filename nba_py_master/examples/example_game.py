from __future__ import print_function
from nba_py import game


# pbp = game.PlayByPlay('0041400122')
# print pbp.info()
box = game.Boxscore('0041400122')
#print(box.team_stats())
#bss = game.BoxscoreScoring('0041400122')
#print(bss.sql_team_scoring())
#bsu = game.BoxscoreUsage('0041400122')
#print(bsu.sql_team_usage())
#bsa = game.BoxscoreAdvanced('0041400122')
#print(bsa.sql_team_advanced())
#bsf = game.BoxscoreFourFactors('0041400122')
#print(bsf.sql_team_four_factors())
#print(box.team_starter_bench_stats())
box2 = game.BoxscoreSummary('0021600331')
print(box2.line_score())