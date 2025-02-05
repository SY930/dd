﻿import React from 'react'
import {
    Row,
    Col,
    Input,
    Tag,
    DatePicker,
    TimePicker,
    Form,
    Select,
    Icon,
    Button,
    Checkbox,
    message,
    Tooltip
} from 'antd';
import { connect } from 'react-redux'
import AddCategorys from "./AddCategorys";
import styles from '../../SaleCenterNEW/ActivityPage.less';
import {
    saleCenterSetSpecialBasicInfoAC,
    saleCenterQueryFsmGroupSettleUnit,
    saleCenterGetExcludeCardLevelIds,
    saleCenterGetExcludeEventList,
    saleCenterGetShopOfEventByDate,
    queryFsmGroupEquityAccount,
    getEventExcludeCardTypes,
    querySMSSignitureList,
    getAuthLicenseData
} from '../../../redux/actions/saleCenterNEW/specialPromotion.action';
import { checkAuthLicense } from '../../../helpers/util';
import {SEND_MSG, NOTIFICATION_FLAG, ACTIVITY_CYCLE_TYPE} from '../../../redux/actions/saleCenterNEW/types';
import ExcludeCardTable from './ExcludeCardTable';
import ExcludeGroupTable from './ExcludeGroupTable';
import PriceInput from '../../SaleCenterNEW/common/PriceInput';
import {fetchSpecialCardLevel} from "../../../redux/actions/saleCenterNEW/mySpecialActivities.action";
import { queryOccupiedWeiXinAccountsStart, queryOccupiedDouYinAccountsStart } from "../../../redux/actions/saleCenterNEW/queryWeixinAccounts.action";
import {queryWechatMpInfo} from "../../GiftNew/_action";
import {
    MONTH_OPTIONS,
    WEEK_OPTIONS,
} from '../../../redux/actions/saleCenterNEW/fullCutActivity.action';
import EveryDay from '../../GiftNew/GiftInfo/TicketBag/EveryDay';
import { injectIntl } from 'i18n/common/injectDecorator'
import { STRING_SPE } from 'i18n/common/special';
import TimeRange from "containers/PromotionV3/Camp/TimeRange/index";
import _ from 'lodash';
import CategoryFormItem from "containers/GiftNew/GiftAdd/CategoryFormItem";

const CheckboxGroup = Checkbox.Group;
const moment = require('moment');

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

const options = WEEK_OPTIONS;
const days = MONTH_OPTIONS;

const fullOptionSmsGate = [ // 选项有5种
    '53',
    '61',
    '62',
    '63',
    '68',
    '70',
    '89'
];

const simpleOptionSmsGate = [ // 选项有2种
    '21',
    '20',
    '30',
    '60',
    '23',
    '64',
    '65',
    '67',
    '75',
    '76',
];
// 包含周期选择日期表单选择项的营销活动集合
const PROMOTIONS_CONTAIN_PERIOD_TYPE_SELECTOR_SETS = new Set([
    '53',  // 群发礼品
])

// 活动时段 enabled promotion types
export const TimeRangeEnabledTypes = [
    '31',
    '21',
]

// _TODO
const ATSEnabledTypes = [ // advanced time settings enabled promotion types
    '20',
    '30',
    '67',
    '31',
    '21',
];
const dateLimitedTypes = [ // 活动日期不能选到今天以前的活动类型
    '61',
    '62',
    '63',
    '65',
    '66',
    '67',
    '68',
    '23',
    '70',
    '75',
]
//可作为营销盒子大礼包插件授权活动有以下：分享裂变、推荐有礼、膨胀大礼包、签到、集点卡、支付后广告、下单抽抽乐、盲盒  8个活动。
const authPulgins = ['65', '68', '66', '76', '75', '77', '78', '79'];
// 起止日期
const showActDataType = ['60']


@injectIntl
class StepOneWithDateRange extends React.Component {
    constructor(props) {
        super(props);
        let excludeDateArray;
        let selectWeekValue;
        let selectMonthValue;
        let validCycleType;
        let expand;
        let timeList = [
            {
                startTime: '',
                endTime: ''
            }
        ];
        try {
            const eventInfo = props.specialPromotion.getIn(['$eventInfo']).toJS();
            if(props.timeList && Array.isArray(props.timeList.toJS()) && props.timeList.toJS().length > 0){
                timeList = props.timeList.toJS().map(item => {
                    if(item.startTime){
                        item.startTime = moment.isMoment(item.startTime) ? item.startTime : moment(item.startTime, 'HH:mm');
                    }
                    if(item.endTime){
                        item.endTime = moment.isMoment(item.endTime) ? item.endTime : moment(item.endTime, 'HH:mm');
                    }
                    return item;
                }).filter(item => item.startTime && item.endTime);
            }
            excludeDateArray = eventInfo.excludedDate.map(item => moment(item, 'YYYYMMDD'));
            expand = !!excludeDateArray.length;
            if (!eventInfo.validCycle) {
                validCycleType = ACTIVITY_CYCLE_TYPE.EVERYDAY;
                selectWeekValue = ['1'];
                selectMonthValue = ['1'];
            }else if (eventInfo.validCycle[0].startsWith('m')) {
                expand = true;
                validCycleType = ACTIVITY_CYCLE_TYPE.MONTHLY;
                selectWeekValue = ['1'];
                selectMonthValue = eventInfo.validCycle.map(item => item.substring(1));
            }else if (eventInfo.validCycle[0].startsWith('w')) {
                expand = true;
                validCycleType = ACTIVITY_CYCLE_TYPE.WEEKLY;
                selectMonthValue = ['1'];
                selectWeekValue = eventInfo.validCycle.map(item => item.substring(1));
            }
            let newTimeList = timeList.filter(item => item.startTime && item.endTime);
            if(newTimeList.length > 0){
                expand = true;
            }
        } catch (e) {
            validCycleType = ACTIVITY_CYCLE_TYPE.EVERYDAY;
            excludeDateArray = [];
            selectWeekValue = ['1'];
            selectMonthValue = ['1'];
        }
        this.initEventCode = `YX${moment(new Date()).format('YYYYMMDDHHmmss') + new Date().getMilliseconds()}`;
        this.state = {
            categoryList: [],//类别数据
            tagList: [],//标签数据
            categoryName: '',//统计类别
            eventCode: `YX${moment(new Date()).format('YYYYMMDDHHmmss')}`,//活动编码
            tagLst: [],//标签
            description: null,
            dateRange: Array(2),
            name: '',
            eventCode: this.initEventCode,
            startTime: '', // 礼品发放时间
            smsGate: '0',
            timeString: '',
            tableDisplay: false,

            // advanced time setting
            expand: !!expand,
            validCycleType,
            excludeDateArray,
            selectWeekValue,
            selectMonthValue,
            timeRangelist: timeList,

            iconDisplay: false,
            getExcludeEventList: [],
            tipDisplay: 'none',
            isLoadingWeChatOccupiedInfo: props.occupiedWeChatInfo.get('isLoading'),
            occupiedWeChatIDs: props.occupiedWeChatInfo.get('occupiedIDs').toJS(),
            signID: props.specialPromotion.getIn(['$eventInfo', 'signID']) || '',
            isAllWeChatIDOccupied: props.occupiedWeChatInfo.get('isAllOccupied'),
            selectedIDs: props.specialPromotion.getIn(['$eventInfo', 'mpIDList']).toJS(),
            allWeChatIDList: props.allWeChatIDList,
            allWeChatIDListLoading: props.allWeChatIDListLoading,
            actStartDate: [],
            authLicenseData: {}
        };
        this.promotionNameInputRef = null;
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.getDateCount = this.getDateCount.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.msgSendTime = this.msgSendTime.bind(this);
        this.handlesmsGateChange = this.handlesmsGateChange.bind(this);
        this.onTimePickerChange = this.onTimePickerChange.bind(this);
        this.setErrors = this.setErrors.bind(this);
        this.throttledCheckWeChatID = _.throttle(this.checkIfAllOccupied.bind(this), 500, {leading: false, trailing: true});
    }

