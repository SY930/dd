import React from 'react'
import { Form, Checkbox, Radio, Select, message, Row, Col, Input, Tooltip, Icon } from 'antd';
import Immutable from 'immutable';
import { connect } from 'react-redux'
import styles from '../../SaleCenterNEW/ActivityPage.less';
import PriceInput from '../../../containers/SaleCenterNEW/common/PriceInput';
import CardLevel from './CardLevel';
import CardLevelForWX from './CardLevelForWX';
import {
    saleCenterSetSpecialBasicInfoAC,
} from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import { fetchSpecialCardLevel } from '../../../redux/actions/saleCenterNEW/mySpecialActivities.action'
import { injectIntl } from 'i18n/common/injectDecorator'
import { STRING_SPE } from 'i18n/common/special';
import { axiosData, isFilterShopType } from '../../../helpers/util'
import { getStore, axios } from '@hualala/platform-base'
import ShopSelector from '../../../components/ShopSelector';
import Permission from './Permission';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import { getPromotionShopSchema, fetchPromotionScopeInfo, saleCenterSetScopeInfoAC, saleCenterGetShopByParamAC, SCENARIOS, fetchFilterShops } from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action';
import ShopAreaSelector from '../../../components/ShopAreaSelector/index.jsx';
import Approval from '../../../containers/SaleCenterNEW/common/Approval';
import { isZhouheiya, isGeneral } from "../../../constants/WhiteList";
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;



