"""
Setup script for shop_server
"""

import ConfigParser
import db_driver


def main():
    
    #get firstname
    firstname = raw_input( "Enter firstname: " )

    #get lastname
    lastname = raw_input( "Enter lastname: " )

    #get username
    username = raw_input( "Enter username: " )

    #get password
    password = raw_input( "Enter password: " )

    #get email
    email = raw_input( "Enter email: " )
    email.replace( '@', '\@' )

    #get database name
    dbname = raw_input( "Enter database name: " )

    #preload items?
    preload = None
    while not((preload == "y") or (preload == "n")):
        preload = raw_input( "Preload database? (y/n): " )

    #admin account
    admin = None
    while not((admin == 'T') or (admin == 'F')):
        admin = raw_input( "Admin account? (T/F): " )
    
    if admin == 'T':
        admin = 1
    elif admin == 'F':
        admin = 0

    #setup db
    db = db_driver.database( dbname )
    db.setup()
    
    db.adduser( firstname, lastname, username, password, email, admin )

    #write to config dbname and username
    config = ConfigParser.RawConfigParser()
    config.add_section('shop')
    config.set('shop', 'username', username)
    config.set('shop', 'dbname', dbname )

    with open( 'shop.cfg', 'wb') as fh:
        config.write( fh )


    if preload == "y":
        
        with open( "loaditems.sql", "r" ) as fh:
            for line in fh:
                cur = db.connect()
                cur.execute( """ {} """.format( line ) )
                db.conn.commit()
                cur.close()
    

if __name__ == '__main__':
    main()
