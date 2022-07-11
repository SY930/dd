import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Row,
    Col,
    Table,
    Form,
    Tooltip,
    Popconfirm,
    Select,
    Modal,
    Button,
    Radio,
    message,
} from 'antd';
import { axios, HTTP_CONTENT_TYPE_WWWFORM, genQueryString, getAccountInfo } from '@hualala/platform-base'
import BaseForm from 'components/common/BaseForm';
import {
    memoizedExpandCategoriesAndDishes,
} from '../../../utils';
import { result } from 'lodash'
import FoodSelectModal from '../../../components/common/FoodSelector/FoodSelectModal'
import styles from '../ActivityPage.less'
import PriceInputIcon from '../common/PriceInputIcon';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from '../IntlDecor';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const mapStateToProps = (state) => {
    return {
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        /** 基础营销活动范围中设置的品牌 */
        selectedBrands: state.sale_promotionScopeInfo_NEW.getIn(['$scopeInfo', 'brands']),
        /** 基本档获取的所有品牌（由店铺schema接口获取，所以似乎品牌下没有店铺的话不会在这里？） */
        allBrands: state.sale_promotionScopeInfo_NEW.getIn(['refs', 'data', 'brands']),
        allCategories: state.sale_promotionDetailInfo_NEW.getIn(['$categoryAndFoodInfo', 'categories']),
        allDishes: state.sale_promotionDetailInfo_NEW.getIn(['$categoryAndFoodInfo', 'dishes']),
    }
}
@injectIntl()
class SpecialDishesTableWithBrand extends Component {
    constructor(props) {
        super(props);
        let priceLst;
        try {
            priceLst = props.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']).toJS();
        } catch (e) {
            priceLst = []
        }
        this.state = {
            selectorModalVisible: false,
            modifyModalVisible: false,
            priceFilterType: 'price',
            priceLst,
            data: [],
            formKeys: ['setType', 'discount'],
            referenceModalVisible: false,
            foodBooks: [],
            bookID: '',
            setType: '1',
        }
    }
    componentDidMount() {
        if (this.props.allBrands.size && this.props.allCategories.size && this.props.allDishes.size) {
            this.mapPriceLstToDataThenEmit()
        }
        // 获取菜谱列表
        this.getGroupFoodBook()
    }
    componentDidUpdate(prevProps) {
        if (this.props.allBrands.size && this.props.allCategories.size && this.props.allDishes.size) {
            if (!prevProps.allBrands.size || !prevProps.allCategories.size || !prevProps.allDishes.size) {
                this.mapPriceLstToDataThenEmit()
            }
        }
        if (this.props.selectedBrands !== prevProps.selectedBrands) {
            if (JSON.stringify(this.props.selectedBrands.toJSON()) !== JSON.stringify(prevProps.selectedBrands.toJSON())) {
                this.setState({
                    data: [],
                });
                this.props.onChange([]);
            }
        }
    }

