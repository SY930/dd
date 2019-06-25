import React from 'react';
import { connect } from 'react-redux';
import {
    Form,
    Select,
    Icon,
    Table,
    Tooltip,
    Input,
    message,
} from 'antd';
import styles from '../../SaleCenterNEW/ActivityPage.less';
import SingleGoodSelector from '../../../components/common/GoodSelector'
import PriceInput from '../../SaleCenterNEW/common/PriceInput';
import selfStyle from './style.less'

const FormItem = Form.Item;
const Option = Select.Option;
class SettingInfo extends React.Component {
    constructor(props) {
        super(props);
        const {
            good,
            unitInfo,
        } = this.getInitialGoodAndUnitInfo();
        this.state = {
            productsLimit: props.data.productsLimit > 0 ? props.data.productsLimit : undefined, // 不填写则默认不限
            tag: props.data.tag || '秒杀', // 活动主题
            goodsList: unitInfo,
            selectedGood: good,  
        };
        this.columns = [
            {
                title: '规格',
                dataIndex: 'unitName1',
                key: 'unitName1',
                fixed: 'left',
                width: 100,
                render: value => <Tooltip title={value}><span>{value}</span></Tooltip>,
            },
            {
                title: '积分售价（分）',
                dataIndex: 'sellPoint',
                width: 120,
                key: 'sellPoint',
                className: 'TableTxtRight',
                render: value => <Tooltip title={value}><span>{value}</span></Tooltip>,
            },
            {
                title: '现金售价（元）',
                dataIndex: 'sellPrice',
                key: 'sellPrice',
                width: 120,
                className: 'TableTxtRight',
                render: value => <Tooltip title={value}><span>{value}</span></Tooltip>,
            },
            {
                title: '原价（元）',
                dataIndex: 'prePrice',
                key: 'prePrice',
                width: 100,
                className: 'TableTxtRight',
                render: value => <Tooltip title={value}><span>{value}</span></Tooltip>,
            },
            {
                title: '秒杀积分(分)',
                dataIndex: 'point',
                key: 'point',
                width: 120,
                className: 'noPadding',
                render: (text, record, index) => {
                    return (
                        <span className={selfStyle.rightAlign}>
                            <PriceInput
                                modal="float"
                                prefix={<Icon type="edit" />}
                                placeholder="秒杀积分"
                                value={{ number: record.point }}
                                maxNum={6}
                                onChange={(val) => { this.onCellChange(index, 'point', val) }}
                            />
                        </span>
                    )
                },
            },
            {
                title: '秒杀现金(元)',
                dataIndex: 'price',
                key: 'price',
                width: 120,
                className: 'noPadding',
                render: (text, record, index) => {
                    return (
                        <span className={selfStyle.rightAlign}>
                            <PriceInput
                                modal="float"
                                prefix={<Icon type="edit" />}
                                placeholder="秒杀现金"
                                value={{ number: record.price }}
                                maxNum={6}
                                onChange={(val) => { this.onCellChange(index, 'price', val) }}
                            />
                        </span>
                    )
                },
            },
            {
                title: '秒杀库存',
                dataIndex: 'storage',
                key: 'storage',
                width: 100,
                className: 'noPadding',
                render: (text, record, index) => {
                    return (
                        <span className={selfStyle.rightAlign}>
                            <PriceInput
                                modal="int"
                                prefix={<Icon type="edit" />}
                                placeholder="秒杀库存"
                                value={{ number: record.storage }}
                                maxNum={6}
                                onChange={(val) => { this.onCellChange(index, 'storage', val) }}
                            />
                        </span>
                    )
                },
            },
        ]
    }

