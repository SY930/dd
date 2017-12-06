
const PROD_ENV_BASEURL = {
    'production-release': 'http://shop.hualala.com',
    'production-pre': 'http://pre.shop.hualala.com',
    'production-mu': 'http://mu.shop.hualala.com',
    'production-dohko-sc': 'http://dohko.sc.shop.hualala.com',
    'production-dohko-crm': 'http://dohko.crm.shop.hualala.com',
    'production-dohko-bp': 'http://dohko.bp.shop.hualala.com',
    'production-dohko-hr': 'http://dohko.hr.shop.hualala.com',
    'production-dohko': 'http://dohko.shop.hualala.com',
}

export const HTTP_SERVICE_BASEURL = PROD_ENV_BASEURL[process.env.NODE_ENV];

const env = {
    HTTP_CONTENT_TYPE: {
        JSON: 'application/json',
        MULTIFORM: 'multipart/form-data',
        HTML: 'text/html',
        WWWFORM: 'application/x-www-form-urlencoded',
    },

    // 静态文件根路径
    HTTP_SCRIPT_BASEURL: `${HTTP_SERVICE_BASEURL}/static`,

    // 文件服务器地址
    FILE_RESOURCE_DOMAIN: 'http://res.hualala.com',

    HTTP_REDIRECTION: process.env.NODE_ENV === 'production' ?
        'http://mu.passport.login.hualala.com/login?redirectURL=http%3A%2F%2Fdohko.salecenter.hualala.com/' :
        'http://mu.passport.login.hualala.com/login?redirectURL=http%3A%2F%2Fdev.salecenter.hualala.com:8083/',
    /* // 关于用户的ajax接口
     HTTP_USER_LOGIN: gen('/login/authorize.do?terminaltype=PC'),
     HTTP_USER_COR_ACC: gen('/login/getCorpAccounts.do'), */

    // merchant static files
    MERCHANT_ROOT_PATH: '/asset',
    MERCHANT_IMG_PATH: '/asset/img',
}

if (process.env.NODE_ENV === 'production') {
    Object.assign(env, {
        HTTP_SCRIPT_BASEURL: '',
    })
}

export default env

export const combine = (service, url) => {
    const _service = service[service.length - 1] === '/' ? service : `${service}/`;
    const _url = url[0] === '/' ? url.substr(1) : url;
    return `${_service}${_url}`
}

function gen(url) {
    return combine('/api-unsure', url)
}
