import React from 'react'
import { Input, Row, Col, DatePicker, Tooltip, Icon, Select, Radio, message } from 'antd'
import styles from '../CreateActive.less'
import moment from 'moment'
import PriceInput from '../../../components/common/PriceInput/PriceInput'
import { checkAuthLicense } from '../../../helpers/util';

const { RangePicker } = DatePicker;
const Option = Select.Option;
const DATE_FORMAT = 'YYYYMMDD000000';
const RadioGroup = Radio.Group;

// 活动说明的render函数
export function renderEventRemark(d) {
    const { formData, authLicenseData } = this.props.createActiveCom;
    return (
        <div className={styles.textAreaWrap}>
            {d({})(
                <Input
                    placeholder="请输入活动说明，至多1000字"
                    type="textarea"
                    maxLength={1000}
                    style={{ height: '117px' }}
                />
            )}
            <div className={styles.textNumCount}>
                {formData.eventRemark ? formData.eventRemark.length : 0}
                /1000
            </div>
        </div>
    );
}

// 投放日期的render函数

export function eventDateRender(d) {
    return (
        <Row style={{ display: 'flex', alignItems: 'center' }}>
            <Col>
                {d({
                    rules: [
                        {
                            required: true,
                            message: '请选择活动起止时间',
                        },
                    ],
                })(
                    <RangePicker
                        className={styles.ActivityDateDayleft}
                        style={{ width: '272px' }}
                        format="YYYY-MM-DD"
                        placeholder={['开始日期', '结束日期']}
                        allowClear={false}
                    />
                )}
            </Col>
            <Col>
                <div className={styles.ActivityDateDay}>
                    <span>{this.getDateCount()}</span>
                    <span>天</span>
                </div>
            </Col>
            <Col>
                <Tooltip title="投放日期必须在券有效期范围内，且投放周期不能超过90天">
                    <Icon
                        style={{ fontSize: '16px' }}
                        type="question-circle"
                    />
                </Tooltip>
            </Col>
        </Row>
    );
}

// 计算天数
export function getDateCount() {
    const { formData } = this.props.createActiveCom;
    const { eventLimitDate: eventDate } = formData || {};
    const startTime = eventDate && eventDate[0]
    const endTime = eventDate && eventDate[1]
    if (undefined == startTime || undefined == endTime) {
        return 0
    }
    return moment(endTime, DATE_FORMAT)
        .diff(moment(startTime, DATE_FORMAT), 'days') + 1;
}

// 起止日期的render函数
export function eventLimitDateRender(d) {
    //可作为营销盒子大礼包插件授权活动有以下：分享裂变、推荐有礼、膨胀大礼包、签到、集点卡、支付后广告、下单抽抽乐、盲盒  8个活动。
    const authPulgins = ['65', '68', '66', '76', '75', '77', '78', '79'];
    this.getDateCount = getDateCount.bind(this)
    return (
        <Row style={{ display: 'flex', alignItems: 'center' }}>
            <Col>
                {d({
                    rules: [
                        {
                            required: true,
                            message: '请选择活动起止时间',
                        },
                    ],
                })(
                    <RangePicker
                        className={styles.ActivityDateDayleft}
                        style={{ width: '272px' }}
                        format="YYYY-MM-DD"
                        placeholder={['开始日期', '结束日期']}
                        allowClear={false}
                        disabledDate={(current) => {
                            const { authLicenseData } = this.props.createActiveCom;
                            let {pluginInfo, authPluginStatus} = checkAuthLicense(authLicenseData, 'HLL_CRM_Marketingbox')
                            let {authStartDate, authEndDate} = pluginInfo
                            authStartDate = moment(authStartDate, 'YYYYMMDD').format('YYYY-MM-DD')
                            authEndDate = moment(authEndDate, 'YYYYMMDD').format('YYYY-MM-DD')
                            let disabledDates = !current.isBetween(authStartDate, authEndDate, null, '()')
                            if(authPluginStatus){
                                return disabledDates || current && current.format('YYYYMMDD') < moment().format('YYYYMMDD');
                            }else{
                                // Can not select days before today
                                return current && current.format('YYYYMMDD') < moment().format('YYYYMMDD');
                            }
                        }}
                    />
                )}
            </Col>
            <Col>
                <div className={styles.ActivityDateDay}>
                    <span>{this.getDateCount()}</span>
                    <span>天</span>
                </div>
            </Col>
        </Row>
    );
}

// 跳转路径的render函数

export function afterPayJumpTypeRender(d) {
    const { formData } = this.props.createActiveCom;
    return (
        <div style={{ display: 'flex' }}>
            {d({})(
                <Select style={{ width: '272px' }}>
                    <Option value="3" key="3">
                        微信支付
                    </Option>
                    <Option value="4" key="4">
                        微信小程序
                    </Option>
                </Select>
            )}
            <div style={{ marginLeft: '4px' }}>
                <Tooltip
                    title={
                        formData.afterPayJumpType === '3'
                            ? '用户点击立即使用可拉起扫一扫/付款码直接支付'
                            : '用户点击立即使用可直接跳转至小程序支付'
                    }
                >
                    <Icon
                        style={{ fontSize: '16px' }}
                        type="question-circle"
                    />
                </Tooltip>
            </div>
        </div>
    );
}


// eslint-disable-next-line func-names
const _onChange = function (key) {
    return (e) => {
        const value = e.number
        if (value < 1 || value > 10000) {
            this.setState({
                [key]: '',
            })
            return message.warn('请输入1-10000之间的整数')
        }
        this.setState({
            [key]: value,
        })
    }
}

// 助力用户助力次数限制render函数
export function partInTimesRender(d) {
    const { countCycleDays, partInTimesB, partInTimesC, partInTimes = 'A' } = this.state

    const isDisabled = partInTimes === 'A'
    return (<div className={styles.partInTimesRender}>
        <div className={styles.title}>
            <div className={styles.line}></div>
            <div className={styles.text}>助力用户助力次数限制</div>
        </div>
        {
            d({
                initialValue: partInTimes,
            })(<RadioGroup style={{ marginTop: '15px', marginLeft: '10px' }}>
                <Radio className={styles.radioStyle} value={'A'}>不限次数</Radio>
                <Radio className={styles.radioStyle} value={'B'}>
                    <div style={{ display: 'flex' }}>
                        助力次数
                        <div style={{ marginLeft: '34px', width: '308px' }}>
                            <PriceInput disabled={isDisabled} modal="int" onChange={_onChange.call(this, 'partInTimesB')} value={{ number: partInTimesB || '' }} addonBefore="可助力" addonAfter="次" />
                        </div>

                    </div>
                </Radio>
                <Radio className={styles.radioStyle} value={'C'}>

                    <div style={{ display: 'flex' }}>
                        助力周期次数
                        <div style={{ marginLeft: '10px', width: '150px' }}>
                            <PriceInput disabled={isDisabled} modal="int" onChange={_onChange.call(this, 'countCycleDays')} value={{ number: countCycleDays || '' }} addonBefore="同一用户" addonAfter="天" />
                        </div>
                        <div style={{ marginLeft: '10px', width: '150px' }}>
                            <PriceInput disabled={isDisabled} modal="int" onChange={_onChange.call(this, 'partInTimesC')} value={{ number: partInTimesC || '' }} addonBefore="可助力" addonAfter="次" />
                        </div>
                    </div>
                </Radio>
            </RadioGroup>)
        }
    </div>)
}
