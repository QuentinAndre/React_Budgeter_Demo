import Table from 'react-bootstrap/lib/Table'
import Panel from 'react-bootstrap/lib/Panel'
import React, { Component, PropTypes }from 'react';

class BudgetItem extends Component {
    render() {
        var {title, fromCard, fromFund, type, forceDisplayFund, forceDisplayCard} = this.props;
        var displayed = ((fromCard != 0 || forceDisplayCard) || (fromFund != 0 || forceDisplayFund));
        return ( displayed ?
        <tr className={type === "income" ? "success" : "danger"}>
            <td>{title}</td>
            <td>{(fromCard == 0 && !forceDisplayCard) ? "": (type == "income" ? "+ $" + fromCard.toFixed(2) : "- $" + fromCard.toFixed(2))}</td>
            <td>{(fromFund == 0 && !forceDisplayFund) ? "": (type == "income" ? "+ $" + fromFund.toFixed(2) : "- $" + fromFund.toFixed(2))}</td>
        </tr> : null
        )
    }
}

BudgetItem.propTypes = {
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    fromCard: PropTypes.number.isRequired,
    fromFund: PropTypes.number.isRequired,
    forceDisplayFund : PropTypes.bool,
    forceDisplayCard : PropTypes.bool
};


class BudgetPanel extends Component {
    render() {
        const { fundName, cardBalance, fundBalance, lines, enableFund } = this.props;
        return (
            <Panel header="Budget Summary">
                <Table>
                    <thead>
                    <tr>
                        <th style={{border: 0}}>&nbsp;</th>
                        <th style={{border: 0}}>Bank Account</th>
                        <th style={{border: 0}}>{enableFund ? fundName : ""}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {lines ? lines.map((l, i) =>
                        <BudgetItem key={i} {...l}/>
                    ): null}
                    </tbody>
                    <tfoot>
                    <tr style={{border: 1}}>
                        <td><b>Balance</b></td>
                        <td><b>+ ${cardBalance.toFixed(2)}</b></td>
                        <td>{enableFund ? <b>+ ${fundBalance.toFixed(2)}</b> : ""}</td>
                    </tr>
                    </tfoot>
                </Table>
            </Panel>
        )
    }
};

BudgetPanel.propTypes = {
    fundName: PropTypes.string.isRequired,
    cardBalance: PropTypes.number.isRequired,
    fundBalance: PropTypes.number.isRequired,
    lines: PropTypes.array.isRequired,
    enableFund: PropTypes.bool.isRequired
};

export default BudgetPanel