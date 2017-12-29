import sys

# MISC DATA
MISC_TITLES = (
    {1: ['Social Activity', 'High-Tech Purchase', 'Painkillers'],
     2: ['Birthday Gift', 'Pair of Shoes', 'Barber Fees'],
     3: ['Streaming Service', 'National Park', 'New Book'],
     4: ['Yard Sale', 'Clothing Shop', 'Concert Tickets']}
)

MISC_TEXTS = (
    {1: [
        'Your friends are going to watch the latest action flick at the IMAX theater in town, then going out for drinks after. Do you join them?',
        "A tech product you've had your eyes on for a long time is sold at a 50% discount this week. Do you buy it?",
        'You wake up with a bad tooth ache, and you are out of painkillers at home. Do you go to the pharmacy to buy painkillers?'],
        2: ['Your best friend is turning 30 this week, you have have the perfect gift idea for him. Do you buy it?',
            'You stumble upon a very nice pair of leather shoes, which would be perfect for the fall and winter. Do you buy them?',
            'It has been a while since you last had a haircut, and a nice barbershop has opened near your house. Do you try it?'],
        3: [
            'A video streaming website is offering a one-time deal: -50% on its yearly subscription. Do you accept the deal?',
            'You are considering going on a hike to a National Park this week-end, but you need to pay for the entrance and camping fees. Do you go?',
            'Your favorite author just released a new book. Do you buy a copy of it?'],
        4: [
            'Your neighbors are doing a yard sale, and you spot a nice wooden desk at a very attractive price. Do you buy it?',
            'You have not purchased new clothes in a while, and you just happen to have a date this week. Would you use the occasion to buy a nice shirt and a pair of pants?',
            'A musician that you like a lot is touring in town next month. Do you buy tickets to the show?'
        ]
    }
)

MISC_VALUES = (
    {
        1: [35, 120, 20],
        2: [40, 100, 30],
        3: [60, 45, 15],
        4: [60, 100, 30]
    }
)

MISC_SELECTORS = (
    {
        1: [{'type': 'binary'}, {'type': 'binary'}, {'type': 'binary'}],
        2: [{'type': 'binary'}, {'type': 'binary'}, {'type': 'binary'}],
        3: [{'type': 'binary'}, {'type': 'binary'}, {'type': 'binary'}],
        4: [{'type': 'binary'}, {'type': 'binary'}, {'type': 'binary'}]
    }
)


def get_misc_items(weekNumber):
    titles = MISC_TITLES[weekNumber]
    texts = MISC_TEXTS[weekNumber]
    values = MISC_VALUES[weekNumber]
    selectors = MISC_SELECTORS[weekNumber]
    misc_items = []
    for tit, tex, val, sel in zip(titles, texts, values, selectors):
        misc_item = {'title': tit, 'text': tex, 'amount': val, 'selector': sel, 'category': 'misc'}
        misc_items.append(misc_item)
    return misc_items


# RECURRENT DATA
FUND_INIT = 100
FUND_REFILL = 100
SALARIES = [350, 400, 300, 325]
RENT_AND_UTILITIES = 225
FUND_USAGE = {
    "Special Card": "to pay for any kind of expenses (hobbies, groceries, social activities, etc...), rent excluded.",
    "Food Card": "to pay for groceries, but not for other types of expenses.",
    "Debit Card": ""
}


