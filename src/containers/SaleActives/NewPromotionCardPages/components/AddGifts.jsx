import { Checkbox, Col, Form, Row, Button, TreeSelect, Spin, Input } from 'antd';
import _ from "lodash";
import { Component } from 'react';
import { connect } from 'react-redux';
import BaseForm from '../../../../components/common/BaseForm';
import { ALL_FORM_ITEMS } from '../common/_formItemConfig';
import styles from './addGifts.less';
import moment from "moment";

const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
}

let uuid = 0;
let uuidKkey = 'addGiftId';

const createKeys = ['giftID', 'giftIDNumber', 'giftCount', 'effectType', 'countType', 'giftValidUntilDayCount'];

class AddGifts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            giftList: [],
            giftFormData: {},
            formItems: ALL_FORM_ITEMS,
            treeData: {},
        }
        this.giftForms = {}
    }

    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }
        let formItems = this.state.formItems;
        const { giftCount } = formItems;
        this.setState({
            treeData: this.props.treeData,
            formItems: {
                ...formItems,
                ...this.renderGiftCount(giftCount),
            }
        }, () => {
            let { giftList = [], stageType } = this.props;
            console.log('giftList===2222', giftList);
            let giftFormData = {};
            giftList.forEach(item => {
                let effectType = 1;;
                let countType = 0;
                let giftRangeTime = [];
                if (item.effectType == 1) {
                    effectType = 1;
                    countType = 0;
                } else if (item.effectType == 2) { // 固定有效期
                    effectType = 2;
                    item.giftRangeTime = [moment('20200202235959').format('YYYY-MM-DD'), moment('20220202000000').format('YYYY-MM-DD')];
                } else if (item.effectType == 3) {
                    effectType = 1;
                    countType = 1;
                }
                giftFormData[item.id] = {
                    ...item,
                    effectType,
                    countType,
                    giftIDNumber: item.giftID,
                };
            });
            this.setState({
                giftList,
                giftFormData
            })
        });
    }

    renderGiftCount = (giftCount, stageType) => {
        const render = (decorator, form) => {
            return (
                <Row>
                    <Col style={{ display: 'flex' }}>
                        <FormItem>
                            {
                                decorator({
                                    key: 'giftCount',
                                    rules: [{
                                        required: true,
                                        validator: (rule, value, callback) => {
                                            if (!/^\d+$/.test(value)) {
                                                return callback('请输入数字');
                                            }
                                            if (+value < 1 || +value > 50) {
                                                return callback('大于0，限制50个');
                                            }
                                            return callback();
                                        },
                                    }],
                                })(
                                    <Input addonAfter='个' />
                                )
                            }
                        </FormItem>
                        <FormItem>
                            {
                                (stageType == 2 || stageType == 4) && (
                                    decorator({
                                        key: 'giftMaxCount',
                                        rules: [
                                            {
                                                required: true,
                                                validator: (rule, value, callback) => {
                                                    if (!/^\d+$/.test(value)) {
                                                        return callback('请输入数字');
                                                    }
                                                    if (+value < 1 || +value > 50) {
                                                        return callback('大于0，限制50个');
                                                    }
                                                    return callback();
                                                },
                                            }],
                                    })(
                                        <Input addonBefore='最多' addonAfter='张' />
                                    )
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
            )
        }
        return {
            giftCount: { ...giftCount, render },
        }
    }

    componentWillReceiveProps(nextProps) {
        let formItems = this.state.formItems;
        const { giftCount, giftID } = formItems;
        this.setState({
            formItems: {
                ...formItems,
                ...this.renderGiftCount(giftCount, nextProps.stageType)
            }
        });
        if (!_.isEqual(this.props.treeData, nextProps.treeData)) {
            this.setState({
                treeData: nextProps.treeData,
            })
        }
    }

    onPlusGift = () => {
        this.setState({
            giftList: [
                ...this.state.giftList,
                {
                    id: uuidKkey + uuid++,
                    stageType: this.props.stageType,
                }
            ]
        })
    }

    onMinusGift = (index, pid) => {
        this.state.giftList.splice(index, 1);
        this.setState({
            giftList: this.state.giftList
        })
    }

    findGiftNameByKey = () => {

    }

    onChangeAddGiftForm = (key, value, id) => {
        console.log(555555, key, value);
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

    renderGiftID = (decorator, form) => {
        return decorator()(<TreeSelect
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={this.props.treeData}
            placeholder="请选择礼品名称"
            showSearch={true}
            treeNodeFilterProp="label"
            allowClear={true}
        />)
    }

    render() {
        const { pid } = this.props;
        const { giftList } = this.state;
        let formKeys = createKeys;
        let formItems = this.state.formItems;
        formItems.giftID = {
            label: '礼品名称',
            type: 'custom',
            render: this.renderGiftID
        }
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
                                formItems={formItems}
                                formItemLayout={formItemLayout}
                                onChange={(key, value) => this.onChangeAddGiftForm(key, value, item.id)}
                                formData={this.state.giftFormData[item.id] || {}}
                            />
                            {
                                (giftList.length == index + 1 && giftList.length < 10) && <Button icon="plus" style={{ marginTop: '10px' }} onClick={this.onPlusGift}>添加礼品</Button>
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

