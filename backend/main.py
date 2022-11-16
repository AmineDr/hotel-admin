import os
import time

from flask import Flask, request, session
from flask_cors import cross_origin
from flask_mail import Mail, Message

from models import db, Admin, Reservation, ChamberReserved, gen_id_reservation
from serializers import *

from datetime import datetime, timedelta
from ast import literal_eval
from hashlib import sha1
import json

config = {}
with open('./data/config.json', 'r') as f:
    try:
        config = literal_eval(f.read())
    except EOFError:
        config = {}

database_pass = os.environ.get('database_pass') if os.environ.get('database_pass') else "toor"
secret_key = os.environ.get('secret_key') if os.environ.get('secret_key') else "secret"

app = Flask(__name__)

# Config
# # CORS
app.config['CORS_HEADERS'] = 'Content-Type'

# # DATABASE
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://root:{database_pass}@localhost/aria"
app.config['SECRET_KEY'] = secret_key

# # DEBUG
app.config['DEBUG'] = True

db.init_app(app)

app.config['SESSION_SQLALCHEMY'] = db

# MAIL SERVER
app.config["MAIL_SERVER"] = config["email_smtp"]
app.config["MAIL_PORT"] = config["email_smtp_port"]
app.config["TESTING"] = False
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USE_SSL"] = False
app.config["MAIL_DEBUG"] = False
app.config["MAIL_USERNAME"] = config["email_info"]
app.config["MAIL_PASSWORD"] = config["email_info_password"]
app.config["MAIL_DEFAULT_SENDER"] = config["email_info"]
app.config["MAIL_MAX_EMAILS"] = 5
# app.config["MAIL_SUPPRESS_SEND"] = False
app.config["MAIL_ASCII_ATTACHMENTS"] = False

# End - Config

mail = Mail(app)


def send_email(title, msg, recv):
    print(app.config.get('MAIL_SERVER'), app.config.get('MAIL_USERNAME'))
    message = Message(subject=title, body=msg, recipients=recv)
    mail.send(message)
    print("sent")


def get_last_n_days(date, n):
    return date - timedelta(days=n)


