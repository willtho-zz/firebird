from flask import Flask, url_for, redirect, jsonify, request, render_template
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

@app.route("/css/<name>")
def css(name):
    return redirect( url_for( "static", filename='css/{}'.format(name ) ) )

@app.route("/js/<name>")
@app.route("/js/<folder>/<name>")
def js(name, folder=None):
    if folder != None:
        return redirect( url_for( "static", filename='js/{}/{}'.format( folder, name ) ) )
    else:
        return redirect( url_for( "static", filename='js/{}'.format( name ) )  )

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
    #return redirect( url_for( "static", filename="index.html" ) )
    return render_template('index.html', categories='[' + ','.join([jsonify(x).data for x in db.get_categories()]) + ']')

if __name__ == '__main__':
    app.debug = True
    app.run(host="0.0.0.0")
