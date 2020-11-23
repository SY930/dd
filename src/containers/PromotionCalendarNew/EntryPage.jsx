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
import { axiosData, checkAuthLicense } from '../../helpers/util'
import registerPage from '../../../index';
import ShopSelector from "../../components/common/ShopSelector";
import EmptyPage from "../../components/common/EmptyPage";
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
    getAuthLicenseData
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
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from './IntlDecor';
import { getStore } from '@hualala/platform-base'

const Option = Select.Option;
const { MonthPicker } = DatePicker;
const disabledDate = current => {
    const yearDiff = moment(moment().format('YYYY0101'), 'YYYYMMDD')
        .diff(moment(current.format('YYYY0101'), 'YYYYMMDD'), 'years', true);
    return Math.abs(yearDiff) > 1;
}

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
        getAuthLicenseData: (opts) => {
            dispatch(getAuthLicenseData(opts))
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
        specialPromotion: state.sale_specialPromotion_NEW.toJS(),
        groupID: state.user.getIn(['accountInfo','groupID']),
    };
};

@registerPage([PROMOTION_CALENDAR_NEW])
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl()
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
            authStatus: false,
            authLicenseData: {}
        }
    }

    catalogPromotionListByEventType = () => {
        const { intl } = this.props;
        const k6316hto = intl.formatMessage(SALE_STRING.k6316hto);
        const k6316hd0 = intl.formatMessage(SALE_STRING.k6316hd0);
        const k6316iac = intl.formatMessage(SALE_STRING.k6316iac);
        const k6316hlc = intl.formatMessage(SALE_STRING.k6316hlc);
        const k6316iio = intl.formatMessage(SALE_STRING.k6316iio);
        const k6316i20 = intl.formatMessage(SALE_STRING.k6316i20);
        const ALL_CATEGORIES = [
            {
                title: k6316iio,
                list: SALE_PROMOTION_TYPES,
            },
            {
                title: k6316hto,
                list: NEW_CUSTOMER_PROMOTION_TYPES,
            },
            {
                title: k6316iac,
                list: REPEAT_PROMOTION_TYPES,
            },
            {
                title: k6316hd0,
                list: FANS_INTERACTIVITY_PROMOTION_TYPES,
            },
            {
                title: k6316hlc,
                list: LOYALTY_PROMOTION_TYPES,
            },
            {
                title: k6316i20,
                list: ONLINE_PROMOTION_TYPES,
            },
        ];
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
        const { getPromotionShopSchema, getAuthLicenseData, groupID} = this.props;
        getPromotionShopSchema({groupID});
        // 产品授权
        this.getAuthLicenseData()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.shopSchema.getIn(['shopSchema']) !== this.props.shopSchema.getIn(['shopSchema'])) {
            this.setState({shopSchema: nextProps.shopSchema.getIn(['shopSchema']).toJS(), // 后台请求来的值
            });
        }
    }

    // 产品授权
    getAuthLicenseData = (opts) => {
        axiosData(
            '/crm/crmAuthLicenseService.queryCrmPluginLicenses.ajax?auth',
            {
                ...opts,
                groupID: getStore().getState().user.getIn(['accountInfo', 'groupID'])
            },
            {},
            { path: '' },
            'HTTP_SERVICE_URL_CRM'
        ).then((res) => {
            let {data = {}} = res
            this.setState({authLicenseData: data})
            let {authStatus} = checkAuthLicense(this.state.authLicenseData)
            this.setState({authStatus})
        });
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
        const { intl } = this.props;
        const k5dohc0d = intl.formatMessage(SALE_STRING.k5dohc0d);
        const k6316klo = intl.formatMessage(SALE_STRING.k6316klo);
        const { eventType, eventCategory } = entity;
        const typeStr = `${eventType}`;
        this.props.toggleIsUpdate(type === 'edit')
        this.setState({
            modalTitle: type === 'edit' ? k5dohc0d : k6316klo,
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
            message.error(SALE_LABEL.k5dod8s9);
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
        message.error(SALE_LABEL.k5dmw1z4);
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
            message.warning(SALE_LABEL.k5dmw1z4);
            return;
        }
        if (response === undefined || response.data === undefined) {
            message.error(SALE_LABEL.k5dod8s9);
            return null;
        }
        this.props.saleCenterSetSpecialBasicInfo(specialPromotionBasicDataAdapter(response, _serverToRedux));
        this.setState({
            specialIsNew: false,
            specialIndex: _promotionIdx,
        });
    };

    specialFailFn = () => {
        message.error(SALE_LABEL.k5dmw1z4);
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
        const { intl } = this.props;
        const k5eng042 = intl.formatMessage(SALE_STRING.k5eng042);
        const k5m67a4r = intl.formatMessage(SALE_STRING.k5m67a4r);
        const k5m67ad3 = intl.formatMessage(SALE_STRING.k5m67ad3);
        const k5m67alf = intl.formatMessage(SALE_STRING.k5m67alf);
        const k5krn7fx = intl.formatMessage(SALE_STRING.k5krn7fx);
        const k5m67atr = intl.formatMessage(SALE_STRING.k5m67atr);
        const k5krn6qx = intl.formatMessage(SALE_STRING.k5krn6qx);
        const k5krn6z9 = intl.formatMessage(SALE_STRING.k5krn6z9);
        const k5krn77l = intl.formatMessage(SALE_STRING.k5krn77l);
        const k5eng39086 = intl.formatMessage(SALE_STRING.k5eng39086);

        const SUPPORT_ORDER_TYPES = [
            {
                label: k5m67a4r,
                value: '10',
            },
            {
                label: k5m67ad3,
                value: '11',
            },
            {
                label: k5m67alf,
                value: '20',
            },
            {
                label: k5krn7fx,
                value: '31',
            },
            {
                label: k5m67atr,
                value: '21',
            },
        ];
        const CHANNEL_LIST = [
            {
                value: 'POS',
                label: k5krn6qx,
            },
            {
                value: 'WECHAT',
                label: k5krn6z9,
            },
                {
                value: 'YST',
                label: k5krn77l,
            },
        ];
        return (
            <div className={style.searchHeader}>
                <h5>{SALE_LABEL.k6316ku0}</h5>
                <MonthPicker
                    allowClear={false}
                    style={{ width: 160, margin: '0 20px' }}
                    format="YYYY年MM月"
                    disabledDate={disabledDate}
                    value={startDate}
                    onChange={this.handleMonthChange}
                />
                <h5>{SALE_LABEL.k5dlggak}</h5>
                <div style={{ width: 160, margin: '0 20px' }}>
                    <ShopSelector
                        size="small"
                        value={shopIDList}
                        placeholder={k5eng39086}
                        onChange={
                            this.handleShopSelectorChange
                        }
                        schemaData={this.state.shopSchema}
                    />
                </div>

                    <h5>{SALE_LABEL.k5krn6il}</h5>
                <Select
                    multiple={true}
                    notFoundContent={SALE_LABEL.k5dod8s9}
                    style={{ width: 220, margin: '0 20px 0 10px' }}
                    value={channelList}
                    placeholder={k5eng042}
                    onChange={this.handleChannelListChange}
                >
                    {
                        CHANNEL_LIST.map(({value, label}) => (
                            <Option key={value}>{label}</Option>
                        ))
                    }
                </Select>
                <h5>{SALE_LABEL.k5dlpt47}</h5>
                <Select
                    multiple={true}
                    value={supportOrderTypeList}
                    notFoundContent={SALE_LABEL.k5dod8s9}
                    style={{ width: 200, margin: '0 20px 0 10px' }}
                    placeholder={k5eng042}
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
                    {COMMON_LABEL.query}
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
                    {SALE_LABEL.k634693f}
                </span>
                <div className={style.spacer} />
                {
                    this.state.authStatus && 
                        <span>
                            <Button
                                type="primary"
                                icon="plus"
                                onClick={this.openCreateModal}
                                style={{ marginRight: 12 }}
                            >
                                {SALE_LABEL.k6316ir0}
                            </Button>
                            <Button
                                type="ghost"
                                onClick={() => {
                                    jumpPage({ pageID: SALE_CENTER_PAGE })
                                }}
                            >
                                {SALE_LABEL.k63469br}
                            </Button>
                        </span>
                }
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
        {SALE_LABEL.k5doax7i}! <a onClick={() => this.handleSpecialUpdateOpe()}>{COMMON_LABEL.retry}</a>
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
        {SALE_LABEL.k5doax7i}! <a onClick={() => this.handleUpdateOpe()}>{COMMON_LABEL.retry}</a>
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
                {
                    !this.state.authStatus ?
                        <EmptyPage /> : 
                        <div>
                            {this.renderBody()}
                            {this.renderBasicPromotionEditOrPreviewModal()}
                            {this.renderSpecialPromotionEditOrPreviewModal()}
                        </div>
                }
            </div>
        )
    }
}