@app.route('/api/stats')
def get_stats():
    sid = session.get('SID-ROOT')
    admin = Admin.query.filter_by(ID=sid).first()
    print(sid)
    if not admin or int(admin.privileges) < 1:
        return {"status": "Forbidden"}, 403

    query_month = Reservation.date_reserved_from > get_last_n_days(datetime.utcnow(), 30)
    query_year = Reservation.date_reserved_from > get_last_n_days(datetime.utcnow(), 365)

    query_approved = Reservation.status == "approved"
    query_canceled = Reservation.status == "canceled"
    query_pending = Reservation.status == "pending"
    from random import randint
    graph = [
        {"date": "22-10", "price": randint(10000, 150000)},
        {"date": "22-11", "price": randint(10000, 150000)},
        {"date": "22-12", "price": randint(10000, 150000)},
        {"date": "23-01", "price": randint(10000, 150000)},
        {"date": "23-01", "price": randint(10000, 150000)},
        {"date": "23-02", "price": randint(10000, 150000)},
        {"date": "23-03", "price": randint(10000, 150000)},
        {"date": "23-03", "price": randint(10000, 150000)},
        {"date": "23-04", "price": randint(10000, 150000)},
        {"date": "23-05", "price": randint(10000, 150000)},
        {"date": "23-06", "price": randint(10000, 150000)},
        {"date": "23-07", "price": randint(10000, 150000)},
        {"date": "23-08", "price": randint(10000, 150000)},
        {"date": "23-09", "price": randint(10000, 150000)},
    ]
    bar = [
        {"date": "22-10", "approved": randint(10000, 150000), "canceled": randint(10000, 150000)},
        {"date": "22-11", "approved": randint(10000, 150000), "canceled": randint(10000, 150000)},
        {"date": "22-12", "approved": randint(10000, 150000), "canceled": randint(10000, 150000)},
        {"date": "23-01", "approved": randint(10000, 150000), "canceled": randint(10000, 150000)},
        {"date": "23-01", "approved": randint(10000, 150000), "canceled": randint(10000, 150000)},
        {"date": "23-02", "approved": randint(10000, 150000), "canceled": randint(10000, 150000)},
        {"date": "23-03", "approved": randint(10000, 150000), "canceled": randint(10000, 150000)},
        {"date": "23-03", "approved": randint(10000, 150000), "canceled": randint(10000, 150000)},
        {"date": "23-04", "approved": randint(10000, 150000), "canceled": randint(10000, 150000)},
        {"date": "23-05", "approved": randint(10000, 150000), "canceled": randint(10000, 150000)},
        {"date": "23-06", "approved": randint(10000, 150000), "canceled": randint(10000, 150000)},
        {"date": "23-07", "approved": randint(10000, 150000), "canceled": randint(10000, 150000)},
        {"date": "23-08", "approved": randint(10000, 150000), "canceled": randint(10000, 150000)},
        {"date": "23-09", "approved": randint(10000, 150000), "canceled": randint(10000, 150000)},
    ]
    # g = []
    # for x in Reservation.query.filter(Reservation.date_created > get_last_n_days(datetime.utcnow(), 365), Reservation.status == "approved").order_by(Reservation.date_created).all():
    #     date = f'{str(x.date_created.year)[2:]}-{"0" if len(str(x.date_created.month)) < 2 else ""}{x.date_created.month}'
    #     g.append({
    #         "date": date,
    #         "price": x.total
    #     })
    #     print(date, x.total)

    return {"status": "success", "results": {
        "reservations":
            {
                "count_month": Reservation.query.filter(query_month).count(),
                "count_year": Reservation.query.filter(query_year).count(),
                "approved": {
                    "count_month": Reservation.query.filter(query_approved, query_month).count(),
                    "count_year": Reservation.query.filter(query_approved, query_year).count(),
                    "count_all": Reservation.query.filter(query_approved).count(),
                    "revenue_month": int(Reservation.query.filter(query_approved, query_month).with_entities(db.func.sum(Reservation.total)).scalar()),
                    "revenue_year": int(Reservation.query.filter(query_approved, query_year).with_entities(db.func.sum(Reservation.total)).scalar())
                },
                "canceled": {
                    "count_month": Reservation.query.filter(query_canceled, query_month).count(),
                    "count_year": Reservation.query.filter(query_canceled, query_year).count()
                },
                "pending": {
                    "count_month": Reservation.query.filter(query_pending, query_month).count(),
                    "count_year": Reservation.query.filter(query_pending, query_year).count()
                }
            },
        "graph": graph,
        "bar": bar
        },
    }


@app.route('/api/root_login', methods=["POST"])
def root_login():
    data = json.loads(request.data.decode())
    if data and data.get('uname') and data.get('pword'):
        uname = data.get('uname')
        pword = data.get('pword')

        admin = Admin.query.filter_by(username=uname, password=sha1(pword.encode()).hexdigest()).first()
        if not admin:
            return {"status": "Invalid"}, 401
        session["SID-ROOT"] = str(admin.ID)
        return {"status": "success", "username": str(admin.username), "perms": admin.privileges}
    return {"status": "BadData"}, 400


@app.route('/api/disconnect')
def disconnect():
    session["SID-ROOT"] = ""
    return {"status": "disconnected"}


@app.route('/api/root_check_session')
def root_check_session():
    sid = session.get('SID-ROOT')
    admin = Admin.query.filter_by(ID=sid).first()
    if sid and admin:
        return {"status": "ValidSession", "username": admin.username, "perms": admin.privileges}
    return {"status": "InvalidSession"}, 401


@app.route('/api/root_admin', methods=["GET", "POST", "PATCH"])
def root_admin_function():
    sid = session.get('SID-ROOT')
    admin = Admin.query.filter_by(ID=sid).first()
    if not sid and not admin and admin.privileges > 0:
        return {"status": "InvalidSession"}, 401

    if request.method == "GET":
        query = request.args.get("query")
        if query == "all":
            admins = Admin.query.all()
            results = []
            for x in admins:
                results.append(get_admin(x))

            return {"status": "success", "results": results}
        return {"status": "BadData"}, 400
    elif request.method == "POST":
        data = json.loads(request.data.decode())
        if data:
            uname = data.get('uname')
            pword = data.get('pword')
            privileges = data.get('privileges')

            if uname and pword and privileges:
                try:
                    new_admin = Admin(username=uname, password=sha1(pword.encode()).hexdigest(), privileges=int(privileges))
                except ValueError:
                    return {"status": "IntegerExpected"}, 400

                db.session.add(new_admin)
                db.session.commit()
                return {"status": "success"}

        return {"status": "BadData"}, 400
    elif request.method == "PATCH":
        sid = session.get('SID-ROOT')
        admin = Admin.query.filter_by(ID=sid).first()
        if not admin:
            return {"status": "Forbidden"}, 403
        data = json.loads(request.data.decode())
        query = request.args.get('query')
        if query == "change_password":
            new = data.get('new')
            old = data.get('old')
            if new and old:
                print(admin.password, sha1(old.encode()).hexdigest())
                if admin.password == sha1(old.encode()).hexdigest():
                    admin.password = sha1(new.encode()).hexdigest()
                    db.session.commit()
                    return {"status": "success"}
                return {"status": "Incorrect"}, 401
        return {"status": "BadData"}, 400
    return {"status": "BadRequest"}, 405


