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
import { Form, Select, Radio, message } from 'antd';
import {isEqual, uniq, isEmpty} from 'lodash';
import { axiosData } from '../../../helpers/util';
import styles from '../../SaleCenterNEW/ActivityPage.less';
import { saleCenterSetSpecialBasicInfoAC, saveCurrentcanUseShopIDs, getEventExcludeCardTypes } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
// import styles from '../../SaleCenterNEW/ActivityPage.less';
import SendMsgInfo from '../common/SendMsgInfo';
import CardLevel from '../common/CardLevel';
import {queryGroupMembersList} from "../../../redux/actions/saleCenterNEW/mySpecialActivities.action";
import {
  getPromotionShopSchema
} from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action';
import ShopSelector from "../../../components/common/ShopSelector";
const RadioGroup = Radio.Group;

const FormItem = Form.Item;
const Option = Select.Option;

class StepTwo extends React.Component {
    constructor(props) {
        super(props);
        let cardLevelRangeType = props.specialPromotion.getIn(['$eventInfo', 'cardLevelRangeType']);
        const shopSchema = this.props.shopSchemaInfo.getIn(['shopSchema']).toJS();
        if (cardLevelRangeType === undefined) {
            cardLevelRangeType = props.type == '51' ? '5' : '0';
        }
        this.state = {
            message: '',
            settleUnitID: '',
            accountNo: '',
            cardLevelIDList: [],
            groupMembersID: this.props.specialPromotion.getIn(['$eventInfo', 'cardGroupID']),
            groupMembersList: [],
            cardLevelRangeType: cardLevelRangeType,
            shopSchema,
            cardTypeShopList: {},
            canUseShopIDs: [],
            canUseShopIDsAll: [],
            occupiedShops: [], // 已经被占用的卡类适用店铺id
            shopIDList: this.props.specialPromotion.getIn(['$eventInfo', 'shopIDList']) || []
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.onCardLevelChange = this.onCardLevelChange.bind(this);
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
                        errors: [new Error('请选择会员群体')],
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
                message.warning('短信权益账户不得为空')
                return false;
            }
        } else {
            opts.settleUnitID = '0';
            opts.accountNo = '0';
        }
        // 开卡增礼品加适用店铺
        if(this.props.type == '52') {
          opts.shopIDList = this.state.shopIDList
          opts.canUseShopIDs = this.state.canUseShopIDs
        }
        this.props.setSpecialBasicInfo(opts);
        return flag;
    }
    onCardLevelChange(obj) {
        this.setState(obj, () => {
          if(obj && obj.cardLevelIDList) {
            // 根据卡类筛选店铺
            const { cardLevelIDList, cardTypeShopList, canUseShopIDsAll } = this.state
            let shopIDs = []
            cardLevelIDList.forEach(item => {
              if(cardTypeShopList[item]) {
                shopIDs.push(...cardTypeShopList[item])
              }
            })
            this.setState({
              canUseShopIDs: shopIDs.length === 0 ? canUseShopIDsAll : shopIDs // 没有选卡类所有店铺都可选
            })
            // if(this.props.isNew) {
            //   // 清空当前选择的店铺
            //   this.setState({
            //     shopIDList: []
            //   })
            // }
          }
        })
    }
    componentDidMount() {
        this.props.getSubmitFn({
            prev: undefined,
            next: this.handleSubmit,
            finish: undefined,
            cancel: undefined,
        });
        const specialPromotion = this.props.specialPromotion.get('$eventInfo').toJS();
        const user = this.props.user;
        const opts = {
            _groupID: user.accountInfo.groupID, // 集团id
            pageNo: 1,
            pageSize: 1000,
        };
        // 设置适用店铺
        this.setState({
          shopIDList: specialPromotion.shopIDList || []
        })
        this.props.queryGroupMembersList(opts);
        this.props.getShopSchemaInfo({groupID: this.props.user.accountInfo.groupID});
        this.props.getEventExcludeCardTypes({
          groupID: this.props.user.accountInfo.groupID,
          eventEndDate: "20000625",
          eventStartDate: "21000531",
          eventWay: '52'
        });
        this.querycanUseShopIDs()
        if (Object.keys(specialPromotion).length > 10) {
            this.setState({
                message: specialPromotion.smsTemplate,
                // cardLevelIDList: specialPromotion.cardLevelIDList,
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        const previousSchema = this.state.shopSchema;
        const nextShopSchema = nextProps.shopSchemaInfo.getIn(['shopSchema']).toJS();
        if (!isEqual(previousSchema, nextShopSchema)) {
            this.setState({shopSchema: nextShopSchema, // 后台请求来的值
            });
        }
        // 遍历所有排除卡
        if (this.props.specialPromotion.getIn(['$eventInfo', 'excludeCardTypeIDs'])
            !== nextProps.specialPromotion.getIn(['$eventInfo', 'excludeCardTypeIDs'])) {
            // true全部占用
            this.setState({ getExcludeCardLevelIds: nextProps.specialPromotion.getIn(['$eventInfo', 'excludeCardTypeIDs']).toJS() }, () => {
              const { getExcludeCardLevelIds } = this.state
              this.filterHasCardShop(getExcludeCardLevelIds)
            })
        }
        if (this.props.specialPromotion.getIn(['$eventInfo', 'excludeCardTypeShops'])
            !== nextProps.specialPromotion.getIn(['$eventInfo', 'excludeCardTypeShops'])) {
            const occupiedShops = nextProps.specialPromotion.getIn(['$eventInfo', 'excludeCardTypeShops']).toJS().reduce((acc, curr) => {
                acc.push(...curr.shopIDList.map(id => `${id}`)); // 把shopID转成string, 因为基本档返回的是string
                return acc;
            }, []);
            this.setState({ occupiedShops })
        }
        if (this.props.specialPromotion.getIn(['$eventInfo', 'smsTemplate']) !== nextProps.specialPromotion.getIn(['$eventInfo', 'smsTemplate']) &&
            nextProps.specialPromotion.get('$eventInfo').size > 10) {
            const specialPromotion = nextProps.specialPromotion.get('$eventInfo').toJS();
            this.setState({
                message: specialPromotion.smsTemplate,
            })
        }
        if (this.props.type == '51' ) {
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
                this.setState({cardGroupID: nextProps.specialPromotion.getIn(['$eventInfo', 'cardGroupID'])});
            }
        }
    }
    // 会员群体Option
    renderOptions() {
        return  this.state.groupMembersList.map((groupMembers, index) => <Option key={groupMembers.groupMembersID}>{`${groupMembers.groupMembersName}【共${groupMembers.totalMembers}人】`}</Option>);

    }
    handleSelectChange(value) {
        this.setState({groupMembersID: value});
    }

    renderMemberGroup() {
        return (
            <FormItem
                label="会员群体"
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >
                {this.props.form.getFieldDecorator('setgroupMembersID', {
                    rules: [{
                        required: true,
                        message: '请选择会员群体',
                    }],
                    initialValue: this.state.groupMembersID,
                })(
                    <Select
                        style={{ width: '100%' }}
                        placeholder="请选择会员群体"
                        getPopupContainer={(node) => node.parentNode}
                        onChange={this.handleSelectChange}
                    >
                        <Option key={'0'}>全部会员</Option>
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
    }

    handleSourceWayLimitChange = (v) => {
        this.props.setSpecialBasicInfo({ sourceWayLimit: v });
    }

    renderBirthDayGroupSelector() {
        const { cardLevelRangeType } = this.state;
        const localType = cardLevelRangeType == 5 ? '5' : '0'
        return (
            <div>
                <FormItem label={'会员范围'} className={styles.FormItemStyle} labelCol={{ span: 4 }} wrapperCol={{ span: 17 }}>
                    <RadioGroup onChange={this.handleGroupOrCatRadioChange} value={`${localType}`}>
                        <Radio key={'5'} value={'5'}>会员群体</Radio>
                        <Radio key={'0'} value={'0'}>会员卡类</Radio>
                    </RadioGroup>
                </FormItem>
                {cardLevelRangeType == 5 && this.renderMemberGroup()}
                {cardLevelRangeType != 5 && (
                    <CardLevel
                        cardLevelRangeType={cardLevelRangeType}
                        onChange={this.onCardLevelChange}
                        label="适用卡类"
                        cusAllLabel="不限"
                        cusPartialLabel="部分卡类"
                        cusSelectorLabel="选择卡类"
                        catOrCard="cat"
                        type={this.props.type}
                        form={this.props.form}
                    />
                )}
            </div>
        )
    }
    editBoxForShopsChange = (shops) => {
      // 保存适用店铺
      this.setState({
        shopIDList: shops
      })
      // console.log(shops);
    }
    // 过滤已有卡类的店铺
    filterHasCardShop = (cardList) => {
      const { cardTypeShopList, canUseShopIDsAll } = this.state
      cardList.forEach(item => {
        delete cardTypeShopList[item];
      })
      let shopIDs = []
      Object.keys(cardTypeShopList).forEach((item) => {
        shopIDs.push(...cardTypeShopList[item])
      })
      this.setState({
        cardTypeShopList,
        canUseShopIDsAll: [...shopIDs],
      }, () => {
        // 新增页面初始化店铺数据
        if(this.props.isNew) {
          this.initShopData(2)
        }
      })
    }
    // 查询已选卡类型的可用店铺
    querycanUseShopIDs = () => {
        axiosData('/crm/cardTypeShopService_getListCardTypeShop.ajax', {
            groupID: this.props.user.accountInfo.groupID,
            queryCardType: 1// questArr.length === 0 ? 0 : 1,
        }, null, { path: 'data.cardTypeShopList' })
            .then(cardTypeShopList => {
              let obj = {}
              let canUseShopIDsAll = []
              cardTypeShopList.forEach(item => {
                let shopIDs = []
                item.cardTypeShopResDetailList.forEach(element => {
                  shopIDs.push(String(element.shopID))
                  canUseShopIDsAll.push(String(element.shopID))
                })
                obj[String(item.cardTypeID)] = shopIDs
              })
              this.setState({
                cardTypeShopList: obj,
                canUseShopIDsAll
              }, () =>{
                this.initShopData(1)
              })
            }).catch(err => {
            })
    }
    // 初始化店铺数据
    initShopData = (v) => {
      // 根据卡类筛选店铺
      const { cardLevelIDList, cardTypeShopList, canUseShopIDsAll } = this.state
      let shopIDs = []
      cardLevelIDList.forEach(item => {
        if(cardTypeShopList[item]) {
          shopIDs.push(...cardTypeShopList[item])
        }
      })
      this.setState({
        canUseShopIDs: shopIDs.length === 0 ? canUseShopIDsAll : shopIDs // 没有选卡类所有店铺都可选
      })
    }
    filterAvailableShops() {
      let dynamicShopSchema = Object.assign({}, this.state.shopSchema);
      if (dynamicShopSchema.shops.length === 0) {
          return dynamicShopSchema;
      }
      
      const { canUseShopIDs, occupiedShops } = this.state;
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
      dynamicShopSchema.businessModels = dynamicShopSchema.businessModels && dynamicShopSchema.businessModels instanceof Array ? dynamicShopSchema.businessModels.filter(collection => availableBM.includes(collection.businessModel)) : [];
      dynamicShopSchema.citys = dynamicShopSchema.citys && dynamicShopSchema.citys instanceof Array ? dynamicShopSchema.citys.filter(collection => availableCities.includes(collection.cityID)) : [];
      dynamicShopSchema.shopCategories = dynamicShopSchema.shopCategories && dynamicShopSchema.shopCategories instanceof Array ? dynamicShopSchema.shopCategories.filter(collection => availableCategories.includes(collection.shopCategoryID)) : [];
      dynamicShopSchema.brands = dynamicShopSchema.brands && dynamicShopSchema.brands instanceof Array ? dynamicShopSchema.brands.filter(brandCollection => availableBrands.includes(brandCollection.brandID)) : [];
      return dynamicShopSchema;
    }
    renderShopsOptions() {
        const { shopIDList } = this.state
        const selectedShopIdStrings = shopIDList.map(shopIdNum => String(shopIdNum));
        // const selectedShopIdStrings = this.state.selections.map(shopIdNum => String(shopIdNum));
        return (
            // <div className={styles.giftWrap}>
                <Form.Item
                    label="适用店铺"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                    // validateStatus={noSelected64 ? 'error' : 'success'}
                    // help={noSelected64 ? '同时段内，已有评价送礼活动选择了个别店铺，因此不能略过而全选' : null}
                >
                    <ShopSelector
                        value={selectedShopIdStrings}
                        onChange={
                            this.editBoxForShopsChange
                        }
                        schemaData={this.filterAvailableShops()}
                    />
                </Form.Item>
                // {/* <div className={userCount > 0 && this.props.type == 64 ? styles.opacitySet : null} style={{ left: 33, width: '88%' }}></div> */}
            // </div>
        );
    }
    render() {
        const { cardLevelRangeType } = this.state;
        const info = this.props.specialPromotion.get('$eventInfo').toJS();
        const sendFlag = info.smsGate == '1' || info.smsGate == '3' || info.smsGate == '4';
        return (
            <div>
                {
                    this.props.type == '52' && (
                        <FormItem label={'渠道限制'} className={styles.FormItemStyle} labelCol={{ span: 4 }} wrapperCol={{ span: 17 }}>
                            <Select onChange={this.handleSourceWayLimitChange}
                                    value={String(info.sourceWayLimit || '0')}
                                    placeholder="请选择渠道限制"
                                    getPopupContainer={(node) => node.parentNode}
                            >
                                <Option key="0" value="0">不限制</Option>
                                <Option key="1" value="1">仅线下</Option>
                                <Option key="2" value="2">仅线上</Option>
                            </Select>
                        </FormItem>
                    )
                }
                {this.props.type == '51' ? this.renderBirthDayGroupSelector() : (
                    <CardLevel
                        onChange={this.onCardLevelChange}
                        catOrCard="cat"
                        type={this.props.type}
                        form={this.props.form}
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(StepTwo));
