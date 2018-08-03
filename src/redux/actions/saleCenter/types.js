/**
 * @flow
 * @Author: fengxiao.wang <feng>
 * @Date:   2017-02-04T12:10:27+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: types.js
 * @Last modified by:   xf
 * @Last modified time: 2017-07-18T17:47:12+08:00
 * @Copyright: Copyright(c) 2017-2020 Hualala Co.,Ltd.
 */

var Moment = require('moment');

export const FULL_CUT_ACTIVITY_CYCLE_TYPE = Object.freeze({
    EVERYDAY: '0',
    WEEKLY: '1',
    MONTHLY: '2',
});
export const CLIENT_CATEGORY = Object.freeze([
    {key:'0',value:'0', name:'不限制'},
    {key:'1',value:'1', name:'仅会员'},
    {key:'2',value:'2', name:'非会员'}
]);
export const PAYMENTS_OPTIONS = Object.freeze([
    {key:'0',value:'0',name:'不限制'},
    {key:'1',value:'1',name:'仅实收'}
]);
export const CYCLE_TYPE = Object.freeze([
    {
        value: '0',
        name: '每日'
    },
    {
        value: '1',
        name: '每周'
    },
    {
        value: '2',
        name: '每月'
    }
]);

export const SALE_CENTER_ACTIVITY_CHANNEL_LIST = Object.freeze([
    {
        idx: 0,
        name: "全部",
        key: "",
        value: '0'
    },
    {
        idx: 1,
        name: "云店",
        key: "POS",
        value: '1'
    },
    {
        idx: 2,
        name: "微信",
        key: "WECHAT",
        value: '2'
    }
]);

// TODO: remove the bottom definition,
export const SALE_CENTER_ACTIVITY_ORDER_TYPE_LIST = Object.freeze([
    {
        label: '预定',
        value: '10'
    },
    {
        label: '闪吃',
        value: '11'
    },
    {
        label: '外送',
        value: '20'
    },
    {
        label: '堂食',
        value: '31'
    },
    {
        label: '自提',
        value: '21'
    }
]);

export const SALE_CENTER_ACTIVITY_ORDER_TYPE = Object.freeze({
    '10': '预定',
    '11': '闪吃',
    '20': '外送',
    '31': '堂食',
    '21': '自提'
});

export const SALE_CENTER_GIFT_TYPE = Object.freeze([
    {
        label: '电子代金券',
        value: '10'
    },
    {
        label: '菜品优惠券',
        value: '20'
    },
    {
        label: '实物礼品券',
        value: '30'
    },
    {
        label: '会员充值券',
        value: '40'
    },
    {
        label: '会员积分券',
        value: '42'
    },
    {
        label: '会员权益券',
        value: '80'
    }

]);

export const SALE_CENTER_GIFT_EFFICT_TIME = Object.freeze([
    {
        label: '立即生效',
        value: '0'
    },
    {
        label: '3小时生效',
        value: '3'
    },
    {
        label: '6小时生效',
        value: '6'
    },
    {
        label: '9小时生效',
        value: '9'
    },
    {
        label: '12小时生效',
        value: '12'
    },
    {
        label: '18小时生效',
        value: '18'
    },
    {
        label: '24小时生效',
        value: '24'
    }
]);
// process.env.NODE_ENV !== 'production'

export const ACTIVITY_CATEGORIESs = process.env.NODE_ENV !== 'production';

