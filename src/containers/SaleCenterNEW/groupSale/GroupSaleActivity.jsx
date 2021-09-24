/**
* @Author: Xiao Feng Wang  <xf>
* @Date:   2017-03-28T10:51:51+08:00
* @Email:  wangxiaofeng@hualala.com
* @Filename: GroupSaleActivity.jsx
* @Last modified by:   xf
* @Last modified time: 2017-03-28T19:24:47+08:00
* @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
*/


import NewPromotion from '../common/NewPromotion';
import { connect } from 'react-redux';
import { saleCenterAddNewActivityAC, saleCenterUpdateNewActivityAC } from '../../../redux/actions/saleCenterNEW/promotion.action';
import { initialFullCutDataAC } from '../../../redux/actions/saleCenterNEW/fullCutActivity.action';
import { saleCenterResetBasicInfoAC } from '../../../redux/actions/saleCenterNEW/promotionBasicInfo.action';
import { saleCenterResetDetailInfoAC } from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import { saleCenterResetScopeInfoAC } from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action';
import { message } from 'antd';
import { jumpPage } from '@hualala/platform-base'
import PromotionBasicInfo from '../common/promotionBasicInfo';
import PromotionScopeInfo from '../common/promotionScopeInfo';
import CustomProgressBar from '../common/CustomProgressBar';
import {
    promotionBasicDataAdapter,
    promotionScopeInfoAdapter,
    promotionDetailInfoAdapter,
} from '../../../redux/actions/saleCenterNEW/types';
import {
    SALE_CENTER_PAGE_SHOP,
    SALE_CENTER_PAGE,
    ONLINE_PROMOTION_MANAGEMENT_GROUP,
    ONLINE_PROMOTION_MANAGEMENT_SHOP,
} from '../../../constants/entryCodes';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import BasicInfo from './BasicInfo';
import ActivityRange from './ActivityRange'
import { getCardList } from '../../GiftNew/GiftAdd/AxiosFactory';
import { axiosData } from '../../../helpers/util';

class GroupSaleActivity extends NewPromotion {
    constructor(props) {
        super(props);

        this.handles = []; // store the callback
        this.state = {
            giftTreeData: [],
            unionList: [],
            data: props.data || {},
            itemID: props.data && props.data.itemID,
        };
        this.onFinish = this.onFinish.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handlePrev = this.handlePrev.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleFinish = this.handleFinish.bind(this);
    }

    componentDidMount() {
        getCardList({}).then(x => {
            const type = [10, 20, 21, 111, 110]
            const giftList = x.filter((item) => {
                return type.includes(item.key)
            })
            const unionList = giftList.reduce((result, item) => {
                return result.concat(item.children)
            }, [])
            this.setState({ giftTreeData: giftList, unionList, });
        });
    }

    onFinish(cb) {
        const { promotionBasicInfo, promotionScopeInfo, promotionDetailInfo, isOnline, isCopy } = this.props;
        const basicInfo = promotionBasicDataAdapter(promotionBasicInfo.get('$basicInfo').toJS(), true);
        const scopeInfo = promotionScopeInfoAdapter(promotionScopeInfo.get('$scopeInfo').toJS(), true);
        const _detailInfo = promotionDetailInfoAdapter(promotionDetailInfo.get('$promotionDetail').toJS(), true);
        const detailInfo = promotionDetailInfo.get('$promotionDetail').toJS();
        const isActive = detailInfo.isActive;
        let userType = detailInfo.userSetting;
        const subjectType = detailInfo.subjectType == '0' ? '0' : '1';
        const sharedPromotionIDLst = detailInfo.mutexPromotions || [];
        const excludedSubjectLst = typeof detailInfo.mutexSubjects === 'object' ? detailInfo.mutexSubjects.join(',') : detailInfo.mutexSubjects;
        const roleIDLst = typeof detailInfo.role === 'object' ? detailInfo.role.join(',') : detailInfo.role;
        const _roleIDLst = scopeInfo.channelLst == 'WECHAT' ? '' : roleIDLst;
        const shareLst = typeof detailInfo.mutexPromotions === 'object' ? detailInfo.mutexPromotions.map((promotion) => {
            return {
                sharedID: promotion.promotionIDStr || promotion.sharedIDStr,
                sharedType: promotion.sharedType ? promotion.sharedType : '10',
            }
        }) : []
        const giftList = detailInfo.giftList || [];
        const opts = {
            groupID: this.props.user.getIn(['accountInfo', 'groupID']),
            maintenanceLevel: this.props.user.get('shopID') ? '1' : '0',
            ...detailInfo,
            ...scopeInfo,
            ...basicInfo,
            ..._detailInfo, // include rule and priceLst
            userType,
            excludedSubjectLst,
            subjectType,
            roleIDLst: _roleIDLst,
            isActive,
            shareLst,
            giftList,
            usageMode: scopeInfo.usageMode,
        };
        if (!opts.shopIDLst && promotionBasicInfo.getIn(['$basicInfo', 'shopIDLst']) > 0) {
            opts.shopIDLst = promotionBasicInfo.getIn(['$basicInfo', 'shopIDLst'])
        }
        // 和志超更改接口后的数据结构
        // const { groupID, promotionName, promotionShowName, categoryName, promotionCode,
        //     tagLst, description, promotionType, startDate, endDate, excludedDate,
        //     validCycle, cityLst, brandIDLst, orgIDLst, shopIDLst, excludedShopIDLst,
        //     orderTypeLst, channelLst, crmLevelLst, foodScopeType, ruleJson, defaultRun,
        //     maintenanceLevel, usageMode, shopID, foodRuleList, birthdayLimit, cardBalanceLimitType = 0 } = opts;

        // 重新整合接口数据
        const {
            data = {},
        } = this.state
        const {
            modifyBy,
            extraEventType = '10071',
            productsLimit,
            description,
            name,
            bannerUrl,
            virtualSales,
            reservationTime,
            joinCount,
            isJoin,
            virtualGroup,
            activeType,
            startTime,
            endTime,
            shopIDs,
            productList,
        } = data

        const params = {
            extraEventType,
            productsLimit,
            description,
            name,
            bannerUrl,
            virtualSales,
            reservationTime,
            joinCount,
            isJoin,
            virtualGroup,
            activeType,
            startTime,
            endTime,
            shopIDs,
            productList,
        }
        if (this.props.isNew === false) {
            const {
                itemID,
            } = this.state
            params.itemID = itemID
            axiosData('/promotion/extra/shopExtraEventService_updateExtraEvent.ajax', params, null, {}, 'HTTP_SERVICE_URL_PROMOTION_NEW')
                .then(() => {
                    message.success('活动更新完成');
                    this.setState({
                        loading: false,
                    });
                    cb && cb();
                }, (err) => {
                    message.warning(err)
                    this.setState({
                        loading: false,
                    });
                })
        } else {
            axiosData('/promotion/extra/shopExtraEventService_addExtraEvent.ajax', params, null, {}, 'HTTP_SERVICE_URL_PROMOTION_NEW')
                .then(() => {
                    message.success('活动创建完成');
                    this.setState({
                        loading: false,
                    });
                    jumpPage({ pageID: '10000730002' })
                    cb && cb();
                }, (err) => {
                    message.warning(err)
                    this.setState({
                        loading: false,
                    });
                })
        }
    }


