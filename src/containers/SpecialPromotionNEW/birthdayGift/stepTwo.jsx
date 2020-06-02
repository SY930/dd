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
import { Form, Icon, Select, Radio, message } from 'antd';
import { isEqual, uniq } from 'lodash';
import Immutable from 'immutable'
import { axios } from '@hualala/platform-base';
import { axiosData } from '../../../helpers/util';
import styles from '../../SaleCenterNEW/ActivityPage.less';
import {
    saleCenterSetSpecialBasicInfoAC,
    saveCurrentcanUseShopIDs,
    getEventExcludeCardTypes,
    getGroupCRMCustomAmount } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import SendMsgInfo from '../common/SendMsgInfo';
import CardLevel from '../common/CardLevel';
import { queryGroupMembersList } from '../../../redux/actions/saleCenterNEW/mySpecialActivities.action';
import {
    getPromotionShopSchema,
} from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action';
import ShopSelector from '../../../components/ShopSelector';
import BirthdayCardLevelSelector from './BirthdayCardLevelSelector';
import ExcludeCardTable from '../common/ExcludeCardTable';
import { injectIntl } from 'i18n/common/injectDecorator'
import { STRING_SPE } from 'i18n/common/special';




const RadioGroup = Radio.Group;

const FormItem = Form.Item;
const Option = Select.Option;
@injectIntl
class StepTwo extends React.Component {
    constructor(props) {
        super(props);
        const cardLevelIDList = props.specialPromotion.getIn(['$eventInfo', 'cardLevelIDList']);
        let cardLevelRangeType = props.specialPromotion.getIn(['$eventInfo', 'cardLevelRangeType']);
        const shopSchema = this.props.shopSchemaInfo.getIn(['shopSchema']).toJS();
        if (cardLevelRangeType === undefined) {
            cardLevelRangeType = props.type == '51' ? '5' : '0';
        }
        this.state = {
            getExcludeCardLevelIds: [],
            message: '',
            settleUnitID: '',
            accountNo: '',
            cardLevelIDList: Immutable.List.isList(cardLevelIDList) ? cardLevelIDList.toJS() : [],
            groupMembersID: this.props.specialPromotion.getIn(['$eventInfo', 'cardGroupID']),
            groupMembersList: [],
            cardLevelRangeType: cardLevelRangeType,
            shopSchema,
            cardTypeShopList: {},
            canUseShopIDs: [],
            canUseShopIDsAll: [],
            occupiedShops: [], // 已经被占用的卡类适用店铺id
            shopIDList: this.props.specialPromotion.getIn(['$eventInfo', 'shopIDList'], Immutable.fromJS([])).toJS() || [],
            excludeCardTypeShops: [],
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.onCardLevelChange = this.onCardLevelChange.bind(this);
        this.onHandleSelect = this.onHandleSelect.bind(this);
    }
    componentDidMount() {
        this.props.getSubmitFn({
            prev: undefined,
            next: this.handleSubmit,
            finish: undefined,
            cancel: undefined,
        });
        const specialPromotion = this.props.specialPromotion.get('$eventInfo').toJS();
        if(specialPromotion.groupMemberID){
            this.setState({
                groupMembersID: specialPromotion.groupMemberID
            })
        }
        const user = this.props.user;
        this.props.queryGroupMembersList({
            _groupID: user.accountInfo.groupID,
            pageNo: 1,
            pageSize: 1000,
        });
        if (this.props.type == '52') {
            this.props.getShopSchemaInfo({ groupID: this.props.user.accountInfo.groupID });
            this.props.getEventExcludeCardTypes({
                groupID: this.props.user.accountInfo.groupID,
                eventStartDate: '20000625',
                eventEndDate: '21000531',
                eventWay: '52',
                itemID: specialPromotion.itemID || ''
            });
            this.querycanUseShopIDs()
        }
        if (Object.keys(specialPromotion).length > 10) {
            this.setState({
                message: specialPromotion.smsTemplate,
            })
        }
        if (!this.props.specialPromotion.get('customerCount')) {
            this.props.getGroupCRMCustomAmount()
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.type == '52') {
            const previousSchema = this.state.shopSchema;
            const nextShopSchema = nextProps.shopSchemaInfo.getIn(['shopSchema']).toJS();
            if (!isEqual(previousSchema, nextShopSchema)) {
                this.setState({ shopSchema: nextShopSchema, // 后台请求来的值
                });
            }
            // 遍历所有排除卡
            if (this.props.specialPromotion.getIn(['$eventInfo', 'excludeCardTypeIDs'])
                !== nextProps.specialPromotion.getIn(['$eventInfo', 'excludeCardTypeIDs'])) {
                this.setState({ getExcludeCardLevelIds: nextProps.specialPromotion.getIn(['$eventInfo', 'excludeCardTypeIDs']).toJS() }, () => {
                    const { getExcludeCardLevelIds } = this.state
                    this.filterHasCardShop(getExcludeCardLevelIds)
                })
            }
            if (this.props.specialPromotion.getIn(['$eventInfo', 'excludeCardTypeShops'])
                !== nextProps.specialPromotion.getIn(['$eventInfo', 'excludeCardTypeShops'])) {
                const occupiedShops = nextProps.specialPromotion.getIn(['$eventInfo', 'excludeCardTypeShops']).toJS().reduce((acc, curr) => {
                    acc.push(...(curr.shopIDList || []).map(id => `${id}`)); // 把shopID转成string, 因为基本档返回的是string
                    return acc;
                }, []);
                this.setState({
                occupiedShops,
                excludeCardTypeShops: nextProps.specialPromotion.getIn(['$eventInfo', 'excludeCardTypeShops']).toJS()
                })
            }
        }
        if (this.props.specialPromotion.getIn(['$eventInfo', 'smsTemplate']) !== nextProps.specialPromotion.getIn(['$eventInfo', 'smsTemplate']) &&
            nextProps.specialPromotion.get('$eventInfo').size > 10) {
            const specialPromotion = nextProps.specialPromotion.get('$eventInfo').toJS();
            this.setState({
                message: specialPromotion.smsTemplate,
            })
        }
        if (this.props.type == '51') {
            // 获取会员等级信息
            if (nextProps.mySpecialActivities.$groupMembers) {
                if (nextProps.mySpecialActivities.$groupMembers.groupMembersList instanceof Array && nextProps.mySpecialActivities.$groupMembers.groupMembersList.length > 0) {
                    this.setState({
                        groupMembersList: nextProps.mySpecialActivities.$groupMembers.groupMembersList,
                    })
                } else {
                    this.setState({
                        groupMembersList: [],
                    })
                }
            }
            if (this.props.specialPromotion.getIn(['$eventInfo', 'cardGroupID']) !== nextProps.specialPromotion.getIn(['$eventInfo', 'cardGroupID'])) {
                this.setState({ cardGroupID: nextProps.specialPromotion.getIn(['$eventInfo', 'cardGroupID']) });
            }
        }
    }
    onCardLevelChange(obj) {
        this.setState(obj)
        // const { cardLevelIDList } = obj;
        // this.querycanUseShopIDs(cardLevelIDList)
    }
    onHandleSelect(obj) {
        if (obj && obj.cardLevelIDList) {
            const { cardLevelIDList } = obj
            // 根据卡类筛选店铺
            const { cardTypeShopList, canUseShopIDsAll } = this.state
            if (cardLevelIDList.length === 0) {
                this.setState({
                    canUseShopIDs: canUseShopIDsAll,
                })
                return
            }
            const shopIDs = []
            cardLevelIDList.forEach((item) => {
                if (cardTypeShopList[item]) {
                    shopIDs.push(...cardTypeShopList[item])
                }
            })
            this.setState({
                canUseShopIDs: shopIDs,
            })
            // 清空当前选择的店铺
            this.setState({
                shopIDList: [],
            })
        }
    }
    handleSubmit() {
        let flag = true;
        const smsGate = this.props.specialPromotion.toJS().$eventInfo.smsGate;
        this.props.form.validateFieldsAndScroll((err1) => {
            if (err1) {
                flag = false;
            }
        });
        const opts = {
            smsTemplate: smsGate == '1' || smsGate == '3' || smsGate == '4' ? this.state.message : '',
            cardLevelIDList: this.state.cardLevelIDList || [],
            cardLevelRangeType: this.state.cardLevelRangeType,
        };
        if (this.props.type == '51' && this.state.cardLevelRangeType == 5) {
            if (!this.state.groupMembersID) {
                this.props.form.setFields({
                    setgroupMembersID: {
                        errors: [new Error(`${this.props.intl.formatMessage(STRING_SPE.d7h7g9a5h130183)}`)],
                    },
                });
                return false;
            } else {
                opts.cardGroupID = this.state.groupMembersID;
            }
        }
        if (smsGate == '1' || smsGate == '3' || smsGate == '4') {
            if (this.state.settleUnitID > 0 || this.state.accountNo > 0) {
                opts.settleUnitID = this.state.settleUnitID;
                opts.accountNo = this.state.accountNo;
            } else {
                message.warning(`${this.props.intl.formatMessage(STRING_SPE.d34iceo4ec1176)}`)
                return false;
            }
        } else {
            opts.settleUnitID = '0';
            opts.accountNo = '0';
        }
        // 开卡增礼品加适用店铺
        if (this.props.type == '52') {
            const { shopIDList, canUseShopIDs } = this.state
            opts.shopIDList = shopIDList
            opts.canUseShopIDs = this.state.canUseShopIDs
            opts.shopRange = opts.shopIDList.length > 0 ? 1 : 2
        }
        this.props.setSpecialBasicInfo(opts);
        return flag;
    }
    // 会员群体Option
    renderOptions() {
        return  this.state.groupMembersList.map((groupMembers, index) => (
            <Option key={groupMembers.groupMembersID}>{`${groupMembers.groupMembersName}【${this.props.intl.formatMessage(STRING_SPE.de8fb5g9592274)}${groupMembers.totalMembers}${this.props.intl.formatMessage(STRING_SPE.d170093144c13204)}】`}</Option>
        ));
    }
    handleSelectChange(value) {
        this.setState({ groupMembersID: value });
    }

    renderMemberGroup() {
        const totalCustomerCount = this.props.specialPromotion.get('customerCount');
        return (
            <FormItem
                label={this.props.intl.formatMessage(STRING_SPE.dd5a33b5g874114)}
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >
                {this.props.form.getFieldDecorator('setgroupMembersID', {
                    rules: [{
                        required: true,
                        message: `${this.props.intl.formatMessage(STRING_SPE.d2b1b731e10c5106)}`,
                    }],
                    initialValue: this.state.groupMembersID,
                })(
                    <Select
                        showSearch
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        style={{ width: '100%' }}
                        placeholder={this.props.intl.formatMessage(STRING_SPE.d7h7g9a5h130183)}
                        getPopupContainer={(node) => node.parentNode}
                        onChange={this.handleSelectChange}
                    >
                        <Option key={'0'}>{totalCustomerCount ? `${this.props.intl.formatMessage(STRING_SPE.d2b1b731e10c6117)}${totalCustomerCount}${this.props.intl.formatMessage(STRING_SPE.de8fb5g9597216)}` : `${this.props.intl.formatMessage(STRING_SPE.d1kgd7kahd0869)}`}</Option>
                        {this.renderOptions()}
                    </Select>
                )}
            </FormItem>
        )
    }
    handleGroupOrCatRadioChange = (e) => {
        const type = e.target.value;
        this.setState({
            cardLevelRangeType: type,
            cardLevelIDList: [],
            groupMembersID: undefined,
        })
        this.props.setSpecialBasicInfo({ cardLevelIDList: [] });
    }

    handleSourceWayLimitChange = (v) => {
        this.props.setSpecialBasicInfo({ sourceWayLimit: v });
    }

    renderBirthDayGroupSelector() {
        const {
            form: {
                getFieldDecorator,
            }
        } = this.props;
        // 控制小红点
        const eventInfo = this.props.specialPromotion.get('$eventInfo').toJS();
        const excludeEvent = eventInfo.excludeEventCardLevelIdModelList || [];
        const { cardLevelRangeType } = this.state;
        let localType = '0';
        if (cardLevelRangeType == 5) {
            localType = '5';
        } else if (cardLevelRangeType == 6) {
            localType = '6';
        }
        return (
            <div>
                <FormItem label={`${this.props.intl.formatMessage(STRING_SPE.d216426238818026)}`} className={styles.FormItemStyle} labelCol={{ span: 4 }} wrapperCol={{ span: 17 }}>
                    <RadioGroup onChange={this.handleGroupOrCatRadioChange} value={`${localType}`}>
                        <Radio key={'5'} value={'5'}>{this.props.intl.formatMessage(STRING_SPE.dd5a33b5g874114)}</Radio>
                        <Radio key={'0'} value={'0'}>{this.props.intl.formatMessage(STRING_SPE.d170093144c11061)}</Radio>
                        <Radio key={'6'} value={'6'}>{this.props.intl.formatMessage(STRING_SPE.dk45j2cah011173)}</Radio>
                    </RadioGroup>
                </FormItem>
                {localType === '5' && this.renderMemberGroup()}
                {localType === '0' && (
                    <CardLevel
                        cardLevelRangeType={cardLevelRangeType}
                        onChange={this.onCardLevelChange}
                        label={this.props.intl.formatMessage(STRING_SPE.d170093144c212281)}
                        cusAllLabel={this.props.intl.formatMessage(STRING_SPE.dk45j2cah113227)}
                        cusPartialLabel={this.props.intl.formatMessage(STRING_SPE.d34iceo4ed14114)}
                        cusSelectorLabel={this.props.intl.formatMessage(STRING_SPE.d5671378cd581539)}
                        catOrCard="cat"
                        type={this.props.type}
                        form={this.props.form}
                    />
                )}
                {
                    localType === '6' && (
                        <div>
                            <FormItem
                                label={this.props.intl.formatMessage(STRING_SPE.d5g31n12fm1627)}
                                className={[styles.FormItemStyle, styles.cardLevelTree].join(' ')}
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 17 }}
                            >
                                {getFieldDecorator('cardLevelIDList', {
                                    rules: [{
                                        required: true,
                                        message: `${this.props.intl.formatMessage(STRING_SPE.d1e04j2h621796)}`,
                                    }],
                                    initialValue: this.state.cardLevelIDList,
                                    onChange: (v) => this.setState({cardLevelIDList: v})
                                })(
                                    <BirthdayCardLevelSelector />
                                )}
                                {
                                    !eventInfo.allCardLevelCheck && excludeEvent.length == 0 ? null :

                                        <Icon
                                            style={{ top: 30}}
                                            type="exclamation-circle" className={styles.cardLevelTreeIcon}
                                            onClick={() => {
                                                this.setState({ tableDisplay: !this.state.tableDisplay })
                                            }}
                                        />
                                }
                            </FormItem>
                            {
                                !eventInfo.allCardLevelCheck && excludeEvent.length == 0 ? null :
                                    <div style={{ display: this.state.tableDisplay ? 'block' : 'none', width: '71%', marginLeft: '110px' }}>
                                        <ExcludeCardTable catOrCard={this.props.catOrCard} />
                                    </div>
                            }
                        </div>
                    )
                }
            </div>
        )
    }
    editBoxForShopsChange = (shops) => {
        // 保存适用店铺
        this.setState({
            shopIDList: shops,
            shopStatus: shops.length > 0,
        })
        // console.log(shops);
    }
    // 过滤已有卡类的店铺
    filterHasCardShop = (cardList) => {
        const { cardTypeShopList } = this.state
        cardList.forEach((item) => {
            delete cardTypeShopList[item];
        })
        const shopIDs = []
        Object.keys(cardTypeShopList).forEach((item) => {
            shopIDs.push(...cardTypeShopList[item])
        })
        this.setState({
            cardTypeShopList,
            canUseShopIDsAll: [...shopIDs],
        }, () => {
            // 新增页面初始化店铺数据
            if (this.props.isNew) {
                this.initShopData(2)
            }
        })
    }
    // 查询已选卡类型的可用店铺
    querycanUseShopIDs = (tids = []) => {
        console.log('tids', tids);
        axiosData('/crm/cardTypeShopService_getListCardTypeShop.ajax', {
            groupID: this.props.user.accountInfo.groupID,
            queryCardType: 1, // questArr.length === 0 ? 0 : 1,
            cardTypeIds: tids.join(','),
        }, null, { path: 'data.cardTypeShopList' })
            .then((cardTypeShopList) => {
                const obj = {}
                const canUseShopIDsAll = []
                cardTypeShopList.forEach((item) => {
                    const shopIDs = []
                    item.cardTypeShopResDetailList.forEach((element) => {
                        shopIDs.push(String(element.shopID))
                        canUseShopIDsAll.push(String(element.shopID))
                    })
                    obj[String(item.cardTypeID)] = shopIDs
                })
                this.setState({
                    cardTypeShopList: obj,
                    canUseShopIDsAll,
                }, () => {
                    this.initShopData(1)
                })
            }).catch(err => {
            })
    }
    // 初始化店铺数据
    initShopData = (v) => {
        // 根据卡类筛选店铺
        const { cardLevelIDList, cardTypeShopList, canUseShopIDsAll } = this.state
        const shopIDs = []
        cardLevelIDList.forEach((item) => {
            if (cardTypeShopList[item]) {
                shopIDs.push(...cardTypeShopList[item])
            }
        })
        this.setState({
            canUseShopIDs: shopIDs.length === 0 && cardLevelIDList.length === 0 ? canUseShopIDsAll : shopIDs, // 没有选卡类所有店铺都可选
        })
    }
    filterAvailableShops() {
        let dynamicShopSchema = Object.assign({}, this.state.shopSchema);
        if (dynamicShopSchema.shops.length === 0) {
            return dynamicShopSchema;
        }
        let occupiedShops = []
        const { canUseShopIDs, excludeCardTypeShops, cardLevelIDList } = this.state;
        if(cardLevelIDList.length !== 0){
          cardLevelIDList.forEach((item) => {
            excludeCardTypeShops.forEach((excludeShop) => {
              if(excludeShop.cardTypeID === item) {
                occupiedShops.push(...excludeShop.shopIDList.map(id => `${id}`))
              }
            })
          })
        }
        dynamicShopSchema.shops = dynamicShopSchema.shops.filter(shop => !occupiedShops.includes(`${shop.shopID}`) && canUseShopIDs.includes(`${shop.shopID}`));
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
        dynamicShopSchema.businessModels = dynamicShopSchema.businessModels && dynamicShopSchema.businessModels instanceof Array ? dynamicShopSchema.businessModels: [];
        dynamicShopSchema.citys = dynamicShopSchema.citys && dynamicShopSchema.citys instanceof Array ? dynamicShopSchema.citys.filter(collection => availableCities.includes(collection.cityID)) : [];
        dynamicShopSchema.shopCategories = dynamicShopSchema.shopCategories && dynamicShopSchema.shopCategories instanceof Array ? dynamicShopSchema.shopCategories.filter(collection => availableCategories.includes(collection.shopCategoryID)) : [];
        dynamicShopSchema.brands = dynamicShopSchema.brands && dynamicShopSchema.brands instanceof Array ? dynamicShopSchema.brands.filter(brandCollection => availableBrands.includes(brandCollection.brandID)) : [];
        return dynamicShopSchema;
    }
    renderShopsOptions() {
        const { shopIDList, isRequire, shopStatus, canUseShopIDs } = this.state
        const selectedShopIdStrings = shopIDList.map(shopIdNum => String(shopIdNum));
        return (
            <Form.Item
                label={this.props.intl.formatMessage(STRING_SPE.db60a0b75aca181)}
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >
                <ShopSelector
                    value={selectedShopIdStrings}
                    onChange={
                        this.editBoxForShopsChange
                    }
                    canUseShops={canUseShopIDs}
                />
            </Form.Item>
        );
    }
    render() {
        const { cardLevelRangeType, getExcludeCardLevelIds = [] } = this.state;
        const info = this.props.specialPromotion.get('$eventInfo').toJS();
        const sendFlag = info.smsGate == '1' || info.smsGate == '3' || info.smsGate == '4';
        return (
            <div>
                {
                    this.props.type == '52' && (
                        <FormItem label={`${this.props.intl.formatMessage(STRING_SPE.du382scl819184)}`} className={styles.FormItemStyle} labelCol={{ span: 4 }} wrapperCol={{ span: 17 }}>
                            <Select onChange={this.handleSourceWayLimitChange}
                                    value={String(info.sourceWayLimit || '0')}
                                    placeholder={this.props.intl.formatMessage(STRING_SPE.dojv2jin820221)}
                                    getPopupContainer={(node) => node.parentNode}
                            >
                                <Option key="0" value="0">{this.props.intl.formatMessage(STRING_SPE.d31ei98dbgi21253)}</Option>
                                <Option key="1" value="1">{this.props.intl.formatMessage(STRING_SPE.d2b1b731e10d2291)}</Option>
                                <Option key="2" value="2">{this.props.intl.formatMessage(STRING_SPE.d170093144c223129)}</Option>
                            </Select>
                        </FormItem>
                    )
                }
                {this.props.type == '51' ? this.renderBirthDayGroupSelector() : (
                    <CardLevel
                        onChange={this.onCardLevelChange}
                        onHandleSelect={this.onHandleSelect}
                        catOrCard="cat"
                        type={this.props.type}
                        form={this.props.form}
                        getExcludeCardLevelIds={getExcludeCardLevelIds}
                    />
                )}
                {
                    this.props.type == '52' && cardLevelRangeType == '2' ? this.renderShopsOptions() : null
                }
                <SendMsgInfo
                    sendFlag={sendFlag}
                    form={this.props.form}
                    value={this.state.message}
                    settleUnitID={this.state.settleUnitID}
                    onChange={
                        (val) => {
                            if (val instanceof Object) {
                                if (val.settleUnitID) {
                                    this.setState({ settleUnitID: val.settleUnitID })
                                }
                                if (val.accountNo) {
                                    this.setState({ accountNo: val.accountNo })
                                }
                            } else {
                                this.setState({ message: val });
                            }
                        }
                    }
                />
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        specialPromotion: state.sale_specialPromotion_NEW,
        user: state.user.toJS(),
        mySpecialActivities: state.sale_mySpecialActivities_NEW.toJS(),
        shopSchemaInfo: state.sale_shopSchema_New,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSpecialBasicInfo: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
        queryGroupMembersList: (opts) => {
            dispatch(queryGroupMembersList(opts));
        },
        getShopSchemaInfo: opts => dispatch(getPromotionShopSchema(opts)),
        saveCurrentcanUseShopIDs: (opts) => {
            dispatch(saveCurrentcanUseShopIDs(opts))
        },
        getEventExcludeCardTypes: (opts) => {
            dispatch(getEventExcludeCardTypes(opts))
        },
        getGroupCRMCustomAmount: opts => dispatch(getGroupCRMCustomAmount(opts)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(StepTwo));