    getGroupFoodBook = async() => {
        const { groupID } = getAccountInfo();
        const response = await axios.post('/api/queryGroupFoodBook', genQueryString({ pageNo: '-1', groupID }),  {
            headers: { 'Content-Type': HTTP_CONTENT_TYPE_WWWFORM },
        });
        if (response.code !== '000') throw new Error(res.message);
        const foodBooks = result(response, 'data.records', [])
        this.setState({
            foodBooks: foodBooks.map(item => ({ brandID: item.brandID, bookID: item.bookID, bookName: item.bookName }))
        })
    }
    mapPriceLstToDataThenEmit = () => {
        const {
            allBrands,
            allCategories,
            allDishes
        } = this.props;
        const { dishes } = memoizedExpandCategoriesAndDishes(allBrands, allCategories, allDishes);
        const { priceLst } = this.state;
        if (!priceLst.length) return;
        const data = priceLst.reduce((acc, item) => {
            const dish = dishes.find(d => d.value === `${item.brandID || 0}__${item.foodName}${item.foodUnitName}`);
            if(dish){
                dish.newPrice = item.price
                dish.salePercent = Number(dish.newPrice) <= 0 ? '0' : Number(dish.newPrice) !== Number(dish.price) ? `${Number((Number(dish.newPrice) / dish.price * 10).toFixed(2))}` : '10'
                acc.push(dish)
            }
            return acc;
        }, [])
        this.setState({ data })
        this.props.onChange(data)
    }
    onPriceCellChange = (val, {index}) => {
        const data = [...this.state.data];
        let num = val.number;
        const record = data[index];
        if (val.number > +record.price) {// 特价不超过售价价
            num = record.price;
        }else if (val.number < 0) {// 特价不小于0
            num = '0';
        }
        record.newPrice = num;
        record.salePercent = (num / record.price * 10).toFixed(2)
        this.setState({data});
        this.props.onChange(data.map(item => ({...item})));
    }
    onPercentCellChange = (val, {index}) => {
        let reg = /^([0-9]*)(\.[0-9]{0,1})?$/
        const data = [...this.state.data];
        let num = val.number;
        const record = data[index];
        if (val.number > 10) {// 折扣不大于10
            num = 10;
        }else if (val.number < 0) {// 折扣不小于0
            num = '0';
        }
        // 保留一位小数
        if(!reg.test(val.number)){
            num = val.number.slice(0, -1)
        }
        record.salePercent = num;
        record.newPrice = (record.price * num / 10).toFixed(2)
        this.setState({data});
        this.props.onChange(data.map(item => ({...item})));
    }
    handleDel = (record) => {
        const data = [...this.state.data];
        data.splice(record.index, 1);
        this.setState({data})
        this.props.onChange(data)
    };
    handleModalOk = (v) => {
        const {
            allBrands,
            allCategories,
            allDishes,
        } = this.props;
        const { dishes } = memoizedExpandCategoriesAndDishes(allBrands, allCategories, allDishes);
        const dishObjects = v.reduce((acc, curr) => {
            const dishObj = dishes.find(item => item.value === curr);
            if (dishObj) {
                const reservedDish = this.state.data.find(item => item.value === dishObj.value);
                acc.push(reservedDish ? {...dishObj, newPrice: reservedDish.newPrice, salePercent: reservedDish.salePercent} : {...dishObj, salePercent: '10'})
            }
            return acc;
        }, [])
        this.setState({
            selectorModalVisible: false,
            data: dishObjects,
        })
        this.props.onChange(dishObjects)
    }
    handleModalCancel = () => {
        this.setState({
            selectorModalVisible: false,
        })
    }
    handleSelectDishes = () => {
        this.setState({
            selectorModalVisible: true,
        })
    }
    handleModifyDishes = () => {
        this.setState({
            modifyModalVisible: true,
        })
    }
    handleChangeFoodBook = (value) => {
        this.setState({ bookID: value })
    }

    handleConfirmPrice = async() => {
        const { bookID, setType }  = this.state
        if (setType === '2' && !bookID) {
            return message.warning('请选择菜谱')
        }
        if (setType === '1') {
            this.setState({
                referenceModalVisible: false,
            })
            return
        }
        console.log(this.state.bookID, 'bookID')
        const { groupID } = getAccountInfo();
        // /api/shopapi/queryGroupFoodCategory
        const response = await axios.post('/api/getFoodQuery', genQueryString({ bookID, groupID, shopID: '' }),  {
            headers: { 'Content-Type': HTTP_CONTENT_TYPE_WWWFORM },
        });
        if (response.code !== '000') throw new Error(res.message);
        const foodCategory = result(response, 'data.records', [])
        this.setState({
            foodCategory,
            referenceModalVisible: false,
        })
    }