    componentDidMount() {
        this.props.getSubmitFn({
            prev: () => true,
            finish: this.handleSubmit,
            cancel: undefined,
        });
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.goods !== this.props.goods) {
            const {
                good,
                unitInfo,
            } = this.getInitialGoodAndUnitInfo(nextProps);
            this.setState({
                selectedGood: good,
                goodsList: unitInfo,
            })
        }
    }

    getInitialGoodAndUnitInfo = (props = this.props) => {
        const goods = props.goods.toJS();
        const { goodsList = [] } = props.data;
        if (!goods.length || !goodsList.length) {
            return {
                good: null,
                unitInfo: [],
            }
        };
        const goodID = goodsList[0].foodItemID;
        const matchedGood = goods.find(item => item.goodID === goodID);
        if (!matchedGood) {
            return {
                good: null,
                unitInfo: [],
            }
        }
        return {
            good: matchedGood,
            unitInfo: matchedGood.goodUnitInfo.map(unit => {
                const savedUnitInfo = goodsList.find(item => item.foodID === unit.unitID);
                if (savedUnitInfo) {
                    return {
                        ...unit,
                        point: savedUnitInfo.point,
                        price: savedUnitInfo.price,
                        storage: savedUnitInfo.storage || undefined,
                    }
                }
                return unit;
            })
        }
    }

    handleSubmit = () => {
        let flag = true;
        const {
            selectedGood,
            goodsList,
            ...rest,
        } = this.state;
        if (!selectedGood) {
            message.warning('请选择参与活动的商品');
            return false;
        } else {
            for (const good of goodsList) {
                if ((good.storage != null && good.storage !== '' && good.storage == 0)) {
                    message.warning(`规格：【${good.unitName1}】所设置的库存要大于0`)
                    flag = false;
                    break;
                }
                if (good.point > good.sellPoint) {
                    message.warning(`规格：【${good.unitName1}】所设置的秒杀积分不能大于积分售价`)
                    flag = false;
                    break;
                }
                if (good.price > good.sellPrice) {
                    message.warning(`规格：【${good.unitName1}】所设置的秒杀现金不能大于现金售价`)
                    flag = false;
                    break;
                }
                if (!(good.price > 0 || good.point > 0)) {
                    message.warning(`规格：【${good.unitName1}】所设置的秒杀现金和秒杀积分至少要有一个大于0`)
                    flag = false;
                    break;
                }
            }
        }
        this.props.form.validateFieldsAndScroll((err1) => {
            if (err1) {
                flag = false;
            }
        });
        if (!flag) {
            return false;
        }
        this.props.onChange({
            ...rest,
            productsLimit: rest.productsLimit || 0,
            // goodsList 需要按照后端格式组装一下
            goodsList: goodsList.map(item => ({
                foodID: item.unitID,
                foodItemID: selectedGood.goodID,
                point: item.point,
                purchaseLimit: item.purchaseLimit,
                storage: item.storage || 0,
                price: item.price,
                specType: item.unitName1,
                name: selectedGood.goodName,
            }))
        })
        return flag;
    }

    handleProductsLimitChange = (value) => {
        this.setState({productsLimit: value.number});
    }
    handleGoodChange = (good) => {
        this.setState({
            selectedGood: good,
            goodsList: good ? [...good.goodUnitInfo] : [],
        })
    }
    handleTagChange = ({ target: {value} }) => {
        this.setState({
            tag: value,
        })
    }
    onCellChange = (index, key, value) => {
        const { goodsList } = this.state;
        goodsList[index][key] = value.number;
        this.setState({ goodsList })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form>
                <FormItem
                    label="选择商品"
                    required
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <SingleGoodSelector
                        allDishes={this.props.goods.toJS()}
                        allCategories={this.props.goodCategories.toJS()}
                        value={this.state.selectedGood ? this.state.selectedGood.value : undefined}
                        onChange={this.handleGoodChange}
                    />
                </FormItem>
                <FormItem
                    label="秒杀价"
                    required
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                >
                    <Table
                        bordered={true}
                        columns={this.columns}
                        dataSource={this.state.goodsList}
                        scroll={{ x: 780 }}
                        pagination={false}
                    />
                </FormItem>
                <FormItem
                    label="活动主题"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 8 }}
                    style={{position: 'relative'}}
                >
                    {
                        getFieldDecorator('tag', {
                            rules: [
                                { required: true, message: '主题不能为空' },
                                { max: 5, message: '主题不能超过5个字' },
                                { min: 2, message: '主题不能少于2个字' },
                            ],
                            initialValue: this.state.tag,
                            onChange: this.handleTagChange
                        })(
                            <Input placeholder="活动主题" />
                        )
                    }
                    <Tooltip title="活动期间主题文案，展示在商品名称之前。(限制2~5字)">
                        <Icon
                            type="question-circle"
                            style={{
                                position: 'absolute',
                                color: '#787878',
                                right: -20,
                                top: 8,
                            }}
                        />
                    </Tooltip> 
                </FormItem>
                <FormItem
                    label="商品限购"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 8 }}
                    style={{position: 'relative'}}
                >
                    {
                        getFieldDecorator('productsLimit', {
                            rules: [
                                {
                                    validator: (rule, v, cb) => {
                                        if (!v || (!v.number && v.number !== 0)) {
                                            return cb();
                                        } else if (v.number < 1 || v.number > 9999) {
                                            return cb('商品限购数量范围为1～9999');
                                        }
                                        cb()
                                    },
                                }
                            ],
                            initialValue: {number: this.state.productsLimit},
                            onChange: this.handleProductsLimitChange
                        })(
                            <PriceInput
                                addonAfter="件 / 人"
                                placeholder="不限"
                                modal="int"
                                maxNum={6}
                            />
                        )
                    }
                    <Tooltip title="不填则代表商品不限购">
                        <Icon
                            type="question-circle"
                            style={{
                                position: 'absolute',
                                color: '#787878',
                                right: -20,
                                top: 8,
                            }}
                        />
                    </Tooltip> 
                </FormItem>
            </Form>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        goodCategories: state.sale_promotionDetailInfo_NEW.get('goodCategories'),
        goods: state.sale_promotionDetailInfo_NEW.get('goods'),
    };
};

export default connect(mapStateToProps)(Form.create()(SettingInfo));
