import React from 'react'
import {
    Input,
    Form,
    Select,
    DatePicker,
    Checkbox,
    message,
    Tag,
    Row,
    Col,
    Icon,
} from 'antd';
import styles from '../../SaleCenterNEW/ActivityPage.less';
import '../../../components/common/ColorPicker.less';
import CustomTimeRangeInput from '../../../containers/SaleCenterNEW/common/CustomTimeRangeInput';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;
const moment = require('moment');
const DATE_FORMAT = 'YYYYMMDDHHmm00';
const disabledDate = (current) => {
    // Can not select days before today
    return current && current.format('YYYYMMDD') < moment().format('YYYYMMDD');
}
const ACTIVITY_CYCLE_TYPE = {
    EVERYDAY: '0',
    WEEKLY: '1',
    MONTHLY: '2',
};

const WEEK_OPTIONS = [
    {
        label: '日',
        value: '7',
    },
    {
        label: '一',
        value: '1',
    },
    {
        label: '二',
        value: '2',
    },
    {
        label: '三',
        value: '3',
    },
    {
        label: '四',
        value: '4',
    },
    {
        label: '五',
        value: '5',
    },
    {
        label: '六',
        value: '6',
    },
];

const MONTH_OPTIONS = ((start, end) => {
    return Array(end - start).fill(0).map((v, index) => {
        return {
            label: `${index + 1}`,
            value: `${index + 1}`,
        };
    });
})(0, 31);
const options = WEEK_OPTIONS;
const days = MONTH_OPTIONS;

class BasicInfo extends React.Component {
    constructor(props) {
        super(props);
        let excludeDateArray;
        let selectWeekValue;
        let selectMonthValue;
        let validCycleType;
        let expand;
        let timeRangeInfo;
        try {
            const eventInfo = {
                ...props.data,
                validCycle: props.data.validCycle.split(','),
            }
            excludeDateArray = (eventInfo.excludedDate || '')
                .split(',').filter(str => !!str).map(item => moment(item, 'YYYYMMDD'))
            timeRangeInfo = eventInfo.timeLst.filter(time => time.startTime && time.endTime).map((time) => ({
                start: moment(time.startTime, 'HHmm'),
                end: moment(time.endTime, 'HHmm'),
            }))           
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
        } catch (e) {
            validCycleType = ACTIVITY_CYCLE_TYPE.EVERYDAY;
            excludeDateArray = [];
            selectWeekValue = ['1'];
            selectMonthValue = ['1'];
            timeRangeInfo = [
                {
                    start: undefined,
                    end: undefined,
                },
            ];
        }
        this.state = {
            description: props.data.description,
            startTime: props.data.startTime,
            endTime: props.data.endTime,
            name: props.data.name,
            // advanced time setting
            expand: !!expand,
            validCycleType,
            excludeDateArray,
            selectWeekValue,
            selectMonthValue,
            // advanced time setting
            timeRangeInfo,
            maxCount: 3,
        };
    }

    componentDidMount() {
        this.props.getSubmitFn({
            prev: undefined,
            next: this.handleSubmit,
            finish: undefined,
            cancel: undefined,
        });
    }

    handleSubmit = () => {
        let nextFlag = true;
        this.props.form.validateFieldsAndScroll((err) => {
            if (err) {
                nextFlag = false;
            }
        });
        // 存到wrapper
        const {
            description,
            startTime,
            endTime,
            name,
            validCycleType,
            selectWeekValue,
            selectMonthValue,
            excludeDateArray,
            timeRangeInfo,
        } = this.state;
        const timeLst = timeRangeInfo.filter(item => item.start && item.end).map((r) => {
            return {
                timeType: 'CONSUME_TIME',
                startTime: r.start.format('HHmm'),
                endTime: r.end.format('HHmm'),
            };
        });
        const excludedDate = excludeDateArray.map((d) => {
            return d.format('YYYYMMDD');
        }).join(',');
        let validCycle = null;
        if (validCycleType === ACTIVITY_CYCLE_TYPE.WEEKLY) {
            validCycle = selectWeekValue.map((week) => {
                return `w${week}`;
            }).join(',');
        } else if (validCycleType === ACTIVITY_CYCLE_TYPE.MONTHLY) {
            validCycle = selectMonthValue.map((month) => {
                return `m${month}`;
            }).join(',');
        }
        if (nextFlag) {
            this.props.onChange({
                timeLst,
                validCycle,
                excludedDate,
                description,
                startTime,
                endTime,
                name,
            });
        }
        return nextFlag;
    }

