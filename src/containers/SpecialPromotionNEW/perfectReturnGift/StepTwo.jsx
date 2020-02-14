import React from 'react';
import { connect } from 'react-redux';
import {
    Form,
    Checkbox,
} from 'antd';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
import { saleCenterSetSpecialBasicInfoAC } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import styles from '../../SaleCenterNEW/ActivityPage.less';

import { injectIntl } from 'i18n/common/injectDecorator'
import { STRING_SPE } from 'i18n/common/special';


@injectIntl
class StepTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            customerInfoCheck: ['customerName', 'customerMobile', 'customerBirthday', 'customerSex'],
            valueFlag: 'success',
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        this.props.getSubmitFn({
            prev: undefined,
            next: this.handleSubmit,
            finish: undefined,
            cancel: undefined,
        });
        const specialPromotion = this.props.specialPromotion.get('$eventInfo').toJS();
        // if (Object.keys(specialPromotion).length > 10) {
        if (Object.keys(specialPromotion).length > 30) {
            const { customerInfoCheck } = specialPromotion;
            const value = JSON.parse(customerInfoCheck);
            this.setState({ customerInfoCheck: value });
        }
    }

    componentWillReceiveProps(nextProps) {
        const specialPromotion = nextProps.specialPromotion.get('$eventInfo').toJS();
        if (this.props.specialPromotion.get('$eventInfo') != nextProps.specialPromotion.get('$eventInfo') &&
            // nextProps.specialPromotion.get('$eventInfo').size > 10) {
            nextProps.specialPromotion.get('$eventInfo').size > 30) {
            const { customerInfoCheck } = specialPromotion;
            const value = JSON.parse(customerInfoCheck);
            this.setState({ customerInfoCheck: value });
        }
    }

    handleSubmit() {
        const value = this.state.customerInfoCheck;
        if (value.length > 0) {
            this.setState({ valueFlag: 'success' });
            this.props.setSpecialBasicInfo({ 'customerInfoCheck': JSON.stringify(this.state.customerInfoCheck) });
            return true;
        }
        this.setState({ valueFlag: 'error' });
        return false;
    }

    handleChange(value) {
        this.setState({ customerInfoCheck: value })
    }
    // 参与范围
    render() {
        const options = [
            { label: `${this.props.intl.formatMessage(STRING_SPE.de8g85ajma25216)}`, value: 'customerName' },
            { label: `${this.props.intl.formatMessage(STRING_SPE.da9060bn7g26184)}`, value: 'customerMobile' },
            { label: `${this.props.intl.formatMessage(STRING_SPE.d2b1c70516440269)}`, value: 'customerBirthday' },
            { label: `${this.props.intl.formatMessage(STRING_SPE.d454fkcq7p150)}`, value: 'customerSex' },
            { label: `${this.props.intl.formatMessage(STRING_SPE.d5672bd5571b261)}`, value: 'address' },
            { label: `${this.props.intl.formatMessage(STRING_SPE.d5672bd5571b3110)}`, value: 'companyName' },
            { label: `${this.props.intl.formatMessage(STRING_SPE.d7h838fdae14165)}`, value: 'customerEmail' },
            { label: `${this.props.intl.formatMessage(STRING_SPE.d17013400d7d5291)}`, value: 'IDCard' },
        ];
        return (
            <Form>
                <FormItem
                    label={this.props.intl.formatMessage(STRING_SPE.da9064ecge6154)}
                    className={styles.noPadding}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    validateStatus={this.state.valueFlag}
                    help={this.state.valueFlag == 'success' ? null : `${this.props.intl.formatMessage(STRING_SPE.d7elcdm04l714)}`}
                >
                    <CheckboxGroup options={options} value={this.state.customerInfoCheck} onChange={this.handleChange} />
                </FormItem>
            </Form>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        specialPromotion: state.sale_specialPromotion_NEW,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSpecialBasicInfo: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(StepTwo));
