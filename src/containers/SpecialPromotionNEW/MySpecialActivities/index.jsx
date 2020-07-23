import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { COMMON_LABEL } from 'i18n/common';
import {
    Table, Input, Select, DatePicker,
    Button, Modal, Row, Col, message,
    Spin, Icon,
} from 'antd';
import {throttle, isEqual} from 'lodash';
import { jumpPage } from '@hualala/platform-base'
import moment from 'moment';
import copy from 'copy-to-clipboard'
import styles from '../../SaleCenterNEW/ActivityPage.less';
import ExportModal from "../../GiftNew/GiftInfo/ExportModal";
import Cfg from '../../../constants/SpecialPromotionCfg';
import Authority from '../../../components/common/Authority';
import { saleCenterSetSpecialBasicInfoAC, saleCenterResetDetailInfoAC } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'

import {
    toggleSelectedActivityStateAC,
    fetchSpecialPromotionList,
    // fetchPromotionListCancel,
    deleteSelectedRecordAC,
    fetchSpecialPromotionDetailAC,
    fetchSpecialPromotionDetailCancel,
    fetchSpecialDetailAC,
    updateExpiredActiveState,
} from '../../../redux/actions/saleCenterNEW/mySpecialActivities.action';
import {
    toggleIsUpdateAC,
} from '../../../redux/actions/saleCenterNEW/myActivities.action';
import SpecialPromotionDetail from './specialPromotionDetail';

import {
    getSpecialPromotionIdx,
    specialPromotionBasicDataAdapter,
} from '../../../redux/actions/saleCenterNEW/types';

import ActivityMain from '../activityMain';

import registerPage from '../../../index';
import { SPECIAL_PAGE, PROMOTION_DECORATION } from '../../../constants/entryCodes';
import { promotionBasicInfo_NEW as sale_promotionBasicInfo_NEW } from '../../../redux/reducer/saleCenterNEW/promotionBasicInfo.reducer';
import { promotionDetailInfo_NEW as sale_promotionDetailInfo_NEW } from '../../../redux/reducer/saleCenterNEW/promotionDetailInfo.reducer';
import {
    promotionScopeInfo_NEW as sale_promotionScopeInfo_NEW,
    shopSchema_New as sale_shopSchema_New,
 } from '../../../redux/reducer/saleCenterNEW/promotionScopeInfo.reducer';
import { fullCut_NEW as sale_fullCut_NEW } from '../../../redux/reducer/saleCenterNEW/fullCut.reducer';
import { myActivities_NEW as sale_myActivities_NEW } from '../../../redux/reducer/saleCenterNEW/myActivities.reducer';
import { saleCenter_NEW as sale_saleCenter_NEW } from '../../../redux/reducer/saleCenterNEW/saleCenter.reducer';
import { giftInfoNew as sale_giftInfoNew } from '../../GiftNew/_reducers';
import { mySpecialActivities_NEW as sale_mySpecialActivities_NEW } from '../../../redux/reducer/saleCenterNEW/mySpecialActivities.reducer';
import { specialPromotion_NEW as sale_specialPromotion_NEW } from '../../../redux/reducer/saleCenterNEW/specialPromotion.reducer';
import { crmCardTypeNew as sale_crmCardTypeNew } from '../../../redux/reducer/saleCenterNEW/crmCardType.reducer';
import { promotion_decoration as sale_promotion_decoration } from '../../../redux/reducer/decoration';
import { selectPromotionForDecoration  } from '../../../redux/actions/decoration';
import {Iconlist} from "../../../components/basic/IconsFont/IconsFont";
import {axiosData} from "../../../helpers/util";
import {queryWeixinAccounts} from "../../../redux/reducer/saleCenterNEW/queryWeixinAccounts.reducer";
import {
    SPECIAL_LOOK_PROMOTION_QUERY,
    SPECIAL_PROMOTION_DELETE, SPECIAL_PROMOTION_QUERY,
    SPECIAL_PROMOTION_UPDATE
} from "../../../constants/authorityCodes";
import {isBrandOfHuaTianGroupList, isGroupOfHuaTianGroupList, isMine} from "../../../constants/projectHuatianConf";
import PromotionCalendarBanner from "../../../components/common/PromotionCalendarBanner/index";
import { injectIntl } from 'i18n/common/injectDecorator'
import { STRING_GIFT } from 'i18n/common/gift';
import { STRING_SPE } from 'i18n/common/special';
import { SALE_STRING } from 'i18n/common/salecenter'
import Chou2Le from "../../PromotionV3/Chou2Le";   // 抽抽乐
import BlindBox from "../../PromotionV3/BlindBox";   // 盲盒

import { isFormalRelease } from  "../../../utils/index"
import indexStyles from './mySpecialActivities.less'
const confirm = Modal.confirm;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const mapStateToProps = (state) => {
    return {
        mySpecialActivities: state.sale_mySpecialActivities_NEW,
        promotionBasicInfo: state.sale_promotionBasicInfo_NEW,
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        user: state.user.toJS(),
    };
};
const DECORATABLE_PROMOTIONS = [
    '20',
    '21',
    '23',
    '64',
    '65',
    '66',
    '76'
]
const isDecorationAvailable = ({eventWay}) => {
    return DECORATABLE_PROMOTIONS.includes(`${eventWay}`)
}
const copyUrlList = [
    '21',
    '20',
    '30',
    '22',
    '65',
    '68'
]
const isCanCopyUrl = ({eventWay}) => {
    return copyUrlList.includes(`${eventWay}`)
}
const mapDispatchToProps = (dispatch) => {
    return {
        selectPromotionForDecoration: (opts) => {
            dispatch(selectPromotionForDecoration(opts))
        },
        query: (opts) => {
            dispatch(fetchSpecialPromotionList(opts));
        },

        toggleSelectedActivityState: (opts) => {
            dispatch(toggleSelectedActivityStateAC(opts));
        },
        updateExpiredActiveState: (opts) => {
            dispatch(updateExpiredActiveState(opts))
        },
        deleteSelectedRecord: (opts) => {
            dispatch(deleteSelectedRecordAC(opts));
        },

        fetchSpecialPromotionList: (opts) => {
            dispatch(fetchSpecialPromotionList(opts))
        },

        fetchSpecialPromotionDetail: (opts) => {
            dispatch(fetchSpecialPromotionDetailAC(opts))
        },

        cancelFetchSpecialPromotionDetail: (opts) => {
            dispatch(fetchSpecialPromotionDetailCancel(opts))
        },
        saleCenterSetSpecialBasicInfo: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts))
        },
        fetchSpecialDetail: (opts) => {
            dispatch(fetchSpecialDetailAC(opts))
        },
        saleCenterResetDetailInfo: (opts) => {
            dispatch(saleCenterResetDetailInfoAC(opts))
        },
        toggleIsUpdate: (opts) => {
            dispatch(toggleIsUpdateAC(opts))
        },
    };
};

