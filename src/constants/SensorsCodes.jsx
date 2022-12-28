//埋点相关映射
const SensorsCodes = {
    //点击营销活动卡片映射
    sensorsEventId: {
        "52": "wtcrm_promotion_activitylist_newcardgift_clk",//开卡赠送
    },
    //营销活动点击第一步
    sensorsFirstStepId: {
        "52": "wtcrm_promotion_activitylist_newcardgift_step1_clk"
    },
    //营销活动点击第二步
    sensorsSecondStepId: {
        "52": "wtcrm_promotion_activitylist_newcardgift_step2_clk"
    },
    //营销活动点击第三步
    sensorsThirdStepId: {
        "52": "wtcrm_promotion_activitylist_newcardgift_step3_clk"
    }
};

export default SensorsCodes;
