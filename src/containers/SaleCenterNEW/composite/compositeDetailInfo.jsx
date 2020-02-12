import { Button, Checkbox, Col, Form, Icon, message, Row } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont'; // 引入icon图标组件库
import CloseableTip from "../../../components/common/CloseableTip/index";
import AdvancedPromotionDetailSetting from '../../../containers/SaleCenterNEW/common/AdvancedPromotionDetailSetting';
import PriceInput from '../../../containers/SaleCenterNEW/common/PriceInput';
import { saleCenterSetPromotionDetailAC } from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import styles from '../ActivityPage.less';
import checkStyle from './checkStyle.less';
import CategoryAndFoodSelector from '../common/CategoryAndFoodSelector'
import CategoryAndFoodSelectorForShop from '../common/CategoryAndFoodSelectorForShop'
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from '../IntlDecor';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const ButtonGroup = Button.Group;
const Immutable = require('immutable');

@injectIntl()
class CompositeDetailInfo extends React.Component {
    constructor(props) {
        super(props);
        this.defaultRun = '0';
        const _scopeLst = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'scopeLst']).toJS();
        this.state = {
            display: false,
            // data 用来存放 条件中的菜品信息
            scopeLst: _scopeLst,
            data: this.sortScopeLst(_scopeLst),
            // conditions 用来存放减免信息
            conditions: [
                {
                    groupCount: [], // 满足组合数
                    flag: '0', // 按减免还是折扣
                    cut: '', // 减免金额
                    discount: '', // 折扣率
                    groupCountStatus: 'success', // 验证信息
                    cutStatus: 'success', // 验证信息
                    discountStatus: 'success', // 验证信息
                },
            ],
        };

        this.renderAdvancedSettingButton = this.renderAdvancedSettingButton.bind(this);
        this.renderPromotionSetting = this.renderPromotionSetting.bind(this);
        this.renderConditions = this.renderConditions.bind(this);
        this.renderGroupIcon = this.renderGroupIcon.bind(this);
        this.renderConditionIcon = this.renderConditionIcon.bind(this);
        this.addCondition = this.addCondition.bind(this);
        this.deleteCondition = this.deleteCondition.bind(this);
        this.addGroup = this.addGroup.bind(this);
        this.deleteGroup = this.deleteGroup.bind(this);
        this.sortScopeLst = this.sortScopeLst.bind(this);
        this.sortRuleJson = this.sortRuleJson.bind(this);
        this.handleCountChange = this.handleCountChange.bind(this);
        this.handleGroupCountChange = this.handleGroupCountChange.bind(this);
        this.handleCutChange = this.handleCutChange.bind(this);
        this.handleDiscountChange = this.handleDiscountChange.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.props.getSubmitFn({
            finish: this.handleSubmit,
        });
        let _rule = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
        if (_rule === null || _rule === undefined) {
            return null;
        }
        _rule = Immutable.Map.isMap(_rule) ? _rule.toJS() : _rule;
        _rule = Object.assign({}, _rule);
        let { display } = this.state;
        display = !this.props.isNew;
        this.setState({
            display,
            rule: _rule,
        }, () => {
            this.sortRuleJson(this.state.rule);
        });
    }

    sortScopeLst(scopeLst) {
        if (scopeLst === undefined || scopeLst.length === 0) {
            return [
                {
                    count: null, // 需购买份数
                    flag: 0, // 按菜品还是按分类
                    scopeLst: [], // 选择的菜品信息
                    validateStatus: 'success', // 验证信息
                    msg: SALE_LABEL.k5hkj0xq, // 错误信息
                },
                {
                    count: null, // 需购买份数
                    flag: 0, // 按菜品还是按分类
                    scopeLst: [], // 选择的菜品信息
                    validateStatus: 'success', // 验证信息
                    msg: SALE_LABEL.k5hkj0xq, // 错误信息
                },
            ];
        }
        const data = [];
        scopeLst.map((scope) => {
            if (!data[scope.stageNo]) {
                data[scope.stageNo] = {
                    count: null, // 需购买份数
                    flag: 0, // 按菜品还是按分类
                    scopeLst: [], // 选择的菜品信息
                    validateStatus: 'success', // 验证信息
                    msg: SALE_LABEL.k5hkj0xq, // 错误信息
                };
            }
            data[scope.stageNo].count = scope.num;
            data[scope.stageNo].flag = scope.scopeType === '2' ? 1 : 0;
            // 旧数据没有brandID 默认给0 表示全集团可用
            data[scope.stageNo].scopeLst.push({
                ...scope,
                brandID: scope.brandID ? `${scope.brandID}` : '0',
            });
        })
        return data;
    }

    sortRuleJson(rule) {
        if (rule === undefined) {
            return
        }
        const conditions = [];
        rule.stage.map((ruleStage, index) => {
            if (!conditions[index]) {
                conditions[index] = {
                    groupCount: [], // 满足组合数
                    flag: '0', // 按减免还是折扣
                    cut: '', // 减免金额
                    discount: '', // 折扣率
                    groupCountStatus: 'success', // 验证信息
                    cutStatus: 'success', // 验证信息
                    discountStatus: 'success', // 验证信息
                    cutToStatus: 'success', // 验证信息
                };
            }
            conditions[index].groupCount = ruleStage.combineStageNo;
            conditions[index].flag = String(ruleStage.disType - 1); //减至disType=3 折扣=2，减免=1 对应前端 2 1 0
            conditions[index].cut = ruleStage.freeAmount;
            conditions[index].discount = ruleStage.discountRate;
        })
        this.setState({ conditions })
    }

    handleSubmit() {
        let nextFlag = true;
        const { data, conditions } = this.state;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                nextFlag = false;
            } else {
                data.map((value, idx) => {
                    if (value.scopeLst.length == 0) {
                        const foodIdx = `food${idx}`;
                        this.props.form.setFields({
                            [foodIdx]: {
                                value: {},
                                errors: [new Error(SALE_LABEL.k5hkj1ef)],
                            },
                        });
                        nextFlag = false;
                    }
                })
            }
        })
        let scopeLst = [],
            rule = {
                stageType: 2,
                stage: [

                ],
            };
        const countStr = conditions.map((condition) => {
            return condition.groupCount.sort().toString();
        });
        let conditionsFlag = true;
        for (let i = 0; i < countStr.length; i++) {
            for (let j = i + 1; j < countStr.length; j++) {
                if (countStr[i] == countStr[j]) {
                    nextFlag = false;
                    conditionsFlag = false;
                    // message.warning('组合条件不能重复!');
                }
            }
        }
        if (!conditionsFlag) {
            message.warning(SALE_LABEL.k5hkj162);
        }
        data.forEach((dishInfo, dishIdx) => {
            // 校验
            if (dishInfo.count == null || dishInfo.count == '') {
                dishInfo.validateStatus = 'error';
                nextFlag = false;
            }
            // 拼出菜品scopeLst
            dishInfo.scopeLst.forEach((dish) => {
                dish.stageNo = dishIdx;
                dish.num = dishInfo.count;
                scopeLst.push(dish);
            })
        });
        let groupCountFlag = true;
        conditions.forEach((condition) => {
            // 校验
            if (condition.flag == '1' && (condition.discount == null || condition.discount == '' || condition.discount > 100)) {
                condition.discountStatus = 'error';
                nextFlag = false;
            }
            if (condition.flag == '0' && (condition.cut == null || condition.cut == '')) {
                condition.cutStatus = 'error';
                nextFlag = false;
            }

            if (condition.flag == '2' && (condition.cut == null || condition.cut == '')) {
                condition.cutToStatus = 'error';
                nextFlag = false;
            }

            if (condition.groupCount.length < 2) {
                // message.warning('至少选择两个组合条件!');
                groupCountFlag = false;
                nextFlag = false;
            }
        });
        if (!groupCountFlag) {
            message.warning(this.props.intl.formatMessage(SALE_STRING.k5hkj1mr));
        }
        if (nextFlag) {
            // 拼出ruleJson
            conditions.forEach((condition) => {
                if (condition.flag == '0') {
                    rule.stage.push({
                        disType: 1,
                        combineStageNo: condition.groupCount,
                        freeAmount: condition.cut,
                    })
                } else if (condition.flag == '2') {
                    rule.stage.push({
                        disType: 3,
                        combineStageNo: condition.groupCount,
                        freeAmount: condition.cut,
                    })
                } else {
                    rule.stage.push({
                        disType: 2,
                        combineStageNo: condition.groupCount,
                        discountRate: condition.discount,
                    })
                }
            });

            this.props.setPromotionDetail({
                rule,
                scopeLst,
            });
        } else {
            this.setState({ conditions, data });
        }

        return nextFlag
    }

    onChangeClick = () => {
        this.setState(
            { display: !this.state.display }
        )
    };
    // 新增组合
    addGroup() {
        const { data } = this.state;
        data.push(
            {
                count: '', // 需购买份数
                flag: 0, // 按菜品还是按分类
                scopeLst: [], // 选择的菜品信息
                validateStatus: 'success', // 验证信息
                msg: SALE_LABEL.k5hkj0xq, // 错误信息
            },
        );
        this.setState({ data });
    }
    // 删除组合
    deleteGroup(idx) {
        const { data, conditions } = this.state;
        data.splice(idx, 1);
        // 删除组合 的时候,如果条件的个数多余组合个数,删除最后一个条件
        // 组合只有2 和3 4时  没必要算排列组合

        /* let count = 1;
        for (let i = 2; i < this.state.data.length; i++) {
            count += this.getFlagArrs(this.state.data.length, i);
        }
        if (count + 1 < conditions.length) {
            conditions.length = count;
        } */
        if (data.length === 2) {
            conditions.length = 1;
            conditions.forEach(item => {
                item.groupCount = (item.groupCount || []).filter(num => num < 2)
            })
        } else if (data.length === 3 && conditions.length > 4) {
            conditions.length = 4;
            conditions.forEach(item => {
                item.groupCount = (item.groupCount || []).filter(num => num < 3)
            })
        }
        this.setState({ data, conditions });
    }
    // 新建条件
    addCondition() {
        const { conditions } = this.state;
        conditions.push(
            {
                groupCount: [], // 满足组合数
                flag: '0', // 按减免还是折扣
                cut: '', // 减免金额
                discount: '', // 折扣率
                groupCountStatus: 'success', // 验证信息
                cutStatus: 'success', // 验证信息
                discountStatus: 'success', // 验证信息
                cutToStatus: 'success', // 验证信息
            }
        );
        this.setState({ conditions });
    }
    // 删除条件
    deleteCondition(idx) {
        const { conditions } = this.state;
        conditions.splice(idx, 1);
        this.setState({ conditions });
    }

    renderAdvancedSettingButton() {
        return (

            <FormItem className={[styles.FormItemStyle, styles.formItemForMore].join(' ')} wrapperCol={{ span: 17, offset: 4 }} >
                <span className={styles.gTip}>{SALE_LABEL.k5ezdwpv}</span>
                <span className={styles.gDate} onClick={this.onChangeClick}>
                {SALE_LABEL.k5ezdx9f} {!this.state.display && <Iconlist className="down-blue" iconName={'down'} width="13px" height="13px" />}
                    {this.state.display && <Iconlist className="down-blue" iconName={'up'} width="13px" height="13px" />}
                </span>
            </FormItem>
        )
    }
    // 组合菜品数change
    handleCountChange(idx, val) {
        const { data } = this.state;
        if (val.number == '' || val.number == null) {
            data[idx].validateStatus = 'error';
        } else {
            data[idx].validateStatus = 'success';
        }
        data[idx].count = val.number;
        this.setState({ data });
    }
    // 条件菜品数change
    handleGroupCountChange(idx, val) {
        const { conditions } = this.state;
        if (val.length < 2) {
            conditions[idx].groupCountStatus = 'error';
        } else {
            conditions[idx].groupCountStatus = 'success';
        }
        conditions[idx].groupCount = val;
        this.setState({ conditions });
    }
    // 减免金额change
    handleCutChange(idx, val) {
        const { conditions } = this.state;
        conditions[idx].cut = val.number;
        if (conditions[idx].flag == '0' && (val.number == '' || val.number == null)) {
            conditions[idx].cutStatus = 'error';
        } else {
            conditions[idx].cutStatus = 'success';
        }
        this.setState({ conditions });
    }

    // 减至金额change
    handleCutToChange(idx, val) {
        const { conditions } = this.state;
        conditions[idx].cut = val.number;
        if (conditions[idx].flag == '2' && (val.number == '' || val.number == null)) {
            conditions[idx].cutToStatus = 'error';
        } else {
            conditions[idx].cutToStatus = 'success';
        }
        this.setState({ conditions });
    }
    // 折扣率change
    handleDiscountChange(idx, val) {
        const { conditions } = this.state;
        conditions[idx].discount = val.number;
        if (conditions[idx].flag == '1' && (val.number == '' || val.number == null || val.number > 100)) {
            conditions[idx].discountStatus = 'error';
        } else {
            conditions[idx].discountStatus = 'success';
        }
        this.setState({ conditions });
    }

    handleRadioChange(idx, e) {
        const { conditions } = this.state;
        conditions[idx].flag = e;
        if (e == '0') {
            conditions[idx].discountStatus = 'success';
            conditions[idx].cutToStatus = 'success';
        } else if (e == '1') {
            conditions[idx].cutStatus = 'success';
            conditions[idx].cutToStatus = 'success';
        } else {
            conditions[idx].cutStatus = 'success';
            conditions[idx].discountStatus = 'success';
        }
        this.setState({ conditions });
    }

    handlePromotionSetting(idx, val) {
        const { data } = this.state;
        data[idx].flag = val.categoryOrDish;
        data[idx].scopeLst = [];
        if (val.foodCategory !== null) {
            val.foodCategory.map((item) => {
                data[idx].scopeLst.push({
                    scopeType: '1',
                    targetID: item.foodCategoryID,
                    brandID: item.brandID,
                    targetCode: item.foodCategoryKey,
                    targetName: item.foodCategoryName,
                });
            });
        }

        if (val.excludeDishes !== null) {
            val.excludeDishes.map((item) => {
                data[idx].scopeLst.push({
                    scopeType: '4',
                    targetID: item.itemID,
                    brandID: item.brandID,
                    targetCode: item.foodKey,
                    targetName: item.foodName,
                    targetUnitName: item.unit,
                });
            });
        }

        if (val.dishes !== null) {
            val.dishes.map((item) => {
                data[idx].scopeLst.push({
                    scopeType: '2',
                    targetID: item.itemID,
                    brandID: item.brandID,
                    targetCode: item.foodKey,
                    targetName: item.foodName,
                    targetUnitName: item.unit,
                });
            });
        }
        this.setState({ data });
    }

    renderPromotionSetting() {
        const { isShopFoodSelectorMode } = this.props;
        const { intl } = this.props;
        const k5hkj1v3 = intl.formatMessage(SALE_STRING.k5hkj1v3);
        const k5gfsuon = intl.formatMessage(SALE_STRING.k5gfsuon);
        return (
            this.state.data.map((item, idx) => {
                const count = item.count;
                return (
                    <Form style={{ margin: '0 0 30px 10px' }}>
                        <FormItem
                            key={`group${idx}`}
                            label={`${k5hkj1v3}${idx + 1}`}
                            className={[styles.FormItemStyle, styles.inputWrappers].join(' ')}
                            style={{ padding: '0' }}
                            wrapperCol={{ span: 17 }}
                            labelCol={{ span: 4 }}
                            validateStatus={item.validateStatus}
                            help={item.validateStatus == 'success' ? null : item.msg}
                        >
                            <div className={styles.inputWrapper}>
                                <span>{SALE_LABEL.k5hkj23f}</span>
                                <PriceInput
                                    key={`price${idx}`}
                                    type="text"
                                    modal="int"
                                    value={{ number: count }}
                                    onChange={(val) => {
                                        this.handleCountChange(idx, val);
                                    }}
                                />
                                <span>{k5gfsuon}</span>
                                {this.renderGroupIcon(idx)}

                            </div>
                        </FormItem>
                        <FormItem
                            key={`food${idx}`}
                            style={{ padding: '0', marginBottom: '16px', marginTop: '-6px' }}
                            className={styles.forErrorExplain}
                        >
                            {
                                this.props.form.getFieldDecorator(`food${idx}`, {})(
                                    isShopFoodSelectorMode ? (
                                        <CategoryAndFoodSelectorForShop
                                            /**
                                             * val: {
                                             *  categoryOrDish: 0 | 1,
                                             *  foodCategory: [],
                                             *  dishes: [],
                                             *  excludeDishes: [],
                                             * }
                                             */
                                            scopeLst={item.scopeLst}
                                            onChange={(val) => {
                                                this.handlePromotionSetting(idx, val)
                                            }}
                                        />
                                    )
                                    : (
                                        <CategoryAndFoodSelector
                                            /**
                                             * val: {
                                             *  categoryOrDish: 0 | 1,
                                             *  foodCategory: [],
                                             *  dishes: [],
                                             *  excludeDishes: [],
                                             * }
                                             */
                                            scopeLst={item.scopeLst}
                                            onChange={(val) => {
                                                this.handlePromotionSetting(idx, val)
                                            }}
                                        />
                                    )
                                )
                            }
                        </FormItem>
                    </Form>

                )
            })
        )
    }
    // 排列组合
    getFlagArrs(m, n) {
        if (!n || n < 1) {
            return 0;
        }

        let resultArrs = [],
            flagArr = [],
            isEnd = false,
            leftCnt;

        for (let i = 0; i < m; i++) {
            flagArr[i] = i < n ? 1 : 0;
        }

        resultArrs.push(flagArr.concat());

        while (!isEnd) {
            leftCnt = 0;
            for (let k = 0; k < m; k++) {
                if (flagArr[k] == 1 && flagArr[k + 1] == 0) {
                    for (let j = 0; j < k; j++) {
                        flagArr[j] = j < leftCnt ? 1 : 0;
                    }
                    flagArr[k] = 0;
                    flagArr[k + 1] = 1;
                    const aTmp = flagArr.concat();
                    resultArrs.push(aTmp);
                    if (aTmp.slice(-n).join('').indexOf('0') == -1) {
                        isEnd = true;
                    }
                    break;
                }
                flagArr[k] == 1 && leftCnt++;
            }
        }

        return resultArrs.length;
    }

    renderConditions() {
        const { intl } = this.props;
        const k5ezdbiy = intl.formatMessage(SALE_STRING.k5ezdbiy);
        const k5hkj1v3 = intl.formatMessage(SALE_STRING.k5hkj1v3);
        const options = this.state.data.map((dataItem, dataIndex) => {
            return {
                label: `${k5hkj1v3}${dataIndex + 1}`,
                value: dataIndex,
            }
        });
        return (
            this.state.conditions.map((item, idx) => {
                return (
                    <div key={`${idx}`} className={styles.moreFormItem}>
                        <Col span={10} offset={3}>
                            <li className={checkStyle.checkBoxStyles}>
                                <FormItem>
                                    <CheckboxGroup
                                        value={item.groupCount}
                                        options={options}
                                        onChange={(val) => {
                                            this.handleGroupCountChange(idx, val);
                                        }}
                                    />
                                </FormItem>
                            </li>
                        </Col>
                        <Col span={9}>
                            <FormItem className={styles.radioInLine}>
                                <ButtonGroup size="small" >
                                    <Button  value="0" type={item.flag == '0' ? 'primary' : 'default'} onClick={(e) => { this.handleRadioChange(idx, '0') }}>{SALE_LABEL.k5ezcd0f}</Button>
                                    <Button  value="2" type={item.flag == '2' ? 'primary' : 'default'} onClick={(e) => { this.handleRadioChange(idx, '2') }}>{SALE_LABEL.k5hkj2k3}</Button>
                                    <Button  value="1" type={item.flag == '1' ? 'primary' : 'default'} onClick={(e) => { this.handleRadioChange(idx, '1') }}>{SALE_LABEL.k5ezcu1b}</Button>
                                </ButtonGroup>
                                <FormItem validateStatus={item.flag == '0' ? item.cutStatus : item.flag == '1' ? item.discountStatus : item.cutToStatus} style={{ paddingTop: '0px' }}>
                                    {
                                        item.flag == '0' &&
                                            <PriceInput
                                                addonAfter={k5ezdbiy}
                                                key={`cut${idx}`}
                                                type="text"
                                                modal="float"
                                                value={{ number: item.cut }}
                                                onChange={(val) => {
                                                    this.handleCutChange(idx, val);
                                                }}
                                            /> }
                                    {
                                        item.flag == '2' &&
                                            <PriceInput
                                                addonAfter={k5ezdbiy}
                                                key={`cut${idx}`}
                                                type="text"
                                                modal="float"
                                                value={{ number: item.cut }}
                                                onChange={(val) => {
                                                    this.handleCutToChange(idx, val);
                                                }}
                                            /> }
                                    {
                                        item.flag == '1' &&
                                            <PriceInput
                                                addonAfter="%"
                                                key={`discunt${idx}`}
                                                type="text"
                                                modal="float"
                                                value={{ number: item.discount }}
                                                onChange={(val) => {
                                                    this.handleDiscountChange(idx, val);
                                                }}
                                            />
                                    }
                                </FormItem>
                                {this.renderConditionIcon(idx)}
                            </FormItem>
                        </Col>
                    </div>
                )
            })

        )
    }
    // 组合 + -图标
    renderGroupIcon(idx) {
        if (idx == 1 && this.state.data.length == 2) {
            return (
                <span className={styles.iconsLeftStyle}>
                    <Icon className={styles.pulsIcon} disabled={false} type="plus-circle-o" onClick={this.addGroup} />
                </span>
            );
        } else if (this.state.data.length > 2 && this.state.data.length < 4 && idx == this.state.data.length - 1) {
            return (
                <span className={styles.iconsLeftStyle}>
                    <Icon className={styles.pulsIcon} disabled={false} type="plus-circle-o" onClick={this.addGroup} />
                    <Icon
                        className={styles.deleteIcon}
                        type="minus-circle-o"
                        onClick={() => {
                            this.deleteGroup(idx)
                        }}
                    />
                </span>
            );
        } else if (idx == 3 && this.state.data.length == 4) {
            return (
                <span className={styles.iconsLeftStyle}>
                    <Icon
                        className={styles.deleteIcon}
                        type="minus-circle-o"
                        onClick={() => {
                            this.deleteGroup(idx)
                        }}
                    />
                </span>
            );
        }
        return null;
    }

    // 条件 + -图标
    renderConditionIcon(idx) {
        let count;
        switch (this.state.data.length) {
            case 2: count = 1; break;
            case 3: count = 4; break;
            case 4: count = 11; break;
            default: count = 11; break;
        }
        if (idx == 0 && this.state.conditions.length == 1 && this.state.conditions.length < count) {
            return (
                <span className={styles.iconsGroupStyle}>
                    <Icon className={styles.pulsIcon} disabled={false} type="plus-circle-o" onClick={this.addCondition} />
                </span>
            );
        } else if (this.state.conditions.length > 1 && idx == this.state.conditions.length - 1 && count > this.state.conditions.length) {
            return (
                <span className={styles.iconsGroupStyle}>
                    <Icon className={styles.pulsIcon} disabled={false} type="plus-circle-o" onClick={this.addCondition} />
                    <Icon
                        className={styles.deleteIcon}
                        type="minus-circle-o"
                        onClick={() => {
                            this.deleteCondition(idx)
                        }}
                    />
                </span>
            );
        } else if (this.state.conditions.length > 1 && idx == this.state.conditions.length - 1 && count == this.state.conditions.length) {
            return (
                <span className={styles.iconsGroupStyle}>
                    <Icon
                        className={styles.deleteIcon}
                        type="minus-circle-o"
                        onClick={() => {
                            this.deleteCondition(idx)
                        }}
                    />
                </span>
            );
        }
        return null;
    }

    render() {
        const { intl } = this.props;
        const k5hkj1v3 = intl.formatMessage(SALE_STRING.k5hkj1v3);
        return (
            <div>
                <Form className={[styles.FormStyle, styles.bugGive].join(' ')}>
                    {this.renderPromotionSetting()}
                    <Row>
                        <Col span={5} offset={2}>
                            {k5hkj1v3}:
                            <CloseableTip
                                style={{
                                    position: 'absolute',
                                    right: '64px',
                                    top: '-2px'
                                }}
                                content={
                                    <div>
                                <p style={{ textIndent: '2em' }}>1、{SALE_LABEL.k5hl5wkk}</p>
                                        <br/>
                                        <p style={{ textIndent: '2em' }}>2、{SALE_LABEL.k5hl5wsw}</p>
                                        <br/>
                                        <p>{SALE_LABEL.k5hl5x18}</p>
                                    </div>
                                }
                                customStyle={{ top: -275, left: 56 }}
                            />
                        </Col>

                    </Row>
                    {this.renderConditions()}
                    {this.renderAdvancedSettingButton()}
                    {this.state.display ? <AdvancedPromotionDetailSetting payLimit={false} /> : null}
                </Form>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        isShopFoodSelectorMode: state.sale_promotionDetailInfo_NEW.get('isShopFoodSelectorMode'),
        user: state.user,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setPromotionDetail: (opts) => {
            dispatch(saleCenterSetPromotionDetailAC(opts))
        },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form.create()(CompositeDetailInfo));