@injectIntl
class SpecialRangeInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            joinRange: [],
            freeGetJoinRange: ['0', '3'],
            deductPointsStatus: 'success',
            joinCount: '0',
            rewardOnly: 1, // 是否用于打赏
            deductPoints: 0, // 扣减积分数
            sendPoints: 0, // 赠送积分数
            // wechatEventListCheck: '0', // 是否在微信会员卡活动列表领取
            // wechatOrderCheck: '0', // 是否在微信点菜界面领取
            // giftLinkCheck: '0', // 是否可被投放链接
            // sourceType: '0', // 彩蛋猫
            sendPointsStatus: 'success',
            countCycleDays: 0, // 参与周期
            countCycleDaysStatus: 'success',
            partInTimes: 0, // 最大参与次数
            partInTimesStatus: 'success',
            partInTimesNoValid: 0, // 最大参与次数(限制次数不限制周期使用)
            partInTimesNoValidStatus: 'success',
            isVipBirthdayMonth: '0', // 是否本月生日才能使用
            autoRefund: 0,
            cardLevelID: '0', // 会员等级
            maxPartInPerson: '', // 最大参与人数
            maxPartInPersonStatus: 'success',
            cardLevelIDList: [],
            cardLevelRangeType: '0',
            freeGetJoinRangeStatus: 'success',
            autoRegister: 1, // 是否需用户填写注册信息
            defaultCardType: '', // 用户静默注册为何种会员
            shopIDList: [],
            isConsumeType: '0', // 消费限制  0 不限制 1仅消费用户参与  前端回显使用
            consumeType: '14', // 仅消费用户参与 14：当天， 2：活动至今
            curCardConsume: '0', // 当天卡值消费满  前端回显使用
            curCardConsumeStatus: 'success',
            sumCardConsume: '0', // 活动至今卡值消费满  前端回显使用
            sumCardConsumeStatus: 'success',
            eventCityInfos: [], //投放城市
            cityOptions: [], //投放城市集合
            shopStatus: null, //是否选择店铺
            approvalInfo: {},//审批字段
            brandOptions: [],
            brandList: [],
            sourceWayLimit: '0',
            orderTypeList: ['31', '51'],
            shopAreaData: {
                list: [],
                type: 'shop', //shop | area
            },
            orgs: [],
        };

        this.handlePrev = this.handlePrev.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleJoinCountChange = this.handleJoinCountChange.bind(this); // radioChange
        this.handleJoinRangeChange = this.handleJoinRangeChange.bind(this); // checkBoxChange
        this.handleFreeGetJoinRangeChange = this.handleFreeGetJoinRangeChange.bind(this); // FreeGetJoinRangecheckBoxChange
        this.handleVipBirthdayMonthChange = this.handleVipBirthdayMonthChange.bind(this);
        this.onPartInTimesChange = this.onPartInTimesChange.bind(this);
        this.onCountCycleDaysChange = this.onCountCycleDaysChange.bind(this);
        this.onPartInTimesNoValidChange = this.onPartInTimesNoValidChange.bind(this);
        this.onSendPointsChange = this.onSendPointsChange.bind(this);
        this.onDeductPointsChange = this.onDeductPointsChange.bind(this);
        this.onMaxPartInPersonChange = this.onMaxPartInPersonChange.bind(this);
        this.renderJoinRange = this.renderJoinRange.bind(this);
        this.renderJoinCount = this.renderJoinCount.bind(this);
        this.renderFreeGetJoinRange = this.renderFreeGetJoinRange.bind(this);
        this.onCardLevelChange = this.onCardLevelChange.bind(this);
        this.handleCityIDChange = this.handleCityIDChange.bind(this);
        
        this.rightControl = Permission(props.user.accountInfo.groupID).find(item => props.type === item.key);
    }

    componentDidMount() {
        const user = this.props.user;
        const opts = {
            _groupID: user.accountInfo.groupID,
            _role: user.accountInfo.roleType,
            _loginName: user.accountInfo.loginName,
            _groupLoginName: user.accountInfo.groupLoginName,
        };
        this.props.getSubmitFn({
            // prev: undefined,
            prev: this.handlePrev,
            next: this.handleSubmit,
            finish: this.handleSubmit,
            cancel: undefined,
        });
        if (this.props.specialPromotion.getIn(['$eventInfo', 'itemID'])) {
            const specialPromotion = this.props.specialPromotion.get('$eventInfo').toJS();
            const { consumeType, consumeTotalAmount} = specialPromotion;
            let isConsumeType = '0';
            let curCardConsume = '0';
            let sumCardConsume = '0';
            let joinRange = [],
                freeGetJoinRange = [],
                joinCount = '0',
                partInTimesNoValidName;
            // 判断CheckBox的值

            if (specialPromotion.wechatEventListCheck != '0') {
                freeGetJoinRange.push('0');
            }
            if (specialPromotion.giftLinkCheck != '0') {
                freeGetJoinRange.push('3');
            }
            if (specialPromotion.sourceType != '0') {
                freeGetJoinRange.push('4');
            }
            if (specialPromotion.wechatOrderCheck != '0') {
                freeGetJoinRange.push('1');
            }
            if (specialPromotion.rewardOnly != '0') {
                if (this.props.type === '21') {
                    freeGetJoinRange.push('2');
                } else {
                    joinRange.push('0');
                }
            }
            if (parseFloat(specialPromotion.deductPoints) != '0') {
                joinRange.push('1');
            }
            if (parseFloat(specialPromotion.sendPoints) != '0') {
                joinRange.push('2');
            }
            // 判断Radio的值
            if (specialPromotion.countCycleDays != '0') {
                joinCount = '2';
                partInTimesNoValidName = 'partInTimes';
            } else if (specialPromotion.partInTimes != '0') {
                joinCount = '1';
                partInTimesNoValidName = 'partInTimesNoValid';
            }
            if (consumeType != '0') {
                isConsumeType = '1';
                consumeType == '14' ? curCardConsume = consumeTotalAmount : sumCardConsume = consumeTotalAmount;
            } else {
                isConsumeType = '0';
            }
            this.setState({
                joinRange,
                freeGetJoinRange,
                joinCount,
                rewardOnly: specialPromotion.rewardOnly, // 是否用于打赏
                deductPoints: specialPromotion.deductPoints, // 扣减积分数
                sendPoints: specialPromotion.sendPoints, // 赠送积分数
                countCycleDays: specialPromotion.countCycleDays, // 参与周期
                isVipBirthdayMonth: `${specialPromotion.isVipBirthdayMonth}`, // 是否本月生日才能使用
                autoRefund: specialPromotion.autoRefund === 1 ? 1 : 0,
                maxPartInPerson: specialPromotion.maxPartInPerson,
                cardLevelID: specialPromotion.cardLevelID || '0',
                cardLevelIDList: specialPromotion.cardLevelIDList || [],
                cardLevelRangeType: specialPromotion.cardLevelRangeType || '0',
                [partInTimesNoValidName]: specialPromotion.partInTimes, // 最大参与次数
                autoRegister: specialPromotion.autoRegister == 0 ? 0 : 1,
                isConsumeType,
                consumeType: String(consumeType),
                curCardConsume,
                sumCardConsume,
                eventCityInfos: (specialPromotion.eventCityInfos || []).map(item => item.cityID) || [],
                shopIDList: specialPromotion.shopIDList || [],
                shopStatus: specialPromotion.shopIDList && specialPromotion.shopIDList.length > 0 ? true : false,
                brandList: specialPromotion.brandList ? specialPromotion.brandList.split(',') : [],
                sourceWayLimit: specialPromotion.sourceWayLimit + '',
                orderTypeList: specialPromotion.orderTypeList ? specialPromotion.orderTypeList.split(',') : [],
            })
            //反显店铺区域组件
            const list = specialPromotion.orgs || [];
            this.setState({
                shopAreaData: {
                    list: list.map(item => item.shopID),
                    type: list[0] && list[0].shopType == '2' ? 'area' : 'shop'
                },
                orgs: specialPromotion.orgs || []
            })
        }
        if(this.props.type === '69') {
            this.getCityList()
        }
        if(this.props.type === '88') {
            this.loadShopSchema()
        }
    }

    // 获取投放城市列表
    async getCityList() {
        const [service, type, api, url] = ['HTTP_SERVICE_URL_PROMOTION_NEW', 'post', 'specialPromotion/', '/api/v1/universal?'];
        const datas = {
            groupID: this.props.user.accountInfo.groupID,
            shopIDs: this.props.user.accountInfo.dataPermissions.shopList.map(item => item.shopID)
        };
        const method = `${api}queryCityByShopIDs.ajax`;
        const params = { service, type, data: datas, method };
        const { data, code } = await axios.post(url + method, params);
        try {
            if(code == '000') {
                this.setState({ cityOptions: data.cityList || [] })
            }
        } catch (error) {
            message.warning('请求失败');
        }
    }

    async loadShopSchema() {
        const { data } = await axios.post('/api/shopapi/schema', {});
        const { brands, shops } = data;
        this.setState({
            brandOptions: brands,
        });
    }

    handlePrev() {
        return this.handleSubmit(true)
    }
    handleSubmit(isPrev) {
        let nextFlag = true;
        this.props.form.validateFieldsAndScroll((err) => {
            if (err) {
                nextFlag = false;
            }
        });
        let {
            joinRange,
            freeGetJoinRange,
            joinCount,
            rewardOnly, // 是否用于打赏
            deductPoints, // 扣减积分数
            sendPoints, // 赠送积分数
            countCycleDays, // 参与周期
            partInTimes, // 最大参与次数
            partInTimesNoValid, // 最大参与次数
            isVipBirthdayMonth, // 是否本月生日才能使用
            autoRefund,
            maxPartInPerson, // 参与人数
            maxPartInPersonStatus,
            autoRegister,
            defaultCardType,
            shopIDList,
            curCardConsume,
            sumCardConsume,
            isConsumeType,
            consumeType,
            eventCityInfos,
            approvalInfo,
            brandList,
            sourceWayLimit,
            orderTypeList,
            orgs,
        } = this.state;
        const opts = {
            rewardOnly,
            isVipBirthdayMonth,
            autoRefund,
            maxPartInPerson,
            cardLevelID: this.state.cardLevelID || '0',
            cardLevelIDList: this.state.cardLevelIDList || [],
            cardLevelRangeType: this.state.cardLevelRangeType || '0',
            consumeType: '0',
            // consumeTotalAmount: '', // 消费金额
            eventCityInfos: this.state.cityOptions.filter(item => eventCityInfos.includes(item.cityID)),
            shopIDList,
            ...approvalInfo,
            brandList: brandList.join(','),
            sourceWayLimit,
            orderTypeList: orderTypeList.join(','),
            orgs,
        };
        if (this.props.type === '22' && (maxPartInPerson === '' || maxPartInPerson === null)) {
            nextFlag = false;
            maxPartInPersonStatus = 'error';
            this.setState({ maxPartInPersonStatus })
        }
        if (this.props.type === '21' && this.state.freeGetJoinRange.length === '0') {
            nextFlag = false;
        }
        if (this.props.type === '23' && (this.state.cardLevelRangeType === '0' || !opts.cardLevelIDList.length)) {
            const excludeEvents = this.props.specialPromotion.get('$eventInfo').toJS().excludeEventCardLevelIdModelList || [];
            if (excludeEvents.length && !opts.cardLevelIDList.length) {
                return isPrev || false;
            }
            opts.cardLevelRangeType = '4'; // 全部微信会员
        }
        if (this.props.type === '23' || this.props.type === '20' || this.props.type === '21' || this.props.type === '22' || this.props.type === '30') {
            opts.autoRegister = autoRegister
            opts.defaultCardType = defaultCardType
            if (this.props.type !== '23' && !defaultCardType) {
                nextFlag = false;
            }
        }
        if (this.props.type === '23') { // 线上餐厅送礼
            if (!isPrev) {
                if (this.props.queryCanUseShopStatus === 'pending') {
                    message.warning(`${this.props.intl.formatMessage(STRING_SPE.de8fn8fabl0236)}`);
                    return false;
                }
                if (this.props.queryCanUseShopStatus === 'error') {
                    message.warning(`${this.props.intl.formatMessage(STRING_SPE.dd5a73b2a3d1118)}`);
                    return false;
                }
            }
            if (shopIDList.length > 0) { // 如果已选店铺, 透传
                opts.shopIDList = shopIDList;
            } else if (opts.cardLevelIDList.length > 0) { // 没选店铺 但选了卡类 卡等级
                const canUseShop = this.props.canUseShopIDs.toJS();
                const excludeShopIDs = this.props.excludeCardTypeAndShopIDs.toJS().reduce((acc, curr) => {
                    acc.push(...(curr.shopIDList || []).map(id => `${id}`));
                    return acc;
                }, []);
                opts.shopIDList = canUseShop.filter(id => !excludeShopIDs.includes(id))
            } else { // 没选店铺且没选卡类
                opts.shopIDList = [];
            }
            opts.shopRange = opts.shopIDList.length > 0 ? 1 : 2
        }
        if (this.props.type === '20') { // 摇奖活动 消费限制
            if (isConsumeType !== '0') {
                if (consumeType === '14' && curCardConsume <= 0) {
                   this.setState({
                       curCardConsumeStatus: 'error'
                   })
                    return false
                }
                if (consumeType === '2' && sumCardConsume <= 0 ) {
                    this.setState({
                        sumCardConsumeStatus: 'error'
                    })
                    return false
                }
                opts.consumeType = consumeType;
                opts.consumeTotalAmount = consumeType === '14' ? curCardConsume : sumCardConsume; // 消费金额
            } else {
                opts.consumeType = '0';
                opts.consumeTotalAmount = '0'
            }
        }
        if(this.props.type === '89' || this.props.type === '88') {
            if(orgs && orgs.length == 0 && !isGeneral() && this.props.isUpdate) {
                nextFlag = false;
            }
            if(!approvalInfo.activityCost || !approvalInfo.activityRate || !approvalInfo.estimatedSales || !approvalInfo.auditRemark) {
                return;
            }
        }

        if (nextFlag) {
            if (joinRange.indexOf('0') !== -1 || freeGetJoinRange.indexOf('2') !== -1) {
                opts.rewardOnly = '1';
            } else {
                opts.rewardOnly = '0';
            }
            if (this.props.type === '21') {
                if (freeGetJoinRange.indexOf('0') !== -1) {
                    opts.wechatEventListCheck = '1';// 是否在微信会员卡活动列表领取
                } else {
                    opts.wechatEventListCheck = '0';
                }
                if (freeGetJoinRange.indexOf('1') !== -1) {
                    opts.wechatOrderCheck = '1';// 是否在微信点菜界面领取
                } else {
                    opts.wechatOrderCheck = '0';
                }
                if (freeGetJoinRange.indexOf('3') !== -1) {
                    opts.giftLinkCheck = '1';
                } else {
                    opts.giftLinkCheck = '0';
                }
                if (freeGetJoinRange.indexOf('4') !== -1) {
                    opts.sourceType = '1';
                } else {
                    opts.sourceType = '0';
                }
            }
            if (joinRange.indexOf('1') !== -1) {
                opts.deductPoints = deductPoints;
                if (deductPoints <= 0 || isNaN(deductPoints)) {
                    nextFlag = false;
                    this.setState({
                        deductPointsStatus: 'error',
                    })
                }
            } else {
                opts.deductPoints = '0';
            }
            if (joinRange.indexOf('2') !== -1) {
                opts.sendPoints = sendPoints;
                if (sendPoints <= 0 || isNaN(sendPoints)) {
                    nextFlag = false;
                    this.setState({
                        sendPointsStatus: 'error',
                    })
                }
            } else {
                opts.sendPoints = '0';
            }
            if (joinCount == '2') {
                if (countCycleDays <= 0 || isNaN(countCycleDays)) {
                    nextFlag = false;
                    this.setState({
                        countCycleDaysStatus: 'error',
                    })
                }
                if (partInTimes <= 0 || isNaN(partInTimes)) {
                    nextFlag = false;
                    this.setState({
                        partInTimesStatus: 'error',
                    })
                }
                opts.countCycleDays = countCycleDays;
                opts.partInTimes = partInTimes;
            }
            if (joinCount == '1') {
                if (partInTimesNoValid <= 0 || isNaN(sendPoints)) {
                    nextFlag = false;
                    this.setState({
                        partInTimesNoValidStatus: 'error',
                    })
                }
                opts.countCycleDays = '0';
                opts.partInTimes = partInTimesNoValid;
            }
            if (joinCount == '0') {
                opts.countCycleDays = '0';
                opts.partInTimes = '0';
            }
            // 报名活动，就限制参加一次
            if (this.props.type === '22') {
                opts.partInTimes = '1';
            }
            if (isPrev || nextFlag) {
                // 授权门店过滤
                if (isFilterShopType(this.props.type)) {
                    let dynamicShopSchema = Object.assign({}, this.props.shopSchemaInfo.toJS());
                    let { shopSchema = {} } = dynamicShopSchema
                    let { shops = [] } = shopSchema
                    let { shopIDList = [] } = opts
                    opts.shopIDList = shopIDList.filter((item) => shops.some(i => i.shopID == item))
                }

                if(isZhouheiya(this.props.user.accountInfo.groupID)){
                    //设置默认值
                    if(this.rightControl) {
                        const fields = Object.keys(this.rightControl).filter(key => this.rightControl[key].defaultValue != undefined);
                        fields.forEach(field => {
                            if(this.rightControl[field] && this.rightControl[field].defaultValue) {
                                opts[field] = this.rightControl[field].defaultValue;
                            }
                        })
                    }
                }
                
                this.props.setSpecialBasicInfo(opts);
            }
        }
        return isPrev || nextFlag;
    }
    // 免费领取的参与范围
    renderFreeGetJoinRange() {
        const options = [
            { label: `${this.props.intl.formatMessage(STRING_SPE.d31ejjc0631266)}`, value: '0' },
            { label: `${this.props.intl.formatMessage(STRING_SPE.da8onji5nc333)}`, value: '2' },
            { label: `${this.props.intl.formatMessage(STRING_SPE.d454berh2m4215)}`, value: '3' },
            { label: `${this.props.intl.formatMessage(STRING_SPE.d5672b44908540146)}`, value: '4' },
        ];
        // 因为开发线上领取新功能，去掉{ label: '微信点菜界面领取', value: '1' },
        const idx = this.state.freeGetJoinRange.findIndex((value) => {
            return value === '1';
        });
        const range = this.state.freeGetJoinRange;
        idx === -1 ? null : range.splice(idx, idx + 1);
        return (
            <div>
                <FormItem
                    label={`${this.props.intl.formatMessage(STRING_SPE.d1kgeaciak15137)}`}
                    className={[styles.noPadding, styles.inlineCheckBox].join(' ')}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                // validateStatus={this.state.freeGetJoinRangeStatus}
                // help='请选择参与范围'
                // 不用status，flag置为false即可，用了还要手动改变success或error,getFieldDecorator自动改变
                >
                    {this.props.form.getFieldDecorator('freeGetJoinRange', {
                        rules: [{
                            required: true,
                            message: `${this.props.intl.formatMessage(STRING_SPE.db60b7b7495b6167)}`,
                        }],
                        initialValue: range,
                    })(
                        <CheckboxGroup options={options} onChange={this.handleFreeGetJoinRangeChange} />
                    )
                    }
                </FormItem>
            </div>
        );
    }
    // 参与积分
    renderJoinRange() {
        let options = [
            { label: `${this.props.intl.formatMessage(STRING_SPE.db60b7b7495b733)}`, value: '0' },
            { label: `${this.props.intl.formatMessage(STRING_SPE.de8fn8fabm853)}`, value: '1' },
            { label: `${this.props.intl.formatMessage(STRING_SPE.db60b7b7495b98)}`, value: '2' },
        ];
        const optionTwo = [
            { label: `${this.props.intl.formatMessage(STRING_SPE.de8fn8fabm853)}`, value: '1' },
            { label: `${this.props.intl.formatMessage(STRING_SPE.db60b7b7495b98)}`, value: '2' },
        ];
        if(this.rightControl && this.rightControl.joinRange && this.rightControl.joinRange.options && this.rightControl.joinRange.options.length > 0) {
            options = options.filter(item => this.rightControl.joinRange.options.includes(item.value));
        }
        const help = `${this.props.intl.formatMessage(STRING_SPE.d16hgajaeke10122)}`;
        return (
            <div>
                <FormItem

                    labelCol={{ span: 4 }}
                    className={styles.noPadding}
                    wrapperCol={{ span: 20 }}
                >
                </FormItem>
                <FormItem
                    label={this.props.type === '21' ? `${this.props.intl.formatMessage(STRING_SPE.d1qe5cemc611253)}` : `${this.props.intl.formatMessage(STRING_SPE.d1kgeaciak15137)}`}
                    className={styles.noPadding}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <CheckboxGroup options={this.props.type === '30' || this.props.type === '22' || this.props.type === '21' ? optionTwo : options} value={this.state.joinRange} onChange={this.handleJoinRangeChange} />
                    <div className={styles.deduct}>
                        <FormItem validateStatus={this.state.deductPointsStatus}>
                            <PriceInput
                                addonBefore={`${this.props.intl.formatMessage(STRING_SPE.d2164523635ba12222)}`}
                                addonAfter={`${this.props.intl.formatMessage(STRING_SPE.db60b58ca13657133)}`}
                                disabled={this.state.joinRange.indexOf('1') === -1}
                                value={{ number: this.state.deductPoints }}
                                defaultValue={{ number: this.state.deductPoints }}
                                onChange={this.onDeductPointsChange}
                            />
                        </FormItem>
                    </div>
                    <div className={styles.add}>
                        <FormItem validateStatus={this.state.sendPointsStatus}>
                            <PriceInput
                                addonBefore={`${this.props.intl.formatMessage(STRING_SPE.dk46b2bc3b1333)}`}
                                addonAfter={`${this.props.intl.formatMessage(STRING_SPE.db60b58ca13657133)}`}
                                disabled={this.state.joinRange.indexOf('2') === -1}
                                value={{ number: this.state.sendPoints }}
                                defaultValue={{ number: this.state.sendPoints }}
                                onChange={this.onSendPointsChange}
                            />
                        </FormItem>
                    </div>
                </FormItem>
            </div>
        );
    }
    renderJoinCount() {
        const radioStyle = {
            display: 'block',
            height: '32px',
            lineHeight: '32px',
        };
        return (
            <div>
                {this.props.type == '88' && <h4 style={{ margin: '10px 25px 20px', fontSize: '14px' }}>参与设置</h4>}
                <FormItem
                    label={`${this.props.intl.formatMessage(STRING_SPE.d7el6blifo14268)}`}
                    className={styles.noPadding}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <RadioGroup value={this.state.joinCount} onChange={this.handleJoinCountChange}>
                        <Radio style={radioStyle} value={'0'}>{this.props.intl.formatMessage(STRING_SPE.d1qe5cemc615298)}</Radio>
                        <Radio style={radioStyle} value={'1'}>{this.props.intl.formatMessage(STRING_SPE.dojwvv1om16197)}</Radio>
                        <div className={styles.priceWrapper}>
                            <FormItem validateStatus={this.state.partInTimesNoValidStatus}>
                                <PriceInput
                                    addonBefore={`${this.props.intl.formatMessage(STRING_SPE.d31ejjc06321726)}`}
                                    addonAfter={`${this.props.intl.formatMessage(STRING_SPE.d2164523635bb18198)}`}
                                    disabled={this.state.joinCount.indexOf('1') === -1}
                                    value={{ number: this.state.partInTimesNoValid }}
                                    defaultValue={{ number: this.state.partInTimesNoValid }}
                                    onChange={this.onPartInTimesNoValidChange}
                                    modal={'int'}
                                />
                            </FormItem>
                        </div>
                        <Radio style={radioStyle} value={'2'}>{this.props.intl.formatMessage(STRING_SPE.d16hgajaekf19215)}</Radio>
                        <div className={styles.addTwo}>
                            <div style={{ width: '70%', display: 'inline-block' }}>
                                <FormItem validateStatus={this.state.countCycleDaysStatus}>
                                    <PriceInput
                                        addonBefore={`${this.props.intl.formatMessage(STRING_SPE.da8onji5nd2078)}`}
                                        addonAfter={`${this.props.intl.formatMessage(STRING_SPE.d2164523635bb21258)}`}
                                        disabled={this.state.joinCount.indexOf('2') === -1}
                                        value={{ number: this.state.countCycleDays }}
                                        defaultValue={{ number: this.state.countCycleDays }}
                                        onChange={this.onCountCycleDaysChange}
                                        modal={'int'}
                                    />
                                </FormItem>
                            </div>

                            <div style={{ width: '30%', display: 'inline-block', position: 'relative', left: '-1px' }}>
                                <FormItem validateStatus={this.state.partInTimesStatus}>
                                    <PriceInput
                                        addonBefore={''}
                                        addonAfter={`${this.props.intl.formatMessage(STRING_SPE.d2164523635bb18198)}`}
                                        disabled={this.state.joinCount.indexOf('2') === -1}
                                        value={{ number: this.state.partInTimes }}
                                        defaultValue={{ number: this.state.partInTimes }}
                                        onChange={this.onPartInTimesChange}
                                        modal={'int'}
                                    />
                                </FormItem>
                            </div>

                        </div>
                    </RadioGroup>
                </FormItem>
            </div>
        );
    }
    onPartInTimesChange(value) {
        this.setState({
            partInTimes: value.number,
            partInTimesStatus: value.number > 0 ? 'success' : 'error',
        })
    }
    onPartInTimesNoValidChange(value) {
        this.setState({
            partInTimesNoValid: value.number,
            partInTimesNoValidStatus: value.number > 0 ? 'success' : 'error',
        })
    }
    onCountCycleDaysChange(value) {
        this.setState({
            countCycleDays: value.number,
            countCycleDaysStatus: value.number > 0 ? 'success' : 'error',
        })
    }
    onSendPointsChange(value) {
        this.setState({
            sendPoints: value.number,
            sendPointsStatus: value.number > 0 ? 'success' : 'error',
        })
    }
    onDeductPointsChange(value) {
        this.setState({
            deductPoints: value.number,
            deductPointsStatus: value.number > 0 ? 'success' : 'error',
        })
    }
    onMaxPartInPersonChange(value) {
        if (value.number === '' || value.number == null) {
            this.setState({
                maxPartInPerson: value.number,
                maxPartInPersonStatus: 'error',
            })
        } else {
            this.setState({
                maxPartInPerson: value.number,
                maxPartInPersonStatus: 'success',
            })
        }
    }
    onCurCardConsume = (value) => {
        const reg = /^[1-9]\d{0,9}$/;
        this.setState({
            curCardConsume: value.number,
            curCardConsumeStatus: reg.test(value.number) ? 'success' : 'error',
        })
    }
    onSumCardConsume = (value) => {
        const reg = /^[1-9]\d{0,9}$/;
        this.setState({
            sumCardConsume: value.number,
            sumCardConsumeStatus: reg.test(value.number) ? 'success' : 'error',
        })
    }

    handleJoinRangeChange(val) {
        this.setState({
            joinRange: val,
        })
        if (val.indexOf('1') === -1) {
            this.setState({
                deductPointsStatus: 'success',
            });
        }
        if (val.indexOf('2') === -1) {
            this.setState({
                sendPointsStatus: 'success',
            });
        }
    }
    handleFreeGetJoinRangeChange(val) {
        this.setState({
            freeGetJoinRange: val,
        })
    }
    handleJoinCountChange(e) {
        this.setState({
            joinCount: e.target.value,
            partInTimesNoValidStatus: 'success',
            countCycleDaysStatus: 'success',
            partInTimesStatus: 'success',
        });
    }
    handleVipBirthdayMonthChange(e) {
        this.setState({
            isVipBirthdayMonth: e.target.value,
        });
    }

    handleIsConsumeTypeChange = (e) => {
        const v = e.target.value;
        let consumeType = '0';
        if (v != '0') {
            consumeType = '14'; // 默认值
        }
        this.setState({
            isConsumeType: e.target.value,
            consumeType,
            sumCardConsumeStatus: 'success',
            curCardConsumeStatus: 'success',
        })
    }

    handleConsumeType = (e) => {
        this.setState({
            consumeType: e.target.value,
            sumCardConsumeStatus: 'success',
            curCardConsumeStatus: 'success',
        });
    } 
    handleautoRefundChange = (e) => {
        this.setState({
            autoRefund: e.target.value,
        })
    }
    onCardLevelChange(obj) {
        this.setState(obj);
    }
    autoRegisterChange = (e) => {
        this.setState({
            autoRegister: e.target.value,
        });
    }
    handleCityIDChange = (val) => {
        this.setState({
            eventCityInfos: val,
        })
    }

    renderBrandFormItem = () => {
        const { intl } = this.props;
        const k5dod8s9 = intl.formatMessage(SALE_STRING.k5dod8s9);

        const _brands = this.state.brandOptions;
        let options;
        if (typeof _brands === 'object' && _brands.length > 0) {
            options = _brands.map((brand, idx) => {
                return (
                    <Option value={brand.brandID} key={idx}>{brand.brandName}</Option>
                );
            })
        } else {
            options = (<Option value={'0'} disabled={true}>{k5dod8s9}</Option>);
        }

        const _brandList = {
            multiple: true,
            allowClear: true,
            showSearch: false,
            filterOption: false,
            placeholder: SALE_LABEL.k5nh23wx,
            onChange: this.handleBrandChange,
            defaultValue: this.state.brandList,
            value: this.state.brandList,
        };
        return (
            <Form.Item
                label={SALE_LABEL.k5dlpn4t}
                wrapperCol={{
                    span: 17,
                }}
                labelCol={{
                    span: 4,
                }}
                hasFeedback={true}
                className={styles.FormItemStyle}
            >
                <Select {..._brandList}
                    size="default"
                    placeholder='请选择品牌，不选默认全部品牌可用'
                    getPopupContainer={(node) => node.parentNode}
                >
                    {options}
                </Select>

            </Form.Item>
        );
    }
    handleBrandChange = (value) => {//todo
        this.setState({ brandList: value, shopIDList: [] });
    }

    renderChannelList = () => {
        return (
            <FormItem
                label={SALE_LABEL.k5krn6il}
                labelCol={{
                    span: 4,
                }}
                wrapperCol={{
                    span: 17,
                }}
                className={[styles.FormItemStyle, styles.yzTxt].join(' ')}
            >
                <Col span={24}>
                    <Select
                        size="default"
                        onChange={this.handleScenarioChange}
                        value={this.state.sourceWayLimit}
                        getPopupContainer={(node) => node.parentNode}
                        defaultValue={'0'}
                    >
                        {SCENARIOS.filter(item => item.value != '3').map((scenario, index) => {
                            return (
                                <Option key={index} value={scenario.value}>{scenario.name}</Option>
                            );
                        })}
                    </Select>
                    <Tooltip title={
                        <p>
                            <p>仅线下使用：指云店pos、点菜宝、云店pad、大屏等由门店下单场景</p>
                            <p>仅线上使用：指线上餐厅、小程序等由用户自助下单场景</p>
                        </p>
                    }>
                        <Icon
                            type={'question-circle'}
                            style={{ color: '#787878', left: '480px' }}
                            className={styles.cardLevelTreeIcon}
                        />
                    </Tooltip>
                </Col>
            </FormItem>
        );
    }
    handleScenarioChange = (value) => {
        this.setState({
            sourceWayLimit: value
        });
    }

    renderBusinessOptions = () => {
        const { intl } = this.props;
        const k5m67a4r = intl.formatMessage(SALE_STRING.k5m67a4r);
        const k5m67ad3 = intl.formatMessage(SALE_STRING.k5m67ad3);
        const k5m67alf = intl.formatMessage(SALE_STRING.k5m67alf);
        const k5krn7fx = intl.formatMessage(SALE_STRING.k5krn7fx);
        const k5m67atr = intl.formatMessage(SALE_STRING.k5m67atr);
        const basicInfo = this.props.promotionBasicInfo.get('$basicInfo').toJS()
        const isSelDefined = basicInfo.recommendType == 1
        if (this.props.isOnline) return null;
        let plainOptions = [
            {
                label: k5m67a4r,
                value: '10',
                disabled: isSelDefined
            }, {
                label: k5m67ad3,
                value: '11',
                disabled: isSelDefined
            }, {
                label: k5m67alf,
                value: '20',
                disabled: isSelDefined
            }, {
                label: k5krn7fx,
                value: '31',
            }, {
                label: k5m67atr,
                value: '21',
                disabled: isSelDefined
            },
            {
                label: '零售',
                value: '51',
                disabled: isSelDefined
            }
        ];

        return (
            <Form.Item
                label={SALE_LABEL.k5dlpt47}
                className={styles.FormItemStyle}
                labelCol={{
                    span: 4,
                }}
                validateStatus={this.state.orderTypeList.length
                    ? 'success'
                    : 'error'}
                help={!this.state.orderTypeList.length
                    ? ''
                    : null}
                wrapperCol={{
                    span: 17,
                }}
            >
                <CheckboxGroup
                    onChange={this.handleBusinessChange}
                    options={plainOptions}
                    value={this.state.orderTypeList}
                    defaultValue={this.state.orderTypeList}
                />
            </Form.Item>
        );
    }
    handleBusinessChange = (value) => {
        this.setState({ orderTypeList: value });
    }

    renderShopsOptions() {
        const { brandList = [], shopAreaData  } = this.state;
        console.log(this.props.isUpdate);
        return (
            <div style={{ position: 'relative', zIndex: this.props.onlyModifyShop ? '100' : 'auto' }}>
                <ShopAreaSelector
                    brandList={brandList}
                    groupID={this.props.user.accountInfo.groupID}
                    accountID={this.props.user.accountInfo.accountID}
                    firstRequired={!isGeneral() && this.props.isUpdate ? true : false}
                    secondRequired={!isGeneral() && this.props.isUpdate ? true : false}
                    firstValidateStatus={'error'}
                    secondValidateStatus={shopAreaData.type == 'area' && shopAreaData.list.length == 0 && !isGeneral() && this.props.isUpdate ? 'error' : 'success'}
                    firstHelp={shopAreaData.type == 'shop' && shopAreaData.list.length == 0 && !isGeneral() && this.props.isUpdate ? '请选择店铺' : ''}
                    secondHelp={shopAreaData.type == 'area' && shopAreaData.list.length == 0 && !isGeneral() && this.props.isUpdate ? '请选择区域' : ''}
                    value={{
                        radioValue: shopAreaData.type,
                        list: shopAreaData.list
                    }}
                    onChange={this.handleShopAreaChange}
                    formatRes={(params) => {
                        // console.log(params);
                        return params;
                    }}
                />
            </div>
        );
    }
    handleShopAreaChange = (value) => {
        console.log(value);
        const { areaList } = value.otherRes || {};
        let orgs = [];
        if(value.radioValue == 'shop') {
            orgs = value.list.map(shopID => ({
                shopID,
                shopType: '1'
            }))
        } else {
            orgs = value.list.map(shopID => ({
                shopID,
                shopType: '2',
                shopPath: (areaList.find(item => item.orgID == shopID) || {}).path + shopID + '/'
            }))
        }
        this.setState({
            shopAreaData: {
                type: value.radioValue,
                list: value.list,
            },
            orgs
        })
        console.log(orgs, 'orgs');
    }

    //参与范围
    renderParticipationScopes = () => {
        return (
            <div>
                <h4 style={{ margin: '20px 25px', fontSize: '14px' }}>参与范围</h4>
                {this.renderBrandFormItem()}
                {this.renderChannelList()}
                {this.renderBusinessOptions()}
                {this.renderShopsOptions()}
            </div>
        )
    }

    renderApproverSet = () => {
        return (
            <Approval type="special" onApprovalInfoChange={(val) => {
                this.setState({
                    approvalInfo: {
                        ...val
                    }
                })
            }} />
        )
    }

    render() {
        const { shopStatus, shopIDList = [] } = this.state;

        const inputStyle = {
            width: '100%', display: 'inline-block',  verticalAlign: 'middle',
        };
        return (
            <Form>
                {this.props.type === '21' ? this.renderFreeGetJoinRange() : null}
                {this.props.type !== '23' && this.props.type !== '69' && this.props.type !== '89' && this.props.type !== '88' ? this.renderJoinRange() : null}
                {this.props.type !== '22' ? this.renderJoinCount() : null}
                {
                    this.props.type === '23' ?
                        <CardLevelForWX
                            onChange={this.onCardLevelChange}
                            catOrCard={'cat'}
                            type={this.props.type}
                            form={this.props.form}
                        /> :
                        <CardLevel
                            onChange={this.onCardLevelChange}
                            catOrCard={'card'}
                            type={this.props.type}
                            form={this.props.form}
                        />
                }
                {
                    this.props.type === '23' || this.props.type === '20' || this.props.type === '21' || this.props.type === '22' || this.props.type === '30' ?
                        (<FormItem
                            label={`${this.props.intl.formatMessage(STRING_SPE.d4h19415ga42271)}`}
                            className={styles.noPadding}
                            wrapperCol={{ span: 17 }}
                            labelCol={{ span: 4 }}
                        >
                            <RadioGroup onChange={this.autoRegisterChange} value={this.state.autoRegister}>
                                <Radio value={1}>{this.props.intl.formatMessage(STRING_SPE.db60b7b7495c23238)}</Radio>
                                <Radio value={0}>{this.props.intl.formatMessage(STRING_SPE.d4h19415ga424182)}</Radio>
                            </RadioGroup>
                        </FormItem>) : null
                }
                {
                    this.props.type === '20' ? 
                        <div>
                            <FormItem
                                label={`消费限制`}
                                className={styles.noPadding}
                                wrapperCol={{ span: 17 }}
                                labelCol={{ span: 4 }}
                                required
                            >
                                {/* 摇奖活动 */}
                                <RadioGroup onChange={this.handleIsConsumeTypeChange} value={this.state.isConsumeType}>
                                    <Radio value={'0'}>不限制</Radio>
                                    <Radio value={'1'}>仅限卡值消费用户参与</Radio>
                                </RadioGroup>
                            </FormItem>
                            {
                                this.state.isConsumeType === '1' &&
                                <Row>
                                    <Col span={17} offset={4}>
                                    <RadioGroup onChange={this.handleConsumeType} value={this.state.consumeType} style={{ display: 'flex', marginTop: '-3px' }}>
                                        <Radio value={'14'} style={{ width: '50%' }}>
                                            <div style={inputStyle}>
                                                <FormItem validateStatus={this.state.curCardConsumeStatus} help={this.state.curCardConsumeStatus === 'error' && '10位以内正整数'}>
                                                    <PriceInput
                                                        addonBefore={'当天卡值消费满'}
                                                        addonAfter={'元可参与'}
                                                        disabled={this.state.consumeType.indexOf('14') === -1}
                                                        value={{ number: this.state.curCardConsume }}
                                                        // defaultValue={{ number: this.state.deductPoints }}
                                                        onChange={this.onCurCardConsume}
                                                    />
                                                </FormItem>
                                            </div>
                                        </Radio>
                                        <Radio value={'2'} style={{ width: '50%', marginLeft: 25 }}>
                                            <div style={inputStyle}>
                                                <FormItem validateStatus={this.state.sumCardConsumeStatus} help={this.state.sumCardConsumeStatus === 'error' && '10位以内正整数'}>
                                                    <PriceInput
                                                        addonBefore={'活动至今卡值消费满'}
                                                        addonAfter={'元可参与'}
                                                        disabled={this.state.consumeType.indexOf('2') === -1}
                                                        value={{ number: this.state.sumCardConsume }}
                                                        // defaultValue={{ number: this.state.deductPoints }}
                                                        onChange={this.onSumCardConsume}
                                                    />
                                                </FormItem>
                                            </div>
                                        </Radio>
                                    </RadioGroup>
                                    </Col>
                                </Row>
                                    
                            }
                        </div> : null
                }
                {
                    this.props.type !== '23' && this.props.type !== '69' && this.props.type !== '89' && this.props.type !== '88' ?
                        <FormItem
                            label={`${this.props.intl.formatMessage(STRING_SPE.d143141l5s0247)}`}
                            className={styles.noPadding}
                            wrapperCol={{ span: 17 }}
                            labelCol={{ span: 4 }}
                        >
                            <RadioGroup onChange={this.handleVipBirthdayMonthChange} value={this.state.isVipBirthdayMonth}>
                                <Radio value={'0'}>{this.props.intl.formatMessage(STRING_SPE.d31ei98dbgi21253)}</Radio> 
                                <Radio value={'1'}>{this.props.intl.formatMessage(STRING_SPE.de8fn8fabn25238)}</Radio>
                            </RadioGroup>
                        </FormItem> : null
                }
                {
                    this.props.type == '30' ?
                        <FormItem
                            label={<span>
                                <span>系统过期自动退</span>
                            </span>}
                            className={styles.noPadding}
                            wrapperCol={{ span: 17 }}
                            labelCol={{ span: 4 }}
                        >
                            <RadioGroup onChange={this.handleautoRefundChange} value={this.state.autoRefund}>
                                <Radio value={1}>自动退积分</Radio>
                                <Radio value={0}>不支持自动退积分</Radio>
                            </RadioGroup>
                        </FormItem> : null
                }
                {
                    this.props.type === '22' ?
                        <FormItem
                            label={`${this.props.intl.formatMessage(STRING_SPE.d34ih696rh26172)}`}
                            className={styles.noPadding}
                            wrapperCol={{ span: 17 }}
                            labelCol={{ span: 4 }}
                            validateStatus={this.state.maxPartInPersonStatus}
                            help={this.state.maxPartInPersonStatus === 'success' ? null : `${this.props.intl.formatMessage(STRING_SPE.d2b1c0a3b9c827266)}`}
                        >
                            <PriceInput
                                addonBefore={''}
                                addonAfter={''}
                                modal={'int'}
                                placeholder={`${this.props.intl.formatMessage(STRING_SPE.d2b1c0a3b9c827266)}`}
                                value={{ number: this.state.maxPartInPerson }}
                                defaultValue={{ number: this.state.maxPartInPerson }}
                                onChange={this.onMaxPartInPersonChange}
                            />
                        </FormItem>
                        : null
                }
                {
                    this.props.type === '69' && (
                        <FormItem
                            label='投放城市'
                            className={styles.noPadding}
                            wrapperCol={{ span: 17 }}
                            labelCol={{ span: 4 }}
                            style={{ marginTop: '10px', zIndex: this.props.onlyModifyShop ? '100' : 'auto' }}
                        >
                            <Select 
                                size="default"
                                defaultValue={this.state.eventCityInfos}
                                value={this.state.eventCityInfos}
                                onChange={this.handleCityIDChange}
                                // getPopupContainer={(node) => node.parentNode}
                                placeholder="请选择投放城市"
                                multiple={true}
                                allowClear
                            >
                                {/* <Option value={''} key={''}>{this.props.intl.formatMessage(STRING_SPE.d2c89sj1s61092)}</Option> */}
                                {
                                    this.state.cityOptions.map((item) => {
                                        return (<Option value={`${item.cityID}`} key={`${item.cityID}`}>{item.cityName}</Option>)
                                    })
                                }
                            </Select>
                        </FormItem>
                    )
                }
                {
                    this.props.type === '89' && (
                        // <FormItem
                        //     style={{ zIndex: this.props.onlyModifyShop ? '100' : 'auto' }}
                        //     label="适用店铺"
                        //     className={styles.FormItemStyle}
                        //     labelCol={{ span: 4 }}
                        //     wrapperCol={{ span: 17 }}
                        //     required={false}
                        //     validateStatus={shopStatus ? 'success' : 'error'}
                        //     help={shopStatus ? null : '不选默认所有店铺可用'}
                        // >
                        //     <ShopSelector
                        //         value={shopIDList}
                        //         onChange={v => {
                        //             this.setState({ shopIDList: v, shopStatus: v.length > 0 })
                        //         }}
                        //     // schemaData={this.props.shopSchema.toJS()}
                        //     />
                        // </FormItem>
                        this.renderShopsOptions()
                    )
                }
                {['88'].includes(this.props.type) && this.renderParticipationScopes()}
                {['89', '88'].includes(this.props.type) && this.renderApproverSet()}
            </Form>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        promotionBasicInfo: state.sale_promotionBasicInfo_NEW,
        saleCenter: state.sale_saleCenter_NEW,
        user: state.user.toJS(),
        shopSchemaInfo: state.sale_shopSchema_New,
        specialPromotion: state.sale_specialPromotion_NEW,
        canUseShopIDs: state.sale_specialPromotion_NEW.getIn(['$eventInfo', 'canUseShopIDs']),
        excludeCardTypeAndShopIDs: state.sale_specialPromotion_NEW.getIn(['$eventInfo', 'excludeCardTypeShops']),
        queryCanUseShopStatus: state.sale_specialPromotion_NEW.getIn(['addStatus', 'availableShopQueryStatus']),
        specialPromotionInfo: state.sale_specialPromotion_NEW,
        isUpdate:state.sale_myActivities_NEW.get('isUpdate'),
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSpecialBasicInfo: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
        fetchSpecialCardLevel: (opts) => {
            dispatch(fetchSpecialCardLevel(opts));
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(SpecialRangeInfo));
