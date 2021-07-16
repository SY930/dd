/**
 * @Author: ZBL
 * @Date:   2017-03-02T11:12:25+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: FullCutContent.jsx
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-07T13:52:34+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */

import React, { Component } from 'react'
import { Row, Col, Form, Select, Radio, Input, InputNumber, Tooltip, Icon, Button, message } from 'antd';
import { connect } from 'react-redux'

import styles from '../ActivityPage.less';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont'; // 引入icon图标组件库
import PriceInput from '../common/PriceInput';
import AdvancedPromotionDetailSetting from '../common/AdvancedPromotionDetailSetting';
import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import ConnectedScopeListSelector from '../common/ConnectedScopeListSelector';
import ConnectedPriceListSelector from '../common/ConnectedPriceListSelector'
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import { injectIntl } from '../IntlDecor';

const FormItem = Form.Item;
const Option = Select.Option;
const Immutable = require('immutable');

@injectIntl()
class WeighBuyGiveDetailInfo extends React.Component {
    constructor(props) {
        super(props);
        this.defaultRun = '0';
        this.state = {
            display: false,
            stageAmount: ['', '', '', '', '', ''],
            giveFoodCount: ['', '', '', '', '', ''],
            dishes: [],
            targetScope: 0,
            stageAmountFlag: [true, true, true, true, true],
            stageType: 2,
            giveFoodCountFlag: [true, true, true, true, true],
            dishsSelectStatus: 'success',
            ifMultiGrade: true,
            foodRuleList: this.props.promotionDetailInfo.getIn(['$promotionDetail', 'foodRuleList']).toJS(),
            index: 'not-important',
            data: [
                {
                    stageAmount: '',
                    freeAmount: '',
                    stageAmountFlag: true,
                    freeAmountFlag: true,
                },
            ],
            priceList: [],
            priceListFlag: [true, true, true, true, true],
            scopeLst: [],
            scopeLstFlag: [true, true, true, true, true],
            floatDown: ['', '', '', '', '', ''],
            floatUp: ['', '', '', '', '', ''],
            floatDownFlag: [true, true, true, true, true],
            floatUpFlag: [true, true, true, true, true],
            level: ['1'],
            stageMeasurment: [1, 1, 1, 1, 1],
        };
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
        // 这边对数据进行解析设置priceList,scopeList
        const ifHasFoodRuleList = this.props.promotionDetailInfo.getIn(['$promotionDetail']).toJS()
        console.log('WeighBuyGiveDetailInfo ifHasFoodRuleList', ifHasFoodRuleList)
        if (ifHasFoodRuleList.foodRuleList && ifHasFoodRuleList.foodRuleList.length) {
            // const newPriceList = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'foodRuleList']).toJS()[0].priceList
            const newPriceList = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'foodRuleList']).toJS().reduce((arr, item) => {
                return arr.concat([item.priceList])
            }, [])
            const newScopeLst = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'foodRuleList']).toJS().reduce((arr, item) => {
                return arr.concat([item.scopeList])
            }, [])
            let length = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'foodRuleList']).toJS().length
            let newLevel = []
            for (let i = 0; i < length; i++) {
                newLevel.push('1')
            }
            const newRule = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'foodRuleList']).toJS().reduce((arr, item) => {
                return arr.concat(JSON.parse(item.rule))
            }, [])
            const newStageAmount = newRule.map((item, index) => {
                return item.stageAmount ? item.stageAmount : ''
            })
            const newGiveFoodCount = newRule.map((item, index) => {
                return item.giveFoodCount ? item.giveFoodCount : ''
            })
            const newFloatUp = newRule.map((item, index) => {
                return item.floatUp ? item.floatUp : ''
            })
            const newFloatDown = newRule.map((item, index) => {
                return item.floatDown ? item.floatDown : ''
            })
            const newStageMeasurment = newRule.map((item, index) => {
                return item.stageMeasurment ? item.stageMeasurment : 1
            })
            this.setState({
                priceList: newPriceList,
                scopeLst: newScopeLst,
                level: newLevel,
                stageAmount: newStageAmount,
                stageMeasurment: newStageMeasurment,
                giveFoodCount: newGiveFoodCount,
                floatUp: newFloatUp,
                floatDown: newFloatDown,
                stageType: newRule[0].stageType ? newRule[0].stageType : 2
            })
        }
        // if (ifHasFoodRuleList.scopeLst && ifHasFoodRuleList.scopeLst.length) {

        // }
        // 根据ruleJson填充页面
        this.setState({
            display,
            // stageType: _rule.stageType ? _rule.stageType : 2,
            // stageAmount: _rule.stage ? _rule.stage[0].stageAmount : ['', '', '', '', '', ''],
            // giveFoodCount: _rule.stage ? _rule.stage[0].giveFoodCount : ['', '', '', '', '', ''],
            // floatUp: _rule.stage ? _rule.stage[0].floatUp : ['', '', '', '', '', ''],
            // floatDown: _rule.stage ? _rule.stage[0].floatDown : ['', '', '', '', '', ''],
        });
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.promotionDetailInfo.getIn(['$promotionDetail', 'categoryOrDish']) !=
            nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'categoryOrDish'])) {
            this.setState({ targetScope: nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'categoryOrDish']) });
        }
    }
    changePriceListFlag = (flag = true, index) => {
        const { priceListFlag } = this.state
        priceListFlag[index] = flag
        this.setState({
            priceListFlag,
        })
    }
    changeScopeLstFlag = (flag = true, index) => {
        const { scopeLstFlag } = this.state
        scopeLstFlag[index] = flag
        this.setState({
            scopeLstFlag,
        })
    }
    isNewOrOldData = () => {
        let _rule = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
        if (_rule === null || _rule === undefined) {
            return [
                {
                    rule: {
                        stageAmount: '',
                        giveFoodCount: '',
                        stageType: '2',
                        stageNum: 0,
                    },
                    priceList: [],
                    scopeList: [],
                }
            ];
        }
        _rule = Immutable.Map.isMap(_rule) ? _rule.toJS() : _rule;
        _rule = Object.assign({}, _rule);
        const tempArr = [
            {
                rule: {
                    stageAmount: _rule.stage ? _rule.stage[0].stageAmount : '',
                    giveFoodCount: _rule.stage ? _rule.stage[0].giveFoodCount : '',
                    stageType: _rule.stageType ? _rule.stageType : 2,
                    stageNum: 0,
                    StageAmountFlag: _rule.stage[0].stageAmount ? true : false,
                },
                priceList: this.props.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']).toJS(),
                scopeList: [],
            }
        ];
        return tempArr;
    }
    initData = (data) => {
        data.map((item) => {
            item.rule = JSON.parse(item.rule);
            return item;
        })
        return data;
    }

    handleSubmit = () => {
        let {
            stageAmount,
            stageType,
            giveFoodCount,
            targetScope,
            stageAmountFlag,
            giveFoodCountFlag,
            floatDown,
            floatUp,
            floatDownFlag,
            floatUpFlag,
            scopeLstFlag,
            priceListFlag,
            scopeLst,
            priceList,
            level,
            stageMeasurment,
        } = this.state;
        let flag = true;
        for (let i = 0; i < level.length; i++) {
            if (stageAmount[i] == null || stageAmount[i] == '') {
                stageAmountFlag[i] = false;
            }
            if (giveFoodCount[i] == null || giveFoodCount[i] == '') {
                giveFoodCountFlag[i] = false;
            }
            if (Number(this.state.giveFoodCount[i]) > Number(this.state.stageAmount[i])) {
                flag = false
            }
            if (!priceList[i] || !priceList[i].length) {
                priceListFlag[i] = false;
            }
            if (!scopeLst[i] || !scopeLst[i].length) {
                scopeLstFlag[i] = false;
            }
            if (!floatUp[i]) {
                floatUpFlag[i] = false
            }
            if (Number(this.state.floatUp[i]) <= Number(this.state.giveFoodCount[i])) {
                flag = false
            }
            if (!floatDown[i]) {
                floatDownFlag[i] = false
            }
            if (Number(this.state.floatDown[i]) > Number(this.state.giveFoodCount[i])) {
                flag = false
            }
        }
        this.setState({ giveFoodCountFlag, stageAmountFlag, priceListFlag, scopeLstFlag, floatUpFlag, floatDownFlag });
        flag = flag && stageAmountFlag.reduce((f, item) => {
            return f && item
        }, true) && giveFoodCountFlag.reduce((f, item) => {
            return f && item
        }, true) && priceListFlag.reduce((f, item) => {
            return f && item
        }, true) && scopeLstFlag.reduce((f, item) => {
            return f && item
        }, true) && floatUpFlag.reduce((f, item) => {
            return f && item
        }, true) && floatDownFlag.reduce((f, item) => {
            return f && item
        }, true)
        if (flag) {
            // const rule = {
            //     stageType,
            //     targetScope,
            //     stage: [
            //         {
            //             stageAmount,
            //             giveFoodCount,
            //             stageNum: 0,
            //             stageType,
            //             stageAmountFlag,
            //             giveFoodCount,
            //             floatUp,
            //             floatDown,
            //         },
            //     ],
            // }
            // let tempArr1 = [];
            let priceLst = priceList.map((price, i) => {
                // if (tempArr1.indexOf(price.itemID) == -1) {
                // tempArr1.push(price.itemID);
                let arr = []
                arr = price.map((item) => {
                    return {
                        foodUnitID: item.itemID || item.foodUnitID,
                        foodUnitCode: item.foodKey || item.foodUnitCode,
                        foodName: item.foodName,
                        foodUnitName: item.unit || item.foodUnitName,
                        brandID: item.brandID || '0',
                        price: item.price,
                        imagePath: item.imgePath || item.imagePath,
                        stageNo: 0,
                    }
                })
                return arr
                // }
            });
            // let tempArr2 = [];
            let scopeList = scopeLst.map((price, i) => {
                let arr = []
                arr = price.map((item) => {
                    return {
                        scopeType: '2',
                        targetID: item.itemID || item.targetID,
                        brandID: item.brandID || '0',
                        targetCode: item.foodKey || item.targetCode,
                        targetName: item.foodName || item.targetName,
                        targetUnitName: item.unit || item.targetUnitName,
                    }
                })
                return arr
            });
            priceLst = priceLst.filter((item) => { if (item) { return item } });
            scopeList = scopeList.filter((item) => { if (item) { return item } });
            // const rule1 = JSON.stringify({ stageAmount, giveFoodCount, stageType, stageNum: 0, StageAmountFlag: true, floatDown, floatUp });
            // const foodRuleList = [{
            //     priceList: priceLst,
            //     rule: rule1,
            // }]
            const foodRuleList = level.map((item, index) => {
                return {
                    priceList: priceLst[index],
                    scopeList: scopeList[index],
                    rule: JSON.stringify({ stageAmount: stageAmount[index], giveFoodCount: giveFoodCount[index], stageType, stageNum: 0, StageAmountFlag: true, floatDown: floatDown[index], floatUp: floatUp[index], stageMeasurment: stageMeasurment[index] })
                }
            })
            this.props.setPromotionDetail({
                priceLst: [], foodRuleList, scopeLst: [], rule: ''
            });
            return true
        }
        return false
    };

    stageTypeChange = (e) => {
        this.setState({ stageType: e.target.value, })
    }



    renderActType = () => {
        return (
            <FormItem
                label={'活动方式'}
                className={[styles.FormItemStyle, styles.priceInputSingle].join(' ')}
                labelCol={{ span: 3, offset: 1 }}
                wrapperCol={{ span: 17, offset: 0 }}
                validateStatus={'success'}
            >
                <Radio.Group
                    onChange={this.stageTypeChange}
                    value={this.state.stageType}
                >
                    <Radio.Button value={2}>满赠</Radio.Button>
                    <Radio.Button value={1}>每满赠</Radio.Button>
                </Radio.Group>
            </FormItem>
        )
    }

    addLevel = () => {
        const { level = ['1'] } = this.state
        if (level.length < 5) {
            this.setState({
                level: level.concat('1')
            })
        }
    }

    onChangeClick = () => {
        this.setState(
            { display: !this.state.display }
        )
    };

    renderAdvancedSettingButton = () => {
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

    onPriceListChange = (value, index) => {
        const { priceList, priceListFlag } = this.state
        priceList[index] = value
        priceListFlag[index] = value.length ? true : false
        this.setState({
            priceList,
            priceListFlag,
        })
    }

    onScopeLstChange = (value, index) => {
        const { scopeLst, scopeLstFlag } = this.state
        scopeLst[index] = value
        scopeLstFlag[index] = value.length ? true : false
        this.setState({
            scopeLst,
            scopeLstFlag,
        });
    }

    onStageMeasurmentChange = (value, index) => {
        let { stageAmount, stageAmountFlag, foodRuleList } = this.state;
        if (stageAmount[index] == null || stageAmount[index] == '' || stageAmount[index] == '0' || (value == 1 && !/^(([1-9]\d{0,4})|0)(\.\d{0,2})?$/.test(stageAmount[index])) ||
        (value == 2 && !/^\+?\d{0,5}$/.test(stageAmount[index]))
        ) {
            stageAmountFlag[index] = false;
        } else {
            stageAmountFlag[index] = true;
        }
        const {
            stageMeasurment = []
        } = this.state
        stageMeasurment[index] = value
        this.setState({
            stageMeasurment,
            stageAmountFlag,
        })
    }

    onDeleteLevel = (index) => {
        let {
            scopeLst,
            scopeLstFlag,
            priceList,
            priceListFlag,
            level,
            stageAmount,
            stageAmountFlag,
            giveFoodCount,
            giveFoodCountFlag,
            floatUp,
            floatUpFlag,
            floatDown,
            floatDownFlag
        } = this.state
        level.pop()
        scopeLst.splice(index, 1).push('')
        scopeLstFlag.splice(index, 1).push(true)
        priceList.splice(index, 1).push('')
        priceListFlag.splice(index, 1).push(true)
        stageAmount.splice(index, 1).push('')
        stageAmountFlag.splice(index, 1).push(true)
        giveFoodCount.splice(index, 1).push('')
        giveFoodCountFlag.splice(index, 1).push(true)
        floatUp.splice(index, 1).push('')
        floatUpFlag.splice(index, 1).push(true)
        floatDown.splice(index, 1).push('')
        floatDownFlag.splice(index, 1).push(true)
        this.setState({
            scopeLst,
            scopeLstFlag,
            priceList,
            priceListFlag,
            level,
            stageAmount,
            stageAmountFlag,
            giveFoodCount,
            giveFoodCountFlag,
            floatUp,
            floatUpFlag,
            floatDown,
            floatDownFlag
        })
    }

    renderActRule = () => {
        const {
            level = ['1']
        } = this.state
        console.log('stageMeasurment', this.state.stageMeasurment)
        return (
            <FormItem
                label={'活动规则'}
                className={[styles.FormItemStyle, styles.actRuleForm].join(' ')}
                labelCol={{ span: 3, offset: 1 }}
                wrapperCol={{ span: 17, offset: 0 }}
                required={true}
                // validateStatus={item.rule.giveFoodCount == null || item.rule.giveFoodCount == '' ? 'error' : 'success'}
                validateStatus={'success'}
            >
                <span className={styles.grayLevelFont}>(至多添加5个)</span>
                {
                    level.map((item, index) => {
                        return <div className={styles.grayLevel}>
                            <div className={styles.levelTittle}>档位{index + 1} </div>
                            <div className={styles.iconBox}>
                                {(index === level.length - 1 && index !== 4) && <Icon className={styles.levelAdd} onClick={this.addLevel.bind(this, index)} type="plus-circle-o" />}
                                {(index !== 0 || level.length !== 1) && <Icon className={styles.levelDelete} type="minus-circle-o" onClick={this.onDeleteLevel.bind(this, index)} />}
                            </div>
                            <div className={styles.grayLineDiv}>
                                <div className={styles.darkGrayDiv}>
                                    <FormItem
                                        label={'活动商品'}
                                        required={true}
                                        className={[styles.FormItemStyle, styles.priceInputSingle].join(' ')}
                                        labelCol={{ span: 6, offset: 0 }}
                                        wrapperCol={{ span: 16, offset: 0 }}
                                        validateStatus={!this.state.priceListFlag[index] ? 'error' : 'success'}
                                        help={this.state.priceListFlag[index] ? null : '请选择商品'}
                                    >
                                        <ConnectedPriceListSelector
                                            key={1}
                                            priceList={this.state.priceList[index]}
                                            singleDish={true}
                                            onChangeFlag={(flag) => this.changePriceListFlag(flag, index)}
                                            shopGroupSame={true}
                                            foodRuleList={this.state.foodRuleList}
                                            isShopMode={this.props.isShopFoodSelectorMode}
                                            onChange={(value) => { this.onPriceListChange(value, index) }}
                                            dishLabel={'任一商品满足条件即可执行'}
                                        />
                                    </FormItem>
                                    <div className={styles.leftBox}>
                                        <FormItem
                                            style={{
                                                position: 'relative',
                                            }}
                                            label={this.state.stageType === 2 ? '消费满' : '消费每满'}
                                            className={[styles.FormItemStyle, styles.priceInputSingle, styles.measurmentSelect].join(' ')}
                                            labelCol={{ span: 10, offset: 0 }}
                                            wrapperCol={{ span: 12, offset: 0 }}
                                            validateStatus={this.state.stageAmountFlag[index] == '' ? 'error' : 'success'}
                                            help={this.state.stageAmountFlag[index] ? null : this.state.stageMeasurment[index] == 1 ? '请输入大于0，整数5位以内且小数2位内的数' : '请输入5位以内正整数'}
                                        >
                                            <Input key={2}
                                                // addonAfter={'斤'}
                                                value={this.state.stageAmount[index]}
                                                onChange={(value) => {
                                                    this.onStageAmountChange(value, index);
                                                }}
                                                placeholder={this.state.stageMeasurment[index] == 1 ? '请输入商品重量': '请输入购买金额'}
                                            />
                                            <Select
                                                style={{
                                                    position: 'absolute',
                                                }}
                                                width={40}
                                                placeholder={`请选择`}
                                                onChange={(value) => {
                                                    this.onStageMeasurmentChange(value, index);
                                                }}
                                                value={this.state.stageMeasurment[index] || 1}
                                            >
                                                <Option key={1} value={1} >
                                                    斤
                                                </Option>
                                                <Option key={2} value={2} >
                                                    元
                                                </Option>
                                            </Select>
                                        </FormItem>
                                    </div>
                                    <FormItem
                                        label={'赠送商品'}
                                        required={true}
                                        className={[styles.FormItemStyle, styles.priceInputSingle].join(' ')}
                                        labelCol={{ span: 6, offset: 0 }}
                                        wrapperCol={{ span: 16, offset: 0 }}
                                        validateStatus={!this.state.scopeLstFlag[index] ? 'error' : 'success'}
                                        help={this.state.scopeLstFlag[index] ? null : '请选择商品'}
                                    >
                                        <ConnectedPriceListSelector
                                            key={2}
                                            priceList={this.state.scopeLst[index]}
                                            singleDish={true}
                                            onChangeFlag={(flag) => this.changeScopeLstFlag(flag, index)}
                                            shopGroupSame={true}
                                            foodRuleList={this.state.foodRuleList}
                                            isShopMode={this.props.isShopFoodSelectorMode}
                                            onChange={(value) => { this.onScopeLstChange(value, index) }}
                                            dishLabel={'满足条件即可赠送任一商品'}
                                        />
                                    </FormItem>
                                    <div className={styles.leftBox}>
                                        <FormItem
                                            label={'赠送数量'}
                                            className={[styles.FormItemStyle, styles.priceInputSingle].join(' ')}
                                            labelCol={{ span: 9, offset: 1 }}
                                            wrapperCol={{ span: 12, offset: 0 }}
                                            validateStatus={this.state.giveFoodCountFlag[index] == '' ? 'error' : 'success'}
                                            help={this.state.giveFoodCountFlag[index] ? Number(this.state.giveFoodCount[index]) > Number(this.state.stageAmount[index]) ? '赠送数量不能大于购买数量' : null : '请输入大于0，整数5位以内且小数2位内的数'}
                                        >
                                            <Input key={2}
                                                addonAfter={'斤'}
                                                value={this.state.giveFoodCount[index]}
                                                onChange={(value) => {
                                                    this.onGiveFoodCountChange(value, index);
                                                }}
                                            />
                                        </FormItem>
                                    </div>
                                    <div className={styles.leftBox}>
                                        <FormItem
                                            label={'允许赠送误差'}
                                            required={true}
                                            className={[styles.FormItemStyle, styles.priceInputSingle].join(' ')}
                                            labelCol={{ span: 9, offset: 1 }}
                                            wrapperCol={{ span: 12, offset: 0 }}
                                            validateStatus={this.state.floatDownFlag[index] == '' ? 'error' : 'success'}
                                            help={this.state.floatDownFlag[index] ? this.state.floatDown[index] && (Number(this.state.floatDown[index]) >= Number(this.state.giveFoodCount[index])) ? '赠送最小值需小于赠送数量' : null : '请输入大于0，整数5位以内且小数2位内的数'}
                                        >
                                            <Input key={2}
                                                addonAfter={'斤'}
                                                value={this.state.floatDown[index]}
                                                onChange={(value) => {
                                                    this.onFloatDownChange(value, index);
                                                }}
                                            />
                                        </FormItem>
                                    </div>
                                    <div className={styles.rightBox}>
                                        <FormItem
                                            label={'至最大值'}
                                            className={[styles.FormItemStyle, styles.priceInputSingle].join(' ')}
                                            labelCol={{ span: 9, offset: 1 }}
                                            wrapperCol={{ span: 12, offset: 0 }}
                                            validateStatus={this.state.floatUpFlag[index] == '' ? 'error' : 'success'}
                                            help={this.state.floatUpFlag[index] ? this.state.floatUp[index] && (Number(this.state.floatUp[index]) <= Number(this.state.giveFoodCount[index])) ? '赠送最大值需大于赠送数量' : null : '请输入大于0，整数5位以内且小数2位内的数'}
                                        >
                                            <Input key={2}
                                                addonAfter={'斤'}
                                                value={this.state.floatUp[index]}
                                                onChange={(value) => {
                                                    this.onFloatUpChange(value, index);
                                                }}
                                            />
                                        </FormItem>
                                    </div>
                                </div>
                            </div>
                        </div>
                    })
                }
            </FormItem>
        )
    }

    onStageAmountChange = (e, index) => {
        let value = e.target.value
        let { stageAmount, stageAmountFlag, foodRuleList, stageMeasurment } = this.state;
        if (value == null || value == '' || value == '0' || (stageMeasurment[index] == 1 && !/^(([1-9]\d{0,4})|0)(\.\d{0,2})?$/.test(value)) ||
        (stageMeasurment[index] == 2 && !/^\+?\d{0,5}$/.test(value))
        ) {
            stageAmountFlag[index] = false;
            stageAmount[index] = value;
        } else {
            stageAmountFlag[index] = true;
            stageAmount[index] = value;
        }
        this.setState({ stageAmount, stageAmountFlag });

    }

    onGiveFoodCountChange = (e, index) => {
        let value = e.target.value
        let { giveFoodCount, giveFoodCountFlag } = this.state;
        if (value == null || value == '' || value == '0' || !/^(([1-9]\d{0,4})|0)(\.\d{0,2})?$/.test(value)) {
            giveFoodCountFlag[index] = false;
            giveFoodCount[index] = value;
        } else {
            giveFoodCountFlag[index] = true;
            giveFoodCount[index] = value;
        }
        this.setState({ giveFoodCount, giveFoodCountFlag });
    }

    onFloatUpChange = (e, index) => {
        let value = e.target.value
        let { floatUp, floatUpFlag } = this.state;
        if (value == null || value == '' || value == '0' || !/^(([1-9]\d{0,4})|0)(\.\d{0,2})?$/.test(value)) {
            floatUpFlag[index] = false;
            floatUp[index] = value;
        } else {
            floatUpFlag[index] = true;
            floatUp[index] = value;
        }
        this.setState({ floatUp, floatUpFlag });
    }

    onFloatDownChange = (e, index) => {
        let value = e.target.value
        let { floatDown, floatDownFlag } = this.state;
        if (value == null || value == '' || value == '0' || !/^(([1-9]\d{0,4})|0)(\.\d{0,2})?$/.test(value)) {
            floatDownFlag[index] = false;
            floatDown[index] = value;
        } else {
            floatDownFlag[index] = true;
            floatDown[index] = value;
        }
        this.setState({ floatDown, floatDownFlag });
    }


    openTheDishModal = () => {

    }



    render() {
        const { ifMultiGrade, foodRuleList, priceListFlag, scopeLstFlag, scopeLst, priceList, stageAmount, giveFoodCount, floatUp, floatDown } = this.state;
        console.log('scopeLst', scopeLst)
        console.log('priceList', priceList)
        console.log('stageAmount', stageAmount)
        console.log('giveFoodCount', giveFoodCount)
        console.log('floatUp', floatUp)
        console.log('floatDown', floatDown)
        return (
            <div>
                <Form className={[styles.FormStyle, styles.bugGive].join(' ')}>
                    {/* <ConnectedScopeListSelector isShopMode={this.props.isShopFoodSelectorMode} /> */}
                    {/* {
                        ifMultiGrade ? null :
                            this.renderBuyDishNumInput()
                    }
                    {ifMultiGrade ?
                        foodRuleList.map((item, index) => {
                            return this.renderMultiGradeSelect(item, index)
                        })
                    :
                        this.renderDishsSelectionBox()
                    }
                    {ifMultiGrade ?
                        null
                    :
                        this.renderGiveDishNumInput()
                    } */}
                    {
                        this.renderActType()
                    }
                    {
                        this.renderActRule()
                    }
                    {this.renderAdvancedSettingButton()}
                    {this.state.display ? <AdvancedPromotionDetailSetting justUserSetting={true} payLimit={false} /> : null}
                </Form>
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        isShopFoodSelectorMode: state.sale_promotionDetailInfo_NEW.get('isShopFoodSelectorMode'),
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
)(Form.create()(WeighBuyGiveDetailInfo));
