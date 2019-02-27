/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-03-15T10:50:38+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: promotionScopeInfo.jsx
 * @Last modified by:   xf
 * @Last modified time: 2017-04-08T16:46:12+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */

import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { isEqual, uniq } from 'lodash';
import { axiosData } from '../../../helpers/util';


import {
    Form,
    Radio,
    TreeSelect,
    Select,
    Icon,
    Tag,
} from 'antd';
import Immutable from 'immutable';

import { saleCenterSetSpecialBasicInfoAC, saleCenterGetExcludeCardLevelIds } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import styles from '../../SaleCenterNEW/ActivityPage.less';
import { fetchPromotionScopeInfo, getPromotionShopSchema } from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action';
import { fetchSpecialCardLevel } from '../../../redux/actions/saleCenterNEW/mySpecialActivities.action';
import ExcludeCardTable from './ExcludeCardTable';
import EditBoxForShops from './EditBoxForShops';

// import _ from 'lodash';
// import { FetchCrmCardTypeLst, FetchSelectedShops } from '../../../redux/actions/crmNew/crmCardType.action';
import { FetchCrmCardTypeLst } from '../../../redux/actions/saleCenterNEW/crmCardType.action';
import ShopSelector from "../../../components/common/ShopSelector";
import BaseHualalaModal from "../../SaleCenterNEW/common/BaseHualalaModal";

const FormItem = Form.Item;
// const Option = Select.Option;
const RadioGroup = Radio.Group;
// const SHOW_PARENT = TreeSelect.SHOW_PARENT;
// const Immutable = require('immutable');
if (process.env.__CLIENT__ === true) {
    // require('../../../../client/componentsPage.less');
}

