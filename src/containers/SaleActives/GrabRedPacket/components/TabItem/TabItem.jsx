import React from 'react'
import { Form, Checkbox } from 'antd'
import PriceInput from 'components/common/PriceInput/PriceInput'
import MutliGift from 'components/common/MutliGift/MutliGift'
import styles from '../../grabRedPacket.less'
import { connect } from 'react-redux';
const FormItem = Form.Item
const formItemStyle = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
}
@connect(({ loading, createActiveCom }) => ({ loading, createActiveCom }))
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
        const { isEdit, isView } = this.props.createActiveCom
        if (typeof getForm === 'function') {
            getForm(form)
        }

        const isHide = giftList.find(v => v && v.giftSendCount > 0)
        return (
            <Form >
                <FormItem {...formItemStyle} wrapperCol={{ span: 22 }} >
                    {isView && !isEdit && <div className={styles.disabledDiv}></div>}
                    <p style={{marginTop:-15}}>{itemKey == '0' ? `参与活动用户可在如下的礼品列表中，随机领取到一张券` : `每一次触发活动后，有且仅有一名参与者可以领取到如下最优的礼品`}</p>
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
