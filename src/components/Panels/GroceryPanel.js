import React, {Component, PropTypes} from 'react';

import NumberPicker from 'react-widgets/lib/NumberPicker';

import Button from 'react-bootstrap/lib/Button'
import FormControl from 'react-bootstrap/lib/FormControl'
import Tooltip from 'react-bootstrap/lib/Tooltip'
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger'
import Panel from 'react-bootstrap/lib/Panel'

import 'react-widgets/lib/less/react-widgets.less';
require('./GroceryPanel.css');

class CheckoutButton extends React.Component {
    render() {
        const {disabled, onClick} = this.props;
        if (disabled) {
            const tooltip = (
                <Tooltip id="tooltip">You must select 14 meals for this week before proceeding to checkout</Tooltip>
            );
            return (<OverlayTrigger placement="bottom" overlay={tooltip}>
                <div style={{display: 'inline-block', cursor: 'not-allowed'}}>
                    <Button bsStyle="danger" style={{pointerEvents: 'none'}} disabled>
                        <i className={'fa fa-exclamation-triangle'}/> Proceed to checkout
                    </Button>
                </div>
            </OverlayTrigger>)
        } else {
            return (
                <Button bsStyle="success" onClick={onClick}>
                     <i className={'fa fa-check'}/> Proceed to checkout
                </Button>)
        }
    }
}


class GroceryPanel extends Component {
    render() {
        var {mealChoices, mealNames, mealTooltips, mealNumber, mealTotal, activePanel, prompt, fundName} = this.props;
        var {handleCheckout, handleUpdate, handlePay, handleReturn, handleNextTab, payloadCard, payloadFund} = this.props;
        var {enableFund} = this.props;
        var header = activePanel == "checkout" ? `Total on Groceries: $${mealTotal.toFixed(2)}.` : "Checkout";
        return (
            <div>
                <Panel collapsible
                       header={<span style={{color: activePanel == "store" ? 'black' : 'grey'}}>Meal Planning</span>}
                       expanded={activePanel == "store"}>
                    <div className="col-md-12">
                        <div className="menu-description">
                            {prompt ? prompt :
                                <div>
                                    Each week, you have to buy food for 14 menus (7 lunches and 7 dinners).
                                    There are different menus available to you:
                                    <ul>
                                        <li>Thrifty menus are very inexpensive but repetitive: they consist
                                            of ramen, bread, frozen foods, pasta or rice in bulk...
                                        </li>
                                        <li>Regular menus feature everyday items, such as chicken and ground beef,
                                            sauces, vegetables, store branded cereals and cakes...
                                        </li>
                                        <li>Indulgent menus feature delicious, but expensive items: seafood, fresh
                                            vegetables, high-quality meat and poultry, premium brands...
                                        </li>
                                    </ul>
                                    Choose the menus that will strike the right balance between being happy
                                    with what you eat, and having enough money left for other expenses.
                                </div>
                            }
                        </div>
                    </div>
                    <div className="col-md-8 col-md-offset-2">
                        <div className="vertical-align menu-line">
                            <div className="menu-spinner">
                                <NumberPicker value={mealChoices[0]} defaultValue={0} min={0} max={14}
                                              onChange={handleUpdate(0)}/>
                            </div>
                            <div>{mealNames[0]} Menus</div>
                            <div className="menu-tooltip">
                                <OverlayTrigger overlay={<Tooltip id={mealNames[0]}>{mealTooltips[0]}</Tooltip>}
                                                placement="right" delayShow={100}
                                                delayHide={100}>
                                    <span className="glyphicon glyphicon-question-sign">&nbsp;</span>
                                </OverlayTrigger>
                            </div>
                        </div>
                        <div className="vertical-align menu-line">
                            <div className="menu-spinner">
                                <NumberPicker value={mealChoices[1]} defaultValue={0} min={0} max={14}
                                              onChange={handleUpdate(1)}/>
                            </div>
                            <div>{mealNames[1]} Menus</div>
                            <div className="menu-tooltip">
                                <OverlayTrigger overlay={<Tooltip id={mealNames[1]}>{mealTooltips[1]}</Tooltip>}
                                                placement="right" delayShow={100}
                                                delayHide={100}>
                                    <span className="glyphicon glyphicon-question-sign">&nbsp;</span>
                                </OverlayTrigger>
                            </div>
                        </div>
                        <div className="vertical-align menu-line">
                            <div className="menu-spinner">
                                <NumberPicker value={mealChoices[2]} defaultValue={0} min={0} max={14}
                                              onChange={handleUpdate(2)}/>
                            </div>
                            <div>{mealNames[2]} Menus</div>
                            <div className="menu-tooltip">
                                <OverlayTrigger overlay={<Tooltip id={mealNames[2]}>{mealTooltips[2]}</Tooltip>}
                                                placement="right" delayShow={100}
                                                delayHide={100}>
                                    <span className="glyphicon glyphicon-question-sign">&nbsp;</span>
                                </OverlayTrigger>
                            </div>
                        </div>
                        <div className="vertical-align menu-line">
                            <div className="menu-spinner"><FormControl type="text" value={mealNumber}/></div>
                            <div>Total Menus</div>
                        </div>
                        <CheckoutButton onClick={handleCheckout} disabled={(mealNumber != 14)}/>
                    </div>
                </Panel>
                <Panel collapsible
                       header={<span style={{color: activePanel == "checkout" ? 'black' : 'grey'}}>{header}</span>}
                       expanded={activePanel == "checkout"}>
                    <div className="col-md-4">
                        <Button onClick={handlePay(payloadCard)}>Pay with Debit Card</Button>
                    </div>
                    <div className="col-md-4">
                        {enableFund ? <Button onClick={handlePay(payloadFund)}>Pay with {fundName}</Button> : ""}
                    </div>
                    <div className="col-md-4">
                        <Button onClick={handleReturn}>Change Menus</Button>
                    </div>
                </Panel>
                <div style={{textAlign: 'center'}}>{activePanel == "toMiscButton" ?
                    <Button onClick={handleNextTab}>Proceed to Misc. Expenses.</Button> : null }</div>
            </div>
        )
    }
}

GroceryPanel.propTypes = {
    mealChoices: PropTypes.array.isRequired,
    mealNames: PropTypes.array.isRequired,
    mealTooltips: PropTypes.array.isRequired,
    mealTotal: PropTypes.number.isRequired,
    mealNumber: PropTypes.number.isRequired,
    prompt: PropTypes.string.isRequired,
    fundName: PropTypes.string.isRequired,
    activePanel: PropTypes.string.isRequired,
    handleCheckout: PropTypes.func.isRequired,
    handleUpdate: PropTypes.func.isRequired,
    handlePay: PropTypes.func.isRequired,
    handleReturn: PropTypes.func.isRequired,
    handleNextTab: PropTypes.func.isRequired,
    payloadCard: PropTypes.object.isRequired,
    payloadFund: PropTypes.object.isRequired,
    enableFund: PropTypes.bool.isRequired
};

export default GroceryPanel;

