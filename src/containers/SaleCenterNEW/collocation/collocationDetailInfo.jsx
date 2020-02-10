import React, { Component } from 'react'
import { Form, Select, message } from 'antd';
import { connect } from 'react-redux'

import styles from '../ActivityPage.less';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont'; // 引入icon图标组件库

import CollocationTableWithBrandID from '../common/CollocationTableWithBrandID'; // 表格
import CollocationTableWithoutBrandID from '../common/CollocationTableWithoutBrandID'; // 表格

const FormItem = Form.Item;
const Option = Select.Option;

import AdvancedPromotionDetailSetting from '../../../containers/SaleCenterNEW/common/AdvancedPromotionDetailSetting';

import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from '../IntlDecor';

@injectIntl()
class CollocationDetailInfo extends React.Component {
    constructor(props) {
        super(props);
        this.defaultRun = '0';
        this.state = {
            display: !this.props.isNew,
            priceLst: [],
            scopeLst: [],
        };

        this.renderAdvancedSettingButton = this.renderAdvancedSettingButton.bind(this);
        this.onChangeClick = this.onChangeClick.bind(this);
        this.dishesChange = this.dishesChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.props.getSubmitFn({
            finish: this.handleSubmit,
        });
    }

    handleSubmit() {
        const { data } = this.state;
        let priceLst = [],
            scopeLst = [],
            nextFlag = true;
        data ? data.forEach((group, groupIdx) => {
            if (group.free[0] && Object.keys(group.free[0]).length !== 2 && Object.keys(group.foods[0]).length !== 2) {
                group.free.forEach((free) => {
                    priceLst.push({
                        foodUnitID: free.itemID,
                        foodUnitCode: free.foodKey,
                        foodName: free.foodName,
                        foodUnitName: free.unit,
                        brandID: free.brandID || 0,
                        price: parseFloat(free.prePrice==-1?free.price:free.prePrice || 0),
                        stageNo: groupIdx,
                        num: group.freeCountInfo[free.value || free.itemID] >= 1 ? group.freeCountInfo[free.value || free.itemID] : 1,
                    })
                });
                group.foods.forEach((food) => {
                    scopeLst.push({
                        scopeType: '2',
                        targetID: food.itemID,
                        targetCode: food.foodKey,
                        targetName: food.foodName,
                        targetUnitName: food.unit,
                        brandID: food.brandID || 0,
                        stageNo: groupIdx,
                        num: group.foodsCountInfo[food.value || food.itemID] >= 1 ? group.foodsCountInfo[food.value || food.itemID] : 1,
                    })
                });
            } else {
                nextFlag = false;
            }
        }) : nextFlag = false
        if (nextFlag) {
            this.props.setPromotionDetail({
                priceLst,
                scopeLst,
                rule: {}, // 为黑白名单而设
            });
            return true;
        }
        message.warning(SALE_LABEL.k5hlhwpg);
        return false;
    }

    onChangeClick() {
        this.setState(
            { display: !this.state.display }
        )
    }

    dishesChange(val) {
        this.setState({
            data: val,
        })
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

    render() {
        return (
            <div>
                <Form className={styles.FormStyle}>
                    {
                        this.props.isShopFoodSelectorMode ? (
                            <CollocationTableWithoutBrandID
                                onChange={this.dishesChange}
                            />
                        ) : (
                            <CollocationTableWithBrandID
                                onChange={this.dishesChange}
                            />
                        )
                    }
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
)(CollocationDetailInfo);
