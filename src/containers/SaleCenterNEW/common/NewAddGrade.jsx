/**
 * @Author: chenshuang
 * @Date:   2017-04-01T11:02:34+08:00
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-08T15:15:07+08:00
 */


import React, { Component } from 'react'
import { connect } from 'react-redux';

import {
    Row,
    Col,
    Radio,
    Form,
} from 'antd';
import styles from '../AthActivitiesPage.less';
import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import PriceInput from '../../../containers/SaleCenterNEW/common/PriceInput';
import ConnectedPriceListSelector from '../common/ConnectedPriceListSelector';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from '../IntlDecor';

const FormItem = Form.Item;

@injectIntl()
class NewAddGrade extends React.Component {
    constructor(props) {
        super(props);
        this.uuid = 0;
        this.state = {
            flag: {
                0: '0',
                1: '0',
                2: '0',
            },
            selectedDishes: [],
            data: this.props.value || {
                0: {
                    stageAmount: '',
                    giftType: '0',
                    dishes: [],
                    giftName: null,
                    foodCount: '',
                    foodCountFlag: true,
                    dishesFlag: true,
                    StageAmountFlag: true,
                },
            },
            // TODO:赠送份数没校验
            foodCountFlag: this.props.foodCountFlag || true,
        }
        this.allData = {};
        this.onStageAmountChange = this.onStageAmountChange.bind(this);
        this.onFoodCountChange = this.onFoodCountChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.foodCountFlag != nextProps.foodCountFlag) {
            this.setState({
                foodCountFlag: nextProps.foodCountFlag,
            })
        }
        if (this.props.ruleType != nextProps.ruleType) { // 活动方式改变
            //初始化数据
            this.initALot();
            //初始化数据
            if (nextProps.ruleType !== '2' && nextProps.ruleType !== '3') {
                this.uuid = 0;
                const { form } = this.props;
                form.setFieldsValue({
                    keys: [0],
                });
            } else {
                this.uuid = Object.keys(nextProps.value).length - 1;
                const { form } = this.props;
                form.setFieldsValue({
                    keys: Object.keys(nextProps.value),
                });
            }
        }
        if (this.props.value != nextProps.value) {
            this.setState({
                data: nextProps.value,
            })
        }
    }
    initALot = () => {
        this.allData = {};
        this.onStageAmountChange = this.onStageAmountChange.bind(this);
        this.onFoodCountChange = this.onFoodCountChange.bind(this);
        this.uuid = 0;
        this.setState({
            flag: {
                0: '0',
                1: '0',
                2: '0',
            },
            selectedDishes: [],
            // data: this.props.value || {
            data: {
                0: {
                    stageAmount: '',
                    giftType: '0',
                    dishes: [],
                    giftName: null,
                    foodCount: '',
                    foodCountFlag: true,
                    dishesFlag: true,
                    StageAmountFlag: true,
                },
            },
            // TODO:赠送份数没校验
            foodCountFlag: this.props.foodCountFlag || true,
        })
    }

    onDishesChange(value, k) {
        const { data } = this.state;
        if (value.length == 0) {
            data[k].dishesFlag = false;
        } else {
            data[k].dishesFlag = true;
        }
        // save to redux
        data[k].dishes = value;
        data[k].giftName = value.foodName;
        this.setState({ data });
        this.props.onChange && this.props.onChange(data);
    }

    renderDishsSelectionBox(k) {
        return (
            <FormItem
                validateStatus={this.state.data[k] ? this.state.data[k].dishesFlag ? 'success' : 'error' : 'success'}
                help={ this.state.data[k] ? this.state.data[k].dishesFlag ? null : SALE_LABEL.k5hly0bq : null}
            >   
                <ConnectedPriceListSelector
                    background={'#FFFFFFFF'}
                    isShopMode={this.props.isShopFoodSelectorMode}
                    onChange={(value) => {
                        this.onDishesChange(value, k);
                    }}
                />
            </FormItem>

        )
    }

    // 删除一个档次
    remove = (k) => {
        const { data } = this.state;
        delete data[this.uuid];
        this.setState({ data });
        this.props.onChange && this.props.onChange(data);
        this.uuid--;
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        if (keys.length === 1) {
            return;
        }
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    }

    // 新增一个档次
    add = () => {
        this.uuid++;
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(this.uuid);
        form.setFieldsValue({
            keys: nextKeys,
        });
        const { data } = this.state;
        data[this.uuid] = {
            stageAmount: '',
            giftType: '0',
            dishes: [],
            giftName: null,
            foodCount: '',
            foodCountFlag: true,
            dishesFlag: true,
            StageAmountFlag: true,
        };
        this.setState({ data });
        this.props.onChange && this.props.onChange(data);
    }

    onStageAmountChange(value, index) {
        const { data } = this.state;
        data[index].stageAmount = value.number;
        if (!value.number || value.number <= 0) {
            data[index].StageAmountFlag = false;
        } else {
            data[index].StageAmountFlag = true;
        }
        this.setState({ data });
        this.props.onChange && this.props.onChange(data);
    }

    onFoodCountChange(value, index) {
        const { data } = this.state;
        if (value.number == '' || value.number == null) {
            data[index].foodCountFlag = false
        } else {
            data[index].foodCountFlag = true
        }
        data[index].foodCount = value.number;
        this.setState({ data });
        this.props.onChange && this.props.onChange(data);
    }

    render() {
        const { intl } = this.props;
        const k5ez4qy4 = intl.formatMessage(SALE_STRING.k5ez4qy4);
        const k5ezdbiy = intl.formatMessage(SALE_STRING.k5ezdbiy);
        const k5koal03 = intl.formatMessage(SALE_STRING.k5koal03);
        const k5ez4pvb = intl.formatMessage(SALE_STRING.k5ez4pvb);
        const k5ez4qew = intl.formatMessage(SALE_STRING.k5ez4qew);
        const k5m3on0k = intl.formatMessage(SALE_STRING.k5m3on0k);

        // TODO:initialValue
        const { getFieldDecorator, getFieldValue } = this.props;
        // 满赠取消分档
        const { data } = this.state;
        const isFullGive = this.props.promotionBasicInfo.get('$basicInfo').toJS().promotionType == '1030';
        getFieldDecorator('keys', { initialValue: Object.keys(this.state.data) });
        // const keys = isFullGive ? [0] : getFieldValue('keys');
        let keys = getFieldValue('keys');
        console.log("the current length is" + Object.keys(data).length);
        // if(Object.keys(data).length == 1){
        //     keys=['0'];
        // }
        const formItems = keys.map((k, index) => {
            const temp = this.props.ruleType;
            return (
                <div className={styles.addGrade} key={index}>
                    <div className={styles.CategoryTop}>
            <span className={styles.CategoryTitle}>{SALE_LABEL.k5m3oms8}{this.props.ruleType == 2||this.props.ruleType == 3 ?parseInt(k)+1:null}</span>
                        {// 显示的可操作文字
                            this.props.ruleType == 2 || this.props.ruleType == 3 ? // 满
                (k == this.uuid ? (
                    k == 0 ? (// 满 第一个档次,//满赠取消分档
                        <span className={styles.CategoryAdd} onClick={this.add}>点击添加档位</span>
                    ) : (
                        k == 2 ? (
                            <span className={styles.CategoryDelete} onClick={() => this.remove(k)}>{ COMMON_LABEL.delete }</span>
                        ) : (// 满 非第一个档次
                            <span>
        <span className={styles.CategoryAdd} onClick={this.add}>点击添加档位</span>
                                <span className={styles.CategoryDelete} onClick={() => this.remove(k)}>{ COMMON_LABEL.delete }</span>
                            </span>
                        )
                    )
                ) : null) : null

                        }
                    </div>
                    <div className={styles.CategoryBody}>
                        <Row>
                            <Col span={15} style={{position: 'relative', left: -10}}>
                                {
                                    this.props.ruleType != '0' ?
                                        <FormItem
                                            className={styles.FormItemStyle}
                                            validateStatus={this.state.data[k] ? this.state.data[k].StageAmountFlag ? 'success' : 'error' : 'success'}
                                            help={this.state.data[k] ? this.state.data[k].StageAmountFlag ? null : SALE_LABEL.k5f4b1b9 : null}
                                        >
                                            <span className={styles.speSpan}>
                                                {
                                                    this.props.ruleType == '2' ? k5koal03 :
                                                    this.props.ruleType == '1' ? k5m3on0k :
                                                    this.props.ruleType == '3' ? k5ez4pvb : k5ez4qew
                                                }
                                            </span>
                                            <PriceInput
                                                addonAfter={k5ezdbiy}
                                                onChange={(val) => { this.onStageAmountChange(val, index) }}
                                                value={{ number: this.state.data[k] ? this.state.data[k].stageAmount : '' }}
                                                modal="float"
                                            />
                                        </FormItem> : null
                                }
                            </Col>
                            <Col span={this.props.ruleType == '0' ? 24 : 7} offset={this.props.ruleType == '0' ? 0 : 1} style={{position: 'relative', left: 10}}>
                                <FormItem
                                    className={[styles.FormItemStyle, styles.priceInputSingle].join(' ')}
                                    validateStatus={this.state.data[k] ? this.state.data[k].foodCountFlag ? 'success' : 'error' : 'success'}
                                    help={this.state.data[k] ? this.state.data[k].foodCountFlag ? null : SALE_LABEL.k5hly03e : null}
                                >
                                    <span className={styles.speSpan}>{this.props.ruleType == '0' ? SALE_LABEL.k5g5bcic : SALE_LABEL.k5kn0bn5}</span>
                                    <PriceInput
                                        addonAfter={k5ez4qy4}
                                        onChange={(val) => { this.onFoodCountChange(val, index) }}
                                        value={{ number: this.state.data[k] ? this.state.data[k].foodCount : '' }}
                                        modal="int"
                                    />
                                </FormItem>
                            </Col>
                        </Row>
                        {/* <div >
                            <FormItem required={true}>
                            <span className={styles.spanText}>{SALE_LABEL.k5hly0bq}</span>
                            </FormItem>
                        </div> */}
                        <div >
                            <div className={styles.CategoryList} style={{ marginBottom: 0 }}>
                                <div className={styles.whiteBox}></div>
                                {this.renderDishsSelectionBox(k)}
                            </div>
                        </div>
                    </div>
                </div>
            );
        });


        return (
            <div>
                {formItems}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        promotionBasicInfo: state.sale_promotionBasicInfo_NEW,
        isShopFoodSelectorMode: state.sale_promotionDetailInfo_NEW.get('isShopFoodSelectorMode'),
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setPromotionDetail: (opts) => {
            dispatch(saleCenterSetPromotionDetailAC(opts))
        },
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(NewAddGrade);
