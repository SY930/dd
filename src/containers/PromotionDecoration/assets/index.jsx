/**
 * 装修相关资源文件很多尺寸过大，影响项目打包速度
 * 所以将其传到资源服务器，export 资源服务器上的路径，供项目使用
 * assets文件夹中依然留有备份，防止旧url 404后无法立即传一个新url上去
 */

/**
 * 传入相对路径，拼上资源服务器前缀后返回
 * @param {string} relativeUrl 
 * @returns {string}
 */
function getAbsoluteURL(relativeUrl) {
    return `http://res.hualala.com/${relativeUrl}`
}
export const btnBg = getAbsoluteURL('basicdoc/cf5f4512-b5e1-415b-9065-ee56d968d325.png');
export const expansionBg = getAbsoluteURL('basicdoc/18442182-09ac-4959-bd30-9e8f97c91a82.png');
export const freeGift = getAbsoluteURL('basicdoc/04bc1f1b-c733-44f4-98c9-e2472fb8c21c.png');
export const freeGift1 = getAbsoluteURL('basicdoc/9d33fcd7-a1e8-4664-a8bd-1da108df17d6.png');
export const freeGift2 = getAbsoluteURL('basicdoc/59079408-7bb2-4704-bd61-b8365bca7cba.png');
export const giftExample = getAbsoluteURL('basicdoc/dfee3857-da42-4262-9e01-c368c1f2b7bb.png');
export const giftExampleThumb = getAbsoluteURL('basicdoc/091dc6af-647f-4751-8385-345bc2dd5f34.png');
export const iphone = getAbsoluteURL('basicdoc/3e3d526c-00a7-410f-b9b3-d8017051841d.png');
export const onlineRes = getAbsoluteURL('basicdoc/a21f9183-9874-4060-9ac4-8e02cc284556.png');
export const phoneTop = getAbsoluteURL('basicdoc/4621624f-e252-47d4-a047-b5e9c6336f29.png');
export const progress = getAbsoluteURL('basicdoc/6e2874e9-1255-4607-b4e1-9d7f69ed661c.png');
export const recommend1 = getAbsoluteURL('basicdoc/c982b5b9-02e2-488a-ada5-3153b2ec39a4.png');
export const recommend2 = getAbsoluteURL('basicdoc/39644446-7105-4bc7-ac55-8ee97b495c25.png');
export const shareGift = getAbsoluteURL('basicdoc/7cfd2062-4f16-4d3b-afd2-f5024fa5f491.png');
export const shareGift1 = getAbsoluteURL('basicdoc/4bf51c2a-2f21-4c58-8187-5a5f2c7cef11.png');