@registerPage([SPECIAL_PAGE], {
    sale_promotionBasicInfo_NEW,
    sale_promotionDetailInfo_NEW,
    sale_promotionScopeInfo_NEW,
    sale_fullCut_NEW,
    queryWeixinAccounts,
    sale_myActivities_NEW,
    sale_saleCenter_NEW,
    sale_giftInfoNew,
    sale_shopSchema_New,
    sale_mySpecialActivities_NEW,
    sale_specialPromotion_NEW,
    sale_crmCardTypeNew,
    sale_promotion_decoration,
})
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl
class MySpecialActivities extends React.Component {
    constructor(props) {
        super(props);
        this.tableRef = null;
        this.setTableRef = el => this.tableRef = el;
        this.lockedChangeSortOrder = throttle(this.changeSortOrder, 500, {trailing: false});
        this.state = {
            curKey: '',
            dataSource: [],
            advancedQuery: true,
            visible: false,
            selectedRecord: null, // current record
            updateModalVisible: false,
            expand: false, // 高级查询
            index: 0,
            recordToDisplay: null,
            // qualifications:
            valid: '0',
            modalTitle: `${this.props.intl.formatMessage(STRING_SPE.d2c8g6ep510150)}`,
            isNew: false,

            selectedShop: null,

            loading: true,
            eventWay: '',
            promotionDateRange: '',
            isActive: '',
            eventName: '',
            editEventWay: '',
            pageSizes: 30,
            pageNo: 1,
            record: {
                eventInfo: {},
                cardInfo: [],
                userInfo: [],
            },
            queryDisabled: false,
            currentItemID: '',
            v3visible: false,       // 第三版活动组件是否显示
            itemID: '',
            view: false,
            isShowCopyUrl: false,
            urlContent: ''
        };
        this.cfg = {
            eventWay: [
                { value: '', label: `${this.props.intl.formatMessage(STRING_GIFT.all)}` },
                { value: '51', label: `${this.props.intl.formatMessage(STRING_SPE.da910d8l680255)}` },
                { value: '52', label: `${this.props.intl.formatMessage(STRING_SPE.d1kghbbhh2g1156)}` },
                { value: '21', label: `${this.props.intl.formatMessage(STRING_SPE.d4h1eea89g12152)}` },
                { value: '20', label: `${this.props.intl.formatMessage(STRING_SPE.de8h83kic431)}` },
                { value: '30', label: `${this.props.intl.formatMessage(STRING_SPE.d567490a78b24187)}` },
                { value: '22', label: `${this.props.intl.formatMessage(STRING_SPE.d1e0f874d45158)}` },
                { value: '53', label: `${this.props.intl.formatMessage(STRING_SPE.dok2uwq1n6234)}` },
                { value: '50', label: `${this.props.intl.formatMessage(STRING_SPE.d21650591a2047103)}` },
                { value: '60', label: `${this.props.intl.formatMessage(STRING_SPE.d1701e8391a4865)}` },
                { value: '61', label: `${this.props.intl.formatMessage(STRING_SPE.db612a0008a4925)}` },
                { value: '62', label: `${this.props.intl.formatMessage(STRING_SPE.d4h1eea89g110128)}` },
                { value: '23', label: `${this.props.intl.formatMessage(STRING_SPE.d4h1eea89g21118)}` },
                // 下线 { value: '70', label: '彩蛋猫送礼' },
                { value: '63', label: `${this.props.intl.formatMessage(STRING_SPE.d5g3ql3oen12242)}` },
                { value: '64', label: `${this.props.intl.formatMessage(STRING_SPE.d1701e8391a513206)}` },
                { value: '65', label: `${this.props.intl.formatMessage(STRING_SPE.d567490a78b314234)}` },
                { value: '66', label: `${this.props.intl.formatMessage(STRING_SPE.d1701e8391a515146)}` },
                { value: '67', label: `${this.props.intl.formatMessage(STRING_SPE.d4h1eea89g21627)}` },
                { value: '68', label: `${this.props.intl.formatMessage(STRING_SPE.de8h83kic51727)}` },
                { value: '31', label: `${this.props.intl.formatMessage(STRING_SPE.d2c8o5o6gt1820)}` },
                { value: '75', label: '集点卡' },
                { value: '77', label: '支付后广告' },
                { value: '76', label: '签到' },
                { value: '78', label: '下单抽抽乐' },
                { value: '79', label: '盲盒' },
            ],
        }
        this.renderFilterBar = this.renderFilterBar.bind(this);
        this.showNothing = this.showNothing.bind(this);
        this.handleDismissUpdateModal = this.handleDismissUpdateModal.bind(this);
        // disable selected activity


        this.handleDisableClickEvent = this.handleDisableClickEvent.bind(this);
        this.handelStopEvent = this.handelStopEvent.bind(this);
        this.onDateQualificationChange = this.onDateQualificationChange.bind(this);
        this.handleQuery = this.handleQuery.bind(this);
        this.renderContentOfThisModal = this.renderContentOfThisModal.bind(this);
        this.checkDeleteInfo = this.checkDeleteInfo.bind(this);
        this.checkDetailInfo = this.checkDetailInfo.bind(this);
        this.renderModals = this.renderModals.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.renderUpdateModals = this.renderUpdateModals.bind(this);
        this.handleUpdateOpe = this.handleUpdateOpe.bind(this);
    }

