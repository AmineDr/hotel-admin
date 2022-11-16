from models import Chamber, Supplement


def get_reservation_serializer(reservation):
    r = {
        "ID": reservation.ID,
        "name": reservation.name,
        "phone": reservation.phone,
        "email": reservation.email,
        "from": reservation.date_reserved_from,
        "to": reservation.date_reserved_to,
        "created": reservation.date_created,
        "status": reservation.status,
        "board": reservation.board,
        "total": reservation.total,
        "days": reservation.days,
        "chambers": [],
        "supplements": []
    }

    for x in reservation.chambers:
        c = Chamber.query.filter_by(ID=x.chamber_id).first()
        if reservation.board == 0:
            p = c.price
        elif reservation.board == 1:
            p = c.price_half_board
        else:
            p = c.price_full_board
        cr = {
            "name": c.name,
            "price": p,
            "extra_beds": x.extra_beds,
            "baby_beds": x.baby_beds,
            "sea_view": x.sea_view,
            "wedding_decoration": x.wedding_decoration
        }
        r["chambers"].append(cr)

    for x in Supplement.query.all():
        s = {
            "name": x.name,
            "price": x.price
        }
        r["supplements"].append(s)

    return r


def get_reservation_stats_serializer(reservation):
    pass


def get_chamber_serializer(chamber):
    return {
        "ID": chamber.ID.upper(),
        "name": chamber.name,
        "price": chamber.price,
        "image": chamber.image,
        "max_beds": chamber.max_beds,
        "availability": chamber.availability,
        "price_half_board": chamber.price_half_board,
        "price_full_board": chamber.price_full_board
    }


def get_supplement_serializer(supplement):
    return {
        "ID": supplement.ID.upper(),
        "name": supplement.name,
        "price": supplement.price,
    }


def get_admin(admin):
    return {
        "ID": admin.ID,
        "uname": admin.username,
        "privileges": admin.privileges
    }
