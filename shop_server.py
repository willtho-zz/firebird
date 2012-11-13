from flask import Flask, url_for, redirect, jsonify, request
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

@app.route("/api/categories", methods=['GET', 'POST'])
def get_categories():
    """Return a list of categories"""
    if request.method == 'GET':
        return '[' + ','.join([jsonify(x).data for x in db.get_categories()]) + ']'
    elif request.method == 'POST':
        pass

@app.route("/api/inventory/<uid>", methods=['GET', 'PUT', 'DELETE'])
@app.route("/api/inventory", methods=['GET', 'POST'])
def get_items(uid=None): 
    """Return a list of items"""
    if uid == None: 
        return '[' + ','.join([jsonify(x).data for x in db.get_items()]) + ']'
    else:
        if request.method == 'DELETE':
            db.remove( uid )
        elif request.method == 'PUT':
            pass
        elif request.method == 'GET':
            return jsonify( db.get_item( uid ) )
        else:
            pass

@app.route("/")
def index():
    """return a redirect to the index.html page"""
    return redirect( url_for( "static", filename="index.html" ) )

if __name__ == '__main__':
    app.debug = True
    app.run(host="0.0.0.0")
