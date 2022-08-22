/*
 * @Author: Songnana
 * @Date: 2022-08-19 17:09:56
 * @Modified By: modifier Songnana
 * @Descripttion: 
 */
import { axios, getStore } from "@hualala/platform-base";


const [service, type, api, url] = ['HTTP_SERVICE_URL_PROMOTION_NEW', 'post', '/', '/api/v1/universal?']


function getAccountInfo() {
    const { user } = getStore().getState();
    return user.get('accountInfo').toJS();
}

function isProfessionalTheme() {
    return getStore().getState().user.getIn(['versionUI', 'styleName']) === 'professional';
}

const loadShopSchema = async () => {
    const method = `${api}cooperative/queryCooperativeGroupAndShop.ajax`;
    const { groupID } = getAccountInfo();
    const parm = { service, type, data: { groupID }, method };
    const res = await axios.post(url + method, parm);
    if (res.code !== '000') throw new Error(res.message);
    console.log("🚀 ~ file: utils.js ~ line 28 ~ loadShopSchema ~ res", res)
    // data = res.data;
//     const res  = {
//       "code":"000",
//       "cooperativeGroupInfos":[
//           {
//               "cooperativeGroupID":11157,
//               "cooperativeGroupName":"合作测试集团11157",
//               "shopIDs":[
//                   76069386,
//                   76068752
//               ],
//               "shopInfos":[
//                   {
//                       "shopID":76069386,
//                       "shopName":"许郝敏店铺11157"
//                   },
//                   {
//                       "shopID":76068752,
//                       "shopName":"李丹丹店铺11157"
//                   }
//               ]
//           },
//           {
//             "cooperativeGroupID":11158,
//             "cooperativeGroupName":"合作测试集团11158",
//             "shopIDs":[
//                 76069386,
//                 76068752
//             ],
//             "shopInfos":[
//                 {
//                     "shopID":760693864,
//                     "shopName":"许郝敏店铺11158"
//                 },
//                 {
//                     "shopID":760687522,
//                     "shopName":"李丹丹店铺11158"
//                 }
//             ]
//         }
//       ],
//       "message":"执行成功",
//       "traceID":"CCb3988834fd9041c0ac0497d393967434"
//   }
    const { cooperativeGroupInfos: data } = res;
    return {
        originLeftGroup: data.map((item) => {
            return {
                ...item,
                label: item.cooperativeGroupName,
                value: item.cooperativeGroupID,
            }
        }),
        allSubRightGroup: data.reduce(((cur, next) => {
            const { cooperativeGroupID } = next;
            next.shopInfos = next.shopInfos.map(i => ({ ...i, groupID: cooperativeGroupID }))
            return (cur || []).concat(next.shopInfos)
        }), []).filter(item => item)
            .map(item => ({ ...item, value: `${item.shopID}`, label: item.shopName })),
    };
}


const filterByGroupID = (options, filterKeys) => {
    if (filterKeys.length > 0) {
        return options.filter(item => filterKeys.includes(item.groupID))
    }
    return options
}

export {
    loadShopSchema,
    isProfessionalTheme,
    filterByGroupID,
}
