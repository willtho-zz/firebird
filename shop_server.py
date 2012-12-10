from flask import Flask, url_for, redirect, jsonify, request, render_template, send_from_directory, session, escape
from werkzeug import secure_filename
import db_driver
import smtplib
import os
import copy

app = Flask(__name__)

app.secret_key = os.urandom( 24 )
UPLOAD_FOLDER = 'static/img'
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
            try:
                if db.isAdmin( session['username'] ):
                    #delete category
                    db.del_category( uid )
            except:
                pass
        elif request.method == 'PUT':
            try:
                if db.isAdmin( session['username'] ):
                    #update category
                    db.update_category( uid, request.json['name'])
                    return jsonify( db.get_category( uid ) )
            except:
                pass
    else:
        if request.method == 'GET':
            #get all categories
            return '[' + ','.join([jsonify(x).data for x in db.get_categories()]) + ']'
        elif request.method == 'POST':
            try:
                if db.isAdmin( sessions['username'] ):
                    #add category
                    db.add_category( request.json['name'])
            except:
                pass



    return index()

@app.route("/upload/<uid>", methods=['POST'])
def upload(uid):
    if request.method == 'POST':
        try:
            if db.isAdmin( session['username'] ):
                tmpfile = request.files['file']
                if tmpfile:
                    filename = "item{}.png".format( uid )
                    tmpfile.save( os.path.join( app.config['UPLOAD_FOLDER'], filename ) )
                    return redirect( url_for( 'uploaded_file', filename=filename ) )
        except:
            pass

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

@app.route("/css/<folder>/<name>")
@app.route("/css/<name>")
def css(name, folder=None):
    if folder != None:
        return redirect( url_for( "static", filename='css/{}/{}'.format( folder, name ) ) )
    else:
        return redirect( url_for( "static", filename='css/{}'.format( name ) ) )

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
            try:
                if db.isAdmin( session['username'] ):
                    #add new item
                    db.add( request.json )
                    return ('', 200)
            except:
                pass
    else:
        if (request.method == 'DELETE'):
            try:
                if db.isAdmin( session['username'] ):
                    #delete an item
                    db.remove( uid )
                    return ('', 200)
            except:
                pass

        elif request.method == 'PUT':
            try:
                if db.isAdmin( session['username'] ):
                    #edit an item
                    db.edit( uid, request.json )
                    return ('', 200)
            except:
                pass

        elif request.method == 'GET':
            #get an item
            return jsonify( db.get_item( uid ) )
        

@app.route("/checkout", methods=['POST'])
def checkout():
    adminemail = db.get_email( adminname )
    
    username = request.json['email']


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
