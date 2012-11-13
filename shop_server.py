from flask import Flask, url_for, redirect, jsonify
import db_driver
import os
app = Flask(__name__)


db = db_driver.database('test.db')
#replace with code to make sure the schemas match
if not os.path.exists( 'test.db' ):
    db.setup()
    
@app.route("/favicon.ico")
def icon():
    """Return a redirect to the favicon"""
    return redirect( url_for( "static", filename="favicon.ico" ) )

@app.route("/api/categories")
def get_categories():
    """Return a list of categories"""
    return '[' + ','.join([jsonify(x).data for x in db.get_categories()]) + ']'

@app.route("/api/inventory")
def get_items(): 
    """Return a list of items"""
    return '[' + ','.join([jsonify(x).data for x in db.get_items()]) + ']'

@app.route("/")
def index():
    """return a redirect to the index.html page"""
    return redirect( url_for( "static", filename="index.html" ) )

if __name__ == '__main__':
    app.debug = True
    app.run(host="0.0.0.0")
