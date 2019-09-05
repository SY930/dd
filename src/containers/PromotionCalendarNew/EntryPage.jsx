import React, { Component } from 'react';
import {
    Button,
    DatePicker,
    Select,
    Icon,
    TreeSelect,
    message,
    Spin,
    Modal,
    Row,
    Col,
} from 'antd';
import moment from 'moment';
import Immutable from 'immutable';
import { jumpPage, closePage } from '@hualala/platform-base';
import { connect } from 'react-redux';
import { axiosData } from '../../helpers/util'
import registerPage from '../../../index';
import ShopSelector from "../../components/common/ShopSelector";
import {
    PROMOTION_CALENDAR_NEW,
    SALE_CENTER_PAGE,
    SPECIAL_PAGE,
    ONLINE_PROMOTION_MANAGEMENT_GROUP,
} from '../../constants/entryCodes';
import style from './style.less';
import PromotionCreateModal from '../NewCreatePromotions/PromotionCreateModal'
import CalendarList from './CalendarList';
import { isHuaTian } from '../../constants/projectHuatianConf'
import {
    NEW_CUSTOMER_PROMOTION_TYPES,
    FANS_INTERACTIVITY_PROMOTION_TYPES,
    REPEAT_PROMOTION_TYPES,
    LOYALTY_PROMOTION_TYPES,
    SALE_PROMOTION_TYPES,
    ONLINE_PROMOTION_TYPES,
} from '../../constants/promotionType';
import {
    fetchPromotionList,
    toggleIsUpdateAC,
} from '../../redux/actions/saleCenterNEW/myActivities.action';
import {
    fetchPromotionScopeInfo,
    saleCenterResetScopeInfoAC,
} from '../../redux/actions/saleCenterNEW/promotionScopeInfo.action';
import {getPromotionShopSchema} from '../../redux/actions/saleCenterNEW/promotionScopeInfo.action'
import {
    saleCenterResetDetailInfoAC,
    fetchFoodCategoryInfoAC,
    fetchFoodMenuInfoAC,
} from '../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import { saleCenterResetDetailInfoAC as resetSpecialDetailAC } from '../../redux/actions/saleCenterNEW/specialPromotion.action'
import {
    fetchPromotionDetail,
    resetPromotionDetail,
    fetchPromotionDetailCancel,
} from '../../redux/actions/saleCenterNEW/promotion.action';
import {
    getPromotionIdx,
    promotionBasicDataAdapter,
    promotionScopeInfoAdapter,
    promotionDetailInfoAdapter,
} from '../../redux/actions/saleCenterNEW/types';
import ActivityMain from '../SaleCenterNEW/activityMain';
import SpecialActivityMain from '../SpecialPromotionNEW/activityMain';
import {
    saleCenterSetSpecialBasicInfoAC,
    saleCenterResetDetailInfoAC as resetSpecialDetail,
} from '../../redux/actions/saleCenterNEW/specialPromotion.action'
import {
    saleCenterResetBasicInfoAC,
} from '../../redux/actions/saleCenterNEW/promotionBasicInfo.action';
import {
    fetchSpecialDetailAC,
} from '../../redux/actions/saleCenterNEW/mySpecialActivities.action';
import {
    getSpecialPromotionIdx,
    specialPromotionBasicDataAdapter,
} from '../../redux/actions/saleCenterNEW/types';

const Option = Select.Option;
const { MonthPicker } = DatePicker;
const disabledDate = current => {
    const yearDiff = moment(moment().format('YYYY0101'), 'YYYYMMDD')
        .diff(moment(current.format('YYYY0101'), 'YYYYMMDD'), 'years', true);
    return Math.abs(yearDiff) > 1;
}

