import React from 'react'
import { Form } from 'antd'
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
        const { form, isHelp, itemKey, getForm, giftList, cacheTreeData, treeData, onIptChange, getGiftForm } = this.props
        const { getFieldDecorator } = form
        console.log('itemKey', itemKey)
        console.log('giftList', giftList)
        if (typeof getForm === 'function') {
            getForm(form)
        }

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
                                                        '请输入0-1000之间的整数'
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
                                                // if (needCount[1] < needCount[0]) {
                                                //     return cb('数值必须大于上一档位的人数')
                                                // }
                                                cb();
                                            },
                                        },
                                    ],
                                    onChange: onIptChange,
                                })(<PriceInput mode="int" addonAfter="人" />)
                            }

                        </FormItem>
                }

                <FormItem {...formItemStyle} wrapperCol={{ span: 14 }} label="添加礼品" required={true}>
                    <MutliGift
                        key={itemKey}
                        value={giftList[itemKey] ? [giftList[itemKey]] : []}
                        onChange={this.handleGiftChange}
                        cacheTreeData={cacheTreeData}
                        treeData={treeData}
                        getGiftForm={getGiftForm}
                    />
                </FormItem>
            </Form>
        )
    }
}

export default Form.create()(TabItem)
