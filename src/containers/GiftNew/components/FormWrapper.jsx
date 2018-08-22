import React, {Component} from 'react';
import {connect} from 'react-redux';
import styles from '../GiftAdd/Crm.less';
import GiftAddModalStep from "../GiftAdd/GiftAddModalStep";
import GiftAddModal from "../GiftAdd/GiftAddModal";

const complexGifts = [ '10', '20', '21', '80', '91', '100', '110', '111' ];
const simpleGifts = [ '30', '40', '42', '90' ];

class FormWrapper extends Component {
    constructor(props) {
        super(props);
        this.formRef = null;
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit() {
        this.formRef && this.formRef.wrappedInstance && this.formRef.wrappedInstance.handleSubmit
        && this.formRef.wrappedInstance.handleSubmit();
    }

    render() {
        const { name, value, describe, type, data } = this.props;
        const formData = data.toJS()
        let Comp;
        if (complexGifts.includes(value)) {
            Comp = GiftAddModalStep;
        } else if (simpleGifts.includes(value)) {
            Comp = GiftAddModal;
        }
        return (
            <div onScroll={(e) => {
                this.props.onFormScroll(e.target.scrollTop / (e.target.scrollHeight - e.target.clientHeight));
            }} className={styles.formWrapperContainer}>
                <div className={styles.formWrapper}>
                    <Comp
                        type={type === 'detail' ? 'edit' : type}
                        ref={form => this.formRef = form}
                        gift={{
                            value,
                            name,
                            describe,
                            data: formData
                        }}
                    />
                </div>
                <div className={styles.formWrapperPlaceholder}/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        value: state.sale_editGiftInfoNew.get('currentGiftType'),
        type: state.sale_editGiftInfoNew.get('operationType'),
        data: state.sale_editGiftInfoNew.get('createOrEditFormData'),
    }
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(FormWrapper)
