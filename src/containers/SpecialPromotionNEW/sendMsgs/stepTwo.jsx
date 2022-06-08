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

import { STRING_GIFT } from 'i18n/common/gift';


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
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';

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

            localType:'5',
            filters:[],
            selectedTags:[],
            tagIncludes:[],
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
        console.log(this.state.localType,'this.state.cardLevelRangeType')
        if (flag && this.state.accountNo > 0 && this.state.localType == '5') {
            const equityAccountInfoList = this.props.specialPromotion.get('$eventInfo').toJS().equityAccountInfoList || [];
            const equityAccountInfo = equityAccountInfoList.find(item => item.accountNo === this.state.accountNo) || {};
            console.log(this.getMinMessageCount(),this.state.cardLevelRangeType,equityAccountInfo.smsCount,'equityAccountInfo.smsCount')
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
            const opts = {
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
                cardLevelRangeType:  (this.state.cardLevelRangeType | 0) || (this.state.groupMembersID == '0' ? '0' : '2'),
                settleUnitID: this.state.settleUnitID || '0',
                accountNo: this.state.accountNo,
            }
            console.log(this.state.cardLevelRangeType,'this.state.cardLevelRangeType--------->>>>>>>')
            if(this.state.cardLevelRangeType == '7'){
                opts.customerRangeConditionIDs = this.state.selectedTags.map(item => item.tagRuleID)
            }
            this.props.setSpecialBasicInfo(opts)
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
        this.queryTagData();
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
                localType:specialPromotion.cardLevelRangeType == '7' ? '7' : '5',
                customerRangeConditionIDs:specialPromotion.customerRangeConditionIDs
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
                localType:specialPromotion.cardLevelRangeType == '7' ? '7' : '5',
                customerRangeConditionIDs:specialPromotion.customerRangeConditionIDs
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
    //获取标签树
    queryTagData = () => {
        const params = {
            groupID: this.props.$$groupID,
            tagTypeIDs: '1,2,3,4,5'
        }
        axiosData(
            '/tag/tagService_queryAllTagsByTagTypeID.ajax',
            params,
            {},
            { path: '' }
        ).then((res) => {
            if (res.code === '000') {
                const filters = this.orgCateData(res.data.tagTypes, res.data.tagRuleDetails)
                this.setState({
                    filters,
                    tagRuleDetails: res.data.tagRuleDetails
                },() => {
                    let { customerRangeConditionIDs } = this.props.specialPromotion.get('$eventInfo').toJS();
                    let useData = [];
                    let selectTags = [];
                    if(res.data.tagRuleDetails && res.data.tagRuleDetails.length > 0){
                        if(customerRangeConditionIDs && customerRangeConditionIDs.length > 0){
                            res.data.tagRuleDetails.map(item => {
                                customerRangeConditionIDs.map(d => {
                                    if(item.tagRuleID == d){
                                        useData.push(item.tagRuleID + '@@' + item.tagTypeID + '@@' + item.tagName);
                                        selectTags.push({
                                            tagRuleID:item.tagRuleID,
                                            tagTypeID:item.tagTypeID,
                                            tagName:item.tagName
                                        })
                                    }
                                })
                            })
                        }
                    }
                    this.setState({
                        tagIncludes:useData,
                        selectedTags:selectTags
                    })
                })
            } else {
                message.error(res.message)
            }
        })
    }

    orgCateData = (arr = [], details = []) => {
        arr = arr.filter((item)=>{
            return item.categoryEntries && item.categoryEntries.length > 0
        })
        return arr.map((item, index) => {
            return {
                ...item,
                label: item.tagTypeName,
                key: item.tagTypeID,
                value: item.tagTypeID,
                children: item.categoryEntries.map((every) => {
                    return {
                        ...every,
                        key: every.tagCategoryID,
                        value: every.tagCategoryID,
                        label: every.tagCategoryName,
                        children: this.getChildren(every.tagRuleIDs, details)
                    }
                }),
            }
        })
    }

    getChildren(tags, details) {
        let child = []
        tags && tags.length > 0 && tags.map((i) => {
            details.map((j) => {
                if (j.tagRuleID == i) {
                    child.push({
                        key: j.tagRuleID,
                        value: j.tagRuleID + '@@' + j.tagTypeID + '@@' + j.tagName,
                        label: j.tagName,
                    })
                }
            })
        })
        return child
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
        const groupMembersList = this.state.groupMembersList;
        return groupMembersList.map((groupMembers) => (
            <Option key={groupMembers.groupMembersID}>{`${groupMembers.groupMembersName}【共${groupMembers.totalMembers}人】`}</Option>
        ));
    }
    getMinMessageCount() {
        const { groupMembersList, groupMembersID } = this.state;
        const totalCustomerCount = this.props.specialPromotion.get('customerCount');
        console.log(totalCustomerCount,'totalCustomerCounttotalCustomerCount')
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
            help: this.props.intl.formatMessage(STRING_GIFT.doj6r3ijy267),
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
    }
    handleGroupOrCatRadioChange = (e) => {
        const type = e.target.value;
        this.setState({
            cardLevelRangeType: type,//此处该字段跟别的地方不一样
            localType: type,
            groupMembersID: undefined,
            selectedTags:null
        })
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
        const groupMembersID = this.state.groupMembersID;
        const isDisableGroupSelect = typeof groupMembersID === 'string' && groupMembersID.includes && groupMembersID.includes('--');
        const labelProps1 = {
            treeData: this.state.filters,
            value: this.state.tagIncludes,
            defaultValue: [],
            onChange: (e) => {
                let tagIn = []
                e.map((i) => {
                    let tag = {}
                    tag.tagRuleID = i.split('@@')[0]
                    tag.tagTypeID = i.split('@@')[1]
                    tag.tagName = i.split('@@')[2]
                    tagIn.push(tag)
                })
                this.setState({ selectedTags: tagIn, tagIncludes: e })
            },
            treeCheckable: true,
            showCheckedStrategy: TreeSelect.SHOW_CHILD,
            searchPlaceholder: '请选择会员标签',
            style: {
                width: 472, 
                maxHeight:96,
                overflow:'auto',
                // border:'1px solid #d9d9d9',
                borderRadius:'3px'
            },
            dropdownStyle: { maxHeight: 275, overflow: 'auto' },
        };
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
                    label="会员范围"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <RadioGroup onChange={this.handleGroupOrCatRadioChange} value={`${this.state.localType}`}>
                        <Radio key={'5'} value={'5'}>会员群体</Radio>
                        <Radio key={'7'} value={'7'}>会员标签</Radio>
                    </RadioGroup>
                </FormItem>
                {
                    this.state.localType == '5' ? 
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
                                disabled={this.props.isBenefitJumpSendGift || isDisableGroupSelect}
                                showSearch
                                notFoundContent={`${this.props.intl.formatMessage(STRING_SPE.d2c8a4hdjl248)}`}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                style={{ width: '100%' }}
                                placeholder={this.props.intl.formatMessage(STRING_SPE.d2b1b731e10c5106)}
                                getPopupContainer={(node) => node.parentNode}
                                onChange={this.handleSelectChange}
                            >
                                <Option key={'0'}>{totalCustomerCount ? `${this.props.intl.formatMessage(STRING_SPE.d2b1b731e10c6117)}${totalCustomerCount}${this.props.intl.formatMessage(STRING_SPE.de8fb5g9597216)}` : `${this.props.intl.formatMessage(STRING_SPE.d1kgd7kahd0869)}`}</Option>
                                {this.renderOptions()}
                            </Select>
                        )
                        }
                    </FormItem> : null
                }
                {
                    this.state.localType == '7' ? 
                        <FormItem
                            label={`会员标签`}
                            className={styles.FormItemStyle}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 17 }}
                        >
                            {this.props.form.getFieldDecorator('selectedTags', {
                                rules: [{
                                    required: true,
                                    message: `请选择会员标签`,
                                }],
                                initialValue: this.state.tagIncludes,
                            })(<TreeSelect {...labelProps1} className={styles.treeSelect}/>)
                            }
                        </FormItem> : null
                }
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
                    label={SALE_LABEL.k6hhua13}
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
                                placeholder={this.props.intl.formatMessage(SALE_STRING.k6hhua9f)}
                                onChange={({ target: { value } }) => this.setState({ testPhoneNumber: value })}
                            />
                        </Col>
                        <Col span={6}>
                            <a
                                disabled={!this.state.testPhoneNumber || this.testPhoneNumberValidation().status === 'error'}
                                style={{ lineHeight: '28px' }}
                                onClick={this.handleSMSTest}
                            >
                                {SALE_LABEL.k6hhua13}
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