export const ACTIVITY_CATEGORIES = (function(){

    let basic = [
        {
            idx: 0,
            title: "满减/每满减",
            color: '#84aac6',
            text: '顾客只要消费满一定金额即可得到一定的减价优惠',
            example: '例如:菜金满100减10元/酒水美满100减5元',
            key: "BILL_FREE"
        },

        {
            idx: 1,
            title: "满赠/每满赠",
            color: '#c49b79',
            text: '顾客消费满足条件,商家即赠送菜品',
            example: '例如:菜金满100赠可乐一瓶',
            key: "FOOD_AMOUNT_THEN_GIVE"
        },

        {
            idx: 2,
            title: "折扣",
            color: '#9dc568',
            text: "可设置显示账单折扣,菜品折扣",
            example: '例如:全部菜品9折,酒水不打折',
            key: 'BILL_DISCOUNT'
        },

        {
            idx: 3,
            title: "特价菜",
            color: '#e5be6c',
            text: "直接降价促销",
            example: '例如:周一凉菜类会员立减10元',
            key: 'FOOD_SPECIAL_PRICE'
        },

        {
            idx: 4,
            title: "买赠",
            color: '#c49b79',
            text: '顾客买X赠送Y,常用语单品推新的促销和曝光度',
            example: '例如:点新菜品2份以上可免费送可乐一瓶',
            key: 'FOOD_BUY_THEN_GIVE'
        },


        {
            idx: 5,
            title: "第二份打折",
            color: '#84aac6',
            text: '更实在的折扣优惠,常用于情侣消费,朋友消费',
            example: '例如:午餐12点-13点可乐第二份8折,第三份半价',
            key: 'FOOD_DISCOUNT_WHEN'
        },
        {
            idx: 6,
            title: "消费返礼品",
            color: '#9dc568',
            text: '消费后获得奖励将使顾客下次光临的时间大大提前',
            example: '例如:消费满100元送1张10元代金券',
            key: 'RETURN_GIFT'
        },
        {
            idx: 7,
            title: "消费返积分",
            color: '#c49b79',
            text: '会员消费满X元送积分,积分可兑换礼品或抵现',
            example: '例如:全部菜品9折,酒水不打折',
            key: '3020'
        },
        {
            idx: 8,
            title: "团购券",
            color: '#e5be6c',
            text: "对接美团点评团购券,并拆分券实收和优惠金额",
            example: '例如:全部菜品9折,酒水不打折',
            key: 'VOUCHER_GROUP'
        },
        // {
        //     idx: 9,
        //     title: "礼品券",
        //     color: '#9dc568',
        //     text: '核销商家发售的代金券,菜品券',
        //     example: '例如:账单满100元可用1张10元代金券',
        //     key: 'VOUCHER_COUPON'
        // },
        {
            idx: 9,
            title: "随机立减",
            color: '#84aac6',
            text: '消费满X元随机立减一定金额,顾客可获得幸福感',
            example: '例如:消费满100元随机立减1-5元',
            key: 'BILL_RANDOM_FREE'
        }];

    let extral = [
        {
            idx: 10,
            title: "买减/买折",
            color: '#84aac6',
            text: '买一定份数的指定菜品可享受相应折扣或减价',
            example: '例如:买1份土豆丝+1份黄瓜即可打9折或减价3元',
            key: 'BILL_FIXED_FREE'
        },
        {
            idx: 11,
            title: "搭赠",
            color: '#84aac6',
            text: '购买指定菜品组合时可搭配赠送指定菜品',
            example: '例如:购买土豆与茄子组合即可赠送西红柿',
            key: 'FOOD_FIXED_SET_GIVE'
        },
        {
            idx: 12,
            title: "组合减免/折扣",
            color: '#84aac6',
            text: '购买X组菜品组合即可享受相应折扣或减价',
            example: '例如:购买任意两组菜品组合即可打9折或减价3元',
            key: 'BILL_COMBINE_FREE'
        },
        {
            idx: 13,
            title: "加价换购",
            color: '#84aac6',
            text: '任意或指定消费满X元再加Y元即可换指定菜品',
            example: '例如:任意消费满100元加10元即可换土豆丝一份',
            key: 'FOOD_BUY_THEN_FREE'
        },
        {
            idx: 14,
            title: "买三免一",
            color: '#84aac6',
            text: '消费满X份菜品即可在X中免单Y份最低价菜品',
            example: '例如:消费满4份热菜即可在4份中免单最低价的1份',
            key: 'BILL_PAY_MORE_THEN_GET'
        }];

    // if (process.env.NODE_ENV !== 'production-release' && process.env.NODE_ENV !== 'production-pre'  ) {
    //     return basic.concat(extral);
    // }
    // else {
    //     return basic
    // }
        return basic.concat(extral);
})();

