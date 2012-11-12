from flask import Flask, url_for, redirect, jsonify
import db_driver
app = Flask(__name__)

db = db_driver.database('test.db')

@app.route("/favicon.ico")
def icon():
    """Return a redirect to the favicon"""
    return redirect( url_for( "static", filename="favicon.ico" ) )

@app.route("/api/categories")
def get_categories():
    """Return a list of categories"""
    return '[' + ','.join([jsonify(x).data for x in db.get_categories()]) + ']'

#@app.route("/api/inventory")
def get_items(): 
    """Return a list of items"""
    pass
    #items = db.get_items()
    #items = [item_tup_to_dict(x) for x in items]
    #return '[' + ','.join([jsonify(x).data for x in items]) + ']'

@app.route("/")
def index():
    """return a redirect to the index.html page"""
    return redirect( url_for( "static", filename="index.html" ) )

def item_tup_to_dict(item_tup):
    """convert an item tuple to a dictionary"""
    item_dict = dict()
    keys = ['id', 'name', 'category', 'quantity', 'price', 'salePrice', 'description']
    for x in range( 7 ):
        item_dict[keys[x]] = item_tup[x]
    return item_dict

if __name__ == '__main__':
    app.debug = True
    app.run(host="0.0.0.0")