    /**
     * @description toggle the advanced qualification selection.
     * */
    handleDisableClickEvent(text, record, index, nextActive, modalTip) {
        // this.state.selectedRecord
        this.props.toggleSelectedActivityState({
            record,
            nextActive,
            modalTip,
            success: this.toggleStateCallBack,
            fail: this.toggleStateFailCallBack,
            warning: this.toggleStateWarningCallBack,
        });
    }

    toggleStateFailCallBack(val) {
        message.error(val);
    }

    toggleStateWarningCallBack(val) {
        message.warning(val);
    }

    toggleStateCallBack(val) {
        message.success(val);
    }
    // 终止活动
    handelStopEvent(text, record, index, nextActive, modalTip) {
        confirm({
            title: `${this.props.intl.formatMessage(STRING_SPE.de8g7jed1j112)}`,
            content: (
                <div>
                     {this.props.intl.formatMessage(STRING_SPE.dojy6qlmv253)}
                    【<span>{record.eventName}</span>】
                    <br />
                    <span>{this.props.intl.formatMessage(STRING_SPE.d34ikef74237)}</span>
                </div>
            ),
            footer: `${this.props.intl.formatMessage(STRING_SPE.d34ikef74237)}`,
            onOk: () => {
                this.handleDisableClickEvent(text, record, index, nextActive, modalTip)
            },
            onCancel: () => { },
        });
    }
    // 关闭更新
    handleDismissUpdateModal() {
        this.setState({
            updateModalVisible: false,
        }, () => {
            this.props.saleCenterResetDetailInfo();
        });
    }

    componentDidMount() {
        const {
            fetchSpecialPromotionList,
        } = this.props;
        fetchSpecialPromotionList({
            data: {
                groupID: this.props.user.accountInfo.groupID,
                // _role:this.props.user.accountInfo.roleType,
                // _loginName:this.props.user.accountInfo.loginName,
                // _groupLoginName:this.props.user.accountInfo.groupLoginName,
                pageSize: this.state.pageSizes,
                pageNo: 1,
            },
            fail: (msg) => { message.error(msg) },
        });
        // 把groupID传给后台，后台执行自动终止
        this.props.updateExpiredActiveState({
            groupID: this.props.user.accountInfo.groupID,
        })
    }

    // TODO: the following code may be not the best implementation of filter
    // The filter condition should not be save to redux, just save it to state temporarily.
    // Modify it in the future
    componentWillReceiveProps(nextProps) {
        if (this.props.user.activeTabKey !== nextProps.user.activeTabKey && nextProps.user.activeTabKey === "1000076003") {
            const tabArr = nextProps.user.tabList.map((tab) => tab.value);
            if (tabArr.includes("1000076003")) {
                this.handleQuery(this.state.pageNo); // tab里已有该tab，从别的tab切换回来，就自动查询，如果是新打开就不执行此刷新函数，而执行加载周期里的
            }
        }
        if (this.props.mySpecialActivities.get('$specialPromotionList') !== nextProps.mySpecialActivities.get('$specialPromotionList')) {
            const _promoitonList = nextProps.mySpecialActivities.get('$specialPromotionList').toJS();
            switch (_promoitonList.status) {
                case 'timeout':
                    message.error(`${this.props.intl.formatMessage(STRING_SPE.d17012f5c16b488)}`);
                    this.setState({
                        loading: false,
                    });
                    break;
                case 'fail':
                    message.error(`${this.props.intl.formatMessage(STRING_SPE.du3bnfobd599)}`);
                    this.setState({
                        loading: false,
                    });
                    break;
                case 'success':
                    if (_promoitonList.data) {
                        const _envIsVip = HUALALA.ENVIRONMENT === 'production-release';
                        // const data = _envIsVip ? _promoitonList.data.filter((activity) => {
                        //     // 隐藏1个卡片
                        //     return activity.eventWay != '63'
                        // }) : _promoitonList.data;
                        const data = _promoitonList.data;
                        this.setState({
                            loading: false,
                            dataSource: data.map((activity, index) => {
                                activity.index = index + 1;
                                activity.key = `${index}`;
                                activity.validDate = {
                                    start: activity.eventStartDate,
                                    end: activity.eventEndDate,
                                };
                                return activity;
                            }),
                            total: _promoitonList.total,
                        });
                    } else {
                        message.warning(`${this.props.intl.formatMessage(STRING_SPE.d4h1ac506h7670)}`);
                        this.setState({
                            loading: false,
                            dataSource: [],
                            total: _promoitonList.total,
                        });
                    }
                    break;
            }
        }
        if (this.props.mySpecialActivities.get('$specialDetailInfo') !== nextProps.mySpecialActivities.get('$specialDetailInfo')) {
            this.setState({
                record: nextProps.mySpecialActivities.get('$specialDetailInfo').toJS(),
            })
        }
    }
    //** 第三版 重构 抽抽乐活动 点击事件 */
    onV3Click = (itemID, view, key) => {
        this.setState(ps => ({ v3visible: !ps.v3visible }));
        if(itemID){
            this.setState({ itemID, view, curKey: key });
        }
    }
    hideCopyUrlModal = () => {
        this.setState({
            isShowCopyUrl: false
        })
    }
    render() {
        const { v3visible, itemID, view, isShowCopyUrl, urlContent } = this.state;
        return (
            <div style={{backgroundColor: '#F3F3F3'}} className="layoutsContainer" ref={layoutsContainer => this.layoutsContainer = layoutsContainer}>
                {this.renderHeader()}
                <PromotionCalendarBanner />
                <div className={styles.pageContentWrapper} style={{ minHeight: 'calc(100vh - 160px)' }}>
                    <div style={{ padding: '0'}} className="layoutsHeader">
                        {this.renderFilterBar()}
                        <div style={{ margin: '0'}} className="layoutsLine"></div>
                    </div>
                    {this.renderTables()}
                </div>
                {this.renderModals()}
                {this.renderUpdateModals()}
                {
                    !this.state.exportVisible ? null :
                        <ExportModal
                            specialPromotion
                            handleClose={() => this.setState({ exportVisible: false })}
                        />
                }
                { (v3visible && curKey == '78') && <Chou2Le onToggle={this.onV3Click} id={itemID} view={view} />}
                { (v3visible && curKey == '79') && <BlindBox onToggle={this.onV3Click} id={itemID} view={view} />}
                { v3visible && <Chou2Le onToggle={this.onV3Click} id={itemID} view={view} />}
                <Modal
                    title="提取活动链接"
                    visible={isShowCopyUrl}
                    onCancel={this.hideCopyUrlModal}
                    footer={null}
                    width={700}
                >
                    <div className={indexStyles.copyUrlWrap}>
                        <div className={indexStyles.label}>提取链接</div>
                        <div className={indexStyles.urlText}>{urlContent}</div>
                    </div>
                    <div onClick={this.handleToCopyUrl} className={indexStyles.copyBtn}  >复制链接</div>
                </Modal>
            </div>
        );
    }
    // 查询
    handleQuery(thisPageNo) {
        const pageNo = isNaN(thisPageNo) ? 1 : thisPageNo;
        this.setState({
            loading: true,
            queryDisabled: true,
            pageNo,
        }, () => {
            setTimeout(() => {
                this.setState({ queryDisabled: false })
            }, 500)
        });

        const {
            eventWay,
            promotionDateRange,
            isActive,
            eventName,
        } = this.state;

        const opt = {};
        if (eventWay !== '' && eventWay !== undefined) {
            opt.eventWay = eventWay;
        }

        if (promotionDateRange !== '' && promotionDateRange.length !== 0) {
            opt.eventStartDate = promotionDateRange[0].format('YYYYMMDD');
            opt.eventEndDate = promotionDateRange[1].format('YYYYMMDD');
        }

        if (eventName !== '' && eventName !== undefined) {
            opt.eventName = eventName;
        }

        if (isActive !== '') {
            opt.isActive = isActive == '-1' ? '-1' : (isActive == '1' ? '1' : '0');
        }

        this.props.query({
            data: {
                groupID: this.props.user.accountInfo.groupID,
                pageSize: this.state.pageSizes,
                pageNo,
                ...opt,
            },
            fail: (msg) => { message.error(msg) },
        });
    }

