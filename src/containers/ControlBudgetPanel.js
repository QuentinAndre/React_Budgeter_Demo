import {connect} from 'react-redux'
import BudgetPanel from '../components/Panels/BudgetPanel'

const mapStateToProps = (state, ownProps) => {
    var {cardBalance, fundBalance, lines} = state.budget.toJS();
    var fundName = state.app.get("fundName");
    var enableFund = state.app.get("enableFund");
    return {
        cardBalance: cardBalance,
        fundBalance: fundBalance,
        lines: lines,
        fundName: fundName,
        enableFund: enableFund
    }
};

const mapDispatchToProps = (dispatch) => {
    return {}
};

const ControlBudgetPanel = connect(
    mapStateToProps,
    mapDispatchToProps
)(BudgetPanel);

export default ControlBudgetPanel