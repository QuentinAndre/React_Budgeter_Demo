import {connect} from 'react-redux'

import {changeMenu, toCheckout, toStore} from '../modules/GroceryActions'
import {openModal, changeTab} from '../modules/AppActions'
import {parseTransaction} from '../modules/BudgetActions'

import GroceryPanel from '../components/Panels/GroceryPanel'

function computeTotal(choices, prices) {
    var sum = 0;
    for (var i = 0; i < choices.length; i++) {
        sum += choices[i] * prices[i];
    }
    return parseFloat(sum.toFixed(2));
}

const mapStateToProps = (state, ownProps) => {
    var fundName = state.app.get("fundName");
    var enableFund = state.app.get("enableFund");
    var prompt = state.grocery.get("prompt");
    var activePanel = state.grocery.get("activePanel");
    var mealChoices = state.grocery.get("choices").toJS();
    var mealPrices = state.grocery.get("prices").toJS();
    var mealNames = state.grocery.get("names").toJS();
    var mealTooltips = state.grocery.get("tooltips").toJS();
    var mealTotal = computeTotal(mealChoices, mealPrices);
    var mealNumber = mealChoices ? mealChoices.reduce((a, b) => a + b) : 0;

    var payloadFund = {
        title: "Groceries",
        type: "expense",
        amount: mealTotal,
        category: "grocery",
        account: "fund",
        callbackId: 0
    };
    var payloadCard = {
        title: "Groceries",
        type: "expense",
        amount: mealTotal,
        category: "grocery",
        account: "card",
        callbackId: 0
    };
    return {
        mealChoices: mealChoices,
        mealNumber: mealNumber,
        mealPrices: mealPrices,
        mealTotal: mealTotal,
        mealNames: mealNames,
        mealTooltips: mealTooltips,
        payloadCard: payloadCard,
        payloadFund: payloadFund,
        fundName: fundName,
        prompt: prompt,
        activePanel: activePanel,
        enableFund: enableFund
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleUpdate: (id) => {
            return (value) => dispatch(changeMenu(id, value))
        },

        handleReturn: () => dispatch(toStore()),

        handleCheckout: () => dispatch(toCheckout()),

        handlePay: (transactionPayload) => {
            return () => {
                dispatch(parseTransaction(transactionPayload));
                dispatch(openModal())
            }
        },

        handleNextTab: () => dispatch(changeTab("misc"))
    }
};

const ControlGroceryPanel = connect(
    mapStateToProps,
    mapDispatchToProps
)(GroceryPanel);

export default ControlGroceryPanel