@app.route('/api/reservation', methods=["GET", "POST", "PATCH"])
@cross_origin()
def reservation_function():
    if request.method == "POST":
        try:
            data = json.loads(request.data.decode())

        except json.decoder.JSONDecodeError:
            data = literal_eval(request.data.decode())
        sups = Supplement.query.all()
        if data:
            if not data.get('name') and not data.get('phone') and not data.get("startdate") and not data.get("enddate") and not data.get("chambers"):
                return {"status": "MissingData"}, 400
            st_date = datetime.strptime(data.get("startdate"), "%Y-%m-%d")
            end_date = datetime.strptime(data.get("enddate"), "%Y-%m-%d")
            days = (end_date - st_date).days

            if days <= 0:
                return {'status': "BadDates"}, 400

            reservation = Reservation(ID=gen_id_reservation(),
                                      date_reserved_from=st_date,
                                      date_reserved_to=end_date,
                                      days=days,
                                      name=data.get('name'),
                                      phone=data.get('phone'),
                                      email=data.get('email'),
                                      board=data.get('board'))

            db.session.add(reservation)

            t = 0
            for x in data.get("chambers"):
                c = Chamber.query.filter_by(ID=x.get('chamber_id')).first()
                try:
                    board = int(data.get('board'))
                except ValueError:
                    return {"status": "IntegerExpected"}, 400
                if not board:
                    t += c.price
                    if x.get('extra_beds'):
                        for y in sups:
                            if y.ID == '1':
                                t += y.price * int(x.get('extra_beds'))
                elif board == 1:
                    t += c.price_half_board
                    if data.get('extra_beds'):
                        for y in sups:
                            if y.ID == '3':
                                t += y.price * int(data.get('extra_beds'))
                elif board == 2:
                    t += c.price_full_board
                    if x.get('extra_beds'):
                        for y in sups:
                            if y.ID == '4':
                                t += y.price * int(x.get('extra_beds'))

                try:
                    sea_view = int(x.get('view')) if x.get('view') else 0
                    wedding_decoration = int(x.get('wedding')) if x.get('wedding') else 0
                except TypeError:
                    return {"status": "IntegerExpected"}, 400

                for y in sups:
                    if sea_view and y.ID == '6':
                        t += y.price
                    elif wedding_decoration and y.ID == '5':
                        t += y.price

                if not c:
                    continue
                cr = ChamberReserved(chamber_id=c.ID, reservation_id=reservation.ID, wedding_decoration=x.get('wedding'), sea_view=x.get('view'), extra_beds=x.get('extra_beds'), baby_beds=x.get('baby_beds'))
                db.session.add(cr)

            reservation.total = t * days
            db.session.commit()

            return {"status": "success", "results": reservation.ID, "info": "reserved"}
    elif request.method == "GET":
        query = request.args.get('query')
        if query == "all":
            results = []
            for x in Reservation.query.all():
                results.append(get_reservation_serializer(x))

            return {"status": "success", "results": results}
        elif query == "search":
            q = request.args.get('q')
            page = int(request.args.get('page')) if request.args.get('page') else 1
            status = request.args.get("status")
            if not status or status == 'all':
                status = Reservation.status.like(f'%%')
            else:
                status = Reservation.status == status
            results = []

            if not q:
                for x in Reservation.query.filter(status).all():
                    results.append(get_reservation_serializer(x))
            else:
                by = request.args.get('by')
                if by == "ID":
                    for x in Reservation.query.filter(Reservation.ID.like(f'%{q}%'), status).all():
                        results.append(get_reservation_serializer(x))
                elif by == "name":
                    for x in Reservation.query.filter(Reservation.name.like(f'%{q}%'), status).all():
                        results.append(get_reservation_serializer(x))
                elif by == "phone":
                    for x in Reservation.query.filter(Reservation.phone.like(f'%{q}%'), status).all():
                        results.append(get_reservation_serializer(x))
                if not len(results):
                    return {"status": "NotFound"}, 404

            count = len(results)
            if not page:
                page = 1
            if page:
                results = results[(page-1)*20:page*20]

            return {"status": "success", "results": results, "count": count}
        elif query == "ID":
            ID = request.args.get('ID')
            reservation = Reservation.query.filter_by(ID=ID).first()
            if reservation:
                reservation = get_reservation_serializer(reservation)
                return {"status": "success", "info": reservation}
            return {"status": "NotFound"}, 404
        return {"status": "BadData"}, 400
    elif request.method == "PATCH":
        data = json.loads(request.data.decode())
        if data:
            ID = data.get('id')
            feature = data.get('feature')
            load = data.get('load')

            if ID:
                reservation = Reservation.query.filter_by(ID=ID).first()
                if feature == "status":
                    if load == "confirm":
                        reservation.status = "approved"
                    elif load == "cancel":
                        reservation.status = "canceled"
                    if load:
                        db.session.commit()
                        return {'status': "success", "info": load}

        return {"status": "BadData"}, 403
    return {"status": "BadRequest"}, 405


