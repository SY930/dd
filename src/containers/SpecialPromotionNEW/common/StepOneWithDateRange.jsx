import React from 'react'
import { Row, Col, Input, DatePicker, TimePicker, Form, Select, Icon, Button } from 'antd';
import { connect } from 'react-redux'
import styles from '../../SaleCenterNEW/ActivityPage.less';
import '../../../components/common/ColorPicker.less';
import {
    saleCenterSetSpecialBasicInfoAC,
    saleCenterQueryFsmGroupSettleUnit,
    saleCenterGetExcludeCardLevelIds,
    saleCenterGetExcludeEventList,
    saleCenterGetShopOfEventByDate,
} from '../../../redux/actions/saleCenterNEW/specialPromotion.action';
import { SEND_MSG, NOTIFICATION_FLAG } from '../../../redux/actions/saleCenterNEW/types';
import ExcludeCardTable from './ExcludeCardTable';
import ExcludeGroupTable from './ExcludeGroupTable';
import PriceInput from '../../SaleCenterNEW/common/PriceInput';
import {fetchSpecialCardLevel} from "../../../redux/actions/saleCenterNEW/mySpecialActivities.action";
import {queryOccupiedWeiXinAccountsStart} from "../../../redux/actions/saleCenterNEW/queryWeixinAccounts.action";
import {queryWechatMpInfo} from "../../GiftNew/_action";

const Immutable = require('immutable');
const moment = require('moment');

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

const fullOptionSmsGate = [ // 选项有5种
    '53', '61', '62', '63', '70'
];

const simpleOptionSmsGate = [ // 选项有2种
    '21', '20', '30', '60', '23', '64', '31'
];

