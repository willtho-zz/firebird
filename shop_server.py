from flask import Flask, url_for, redirect, jsonify, request, render_template, send_from_directory, session, escape
from werkzeug import secure_filename
import db_driver
import smtplib
import os
import copy

app = Flask(__name__)

app.secret_key = os.urandom( 24 )
UPLOAD_FOLDER = 'uploaded_file'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

db = db_driver.database('shop.db')
#replace with code to make sure the schemas match
if not os.path.exists( 'shop.db' ):
    db.setup()

adminname = 'johndoe'

@app.route("/favicon.ico")
def icon():
    """Return a redirect to the favicon"""
    return redirect( url_for( "static", filename="favicon.ico" ) )

@app.route("/api/categories", methods=['GET', 'POST'])
@app.route("/api/categories/<uid>", methods=['PUT', 'DELETE', 'GET'])
def get_categories(uid=None):
    """Return a list of categories"""
    if uid != None:
        if request.method == 'GET':
            #return a category 
            return jsonify( db.get_category( uid ) ) 
        elif request.method == 'DELETE':
            #delete category
            db.del_category( uid )
        elif request.method == 'PUT':
            #update category
            db.update_category( uid, request.json['name'])
            return jsonify( db.get_category( uid ) )
    else:
        if request.method == 'GET':
            #get all categories
            return '[' + ','.join([jsonify(x).data for x in db.get_categories()]) + ']'
        elif request.method == 'POST':
            #add category
            db.add_category( request.json['name'])

    return index()

@app.route("/upload", methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        tmpfile = request.files['file']
        if tmpfile:
            filename = secure_filename( tmpfile.filename )  
            tmpfile.save( os.path.join( app.config['UPLOAD_FOLDER'], filename ) )
            return redirect( url_for( 'uploaded_file', filename=filename ) )

    return '''
        <!doctype html>
        <title>Upload new File</title>
        <h1>Upload new File</h1>
        <form action="" method=post enctype=multipart/form-data>
        <p><input type=file name=file>
        <input type=submit value=Upload>
        </form>
        '''

@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        user = request.form['username']
        password =  request.form['password']

        if db.authenticate( user, password ) == True:
            session['username'] = user
            return ('', 200)
        else:
            return ('', 401)

@app.route('/logout', methods=['POST'])
def logout():
    session.pop( 'username', None )
    return redirect( url_for( 'index' ) )

@app.route('/checklogin')
def checklogin():
    if 'username' in session:
        return True
    else:
        return False

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

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
        if request.method == 'GET':
            #get all items
            return '[' + ','.join([jsonify(x).data for x in db.get_items()]) + ']'
        elif request.method == 'POST':
            #add new item
            db.add( request.json )
            return ('', 200)
    else:
        if request.method == 'DELETE':
            #delete an item
            db.remove( uid )
            return ('', 200)
        elif request.method == 'PUT':
            #edit an item
            db.edit( uid, request.json )
            return ('', 200)
        elif request.method == 'GET':
            #get an item
            return jsonify( db.get_item( uid ) )
        

@app.route("/checkout", methods=['POST'])
def checkout():
    adminemail = db.get_email( adminname )
    
    username = request.json['email']

    print request.json

    for item in request.json['items']:
        olditem = db.get_item( item['id'] )
        newitem = copy.deepcopy( olditem )
        newitem['quantity'] = olditem['quantity'] - item['quantity']
        db.edit( newitem['id'], newitem )

    

    mailserve = smtplib.SMTP( 'localhost' )
    mailserve.set_debuglevel( 1 )
    mailserve.sendmail( adminemail, [useremail, adminemail], "From: {admin}\r\nTo: {admin}, {user}\r\nSubject: Purchase\r\n\r\n Thank you!".format( admin=adminemail, user=useremail ) )
    mailserve.quit()

    return "Success"

@app.route('/item/<uid>')
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path=None, uid=None):
    """return a redirect to the index.html page"""
    tmpitem = None
    if uid != None:
        tmpitem = jsonify( db.get_item( uid ) ).data
    return render_template('index.html', categories='[' + ','.join([jsonify(x).data for x in db.get_categories()]) + ']', item=tmpitem, logged_in=checklogin())

if __name__ == '__main__':
    app.debug = True
    app.run(host="0.0.0.0")
