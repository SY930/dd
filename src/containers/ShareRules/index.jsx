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
import {fetchPromotionScopeInfo} from "../../redux/actions/saleCenterNEW/promotionScopeInfo.action";
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from './IntlDecor';

const { Option, OptGroup } = Select;
const AVAILABLE_PROMOTIONS = Object.keys(BASIC_PROMOTION_MAP);

@registerPage([SHARE_RULES_GROUP, SHARE_RULES_SHOP], {
    share_rules
})
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl()
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
            pageSize: 10000,
            pageNo: 1,
        }, true);
        this.queryAll();
        this.props.getAllShops();
    }

    handleDeleteGroup = ({ itemID,shareGroupName }, index) => {
        Modal.confirm({
            title: <span style={{color: '#434343'}}>{SALE_LABEL.k5dnw1q3} ?</span>,
            content: (
                <div>
                    <span style={{color: '#787878'}}>
                         {COMMON_LABEL.delete}【{shareGroupName || `营销活动共享组${index + 1}`}】
                    </span>
                    <br/>
                    <span style={{color: '#aeaeae'}}>
                        {SALE_LABEL.k5do4z54}
                    </span>
                </div>
            ),
            onOk: () => {
                return this.props.deleteCertainShareGroup({
                    masterItemID: itemID,
                    shopID: this.props.user.shopID > 0 ? this.props.user.shopID : undefined,
                }).then(() => {
                    message.success(SALE_LABEL.k5do0ps6);
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
            message.success(SALE_LABEL.k5do0ps6)
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
                        {SALE_LABEL.k636qusa}
                    </span>
                    {
                        !isEmpty && (
                            <Alert style={{color: '#E4843B'}} message={SALE_LABEL.k636qvxy} type="warning" showIcon />
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
                            {SALE_LABEL.k636qv0m}
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
        const { intl } = this.props;
        const k5eng042 = intl.formatMessage(SALE_STRING.k5eng042);
        const k636qv8y = intl.formatMessage(SALE_STRING.k636qv8y);

        const k5m5av7b = intl.formatMessage(SALE_STRING.k5m5av7b);
        const k5m5avfn = intl.formatMessage(SALE_STRING.k5m5avfn);
        const k5m5avnz = intl.formatMessage(SALE_STRING.k5m5avnz);
        const k5m5avwb = intl.formatMessage(SALE_STRING.k5m5avwb);
        const k636qvha = intl.formatMessage(SALE_STRING.k636qvha);
        const k636qvpm = intl.formatMessage(SALE_STRING.k636qvpm);
        const k5m5aw4n = intl.formatMessage(SALE_STRING.k5m5aw4n);
        const k5m4q0r2 = intl.formatMessage(SALE_STRING.k5m4q0r2);
        const k5m4q0ze = intl.formatMessage(SALE_STRING.k5m4q0ze);
        return (
            <div className={style.headerActions}>
                <span className={style.headerLabel}>
                    {SALE_LABEL.k5dk5uwl}
                </span>

                <Select
                    style={{ width: 160, marginRight: 20 }}
                    value={searchTypeInput}
                    onChange={(v) => this.setState({ searchTypeInput: v })}
                >
                    <Option value="">
                        {k5eng042}
                    </Option>
                    <OptGroup label={k636qv8y}>
                        {
                            AVAILABLE_PROMOTIONS.map(item => (
                                <Option key={item} value={item}>{BASIC_PROMOTION_MAP[item]}</Option>
                            ))
                        }
                    </OptGroup>
                    <OptGroup label={k5m5av7b}>
                    <Option value="10">{k5m5avfn}</Option>
                    <Option value="20">{k5m5avnz}</Option>
                    <Option value="21">{k5m5avwb}</Option>
                    <Option value="111">{k636qvha}</Option>
                    <Option value="110">{k636qvpm}</Option>
                    </OptGroup>
                    <OptGroup label={k5m5aw4n}>
                    <Option value="-10">{k5m4q0r2}</Option>
                    <Option value="-20">{k5m4q0ze}</Option>
                    </OptGroup>
                </Select>
                <span className={style.headerLabel}>
                    {SALE_LABEL.k5dlcm1i}
                </span>

                <Input
                    value={searchNameInput}
                    onChange={(e) => this.setState({ searchNameInput: e.target.value })}
                    onPressEnter={() => {
                        changeSearchType(searchTypeInput);
                        changeSearchName(searchNameInput);
                        this.queryAll()
                    }}
                    style={{ width: 240, marginRight: 20 }}
                    placeholder=""
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
                    <Icon type="search"/>
                    { COMMON_LABEL.query }
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

    handleEditShareGroup = (shareGroup,index) => {
        this.setState({
            isEdit: true,
            isCreate: false,
            selected: (shareGroup.shareGroupDetailList || []).filter(item => item.action !== 2).map(item => String(item.activityID)),
            selectedGroupID: shareGroup.itemID,
            shareGroupName: shareGroup.shareGroupName || `营销活动共享组${index + 1}`
        })
    }

    handleOk = ({shareGroupDetailList,shareGroupName}) => {
        const { selectedGroupID } = this.state;
        return this.props.createOrUpdateCertainShareGroup({
            shareGroupName,
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
            message.success(SALE_LABEL.k5do0ps6);
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
    getCreateBy = ({ shopID }) => {
        const { shops } = this.props;
        const res = shops.find(item => item.get('shopID') == shopID);
        if(res){
            return res.get('shopName');
        }
        return  <p>{SALE_LABEL.k639vfmm + SALE_LABEL.k639vfuy + shopID + COMMON_LABEL.create}</p>;
    }
    getItemTag = (item) => {
        const { intl } = this.props;
        const k5m4q0r2 = intl.formatMessage(SALE_STRING.k5m4q0r2);
        const k5m4q0ze = intl.formatMessage(SALE_STRING.k5m4q0ze);
        const k639vg3a = intl.formatMessage(SALE_STRING.k639vg3a);
        const {
            activityType,
            activitySourceType,
        } = item || {};
        let tag;
        activityType == 10 && (tag = BASIC_PROMOTION_MAP[activitySourceType]);
        activityType == 30 && (tag = GIFT_MAP[activitySourceType]);
        activityType == 20 && activitySourceType == -10 && (tag = k5m4q0r2);
        activityType == 20 && activitySourceType == -20 && (tag = k5m4q0ze);
        return tag || k639vg3a
    }
    render() {
        const {
            shareGroups,
            isQuerying,
            searchPromotionType,
            searchPromotionName,
            isSaving,
        } = this.props;
        const {
            isCreate,
            isEdit,
            selected,
            shareGroupName
        } = this.state;
        const vanillaShareGroups = shareGroups.toJS();
        const filteredShareGroups = searchPromotionType || searchPromotionName ? this.getFilteredGroup(vanillaShareGroups) : vanillaShareGroups
        const displayHeaderActions = !!vanillaShareGroups.length;

        let shareGroupNameCurrent =  filteredShareGroups && filteredShareGroups.length ? `营销活动共享组${filteredShareGroups.length + 1}` :
        '营销活动共享组1'
        if(isEdit) {
            shareGroupNameCurrent = shareGroupName
        }
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
                            shareGroupName={
                                shareGroupNameCurrent
                            }
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
                                                {shareGroup.shareGroupName ||   '营销活动共享组' + `${index + 1}`}
                                                </div>
                                                {
                                                    shareGroup.shopID > 0 && (
                                                        <div className={style.shareGroupTitleTip}>
                                                            {this.getCreateBy(shareGroup)}
                                                        </div>
                                                    )
                                                }
                                                <div className={style.flexSpacer} />
                                                {
                                                    this.isMyShareGroup(shareGroup) ? (
                                                        <Button
                                                            type="ghost"
                                                            style={{
                                                                marginRight: 10
                                                            }}
                                                            onClick={() => this.handleEditShareGroup(shareGroup,index)}
                                                        >
                                                            <Icon type="edit"/>
                                                            {COMMON_LABEL.edit}
                                                        </Button>
                                                    ) : (
                                                        <Tooltip title={`${'只能编辑由'}${this.props.user.shopID > 0 ? '本店铺' : '集团'}${'创建的共享组'}`}>
                                                            <Button disabled type="ghost" style={{marginRight: 10}}>
                                                                <Icon type="edit"/>
                                                                {COMMON_LABEL.edit}
                                                            </Button>
                                                        </Tooltip>
                                                    )
                                                }
                                                {
                                                    this.isMyShareGroup(shareGroup) ? (
                                                        <Button type="ghost" onClick={() => this.handleDeleteGroup(shareGroup, index)}>
                                                            <Icon type="delete"/>
                                                            {COMMON_LABEL.delete}
                                                        </Button>
                                                    ) : (
                                                        <Tooltip title={`${'只能删除由'}${this.props.user.shopID > 0 ? '本店铺' : '集团'}${'创建的共享组'}`}>
                                                            <Button disabled type="ghost">
                                                                <Icon type="delete"/>
                                                                {COMMON_LABEL.delete}
                                                            </Button>
                                                        </Tooltip>
                                                    )
                                                }
                                            </div>
                                            <div className={style.shareGroupBody}>
                                                {
                                                    (shareGroup.shareGroupDetailList || []).map(item => {
                                                        const aa = <span>{item.activityName} {SALE_LABEL.k639ve8m}</span>
                                                       return (
                                                            <div className={style.shareGroupItem} key={item.itemID}>
                                                                <div className={style.typeTag}>
                                                            <span>
                                                                {this.getItemTag(item)}
                                                            </span>
                                                                </div>
                                                                <div className={style.itemTitle}>
                                                                    {item.action !== 2 ? item.activityName : aa}
                                                                </div>
                                                                <div className={style.itemAction}>
                                                                    {
                                                                        (((shareGroup.shareGroupDetailList || []).length) > 2 && item.action !== 2) && (
                                                                            <Popconfirm title={SALE_LABEL.k5dnw1q3} onConfirm={() => this.handleRemoveItemFromGroup(shareGroup, item)}>
                                                    <a disabled={!this.isMyShareGroup(shareGroup)}>{COMMON_LABEL.delete}</a>
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
                            <span className={style.primaryTip}>{SALE_LABEL.k639vdry}</span>
                    <span className={style.tip}>{SALE_LABEL.k636qvxy}</span>
                            <Button
                                type="primary"
                                onClick={() => this.setState({ isCreate: true, isEdit: false })}
                                style={{ marginTop: 20}}
                            >
                            {COMMON_LABEL.create}
                            </Button>
                        </div>
                    )
                }
                {
                    !filteredShareGroups.length && !!vanillaShareGroups.length && (
                        <div className={style.emptyBodyContainer} style={{ height: `calc(100% - ${ displayHeaderActions ? 123 : 75 }px)`  }}>
                            <img src={emptyPage} alt=""/>
                            <span className={style.tip}>{SALE_LABEL.k639ve0a}</span>
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
        shops: state.sale_promotionScopeInfo_NEW.getIn(['refs', 'data', 'shops']),
        shareGroupName: state.share_rules.get('shareGroupName'),
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
        FetchGiftList: (opts, isAllGifts) => {
            dispatch(FetchGiftList(opts, isAllGifts))
        },
        getAllShops: (opts) => {
            dispatch(fetchPromotionScopeInfo(opts));
        },
    };
}
