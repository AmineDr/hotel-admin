from flask_sqlalchemy import SQLAlchemy
from pearhash import PearsonHasher
from datetime import datetime
from random import randint
from hashlib import md5
from time import time

db = SQLAlchemy()


def gen_id_reservation():
    i = PearsonHasher(5).hash(f"{time()}-{randint(0, 100)}".encode()).hexdigest().upper()
    index = int((len(i) / 2))
    return f'ARIA-{i[index:]}-{i[:index]}'


def gen_id():
    return md5(f"{time()}{randint(0, randint(100, 1000))}".encode()).hexdigest()


class Reservation(db.Model):
    __tablename__ = "reservation"

    ID = db.Column(db.String(32), primary_key=True, unique=True, default=gen_id_reservation)
    date_reserved_from = db.Column(db.DateTime)
    date_reserved_to = db.Column(db.DateTime)
    days = db.Column(db.Integer)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(15), nullable=False)
    email = db.Column(db.String(50))
    board = db.Column(db.Integer, default=0)
    status = db.Column(db.String(10), default="pending")
    total = db.Column(db.Integer)

    chambers = db.relationship("ChamberReserved", backref="reservation")

    date_created = db.Column(db.DateTime, default=datetime.now)

    def __repr__(self):
        return f"<Reservation ID={self.ID}>"


class Chamber(db.Model):
    __tablename__ = "chamber"

    ID = db.Column(db.String(32), primary_key=True, unique=True, default=gen_id)
    name = db.Column(db.String(50), nullable=False)
    image = db.Column(db.String(250))
    max_beds = db.Column(db.Integer, default=1)
    price = db.Column(db.Integer)
    price_half_board = db.Column(db.Integer)
    price_full_board = db.Column(db.Integer)
    availability = db.Column(db.Integer, default=1)

    reserved = db.relationship("ChamberReserved", backref="chamber")

    def __repr__(self):
        return f"<Chamber name={self.name} max={self.max_beds}>"


class ChamberReserved(db.Model):
    __tablename__ = "chamber_reserved"

    ID = db.Column(db.String(32), primary_key=True, unique=True, default=gen_id)
    reservation_id = db.Column(db.String(32), db.ForeignKey("reservation.ID"))
    chamber_id = db.Column(db.String(32), db.ForeignKey("chamber.ID"))
    extra_beds = db.Column(db.Integer, default=0)
    baby_beds = db.Column(db.Integer, default=0)
    sea_view = db.Column(db.Boolean, default=False)
    wedding_decoration = db.Column(db.Boolean, default=False)


class Supplement(db.Model):
    __tablename__ = "supplement"

    ID = db.Column(db.String(32), primary_key=True, unique=True, default=gen_id)
    name = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Integer, default=2000)

    def __repr__(self):
        return f"<Supplement name={self.name} max={self.price}>"


class Admin(db.Model):
    __tablename__ = "admin"

    ID = db.Column(db.String(32), primary_key=True, unique=True, default=gen_id)
    username = db.Column(db.String(32), nullable=False)
    password = db.Column(db.String(40), nullable=False)
    privileges = db.Column(db.Integer, default=0)

    date_created = db.Column(db.DateTime, default=datetime.now)

    def __repr__(self):
        return f"<Admin username={self.username} privileges={self.privileges}>"


class Log(db.Model):
    __tablename__ = "log"

    ID = db.Column(db.String(32), primary_key=True, unique=True, default=gen_id)
    SID = db.Column(db.String(32), db.ForeignKey("admin.ID"))
    Type = db.Column(db.String(50), db.ForeignKey("log_type.name"))

    date_created = db.Column(db.DateTime, default=datetime.now)

    def __repr__(self):
        return f"<Log SID={self.SID} Type={self.Type}>"


class LogType(db.Model):
    __tablename__ = "log_type"

    name = db.Column(db.String(50), primary_key=True)
    logs = db.relationship("Log", backref="log_type")

    def __repr__(self):
        return f"<LogType Action={self.name}>"


class Newsletter(db.Model):
    __tablename__ = "newsletter"

    ID = db.Column(db.String(32), primary_key=True, unique=True, default=gen_id)
    email = db.Column(db.String(50), nullable=False)

    date_created = db.Column(db.DateTime, default=datetime.now)

