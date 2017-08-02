from app import db, login_manager
from datetime import datetime
from sqlalchemy.dialects.postgresql import ARRAY, JSON, JSONB
import sys

class Response(db.Model):
    __tablename__ = "responses"
    turkid = db.Column('turkid', db.String(20), unique=True, index=True, primary_key=True)
    fundtype = db.Column('fundtype', db.String(20))
    endurl = db.Column('endurl', db.String(100))
    startdate = db.Column('startdate', db.DateTime)
    enddate = db.Column('enddate', db.DateTime)
    weeknumber = db.Column('weeknumber', db.Integer())


    grocery_total = db.Column('grocery_total', ARRAY(db.Float()))
    misc_total = db.Column('misc_total', ARRAY(db.Float()))
    card_balance = db.Column('card_balance', ARRAY(db.Float()))
    fund_balance = db.Column('fund_balance', ARRAY(db.Float()))

    budgetlines_week1 = db.Column('budgetlines_week1', JSON)
    budgetlines_week2 = db.Column('budgetlines_week2', JSON)
    budgetlines_week3 = db.Column('budgetlines_week3', JSON)
    budgetlines_week4 = db.Column('budgetlines_week4', JSON)
    budgetlines_week5 = db.Column('budgetlines_week5', JSON)
    budgetlines_week6 = db.Column('budgetlines_week6', JSON)
    budgetlines_week7 = db.Column('budgetlines_week7', JSON)
    budgetlines_week8 = db.Column('budgetlines_week8', JSON)

    mealchoices_week1 = db.Column('mealchoices_week1', ARRAY(db.Float()))
    mealchoices_week2 = db.Column('mealchoices_week2', ARRAY(db.Float()))
    mealchoices_week3 = db.Column('mealchoices_week3', ARRAY(db.Float()))
    mealchoices_week4 = db.Column('mealchoices_week4', ARRAY(db.Float()))
    mealchoices_week5 = db.Column('mealchoices_week5', ARRAY(db.Float()))
    mealchoices_week6 = db.Column('mealchoices_week6', ARRAY(db.Float()))
    mealchoices_week7 = db.Column('mealchoices_week7', ARRAY(db.Float()))
    mealchoices_week8 = db.Column('mealchoices_week8', ARRAY(db.Float()))



    def __init__(self, turkid, fundtype, endurl):
        self.turkid = turkid
        self.fundtype = fundtype
        self.endurl = endurl
        self.startdate = datetime.utcnow()
        self.enddate = datetime.utcnow()
        self.weeknumber = 0


        self.grocery_total = []
        self.misc_total = []
        self.card_balance = []
        self.fund_balance = []
        self.budgetlines_week1 = []
        self.budgetlines_week2 = []
        self.budgetlines_week3 = []
        self.budgetlines_week4 = []
        self.budgetlines_week5 = []
        self.budgetlines_week6 = []
        self.budgetlines_week7 = []
        self.budgetlines_week8 = []

        self.mealchoices_week1 = []
        self.mealchoices_week2 = []
        self.mealchoices_week3 = []
        self.mealchoices_week4 = []
        self.mealchoices_week5 = []
        self.mealchoices_week6 = []
        self.mealchoices_week7 = []
        self.mealchoices_week8 = []

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def format_budget_lines(self, lines):
        json = {'status':[],
                'title':[],
                'category':[],
                'type':[],
                'account':[],
                'fromCard':[],
                'fromFund':[]
                }
        for l in lines:
            for key, value in l.items():
                if key in json:
                    json[key].append(value)
                else:
                    pass
        return json

    def get_totals(self, lines):
        misc = 0
        grocery = 0
        for l in lines:
            if l["category"] == 'misc':
                misc += l["fromCard"]
                misc += l["fromFund"]
            elif l["category"] == "grocery":
                grocery += l["fromCard"]
                grocery += l["fromFund"]
        return misc, grocery


    def store_week_info(self, payload):
        budgetlines = self.format_budget_lines(payload["budgetLines"])
        grocery_choices = payload["groceryChoices"]
        misc, grocery = self.get_totals(payload["budgetLines"])
        week_number = payload["weekNumber"]

        misc_total = self.misc_total.copy()
        grocery_total = self.grocery_total.copy()
        card_balance = self.card_balance.copy()
        fund_balance = self.fund_balance.copy()

        card_balance.append(payload["cardBalance"])
        fund_balance.append(payload["fundBalance"])
        grocery_total.append(grocery)
        misc_total.append(misc)

        setattr(self, "budgetlines_week{}".format(week_number), budgetlines)
        setattr(self, "mealchoices_week{}".format(week_number), grocery_choices)
        self.card_balance = card_balance
        self.fund_balance = fund_balance
        self.grocery_total = grocery_total
        self.misc_total = misc_total
        self.weeknumber = week_number
        self.enddate = datetime.utcnow()



    def get_id(self):
        return self.turkid

    def __repr__(self):
        print(self.turkid, file=sys.stderr)
        print(self.fundtype, file=sys.stderr)
        print(self.card_balance, file=sys.stderr)
        print(self.fund_balance, file=sys.stderr)
        print(self.grocery_total, file=sys.stderr)
        print(self.misc_total, file=sys.stderr)
        print(self.budgetlines_week1, file=sys.stderr)
        return ""

@login_manager.user_loader
def load_user(user_id):
    return Response.query.get(user_id)
