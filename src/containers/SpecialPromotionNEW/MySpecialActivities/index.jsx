// 特色营销列表页
import React from "react";
import ReactDOM from "react-dom";
import QRCode from "qrcode.react";
import { connect } from "react-redux";
import { COMMON_LABEL } from "i18n/common";
import {
    Table,
    Input,
    Select,
    DatePicker,
    Button,
    Modal,
    message,
    Spin,
    Icon,
    Alert,
    Switch,
    Tabs,
    Tooltip,
    Popover,
    Menu,
    TreeSelect,
    Radio,
} from "antd";
import { throttle, isEmpty, cloneDeep } from "lodash";
import { jumpPage, closePage } from "@hualala/platform-base";
import moment from "moment";
import copy from "copy-to-clipboard";
import styles from "../../SaleCenterNEW/ActivityPage.less";
import ExportModal from "../../GiftNew/GiftInfo/ExportModal";
import PlanModal from "../common/PlanModal";
import Cfg from "../../../constants/SpecialPromotionCfg";
import Authority from "../../../components/common/Authority";
import { SPECIAL_PROMOTION_MANAGE_PAGE } from "../../../constants/entryIds";
import {
    saleCenterSetSpecialBasicInfoAC,
    saleCenterResetDetailInfoAC,
    getAuthLicenseData,
} from "../../../redux/actions/saleCenterNEW/specialPromotion.action";
import ExpireDateNotice from "../../../components/common/ExpireDateNotice";
import {
    toggleSelectedActivityStateAC,
    fetchSpecialPromotionList,
    // fetchPromotionListCancel,
    deleteSelectedRecordAC,
    fetchSpecialPromotionDetailAC,
    fetchSpecialPromotionDetailCancel,
    fetchSpecialDetailAC,
    updateExpiredActiveState,
} from "../../../redux/actions/saleCenterNEW/mySpecialActivities.action";
import { toggleIsUpdateAC } from "../../../redux/actions/saleCenterNEW/myActivities.action";
import SpecialPromotionDetail from "./specialPromotionDetail";

import {
    getSpecialPromotionIdx,
    specialPromotionBasicDataAdapter,
} from "../../../redux/actions/saleCenterNEW/types";

import ActivityMain from "../activityMain";
import MyActivities from "../../SaleCenterNEW/MyActivities/MyActivities";

import registerPage from "../../../index";
import {
    SPECIAL_PAGE,
    PROMOTION_DECORATION,
    SALE_CENTER_PAYHAVEGIFT,
    SALE_ACTIVE_NEW_PAGE,
} from "../../../constants/entryCodes";
import { promotionBasicInfo_NEW as sale_promotionBasicInfo_NEW } from "../../../redux/reducer/saleCenterNEW/promotionBasicInfo.reducer";
import { promotionDetailInfo_NEW as sale_promotionDetailInfo_NEW } from "../../../redux/reducer/saleCenterNEW/promotionDetailInfo.reducer";
import {
    promotionScopeInfo_NEW as sale_promotionScopeInfo_NEW,
    shopSchema_New as sale_shopSchema_New,
} from "../../../redux/reducer/saleCenterNEW/promotionScopeInfo.reducer";
import { fullCut_NEW as sale_fullCut_NEW } from "../../../redux/reducer/saleCenterNEW/fullCut.reducer";
import { myActivities_NEW as sale_myActivities_NEW } from "../../../redux/reducer/saleCenterNEW/myActivities.reducer";
import { saleCenter_NEW as sale_saleCenter_NEW } from "../../../redux/reducer/saleCenterNEW/saleCenter.reducer";
import { giftInfoNew as sale_giftInfoNew } from "../../GiftNew/_reducers";
import { mySpecialActivities_NEW as sale_mySpecialActivities_NEW } from "../../../redux/reducer/saleCenterNEW/mySpecialActivities.reducer";
import { specialPromotion_NEW as sale_specialPromotion_NEW } from "../../../redux/reducer/saleCenterNEW/specialPromotion.reducer";
import { crmCardTypeNew as sale_crmCardTypeNew } from "../../../redux/reducer/saleCenterNEW/crmCardType.reducer";
import { promotion_decoration as sale_promotion_decoration } from "../../../redux/reducer/decoration";
import { selectPromotionForDecoration } from "../../../redux/actions/decoration";
import { Iconlist } from "../../../components/basic/IconsFont/IconsFont";
import { axiosData, checkAuthLicense } from "../../../helpers/util";
import { queryWeixinAccounts } from "../../../redux/reducer/saleCenterNEW/queryWeixinAccounts.reducer";
import {
    fetchPromotionCategoriesAC,
    fetchPromotionTagsAC,
} from "../../../redux/actions/saleCenterNEW/promotionBasicInfo.action";
import { fetchPromotionScopeInfo } from "../../../redux/actions/saleCenterNEW/promotionScopeInfo.action";
import {
    SPECIAL_LOOK_PROMOTION_QUERY,
    SPECIAL_PROMOTION_DELETE,
    SPECIAL_PROMOTION_QUERY,
    SPECIAL_PROMOTION_UPDATE,
} from "../../../constants/authorityCodes";
import {
    isBrandOfHuaTianGroupList,
    isGroupOfHuaTianGroupList,
    isMine,
} from "../../../constants/projectHuatianConf";
import { injectIntl } from "i18n/common/injectDecorator";
import { STRING_GIFT } from "i18n/common/gift";
import { STRING_SPE } from "i18n/common/special";
import { getStore } from "@hualala/platform-base";
// import { SALE_STRING } from 'i18n/common/salecenter'
import EmptyPage from "../../../components/common/EmptyPage";
import Chou2Le from "../../PromotionV3/Chou2Le"; // 抽抽乐
import BlindBox from "../../PromotionV3/BlindBox"; // 盲盒
import PassWordCoupon from "../../PromotionV3/PassWordCoupon"; // 口令领券
import { isFormalRelease } from "../../../utils/index";
import indexStyles from "./mySpecialActivities.less";
import ManyFace from "../../PromotionV3/ManyFace";
import CardSaleActive from "./CardSaleActive";
import Card from "../../../assets/card.png";
import newPromotionCardPageConfig from '../../SaleActives/NewPromotionCardPages/common/newPromotionCardPageConfig';
import { updateCurrentPromotionPageAC } from '../../SaleActives/NewPromotionCardPages/store/action';
import { consumeGivingWhiteList } from "containers/GiftNew/components/whiteList.js";

const Immutable = require("immutable");
const confirm = Modal.confirm;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;
const RadioGroup = Radio.Group;
const MenuItemGroup = Menu.ItemGroup;

const mapStateToProps = (state) => {
    return {
        mySpecialActivities: state.sale_mySpecialActivities_NEW,
        promotionBasicInfo: state.sale_promotionBasicInfo_NEW,
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        specialPromotion: state.sale_specialPromotion_NEW.toJS(),
        user: state.user.toJS(),
        shopList: state.user.getIn([
            "accountInfo",
            "dataPermissions",
            "shopList",
        ]),
    };
};
const DECORATABLE_PROMOTIONS = [
    "20",
    "21",
    "23",
    "64",
    "65",
    "66",
    "75",
    "76",
    "68",
    "79",
    "85",
    "83",
];