    showNothing(data) {
        if (data === undefined) {
            setTimeout(() => {
                this.setState({
                    loading: false,
                });
                message.error(`${this.props.intl.formatMessage(STRING_SPE.dk46ld30bj797)}`);
            });
        }
    }

    renderHeader() {
        const headerClasses = `layoutsToolLeft ${styles.headerWithBgColor}`;
        return (
            <div className="layoutsTool" style={{height: '64px'}}>
                <div className={headerClasses}>
                    <span className={styles.customHeader}>{this.props.intl.formatMessage(STRING_SPE.dd5aa016c5d869)}</span>
                </div>
            </div>
        );
    }
    // date qualification
    onDateQualificationChange(value) {
        this.setState({
            promotionDateRange: value,
        });
    }

    renderFilterBar() {
        const opts = [];
        this.cfg.eventWay.forEach((item, index) => {
            opts.push(
                <Option value={`${item.value}`} key={`${index}`}>{item.label}</Option>
            );
        });
        const { intl } = this.props;
        return (
            <div>
                <div className="layoutsSearch">
                    <ul>
                        <li>
                            <h5>{this.props.intl.formatMessage(STRING_SPE.db60c8ac0a379138)}</h5>
                        </li>
                        <li>
                            <RangePicker style={{ width: 200 }} onChange={this.onDateQualificationChange} />
                        </li>

                        <li>
                            <h5>{this.props.intl.formatMessage(STRING_SPE.d4h177f79da1218)}</h5>
                        </li>
                        <li>
                            <Select
                                style={{ width: 120 }}
                                showSearch
                                notFoundContent={`${this.props.intl.formatMessage(STRING_SPE.d2c8a4hdjl248)}`}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                placeholder={this.props.intl.formatMessage(STRING_SPE.d1kgf622e5a10108)}
                                defaultValue={intl.formatMessage(STRING_GIFT.all)}
                                onChange={(value) => {
                                    this.setState({
                                        eventWay: value === 'ALL' ? null : value,
                                    });
                                }}
                            >
                                {opts}
                            </Select>
                        </li>

                        <li>
                            <h5>{this.props.intl.formatMessage(STRING_SPE.db60c8ac0a3711176)}</h5>
                        </li>
                        <li>
                            <Select
                                style={{ width: 80 }}
                                defaultValue=""
                                placeholder={this.props.intl.formatMessage(STRING_SPE.dd5aa016c5d12116)}
                                onChange={(value) => {
                                    this.setState({
                                        isActive: value,
                                    });
                                }}
                            >
                                <Option value={''}>{this.props.intl.formatMessage(STRING_SPE.dk45j2cah113227)}</Option>
                                <Option value={'1'}>{this.props.intl.formatMessage(STRING_SPE.db60c8ac0a371314)}</Option>
                                <Option value={'0'}>{this.props.intl.formatMessage(STRING_SPE.d16hh1kkf9914292)}</Option>
                                <Option value={'-1'}>{this.props.intl.formatMessage(STRING_SPE.db60c8ac0a3715210)}</Option>
                            </Select>
                        </li>

                        <li>
                            <h5>{this.props.intl.formatMessage(STRING_SPE.d4546grade4128)}</h5>
                        </li>
                        <li>
                            <Input
                                placeholder={this.props.intl.formatMessage(STRING_SPE.d7ekp859lc7222)}
                                onChange={(e) => {
                                    this.setState({
                                        eventName: e.target.value,
                                    });
                                }}
                            />
                        </li>

                        <li>
                            <Authority rightCode={SPECIAL_PROMOTION_QUERY}>
                                <Button type="primary" onClick={this.handleQuery} disabled={this.state.queryDisabled}><Icon type="search" />
                                    { COMMON_LABEL.query }
                                </Button>
                            </Authority>
                        </li>
                        <li>
                            <Authority rightCode={SPECIAL_PROMOTION_QUERY}>
                                <Button
                                    type="ghost"
                                    onClick={() => this.setState({ exportVisible: true })}
                                ><Icon type="export" />{ COMMON_LABEL.export }</Button>
                            </Authority>
                        </li>

                    </ul>
                </div>
            </div>

        );
    }
    // 切换每页显示条数
    onShowSizeChange = (current, pageSize) => {
        this.setState({
            pageSizes: pageSize,
        })
    };