def get_recurrent_items(fundName, fundBalance, cardBalance, weekNumber):
    listIndex = weekNumber - 1
    items = []
    if (weekNumber == 1) & (fundName != "Debit Card"):
        titles = ["{}".format(fundName), "Salary", "Rent and Utilities"]
        texts = [
            "It is the first of the month, and ${fundInit} have been added to your {fundName}. You can use it {fundUsage}"
            " It is only refilled once, at the beginning of each month".format(fundName=fundName,
                             fundUsage=FUND_USAGE[fundName],
                             fundInit=FUND_INIT),
            "You have received your weekly paycheck in the mail: ${}. Because you do not always work the same number of hours, "
            "this amount will vary from one week to another.".format(SALARIES[0]),
            "You must pay rent and utilities every week, for a total of ${}. This amount will NOT vary from one week to "
            "another.".format(RENT_AND_UTILITIES)]
        accounts = ["fund", "card", "card"]
        amounts = [FUND_INIT, SALARIES[0], RENT_AND_UTILITIES]
        types = ["income", "income", "expense"]
        buttonsTexts = ["Take the {}".format(fundName), "Cash the paycheck", "Pay Rent and Utilities"]
        options = [{}, {}, {}]
    elif (weekNumber == 1) & (fundName == "Debit Card"):
        titles = ["Extra Salary", "Salary", "Rent and Utilities"]
        texts = [
            "It is the first of the month, and $100 have been added to your bank account",
            "You have received your weekly paycheck in the mail: ${}. Because you do not always work the same number of hours, "
            "this amount will vary from one week to another.".format(SALARIES[0]),
            "You must pay rent and utilities every week, for a total of ${}. This amount will NOT vary from one week to "
            "another.".format(RENT_AND_UTILITIES)]
        accounts = ["card", "card", "card"]
        amounts = [FUND_INIT, SALARIES[0], RENT_AND_UTILITIES]
        types = ["income", "income", "expense"]
        buttonsTexts = ["Take the money", "Cash the paycheck", "Pay Rent and Utilities"]
        options = [{}, {}, {}]
    elif (weekNumber > 1) & (fundName != "Debit Card"):
        titles = ["{} Balance".format(fundName), "Bank Account Balance", "Salary",
                  "Rent and Utilities"]
        texts = ["You finished last week with ${} left on your {}.".format(fundBalance, fundName),
                 "You finished last week with ${} left on your bank account.".format(cardBalance),
                 "You have received your weekly paycheck in the mail: ${}.".format(
                     SALARIES[listIndex]),
                 "You must pay rent and utilities for this week, for a total of ${}.".format(
                     RENT_AND_UTILITIES)]
        accounts = ["fund", "card", "card", "card"]
        amounts = [fundBalance, cardBalance, SALARIES[listIndex], RENT_AND_UTILITIES]
        buttonsTexts = ["Understood", "Understood", "Cash the paycheck", "Pay Rent and Utilities"]
        options = [{'forceDisplayFund': True}, {'forceDisplayCard': True}, {}, {}]
        types = ["income", "income", "income", "expense"]
    else:
        titles = ["Bank Account Balance", "Salary", "Rent and Utilities"]
        texts = ["You finished last week with ${} left on your bank account.".format(cardBalance),
                 "You have received your weekly paycheck in the mail: ${}.".format(
                     SALARIES[listIndex]),
                 "You must pay rent and utilities for this week, for a total of ${}.".format(
                     RENT_AND_UTILITIES)]
        accounts = ["card", "card", "card"]
        amounts = [cardBalance, SALARIES[listIndex], RENT_AND_UTILITIES]
        buttonsTexts = ["Understood", "Cash the paycheck", "Pay Rent and Utilities"]
        options = [{'forceDisplayCard': True}, {}, {}]
        types = ["income", "income", "expense"]
    for tit, tex, acc, am, but, opts, typ in zip(titles, texts, accounts, amounts, buttonsTexts, options, types):
        item = {'title': tit, 'text': tex, 'buttonText': but,
                'type': typ, 'amount': am, 'account': acc}
        for k, v in opts.items():
            item[k] = v
        items.append(item)
    return items


# OVERALL DATA

def prepare_data(weekNumber, participantId, fundName, fundBalance, cardBalance):
    if weekNumber == 1:
        data = {
            'app': {
                'participantId': participantId,
                'fundName': fundName,
                'weekNumber': weekNumber,
                'activeTab': 'recurrent',
                'gameEnded': False,
                'enableFund': True if fundName != "Debit Card" else False
            },
            'budget': {
                'fundBalance': 0,
                'cardBalance': 0,
                'lines': [],
                'fundUses': ["misc", "grocery"] if ((fundName == "Debit Card") or (fundName == "Special Card")) else [
                    "grocery"]
            },
            'misc': {
                'items': get_misc_items(weekNumber),
                'prompt': ("""After buying your groceries, you have various opportunities to spend and
                increase your level of happiness: social activities, new products, experiences,
                services...\nThe amount of money that you have is limited, so be sure to review
                all options (by clicking on their name) before making your decisions.""")
            },
            'grocery': {
                'choices': [0, 0, 0],
                'prices': [3.34, 7.76, 12.15],
                'tooltips': [
                    "Ramen, bread, frozen foods, pasta or rice in bulk...",
                    "Chicken and ground beef, sauces, vegetables, store branded cereals and cakes...",
                    "Seafood, fresh vegetables, high-quality meat and poultry, premium brands..."],
                'names': ["Thrifty", "Regular", "Indulgent"],
                'activePanel': "store",
                'prompt': ""
            },

            'recurrent': {
                'items': get_recurrent_items(fundName, fundBalance, cardBalance, weekNumber)
            }
        }
    elif weekNumber <= 4:
        data = {
            'app': {
                'participantId': participantId,
                'fundName': fundName,
                'weekNumber': weekNumber,
                'activeTab': 'recurrent',
                'gameEnded': False,
                'enableFund': True if fundName != "Debit Card" else False
            },
            'budget': {
                'fundBalance': 0,
                'cardBalance': 0,
                'lines': [],
                'fundUses': ["misc", "grocery"] if ((fundName == "Debit Card") or (fundName == "Special Card")) else [
                    "grocery"]
            },
            'misc': {
                'items': get_misc_items(weekNumber),
                'prompt': "Please review those spending opportunities (by clicking on their name) and make a decision for each of them."
            },
            'grocery': {
                'choices': [0, 0, 0],
                'prices': [3.34, 7.76, 12.15],
                'tooltips': [
                    "Ramen, bread, frozen foods, pasta or rice in bulk...",
                    "Chicken and ground beef, sauces, vegetables, store branded cereals and cakes...",
                    "Seafood, fresh vegetables, high-quality meat and poultry, premium brands..."],
                'names': ["Thrifty", "Regular", "Indulgent"],
                'activePanel': "store",
                'prompt': "Make your selection of 14 menus for this week."
            },

            'recurrent': {
                'items': get_recurrent_items(fundName, fundBalance, cardBalance, weekNumber)
            }
        }
    else:
        data = {
            'app': {
                'gameEnded': True,
                'surveyLink': 'http://google.com'
            }
        }
    return data
