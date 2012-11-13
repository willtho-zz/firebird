import sqlite3

class database(object):
    
    def __init__(self, dbpath):
        self.dbfile = dbpath

    def connect(self):
        self.conn = sqlite3.connect(self.dbfile)
        return self.conn.cursor()

    def disconnect(self):
        self.conn.close()

    def setup(self):
        """Setup the database"""
        cursor = self.connect()
        cursor.execute("CREATE TABLE inventory (id INTEGER PRIMARY KEY AUTOINCREMENT, name unique, category text, quantity integer, price real, salePrice real, description text)")
        cursor.execute("CREATE TABLE users (id PRIMARY KEY, firstname text, lastname text, username unique, password text, email text, admin boolean)")
        cursor.close()
        
    def authenticate(self, username, password):
        pass

    def add(self, item):
        cursor = self.connect()
        cursor.execute( "INSERT INTO inventory( name, category, quantity, price, salePrice, description) VALUES ('{}', '{}', {}, {}, {}, '{}')".format( item['name'], item['category'], item['quantity'], item['price'], item['salePrice'], item['description'] ) )
        cursor.close()
        self.conn.commit()
        
    def remove(self, uid):
        cursor = self.connect()
        cursor.execute( "DELETE FROM inventory WHERE id = {}".format( uid ) )
        cursor.close()
        self.conn.commit()

    def edit(self, item):
        cursor = self.connect()
        cursor.execute( "UPDATE inventory SET name = '{}', category = '{}', quantity = {}, price = {}, salePrice = {}, description = '{}' WHERE id = {}".format( item['name'], item['category'], item['quantity'], item['price'], item['salePrice'], item['description'], item['uid'] ) )
        cursor.close()
        self.conn.commit()

    def get_item(self, uid):
        cursor = self.connect()
        tmp = cursor.execute( "Select * from inventory where id = {}".format( uid ) )
        self.conn.commit()
        tmp = tmp.fetchall()
        cursor.close()
        if len( tmp ) == 0:
            return None
        else:
           return tmp[0]


    def get_items(self, category=None):
        cursor = self.connect()
        tmp = None
        if category == None:
            tmp = cursor.execute( "SELECT * FROM inventory" )
        else:
            tmp = cursor.execute( "SELECT * FROM inventory where category = '{}'".format( category ) )
        tmp = tmp.fetchall()
        cursor.close()
        return tmp

    def get_categories(self):
        return [{"id":1, "name": "test1"}, {"id":2, "name":"test2"}]