const SUPPORT_ORDER_TYPES = [
    {
        label: '预定',
        value: '10',
    },
    {
        label: '闪吃',
        value: '11',
    },
    {
        label: '外送',
        value: '20',
    },
    {
        label: '堂食',
        value: '31',
    },
    {
        label: '自提',
        value: '21',
    },
];
const CHANNEL_LIST = [
    {
        value: 'POS',
        label: '云店',
    },
    {
        value: 'WECHAT',
        label: '微信',
    },
        {
        value: 'YST',
        label: '饮食通',
    },
];
const ALL_CATEGORIES = [
    {
        title: '促进销量',
        list: SALE_PROMOTION_TYPES,
    },
    {
        title: '会员拉新',
        list: NEW_CUSTOMER_PROMOTION_TYPES,
    },
    {
        title: '促进复购',
        list: REPEAT_PROMOTION_TYPES,
    },
    {
        title: '粉丝互动',
        list: FANS_INTERACTIVITY_PROMOTION_TYPES,
    },
    {
        title: '会员关怀',
        list: LOYALTY_PROMOTION_TYPES,
    },
    {
        title: '线上营销',
        list: ONLINE_PROMOTION_TYPES,
    },
]

const mapDispatchToProps = (dispatch) => {
    return {
        // 查询品牌、店铺等信息
        fetchPromotionScopeInfo: (opts) => {
            dispatch(fetchPromotionScopeInfo(opts));
        },
        // 查询活动详情
        fetchPromotionDetail_NEW: (opts) => {
            dispatch(fetchPromotionDetail(opts))
        },
        // 查询活动列表
        fetchPromotionList: (opts) => {
            dispatch(fetchPromotionList(opts))
        },
        // reset
        saleCenterResetBasicInfo: (opts) => {
            dispatch(saleCenterResetBasicInfoAC(opts));
        },
        // reset
        saleCenterResetScopeInfo: (opts) => {
            dispatch(saleCenterResetScopeInfoAC(opts));
        },
        // reset
        saleCenterResetDetailInfo: (opts) => {
            dispatch(saleCenterResetDetailInfoAC(opts));
        },
        // reset promotionDetail in myActivities.reducer $promotionDetailInfo
        resetPromotionDetail: () => {
            dispatch(resetPromotionDetail());
        },
        // cancel the promotion detail fetch operation
        cancelFetchPromotionDetail: () => {
            dispatch(fetchPromotionDetailCancel())
        },
        toggleIsUpdate: (opts) => {
            dispatch(toggleIsUpdateAC(opts))
        },
        fetchFoodCategoryInfo: (opts, flag, id) => {
            dispatch(fetchFoodCategoryInfoAC(opts, flag, id))
        },
        fetchFoodMenuInfo: (opts, flag, id) => {
            dispatch(fetchFoodMenuInfoAC(opts, flag, id))
        },
        saleCenterSetSpecialBasicInfo: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts))
        },
        fetchSpecialDetail: (opts) => {
            dispatch(fetchSpecialDetailAC(opts))
        },
        getPromotionShopSchema: (opts) => {
            dispatch(getPromotionShopSchema(opts));
        },
        saleCenterResetSpecialDetailInfo: (opts) => {
            dispatch(resetSpecialDetailAC(opts))
        },
    };
};
const mapStateToProps = (state) => {
    return {
        myActivities: state.sale_myActivities_NEW,
        mySpecialActivities: state.sale_mySpecialActivities_NEW,
        promotionBasicInfo: state.sale_promotionBasicInfo_NEW,
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        shopSchema: state.sale_shopSchema_New,
        user: state.user,
        groupID: state.user.getIn(['accountInfo','groupID']),
    };
};

@registerPage([PROMOTION_CALENDAR_NEW])
@connect(mapStateToProps, mapDispatchToProps)
export default class EntryPage extends Component {

    constructor(props) {
        super(props);
        const shopSchema = props.shopSchema.getIn(['shopSchema']).toJS();
        this.state = {
            shopSchema,
            createModalVisible: false,
            loading: false,
            shopIDList: [],
            channelList: [],
            supportOrderTypeList: [],
            startDate: moment(),
            intervalStartMonth: moment().format('YYYYMM'),
            promotionInfoList: [],
        }
    }

    catalogPromotionListByEventType = () => {
        const promotionMap = new Map();
        const { promotionInfoList } = this.state;
        promotionInfoList.forEach(promotionInfo => {
            const subList = promotionMap.get(`${promotionInfo.eventType}`) || [];
            subList.push(promotionInfo)
            promotionMap.set(`${promotionInfo.eventType}`, subList)
        })
        const displayArray = [];
        ALL_CATEGORIES.forEach(({title, list}) => {
            if (list.some(({key}) => promotionMap.has(key))) {
                displayArray.push({isCategoryPlaceHolder: true, title});
                list.forEach(({key, title: subTitle}) => {
                    if (promotionMap.has(key)) {
                        displayArray.push(...promotionMap.get(key).map(item => ({...item, title: subTitle})))
                    }
                }) 
            }
        })
        return displayArray;
    }