    componentDidMount() {
        const { isCopy } = this.props;
        this.props.getSubmitFn({
            prev: undefined,
            next: this.handleSubmit,
            finish: undefined,
            cancel: undefined,
        });
        document.addEventListener('click', this.onFakeDatePickerBlur)
        const opts = {
            _groupID: this.props.user.accountInfo.groupID,
            _role: this.props.user.accountInfo.roleType,
            _loginName: this.props.user.accountInfo.loginName,
            _groupLoginName: this.props.user.accountInfo.groupLoginName,
        };
        this.props.fetchSpecialCardLevel({
            data: opts,
        });
        const specialPromotion = this.props.specialPromotion.get('$eventInfo').toJS();
        const { eventStartDate, eventEndDate, tagLst } = specialPromotion
        this.props.queryWechatMpInfo({subGroupID: specialPromotion.subGroupID});
        if ((this.props.type === '31' || this.props.type === '68') && this.props.specialPromotion.getIn(['$eventInfo', 'itemID'])) {
            const itemID = specialPromotion.itemID;
            this.props.queryOccupiedWeixinAccounts({
                eventStartDate: specialPromotion.eventStartDate,
                eventEndDate: specialPromotion.eventEndDate,
                eventWay: this.props.type,
                itemID,
            });
        }
        if (specialPromotion.eventStartDate !== '20000101' && specialPromotion.eventEndDate !== '29991231' &&
            specialPromotion.eventStartDate !== '0' && specialPromotion.eventEndDate !== '0' &&
            specialPromotion.eventStartDate !== '' && specialPromotion.eventEndDate !== '') {
            this.setState({
                name: specialPromotion.eventName || this.state.name, // ||是因为选择日期自动更新，redux的‘’会覆盖掉state的值
                eventCode: isCopy ? this.initEventCode : specialPromotion.eventCode || this.state.eventCode,
                description: specialPromotion.eventRemark || this.state.description,
                smsGate: specialPromotion.smsGate || this.state.smsGate || '0',
                dateRange: this.props.isCopy ? Array(2) : [moment(specialPromotion.eventStartDate, 'YYYYMMDD'), moment(specialPromotion.eventEndDate, 'YYYYMMDD')],
                tagLst: tagLst ? tagLst.split(',') : []
            })
        } else {
            this.setState({
                startTime: specialPromotion.startTime.substring(0, 8),
                timeString: specialPromotion.startTime.substring(8),
                smsGate: specialPromotion.smsGate || this.state.smsGate || '0',
                name: specialPromotion.eventName || this.state.name,
                eventCode: isCopy ? this.initEventCode : specialPromotion.eventCode || this.state.eventCode,
                description: specialPromotion.eventRemark || this.state.description,
                tagLst: tagLst ? tagLst.split(',') : []
            })
        }
        // 群发短信以及其它可发短信的活动，要查权益账户和短信签名
        if (this.props.type == '50' || fullOptionSmsGate.includes(`${this.props.type}`)) {
            specialPromotion.settleUnitID > 0 && !(specialPromotion.accountNo > 0) ?
                this.props.saleCenterQueryFsmGroupSettleUnit({ groupID: this.props.user.accountInfo.groupID })
                :
                this.props.queryFsmGroupEquityAccount();
            this.props.querySMSSignitureList();
        }
        // 活动名称auto focus
        try {
            if(!this.props.onlyModifyShop && this.props.isUpdate) {
                this.promotionNameInputRef.focus()
            }
        } catch (e) {
            // oops
        }
        if(this.props.type == '60' && eventStartDate && eventEndDate) {
            this.setState({
                actStartDate: [moment(eventStartDate),moment(eventEndDate)]
            })
        }

        this.props.getAuthLicenseData({productCode: 'HLL_CRM_Marketingbox'}).then((res) => {
            this.setState({authLicenseData: res})
        });
    }
    componentWillUnmount() {
        document.removeEventListener('click', this.onFakeDatePickerBlur)
    }

    onFakeDatePickerBlur = (e) => {
        if (this.fakeDatePicker) {
            let element = e.target;
            while (element.parentNode) {
                if (element === this.fakeDatePicker
                    || (element.className || '').includes('ant-calendar-picker-container')) {
                    break;
                }
                element = element.parentNode
            }
            if (!element.parentNode) {
                this.setState({ open: false })
            }
        }
    }

    setErrors(target, text) {
        this.props.form.setFields({
            [target]: {
                // value: [],
                errors: [new Error(text)],
            },
        })
    }
    componentWillReceiveProps(nextProps, nextState) {
        // 是否更新
        let selectedIDs = this.state.selectedIDs;
        if (this.props.specialPromotion.get('$eventInfo') !== nextProps.specialPromotion.get('$eventInfo')) {
            const specialPromotion = nextProps.specialPromotion.get('$eventInfo').toJS();
            selectedIDs = specialPromotion.mpIDList;
            if (specialPromotion.getExcludeEventList && specialPromotion.getExcludeEventList.length > 0) {
                this.setState({
                    getExcludeEventList: specialPromotion.getExcludeEventList || [],
                }, () => {
                    if(this.props.type == '60') {
                        this.setErrors('rangePicker', '该时间段内已经有启用状态的完善资料送礼活动，不能重复创建')

                    } else {
                        this.setErrors('rangePicker', `${this.props.intl.formatMessage(STRING_SPE.de8g05amdm019)}`)
                    }

                })
            } else {
                this.setState({
                    getExcludeEventList: [],
                })
                this.props.form.setFields({
                    rangePicker: {
                        // value: [],
                        errors: undefined,
                    },
                })
            }
            if (nextProps.specialPromotion.get('$eventInfo').toJS().allCardLevelCheck && this.props.type != '23') { // 线上餐厅送礼活动过于复杂不限制下一步
                this.setState({ iconDisplay: true }, () => {
                    this.setErrors('rangePicker', `${this.props.intl.formatMessage(STRING_SPE.d31f01f38ji1267)}`)
                });
            }
        }
        // if (
        //     nextProps.promotionBasicInfo.getIn(["$categoryList", "initialized"])
        // ) {
        //     const categoryList = nextProps.promotionBasicInfo.getIn([
        //         "$categoryList",
        //         "data",
        //     ])
        //         ? nextProps.promotionBasicInfo
        //               .getIn(["$categoryList", "data"])
        //               .toJS()
        //               .map((item) => item.name)
        //         : [];
        //     this.setState({
        //         categoryList,
        //     });
        // }
        // if (nextProps.promotionBasicInfo.getIn(["$tagList", "initialized"])) {
        //     const tagList = nextProps.promotionBasicInfo.getIn([
        //         "$tagList",
        //         "data",
        //     ])
        //         ? nextProps.promotionBasicInfo
        //               .getIn(["$tagList", "data"])
        //               .toJS()
        //               .map((item) => item.name)
        //         : [];
        //     this.setState({
        //         tagList,
        //     });
        // }

        if (nextProps.promotionBasicInfo.getIn(["$tagList", "initialized"])) {
            const tagList = nextProps.promotionBasicInfo.getIn([
                "$tagList",
                "data",
            ])
                ? nextProps.promotionBasicInfo
                      .getIn(["$tagList", "data"])
                      .toJS()
                      .map((item) => item.name)
                : [];
            this.setState({
                tagList,
            });
        }
        
        if (this.props.type == '31') {
            let isLoadingWeChatOccupiedInfo = this.state.isLoadingWeChatOccupiedInfo;
            let isAllWeChatIDOccupied = this.state.isAllWeChatIDOccupied;
            let occupiedWeChatIDs = this.state.occupiedWeChatIDs;
            let allWeChatIDListLoading = this.state.allWeChatIDListLoading;
            let allWeChatIDList = this.state.allWeChatIDList;
            if (this.props.allWeChatIDListLoading !== nextProps.allWeChatIDListLoading) {
                allWeChatIDListLoading = nextProps.allWeChatIDListLoading;
                this.setState({
                    allWeChatIDListLoading
                })
            }
            if (this.props.allWeChatIDList !== nextProps.allWeChatIDList) {
                allWeChatIDList = nextProps.allWeChatIDList;
                this.setState({
                    allWeChatIDList
                })
            }
            // console.log("__TODO 111", this.props.occupiedWeChatInfo.toJS(), nextProps.occupiedWeChatInfo.toJS());
            if (this.props.occupiedWeChatInfo !== nextProps.occupiedWeChatInfo) {
                // console.log('_TODO')
                isLoadingWeChatOccupiedInfo = nextProps.occupiedWeChatInfo.get('isLoading');
                isAllWeChatIDOccupied = nextProps.occupiedWeChatInfo.get('isAllOccupied');
                occupiedWeChatIDs = nextProps.occupiedWeChatInfo.get('occupiedIDs');
                this.setState({
                    isLoadingWeChatOccupiedInfo,
                    isAllWeChatIDOccupied,
                    occupiedWeChatIDs,
                }, this.throttledCheckWeChatID);
            }
        }

    }

