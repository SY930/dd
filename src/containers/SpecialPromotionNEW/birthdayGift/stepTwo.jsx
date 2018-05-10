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
import { connect } from 'react-redux';
import { Form } from 'antd';
import { saleCenterSetSpecialBasicInfoAC } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
// import styles from '../../SaleCenterNEW/ActivityPage.less';
import SendMsgInfo from '../common/SendMsgInfo';
import CardLevel from '../common/CardLevel';

// const FormItem = Form.Item;

if (process.env.__CLIENT__ === true) {
    // require('../../../../client/componentsPage.less');
}

const Immutable = require('immutable');

class StepTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            settleUnitID: '',
            cardLevelIDList: [],
            cardLevelRangeType: '0',
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.onCardLevelChange = this.onCardLevelChange.bind(this);
    }

    handleSubmit() {
        let flag = true;
        const smsGate = this.props.specialPromotion.toJS().$eventInfo.smsGate;
        this.props.form.validateFieldsAndScroll((err1) => {
            if (err1) {
                flag = false;
            }
        });
        const opts = {
            smsTemplate: smsGate === '1' || smsGate === '3' || smsGate === '4' ? this.state.message : '',
            cardLevelIDList: this.state.cardLevelIDList || [],
            cardLevelRangeType: this.state.cardLevelRangeType,
        }
        if (smsGate === '1' || smsGate === '3' || smsGate === '4') {
            opts.settleUnitID = this.state.settleUnitID;
        }
        this.props.setSpecialBasicInfo(opts);
        return flag;
    }
    onCardLevelChange(obj) {
        this.setState(obj)
    }
    componentDidMount() {
        this.props.getSubmitFn({
            prev: undefined,
            next: this.handleSubmit,
            finish: undefined,
            cancel: undefined,
        });
        const specialPromotion = this.props.specialPromotion.get('$eventInfo').toJS();
        if (Object.keys(specialPromotion).length > 10) {
            this.setState({
                message: specialPromotion.smsTemplate,
                // cardLevelIDList: specialPromotion.cardLevelIDList,
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.specialPromotion.get('$eventInfo') !== nextProps.specialPromotion.get('$eventInfo') &&
            nextProps.specialPromotion.get('$eventInfo').size > 10) {
            const specialPromotion = nextProps.specialPromotion.get('$eventInfo').toJS();
            this.setState({
                message: specialPromotion.smsTemplate,
            })
        }
    }

    render() {
        const info = this.props.specialPromotion.get('$eventInfo').toJS();
        const sendFlag = info.smsGate === '1' || info.smsGate === '3' || info.smsGate === '4';
        return (
            <div>
                <CardLevel
                    onChange={this.onCardLevelChange}
                    catOrCard="cat"
                    type={this.props.type}
                    form={this.props.form}
                />
                <SendMsgInfo
                    sendFlag={sendFlag}
                    form={this.props.form}
                    value={sendFlag ? this.state.message.trim() : this.state.message}
                    settleUnitID={this.state.settleUnitID}
                    onChange={
                        (val) => {
                            if (val instanceof Object) {
                                if (val.settleUnitID) {
                                    this.setState({ settleUnitID: val.settleUnitID })
                                }
                            } else {
                                this.setState({ message: val });
                            }
                        }
                    }
                />
            </div>
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
