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
    const { form: { resetFields } } = this.props;
    const { freeGetLimit } = this.state;


    return (
        <Select
            value={freeGetLimit}
            style={{ width: '80px', marginLeft: '-10px' }}
            onChange={(e) => {
                resetFields(['giftTotalCount'])
                this.setState({
                    freeGetLimit: e,
                })
            }}
        >
            <Option value="0" key="0">不限制</Option>
            <Option value="1" key="1">限制为</Option>
        </Select>
    )
}

export const freeGetStep3Render = function freeGetStep3Render() {
    const { type, isNew, form: { getFieldDecorator } } = this.props;
    const { data, freeGetLimit } = this.state;
    data.forEach((v) => {
        v.giftCount.disabled = true,
        v.giftCount.value = 1
    })


    const giftInfo = this.props.specialPromotion.get('$giftInfo').toJS()


    return (
        <div>
            <FormItem
                wrapperCol={{ span: 16 }}
                labelCol={{ span: 8 }}
                className={styles.FormItemSecondStyle}
                style={{ width: '400px' }}
                label="礼品份数"
                required={freeGetLimit === '1' && true}
            >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip overlayStyle={{ width: '200px' }} title="该参数为原来的礼品总数，指活动期间可以被领取的礼品份数上限（也指所有用户成功参与活动的总次数），用户成功参与一次活动，消耗一份礼品；">
                        <Icon style={{ fontSize: '16px', marginRight: '10px' }} type="question-circle" />
                    </Tooltip>

                    { (freeGetLimit === '0' || (freeGetLimit === '0' && (giftInfo[0] && giftInfo[0].giftTotalCount == 2147483647))) ? <PriceInput
                        addonAfter={'份'}
                        modal="int"
                        maxNum={freeGetLimit === '1' ? 8 : 10}
                        disabled={true}
                        prefix={SelectEl.call(this)}
                        style={{ paddingLeft: '70px' }}
                        value={{ number: '' }}
                    /> : getFieldDecorator('giftTotalCount', {
                        initialValue: {
                            number: (giftInfo[0] && giftInfo[0].giftTotalCount == 2147483647) ? '' : (giftInfo[0] && giftInfo[0].giftTotalCount),
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
                                    } else if (v.number > 100000000) {
                                        return cb('请输入大于0的8位以内的整数');
                                    }
                                    cb();
                                },
                            },
                        ],

                    })(
                        <PriceInput
                            addonAfter={'份'}
                            modal="int"
                            maxNum={freeGetLimit === '1' ? 8 : 10}
                            placeholder="请输入数值"
                            prefix={SelectEl.call(this)}
                            style={{ paddingLeft: '70px' }}
                        />
                    ) }
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
