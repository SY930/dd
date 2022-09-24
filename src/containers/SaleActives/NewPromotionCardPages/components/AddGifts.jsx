import { Checkbox, Col, Form, Icon, Button, TreeSelect, Spin } from 'antd';
import _ from "lodash";
import { Component } from 'react';
import { connect } from 'react-redux';
import BaseForm from '../../../../components/common/BaseForm';
import { ALL_FORM_ITEMS } from '../common/_formItemConfig';
import styles from './addGifts.less';

const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
}

let uuid = 0;
let uuidKkey = 'addGiftId';

class AddGifts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            giftList: [],
            giftFormData: {},
            formItems: {}
        }
        this.giftForms = {}
    }

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }
        let { giftList = [] } = this.props;
        let giftFormData = {};
        console.log('giftList====giftList======', giftList)
        giftList.forEach(item => {
            let effectType = 1;
            let countType = 0;
            if (item.effectType == 1) {
                effectType = 1;
                countType = 0;
            } else if (item.effectType == 2) {
                effectType = 2;
            } else if (item.effectType == 3) {
                effectType = 1;
                countType = 1;
            }
            giftFormData[item.id] = {
                ...item,
                effectType,
                countType,
                giftIDNumber: item.giftID
            };
        });
        console.log('giftFormData===giftFormData', giftFormData);
        this.setState({
            giftList,
            giftFormData
        })

        let formItems = ALL_FORM_ITEMS;
        const { giftID: giftIDFormItem } = formItems;
        this.setState({
            formItems: {
                ...formItems,
                ...this.renderGiftID(giftIDFormItem),
            }
        })
    }

    onPlusGift = () => {
        this.setState({
            giftList: [
                ...this.state.giftList,
                {
                    id: uuidKkey + uuid++
                }
            ]
        })
    }

    onMinusGift = (index, pid) => {
        this.state.giftList.splice(index, 1);
        this.setState({
            giftList: this.state.giftList
        })
        // this.props.onMinusGift(pid);
    }

    renderGiftID = (giftIDFormItem) => {
        const { loading, treeData } = this.props;
        const render = d => {
            return (
                <Col>
                    {loading ?
                        <div className={styles.spinBox}>
                            <Spin size="small" />
                        </div> :
                        d()(
                            <TreeSelect
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                treeData={treeData}
                                placeholder="请选择礼品名称"
                                showSearch={true}
                                treeNodeFilterProp="label"
                                allowClear={true}
                            />
                        )
                    }
                </Col>
            )
        }
        return {
            giftID: { ...giftIDFormItem, render },
        }
    }

    onChangeAddGiftForm = (key, value, id) => {
        const { setFieldsValue, resetFields } = this.giftForms[id];
        if (key == 'giftID') {
            setFieldsValue({
                giftIDNumber: value
            })
        }
        if (key == 'countType') {
            resetFields(['giftEffectTimeHours']);
        }
    }

    render() {
        // _TODO
        const { pid } = this.props;
        const { giftList } = this.state;
        const formKeys = ['giftID', 'giftIDNumber', 'giftCount', 'effectType', 'countType', 'giftValidUntilDayCount'];
        return (
            <Col span={24} className={styles.conditionListBox}>
                {
                    giftList.map((item, index) => (
                        <Col className={styles.addGiftBox} key={item.id}>
                            <span className={styles.title}>礼品{index + 1}</span>
                            {
                                giftList.length > 1 &&
                                <span className={styles.closeBox} onClick={() => this.onMinusGift(index, pid)}>
                                    <span className={styles.close}></span>
                                </span>
                            }
                            <BaseForm
                                key={item.id}
                                getForm={(form) => { this.giftForms[item.id] = form }}
                                formKeys={formKeys}
                                // formItems={this.resetFormItems()}
                                formItems={this.state.formItems}
                                formItemLayout={formItemLayout}
                                onChange={(key, value) => this.onChangeAddGiftForm(key, value, item.id)}
                                formData={this.state.giftFormData[item.id] || {}}
                            />
                            {
                                giftList.length == index + 1 && <Button icon="plus" style={{ marginTop: '10px' }} onClick={this.onPlusGift}>添加礼品</Button>
                            }
                        </Col>
                    ))
                }
            </Col>
        )
    }
}

const mapStateToProps = ({ newPromotionCardPagesReducer }) => {
    return {
        promotion: newPromotionCardPagesReducer.get('promotion').toJS(),
    }
};

export default connect(mapStateToProps, null)(AddGifts)