    checkIfAllOccupied() {
        const {
            isAllWeChatIDOccupied,
            allWeChatIDList,
            selectedIDs,
            occupiedWeChatIDs,
        } = this.state;
        if (isAllWeChatIDOccupied || (allWeChatIDList.length > 0 && allWeChatIDList.every(id => occupiedWeChatIDs.includes(id))) ) {
            if (!selectedIDs.length || selectedIDs.every(id => allWeChatIDList.includes(id))) {
                this.setErrors('rangePicker', `${this.props.intl.formatMessage(STRING_SPE.d2c8dlqh9s244)}`);
                return true;
            }
        }
        return false;
    }

    handleSubmit() {
        let nextFlag = true;
        const { actStartDate } = this.state
        this.props.form.validateFieldsAndScroll((err1, basicValues) => {
            if (err1) {
                nextFlag = false;
            }
        });
        // 升级送礼,消费送礼
        if (this.props.specialPromotion.get('$eventInfo').toJS().allCardLevelCheck && this.props.type != '23') { // 线上餐厅送礼活动过于复杂不限制下一步
            nextFlag = false;
            this.setErrors('rangePicker', `${this.props.intl.formatMessage(STRING_SPE.d31f01f38ji1267)}`)
        }

        if (this.state.getExcludeEventList.length > 0) {
            nextFlag = false;

            if(this.props.type == '60') {
                this.setErrors('rangePicker', `${this.props.intl.formatMessage("该时间段内已经有启用状态的完善资料送礼活动，不能重复创建")}`)
            } else {
                this.setErrors('rangePicker', `${this.props.intl.formatMessage(STRING_SPE.de8g05amdm019)}`)
            }
        }
        if (this.state.allShopCheck) {
            nextFlag = false;
            this.setErrors('rangePicker', `${this.props.intl.formatMessage(STRING_SPE.d5g391i90j344)}`)
        }
        if (nextFlag) {
            let tagLst = this.state.tagLst.join(',');
            if (this.props.type == '53' || this.props.type == '50') {
                this.props.setSpecialBasicInfo({
                    startTime: this.state.startTime + this.state.timeString || '',
                    eventName: this.state.name,
                    eventCode: this.state.eventCode,
                    eventRemark: this.state.description,
                    smsGate: this.state.smsGate,
                    signID: this.state.signID,
                    tagLst,
                })
            } else if (this.props.type == '61' || this.props.type == '62') {
                this.props.setSpecialBasicInfo({
                    smsGate: this.state.smsGate,
                    eventName: this.state.name,
                    eventCode: this.state.eventCode,
                    eventRemark: this.state.description,
                    eventStartDate: this.state.dateRange[0] ? this.state.dateRange[0].format('YYYYMMDD') : '0',
                    eventEndDate: this.state.dateRange[1] ? this.state.dateRange[1].format('YYYYMMDD') : '0',
                    signID: this.state.signID,
                    tagLst,
                });
            } else if( this.props.type == '60') {
                const eventStartDate =  actStartDate[0] ? actStartDate[0].format('YYYYMMDD') : '';
                const eventEndDate = actStartDate[1] ? actStartDate[1].format('YYYYMMDD') : ''

                this.props.setSpecialBasicInfo({
                    eventName: this.state.name,
                    eventCode: this.state.eventCode,
                    eventRemark: this.state.description,
                    eventStartDate ,
                    eventEndDate ,
                    smsGate: this.state.smsGate,
                    signID: this.state.signID,
                    tagLst,
                })

            } else  {
                this.props.setSpecialBasicInfo({
                    eventName: this.state.name,
                    eventCode: this.state.eventCode,
                    eventRemark: this.state.description,
                    eventStartDate: this.state.dateRange[0] ? this.state.dateRange[0].format('YYYYMMDD') : '0',
                    eventEndDate: this.state.dateRange[1] ? this.state.dateRange[1].format('YYYYMMDD') : '0',
                    smsGate: this.state.smsGate,
                    signID: this.state.signID,
                    tagLst,
                })
            }
            if (ATSEnabledTypes.includes(`${this.props.type}`)) {
                const {
                    validCycleType,
                    selectMonthValue = [],
                    selectWeekValue = [],
                    dateRange,
                    timeRangelist = [],
                    excludeDateArray = [],
                    expand
                } = this.state;
                let validCycle;
                switch (validCycleType) {
                    case ACTIVITY_CYCLE_TYPE.MONTHLY:
                        validCycle = selectMonthValue.map(item => `m${item}`);
                        break;
                    case ACTIVITY_CYCLE_TYPE.WEEKLY:
                        validCycle = selectWeekValue.map(item => `w${item}`);
                        break;
                    default: validCycle = null;
                }
                // _TODO
                let excludedDate = excludeDateArray.map(moments => moments.format('YYYYMMDD'));

                let params = {
                    eventStartDate: dateRange[0].format('YYYYMMDD'),
                    eventEndDate: dateRange[1].format('YYYYMMDD'),
                    eventWay: this.props.type, 
                    itemID: this.props.specialPromotion.getIn(['$eventInfo', 'itemID']),
                }
                if(TimeRangeEnabledTypes.includes(this.props.type)){
                    let timeList = timeRangelist
                        .filter(item => item && item.startTime && item.endTime)
                        .map(item => {
                            let startTime = moment.isMoment(item.startTime) ? item.startTime : moment(item.startTime);
                            let endTime = moment.isMoment(item.endTime) ? item.endTime : moment(item.endTime);
                            return {
                                startTime: startTime.format('HHmm'),
                                endTime: endTime.format('HHmm'),
                            }
                        });
                    params.timeList = timeList;
                    params.excludedDateList = excludedDate; 
                    params.validCycleList = validCycle;
                }
                if(expand){
                    this.props.setSpecialBasicInfo({
                        excludedDate,
                        validCycle,
                        timeList: params.timeList,
                        advMore: expand,
                    });
                }else{
                    params.timeList = [];
                    params.excludedDateList = []; 
                    params.validCycleList = [];
                    this.props.setSpecialBasicInfo({
                        excludedDate: [],
                        validCycle: null,
                        timeList: [],   
                        advMore: expand,
                    });
                }
                // _TODO
                let newParams = _.cloneDeep(params);
                newParams.timeIntervalList = newParams.timeList;
                delete newParams.timeList;
                this.props.queryOccupiedWeixinAccounts(newParams);
                // console.log('_TODO 222', this.props.occupiedWeChatInfo.toJS());

                // 关注送礼
                if (this.props.type == '31') {
                    // _TODO
                    // this.checkIfAllOccupied() && (nextFlag = false);
                }
                        
                // this.props.queryOccupiedDouYinAccounts({
                //     eventInfo: params
                // });
            }
        }
        return nextFlag;
    }

