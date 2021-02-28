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
    handleGiftChange = (v,type) => {
        this.props.handleGiftChange(v,type)
    }

    render() {
        const { form, isHelp, itemKey, getForm, giftList = [],
            cacheTreeData, treeData, onIptChange, getGiftForm, needCount, checkedHelp,isMulti,
            handleHelpCheckbox,giftType
        } = this.props
        const { getFieldDecorator } = form

        if (typeof getForm === 'function') {
            getForm(form)
        }

        const isHide = giftList.find(v => v && v.giftSendCount > 0)
        return (
            <Form >
                <FormItem {...formItemStyle} wrapperCol={{ span: 22 }} >
                    <p style={{marginTop:-15}}>{`参与活动用户可在如下的礼品列表中，随机领取到一张券`}</p>
                    <MutliGift
                        key={itemKey}
                        value={giftList || []}
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
