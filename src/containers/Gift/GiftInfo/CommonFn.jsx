import _ from 'lodash';
/**
 * [mapValueToLabel 依据value获得label,若没有匹配上返回value]
 * @param  {[type]} cfg [description]
 * @param  {[type]} val [description]
 * @return {[type]}     [description]
 */
export function mapValueToLabel(cfg, val) {
    return _.result(_.find(cfg, { value: val }), 'label');
}
/**
 * [newPreProShopsByArea description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
export function preProShopsByArea(data) {
    if (undefined === data) {
        return null;
    }
    if (!((data instanceof Array) && data.length > 0)) {
        return null;
    }
    let _data = data;
    const cityGroup = _.groupBy(_data, 'cityID');
    let resultData = [];
    let areaResult = [];
    let shopResult = [];
    _.forEach(cityGroup, (cityItem, cityKey) => {
        let areaResult = [];
        const areaGroup = _.groupBy(_.filter(_data, (item, key) => item.cityID == cityKey), 'areaID');
        _.forEach(areaGroup, (areaItem, areaKey) => {
            let shopResult = [];
            const shopGroup = _.groupBy(_.filter(_data, (item, key) => item.areaID == areaKey && item.cityID == cityKey), 'shopID');
            _.forEach(shopGroup, (shopItem, shopKey) => {
                const [firstShopItem, ...restShopItem] = shopItem;
                shopResult.push({
                    shopID: shopKey,
                    shopName: firstShopItem.shopName,
                    itemID: shopKey,
                    itemName: firstShopItem.shopName,
                });
            });
            const [firstAreaItem, ...restAreaItem] = areaItem;
            areaResult.push({
                areaID: areaKey,
                areaName: firstAreaItem.areaName,
                itemID: areaKey,
                itemName: firstAreaItem.areaName,
                children: shopResult,
            });
        });
        const [firstCityItem, ...restCityItem] = cityItem;
        resultData.push({
            itemID: cityKey,
            itemName: firstCityItem.cityName,
            children: areaResult
        });
    });
    return resultData;
}
/**
 * [multiplyNumFloat 两个浮点类型小数相乘]
 * @param  {[type]} num1 [description]
 * @param  {[type]} num2 [description]
 * @return {[type]}      [description]
 */
export function multiplyNumFloat(num1, num2) {
    let sq1, sq2, m, multiplyNum1, multiplyNum2;
    try {
        sq1 = num1.toString().split(".")[1].length;
    } catch (e) {
        sq1 = 0;
    }
    try {
        sq2 = num2.toString().split(".")[1].length;
    } catch (e) {
        sq2 = 0;
    }
    multiplyNum1 = num1.toString().replace('.', '');
    multiplyNum2 = num2.toString().replace('.', '');
    m = multiplyNum1 * multiplyNum2 / Math.pow(10, (sq1 + sq2));
    return m;
}

/**
 * [multiplyNumFloat 两个浮点类型小数相除]
 * @param  {[type]} num1 [description]
 * @param  {[type]} num2 [description]
 * @return {[type]}      [description]
 */
export function divideNumFloat(num1, num2) {
    let sq1, sq2, m, divideNum1, divideNum2;
    try {
        sq1 = num1.toString().split(".")[1].length;
    } catch (e) {
        sq1 = 0;
    }
    try {
        sq2 = num2.toString().split(".")[1].length;
    } catch (e) {
        sq2 = 0;
    }
    divideNum1 = num1.toString().replace('.', '');
    divideNum2 = num2.toString().replace('.', '');
    m = multiplyNumFloat(divideNum1 / divideNum2, Math.pow(10, (sq2 - sq1)));
    return m;
}

/**
 * [addNum description] 解决两个浮点数相加，出现N多小数问题
 * @param {[type]} num1 [description]
 * @param {[type]} num2 [description]
 */
export function addNumFloat(num1, num2) {
    let sq1, sq2, m;
    try {
        sq1 = num1.toString().split(".")[1].length;
    } catch (e) {
        sq1 = 0;
    }
    try {
        sq2 = num2.toString().split(".")[1].length;
    } catch (e) {
        sq2 = 0;
    }
    m = Math.pow(10, Math.max(sq1, sq2));
    return (num1 * m + num2 * m) / m;
}

/**
 * [addNum description] 解决两个浮点数相减，出现N多小数问题
 * @param {[type]} num1 [description]
 * @param {[type]} num2 [description]
 */
export function subtractNumFloat(num1, num2) {
    let sq1, sq2, m;
    try {
        sq1 = num1.toString().split(".")[1].length;
    } catch (e) {
        sq1 = 0;
    }
    try {
        sq2 = num2.toString().split(".")[1].length;
    } catch (e) {
        sq2 = 0;
    }
    m = Math.pow(10, Math.max(sq1, sq2));
    return (num1 * m - num2 * m) / m;
}

export function getMonthDateData() {
    const monthDateOptions = [];
    for (let i = 1; i < 13; i++) {
        let date = [];
        for (let j = 1; j < 32; j++) {
            if (i == 1 || i == 3 || i == 5 || i == 7 || i == 8 || i == 10 || i == 12) {
                date.push({value: j, label: j + '日'});
            } else if (i == 4 || i == 6 || i == 9 || i == 11) {
                if (j < 31) {
                    date.push({value: j, label: j + '日'});
                }
            } else {
                if (j < 29) {
                    date.push({value: j, label: j + '日'});
                }
            }
        }
        monthDateOptions.push({
            value: i,
            label: i + '月',
            children: date,
        });
    }
    return monthDateOptions;
}

export function addZero(value) {
    return value < 10 ? `0${value}` : value;
}