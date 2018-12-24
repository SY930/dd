import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Icon,
    Button,
    Input,
    Select,
    Alert,
    Spin,
    Tooltip,
    Popconfirm,
    message,
    Modal
} from 'antd';
import registerPage from '../../../index';
import {SHARE_RULES_GROUP, SHARE_RULES_SHOP} from "../../constants/entryCodes";
import style from './style.less'
import { share_rules } from '../../redux/reducer/shareRules'
import {
    changeSearchName,
    changeSearchType,
    createOrUpdateCertainShareGroup,
    deleteCertainShareGroup,
    queryShareGroups,
    removeItemFromCertainShareGroup,
    startCreateShareGroup,
    startEditCertainShareGroup,
} from "../../redux/actions/shareRules/index";
import {BASIC_PROMOTION_MAP, GIFT_MAP} from "../../constants/promotionType";
import PromotionSelectModal from "./PromotionSelectModal";
import {FetchGiftList} from "../GiftNew/_action";
import {fetchAllPromotionListAC} from "../../redux/actions/saleCenterNEW/promotionDetailInfo.action";
import emptyPage from '../../assets/empty_page.png'

const { Option, OptGroup } = Select;
const AVAILABLE_PROMOTIONS = Object.keys(BASIC_PROMOTION_MAP);

const getItemTag = (item) => {
    const {
        activityType,
        activitySourceType,
    } = item || {};
    let tag;
    activityType == 10 && (tag = BASIC_PROMOTION_MAP[activitySourceType]);
    activityType == 30 && (tag = GIFT_MAP[activitySourceType]);
    activityType == 20 && activitySourceType == -10 && (tag = '会员价');
    activityType == 20 && activitySourceType == -20 && (tag = '会员折扣');
    return tag || '活动'
}

@registerPage([SHARE_RULES_GROUP, SHARE_RULES_SHOP], {
    share_rules
})
@connect(mapStateToProps, mapDispatchToProps)
export default class ShareRules extends Component {

    state = {
        isCreate: false,
        isEdit: false,
        searchTypeInput: '',
        searchNameInput: '',
        selected: [],
        selectedGroupID: undefined,
    }

    componentDidMount() {
        // 请求获取所有基础营销活动--共享用
        this.props.fetchAllPromotionList({
            groupID: this.props.user.accountInfo.groupID,
            shopID: this.props.user.shopID > 0 ? this.props.user.shopID : undefined,
        })
        // 请求获取所有哗啦啦券列表--共享用
        this.props.FetchGiftList({
            groupID: this.props.user.accountInfo.groupID,
            pageSize: 1000,
            pageNo: 1,
        });
        this.queryAll();
    }

    handleDeleteGroup = ({ itemID }, index) => {
        Modal.confirm({
            title: <span style={{color: '#434343'}}>您确定要删除吗 ?</span>,
            content: (
                <div>
                    <span style={{color: '#787878'}}>
                        {`您将删除【营销活动共享组${index + 1}】`}
                    </span>
                    <br/>
                    <span style={{color: '#aeaeae'}}>
                        删除数据是不可恢复操作, 请慎重考虑
                    </span>
                </div>
            ),
            onOk: () => {
                return this.props.deleteCertainShareGroup({
                    masterItemID: itemID,
                    shopID: this.props.user.shopID > 0 ? this.props.user.shopID : undefined,
                }).then(() => {
                    message.success('删除成功');
                    this.queryAll()
                }).catch((error) => {
                })
            },
        })
    }

    handleRemoveItemFromGroup = ({ itemID: masterItemID }, { itemID: slaveItemID }) => {
        this.props.removeItemFromCertainShareGroup({
            masterItemID,
            slaveItemID,
            shopID: this.props.user.shopID > 0 ? this.props.user.shopID : undefined,
        }).then(() => {
            message.success('移除成功')
            this.queryAll()
        })
    }

    queryAll = () => {
        this.props.queryShareGroups({
            groupID: this.props.user.accountInfo.groupID,
            shopID: this.props.user.shopID > 0 ? this.props.user.shopID : 0,
        });
    }

    renderHeader(isEmpty) {
        return (
            <div className={style.header}>
                <div className={style.titleArea}>
                    <span className={style.title}>
                        规则设置
                    </span>
                    {
                        !isEmpty && (
                            <Alert style={{color: '#E4843B'}} message="默认所有的活动优惠不共享，如需共享请选择相应的活动创建共享活动组" type="warning" showIcon />
                        )
                    }
                </div>
                {
                    !isEmpty && (
                        <Button
                            onClick={() => this.setState({ isCreate: true, isEdit: false })}
                            type="ghost"
                        >
                            <Icon
                                type="plus"
                            />
                            新建规则
                        </Button>
                    )
                }
            </div>
        )
    }

