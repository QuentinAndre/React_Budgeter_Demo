import React, {Component, PropTypes} from "react";
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';

class TransactionModal extends Component {

    render() {
        const {cardBalance, fundBalance, fundName, transaction, visible, handleValidateGrocery, handleValidateMisc, handleCancel, itemId} = this.props;
        const mainFrom = transaction.account == "card" ? "bank account" : fundName;
        const otherFrom = transaction.account == "card" ? fundName : "bank account";
        const mainAmount = transaction.account == "card" ? transaction.fromCard : transaction.fromFund;
        const diffAmount = transaction.account == "card" ? transaction.fromFund : transaction.fromCard;
        const totalAmount = mainAmount + diffAmount;
        const mainBalance = (transaction.account == "card") ? cardBalance : fundBalance;
        const title = transaction.title;
        const handleValidate = transaction.category == "grocery" ? handleValidateGrocery : handleValidateMisc;

        var baseTexts = {
            "notPurchased": `You will not spend money on "${title}".`,
            "unaffordable": "Your balance is insufficient for this transaction. Please adjust your choices.",
            "denied": `You cannot use your ${mainFrom} for this transaction. Please use your bank account instead.`,
            "full": `You are about to pay $${totalAmount.toFixed(2)} from your ${mainFrom}.`,
            "split": `You are trying to pay $${totalAmount.toFixed(2)} from your ${mainFrom}, but you only have 
                    $${mainBalance} on that account. The remaining $${(diffAmount).toFixed(2)} will 
                    be paid from your ${otherFrom}.`,
            "depleted": `You have no money on your ${mainFrom}. Please use your ${otherFrom} instead.`
        };

        var baseButtons = {
            "notPurchased": [{text: "Ok", type: "validate"}, {text: "Cancel", type: "cancel"}],
            "unaffordable": [{text: "Ok", type: "cancel"}],
            "denied": [{text: "Ok", type: "cancel"}],
            "depleted": [{text: "Ok", type: "cancel"}],
            "full": [{text: "Proceed with the transaction", type: "validate"}, {text: "Cancel", type: "cancel"}],
            "split": [{text: "Proceed with both transactions", type: "validate"}, {text: "Cancel", type: "cancel"}]
        };

        const text = baseTexts[transaction.status];
        const buttons = baseButtons[transaction.status];
        return (
            <Modal show={visible}>
                <Modal.Header>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {text}
                </Modal.Body>
                <Modal.Footer>
                    {buttons ? buttons.map((b, i) =>
                        <Button key={i} onClick={b.type == "validate" ? handleValidate(itemId) : handleCancel}>
                            {b.text}
                        </Button>
                    ) : null}
                </Modal.Footer>
            </Modal>
        );
    }
}

TransactionModal.PropTypes = {
    cardBalance: PropTypes.number.isRequired,
    fundBalance: PropTypes.number.isRequired,
    fundName: PropTypes.string.isRequired,
    transaction: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired,
    handleValidateGrocery: PropTypes.func.isRequired,
    handleValidateMisc: PropTypes.func.isRequired,
    handleCancel: PropTypes.func.isRequired,
    itemId: PropTypes.number.isRequired
};

export default TransactionModal