    toggleAdvancedDateSettings = () => {
        this.setState(({ expand }) => {
            return ({
                expand: !expand
            })
        })
    }

    getDateCount() {
        if (undefined === this.state.dateRange[0] || undefined === this.state.dateRange[1]) {
            return 0
        }

        if (this.state.dateRange[0] === null || this.state.dateRange[1] === null) {
            return 0
        }

        return this.state.dateRange[1]
            .diff(this.state.dateRange[0], 'days') + 1;
    }
    handleDescriptionChange(e) {
        this.setState({
            description: e.target.value,
        });
    }

    handleDateChange(date, dateString) {
        const opts = {
            groupID: this.props.user.accountInfo.groupID,
            eventWay: this.props.type,
            eventStartDate: date[0] ? date[0].format('YYYYMMDD') : '',
            eventEndDate: date[1] ? date[1].format('YYYYMMDD') : '',
        };
        // 编辑时，解放自己的选项不被排除; 新建时没有id, 也不会传到后端
        opts.itemID = this.props.specialPromotion.getIn(['$eventInfo', 'itemID']);
        if (opts.eventStartDate) {
            if (this.props.type === '61' || this.props.type === '62' || this.props.type === '23') {
                this.setState({
                    tableDisplay: false,
                    iconDisplay: false,
                });
                this.props.saleCenterGetExcludeCardLevelIds(opts);
                // 线上餐厅送礼还需要再查一个接口: http://wiki.hualala.com/pages/viewpage.action?pageId=30511315
                this.props.type === '23' && this.props.getEventExcludeCardTypes(opts)
            }
            // if (this.props.type === '63') {
            //     this.props.saleCenterGetExcludeEventList(opts);
            // }
            if (this.props.type === '64') {
                // EditBoxForShops组件-编辑时-componentDidMount再发一次;
                this.props.saleCenterGetShopOfEventByDate({ ...opts, eventID: opts.itemID, eventWay: undefined, itemID: undefined }).then(allShopCheck => {
                    this.setState({
                        allShopCheck
                    }, () => {
                        allShopCheck && this.setErrors('rangePicker', `${this.props.intl.formatMessage(STRING_SPE.d5g391i90j344)}`)
                    })
                })
            }
            // 活动时段change
            if (this.props.type === '68') {
                this.props.queryOccupiedWeixinAccounts({ ...opts, eventWay: this.props.type, itemID: opts.itemID });
            }
        }
        this.setState({
            dateRange: date,
            dateString,
        })
    }

    onDateWeekChange = (value) => {
        if (!value.length) {
            return message.warning(`${this.props.intl.formatMessage(STRING_SPE.d4h196g5b67499)}`)
        }
        this.setState({
            selectWeekValue: value,
        });
    }

    onDateMonthChange = (value) => {
        if (!value.length) {
            return message.warning(`${this.props.intl.formatMessage(STRING_SPE.d4h196g5b67499)}`)
        }
        this.setState({
            selectMonthValue: value,
        });
    }

    renderPromotionCycleDetailSetting() {
        if (this.state.validCycleType === ACTIVITY_CYCLE_TYPE.WEEKLY) {
            return (
                <div className={styles.SeniorDateWeek}>
                    <CheckboxGroup
                        options={options}
                        defaultValue={this.state.selectWeekValue}
                        value={this.state.selectWeekValue}
                        onChange={this.onDateWeekChange}
                    />
                </div>
            )
        } else if (this.state.validCycleType === ACTIVITY_CYCLE_TYPE.MONTHLY) {
            return (
                <div className={styles.SeniorDateMonth}>
                    <CheckboxGroup
                        options={days}
                        defaultValue={this.state.selectMonthValue}
                        onChange={this.onDateMonthChange}
                        value={this.state.selectMonthValue}
                    />
                </div>
            )
        }
        return null
    }

