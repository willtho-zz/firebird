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
        pass

    def remove(self, uid):
        pass

    def edit(self, item):
        pass

    def get_item(self, uid):
        pass

    def get_items(self, category=None):
        pass

    def get_categories(self):
        return [{"id":1, "name": "test1"}, {"id":2, "name":"test2"}]
