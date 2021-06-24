import React, {Component, PropTypes} from 'react'
import Panel from 'react-bootstrap/lib/Panel'
import Grid from 'react-bootstrap/lib/Grid'
import NavBar from '../NavBar/NavBar'
import ControlBudget from '../../containers/ControlBudgetPanel'
import ControlTransactionModal from '../../containers/ControlTransactionModal'
import CubeGrid from 'better-react-spinkit/dist/CubeGrid'
import ControlMiscPanel from '../../containers/ControlMiscPanel'
import ControlRecurrentPanel from '../../containers/ControlRecurrentPanel'
import ControlGroceryPanel from '../../containers/ControlGroceryPanel'
require('./App.css');


class App extends Component {
    componentDidMount() {
        var {initialize} = this.props;
        initialize();
    }

    render() {
        var {isLoaded, fundName, participantId, activeTab, weekNumber, gameEnded, surveyLink} = this.props;
        var weekString = `Week Number ${weekNumber}`;
        var greetingString = `Currently logged in as: ${participantId}`;
        var app = (<Grid>
            <div className="row">
                <div className="col-md-4 week-header">{weekString}</div>
                <div className="col-md-4 col-md-offset-4 greeting-header">{greetingString}</div>
            </div>
            <div className="row">
                <div className="panel panel-default">
                    <div className="panel-heading app-header">
                        <NavBar activeKey={activeTab}/>
                    </div>
                    <div className="panel-body">
                        <div className="col-md-6">
                            {activeTab == "recurrent" ? <ControlRecurrentPanel/> : null}
                            {activeTab == "grocery" ? <ControlGroceryPanel/> : null}
                            {activeTab == "misc" ? <ControlMiscPanel/> : null}
                        </div>
                        <div className="col-md-6">
                            <ControlBudget fundName={fundName}/>
                        </div>
                    </div>
                </div>
                <ControlTransactionModal {...this.props}/>
            </div>
        </Grid>);

        var loadingScreen = (<Grid>
            <div className="row">
                <div style={{width: "100%"}}>
                    <span className="loader-text-span">Now loading...</span>
                    <span className="loader-span"><CubeGrid size={200}/></span>
                </div>
            </div>
        </Grid>);

        var endScreen = (<Grid>
            <div className="row">
                <div className="col-md-8 col-md-offset-2" style={{textAlign: 'center'}}>
                    <Panel>
                        The game is now over, thank you for playing!
                        <br/>
                        Before you receive your confirmation code for MTurk, we would like you to complete a short
                        survey. You will receive your confirmation code at
                        the end of this survey.<br/>
                        <a href={surveyLink}>Please click this link to start the survey</a>
                    </Panel>
                </div>
            </div>
        </Grid>);

        return gameEnded ?
            endScreen
            : isLoaded ? app : loadingScreen
    }
}

App.propTypes = {
    fundName: PropTypes.string.isRequired,
    participantId: PropTypes.string.isRequired,
    activeTab: PropTypes.string.isRequired,
    weekNumber: PropTypes.number.isRequired,
    modalState: PropTypes.string.isRequired,
    gameEnded: PropTypes.bool.isRequired,
    surveyLink: PropTypes.string
};

export default App