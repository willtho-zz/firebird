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
        cursor.execute("CREATE TABLE inventory (id INTEGER PRIMARY KEY AUTOINCREMENT, name unique, category integer, quantity integer, price real, salePrice real, description text)")
        cursor.execute("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, firstname text, lastname text, username unique, password text, email text, admin boolean)")
        cursor.execute("CREATE TABLE categories (id INTEGER PRIMARY KEY AUTOINCREMENT, category text)")
        cursor.close()
        
    def authenticate(self, username, password):
        cursor = self.connect()
        cursor.execute( "SELECT password from users where username = '{}'".format( username ) );
        tmp = cursor.fetchall()
        try:
            tmp = tmp[0][0]
            if tmp == unicode( password ):
                return True
            else:
                return False
        except:
            return False
        

    def add(self, item):
        cursor = self.connect()
        cursor.execute( "INSERT INTO inventory( name, category, quantity, price, salePrice, description) VALUES ('{}', {}, {}, {}, {}, '{}')".format( item['name'], item['category'], item['quantity'], item['price'], item['salePrice'], item['description'] ) )
        cursor.close()
        self.conn.commit()
        
    def remove(self, uid):
        cursor = self.connect()
        cursor.execute( "DELETE FROM inventory WHERE id = {}".format( uid ) )
        cursor.close()
        self.conn.commit()

    def edit(self, item):
        cursor = self.connect()
        cursor.execute( "UPDATE inventory SET name = '{}', category = {}, quantity = {}, price = {}, salePrice = {}, description = '{}' WHERE id = {}".format( item['name'], item['category'], item['quantity'], item['price'], item['salePrice'], item['description'], item['uid'] ) )
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
            tmp = tmp[0]
            return {"id": tmp[0], "name": tmp[1], "category": tmp[2], "quantity":tmp[3], "price": tmp[4], "salePrice": tmp[5], "description": tmp[6]}


    def get_items(self, category=None):
        cursor = self.connect()
        tmp = None
        if category == None:
            tmp = cursor.execute( "SELECT * FROM inventory" )
        else:
            tmp = cursor.execute( "SELECT * FROM inventory where category = {}".format( category ) )
        tmp = tmp.fetchall()
        cursor.close()
        tmp = [{"id": x[0], "name": x[1], "category": x[2], "quantity":x[3], "price": x[4], "salePrice": x[5], "description": x[6]} for x in tmp]
        return tmp

    def get_categories(self):
        """Return dictionary of category uid and name"""
        cursor = self.connect()
        res = list()
        tmp = cursor.execute( "SELECT * from categories" )
        tmp = tmp.fetchall()
        for x in tmp:
            res.append( {"id": x[0], "name": x[1]} )
        cursor.close()
        return res

    def add_category(self, category):
        """add a new category"""
        cursor = self.connect()
        cursor.execute( "INSERT INTO categories(name) VALUES ('{}')".format( category ))
        cursor.close()
        self.conn.commit()

