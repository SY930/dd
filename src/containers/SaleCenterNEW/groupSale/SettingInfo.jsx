import React from 'react';
import { connect } from 'react-redux';
import {
    Form,
    Select,
    Radio,
    Icon,
    Tooltip,
    Checkbox,
    Table,
    message,
    Upload,
    TreeSelect,
} from 'antd';
import styles from '../../SaleCenterNEW/ActivityPage.less';
import selfStyle from './style.less'
import PriceInput from '../../SaleCenterNEW/common/PriceInput';
import SingleGoodSelector from '../../../components/common/GoodSelector'
import ImageUpload from 'components/common/ImageUpload';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const limitType = '.jpeg,.jpg,.png,.gif,.JPEG,.JPG,.PNG,.GIF';
const fileSize = 3 * 1024 * 1024;

const RADIO_OPTIONS = Object.freeze([
    {
        value: 0,
        name: '普通拼团',
    }, {
        value: 1,
        name: '老带新拼团',
    },
]);

class SettingInfo extends React.Component {
    constructor(props) {
        super(props);
        const {
            good,
            unitInfo,
        } = this.getInitialGoodAndUnitInfo();
        let data = props.data || {}
        this.state = {
            activeType: data.activeType || 0,
            isJoin: data.isJoin === undefined ? 1 : data.isJoin, // 默认checked
            virtualGroup: data.virtualGroup, // 默认unchecked
            joinCount: data.joinCount === undefined ? 2 : data.joinCount, // 参团人数默认为2
            productsLimit: data.productsLimit > 0 ? data.productsLimit : undefined, // 不填写则默认不限
            goodsList: unitInfo,
            selectedGood: good,
            bannerUrl: '',
            virtualSales: '',
        };
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'label',
                key: 'label',
                // fixed: 'left',
                width: 100,
                render: value => <Tooltip title={value}><span>{value}</span></Tooltip>,
            },
            {
                title: '原价（元）',
                dataIndex: 'giftValue',
                key: 'giftValue',
                width: 100,
                className: 'TableTxtRight',
                render: value => <Tooltip title={value}><span>{value}</span></Tooltip>,
            },
            {
                title: '拼团现金(元)',
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
                                placeholder="拼团现金"
                                value={{ number: record.price }}
                                maxNum={6}
                                onChange={(val) => { this.onCellChange(index, 'price', val) }}
                            />
                        </span>
                    )
                },
            },
            {
                title: '拼团库存',
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
                                placeholder="拼团库存"
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

    onUpload = (url) => {
        this.setState({
            bannerUrl: url,
        })
    }

    getInitialGoodAndUnitInfo = (props = this.props) => {
        const goods = props.goods.toJS();
        const { goodsList = [] } = props.data || {};
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
                debugger
                const savedUnitInfo = goodsList.find(item => item.foodID === unit.unitID);
                if (savedUnitInfo) {
                    return {
                        ...unit,
                        point: savedUnitInfo.point,
                        price: savedUnitInfo.price,
                        storage: savedUnitInfo.storage,
                    }
                }
                return unit;
            })
        }
    }

    onCellChange = (index, key, value) => {
        const { goodsList } = this.state;
        goodsList[index][key] = value.number;
        this.setState({ goodsList })
    }

    handleJoinCountChange = ({ number }) => {
        this.setState({
            joinCount: number,
        });
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
                if (good.storage >= +good.goodStock) {
                    message.warning(`规格：【${good.label}】所设置的库存要小于总库存`)
                    flag = false;
                    break;
                }
                if (!(good.storage > 0)) {
                    message.warning(`规格：【${good.label}】所设置的库存要大于0`)
                    flag = false;
                    break;
                }
                if (good.point > +good.sellPoint) {
                    message.warning(`规格：【${good.label}】所设置的拼团积分不能大于积分售价`)
                    flag = false;
                    break;
                }
                if (good.sellPrice > 0) {
                    if (good.price > +good.sellPrice) {
                        message.warning(`规格：【${good.label}】所设置的秒杀现金不能大于现金售价`)
                        flag = false;
                        break;
                    }
                } else {
                    if (good.price > +good.prePrice) {
                        message.warning(`规格：【${good.label}】所设置的秒杀现金不能大于原价`)
                        flag = false;
                        break;
                    }
                }
                if (!(good.price > 0)) {
                    message.warning(`规格：【${good.label}】所设置的拼团现金要大于0`)
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
            productList: goodsList.map(item => ({
                originalPrice: item.giftValue,
                foodItemID: item.value,
                storage: item.storage,
                price: item.price,
                name: item.label,
            })),
        })
        return flag;
    }

    onReservationChange = (value) => {
        this.setState({ reservationTime: value.number });
    }
    handleProductsLimitChange = (value) => {
        this.setState({ productsLimit: value.number });
    }

    handleGoodChange = (good) => {
        const {
            unionList = []
        } = this.props
        const goodsList = unionList.filter((item) => { return item.value == good })
        // debugger
        this.setState({
            selectedGood: good,
            goodsList,
        })
    }

    handleActiveTypeChange = (event) => {
        this.setState({
            activeType: event.target.value,
        });
    }

    handleVirtualGroupChange = ({ target: { checked } }) => {
        this.setState({
            virtualGroup: +checked,
        });
    }

    handleVirtualSalesChange = (event) => {
        this.setState({
            virtualSales: event.number,
        });
    }

    handleIsJoinChange = ({ target: { checked } }) => {
        this.setState({
            isJoin: +checked,
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { treeData = [] } = this.props
        // debugger
        return (
            <Form>
                <FormItem
                    label="拼团类型"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 7 }}
                    style={{ position: 'relative' }}
                >
                    <RadioGroup
                        value={this.state.activeType}
                        onChange={this.handleActiveTypeChange}
                    >
                        {RADIO_OPTIONS.map((type) => {
                            return (<Radio key={`${type.value}`} value={type.value}>{type.name}</Radio >);
                        })}
                    </RadioGroup >
                    <Tooltip title="所有用户都能开团，但新会员才能参团">
                        <Icon
                            type="question-circle"
                            style={{
                                position: 'absolute',
                                color: '#787878',
                                right: 5,
                                top: 8,
                            }}
                        />
                    </Tooltip>
                </FormItem>
                <FormItem
                    label="选择商品"
                    required
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {/* debugger */}
                    <TreeSelect
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={treeData}
                        placeholder="请选择礼品名称"
                        showSearch={true}
                        treeNodeFilterProp="label"
                        value={this.state.selectedGood}
                        onChange={this.handleGoodChange}
                        allowClear={true}
                    />
                </FormItem>
                <FormItem
                    label="拼团价"
                    required
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                >
                    <Table
                        bordered={true}
                        columns={this.columns}
                        dataSource={this.state.goodsList}
                        // scroll={{ x: 780 }}
                        pagination={false}
                    />
                </FormItem>
                <FormItem
                    label="参团人数"
                    required
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 8 }}
                >
                    {
                        getFieldDecorator('joinCount', {
                            rules: [
                                {
                                    validator: (rule, v, cb) => {
                                        if (!v || (!v.number && v.number !== 0)) {
                                            return cb('拼团人数不得为空');
                                        } else if (v.number > 100 || v.number < 2) {
                                            return cb('拼团人数只能设置为2-100');
                                        }
                                        cb()
                                    },
                                }
                            ],
                            initialValue: { number: this.state.joinCount },
                            onChange: this.handleJoinCountChange
                        })(
                            <PriceInput
                                addonAfter="人"
                                placeholder="请输入参团人数"
                                modal="int"
                                maxNum={3}
                            />
                        )
                    }
                </FormItem>
                <FormItem
                    label="商品限购"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 8 }}
                    style={{ position: 'relative' }}
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
                            initialValue: { number: this.state.productsLimit },
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
                <FormItem
                    label="凑团设置"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 4 }}
                    style={{ position: 'relative' }}
                >
                    <Checkbox
                        style={{ marginTop: 6 }}
                        checked={!!this.state.isJoin}
                        onChange={this.handleIsJoinChange}
                    >
                        开启凑团
                    </Checkbox>
                    <Tooltip title="开启凑团后，买家可以直接选任意一个未满团参团，提升成团率">
                        <Icon
                            type="question-circle"
                            style={{
                                position: 'absolute',
                                color: '#787878',
                                right: 20,
                                top: 8,
                            }}
                        />
                    </Tooltip>
                </FormItem>
                <FormItem
                    label="模拟成团"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 5 }}
                    style={{ position: 'relative' }}
                >
                    <Checkbox
                        style={{ marginTop: 6 }}
                        checked={!!this.state.virtualGroup}
                        onChange={this.handleVirtualGroupChange}
                    >
                        开启模拟成团
                    </Checkbox>
                    <Tooltip title="开启模拟成团后，拼团有效期内人数未满的团，系统将会自动使该团成团。你只需要对已付款参团的真实买家发货。建议合理开启，以提高成团率。">
                        <Icon
                            type="question-circle"
                            style={{
                                position: 'absolute',
                                color: '#787878',
                                right: 0,
                                top: 8,
                            }}
                        />
                    </Tooltip>
                </FormItem>
                <FormItem
                    label="模拟销量"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 8 }}
                    style={{ position: 'relative' }}
                >
                    {
                        getFieldDecorator('virtualSales', {
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
                            initialValue: { number: this.state.virtualSales },
                            onChange: this.handleVirtualSalesChange
                        })(
                            <PriceInput
                                placeholder="请输入数字"
                                modal="int"
                                maxNum={6}
                            />
                        )
                    }
                </FormItem>
                {/* debugger */}
                <FormItem
                    label="活动图片"
                    required={true}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    className={styles.diffUpload}
                >
                    {
                        getFieldDecorator('bannerUrl', {
                            rules: [
                                { required: true, message: '活动图片不得为空' },
                            ],
                            initialValue: this.state.bannerUrl,
                            onChange: this.onUpload,
                        })(
                            <ImageUpload
                                limitType={limitType}
                                limitSize={fileSize}
                            />
                        )
                    }
                    <p className={styles.antuploadhint}>
                        建议尺寸: 690*260像素, 大小不超过5M。此图设置后将在小程序活动页面展示
                    </p>
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
