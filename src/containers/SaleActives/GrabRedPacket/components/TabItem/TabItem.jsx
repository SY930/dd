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
        isMulti:true

    }

    handleGiftChange = (v,type) => {
        console.log(v,'vwoneed-------------')
        this.props.handleGiftChange(v,type)
    }

    render() {
        const {isMulti} = this.state;
        const { form, isHelp, itemKey, getForm, giftList = [],
            cacheTreeData, treeData, onIptChange, getGiftForm, needCount, checkedHelp,
            handleHelpCheckbox,giftType
        } = this.props
        const { getFieldDecorator } = form

        if (typeof getForm === 'function') {
            getForm(form)
        }
        console.log(this.props,'thisprops--------------------')
        const isHide = giftList.find(v => v && v.giftSendCount > 0)
        return (
            <Form >
                {/* {
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
                } */}

                <FormItem {...formItemStyle} wrapperCol={{ span: 14 }} >
                    <p>参与活动用户可在如下的礼品列表中，随机领取到一张券</p>

                    <MutliGift
                        key={itemKey}
                        value={giftList}
                        giftType={giftType}
                        onChange={this.handleGiftChange}
                        cacheTreeData={cacheTreeData}
                        treeData={treeData}
                        getGiftForm={getGiftForm}
                        isHide={isHide}
                        isMulti={isMulti}
                    />
                </FormItem>
            </Form>
        )
    }
}

export default Form.create()(TabItem)