    handleDescriptionChange = (e) => {
        this.setState({
            description: e.target.value,
        });
    }

    handleDateRangeChange = (value, dateString) => { // value: Selected Time, dateString: Formatted Selected Time
        if (value.length > 1) {
            const startTime = value[0].format(DATE_FORMAT);
            const endTime = value[1].format(DATE_FORMAT);
            this.setState({
                startTime,
                endTime,
            });
        }
    }

    handleNameChange = (e) => {
        this.setState({
            name: e.target.value,
        });
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

    toggleAdvancedDateSettings = () => {
        this.setState(({ expand }) => {
            return ({
                expand: !expand
            })
        })
    }

    addTimeRange = () => {
        const _tmp = this.state.timeRangeInfo;
        _tmp.push({
            start: undefined,
            end: undefined,
        });

        this.setState({
            'timeRangeInfo': _tmp,
        });
    }

    deleteTimeRange = (index, e) => {
        const _tmp = this.state.timeRangeInfo;
        _tmp.splice(index, 1);

        this.setState({
            'timeRangeInfo': _tmp,
        })
    }

    onDateWeekChange = (value) => {
        if (!value.length) {
            return message.warning('至少要选择1天')
        }
        this.setState({
            selectWeekValue: value,
        });
    }

    onDateMonthChange = (value) => {
        if (!value.length) {
            return message.warning('至少要选择1天')
        }
        this.setState({
            selectMonthValue: value,
        });
    }

    setPromotionCycle = (value) => {
        this.setState({
            validCycleType: value,
        });
    }

    renderOperationIcon(index) {
        const _len = this.state.timeRangeInfo.length;

        if (_len == 1 && this.state.maxCount > _len) {
            return (
                <span className={styles.iconsStyle}>
                    <Icon className={styles.pulsIcon} disabled={false} type="plus-circle-o" onClick={this.addTimeRange} />
                </span>
            )
        }
        if (_len == this.state.maxCount && index == this.state.maxCount - 1) {
            return (
                <span className={styles.iconsStyle}>
                    <Icon
                        className={styles.deleteIconLeft}
                        type="minus-circle-o"
                        onClick={(e) => {
                            const _index = index;
                            this.deleteTimeRange(_index, e)
                        }}
                    />
                </span>
            )
        }
        if (index == _len - 1 && _len == this.state.maxCount - 1) {
            return (
                <span className={styles.iconsStyle}>
                    <Icon className={styles.pulsIcon} disabled={false} type="plus-circle-o" onClick={this.addTimeRange} />
                    <Icon
                        className={styles.deleteIcon}
                        type="minus-circle-o"
                        onClick={(e) => {
                            const _index = index;
                            this.deleteTimeRange(_index, e)
                        }}
                    />
                </span>
            )
        }
        return null
    }

    handleTimeRangeInfo = (value, index) => {
        const _timeRangeInfo = this.state.timeRangeInfo;
        _timeRangeInfo[index] = value;
        this.setState({
            timeRangeInfo: _timeRangeInfo,
        });
    }

    renderAdvancedDateSettings() {
        return (
            <div>
                <FormItem className={[styles.FormItemStyle, styles.formItemForMore].join(' ')} wrapperCol={{ span: 17, offset: 4 }}>
                    <span className={styles.gTip}>更多活动日期与时间的设置请使用</span>
                    <span className={styles.gDate} onClick={this.toggleAdvancedDateSettings}>高级日期设置</span>
                </FormItem>
                {this.state.expand && this.renderTimeSlot()}
                {this.state.expand && this.renderPromotionCycleSetting()}
                {this.state.expand && this.renderExcludedDatePicker()}
            </div>
        )
    }

    renderTimeSlot() {
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 17 },
        };

