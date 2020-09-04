import React from 'react'
import { Form, Checkbox } from 'antd'
import PriceInput from 'components/common/PriceInput/PriceInput'
import MutliGift from 'components/common/MutliGift/MutliGift'

const FormItem = Form.Item
const formItemStyle = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
}

class TabItem extends React.Component {
    state = {
        giftList: [],

    }

    handleGiftChange = (v) => {
        this.props.handleGiftChange(v)
    }

    render() {
        const { form, isHelp, itemKey, getForm, giftList = [],
            cacheTreeData, treeData, onIptChange, getGiftForm, needCount, checkedHelp,
            handleHelpCheckbox,
        } = this.props
        const { getFieldDecorator } = form

        if (typeof getForm === 'function') {
            getForm(form)
        }
        const isHide = giftList.find(v => v.giftSendCount > 0)
        return (
            <Form >
                {
                    isHelp ?
                        null
                        :
                        <FormItem {...formItemStyle} wrapperCol={{ span: 14 }} label="膨胀所需人数" required={true}>
                            {
                                getFieldDecorator(`needCount${itemKey}`, {
                                    rules: [
                                        {
                                            validator: (rule, v = {}, cb) => {
                                                if (
                                                    v.number === '' ||
                                v.number === undefined
                                                ) {
                                                    return cb(
                                                        itemKey > 0 ? '请输入1-1000之间的整数' : '请输入0-1000之间的整数'
                                                    );
                                                }
                                                if (itemKey > 0 && v.number < 1) {
                                                    return cb(
                                                        '请输入1-1000之间的整数'
                                                    );
                                                }
                                                if (!v || (v.number < 0)) {
                                                    return cb(
                                                        '请输入0-1000之间的整数'
                                                    );
                                                } else if (v.number > 1000) {
                                                    return cb(
                                                        '请输入0-1000之间的整数'
                                                    );
                                                }

                                                cb();
                                            },
                                        },
                                    ],
                                    onChange: onIptChange,
                                    initialValue: itemKey == 0 && !needCount[0] ? { number: 0 } : { number: needCount[itemKey] },
                                })(<PriceInput disabled={isHide} mode="int" addonAfter="人" />)
                            }

                        </FormItem>
                }

                <FormItem {...formItemStyle} wrapperCol={{ span: 14 }} >
                    {isHelp ?
                        <Checkbox checked={checkedHelp} onChange={handleHelpCheckbox} style={{ marginTop: '10px' }}>赠送优惠券</Checkbox>
                        : null}

                    <MutliGift
                        key={itemKey}
                        value={giftList[itemKey] ? [giftList[itemKey]] : []}
                        onChange={this.handleGiftChange}
                        cacheTreeData={cacheTreeData}
                        treeData={treeData}
                        getGiftForm={getGiftForm}
                        isHide={isHide}
                    />
                </FormItem>
            </Form>
        )
    }
}

export default Form.create()(TabItem)
