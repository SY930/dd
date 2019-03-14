/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-03-09T14:19:11+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: promotionDetailInfo.reducer.js
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-06T16:19:06+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */

import Immutable from 'immutable';
import { ACTIVITY_CATEGORIES } from '../../actions/saleCenterNEW/types';
import {

    SALE_CENTER_SET_PROMOTION_DETAIL,

    SALE_CENTER_FETCH_FOOD_CATEGORY,
    SALE_CENTER_FETCH_FOOD_CATEGORY_SUCCESS,
    SALE_CENTER_FETCH_FOOD_CATEGORY_FAILED,
    SALE_CENTER_FETCH_FOOD_MENU,
    SALE_CENTER_FETCH_FOOD_MENU_SUCCESS,
    SALE_CENTER_FETCH_FOOD_MENU_FAILED,


    SALE_CENTER_FETCH_PROMOTION_LIST,
    SALE_CENTER_FETCH_PROMOTION_LIST_SUCCESS,
    SALE_CENTER_FETCH_PROMOTION_LIST_FAILED,


    SALE_CENTER_FETCH_ALL_PROMOTION_LIST,
    SALE_CENTER_FETCH_ALL_PROMOTION_LIST_SUCCESS,
    SALE_CENTER_FETCH_ALL_PROMOTION_LIST_FAILED,


    SALE_CENTER_FETCH_ROLE_LIST,
    SALE_CENTER_FETCH_ROLE_LIST_SUCCESS,
    SALE_CENTER_FETCH_ROLE_LIST_FAILED,
    SALE_CENTER_RESET_DETAIL_INFO,

    SALE_CENTER_FETCH_GIFT_LIST,
    SALE_CENTER_FETCH_GIFT_LIST_SUCCESS,
    SALE_CENTER_FETCH_GIFT_LIST_FAILED,

    SALE_CENTER_FETCH_SUBJECT_LIST,
    SALE_CENTER_FETCH_SUBJECT_LIST_SUCCESS,
    SALE_CENTER_FETCH_SUBJECT_LIST_FAILED,

} from '../../actions/saleCenterNEW/promotionDetailInfo.action';

const $initialState = Immutable.fromJS({

    $foodCategoryListInfo: {
        initialized: false,
        data: [],
    },

    $foodMenuListInfo: {
        initialized: false,
        data: [],
    },

    $promotionListInfo: {
        initialized: false,
        data: {
            promotionTree: [],
            promotionInfo: [],
        },
    },
    $allPromotionListInfo: {
        initialized: false,
        data: {
            promotionTree: [],
            promotionInfo: [],
        },
    },
    $roleInfo: {
        initialized: false,
        data: {
            roleTree: [],
            roleInfo: [],
        },
    },
    $giftInfo: {
        initialized: false,
        data: [],
    },
    $subjectInfo: {
        initialized: false,
        data: {
            subjectTree: [],
            subjectInfo: [],
        },
    },

    // promotion content
    $promotionDetail: {
        // promotion rule
        rule: null,
        blackList: false, // 白名单黑名单
        foodCategory: [],
        excludeDishes: [], // excluded dish
        dishes: [], // selected dish
        userSetting: '0', // user setting
        subjectType: '0', // 支付限制
        mutexPromotions: [], // 不能同时进行的活动ID
        mutexSubjects: [], // 不能同时进行的结算方式key
        role: [],
        priceLst: [],
        scopeLst: [],
        categoryOrDish: 0, // 0, 按分类 promotion advanced setting,
        isActive: '',
        upGradeDishes: [], // 例如：升级换新的加价前商品
        needSyncToAliPay: 0,
    },

    foodCategoryCollection: [],
});

function constructTreeDataContainsFoodCategoryAndFood($foodCategoryListInfo, $foodMenuListInfo) {
    if ($foodCategoryListInfo.size > 0 && $foodMenuListInfo.size > 0) {
        // TODO: foodCategoryListInfo has page infomation, so ....
        let $foods,
            $categories,
            foodCategoryCollection = {};

        if ($foodCategoryListInfo === undefined || !Immutable.Map.isMap($foodCategoryListInfo)) {
            return []
        }
        $categories = $foodCategoryListInfo.getIn(['records']);

        if ($foodMenuListInfo === undefined || !Immutable.Map.isMap($foodMenuListInfo)) {
            $foods = Immutable.fromJS([]);
        } else {
            $foods = $foodMenuListInfo.getIn(['records']);
        }

        $categories.map(($category, key) => {
            let groupName = $category.get('foodCategoryGroupName');
            if (!groupName) {
                groupName = '未分类';
            }
            const foodsOfTheCategory = $foods
                .filter(($food) => {
                    // return $food.get("foodCategoryID") === $category.get("foodCategoryID");
                    return String($food.get('foodCategoryID')) === String($category.get('foodCategoryID'));
                })
                .map(($food) => {
                    return {
                        id: $food.get('foodID'),
                        content: $food.get('foodName'),
                        ...$food.toJS(),
                    };
                })
                .toJS();

            const foodCategoryItemWrapper = {
                id: $category.get('foodCategoryID'),
                content: $category.get('foodCategoryName'),
                foods: foodsOfTheCategory,
                ...$category.toJS(),
            };


            if (!foodCategoryCollection[groupName]) {
                foodCategoryCollection[groupName] = {
                    foodCategoryGroupName: {
                        // TODO: fixed this in the future
                        id: key,
                        content: groupName,
                    },

                    foodCategoryName: [foodCategoryItemWrapper],
                };
            } else {
                foodCategoryCollection[groupName].foodCategoryName.push(foodCategoryItemWrapper);
            }
        });

        if (Object.keys(foodCategoryCollection).length == 0) {
            return [];
        }
        return Object.keys(foodCategoryCollection).map((key) => {
            return foodCategoryCollection[key];
        });
    }
    return []
}