    handleSetType = ({ target }) => {
        const {value} = target
        this.setState({
            setType: value,
            foodCategory: value === '1' ? [] : this.state.foodCategory
        })
    }
    renderFoodSelectorModal() {
        const {
            allBrands,
            allCategories,
            allDishes,
        } = this.props;
        let { dishes, categories, brands } = memoizedExpandCategoriesAndDishes(allBrands, allCategories, allDishes)
        const selectedBrands = this.props.selectedBrands.toJS();
        if (selectedBrands.length) {
            brands = brands.filter(({ value }) => value == 0 || selectedBrands.includes(value))
            categories = categories.filter(({brandID: value}) => value == 0 || selectedBrands.includes(value))
            dishes = dishes.filter(({brandID: value}) => value == 0 || selectedBrands.includes(value))
        }
        const initialValue = this.state.data.map((item) => `${item.brandID || 0}__${item.foodName}${item.unit}`);
        return (
            <FoodSelectModal
                allBrands={brands}
                allCategories={categories}
                allDishes={dishes}
                mode="dish"
                initialValue={initialValue}
                onOk={this.handleModalOk}
                onCancel={this.handleModalCancel}
            />
        )
    }

    renderReferenceModal = () => {
        const { setType,  foodBooks } = this.state
        const formItems = {
            setType: {
                label: '设置方式',
                type: 'custom',
                labelCol: { span: 4 },
                wrapperCol: { span: 14 },
                render: () => {
                    return (
                        <RadioGroup onChange={this.handleSetType} value={this.state.setType}>
                            <Radio value={'1'}>
                                按菜品库展示
                            </Radio>
                            <Radio value={'2'}>
                                按菜谱展示
                            </Radio>
                    </RadioGroup>
                    )
                }
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
                                    required: true, message: '请选择菜谱'
                                }],
                                onChange: this.handleChangeFoodBook,
                                initialValue: this.state.bookID,
                            })(<Select
                                    showSearch={true}
                                    allowClear={true}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                {(foodBooks || []).map(({ bookID, bookName}) => (<Select.Option value={`${bookID}`} key={bookID}>{bookName}</Select.Option>))}
                            </Select>)}
                        </FormItem>
                    ) : null
                     
                },
            }
        }
        return (
            <Modal
                title="菜品售价参考值"
                visible={true}
                width="500px"
                onOk={this.handleConfirmPrice}
                wrapClassName={styles.SpecialReferenceModalWarp}
                onCancel={() => this.setState({ referenceModalVisible: false })}
            >
                { setType === '2' &&  <div className={styles.referenceTip}>门店自建菜品按菜品库售价展示</div>}
                <BaseForm
                    getForm={form => this.basePriceForm = form}
                    formItems={formItems}
                    formKeys={['setType', 'menu']}
                    onChange={this.handleFormChange}
                />
            </Modal>
        )
    }
    /**
     * form modal
     */
    handleFormChange = (key, value) => {
        if(key == 'setType'){
            let formKeys = []
            if(value == '1') formKeys = ['setType', 'discount']
            if(value == '2') formKeys = ['setType', 'price']
            this.setState({formKeys})
        }
    }
    handleOk = () => {
        this.baseForm.validateFields((err, values) => {
            let {setType, discount, price} = values
            if (!err) {
                const data = [...this.state.data];
                if(setType == '1'){
                    let val = {number: discount}
                    data.forEach((item, index) => {
                        this.onPercentCellChange(val, {index})
                    })
                }else{
                    let val = {number: price}
                    data.forEach((item, index) => {
                        this.onPriceCellChange(val, {index})
                    })
                }
                this.setState({modifyModalVisible: false})
            }
        });
    }

    handleChangePrice = () => {
        this.setState({
            referenceModalVisible: true,
        })
    }
    renderPriceModifyModal() {
        let {formKeys} = this.state
        let formItems = {
            setType: {
                label: '设置方式',
                type: 'radio',
                labelCol: { span: 6 },
                wrapperCol: { span: 14 },
                options: [{label: '按折扣', value: '1'}, {label: '按活动价', value: '2'}],
                defaultValue: '1',
            },
            discount: {
                label: '折扣',
                type: 'text',
                placeholder: '保留一位小数',
                labelCol: { span: 6 },
                wrapperCol: { span: 14 },
                rules: [{
                    required: true,
                    pattern: /^(([1-9]\d{0,1})(\.\d{0,1})?|0.\d?[1-9]{0})$/,
                    message: '请输入0.1~10之间的数据，支持一位小数',
                }],
            },
            price: {
                label: '活动价',
                type: 'text',
                surfix: '元',
                placeholder: '请输入数值',
                labelCol: { span: 6 },
                wrapperCol: { span: 14 },
                rules: [{
                    required: true,
                    pattern: /^(([1-9]\d{0,5})(\.\d{0,2})?|0.\d?[1-9]{1})$/,
                    message: '请输入0.01~100000之间的数据，支持两位小数',
                }],
            },
        };
        return (
            <Modal
                title="批量修改商品"
                visible={true}
                width="400px"
                onOk={this.handleOk}
                onCancel={() => this.setState({modifyModalVisible: false}) }
            >
                <BaseForm
                    getForm={form => this.baseForm = form}
                    formItems={formItems}
                    formKeys={formKeys}
                    onChange={this.handleFormChange}
                />
            </Modal>
        )
    }
    
    render() {
        const {
            selectorModalVisible,
            modifyModalVisible,
            referenceModalVisible,
            data,
        } = this.state;
        const { intl } = this.props;
        const k6hfzdh8 = intl.formatMessage(SALE_STRING.k6hfzdh8);
        const k5ezdc19 = intl.formatMessage(SALE_STRING.k5ezdc19);
        const k6hfzdpl = intl.formatMessage(SALE_STRING.k6hfzdpl);
        const k5gfsuon = intl.formatMessage(SALE_STRING.k5gfsuon);
        const resultTableColumns = [
            {
                title: COMMON_LABEL.serialNumber,
                dataIndex: 'index',
                key: 'index',
                width: 50,
                className: 'TableTxtCenter',
                render: (text) => `${text + 1}`,
            },
            {
                title: COMMON_LABEL.actions,
                dataIndex: 'operation',
                key: 'operation',
                width: 50,
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    return (
                        <div className="editable-row-operations">
                            <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDel(record)}>
                                <a title={ COMMON_LABEL.delete }>{ COMMON_LABEL.delete }</a>
                            </Popconfirm>
                        </div>
                    );
                },
            },
            {
                title: SALE_LABEL.k5dlpn4t,
                dataIndex: 'brandName',
                key: 'brandName',
                width: 72,
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    return <Tooltip title={text}>{text}</Tooltip>
                },
            },
            {
                title: SALE_LABEL.k5gfsugb,
                dataIndex: 'foodCategoryName',
                key: 'foodCategoryName',
                width: 90,
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    return <Tooltip title={text}>{text}</Tooltip>
                },
            },
            {
                title: SALE_LABEL.k5gfsuon,
                dataIndex: 'foodName',
                key: 'foodName',
                width: 90,
                className: 'TableTxtLeft',
                render: (text, record, index) => {
                    return <Tooltip title={text}>{text}</Tooltip>
                },
            },
            {
                title: SALE_LABEL.k5kqz279,
                dataIndex: 'unit',
                key: 'unit',
                width: 50,
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    return <Tooltip title={text}>{text}</Tooltip>
                },
            },
            {
                title: SALE_LABEL.k6hdpwkx,
                width: 80,
                dataIndex: 'newPrice',
                key: 'newPrice',
                className: 'noPadding',
                render: (text, record, index) => {
                    return (
                        <span className={styles.rightAlign}>
                            <PriceInputIcon
                                type="text"
                                modal="float"
                                placeholder={k6hfzdh8}
                                value={{ number: record.newPrice ? record.newPrice : '0' }}
                                index={index}
                                onChange={(val) => { this.onPriceCellChange(val, record) }}
                            />
                        </span>
                    )
                },
                filterDropdown: (
                    <div className="custom-filter-dropdown">
                        <Select
                            style={{ width: 86, left: -63 }}
                            value={this.state.priceFilterType}
                            getPopupContainer={(node) => node.parentNode}
                            onChange={v => {
                                const newData = this.state.data.map(food => {
                                    food.newPrice = food[v] >= 0 ? food[v] : food.price; // 将newPrice变为对应option价
                                    return food
                                })
                                this.setState({ priceFilterType: v, data: newData })
                            }}
                        >
                            <Select.Option key='price' value="price">{SALE_LABEL.k5kqz2fl}</Select.Option>
                        <Select.Option key='vipPrice' value="vipPrice">{SALE_LABEL.k5m4q0r2}</Select.Option>
                        </Select>
                    </div>
                ),
                filterDropdownVisible: this.state.filterDropdownVisible,
                onFilterDropdownVisibleChange: visible => this.setState({ filterDropdownVisible: visible }),
            },
            {
                // 本组件接收到的售价已经是处理过的了
                title: SALE_LABEL.k6hdpwt9,
                dataIndex: 'price',
                key: 'price',
                width: 72,
                className: 'TableTxtRight',
                render: (text, record) => {
                // console.log("🚀 ~ file: SpecialDishesTableWithBrand.jsx ~ line 544 ~ SpecialDishesTableWithBrand ~ render ~ text, record", text, record)
                    if (this.state.setType === '2') {
                        const food  = (this.state.foodCategory || []).find((item) => item.foodCode == record.foodCode) || {}
                        // console.log("🚀 ~ file: SpecialDishesTableWithBrand.jsx ~ line 548 ~ SpecialDishesTableWithBrand ~ render ~ food", food)
                        return food.price ? food.price : '--'
                    }
                    return text
                }
            },
            {
                title: SALE_LABEL.k5ezcu1b,
                dataIndex: 'salePercent',
                key: 'salePercent',
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    return (
                        <span className={styles.rightAlign}>
                            <PriceInputIcon
                                type="text"
                                modal="float"
                                placeholder={'10表示不打折'}
                                value={{ number: record.salePercent == '10' ? '不打折' : record.salePercent }}
                                index={index}
                                onChange={(val) => { this.onPercentCellChange(val, record) }}
                            />
                        </span>
                    )
                },
            },
        ];
        const displayDataSource = data.map((item, index) => ({...item, index}))
        return (
            <FormItem className={styles.FormItemStyle}>
                <Row>
                    <Col span={2}>
                        <span className={styles.gTitle}>{SALE_LABEL.k6hdpwcl}</span>
                    </Col>
                    <Col span={4} offset={10}>
                        <Button
                            // className={styles.gTitleLink}
                            onClick={this.handleModifyDishes}
                        >
                            {'批量修改商品'}
                        </Button>
                    </Col>
                    <Col span={4} offset={0}>
                        <Button
                            // className={styles.gTitleLink}
                            onClick={this.handleSelectDishes}
                        >
                            {'批量添加商品'}
                        </Button>
                    </Col>
                    <Col span={4} offset={0}>
                        <Button
                            // className={styles.gTitleLink}
                            onClick={this.handleChangePrice}
                        >
                            {'售价参考值'}
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table
                            bordered={true}
                            dataSource={displayDataSource}
                            columns={resultTableColumns}
                            pagination={{ size: 'small', pageSize: 10 }}
                        />
                    </Col>
                </Row>
                {selectorModalVisible && this.renderFoodSelectorModal()}
                {modifyModalVisible && this.renderPriceModifyModal()}
                {referenceModalVisible && this.renderReferenceModal()}
            </FormItem>
        )
    }
}

export default connect(mapStateToProps)(SpecialDishesTableWithBrand);
