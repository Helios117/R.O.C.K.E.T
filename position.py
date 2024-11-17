'''
Module Name: position.py

Module Description: Module to retrieve the positions of planets in the solar system
'''

import solarsystem
import time

t=time.gmtime() # Current time
def planet_position(yr=t[0],mth=t[1],d=t[2],hr=t[3],min=t[4]):
    # Fetch planet details
    H = solarsystem.Heliocentric(year=yr, month=mth, day=d, hour=hr, minute=min,view='rectangular')
    planets_dict=H.planets()
    pos={}
    for i in planets_dict:
        if i=='Pluto':
            break
        temp=()
        for j in range(len(planets_dict[i])-1):
            temp+=(planets_dict[i][j],)
        pos[i]=temp
    return pos
