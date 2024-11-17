'''
Module Name: db.py

Module Description: Module to store planetary values in mySQL and retrieve the values
'''

import mysql.connector as sql

# Attempts to connect to mySQL database thrice
for i in range(3):
    try:
        con = sql.connect(host = 'localhost', 
                        user = 'root', 
                        db = 'planets',
                        password = 'root')
        if con.is_connected:
            break
    except:
        continue

cursor = con.cursor()

# To insert values into table
def add_values():
    cursor.execute('create table planet( \
                        name varchar(10), \
                        semimajor float, \
                        eccentricity float, \
                        orbitalperiod float, \
                        mass float, \
                        colour varchar(30)) \
                    ')

    con.commit()

    cursor.execute('insert into planet values \
                (\'Mercury\', 0.387, 0.205, 0.241, 0.166014, \'Gold\'), \
                (\'Venus\', 0.723, 0.007, 0.615, 2.08106272, \'Coral\'), \
                (\'Earth\', 1, 0.017, 1, 3.003486962, \'Cyan\'), \
                (\'Mars\', 1.524, 0.094, 1.88, 0.3232371722, \'Crimson\'), \
                (\'Jupiter\', 5.203, 0.049, 11.9, 954.7919, \'orange\'), \
                (\'Saturn\', 9.58, 0.057, 29.5, 285.885670, \'Khaki\'), \
                (\'Uranus\', 19.20, 0.046, 84, 43.66244, \'Turquoise\'), \
                (\'Neptune\', 30.06, 0.011, 164.8, 51.51384, \'RoyalBlue\') \
                ')

    con.commit()
#add_values()

# To retrieve specific planet information from database
def retrieve(name) -> list:
    for i in range(3):
        try:
            con = sql.connect(host = 'localhost', 
                            user = 'root', 
                            db = 'planets',
                            password = 'root')
            if con.is_connected:
                break
        except:
            continue

    cursor = con.cursor()
    cursor.execute('select * from planet')

    planetinfo = dict()

    for i in cursor:
        planetinfo['name'] = i[0].lower()

        if planetinfo['name'].lower() == name.lower():
            planetinfo['semimajor'] = i[1]
            planetinfo['eccentricity'] = i[2]
            planetinfo['orbitalperiod'] = i[3]
            planetinfo['mass'] = i[4]
            planetinfo['color'] = i[5]
            break

    return planetinfo
#retrieve("Earth")