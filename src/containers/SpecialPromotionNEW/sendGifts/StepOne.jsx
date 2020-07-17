import React from 'react'
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
} from 'antd';
import { connect } from 'react-redux'
import styles from '../../SaleCenterNEW/ActivityPage.less';
import {
    saleCenterSetSpecialBasicInfoAC,
    saleCenterQueryFsmGroupSettleUnit,
    saleCenterGetExcludeCardLevelIds,
    queryFsmGroupEquityAccount,
    querySMSSignitureList
} from '../../../redux/actions/saleCenterNEW/specialPromotion.action';
import { SEND_MSG, NOTIFICATION_FLAG, ACTIVITY_CYCLE_TYPE } from '../../../redux/actions/saleCenterNEW/types';
import { fetchSpecialCardLevel } from "../../../redux/actions/saleCenterNEW/mySpecialActivities.action";
import { injectIntl } from 'i18n/common/injectDecorator'
import { STRING_SPE } from 'i18n/common/special';
import EveryDay from '../../GiftNew/GiftInfo/TicketBag/EveryDay';

const moment = require('moment');

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

@injectIntl
class StepOne extends React.Component {
    constructor(props) {
        super(props);
        let excludeDateArray;
        let selectWeekValue;
        let selectMonthValue;
        let validCycleType;
        let expand;
        try {
            const eventInfo = props.specialPromotion.getIn(['$eventInfo']).toJS();
            excludeDateArray = eventInfo.excludedDate.map(item => moment(item, 'YYYYMMDD'))
            expand = !!excludeDateArray.length;
            if (!eventInfo.validCycle) {
                validCycleType = ACTIVITY_CYCLE_TYPE.EVERYDAY;
                selectWeekValue = ['1'];
                selectMonthValue = ['1'];
            } else if (eventInfo.validCycle[0].startsWith('m')) {
                expand = true;
                validCycleType = ACTIVITY_CYCLE_TYPE.MONTHLY;
                selectWeekValue = ['1'];
                selectMonthValue = eventInfo.validCycle.map(item => item.substring(1));
            } else if (eventInfo.validCycle[0].startsWith('w')) {
                expand = true;
                validCycleType = ACTIVITY_CYCLE_TYPE.WEEKLY;
                selectMonthValue = ['1'];
                selectWeekValue = eventInfo.validCycle.map(item => item.substring(1));
            }
        } catch (e) {
            validCycleType = ACTIVITY_CYCLE_TYPE.EVERYDAY;
            excludeDateArray = [];
            selectWeekValue = ['1'];
            selectMonthValue = ['1'];
        }
        this.state = {
            description: null,
            dateRange: Array(2),
            name: '',
            startTime: '', // 礼品发放时间
            smsGate: '0',
            timeString: '',
            tableDisplay: false,

            // advanced time setting
            // expand: !!expand,
            validCycleType,                             // 每周/每月/每日
            excludeDateArray,
            selectWeekValue,
            selectMonthValue,

            iconDisplay: false,
            getExcludeEventList: [],
            tipDisplay: 'none',
            isLoadingWeChatOccupiedInfo: props.occupiedWeChatInfo.get('isLoading'),
            occupiedWeChatIDs: props.occupiedWeChatInfo.get('occupiedIDs').toJS(),
            signID: props.specialPromotion.getIn(['$eventInfo', 'signID']) || '',
            isAllWeChatIDOccupied: props.occupiedWeChatInfo.get('isAllOccupied'),
            // selectedIDs: props.specialPromotion.getIn(['$eventInfo', 'mpIDList']).toJS(),
            allWeChatIDList: props.allWeChatIDList,
            allWeChatIDListLoading: props.allWeChatIDListLoading,
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
        // this.throttledCheckWeChatID = _.throttle(this.checkIfAllOccupied.bind(this), 500, { leading: false, trailing: true });
    }

    componentDidMount() {
        this.props.getSubmitFn({
            prev: undefined,
            next: this.handleSubmit,
            finish: undefined,
            cancel: undefined,
        });
        // document.addEventListener('click', this.onFakeDatePickerBlur)
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
        // this.props.queryWechatMpInfo({ subGroupID: specialPromotion.subGroupID });
        if (specialPromotion.eventStartDate !== '20000101' && specialPromotion.eventEndDate !== '29991231' &&
            specialPromotion.eventStartDate !== '0' && specialPromotion.eventEndDate !== '0' &&
            specialPromotion.eventStartDate !== '' && specialPromotion.eventEndDate !== '') {
            this.setState({
                name: specialPromotion.eventName || this.state.name, // ||是因为选择日期自动更新，redux的‘’会覆盖掉state的值
                description: specialPromotion.eventRemark || this.state.description,
                smsGate: specialPromotion.smsGate || this.state.smsGate || '0',
                dateRange: [moment(specialPromotion.eventStartDate, 'YYYYMMDD'), moment(specialPromotion.eventEndDate, 'YYYYMMDD')],
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

        // 群发短信以及其它可发短信的活动，要查权益账户和短信签名
        // if (this.props.type == '50' || fullOptionSmsGate.includes(`${this.props.type}`)) {
            specialPromotion.settleUnitID > 0 && !(specialPromotion.accountNo > 0) ?
                this.props.saleCenterQueryFsmGroupSettleUnit({ groupID: this.props.user.accountInfo.groupID })
                :
                this.props.queryFsmGroupEquityAccount();
            this.props.querySMSSignitureList();
        // }
        // 活动名称auto focus
        try {
            this.promotionNameInputRef.focus()
        } catch (e) {
            // oops
        }
    }
    componentWillUnmount() {
        // document.removeEventListener('click', this.onFakeDatePickerBlur)
    }

    // onFakeDatePickerBlur = (e) => {
    //     if (this.fakeDatePicker) {
    //         let element = e.target;
    //         while (element.parentNode) {
    //             if (element === this.fakeDatePicker
    //                 || (element.className || '').includes('ant-calendar-picker-container')) {
    //                 break;
    //             }
    //             element = element.parentNode
    //         }
    //         if (!element.parentNode) {
    //             this.setState({ open: false })
    //         }
    //     }
    // }

    setErrors(target, text) {
        this.props.form.setFields({
            [target]: {
                errors: [new Error(text)],
            },
        })
    }
    componentWillReceiveProps(nextProps, nextState) {
        // 是否更新
        if (this.props.specialPromotion.get('$eventInfo') !== nextProps.specialPromotion.get('$eventInfo')) {
            // const specialPromotion = nextProps.specialPromotion.get('$eventInfo').toJS();
            // selectedIDs = specialPromotion.mpIDList;
            // if (specialPromotion.getExcludeEventList && specialPromotion.getExcludeEventList.length > 0) {
            //     this.setState({
            //         getExcludeEventList: specialPromotion.getExcludeEventList || [],
            //     }, () => {
            //         this.setErrors('rangePicker', `${this.props.intl.formatMessage(STRING_SPE.de8g05amdm019)}`)
            //     })
            // } else {
            //     this.setState({
            //         getExcludeEventList: [],
            //     })
            // }
            if (nextProps.specialPromotion.get('$eventInfo').toJS().allCardLevelCheck && this.props.type != '23') { // 线上餐厅送礼活动过于复杂不限制下一步
                this.setState({ iconDisplay: true }, () => {
                    this.setErrors('rangePicker', `${this.props.intl.formatMessage(STRING_SPE.d31f01f38ji1267)}`)
                });
            }
        }
    }

    handleSubmit() {
        let nextFlag = true;
        const { type, form: {
            getFieldDecorator: decorator,
            getFieldValue,
            getFieldsValue
        } } = this.props;
        this.props.form.validateFieldsAndScroll((err1, basicValues) => {
            if (err1) {
                nextFlag = false;
            }
        });
        // if (this.state.getExcludeEventList.length > 0) {
        //     nextFlag = false;
        //     this.setErrors('rangePicker', `${this.props.intl.formatMessage(STRING_SPE.de8g05amdm019)}`)
        // }
        // if (this.state.allShopCheck) {
        //     nextFlag = false;
            // this.setErrors('rangePicker', `${this.props.intl.formatMessage(STRING_SPE.d5g391i90j344)}`)
        // }

        /**
         const {
                    validCycleType,
                    selectMonthValue,
                    selectWeekValue
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
                this.props.setSpecialBasicInfo({
                    excludedDate: (this.state.excludeDateArray || []).map(moments => moments.format('YYYYMMDD')),
                    validCycle,
                })
         * 
        */
        const validCycleType = getFieldValue('dateInPeriodType');
        let validCycle = null;
        if(getFieldValue('dateDescInPeroid') instanceof Array) {
            if(validCycleType == 'm') {
                validCycle = getFieldValue('dateDescInPeroid').filter(item => item.startsWith('m'));
            }  else if(validCycleType == 'w'){
                validCycle = getFieldValue('dateDescInPeroid').filter(item => item.startsWith('w'));
            }
        }
        if (nextFlag) {
            this.props.setSpecialBasicInfo({
                startTime: this.state.startTime + this.state.timeString || '',              // 发送时间
                eventName: this.state.name,                                                 // 活动名称
                eventRemark: this.state.description,                                        // 活动描述
                smsGate: this.state.smsGate,                                                // 短信消息
                validCycle,                                                                 // 周期参数
                eventStartDate: this.state.dateRange[0] ? this.state.dateRange[0].format('YYYYMMDD') : '0',
                eventEndDate: this.state.dateRange[1] ? this.state.dateRange[1].format('YYYYMMDD') : '0',
                signID: this.state.signID,
                
            })
            
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
        // 编辑时，解放自己的选项不被排除; 新建时没有id, 也不会传到后端
        opts.itemID = this.props.specialPromotion.getIn(['$eventInfo', 'itemID']);
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
    handleSignIDChange = (val) => {
        this.setState({
            signID: val,
        })
    }
    onTimePickerChange(time) {

        // console.log('time is', time.format('HHmmss'));

        let timeString;
        try {
            timeString = time.format('HHmmss')
        } catch (error) {
            timeString = ''
        }
        if(typeof(timeString) == 'string' && timeString.length > 0) {
            if (timeString.substring(2, 4) != '00' && timeString.substring(2, 4) != '30' ) {
                timeString = `${timeString.substring(0, 2)}0000`
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
                    sendTime: '',
                });
            })
        }
    }

    /**
     * @description 渲染周期选择器
     * @example 群发礼品，按月，周，日等周期去发送营销券 (无为不按日期发放)
    */
    renderDateOfSendingPromotionSelector = () => {
        const { type, form: {
            getFieldDecorator: decorator,
            getFieldValue,
            setFieldsValue
        } } = this.props;
        const {
            $eventInfo : {
                validCycle
            } 
        } = this.props.specialPromotion.toJS();
        let dateInPeriodType = 'm';                // 默认为月

        if(validCycle instanceof Array && validCycle.length > 0) {
            if(validCycle[0].startsWith('w')) {
                dateInPeriodType = 'w'
            } 
        } else if(validCycle == null) {             // 为每日时后端返回null
            dateInPeriodType = 'd'  
        }

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
                        onChange: (val) => {
                            // 清除数据
                            if(getFieldValue('dateInPeriodType') != val) {
                                setFieldsValue({
                                    dateDescInPeroid: []
                                })
                            }
                        }
                    })(
                        <Select>
                            <Option value="m">每月</Option>
                            <Option value="w">每周</Option>
                            <Option value="d">每日</Option>
                        </Select>
                    )}
                </FormItem>
                {
                    this.renderDatePickerInWeekOrMonth()
                }
            </div>
        )
    }

    /**
     * @description 渲染周或者月具体的日期选择
    */
    renderDatePickerInWeekOrMonth = () => {

        const { form: { 
            getFieldDecorator: decorator,
            getFieldValue
        }} = this.props;

        const dateInPeriodType = getFieldValue('dateInPeriodType')

        let initialValue = [];
        const {
            $eventInfo : {
                validCycle
            } 
        } = this.props.specialPromotion.toJS();
        if(validCycle instanceof Array && validCycle.length > 0) {
            initialValue = validCycle;
        }
        if (dateInPeriodType == 'd') {
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

        const {
            $eventInfo : {
                startTime
            } 
        } = this.props.specialPromotion.toJS();
        // 不可用时间组件
        let disabledHours = () => {
            return [];
        };
        let disabledMinutes = () => {
            let result = [];
            for(let i=0; i < 60; i++){
                if(i != 0 && i != 30) {
                    result.push(i);
                }
            }
            return result;
        }

        let timeStringInitialValue = '';
        if(startTime != undefined && startTime.length > 0) {
            timeStringInitialValue = moment(startTime, 'HHmm');
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

    render() {
        // 营销基础信息
        let { startTime, timeString } = this.state,
            timeStringInitialValue = '',
            sendTimeProps = {
                onChange: this.msgSendTime,
            };
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 17 },
        };
        const { getFieldDecorator } = this.props.form;

        // 判断日期格式是否合法,不合法不设置defaultValue
        let dateRangeProps;
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
        return (
            <Form>
                <div>
                    <FormItem label={this.props.intl.formatMessage(STRING_SPE.d4546grade4128)} className={styles.FormItemStyle} {...formItemLayout}>
                        {getFieldDecorator('promotionName', {
                            rules: [
                                { required: true, message: `${this.props.intl.formatMessage(STRING_SPE.da8of2e6el5231)}` },
                                { max: 50, message: `${this.props.intl.formatMessage(STRING_SPE.de8fcgn43i698)}` },
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
                    <FormItem
                        label={this.props.intl.formatMessage(STRING_SPE.d21645473363b20173)}
                        className={[styles.FormItemStyle, styles.cardLevelTree].join(' ')}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17 }}
                    >
                        <Row>
                            <Col span={19}>
                                {getFieldDecorator('rangePicker', {
                                    rules: [{
                                        required: true,
                                        message: `${this.props.intl.formatMessage(STRING_SPE.du3ac84kn21119)}`,
                                    }],
                                    ...dateRangeProps,
                                })(
                                    <RangePicker
                                        className={styles.ActivityDateDayleft}
                                        style={{ width: '100%' }}
                                        disabledDate={null}
                                    />
                                )}
                            </Col>
                            <Col offset={1} span={4}>
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
                        
                    </FormItem>
                    {
                        // 渲染周期选择期
                        this.renderDateOfSendingPromotionSelector()
                    }

                    {
                        this.renderSendTimeSelector(disabledHours, disabledMinutes, noDisabled)
                    }
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

                    </FormItem>
                    {
                        (this.state.smsGate == 1 || this.state.smsGate == 3 || this.state.smsGate == 4) && (
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
                    <FormItem
                        label={this.props.intl.formatMessage(STRING_SPE.d7ekp859lc11113)}
                        className={styles.FormItemStyle}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17 }}
                    >
                        {getFieldDecorator('description', {
                            rules: [
                                { required: true, message: `${this.props.intl.formatMessage(STRING_SPE.d7ekp859ld12164)}` },
                                { max: 1000, message: `${this.props.intl.formatMessage(STRING_SPE.d17009e3e35b1366)}` },
                            ],
                            initialValue: this.state.description,
                        })(
                            <Input type="textarea" placeholder={this.props.intl.formatMessage(STRING_SPE.d34id2b3ir14116)} onChange={this.handleDescriptionChange} />
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
        allWeChatAccountList: state.sale_giftInfoNew.get('mpList').toJS().filter(item => String(item.mpTypeStr) === '21'),
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
        // 短信权益账户
        queryFsmGroupEquityAccount: (opts) => {
            dispatch(queryFsmGroupEquityAccount(opts))
        },
        querySMSSignitureList: () => {
            dispatch(querySMSSignitureList())
        },
        // queryWechatMpInfo: (opts) => {
        //     dispatch(queryWechatMpInfo(opts))
        // },

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(StepOne));
