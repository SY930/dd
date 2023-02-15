import React from 'react'
import {
    Row,
    Col,
    Form,
    Tooltip,
    Icon,
    Select,
} from 'antd';
import AddGifts from '../common/AddGifts';
import styles from '../../SaleCenterNEW/ActivityPage.less';
import PriceInput from '../../SaleCenterNEW/common/PriceInput';

const FormItem = Form.Item;
const Option = Select.Option

const SelectEl = function SelectEl() {
    const { form: { resetFields }, type } = this.props;
    const { freeGetLimit } = this.state;
    return (
        <Select
            value={freeGetLimit}
            style={{ width: '80px', marginLeft: '-10px' }}
            onChange={(e) => {
                resetFields(['giftTotalCopies'])
                this.setState({
                    freeGetLimit: e,
                })
            }}
        >
            <Option value="0" key="0">不限制</Option>
            <Option value="1" key="1">总限制</Option>
            <Option value="2" key="2">每天限制</Option>
        </Select>
    )
}   

//免费领取模块在这
export const freeGetStep3Render = function freeGetStep3Render() {
    const { type, isNew, form: { getFieldDecorator } } = this.props;
    const { data, freeGetLimit } = this.state;
    //礼品个数控制，这次放开限制，允许编辑
    // data.forEach((v) => {
    //     v.giftCount.disabled = true,
    //     v.giftCount.value = 1
    // })

    const giftInfo = this.props.specialPromotion.get('$giftInfo').toJS();
    const dataInfo = this.props.specialPromotion.get('$eventInfo').toJS();
    const { userCount = 0 }  = dataInfo;
    const { giftTotalCount, stockType } =  giftInfo[0] && giftInfo[0] || [{}];
    let prevFreeGetLimit = '0';
    if(stockType == 1){
        if(!giftTotalCount || giftTotalCount == 2147483647){
            prevFreeGetLimit = '0';
        }
        if(giftTotalCount && giftTotalCount != 2147483647){
            prevFreeGetLimit = '1';
        }
    }
    if(stockType == 2){
        prevFreeGetLimit = '2';
    }
    return (
        <div>
            <FormItem
                wrapperCol={{ span: 20 }}
                labelCol={{ span: 3 }}
                className={styles.FormItemSecondStyle}
                label="礼品份数"
                required={freeGetLimit === '1' && true}
            >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip overlayStyle={{ width: '200px' }} title="该参数为原来的礼品总数，指活动期间可以被领取的礼品份数上限（也指所有用户成功参与活动的总次数），用户成功参与一次活动，消耗一份礼品；">
                        <Icon style={{ fontSize: '16px', marginRight: '10px' }} type="question-circle" />
                    </Tooltip>

                    {(freeGetLimit === '0' || (freeGetLimit === '0' && (giftInfo[0] && giftInfo[0].giftTotalCopies == 2147483647))) ? <PriceInput
                        addonAfter={'份'}
                        modal="int"
                        maxNum={freeGetLimit === '1' ? 8 : 10}
                        disabled={true}
                        prefix={SelectEl.call(this)}
                        style={{ paddingLeft: '70px' }}
                        value={{ number: '' }}
                    /> : getFieldDecorator('giftTotalCopies', {
                        initialValue: {
                            number: (giftInfo[0] && giftInfo[0].giftTotalCopies == 2147483647) ? '' : (giftInfo[0] && giftInfo[0].giftTotalCopies),
                        },
                        rules: [
                            {
                                validator: (rule, v, cb) => {
                                    if (v.number === '' || v.number === undefined) {
                                        return cb(
                                            '请输入大于0的8位以内的整数'
                                        );
                                    }
                                    if (!v || v.number < 1) {
                                        return cb('请输入大于0的8位以内的整数');
                                    } else if (v.number >= 100000000) {
                                        return cb('请输入大于0的8位以内的整数');
                                    }
                                    if((prevFreeGetLimit == 0 && freeGetLimit == 1) || (prevFreeGetLimit == 2 && freeGetLimit == 1)){
                                        if (v.number < userCount) {
                                            return cb('礼品份数不能小于活动已发出次数');
                                        }
                                    }
                                    cb();
                                },
                            },
                        ],

                    })(
                        <PriceInput
                            addonAfter={'份'}
                            modal="int"
                            maxNum={8}
                            placeholder="请输入数值"
                            prefix={SelectEl.call(this)}
                            style={{ paddingLeft: '70px' }}
                        />
                    )}
                  <div style={{marginLeft: '10px'}}>
                        {
                            freeGetLimit == 1 && +userCount > 0 && `活动已发出了${userCount}份`
                        }
                    </div>
                </div>
            </FormItem>
            <Row>
                <Col span={17} offset={4}>
                    <AddGifts
                        maxCount={10}
                        type={type}
                        isNew={isNew}
                        value={data
                            .filter(gift => gift.sendType === 0)
                            .sort((a, b) => a.needCount - b.needCount)}
                        onChange={gifts => this.gradeChange(gifts, 0)}
                    />
                </Col>
            </Row>
            {this.renderShareInfo2()}
        </div>

    )
}
