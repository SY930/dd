/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-03-15T10:50:38+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: promotionScopeInfo.jsx
 * @Last modified by:   xf
 * @Last modified time: 2017-04-08T16:46:12+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */

import React from 'react';
import {connect} from 'react-redux';
import {
    Row,
    Col,
    Form,
    Button,
    Input
} from 'antd';
const FormItem = Form.Item;

import {saleCenterSetSpecialBasicInfoAC} from '../../../redux/actions/saleCenter/specialPromotion.action'
import styles from '../../SaleCenter/ActivityPage.less';
import SendMsgInfo from '../common/SendMsgInfo';
if (process.env.__CLIENT__ === true) {
    require('../../../components/common/components.less');
}

let Immutable = require('immutable');

class StepTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message:'',
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit() {
        let flag = true;
        this.props.form.validateFieldsAndScroll((err1, basicValues) => {
            if (err1) {
                flag = false;
            }

            if(flag){
                const info = this.props.specialPromotion.get('$eventInfo').toJS();
                if(info.smsGate == '1' || info.smsGate == '3' || info.smsGate == '4'){
                    this.props.setSpecialBasicInfo({
                        smsTemplate:this.state.message
                    })
                }else{
                    this.props.setSpecialBasicInfo({
                        smsTemplate:''
                    })
                }
            }
        });

        return flag;
    }

    componentDidMount() {
        this.props.getSubmitFn({
            prev: undefined,
            next: this.handleSubmit,
            finish: undefined,
            cancel: undefined
        });
        let specialPromotion = this.props.specialPromotion.get('$eventInfo').toJS();
        if(Object.keys(specialPromotion).length >10 ){
            this.setState({
                message:specialPromotion.smsTemplate
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.specialPromotion.get('$eventInfo') != nextProps.specialPromotion.get('$eventInfo') &&
            nextProps.specialPromotion.get('$eventInfo').size >10 ){
            let specialPromotion = nextProps.specialPromotion.get('$eventInfo').toJS();
            this.setState({
                message:specialPromotion.smsTemplate
            })
        }
    }

    render() {
        const info = this.props.specialPromotion.get('$eventInfo').toJS();
        let sendFlag = info.smsGate =='1' || info.smsGate=='3' || info.smsGate=='4';
        return (
            <Form>
                <SendMsgInfo
                    sendFlag={sendFlag}
                    form ={this.props.form}
                    value={this.state.message}
                    onChange={
                        (val)=>{
                            this.setState({message: val});
                        }
                    }
                />
            </Form>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        specialPromotion: state.sale_old_specialPromotion
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSpecialBasicInfo:(opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(StepTwo));
