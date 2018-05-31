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

if (process.env.__CLIENT__ === true) {
    // require('../../../../client/componentsPage.less');
}
const Immutable = require('immutable');

class StepTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            customerInfoCheck: ['customerName', 'cellnonono', 'customerBirthday', 'customerSex'],
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
            { label: '姓名', value: 'customerName' },
            { label: '手机号', value: 'cellnonono' },
            { label: '生日', value: 'customerBirthday' },
            { label: '性别', value: 'customerSex' },
            { label: '常用地址', value: 'address' },
            { label: '单位名称', value: 'companyName' },
            { label: '电子邮箱', value: 'customerEmail' },
            { label: '证件号码', value: 'IDCard' },
        ];
        return (
            <Form>
                <FormItem
                    label="完善资料选择"
                    className={styles.noPadding}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    validateStatus={this.state.valueFlag}
                    help={this.state.valueFlag == 'success' ? null : '至少选择一项'}
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
