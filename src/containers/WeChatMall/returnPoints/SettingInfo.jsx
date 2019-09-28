import React from 'react';
import { connect } from 'react-redux';
import {
    Form,
    Select,
    Radio,
    Icon,
    Table,
    message,
} from 'antd';
import styles from '../../SaleCenterNEW/ActivityPage.less';
import selfStyle from '../style.less'
import PriceInput from '../../SaleCenterNEW/common/PriceInput';
import SingleGoodSelector, { MultipleGoodSelector } from '../../../components/common/GoodSelector'

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class SettingInfo extends React.Component {
    constructor(props) {
        super(props);
        const {
            selectedCategory,
            selectedGood,
            excludeGoods,
        } = this.getInitialGoodInfo();
        this.state = {
            ruleType: props.data.ruleType || 0,
            productScopeType: props.data.productScopeType || 0,
            returnPointRuleList: props.data.returnPointRuleList || [
                {
                    money: undefined,
                    pointRetPrecent: undefined,
                },
            ],
            selectedCategory, // str
            selectedGood, // obj
            excludeGoods, // arr
        };
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
                selectedCategory,
                selectedGood,
                excludeGoods,
            } = this.getInitialGoodInfo(nextProps);
            this.setState({
                selectedCategory,
                selectedGood,
                excludeGoods,
            })
        }
    }

    getInitialGoodInfo = (props = this.props) => {
        const goods = props.goods.toJS();
        const { goodsList = [] } = props.data;
        if (!goods.length || !goodsList.length) {
            return {
                selectedCategory: undefined, // str
                selectedGood: undefined, // obj
                excludeGoods: [], // arr
            }
        };
        let selectedCategory;
        let selectedGood;
        const excludeGoods = []
        goodsList.forEach(element => {
            if (element.scopeType == 1) {
                selectedCategory = element.targetID
            } else if (element.scopeType == 2) {
                selectedGood = { value: element.targetID }
            } else if (element.scopeType == 4) {
                excludeGoods.push(element.targetID)
            }
        });
        
        return {
            selectedCategory,
            selectedGood,
            excludeGoods,
        }
    }

    handleSubmit = () => {
        let flag = true;
        const {
            selectedCategory,
            selectedGood,
            excludeGoods,
            productScopeType,
            ...rest,
        } = this.state;
        this.props.form.validateFieldsAndScroll((err1) => {
            if (err1) {
                flag = false;
            }
        });
        if (!flag) { return false; }
        if (productScopeType == 2 && !selectedGood) {
            message.warning('请选择适用商品');
            return false;
        }
        const goodsList = [];
        if (productScopeType == 1) {
            goodsList.push(
                {targetID: selectedCategory, scopeType: 1},
                ...excludeGoods.map(item => ({targetID: item, scopeType: 4}))
            )
        } else if (productScopeType == 2) {
            goodsList.push({targetID: selectedGood.value || selectedGood.targetID, scopeType: 2})
        }
        this.props.onChange({
            ...rest,
            goodsList,
            productScopeType,
        })
        return flag;
    }

    handleRuleTypeChange = (val) => {
        if (val == 1) {
            this.setState({
                ruleType: val,
                returnPointRuleList: [this.state.returnPointRuleList[0]]
            })
        } else {
            this.setState({
                ruleType: val,
            })
        }
    }

    handlePercentChange = (val, index) => {
        const {
            returnPointRuleList,
        } = this.state;
        returnPointRuleList[index].pointRetPrecent = val.number;
        this.setState({
            returnPointRuleList
        })
    }
    handleMoneyChange = (val, index) => {
        const {
            returnPointRuleList,
        } = this.state;
        returnPointRuleList[index].money = val.number;
        this.setState({
            returnPointRuleList
        })
    }

    handleRuleAdd = () => {
        const { returnPointRuleList } = this.state;
        this.setState({
            returnPointRuleList: [...returnPointRuleList, {
                money: undefined,
                pointRetPrecent: undefined,
            }]
        })
    }

    handleRuleDelete = (index) => {
        const { returnPointRuleList } = this.state;
        if (returnPointRuleList.length > 1) {
            returnPointRuleList.splice(index, 1);
            this.setState({
                returnPointRuleList,
            })
        }
    }

    handleGoodChange = (good) => {
        this.setState({
            selectedGood: good,
        })
    }
    handleCategoryChange = (val) => {
        if (val !== this.state.selectedCategory) {
            this.setState({
                selectedCategory: val,
                excludeGoods: [],
            })
        }
    }

    renderRuleItems() {
        const { form: { getFieldDecorator } } = this.props;
        const {
            ruleType,
            returnPointRuleList,
        } = this.state;
        return (
            <div style={{ marginLeft: 109 }}>
                {
                    returnPointRuleList.map((item, index, arr) => (
                        <div key={`${index}`} className={selfStyle.fakeFormControl}>
                            <FormItem
                                wrapperCol={24}
                                style={{ width: 255 }}
                            >
                                {
                                    getFieldDecorator(`threshold${index}`, {
                                        initialValue: {number: item.money},
                                        onChange: (val) => this.handleMoneyChange(val, index),
                                        rules: [
                                            {
                                                validator: (rule, v, cb) => {
                                                    if (!v || !(v.number > 0)) {
                                                        return cb('金额要大于0');
                                                    }
                                                    for (let i = 0; i < index; i ++) {
                                                        if (!(+v.number > arr[i].money)) {
                                                            return cb('金额要大于上一档位');
                                                        }
                                                    }
                                                    cb()
                                                },
                                            },
                                        ],
                                    })(
                                        <PriceInput
                                            addonBefore={ruleType == 1 ? '消费每满' : '消费满'}
                                            addonAfter="元"
                                            modal="float"
                                            maxNum={5}
                                        />
                                    )
                                }
                            </FormItem>
                            <div className={selfStyle.fakeLabel}>返积分比例</div>
                            <FormItem
                                wrapperCol={24}
                                style={{ width: 135 }}
                            >
                                {
                                    getFieldDecorator(`percent${index}`, {
                                        initialValue: {number: item.pointRetPrecent},
                                        onChange: (val) => this.handlePercentChange(val, index),
                                        rules: [
                                            {
                                                validator: (rule, v, cb) => {
                                                    if (!v || !(v.number > 0 && v.number < 100)) {
                                                        return cb('比例范围0～100');
                                                    }
                                                    for (let i = 0; i < index; i ++) {
                                                        if (!(+v.number > arr[i].pointRetPrecent)) {
                                                            return cb('比例要大于上一档位');
                                                        }
                                                    }
                                                    cb()
                                                },
                                            },
                                        ],
                                    })(
                                        <PriceInput
                                            addonAfter="%"
                                            modal="float"
                                            maxNum={3}
                                        />
                                    )
                                }
                            </FormItem>
                            {
                                ruleType == 0 && (
                                    <div className={selfStyle.iconsArea}>
                                        {
                                            (arr.length < 3 && index === arr.length - 1) && (
                                                <Icon
                                                    style={{ marginRight: 8 }}
                                                    className={styles.plusIcon}
                                                    type="plus-circle-o"
                                                    onClick={this.handleRuleAdd}
                                                />
                                            )
                                        }
                                        {
                                            (arr.length > 1 && index === arr.length - 1) && (
                                                <Icon
                                                    className={styles.deleteIcon}
                                                    type="minus-circle-o"
                                                    onClick={() => this.handleRuleDelete(index)}
                                                />
                                            )
                                        }
                                    </div>
                                )
                            }
                        </div>
                    ))
                }
            </div>
        )
    }

    renderRenderRuleForm() {
        const {
            ruleType,
            returnPointRuleList,
        } = this.state;
        return (
            <Form className={styles.FormStyle}>
                <FormItem
                    label="活动规则"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <Select
                        value={`${ruleType}`}
                        onChange={this.handleRuleTypeChange}
                    >
                        <Option value="0">消费满一定金额即赠送相应积分</Option>
                        <Option value="1">消费每满一定金额即赠送相应积分</Option>
                    </Select>
                </FormItem>
                {this.renderRuleItems()}
                {this.renderGoodSelector()}
            </Form>
        )
    }
    renderGoodSelector() {
        const {
            productScopeType,
            selectedCategory,
            excludeGoods,
        } = this.state;
        const { form: { getFieldDecorator } } = this.props;
        return (
            <div>
                <FormItem
                    label="活动范围"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <RadioGroup
                        value={productScopeType}
                        onChange={(e) => {
                            this.setState({
                                productScopeType: e.target.value,
                            });
                        }}
                    >
                        <Radio value={0}>全部商品</Radio >
                        <Radio value={1}>按分类</Radio >
                        <Radio value={2}>按商品</Radio >
                    </RadioGroup >
                </FormItem>
                {
                    productScopeType == 1 && (
                        <div>
                            <FormItem
                                label="适用商品分类"
                                className={styles.FormItemStyle}
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 17 }}
                            >
                                {
                                    getFieldDecorator('selectedCategory', {
                                        initialValue: selectedCategory,
                                        onChange: this.handleCategoryChange,
                                        rules: [
                                            { required: true, message: '适用商品分类不得为空' },
                                        ]
                                    })(
                                        <Select placeholder="请选择适用商品分类">
                                            {this.props.goodCategories.toJS().map(({value, label}) => (
                                                <Option key={value} value={value} >{label}</Option>
                                            ))}
                                        </Select>
                                    )
                                }
                            </FormItem>
                            <FormItem
                                label="排除商品"
                                className={styles.FormItemStyle}
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 17 }}
                            >
                                <MultipleGoodSelector
                                    value={excludeGoods}
                                    placeholder="选择排除商品"
                                    allDishes={this.props.goods.toJS().filter(item => item.categoryID === selectedCategory)}
                                    allCategories={this.props.goodCategories.toJS().filter(item => item.value === selectedCategory)}
                                    onChange={val => this.setState({
                                        excludeGoods: val
                                    })}
                                />
                            </FormItem>
                        </div>
                    )
                }
                {
                    productScopeType == 2 && (
                        <div>
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
                        </div>
                    )
                }
            </div>
            
        )
    }
    

    render() {
        return (
            <div>
                {this.renderRenderRuleForm()}
            </div>
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