class CardLevelForWX extends React.Component {
    constructor(props) {
        super(props);
        const shopSchema = props.shopSchemaInfo.getIn(['shopSchema']).toJS();
        this.state = {
            cardInfo: [],
            cardLevelIDList: [],
            shopSchema,
            dynamicShopSchema: shopSchema,
            cardLevelRangeType: '0',
            cardTypeHadQuery: {}, // 存储查询过的{卡类：[店铺s], 卡类：[店铺s]}
            canUseShops: [], // 所选卡类适用店铺
            selections_shopsInfo: { shopsInfo: [] }, // 已选店铺

        };
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);
        this.renderShopsOptions = this.renderShopsOptions.bind(this);
    }

    componentDidMount() {
        this.props.FetchCrmCardTypeLst({});
        this.props.getShopSchemaInfo({groupID: this.props.user.accountInfo.groupID});
        const thisEventInfo = this.props.specialPromotion.get('$eventInfo').toJS();
        const cardLevelRangeType = thisEventInfo.cardLevelRangeType == '4' ? '2' : thisEventInfo.cardLevelRangeType;
        this.setState({
            cardLevelRangeType: cardLevelRangeType || '2',
            cardLevelIDList: thisEventInfo.cardLevelIDList || [],
            selections_shopsInfo: { shopsInfo: thisEventInfo.shopIDList || [] },
        }, () => {
            this.props.onChange({
                shopIDList: thisEventInfo.shopIDList || [],
                cardLevelRangeType: this.state.cardLevelRangeType,
                cardLevelIDList: this.state.cardLevelIDList,
            });
        })
    }

    componentWillReceiveProps(nextProps) {
        const previousSchema = this.state.shopSchema;
        const nextShopSchema = nextProps.shopSchemaInfo.getIn(['shopSchema']).toJS();
        if (!isEqual(previousSchema, nextShopSchema)) {
            this.setState({shopSchema: nextShopSchema, // 后台请求来的值
                dynamicShopSchema: nextShopSchema
            });
        }
        const thisEventInfo = this.props.specialPromotion.get('$eventInfo').toJS();
        const nextEventInfo = nextProps.specialPromotion.get('$eventInfo').toJS();
        if (this.props.crmCardTypeNew.get('cardTypeLst') !== nextProps.crmCardTypeNew.get('cardTypeLst')) {
            const cardInfo = nextProps.crmCardTypeNew.get('cardTypeLst').toJS();
            this.setState({
                cardInfo: cardInfo.filter((cardType) => {
                    return cardType.regFromLimit
                }),
            });
        }
        // 每次第一步选择时间变化，就清空已选
        if ((thisEventInfo.eventStartDate !== nextEventInfo.eventStartDate || thisEventInfo.eventEndDate !== nextEventInfo.eventEndDate) &&
            nextEventInfo.eventStartDate && thisEventInfo.eventStartDate) {
            this.handleSelectChange([]);
        }
        // 获得排除卡id集合  &&  禁用全部会员按钮
        // 编辑时，就重新获得排除卡id集合，就执行一次，场景：不改变日期，第一步日期控件不触发接口，但要获取排除，还不能排除自己
        if (nextEventInfo.itemID && !this.state.getExcludeCardLevelIdsStatus) {
            const opts2 = {
                groupID: nextProps.user.accountInfo.groupID,
                eventWay: this.props.type,
                eventStartDate: nextEventInfo.eventStartDate,
                eventEndDate: nextEventInfo.eventEndDate,
                itemID: nextEventInfo.itemID,
            };
            this.setState({
                getExcludeCardLevelIdsStatus: true,
            }, () => {
                this.props.saleCenterGetExcludeCardLevelIds(opts2);
            })
        }

        const arr = [];
        const excludeEvent = nextEventInfo.excludeEventCardLevelIdModelList || [];
        // 遍历所有排除卡
        if (this.props.specialPromotion.get('$eventInfo').toJS().allCardLevelCheck) {
            // true全部占用
            this.setState({ getExcludeCardLevelIds: this.state.cardInfo })
        } else {
            // false 无/局部 占用
            excludeEvent.map((event) => {
                event.cardLevelIDList && event.cardLevelIDList.map((card) => {
                    arr.push(card)
                })
            })
            this.setState({ getExcludeCardLevelIds: arr })
        }
        const fun = () => {
            this.setState({ allCheckDisabel: true }, () => {
                this.props.onChange({ cardLevelRangeType: this.state.cardLevelRangeType })
            })
        }
        // 禁用全部会员按钮
        if (Object.keys(nextEventInfo).length < 30 &&
            ((nextEventInfo.excludeEventCardLevelIdModelList && nextEventInfo.excludeEventCardLevelIdModelList.length > 0)
                || nextEventInfo.allCardLevelCheck)) {
            // 新建&&局部被使用||全部被使用
            fun();
        } else if (Object.keys(nextEventInfo).length > 30 && nextEventInfo.allCardLevelCheck) {
            // 编辑&&true全部被使用
            fun();
        } else if (Object.keys(nextEventInfo).length > 30 && !nextEventInfo.allCardLevelCheck
            && nextEventInfo.excludeEventCardLevelIdModelList && nextEventInfo.excludeEventCardLevelIdModelList.length > 0) {
            // 编辑&&false&&局部被使用
            fun();
        } else {
            this.setState({ allCheckDisabel: false })
        }
        if (!Immutable.is(Immutable.fromJS(thisEventInfo.shopIDList), Immutable.fromJS(nextEventInfo.shopIDList))) {
            this.setState({ selections_shopsInfo: { shopsInfo: nextEventInfo.shopIDList || [] } })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.cardInfo !== prevProps.cardInfo || this.props.crmCardTypeNew.get('cardTypeLst') !== prevProps.crmCardTypeNew.get('cardTypeLst')) {
            this.queryCanuseShops(this.state.cardLevelIDList)
        }
    }

    // 查询已选卡类型的可用店铺
    queryCanuseShops = (cardTypeIDs) => {
        const eventInfo = this.props.specialPromotion.get('$eventInfo').toJS();
        let { getExcludeCardLevelIds = [], cardScopeIDs = [], cardScopeType, cardLevelRangeType } = this.state;
        let cardInfo = this.props.cardInfo ? this.props.cardInfo.toJS()
            .filter(item => this.state.cardInfo.findIndex(cardType => cardType.cardTypeID === item.cardTypeID) > -1) : [];
        let questArr = [];
        if (cardTypeIDs && cardTypeIDs.length) {
            if (cardLevelRangeType == '5') {// 卡等级
                cardTypeIDs.forEach(id => {
                    const index = cardInfo.findIndex(cardType => {
                        return (cardType.cardTypeLevelList || []).map(cardLevel => cardLevel.cardLevelID).includes(id)
                    });
                    if (index > -1) {
                        questArr.push(cardInfo[index].cardTypeID)
                    }
                })
            } else {// 卡类
                questArr = cardTypeIDs;
            }
        } else {// 没选的情况下, 查所有能选的卡类下的适用店铺
            if (!eventInfo.allCardLevelCheck && getExcludeCardLevelIds.length) {
                cardInfo = cardInfo.filter(cardType => !getExcludeCardLevelIds.includes(cardType.cardTypeID))
            } else if (!!eventInfo.allCardLevelCheck) {
                cardInfo = [];
            }
            questArr = cardInfo.map(cardType => cardType.cardTypeID)
        }
        axiosData('/crm/cardTypeShopService_getListCardTypeShop.ajax', {
            groupID: this.props.user.accountInfo.groupID,
            cardTypeIds: uniq(questArr).join(','),
            queryCardType: 1// questArr.length === 0 ? 0 : 1,
        }, null, { path: 'data.cardTypeShopList' })
            .then(cardTypeShopList => {
                const shopsInfo = this.state.selections_shopsInfo.shopsInfo.map(shopID => String(shopID));
                let canUseShops = [];
                canUseShops.push(...shopsInfo);
                (cardTypeShopList || []).forEach((cardType) => {
                    cardType.cardTypeShopResDetailList.forEach(shop=>{
                        canUseShops.push(String(shop.shopID))
                    })
                });
                this.setState({ canUseShops, selections_shopsInfo: { shopsInfo } })
            })
    }

    getDynamicShopSchema() {
        let dynamicShopSchema = Object.assign({}, this.state.shopSchema);
        if (dynamicShopSchema.shops.length === 0) {
            return dynamicShopSchema;
        }
        let canUseShops = this.state.canUseShops;
        dynamicShopSchema.shops = dynamicShopSchema.shops.filter(shop => canUseShops.includes(String(shop.shopID)));
        const shops = dynamicShopSchema.shops;
        const availableCities = uniq(shops.map(shop => shop.cityID));
        const availableBM = uniq(shops.map(shop => shop.businessModel));
        const availableBrands = uniq(shops.map(shop => shop.brandID));
        const availableCategories = uniq(shops.map(shop => shop.shopCategoryID)
            .reduce((accumulateArr, currentCategoryIDString) => {
                accumulateArr.push(...(currentCategoryIDString || '').split(','));
                return accumulateArr;
            }, []));
        dynamicShopSchema.businessModels = dynamicShopSchema.businessModels && dynamicShopSchema.businessModels instanceof Array ? dynamicShopSchema.businessModels.filter(collection => availableBM.includes(collection.businessModel)) : [];
        dynamicShopSchema.citys = dynamicShopSchema.citys && dynamicShopSchema.citys instanceof Array ? dynamicShopSchema.citys.filter(collection => availableCities.includes(collection.cityID)) : [];
        dynamicShopSchema.shopCategories = dynamicShopSchema.shopCategories && dynamicShopSchema.shopCategories instanceof Array ? dynamicShopSchema.shopCategories.filter(collection => availableCategories.includes(collection.shopCategoryID)) : [];
        dynamicShopSchema.brands = dynamicShopSchema.brands && dynamicShopSchema.brands instanceof Array ? dynamicShopSchema.brands.filter(brandCollection => availableBrands.includes(brandCollection.brandID)) : [];
        return dynamicShopSchema;
    }

    handleSelectChange(value) {
        this.queryCanuseShops(value)
        this.setState({
            cardLevelIDList: value,
            canUseShops: [],
            selections_shopsInfo: { shopsInfo: [] }
        })
        this.props.onChange && this.props.onChange({ cardLevelIDList: value, shopIDList: [] });
    }
    handleRadioChange(e) {
        const opts = {
            cardLevelRangeType: e.target.value,
            cardLevelIDList: [],
        };
        opts.canUseShops = []
        opts.selections_shopsInfo = { shopsInfo: [] }
        this.setState(opts, () => {
            this.queryCanuseShops([])
        });
        this.props.onChange && this.props.onChange({
            cardLevelRangeType: e.target.value,
            cardLevelIDList: [],
        })
    }
    editBoxForShopsChange = (val) => {
        this.setState({
            selections_shopsInfo: { shopsInfo: val }, // shopIDList
        }, () => {
            this.props.onChange && this.props.onChange({
                shopIDList: this.state.selections_shopsInfo.shopsInfo,
            })
        })
    }
    renderShopsOptions() {
        return (
            <div className={styles.giftWrap}>
                <Form.Item
                    label="适用店铺"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <ShopSelector
                        value={(this.state.selections_shopsInfo.shopsInfo || []).map(shopID => String(shopID))}
                        onChange={
                            this.editBoxForShopsChange
                        }
                        schemaData={this.getDynamicShopSchema()}
                    />
                </Form.Item>
            </div>
        );
    }

    render() {
        const eventInfo = this.props.specialPromotion.get('$eventInfo').toJS();
        const excludeEvent = eventInfo.excludeEventCardLevelIdModelList || [];
        let { getExcludeCardLevelIds = [], cardLevelRangeType } = this.state;
        let cardInfo = this.props.cardInfo ? this.props.cardInfo.toJS()
            .filter(item => this.state.cardInfo.findIndex(cardType => cardType.cardTypeID === item.cardTypeID) > -1) : [];
        if (!eventInfo.allCardLevelCheck && getExcludeCardLevelIds.length) {
            cardInfo = cardInfo.filter(cardType => !getExcludeCardLevelIds.includes(cardType.cardTypeID))
        } else if (!!eventInfo.allCardLevelCheck) {
            cardInfo = [];
        }
        const boxData = new Set();
        this.state.cardLevelIDList.forEach((id) => {
            cardInfo.forEach((cat) => {
                cat.cardTypeLevelList.forEach((level) => {
                    if (level.cardLevelID === id) {
                        boxData.add(level)
                    }
                })
            })
        });
        return (
            <Form className={styles.cardLevelTree}>
                <FormItem
                    label="会员范围"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <RadioGroup onChange={this.handleRadioChange} value={`${this.state.cardLevelRangeType}`}>
                        <Radio key={'2'} value={'2'}>{'线上卡类别'}</Radio>
                        <Radio key={'5'} value={'5'}>{'线上卡等级'}</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem
                    label={`适用${cardLevelRangeType == 2 ? '卡类' : '卡等级'}`}
                    className={[styles.FormItemStyle, styles.cardLevelTree].join(' ')}
                    labelCol={{ span: 4 }}
                    required={eventInfo.allCardLevelCheck || excludeEvent.length > 0}
                    wrapperCol={{ span: 17 }}
                >
                    {
                        cardLevelRangeType == 2
                            ?
                            (<Select
                                size={'default'}
                                multiple={true}
                                showSearch={true}
                                value={this.state.cardLevelIDList}
                                className={`${styles.linkSelectorRight} advancedDetailClassJs`}
                                getPopupContainer={(node) => node.parentNode}
                                onChange={this.handleSelectChange}
                            >
                                {
                                    cardInfo.map(type => <Select.Option key={type.cardTypeID} value={type.cardTypeID}>{type.cardTypeName}</Select.Option>)

                                }
                            </Select>)
                            :
                            (<BaseHualalaModal
                                outLabel={'卡等级'} //   外侧选项+号下方文案
                                outItemName="cardLevelName" //   外侧已选条目选项的label
                                outItemID="cardLevelID" //   外侧已选条目选项的value
                                innerleftTitle={'全部卡类'} //   内部左侧分类title
                                innerleftLabelKey={'cardTypeName'}//   内部左侧分类对象的哪个属性为分类label
                                leftToRightKey={'cardTypeLevelList'} // 点击左侧分类，的何种属性展开到右侧
                                innerRightLabel="cardLevelName" //   内部右侧checkbox选项的label
                                innerRightValue="cardLevelID" //   内部右侧checkbox选项的value
                                innerBottomTitle={'已选卡等级'} //   内部底部box的title
                                innerBottomItemName="cardLevelName" //   内部底部已选条目选项的label
                                itemNameJoinCatName={'cardTypeName'} // item条目展示名称拼接类别名称
                                treeData={cardInfo} // 树形全部数据源【{}，{}，{}】
                                data={boxData} // 已选条目数组【{}，{}，{}】】,编辑时向组件内传递值
                                onChange={(value) => {
                                    // 组件内部已选条目数组【{}，{}，{}】,向外传递值
                                    const _value = value.map(level => level.cardLevelID)
                                    this.handleSelectChange(_value)
                                }}
                            />)
                    }
                    {
                        !eventInfo.allCardLevelCheck && excludeEvent.length == 0 ? null :
                            <Icon
                                type="exclamation-circle"
                                style={{
                                    left: '102%',
                                    top: cardLevelRangeType == 2 ? '8px' : '28px'
                                }}
                                className={styles.cardLevelTreeIcon}
                                onClick={() => {
                                    this.setState({ tableDisplay: !this.state.tableDisplay })
                                }}
                            />
                    }
                </FormItem>
                {
                    !eventInfo.allCardLevelCheck && excludeEvent.length == 0 && this.state.cardLevelIDList.length === 0 ? (
                        <p style={{ color: 'orange', marginLeft: 110, marginTop: '-5px' }}>
                            不选择默认全选
                        </p>
                    ) : (eventInfo.allCardLevelCheck || excludeEvent.length > 0) && this.state.cardLevelIDList.length === 0  ? (
                        <p style={{ color: 'red', marginLeft: 110, marginTop: '-5px' }}>
                            有卡类被占用, 不得为空
                        </p>
                    ) : null
                }
                {
                    !eventInfo.allCardLevelCheck && excludeEvent.length === 0 ? null :
                        <div
                            style={{ display: this.state.tableDisplay ? 'block' : 'none', width: '71%', marginLeft: '110px' }}
                        >
                            <ExcludeCardTable isWeChatOnly={true} catOrCard={'cat'} />
                        </div>
                }
                {this.renderShopsOptions()}
            </Form>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        specialPromotion: state.sale_specialPromotion_NEW,
        user: state.user.toJS(),
        // 后端查回来的所有卡类存在这里, 里面的数据有表示是否线上卡类型的字段(regFromLimit, 1 为线上 )
        crmCardTypeNew: state.sale_crmCardTypeNew,
        // 后端查回来的所有卡类 **及其所包含卡等级信息** 存在这里, 但是没有regFromLimit信息
        // 因为线上餐厅送礼要限制只能选到线上卡类型, 所以调了2个接口
        cardInfo: state.sale_mySpecialActivities_NEW.getIn(['$specialDetailInfo', 'data', 'cardInfo', 'data', 'groupCardTypeList']),
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        shopSchemaInfo: state.sale_shopSchema_New,

    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getShopSchemaInfo: opts => dispatch(getPromotionShopSchema(opts)),
        setSpecialBasicInfo: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
        fetchSpecialCardLevel: (opts) => {
            dispatch(fetchSpecialCardLevel(opts));
        },
        fetchPromotionScopeInfo: (opts) => {
            dispatch(fetchPromotionScopeInfo(opts));
        },
        saleCenterGetExcludeCardLevelIds: (opts) => {
            dispatch(saleCenterGetExcludeCardLevelIds(opts));
        },
        FetchCrmCardTypeLst: (opts) => {
            dispatch(FetchCrmCardTypeLst(opts));
        },
        // FetchSelectedShopsAC: (opts) => {
        //     return dispatch(FetchSelectedShops(opts));
        // },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CardLevelForWX);
