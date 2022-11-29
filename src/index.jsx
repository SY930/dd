import registerPackage, { registerLocalPage } from "@hualala/platform-base";
import { mountEpics } from "@hualala/platform-base";
import rootEpic from "./redux/modules";
import sensors from "sa-sdk-javascript";
import * as entryCodes from "./constants/entryCodes";
import "config/AssociateConfig.js";
// 初始化Dva
import "./utils/dva/index";
import { getAccountInfo } from "./helpers/util";
const { registeEntryCode, registeLocale } = registerPackage("sale", process.env.JS_VERSION);
const DEFAULT_LANGUAGE = "zh-cn";
const LOCEL_LANGUAGE_MAP = new Map([
    ["zh-cn", import("./i18n/locales/zh-cn")],
    ["zh-tw", import("./i18n/locales/zh-tw")],
    ["en", import("./i18n/locales/en")]
]);
// 注册epic
mountEpics(rootEpic);

// 注册本地页面, 可以jumpPage(key) 到达, 详细信息参考platform-base工程代码
registerLocalPage([
    {
        key: entryCodes.WECHAT_MALL_CREATE,
        value: entryCodes.WECHAT_MALL_CREATE,
        label: "新建商城活动",
        parent: [entryCodes.WECHAT_MALL_LIST]
    },
    {
        key: entryCodes.PROMOTION_CALENDAR_SHOP,
        value: entryCodes.PROMOTION_CALENDAR_SHOP,
        label: "营销日历",
        parent: [entryCodes.SALE_CENTER_PAGE_SHOP]
    },
    {
        key: entryCodes.PROMOTION_CALENDAR_GROUP,
        value: entryCodes.PROMOTION_CALENDAR_GROUP,
        label: "营销日历",
        parent: [entryCodes.SALE_CENTER_PAGE, entryCodes.SPECIAL_PAGE, entryCodes.GIFT_PAGE]
    },
    {
        key: entryCodes.PROMOTION_WECHAT_COUPON_CREATE,
        value: entryCodes.PROMOTION_WECHAT_COUPON_CREATE,
        label: "微信支付代金券",
        parent: [entryCodes.PROMOTION_WECHAT_COUPON_LIST]
    },
    // {
    //     key: entryCodes.PROMOTION_ZHIFUBAO_COUPON_CREATE,
    //     value: entryCodes.PROMOTION_ZHIFUBAO_COUPON_CREATE,
    //     label: '支付宝代金券',
    //     parent: [entryCodes.PROMOTION_ZHIFUBAO_COUPON_LIST],
    // },
    {
        key: entryCodes.PROMOTION_DECORATION,
        value: entryCodes.PROMOTION_DECORATION,
        label: "活动装修",
        parent: [entryCodes.SPECIAL_PAGE]
    },
    {
        key: entryCodes.SALE_CENTER_PAYHAVEGIFT,
        value: entryCodes.SALE_CENTER_PAYHAVEGIFT,
        label: "创建活动",
        parent: [entryCodes.NEW_SALE_BOX]
    },
    {
        key: entryCodes.SALE_ACTIVE_NEW_PAGE,
        value: entryCodes.SALE_ACTIVE_NEW_PAGE,
        label: "创建营销活动",
        parent: [entryCodes.NEW_SALE_BOX]
    },
    {
        key: entryCodes.THIRD_VOUCHER_MANAGEMENT,
        value: entryCodes.THIRD_VOUCHER_MANAGEMENT,
        label: "第三方券管理",
        parent: [entryCodes.THIRD_VOUCHER_MANAGEMENT]
    },
    {
        key: entryCodes.ACTIVITY_LAUNCH,
        value: entryCodes.ACTIVITY_LAUNCH,
        label: "支付宝商家券投放",
        parent: [entryCodes.ACTIVITY_LAUNCH]
    },
    {
        key: entryCodes.GIFT_DETAILS,
        value: entryCodes.GIFT_DETAILS,
        label: "礼品详情",
        parent: [entryCodes.GIFT_PAGE]
    },
    {
        key: entryCodes.CREATE_SHARE_RULES_NEW,
        value: entryCodes.CREATE_SHARE_RULES_NEW,
        label: '创建共享规则',
        parent: [entryCodes.SHARE_RULES_GROUP_NEW],
    },
    {
        key: entryCodes.SALE_AUTOMATED_SALE_DETAIL,
        value: entryCodes.SALE_AUTOMATED_SALE_DETAIL,
        label: '活动管理',
        parent: [entryCodes.SALE_AUTOMATED_SALE_DETAIL],
    },
    {
        key: entryCodes.SALE_AUTOMATED_STAT_DETAIL,
        value: entryCodes.SALE_AUTOMATED_STAT_DETAIL,
        label: '自动化营销统计详情',
        parent: [entryCodes.SALE_AUTOMATED_STAT_DETAIL],
    },
    {
        key: entryCodes.CONSUME_GIFT_GIVING,
        value: entryCodes.CONSUME_GIFT_GIVING,
        label: '创建营销活动',
        parent: [entryCodes.NEW_SALE_BOX],
    },
    {
        key: entryCodes.SALE_AUTOMATED_ACTIVITY_RECORD_LIST,
        value: entryCodes.SALE_AUTOMATED_ACTIVITY_RECORD_LIST,
        label: '自动化营销活动记录',
        parent: [entryCodes.SALE_AUTOMATED_ACTIVITY_RECORD_LIST],
    },
    {
        key: entryCodes.SALE_AUTOMATED_ACTIVITY_PROCESS,
        value: entryCodes.SALE_AUTOMATED_ACTIVITY_PROCESS,
        label: '自动化营销活动过程',
        parent: [entryCodes.SALE_AUTOMATED_ACTIVITY_PROCESS],
    },
]);
// 注册语言包
const registeLangPack = async () => {
    let lang = DEFAULT_LANGUAGE;
    try {
        const langTypeInCookie = /language_type=([^;]*)/.exec(document.cookie)[1];
        langTypeInCookie && (lang = langTypeInCookie);
    } catch (e) {
        // cookie 未设置，default zh-cn
    }
    console.log("营销中心语言包开始加载:", lang);
    await LOCEL_LANGUAGE_MAP.get(lang).then(data => {
        registeLocale(data.default);
    });
    console.log("营销中心语言包加载完成:", lang);
    //神策埋点内容
    setTimeout(() => {
        console.log(getAccountInfo(), "getAccountInfo12");
        sensors.init({
            server_url: "http://data-sc.hualala.com/sa?project=default",
            show_log: false,
            is_track_single_page: false, // 单页面配置，默认开启，若页面中有锚点设计，需要将该配置删除，否则触发锚点会多触发 $pageview 事件
            use_client_time: true,
            send_type: "beacon",
            heatmap: {
                //是否开启点击图，default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭。
                clickmap: "not_collect",
                //是否开启触达图，not_collect 表示关闭，不会自动采集 $WebStay 事件，可以设置 'default' 表示开启。
                scroll_notice_map: "default",
            },
        });
        const {loginName = "default",userMobile = "default",groupID = "",accountID = ""} = getAccountInfo() || {};
        //设置用户属性
        sensors.setProfile({
            account: loginName,
            phone_num: userMobile,
        });
        //设置公共属性
        sensors.registerPage({
            platform_type: "JavaScript",
            business_id: "online_pos",
            app_id: "online_pos",
            org_id: "default",
            group_id: groupID,
            brand_id: "default",
            shop_id: "default"
        });
        sensors.login(accountID);
        sensors.quick("autoTrack"); //用于采集 $pageview 事件。
    }, 8000);
};

registeLangPack();

export default registeEntryCode(entryCodes, completed => import("./containers").then(completed));
