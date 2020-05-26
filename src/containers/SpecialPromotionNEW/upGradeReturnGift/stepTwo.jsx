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
    Select,
    message,
} from 'antd';
import {isEqual, uniq, isEmpty} from 'lodash';
import {
    saleCenterSetSpecialBasicInfoAC,
    saleCenterGetShopOfEventByDate,
    getGroupCRMCustomAmount,
} from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import styles from '../../SaleCenterNEW/ActivityPage.less';
import SendMsgInfo from '../common/SendMsgInfo';
import CardLevel from '../common/CardLevel';
import PriceInput from '../../SaleCenterNEW/common/PriceInput';
import { queryGroupMembersList } from '../../../redux/actions/saleCenterNEW/mySpecialActivities.action';
import {
    fetchPromotionScopeInfo,
    getPromotionShopSchema
} from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action';
import ShopSelector from '../../../components/ShopSelector';
import { injectIntl } from 'i18n/common/injectDecorator'
import { STRING_SPE } from 'i18n/common/special';
import { axios } from '@hualala/platform-base';

const FormItem = Form.Item;
const Option = Select.Option;
const moment = require('moment');
@injectIntl
class StepTwo extends React.Component {
    constructor(props) {
        super(props);
        const shopSchema = this.props.shopSchemaInfo.getIn(['shopSchema']).toJS();
        const cardLevelRangeType = this.props.specialPromotion.getIn(['$eventInfo', 'cardLevelRangeType']);
        this.state = {
            message: '',
            cardLevelIDList: [],
            groupMembersList: [],
            groupMembersID: this.props.specialPromotion.getIn(['$eventInfo', 'cardGroupID']),
            cardLevelRangeType: cardLevelRangeType === undefined ? '5' : cardLevelRangeType,
            giveStatus: 'success',
            consumeType: '2',
            numberValue: {
                number: '',
                modal: 'float',
            },
            _opts: {},
            shopSchema,
            occupiedShopIDs: [],
            settleUnitID: '',
            accountNo: '',
            selections: [],
            selections_shopsInfo: { shopsInfo: [] },
            shopStatus: true,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
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
        const user = this.props.user;
        const opts = {
            _groupID: user.accountInfo.groupID, // 集团id
            pageNo: 1,
            pageSize: 1000,
        };
        this.props.queryGroupMembersList(opts);
        this.props.getShopSchemaInfo({groupID: this.props.user.accountInfo.groupID});
        const currentOccupiedShops = this.props.promotionBasicInfo.get('$filterShops').toJS().shopList;
        this.setState({occupiedShopIDs: currentOccupiedShops || []});

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
        if(specialPromotion.groupMemberID){
            this.setState({
                groupMembersID: specialPromotion.groupMemberID
            })
        }
        if (Object.keys(specialPromotion).length > 30) {
            let addUpOpts = {};
            if (this.props.type == '62') {
                if (specialPromotion.consumeType % 2 === 0) {
                    addUpOpts = {
                        consumeType: `${specialPromotion.consumeType}`,
                        numberValue: {
                            number: specialPromotion.consumeTotalAmount,
                            modal: 'float',
                        },
                    }
                } else {
                    addUpOpts = {
                        consumeType: `${specialPromotion.consumeType}`,
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
        if (!this.props.specialPromotion.get('customerCount')) {
            this.props.getGroupCRMCustomAmount()
        }
        this.loadShopSchema();
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
            // dynamicShopSchema.businessModels = dynamicShopSchema.businessModels && dynamicShopSchema.businessModels instanceof Array ? dynamicShopSchema.businessModels.filter(collection => availableBM.includes(collection.businessModel)) : [];
            dynamicShopSchema.businessModels = dynamicShopSchema.businessModels && dynamicShopSchema.businessModels instanceof Array ? dynamicShopSchema.businessModels : [];
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
        if (this.props.specialPromotion.getIn(['$eventInfo', 'cardLevelRangeType']) !== nextProps.specialPromotion.getIn(['$eventInfo', 'cardLevelRangeType'])) {
            const type = nextProps.specialPromotion.getIn(['$eventInfo', 'cardLevelRangeType']);
            this.setState({cardLevelRangeType: type === undefined ? '5' : type});
        }
        if (this.props.specialPromotion.getIn(['$eventInfo', 'cardGroupID']) !== nextProps.specialPromotion.getIn(['$eventInfo', 'cardGroupID'])) {
            this.setState({cardGroupID: nextProps.specialPromotion.getIn(['$eventInfo', 'cardGroupID'])});
        }
        if (this.props.type == '64') {
            const currentOccupiedShops = this.props.promotionBasicInfo.get('$filterShops').toJS().shopList;
            const nextOccupiedShops = nextProps.promotionBasicInfo.get('$filterShops').toJS().shopList;
            if (!isEqual(currentOccupiedShops, nextOccupiedShops)) {
                this.setState({occupiedShopIDs: nextOccupiedShops || []});
            }
        }
    }
    // 会员群体Option
    renderOptions() {
        return  this.state.groupMembersList.map((groupMembers, index) => <Option key={groupMembers.groupMembersID}>{`${groupMembers.groupMembersName}【共${groupMembers.totalMembers}人】`}</Option>);

    }
    handleOptionChange(value) {
        this.setState({
            consumeType: value,
            numberValue: {
                number: '',
                modal: value % 2 ? 'int' : 'float',
            },
        }, () => {
            this.props.form.setFieldsValue({ 'give': this.state.numberValue })
        });
    }
    handleNumberChange(value) {
        const consumeType = this.state.consumeType;
        if (consumeType % 2 === 0) { // 消费累计金额满 每满
            if (value.number < 0 || value.number === '') {
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
        } else { // 消费累计次数满 每满
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
        if (this.props.type == '62' && this.state.cardLevelRangeType == '5') {
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
        if (this.props.type == '62') {
            const { consumeType, numberValue } = this.state;
            opts.consumeType = consumeType;
            consumeType % 2 === 0 ? opts.consumeTotalAmount = numberValue.number || 0 : opts.consumeTotalTimes = numberValue.number;
            if ((consumeType % 2 === 0 && (numberValue.number < 0 || numberValue.number === '')) || (consumeType == '1' && numberValue.number < 3)) {
                flag = false;
                this.setState({ giveStatus: 'error' })
            }
        }
        const smsGate = this.props.specialPromotion.get('$eventInfo').toJS().smsGate;
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
            shopStatus: val.length > 0,
        })
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
    renderShopsOptions() {
        // 当有人领取礼物后，礼物不可编辑，加蒙层
        const userCount = this.props.specialPromotion.toJS().$eventInfo.userCount;
        //评价送礼，已有别的活动选了个别店铺，就不能略过而全选
        const noSelected64 = this.props.type == 64 &&
            this.props.promotionBasicInfo.get('$filterShops').toJS().shopList &&
            this.props.promotionBasicInfo.get('$filterShops').toJS().shopList.length > 0 &&
            this.state.selections.length === 0;
        const selectedShopIdStrings = this.state.selections.map(shopIdNum => String(shopIdNum));
        const { isRequire, shopStatus  } = this.state;
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
                    // validateStatus={noSelected64 ? 'error' : 'success'}
                    // help={noSelected64 ? `${this.props.intl.formatMessage(STRING_SPE.d1qe85eqm5087)}` : null}
                >
                    <ShopSelector
                        value={selectedShopIdStrings}
                        onChange={
                            this.editBoxForShopsChange
                        }
                        // schemaData={this.filterAvailableShops()}
                    />
                </Form.Item>
                <div className={userCount > 0 && this.props.type == 64 ? styles.opacitySet : null} style={{ left: 33, width: '88%' }}></div>
            </div>
        );
    }
    handleSelectChange(value) {
        this.setState({groupMembersID: value});
    }
    render() {
        const sendFlag = true;
        const totalCustomerCount = this.props.specialPromotion.get('customerCount');
        const tip = this.state.consumeType % 2 === 0 ? `${this.props.intl.formatMessage(STRING_SPE.d1e09r9slq0172)}` : `${this.props.intl.formatMessage(STRING_SPE.d16hh4899ii1154)}`
        const smsGate = this.props.specialPromotion.getIn(['$eventInfo', 'smsGate']);
        const userCount = this.props.specialPromotion.getIn(['$eventInfo', 'userCount']);// 当有人领取礼物后，giveSelect不可编辑
        const giveSelect = (
            <Select onChange={this.handleOptionChange}
                    value={this.state.consumeType}
                    disabled={userCount > 0}
                    getPopupContainer={(node) => node.parentNode}
            >
                <Option key="2">{this.props.intl.formatMessage(STRING_SPE.d21647505b6222102)}</Option>
                <Option key="0">{this.props.intl.formatMessage(STRING_SPE.d16hh4899ii365)}</Option>
                <Option key="3">{this.props.intl.formatMessage(STRING_SPE.de8g998md24119)}</Option>
                <Option key="1">{this.props.intl.formatMessage(STRING_SPE.de8g998md25272)}</Option>
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
                                label={`${this.props.intl.formatMessage(STRING_SPE.dk470bkjg96160)}`}
                                className={styles.FormItemStyle}
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 17 }}
                                validateStatus={this.state.giveStatus}
                                help={this.state.giveStatus == 'success' ? null : `${this.props.intl.formatMessage(STRING_SPE.d17013b4f2ba72)}${tip}`}
                            >
                                {this.props.form.getFieldDecorator('give', {
                                    rules: [{
                                        required: true,
                                        message: `${this.props.intl.formatMessage(STRING_SPE.d5g3303e750262)}`,
                                    }],
                                    initialValue: this.state.numberValue,
                                })(<PriceInput
                                    onChange={this.handleNumberChange}
                                    addonBefore={giveSelect}
                                    addonAfter={this.state.consumeType % 2 === 0 ? `${this.props.intl.formatMessage(STRING_SPE.da8omhe07g2195)}` : `${this.props.intl.formatMessage(STRING_SPE.d2164523635bb18198)}`}
                                />)
                                }
                            </FormItem>

                            {this.state.cardLevelRangeType == '5' ?
                                <FormItem
                                    label={this.props.intl.formatMessage(STRING_SPE.dd5a33b5g874114)}
                                    className={styles.FormItemStyle}
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 17 }}
                                >
                                    {this.props.form.getFieldDecorator('setgroupMembersID', {
                                        rules: [{
                                            required: true,
                                            message: `${this.props.intl.formatMessage(STRING_SPE.d7h7g9a5h130183)}`,
                                        }],
                                        initialValue: this.state.groupMembersID,
                                    })(
                                        <Select
                                            style={{ width: '100%' }}
                                            showSearch
                                            notFoundContent={`${this.props.intl.formatMessage(STRING_SPE.d2c8a4hdjl248)}`}
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                            placeholder={this.props.intl.formatMessage(STRING_SPE.d7h7g9a5h130183)}
                                            getPopupContainer={(node) => node.parentNode}
                                            onChange={this.handleSelectChange}
                                        >
                                            <Option key={'0'}>{totalCustomerCount ? `${this.props.intl.formatMessage(STRING_SPE.d2b1b731e10c6117)}${totalCustomerCount}${this.props.intl.formatMessage(STRING_SPE.de8fb5g9597216)}` : `${this.props.intl.formatMessage(STRING_SPE.d1kgd7kahd0869)}`}</Option>
                                            {this.renderOptions()}
                                        </Select>
                                    )
                                    }
                                </FormItem>:
                                <CardLevel
                                onChange={this.onCardLevelChange}
                                catOrCard={'cat'}
                                type={this.props.type}
                                form={this.props.form}
                            />}
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
        getGroupCRMCustomAmount: opts => dispatch(getGroupCRMCustomAmount(opts)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(StepTwo));
