from flask import Flask, render_template, url_for, redirect
app = Flask(__name__)

@app.route("/favicon.ico")
def icon():
    return redirect( url_for( "static", filename="favicon.ico" ) )

@app.route("/")
def index():
    return render_template( "index.html" )


if __name__ == '__main__':
    app.run(host="0.0.0.0")
