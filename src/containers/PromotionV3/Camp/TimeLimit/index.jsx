import React, { PureComponent as Component } from 'react';
import { Radio, Form } from 'antd';
import PriceInput from '../../../../containers/SaleCenterNEW/common/PriceInput';
import styles from './style.less';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
class TimeLimit extends Component {
    state= {
        joinCount: '0',
        partInTimesNoValidStatus: 'success',
        countCycleDaysStatus: 'success',
        partInTimesStatus: 'success',
    }

    onAllChange = (data) => {
        const { value, onChange } = this.props;
        let list = {...value, ...data};
        onChange(list);
    }

    handleJoinCountChange = (e) => {
        this.onAllChange({ joinCount: e.target.value });
    }

    onPartInTimesNoValidChange = (value) => {
        this.onAllChange({ partInTimesNoValid: value.number });
    }

    render() {
        const radioStyle = {
            display: 'block',
            height: '32px',
            lineHeight: '32px',
        };
        const { value, decorator } = this.props;
        let {joinCount, partInTimesNoValid = 0, partInTimes = 0, countCycleDays = 0} = value
        
        return (
            <div className={styles.mainBox}>
                <FormItem 
                    className={styles.noPadding}
                    // labelCol={{ span: 4 }}
                    // wrapperCol={{ span: 17 }}
                >
                    <RadioGroup value={joinCount} onChange={this.handleJoinCountChange}>
                        <Radio style={radioStyle} value={'0'}>不限次数</Radio>
                        <Radio style={radioStyle} value={'1'}>限制次数</Radio>
                        <div className={styles.priceWrapper}>
                            <FormItem validateStatus={(partInTimesNoValid > 0 || joinCount.indexOf('1') === -1) ? 'success' : 'error'}>
                                <PriceInput
                                    addonBefore={`可参与`}
                                    addonAfter={`次`}
                                    disabled={joinCount.indexOf('1') === -1}
                                    value={{ number: partInTimesNoValid }}
                                    defaultValue={{ number: partInTimesNoValid }}
                                    onChange={this.onPartInTimesNoValidChange}
                                    modal={'int'}
                                />
                            </FormItem>
                        </div>
                        <Radio style={radioStyle} value={'2'}>限制周期内次数</Radio>
                        <div className={styles.addTwo}>
                            <div style={{ width: '70%', display: 'inline-block' }}>
                                <FormItem validateStatus={(countCycleDays > 0 || joinCount.indexOf('2') === -1) ? 'success' : 'error'}>
                                    <PriceInput
                                        addonBefore={`同一用户`}
                                        addonAfter={`天，可参与`}
                                        disabled={joinCount.indexOf('2') === -1}
                                        value={{ number: countCycleDays }}
                                        defaultValue={{ number: countCycleDays }}
                                        onChange={(value) => {
                                            this.onAllChange({ countCycleDays: value.number });
                                        }}
                                        modal={'int'}
                                    />
                                </FormItem>
                            </div>

                            <div style={{ width: '30%', display: 'inline-block', position: 'relative', left: '-1px' }}>
                                <FormItem validateStatus={(partInTimes > 0 || joinCount.indexOf('2') === -1) ? 'success' : 'error'}>
                                    <PriceInput
                                        addonBefore={''}
                                        addonAfter={`次`}
                                        disabled={joinCount.indexOf('2') === -1}
                                        value={{ number: partInTimes }}
                                        defaultValue={{ number: partInTimes }}
                                        onChange={(value) => {
                                            this.onAllChange({ partInTimes: value.number });
                                        }}
                                        modal={'int'}
                                    />
                                </FormItem>
                            </div>

                        </div>
                    </RadioGroup>
                </FormItem>
            </div>
        )
    }
}

export default TimeLimit