@app.route('/api/chamber', methods=["GET", "POST", "DELETE", "PATCH"])
@cross_origin()
def chamber_function():
    if request.method == "GET":
        query = request.args.get("query")
        if query:
            if query == "all":
                result = []
                for x in Chamber.query.all():
                    result.append(get_chamber_serializer(x))
                if result:
                    return {"status": "success", "results": result}
                return {"status": "NotFound"}, 404
            elif query == "id":
                load = request.args.get("load")
                if not load:
                    return {"status": "NoIdGiven"}, 400
                chamber = Chamber.query.filter_by(ID=load).first()
                if chamber:
                    return {"status": "success", "chamber": get_chamber_serializer(chamber)}
                return {"status": "NotFound"}, 404
            elif query == "ids":
                load = request.args.get("load")
                if load:
                    load = load.split('|')
                    results = []
                    for x in load:
                        chamber = Chamber.query.filter_by(ID=x).first()
                        if not chamber:
                            continue
                        if not get_chamber_serializer(chamber) in results:
                            results.append(get_chamber_serializer(chamber))
                    if results:
                        return {"status": "success", "results": results}
                    return {"status": "NotFound"}, 404
        return {"status": "BadData"}, 400
    elif request.method == "POST":
        data = json.loads(request.data.decode())
        name = data.get("name")
        price = data.get("price")
        max_beds = data.get("max_beds")
        if data and name and price and max_beds:
            try:
                price = int(price)
                max_beds = int(max_beds)
            except ValueError:
                return {"status": "IntegerExpected"}, 400
            chamber = Chamber(name=name, price=price, max_beds=max_beds)
            db.session.add(chamber)
            db.session.commit()
            return {"status": "success", "info": "ChamberAdded"}
        return {"status": "BadData"}, 400
    elif request.method == "DELETE":
        data = json.loads(request.data.decode())
        if data and data.get("id"):
            ID = data.get("id")
            chamber = Chamber.query.filter_by(ID=ID).first()
            if not chamber:
                return {"status": "NotFound"}, 404

            cr = ChamberReserved.query.filter_by(chamber_id=ID).all()
            for x in cr:
                db.session.delete(x)
            db.session.commit()

            db.session.delete(chamber)
            db.session.commit()

            return {"status": "success", "info": "Deleted"}
        return {"status": "BadData"}, 400
    elif request.method == "PATCH":
        data = json.loads(request.data.decode())
        if data and data.get("id"):
            ID = data.get("id")
            chamber = Chamber.query.filter_by(ID=ID).first()
            if not chamber:
                return {"status": "NotFound"}, 404
            feature = data.get("feature")
            load = data.get("load")
            if feature and load:
                if feature == "name":
                    chamber.name = load
                elif feature == "price_b":
                    try:
                        chamber.price = int(load)
                    except ValueError:
                        return {"status": "IntegerExpected"}, 400
                elif feature == "price_dp":
                    try:
                        chamber.price_half_board = int(load)
                    except ValueError:
                        return {"status": "IntegerExpected"}, 400
                elif feature == "price_pc":
                    try:
                        chamber.price_full_board = int(load)
                    except ValueError:
                        return {"status": "IntegerExpected"}, 400
                elif feature == "max_beds":
                    try:
                        chamber.max_beds = int(load)
                    except ValueError:
                        return {"status": "IntegerExpected"}, 400
                elif feature == "availability":
                    chamber.availability = int(load)
                db.session.commit()
                return {"status": "success", "info": feature}
        return {"status": "BadData"}, 400
    return {"status": "BadRequest"}, 405


