'''
Module Name: launchDate.py

Module Description: Module to calculate earliest viable launchdate for Hohmann transfer
'''

import position
import time
import math

def calculate(theta, origin, destination):
    t=time.gmtime() # current time
    yr=t[0]
    mth=t[1]
    d=t[2]
    hr=t[3]
    min=t[4]

    a=0.001 # Setting accuracy

    while True:
        # Retrieve position of planet from package
        pos=position.planet_position(yr,mth,d,hr,min)

        # Calculate angle of origin and destination planet wrt sun
        origin_angle=math.atan2(pos[origin][1],pos[origin][0])
        dest_angle=math.atan2(pos[destination][1],pos[destination][0])

        if ((origin_angle-dest_angle) >theta-a) and ((origin_angle-dest_angle)<theta+a):
                # Returns day on which angle matchs required theta
                return str(yr)+'-'+str(mth)+'-'+str(d)+' '+str(hr)+':'+str(min)+':00'

        # Calender calculations
        if mth in [1,3,5,7,8,10,12] and d==31:
                    if d==31:
                        if mth!=12:
                            mth+=1
                            d=1
                        else:
                            mth=1
                            yr+=1
                            d=1
        elif mth==2 and yr%4==0 and yr%100!=0 and d==29:
                    if yr%4==0 and yr%100!=0:
                        if d==29:
                            mth+=1
                            d=1
        elif mth==2 and yr%400==0 and d==29:
                        if d==29:
                            mth+=1
                            d=1
        elif mth==2 and d==28:
                        if d==28:
                            mth+=1
                            d=1
        elif mth in [4,6,9,11] and d==30:
                    if d==30:
                        mth+=1
                        d=1
        else:
                    d+=1