function constructTreeDataContainsPromotion(data) {
    const treeDataForPromotionSelectionBoxs = {};
    data.reduce((accumulator, promotion, currentIndex, array) => {
        const key = promotion.get('promotionType');
        if (accumulator[key]) {
            accumulator[key].push(promotion.toJS());
        } else {
            accumulator[key] = [promotion.toJS()];
        }

        return accumulator;
    }, treeDataForPromotionSelectionBoxs);
    let promotionTypes;
    // promotionTypes = Object.keys(treeDataForPromotionSelectionBoxs) 排序杂乱，换下面的方式
    promotionTypes = ACTIVITY_CATEGORIES.map(pro => pro.key)
        .map((key, index) => {
            const promotionType = {
                id: index,
                content: ACTIVITY_CATEGORIES.find((item) => {
                    return item.key === key;
                }) ? ACTIVITY_CATEGORIES.find((item) => {
                    return item.key === key;
                }).title : '未找到匹配项',
            };
            return {
                promotionType,
                promotionName: treeDataForPromotionSelectionBoxs[key] ?
                    treeDataForPromotionSelectionBoxs[key].map((promotion) => {
                        promotion.finalShowName = `${promotion.promotionCode} - ${promotion.promotionName}`;
                        return promotion;
                    }) : [],
            }
        });
    // TODO: 把空分类filter一下
    return promotionTypes;
}

function constructTreeDataContainsRole(data) {
    const treeDataForRolesOptionsBoxs = {};
    data
        .reduce((accumulator, role) => {
            const key = role.get('groupID');
            if (accumulator[key]) {
                accumulator[key].push(role.toJS());
            } else {
                accumulator[key] = [role.toJS()];
            }

            return accumulator;
        }, treeDataForRolesOptionsBoxs);

    const treeData = Object.keys(treeDataForRolesOptionsBoxs)
        .map((key, index) => {
            return {
                roleGroupName: {
                    id: index,
                    content: key === '0' ? '默认角色' : '自定义角色',
                },
                roleName: treeDataForRolesOptionsBoxs[key],
            }
        });
    return treeData;
}

function constructTreeDataContainsSubject(data) {
    const subjectTreeData = {};
    data.reduce((accumulator, subject, currentIndex, array) => {
        const key = subject.get('subjectGroupName');
        if (accumulator[key]) {
            accumulator[key].push(subject);
        } else {
            accumulator[key] = [subject];
        }

        return accumulator;
    }, subjectTreeData);
    const subjectTypes = Object.keys(subjectTreeData)
        .map((key, index) => {
            if (key == '') {
                return {
                    subjectGroupName: {
                        id: index,
                        content: '未分组',
                    },
                    subjectName: subjectTreeData[key],
                }
            }
            return {
                subjectGroupName: {
                    id: index,
                    content: key,
                },
                subjectName: subjectTreeData[key],
            }
        });
    return subjectTypes;
}

