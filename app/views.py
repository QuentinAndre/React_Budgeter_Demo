from app import app, db
from flask import request, redirect, url_for, render_template, make_response, jsonify
from flask_login import login_user, login_required, current_user, logout_user
from .models import Response
import json
import sys
from flask_cors import cross_origin
from .data import prepare_data
import time
import uuid

@app.route('/start', methods=["GET"])
@app.route('/', methods=["GET"])
def home():
    turkid = uuid.uuid4()
    condid = request.args.get("condid")
    if condid == "0":
        fundtype = "Food Card"
    elif condid == "1":
        fundtype = "Special Card"
    else:
        fundtype = "Debit Card"
    endurl = "http://react-budgeter-demo.herokuapp.com/logout"
    user = Response(turkid, fundtype, endurl)
    login_user(user, remember=True)
    db.session.add(user)
    db.session.commit()
    return redirect(url_for('game'))


@app.route('/game', methods=["GET"])
@login_required
def game():
    user = current_user
    return render_template("index.html", participantId=user.turkid, fundName=user.fundtype)



@app.route('/game/fetch_init_data/', methods=['GET', 'POST'])
@cross_origin()
def return_init_data():
    req_data = request.get_json()
    print(req_data, file=sys.stderr)
    data = prepare_data(1, req_data["participantId"], req_data["fundName"], 0, 0)
    return json.dumps(data)

@app.route('/game/save_data/', methods=['POST'])
@cross_origin()
def save_data():
    time.sleep(0.5)
    payload = request.get_json()
    print(payload, file=sys.stderr)
    user = Response.query.filter_by(turkid=payload["turkid"]).first()
    print(user, file=sys.stderr)
    data = prepare_data(payload["weekNumber"] + 1, payload["turkid"], payload["fundName"],
                        payload["fundBalance"], payload["cardBalance"])
    print(data, file=sys.stderr)
    user.store_week_info(payload)
    db.session.commit()
    return make_response(jsonify(data), 200)
    return make_response(jsonify({'error': 'Could not save data.'}), 500)



@app.route("/login")
def login():
    return render_template("login.html")


@app.route("/logout")
def logout():
    logout_user()
    return render_template("login.html")
