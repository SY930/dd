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
import { isEqual, uniq } from 'lodash';
import { axiosData } from '../../../helpers/util';
import { axios } from '@hualala/platform-base';
import {
    Form,
    Radio,
    Select,
    Icon,
    Tooltip,
} from 'antd';

import {
    saleCenterSetSpecialBasicInfoAC, saleCenterGetExcludeCardLevelIds,
    getEventExcludeCardTypes, saveCurrentCanUseShops, saleCenterQueryOnlineRestaurantStatus
} from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import styles from '../../SaleCenterNEW/ActivityPage.less';
import { fetchPromotionScopeInfo, getPromotionShopSchema } from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action';
import { fetchSpecialCardLevel } from '../../../redux/actions/saleCenterNEW/mySpecialActivities.action';
import ExcludeCardTable from './ExcludeCardTable';
import { FetchCrmCardTypeLst } from '../../../redux/actions/saleCenterNEW/crmCardType.action';
import ShopSelector from '../../../components/ShopSelector';
import BaseHualalaModal from "../../SaleCenterNEW/common/BaseHualalaModal";
import { injectIntl } from 'i18n/common/injectDecorator'
import { STRING_SPE } from 'i18n/common/special';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

@injectIntl
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
            canUseShops: [], // 所选卡类适用店铺id
            occupiedShops: [], // 已经被占用的卡类适用店铺id
            selections_shopsInfo: { shopsInfo: [] }, // 已选店铺,
            shopStatus: true,
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
            selections_shopsInfo: { shopsInfo: (thisEventInfo.shopIDList || []).filter(id => id > 0) },
        }, () => {
            this.props.onChange({
                shopIDList: thisEventInfo.shopIDList || [],
                cardLevelRangeType: this.state.cardLevelRangeType,
                cardLevelIDList: this.state.cardLevelIDList,
            });
        })
        this.loadShopSchema();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.shopSchemaInfo.getIn(['shopSchema']) !== nextProps.shopSchemaInfo.getIn(['shopSchema'])) {
            this.setState({
                shopSchema: nextProps.shopSchemaInfo.getIn(['shopSchema']).toJS(), // 后台请求来的值
            });
        }
        if (this.props.crmCardTypeNew.get('cardTypeLst') !== nextProps.crmCardTypeNew.get('cardTypeLst')) {
            const cardInfo = nextProps.crmCardTypeNew.get('cardTypeLst').toJS();
            this.setState({
                cardInfo: cardInfo.filter((cardType) => {
                    return cardType.regFromLimit
                }),
            });
        }
        // 每次第一步选择时间变化，就清空已选
        const thisEventInfo = this.props.specialPromotion.get('$eventInfo').toJS();
        const nextEventInfo = nextProps.specialPromotion.get('$eventInfo').toJS();
        if ((thisEventInfo.eventStartDate !== nextEventInfo.eventStartDate
            || thisEventInfo.eventEndDate !== nextEventInfo.eventEndDate) &&
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
                this.props.saleCenterGetExcludeCardLevelIds(opts2); // 之前此接口过滤卡类, 现在只用来更新卡类占用table
                this.props.getEventExcludeCardTypes(opts2);
            })
        }
        // 遍历所有排除卡
        if (this.props.specialPromotion.getIn(['$eventInfo', 'excludeCardTypeIDs'])
            !== nextProps.specialPromotion.getIn(['$eventInfo', 'excludeCardTypeIDs'])) {
            // true全部占用
            this.setState({ getExcludeCardLevelIds: nextProps.specialPromotion.getIn(['$eventInfo', 'excludeCardTypeIDs']).toJS() })
        }
        if (this.props.specialPromotion.getIn(['$eventInfo', 'excludeCardTypeShops'])
            !== nextProps.specialPromotion.getIn(['$eventInfo', 'excludeCardTypeShops'])) {
            const occupiedShops = nextProps.specialPromotion.getIn(['$eventInfo', 'excludeCardTypeShops']).toJS().reduce((acc, curr) => {
                acc.push(...(curr.shopIDList || []).map(id => `${id}`)); // 把shopID转成string, 因为基本档返回的是string
                return acc;
            }, []);
            this.setState({ occupiedShops })
        }
        const fun = () => {
            this.setState({ allCheckDisabel: true }, () => {
                this.props.onChange({ cardLevelRangeType: this.state.cardLevelRangeType })
            })
        }
        // 禁用全部会员按钮
        if (!nextEventInfo.itemID &&
            ((nextEventInfo.excludeEventCardLevelIdModelList && nextEventInfo.excludeEventCardLevelIdModelList.length > 0)
                || nextEventInfo.allCardLevelCheck)) {
            // 新建&&局部被使用||全部被使用
            fun();
        } else if (nextEventInfo.itemID && nextEventInfo.allCardLevelCheck) {
            // 编辑&&true全部被使用
            fun();
        } else if (nextEventInfo.itemID && !nextEventInfo.allCardLevelCheck
            && nextEventInfo.excludeEventCardLevelIdModelList && nextEventInfo.excludeEventCardLevelIdModelList.length > 0) {
            // 编辑&&false&&局部被使用
            fun();
        } else {
            this.setState({ allCheckDisabel: false })
        }
        if (this.props.specialPromotion.getIn(['$eventInfo', 'shopIDList']) !== nextProps.specialPromotion.getIn(['$eventInfo', 'shopIDList'])) {
            this.setState({ selections_shopsInfo: { shopsInfo: nextEventInfo.shopIDList || [] } })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((this.props.cardInfo !== prevProps.cardInfo && this.state.cardInfo.length)
            || (this.props.crmCardTypeNew.get('cardTypeLst') !== prevProps.crmCardTypeNew.get('cardTypeLst') && this.props.cardInfo )) {
            this.queryCanuseShops(this.state.cardLevelIDList)
        }
    }

    // 查询已选卡类型的可用店铺
    queryCanuseShops = (cardTypeIDs) => {
        this.props.saleCenterQueryOnlineRestaurantStatus('pending');
        let {
            getExcludeCardLevelIds = [],
            cardLevelRangeType,
        } = this.state;
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
            if (getExcludeCardLevelIds.length) {
                cardInfo = cardInfo.filter(cardType => !getExcludeCardLevelIds.includes(cardType.cardTypeID))
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
                canUseShops = Array.from(new Set(canUseShops));
                this.props.saveCurrentCanUseShops(canUseShops)
                this.props.saleCenterQueryOnlineRestaurantStatus('success');
                this.setState({ canUseShops, selections_shopsInfo: { shopsInfo } });
            }).catch(err => {
                this.props.saleCenterQueryOnlineRestaurantStatus('error');
            })
    }

    getDynamicShopSchema() {
        let dynamicShopSchema = Object.assign({}, this.state.shopSchema);
        if (dynamicShopSchema.shops.length === 0) {
            return dynamicShopSchema;
        }
        const { canUseShops, occupiedShops } = this.state;
        dynamicShopSchema.shops = dynamicShopSchema.shops.filter(shop => !occupiedShops.includes(`${shop.shopID}`) && canUseShops.includes(`${shop.shopID}`));
        const shops = dynamicShopSchema.shops;
        const availableCities = uniq(shops.map(shop => shop.cityID));
        const availableBM = uniq(shops.map(shop => shop.businessModel));
        const availableBrands = uniq(shops.map(shop => shop.brandID));
        const availableCategories = uniq(shops.map(shop => shop.shopCategoryID)
            .reduce((accumulateArr, currentCategoryIDString) => {
                accumulateArr.push(...(currentCategoryIDString || '').split(','));
                return accumulateArr;
            }, []));
        // dynamicShopSchema.businessModels = dynamicShopSchema.businessModels && dynamicShopSchema.businessModels instanceof Array ? dynamicShopSchema.businessModels.filter(collection => availableBM.includes(collection.businessModel)) : [];
        dynamicShopSchema.businessModels = dynamicShopSchema.businessModels && dynamicShopSchema.businessModels instanceof Array ? dynamicShopSchema.businessModels : [];
        dynamicShopSchema.citys = dynamicShopSchema.citys && dynamicShopSchema.citys instanceof Array ? dynamicShopSchema.citys.filter(collection => availableCities.includes(collection.cityID)) : [];
        dynamicShopSchema.shopCategories = dynamicShopSchema.shopCategories && dynamicShopSchema.shopCategories instanceof Array ? dynamicShopSchema.shopCategories.filter(collection => availableCategories.includes(collection.shopCategoryID)) : [];
        dynamicShopSchema.brands = dynamicShopSchema.brands && dynamicShopSchema.brands instanceof Array ? dynamicShopSchema.brands.filter(brandCollection => availableBrands.includes(brandCollection.brandID)) : [];
        return dynamicShopSchema;
    }
    async loadShopSchema() {
        const { data } = await axios.post('/api/shopapi/schema',{});
        const { shops } = data;
        this.countIsRequire(shops);
    }
    countIsRequire(shopList){
        const { shopSchemaInfo, specialPromotion } = this.props;
        const { size } = shopSchemaInfo.getIn(['shopSchema', 'shops']);       // 总店铺数
        const eventInfo = specialPromotion.getIn(['$eventInfo']).toJS();
        const oldShops = eventInfo.shopIDList || []; // 存储的店铺数
        const isOld = eventInfo.itemID; // 有这个id 表明是 编辑数据
        const { length } = shopList;
        // a 新建营销活动，先获取此集团的所有店铺数据，如果此用户为全部店铺权限，表单内店铺组件非必选
        // 如果用户权限为某几个店铺的权限，组件为必选项。
        // b 编辑活动，全部店铺权限用户非必选
        // 店铺受限用户，首先判断历史数据是否是全部店铺的数据，如果是，店铺组件为非必选。
        // 反之，店铺为必选，用户必选一个用户权限之内的店铺选项。
        if(!isOld){
            if(length<size){
                this.setState({ isRequire: true });
            }
        } else {
            if(oldShops[0] && length<size){
                this.setState({ isRequire: true });
            }
        }
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
            shopIDList: [],
        })
    }
    editBoxForShopsChange = (val) => {
        this.setState({
            selections_shopsInfo: { shopsInfo: val }, // shopIDList
            shopStatus: val.length > 0,
        }, () => {
            this.props.onChange && this.props.onChange({
                shopIDList: this.state.selections_shopsInfo.shopsInfo,
            })
        })
    }
    isFilterShopType = () => {
        const promotionType = this.props.type;
        // 授权店铺过滤活动类型  
        // 线上餐厅送礼  23
        let filterType = ['23'];
        return filterType.includes(promotionType)
    }
    renderShopsOptions() {
        const { isRequire, shopStatus, canUseShops } = this.state;
        const { queryCanUseShopStatus } = this.props;
        return (
            <div className={styles.giftWrap}>
                <Form.Item
                    label={this.props.intl.formatMessage(STRING_SPE.db60a0b75aca181)}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                    required={isRequire}
                    validateStatus={shopStatus ? 'success' : 'error'}
                    help={shopStatus ? null : '店铺不能为空'}
                >
                    <ShopSelector
                        value={(this.state.selections_shopsInfo.shopsInfo || []).map(shopID => String(shopID))}
                        onChange={
                            this.editBoxForShopsChange
                        }
                        canUseShops={canUseShops}
                        // schemaData={this.getDynamicShopSchema()}
                        filterParm={this.isFilterShopType() ? {productCode: 'HLL_CRM_License'} : {}}
                    />
                    {
                        queryCanUseShopStatus === 'error' && (
                            <Tooltip title={this.props.intl.formatMessage(STRING_SPE.da8ofl352k0127)}>
                                <Icon
                                    type="exclamation-circle"
                                    style={{
                                        left: '102%',
                                        top: 28,
                                        color: 'rgba(239, 72, 72, 0.81)',
                                        position: 'absolute',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => {
                                        this.queryCanuseShops(this.state.cardLevelIDList)
                                    }}
                                />
                            </Tooltip>
                        )
                    }
                    {
                        queryCanUseShopStatus === 'pending' && (
                            <Tooltip title={this.props.intl.formatMessage(STRING_SPE.db60a4a817301199)}>
                                <Icon
                                    type="loading"
                                    style={{
                                        left: '102%',
                                        top: 28,
                                        position: 'absolute'
                                    }}
                                />
                            </Tooltip>
                        )
                    }
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
        if (getExcludeCardLevelIds.length) {
            cardInfo = cardInfo.filter(cardType => !getExcludeCardLevelIds.includes(cardType.cardTypeID))
        }
        const boxData = [];
        this.state.cardLevelIDList.forEach((id) => {
            cardInfo.forEach((cat) => {
                cat.cardTypeLevelList.forEach((level) => {
                    if (level.cardLevelID === id) {
                        boxData.push(level)
                    }
                })
            })
        });
        return (
            <Form className={styles.cardLevelTree}>
                <FormItem
                    label={this.props.intl.formatMessage(STRING_SPE.d216426238818026)}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <RadioGroup onChange={this.handleRadioChange} value={`${this.state.cardLevelRangeType}`}>
                        <Radio key={'2'} value={'2'}>{`${this.props.intl.formatMessage(STRING_SPE.d1700a52800c2287)}`}</Radio>
                        <Radio key={'5'} value={'5'}>{`${this.props.intl.formatMessage(STRING_SPE.d31eif72jb0395)}`}</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem
                    label={`${this.props.intl.formatMessage(STRING_SPE.d1qe2lejcb4138)}${cardLevelRangeType == 2 ? `${this.props.intl.formatMessage(STRING_SPE.d1qe2lejcb5102)}` : `${this.props.intl.formatMessage(STRING_SPE.du380iqhn0125)}`}`}
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
                                notFoundContent={`${this.props.intl.formatMessage(STRING_SPE.d2c8a4hdjl248)}`}
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
                                outLabel={`${this.props.intl.formatMessage(STRING_SPE.du380iqhn0125)}`} //   外侧选项+号下方文案
                                outItemName="cardLevelName" //   外侧已选条目选项的label
                                outItemID="cardLevelID" //   外侧已选条目选项的value
                                innerleftTitle={`${this.props.intl.formatMessage(STRING_SPE.du380iqhn1240)}`} //   内部左侧分类title
                                innerleftLabelKey={'cardTypeName'}//   内部左侧分类对象的哪个属性为分类label
                                leftToRightKey={'cardTypeLevelList'} // 点击左侧分类，的何种属性展开到右侧
                                innerRightLabel="cardLevelName" //   内部右侧checkbox选项的label
                                innerRightValue="cardLevelID" //   内部右侧checkbox选项的value
                                innerBottomTitle={`${this.props.intl.formatMessage(STRING_SPE.dd5a318e4162103)}`} //   内部底部box的title
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
                        {this.props.intl.formatMessage(STRING_SPE.da8ofl352k60)}
                        </p>
                    ) : (eventInfo.allCardLevelCheck || excludeEvent.length > 0) && this.state.cardLevelIDList.length === 0  ? (
                        <p style={{ color: 'red', marginLeft: 110, marginTop: '-5px' }}>
                        {this.props.intl.formatMessage(STRING_SPE.du38h0lpm7158)}
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
        queryCanUseShopStatus: state.sale_specialPromotion_NEW.getIn(['addStatus', 'availableShopQueryStatus']),
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
        getEventExcludeCardTypes: (opts) => {
            dispatch(getEventExcludeCardTypes(opts))
        },
        saveCurrentCanUseShops: (opts) => {
            dispatch(saveCurrentCanUseShops(opts))
        },
        saleCenterQueryOnlineRestaurantStatus: (opts) => {
            dispatch(saleCenterQueryOnlineRestaurantStatus(opts))
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CardLevelForWX);