export const promotionDetailInfo_NEW = ($$state = $initialState, action) => {
    let foodCategoryCollection = [];
    switch (action.type) {
        case SALE_CENTER_SET_PROMOTION_DETAIL:
            if (action.payload.rule) { // 把黑名单合进去rulejson
                action.payload.rule.blackList = $$state.get('$promotionDetail').toJS().blackList || false;
            }
            const $payload = Immutable.fromJS(action.payload);
            return $$state.mergeIn(['$promotionDetail'], $payload);

        case SALE_CENTER_FETCH_FOOD_CATEGORY:
            return $$state;

        case SALE_CENTER_FETCH_FOOD_CATEGORY_SUCCESS:
            foodCategoryCollection = constructTreeDataContainsFoodCategoryAndFood(Immutable.fromJS(action.payload), $$state.getIn(['$foodMenuListInfo', 'data']));

            return $$state
                .setIn(['$foodCategoryListInfo', 'data'], Immutable.fromJS(action.payload))
                .setIn(['$foodCategoryListInfo', 'initialized'], true)
                .setIn(['foodCategoryCollection'], Immutable.fromJS(foodCategoryCollection));

        case SALE_CENTER_FETCH_FOOD_CATEGORY_FAILED:
            return $$state;

        case SALE_CENTER_FETCH_FOOD_MENU:
            return $$state;

        case SALE_CENTER_FETCH_FOOD_MENU_SUCCESS:
            foodCategoryCollection = constructTreeDataContainsFoodCategoryAndFood($$state.getIn(['$foodCategoryListInfo', 'data']), Immutable.fromJS(action.payload));
            console.log('foodCategoryCollection: ', foodCategoryCollection)
            return $$state
                .setIn(['$foodMenuListInfo', 'data'], Immutable.fromJS(action.payload))
                .setIn(['$foodMenuListInfo', 'initialized'], true)
                .setIn(['foodCategoryCollection'], Immutable.fromJS(foodCategoryCollection));

        case SALE_CENTER_FETCH_FOOD_MENU_FAILED:
            return $$state;


        case SALE_CENTER_FETCH_PROMOTION_LIST:
            return $$state;

        case SALE_CENTER_FETCH_PROMOTION_LIST_SUCCESS:
            const $promotionLst = Immutable.fromJS(action.payload.promotionLst);
            const promotionTree = constructTreeDataContainsPromotion(Immutable.fromJS(action.payload.promotionLst));
            const $promotionTree = Immutable.fromJS(promotionTree);
            return $$state
                .setIn(['$promotionListInfo', 'initialized'], true)
                .setIn(['$promotionListInfo', 'data', 'promotionInfo'], $promotionLst)
                .setIn(['$promotionListInfo', 'data', 'promotionTree'], $promotionTree);


        case SALE_CENTER_FETCH_ALL_PROMOTION_LIST_FAILED:
            return $$state;

        case SALE_CENTER_FETCH_ALL_PROMOTION_LIST:
            return $$state;

        case SALE_CENTER_FETCH_ALL_PROMOTION_LIST_SUCCESS:
            const $allPromotionLst = Immutable.fromJS(action.payload || []);
            const allPromotionTree = constructTreeDataContainsPromotion($allPromotionLst);
            const $allPromotionTree = Immutable.fromJS(allPromotionTree);
            return $$state
                .setIn(['$allPromotionListInfo', 'initialized'], true)
                .setIn(['$allPromotionListInfo', 'data', 'promotionInfo'], $allPromotionLst)
                .setIn(['$allPromotionListInfo', 'data', 'promotionTree'], $allPromotionTree);


        case SALE_CENTER_FETCH_PROMOTION_LIST_FAILED:
            return $$state;


        case SALE_CENTER_FETCH_ROLE_LIST:
            return $$state;

        case SALE_CENTER_FETCH_ROLE_LIST_SUCCESS:
            const roleTree = constructTreeDataContainsRole(Immutable.fromJS(action.payload.roleList));
            return $$state
                .setIn(['$roleInfo', 'initialized'], true)
                .setIn(['$roleInfo', 'data', 'roleInfo'], Immutable.fromJS(action.payload.roleList))
                .setIn(['$roleInfo', 'data', 'roleTree'], Immutable.fromJS(roleTree));


        case SALE_CENTER_FETCH_ROLE_LIST_FAILED:
            return $$state;

        case SALE_CENTER_RESET_DETAIL_INFO:
            const _payload = Immutable.fromJS(action.payload);
            if (undefined === action.payload) {
                return $$state.set('$promotionDetail', $initialState.get('$promotionDetail'));
            }
            // reset with provided value.
            return $$state.set('$promotionDetail', _payload);

        case SALE_CENTER_FETCH_GIFT_LIST:
            return $$state;

        case SALE_CENTER_FETCH_GIFT_LIST_SUCCESS:
            return $$state
                .setIn(['$giftInfo', 'data'], Immutable.fromJS(action.payload.crmGiftTypes))
                .setIn(['$giftInfo', 'initialized'], true);

        case SALE_CENTER_FETCH_GIFT_LIST_FAILED:
            return $$state;


        case SALE_CENTER_FETCH_SUBJECT_LIST:
            return $$state;

        case SALE_CENTER_FETCH_SUBJECT_LIST_SUCCESS:
            const subjectTree = constructTreeDataContainsSubject(Immutable.fromJS(action.payload.records));
            return $$state
                .setIn(['$subjectInfo', 'initialized'], true)
                .setIn(['$subjectInfo', 'data', 'subjectInfo'], Immutable.fromJS(action.payload.records))
                .setIn(['$subjectInfo', 'data', 'subjectTree'], Immutable.fromJS(subjectTree));

        case SALE_CENTER_FETCH_SUBJECT_LIST_FAILED:
            return $$state;


        default:
            return $$state;
    }
};