        const _timeRangeInfo = this.state.timeRangeInfo.map((timeRangeInfo, index) => {
            let _label = '活动时段';
            if (index) {
                _label = ' ';
            }
            return (
                <Row key={`${index}`}>
                    <Col>
                        <FormItem
                            label={_label}
                            className={styles.FormItemStyle}
                            validateStatus={this.state.timeRangeInfo[index].validateStatus}
                            help={this.state.timeRangeInfo[index].errMsg}
                            {...formItemLayout}
                        >
                            <CustomTimeRangeInput
                                onChange={(value) => {
                                    const _index = index;
                                    this.handleTimeRangeInfo(value, _index);
                                }}
                                value={Object.assign({}, this.state.timeRangeInfo[index])}
                                format="HH:mm"
                            />
                        </FormItem>
                    </Col>
                    <Col>
                        {this.renderOperationIcon(index)}
                    </Col>
                </Row>
            )
        })
        return (
            <div>
                {_timeRangeInfo}
            </div>
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
    }

    renderExcludedDate() {
        return this.state.excludeDateArray.map((date, index) => {
            const callback = (e) => {
                e.preventDefault();
                this.unselectExcludeDate(index);
            };

            return (
                <Tag key={`${index}`} closable={true} onClose={callback}>{date.format('YYYY-MM-DD')}</Tag>
            );
        });
    }

    renderExcludedDatePicker() {
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 17 },
        };
        return (
            <FormItem label="活动排除日期" className={styles.FormItemStyle} {...formItemLayout}>
                <DatePicker onChange={
                    (moment, dateString) => {
                        this.excludeDatePicker(moment, dateString);
                    }
                }
                />
                {
                    this.state.excludeDateArray.length > 0 ? (
                        <div className={styles.showExcludeDate}>{this.renderExcludedDate()}</div>
                    ) : null
                }
            </FormItem>
        )
    }

    renderPromotionCycleSetting() {
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 17 },
        };
        return (
            <FormItem label="选择周期" className={styles.FormItemStyle} {...formItemLayout}>
                <Select
                    size="default"
                    placeholder="请选择周期"
                    getPopupContainer={(node) => node.parentNode}
                    defaultValue={this.state.validCycleType}
                    onChange={(arg) => {
                        this.setPromotionCycle(arg);
                    }}
                >
                    <Option value="0">每日</Option>
                    <Option value="1">每周</Option>
                    <Option value="2">每月</Option>
                </Select>
                <div className={styles.SeniorDateMain}>
                    {this.renderPromotionCycleDetailSetting()}
                </div>

            </FormItem>
        )
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
    /** 高级日期设置结束 TODO: 再有类似高级日期设置，考虑抽离成组件 */

    renderPromotionType() {
        return (
            <FormItem
                label={'活动类型'}
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >
                <p>{'商城秒杀'}</p>
            </FormItem>
        )
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form className={styles.FormStyle}>
                {this.renderPromotionType()}
                <FormItem
                    label="活动名称"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
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
                <FormItem
                    label="活动起止时间"
                    className={[styles.FormItemStyle, styles.cardLevelTree].join(' ')}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {getFieldDecorator('rangePicker', {
                        rules: [{
                            required: true,
                            message: '请选择活动起止时间',
                        }],
                        onChange: this.handleDateRangeChange,
                        initialValue: this.state.startTime && this.state.endTime ? [moment(this.state.startTime, DATE_FORMAT), moment(this.state.endTime, DATE_FORMAT)] : [],
                    })(
                        <RangePicker
                            showTime={{ format: 'HH:mm' }}
                            className={styles.ActivityDateDayleft}
                            disabledDate={disabledDate}
                            style={{ width: '100%' }}
                            format="YYYY-MM-DD HH:mm"
                            placeholder={['开始时间', '结束时间']}
                        />
                    )}
                </FormItem>
                { this.renderAdvancedDateSettings() }
                <FormItem
                    label="活动说明"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {getFieldDecorator('description', {
                        rules: [
                            { max: 200, message: '最多200个字符' },
                        ],
                        initialValue: this.state.description,
                        onChange: this.handleDescriptionChange,
                    })(
                        <Input type="textarea" placeholder="活动说明最多200个字符"/>
                    )}
                </FormItem>
            </Form>
        )
    }
}

export default Form.create()(BasicInfo);
