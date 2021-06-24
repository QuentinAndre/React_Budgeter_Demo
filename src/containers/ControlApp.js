import {connect} from 'react-redux'
import App from '../components/App/App';
import {initialize, getNextWeekData} from '../modules/AppActions'

const mapStateToProps = (state) => {
    var {isLoaded, isFetching, activeTab, fundName, participantId, weekNumber, modalState, gameEnded, surveyLink} = state.app.toJS();
    return {
        activeTab: activeTab,
        fundName: fundName,
        participantId: participantId,
        weekNumber: weekNumber,
        modalState: modalState,
        isLoaded: isLoaded,
        isFetching: isFetching,
        gameEnded: gameEnded,
        surveyLink: surveyLink
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        initialize: () => dispatch(initialize()),
        loadWeekData: () => dispatch(getNextWeekData())
    }
};

const ControlApp = connect(
    mapStateToProps,
    mapDispatchToProps
)(App);

export default ControlApp