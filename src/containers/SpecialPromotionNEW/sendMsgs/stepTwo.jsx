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
    DatePicker,
    Select,
    Col,
    Radio,
    TreeSelect,
} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

import { saleCenterSetSpecialBasicInfoAC } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import styles from '../../SaleCenterNEW/ActivityPage.less';
import SendMsgInfo from '../common/SendMsgInfo';
import { queryGroupMembersList } from '../../../redux/actions/saleCenterNEW/mySpecialActivities.action'
import { fetchPromotionScopeInfo } from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action';
import _ from 'lodash';

const moment = require('moment');

if (process.env.__CLIENT__ === true) {
    // require('../../../../client/componentsPage.less');
}

const Immutable = require('immutable');

class StepTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            cardInfo: [],
            lastTransTimeFilter: '0', // 最后消费时间限制
            lastTransTime: '', // 最后消费时间
            lastTransTimeStatus: 'success', // 最后消费时间校验状态
            lastTransShopID: '0', // 最后消费店铺ID
            lastTransShopName: '不限', // 最后消费店铺名称
            isVipBirthdayMonth: '0', // 当月生日
            shopsData: [],
            groupMembersID: '0',
            cardLevelRangeType: '0',
            cardGroupName: '',
            cardCount: '',
            settleUnitID: '',
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

    handleSubmit() {
        let flag = true;
        let groupMembers = {};
        this.state.cardInfo.map((info, index) => {
            if (this.state.groupMembersID == info.groupMembersID) {
                groupMembers = info;
            }
        })
        this.props.form.validateFieldsAndScroll((err1, basicValues) => {
            if (err1) {
                flag = false;
            }
            // 校验最后消费时间
            if (this.state.lastTransTimeFilter != '0' && (this.state.lastTransTime == '' || this.state.lastTransTime == '0')) {
                flag = false;
                this.setState({
                    lastTransTimeStatus: 'error',
                })
            }
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
                    settleUnitID: this.state.settleUnitID,
                })
            }
        });

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
            label: '不限',
            value: '0,不限',
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
        const cardInfo = this.state.cardInfo;
        const options = [];
        cardInfo.map((groupMembers) => {
            options.push(
                <Option key={groupMembers.groupMembersID}>{`${groupMembers.groupMembersName}【共${groupMembers.totalMembers}人】`}</Option>
            )
        });
        return options;
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
                searchPlaceholder: '请搜索店铺',
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
        return (
            <Form>
                {/* <FormItem
                    label="最后消费日期"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >

                    <Col span={11} className="selectContanier">
                        <FormItem className={styles.FormItemStyle} >
                            <Select
                                size="default"
                                value={`${lastTransTimeFilter}`}
                                onChange={this.TimeFilterChange}
                                getPopupContainer={() => document.querySelector('.selectContanier')}
                            >
                                <Option value={'0'}>不限制</Option>
                                <Option value={'1'}>早于</Option>
                                <Option value={'2'}>晚于</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={12} offset={1}>
                        <FormItem className={styles.FormItemStyle} validateStatus={lastTransTimeStatus} help={lastTransTimeStatus == 'success' ? null : '请选择最后消费日期'}>

                            <DatePicker disabled={lastTransTimeFilter == '0'} {...lastTimeProps} />
                        </FormItem>
                    </Col>
                </FormItem> */}

                {/* <FormItem
                    label="最后消费店铺"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <Col span={24} className="crmOperationTree">
                        <TreeSelect {...treeProps} />
                    </Col>
                </FormItem> */}
                <FormItem
                    label="会员群体"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {getFieldDecorator('setgroupMembersID', {
                        rules: [{
                            required: true,
                            message: '请选择会员群体',
                        }],
                        initialValue: this.state.groupMembersID,
                    })(
                        <Select
                            style={{ width: '100%' }}
                            placeholder="请选择会员群体"
                            onChange={this.handleSelectChange}
                        >
                            <Option key={'0'}>全部会员</Option>
                            {this.renderOptions()}
                        </Select>
                    )
                    }
                </FormItem>
                {/* <FormItem
                    label="其他限制"
                    className={[styles.noPadding, styles.firstRadio].join(' ')}
                    wrapperCol={{ span: 17 }}
                    labelCol={{ span: 4 }}
                >
                    <RadioGroup onChange={this.handleVipBirthdayMonthChange} value={`${this.state.isVipBirthdayMonth}`}>
                        <Radio value={'0'} key={0}>不限制</Radio>
                        <Radio value={'1'} key={1}>仅限本月生日的会员参与</Radio>
                    </RadioGroup>
                </FormItem> */}

                <SendMsgInfo
                    sendFlag={sendFlag}
                    form={this.props.form}
                    value={this.state.message.trim()}
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(StepTwo));
