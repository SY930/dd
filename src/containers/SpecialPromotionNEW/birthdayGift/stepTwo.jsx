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
import { Form, Select } from 'antd';
import styles from '../../SaleCenterNEW/ActivityPage.less';
import { saleCenterSetSpecialBasicInfoAC } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
// import styles from '../../SaleCenterNEW/ActivityPage.less';
import SendMsgInfo from '../common/SendMsgInfo';
import CardLevel from '../common/CardLevel';
import {queryGroupMembersList} from "../../../redux/actions/saleCenterNEW/mySpecialActivities.action";

// const FormItem = Form.Item;

if (process.env.__CLIENT__ === true) {
    // require('../../../../client/componentsPage.less');
}
const FormItem = Form.Item;
const Option = Select.Option;
const Immutable = require('immutable');

class StepTwo extends React.Component {
    constructor(props) {
        super(props);
        let cardLevelRangeType = this.props.specialPromotion.getIn(['$eventInfo', 'cardLevelRangeType']);
        if (cardLevelRangeType === undefined) {
            cardLevelRangeType = this.props.type == '51' ? '5' : '0';
        }
        this.state = {
            message: '',
            settleUnitID: '',
            cardLevelIDList: [],
            groupMembersID: this.props.specialPromotion.getIn(['$eventInfo', 'cardGroupID']),
            groupMembersList: [],
            cardLevelRangeType: cardLevelRangeType,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
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
        };
        if (this.props.type == '51' && this.state.cardLevelRangeType == 5) {
            if (!this.state.groupMembersID) {
                this.props.form.setFields({
                    setgroupMembersID: {
                        errors: [new Error('请选择会员群体')],
                    },
                });
                return false;
            } else {
                opts.cardGroupID = this.state.groupMembersID;
            }
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
        const user = this.props.user;
        const opts = {
            _groupID: user.accountInfo.groupID, // 集团id
            pageNo: 1,
            pageSize: 1000,
        };
        this.props.queryGroupMembersList(opts);
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
        if (this.props.type == '51' ) {
            // 获取会员等级信息
            if (nextProps.mySpecialActivities.$groupMembers) {
                if (nextProps.mySpecialActivities.$groupMembers.groupMembersList instanceof Array && nextProps.mySpecialActivities.$groupMembers.groupMembersList.length > 0) {
                    this.setState({
                        groupMembersList: nextProps.mySpecialActivities.$groupMembers.groupMembersList,
                    })
                } else {
                    this.setState({
                        groupMembersList: [],
                    })
                }
            }
            if (this.props.specialPromotion.getIn(['$eventInfo', 'cardLevelRangeType']) !== nextProps.specialPromotion.getIn(['$eventInfo', 'cardLevelRangeType'])) {
                const type = nextProps.specialPromotion.getIn(['$eventInfo', 'cardLevelRangeType']);
                this.setState({cardLevelRangeType: type === undefined ? nextProps.props.type == '51' ? '5' : '0' : type});
            }
            if (this.props.specialPromotion.getIn(['$eventInfo', 'cardGroupID']) !== nextProps.specialPromotion.getIn(['$eventInfo', 'cardGroupID'])) {
                this.setState({cardGroupID: nextProps.specialPromotion.getIn(['$eventInfo', 'cardGroupID'])});
            }
        }
    }
    // 会员群体Option
    renderOptions() {
        return  this.state.groupMembersList.map((groupMembers, index) => <Option key={groupMembers.groupMembersID}>{`${groupMembers.groupMembersName}【共${groupMembers.totalMembers}人】`}</Option>);

    }
    handleSelectChange(value) {
        this.setState({groupMembersID: value});
    }

    render() {
        const info = this.props.specialPromotion.get('$eventInfo').toJS();
        const sendFlag = info.smsGate === '1' || info.smsGate === '3' || info.smsGate === '4';
        return (
            <div>
                {this.props.type == '51' && this.state.cardLevelRangeType == 5 ?
                    <FormItem
                        label="会员群体"
                        className={styles.FormItemStyle}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17 }}
                    >
                        {this.props.form.getFieldDecorator('setgroupMembersID', {
                            rules: [{
                                required: true,
                                message: '请选择会员群体',
                            }],
                            initialValue: this.state.groupMembersID,
                        })(
                            <Select
                                style={{ width: '100%' }}
                                placeholder="请选择会员群体"
                                getPopupContainer={(node) => node.parentNode}
                                onChange={this.handleSelectChange}
                            >
                                <Option key={'0'}>全部会员</Option>
                                {this.renderOptions()}
                            </Select>
                        )
                        }
                    </FormItem>
                    :
                    <CardLevel
                        onChange={this.onCardLevelChange}
                        catOrCard="cat"
                        type={this.props.type}
                        form={this.props.form}
                    />}
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
        user: state.user.toJS(),
        mySpecialActivities: state.sale_mySpecialActivities_NEW.toJS(),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSpecialBasicInfo: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
        queryGroupMembersList: (opts) => {
            dispatch(queryGroupMembersList(opts));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(StepTwo));
