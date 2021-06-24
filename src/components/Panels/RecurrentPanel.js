import React, {Component, PropTypes} from 'react';
import Button from 'react-bootstrap/lib/Button'
import Panel from 'react-bootstrap/lib/Panel'

class RecurrentPanel extends Component {
    render() {
        const {items, allReviewed, handleClickItem, handleClickNext, visibility} = this.props;
        return (
            <div>
                {items ? items.map((item, i)=> {
                        const hidden = !visibility[i];
                        return (<Panel collapsible key={i}
                                       header={<span style={{color: hidden ? 'grey' : 'black'}}>{item.title}</span>}
                                       expanded={!hidden}>
                            <div style={{marginBottom: '15px'}}>{item.text}</div>
                            <div style={{textAlign: 'center'}}>
                                <Button onClick={handleClickItem(item, i)}>{item.buttonText}</Button>
                            </div>
                        </Panel>)
                    }
                ) : null}
                <div style={{textAlign: 'center'}}>{allReviewed ?
                    <Button onClick={handleClickNext}>Proceed to Grocery Shopping</Button> : null }</div>
            </div>

        );
    }
}


RecurrentPanel.propTypes = {
    items: PropTypes.array.isRequired,
    visibility: PropTypes.array.isRequired,
    allReviewed: PropTypes.bool.isRequired,
    handleClickNext: PropTypes.func.isRequired,
    handleClickItem: PropTypes.func.isRequired
};

export default RecurrentPanel;