@app.route('/api/supplement', methods=["GET", "POST", "DELETE", "PATCH"])
def supplement_function():
    if request.method == "GET":
        query = request.args.get('query')
        if query:
            if query == "all":
                result = []
                for x in Supplement.query.all():
                    result.append(get_supplement_serializer(x))
                if not result:
                    return {"status": "NotFound"}, 404
                return {"status": "success", "results": result}
            elif query == "ids":
                load = request.args.get('load')
                if load:
                    load = load.split('|')
                    results = []
                    for x in load:
                        s = Supplement.query.filter_by(ID=x).first()
                        if not s:
                            continue
                        ss = get_supplement_serializer(s)
                        if ss not in results:
                            results.append(ss)
                    if not results:
                        return {"status": "NotFound"}, 404
                    return {"status": "success", "results": results}
            elif query == "id":
                if request.args.get('load'):
                    supplement = Supplement.query.filter_by(ID=request.args.get('load')).first()
                    if not supplement:
                        return {"status": "NotFound"}, 404
                    return {"status": "success", "result": get_supplement_serializer(supplement)}
        return {"status": "BadData"}, 400
    elif request.method == "POST":
        data = json.loads(request.data.decode())
        if data and data.get('name') and data.get('price'):
            name = data.get('name')
            price = data.get('price')
            try:
                price = int(price)
            except ValueError:
                return {"status": "IntegerExpected"}, 400

            supplement = Supplement(name=name, price=price)
            db.session.add(supplement)
            db.session.commit()
            return {"status": "success", "info": "SupplementAdded"}
        return {"status": "BadData"}, 400
    elif request.method == "DELETE":
        data = json.loads(request.data.decode())
        if data and data.get("id"):
            ID = data.get('id')
            supplement = Supplement.query.filter_by(ID=ID).first()
            if not supplement:
                return {"status": "NotFound"}, 404

            db.session.commit()
            db.session.delete(supplement)
            db.session.commit()
            return {"status": "success", "info": "Deleted"}
        return {"status": "BadData"}, 400
    elif request.method == "PATCH":
        data = json.loads(request.data.decode())
        if data:
            ID = data.get('ID')
            feature = data.get('feature')
            load = data.get('load')
            if ID and feature and load:
                supplement = Supplement.query.filter_by(ID=ID).first()
                if feature == "name":
                    supplement.name = load
                elif feature == "price":
                    try:
                        load = int(load)
                    except ValueError:
                        return {"status": "IntegerExpected"}, 400
                    supplement.price = load
                db.session.commit()
                return {"status": "success", "changed": feature, "load": load}
        return {"status": "BadData"}, 400
    return {"status": "BadRequest"}, 405


@app.route('/api/gallery')
def gallery_function():
    data = request.args
    if data.get('query'):
        query = data.get('query')
        if query == "all":
            results = []
            for x in os.listdir('./static/images/gallery/'):
                print(x.split('.')[0].find('_placeholder'))
                if len(x.split('.')) > 1:
                    continue
                ims = os.listdir(f'./static/images/gallery/{x}')
                for i in ims:
                    if i.find('_placeholder') != -1:
                        ims.remove(i)
                g = {
                    "name": x,
                    "content": ims
                }
                results.append(g)
            return {"status": "success", "results": results}
    return {"status": "BadData"}, 403


@app.route('/api/ping')
@cross_origin()
def home():
    return {"status": "pong"}


if __name__ == '__main__':
    # with app.app_context():
    #     db.create_all()
    # with app.app_context():
    #     send_email("Title", "Content", ["drouamine@gmail.com"])
    app.run(host='192.168.1.10')