    renderHeaderActions() {
        const {
            searchTypeInput,
            searchNameInput,
        } = this.state;
        const {
            isQuerying,
            changeSearchType,
            changeSearchName,
        } = this.props;
        return (
            <div className={style.headerActions}>
                <span className={style.headerLabel}>
                    活动类型
                </span>

                <Select
                    style={{ width: 160, marginRight: 20 }}
                    value={searchTypeInput}
                    onChange={(v) => this.setState({ searchTypeInput: v })}
                >
                    <Option value="">
                        全部
                    </Option>
                    <OptGroup label="营销活动">
                        {
                            AVAILABLE_PROMOTIONS.map(item => (
                                <Option key={item} value={item}>{BASIC_PROMOTION_MAP[item]}</Option>
                            ))
                        }
                    </OptGroup>
                    <OptGroup label="哗啦啦券">
                        <Option value="10">代金券</Option>
                        <Option value="20">菜品优惠券</Option>
                        <Option value="21">菜品兑换券</Option>
                        <Option value="111">折扣券</Option>
                        <Option value="110">买赠券</Option>
                    </OptGroup>
                    <OptGroup label="会员权益">
                        <Option value="-10">会员价</Option>
                        <Option value="-20">会员折扣</Option>
                    </OptGroup>
                </Select>
                <span className={style.headerLabel}>
                    活动名称
                </span>

                <Input
                    value={searchNameInput}
                    onChange={(e) => this.setState({ searchNameInput: e.target.value })}
                    style={{ width: 240, marginRight: 20 }}
                    placeholder="请输入活动名称搜索"
                />
                <Button
                    type="primary"
                    disabled={isQuerying}
                    onClick={() => {
                        changeSearchType(searchTypeInput);
                        changeSearchName(searchNameInput);
                        this.queryAll()
                    }}
                >
                    <Icon
                        type="search"
                    />
                    查询
                </Button>

            </div>
        )
    }

    handleCancel = () => {
        this.setState({
            isCreate: false,
            isEdit: false,
            selected: [],
            selectedGroupID: undefined
        })
    }

    handleEditShareGroup = (shareGroup) => {
        this.setState({
            isEdit: true,
            isCreate: false,
            selected: (shareGroup.shareGroupDetailList || []).map(item => String(item.activityID)),
            selectedGroupID: shareGroup.itemID,
        })
    }

    handleOk = ({shareGroupDetailList}) => {
        const { selectedGroupID } = this.state;
        return this.props.createOrUpdateCertainShareGroup({
            shopID: this.props.user.shopID > 0 ? this.props.user.shopID : 0,
            shareType: 0,
            itemID: selectedGroupID,
            shareGroupDetailList: shareGroupDetailList.map(item => ({
                activityID: item.value,
                activitySourceType: item.type,
                activitySource: item.activitySource,
                activityType: item.activityType,
            }))
        }).then(() => {
            message.success('保存成功');
            this.queryAll()
            this.handleCancel()
        })
    }

    getFilteredGroup = (shareGroups) => {
        const {
            searchPromotionType: type,
            searchPromotionName,
        } = this.props;
        return shareGroups.filter(group => group.shareGroupDetailList.some(detail => ((!type || type == detail.activitySourceType)) && (detail.activityName || '').includes(searchPromotionName)))
    }

    isMyShareGroup = ({ shopID }) => {
        const currentShopID = this.props.user.shopID > 0 ? this.props.user.shopID : 0;
        return shopID == currentShopID;
    }

