import React from 'react';
import { Col, Form, Input, Checkbox } from 'antd';

const FormItem = Form.Item;


export default class CouponTrdChannelStockNums extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            couponTrdChannelStockNums: [
                { trdPartyPlatformID: 2001, trdStockNum: '', name: '微信小程序' },
                // { trdPartyPlatformID: 1001, trdStockNum: '', name: '彩蛋猫' },//}//四个选择项时，放开下面一个disable注释
                // { trdPartyPlatformID: 3001, trdStockNum: '', name: '悸动小程序' },
                // { trdPartyPlatformID: 3002, trdStockNum: '', name: '悸动小程序' },
            ],
            checkedArr: [true, false, false, false],
        }
    }
    componentDidMount() {
        let { couponTrdChannelStockNums, checkedArr } = this.state;
        if (this.props.value) {
            checkedArr = [false, false, false, false]
            couponTrdChannelStockNums.forEach((channel, index) => {
                const hadSet = this.props.value.find((_chan) => {
                    return _chan.trdPartyPlatformID == channel.trdPartyPlatformID;
                });
                if (hadSet) {
                    checkedArr[index] = true;
                    channel.trdStockNum = hadSet.trdStockNum
                }
            })
            this.setState({ couponTrdChannelStockNums, checkedArr })
        }
    }
    componentWillReceiveProps(nextProps) {
        const { couponTrdChannelStockNums } = this.state;
        if (nextProps.value) {
            couponTrdChannelStockNums.forEach((channel) => {
                const hadSet = nextProps.value.find((_chan) => {
                    return _chan.trdPartyPlatformID == channel.trdPartyPlatformID;
                });
                if (hadSet) {
                    channel.trdStockNum = hadSet.trdStockNum
                }
            })
            this.setState({ couponTrdChannelStockNums })
        }
    }
    handleCheckboxChange(index, checked) {
        const { couponTrdChannelStockNums, checkedArr } = this.state;
        checkedArr[index] = checked;
        if (!checked) {
            couponTrdChannelStockNums[index].trdStockNum = '';
            const input = "input" + index;
            this.props.form.setFieldsValue({ [input]: '' })
        }
        this.setState({ couponTrdChannelStockNums, checkedArr });
        this.props.onChange(couponTrdChannelStockNums)
    }
    handleInputChange(index, value) {
        const { couponTrdChannelStockNums, checkedArr } = this.state;
        couponTrdChannelStockNums[index].trdStockNum = checkedArr[index] ? value : '';
        this.setState({ couponTrdChannelStockNums });
        this.props.onChange(couponTrdChannelStockNums)
    }
    render() {
        const { couponTrdChannelStockNums, checkedArr } = this.state;
        return (
            <div style={{ marginTop: -6 }}>
                {
                    couponTrdChannelStockNums.map((channel, index) => {
                        return (
                            <FormItem
                                style={{
                                    marginBottom: -2,
                                }}
                                key={index}
                            >
                                <Col span={6}>
                                    <Checkbox
                                        // disabled={this.props.giftItemID && channel.trdStockNum > 0}//四个选择项时，放开此注释
                                        disabled={true}
                                        checked={checkedArr[index]}
                                        onChange={(e) => {
                                            this.handleCheckboxChange(index, e.target.checked)
                                        }}
                                    >
                                        {channel.name}
                                    </Checkbox>
                                </Col>
                                <Col span={4} offset={2}>总库存量</Col>
                                <Col span={12} style={{ marginTop: -5 }}>
                                    <FormItem>
                                        {
                                            this.props.form.getFieldDecorator('input' + index, {
                                                rules: [{
                                                    required: checkedArr[index],
                                                    message: '库存总量必须在1-9999999999之间',
                                                    pattern: /^[1-9]\d{0,9}$/,
                                                }],
                                                initialValue: channel.trdStockNum,
                                            })(
                                                <Input
                                                    disabled={!checkedArr[index]}
                                                    onChange={(e) => {
                                                        this.handleInputChange(index, e.target.value)
                                                    }}
                                                />

                                            )
                                        }
                                    </FormItem>
                                </Col>
                            </FormItem>
                        )
                    })
                }
            </div>
        )
    }
}