    renderPromotionCycleSetting() {
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 17 },
        };
        return (
            <FormItem label={this.props.intl.formatMessage(STRING_SPE.de8g05amdm5204)} className={styles.FormItemStyle} {...formItemLayout}>
                <Select
                    size="default"
                    placeholder={this.props.intl.formatMessage(STRING_SPE.d5g391i90j6263)}
                    getPopupContainer={(node) => node.parentNode}
                    defaultValue={this.state.validCycleType}
                    onChange={(arg) => {
                        this.setPromotionCycle(arg);
                    }}
                >
                    <Option value="0">{this.props.intl.formatMessage(STRING_SPE.d5g391i90j7111)}</Option>
                    <Option value="1">{this.props.intl.formatMessage(STRING_SPE.de8g05amdm8270)}</Option>
                    <Option value="2">{this.props.intl.formatMessage(STRING_SPE.dojx1h3j8951)}</Option>
                </Select>
                <div className={styles.SeniorDateMain}>
                    {this.renderPromotionCycleDetailSetting()}
                </div>

            </FormItem>
        )
    }

    renderExcludedDatePicker() {
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 17 },
        };
        return (
            <FormItem label={this.props.intl.formatMessage(STRING_SPE.d143185sia10140)} className={styles.FormItemStyle} {...formItemLayout}>
                <DatePicker
                    ref={e => this.realDatePicker = e}
                    open={this.state.open}
                    style={{ visibility: 'hidden', position: 'absolute'}}
                    value={undefined}
                    onChange={
                        (moment, dateString) => {
                            this.excludeDatePicker(moment, dateString);
                            this.setState({
                                open: false,
                            })
                        }
                    }
                />
                <div
                    ref={node => this.fakeDatePicker = node}
                    onClick={() => this.setState({ open: true })}
                    className={styles.showExcludeDate}
                >
                    <Icon style={{ position: 'absolute', right: 9, top: 8 }} type="calendar" />
                    {this.renderExcludedDate()}
                </div>
            </FormItem>
        )
    }

    excludeDatePicker = (date, dateString) => { // 排除日期
        if (date === null || dateString === '') {
            return null;
        }
        const dateStr = date.format('YYYY-MM-DD');
        const excludeDateArray = this.state.excludeDateArray.slice();
        if (excludeDateArray.some(item => item.format('YYYY-MM-DD') === dateStr)) {
            return null;
        }
        excludeDateArray.push(date)
        this.setState({
            excludeDateArray,
        });

        const { onChange } = this.props;
        if (onChange) {
            onChange(this.state);
        }
    }

    setPromotionCycle = (value) => {
        this.setState({
            validCycleType: value,
        });
        const { onChange } = this.props;
        if (onChange) {
            onChange(this.state);
        }
    }

    unselectExcludeDate = (index) => { // 删除排除日期
        const excludeDateArray = this.state.excludeDateArray.slice();
        excludeDateArray.splice(index, 1);
        this.setState({
            excludeDateArray,
        });
        const { onChange } = this.props;
        if (onChange) {
            onChange(this.state);
        }
    }

    renderExcludedDate() {
        return this.state.excludeDateArray.map((date, index) => {
            const callback = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.unselectExcludeDate(index);
            };

            return (
                <Tag key={`${index}`} closable={true} onClose={callback}>{date.format('YYYY-MM-DD')}</Tag>
            );
        });
    }

    renderAdvancedDateSettings() {
        return (
            <div>
                <FormItem className={[styles.FormItemStyle, styles.formItemForMore].join(' ')} wrapperCol={{ span: 17, offset: 4 }}>
                    <span className={styles.gTip}>{this.props.intl.formatMessage(STRING_SPE.de8g05amdm1166)}</span>
                    <span className={styles.gDate} onClick={this.toggleAdvancedDateSettings}>{this.props.intl.formatMessage(STRING_SPE.dk46c4417i1276)}</span>
                </FormItem>
                {
                    this.state.expand && 
                    TimeRangeEnabledTypes.includes(this.props.type) && 
                    this.renderTimeRange()
                }
                {this.state.expand && this.renderPromotionCycleSetting()}
                {this.state.expand && this.renderExcludedDatePicker()}
            </div>
        )
    }

    onChangeTimeRange = (value) => {
        this.setState({
            timeRangelist: value
        })
    }

    renderTimeRange(){
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 17 },
        };
        return (
            <FormItem label='活动时段' {...formItemLayout}>
                <TimeRange 
                    value={this.state.timeRangelist} 
                    onChange={this.onChangeTimeRange}
                    type={this.props.type}
                />
            </FormItem>
        )
    }

    handleNameChange(e) {
        this.setState({
            name: e.target.value,
        });
    }

    handleEventCodeChange = (e) => {
        this.setState({
            eventCode: e.target.value,
        });
    }

    // startTime change
    msgSendTime(val) {
        let startTime;
        try {
            startTime = val.format('YYYYMMDD')
        } catch (error) {
            startTime = ''
        }
        this.setState({
            startTime,
        })
        // if (startTime != '' && startTime == moment().format('YYYYMMDD') && this.state.timeString != '' && this.state.timeString < moment().format('HHmmss') + 10) {
            this.props.form.setFieldsValue({
                sendTime: '',
            });
            this.setState({timeString: ''})
            
        // }
        // if (startTime != '' && this.state.timeString == '' && moment().hours() < 23) {
        //     const minutes = moment().minutes() < 50 ? moment().minutes() + 10 : `0${moment().minutes() - 50}`;
        //     let hours = moment().minutes() < 50 ? moment().hours() : moment().hours() + 1;
        //     hours = hours >= 10 ? hours : `0${hours}`;
        //     this.setState({
        //         timeString: `${hours}${minutes}00`,
        //     }, () => {
        //         this.props.form.setFieldsValue({
        //             sendTime: this.state.timeString ? moment(this.state.timeString, 'HHmm') : '',
        //         });
        //     })
        // }
    }
    handlesmsGateChange(val) {
        this.setState({
            smsGate: val,
        })
    }
    handleSignIDChange = (val) => {
        this.setState({
            signID: val,
        })
    }
    onTimePickerChange(time) {
        let timeString;
        try {
            timeString = time.format('HHmmss')
        } catch (error) {
            timeString = ''
        }
        if (this.state.startTime == moment().format('YYYYMMDD') && timeString.substring(0, 2) == moment().hours()) {
            if (timeString.substring(2, 4) <= moment().minutes() + 10) {
                timeString = `${timeString.substring(0, 2) + (moment().minutes() + 10)}00`
            }
            this.setState({
                timeString,
            }, () => {
                this.props.form.setFieldsValue({
                    sendTime: this.state.timeString ? moment(this.state.timeString, 'HHmm') : '',
                });
            })
        } else {
            this.setState({
                timeString,
            }, () => {
                this.props.form.setFieldsValue({
                    sendTime: this.state.timeString ? moment(this.state.timeString, 'HHmm') : '',
                });
            })
        }
    }


    /**
     * @description 渲染周期选择器
     * @example 群发礼品，按月，周，日等周期去发送营销券 (无为不按日期发放)
    */
    renderDateOfSendingPromotionSelector = ()=>{
        const { type, form:{
            getFieldDecorator: decorator,
            getFieldValue,
            getFieldsValue
        }} = this.props;

        let dateInPeriodType = getFieldValue('dateInPeriodType');
        if(dateInPeriodType == undefined) {
            dateInPeriodType = 'm';
        }
        if(PROMOTIONS_CONTAIN_PERIOD_TYPE_SELECTOR_SETS.has(type)) {
            return (
                <div>
                    <FormItem
                        label='选择周期'
                        className={[styles.FormItemStyle, styles.FormItemLabelPadding].join(' ')}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 3 }}
                    >
                        {decorator('dateInPeriodType', {
                            rules: [{
                                required: true,
                                message: '请选择券发放周期',
                            }],
                            initialValue: dateInPeriodType,
                            onChange:  (val)=>{ console.log(val)}
                        })(
                            <Select>
                                <Option value="m">每月</Option>
                                <Option value="w">每周</Option>
                                <Option value="d">无</Option>
                            </Select>
                        )}
                    </FormItem>
                    {
                        this.renderDatePickerInWeekOrMonth(dateInPeriodType)
                    }
                </div>
            )
        }
        return null;
    }

    /**
     * @description 渲染周或者月具体的日期选择
    */
    renderDatePickerInWeekOrMonth = (dateInPeriodType) => {

        const { form: {getFieldDecorator: decorator}} = this.props;

        // disbled minutes


        let initialValue = [];
        if( decorator('dateDescInPeroid') instanceof Array && decorator('dateDescInPeroid').length > 0) {
            initialValue = decorator('dateDescInPeroid');
        }

        if(dateInPeriodType == 'd') {
            return null;
        }
        return (
            <FormItem
                label=' '
                className={[styles.FormItemStyle, styles.FormItemLabelPadding].join(' ')}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >
                {decorator('dateDescInPeroid', {
                    rules: [{
                        required: true,
                        message: '请选择日期',
                    }],
                    initialValue,
                })(
                    <EveryDay type={dateInPeriodType} disabled={false} />
                )}
            </FormItem>
        )
    }

    /**
     * @description 渲染仅发送时间组件
    */
    renderSendTimeSelector = () => {
        const { form: {
            getFieldDecorator: decorator,
            getFieldValue
        }, type} = this.props;

        if(!(PROMOTIONS_CONTAIN_PERIOD_TYPE_SELECTOR_SETS.has(type))) {
            return null;
        }

        // 不可用时间组件
        let disabledHours = () => {
            return [];
        };
        let disabledMinutes = () => {
            const dateInPeriodType = getFieldValue('dateInPeriodType');
            if(dateInPeriodType == 'm' || dateInPeriodType == 'w'){
                let result = [];
                for(let i=0; i < 60; i++){
                    if(i != 0 && i != 30) {
                        result.push(i);
                    }
                }
                return result;
            }
        }

        let { startTime, timeString } = this.state,
            timeStringInitialValue = '';

        if (timeString != '' && timeString !== 0) {
            timeStringInitialValue = moment(timeString, 'HHmm');
        } else {
            timeStringInitialValue = timeString;
        }

        return (
            <FormItem
                label='发送时间'
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 8 }}
            >
                {decorator('sendTime', {
                    rules: [{
                        required: true,
                        message: `${this.props.intl.formatMessage(STRING_SPE.d21645473363b18164)}`,
                    }],
                    initialValue: timeStringInitialValue,
                })(
                    <TimePicker
                        disabledHours={disabledHours}
                        disabledMinutes={disabledMinutes}
                        format="HH:mm"
                        style={{ width: '100%' }}
                        onChange={this.onTimePickerChange}
                        hideDisabledOptions = {true}
                        placeholder={this.props.intl.formatMessage(STRING_SPE.d21645473363b18164)}
                    />
                )}
                {
                    type == '50' && <p className={styles.msgTip}>{this.props.intl.formatMessage(STRING_SPE.d1qe5jtfnh19144)}</p>
                }
            </FormItem>
        )
    }

    /**
     * 日期选择器回调函数
    */
   handleDateRangeChange =  (val) => {
    //    console.log('val in handleDateRangeChange', handleDateRangeChange);
   }

   handleActDateChange = (e) => {
    const eventStartDate =  e[0] ? e[0].format('YYYYMMDD') : '';
    const eventEndDate = e[1] ? e[1].format('YYYYMMDD') : ''
    const opts = {
        groupID: this.props.user.accountInfo.groupID,
        eventWay: this.props.type,
        eventStartDate ,
        eventEndDate ,
    };
    this.props.saleCenterGetExcludeEventList(opts);
        this.setState({
            actStartDate: e
        })
    }

    /**
     * @description 日期选择
    */
    renderPeriodSelector = () => {

        // 日期选择器 rangePicker
        const {  actStartDate } = this.state;
        const { getFieldDecorator } = this.props.form;
        return (

                <FormItem
                    label={'活动起止日期'}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                    >
                    <Row>
                        <Col span={18}>
                        {getFieldDecorator('rangePicker', {
                                onChange: this.handleActDateChange,
                                initialValue: actStartDate
                            })(
                                <RangePicker />
                            )}

                        </Col>
                        <Col offset={1} span={5}>
                            <div className={styles.ActivityDateDay}>
                                <span>
                                    {this.getRangeDateCount(actStartDate)}
                                </span>
                                <span>天</span>
                            </div>
                        </Col>
                    </Row>
                </FormItem>

        )
    }

    getRangeDateCount(actStartDate) {
        if (undefined === actStartDate[0] || undefined === actStartDate[1]) {
            return 0
        }

        if (actStartDate[0] === null || actStartDate[1] === null) {
            return 0
        }

        return actStartDate[1]
            .diff(actStartDate[0], 'days') + 1;
    }

    range = (start, end) => {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    }

    changeCategoryFormItem = (value) => {
        this.setState({
            tagLst: value
        })
    }

    render() {
        const categorys = this.props.saleCenter.get('characteristicCategories').toJS();
        const type = this.props.type;
        const lab = categorys.find((cc) => {
            return cc.key == type
        }).title;
        let { startTime, timeString } = this.state,
            timeStringInitialValue = '',
            sendTimeProps = {
                onChange: this.msgSendTime,
            };
        let labelText = this.props.type == '53' ? `${this.props.intl.formatMessage(STRING_SPE.db60b94219321363)}` : `${this.props.intl.formatMessage(STRING_SPE.d16hgc4l3ga1415)}`,
            messageText = this.props.type == '53' ? `${this.props.intl.formatMessage(STRING_SPE.db60b94219321541)}` : `${this.props.intl.formatMessage(STRING_SPE.d21645473363a16158)}`

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 17 },
        };
        const { getFieldDecorator } = this.props.form;

        // 判断日期格式是否合法,不合法不设置defaultValue
        // 99999999  永久授权-兼容判断
        let dateRangeProps;
        const disabledDate = (current) => {
            let {pluginInfo = {}, authPluginStatus} = checkAuthLicense(this.state.authLicenseData, 'HLL_CRM_Marketingbox')
            
            let {authStartDate = '', authEndDate = ''} = pluginInfo
            authStartDate = moment(authStartDate, 'YYYYMMDD').format('YYYY-MM-DD')
            let authEndDates = moment(authEndDate, 'YYYYMMDD').format('YYYY-MM-DD') 

            let disabledDates = !current.isBetween(authStartDate, authEndDates, null, '()')

            if(!dateLimitedTypes.includes(`${this.props.type}`)){
                if(authEndDate == '99999999'){
                    return current && current.format('YYYYMMDD') < moment().format('YYYYMMDD');
                }
                if(authPulgins.includes(`${this.props.type}`) && authPluginStatus ){
                    return disabledDates || current && current.format('YYYYMMDD') < moment().format('YYYYMMDD');
                }else{
                    // Can not select days before today
                    return current && current.format('YYYYMMDD') < moment().format('YYYYMMDD');
                }
            }else{
                if(authEndDate == '99999999'){
                    return current && current.format('YYYYMMDD') < moment().format('YYYYMMDD');
                }
                if(authPulgins.includes(`${this.props.type}`) && authPluginStatus){
                    return disabledDates
                }else{
                    return null
                }
            }
        }
        const noDisabled = () => {
            const range = [];
            for (let i = 0; i < 60; i++) {
                range.push(i);
            }
            if (this.state.startTime == '') {
                return range;
            }
            return [];
        }
        // 不可用时间组件
        // 活动执行当天可以修改的发送时间为系统时间的后2小时的整点或半点
        let curHour = moment().get('hour');
        let curMinute = moment().get('minute');
        let disabledHours = () => {
            if(moment().format('YYYYMMDD') == this.state.startTime){
                let hours = this.range(0, 24);
                let addHour = curMinute > 30 ? 3 : 2
                return hours.filter(item => item < curHour + addHour)
            }
            return [];
        };
        let disabledMinutes = (selectedHour) => {
            let result = this.range(0, 60);
            if(moment().format('YYYYMMDD') == this.state.startTime){
                let addHour = curMinute > 30 ? 3 : 2
                if (curHour + addHour == selectedHour) {
                    if(curMinute > 30 || curMinute == 0){
                        return result.filter(item => item != 0 && item != 30)
                    }else{
                        return result.filter(item => item != 30)
                    }
                }else if (selectedHour == null || selectedHour > curHour + addHour) {
                    return result.filter(item => item != 0 && item != 30);
                }
            }
            return result.filter(item => item != 0 && item != 30);
        }
        if (this.state.dateRange[0] !== undefined && this.state.dateRange[1] !== undefined &&
            this.state.dateRange[0] !== '0' && this.state.dateRange[1] !== '0'
        ) {
            dateRangeProps = {
                // className: styles.ActivityDateDayleft,
                onChange: this.handleDateChange,
                initialValue: this.state.dateRange,
            }
        } else {
            dateRangeProps = {
                // className: styles.ActivityDateDayleft,
                onChange: this.handleDateChange,
            }
        }

        // 字符串转成moment,不合法不转换，否则会显示invalid date||0000-00-00
        if (startTime != '' && startTime != 0) {
            sendTimeProps.initialValue = moment(startTime, 'YYYYMMDD');
        }
        if (timeString != '' && timeString !== 0) {
            timeStringInitialValue = moment(timeString, 'HHmm');
        } else {
            timeStringInitialValue = timeString;
        }
        const promotionTypeConfig = categorys.find(v => v.key == this.props.type);
        const tip = (
            <div style={{ display: this.state.tipDisplay, minHeight: 135, width: 470 }} className={styles.tip}>
                <p style={{ whiteSpace: 'pre-line', lineHeight: 1.5 }}>{promotionTypeConfig ? promotionTypeConfig.tip : ''}</p>
                <div>
                    <div className={styles.tipBtn}>
                        <Button
                            type="ghost"
                            style={{ color: '#787878' }}
                            onClick={() => {
                                this.setState({ tipDisplay: 'none' });
                            }}
                        >{this.props.intl.formatMessage(STRING_SPE.d7h7gfdf2d00138)}
                        </Button>
                    </div>
                </div>
            </div>
        );
        return (
            <Form style={{position:'relative'}} className={styles.FormStyle}>
                {
                    !this.props.isUpdate && this.props.type == '64' ?  
                        <div className={styles.stepOneDisabled}></div> : null
                }
                <FormItem
                    label={this.props.intl.formatMessage(STRING_SPE.d4h177f79da1218)}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <p>{lab}</p>
                    {
                        promotionTypeConfig && promotionTypeConfig.tip ?
                            <Icon
                                type="question-circle-o"
                                className={styles.question}
                                style={{ marginLeft: 6 }}
                                onMouseOver={() => {
                                    this.setState({ tipDisplay: 'block' })
                                }}
                            /> : null
                    }
                    {tip}
                </FormItem>
                <div>
                    {/* <FormItem
                        label="统计标签"
                        className={styles.FormItemStyle}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17 }}
                        style={{ position: 'relative' }}
                    >
                        <Select
                            showSearch={true}
                            optionFilterProp="children"
                            notFoundContent="暂无数据"
                            getPopupContainer={(node) => node.parentNode}
                            size="default"
                            value={this.state.categoryName}
                            onChange={(value) => this.setState({ categoryName: value })}
                        >
                            {(this.state.categoryList || [])
                                .map((category, index) => {
                                    return (
                                        <Option value={category} key={category}>{category}</Option>
                                    )
                                })}
                        </Select>
                        <AddCategorys catOrtag={'cat'} resetCategorgOrTag={() => this.setState({ categoryName: '' })} />
                    </FormItem> */}
                    <FormItem label={this.props.intl.formatMessage(STRING_SPE.d4546grade4128)} className={styles.FormItemStyle} {...formItemLayout}>
                        {getFieldDecorator('promotionName', {
                            rules: [
                                { required: true, message: `${this.props.intl.formatMessage(STRING_SPE.da8of2e6el5231)}` },
                                { max: 50, message: `${this.props.intl.formatMessage(STRING_SPE.de8fcgn43i698)}` },
                            /*    {
                                whitespace: true,
                                required: true,
                                message: '汉字、字母、数字组成，不多于50个字符',
                                pattern: /^[\u4E00-\u9FA5A-Za-z0-9\.\（\）\(\)\-\-]{1,50}$/,
                            }*/
                            ],
                            initialValue: this.state.name,
                        })(
                            <Input
                                placeholder={this.props.intl.formatMessage(STRING_SPE.d7ekp859lc7222)}
                                onChange={this.handleNameChange}
                                ref={node => this.promotionNameInputRef = node}
                            />
                        )}
                    </FormItem>
                    {/* _TODO */}
		    {
                        ['69', '89', '88'].includes(this.props.type) && 
                        <FormItem label='活动编码' className={styles.FormItemStyle} {...formItemLayout}>
                            {getFieldDecorator('eventCode', {
                                rules: [
                                    { required: true, message: '活动编码不能为空' },
                                    { max: 50, message: `${this.props.intl.formatMessage(STRING_SPE.de8fcgn43i698)}` },
                                    {
                                        whitespace: true,
                                        required: true,
                                        message: '字母、数字组成，不多于50个字符',
                                        pattern: /^[A-Za-z0-9]{1,50}$/,
                                    }
                                ],
                                initialValue: this.state.eventCode,
                            })(
                                <Input
                                    // disabled={this.props.isUpdate && this.props.isCopy === false}
                                    disabled={true}
                                    placeholder='请输入编码名称'
                                    onChange={this.handleEventCodeChange}
                                />
                            )}
                        </FormItem>
                    }
                    {/* _TODO */}
                    {!['69', '89', '88'].includes(this.props.type) && 
                            <FormItem
                                label={<span>活动编码 <Tooltip title='活动编码填写后不可修改'><Icon type="question-circle" style={{ marginLeft: 5 }} /></Tooltip></span>}
                                className={styles.FormItemStyle}
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 17 }}
                            >
                                {getFieldDecorator('eventCode', {
                                    rules: [{
                                        whitespace: true,
                                        message: "字母、数字组成，不多于50个字符",
                                        pattern: /^[A-Za-z0-9]{1,50}$/,
                                    }],
                                    initialValue: this.state.eventCode,
                                })(
                                        <Input
                                            // disabled={this.props.isUpdate && this.props.isCopy === false}
                                            placeholder='请输入编码名称'
                                            onChange={this.handleEventCodeChange}
                                        />
                                )}
                            </FormItem>
                    }

                    <FormItem
                        label={<span>标签管理</span>}
                        className={styles.FormItemStyle}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17 }}
                    >
                        {getFieldDecorator('tagLst', {
                            initialValue: this.state.tagLst,
                        })(
                            <CategoryFormItem
                                phraseType='2'
                                onChange={this.changeCategoryFormItem}
                                selectedPhrases={this.state.tagLst}
                            />
                        )}
                    </FormItem>

                    {
                        // 渲染周期选择期
                        this.renderDateOfSendingPromotionSelector()
                    }

                    {
                        this.renderSendTimeSelector(disabledHours, disabledMinutes, noDisabled)
                    }



                    {
                        this.props.type == '50' ?
                            <Row>
                                <Col span={15}>
                                    <FormItem
                                        label={labelText}
                                        className={[styles.FormItemStyle, styles.FormItemLabelPadding].join(' ')}
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 17 }}
                                    >
                                        {getFieldDecorator('sendDate', {
                                            rules: [{
                                                required: true,
                                                message: messageText,
                                            }],
                                            ...sendTimeProps,
                                        })(
                                            <DatePicker
                                                format="YYYY-MM-DD"
                                                disabledDate={(current) => {
                                                    // Can not select days before today
                                                    return current && current.format('YYYYMMDD') < moment().format('YYYYMMDD');
                                                }}
                                                style={{ width: '100%' }}
                                                placeholder={this.props.intl.formatMessage(STRING_SPE.db60b942193317294)}
                                            />
                                        )}
                                    </FormItem>
                                </Col>

                                <Col span={6}>
                                    <FormItem className={styles.FormItemStyle} >
                                        {getFieldDecorator('sendTime', {
                                            rules: [{
                                                required: true,
                                                message: `${this.props.intl.formatMessage(STRING_SPE.d21645473363b18164)}`,
                                            }],
                                            initialValue: timeStringInitialValue,
                                        })(
                                            <TimePicker
                                                disabledHours={moment().format('YYYYMMDD') == this.state.startTime ? disabledHours : noDisabled}
                                                disabledMinutes={disabledMinutes}
                                                format="HH:mm"
                                                style={{ width: '100%' }}
                                                onChange={this.onTimePickerChange}
                                                hideDisabledOptions = {true}
                                                placeholder={this.props.intl.formatMessage(STRING_SPE.d21645473363b18164)}
                                            />
                                        )}
                                        {
                                            this.props.type == '50' && <p className={styles.msgTip}>{this.props.intl.formatMessage(STRING_SPE.d1qe5jtfnh19144)}</p>
                                        }
                                    </FormItem>
                                </Col>
                            </Row> : null
                    }
                    {fullOptionSmsGate.includes(String(this.props.type))
                         ?
                            <FormItem
                                label={this.props.intl.formatMessage(STRING_SPE.d2c89sj1s6888)}
                                className={styles.FormItemStyle}
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 17 }}
                            >
                                <Select size="default"
                                        value={`${this.state.smsGate}`}
                                        onChange={this.handlesmsGateChange}
                                        getPopupContainer={(node) => node.parentNode}
                                >
                                    {
                                        SEND_MSG.map((item) => {
                                            return (<Option value={`${item.value}`} key={`${item.value}`}>{item.label}</Option>)
                                        })
                                    }
                                </Select>

                            </FormItem> : null
                    }{simpleOptionSmsGate.includes(String(this.props.type))
                         ?
                            <FormItem
                                label={this.props.intl.formatMessage(STRING_SPE.d2c89sj1s6888)}
                                className={styles.FormItemStyle}
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 17 }}
                            >
                                <Select size="default"
                                        value={`${this.state.smsGate}`}
                                        onChange={this.handlesmsGateChange}
                                        getPopupContainer={(node) => node.parentNode}
                                >
                                    {
                                        NOTIFICATION_FLAG.map((item) => {
                                            return (<Option value={`${item.value}`} key={`${item.value}`}>{item.label}</Option>)
                                        })
                                    }
                                </Select>

                            </FormItem> : null
                    }
                    {
                        (this.props.type != '50' && (this.state.smsGate == 1 || this.state.smsGate == 3 || this.state.smsGate == 4)) && (
                            <FormItem
                                label={this.props.intl.formatMessage(STRING_SPE.d4546grade9251)}
                                className={styles.FormItemStyle}
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 17 }}
                            >
                                <Select size="default"
                                        value={`${this.state.signID}`}
                                        onChange={this.handleSignIDChange}
                                        getPopupContainer={(node) => node.parentNode}
                                >
                                    <Option value={''} key={''}>{this.props.intl.formatMessage(STRING_SPE.d2c89sj1s61092)}</Option>
                                    {
                                        this.props.specialPromotion.get('SMSSignList').toJS().map((item) => {
                                            return (<Option value={`${item.signID}`} key={`${item.signID}`}>{item.signName}</Option>)
                                        })
                                    }
                                </Select>
                            </FormItem>
                        )
                    }
                    {
                        this.props.type != '53' && this.props.type != '50' && this.props.type != '60' || this.props.type == '70' ?
                            <div>
                                <FormItem
                                    label={this.props.intl.formatMessage(STRING_SPE.d21645473363b20173)}
                                    className={[styles.FormItemStyle, styles.cardLevelTree].join(' ')}
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 17 }}
                                >
                                    <Row>
                                        <Col span={21}>
                                            {getFieldDecorator('rangePicker', {
                                                rules: [{
                                                    required: this.props.type != '88' ? true : false,
                                                    message: `${this.props.intl.formatMessage(STRING_SPE.du3ac84kn21119)}`,
                                                }],
                                                ...dateRangeProps,
                                            })(
                                                <RangePicker
                                                    className={styles.ActivityDateDayleft}
                                                    style={{ width: '100%' }}
                                                    disabledDate={disabledDate}
                                                />
                                            )}
                                        </Col>
                                        <Col offset={1} span={2}>
                                            <div className={styles.ActivityDateDay}>
                                                <span>
                                                    {
                                                        this.getDateCount()
                                                    }
                                                </span>
                                                <span>{this.props.intl.formatMessage(STRING_SPE.d1kgda4ea3a2945)}</span>
                                            </div>

                                        </Col>
                                    </Row>
                                    {
                                        (this.props.specialPromotion.get('$eventInfo').toJS().allCardLevelCheck && this.state.iconDisplay) ||
                                            this.state.getExcludeEventList.length > 0 ?
                                            <Icon
                                                type="exclamation-circle"
                                                className={styles.cardLevelTreeIcon}
                                                onClick={() => {
                                                    this.setState({ tableDisplay: !this.state.tableDisplay })
                                                }}
                                            /> : null

                                    }{
                                        (this.state.isLoadingWeChatOccupiedInfo &&
                                            <Icon
                                                type="loading"
                                                className={styles.cardLevelTreeIcon}
                                                style={{color: 'inherit'}}
                                            />)
                                    }
                                </FormItem>
                                {
                                    this.props.specialPromotion.get('$eventInfo').toJS().allCardLevelCheck && this.state.iconDisplay ?
                                        <div style={{ display: this.state.tableDisplay ? 'block' : 'none', width: '71%', marginLeft: '110px' }}>
                                            <ExcludeCardTable catOrCard={this.props.type == '62' ? 'cat' : 'card'} />
                                        </div> : null
                                }
                                <div style={{ display: this.state.getExcludeEventList.length > 0 && this.state.tableDisplay ? 'block' : 'none', width: '71%', marginLeft: '110px' }}>
                                    <ExcludeGroupTable />
                                </div>
                            </div> : null
                    }
                    {
                        ATSEnabledTypes.includes(`${this.props.type}`) && this.renderAdvancedDateSettings()
                    }
                    {
                        // 活动起始结束日期选择组件
                        showActDataType.includes(this.props.type) ? this.renderPeriodSelector() : null

                    }
                    {
                        this.props.type != '77' && this.props.type != '69' ?
                        <FormItem
                            label={this.props.intl.formatMessage(STRING_SPE.d7ekp859lc11113)}
                            className={styles.FormItemStyle}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 17 }}
                        >
                            {getFieldDecorator('description', {
                                rules: [
                                    { 
                                        required: this.props.type != '88' ? true : false,
                                        message: `${this.props.intl.formatMessage(STRING_SPE.d7ekp859ld12164)}`
                                     },
                                    { max: 1000, message: `${this.props.intl.formatMessage(STRING_SPE.d17009e3e35b1366)}` },
                                ],
                                initialValue: this.state.description,
                            })(
                                <Input type="textarea" placeholder={this.props.intl.formatMessage(STRING_SPE.d34id2b3ir14116)} onChange={this.handleDescriptionChange} />
                            )}
                        </FormItem> : null
                    }

                </div>


            </Form>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        promotionBasicInfo: state.sale_promotionBasicInfo_NEW,
        saleCenter: state.sale_saleCenter_NEW,
        occupiedWeChatInfo: state.queryWeixinAccounts,
        allWeChatIDListLoading: state.sale_giftInfoNew.get('mpListLoading'),
        allWeChatIDList: state.sale_giftInfoNew.get('mpList').toJS().map(item => item.mpID),
        allWeChatAccountList: state.sale_giftInfoNew.get('mpList').toJS().filter(item => String(item.mpTypeStr) === '21'),
        user: state.user.toJS(),
        specialPromotion: state.sale_specialPromotion_NEW,
        isUpdate:state.sale_myActivities_NEW.get('isUpdate'),
        timeList: state.sale_mySpecialActivities_NEW.get('timeList')
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSpecialBasicInfo: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
        saleCenterQueryFsmGroupSettleUnit: (opts) => { 
            dispatch(saleCenterQueryFsmGroupSettleUnit(opts));
        },
        saleCenterGetExcludeCardLevelIds: (opts) => {
            dispatch(saleCenterGetExcludeCardLevelIds(opts));
        },
        fetchSpecialCardLevel: (opts) => {
            dispatch(fetchSpecialCardLevel(opts));
        },
        saleCenterGetExcludeEventList: (opts) => {
            dispatch(saleCenterGetExcludeEventList(opts));
        },
        saleCenterGetShopOfEventByDate: (opts) => {
            return dispatch(saleCenterGetShopOfEventByDate(opts));
        },
        queryOccupiedWeixinAccounts: (opts) => {
            dispatch(queryOccupiedWeiXinAccountsStart(opts));
        },
        queryOccupiedDouYinAccounts: (opts) => {
            dispatch(queryOccupiedDouYinAccountsStart(opts));
        },
        queryWechatMpInfo: (opts) => {
            dispatch(queryWechatMpInfo(opts))
        },
        querySMSSignitureList: () => {
            dispatch(querySMSSignitureList())
        },
        queryFsmGroupEquityAccount: (opts) => {
            dispatch(queryFsmGroupEquityAccount(opts))
        },
        getEventExcludeCardTypes: (opts) => {
            dispatch(getEventExcludeCardTypes(opts))
        },
        getAuthLicenseData: (opts) => {
            return dispatch(getAuthLicenseData(opts))
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(StepOneWithDateRange));
