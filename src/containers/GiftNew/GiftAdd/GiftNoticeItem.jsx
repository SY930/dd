import React, { Component } from 'react';
import {
    message,
    Icon,
    Tooltip,
} from 'antd';
import moment from 'moment'
import styles from '../../SaleCenterNEW/ActivityPage.less'
import PriceInput from '../../../components/common/PriceInput/PriceInput'

class GiftNoticeItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            maxIntervals: 5,
            intervals: Array.isArray(props.value) ? props.value : [3],
        }
    }

    componentDidMount() {
        if (!Array.isArray(this.props.value)) {
            this.props.onChange([3])
        }
    }

    componentWillReceiveProps(nextProps) {
        if (Array.isArray(nextProps.value)) {
            this.setState({
                intervals: nextProps.value,
            })
        }
    }
    add = () => {
        const { intervals: original, maxIntervals: max } = this.state;
        const intervals = original.slice();
        if (intervals.length < max) {
            intervals.push("")
            this.setState({
                intervals
            }, () => {
                this.props.onChange(intervals)
            })
        }
    }

    removeIndex(index) {
        const { intervals: original } = this.state;
        const intervals = original.slice();
        if (intervals.length > 1) {
            intervals.splice(index, 1)
            this.setState({
                intervals
            }, () => {
                this.props.onChange(intervals)
            })
        }
    }

    handleTimeChange = (e, index) => {
        const { intervals } = this.state;
        const value = e.number
        if (value < 1 || value > 100) {
            intervals[index] = ''
            this.setState({ intervals }, () => {
                this.props.onChange(intervals)
            })
            return message.warn('请输入1-100之间的整数')
        }
        intervals[index] = value
        this.setState({ intervals }, () => {
            this.props.onChange(intervals)
        })
    }


    renderIntervalItem(value, index) {
        const { maxIntervals, intervals } = this.state;
        return (
            <div key={`${index}`} style={{ display: 'flex' }}>
                <div style={{ display: 'flex' }}>
                    <div>券到期前</div>
                    <PriceInput modal="int" style={{ width: 50, margin: '0 10px' }} onChange={(e) => this.handleTimeChange(e, index)} value={{ number: value }}></PriceInput>
                    <div>天提醒</div>
                </div>
                <div style={{ paddingTop: 5, marginLeft: 20 }}>
                    {
                        (index === (intervals.length - 1) && intervals.length < maxIntervals) && (
                            !!value ? (
                                <Icon
                                    onClick={this.add}
                                    style={{ marginRight: 10 }}
                                    className={styles.plusIcon}
                                    type="plus-circle-o"
                                />
                            ) : (
                                    <Tooltip title="将时段补充完整才可继续添加">
                                        <Icon
                                            style={{ marginRight: 10, cursor: 'not-allowed', color: 'gray' }}
                                            className={styles.plusIcon}
                                            type="plus-circle-o"
                                        />
                                    </Tooltip>
                                ))
                    }
                    {intervals.length > 1 && <Icon onClick={() => this.removeIndex(index)} className={styles.deleteIcon} type="minus-circle-o" />}
                </div>
            </div>
        )
    }

    render() {
        const { intervals } = this.state;
        return (
            <div className={styles.timeIntervalContainer}>
                {
                    intervals.map((item, index) => this.renderIntervalItem(item, index))
                }
            </div>
        )
    }
}

export default GiftNoticeItem
