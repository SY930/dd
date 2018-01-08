import { HualalaEditorBox, HualalaTreeSelect, HualalaGroupSelect, HualalaSelected, HualalaSearchInput, CC2PY } from '../../../components/common';
import React from 'react';
import { connect } from 'react-redux'; import { Tree } from 'antd';

const TreeNode = Tree.TreeNode;

import styles from '../ActivityPage.less';

if (process.env.__CLIENT__ === true) {
    // require('../../../../client/componentsPage.less');
}

import { fetchAllPromotionListAC } from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import { FetchGiftList, FetchGiftSort } from '../../GiftNew/_action';
import { fetchSpecialCardLevel } from '../../../redux/actions/saleCenterNEW/mySpecialActivities.action'

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
            vouchersDataSelections: [], // 已选电子代金券数据
            couponsDataSelections: [], // 已选菜品优惠券数据

            labelKeyType: 'finalShowName',
            valueKeyType: 'promotionIDStr',

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
        // 遍历活动匹配展示名称
        mutexPromotions.map((promotion) => {
            if (promotion.sharedType == '30') {
                // 优惠券类
                const crmGift = this.state.vouchersData.concat(this.state.couponsData);
                crmGift.map((item) => {
                    // 找到匹配活动，加展示名称
                    // promotion.finalShowName = "券活动";
                    if (item.giftItemID == promotion.sharedIDStr) {
                        promotion.finalShowName = item.giftName || '券活动';
                        promotion.promotionIDStr = promotion.sharedIDStr;
                    }
                })
            } else if (promotion.sharedType == '20' || promotion.sharedIDStr == '-10' || promotion.promotionIDStr == '-10' || promotion.sharedIDStr == '-20' || promotion.promotionIDStr == '-20') {
                // 会员价会员权益类
                if (promotion.sharedIDStr == '-10' || promotion.promotionIDStr == '-10') {
                    // 会员价
                    promotion.finalShowName = '会员价';
                } else {
                    // 会员折扣
                    promotion.finalShowName = '会员折扣';
                }
                promotion.promotionIDStr = promotion.promotionIDStr ? promotion.promotionIDStr : promotion.sharedIDStr;
            } else {
                // 基础营销类
                promotionCollection.map((promotionCategery) => {
                    promotionCategery.promotionName.map((saleItem) => {
                        if (saleItem.promotionIDStr == promotion.sharedIDStr) {
                            promotion.finalShowName = saleItem.promotionName || '基础营销活动';
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
        // 活动列表
        const _promotions = this.props.promotionDetailInfo.getIn(['$allPromotionListInfo', 'data', 'promotionTree']).toJS();

        // 用户选择过的互斥活动
        const _mutexPromotions = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'mutexPromotions']) ? this.props.promotionDetailInfo.getIn(['$promotionDetail', 'mutexPromotions']).toJS() : [];

        const crmGiftList = this.props.giftInfoNew.toJS().dataSource.crmGiftList || [];
        let vouchersData = [],
            couponsData = [];
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
        });
        // this.setState({  })
        this.setState({
            promotionCollection: this.props.user.shopID > 0 ?
                _promotions.map((promotionCategery) => {
                    return {
                        promotionType: promotionCategery.promotionType,
                        promotionName: promotionCategery.promotionName.filter((promotion) => {
                            return promotion.shopID != '0';
                        }),
                    }
                }) : _promotions,
            mutexPromotions: _mutexPromotions,
            vouchersData,
            couponsData,
        }, () => {
            this.initialState(this.state.mutexPromotions, this.state.promotionCollection);
        });
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.giftInfoNew.get('dataSource') != nextProps.giftInfoNew.get('dataSource')) {
            const crmGiftList = nextProps.giftInfoNew.toJS().dataSource.crmGiftList ? nextProps.giftInfoNew.toJS().dataSource.crmGiftList : [];
            // let { vouchersData, couponsData} = this.state;
            let vouchersData = [],
                couponsData = [];
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
            });
            this.setState({
                vouchersData,
                couponsData,
            }, () => {
                this.initialState(this.state.mutexPromotions, this.state.promotionCollection);
            })
        }
        if (this.props.promotionDetailInfo.getIn(['$allPromotionListInfo', 'data', 'promotionTree']) !=
            nextProps.promotionDetailInfo.getIn(['$allPromotionListInfo', 'data', 'promotionTree'])
        ) {
            const promotionCollection = nextProps.promotionDetailInfo.getIn(['$allPromotionListInfo', 'data', 'promotionTree']).toJS();
            this.setState({
                promotionCollection: nextProps.user.shopID > 0 ?
                    promotionCollection.map((promotionCategery) => {
                        return {
                            promotionType: promotionCategery.promotionType,
                            promotionName: promotionCategery.promotionName.filter((promotion) => {
                                return promotion.shopID != '0';
                            }),
                        }
                    }) : promotionCollection,
                promotionSelections: new Set(),
            }, () => {
                this.initialState(this.state.mutexPromotions, this.state.promotionCollection);
            })
        }

        // 去掉自己，自己不能共享自己
        let promotionCollection = nextProps.promotionDetailInfo.getIn(['$allPromotionListInfo', 'data', 'promotionTree']).toJS();
        let SelfPromotion = '';
        if (this.props.myActivities.toJS().$promotionDetailInfo.data) {
            // let _promotionCollection = [];
            SelfPromotion = this.props.myActivities.toJS().$promotionDetailInfo.data.promotionInfo.master.promotionIDStr;
            // _promotionCollection = promotionCollection.map((promotionCategery) => {
            //     const promotionName = promotionCategery.promotionName.filter((promotion) => {
            //         return this.props.user.shopID > 0 ? promotion.promotionIDStr != SelfPromotion && promotion.shopID != '0'
            //             : promotion.promotionIDStr != SelfPromotion;
            //     })
            //     const promotionType = promotionCategery.promotionType;
            //     return { promotionName, promotionType }
            // })
            // promotionCollection = _promotionCollection;
        }
        this.setState({
            promotionCollection: promotionCollection.map((promotionCategery) => {
                const promotionName = promotionCategery.promotionName.filter((promotion) => {
                    return this.props.user.shopID > 0 ? promotion.promotionIDStr != SelfPromotion && promotion.shopID != '0'
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
            const _mutexPromotions = nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'mutexPromotions']).toJS();
            this.setState({
                mutexPromotions: _mutexPromotions,
            }, () => {
                this.initialState(this.state.mutexPromotions, this.state.promotionCollection);
            })
        }
    }

    render() {
        const _promotionCollection = this.state.promotionCollection;
        const promotionSelections = this.state.promotionSelections;

        // 拼左侧树状结构
        const loop = (data) => {
            if (undefined === data) {
                return null
            }
            let _data;
            // 隐藏组合减免，买三免一
            // if (HUALALA.ENVIRONMENT != 'production-release') {
            _data = data
            // } else {
            //     _data = data.filter((item, index) => {
            //         if (item.promotionType.content != '组合减免/折扣' && item.promotionType.content != '买三免一' &&
            //             item.promotionType.content != '累计次数减免' && item.promotionType.content != '累计次数赠送') {
            //             return item;
            //         }
            //     });
            // }
            return _data.map((item, index) => {
                return <TreeNode key={index} title={item.promotionType.content} />;
            });
        }
        return (
            <div className={styles.treeSelectMain}>
                <HualalaEditorBox
                    label={'营销活动共享'}
                    itemName={'finalShowName'}
                    itemID={'promotionIDStr'}
                    data={this.state.promotionSelections}
                    onChange={this.handleEditorBoxChange}
                    onTagClose={this.handleSelectedChange}
                >
                    <HualalaTreeSelect level1Title={'全部营销活动'}>
                        {/* //搜索框 */}
                        <HualalaSearchInput onChange={this.handleSearchInputChange} />
                        {/* //左侧树 */}
                        <Tree onSelect={this.handleTreeNodeChange} title={'content'}>
                            <TreeNode key={'salePromotion'} title={'基础营销'}>
                                {loop(_promotionCollection)}
                            </TreeNode>
                            <TreeNode key={'hualala'} title={'哗啦啦券'}>
                                <TreeNode key={'vouchers'} title={'电子代金券'} />
                                <TreeNode key={'coupons'} title={'菜品优惠券'} />
                            </TreeNode>
                            <TreeNode key={'userRight'} title={'会员权益'}>
                                <TreeNode key={'userCard'} title={'会员价'} />
                                <TreeNode key={'userDiscount'} title={'会员折扣'} />
                            </TreeNode>
                        </Tree>
                        {/* //右侧复选框 */}
                        <HualalaGroupSelect
                            options={this.state.promotionOptions}
                            labelKey={'finalShowName'}
                            valueKey={'promotionIDStr'}
                            value={this.state.promotionCurrentSelections}
                            onChange={this.handleGroupSelect}
                        />
                        {/* //下方已选的tag */}
                        <HualalaSelected
                            itemName={'finalShowName'}
                            itemID={'promotionIDStr'}
                            selectdTitle={'已选营销活动'}
                            value={this.state.promotionSelections}
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
    handleSearchInputChange(value) {
        const promotionList = this.state.promotionCollection;
        const { vouchersData, couponsData } = this.state;
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
        const otherPromotion = vouchersData.concat(couponsData).concat([{ 'finalShowName': '会员价', 'promotionIDStr': '-10' }, { 'finalShowName': '会员折扣', 'promotionIDStr': '-20' }])
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
        // console.log(value);
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
                console.log(this.state.promotionCurrentSelections);
                console.log(Array.from(this.state.promotionSelections));
            });
        }
    }

    // 左侧选择
    handleTreeNodeChange(value, info) {
        let { promotionOptions, promotionSelections, promotionCurrentSelections, vouchersData, couponsData, vouchersDataSelections, couponsDataSelections, labelKeyType, valueKeyType } = this.state;

        if (value === undefined || value[0] === undefined) {
            return null;
        }

        if (value[0] == 'vouchers') {
            promotionOptions = vouchersData;
        } else if (value[0] == 'coupons') {
            promotionOptions = couponsData;
        } else if (value[0] == 'userCard') {
            promotionOptions = [{ 'finalShowName': '会员价', 'promotionIDStr': '-10', 'sharedType': '20' }];
        } else if (value[0] == 'userDiscount') {
            promotionOptions = [{ 'finalShowName': '会员折扣', 'promotionIDStr': '-20', 'sharedType': '20' }];
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
