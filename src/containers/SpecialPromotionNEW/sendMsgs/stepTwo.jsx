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
import {
    Form,
    Select,
    Input,
    Radio,
    Row,
    Col,
    TreeSelect,
    message,
} from 'antd';
import { injectIntl } from 'i18n/common/injectDecorator'
import { STRING_SPE } from 'i18n/common/special';




const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

import {
    saleCenterSetSpecialBasicInfoAC,
    getGroupCRMCustomAmount,
} from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import styles from '../../SaleCenterNEW/ActivityPage.less';
import SendMsgInfo from '../common/SendMsgInfo';
import { queryGroupMembersList } from '../../../redux/actions/saleCenterNEW/mySpecialActivities.action'
import { fetchPromotionScopeInfo } from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action';
import _ from 'lodash';
import { axiosData } from 'helpers/util';

const moment = require('moment');

const Immutable = require('immutable');
@injectIntl
class StepTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            groupMembersList: [],
            lastTransTimeFilter: '0', // 最后消费时间限制
            lastTransTime: '', // 最后消费时间
            lastTransShopID: '0', // 最后消费店铺ID
            lastTransShopName: `${this.props.intl.formatMessage(STRING_SPE.dk45j2cah113227)}`, // 最后消费店铺名称
            isVipBirthdayMonth: '0', // 当月生日
            shopsData: [],
            groupMembersID: '0',
            cardLevelRangeType: '0',
            cardGroupName: '',
            cardCount: '',
            settleUnitID: '',
            accountNo: '',
            testPhoneNumber: undefined,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.TimeChange = this.TimeChange.bind(this);
        this.TimeFilterChange = this.TimeFilterChange.bind(this);
        this.onShopChange = this.onShopChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleVipBirthdayMonthChange = this.handleVipBirthdayMonthChange.bind(this);
        this.preProShops = this.preProShops.bind(this);
        this.renderOptions = this.renderOptions.bind(this);
    }

    validate() {
        let flag = true;
        this.props.form.validateFieldsAndScroll((err1, basicValues) => {
            if (err1) {
                flag = false;
            }
        });
        // 对权益账户短信条数做校验
        if (flag && this.state.accountNo > 0) {
            const equityAccountInfoList = this.props.specialPromotion.get('$eventInfo').toJS().equityAccountInfoList || [];
            const equityAccountInfo = equityAccountInfoList.find(item => item.accountNo === this.state.accountNo) || {};
            if (!(this.getMinMessageCount() <= equityAccountInfo.smsCount)) {
                flag = false;
                message.warning('所选权益账户短信条数不足，请更换账户或充值')
            }
        }
        // 校验最后消费时间
        if (this.state.lastTransTimeFilter != '0' && (this.state.lastTransTime == '' || this.state.lastTransTime == '0')) {
            flag = false;
        }
        return flag;
    }
    handleSubmit() {
        let groupMembers = {};
        this.state.groupMembersList.map((info, index) => {
            if (this.state.groupMembersID == info.groupMembersID) {
                groupMembers = info;
            }
        });
        let flag = this.validate();
        if (flag) {
            this.props.setSpecialBasicInfo({
                smsTemplate: this.state.message,
                lastTransTimeFilter: this.state.lastTransTimeFilter,
                lastTransTime: this.state.lastTransTime || '',
                lastTransShopID: this.state.lastTransShopID,
                lastTransShopName: this.state.lastTransShopName,
                isVipBirthdayMonth: this.state.isVipBirthdayMonth,
                cardGroupID: this.state.groupMembersID || '0',
                cardGroupName: groupMembers.groupMembersName,
                cardCount: groupMembers.totalMembers,
                cardGroupRemark: groupMembers.groupMembersRemark,
                cardLevelRangeType: this.state.cardLevelRangeType || '0',
                settleUnitID: this.state.settleUnitID || '0',
                accountNo: this.state.accountNo,
            })
        }
        return flag;
    }

    componentDidMount() {
        const user = this.props.user;
        const opts = {
            _groupID: user.accountInfo.groupID, // 集团id
            pageNo: 1,
            pageSize: 1000,
        };
        this.props.queryGroupMembersList(opts);
        this.props.getSubmitFn({
            prev: undefined,
            next: undefined,
            finish: this.handleSubmit,
            cancel: undefined,
        });
        const specialPromotion = this.props.specialPromotion.get('$eventInfo').toJS();
        if (Object.keys(specialPromotion).length > 30) {
            this.setState({
                message: specialPromotion.smsTemplate,
                lastTransTimeFilter: specialPromotion.lastTransTimeFilter,
                lastTransTime: specialPromotion.lastTransTime,
                lastTransShopID: specialPromotion.lastTransShopID,
                lastTransShopName: specialPromotion.lastTransShopName,
                isVipBirthdayMonth: specialPromotion.isVipBirthdayMonth,
                groupMembersID: specialPromotion.cardGroupID || '0',
                cardGroupName: specialPromotion.groupMembersName,
                cardCount: specialPromotion.totalMembers,
                cardGroupRemark: specialPromotion.groupMembersRemark,
                cardLevelRangeType: specialPromotion.cardLevelRangeType || '0',
            })
        }
        // 初始化店铺信息
        if (!this.props.promotionScopeInfo.getIn(['refs', 'initialized'])) {
            this.props.fetchPromotionScopeInfo({ _groupID: this.props.user.accountInfo.groupID });
        } else {
            const $shops = Immutable.List.isList(this.props.promotionScopeInfo.getIn(['refs', 'data', 'shops'])) ?
                this.props.promotionScopeInfo.getIn(['refs', 'data', 'shops']).toJS() :
                this.props.promotionScopeInfo.getIn(['refs', 'data', 'shops']);
            this.setState({
                shopsData: this.preProShops($shops),
            });
        }
        if (!this.props.specialPromotion.get('customerCount')) {
            this.props.getGroupCRMCustomAmount()
        }
    }

    componentWillReceiveProps(nextProps) {
        // 修改时,初始化state
        if (this.props.specialPromotion.get('$eventInfo') != nextProps.specialPromotion.get('$eventInfo') &&
            nextProps.specialPromotion.get('$eventInfo').size > 30) {
            const specialPromotion = nextProps.specialPromotion.get('$eventInfo').toJS();
            this.setState({
                message: specialPromotion.smsTemplate,
                lastTransTimeFilter: specialPromotion.lastTransTimeFilter,
                lastTransTime: specialPromotion.lastTransTime,
                lastTransShopID: specialPromotion.lastTransShopID,
                lastTransShopName: specialPromotion.lastTransShopName,
                isVipBirthdayMonth: specialPromotion.isVipBirthdayMonth,
                groupMembersID: specialPromotion.cardGroupID || '0',
                cardGroupName: specialPromotion.groupMembersName,
                cardCount: specialPromotion.totalMembers,
                cardGroupRemark: specialPromotion.groupMembersRemark,
                cardLevelRangeType: specialPromotion.cardLevelRangeType || '0',
            })
        }
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

        // 初始化店铺信息
        if (nextProps.promotionScopeInfo.getIn(['refs', 'data']) !=
            this.props.promotionScopeInfo.getIn(['refs', 'data'])) {
            const $shops = Immutable.List.isList(nextProps.promotionScopeInfo.getIn(['refs', 'data', 'shops'])) ?
                nextProps.promotionScopeInfo.getIn(['refs', 'data', 'shops']).toJS() :
                nextProps.promotionScopeInfo.getIn(['refs', 'data', 'shops']);
            this.setState({
                shopsData: this.preProShops($shops),
            });
        }
    }

    // isVipBirthdayMonth change
    handleVipBirthdayMonthChange(e) {
        this.setState({
            isVipBirthdayMonth: e.target.value,
        });
    }
    // 拼接treeSelect数据
    preProShops(data) {
        const itemArray = [];
        const hh = _.groupBy(data, 'cityID');
        _.forEach(hh, (item, key) => {
            const ff = _.map(item, (_item) => {
                return _.pick(_item, ['shopName', 'shopID']);
            }).map((shop) => {
                return { content: shop.shopName, id: `${shop.shopID},${shop.shopName}` }
            });
            itemArray.push({
                province: { id: key, content: item[0].cityName },
                cities: ff,
            });
        });
        const shopsData = [];
        _.forEach(itemArray, (item, key) => {
            const children = [];
            _.forEach(item.cities, (city, index) => {
                children.push({
                    label: city.content,
                    value: String(city.id),
                    key: `${key}${index}`,
                })
            });
            shopsData.push({
                label: item.province.content,
                value: '',
                key,
                children,
            })
        });
        shopsData.unshift({
            label: `${this.props.intl.formatMessage(STRING_SPE.dk45j2cah113227)}`,
            value: `0,${this.props.intl.formatMessage(STRING_SPE.dk45j2cah113227)}`,
            key: '0',
        });
        return shopsData;
    }

    // lastTransTimeFilter change
    TimeFilterChange(val) {
        // 不限制的时候把日期置空
        if (val == '0') {
            this.setState({
                lastTransTimeFilter: val,
                lastTransTimeStatus: 'success',
                lastTransTime: '',
            })
        } else {
            this.setState({
                lastTransTimeFilter: val,
            })
        }
    }
    // lastTransTime change
    TimeChange(val) {
        if (val == null) {
            this.setState({
                lastTransTimeStatus: 'error',
                lastTransTime: null,
            })
        } else {
            this.setState({
                lastTransTime: val.format('YYYYMMDD'),
                lastTransTimeStatus: 'success',
            })
        }
    }
    // 最后购买店铺 change
    onShopChange(val) {
        if (val == undefined || val == '') {
            return
        }
        const nameAndID = val.split(',');
        this.setState({
            lastTransShopID: nameAndID[0],
            lastTransShopName: nameAndID[1],
        })
    }

    handleSelectChange(value) {
        if (value == '0') {
            this.setState({
                groupMembersID: value,
                cardLevelRangeType: '0',
            })
        } else {
            this.setState({
                groupMembersID: value,
                cardLevelRangeType: '2',
            })
        }
    }
    // 会员等级Option
    renderOptions() {
<<<<<<< HEAD
        const groupMembersList = this.state.groupMembersList;
        return groupMembersList.map((groupMembers) => (
            <Option key={groupMembers.groupMembersID}>{`${groupMembers.groupMembersName}【共${groupMembers.totalMembers}人】`}</Option>
        ));
    }
    getMinMessageCount() {
        const { groupMembersList, groupMembersID } = this.state;
        const totalCustomerCount = this.props.specialPromotion.get('customerCount');
        if (groupMembersID > 0) {
            const groupMemberItem = groupMembersList.find(item => item.groupMembersID === groupMembersID) || {};
            return groupMemberItem.totalMembers || 0;
        }
        return totalCustomerCount || 0;
    }
    /**
     * 测试手机号是否输入合法
     */
    testPhoneNumberValidation() {
        const { testPhoneNumber } = this.state;
        if (!testPhoneNumber || /^[0-9]{11}$/.test(testPhoneNumber)) {
            return { status: 'success' };
        }
        return {
            status: 'error',
            help: '请输入11位手机号',
        };
    }
    handleSMSTest = () => {
        if (this.validate()) {
            const { accountNo, testPhoneNumber, message: smsTemplate } = this.state;
            axiosData(
                '/specialPromotion/sendSmsToCustomer.ajax',
                {
                    accountNo,
                    signID: this.props.specialPromotion.getIn(['$eventInfo', 'signID']),
                    customerMobile: testPhoneNumber,
                    smsTemplate,
                },
                null,
                {},
                'HTTP_SERVICE_URL_PROMOTION_NEW'
            ).then(_ => {
                message.success('发送成功')
            })
        }
=======
        const cardInfo = this.state.cardInfo;
        const options = [];
        cardInfo.map((groupMembers) => {
            options.push(
                <Option key={groupMembers.groupMembersID}>{`${groupMembers.groupMembersName}【${this.props.intl.formatMessage(STRING_SPE.dk46lj779a7119)}${groupMembers.totalMembers}${this.props.intl.formatMessage(STRING_SPE.de8fb5g9597216)}`}</Option>
            )
        });
        return options;
>>>>>>> i18n-gfz-merge
    }

    render() {
        const sendFlag = true;
        let { lastTransTimeFilter, lastTransTime, lastTransShopID, lastTransShopName, lastTransTimeStatus } = this.state,
            // treeselect props
            treeProps = {
                treeData: this.state.shopsData,
                showSearch: true,
                onChange: this.onShopChange,
                showCheckedStrategy: SHOW_PARENT,
                searchPlaceholder: `${this.props.intl.formatMessage(STRING_SPE.d7h83a8d5h30160)}`,
                treeNodeFilterProp: 'label',
                allowClear: true,
                getPopupContainer: () => document.querySelector('.crmOperationTree'),
            },
            lastTimeProps = {
                onChange: this.TimeChange,
            },
            getFieldDecorator = this.props.form.getFieldDecorator;

        // treeSelect value: 店铺ID,店铺Name
        if (lastTransShopID !== '' && lastTransShopName !== '') {
            treeProps.value = `${lastTransShopID},${lastTransShopName}`
        }
        // 字符串转成moment
        if (lastTransTime !== '' && lastTransTime !== '0' && lastTransTime !== null) {
            lastTimeProps.value = moment(lastTransTime, 'YYYYMMDD')
        }

        if (lastTransTimeFilter == '0') {
            lastTimeProps.disabled = true;
            lastTimeProps.value = '';
        }
        const totalCustomerCount = this.props.specialPromotion.get('customerCount');
        return (
            <Form>
                <FormItem
                    label={this.props.intl.formatMessage(STRING_SPE.dd5a33b5g874114)}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {getFieldDecorator('setgroupMembersID', {
                        rules: [{
                            required: true,
                            message: `${this.props.intl.formatMessage(STRING_SPE.d2b1b731e10c5106)}`,
                        }],
                        initialValue: this.state.groupMembersID,
                    })(
                        <Select
                            style={{ width: '100%' }}
                            showSearch
                            notFoundContent={`${this.props.intl.formatMessage(STRING_SPE.d2c8a4hdjl248)}`}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            placeholder={this.props.intl.formatMessage(STRING_SPE.d7h7g9a5h130183)}
                            getPopupContainer={(node) => node.parentNode}
                            onChange={this.handleSelectChange}
                        >
                            <Option key={'0'}>{totalCustomerCount ? `${this.props.intl.formatMessage(STRING_SPE.d2b1b731e10c6117)}${totalCustomerCount}${this.props.intl.formatMessage(STRING_SPE.de8fb5g9597216)}` : `${this.props.intl.formatMessage(STRING_SPE.d1kgd7kahd0869)}`}</Option>
                            {this.renderOptions()}
                        </Select>
                    )
                    }
                </FormItem>
                <SendMsgInfo
                    sendFlag={sendFlag}
                    form={this.props.form}
                    value={this.state.message}
                    settleUnitID={this.state.settleUnitID}
                    minMessageCount={this.getMinMessageCount()}
                    onChange={
                        (val) => {
                            if (val instanceof Object) {
                                if (val.settleUnitID) {
                                    this.setState({ settleUnitID: val.settleUnitID })
                                }
                                if (val.accountNo) {
                                    this.setState({ accountNo: val.accountNo })
                                }
                            } else {
                                this.setState({ message: val });
                            }
                        }
                    }
                />
                <FormItem
                    label="测试发送"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                    validateStatus={this.testPhoneNumberValidation().status}
                    help={this.testPhoneNumberValidation().help}
                >
                    <Row gutter={16}>
                        <Col span={18}>
                            <Input
                                value={this.state.testPhoneNumber}
                                placeholder="请输入测试手机号，用于测试短信显示效果"
                                onChange={({ target: { value } }) => this.setState({ testPhoneNumber: value })}
                            />
                        </Col>
                        <Col span={6}>
                            <a
                                disabled={!this.state.testPhoneNumber || this.testPhoneNumberValidation().status === 'error'}
                                style={{ lineHeight: '28px' }}
                                onClick={this.handleSMSTest}
                            >
                                测试发送
                            </a>
                        </Col>
                    </Row>
                </FormItem>
            </Form>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        specialPromotion: state.sale_specialPromotion_NEW,
        user: state.user.toJS(),
        mySpecialActivities: state.sale_mySpecialActivities_NEW.toJS(),
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,

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
        fetchPromotionScopeInfo: (opts) => {
            dispatch(fetchPromotionScopeInfo(opts));
        },
        getGroupCRMCustomAmount: opts => dispatch(getGroupCRMCustomAmount(opts)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(StepTwo));
