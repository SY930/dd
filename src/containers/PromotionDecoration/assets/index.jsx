/**
 * 装修相关资源文件很多尺寸过大，影响项目打包速度
 * 所以将其传到资源服务器，export 资源服务器上的路径，供项目使用
 * assets文件夹中依然留有备份，防止旧url 404后无法立即传一个新url上去
 */
function getAbsoluteURL(relativeUrl) {
    return `http://res.hualala.com/${relativeUrl}`
}
export default {
    btnBg: getAbsoluteURL('basicdoc/cf5f4512-b5e1-415b-9065-ee56d968d325.png'),
    expansionBg: getAbsoluteURL('group3/M02/F7/43/wKgVe124HSy0GxhNABUIuHfaXKU749.png'),
    freeGift: getAbsoluteURL('group3/M02/F4/1B/wKgVbV24HUWLT4GVAAC9Rzdfsvk758.png'),
    freeGift1: getAbsoluteURL('group3/M01/F7/44/wKgVe124HWDt1BpfAADEC1ejhp8474.png'),
    freeGift2: ,
    giftExampleThumb: ,
    iphone: ,
    onlineRes: ,
    phoneTop: ,
    progress: ,
    recommend1: ,
    recommend2: ,
    shareGift: ,
    shareGift1: ,
}