export const CHARACTERISTIC_CATEGORIES = Object.freeze([
    {
        idx: 0,
        title: "生日赠送",
        color: '#84aac6',
        text: '生日总要HAPPY一下，此时赠送礼品恰到好处的吸引客户进店消费',
        example: '',
        key: "51"
    },
    {
        idx: 1,
        title: "开卡赠送",
        color: '#84aac6',
        text: '开启开卡赠送礼品，可以带来更多的新客户',
        example: '',
        key: "52"
    },
    {
        idx: 2,
        title: "免费领取",
        color: '#84aac6',
        text: '限时免费领取礼品，达到短期拉新的效果',
        example: '',
        key: "21"
    },
    {
        idx: 3,
        title: "摇奖活动",
        color: '#84aac6',
        text: '人人都希望中奖，意外的礼品总是刺激着顾客的就餐神经',
        example: '',
        key: "20"
    },
    {
        idx: 4,
        title: "积分兑换",
        color: '#84aac6',
        text: '顾客可以使用积分兑换相应的礼品，增加顾客的消费黏性',
        example: '',
        key: "30"
    },
    // {
    //     idx: 5,
    //     title: "群发短信",
    //     color: '#84aac6',
    //     text: '群发短消息，将问候和优惠及时传递给你的每一位顾客',
    //     example: '',
    //     key: "50"
    // },
    // {
    //     idx: 6,
    //     title: "群发礼品",
    //     color: '#84aac6',
    //     text: '在最恰当的时间，送去最温馨的优惠礼品，顾客倍感惊喜',
    //     example: '',
    //     key: "53"
    // },
    {
        idx: 5,
        title: "报名活动",
        color: '#84aac6',
        text: '通过报名设置，筛选企业不同价值的客户',
        example: '',
        key: "22"
    }
]);

