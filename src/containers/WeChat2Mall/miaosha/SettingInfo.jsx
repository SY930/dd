import React from 'react';
import { connect } from 'react-redux';
import {
    Form,
    Icon,
    Table,
    Tooltip,
    Input,
    message,
    Button,
    Row,
    Col,
} from 'antd';
import ImageUpload from 'components/common/ImageUpload'
import styles from '../../SaleCenterNEW/ActivityPage.less';
// import SingleGoodSelector from '../../../components/common/GoodSelector'
import FoodSelectModal from '../../../components/common//FoodSelector/FoodSelectModal'
import PriceInput from '../../SaleCenterNEW/common/PriceInput';
import {
    memoizedExpandCategoriesAndDishes,
} from '../../../utils';
import selfStyle from '../style.less'

const FormItem = Form.Item;
// const Option = Select.Option;

class SettingInfo extends React.Component {
    constructor(props) {
        super(props);
        // let priceLst;
        // try {
        //     priceLst = props.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']).toJS();
        // } catch (e) {
        //     priceLst = []
        // }
        this.state = {
            productsLimit: props.data.productsLimit > 0 ? props.data.productsLimit : undefined, // 不填写则默认不限
            tag: props.data.tag || undefined, // 活动主题, 后端如果返回'' ，还是希望显示placeholder
            bannerUrl: props.data.bannerUrl || '',
            selectorModalVisible: false,
            productList: [], // 为了和菜品弹窗数据一起回显，先把数据滞空 内部data
            _productList: props.data.productList || [], // 外部数据
        };
        this.columns = [
            {
                title: '规格',
                dataIndex: 'name',
                key: 'name',
                fixed: 'left',
                width: 100,
                render: value => <Tooltip title={value}><span>{value}</span></Tooltip>,
            },
            {
                title: '会员售价（元）',
                dataIndex: 'vipPrice',
                key: 'vipPrice',
                width: 120,
                className: 'TableTxtRight',
                render: value => <Tooltip title={value}><span>{value}</span></Tooltip>,
            },
            {
                title: '原价（元）',
                dataIndex: 'newPrice',
                key: 'newPrice',
                width: 100,
                className: 'TableTxtRight',
                render: value => <Tooltip title={value}><span>{value}</span></Tooltip>,
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
                                onChange={(val) => { this.onCellPriceChange(index, val, record) }}
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
                                onChange={(val) => { this.onCellStorageChange(index, val) }}
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
        if (this.props.allBrands.size && this.props.allCategories.size && this.props.allDishes.size) {
            this.mapPriceLstToDataThenEmit()
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.allBrands.size && this.props.allCategories.size && this.props.allDishes.size) {
            if (!prevProps.allBrands.size || !prevProps.allCategories.size || !prevProps.allDishes.size) {
                this.mapPriceLstToDataThenEmit()
            }
        }
    }

    onCellStorageChange = (index, val) => {
        const productList = [...this.state.productList];
        const num = val.number;
        const records = productList[index];
        records.storage = num
        this.setState({ productList });
        // this.props.onChange(productList.map(item => ({ ...item })));
    }

    onCellPriceChange = (index, val) => {
        if (!val) {
            return message.warn('秒杀现金价不能为空');
        }
        const productList = [...this.state.productList];
        let num = val.number;
        const records = productList[index];
        if (val.number > +records.newPrice) { // 秒杀价需小于原价
            num = records.newPrice;
        } else if (val.number < 0) { // 秒杀价不小于0
            num = '0';
        }
        records.price = num
        // record.salePercent = (num / record.prePrice * 10).toFixed(2)
        this.setState({ productList });
        // this.props.onChange(productList.map(item => ({ ...item })));
    }


    mapPriceLstToDataThenEmit = () => {
        const {
            allBrands,
            allCategories,
            allDishes,
        } = this.props;
        const { dishes } = memoizedExpandCategoriesAndDishes(allBrands, allCategories, allDishes);
        const { _productList } = this.state;
        if (!_productList.length) return;
        const data = this.findFoodData(dishes, _productList);
        data[0].name = _productList[0].name;
        data[0].storage = _productList[0].storage;
        data[0].foodItemID = _productList[0].foodItemID
        this.setState({ productList: data }) // 用外部数据填充内部数据显示，这样可保证看到数据时点击弹窗也有数据
        // this.props.onChange(data)
    }

    handleSubmit = () => {
        let flag = true;
        const {
            productList,
            productsLimit,
            tag,
            bannerUrl,
        } = this.state;
        if (!productList.length) {
            message.warning('请选择参与活动的商品');
            return false;
        }
        for (const good of productList) {
            if (!(good.storage > 0)) {
                message.warning(`规格：【${good.foodName}】所设置的库存要大于0`)
                flag = false;
                break;
            }
           if (good.price > +good.newPrice) {
                message.warning(`规格：【${good.foodName}】所设置的秒杀现金不能大于原价`)
                flag = false;
                break;
            }
            if (!(good.price > 0)) {
                message.warning(`规格：【${good.foodName}】所设置的秒杀现金要大于0`)
                flag = false;
                break;
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
            // productsLimit,
            tag,
            bannerUrl,
            productsLimit: productsLimit || 0,
            // goodsList 需要按照后端格式组装一下
            productList: productList.map(item => ({
                foodItemID: item.foodID,
                storage: item.storage || 0,
                price: item.price,
                name: item.foodName,
                originalPrice: item.newPrice,
                newPrice: item.newPrice,
                // label: item.label,
                vipPrice: item.vipPrice,
            })),
        })
        return flag;
    }

    handleProductsLimitChange = (value) => {
        this.setState({ productsLimit: value.number });
    }
    // handleGoodChange = (good) => {
    //     this.setState({
    //         selectedGood: good,
    //         goodsList: good ? [...good.goodUnitInfo] : [],
    //     })
    // }
    handleTagChange = ({ target: { value } }) => {
        this.setState({
            tag: value,
        })
    }

    handleSelectDishes = () => {
        this.setState({
            selectorModalVisible: true,
        })
    }

    handleModalCancel = () => {
        this.setState({
            selectorModalVisible: false,
        })
    }

    handleShareImageChangne = ({ key, value }) => {
        this.setState({ [key]: value });
    }

    handleFindFoodData = (dishes, v = []) => {
        const dishObjects = v.reduce((acc, curr) => {
            const dishObj = dishes.find(item => item.value === curr);
            if (dishObj) {
                const reservedDish = this.state.productList.find(item => item.value === dishObj.value);
                acc.push(reservedDish ? { ...dishObj, newPrice: reservedDish.newPrice, name: reservedDish.foodName }
                    : { ...dishObj, salePercent: '10', name: dishObj.foodName })
            }
            return acc;
        }, [])
        return dishObjects
    }

    handleModalOk = (v) => {
        const {
            allBrands,
            allCategories,
            allDishes,
        } = this.props;
        const { dishes } = memoizedExpandCategoriesAndDishes(allBrands, allCategories, allDishes);
        const dishObjects = this.handleFindFoodData(dishes, v);
        this.setState({
            selectorModalVisible: false,
            productList: dishObjects,
        })
        this.props.onChange({
            ...dishObjects,
        })
    }

    // 回显
    findFoodData = (dishes, productList) => {
        if (!productList.length) return [];
        const data = dishes.find(item => item.foodID == productList[0].foodItemID) || {};
        if (data.foodName) {
            return [data]
        }
        return [];
    }

    renderFoodSelectorModal = () => {
        const {
            allBrands,
            allCategories,
            allDishes,
        } = this.props;
        const { dishes, categories, brands } = memoizedExpandCategoriesAndDishes(allBrands, allCategories, allDishes)
        // console.log("🚀 ~ file: SettingInfo.jsx ~ line 301 ~ SettingInfo ~ brands", brands)
        // const selectedBrands = this.props.selectedBrands.toJS();
        // console.log("🚀 ~ file: SettingInfo.jsx ~ line 303 ~ SettingInfo ~ selectedBrands", selectedBrands)
        // if (selectedBrands.length) {
        //     brands = brands.filter(({ value }) => value == 0 || selectedBrands.includes(value))
        //     categories = categories.filter(({ brandID: value }) => value == 0 || selectedBrands.includes(value))
        //     dishes = dishes.filter(({ brandID: value }) => value == 0 || selectedBrands.includes(value))
        // }
        // const { productList } = this.state;
        const findFoodData = this.findFoodData(dishes, this.state.productList);
        console.log("🚀 ~ file: SettingInfo.jsx ~ line 333 ~ SettingInfo ~ findFoodData", findFoodData)
        const initialValue = findFoodData.map(item => `${item.brandID || 0}__${item.foodName}${item.unit}`);
        console.log("🚀 ~ file: SettingInfo.jsx ~ line 334 ~ SettingInfo ~ initialValue", initialValue)
        return (
            <FoodSelectModal
                allBrands={brands}
                allCategories={categories}
                allDishes={dishes}
                mode="dish"
                initialValue={initialValue}
                multiple={false}
                onOk={this.handleModalOk}
                onCancel={this.handleModalCancel}
            />
        )
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { selectorModalVisible, productList, bannerUrl } = this.state;
        const displayDataSource = productList.map((item, index) => ({ ...item, index }));
        return (
            <Form>
                <FormItem
                    label="选择商品"
                    required={true}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <Button
                        // className={styles.gTitleLink}
                        onClick={this.handleSelectDishes}
                    >
                        {'批量添加商品'}
                    </Button>
                </FormItem>
                <FormItem
                    label="秒杀价"
                    required={true}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                >
                    <Table
                        bordered={true}
                        columns={this.columns}
                        dataSource={displayDataSource}
                        // scroll={{ x: 380 }}
                        pagination={false}
                    />
                </FormItem>
                <FormItem
                    label="活动主题"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 8 }}
                    style={{ position: 'relative' }}
                >
                    {
                        getFieldDecorator('tag', {
                            rules: [
                                { max: 5, message: '主题不能超过5个字' },
                                { min: 2, message: '主题不能少于2个字' },
                            ],
                            initialValue: this.state.tag,
                            onChange: this.handleTagChange,
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
                                },
                            ],
                            initialValue: { number: this.state.productsLimit },
                            onChange: this.handleProductsLimitChange,
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
                    label="活动图片"
                    // className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                >
                    <Row>
                        <Col span={24} >
                            <ImageUpload
                                value={bannerUrl}
                                limitType={'.jpeg,.jpg,.png,.JPEG,.JPG,.PNG'}
                                limitSize={5 * 1024 * 1024}
                                onChange={value => this.handleShareImageChangne({ key: 'bannerUrl', value })}
                            />
                        </Col>
                        {/* <Col span={18} className={styles.grayFontPic} > */}
                        <p >图片建议尺寸：690*260，支持PNG、JPG格式，大小不超过5M，此图设置后将展示小程序活动页面展示</p>
                        {/* </Col> */}
                    </Row>
                </FormItem>
                {selectorModalVisible && this.renderFoodSelectorModal()}
            </Form>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        goodCategories: state.sale_promotionDetailInfo_NEW.get('goodCategories'),
        goods: state.sale_promotionDetailInfo_NEW.get('goods'),
        /** 基础营销活动范围中设置的品牌 */
        // selectedBrands: state.sale_promotionScopeInfo_NEW.getIn(['$scopeInfo', 'brands']),
        /** 基本档获取的所有品牌（由店铺schema接口获取，所以似乎品牌下没有店铺的话不会在这里？） */
        allBrands: state.sale_promotionScopeInfo_NEW.getIn(['refs', 'data', 'brands']),
        allCategories: state.sale_promotionDetailInfo_NEW.getIn(['$categoryAndFoodInfo', 'categories']),
        allDishes: state.sale_promotionDetailInfo_NEW.getIn(['$categoryAndFoodInfo', 'dishes']),
    };
};

export default connect(mapStateToProps)(Form.create()(SettingInfo));
