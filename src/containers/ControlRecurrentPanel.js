import {connect} from 'react-redux'
import RecurrentPanel from '../components/Panels/RecurrentPanel'
import { processTransaction, parseTransaction } from '../modules/BudgetActions'
import { nextPanel } from '../modules/RecurrentActions'
import { changeTab } from '../modules/AppActions'

const mapStateToProps = (state) => {
    var { items, visibility } = state.recurrent.toJS();
    var allReviewed = visibility ? !visibility.reduce((a, b)=> a+b) : false;
    return {
        items: items,
        visibility: visibility,
        prompt: prompt,
        allReviewed: allReviewed
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleClickItem: (item, i) => {
            return () => {
                dispatch(parseTransaction(item));
                dispatch(processTransaction());
                dispatch(nextPanel(i))
            }
        },

        handleClickNext: () => dispatch(changeTab('grocery'))
    }
};

const ControlRecurrentPanel = connect(
    mapStateToProps,
    mapDispatchToProps
)(RecurrentPanel);

export default ControlRecurrentPanel