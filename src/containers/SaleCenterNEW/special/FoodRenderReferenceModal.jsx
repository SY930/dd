
import React, { Component } from 'react'
import {
    Select,
    Modal,
    Radio,
    Form,
    message,
} from 'antd';
import BaseForm from 'components/common/BaseForm';
import styles from '../ActivityPage.less'

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class FoodRenderReferenceModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            setType: props.setFoodType || '1',
            bookID: '',
        }
    }

  handleChangeFoodBook = (value) => {
      this.setState({ bookID: value })
  }

  handleConfirmPrice = async () => {
      const { bookID, setType } = this.state
    //   console.log("🚀 ~ file: FoodRenderReferenceModal.jsx ~ line 31 ~ FoodRenderReferenceModal ~ handleConfirmPrice= ~ bookID", bookID)
      if (setType === '2' && !bookID) {
          return message.warning('请选择菜谱')
      }
      if (setType === '1') {
          this.props.handlePriceCancel()
          this.props.onChangeBookID('')
          this.props.handleSetType(setType)
          return
      }
      this.props.getFoodCategory(bookID)
      this.props.onChangeBookID(bookID)
      this.props.handlePriceCancel()
      this.props.handleSetType(setType)
  }

  handleSetType = ({ target }) => {
      const { value } = target
      this.setState({
          setType: value,
      })
  }

  render() {
      const { setType } = this.state
      const { foodBooks } = this.props
      const formItems = {
          setType: {
              label: '设置方式',
              type: 'custom',
              labelCol: { span: 4 },
              wrapperCol: { span: 14 },
              render: () => {
                  return (
                      <RadioGroup onChange={this.handleSetType} value={setType}>
                          <Radio value={'1'}>
                              按菜品库展示
                          </Radio>
                          <Radio value={'2'}>
                              按菜谱展示
                          </Radio>
                      </RadioGroup>
                  )
              },
          },
          menu: {
              label: (<span style={{ lineHeight: '47px', display: 'inline-block' }}><span className={styles.required}>*</span>菜谱</span>),
              type: 'custom',
              labelCol: { span: 4 },
              wrapperCol: { span: 14 },
              render: (decorator, form) => {
                  return setType === '2' ? (
                      <FormItem>
                          {decorator({
                              key: 'numberOfTimeType',
                              rules: [{
                                  required: true, message: '请选择菜谱',
                              }],
                              onChange: this.handleChangeFoodBook,
                              initialValue: this.state.bookID || this.props.bookID,
                          })(<Select
                              showSearch={true}
                              allowClear={true}
                              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          >
                              {(foodBooks || []).map(({ bookID, bookName }) => (<Select.Option value={`${bookID}`} key={bookID}>{bookName}</Select.Option>))}
                          </Select>)}
                      </FormItem>
                  ) : null
              },
          },
      }
      return (
          <Modal
              title="菜品售价参考值"
              visible={true}
              width="500px"
              onOk={this.handleConfirmPrice}
              wrapClassName={styles.SpecialReferenceModalWarp}
              onCancel={this.props.handlePriceCancel}
          >
              {setType === '2' && <div className={styles.referenceTip}>门店自建菜品按菜品库售价展示</div>}
              <BaseForm
                  getForm={form => this.basePriceForm = form}
                  formItems={formItems}
                  formKeys={['setType', 'menu']}
              />
          </Modal>
      )
  }
}

export default FoodRenderReferenceModal