    /**
     * 列表排序
     * @param record
     * @param direction
     */
    changeSortOrder(record, direction) {
        const params = {itemID: record.itemID, rankingType: direction};
        axiosData('/specialPromotion/updateEventRanking.ajax', params, {needThrow: true}, {path: undefined}, 'HTTP_SERVICE_URL_PROMOTION_NEW').then(() => {
            if (this.tableRef &&  this.tableRef.props && this.tableRef.props.pagination && this.tableRef.props.pagination.onChange) {
                this.tableRef.props.pagination.onChange(this.tableRef.props.pagination.current, this.tableRef.props.pagination.pageSize);
            }
        }).catch(err => {
            message.warning(err || `${this.props.intl.formatMessage(STRING_SPE.dk46ld30bj16282)}`);
        })
    }

    renderTables() {
        const SmsSendStatus = [
            { value: '0', label: `${this.props.intl.formatMessage(STRING_SPE.de8g7jed1j17152)}` },
            { value: '1', label: `${this.props.intl.formatMessage(STRING_SPE.d16hh1kkf9a1879)}` },
            { value: '2', label: `${this.props.intl.formatMessage(STRING_SPE.dojy6qlmw1990)}` },
            { value: '3', label: `${this.props.intl.formatMessage(STRING_SPE.d2c8g6ep522337)}` },
            { value: '4', label: `${this.props.intl.formatMessage(STRING_SPE.d16hh1kkf9a24193)}` },
            { value: '5', label: `${this.props.intl.formatMessage(STRING_SPE.du3bnfobe2576)}` },
            { value: '8', label: `${this.props.intl.formatMessage(STRING_SPE.dd5aa016c5e21260)}` },
            { value: '9', label: `${this.props.intl.formatMessage(STRING_SPE.dojy6qlmw1990)}` },
            { value: '20', label: `${this.props.intl.formatMessage(STRING_SPE.dojy6qlmw1990)}` },
            { value: '21', label: `${this.props.intl.formatMessage(STRING_SPE.d454fcf3i422261)}` },
            { value: '30', label: `${this.props.intl.formatMessage(STRING_SPE.dd5aa016c5e21260)}` },
            { value: '6', label: `${this.props.intl.formatMessage(STRING_SPE.d454fcf3i422261)}` },
        ];
        const SmsSettleStatus = [
            { value: '0', label: `${this.props.intl.formatMessage(STRING_SPE.d2c8g6ep5226252)}` },
            { value: '1', label: `${this.props.intl.formatMessage(STRING_SPE.d5g3d7ahfq27163)}` },
            { value: '2', label: `${this.props.intl.formatMessage(STRING_SPE.d4h1ac506h828194)}` },
            { value: '3', label: `${this.props.intl.formatMessage(STRING_SPE.da905h2m122949)}` },
        ];

        const columns = [
            {
                title: COMMON_LABEL.serialNumber,
                dataIndex: 'index',
                className: 'TableTxtCenter',
                width: 60,
                // fixed:'left',
                key: 'key',
                render: (text, record, index) => {
                    return (this.state.pageNo - 1) * this.state.pageSizes + text;
                },
            },

            {
                title: COMMON_LABEL.actions,
                key: 'operation',
                width: 380,
                // fixed:'left',
                render: (text, record, index) => {
                    const statusState = (
                        (record.eventWay == '50' || record.eventWay == '53')
                        &&
                        (record.status != '0' && record.status != '1' && record.status != '5' && record.status != '21')
                    );
                    const buttonText = (record.isActive == '1' ? COMMON_LABEL.disable : COMMON_LABEL.enable);
                    return (<span>
                        <a
                            href="#"
                            className={(record.isActive == '-1' || statusState || isBrandOfHuaTianGroupList(this.props.user.accountInfo.groupID)) ? styles.textDisabled : null}
                            onClick={(e) => {
                                if (isBrandOfHuaTianGroupList(this.props.user.accountInfo.groupID)) {
                                    e.preventDefault();
                                    return;
                                }
                                if (Number(record.eventWay) === 70) {
                                    message.warning(`${this.props.intl.formatMessage(STRING_SPE.du3bnfobe30180)}`);
                                    return;
                                }
                                record.isActive == '-1' || statusState ? null :
                                    this.handleDisableClickEvent(text, record, index, null, `${this.props.intl.formatMessage(STRING_SPE.db60c8ac0a3831197)}`);
                            }}
                        >
                            {buttonText}</a>
                        <Authority rightCode={SPECIAL_PROMOTION_UPDATE}>
                            <a
                                href="#"
                                className={
                                    record.isActive != '0' || statusState || (isGroupOfHuaTianGroupList(this.props.user.accountInfo.groupID) && !isMine(record))
                                        ? styles.textDisabled
                                        : null
                                }
                                onClick={(e) => {
                                    if (record.isActive != '0' || statusState || (isGroupOfHuaTianGroupList(this.props.user.accountInfo.groupID) && !isMine(record))) {
                                        e.preventDefault()
                                    } else {
                                        if (Number(record.eventWay) === 70) {
                                            message.warning(`${this.props.intl.formatMessage(STRING_SPE.du3bnfobe30180)}`);
                                            return;
                                        }
                                        if (record.eventWay === 78 || record.eventWay === 79) {
                                            this.onV3Click(record.itemID, false, record.eventWay);
                                            return;
                                        }
                                        this.props.toggleIsUpdate(true)
                                        this.handleUpdateOpe(text, record, index);
                                    }
                                }}
                            >
                                {COMMON_LABEL.edit}
                            </a>
                        </Authority>
                        <a
                            href="#"
                            onClick={() => {
                                if (Number(record.eventWay) === 70) {
                                    message.warning(`${this.props.intl.formatMessage(STRING_SPE.du3bnfobe30180)}`);
                                    return;
                                }
                                if (record.eventWay === 78 || record.eventWay === 79) {
                                    this.onV3Click(record.itemID, true, record.eventWay);
                                    return;
                                }
                                this.props.toggleIsUpdate(false)
                                this.handleUpdateOpe(text, record, index);
                            }}
                        >
                            { COMMON_LABEL.view }
                        </a>
                        <Authority rightCode={SPECIAL_PROMOTION_DELETE}>
                            <a
                                href="#"
                                className={record.isActive != '0' || record.userCount != 0 || statusState || isBrandOfHuaTianGroupList(this.props.user.accountInfo.groupID) ? styles.textDisabled : null}
                                onClick={() => {
                                    if (isBrandOfHuaTianGroupList(this.props.user.accountInfo.groupID)) {
                                        return;
                                    }
                                    if (Number(record.eventWay) === 70) {
                                        message.warning(`${this.props.intl.formatMessage(STRING_SPE.du3bnfobe30180)}`);
                                        return;
                                    }
                                    record.isActive != '0' || record.userCount != 0 || statusState ? null :
                                        this.checkDeleteInfo(text, record, index);
                                }}
                            >
                                { COMMON_LABEL.delete }
                            </a>
                        </Authority>
                        <a
                            href="#"
                            className={record.isActive == '-1' || statusState || isBrandOfHuaTianGroupList(this.props.user.accountInfo.groupID) ? styles.textDisabled : null}
                            onClick={() => {
                                if (isBrandOfHuaTianGroupList(this.props.user.accountInfo.groupID)) {
                                    return;
                                }
                                if (Number(record.eventWay) === 70) {
                                    message.warning(`${this.props.intl.formatMessage(STRING_SPE.du3bnfobe30180)}`);
                                    return;
                                }
                                record.isActive == '-1' || statusState ? null :
                                    this.handelStopEvent(text, record, index, '-1', `${this.props.intl.formatMessage(STRING_SPE.d17012f5c16c32211)}`);
                            }}
                        >
                        {this.props.intl.formatMessage(STRING_SPE.du3bnfobe3346)}
                        </a>
                        {
                            isDecorationAvailable(record) && (
                                <a
                                    href="#"
                                    onClick={() => {
                                        this.handleDecorationStart(record)
                                    }}
                                >
                                {this.props.intl.formatMessage(STRING_SPE.dk46ld30bk34245)}
                                </a>
                            )
                        }

                        <Authority rightCode={SPECIAL_LOOK_PROMOTION_QUERY}>
                            <a
                                href="#"
                                className={isBrandOfHuaTianGroupList(this.props.user.accountInfo.groupID) && !isMine(record) ? styles.textDisabled : null}
                                onClick={() => {
                                    if (isBrandOfHuaTianGroupList(this.props.user.accountInfo.groupID) && !isMine(record)) {
                                        return;
                                    }
                                    if (Number(record.eventWay) === 70) {
                                        message.warning(`${this.props.intl.formatMessage(STRING_SPE.du3bnfobe30180)}`);
                                        return;
                                    }
                                    this.checkDetailInfo(text, record, index);
                                }}
                            >
                            {this.props.intl.formatMessage(STRING_SPE.d5g3d7ahfq35134)}</a>
                        </Authority>
                        {
                            isCanCopyUrl(record) && (
                                <a
                                    href="#"
                                    onClick={() => {
                                        this.handleCopyUrl(record)
                                    }}
                                >
                                 提取链接
                                </a>
                            )
                        }
                    </span>
                    );
                },
            },
            {
                title: COMMON_LABEL.sort,
                dataIndex: 'sortOrder',
                key: 'sortOrder',
                width: 120,
                // fixed:'left',
                render: (text, record, index) => {
                    const canNotSortUp = this.state.pageNo == 1 && index == 0;
                    const canNotSortDown = (this.state.pageNo - 1) * this.state.pageSizes + index + 1 == this.state.total;
                    return (
                        <span>
                            <span><Iconlist title={`${this.props.intl.formatMessage(STRING_SPE.d5g3d7ahfq3651)}`} iconName={'sortTop'} className={canNotSortUp ? 'sortNoAllowed' : 'sort'} onClick={canNotSortUp ? null : () => this.lockedChangeSortOrder(record, 'TOP')}/></span>
                            <span><Iconlist title={`${this.props.intl.formatMessage(STRING_SPE.da905h2m1237216)}`} iconName={'sortUp'} className={canNotSortUp ? 'sortNoAllowed' : 'sort'} onClick={canNotSortUp ? null : () => this.lockedChangeSortOrder(record, 'UP')}/></span>
                            <span className={styles.upsideDown}><Iconlist title={`${this.props.intl.formatMessage(STRING_SPE.du3bnfobe3831)}`} iconName={'sortUp'} className={canNotSortDown ? 'sortNoAllowed' : 'sort'} onClick={canNotSortDown ? null : () => this.lockedChangeSortOrder(record, 'DOWN')}/></span>
                            <span className={styles.upsideDown}><Iconlist title={`${this.props.intl.formatMessage(STRING_SPE.d16hh1kkf9a3922)}`} iconName={'sortTop'} className={canNotSortDown ? 'sortNoAllowed' : 'sort'} onClick={canNotSortDown ? null : () => this.lockedChangeSortOrder(record, 'BOTTOM')}/></span>
                        </span>
                    )
                },
            },
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.d4h177f79da1218)}`,
                dataIndex: 'eventWay',
                key: 'eventWay',
                width: 100,
                // fixed:'left',
                render: (text, record) => {
                    return <span>{record.eventWay == 70 ? `${this.props.intl.formatMessage(STRING_SPE.d5672b44908540146)}` : mapValueToLabel(this.cfg.eventWay, String(record.eventWay))}</span>
                },
            },

            {
                title: `${this.props.intl.formatMessage(STRING_SPE.d4546grade4128)}`,
                dataIndex: 'eventName',
                key: 'eventName',
                // fixed:'left',
                width: 200,
                render: text => <span title={text}>{text}</span>,
            },
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.d5672b44908541235)}`,
                className: 'TableTxtCenter',
                dataIndex: 'status',
                key: 'msgStatus',
                width: 150,
                render: (text, record) => {
                    if (record.eventWay === 50 || record.eventWay === 51 || record.eventWay === 52 || record.eventWay === 53
                        || record.eventWay === 61 || record.eventWay === 62 || record.eventWay === 63|| record.eventWay === 70) {
                        let _SmsSendStatus = '';
                        SmsSendStatus.map((status) => {
                            if (status.value == record.status) {
                                _SmsSendStatus = status.label;
                            }
                        });
                        let _SmsSettleStatus = '';
                        SmsSettleStatus.map((status) => {
                            if (status.value == record.settleStatus) {
                                _SmsSettleStatus = status.label;
                            }
                        });
                        return `${_SmsSendStatus}/${_SmsSettleStatus}`;
                    }
                },
            },
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.dd5aa016c5f42125)}`,
                className: 'TableTxtCenter',
                dataIndex: 'validDate',
                key: '',
                width: 200,
                render: (validDate) => {
                    if (validDate.start === '0' || validDate.end === '0' ||
                        validDate.start === '20000101' || validDate.end === '29991231') {
                        return `${this.props.intl.formatMessage(STRING_SPE.d31ei98dbgi21253)}`;
                    }
                    return `${moment(validDate.start, 'YYYY/MM/DD').format('YYYY/MM/DD')} - ${moment(validDate.end, 'YYYY/MM/DD').format('YYYY/MM/DD')}`;
                },
            },
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.de8g7jed1l4364)}`,
                className: 'TableTxtCenter',
                dataIndex: 'operateTime',
                key: 'operateTime',
                width: 300,
                render: (text, record, index) => {
                    if (record.actionStamp === '' && record.createStamp === '') {
                        return '--';
                    }
                    return `${moment(new Date(parseInt(record.createStamp))).format('YYYY-MM-DD HH:mm:ss')} / ${moment(new Date(parseInt(record.actionStamp))).format('YYYY-MM-DD HH:mm:ss')}`;
                },
            },
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.d2b1c68ddaa344161)}`,
                dataIndex: 'operator',
                width: 120,
                key: 'operator',
                render: (text, record) => {
                    if (!record.operator) {
                        return '--';
                    }
                    let result;
                    try {
                        const operator = JSON.parse(record.operator);
                        result = `${operator.userName} / ${operator.u_userName || operator.userName}`;
                    } catch (e) {
                        return '--';
                    }
                    return result || '--';
                },
            },
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.db60c8ac0a3711176)}`,
                dataIndex: 'isActive',
                key: 'isActive',
                width: 100,
                render: (isActive) => {
                    return isActive == '-1' ? `${this.props.intl.formatMessage(STRING_SPE.db60c8ac0a3715210)}` : isActive == '1' ? `${this.props.intl.formatMessage(STRING_SPE.db60c8ac0a371314)}` : `${this.props.intl.formatMessage(STRING_SPE.d16hh1kkf9914292)}`;
                },
            },
        ];

        return (
            <div className={`layoutsContent ${styles.tableClass}`}>
                <Table
                    ref={this.setTableRef}
                    bordered={true}
                    columns={columns}
                    dataSource={this.state.dataSource}
                    loading={this.state.loading}
                    scroll={{ x: 1630, y: 'calc(100vh - 390px)' }}
                    pagination={{
                        pageSize: this.state.pageSizes,
                        current: this.state.pageNo,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        onShowSizeChange: this.onShowSizeChange,
                        total: this.state.total || 0,
                        showTotal: (total, range) => `${this.props.intl.formatMessage(STRING_SPE.d2b1c6b31a93638)}${range[0]}-${range[1]} / ${this.props.intl.formatMessage(STRING_SPE.dk46lj779a7119)} ${total} ${this.props.intl.formatMessage(STRING_SPE.d34ikgs6o6845)}`,
                        onChange: (page, pageSize) => {
                            this.setState({
                                pageNo: page,
                            });
                            const opt = {
                                pageSize,
                                pageNo: page,
                            };
                            const {
                                eventWay,
                                promotionDateRange,
                                isActive,
                                eventName,
                            } = this.state;

                            if (eventWay !== '' && eventWay !== undefined) {
                                opt.eventWay = eventWay;
                            }

                            if (promotionDateRange !== '' && promotionDateRange.length !== 0) {
                                opt.eventStartDate = promotionDateRange[0].format('YYYYMMDD');
                                opt.eventEndDate = promotionDateRange[1].format('YYYYMMDD');
                            }

                            if (eventName !== '' && eventName !== undefined) {
                                opt.eventName = eventName;
                            }

                            if (isActive !== '') {
                                opt.isActive = isActive == '-1' ? '-1' : isActive == '1' ? '1' : '0';
                            }
                            this.props.query({
                                data: {
                                    groupID: this.props.user.accountInfo.groupID,
                                    ...opt,
                                },
                                // start: () => this.setState({loading: true}),
                                // end: () => this.setState({loading: false}),
                                fail: (msg) => message.error(msg),
                            });
                        },
                    }}
                />
            </div>
        );
    }
    // 删除
    checkDeleteInfo(text, record) {
        confirm({
            title: `${this.props.intl.formatMessage(STRING_SPE.d34ikef74448196)}`,
            content: (
                <div>
                {this.props.intl.formatMessage(STRING_SPE.d454fcf3i54910)}
                    【<span>{record.eventName}</span>】
                    <br />
                    <span>{this.props.intl.formatMessage(STRING_SPE.db60c90bb48b034)}~</span>
                </div>
            ),
            footer: `${this.props.intl.formatMessage(STRING_SPE.db60c90bb48b034)}`,
            onOk: () => {
                this.props.deleteSelectedRecord({
                    ...record,
                    success: () => {
                        message.success(`${this.props.intl.formatMessage(STRING_SPE.db60c8ac0a3950145)}`);
                    },
                    fail: (msg) => {
                        message.error(msg);
                    },
                });
            },
            onCancel: () => { },
        });
    }
    successFn = (response) => {
        const _serverToRedux = false;
        const _promotionIdx = getSpecialPromotionIdx(`${this.state.editEventWay}`);
        if (_promotionIdx === undefined) {
            message.warning(`${this.props.intl.formatMessage(STRING_SPE.de8g7jed1l51134)}`);
            return;
        }
        if (response === undefined || response.data === undefined) {
            message.error(`${this.props.intl.formatMessage(STRING_SPE.d4h1ac506h952140)}`);
            return null;
        }
        this.props.saleCenterSetSpecialBasicInfo(specialPromotionBasicDataAdapter(response, _serverToRedux));
        this.setState({
            modalTitle: `${this.props.intl.formatMessage(STRING_SPE.d2c8g6ep510150)}`,
            isNew: false,
            index: _promotionIdx,
        });
    };

    failFn = () => {
        message.error(`${this.props.intl.formatMessage(STRING_SPE.dk46ld30bl535)}`);
    };

    handleDecorationStart = (record) => {
        const { eventWay, itemID, eventName } = record;
        this.props.selectPromotionForDecoration({
            type: `${eventWay}`,
            id: itemID,
            title: eventName,
        });
        jumpPage({menuID: PROMOTION_DECORATION})
    }

    handleCopyUrl = (record) => {

        const testUrl = 'https://dohko.m.hualala.com'
        const preUrl = 'https://m.hualala.com'
        const actList = ['20','30','22'] // 摇奖活动，积分兑换，报名活动
        const { eventWay, groupID, itemID } = record
        let url = testUrl
        if(isFormalRelease()) {
            url = preUrl
        }

        if(actList.includes(String(eventWay))) {
            url = url +    `/newm/eventCont?groupID=${groupID}&eventID=${itemID}`
        }

        if(eventWay == '21') {
            url = url +    `/newm/eventFree?groupID=${groupID}&eventID=${itemID}`

        }

        if(eventWay == '65') {
            url = url +    `/newm/shareFission?groupID=${groupID}&eventID=${itemID}`

        }

        if(eventWay == '68') {
            url = url +    `/newm/recommendInvite?groupID=${groupID}&eventItemID=${itemID}`

        }

        this.setState({
            urlContent: url,
            isShowCopyUrl: true
        })

    }

    handleToCopyUrl = () => {
        const { urlContent } = this.state
        if(copy(urlContent)){
            message.warn('复制成功')
        } else {
            message.warn('复制失败')
        }
    }

    // 编辑
    handleUpdateOpe() {
        let _record = arguments[1];
        const user = this.props.user;
        this.props.fetchSpecialDetail({
            data: {
                itemID: _record ? _record.itemID : this.state.currentItemID, // 点击重试时record为undefiend
                groupID: user.accountInfo.groupID,
            },
            success: this.successFn,
            fail: this.failFn,
        });
        if (_record) {
            this.setState({
                updateModalVisible: true,
                editEventWay: _record.eventWay,
                currentItemID: _record.itemID ? _record.itemID : this.state.currentItemID,
            });
        }
    }
    /**
     * Render promotion update Modal
     * wrapped normally.
     * @param {Bool} isNew A bool value identify the current operation is update or create.
     */

    renderUpdateModals() {
        return (
            <Modal
                wrapClassName={'progressBarModal'}
                title={this.state.modalTitle}
                visible={this.state.updateModalVisible}
                footer={false}
                width={1000}
                height="569px"
                maskClosable={false}
                onCancel={this.handleDismissUpdateModal}
            >
                {this.state.updateModalVisible ? this.renderContentOfThisModal() : null}
            </Modal>
        );
    }

    renderContentOfThisModal() {
        const mySpecialActivities = this.props.mySpecialActivities.get('$specialDetailInfo').toJS();
        const _state = this.state;
        if (mySpecialActivities.status === 'start' || mySpecialActivities.status === 'pending') {
            return (
                <div className={styles.spinFather}>
                    <Spin size="large" />
                </div>
            )
        }
        if (mySpecialActivities.status === 'timeout' || mySpecialActivities.status === 'fail') {
            return (
                <div className={styles.spinFather}>
                    {this.props.intl.formatMessage(STRING_SPE.da905h2m1354252)} <a onClick={this.handleUpdateOpe}>{ COMMON_LABEL.retry }</a>
                </div>
            );
        }

        if (mySpecialActivities.status === 'success') {
            return (<ActivityMain
                isNew={_state.isNew}
                index={_state.index}
                callbackthree={(arg) => {
                    if (arg == 3) {
                        this.handleDismissUpdateModal();
                    }
                }}
            />);
        }
    }

    // Row Actions: 查看
    checkDetailInfo() {
        const _record = arguments[1];
        const user = this.props.user;
        const { eventWay } = _record;
        this.props.fetchSpecialPromotionDetail({
            data: {
                itemID: _record && _record.itemID ? _record.itemID : this.state.currentItemID,
                groupID: user.accountInfo.groupID,
            },
            eventWay,
            fail: this.failFn,
        });
        this.setState({
            visible: true,
            currentItemID: _record && _record.itemID ? _record.itemID : this.state.currentItemID,
        });
    }
    // 关闭详情页
    handleClose() {
        this.setState({
            visible: false,
        })
    }
    // 活动详情页
    renderModals() {
        const mySpecialActivities = this.props.mySpecialActivities.get('$specialDetailInfo').toJS();
        const checkDetailInfo = this.checkDetailInfo;
        let renderContentOfTheModal;
        if (mySpecialActivities.status === 'start' || mySpecialActivities.status === 'pending') {
            renderContentOfTheModal = (
                <div className={styles.spinFather}>
                    <Spin size="large" />
                </div>)
        }
        if (mySpecialActivities.status === 'timeout' || mySpecialActivities.status === 'fail') {
            renderContentOfTheModal = (
                <div className={styles.spinFather}>
                {this.props.intl.formatMessage(STRING_SPE.da905h2m1354252)}<a onClick={checkDetailInfo}>{ COMMON_LABEL.retry }</a>
                </div>
            );
        }
        if (mySpecialActivities.status === 'success') {
            renderContentOfTheModal = (<SpecialPromotionDetail record={mySpecialActivities.data} />);
        }

        return (
            <Modal
                title={this.props.intl.formatMessage(STRING_SPE.db60c8ac0a3955121)}
                maskClosable={false}
                visible={this.state.visible}
                footer={<Button onClick={this.handleClose}>{ COMMON_LABEL.close }</Button>}
                closable={false}
                width="750px"
            >
                {renderContentOfTheModal}
            </Modal>
        );
    }
}


function mapValueToLabel(cfg, val) {
    return _.result(_.find(cfg, { value: val }), 'label');
}
export default MySpecialActivities;