    handleNext(cb, index) {
        let flag = true;
        if (undefined !== this.handles[index].next && typeof this.handles[index].next === 'function') {
            flag = this.handles[index].next();
        }
        if (flag) {
            cb();
        }
    }

    handlePrev(cb, index) {
        // cb is CustomProgressBar's onPrev which is just modify the state of it.
        // do extra
        let flag = true;
        if (undefined !== this.handles[index].prev && typeof this.handles[index].prev === 'function') {
            flag = this.handles[index].prev();
        }
        if (flag) {
            cb();
        }
    }

    handleDataChange = (data) => {
        this.setState({ data: { ...this.state.data, ...data } });
    }


    handleCancel(cb, index) {
        this.props.callbacktwo(3);
        this.props.clear();
    }

    handleFinish(cb, index) {
        let flag = true;

        if (undefined !== this.handles[index].finish && typeof this.handles[index].finish === 'function') {
            flag = this.handles[index].finish();
        }
        if (flag) {
            this.setState({
                loading: true,
            });
            setTimeout(() => {
                this.onFinish(() => {
                    cb();
                    this.props.callbacktwo(3);
                });
            }, 0);
        }
    }

    render() {
        if (this.props.component === undefined) {
            throw new Error('component is required');
        }
        const {
            isNew,
            isOnline,
            isCopy,
        } = this.props;
        const {
            giftTreeData,
            unionList,
            data = {},
        } = this.state
        const steps = [
            {
                title: SALE_LABEL.k5g5bcqo,
                content: (
                    <BasicInfo
                        isNew={isNew}
                        isCopy={isCopy}
                        getSubmitFn={(handles) => {
                            this.handles[0] = handles;
                        }}
                        onChange={this.handleDataChange}
                        data={data}
                    />
                ),
            },
            {
                title: SALE_LABEL.k5gfsuwz,
                content: (
                    <PromotionScopeInfo
                        getSubmitFn={(handles) => {
                            this.handles[1] = handles;
                        }}
                        isOnline={isOnline}
                        isNew={isNew}
                        isCopy={isCopy}
                        onChange={this.handleDataChange}
                        data={data}
                    />
                ),
            },
            {
                title: SALE_LABEL.k5g5bcz0,
                content: React.createElement(
                    this.props.component,
                    {
                        getSubmitFn: (handles) => {
                            this.handles[2] = handles;
                        },
                        // onChange: (rule) => {
                        //     this.setState({ rule });
                        // },
                        onChange: this.handleDataChange,
                        isNew,
                        isCopy,
                        isOnline,
                        treeData: giftTreeData,
                        unionList,
                        data,
                    }
                ),
            },
        ];
        return (
            <CustomProgressBar
                steps={steps}
                loading={this.state.loading}
                callback={(arg) => {
                    this.props.callbacktwo(arg);
                }}
                onNext={this.handleNext}
                onFinish={this.handleFinish}
                onPrev={this.handlePrev}
                onCancel={this.handleCancel}
            />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        fullCut: state.sale_fullCut_NEW,
        promotionBasicInfo: state.sale_promotionBasicInfo_NEW,
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        user: state.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        initialData: (opts) => {
            dispatch(initialFullCutDataAC(opts));
        },
        addNewPromotion: (opts) => {
            dispatch(saleCenterAddNewActivityAC(opts));
        },
        updateNewPromotion: (opts) => {
            dispatch(saleCenterUpdateNewActivityAC(opts));
        },
        clear: () => {
            dispatch(saleCenterResetBasicInfoAC());
            dispatch(saleCenterResetDetailInfoAC());
            dispatch(saleCenterResetScopeInfoAC());
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupSaleActivity);
