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
import {
    Form,
    DatePicker,
    Select,
    Col,
    Radio,
    TreeSelect,
} from 'antd';
import {isEqual, uniq, isEmpty} from 'lodash';
import { saleCenterSetSpecialBasicInfoAC, saleCenterGetShopOfEventByDate } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import styles from '../../SaleCenterNEW/ActivityPage.less';
import SendMsgInfo from '../common/SendMsgInfo';
import CardLevel from '../common/CardLevel';
import PriceInput from '../../SaleCenterNEW/common/PriceInput';
import { queryGroupMembersList } from '../../../redux/actions/saleCenterNEW/mySpecialActivities.action';
import {
    fetchPromotionScopeInfo,
    getPromotionShopSchema
} from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action';
import EditBoxForShops from '../../SaleCenterNEW/common/EditBoxForShops';
import ShopSelector from "../../../components/common/ShopSelector";

const FormItem = Form.Item;
const Option = Select.Option;
// const RadioGroup = Radio.Group;
// const SHOW_PARENT = TreeSelect.SHOW_PARENT;
// import { SEND_MSG } from '../../../redux/actions/saleCenterNEW/types'


const moment = require('moment');

if (process.env.__CLIENT__ === true) {
    // require('../../../../client/componentsPage.less');
}

const Immutable = require('immutable');