    handleQuery = () => {
        const {
            shopIDList,
            channelList,
            supportOrderTypeList,
            startDate,
        } = this.state;
        this.setState({
            loading: true,
        })
        axiosData(
            '/calendar/eventCalendarService_queryPromotionList.ajax',
            {
                shopIDList,
                channelList,
                supportOrderTypeList,
                startDate: startDate.format('YYYYMM01')
            },
            {},
            { path: 'promotionInfoList' },
            'HTTP_SERVICE_URL_PROMOTION_NEW'
        ).then(data => {
            this.setState({
                loading: false,
                promotionInfoList: Array.isArray(data) ? data : [],
                intervalStartMonth: startDate.format('YYYYMM'),
            })
        }).catch(err => {
            this.setState({
                loading: false,
            })
        })
    }

    componentDidMount() {
        this.props.fetchPromotionScopeInfo({
            _groupID: this.props.user.getIn(['accountInfo','groupID'])
        });
        this.handleQuery();
        const { getPromotionShopSchema, groupID} = this.props;
        getPromotionShopSchema({groupID});
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.shopSchema.getIn(['shopSchema']) !== this.props.shopSchema.getIn(['shopSchema'])) {
            this.setState({shopSchema: nextProps.shopSchema.getIn(['shopSchema']).toJS(), // 后台请求来的值
            });
        }
    }

    openCreateModal = () => {
        this.setState({createModalVisible: true})
    }
    handleMonthChange = (v) => {
        this.setState({
            startDate: v,
        })
    }
    handleChannelListChange = (v) => {
        this.setState({
            channelList: v,
        })
    }
    handleSupportOrderTypeChange = (v) => {
        this.setState({
            supportOrderTypeList: v,
        })
    }
    handlePromotionEditOrPreviewBtnClick = (entity, type) => {
        const { eventType, eventCategory } = entity;
        const typeStr = `${eventType}`;
        this.props.toggleIsUpdate(type === 'edit')
        this.setState({
            modalTitle: type === 'edit' ? '更新活动信息' : '查看活动信息',
        })
        if (eventCategory === 10) {
            this.handleUpdateOpe(entity);
        } else {
            this.handleSpecialUpdateOpe(entity)
        }
        
    }

    successFn = (responseJSON) => {
        const _promotionIdx = getPromotionIdx(`${this.state.editPromotionType}`);
        const _serverToRedux = false;
        if (responseJSON.promotionInfo === undefined || responseJSON.promotionInfo.master === undefined) {
            message.error('没有查询到相应数据');
            return null;
        }
        if (responseJSON.promotionInfo.master.maintenanceLevel == '1') { // shop
            const opts = {
                _groupID: this.props.groupID,
                shopID: responseJSON.promotionInfo.master.shopIDLst,
            };
            this.props.fetchFoodCategoryInfo({ ...opts }, isHuaTian(), responseJSON.promotionInfo.master.subGroupID);
            this.props.fetchFoodMenuInfo({ ...opts }, isHuaTian(), responseJSON.promotionInfo.master.subGroupID);
        }
        // 把查询到的活动信息存到redux
        this.props.saleCenterResetBasicInfo(promotionBasicDataAdapter(responseJSON.promotionInfo, _serverToRedux));
        this.props.saleCenterResetScopeInfo(promotionScopeInfoAdapter(responseJSON.promotionInfo.master, _serverToRedux));
        this.props.saleCenterResetDetailInfo(promotionDetailInfoAdapter(responseJSON.promotionInfo, _serverToRedux));

        this.setState({
            promotionInfo: responseJSON.promotionInfo,
            isNew: false,
            index: _promotionIdx,
        });
    };

    failFn = () => {
        message.error('啊哦,好像出了点问题~');
    };

    handleUpdateOpe(_record) {
        if ( _record && _record.maintenanceLevel != '1') { // 集团
            this.props.fetchFoodCategoryInfo({
                _groupID: this.props.groupID },
                isHuaTian(),
                _record.subGroupID
            );
            this.props.fetchFoodMenuInfo({
                _groupID: this.props.groupID },
                isHuaTian(),
                _record.subGroupID
            );
        }
        this.props.fetchPromotionDetail_NEW({
            data: {
                promotionID: _record ? _record.eventID : this.state.currentPromotionID,
                groupID: this.props.groupID,
            },
            success: this.successFn,
            fail: this.failFn,
        });
        if (_record ) {
            this.setState({
                updateModalVisible: true,
                editPromotionType: `${_record.eventType}`,
                currentPromotionID: _record.eventID,
            });
        }
    }

    specialSuccessFn = (response) => {
        const _serverToRedux = false;
        const _promotionIdx = getSpecialPromotionIdx(`${this.state.editEventWay}`);
        if (_promotionIdx === undefined) {
            message.warning('出错了, 请刷新重试');
            return;
        }
        if (response === undefined || response.data === undefined) {
            message.error('没有查询到相应数据');
            return null;
        }
        this.props.saleCenterSetSpecialBasicInfo(specialPromotionBasicDataAdapter(response, _serverToRedux));
        this.setState({
            specialIsNew: false,
            specialIndex: _promotionIdx,
        });
    };

    specialFailFn = () => {
        message.error('啊哦,好像出了点问题~');
    };


    // 编辑
    handleSpecialUpdateOpe(_record) {
        this.props.fetchSpecialDetail({
            data: {
                itemID: _record ? _record.eventID : this.state.currentItemID, // 点击重试时record为undefiend
                groupID: this.props.groupID,
            },
            success: this.specialSuccessFn,
            fail: this.specialFailFn,
        });
        if (_record) {
            this.setState({
                specialModalVisible: true,
                editEventWay: `${_record.eventType}`,
                currentItemID: _record.eventID || this.state.currentItemID,
            });
        }
    }
    handleShopSelectorChange = (v) => {
        this.setState({
            shopIDList: v
        })
    }

    // 关闭更新
    handleDismissUpdateModal = () => {
        this.setState({
            specialModalVisible: false,
            updateModalVisible: false,
        }, () => {
            this.props.saleCenterResetBasicInfo();
            this.props.saleCenterResetScopeInfo();
            this.props.saleCenterResetDetailInfo();
            this.props.cancelFetchPromotionDetail();
            this.props.saleCenterResetSpecialDetailInfo();
        });
    }

    renderFilterBar() {
        const {
            shopIDList,
            channelList,
            supportOrderTypeList,
            startDate,
            loading,
        } = this.state;
        return (
            <div className={style.searchHeader}>
                <h5>月份</h5>
                <MonthPicker
                    allowClear={false}
                    style={{ width: 160, margin: '0 20px' }}
                    format="YYYY年MM月"
                    disabledDate={disabledDate}
                    value={startDate}
                    onChange={this.handleMonthChange}
                />
                <h5>适用店铺</h5>
                <div style={{ width: 160, margin: '0 20px' }}>
                    <ShopSelector
                        size="small"
                        value={shopIDList}
                        onChange={
                            this.handleShopSelectorChange
                        }
                        schemaData={this.state.shopSchema}
                    />
                </div>
                
                <h5>适用场景</h5>
                <Select
                    multiple={true}
                    style={{ width: 220, margin: '0 20px 0 10px' }}
                    value={channelList}
                    placeholder="全部"
                    onChange={this.handleChannelListChange}
                >
                    {
                        CHANNEL_LIST.map(({value, label}) => (
                            <Option key={value}>{label}</Option>
                        ))
                    }
                </Select>
                <h5>适用业务</h5>
                <Select
                    multiple={true}
                    value={supportOrderTypeList}
                    style={{ width: 200, margin: '0 20px 0 10px' }}
                    placeholder="全部"
                    onChange={this.handleSupportOrderTypeChange}
                >
                    {
                        SUPPORT_ORDER_TYPES.map(({value, label}) => (
                            <Option key={value}>{label}</Option>
                        ))
                    }
                </Select>
                <Button
                    type="primary"
                    loading={loading}
                    onClick={this.handleQuery}
                >
                    <Icon type="search" />
                    查询
                </Button>
            </div>
        );
    }

    renderBody() {
        const { createModalVisible, intervalStartMonth } = this.state;
        return (
            <div>
                {this.renderFilterBar()}
                <CalendarList
                    list={this.catalogPromotionListByEventType()}
                    startMonth={intervalStartMonth}
                    onEditOrPreviewBtnClick={this.handlePromotionEditOrPreviewBtnClick}
                />
                {createModalVisible && (
                    <PromotionCreateModal onCancel={() => this.setState({createModalVisible: false})}/>
                )}
            </div>
        )
    }

    renderHeader() {
        return (
            <div className={style.flexHeader} >
                <span className={style.title} >
                    营销日历
                </span>
                <div className={style.spacer} />
                <Button
                    type="primary"
                    icon="plus"
                    onClick={this.openCreateModal}
                    style={{ marginRight: 12 }}
                >
                    创建活动
                </Button>
                <Button
                    type="ghost"
                    onClick={() => {
                        jumpPage({ pageID: SALE_CENTER_PAGE })
                    }}
                >
                    活动管理
                </Button>
            </div>
        )
    }

    renderSpecialPromotionEditOrPreviewModal() {
        return (
            <Modal
                wrapClassName={'progressBarModal'}
                title={this.state.modalTitle}
                visible={this.state.specialModalVisible}
                footer={false}
                width={1000}
                height="569px"
                maskClosable={false}
                onCancel={this.handleDismissUpdateModal}
            >
                {this.state.specialModalVisible ? this.renderContentOfThisModal() : null}
            </Modal>
        );
    }

    renderContentOfThisModal() {
        const mySpecialActivities = this.props.mySpecialActivities.get('$specialDetailInfo').toJS();
        const _state = this.state;
        if (mySpecialActivities.status === 'start' || mySpecialActivities.status === 'pending') {
            return (
                <div className={style.spinFather}>
                    <Spin size="large" />
                </div>
            )
        }
        if (mySpecialActivities.status === 'timeout' || mySpecialActivities.status === 'fail') {
            return (
                <div className={style.spinFather}>
                    查询详情出错!点击 <a onClick={() => this.handleSpecialUpdateOpe()}>重试</a>
                </div>
            );
        }

        if (mySpecialActivities.status === 'success') {
            return (<SpecialActivityMain
                isNew={_state.specialIsNew}
                index={_state.specialIndex}
                callbackthree={(arg) => {
                    if (arg == 3) {
                        this.handleDismissUpdateModal();
                    }
                }}
            />);
        }
    }


    renderBasicPromotionEditOrPreviewModal() {
        return (
            <Modal
                wrapClassName="progressBarModal"
                title={this.state.modalTitle}
                visible={this.state.updateModalVisible}
                footer={false}
                width={1000}
                height="569px"
                maskClosable={false}
                onCancel={this.handleDismissUpdateModal}
            >
                { this.state.updateModalVisible && this.renderContentOfBasicPromotionModal()}
            </Modal>
        );
    }

    renderContentOfBasicPromotionModal() {
        const promotionDetailInfo = this.props.myActivities.get('$promotionDetailInfo').toJS();
        const _state = this.state;
        if (promotionDetailInfo.status === 'start' || promotionDetailInfo.status === 'pending') {
            return (
                <div className={style.spinFather}>
                    <Spin size="large" />
                </div>
            )
        }
        if (promotionDetailInfo.status === 'timeout' || promotionDetailInfo.status === 'fail') {
            return (
                <div className={style.spinFather}>
                    查询详情出错!点击 <a onClick={() => this.handleUpdateOpe()}>重试</a>
                </div>
            );
        }

        if (promotionDetailInfo.status === 'success') {
            return (<ActivityMain
                isNew={_state.isNew}
                index={_state.index}
                steps={_state.steps}
                callbackthree={(arg) => {
                    if (arg == 3) {
                        this.setState({
                            updateModalVisible: false,
                        });
                        this.handleQuery();
                    }
                }}
            />);
        }
    }

    render() {
        return (
            <div style={{ height: '100%' }}>
                {this.renderHeader()}
                <div className={style.blockLine} />
                {this.renderBody()}
                {this.renderBasicPromotionEditOrPreviewModal()}
                {this.renderSpecialPromotionEditOrPreviewModal()}
            </div>
        )
    }
}
