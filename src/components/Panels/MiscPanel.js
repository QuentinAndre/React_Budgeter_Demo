import React, {Component, PropTypes} from 'react';

import Button from 'react-bootstrap/lib/Button'
import Tooltip from 'react-bootstrap/lib/Tooltip'
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger'
import Panel from 'react-bootstrap/lib/Panel'

import ReactBootstrapSlider from 'react-bootstrap-slider';
import DropdownList from 'react-widgets/lib/DropdownList';

require('./bootstrap-slider.css');
require('./MiscPanel.css');

class MiscItem extends Component {
    render() {
        const {
            id, title, text, amount, fundName, opened, reviewed, selector, handleToggle,
            handlePay, handleChange, category, enableFund
        } = this.props;
        const payloadFund = {
            title: title,
            type: "expense",
            amount: amount,
            category: category,
            account: "fund",
            callbackId: id
        };
        const payloadCard = {
            title: title,
            type: "expense",
            amount: amount,
            category: category,
            account: "card",
            callbackId: id
        };
        const payloadDeclined = {
            type: "notPurchased",
            title: title,
            callbackId: id,
            category: category,
            account: "none",
            amount: 0
        };
        var header = <span style={{color: reviewed ? 'grey' : 'black'}}>{title}</span>;
        return (
            <Panel collapsible header={header} expanded={opened && !reviewed} onSelect={handleToggle}>
                <div className="misc-text">{ text }</div>
                {(selector.type == "binary") ? null :
                    <div className="misc-selector"> { selector.type == "slider" ?
                        <ReactBootstrapSlider value={selector.value} change={(e) => handleChange(e.target.value)}
                                              slideStop={(e) => handleChange(e.target.value)}
                                              tooltip='always'
                                              formatter={(e)=>(selector.prefix + e + selector.suffix)} { ...selector.props }/> :
                        <DropdownList value={selector.value} onChange={(e)=>handleChange(e.id)} data={selector.data}
                                      valueField="id" textField="text"/>}
                    </div>}
                <div className="misc-total">Total cost: ${ amount.toFixed(2) }</div>
                <div style={{textAlign: 'center'}}>
                    <Button onClick={handlePay(payloadCard)}>Pay with Debit Card</Button>
                    {enableFund ? <Button onClick={handlePay(payloadFund)}>Pay with {fundName}</Button> : null}
                    <Button onClick={handlePay(payloadDeclined)}>Do not spend money</Button>
                </div>
            </Panel>
        )
    }
}

class SaveButton extends Component {
    render() {
        const {status, onClick} = this.props;
        if (status == "disabled") {
            const tooltip = (
                <Tooltip id="tooltip">You must review all the options before proceeding to the next week.</Tooltip>
            );
            return (<OverlayTrigger placement="top" overlay={tooltip}>
                <div className="button-disabled-wrapper">
                    <Button bsStyle="danger" style={{pointerEvents: 'none'}} disabled>
                        <i className={'fa fa-exclamation-triangle'}/> Proceed to next week
                    </Button>
                </div>
            </OverlayTrigger>)
        } else if (status == "fetching") {
            return (
                <Button bsStyle="primary" disabled>
                    <i className={'fa fa-cog fa-spin'}/> Loading next week...
                </Button>)
        } else if (status == "failedFetching") {
            return (
                <Button bsStyle="warning" onClick={onClick}>
                    <i className={'fa fa-exclamation'}/> Failed to load. Please try again.
                </Button>)
        } else if (status == "serverError") {
            return (
                <Panel>The game has encountered an error and must now stop. Please contact the researcher at the
                    following address to receive your MTurk compensation nonetheless.<br/>
                    <a mailto="quentin.andre@insead.edu">quentin.andre@insead.edu</a><br/>
                    We apologize for the inconvenience.
                </Panel>)
        } else {
            return (
                <Button bsStyle="default" onClick={onClick}>
                    <i className={'fa fa-forward'}/> Proceed to next week
                </Button>)
        }
    }
}

class MiscPanel extends Component {
    render() {
        const {items, handleToggle, handlePay, handleChange, prompt, loadNextWeek, buttonStatus, enableFund} = this.props;
        return (
            <div>
                <div style={{'marginBottom': '15px'}}>
                    {prompt}
                </div>
                <div>
                    {items ? items.map((item, i)=> (
                        <MiscItem {...this.props} key={i} id={i}
                                  handleToggle={handleToggle(i)}
                                  handlePay={handlePay(i)}
                                  handleChange={handleChange(i)}
                                  enableFund={enableFund}
                                  {...item}/>
                    )) : null}
                </div>
                <div style={{textAlign: 'center'}}>
                    <SaveButton status={buttonStatus} onClick={loadNextWeek}/>
                </div>
            </div>
        );
    }
}

MiscPanel.propTypes = {
    items: PropTypes.array.isRequired,
    handleToggle: PropTypes.func.isRequired,
    handlePay: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    loadNextWeek: PropTypes.func.isRequired,
    prompt: PropTypes.string.isRequired,
    buttonStatus: PropTypes.string.isRequired,
    enableFund: PropTypes.bool.isRequired
};

export default MiscPanel;