    render() {
        const {
            shareGroups,
            isQuerying,
            searchPromotionType,
            searchPromotionName,
            isSaving
        } = this.props;
        const {
            isCreate,
            isEdit,
            selected
        } = this.state;
        const vanillaShareGroups = shareGroups.toJS();
        const filteredShareGroups = searchPromotionType || searchPromotionName ? this.getFilteredGroup(vanillaShareGroups) : vanillaShareGroups
        const displayHeaderActions = !!vanillaShareGroups.length;
        return (
            <div style={{ height: '100%' }}>
                {
                    (isCreate || isEdit) && (
                        <PromotionSelectModal
                            isCreate={isCreate}
                            handleCancel={this.handleCancel}
                            handleOk={this.handleOk}
                            loading={isSaving}
                            selectedPromotions={selected}
                        />
                    )
                }
                {this.renderHeader(!vanillaShareGroups.length)}
                {displayHeaderActions && this.renderHeaderActions()}
                <div style={{height: 15, background: '#F3F3F3'}}/>
                {
                    !!filteredShareGroups.length && (
                        <div className={style.bodyContainer} style={{ height: `calc(100% - ${ displayHeaderActions ? 123 : 75 }px)`  }}>
                            {
                                isQuerying && (
                                    <div  className={style.spinner}>
                                        <Spin/>
                                    </div>
                                )
                            }
                            {
                                filteredShareGroups.map((shareGroup, index) => {
                                    return (
                                        <div
                                            key={`${index}`}
                                            className={style.shareGroupWrapper}
                                            style={{
                                                width: 'calc(50% - 5px)'
                                            }}
                                        >
                                            <div className={style.shareGroupHeader}>
                                                <div className={style.shareGroupTitle}>
                                                    {`营销活动共享组${index + 1}`}
                                                </div>
                                                <div className={style.flexSpacer} />
                                                {
                                                    this.isMyShareGroup(shareGroup) ? (
                                                        <Button
                                                            type="ghost"
                                                            style={{
                                                                marginRight: 10
                                                            }}
                                                            onClick={() => this.handleEditShareGroup(shareGroup)}
                                                        >
                                                            <Icon type="edit"/>
                                                            编辑
                                                        </Button>
                                                    ) : (
                                                        <Tooltip title={`只能编辑由${this.props.user.shopID > 0 ? '本店铺' : '集团'}创建的共享组`}>
                                                            <Button disabled type="ghost" style={{marginRight: 10}}>
                                                                <Icon type="edit"/>
                                                                编辑
                                                            </Button>
                                                        </Tooltip>
                                                    )
                                                }
                                                {
                                                    this.isMyShareGroup(shareGroup) ? (
                                                        <Button type="ghost" onClick={() => this.handleDeleteGroup(shareGroup, index)}>
                                                            <Icon type="delete"/>
                                                            删除
                                                        </Button>
                                                    ) : (
                                                        <Tooltip title={`只能删除由${this.props.user.shopID > 0 ? '本店铺' : '集团'}创建的共享组`}>
                                                            <Button disabled type="ghost">
                                                                <Icon type="delete"/>
                                                                删除
                                                            </Button>
                                                        </Tooltip>
                                                    )
                                                }
                                            </div>
                                            <div className={style.shareGroupBody}>
                                                {
                                                    (shareGroup.shareGroupDetailList || []).map(item => {
                                                        return (
                                                            <div className={style.shareGroupItem}>
                                                                <div className={style.typeTag}>
                                                            <span>
                                                                {getItemTag(item)}
                                                            </span>
                                                                </div>
                                                                <div className={style.itemTitle}>
                                                                    {item.activityName}
                                                                </div>
                                                                <div className={style.itemAction}>
                                                                    {
                                                                        ((shareGroup.shareGroupDetailList || []).length) > 2 && (
                                                                            <Popconfirm title="确定要将该条目移除吗?" onConfirm={() => this.handleRemoveItemFromGroup(shareGroup, item)}>
                                                                                <a disabled={!this.isMyShareGroup(shareGroup)}>移除</a>
                                                                            </Popconfirm>
                                                                        )
                                                                    }
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                }
                {
                    !filteredShareGroups.length && !vanillaShareGroups.length && (
                        <div className={style.emptyBodyContainer} style={{ height: `calc(100% - ${ displayHeaderActions ? 123 : 75 }px)`  }}>
                            <img src={emptyPage} alt=""/>
                            <span className={style.primaryTip}>您还未创建共享活动规则</span>
                            <span className={style.tip}>默认所有的活动优惠不共享，如需共享请选择相应的活动创建共享活动组</span>
                            <Button
                                type="primary"
                                onClick={() => this.setState({ isCreate: true, isEdit: false })}
                                style={{ marginTop: 20}}
                            >
                                立即创建
                            </Button>
                        </div>
                    )
                }
                {
                    !filteredShareGroups.length && !!vanillaShareGroups.length && (
                        <div className={style.emptyBodyContainer} style={{ height: `calc(100% - ${ displayHeaderActions ? 123 : 75 }px)`  }}>
                            <img src={emptyPage} alt=""/>
                            <span className={style.tip}>没有检索到符合条件的共享组</span>
                        </div>
                    )
                }

            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        isQuerying: state.share_rules.get('isQuerying'),
        isSaving: state.share_rules.get('isSaving'),
        shareGroups: state.share_rules.get('shareGroups'),
        isCreate: state.share_rules.get('isCreate'),
        isRemoving: state.share_rules.get('isRemoving'),
        isDeleting: state.share_rules.get('isDeleting'),
        searchPromotionType: state.share_rules.get('searchPromotionType'),
        searchPromotionName: state.share_rules.get('searchPromotionName'),
        isEdit: state.share_rules.get('isEdit'),
        share_rules: state.messageTemplateState.get('messageTemplateList'),
        user: state.user.toJS(),
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        myActivities: state.sale_myActivities_NEW,
        giftInfoNew: state.sale_giftInfoNew, // 所有哗啦啦券列表--共享用
        mySpecialActivities: state.sale_mySpecialActivities_NEW, // 所有会员等级列表--共享用
    }
}

function mapDispatchToProps(dispatch) {
    return {
        changeSearchType: opts => dispatch(changeSearchType(opts)),
        changeSearchName: opts => dispatch(changeSearchName(opts)),
        startCreateShareGroup: opts => dispatch(startCreateShareGroup(opts)),
        startEditCertainShareGroup: opts => dispatch(startEditCertainShareGroup(opts)),
        queryShareGroups: opts => dispatch(queryShareGroups(opts)),
        createOrUpdateCertainShareGroup: (opts) => dispatch(createOrUpdateCertainShareGroup(opts)),
        deleteCertainShareGroup: opts => dispatch(deleteCertainShareGroup(opts)),
        removeItemFromCertainShareGroup: opts => dispatch(removeItemFromCertainShareGroup(opts)),

        fetchAllPromotionList: (opts) => {
            dispatch(fetchAllPromotionListAC(opts))
        },
        FetchGiftList: (opts) => {
            dispatch(FetchGiftList(opts))
        },
    };
}