class StepOneWithDateRange extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            description: null,
            dateRange: Array(2),
            name: '',
            startTime: '', // 礼品发放时间
            smsGate: '0',
            timeString: '',
            tableDisplay: false,
            iconDisplay: false,
            mpID: props.specialPromotion.getIn(['$eventInfo', 'pushMessageMpID']) || undefined,
            lastConsumeIntervalDays: '',
            getExcludeEventList: [],
            lastConsumeIntervalDaysStatus: 'success',
            tipDisplay: 'none',
            isLoadingWeChatOccupiedInfo: props.occupiedWeChatInfo.get('isLoading'),
            occupiedWeChatIDs: props.occupiedWeChatInfo.get('occupiedIDs').toJS(),
            isAllWeChatIDOccupied: props.occupiedWeChatInfo.get('isAllOccupied'),
            selectedIDs: props.specialPromotion.getIn(['$eventInfo', 'mpIDList']).toJS(),
            allWeChatIDList: props.allWeChatIDList,
            allWeChatIDListLoading: props.allWeChatIDListLoading,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.getDateCount = this.getDateCount.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleMpIDChange = this.handleMpIDChange.bind(this);
        this.msgSendTime = this.msgSendTime.bind(this);
        this.handlesmsGateChange = this.handlesmsGateChange.bind(this);
        this.onTimePickerChange = this.onTimePickerChange.bind(this);
        this.setErrors = this.setErrors.bind(this);
        this.throttledCheckWeChatID = _.throttle(this.checkIfAllOccupied.bind(this), 500, {leading: false, trailing: true});
    }

    componentDidMount() {
        this.props.getSubmitFn({
            prev: undefined,
            next: this.handleSubmit,
            finish: undefined,
            cancel: undefined,
        });
        this.props.queryWechatMpInfo();

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
        if (this.props.type === '31' && this.props.specialPromotion.get('$eventInfo').size > 30) {
            const itemID = specialPromotion.itemID;
            this.props.queryOccupiedWeixinAccounts({ eventStartDate: specialPromotion.eventStartDate, eventEndDate: specialPromotion.eventEndDate, eventWay: '31', itemID });
        }
        if (specialPromotion.eventStartDate !== '20000101' && specialPromotion.eventEndDate !== '29991231' &&
            specialPromotion.eventStartDate !== '0' && specialPromotion.eventEndDate !== '0' &&
            specialPromotion.eventStartDate !== '' && specialPromotion.eventEndDate !== '') {
            this.setState({
                name: specialPromotion.eventName || this.state.name, // ||是因为选择日期自动更新，redux的‘’会覆盖掉state的值
                description: specialPromotion.eventRemark || this.state.description,
                smsGate: specialPromotion.smsGate || this.state.smsGate || '0',
                dateRange: [moment(specialPromotion.eventStartDate, 'YYYYMMDD'), moment(specialPromotion.eventEndDate, 'YYYYMMDD')],
                // getExcludeEventList:specialPromotion.getExcludeEventList||[],
                lastConsumeIntervalDays: specialPromotion.lastConsumeIntervalDays,
            })
        } else {
            this.setState({
                startTime: specialPromotion.startTime.substring(0, 8),
                timeString: specialPromotion.startTime.substring(8),
                smsGate: specialPromotion.smsGate || this.state.smsGate || '0',
                name: specialPromotion.eventName || this.state.name,
                description: specialPromotion.eventRemark || this.state.description,
            })
        }
        if (this.props.type == '50' || this.props.type == '53' || this.props.type == '60'
            || this.props.type == '61' || this.props.type == '62' || this.props.type == '63' || this.props.type == '70') {
            this.props.saleCenterQueryFsmGroupSettleUnit({ groupID: this.props.user.accountInfo.groupID });
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
                    this.setErrors('rangePicker', '相同时段内，只允许一个唤醒送礼活动进行，您已有唤醒送礼活动正在进行，请重选时段')
                })
            } else {
                this.setState({
                    getExcludeEventList: [],
                })
            }
            if (nextProps.specialPromotion.get('$eventInfo').toJS().allCardLevelCheck) {
                this.setState({ iconDisplay: true }, () => {
                    this.setErrors('rangePicker', '当前时段内，会员卡类/卡等级被其他同类活动全部占用，请重选时段')
                });
            }
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
            if (this.props.occupiedWeChatInfo !== nextProps.occupiedWeChatInfo) {
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
                this.setErrors('rangePicker', '当前时段内，集团下公众号被其他同类活动全部占用，请重选时段');
                return true;
            }
        }
        return false;
    }

    handleSubmit() {
        let nextFlag = true;

        this.props.form.validateFieldsAndScroll((err1, basicValues) => {
            if (err1) {
                nextFlag = false;
            }
        });
        if (this.props.type == '63' && !this.state.lastConsumeIntervalDays > 0) {
            nextFlag = false;
            this.setState({ lastConsumeIntervalDaysStatus: 'error' });
        }
        // 升级送礼,消费送礼
        if (this.props.specialPromotion.get('$eventInfo').toJS().allCardLevelCheck) {
            nextFlag = false;
            this.setErrors('rangePicker', '当前时段内，会员卡类/卡等级被其他同类活动全部占用，请重选时段')
        }

        // 关注送礼
        if (this.props.type == '31') {
            this.checkIfAllOccupied() && (nextFlag = false);
        }

        if (this.state.getExcludeEventList.length > 0) {
            nextFlag = false;
            this.setErrors('rangePicker', '相同时段内，只允许一个唤醒送礼活动进行，您已有唤醒送礼活动正在进行，请重选时段')
        }
        if (this.state.allShopCheck) {
            nextFlag = false;
            this.setErrors('rangePicker', '当前时段内，可选店铺被其他同类活动全部占用，请重选时段')
        }
        if (nextFlag) {
            if (this.props.type == '53' || this.props.type == '50') {
                this.props.setSpecialBasicInfo({
                    startTime: this.state.startTime + this.state.timeString || '',
                    eventName: this.state.name,
                    eventRemark: this.state.description,
                    smsGate: this.state.smsGate,
                    pushMessageMpID: this.state.smsGate >= 2 ? this.state.mpID : '',
                })
            } else if (this.props.type == '61' || this.props.type == '62') {
                this.props.setSpecialBasicInfo({
                    smsGate: this.state.smsGate,
                    pushMessageMpID: this.state.smsGate >= 2 ? this.state.mpID : '',
                    eventName: this.state.name,
                    eventRemark: this.state.description,
                    eventStartDate: this.state.dateRange[0] ? this.state.dateRange[0].format('YYYYMMDD') : '0',
                    eventEndDate: this.state.dateRange[1] ? this.state.dateRange[1].format('YYYYMMDD') : '0',
                });
            } else {
                this.props.setSpecialBasicInfo({
                    eventName: this.state.name,
                    eventRemark: this.state.description,
                    eventStartDate: this.state.dateRange[0] ? this.state.dateRange[0].format('YYYYMMDD') : '0',
                    eventEndDate: this.state.dateRange[1] ? this.state.dateRange[1].format('YYYYMMDD') : '0',
                    smsGate: this.state.smsGate,
                    pushMessageMpID: this.state.smsGate >= 2 ? this.state.mpID : '',
                    lastConsumeIntervalDays: this.state.lastConsumeIntervalDays,
                })
            }
        }
        return nextFlag;
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
        if (this.props.specialPromotion.get('$eventInfo').size > 30) {
            // 编辑时，解放自己的选项不被排除
            opts.itemID = this.props.specialPromotion.get('$eventInfo').toJS().itemID;
        }
        if (opts.eventStartDate) {
            if (this.props.type === '61' || this.props.type === '62' || this.props.type === '23') {
                this.setState({
                    tableDisplay: false,
                    iconDisplay: false,
                });
                this.props.saleCenterGetExcludeCardLevelIds(opts);
            }
            if (this.props.type === '63') {
                this.props.saleCenterGetExcludeEventList(opts);
            }
            if (this.props.type === '64') {
                // EditBoxForShops组件-编辑时-componentDidMount再发一次;
                this.props.saleCenterGetShopOfEventByDate({ ...opts, eventID: opts.itemID, eventWay: undefined, itemID: undefined }).then(allShopCheck => {
                    this.setState({
                        allShopCheck
                    }, () => {
                        allShopCheck && this.setErrors('rangePicker', '当前时段内，可选店铺被其他同类活动全部占用，请重选时段')
                    })
                })
            }
            if (this.props.type === '31') {
                this.props.queryOccupiedWeixinAccounts({ ...opts, eventWay: '31', itemID: opts.itemID });
            }
        }
        this.setState({
            dateRange: date,
            dateString,
        })
    }

    handleNameChange(e) {
        this.setState({
            name: e.target.value,
        });
    }

    handleMpIDChange(v) {
        this.setState({
            mpID: v,
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
        if (startTime != '' && startTime == moment().format('YYYYMMDD') && this.state.timeString != '' && this.state.timeString < moment().format('HHmmss') + 10) {
            this.props.form.setFieldsValue({
                sendTime: '',
            });
        }
        if (startTime != '' && this.state.timeString == '' && moment().hours() < 23) {
            const minutes = moment().minutes() < 50 ? moment().minutes() + 10 : `0${moment().minutes() - 50}`;
            let hours = moment().minutes() < 50 ? moment().hours() : moment().hours() + 1;
            hours = hours >= 10 ? hours : `0${hours}`;
            this.setState({
                timeString: `${hours}${minutes}00`,
            }, () => {
                this.props.form.setFieldsValue({
                    sendTime: this.state.timeString ? moment(this.state.timeString, 'HHmm') : '',
                });
            })
        }
    }
    handlesmsGateChange(val) {
        this.setState({
            smsGate: val,
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
        let labelText = this.props.type == '53' ? '礼品发送日期' : '短信发送日期',
            messageText = this.props.type == '53' ? '请选择礼品发送日期' : '请选择短信发送日期'

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 17 },
        };
        const { getFieldDecorator } = this.props.form;

        // 判断日期格式是否合法,不合法不设置defaultValue
        let dateRangeProps;
        const disabledDate = (current) => {
            // Can not select days before today
            return current && current.format('YYYYMMDD') < moment().format('YYYYMMDD');
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
        const disabledHours = () => {
            const nowHour = moment().hour();
            const range = [];
            for (let i = 0; i < 24; i++) {
                range.push(i);
            }
            if (moment().minutes() + 10 > 59) {
                return range.splice(0, nowHour + 1)
            }
            return range.splice(0, nowHour);
        }
        const disabledMinutes = (selectedHour) => {
            const range = [];
            for (let i = 0; i < 60; i++) {
                range.push(i);
            }
            if (moment().hour() == selectedHour) {
                return range.splice(0, moment().minutes() + 10);
            }
            if (moment().minutes() > 50) {
                return range.splice(0, moment().minutes() - 50);
            }
            if (selectedHour == null || selectedHour < moment().hour()) {
                return range;
            }
            return [];
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
            <div style={{ display: this.state.tipDisplay, height: 135, width: 470 }} className={styles.tip}>
                <p>{promotionTypeConfig ? promotionTypeConfig.tip : ''}</p>
                <div>
                    <div className={styles.tipBtn}>
                        <Button
                            type="ghost"
                            style={{ color: '#787878' }}
                            onClick={() => {
                                this.setState({ tipDisplay: 'none' });
                            }}
                        >我知道了
                        </Button>
                    </div>
                </div>
            </div>
        );
        return (
            <Form>
                <FormItem
                    label="活动类型"
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
                    <FormItem label="活动名称" className={styles.FormItemStyle} {...formItemLayout}>
                        {getFieldDecorator('promotionName', {
                            rules: [{
                                whitespace: true,
                                required: true,
                                message: '汉字、字母、数字组成，不多于50个字符',
                                pattern: /^[\u4E00-\u9FA5A-Za-z0-9\.\（\）\(\)\-\-]{1,50}$/,
                            }],
                            initialValue: this.state.name,
                        })(
                            <Input placeholder="请输入活动名称" onChange={this.handleNameChange} />
                        )}
                    </FormItem>
                    {
                        this.props.type == '53' || this.props.type == '50' ?
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
                                                disabledDate={disabledDate}
                                                style={{ width: '100%' }}
                                                placeholder="请选择日期"
                                            />
                                        )}
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem className={styles.FormItemStyle} >
                                        {getFieldDecorator('sendTime', {
                                            rules: [{
                                                required: true,
                                                message: '请选择时间',
                                            }],
                                            initialValue: timeStringInitialValue,
                                        })(
                                            <TimePicker
                                                disabledHours={moment().format('YYYYMMDD') == this.state.startTime ? disabledHours : noDisabled}
                                                disabledMinutes={moment().format('YYYYMMDD') == this.state.startTime ? disabledMinutes : noDisabled}
                                                format="HH:mm"
                                                style={{ width: '100%' }}
                                                onChange={this.onTimePickerChange}
                                                placeholder="请选择时间"
                                            />
                                        )}
                                        {
                                            this.props.type == '50' && <p className={styles.msgTip}>注：短信发送会延迟，建议设置时间提前1-2个小时</p>
                                        }
                                    </FormItem>
                                </Col>
                            </Row> : null
                    }
                    {
                        this.props.type == '63' ?
                            <FormItem
                                label="距上次消费天数"
                                className={styles.FormItemStyle}
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 17 }}
                                validateStatus={this.state.lastConsumeIntervalDaysStatus}
                                help={this.state.lastConsumeIntervalDaysStatus == 'success' ? null : '请选择距上次消费天数'}
                            >
                                {getFieldDecorator('lastConsumeIntervalDays', {
                                    rules: [{
                                        required: true,
                                        message: '请选择距上次消费天数',
                                    }],
                                    initialValue: { number: this.state.lastConsumeIntervalDays },
                                })(
                                    <PriceInput
                                        // value={{ number: this.state.lastConsumeIntervalDays }}
                                        onChange={(val) => {
                                            this.setState({
                                                lastConsumeIntervalDays: val.number,
                                                lastConsumeIntervalDaysStatus: val.number > 0 ? 'success' : 'error',
                                            })
                                        }}
                                        addonAfter="天"
                                        modal="int"
                                    />
                                )}
                            </FormItem> : null
                    }
                    {fullOptionSmsGate.includes(String(this.props.type))
                         ?
                            <FormItem
                                label="是否发送消息"
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
                                label="是否发送消息"
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
                    }{ [...simpleOptionSmsGate, ...fullOptionSmsGate].includes(String(this.props.type)) && this.state.smsGate >= 2
                         ?
                            <FormItem
                                label="微信公众号选择"
                                required
                                className={styles.FormItemStyle}
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 17 }}
                            >{getFieldDecorator('mpID', {
                                rules: [{
                                    required: true,
                                    message: '请选择微信推送的公众号',
                                }],
                                initialValue: this.state.mpID,
                                onChange: this.handleMpIDChange
                            })(
                                <Select size="default"
                                        placeholder="请选择微信推送的公众号"
                                        getPopupContainer={(node) => node.parentNode}
                                >
                                    {
                                        this.props.allWeChatAccountList.map((item) => {
                                            return (<Option value={`${item.mpID}`} key={`${item.mpID}`}>{item.mpName}</Option>)
                                        })
                                    }
                                </Select>
                            )}
                            </FormItem> : null
                    }
                    {
                        this.props.type != '53' && this.props.type != '50' && this.props.type != '60' || this.props.type == '70' ?
                            <div>
                                <FormItem
                                    label="活动起止日期"
                                    className={[styles.FormItemStyle, styles.cardLevelTree].join(' ')}
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 17 }}
                                >
                                    <Row>
                                        <Col span={21}>
                                            {getFieldDecorator('rangePicker', {
                                                rules: [{
                                                    required: true,
                                                    message: '请选择活动起止日期',
                                                }],
                                                ...dateRangeProps,
                                            })(
                                                <RangePicker
                                                    className={styles.ActivityDateDayleft}
                                                    style={{ width: '100%' }}
                                                    disabledDate={this.props.type == '61' || this.props.type == '62' || this.props.type == '63' || this.props.type == '23' || this.props.type == '70' ? disabledDate : null}
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
                                                <span>天</span>
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

                    <FormItem
                        label="活动说明"
                        className={styles.FormItemStyle}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17 }}
                    >
                        {getFieldDecorator('description', {
                            rules: [{
                                required: true,
                                message: '1---200个字符',
                                pattern: /^[\s\S]{1,200}$/,
                            }],
                            initialValue: this.state.description,
                        })(
                            <Input type="textarea" placeholder="请输入活动说明,1---200个字符" onChange={this.handleDescriptionChange} />
                        )}
                    </FormItem>
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
        allWeChatAccountList: state.sale_giftInfoNew.get('mpList').toJS(),
        user: state.user.toJS(),
        specialPromotion: state.sale_specialPromotion_NEW,
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
        queryWechatMpInfo: (opts) => {
            dispatch(queryWechatMpInfo())
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(StepOneWithDateRange));
