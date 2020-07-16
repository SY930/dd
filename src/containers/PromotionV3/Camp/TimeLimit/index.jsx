import React, { PureComponent as Component } from 'react';
import { Radio, Form } from 'antd';
import PriceInput from '../../../../containers/SaleCenterNEW/common/PriceInput';
import styles from './style.less';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
class TimeLimit extends Component {
    state= {
        joinCount: '0',
    }

    handleJoinCountChange = () => {

    }

    render() {
        const radioStyle = {
            display: 'block',
            height: '32px',
            lineHeight: '32px',
        };
        const { value, decorator } = this.props;
        return (
            <div className={styles.mainBox}>
                <FormItem 
                    className={styles.noPadding}
                    // labelCol={{ span: 4 }}
                    // wrapperCol={{ span: 17 }}
                >
                    <RadioGroup value={this.state.joinCount} onChange={this.handleJoinCountChange}>
                        <Radio style={radioStyle} value={'0'}>不限次数</Radio>
                        <Radio style={radioStyle} value={'1'}>限制次数</Radio>
                        <div className={styles.priceWrapper}>
                            <FormItem validateStatus={this.state.partInTimesNoValidStatus}>
                                <PriceInput
                                    addonBefore={`可参与`}
                                    addonAfter={`次`}
                                    disabled={this.state.joinCount.indexOf('1') === -1}
                                    value={{ number: this.state.partInTimesNoValid }}
                                    defaultValue={{ number: this.state.partInTimesNoValid }}
                                    onChange={this.onPartInTimesNoValidChange}
                                    modal={'int'}
                                />
                            </FormItem>
                        </div>
                        <Radio style={radioStyle} value={'2'}>限制周期内次数</Radio>
                        <div className={styles.addTwo}>
                            <div style={{ width: '70%', display: 'inline-block' }}>
                                <FormItem validateStatus={this.state.countCycleDaysStatus}>
                                    <PriceInput
                                        addonBefore={`同一用户`}
                                        addonAfter={`天，可参与`}
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
                                        addonAfter={`次`}
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
        )
    }
}

export default TimeLimit