export const arrayTransformAdapter = function(source){
    if (!(source instanceof String || typeof source === 'string')){
        throw new Error(`The source string should be string, which is ${source}`);
    }

    if("" === source) {
        return [];
    }
    // JSON parse format
    var pattern = /\[/gi;
    var matchs = pattern.exec(source);

    if(matchs && undefined !== matchs[0]){
        return JSON.parse(source);
    }

    return source.split(',');
};

/**
 * @param {Object} source source data to be transform
 * @param {Bool} direction flag 'false' indicate it is transform to redux format or to the server end format
 * @return {Object}  transformed data
 */
export const promotionBasicDataAdapter = function(source, dir) {
    if (!(source instanceof Object)){
        throw new Error(`source should be an Object, which is ${source}`);
    }
    let _source = Object.assign({}, source);
    // false, to redux format
    if (!dir) {
        let _startDate, _endDate;
        if(_source.master.startDate === 20000101 || 29991231 === _source.master.startDate) {
            _startDate = _endDate = undefined;
        } else {
            _startDate = Moment(_source.master.startDate, 'YYYYMMDD');
            _endDate = Moment(_source.master.endDate, 'YYYYMMDD');
        }
        let _tagList = arrayTransformAdapter(_source.master.tagLst);

        let _excludeDateArray = arrayTransformAdapter(_source.master.excludedDate).map((ed)=>{
            return Moment(ed,'YYYYMMDD');
        });
        let _timeRangeInfo = _source.timeLst?_source.timeLst.map((time)=>{
            return {
                validationStatus: 'success',
                helpMsg: null,
                start: Moment(time.startTime,'HHmm'),
                end: Moment(time.endTime,'HHmm')
            }
        }):[{
            validationStatus: 'success',
            helpMsg: null,
            start: undefined,
            end: undefined
        }];
        let _validCycleType = '0';
        let _selectMonthValue = [];
        let _selectWeekValue = [];

        let _validCycle = arrayTransformAdapter(_source.master.validCycle);
        _validCycle.map((vc)=>{
            if(vc[0] == 'w'){
                _validCycleType = '1';
                _selectWeekValue.push(vc.substr(1));
            }else if(vc[0] == 'm'){
                _validCycleType = '2';
                _selectMonthValue.push(vc.substr(1));
            }else{
                _validCycleType = '0';
            }
        });
        return {
            category: _source.master.categoryName,
            name: _source.master.promotionName, //活动名称
            showName: _source.master.promotionShowName, //活动展示名称
            code: _source.master.promotionCode, //活动编码
            tags: _tagList, //活动标签  ['标签名1','标签名2']
            startDate: _startDate, //开始时间
            endDate: _endDate, //结束时间
            description: _source.master.description, //活动描述
            promotionID: _source.master.promotionIDStr,
            promotionType: _source.master.promotionType,
            validCycleType: _validCycleType,
            timeRangeInfo :_timeRangeInfo,
            selectMonthValue: _selectMonthValue,
            selectWeekValue: _selectWeekValue,
            excludeDateArray: _excludeDateArray
        };
    }
    else {
        let _startDateInFormat = ((date)=>{
            if(date === undefined) {
                return 20000101;
            } else {
                return date.format("YYYYMMDD");
            }
        })(_source.startDate);

        let _endDateInFormat = ((date)=>{
            if(date === undefined) {
                return 29991231;
            } else {
                return date.format("YYYYMMDD");
            }
        })(_source.endDate);

        let validCycle  = ((validType)=>{
            if(validType=='1'){
                return _source.selectWeekValue.map((week)=>{
                    return `w${week}`;
                }).join(',');
            }else if(validType=='2'){
                return _source.selectMonthValue.map((month)=>{
                    return `m${month}`;
                }).join(',');
            }else{
                return null;
            }
        })(_source.validCycleType);

        let excludedDate  = ((date)=>{
            return date.map((d)=>{
                return d.format("YYYYMMDD");
            }).join(',');
        })(_source.excludeDateArray);

        let timeLst = ((range)=>{
            if(range[0].start != undefined){
                return range.map((r)=>{
                    return {
                        timeType: 'CONSUME_TIME',
                        startTime: r.start.format("HHmm"),
                        endTime:r.end.format("HHmm")
                    };
                });
            }

        })(_source.timeRangeInfo);
        return {
            categoryName: _source.category,
            promotionName: _source.name,
            promotionShowName: _source.showName,
            promotionCode: _source.code,
            tagLst: _source.tags.join(","),
            startDate: _startDateInFormat,
            endDate: _endDateInFormat,
            description: _source.description,
            promotionID: _source.promotionID,
            promotionType: _source.promotionType,
            timeLst,
            validCycle,
            excludedDate
        };
    }
};

export const promotionScopeInfoAdapter = function(source, dir){
    if (!(source instanceof Object)){
        throw new Error(`source should be an Object, which is ${source}`);
    }
    let _source = Object.assign({}, source);
    // false, to redux format
    if (!dir) {
        let _brands = arrayTransformAdapter(_source.brandIDLst);
        let _auto = _source.defaultRun === "YES" ? "1" : '0';
        let _orderType = arrayTransformAdapter(_source.orderTypeLst);
        let _channel = SALE_CENTER_ACTIVITY_CHANNEL_LIST.find((channel)=>{
            return channel.key === _source.channelLst;
        });
        let _shopsInfo = arrayTransformAdapter(_source.shopIDLst);
        return {
            'auto': _auto,
            'brands': _brands,
            'orderType': _orderType,
            'shopsInfo': _shopsInfo,
            'channel': _channel? _channel.value : "0",
        };
    } else {
        return {
            brandIDLst: _source.brands.join(','),
            channelLst: _source.channel == 1 ? 'POS' : _source.channel == 0 ? '' :'WECHAT' ,
            defaultRun: _source.auto == '1' ? 'YES' : 'NO',
            orderTypeLst: _source.orderType.join(","),
            shopIDLst: _source.shopsInfo
                .map((item) => {
                    return item.shopID;
                })
                .join(",")
        };
    }
};

export const promotionDetailInfoAdapter = function(source, dir){
    if (!(source instanceof Object || typeof source === 'object')){
        throw new Error(`The source should be object, which is ${source}`);
    }
    //TODO:娶过来的数据没塞到页面里

    if (!dir){
        let priceLst = [];
        if(source.priceLst){
            priceLst = source.priceLst;
        }
        let scopeLst = [];
        if(source.scopeLst){
            scopeLst = source.scopeLst;
        }

        let ruleJson = source.master.ruleJson!=''?JSON.parse(source.master.ruleJson):'';
        return {
            rule: ruleJson,
            foodCategory: [],
            excludeDishes: [], // excluded dish
            dishes: [], // selected dish
            userSetting: source.master.userType =='0'?'0':source.master.userType =='1'?'1':'2', // user setting
            subjectType: source.master.subjectType =='0'?'0':'1', // 支付限制
            mutexPromotions: arrayTransformAdapter(source.master.sharedPromotionIDLst), // 不能同时进行的活动ID
            mutexSubjects: arrayTransformAdapter(source.master.excludedSubjectLst),
            role: arrayTransformAdapter(source.master.roleIDLst),
            priceLst,
            scopeLst,
            categoryOrDish: 0, // promotion advanced setting
        };
    } else {
        // compose scopeList
        let scope = [];
        if(source.scopeLst.length >0 && source.foodCategory.length == 0 &&
            source.excludeDishes.length == 0 && source.dishes.length == 0 ){
            scope = source.scopeLst;
        }else{
            if (source.foodCategory !== null) {
                source.foodCategory.map((item)=>{
                    scope.push({
                        scopeType: "1",
                        targetID: item.foodCategoryID,
                        targetCode: item.foodCategoryKey,
                        targetName: item.foodCategoryName
                    });
                });
            }

            if(source.excludeDishes !== null){
                source.excludeDishes.map((item)=>{
                    scope.push({
                        scopeType: "4",
                        targetID: item.itemID,
                        targetCode: item.foodKey,
                        targetName: item.foodName,
                        targetUnitName: item.unit
                    });
                });
            }

            if(source.dishes !== null) {
                source.dishes.map((item)=> {
                    scope.push({
                        scopeType: "2",
                        targetID: item.itemID,
                        targetCode: item.foodKey,
                        targetName: item.foodName,
                        targetUnitName: item.unit
                    });
                });
            }
        }
        return {
            scopeLst: scope,
            ruleJson: source.rule,
            priceLst: source.priceLst
        };
    }
};


export const specialPromotionBasicDataAdapter = function(source, dir) {
    if (!(source instanceof Object)){
        throw new Error(`source should be an Object, which is ${source}`);
    }
    let _source = Object.assign({}, source);
    // false, to redux format
    if (!dir) {
        return _source;
    }
};

// find the idx according the promotinKey, user can use the idx to get the related Component.
export const getPromotionIdx = function(promotionKey) {
    if (!(promotionKey instanceof String || typeof promotionKey === 'string')) {
        throw new Error(`'promotionKey' should be a String type. Which is '${promotionKey}'`);
    }

    let _promotionInfo = ACTIVITY_CATEGORIES.filter((promotionInfo) => {
        return promotionInfo.key === promotionKey;
    });

    if (_promotionInfo.length && _promotionInfo.length === 1) {
        return _promotionInfo[0].idx;
    } else {
        throw new Error(`There is not promotion with the specified promotionKey ${promotionKey}`);
    }
};

export const getSpecialPromotionIdx = function(promotionKey) {
    if (!(promotionKey instanceof String || typeof promotionKey === 'string')) {
        throw new Error(`'promotionKey' should be a String type. Which is '${promotionKey}'`);
    }

    let _promotionInfo = CHARACTERISTIC_CATEGORIES.filter((promotionInfo) => {
        return promotionInfo.key === promotionKey;
    });

    if (_promotionInfo.length && _promotionInfo.length === 1) {
        return _promotionInfo[0].idx;
    } else {
        throw new Error(`There is not promotion with the specified promotionKey ${promotionKey}`);
    }
};



export const TRIPLE_STATE = Object.freeze({
    ALL: "0",
    OPTION1: "1",
    OPTION2: "2"
});

//是否发信息
export const SEND_MSG = Object.freeze([
    {
        label:'不发送',
        value:'0'
    },{
        label:'仅发送短信',
        value:'1'
    },{
        label:'仅推送微信',
        value:'2'
    },{
        label:'微信推送不成功则发送短信',
        value:'3'
    }
]);
