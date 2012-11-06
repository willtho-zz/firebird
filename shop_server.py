from flask import Flask, url_for, redirect
app = Flask(__name__)

@app.route("/favicon.ico")
def icon():
    return redirect( url_for( "static", filename="favicon.ico" ) )

@app.route("/")
def index():
    return redirect( url_for( "static", filename="index.html" ) )


if __name__ == '__main__':
    app.run(host="0.0.0.0")
