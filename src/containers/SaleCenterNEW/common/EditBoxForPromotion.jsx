import { HualalaEditorBox, HualalaTreeSelect, HualalaGroupSelect, HualalaSelected, HualalaSearchInput, CC2PY } from '../../../components/common';
import React from 'react';
import { connect } from 'react-redux'; import { Tree, message } from 'antd';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from '../IntlDecor';

const TreeNode = Tree.TreeNode;

import styles from '../ActivityPage.less';
const Immutable = require('immutable');


import { fetchAllPromotionListAC } from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import { FetchGiftList, FetchGiftSort } from '../../GiftNew/_action';
import { fetchSpecialCardLevel } from '../../../redux/actions/saleCenterNEW/mySpecialActivities.action'
import {
    ACTIVITY_CATEGORIES,
} from '../../../redux/actions/saleCenterNEW/types';

@injectIntl()
class EditBoxForPromotion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            promotionCollection: [], // 拼好的allPromotionList,目前是所有基础营销活动-》[n个类别]-》活动列表,type
            mutexPromotions: [], // 后台detail拿过来的数据,含之前创建的共享活动idstr数组

            promotionOptions: [], // 当前的已选分类下子项,右侧option选项
            promotionCurrentSelections: [], // 已选打勾子项ID，右侧
            promotionSelections: new Set(), // 已选各个分类下子项，用于下方tag选项

            vouchersData: [], // 电子代金券数据
            couponsData: [], // 菜品优惠券数据
            buyGiveData: [], // 买赠优惠券数据
            exchangeCouponsData: [], // 菜品兑换券数据
            vouchersDataSelections: [], // 已选电子代金券数据
            couponsDataSelections: [], // 已选菜品优惠券数据
            exchangeCouponsDataSelections: [], // 已选菜品兑换券数据

            labelKeyType: 'finalShowName',
            valueKeyType: 'promotionIDStr',

            limitNum: 30,        //营销活动共享限制数量

        };

        this.handleTreeNodeChange = this.handleTreeNodeChange.bind(this);
        this.handleGroupSelect = this.handleGroupSelect.bind(this);
        this.handleSelectedChange = this.handleSelectedChange.bind(this);
        this.handleEditorBoxChange = this.handleEditorBoxChange.bind(this);
        this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
        this.clear = this.clear.bind(this);
        this.initialState = this.initialState.bind(this);
    }

    initialState(mutexPromotions, promotionCollection) {
        // 把detail查来的共享活动渲染到下方promotionSelections数组
        if (mutexPromotions === undefined || promotionCollection === undefined) {
            return
        }
        const {vouchersData, couponsData, exchangeCouponsData, buyGiveData} = this.state;
        // 遍历活动匹配展示名称
        mutexPromotions.map((promotion) => {
            if (promotion.sharedType == '30') {
                // 优惠券类
                const crmGift = vouchersData.concat(couponsData).concat(exchangeCouponsData).concat(buyGiveData);
                crmGift.map((item) => {
                    // 找到匹配活动，加展示名称
                    // promotion.finalShowName = "券活动";
                    if (item.giftItemID == promotion.sharedIDStr) {
                        promotion.finalShowName = item.giftName || SALE_LABEL.k5nh21ll;
                        promotion.promotionIDStr = promotion.sharedIDStr;
                    }
                })
            } else if (promotion.sharedType == '20' || promotion.sharedIDStr == '-10' || promotion.promotionIDStr == '-10' || promotion.sharedIDStr == '-20' || promotion.promotionIDStr == '-20') {
                // 会员价会员权益类
                if (promotion.sharedIDStr == '-10' || promotion.promotionIDStr == '-10') {
                    // 会员价
                    promotion.finalShowName = SALE_LABEL.k5m4q0r2;
                } else {
                    // 会员折扣
                    promotion.finalShowName = SALE_LABEL.k5m4q0ze;
                }
                promotion.promotionIDStr = promotion.promotionIDStr ? promotion.promotionIDStr : promotion.sharedIDStr;
            } else {
                // 基础营销类
                promotionCollection.map((promotionCategory) => {
                    promotionCategory.promotionName.map((saleItem) => {
                        if (saleItem.promotionIDStr == promotion.sharedIDStr) {
                            promotion.finalShowName = saleItem.promotionName || SALE_LABEL.k5m4q17q;
                            promotion.promotionIDStr = promotion.sharedIDStr;
                        }
                    })
                })
            }
        })

        this.setState({
            promotionSelections: mutexPromotions,
        });
    }

    componentDidMount() {
        const user = this.props.user;
        // 请求获取promotionList--共享用
        const ProDetail = this.props.myActivities.toJS().$promotionDetailInfo.data;
        const filterFlag = this.props.user.shopID > 0 && (!ProDetail || ProDetail.promotionInfo.master.maintenanceLevel == '1');
        this.props.fetchAllPromotionList({
            groupID: this.props.user.accountInfo.groupID,
            shopID: this.props.user.shopID > 0 ? this.props.user.shopID : undefined,
        })
        // 请求获取所有哗啦啦券列表--共享用
        this.props.FetchGiftList({
            groupID: user.accountInfo.groupID,
            pageSize: 1000, // 代替FetchGiftSort
            pageNo: 1,
        });

        // 用户选择过的互斥活动
        const _mutexPromotions = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'mutexPromotions']) ? this.props.promotionDetailInfo.getIn(['$promotionDetail', 'mutexPromotions']).toJS() : [];

        const crmGiftList = this.props.giftInfoNew.toJS().dataSource.crmGiftList || [];
        let vouchersData = [],
            couponsData = [],
            exchangeCouponsData = [],
            buyGiveData = [];
        crmGiftList.map((crmGift, index) => {
            if (crmGift.giftType == '10') {
                // 电子代金券
                crmGift.sharedType = '30';
                crmGift.promotionIDStr = crmGift.giftItemID;
                crmGift.finalShowName = crmGift.giftName;
                vouchersData.push(crmGift)
            }
            if (crmGift.giftType == '20') {
                // 菜品优惠券
                crmGift.sharedType = '30';
                crmGift.promotionIDStr = crmGift.giftItemID;
                crmGift.finalShowName = crmGift.giftName;
                couponsData.push(crmGift)
            }
            if (crmGift.giftType == '21') {
                // 菜品兑换券
                crmGift.sharedType = '30';
                crmGift.promotionIDStr = crmGift.giftItemID;
                crmGift.finalShowName = crmGift.giftName;
                exchangeCouponsData.push(crmGift)
            }
            if (crmGift.giftType == '110') {
                crmGift.sharedType = '30';
                crmGift.promotionIDStr = crmGift.giftItemID;
                crmGift.finalShowName = crmGift.giftName;
                buyGiveData.push(crmGift);
            }
        });
        // this.setState({  })
        this.setState({
            promotionCollection: [],
            mutexPromotions: _mutexPromotions,
            vouchersData,
            couponsData,
            exchangeCouponsData,
            buyGiveData,
        }, () => {
            this.initialState(this.state.mutexPromotions, this.state.promotionCollection);
        });
    }
    componentWillReceiveProps(nextProps) {
        const { intl } = this.props;
        const k5m4q0ae = intl.formatMessage(SALE_STRING.k5m4q0ae); // 消费返礼品
        const k5m4q0iq = intl.formatMessage(SALE_STRING.k5m4q0iq); // 消费返积分
        const DISABLED_PROMOTION_TYPE = [
            k5m4q0ae, k5m4q0iq
        ];
        const ProDetail = nextProps.myActivities.toJS().$promotionDetailInfo.data;
        const filterFlag = nextProps.user.shopID > 0 && (!ProDetail || ProDetail.promotionInfo.master.maintenanceLevel == '1');
        if (this.props.giftInfoNew.get('dataSource') != nextProps.giftInfoNew.get('dataSource')) {
            const crmGiftList = nextProps.giftInfoNew.toJS().dataSource.crmGiftList ? nextProps.giftInfoNew.toJS().dataSource.crmGiftList : [];
            // let { vouchersData, couponsData} = this.state;
            let vouchersData = [],
                couponsData = [], // 优惠券
                exchangeCouponsData = [], // 兑换券
                buyGiveData = []; // 买赠券
            crmGiftList.map((crmGift, index) => {
                if (crmGift.giftType == '10') {
                    // 电子代金券
                    crmGift.sharedType = '30';
                    crmGift.promotionIDStr = crmGift.giftItemID;
                    crmGift.finalShowName = crmGift.giftName;
                    vouchersData.push(crmGift)
                }
                if (crmGift.giftType == '20') {
                    // 菜品优惠券
                    crmGift.sharedType = '30';
                    crmGift.promotionIDStr = crmGift.giftItemID;
                    crmGift.finalShowName = crmGift.giftName;
                    couponsData.push(crmGift)
                }
                if (crmGift.giftType == '21') {
                    // 菜品兑换券
                    crmGift.sharedType = '30';
                    crmGift.promotionIDStr = crmGift.giftItemID;
                    crmGift.finalShowName = crmGift.giftName;
                    exchangeCouponsData.push(crmGift)
                }
                if (crmGift.giftType == '110') {
                    crmGift.sharedType = '30';
                    crmGift.promotionIDStr = crmGift.giftItemID;
                    crmGift.finalShowName = crmGift.giftName;
                    buyGiveData.push(crmGift);
                }
            });
            this.setState({
                vouchersData,
                couponsData,
                exchangeCouponsData,
                buyGiveData,
            }, () => {
                this.initialState(this.state.mutexPromotions, this.state.promotionCollection);
            })
        }
        if (this.props.promotionDetailInfo.getIn(['$allPromotionListInfo', 'data', 'promotionTree']) !=
            nextProps.promotionDetailInfo.getIn(['$allPromotionListInfo', 'data', 'promotionTree'])
        ) {
            let promotionCollection = nextProps.promotionDetailInfo.getIn(['$allPromotionListInfo', 'data', 'promotionTree']);
            promotionCollection = Immutable.List.isList(promotionCollection) ? promotionCollection.toJS() : [];
            promotionCollection = promotionCollection.filter(item => !DISABLED_PROMOTION_TYPE.includes(item.promotionType.content));
            this.setState({
                promotionCollection: filterFlag ?
                    promotionCollection.map((promotionCategery) => {
                        return {
                            promotionType: promotionCategery.promotionType,
                            promotionName: promotionCategery.promotionName.filter((promotion) => {
                                return promotion.maintenanceLevel == '1';
                            }),
                        }
                    }) : promotionCollection,
                promotionSelections: new Set(),
            }, () => {
                this.initialState(this.state.mutexPromotions, this.state.promotionCollection);
            })
        }

        // 去掉自己，自己不能共享自己
        let promotionCollection = nextProps.promotionDetailInfo.getIn(['$allPromotionListInfo', 'data', 'promotionTree']);
        promotionCollection = Immutable.List.isList(promotionCollection) ? promotionCollection.toJS() : [];
        promotionCollection = promotionCollection.filter(item => !DISABLED_PROMOTION_TYPE.includes(item.promotionType.content));
        let SelfPromotion = '';
        if (this.props.myActivities.toJS().$promotionDetailInfo.data) {
            SelfPromotion = this.props.myActivities.getIn(['$promotionDetailInfo', 'data', 'promotionInfo', 'master', 'promotionIDStr']);
        }
        this.setState({
            promotionCollection: promotionCollection.map((promotionCategery) => {
                const promotionName = promotionCategery.promotionName.filter((promotion) => {
                    return filterFlag ? promotion.promotionIDStr != SelfPromotion && promotion.maintenanceLevel == '1'
                        : promotion.promotionIDStr != SelfPromotion;
                })
                const promotionType = promotionCategery.promotionType;
                return { promotionName, promotionType }
            }),
            promotionSelections: new Set(),
        }, () => {
            this.initialState(this.state.mutexPromotions, this.state.promotionCollection);
        })


        if (this.props.promotionDetailInfo.getIn(['$promotionDetail', 'mutexPromotions']) !==
            nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'mutexPromotions'])
        ) {
            let _mutexPromotions = nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'mutexPromotions']);
            _mutexPromotions = Immutable.List.isList(_mutexPromotions) ? _mutexPromotions.toJS() : [];
            this.setState({
                mutexPromotions: _mutexPromotions,
            }, () => {
                this.initialState(this.state.mutexPromotions, this.state.promotionCollection);
            })
        }
    }

    render() {
        const { intl } = this.props;
        const k5m4q0ae = intl.formatMessage(SALE_STRING.k5m4q0ae);
        const k5m4q0iq = intl.formatMessage(SALE_STRING.k5m4q0iq);
        const k5m5auib = intl.formatMessage(SALE_STRING.k5m5auib);
        const k5m5auqn = intl.formatMessage(SALE_STRING.k5m5auqn);
        const k636qvpm = intl.formatMessage(SALE_STRING.k636qvpm);
        const DISABLED_PROMOTION_TYPE = [
            k5m4q0ae, k5m4q0iq
        ];

        const _promotionCollection = this.state.promotionCollection;
        const promotionSelections = new Set();
        this.state.promotionSelections.forEach(item => {
            if (item.promotionIDStr) {
                promotionSelections.add(item);
            }
        });
        const ProDetail = this.props.myActivities.toJS().$promotionDetailInfo.data;
        const filterFlag = this.props.user.shopID > 0 && (!ProDetail || ProDetail.promotionInfo.master.maintenanceLevel == '1');

        // 拼左侧树状结构
        const loop = (data) => {
            if (undefined === data) {
                return null
            }
            return ACTIVITY_CATEGORIES.filter(item => !DISABLED_PROMOTION_TYPE.includes(item.title)).map((item, index) => {
                return <TreeNode key={index} title={item.title} disabled={filterFlag && item.title == k5m5auib} />
            });
        }
        return (
            <div className={styles.treeSelectMain}>
                <HualalaEditorBox
                    label={k5m5auqn}
                    itemName={'finalShowName'}
                    itemID={'promotionIDStr'}
                    data={promotionSelections}
                    onChange={this.handleEditorBoxChange}
                    onTagClose={this.handleSelectedChange}
                >
                    <HualalaTreeSelect level1Title={SALE_LABEL.k5m5auyz}>
                        {/* //搜索框 */}
                        <HualalaSearchInput onChange={this.handleSearchInputChange} />
                        {/* //左侧树 */}
                        <Tree onSelect={this.handleTreeNodeChange} title={'content'}>
                            <TreeNode key={'salePromotion'} title={SALE_LABEL.k5m4q17q}>
                                {loop(_promotionCollection)}
                            </TreeNode>
                            <TreeNode key={'hualala'} title={SALE_LABEL.k5m5av7b}>
                                <TreeNode key={'vouchers'} title={SALE_LABEL.k5m5avfn} />
                                <TreeNode key={'coupons'} title={SALE_LABEL.k5m5avnz} />
                                <TreeNode key={'exchangeCoupons'} title={SALE_LABEL.k5m5avwb} />
                                <TreeNode key={'buyGive'} title={k636qvpm} />
                            </TreeNode>
                            <TreeNode key={'userRight'} title={SALE_LABEL.k5m5aw4n}>
                                {/* 会员价 */}
                                <TreeNode key={'userCard'} title={SALE_LABEL.k5m4q0r2} /> 
                                <TreeNode key={'userDiscount'} title={SALE_LABEL.k5m4q0ze} />
                            </TreeNode>
                        </Tree>
                        {/* //右侧复选框  isLimit 数量限制 */}
                        <HualalaGroupSelect
                            options={this.state.promotionOptions}
                            labelKey={'finalShowName'}
                            valueKey={'promotionIDStr'}
                            value={this.state.promotionCurrentSelections}
                            onChange={this.handleGroupSelect}
                            isLimit={Array.from(promotionSelections).length >= this.state.limitNum || false}
                        />
                        {/* //下方已选的tag */}
                        <HualalaSelected
                            itemName={'finalShowName'}
                            itemID={'promotionIDStr'}
                            selectdTitle={SALE_LABEL.k5m5awd0}
                            value={promotionSelections}
                            onChange={this.handleSelectedChange}
                            onClear={() => this.clear()}
                        />
                    </HualalaTreeSelect>
                </HualalaEditorBox>
            </div>
        );
    }

    // 清空
    clear() {
        const promotionSelections = new Set(this.state.promotionSelections);
        promotionSelections.clear();
        this.setState({
            promotionCurrentSelections: [],
            promotionSelections,
        })
    }

    // 搜索
    handleSearchInputChange = (value) => {
        const { intl } = this.props;
        const k5m4q0r2 = intl.formatMessage(SALE_STRING.k5m4q0r2);
        const k5m4q0ze = intl.formatMessage(SALE_STRING.k5m4q0ze);

        const promotionList = this.state.promotionCollection;
        const { vouchersData, couponsData, exchangeCouponsData, buyGiveData } = this.state;
        if (undefined === promotionList) {
            return null;
        }

        if (!((promotionList instanceof Array) && promotionList.length > 0)) {
            return null;
        }

        const allMatchItem = [];
        promotionList.forEach((promotions) => {
            promotions.promotionName.forEach((promotion) => {
                if (CC2PY(promotion.promotionName).indexOf(CC2PY(value)) !== -1 || promotion.promotionName.indexOf(CC2PY(value)) !== -1) {
                    allMatchItem.push(promotion);
                }
            });
        });
        const otherPromotion = vouchersData.concat(couponsData).concat(exchangeCouponsData).concat(buyGiveData).concat([{ 'finalShowName': k5m4q0r2, 'promotionIDStr': '-10' }, { 'finalShowName': k5m4q0ze, 'promotionIDStr': '-20' }])
        otherPromotion.forEach((promotion) => {
            if (CC2PY(promotion.finalShowName).indexOf(CC2PY(value)) !== -1 || promotion.finalShowName.indexOf(CC2PY(value)) !== -1) {
                allMatchItem.push(promotion);
            }
        })
        const promotionCurrentSelections = [];
        allMatchItem.forEach((storeEntity) => {
            if (new Set(this.state.promotionSelections).has(storeEntity)) {
                promotionCurrentSelections.push(storeEntity.promotionIDStr)
            }
        });
        this.setState({
            promotionOptions: allMatchItem,
            promotionCurrentSelections,
        });
    }

    // 确定或取消
    handleEditorBoxChange(value) {
        const promotionSelections = value;
        const valueKeyType = 'promotionIDStr';
        // update currentSelections according the selections
        const promotionCurrentSelections = [];
        this.state.promotionOptions.forEach((storeEntity) => {
            Array.from(promotionSelections).map((select) => {
                if (select[valueKeyType] == storeEntity[valueKeyType]) {
                    promotionCurrentSelections.push(storeEntity[valueKeyType])
                }
            })
        });

        this.setState({
            promotionSelections: value,
            promotionCurrentSelections,
        }, () => {
            this.props.onChange && this.props.onChange(Array.from(value));
        });
    }

    // 点击移除
    handleSelectedChange(value) {
        const promotionSelections = new Set(this.state.promotionSelections);
        let promotionCurrentSelections = this.state.promotionCurrentSelections;

        if (value !== undefined) {
            promotionSelections.delete(value);
            promotionCurrentSelections = promotionCurrentSelections.filter((item) => {
                return item !== value.promotionIDStr
            })
        }


        this.setState({
            promotionSelections,
            promotionCurrentSelections,
        }, () => {
            this.props.onChange && this.props.onChange(Array.from(promotionSelections));
        });
    }

    // CheckBox选择
    handleGroupSelect(value) {
        if (value instanceof Array) {
            // get the selections
            const selectionsSet = new Set(this.state.promotionSelections);
            const promotionCurrentSelections = this.state.promotionCurrentSelections;
            
            // 最大选择数量限制  30
            if(value.length >= this.state.limitNum + 1) {
                message.warning(`共享组选项不能超过${this.state.limitNum}个`)
                this.handleSelectedChange('')
                return
            }
            // promotionCurrentSelections.map((CurrentSelection) =>{
            //     Array.from(this.state.promotionSelections).map((promotion) => {
            //         if(promotion.promotionIDStr == CurrentSelection){
            //             selectionsSet.delete(promotion)
            //         }
            //     })
            // })
            // this.state.promotionOptions.forEach((shopEntity, index) => {
            //     if (value.includes(shopEntity["promotionIDStr"])) {
            //          selectionsSet.add(shopEntity);

            //     }
            // });
            // 这次选中的列表长度大于上次选中的长度，说明是添加
            if (value.length > promotionCurrentSelections.length) {
                this.state.promotionOptions.map((promotion) => {
                    if (value.includes(promotion.promotionIDStr)) {
                        const selectedArr = (Array.from(selectionsSet)).map((selected) => {
                            return selected.promotionIDStr
                        })
                        if (!selectedArr.includes(promotion.promotionIDStr)) {
                            selectionsSet.add(promotion);
                        }
                    }
                })
            }
            // 这次选中的列表长度小于上次选中的长度，说明是删除
            if (value.length == 0 || value.length < promotionCurrentSelections.length) {
                promotionCurrentSelections.map((promotionIDStr) => {
                    if (!value.includes(promotionIDStr)) {
                        (Array.from(selectionsSet)).map((selected) => {
                            if (selected.promotionIDStr == promotionIDStr) {
                                selectionsSet.delete(selected);
                            }
                        })
                    }
                })
            }
            this.setState({ promotionCurrentSelections: value, promotionSelections: selectionsSet }, () => {
              
            });
        }
    }

    // 左侧选择
    handleTreeNodeChange = (value, info) => {
        const { intl } = this.props;
        const k5m4q0r2 = intl.formatMessage(SALE_STRING.k5m4q0r2);
        const k5m4q0ze = intl.formatMessage(SALE_STRING.k5m4q0ze);

        let { promotionOptions, promotionSelections, promotionCurrentSelections, vouchersData, couponsData, exchangeCouponsData, buyGiveData, valueKeyType } = this.state;

        if (value === undefined || value[0] === undefined) {
            return null;
        }

        if (value[0] == 'vouchers') {
            promotionOptions = vouchersData;
        } else if (value[0] == 'coupons') {
            promotionOptions = couponsData;
        }else if (value[0] == 'exchangeCoupons') {
            promotionOptions = exchangeCouponsData;
        } else if (value[0] == 'buyGive'){
            promotionOptions = buyGiveData;
        } else if (value[0] == 'userCard') {
            promotionOptions = [{ 'finalShowName': k5m4q0r2, 'promotionIDStr': '-10', 'sharedType': '20' }];
        } else if (value[0] == 'userDiscount') {
            promotionOptions = [{ 'finalShowName': k5m4q0ze, 'promotionIDStr': '-20', 'sharedType': '20' }];
        } else if (value[0] !== 'salePromotion' && value[0] !== 'hualala' && value[0] !== 'userRight') {
            // 普通基础营销
            const indexArray = value[0].split('-').map((val) => {
                return parseInt(val)
            });
            // 存储右侧 checkBox 选项,当前已选类别所有活动
            let storeOptions = [];
            if (indexArray.length === 1) {
                storeOptions = storeOptions.concat(this.state.promotionCollection[indexArray[0]].promotionName);
            } else if (indexArray.length === 2) {
                storeOptions = storeOptions.concat(this.state.promotionCollection[indexArray[0]].children[indexArray[1]].children);
            }
            promotionOptions = storeOptions;
        }
        const _promotionCurrentSelections = [];
        promotionOptions.forEach((storeEntity) => {
            Array.from(promotionSelections).map((promotion) => {
                if (promotion[valueKeyType] == storeEntity[valueKeyType]) {
                    _promotionCurrentSelections.push(storeEntity[valueKeyType])
                }
            })
        });
        this.setState({
            promotionOptions,
            promotionCurrentSelections: _promotionCurrentSelections,
        })
    }
}

const mapStateToProps = (state) => {
    return {
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        myActivities: state.sale_myActivities_NEW,
        giftInfoNew: state.sale_giftInfoNew, // 所有哗啦啦券列表--共享用
        mySpecialActivities: state.sale_mySpecialActivities_NEW, // 所有会员等级列表--共享用
        user: state.user.toJS()
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllPromotionList: (opts) => {
            dispatch(fetchAllPromotionListAC(opts))
        },
        FetchGiftList: (opts) => {
            dispatch(FetchGiftList(opts))
        },
        FetchGiftSort: (opts) => {
            dispatch(FetchGiftSort(opts))
        },
        fetchSpecialCardLevel: (opts) => {
            dispatch(fetchSpecialCardLevel(opts));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditBoxForPromotion);
