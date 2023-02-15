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
    message,
    TreeSelect,
    Radio,
} from 'antd';
import {
    saleCenterSetSpecialBasicInfoAC,
    getGroupCRMCustomAmount,
} from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import styles from '../../SaleCenterNEW/ActivityPage.less';
import SendMsgInfo from '../common/SendMsgInfo';
import { queryGroupMembersList } from '../../../redux/actions/saleCenterNEW/mySpecialActivities.action';
import { fetchPromotionScopeInfo } from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action';
import _ from 'lodash';
import { injectIntl } from 'i18n/common/injectDecorator'
import { STRING_SPE } from 'i18n/common/special';
import { axiosData} from '../../../helpers/util';

const moment = require('moment');
const Immutable = require('immutable');
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
@injectIntl
class Two extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            cardInfo: [],
            groupMembersID: '0',
            cardLevelRangeType: '0',//这里的这个字段跟别处不一样
            cardGroupName: '',
            cardCount: '',
            cardGroupRemark: '',
            settleUnitID: '',
            accountNo: '',
            localType:'5',
            filters:[],
            selectedTags:[],
            tagIncludes:[],
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.preProShops = this.preProShops.bind(this);
        this.renderOptions = this.renderOptions.bind(this);
    }

    handleSubmit() {
        let flag = true;
        let groupMembers = {};
        const smsGate = this.props.specialPromotion.toJS().$eventInfo.smsGate;
        this.state.cardInfo.map((info, index) => {
            if (this.state.groupMembersID == info.groupMembersID) {
                groupMembers = info;
            }
        })
        this.props.form.validateFieldsAndScroll((err1, basicValues) => {
            if (err1) {
                flag = false;
            }
        });
        if (flag) {
            const opts = {
                smsTemplate: smsGate == '1' || smsGate == '3' || smsGate == '4' ? this.state.message : '',
                isVipBirthdayMonth: this.state.isVipBirthdayMonth,
                cardGroupID: this.state.groupMembersID || '0',
                cardGroupName: groupMembers.groupMembersName,
                cardCount: groupMembers.totalMembers,
                cardGroupRemark: groupMembers.groupMembersRemark,
                cardLevelRangeType: (String(this.state.cardLevelRangeType) | '0') || (this.state.groupMembersID == '0' ? '0' : '2'),
                localType:this.state.localType
            }
            if(this.state.cardLevelRangeType == '7'){
                opts.customerRangeConditionIDs = this.state.selectedTags.map(item => item.tagRuleID)
            }
            if (smsGate == '1' || smsGate == '3' || smsGate == '4') {
                if (this.state.settleUnitID > 0 || this.state.accountNo > 0) {
                    opts.settleUnitID = this.state.settleUnitID;
                    opts.accountNo = this.state.accountNo;
                } else {
                    message.warning(`${this.props.intl.formatMessage(STRING_SPE.d34iceo4ec1176)}`)
                    return false;
                }
            } else {
                opts.settleUnitID = '0';
                opts.accountNo = '0';
            }

            this.props.setSpecialBasicInfo(opts)
        }

        return flag;
    }

    componentDidMount() {
        // return;
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
            next: this.handleSubmit,
            finish: undefined,
            cancel: undefined,
        });
        const specialPromotion = this.props.specialPromotion.get('$eventInfo').toJS();
        if (specialPromotion.groupMemberID) {
            this.setState({
                groupMembersID: specialPromotion.groupMemberID
            })
        }
        if (Object.keys(specialPromotion).length > 30) {
            this.setState({
                message: specialPromotion.smsTemplate,
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
                    cardInfo: nextProps.mySpecialActivities.$groupMembers.groupMembersList,
                })
            } else {
                this.setState({
                    cardInfo: [],
                })
            }
        }

        // 初始化店铺信息
        if (JSON.stringify(nextProps.promotionScopeInfo.getIn(['refs', 'data'])) !=
            JSON.stringify(this.props.promotionScopeInfo.getIn(['refs', 'data']))) {
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
        const cardInfo = this.state.cardInfo;
        const options = [];
        cardInfo.map((groupMembers, index) => {
            options.push(
                <Option key={groupMembers.groupMembersID}>{`${groupMembers.groupMembersName}【共${groupMembers.totalMembers}人】`}</Option>
            )
        });
        return options;
    }
    handleGroupOrCatRadioChange = (e) => {
        const type = e.target.value;
        if(type == '7'){
            this.setState({
                cardLevelRangeType:'7'
            })
        }
        this.setState({
            // cardLevelRangeType: type,此处该字段跟别的地方不一样
            localType: type,
            groupMembersID: undefined,
            selectedTags:null
        })
    }
    render() {
        const sendFlag = true;
        const smsGate = this.props.specialPromotion.get('$eventInfo').toJS().smsGate;
        const getFieldDecorator = this.props.form.getFieldDecorator;
        const totalCustomerCount = this.props.specialPromotion.get('customerCount');
        const groupMembersID = this.state.groupMembersID;
        const isDisableGroupSelect = typeof groupMembersID === 'string' && groupMembersID.includes && groupMembersID.includes('--');
        const {
            isBenefitJumpSendGift = false,
        } = this.props
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
        return (
            <Form>
                <FormItem
                    label="会员范围"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <RadioGroup onChange={this.handleGroupOrCatRadioChange} value={`${this.state.localType}`} disabled={isDisableGroupSelect}>
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
                {
                    smsGate == '1' || smsGate == '3' || smsGate == '4' ?
                        <SendMsgInfo
                            sendFlag={sendFlag}
                            form={this.props.form}
                            value={this.state.message}
                            settleUnitID={this.state.settleUnitID}
                            isBenefitJumpSendGift={isBenefitJumpSendGift}
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
                        /> :
                        null
                }
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

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Two));
