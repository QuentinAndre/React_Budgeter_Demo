import {connect} from 'react-redux'
import {toggleItem, setActive, updateAmount} from '../modules/MiscActions'
import {openModal, getNextWeekData} from '../modules/AppActions'
import {parseTransaction} from '../modules/BudgetActions'
import MiscPanel from '../components/Panels/MiscPanel'

const mapStateToProps = (state) => {
    const items = state.misc.get('items').toJS();
    const allReviewed = !items.map((item)=>item.reviewed ? 0 : 1).reduce((a, b)=> a+b);
    const isFetching = state.app.get('isFetching');
    const enableFund = state.app.get("enableFund");
    const hasFailedFetching = state.app.get('hasFailedFetching');
    const serverError = state.app.get("fetchErrors") > 2;
    var buttonStatus = "";
    if (!allReviewed) {
        buttonStatus = "disabled";
    } else if (isFetching) {
        buttonStatus = "fetching";
    } else if (serverError) {
        buttonStatus = "serverError"
    } else if (hasFailedFetching) {
        buttonStatus = "failedFetching"
    } else {
        buttonStatus = "successFetching"
    }
    return {
        activePanel: state.grocery.get("activePanel"),
        fundBalance: state.budget.get("fundBalance"),
        cardBalance: state.budget.get("cardBalance"),
        fundName: state.app.get('fundName'),
        items: items,
        prompt: state.misc.get('prompt'),
        buttonStatus: buttonStatus,
        enableFund: enableFund
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleToggle: (id) => {
            return () => dispatch(toggleItem(id))
        },

        handlePay: (id) => {
            return (transactionPayload) => {
                return () => {
                    dispatch(parseTransaction(transactionPayload));
                    dispatch(setActive(id));
                    dispatch(openModal())
                }
            }
        },

        handleChange: (id) => {
            return (amount) => {
                dispatch(updateAmount(id, amount))
            }
        },

        loadNextWeek: () => dispatch(getNextWeekData())
}
}
;

const ControlMiscPanel = connect(
    mapStateToProps,
    mapDispatchToProps
)(MiscPanel);

export default ControlMiscPanel