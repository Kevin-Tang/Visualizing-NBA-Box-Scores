# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-12-14 16:06
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('NBAStats', '0006_game_gamedate'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='game',
            name='lineScore',
        ),
        migrations.AlterField(
            model_name='game',
            name='awayTeam',
            field=models.CharField(blank=True, default='', max_length=20),
        ),
        migrations.AlterField(
            model_name='game',
            name='homeTeam',
            field=models.CharField(blank=True, default='', max_length=20),
        ),
    ]