const isDecorationAvailable = ({ eventWay }) => {
    return DECORATABLE_PROMOTIONS.includes(`${eventWay}`);
};
const copyUrlList = [
    "21", // 免费领取
    "20", // 摇奖活动
    "30", // 积分兑换
    "22", // 报名活动
    "65", // 分享裂变
    "68", // 推荐有礼
    "79", // 盲盒
    "66", // 膨胀大礼包
    "83", //口令领券
];
const isCanCopyUrl = ({ eventWay }) => {
    return copyUrlList.includes(`${eventWay}`);
};
const mapDispatchToProps = (dispatch) => {
    return {
        selectPromotionForDecoration: (opts) => {
            dispatch(selectPromotionForDecoration(opts));
        },
        query: (opts) => {
            dispatch(fetchSpecialPromotionList(opts));
        },

        toggleSelectedActivityState: (opts) => {
            dispatch(toggleSelectedActivityStateAC(opts));
        },
        updateExpiredActiveState: (opts) => {
            dispatch(updateExpiredActiveState(opts));
        },
        deleteSelectedRecord: (opts) => {
            dispatch(deleteSelectedRecordAC(opts));
        },

        fetchSpecialPromotionList: (opts) => {
            dispatch(fetchSpecialPromotionList(opts));
        },

        fetchSpecialPromotionDetail: (opts) => {
            dispatch(fetchSpecialPromotionDetailAC(opts));
        },

        cancelFetchSpecialPromotionDetail: (opts) => {
            dispatch(fetchSpecialPromotionDetailCancel(opts));
        },
        saleCenterSetSpecialBasicInfo: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
        fetchSpecialDetail: (opts) => {
            dispatch(fetchSpecialDetailAC(opts));
        },
        saleCenterResetDetailInfo: (opts) => {
            dispatch(saleCenterResetDetailInfoAC(opts));
        },
        toggleIsUpdate: (opts) => {
            dispatch(toggleIsUpdateAC(opts));
        },
        getAuthLicenseData: (opts) => {
            return dispatch(getAuthLicenseData(opts));
        },
        updateCurrentPromotionPage: opts => dispatch(updateCurrentPromotionPageAC(opts)),
        // 查询类别
        fetchPromotionCategories: opts => {
            dispatch(fetchPromotionCategoriesAC(opts));
        },
        // 查询标签
        fetchPromotionTags: opts => {
            dispatch(fetchPromotionTagsAC(opts));
        },
        // 查询品牌、店铺等信息
        fetchPromotionScopeInfo: opts => {
            dispatch(fetchPromotionScopeInfo(opts));
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
        this.setTableRef = (el) => (this.tableRef = el);
        this.lockedChangeSortOrder = throttle(this.changeSortOrder, 500, {
            trailing: false,
        });
        this.state = {
            curKey: "",
            dataSource: [],
            advancedQuery: true,
            visible: false,
            selectedRecord: null, // current record
            updateModalVisible: false,
            expand: false, // 高级查询
            index: 0,
            recordToDisplay: null,
            // qualifications:
            valid: "0",
            modalTitle: `${this.props.intl.formatMessage(
                STRING_SPE.d2c8g6ep510150
            )}`,
            isNew: false,

            selectedShop: null,

            loading: true,
            eventWay: "", //下载链接eventWay
            queryEventWay: "", //搜索eventWay
            promotionDateRange: "",
            isActive: "1",
            eventName: "",
            editEventWay: "",
            pageSizes: 25,
            pageNo: 1,
            record: {
                eventInfo: {},
                cardInfo: [],
                userInfo: [],
            },
            queryDisabled: false,
            currentItemID: "",
            v3visible: false, // 第三版活动组件是否显示
            itemID: "",
            view: false,
            isShowCopyUrl: false,
            urlContent: "",
            authStatus: false, //
            authLicenseData: {},
            apps: [], // 小程序列表
            currAppID: "", // 选中的小程序
            qrCodeImage: "", // 小程序二维码图片链接
            xcxLoad: false, // 请求小程序时的load
            qrItemID: "", // 点击提取链接/二维码 当前活动的itemID
            giftArr: [],
            allWeChatAccountList: [],
            pushMessageMpID: "",
            groupID: "",
            isCopy: false,
            pushMessageMpID: "",
            channelContent: "",
            launchChannelID: "",
            launchChannelIDWX: "",
            channelOptions: _.range(0, 10).map((item) => ({
                label: `渠道${item + 1}`,
                value: `渠道${item + 1}`,
            })),
            page: "",
            scene: "",
            tabKeys: "saleSpecialPage",
            stylesShow: "list",
            planModalVisible: false,
            filterSchemeList: [],
            activeStatus: "",
            sortedChannelList: [],
            viewRuleVisibles: false,
            paramsValueList: [],
            eventCode: "", //活动编码
            expand: false,//高级查询展开收起
        };
        this.cfg = {
            eventWay: [
                {
                    value: "",
                    label: `${this.props.intl.formatMessage(STRING_GIFT.all)}`,
                },
                {
                    value: "51",
                    label: `${this.props.intl.formatMessage(
                        STRING_SPE.da910d8l680255
                    )}`,
                },
                {
                    value: "52",
                    label: `${this.props.intl.formatMessage(
                        STRING_SPE.d1kghbbhh2g1156
                    )}`,
                },
                {
                    value: "21",
                    label: `${this.props.intl.formatMessage(
                        STRING_SPE.d4h1eea89g12152
                    )}`,
                },
                {
                    value: "20",
                    label: `${this.props.intl.formatMessage(
                        STRING_SPE.de8h83kic431
                    )}`,
                },
                {
                    value: "30",
                    label: `${this.props.intl.formatMessage(
                        STRING_SPE.d567490a78b24187
                    )}`,
                },
                {
                    value: "22",
                    label: `${this.props.intl.formatMessage(
                        STRING_SPE.d1e0f874d45158
                    )}`,
                },
                {
                    value: "53",
                    label: `${this.props.intl.formatMessage(
                        STRING_SPE.dok2uwq1n6234
                    )}`,
                },
                {
                    value: "50",
                    label: `${this.props.intl.formatMessage(
                        STRING_SPE.d21650591a2047103
                    )}`,
                },
                {
                    value: "60",
                    label: `${this.props.intl.formatMessage(
                        STRING_SPE.d1701e8391a4865
                    )}`,
                },
                {
                    value: "61",
                    label: `${this.props.intl.formatMessage(
                        STRING_SPE.db612a0008a4925
                    )}`,
                },
                {
                    value: "62",
                    label: `${this.props.intl.formatMessage(
                        STRING_SPE.d4h1eea89g110128
                    )}`,
                },
                {
                    value: "23",
                    label: `${this.props.intl.formatMessage(
                        STRING_SPE.d4h1eea89g21118
                    )}`,
                },
                // 下线 { value: '70', label: '彩蛋猫送礼' },
                {
                    value: "63",
                    label: `${this.props.intl.formatMessage(
                        STRING_SPE.d5g3ql3oen12242
                    )}`,
                },
                {
                    value: "64",
                    label: `${this.props.intl.formatMessage(
                        STRING_SPE.d1701e8391a513206
                    )}`,
                },
                {
                    value: "65",
                    label: `${this.props.intl.formatMessage(
                        STRING_SPE.d567490a78b314234
                    )}`,
                },
                {
                    value: "66",
                    label: `${this.props.intl.formatMessage(
                        STRING_SPE.d1701e8391a515146
                    )}`,
                },
                {
                    value: "67",
                    label: `${this.props.intl.formatMessage(
                        STRING_SPE.d4h1eea89g21627
                    )}`,
                },
                {
                    value: "68",
                    label: `${this.props.intl.formatMessage(
                        STRING_SPE.de8h83kic51727
                    )}`,
                },
                {
                    value: "31",
                    label: `${this.props.intl.formatMessage(
                        STRING_SPE.d2c8o5o6gt1820
                    )}`,
                },
                { value: "75", label: "集点卡" },
                { value: "77", label: "支付后广告" },
                { value: "76", label: "签到" },
                { value: "78", label: "下单抽抽乐" },
                { value: "79", label: "盲盒" },
                { value: "80", label: "微信支付有礼" },
                { value: "81", label: "消费券返券" },
                { value: "82", label: "拼手气抢红包" },
                { value: "83", label: "口令领券" },
                { value: "85", label: "千人千面" },
                { value: '87', label: '消费送礼' },
                { value: '95', label: '限时秒杀' },
            ],
        };
        this.renderFilterBar = this.renderFilterBar.bind(this);
        this.showNothing = this.showNothing.bind(this);
        this.handleDismissUpdateModal = this.handleDismissUpdateModal.bind(
            this
        );
        // disable selected activity

        this.handleDisableClickEvent = this.handleDisableClickEvent.bind(this);
        this.handelStopEvent = this.handelStopEvent.bind(this);
        this.onDateQualificationChange = this.onDateQualificationChange.bind(
            this
        );
        this.handleQuery = this.handleQuery.bind(this);
        this.renderContentOfThisModal = this.renderContentOfThisModal.bind(
            this
        );
        this.checkDeleteInfo = this.checkDeleteInfo.bind(this);
        this.checkDetailInfo = this.checkDetailInfo.bind(this);
        this.renderModals = this.renderModals.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.renderUpdateModals = this.renderUpdateModals.bind(this);
        this.handleUpdateOpe = this.handleUpdateOpe.bind(this);
    }

    formatChannelData = (list) => {
        let data = [];
        if (!list || !Array.isArray(list)) {
            return [];
        }
        data = list.map((item) => {
            return {
                label: item.channelGroupName,
                value: item.channelGroupItemID,
                key: item.channelGroupItemID,
                // disabled: true,
                children: item.channelInfos.map((child) => {
                    return {
                        label: child.channelName,
                        value: child.itemID,
                        key: child.itemID,
                    };
                }),
            };
        });
        return data;
    };

    querySortedChannelList = () => {
        axiosData(
            "/launchchannel/launchChannelService_querySortedChannelList.ajax",
            {},
            {},
            { path: "" },
            "HTTP_SERVICE_URL_PROMOTION_NEW"
        )
            .then((res) => {
                if (res.code == "000") {
                    this.setState({
                        sortedChannelList: this.formatChannelData(
                            res.channelSortedInfos
                        ),
                    });
                }
            })
            .catch((err) => {
                // empty catch
            });
    };

    // 活动规则
    queryActiveRule = () => {
        axiosData(
            "/specialPromotion/queryGroupEventParamList.ajax",
            {
                groupID: getStore()
                    .getState()
                    .user.getIn(["accountInfo", "groupID"]),
            },
            {},
            { path: "" },
            "HTTP_SERVICE_URL_PROMOTION_NEW"
        )
            .then((res) => {
                if (res.code == "000") {
                    const {
                        data: { eventParamInfoList = [] },
                    } = res;
                    this.setState({
                        paramsValueList: eventParamInfoList.filter(
                            (item) => item.eventWay == 85
                        ),
                        viewRuleVisibles: true,
                    });
                }
            })
            .catch((err) => {
                // empty catch
            });
        // this.setState({viewRuleVisibles: true })
    };

    clearUrl() {
        var { href } = window.location;
        var [valiable] = href.split("?");
        window.history.pushState(null, null, valiable);
        this.setState({
            eventName: "",
        });
    }

    handleFromOtherPage = () => {
        const { from, itemID, activityName } = this.getQueryVariable();
        switch (from) {
            case "manyFace":
                this.setState(
                    {
                        isActive: "",
                        tabKeys: "saleSpecialPage",
                    },
                    () => {
                        this.handleQuery();
                        this.clearUrl();
                        this.handleDecorationStart({ itemID });
                    }
                );
                break;
            case "create":
                // 创建活动后更新使用状态为不限
                this.setState(
                    {
                        isActive: "",
                        tabKeys: "saleSpecialPage",
                    },
                    () => {
                        this.handleQuery();
                        this.clearUrl();
                    }
                );
                break;
            case "onSale":
                this.setState(
                    {
                        tabKeys: "onSalePage",
                    },
                    () => {
                        this.clearUrl();
                    }
                );
                break;
        }
        if (!from) {
            //如果是从顶部搜索而来
            if (activityName) {
                if (itemID) {
                    //营销活动
                    this.setState(
                        {
                            eventName: activityName,
                            tabKeys: "saleSpecialPage",
                            isActive: "",
                        },
                        () => {
                            this.handleQuery();
                            this.clearUrl();
                        }
                    );
                } else {
                    //促销活动
                    this.setState({
                        tabKeys: "onSalePage",
                    });
                }
            } else {
                this.handleQuery();
            }
        }
    };

    // 删除方案
    removePlan = (record, itemID) => {
        const _this = this;
        Modal.confirm({
            title: `确认删除方案【${record.schemeName}】`,
            content: "删除是不可恢复操作,请慎重考虑",
            iconType: "question-circle",
            onOk() {
                // handleNext();
                axiosData(
                    "/filterSchemeService/delete.ajax",
                    {
                        itemID,
                        groupID: getStore()
                            .getState()
                            .user.getIn(["accountInfo", "groupID"]),
                    },
                    null,
                    { path: null },
                    "HTTP_SERVICE_URL_PROMOTION_NEW"
                ).then((res) => {
                    if (res.code === "000") {
                        message.success("删除成功");
                        _this.getSearchListContent();
                    }
                });
            },
            onCancel() { },
        });
    };
    getQueryVariable() {
        const search = window.decodeURIComponent(window.location.search);
        var query = search.substr(1);
        query = query.split("&");
        var params = {};
        for (let i = 0; i < query.length; i++) {
            let q = query[i].split("=");
            if (q.length === 2) {
                params[q[0]] = q[1];
            }
        }
        return params;
    }

    goSearch = ({ key }) => {
        const record = this.state.filterSchemeList.find(
            (item) => item.itemID === key
        );
        const filterRule = record.filterRule || "{}";
        const itm = JSON.parse(filterRule);
        const { isActive } = itm;
        this.setState({ isActive }, () => {
            this.handleQuery();
        });
    };

    getSearchTitle = (name) => {
        return (
            <div>
                <span className={styles.customPro}></span>
                {name}
            </div>
        );
    };

    getSearchContent = () => {
        const { filterSchemeList } = this.state;
        return (
            <div>
                <Menu
                    // onClick={this.handleClick}
                    style={{ width: 240 }}
                    defaultSelectedKeys={["1"]}
                    defaultOpenKeys={["sub1"]}
                    mode="inline"
                    className={styles.saleSearchProgram}
                    onClick={this.goSearch}
                >
                    <MenuItemGroup
                        key="g1"
                        title={this.getSearchTitle("自定义方案")}
                    >
                        {(filterSchemeList || []).map((item) => {
                            const filterRule = item.filterRule || "{}";
                            const itm = JSON.parse(filterRule);
                            return (
                                <Menu.Item key={item.itemID}>
                                    <span className={styles.menuTitle}>
                                        {itm.schemeName}
                                    </span>
                                    <Icon
                                        type="close-circle-o"
                                        onClick={() => {
                                            this.removePlan(itm, item.itemID);
                                        }}
                                    />
                                </Menu.Item>
                            );
                        })}
                    </MenuItemGroup>
                    <MenuItemGroup
                        key="g2"
                        title={this.getSearchTitle("系统预置")}
                    >
                        <Menu.Item key="g21">
                            <span className={styles.menuTitle}>暂无</span>
                        </Menu.Item>
                    </MenuItemGroup>
                </Menu>
                <Button
                    type="ghost"
                    style={{ width: "100%" }}
                    icon="plus"
                    onClick={() => {
                        this.setState({ planModalVisible: true });
                    }}
                >
                    {" "}
                    将当前查询条件保存为方案
                </Button>
            </div>
        );
    };
    /**
     * @description toggle the advanced qualification selection.
     * */
    handleDisableClickEvent(text, record, index, nextActive, modalTip) {
        // this.state.selectedRecord
        this.props.toggleSelectedActivityState({
            record,
            groupID: this.props.user.accountInfo.groupID,
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
                    {this.props.intl.formatMessage(STRING_SPE.dojy6qlmv253)}【
                    <span>{record.eventName}</span>】
                    <br />
                    <span>
                        {this.props.intl.formatMessage(STRING_SPE.d34ikef74237)}
                    </span>
                </div>
            ),
            footer: `${this.props.intl.formatMessage(STRING_SPE.d34ikef74237)}`,
            onOk: () => {
                this.handleDisableClickEvent(
                    text,
                    record,
                    index,
                    nextActive,
                    modalTip
                );
            },
            onCancel: () => { },
        });
    }
    // 关闭更新
    handleDismissUpdateModal() {
        if (this.state.isCopy) {
            this.handleQuery(this.state.pageNo);
        }
        this.setState(
            {
                updateModalVisible: false,
                isCopy: false,
            },
            () => {
                this.props.saleCenterResetDetailInfo();
            }
        );
    }

    componentDidMount() {
        this.props.fetchPromotionCategories({
            groupID: this.props.user.accountInfo.groupID,
            phraseType: "0",
        });

        this.props.fetchPromotionTags({
            groupID: this.props.user.accountInfo.groupID,
            phraseType: "1",
        });

        this.props.fetchPromotionScopeInfo({
            _groupID: this.props.user.accountInfo.groupID,
        });
        this.queryWechatMpInfo();
        // 把groupID传给后台，后台执行自动终止
        this.props.updateExpiredActiveState({
            groupID: this.props.user.accountInfo.groupID,
        });
        // 产品授权
        this.props.getAuthLicenseData().then((res) => {
            this.setState({ authLicenseData: res });
            let { authStatus } = checkAuthLicense(res);
            this.setState({ authStatus });
        });
        // 千人千面活动创建和更新完，点去装修跳转页面
        this.handleFromOtherPage();
        this.getSearchListContent(); // 查询方案列表
    }

    // 产品授权
    getAuthLicenseData = (opts) => {
        axiosData(
            "/crm/crmAuthLicenseService.queryCrmPluginLicenses.ajax?auth",
            {
                ...opts,
                groupID: getStore()
                    .getState()
                    .user.getIn(["accountInfo", "groupID"]),
            },
            null,
            { path: "data" },
            "HTTP_SERVICE_URL_CRM"
        ).then((res) => {
            let { data = {} } = res;
            this.setState({ authLicenseData: data });
            let { authStatus } = checkAuthLicense(this.state.authLicenseData);
            this.setState({ authStatus });
        });
    };

    // 查询方案列表
    getSearchListContent = () => {
        axiosData(
            "/filterSchemeService/queryList.ajax",
            {
                filterType: 11,
                pageNo: 1,
                pageSize: 100,
                groupID: getStore()
                    .getState()
                    .user.getIn(["accountInfo", "groupID"]),
            },
            null,
            { path: null },
            "HTTP_SERVICE_URL_PROMOTION_NEW"
        ).then((res) => {
            if (res.code === "000") {
                const {
                    data: { filterSchemeList = [] },
                } = res;
                this.setState({
                    filterSchemeList,
                });
            }
        });
    };

    // TODO: the following code may be not the best implementation of filter
    // The filter condition should not be save to redux, just save it to state temporarily.
    // Modify it in the future
    componentWillReceiveProps(nextProps) {
        if (
            this.props.user.activeTabKey !== nextProps.user.activeTabKey &&
            nextProps.user.activeTabKey === "1000076003"
        ) {
            const tabArr = nextProps.user.tabList.map((tab) => tab.value);
            if (tabArr.includes("1000076003")) {
                this.handleQuery(this.state.pageNo); // tab里已有该tab，从别的tab切换回来，就自动查询，如果是新打开就不执行此刷新函数，而执行加载周期里的
            }
        }
        if (
            this.props.mySpecialActivities.get("$specialPromotionList") !==
            nextProps.mySpecialActivities.get("$specialPromotionList")
        ) {
            const _promoitonList = nextProps.mySpecialActivities
                .get("$specialPromotionList")
                .toJS();
                console.log(_promoitonList,'_promoitonList>>>>>>>>>>>>>>')
            switch (_promoitonList.status) {
                case "timeout":
                    message.error(
                        `${this.props.intl.formatMessage(
                            STRING_SPE.d17012f5c16b488
                        )}`
                    );
                    this.setState({
                        loading: false,
                    });
                    break;
                case "fail":
                    message.error(
                        `${this.props.intl.formatMessage(
                            STRING_SPE.du3bnfobd599
                        )}`
                    );
                    this.setState({
                        loading: false,
                    });
                    break;
                case "success":
                    if (_promoitonList.data) {
                        const _envIsVip =
                            HUALALA.ENVIRONMENT === "production-release";
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
                        message.warning(
                            `${this.props.intl.formatMessage(
                                STRING_SPE.d4h1ac506h7670
                            )}`
                        );
                        this.setState({
                            loading: false,
                            dataSource: [],
                            total: _promoitonList.total,
                        });
                    }
                    break;
            }
        }
        if (
            this.props.mySpecialActivities.get("$specialDetailInfo") !==
            nextProps.mySpecialActivities.get("$specialDetailInfo")
        ) {
            this.setState({
                record: nextProps.mySpecialActivities
                    .get("$specialDetailInfo")
                    .toJS(),
            });
        }
    }
    //** 第三版 重构 抽抽乐活动 点击事件 */
    onV3Click = (itemID, view, key, isActive) => {
        if ([85, 23, 95].includes(key)) {
            setTimeout(() => {
                jumpPage({
                    menuID: SALE_ACTIVE_NEW_PAGE,
                    typeKey: key,
                    itemID,
                    isView: view,
                    isActive,
                });
            }, 100);
            return closePage(SALE_ACTIVE_NEW_PAGE);
        }
        this.setState((ps) => ({
            v3visible: !ps.v3visible,
            activeStatus: isActive,
        }));
        if (itemID) {
            this.setState({ itemID, view, curKey: key });
        }
    };
    hideCopyUrlModal = () => {
        this.setState({
            isShowCopyUrl: false,
        });
    };
    handleShowDetail = ({ record, isView = false, isEdit = false }) => {
        closePage(SALE_CENTER_PAYHAVEGIFT);
        // 跳转到新版的营销活动
        setTimeout(() => {
            jumpPage({
                menuID: SALE_CENTER_PAYHAVEGIFT,
                itemID: record.itemID,
                typeKey: record.eventWay,
                isView,
                isEdit,
            });
        }, 100);
    };
    // 请求小程序列表
    async getAppList() {
        const newData = {
            groupID: getStore()
                .getState()
                .user.getIn(["accountInfo", "groupID"]),
            page: { current: 1, pageSize: 1000 },
        };
        const {
            result: { code, message: msg },
            apps,
        } = await axiosData(
            "/miniProgramCodeManage/getApps",
            newData,
            {},
            { path: "" },
            "HTTP_SERVICE_URL_WECHAT"
        );
        if (code === "000" && !isEmpty(apps)) {
            this.setState({ apps });
        }
    }
    // 请求小程序二微码
    creatReleaseQrCode = () => {
        const { eventWay, currAppID, qrItemID, launchChannelIDWX } = this.state;
        if (!currAppID) {
            message.error("请选择小程序");
            return;
        }
        /*
        1.积分兑换： pages/subOr/voucherCenter/redeemDetail/main?eventID=6886285210829196181
        2.摇奖活动： pages/web/common/main?url=mpweb/promotion/lottery?eventID=6883767509506329493 (摇奖活动是跳转mp-web项目（h5）)
        3.免费领取： pages/subOr/voucherCenter/voucherDetail/main?eventID=6886700950686272405
        4.盲盒活动： pages/promotion/blindBox/index?eventID=6885962366719101845
        5.推荐有礼： pages/promotion/recommend/main?e=6885521217743227797
        6.分享裂变： pages/promotion/share/main?e=6888122567681379221
        7.膨胀大礼包：pages/promotion/expand/main?e=6883743693912673173
        */
        const pageMap = {
            30: {
                page: "pages/subOr/voucherCenter/redeemDetail/main",
                scene: !launchChannelIDWX
                    ? `eventID=${qrItemID}`
                    : `eventID=${qrItemID}&launchChannelID=${launchChannelIDWX}`,
            },
            20: {
                page: "pages/web/common/main",
                scene: !launchChannelIDWX
                    ? `u=l?eventID=${qrItemID}`
                    : `u=l?eventID=${qrItemID}&launchChannelID=${launchChannelIDWX}`,
            },
            21: {
                page: "pages/subOr/voucherCenter/voucherDetail/main",
                scene: !launchChannelIDWX
                    ? `eventID=${qrItemID}`
                    : `eventID=${qrItemID}&launchChannelID=${launchChannelIDWX}`,
            },
            79: {
                page: "pages/promotion/blindBox/index",
                scene: !launchChannelIDWX
                    ? `eventID=${qrItemID}`
                    : `eventID=${qrItemID}&launchChannelID=${launchChannelIDWX}`,
            },
            68: {
                page: "pages/promotion/recommend/main",
                scene: !launchChannelIDWX
                    ? `e=${qrItemID}`
                    : `e=${qrItemID}&launchChannelID=${launchChannelIDWX}`,
            },
            65: {
                page: "pages/promotion/share/main",
                scene: !launchChannelIDWX
                    ? `e=${qrItemID}`
                    : `e=${qrItemID}&launchChannelID=${launchChannelIDWX}`,
            },
            66: {
                page: "pages/promotion/expand/main",
                scene: !launchChannelIDWX
                    ? `e=${qrItemID}`
                    : `e=${qrItemID}&launchChannelID=${launchChannelIDWX}`,
            },
            82: {
                page: "pages/promotion/grab/main",
                scene: !launchChannelIDWX
                    ? `e=${qrItemID}`
                    : `e=${qrItemID}&launchChannelID=${launchChannelIDWX}`,
            },
            83: {
                page: "pages/promotion/passwordCoupons/main",
                scene: !launchChannelIDWX
                    ? `e=${qrItemID}`
                    : `e=${qrItemID}&launchChannelID=${launchChannelIDWX}`,
            }, //口令领券
        };
        const params = {
            appID: currAppID,
            scene: pageMap[eventWay].scene,
            page: pageMap[eventWay].page,
            width: 280,
        };
        const paramsRouter = cloneDeep(params);
        if (eventWay == "20") {
            paramsRouter.scene = `scene=${paramsRouter.scene}`;
        }
        this.setState({ xcxLoad: true });
        const callServer = axiosData(
            "/maQrCode/getReleaseQrCode",
            params,
            {},
            { path: "" },
            "HTTP_SERVICE_URL_WECHAT"
        );
        callServer
            .then((data) => {
                let {
                    result: { code, message: msg },
                    qrCodeImage = "",
                } = data;
                this.setState({ xcxLoad: false });
                if (code === "000") {
                    this.setState({
                        qrCodeImage,
                        scene: paramsRouter.scene,
                        page: `${paramsRouter.page}.html`,
                    });
                }
            })
            .catch(({ message: msg }) => {
                this.setState({ xcxLoad: false });
                message.error(msg);
            });
    };
    // 选择小程序
    handleAppChange = (currAppID) => {
        this.setState({ currAppID });
    };
    // 选择公众号
    handleWechatAccountChange = (v) => {
        const mpId = JSON.parse(v).mpID;
        this.setState({
            pushMessageMpID: mpId,
        });
        this.handleCopyUrl(null, mpId);
    };

    // 修改活动规则
    handleRuleOk = () => {
        const callServer = axiosData(
            "/specialPromotion/updateGroupEventParamList.ajax",
            {
                groupID: getStore()
                    .getState()
                    .user.getIn(["accountInfo", "groupID"]),
                eventParamInfoList: this.state.paramsValueList,
            },
            {},
            { path: "" },
            "HTTP_SERVICE_URL_PROMOTION_NEW"
        );
        callServer
            .then((data) => {
                let { code } = data;
                if (code === "000") {
                    message.success("更新成功");
                    this.setState({ viewRuleVisibles: false });
                }
            })
            .catch(({ message: msg }) => {
                this.setState({ viewRuleVisibles: false });
                // message.error(msg)
            });
    };

    handleCheckText = (value, label) => {
        // let v = Number(value);
        const groupIds = this.state.sortedChannelList.map((item) => item.value);
        if (groupIds.includes(value)) {
            message.warning("请选择渠道");
            this.setState(
                {
                    channelContent: "",
                    launchChannelID: "",
                },
                () => {
                    this.handleCopyUrl();
                }
            );
        } else {
            this.setState(
                {
                    channelContent: label[0] || "",
                    launchChannelID: value || "",
                },
                () => {
                    this.handleCopyUrl();
                }
            );
        }
    };

    handleChangeTabs = (key) => {
        this.setState(
            {
                tabKeys: key,
            },
            () => {
                this.handleQuery();
            }
        );
    };

    // 点击按钮前先弹窗
    handleEditActive = (record) => (handleNext) => {
        if (
            isGroupOfHuaTianGroupList(this.props.user.accountInfo.groupID) &&
            (record.isActive != "0" || !isMine(record)) &&
            record.eventWay != 64
        ) {
            Modal.confirm({
                title: `活动编辑`,
                content: "活动无法编辑。",
                iconType: "exclamation-circle",
            });
            return;
        }
        if (record.isActive == "1") {
            // 正在进行中的活动弹窗提示
            Modal.confirm({
                title: `活动编辑`,
                content: "活动正在进行中，确定要进行编辑吗？",
                iconType: "exclamation-circle",
                onOk() {
                    handleNext();
                },
                onCancel() { },
            });
        } else {
            handleNext();
        }
    };

    handleNewEditActive = (record, mode) => {
        let handleNext = () => {
            const currentPromotion = newPromotionCardPageConfig.find(item => item.key == record.eventWay);
            jumpPage({ menuID: currentPromotion.menuID, promotionKey: record.eventWay, mode, itemID: record.itemID });
            const { updateCurrentPromotionPage } = this.props;
            updateCurrentPromotionPage({
                [record.eventWay]: {
                    promotionKey: record.eventWay,
                    mode,
                    itemID: record.itemID
                },
            })
        }
        if (mode == 'view') {
            return handleNext();
        }
        if (
            isGroupOfHuaTianGroupList(this.props.user.accountInfo.groupID) &&
            (record.isActive != "0" || !isMine(record)) &&
            record.eventWay != 64
        ) {
            Modal.confirm({
                title: `活动编辑`,
                content: "活动无法编辑。",
                iconType: "exclamation-circle",
            });
            return;
        }
        if (record.isActive == "1") {
            // 正在进行中的活动弹窗提示
            Modal.confirm({
                title: `活动编辑`,
                content: "活动正在进行中，确定要进行编辑吗？",
                iconType: "exclamation-circle",
                onOk() {
                    handleNext();
                },
                onCancel() { },
            });
        } else {
            handleNext();
        }
    }

    // 点击删除按钮先弹窗
    handleDelActive = (record) => (handleNext) => {
        if (isBrandOfHuaTianGroupList(this.props.user.accountInfo.groupID)) {
            Modal.confirm({
                title: `活动删除`,
                content: "活动无法删除。",
                iconType: "question-circle",
            });
            return;
        }
        if (record.isActive == "1") {
            Modal.confirm({
                title: `确认删除这个活动`,
                content:
                    "活动正在启用中，删除后无法恢复，线上投放的活动链接及二维码将会失效。",
                iconType: "question-circle",
                onOk() {
                    handleNext();
                },
                onCancel() { },
            });
            return;
        }
        Modal.confirm({
            title: `确认删除这个活动`,
            content: "删除后无法恢复，线上投放的活动链接及二维码将会失效。",
            iconType: "question-circle",
            onOk() {
                handleNext();
            },
            onCancel() { },
        });
    };

    handleSattusActive = (record) => (handleNext) => {
        if (record.isActive == "-1" || record.isActive == "2") {
            Modal.info({
                title: `活动无法启用`,
                content: `活动已${record.isActive == "-1" ? "结束" : "失效"
                    }，请修改可用的活动时间。`,
                okText: "确定",
                // cancelText: null,
                iconType: "exclamation-circle",
                onOk() { },
                onCancel() { },
                // okType: 'primary'
            });
            return;
        }
        handleNext();
    };

    // 列表样式切换
    stylesChange = (val) => {
        this.setState({
            stylesShow: val,
        });
    };
    // 渲染小程序列表
    renderApp() {
        const { apps = [] } = this.state;
        return (
            <Select
                style={{ width: "51%", margin: "0 10px" }}
                onChange={this.handleAppChange}
                placeholder="请选择小程序"
            >
                {apps.map((x, index) => {
                    return (
                        <Option key={index} value={x.appID}>
                            {x.nickName || "缺失nickName子段"}
                        </Option>
                    );
                })}
            </Select>
        );
    }

    // 下载餐厅二维码
    handleQrCodeDownload = (action) => {
        const tagetEle = document.getElementById(action);
        const domA = document.createElement("a");
        domA.href = tagetEle.toDataURL("image/png");
        domA.download = "线上餐厅二维码.png";
        domA.click();
    };
    // 下载小程序二维码
    downloadImage = (action, name) => {
        let image = new Image();
        // 解决跨域 Canvas 污染问题
        image.setAttribute("crossOrigin", "anonymous");
        image.onload = function () {
            let canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            let context = canvas.getContext("2d");
            context.drawImage(image, 0, 0, image.width, image.height);
            let url = canvas.toDataURL("image/png");
            // 生成一个a元素
            let a = document.createElement("a");
            // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
            a.download = name || "小程序二维码";
            // 将生成的URL设置为a.href属性
            a.href = url;
            // 触发a的单击事件
            a.click();
        };
        image.src = document.getElementById(action).src;
    };

    queryWechatMpInfo = () => {
        const { shopList } = this.props;
        const shopIDs = shopList.toJS().map((x) => x.shopID);
        const params = {
            shopIDs,
            pageNo: 1,
            pageSize: 100,
            mpType: "SERVICE_AUTH",
        };
        axiosData(
            "/wechat/mpInfoRpcService_queryMpInfoByBindShop.ajax",
            { ...params },
            null,
            { path: "data" },
            "HTTP_SERVICE_URL_CRM"
        ).then((data) => {
            const { mpInfoResDataList = [] } = data;
            this.setState({
                allWeChatAccountList: mpInfoResDataList,
                pushMessageMpID: mpInfoResDataList[0].mpID,
                mpName: mpInfoResDataList[0].mpName,
            });
        });
    };
    getAllAvailableMpInfo = () => {
        const { allWeChatAccountList } = this.state;
        return [
            ...allWeChatAccountList.map((item) => ({
                value: JSON.stringify({ mpID: item.mpID, appID: item.appID }),
                label: item.mpName,
            })),
        ];
    };
    // 渲染公众号列表
    renderMp() {
        const { pushMessageMpID, mpName } = this.state;
        this.handleWechatChange = this.handleWechatAccountChange.bind(this);
        return (
            <Select
                notFoundContent={"未搜索到结果"}
                placeholder="请选择微信推送的公众号"
                showSearch={true}
                defaultValue={mpName || undefined}
                onChange={this.handleWechatChange}
                style={{
                    width: "54%",
                    margin: "0 10px",
                }}
            >
                {this.getAllAvailableMpInfo().map(({ value, label }) => (
                    <Option key={value} value={value} label={label}>
                        {label}
                    </Option>
                ))}
            </Select>
        );
    }

    renderH5Channels() {
        const { sortedChannelList, launchChannelID } = this.state;
        return (
            <TreeSelect
                style={{ width: "51%", margin: "0 10px" }}
                treeData={sortedChannelList}
                dropdownStyle={{ maxHeight: 260, overflow: "auto" }}
                placeholder="请选择渠道"
                showSearch={true}
                treeNodeFilterProp="label"
                allowClear={true}
                treeDefaultExpandAll
                value={launchChannelID || undefined}
                onChange={this.handleCheckText}
            />
        );
    }

    renderWXChannels() {
        const { sortedChannelList, launchChannelIDWX } = this.state;
        return (
            <TreeSelect
                style={{ width: "51%", margin: "0 10px" }}
                treeData={sortedChannelList}
                dropdownStyle={{ maxHeight: 260, overflow: "auto" }}
                placeholder="请选择渠道"
                showSearch={true}
                treeNodeFilterProp="label"
                allowClear={true}
                treeDefaultExpandAll
                value={launchChannelIDWX || undefined}
                onChange={(value, label) => {
                    const groupIds = sortedChannelList.map(
                        (item) => item.value
                    );
                    if (groupIds.includes(value)) {
                        message.warning("请选择渠道");
                        this.setState({
                            launchChannelIDWX: "",
                        });
                    } else {
                        this.setState({
                            launchChannelIDWX: value || "",
                        });
                    }
                }}
            />
        );
    }

    // 渲染复制链接modal内容
    renderCopyUrlModal() {
        const {
            urlContent,
            eventWay,
            qrCodeImage,
            xcxLoad,
            channelContent,
            page,
            scene,
        } = this.state;
        const hideCTBox = [66, 79, 82, 83]; // 不显示餐厅
        const hideWXBox = [22]; // 不显示微信
        return (
            <div className={indexStyles.copyCont}>
                {hideCTBox.includes(eventWay) ? (
                    ""
                ) : (
                    <div
                        className={indexStyles.copyBox}
                        style={{ marginRight: 20 }}
                    >
                        <h4 className={indexStyles.copyTitle}>
                            线上餐厅链接提取
                        </h4>
                        <Alert
                            message="提取链接或二维码后，可以线上或线下投放"
                            type="warning"
                        />
                        <div className={indexStyles.copyUrlWrap}>
                            <div className={indexStyles.leftMpConent}>
                                <div className={indexStyles.label}>
                                    请选择公众号
                                </div>
                                {this.renderMp()}
                            </div>
                            <div className={indexStyles.leftMpConent}>
                                <div className={indexStyles.label}>
                                    请填写投放渠道
                                </div>
                                {this.renderH5Channels()}
                                {/* <Input
                                    style={{
                                        width: '51%', margin: '0 10px'
                                    }}
                                    onChange={this.handleCheckText}
                                    value={channelContent}
                                /> */}
                            </div>

                            <div className={indexStyles.copyWrapHeader}>
                                <div className={indexStyles.urlText}>
                                    {urlContent}
                                </div>
                                <Button
                                    className={indexStyles.copyBtn}
                                    onClick={this.handleToCopyUrl}
                                >
                                    复制链接
                                </Button>
                            </div>
                            <div className={indexStyles.qrCodeBox}>
                                <div>
                                    <QRCode
                                        size={160}
                                        value={urlContent}
                                        id="__promotion_xsct_qr_canvas"
                                    />
                                </div>
                                <Button
                                    className={indexStyles.xzqrCodeBtn}
                                    type="primary"
                                    onClick={() => {
                                        this.handleQrCodeDownload(
                                            "__promotion_xsct_qr_canvas"
                                        );
                                    }}
                                >
                                    下载二维码
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
                {hideWXBox.includes(eventWay) ? (
                    ""
                ) : (
                    <div className={indexStyles.copyBox}>
                        <h4 className={indexStyles.copyTitle}>
                            小程序活动码提取
                        </h4>
                        <Alert
                            message="请先在小程序装修配置好该活动，再提取小程序活动码"
                            type="warning"
                        />
                        <div
                            className={indexStyles.copyUrlWrap}
                            style={{ overflow: "scroll" }}
                        >
                            <div className={indexStyles.copyWrapHeader}>
                                <div
                                    className={indexStyles.label}
                                    style={{ width: "25%", textAlign: "right" }}
                                >
                                    请选择小程序
                                </div>
                                {this.renderApp()}
                            </div>
                            <div className={indexStyles.copyWrapHeader}>
                                <div
                                    className={indexStyles.label}
                                    style={{ width: "25%", textAlign: "right" }}
                                >
                                    请选择投放渠道
                                </div>
                                {this.renderWXChannels()}
                            </div>
                            <div
                                style={{
                                    fontSize: "12px",
                                    padding: 7,
                                    backgroundColor: "rgb(247,194,127)",
                                    borderRadius: "5px",
                                }}
                            >
                                如需设置投放渠道，请确保所选2.0小程序版本不低于OR6.2.6.0；3.0小程序版本不低于SR3.6.0，否则会造成生成的小程序活动码/链接失效！
                            </div>
                            <div style={{ textAlign: "center", marginTop: 10 }}>
                                <Button
                                    className={indexStyles.wxBtn}
                                    type="primary"
                                    onClick={this.creatReleaseQrCode}
                                    loading={xcxLoad}
                                >
                                    生成小程序码
                                </Button>
                            </div>
                            <div
                                className={indexStyles.qrCodeBox}
                                style={{ margin: 0 }}
                            >
                                {qrCodeImage && (
                                    <div className={indexStyles.copyWrapHeader}>
                                        <div
                                            className={indexStyles.label}
                                            style={{
                                                width: "25%",
                                                textAlign: "right",
                                            }}
                                        >
                                            小程序路径
                                        </div>
                                        <Input
                                            value={`${page}?${scene}`}
                                            style={{
                                                width: "51%",
                                                margin: "0 10px",
                                            }}
                                        />
                                        <Button
                                            className={indexStyles.wxBtn}
                                            type="primary"
                                            onClick={this.handleToCopyRouter}
                                        >
                                            复制
                                        </Button>
                                    </div>
                                )}
                                {qrCodeImage ? (
                                    <img
                                        className={indexStyles.miniProgramBox}
                                        style={{ marginTop: 40 }}
                                        src={qrCodeImage}
                                        id="__promotion_xcx_qr_img"
                                        alt="小程序二维码"
                                    />
                                ) : (
                                    ""
                                )}
                                <Button
                                    className={indexStyles.xzqrCodeBtn}
                                    type="primary"
                                    disabled={!qrCodeImage}
                                    onClick={() => {
                                        this.downloadImage(
                                            "__promotion_xcx_qr_img"
                                        );
                                    }}
                                >
                                    下载小程序码
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    matchEventName = (eventWay) => {
        let name = ''
        let desc = ''
        switch (eventWay) {
            case 85:
                name = "千人千面";
                desc = "当同一时间、同一门店、同一投放类型、同一投放位置下存在多个活动时，将按照以下规则执行";
                break;
            case 23:
                name = "线上餐厅弹窗送礼";
                desc = "当同一时间、同一门店、同一发放位置下存在多个活动时，将按照以下规则执行";
                break;
            case 95:
                name = "限时秒杀";
                desc = "当同一时间、同一门店、同一发放位置下存在多个活动时，限时秒杀";
                break;
            default:
                break;
        }
        return { name, desc }
    }

    render() {
        const {
            v3visible,
            itemID,
            view,
            isShowCopyUrl,
            curKey,
            tabKeys,
            stylesShow,
            dataSource,
            viewRuleVisibles,
        } = this.state;
        return (
            <div
                style={{
                    backgroundColor: this.state.authStatus ? "#F3F3F3" : "#fff",
                }}
                className="layoutsContainer"
                ref={(layoutsContainer) =>
                    (this.layoutsContainer = layoutsContainer)
                }
            >
                {this.renderHeader()}
                <div>
                    <Tabs
                        defaultActiveKey={tabKeys}
                        onChange={this.handleChangeTabs}
                        className="tabsStyles"
                        style={{ backgroundColor: "#fff" }}
                        activeKey={tabKeys}
                    >
                        <TabPane tab="营销活动" key="saleSpecialPage">
                            {!this.state.authStatus ? (
                                <div
                                    style={{ minHeight: "calc(100vh - 80px)" }}
                                >
                                    <EmptyPage />{" "}
                                </div>
                            ) : (
                                <div
                                    className={styles.pageContentWrapper}
                                    style={{ minHeight: "calc(100vh - 80px)" }}
                                >
                                    <div
                                        style={{ padding: "0" }}
                                        className="layoutsHeader"
                                    >
                                        {this.renderFilterBar()}
                                        <div
                                            style={{ margin: "0" }}
                                            className="layoutsLine"
                                        ></div>
                                    </div>
                                    {stylesShow === "list" ? (
                                        this.renderTables()
                                    ) : (
                                        <CardSaleActive
                                            dataSource={dataSource}
                                            type="special"
                                            cfg={this.cfg}
                                            onV3Click={this.onV3Click}
                                            handleShowDetail={
                                                this.handleShowDetail
                                            }
                                            toggleIsUpdate={
                                                this.props.toggleIsUpdate
                                            }
                                            handleUpdateOpe={
                                                this.handleUpdateOpe
                                            }
                                            handleSattusActive={(
                                                item,
                                                index
                                            ) => {
                                                this.handleSattusActive(
                                                    item
                                                )(() =>
                                                    this.handleDisableClickEvent(
                                                        item.operation,
                                                        item,
                                                        index,
                                                        null,
                                                        "使用状态修改成功"
                                                    )
                                                );
                                            }}
                                            user={this.props.user}
                                            onChangePage={this.onChangePage}
                                            onShowSizeChange={
                                                this.onShowSizeChange
                                            }
                                            pageNo={this.state.pageNo}
                                            pageSizes={this.state.pageSizes}
                                            total={this.state.total}
                                            handleEditActive={
                                                this.handleEditActive
                                            }
                                            handleDelActive={
                                                this.handleDelActive
                                            }
                                            handleNewEditActive={this.handleNewEditActive}
                                            checkDeleteInfo={
                                                this.checkDeleteInfo
                                            }
                                            isCopy={() => {
                                                this.setState({
                                                    isCopy: true,
                                                });
                                            }}
                                            checkDetailInfo={
                                                this.checkDetailInfo
                                            }
                                            handleDecorationStart={
                                                this.handleDecorationStart
                                            }
                                            handleCopyUrl={this.handleCopyUrl}
                                            handelStopEvent={
                                                this.handelStopEvent
                                            }
                                        />
                                    )}
                                </div>
                            )}
                        </TabPane>
                        <TabPane tab="促销活动" key="onSalePage">
                            <MyActivities
                                stylesChange={this.stylesChange}
                                stylesShow={stylesShow}
                                tabKeys={tabKeys}
                            />
                        </TabPane>
                    </Tabs>
                </div>
                {this.renderModals()}
                {this.renderUpdateModals()}
                {!this.state.exportVisible ? null : (
                    <ExportModal
                        specialPromotion
                        handleClose={() =>
                            this.setState({ exportVisible: false })
                        }
                    />
                )}
                {v3visible && curKey == "78" && (
                    <Chou2Le
                        onToggle={this.onV3Click}
                        id={itemID}
                        view={view}
                    />
                )}
                {v3visible && curKey == "79" && (
                    <BlindBox
                        onToggle={this.onV3Click}
                        id={itemID}
                        view={view}
                    />
                )}
                {v3visible && curKey == "83" && (
                    <PassWordCoupon
                        onToggle={this.onV3Click}
                        id={itemID}
                        view={view}
                    />
                )}
                {/* {(v3visible && curKey == '85') && <ManyFace onToggle={this.onV3Click} id={itemID} view={view} handleDecorationStart={this.handleDecorationStart} activeStatus={this.state.activeStatus}/>} */}
                <Modal
                    title="提取活动链接"
                    visible={isShowCopyUrl}
                    onCancel={this.hideCopyUrlModal}
                    footer={null}
                    width={900}
                >
                    {this.renderCopyUrlModal()}
                </Modal>
                {this.state.planModalVisible && (
                    <PlanModal
                        onCancel={() => {
                            this.setState({ planModalVisible: false });
                        }}
                        isActive={this.state.isActive}
                        onSearch={this.getSearchListContent}
                        filterSchemeList={this.state.filterSchemeList}
                    />
                )}
                {viewRuleVisibles && (
                    <Modal
                        maskClosable={false}
                        visible={true}
                        width={700}
                        title="活动规则"
                        onCancel={() => {
                            this.setState({ viewRuleVisibles: false });
                        }}
                        onOk={this.handleRuleOk}
                        wrapClassName={styles.viewRuleVisibleModal}
                    >
                        {this.state.paramsValueList.map((item) => (
                            <div key={item.eventWay} style={{ marginBottom: 10 }}>
                                <div className={styles.ruleModalTitle}>
                                    <span className={styles.name}>
                                        {this.matchEventName(item.eventWay).name}
                                    </span>
                                    {this.matchEventName(item.eventWay).desc}
                                </div>
                                <div>
                                <span className={styles.computeRule}>
                                    执行规则
                                </span>
                                <RadioGroup
                                    name="radiogroup"
                                    defaultValue={item.paramValue}
                                    onChange={({ target }) => {
                                        let { paramsValueList } = this.state;
                                        paramsValueList = paramsValueList.map(v => {
                                            if(item.eventWay == v.eventWay) {
                                                return {
                                                    ...v,
                                                    paramValue: target.value,
                                                };
                                            }
                                            return v
                                        })
                                        this.setState({
                                            paramsValueList,
                                        });
                                    }}
                                >
                                    <Radio value={1}>
                                        按创建时间最近的执行
                                    </Radio>
                                    <Radio value={2}>
                                        按创建时间最早的执行
                                    </Radio>
                                </RadioGroup>
                            </div>
                            </div>
                        ))}
                    </Modal>
                )}
            </div>
        );
    }
    // 查询
    handleQuery(thisPageNo) {
        const pageNo = isNaN(thisPageNo) ? 1 : thisPageNo;
        this.setState(
            {
                loading: true,
                queryDisabled: true,
                pageNo,
            },
            () => {
                setTimeout(() => {
                    this.setState({ queryDisabled: false });
                }, 500);
            }
        );

        const {
            queryEventWay,
            promotionDateRange,
            isActive,
            eventName,
            createScenes,
            eventCode,
            promotionCategory,
            promotionTags,
            promotionBrands,
            promotionShop,
        } = this.state;
        const opt = {};
        if (queryEventWay !== "" && queryEventWay !== undefined) {
            opt.eventWay = queryEventWay;
        }

        if (promotionDateRange !== "" && promotionDateRange.length !== 0) {
            opt.eventStartDate = promotionDateRange[0].format("YYYYMMDD");
            opt.eventEndDate = promotionDateRange[1].format("YYYYMMDD");
        }

        if (eventName !== "" && eventName !== undefined) {
            opt.eventName = eventName;
        }
        if (createScenes !== "" && createScenes !== undefined) {
            opt.createScenes = createScenes;
        }
        if (eventCode !== "" && eventCode !== undefined) {
            opt.eventCode = eventCode;
        }
        if (promotionCategory !== "" && promotionCategory !== undefined) {
            opt.categoryName = promotionCategory;
        }
        if (promotionTags !== "" && promotionTags != "0") {
            opt.tag = promotionTags;
        }
        if (promotionBrands !== "" && promotionBrands !== undefined) {
            opt.brandID = promotionBrands;
        }
        if (promotionShop !== "" && promotionShop !== undefined) {
            opt.shopID = promotionShop;
        }

        if (isActive !== "") {
            opt.isActive =
                isActive == "-1" ? "-1" : isActive == "1" ? "1" : "0";
        }

        this.props.query({
            data: {
                groupID: this.props.user.accountInfo.groupID,
                pageSize: this.state.pageSizes,
                pageNo,
                ...opt,
            },
            fail: (msg) => {
                message.error(msg);
            },
        });
    }

    showNothing(data) {
        if (data === undefined) {
            setTimeout(() => {
                this.setState({
                    loading: false,
                });
                message.error(
                    `${this.props.intl.formatMessage(STRING_SPE.dk46ld30bj797)}`
                );
            });
        }
    }

    renderPlanBtn = () => {
        return (
            <Popover
                content={this.getSearchContent()}
                trigger="click"
                placement="bottom"
                title={null}
            >
                <Button type="ghost" icon="search" style={{ marginRight: 10 }}>
                    查询方案
                </Button>
            </Popover>
        );
    };

    renderHeader() {
        const { tabKeys, stylesShow } = this.state;
        const headerClasses = `layoutsToolLeft ${styles.headerWithBgColor} ${styles.topHeaderBox}`;
        return (
            <div
                className="layoutsTool"
                style={{ height: "64px", position: "relative" }}
            >
                <div className={headerClasses}>
                    <span className={styles.customHeader}>活动管理</span>
                    <ExpireDateNotice
                        productCode="HLL_CRM_Marketingbox"
                        marginLeft="-430"
                        marginTop="8"
                    />
                    {tabKeys === "saleSpecialPage" && (
                        <div>
                            <span className={styles.exportBtn}>
                                {stylesShow === "list" ? (
                                    <Button
                                        type="ghost"
                                        onClick={() =>
                                            this.stylesChange("card")
                                        }
                                    >
                                        <span className={styles.cardImg}>
                                            <img src={Card} />
                                            卡片展示
                                        </span>
                                    </Button>
                                ) : (
                                    <Button
                                        type="ghost"
                                        onClick={() =>
                                            this.stylesChange("list")
                                        }
                                    >
                                        <Icon type="bars" />
                                        列表展示
                                    </Button>
                                )}
                            </span>
                            <span className={styles.exportBtn}>
                                <Button
                                    type="ghost"
                                    onClick={() =>
                                        this.setState({ exportVisible: true })
                                    }
                                    style={{ marginRight: 10 }}
                                >
                                    <Icon type="upload" />
                                    导出历史
                                </Button>
                            </span>
                            <span>
                                <Button
                                    type="ghost"
                                    style={{ marginRight: 10 }}
                                    onClick={this.queryActiveRule}
                                >
                                    活动规则
                                </Button>
                            </span>
                            {this.renderPlanBtn()}
                        </div>
                    )}
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

    onTreeSelect = (value, treeData) => {
        const shopsInfo = [];
        treeData.forEach(td => {
            if (td.children) {
                td.children.map(tdc => {
                    shopsInfo.push(tdc);
                });
            }
        });
        if (value != undefined) {
            if (value.match(/[-]/g).length != 2) {
                return null;
            }
            const selectedShopID = shopsInfo.find(si => {
                return si.value === value;
            }).shopID;

            this.setState({
                selectedShop: value,
                promotionShop: selectedShopID
            });
        } else {
            this.setState({
                selectedShop: null,
                promotionShop: value
            });
        }
    }

    renderShopsInTreeSelectMode() {
        const treeData = Immutable.List.isList(this.props.promotionScopeInfo.getIn(["refs", "data", "constructedData"])) ? this.props.promotionScopeInfo.getIn(["refs", "data", "constructedData"]).toJS() : this.props.promotionScopeInfo.getIn(["refs", "data", "constructedData"]);
        const tProps =
            this.state.selectedShop != null
                ? {
                      treeData,
                      value: this.state.selectedShop,
                      onChange: value => this.onTreeSelect(value, treeData),
                      placeholder: '请选择店铺',
                      allowClear: true
                  }
                : {
                      treeData,
                      value: undefined,
                      onChange: value => this.onTreeSelect(value, treeData),
                      placeholder: '请选择店铺',
                      allowClear: true
                  };
        return <TreeSelect showSearch {...tProps} style={{ width: 150 }} dropdownStyle={{ minWidth: 150 }} dropdownMatchSelectWidth={false} treeNodeFilterProp="label" />;
    }

    renderAdvancedFilter = () => {
        let categories = [],
            tags = [],
            brands = [];
        const $categories = this.props.promotionBasicInfo.getIn(["$categoryList", "data"]);
        if (Immutable.List.isList($categories)) {
            categories = $categories.toJS();
        }
        const $tags = this.props.promotionBasicInfo.getIn(["$tagList", "data"]);
        if (Immutable.List.isList($tags)) {
            tags = $tags.toJS();
        }
        const $brands = this.props.promotionScopeInfo.getIn(["refs", "data", "brands"]);
        if (Immutable.List.isList($brands)) {
            brands = $brands.toJS();
        }
        if (this.state.expand) {
            return (
                <div className="layoutsSeniorQuery">
                    <ul>
                        <li><h5>适用店铺</h5></li>
                        <li>{this.renderShopsInTreeSelectMode()}</li>
                        <li><h5>统计类别</h5></li>
                        <li>
                            <Select
                                placeholder=""
                                onChange={value => {
                                    this.setState({
                                        promotionCategory: value
                                    });
                                }}
                                allowClear={true}
                                style={{ width: 120 }}
                            >
                                {categories.map((category, index) => {
                                    return (
                                        <Option key={`${index}`} value={`${category.name}`}>
                                            {category.name}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </li>
                        <li><h5>标签</h5></li>
                        <li>
                            <Select
                                style={{ width: 120 }}
                                allowClear={true}
                                placeholder=""
                                onChange={tags => {
                                    this.setState({
                                        promotionTags: tags || ""
                                    });
                                }}
                            >
                                {tags.map((tag, index) => {
                                    return (
                                        <Option key={`${index}`} value={`${tag.name}`}>
                                            {tag.name}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </li>
                        <li> <h5>品牌</h5></li>
                        <li>
                            <Select
                                style={{ width: 100 }}
                                allowClear={true}
                                placeholder=""
                                onChange={brands => {
                                    this.setState({
                                        promotionBrands: brands
                                    });
                                }}
                            >
                                {brands.map((brand, index) => {
                                    return (
                                        <Option key={`${index}`} value={`${brand.brandID}`}>
                                            {brand.brandName}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </li>
                    </ul>
                </div>
            );
        }
        return null;
    }

    /**
     * @description toggle the advanced qualification selection.
     * */
    toggleExpandState = () => {
        const expand = this.state.expand;
        let opt = {
            expand: !expand
        };
        if (!opt.expand) {
            opt = {
                ...opt,
                selectedShop: undefined,
                promotionCategory: undefined,
                promotionTags: undefined,
                promotionBrands: undefined,
                promotionShop: undefined,
            };
        }
        this.setState(opt);
    }

    renderFilterBar() {
        const opts = [];
        let groupID = this.props.user.accountInfo.groupID;
        // 消费送礼白名单
        if (!consumeGivingWhiteList.includes(groupID)) {
            this.cfg.eventWay = this.cfg.eventWay.filter(item => item.value != '87');
        }
        this.cfg.eventWay.forEach((item, index) => {
            opts.push(
                <Option value={`${item.value}`} key={`${index}`}>
                    {item.label}
                </Option>
            );
        });
        const { intl } = this.props;

        return (
            <div>
                <div className="layoutsSearch">
                    <ul>
                        <li>
                            <h5>
                                {this.props.intl.formatMessage(
                                    STRING_SPE.db60c8ac0a379138
                                )}
                            </h5>
                        </li>
                        <li>
                            <RangePicker
                                style={{ width: 200 }}
                                onChange={this.onDateQualificationChange}
                            />
                        </li>

                        <li>
                            <h5>
                                {this.props.intl.formatMessage(
                                    STRING_SPE.d4h177f79da1218
                                )}
                            </h5>
                        </li>
                        <li>
                            <Select
                                style={{ width: 130 }}
                                showSearch
                                notFoundContent={`${this.props.intl.formatMessage(
                                    STRING_SPE.d2c8a4hdjl248
                                )}`}
                                filterOption={(input, option) =>
                                    option.props.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                                placeholder={this.props.intl.formatMessage(
                                    STRING_SPE.d1kgf622e5a10108
                                )}
                                defaultValue={intl.formatMessage(
                                    STRING_GIFT.all
                                )}
                                onChange={(value) => {
                                    this.setState({
                                        queryEventWay:
                                            value === "ALL" ? null : value,
                                    });
                                }}
                            >
                                {opts}
                            </Select>
                        </li>

                        <li>
                            <h5>
                                {this.props.intl.formatMessage(
                                    STRING_SPE.db60c8ac0a3711176
                                )}
                            </h5>
                        </li>
                        <li>
                            <Select
                                style={{ width: 80 }}
                                defaultValue="1"
                                value={this.state.isActive}
                                placeholder={this.props.intl.formatMessage(
                                    STRING_SPE.dd5aa016c5d12116
                                )}
                                onChange={(value) => {
                                    this.setState({
                                        isActive: value,
                                    });
                                }}
                            >
                                <Option value={""}>
                                    {this.props.intl.formatMessage(
                                        STRING_SPE.dk45j2cah113227
                                    )}
                                </Option>
                                <Option value={"1"}>
                                    {this.props.intl.formatMessage(
                                        STRING_SPE.db60c8ac0a371314
                                    )}
                                </Option>
                                <Option value={"0"}>
                                    {this.props.intl.formatMessage(
                                        STRING_SPE.d16hh1kkf9914292
                                    )}
                                </Option>
                                <Option value={"-1"}>
                                    {this.props.intl.formatMessage(
                                        STRING_SPE.db60c8ac0a3715210
                                    )}
                                </Option>
                            </Select>
                        </li>

                        <li>
                            <h5>
                                {this.props.intl.formatMessage(
                                    STRING_SPE.d4546grade4128
                                )}
                            </h5>
                        </li>
                        <li>
                            <Input
                                placeholder={this.props.intl.formatMessage(
                                    STRING_SPE.d7ekp859lc7222
                                )}
                                onChange={(e) => {
                                    this.setState({
                                        eventName: e.target.value,
                                    });
                                }}
                            />
                        </li>
                        <li>
                            <h5>来源渠道</h5>
                        </li>
                        <li>
                            <Select
                                style={{ width: 80 }}
                                defaultValue=""
                                value={this.state.createScenes || ""}
                                onChange={(value) => {
                                    this.setState({
                                        createScenes: value,
                                    });
                                }}
                            >
                                <Option value={""}>全部</Option>
                                <Option value={"0"}>自建</Option>
                                <Option value={"1"}>权益卡</Option>
                            </Select>
                        </li>
                        <li>
                            <h5>活动编码</h5>
                        </li>
                        <li>
                            <Input
                                placeholder="活动编码"
                                maxLength={20}
                                value={this.state.eventCode}
                                onChange={(e) => {
                                    this.setState({
                                        eventCode: e.target.value,
                                    });
                                }}
                            />
                        </li>
                        <li>
                            <Authority
                                rightCode={SPECIAL_PROMOTION_QUERY}
                                entryId={SPECIAL_PROMOTION_MANAGE_PAGE}
                            >
                                <Button
                                    type="primary"
                                    onClick={this.handleQuery}
                                    disabled={this.state.queryDisabled}
                                >
                                    <Icon type="search" />
                                    {COMMON_LABEL.query}
                                </Button>
                            </Authority>
                        </li>
                        {/* <li>
                            <a onClick={this.toggleExpandState}>
                                高级查询{this.state.expand ? <Icon type="caret-up" /> : <Icon type="caret-down" />}
                            </a>
                        </li> */}
                    </ul>
                </div>
                {this.renderAdvancedFilter()}
            </div>
        );
    }
    //
    onChangePage = (page, pageSize) => {
        this.setState({
            pageNo: page,
        });
        const opt = {
            pageSize,
            pageNo: page,
        };
        const {
            queryEventWay,
            promotionDateRange,
            isActive,
            eventName,
            createScenes,
        } = this.state;
        if (queryEventWay !== "" && queryEventWay !== undefined) {
            opt.eventWay = queryEventWay;
        }

        if (promotionDateRange !== "" && promotionDateRange.length !== 0) {
            opt.eventStartDate = promotionDateRange[0].format("YYYYMMDD");
            opt.eventEndDate = promotionDateRange[1].format("YYYYMMDD");
        }

        if (eventName !== "" && eventName !== undefined) {
            opt.eventName = eventName;
        }

        if (createScenes !== "" && createScenes !== undefined) {
            opt.createScenes = createScenes;
        }

        if (isActive !== "") {
            opt.isActive =
                isActive == "-1" ? "-1" : isActive == "1" ? "1" : "0";
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
    };
    // 切换每页显示条数
    onShowSizeChange = (current, pageSize) => {
        this.setState(
            {
                pageSizes: pageSize,
            },
            () => {
                this.handleQuery();
            }
        );
    };

    /**
     * 列表排序
     * @param record
     * @param direction
     */
    changeSortOrder(record, direction) {
        const params = { itemID: record.itemID, rankingType: direction };
        axiosData(
            "/specialPromotion/updateEventRanking.ajax",
            params,
            { needThrow: true },
            { path: undefined },
            "HTTP_SERVICE_URL_PROMOTION_NEW"
        )
            .then(() => {
                if (
                    this.tableRef &&
                    this.tableRef.props &&
                    this.tableRef.props.pagination &&
                    this.tableRef.props.pagination.onChange
                ) {
                    this.tableRef.props.pagination.onChange(
                        this.tableRef.props.pagination.current,
                        this.tableRef.props.pagination.pageSize
                    );
                }
            })
            .catch((err) => {
                message.warning(
                    err ||
                    `${this.props.intl.formatMessage(
                        STRING_SPE.dk46ld30bj16282
                    )}`
                );
            });
    }

    renderPayHaveGift(text, index, record) {
        return (
            <div>
                <Authority
                    rightCode={SPECIAL_LOOK_PROMOTION_QUERY}
                    entryId={SPECIAL_PROMOTION_MANAGE_PAGE}
                >
                    <a
                        href="#"
                        onClick={() => {
                            if (Number(record.eventWay) === 70) {
                                message.warning(
                                    `${this.props.intl.formatMessage(
                                        STRING_SPE.du3bnfobe30180
                                    )}`
                                );
                                return;
                            }
                            if (record.eventWay === 78) {
                                this.onV3Click(record.itemID, true);
                                return;
                            }
                            if (record.eventWay === 80) {
                                this.handleShowDetail({
                                    record,
                                    isView: true,
                                });
                                return;
                            }
                            this.props.toggleIsUpdate(false);
                            this.handleUpdateOpe(text, record, index);
                        }}
                    >
                        {COMMON_LABEL.view}
                    </a>
                </Authority>
                <Tooltip
                    placement="bottomLeft"
                    title={this.renderWXTipTitle(text, record, index)}
                    overlayClassName={styles.Sale__Activite__Tip}
                >
                    <a href="#">更多</a>
                </Tooltip>
            </div>
        );
    }

    renderWXTipTitle = (text, record, index) => {
        return (
            <div
                className={[
                    styles.Sale__Activite__moveMore,
                    styles.moveMoreShow,
                ].join(" ")}
            >
                <a
                    href="#"
                    className={
                        isBrandOfHuaTianGroupList(
                            this.props.user.accountInfo.groupID
                        ) && !isMine(record)
                            ? styles.textDisabled
                            : null
                    }
                    onClick={() => {
                        if (
                            isBrandOfHuaTianGroupList(
                                this.props.user.accountInfo.groupID
                            ) &&
                            !isMine(record)
                        ) {
                            return;
                        }
                        if (Number(record.eventWay) === 70) {
                            message.warning(
                                `${this.props.intl.formatMessage(
                                    STRING_SPE.du3bnfobe30180
                                )}`
                            );
                            return;
                        }
                        this.checkDetailInfo(text, record, index);
                    }}
                >
                    {/* 活动跟踪 */}
                    {this.props.intl.formatMessage(STRING_SPE.d5g3d7ahfq35134)}
                </a>
                {record.eventWay === 80 ? (
                    <a
                        href="#"
                        className={
                            record.isActive == "-1" ||
                                isBrandOfHuaTianGroupList(
                                    this.props.user.accountInfo.groupID
                                )
                                ? styles.textDisabled
                                : null
                        }
                        onClick={() => {
                            if (
                                isBrandOfHuaTianGroupList(
                                    this.props.user.accountInfo.groupID
                                )
                            ) {
                                return;
                            }
                            record.isActive == "-1"
                                ? null
                                : this.handelStopEvent(
                                    text,
                                    record,
                                    index,
                                    "-1",
                                    `${this.props.intl.formatMessage(
                                        STRING_SPE.d17012f5c16c32211
                                    )}`
                                );
                        }}
                    >
                        {this.props.intl.formatMessage(
                            STRING_SPE.du3bnfobe3346
                        )}
                    </a>
                ) : null}
            </div>
        );
    };

    renderTipTitle = (text, record, index) => {
        return (
            <div
                className={[
                    styles.Sale__Activite__moveMore,
                    styles.moveMoreShow,
                ].join(" ")}
            >
                {/* 第一版只做群发礼品的复制功能*/}
                {/* 摇奖活动增加复制,并且活动不是禁用状态  */}
                {
                    (record.eventWay === 53 || record.eventWay === 20) && (
                        // <Authority rightCode={SPECIAL_PROMOTION_UPDATE}>
                        <a
                            href="#"
                            // disabled={
                            //     record.eventWay == '64' ? null :
                            //         record.isActive != '0' || statusState || (isGroupOfHuaTianGroupList(this.props.user.accountInfo.groupID) && !isMine(record))
                            //             || record.eventWay === 80 || (moment(record.eventEndDate, 'YYYYMMDD').format('YYYYMMDD') < moment().format('YYYYMMDD'))
                            //             ? true
                            //             : false
                            // }
                            onClick={(e) => {
                                if (record.eventWay == "64") {
                                    //对评价送礼活动做专门处理，该活动在活动启用时候也能操作选择店铺
                                    if (record.isActive != "0") {
                                        this.props.toggleIsUpdate(false);
                                        this.handleUpdateOpe(
                                            text,
                                            record,
                                            index
                                        );
                                    } else {
                                        this.props.toggleIsUpdate(true);
                                        this.handleUpdateOpe(
                                            text,
                                            record,
                                            index
                                        );
                                    }
                                } else {
                                    // if ((isGroupOfHuaTianGroupList(this.props.user.accountInfo.groupID) && !isMine(record))) {
                                    //     e.preventDefault()
                                    // } else {
                                    if (Number(record.eventWay) === 70) {
                                        message.warning(`该活动已下线`);
                                        return;
                                    }
                                    if (
                                        record.eventWay === 78 ||
                                        record.eventWay === 79 ||
                                        record.eventWay === 83
                                    ) {
                                        this.onV3Click(
                                            record.itemID,
                                            false,
                                            record.eventWay
                                        );
                                        return;
                                    }
                                    if (
                                        record.eventWay === 66 ||
                                        record.eventWay === 81 ||
                                        record.eventWay === 82
                                    ) {
                                        this.handleShowDetail({
                                            record,
                                            isView: false,
                                            isEdit: true,
                                        });
                                        return;
                                    }
                                    this.props.toggleIsUpdate(true);
                                    this.setState({
                                        isCopy: true,
                                    });
                                    this.handleUpdateOpe(text, record, index);
                                    // }
                                }
                            }}
                        >
                            复制
                        </a>
                    )
                    // </Authority>
                }
                {isDecorationAvailable(record) && (
                    <a
                        href="#"
                        onClick={() => {
                            this.handleDecorationStart(record);
                        }}
                    >
                        装修
                        {/* {this.props.intl.formatMessage(STRING_SPE.dk46ld30bk34245)} */}
                    </a>
                )}
                <a
                    href="#"
                    className={
                        isBrandOfHuaTianGroupList(
                            this.props.user.accountInfo.groupID
                        ) && !isMine(record)
                            ? styles.textDisabled
                            : null
                    }
                    onClick={() => {
                        if (
                            isBrandOfHuaTianGroupList(
                                this.props.user.accountInfo.groupID
                            ) &&
                            !isMine(record)
                        ) {
                            return;
                        }
                        if (Number(record.eventWay) === 70) {
                            message.warning(`该活动已下线`);
                            return;
                        }
                        this.checkDetailInfo(text, record, index);
                    }}
                    disabled={record.eventWay == 85}
                >
                    活动跟踪
                </a>
                {isCanCopyUrl(record) && (
                    <a
                        href="#"
                        onClick={() => {
                            this.handleOpenModal(record);
                        }}
                    >
                        下载链接/二维码
                    </a>
                )}
            </div>
        );
    };

    renderTables() {
        const SmsSendStatus = [
            {
                value: "0",
                label: `${this.props.intl.formatMessage(
                    STRING_SPE.de8g7jed1j17152
                )}`,
            },
            {
                value: "1",
                label: `${this.props.intl.formatMessage(
                    STRING_SPE.d16hh1kkf9a1879
                )}`,
            },
            {
                value: "2",
                label: `${this.props.intl.formatMessage(
                    STRING_SPE.dojy6qlmw1990
                )}`,
            },
            {
                value: "3",
                label: `${this.props.intl.formatMessage(
                    STRING_SPE.d2c8g6ep522337
                )}`,
            },
            {
                value: "4",
                label: `${this.props.intl.formatMessage(
                    STRING_SPE.d16hh1kkf9a24193
                )}`,
            },
            {
                value: "5",
                label: `${this.props.intl.formatMessage(
                    STRING_SPE.du3bnfobe2576
                )}`,
            },
            {
                value: "8",
                label: `${this.props.intl.formatMessage(
                    STRING_SPE.dd5aa016c5e21260
                )}`,
            },
            {
                value: "9",
                label: `${this.props.intl.formatMessage(
                    STRING_SPE.dojy6qlmw1990
                )}`,
            },
            {
                value: "20",
                label: `${this.props.intl.formatMessage(
                    STRING_SPE.dojy6qlmw1990
                )}`,
            },
            {
                value: "21",
                label: `${this.props.intl.formatMessage(
                    STRING_SPE.d454fcf3i422261
                )}`,
            },
            {
                value: "30",
                label: `${this.props.intl.formatMessage(
                    STRING_SPE.dd5aa016c5e21260
                )}`,
            },
            {
                value: "6",
                label: `${this.props.intl.formatMessage(
                    STRING_SPE.d454fcf3i422261
                )}`,
            },
        ];
        const SmsSettleStatus = [
            {
                value: "0",
                label: `${this.props.intl.formatMessage(
                    STRING_SPE.d2c8g6ep5226252
                )}`,
            },
            {
                value: "1",
                label: `${this.props.intl.formatMessage(
                    STRING_SPE.d5g3d7ahfq27163
                )}`,
            },
            {
                value: "2",
                label: `${this.props.intl.formatMessage(
                    STRING_SPE.d4h1ac506h828194
                )}`,
            },
            {
                value: "3",
                label: `${this.props.intl.formatMessage(
                    STRING_SPE.da905h2m122949
                )}`,
            },
        ];

        const columns = [
            {
                title: COMMON_LABEL.serialNumber,
                dataIndex: "index",
                className: "TableTxtCenter",
                width: 60,
                fixed: "left",
                key: "key",
                // ellipsis: true,
                render: (text, record, index) => {
                    return (
                        (this.state.pageNo - 1) * this.state.pageSizes + text
                    );
                },
            },

            {
                title: COMMON_LABEL.actions,
                key: "operation",
                width: 180,
                className: "TableTxtCenter",
                fixed: "left",
                // ellipsis: true,
                render: (text, record, index) => {
                    // status 0-初始化   1-等待执行  2-执行中  3-执行完毕  4-执行失败  5-审核中  6-中断
                    if (record.eventWay === 80) {
                        return this.renderPayHaveGift(text, index, record);
                    }
                    if (record.createScenesName === "权益卡") {
                        return (
                            <span>
                                <Authority
                                    rightCode={SPECIAL_LOOK_PROMOTION_QUERY}
                                    entryId={SPECIAL_PROMOTION_MANAGE_PAGE}
                                >
                                    <a
                                        href="#"
                                        onClick={() => {
                                            if (
                                                Number(record.eventWay) === 70
                                            ) {
                                                message.warning(
                                                    `${this.props.intl.formatMessage(
                                                        STRING_SPE.du3bnfobe30180
                                                    )}`
                                                );
                                                return;
                                            }
                                            if (
                                                record.eventWay === 78 ||
                                                record.eventWay === 79 ||
                                                record.eventWay === 83 ||
                                                record.eventWay === 85
                                            ) {
                                                this.onV3Click(
                                                    record.itemID,
                                                    true,
                                                    record.eventWay
                                                );
                                                return;
                                            }
                                            if (
                                                record.eventWay === 80 ||
                                                record.eventWay === 66 ||
                                                record.eventWay === 81 ||
                                                record.eventWay === 82
                                            ) {
                                                this.handleShowDetail({
                                                    record,
                                                    isView: true,
                                                    isEdit: false,
                                                });
                                                return;
                                            }
                                            this.props.toggleIsUpdate(false);
                                            this.handleUpdateOpe(
                                                text,
                                                record,
                                                index
                                            );
                                        }}
                                    >
                                        {COMMON_LABEL.view}
                                    </a>
                                </Authority>
                                <a
                                    href="#"
                                    className={
                                        isBrandOfHuaTianGroupList(
                                            this.props.user.accountInfo.groupID
                                        ) && !isMine(record)
                                            ? styles.textDisabled
                                            : null
                                    }
                                    onClick={() => {
                                        if (
                                            isBrandOfHuaTianGroupList(
                                                this.props.user.accountInfo
                                                    .groupID
                                            ) &&
                                            !isMine(record)
                                        ) {
                                            return;
                                        }
                                        if (Number(record.eventWay) === 70) {
                                            message.warning(`该活动已下线`);
                                            return;
                                        }
                                        this.checkDetailInfo(
                                            text,
                                            record,
                                            index
                                        );
                                    }}
                                    disabled={record.eventWay == 85}
                                >
                                    活动跟踪
                                </a>
                            </span>
                        );
                    }
                    return (
                        <span>
                            <Authority
                                rightCode={SPECIAL_PROMOTION_UPDATE}
                                entryId={SPECIAL_PROMOTION_MANAGE_PAGE}
                            >
                                <a
                                    style={{display: record.eventWay === 95 ? 'none' : 'inline'}}
                                    href="#"
                                    disabled={
                                        record.eventWay == "64"
                                            ? null
                                            : isGroupOfHuaTianGroupList(
                                                this.props.user.accountInfo
                                                    .groupID
                                            ) &&
                                            (record.isActive != "0" ||
                                                !isMine(record))
                                    }
                                    onClick={(e) => {
                                        // if (record.eventWay == '64') {
                                        //     //对评价送礼活动做专门处理，该活动在活动启用时候也能操作选择店铺
                                        //     if (record.isActive != '0') {
                                        //         this.handleEditActive(record)(() => {
                                        //             this.props.toggleIsUpdate(false)
                                        //             this.handleUpdateOpe(text, record, index);
                                        //         })
                                        //     } else {
                                        //         this.handleEditActive(record)(() => {
                                        //             this.props.toggleIsUpdate(true)
                                        //             this.handleUpdateOpe(text, record, index);
                                        //         })
                                        //     }
                                        // } else {
                                        // if ((record.isActive != '0' && record.isActive != '-1') || statusState || (isGroupOfHuaTianGroupList(this.props.user.accountInfo.groupID) && (record.isActive != '0' || !isMine(record) )) || record.eventWay === 80) {
                                        //     e.preventDefault()
                                        // } else {
                                        if (Number(record.eventWay) === 70) {
                                            message.warning(
                                                `${this.props.intl.formatMessage(
                                                    STRING_SPE.du3bnfobe30180
                                                )}`
                                            );
                                            return;
                                        }
                                        if ([78, 79, 83, 85, 23, 95].includes(record.eventWay)) {
                                            this.handleEditActive(record)(() =>
                                                this.onV3Click(
                                                    record.itemID,
                                                    false,
                                                    record.eventWay,
                                                    record.isActive
                                                )
                                            );
                                            return;
                                        }
                                        if (
                                            record.eventWay === 66 ||
                                            record.eventWay === 81 ||
                                            record.eventWay === 82
                                        ) {
                                            this.handleEditActive(record)(
                                                () => {
                                                    this.handleShowDetail({
                                                        record,
                                                        isView: false,
                                                        isEdit: true,
                                                    });
                                                }
                                            );
                                            return;
                                        }
                                        if (record.eventWay === 87) {
                                            return this.handleNewEditActive(record, 'edit');
                                        }
                                        this.handleEditActive(record)(() => {
                                            this.props.toggleIsUpdate(true);
                                            this.handleUpdateOpe(
                                                text,
                                                record,
                                                index
                                            );
                                        });

                                        // }
                                        // }
                                    }}
                                >
                                    {COMMON_LABEL.edit}
                                </a>
                            </Authority>
                            <Authority
                                rightCode={SPECIAL_LOOK_PROMOTION_QUERY}
                                entryId={SPECIAL_PROMOTION_MANAGE_PAGE}
                            >
                                <a
                                    href="#"
                                    onClick={() => {
                                        console.log(record,'record0000000000000000000')
                                        if (Number(record.eventWay) === 70) {
                                            message.warning(
                                                `${this.props.intl.formatMessage(
                                                    STRING_SPE.du3bnfobe30180
                                                )}`
                                            );
                                            return;
                                        }
                                        if (
                                            [78, 79, 83, 85, 23, 95].includes(record.eventWay)
                                        ) {
                                            this.onV3Click(
                                                record.itemID,
                                                true,
                                                record.eventWay
                                            );
                                            return;
                                        }
                                        if (
                                            [80, 66, 81, 82].includes(record.eventWay)
                                        ) {
                                            this.handleShowDetail({
                                                record,
                                                isView: true,
                                                isEdit: false,
                                            });
                                            return;
                                        }
                                        if (record.eventWay === 87) {
                                            return this.handleNewEditActive(record, 'view');
                                        }
                                        this.props.toggleIsUpdate(false);
                                        this.handleUpdateOpe(
                                            text,
                                            record,
                                            index
                                        );
                                    }}
                                >
                                    {COMMON_LABEL.view}
                                </a>
                            </Authority>

                            <Authority
                                rightCode={SPECIAL_PROMOTION_DELETE}
                                entryId={SPECIAL_PROMOTION_MANAGE_PAGE}
                            >
                                <a
                                    href="#"
                                    disabled={isBrandOfHuaTianGroupList(
                                        this.props.user.accountInfo.groupID
                                    )}
                                    onClick={() => {
                                        if (
                                            isBrandOfHuaTianGroupList(
                                                this.props.user.accountInfo
                                                    .groupID
                                            )
                                        ) {
                                            return;
                                        }
                                        if (Number(record.eventWay) === 70) {
                                            message.warning(
                                                `${this.props.intl.formatMessage(
                                                    STRING_SPE.du3bnfobe30180
                                                )}`
                                            );
                                            return;
                                        }
                                        // record.isActive != '0' || record.userCount != 0 || statusState ? null :
                                        this.handleDelActive(record)(() =>
                                            this.checkDeleteInfo(
                                                text,
                                                record,
                                                index
                                            )
                                        );
                                    }}
                                >
                                    {COMMON_LABEL.delete}
                                </a>
                            </Authority>
                            {!(record.eventWay == "85" || record.eventWay == "87") && ( // 千人千面无需更多操作
                                <Tooltip
                                    placement="bottomLeft"
                                    title={this.renderTipTitle(
                                        text,
                                        record,
                                        index
                                    )}
                                    overlayClassName={
                                        styles.Sale__Activite__Tip
                                    }
                                >
                                    <a href="#">更多</a>
                                </Tooltip>
                            )}
                        </span>
                    );
                },
            },
            {
                title: "启用/禁用",
                key: "status",
                dataIndex: "status",
                width: 100,
                className: "TableTxtCenter",
                fixed: "left",
                // ellipsis: true,
                render: (text, record, index) => {
                    const defaultChecked =
                        record.isActive == "1" ? true : false;
                    // const statusState = (
                    //     (record.eventWay == '50' || record.eventWay == '53')
                    //     &&
                    //     (record.status == 2) // 执行中的状态不可更改
                    // );
                    // if ()
                    const BenefitDisabled =
                        record.createScenesName === "权益卡";
                    return (
                        <Switch
                            // size="small"
                            className={`${styles.switcherSale} ${record.eventWay == "80"
                                ? styles.switcherdisabled
                                : ""
                                }`}
                            checkedChildren={"启用"}
                            unCheckedChildren={"禁用"}
                            checked={defaultChecked}
                            onChange={(e) => {
                                // isBrandOfHuaTianGroupList 华天集团品牌下的集团
                                if (
                                    isBrandOfHuaTianGroupList(
                                        this.props.user.accountInfo.groupID
                                    ) ||
                                    record.eventWay === 80 ||
                                    BenefitDisabled
                                ) {
                                    // e.preventDefault();
                                    return;
                                }
                                if (Number(record.eventWay) === 70) {
                                    message.warning(
                                        `${this.props.intl.formatMessage(
                                            STRING_SPE.du3bnfobe30180
                                        )}`
                                    );
                                    return;
                                }
                                // record.isActive == '-1' || statusState ? null :
                                this.handleSattusActive(record)(() =>
                                    this.handleDisableClickEvent(
                                        record.operation,
                                        record,
                                        index,
                                        null,
                                        `${this.props.intl.formatMessage(
                                            STRING_SPE.db60c8ac0a3831197
                                        )}`
                                    )
                                );
                            }}
                            disabled={
                                isBrandOfHuaTianGroupList(
                                    this.props.user.accountInfo.groupID
                                ) || BenefitDisabled
                            }
                        />
                    );
                },
            },
            {
                title: `${this.props.intl.formatMessage(
                    STRING_SPE.d4h177f79da1218
                )}`,
                dataIndex: "eventWay",
                key: "eventWay",
                width: 130,
                fixed: "left",
                // ellipsis: true,
                render: (text, record) => {
                    return (
                        <span>
                            {record.eventWay == 70
                                ? `${this.props.intl.formatMessage(
                                    STRING_SPE.d5672b44908540146
                                )}`
                                : mapValueToLabel(
                                    this.cfg.eventWay,
                                    String(record.eventWay)
                                )}
                        </span>
                    );
                },
            },

            {
                title: `${this.props.intl.formatMessage(
                    STRING_SPE.d4546grade4128
                )}`,
                dataIndex: "eventName",
                key: "eventName",
                fixed: "left",
                width: 150,
                // ellipsis: true,
                render: (text) => <span title={text}>{text}</span>,
            },
            {
                title: "活动编码",
                dataIndex: "eventCode",
                key: "eventCode",
                fixed: "left",
                width: 180,
                // ellipsis: true,
                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
            {
                title: `${this.props.intl.formatMessage(
                    STRING_SPE.dd5aa016c5f42125
                )}`,
                className: "TableTxtCenter",
                dataIndex: "validDate",
                key: "",
                width: 180,
                render: (validDate, record, index) => {
                    console.log(validDate,'valiDate>>>>>>>>>>>>>>>>')
                    if (
                        validDate.start === "0" ||
                        validDate.end === "0" ||
                        validDate.start === "20000101" ||
                        validDate.end === "29991231"
                    ) {
                        return `${this.props.intl.formatMessage(
                            STRING_SPE.d31ei98dbgi21253
                        )}`;
                    }
                    let timeStr = null;
                    if(record.eventWay == 95){
                        timeStr = `${moment(validDate.start, "YYYY-MM-DD HH:mm").format(
                            "YYYY-MM-DD HH:mm"
                        )} / ${moment(validDate.end, "YYYY-MM-DD HH:mm").format(
                            "YYYY-MM-DD HH:mm"
                        )}`;
                    }else{
                        timeStr = `${moment(validDate.start, "YYYY-MM-DD").format(
                            "YYYY-MM-DD"
                        )} / ${moment(validDate.end, "YYYY-MM-DD").format(
                            "YYYY-MM-DD"
                        )}`;
                    }
                    
                    return <Tooltip title={timeStr}>{timeStr}</Tooltip>;
                },
            },
            {
                title: `${this.props.intl.formatMessage(
                    STRING_SPE.d2b1c68ddaa344161
                )}`,
                dataIndex: "operator",
                width: 150,
                key: "operator",
                render: (text, record) => {
                    if (!record.operator) {
                        return "--";
                    }
                    let result;
                    try {
                        const operator = JSON.parse(record.operator);
                        result = `${operator.userName} / ${operator.u_userName || operator.userName
                            }`;
                    } catch (e) {
                        return "--";
                    }
                    return result || "--";
                },
            },
            {
                title: `${this.props.intl.formatMessage(
                    STRING_SPE.de8g7jed1l4364
                )}`,
                className: "TableTxtCenter",
                dataIndex: "operateTime",
                key: "operateTime",
                // width: 300,
                render: (text, record, index) => {
                    if (
                        record.updateStamp === "" &&
                        record.createStamp === ""
                    ) {
                        return "--";
                    }
                    const t = `${moment(
                        new Date(parseInt(record.createStamp))
                    ).format("YYYY-MM-DD HH:mm:ss")} / ${moment(
                        new Date(parseInt(record.updateStamp))
                    ).format("YYYY-MM-DD HH:mm:ss")}`;
                    return <Tooltip title={t}>{t}</Tooltip>;
                },
            },
            {
                title: "来源渠道",
                className: "TableTxtCenter",
                dataIndex: "createScenesName",
                key: "createScenesName",
                width: 80,
                render: (text, record, index) => {
                    return text || "--";
                },
            },
        ];
        return (
            <div className={`layoutsContent ${styles.tableClass}`}>
                <Table
                    ref={this.setTableRef}
                    className={styles.sepcialActivesTable}
                    bordered={true}
                    columns={columns}
                    dataSource={this.state.dataSource}
                    loading={this.state.loading}
                    scroll={{ x: 1499, y: "calc(100vh - 360px)" }}
                    size="default"
                    pagination={{
                        pageSize: this.state.pageSizes,
                        pageSizeOptions: ["25", "50", "100", "200"],
                        current: this.state.pageNo,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        onShowSizeChange: this.onShowSizeChange,
                        total: this.state.total || 0,
                        showTotal: (total, range) =>
                            `${this.props.intl.formatMessage(
                                STRING_SPE.d2b1c6b31a93638
                            )}${range[0]}-${range[1]
                            } / ${this.props.intl.formatMessage(
                                STRING_SPE.dk46lj779a7119
                            )} ${total} ${this.props.intl.formatMessage(
                                STRING_SPE.d34ikgs6o6845
                            )}`,
                        onChange: (page, pageSize) => {
                            this.onChangePage(page, pageSize);
                        },
                    }}
                />
            </div>
        );
    }

    // 删除
    checkDeleteInfo(text, record) {
        this.props.deleteSelectedRecord({
            ...record,
            groupID: this.props.user.accountInfo.groupID,
            success: () => {
                message.success(
                    `${this.props.intl.formatMessage(
                        STRING_SPE.db60c8ac0a3950145
                    )}`
                );
            },
            fail: (msg) => {
                message.error(msg);
            },
        });
        // const delTitle = (<span>【{record.eventName}】</span>)
        // confirm({
        //     width: 433,
        //     title: <span style={{ color: '#434343' }}>您确定要删除{delTitle}吗 ？</span>,
        //     content: (
        //         <span>{this.props.intl.formatMessage(STRING_SPE.db60c90bb48b034)}~</span>
        //     ),
        //     footer: `${this.props.intl.formatMessage(STRING_SPE.db60c90bb48b034)}`,
        //     onOk: () => {

        //     },
        //     onCancel: () => { },
        // });
    }
    handleGiftsData = (response) => {
        const { eventWay, itemID, eventName, needCount = "" } = response.data;
        const user = this.props.user;
        let result = [];
        response.gifts &&
            response.gifts.forEach((item) => {
                result.push(item.needCount);
            });
        if (response.eventConditionInfos) {
            result = response.eventConditionInfos;
        }
        this.props.selectPromotionForDecoration({
            type: `${eventWay}`,
            id: itemID,
            title: eventName,
            needCount,
            giftArr: result,
            faceArr: result,
        });
        jumpPage({ menuID: PROMOTION_DECORATION });
    };
    successFn = (response) => {
        const _serverToRedux = false;
        const _promotionIdx = getSpecialPromotionIdx(
            `${this.state.editEventWay}`
        );
        const { isCopy } = this.state;
        if (_promotionIdx === undefined) {
            message.warning(
                `${this.props.intl.formatMessage(STRING_SPE.de8g7jed1l51134)}`
            );
            return;
        }
        if (response === undefined || response.data === undefined) {
            message.error(
                `${this.props.intl.formatMessage(STRING_SPE.d4h1ac506h952140)}`
            );
            return null;
        }
        this.props.saleCenterSetSpecialBasicInfo(
            specialPromotionBasicDataAdapter(response, _serverToRedux)
        );
        this.setState({
            modalTitle: `${this.props.intl.formatMessage(
                STRING_SPE.d2c8g6ep510150
            )}`,
            isNew: false,
            index: _promotionIdx,
        });
        if (isCopy) {
            this.setState({
                modalTitle: "复制活动信息",
            });
        }
    };

    failFn = () => {
        message.error(
            `${this.props.intl.formatMessage(STRING_SPE.dk46ld30bl535)}`
        );
    };

    handleDecorationStart = (record) => {
        const user = this.props.user;
        this.props.fetchSpecialDetail({
            data: {
                itemID: record ? record.itemID : this.state.currentItemID, // 点击重试时record为undefiend
                groupID: user.accountInfo.groupID,
            },
            success: this.handleGiftsData,
            fail: this.failFn,
        });
    };

    handleOpenModal = (record) => {
        this.querySortedChannelList();
        this.handleCopyUrl(record);
    };

    handleCopyUrl = (record, mpId) => {
        const { pushMessageMpID, channelContent, launchChannelID } = this.state;
        let mpID = mpId ? mpId : pushMessageMpID;
        let eventWayData, groupIdData, itemIdData;
        const testUrl = "https://dohko.m.hualala.com";
        const preUrl = "https://m.hualala.com";
        const actList = ["20", "30", "22"]; // 摇奖活动，积分兑换，报名活动
        if (record) {
            eventWayData = record.eventWay;
            groupIdData = this.props.user.accountInfo.groupID;
            itemIdData = record.itemID;
        } else {
            eventWayData = this.state.eventWay;
            groupIdData = this.state.groupID;
            itemIdData = this.state.qrItemID;
        }

        let url = testUrl;
        if (isFormalRelease()) {
            url = preUrl;
        }
        const urlMap = {
            20: !launchChannelID
                ? url +
                `/newm/eventCont?groupID=${groupIdData}&eventID=${itemIdData}&mpID=${mpID}`
                : url +
                `/newm/eventCont?groupID=${groupIdData}&eventID=${itemIdData}&mpID=${mpID}&launchChannel=${channelContent}&launchChannelID=${launchChannelID}`,
            22: !launchChannelID
                ? url +
                `/newm/eventCont?groupID=${groupIdData}&eventID=${itemIdData}&mpID=${mpID}`
                : url +
                `/newm/eventCont?groupID=${groupIdData}&eventID=${itemIdData}&mpID=${mpID}&launchChannel=${channelContent}&launchChannelID=${launchChannelID}`,
            30: !launchChannelID
                ? url +
                `/newm/eventCont?groupID=${groupIdData}&eventID=${itemIdData}&mpID=${mpID}`
                : url +
                `/newm/eventCont?groupID=${groupIdData}&eventID=${itemIdData}&mpID=${mpID}&launchChannel=${channelContent}&launchChannelID=${launchChannelID}`,
            21: !launchChannelID
                ? url +
                `/newm/eventFree?groupID=${groupIdData}&eventID=${itemIdData}&mpID=${mpID}`
                : url +
                `/newm/eventFree?groupID=${groupIdData}&eventID=${itemIdData}&mpID=${mpID}&launchChannel=${channelContent}&launchChannelID=${launchChannelID}`,
            65: !launchChannelID
                ? url +
                `/newm/shareFission?groupID=${groupIdData}&eventID=${itemIdData}&mpID=${mpID}`
                : url +
                `/newm/shareFission?groupID=${groupIdData}&eventID=${itemIdData}&mpID=${mpID}&launchChannel=${channelContent}&launchChannelID=${launchChannelID}`,
            68: !launchChannelID
                ? url +
                `/newm/recommendInvite??groupID=${groupIdData}&eventItemID=${itemIdData}&mpID=${mpID}`
                : url +
                `/newm/recommendInvite?groupID=${groupIdData}&eventItemID=${itemIdData}&mpID=${mpID}&launchChannel=${channelContent}&launchChannelID=${launchChannelID}`,
            // 83: url + `/newm/usePassword?groupID=${groupIdData}&eventID=${itemIdData}&mpID=${mpID}&launchChannel=${channelContent}`,
        };
        /*if(actList.includes(String(eventWay))) {
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
        }*/
        this.setState({
            urlContent: urlMap[eventWayData],
            eventWay: eventWayData,
            qrCodeImage: "", // 打开一次清空上一次的img
            qrItemID: itemIdData, // 当前活动itemID
            isShowCopyUrl: true,
            groupID: groupIdData,
        });
        // 获取小程序列表
        this.getAppList().then((r) => { });
    };

    handleToCopyUrl = () => {
        const { urlContent } = this.state;
        if (copy(urlContent)) {
            message.warn("复制成功");
        } else {
            message.warn("复制失败");
        }
    };

    handleToCopyRouter = () => {
        const { page, scene } = this.state;
        if (copy(`${page}?${scene}`)) {
            message.warn("复制成功");
        } else {
            message.warn("复制失败");
        }
    };

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
                currentItemID: _record.itemID
                    ? _record.itemID
                    : this.state.currentItemID,
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
                wrapClassName={"progressBarModal"}
                title={this.state.modalTitle}
                visible={this.state.updateModalVisible}
                footer={false}
                width={1000}
                height="569px"
                maskClosable={false}
                onCancel={this.handleDismissUpdateModal}
            >
                {this.state.updateModalVisible
                    ? this.renderContentOfThisModal()
                    : null}
            </Modal>
        );
    }

    renderContentOfThisModal() {
        const mySpecialActivities = this.props.mySpecialActivities
            .get("$specialDetailInfo")
            .toJS();
        const _state = this.state;
        if (
            mySpecialActivities.status === "start" ||
            mySpecialActivities.status === "pending"
        ) {
            return (
                <div className={styles.spinFather}>
                    <Spin size="large" />
                </div>
            );
        }
        if (
            mySpecialActivities.status === "timeout" ||
            mySpecialActivities.status === "fail"
        ) {
            return (
                <div className={styles.spinFather}>
                    {this.props.intl.formatMessage(STRING_SPE.da905h2m1354252)}{" "}
                    <a onClick={this.handleUpdateOpe}>{COMMON_LABEL.retry}</a>
                </div>
            );
        }
        if (mySpecialActivities.status === "success") {
            return (
                <ActivityMain
                    isCopy={_state.isCopy}
                    isNew={_state.isNew}
                    index={_state.index}
                    callbackthree={(arg) => {
                        if (arg == 3) {
                            this.handleDismissUpdateModal();
                        }
                    }}
                />
            );
        }
    }

    // Row Actions: 查看
    checkDetailInfo() {
        const _record = arguments[1];
        console.log(_record,'record*********************')
        const user = this.props.user;
        const { eventWay } = _record;
        console.log(eventWay,'eventWay0000000000')
        this.props.fetchSpecialPromotionDetail({
            data: {
                itemID:
                    _record && _record.itemID
                        ? _record.itemID
                        : this.state.currentItemID,
                groupID: user.accountInfo.groupID,
                actionFrom: "1",
            },
            eventWay,
            fail: this.failFn,
        });
        this.setState({
            visible: true,
            currentItemID:
                _record && _record.itemID
                    ? _record.itemID
                    : this.state.currentItemID,
        });
    }
    // 关闭详情页
    handleClose() {
        this.setState({
            visible: false,
        });
    }
    setMVisible = (ifVisible) => {
        this.setState({
            visible: ifVisible,
        });
    };
    // 活动详情页
    renderModals() {
        
        const mySpecialActivities = this.props.mySpecialActivities
            .get("$specialDetailInfo")
            .toJS();
            console.log(mySpecialActivities,'********************************')
        const checkDetailInfo = this.checkDetailInfo;
        let renderContentOfTheModal;
        if (
            mySpecialActivities.status === "start" ||
            mySpecialActivities.status === "pending"
        ) {
            renderContentOfTheModal = (
                <div className={styles.spinFather}>
                    <Spin size="large" />
                </div>
            );
        }
        if (
            mySpecialActivities.status === "timeout" ||
            mySpecialActivities.status === "fail"
        ) {
            renderContentOfTheModal = (
                <div className={styles.spinFather}>
                    {this.props.intl.formatMessage(STRING_SPE.da905h2m1354252)}
                    <a onClick={checkDetailInfo}>{COMMON_LABEL.retry}</a>
                </div>
            );
        }
        if (mySpecialActivities.status === "success") {
            renderContentOfTheModal = (
                <SpecialPromotionDetail
                    setVisible={this.setMVisible}
                    record={mySpecialActivities.data}
                />
            );
        }

        return (
            <Modal
                title={this.props.intl.formatMessage(
                    STRING_SPE.db60c8ac0a3955121
                )}
                maskClosable={false}
                visible={this.state.visible}
                footer={
                    <Button onClick={this.handleClose}>
                        {COMMON_LABEL.close}
                    </Button>
                }
                // closable={false}
                width="800px"
                onCancel={this.handleClose}
            >
                {renderContentOfTheModal}
            </Modal>
        );
    }
}

function mapValueToLabel(cfg, val) {
    return _.result(_.find(cfg, { value: val }), "label");
}
export default MySpecialActivities;
