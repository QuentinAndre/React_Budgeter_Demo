import React, {Component, PropTypes} from 'react';
import Nav from 'react-bootstrap/lib/Nav'
import NavItem from 'react-bootstrap/lib/NavItem'

class NavBar extends Component {
    render() {
        const {activeKey} = this.props;
        return (
            <Nav bsStyle="pills" activeKey={activeKey} justified>
                <NavItem eventKey={"recurrent"} disabled>Recurring Income and Expenses</NavItem>
                <NavItem eventKey={"grocery"} disabled>Grocery Shopping</NavItem>
                <NavItem eventKey={"misc"} disabled>Misc. Expenses</NavItem>
            </Nav>
        )
    }

}

NavBar.PropTypes = {
    activeKey: PropTypes.string.isRequired
};

export default NavBar