class StepTwo extends React.Component {
    constructor(props) {
        super(props);
        const shopSchema = this.props.shopSchemaInfo.getIn(['shopSchema']).toJS();
        this.state = {
            message: '',
            cardLevelIDList: [],
            cardLevelRangeType: '0',
            giveStatus: 'success',
            consumeType: '0',
            numberValue: {
                number: '',
                modal: 'float',
            },
            _opts: {},
            shopSchema,
            occupiedShopIDs: [],
            settleUnitID: '',
            selections: [],
            selections_shopsInfo: { shopsInfo: [] },
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNumberChange = this.handleNumberChange.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.onCardLevelChange = this.onCardLevelChange.bind(this);
        this.renderShopsOptions = this.renderShopsOptions.bind(this);
        this.editBoxForShopsChange = this.editBoxForShopsChange.bind(this);
    }

    componentDidMount() {
        this.props.getSubmitFn({
            prev: undefined,
            next: this.handleSubmit,
            finish: undefined,
            cancel: undefined,
        });
        this.props.getShopSchemaInfo({groupID: this.props.user.accountInfo.groupID});
        const currentOccupiedShops = this.props.promotionBasicInfo.get('$filterShops').toJS().shopList;
        this.setState({occupiedShopIDs: currentOccupiedShops || []});

        /*if (this.props.type == '64' && !isEmpty(currentOccupiedShops) && !isEmpty(this.state.shopSchema.shops)) {
            this.filterAvailableShops(currentOccupiedShops);
        }*/

        if (this.props.type === '64') {
            const specialPromotion = this.props.specialPromotion.get('$eventInfo').toJS();
            if (specialPromotion.itemID) {
                this.props.saleCenterGetShopOfEventByDate({
                    groupID: this.props.user.accountInfo.groupID,
                    eventStartDate: specialPromotion.eventStartDate || '',
                    eventEndDate: specialPromotion.eventEndDate || '',
                    eventID: specialPromotion.itemID
                });
            }
        }

        const specialPromotion = this.props.specialPromotion.get('$eventInfo').toJS();
        if (Object.keys(specialPromotion).length > 30) {
            let addUpOpts = {};
            if (this.props.type == '62') {
                if (specialPromotion.consumeType == '0') {
                    addUpOpts = {
                        consumeType: '0',
                        numberValue: {
                            number: specialPromotion.consumeTotalAmount,
                            modal: 'float',
                        },
                    }
                } else {
                    addUpOpts = {
                        consumeType: '1',
                        numberValue: {
                            number: specialPromotion.consumeTotalTimes,
                            modal: 'int',
                        },
                    }
                }
            }
            const opts = {
                message: specialPromotion.smsTemplate,
                // cardLevelIDList: specialPromotion.cardLevelIDList,
                ...addUpOpts,
            }
            if (this.props.type == '70' || this.props.type == '64') {
                opts.selections = specialPromotion.shopIDList || [];
                opts.selections_shopsInfo = { shopsInfo: specialPromotion.shopIDList || [] };
            }
            this.setState(opts)
        }
        if (!this.props.promotionScopeInfo.getIn(['refs', 'initialized']) &&
            (this.props.type == '70' || this.props.type == '64')) {
            this.props.fetchPromotionScopeInfo({ _groupID: this.props.user.accountInfo.groupID });
        }
    }

    filterAvailableShops() {
        let dynamicShopSchema = Object.assign({}, this.state.shopSchema);
        if (dynamicShopSchema.shops.length === 0) {
            return dynamicShopSchema;
        }
        if (this.state.occupiedShopIDs.length > 0) {
            const occupiedShops = this.state.occupiedShopIDs;
            dynamicShopSchema.shops = dynamicShopSchema.shops.filter(shop => !occupiedShops.includes(shop.shopID));
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
        }
        return dynamicShopSchema;
    }

    componentWillReceiveProps(nextProps) {
        const previousSchema = this.state.shopSchema;
        const nextShopSchema = nextProps.shopSchemaInfo.getIn(['shopSchema']).toJS();
        if (!isEqual(previousSchema, nextShopSchema)) {
            this.setState({shopSchema: nextShopSchema, // 后台请求来的值
            });
        }
        if (this.props.type == '70' || this.props.type == '64') {
            if (this.props.specialPromotion.getIn(['$eventInfo', 'shopIDList']) !== nextProps.specialPromotion.getIn(['$eventInfo', 'shopIDList'])) {
                const specialPromotion = nextProps.specialPromotion.get('$eventInfo');
                const selections = specialPromotion.shopIDList || [];
                this.setState({selections});
            }
        }
        if (this.props.type == '64') {
            const currentOccupiedShops = this.props.promotionBasicInfo.get('$filterShops').toJS().shopList;
            const nextOccupiedShops = nextProps.promotionBasicInfo.get('$filterShops').toJS().shopList;
            if (!isEqual(currentOccupiedShops, nextOccupiedShops)) {
                this.setState({occupiedShopIDs: nextOccupiedShops || []});
            }
        }

        const specialPromotion = nextProps.specialPromotion.get('$eventInfo').toJS();
        const _specialPromotion = this.props.specialPromotion.get('$eventInfo').toJS();
        const cardLevelIDListChange = specialPromotion.eventStartDate != _specialPromotion.eventStartDate || specialPromotion.eventEndDate != _specialPromotion.eventEndDate;
        // 修改时,初始化state
        if (cardLevelIDListChange &&
            nextProps.specialPromotion.get('$eventInfo').size > 30) {
            let addUpOpts = {};
            if (this.props.type == '62') {
                if (specialPromotion.consumeType == '0') {
                    addUpOpts = {
                        consumeType: '0',
                        numberValue: {
                            number: specialPromotion.consumeTotalAmount,
                            modal: 'float',
                        },
                    }
                } else {
                    addUpOpts = {
                        consumeType: '1',
                        numberValue: {
                            number: specialPromotion.consumeTotalTimes,
                            modal: 'int',
                        },
                    }
                }
            }
            this.setState({
                message: specialPromotion.smsTemplate,
                ...addUpOpts,
            })
        }
    }
    handleOptionChange(value) {
        // console.log(value);
        this.setState({
            consumeType: value,
            numberValue: {
                number: '',
                modal: value == '0' ? 'float' : 'int',
            },
        }, () => {
            this.props.form.setFieldsValue({ 'give': this.state.numberValue })
        });
    }
    handleNumberChange(value) {
        // console.log(value);
        const consumeType = this.state.consumeType;
        if (consumeType == '0') { // 消费累计金额每满"
            if (value.number < 0) {
                this.setState({ giveStatus: 'error' })
            } else {
                this.setState({
                    giveStatus: 'success',
                    numberValue: {
                        number: value.number,
                        modal: 'float',
                    },
                });
            }
        } else { // 消费累计次数每满
            if (value.number < 3) {
                this.setState({ giveStatus: 'error' })
            } else {
                this.setState({
                    giveStatus: 'success',
                    numberValue: {
                        number: value.number,
                        modal: 'int',
                    },
                });
            }
        }
    }
    handleSubmit() {
        let flag = true;
        this.props.form.validateFieldsAndScroll((err1, basicValues) => {
            if (err1) {
                flag = false;
            }
        });
        if (this.state.giveStatus == 'error') {
            flag = false;
        }

        const opts = this.props.type == '70' || this.props.type == '64' ?
            {
                smsTemplate: this.state.message,
                shopIDList: this.state.selections,
                shopRange: this.state.selections.length > 0 ? 1 : 2,
            } :
            {
                cardLevelIDList: this.state.cardLevelIDList || [],
                cardLevelRangeType: this.props.type == '62' ? this.state.cardLevelRangeType : '2',
                smsTemplate: this.state.message,
            };
        if (this.props.type == '62') {
            const { consumeType, numberValue } = this.state;
            opts.consumeType = consumeType;
            consumeType == '0' ? opts.consumeTotalAmount = numberValue.number || 0 : opts.consumeTotalTimes = numberValue.number;
            if ((consumeType == '0' && numberValue.number < 0) || (consumeType == '1' && numberValue.number < 3)) {
                flag = false;
                this.setState({ giveStatus: 'error' })
            }
        }
        if (this.state.settleUnitID) {
            opts.settleUnitID = this.state.settleUnitID;
        }
        //评价送礼，已有别的活动选了个别店铺，就不能略过而全选
        const noSelected64 = this.props.type == 64 &&
            this.props.promotionBasicInfo.get('$filterShops').toJS().shopList &&
            this.props.promotionBasicInfo.get('$filterShops').toJS().shopList.length > 0 &&
            this.state.selections.length === 0
        if (flag && !noSelected64) {
            this.props.setSpecialBasicInfo(opts);
        }
        return flag && !noSelected64;
    }
    onCardLevelChange(obj) {
        this.setState(obj)
    }
    editBoxForShopsChange(val) {
        this.setState({
            selections: val,
        })
    }
    renderShopsOptions() {
        // 当有人领取礼物后，礼物不可编辑，加蒙层
        const userCount = this.props.specialPromotion.toJS().$eventInfo.userCount;
        //评价送礼，已有别的活动选了个别店铺，就不能略过而全选
        const noSelected64 = this.props.type == 64 &&
            this.props.promotionBasicInfo.get('$filterShops').toJS().shopList &&
            this.props.promotionBasicInfo.get('$filterShops').toJS().shopList.length > 0 &&
            this.state.selections.length === 0;
        const selectedShopIdStrings = this.state.selections.map(shopIdNum => String(shopIdNum));
        return (
            <div className={styles.giftWrap}>
                <Form.Item
                    label="适用店铺"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                    validateStatus={noSelected64 ? 'error' : 'success'}
                    help={noSelected64 ? '同时段内，已有评价送礼活动选择了个别店铺，因此不能略过而全选' : null}
                >
                    {/*<EditBoxForShops
                        value={this.state.selections_shopsInfo}
                        onChange={
                            this.editBoxForShopsChange
                        }
                        type={this.props.type}
                    />*/}
                    <ShopSelector
                        value={selectedShopIdStrings}
                        onChange={
                            this.editBoxForShopsChange
                        }
                        schemaData={this.filterAvailableShops()}
                    />
                </Form.Item>
                <div className={userCount > 0 && this.props.type == 64 ? styles.opacitySet : null} style={{ left: 33, width: '88%' }}></div>
            </div>
        );
    }
    render() {
        const sendFlag = true;
        const tip = this.state.consumeType == '0' ? '累计金额不得少于0元' : '累计次数不得少于3次'
        const smsGate = this.props.specialPromotion.get('$eventInfo').toJS().smsGate;
        const userCount = this.props.specialPromotion.toJS().$eventInfo.userCount;// 当有人领取礼物后，giveSelect不可编辑
        const giveSelect = (
            <Select onChange={this.handleOptionChange}
                    value={this.state.consumeType}
                    disabled={userCount > 0}
                    getPopupContainer={(node) => node.parentNode}
            >
                <Option key="0">累计金额每满</Option>
                <Option key="1">累计次数每满</Option>
            </Select>
        );
        return (
            <Form>
                {
                    this.props.type == '70' || this.props.type == '64' ? this.renderShopsOptions() : null
                }
                {
                    this.props.type == '62' ?
                        <div>
                            <FormItem
                                label={'满赠条件'}
                                className={styles.FormItemStyle}
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 17 }}
                                validateStatus={this.state.giveStatus}
                                help={this.state.giveStatus == 'success' ? null : `不可为空,且${tip}`}
                            >
                                {this.props.form.getFieldDecorator('give', {
                                    rules: [{
                                        required: true,
                                        message: '不可为空',
                                    }],
                                    initialValue: this.state.numberValue,
                                })(<PriceInput
                                    onChange={this.handleNumberChange}
                                    addonBefore={giveSelect}
                                    addonAfter={this.state.consumeType == '0' ? '元' : '次'}
                                />)
                                }
                            </FormItem>

                            <CardLevel
                                onChange={this.onCardLevelChange}
                                catOrCard={'cat'}
                                type={this.props.type}
                                form={this.props.form}
                            />
                        </div> : (this.props.type == '70' || this.props.type == '64' ? null :
                            <CardLevel
                                onChange={this.onCardLevelChange}
                                catOrCard={'card'}
                                type={this.props.type}
                                form={this.props.form}
                            />)
                }
                {
                    smsGate == '1' || smsGate == '3' ||  smsGate == '4'?
                        <SendMsgInfo
                            sendFlag={sendFlag}
                            form={this.props.form}
                            value={sendFlag ? this.state.message.trim() : this.state.message}
                            settleUnitID={this.state.settleUnitID}
                            onChange={
                                (val) => {
                                    if (val instanceof Object) {
                                        if (val.settleUnitID) {
                                            this.setState({ settleUnitID: val.settleUnitID })
                                        }
                                    } else {
                                        this.setState({ message: val });
                                    }
                                }
                            }
                        /> :
                        null
                }
            </Form>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        specialPromotion: state.sale_specialPromotion_NEW,
        user: state.user.toJS(),
        shopSchemaInfo: state.sale_shopSchema_New,
        mySpecialActivities: state.sale_mySpecialActivities_NEW.toJS(),
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        promotionBasicInfo: state.sale_promotionBasicInfo_NEW,

    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSpecialBasicInfo: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
        saleCenterGetShopOfEventByDate: opts => dispatch(saleCenterGetShopOfEventByDate(opts)),
        queryGroupMembersList: (opts) => {
            dispatch(queryGroupMembersList(opts));
        },
        fetchPromotionScopeInfo: (opts) => {
            dispatch(fetchPromotionScopeInfo(opts));
        },
        getShopSchemaInfo: opts => dispatch(getPromotionShopSchema(opts)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(StepTwo));
