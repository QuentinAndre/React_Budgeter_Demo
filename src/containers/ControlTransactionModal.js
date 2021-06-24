import {connect} from 'react-redux'
import {closeModal} from '../modules/AppActions'
import {processTransaction} from '../modules/BudgetActions'
import {toMiscButton} from '../modules/GroceryActions'
import {reviewItem} from '../modules/MiscActions'
import TransactionModal from '../components/Modals/TransactionModal'

function getPropsFromState(state) {
    const {fundBalance, cardBalance, nextTransaction} = state.budget.toJS();
    const fundName = state.app.get("fundName");
    const activeMisc = state.misc.get("active");
    var visibility = state.app.get("modalState") == "open";
    var itemId = state.budget.getIn(["nextTransaction", "callbackId"]);
    return {
        fundBalance: fundBalance,
        fundName: fundName,
        cardBalance: cardBalance,
        transaction: nextTransaction,
        visible: visibility,
        activeMisc: activeMisc,
        itemId: itemId
    };
}

const mapStateToProps = (state) => {
    return getPropsFromState(state);
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleValidateGrocery: () => {
            return () => {
                dispatch(processTransaction());
                dispatch(toMiscButton());
                dispatch(closeModal());
            }
        },

        handleValidateMisc: (id) => {
            return () => {
                dispatch(processTransaction());
                dispatch(reviewItem(id));
                dispatch(closeModal());
            }
        },

        handleCancel: () => {
            dispatch(closeModal());
        }
    }
};

const ControlTransactionModal = connect(
    mapStateToProps,
    mapDispatchToProps
)(TransactionModal);

export default ControlTransactionModal