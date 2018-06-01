import fetch from 'isomorphic-fetch';
import axios from 'axios';
import ReactDOM from 'react-dom';
import { Modal } from 'antd';
import _ from 'lodash';
import $ from 'jquery';
import uuid from 'uuid/v4'
import { getStore } from '@hualala/platform-base'

import getApiConfig from './callserver';

/* eslint-disable */
/**
 * 将fetch函数的response转化为json格式
 */
export const toJSON = response => {
    // warning(condition, ``, 1)
    const code = response.status;
    const message = response.statusText;

    switch (code) {
        case 500:
            throw { code, message: '服务器可能生病啦! 医生正快速治疗，家属稍安勿躁喔。^0^' };
        case 404:
            throw { code, message: '快递员不幸走失 ~ 正在紧急联系他 - -.', };
        case 200:
            return response.json();
        default:
            return { code, message };
    }
    // if (code === 500 || code === 404) throw new Error({ code, message });
    // return code === 200 ? response.json() : { code, message };
}

/**
 * 提供fetch函数的第二个参数
 * 如果参数缺header的化自动补全
 */

export const genFetchOptions = (method, headers, paramsObj) => {
    let _headers = headers, _paramsObj = paramsObj

    if (paramsObj === undefined) {
        _paramsObj = headers
        _headers = {
            'content-type': 'application/json',
            'groupID': getAccountInfo().groupID,
            'traceID': uuid()
        }
    }
    if ('get' == method) {
        return {
            method,
            headers: _headers,
            credentials: 'include',
        }
    }
    else {
        return {
            method,
            headers: _headers,
            body: JSON.stringify(_paramsObj),
            credentials: 'include',
        }
    }

}

/**
 * 生成一个redux可用的action对象
 */
export const genAction = (type, payload) => {
    return {
        type,
        payload
    }
}

/**
 * 将对象参数转化为URL参数
 * @param  {object} params 参数对象
 * @return {string}        URL参数字符串
 */
export function genUrlParams(params = {}) {
    return Object.keys(params).map(key => {
        const val = params[key]
        if (Object.prototype.toString.call(val).indexOf('String') !== -1) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(val);
        }
        return encodeURIComponent(key) + '=' + encodeURIComponent(JSON.stringify(val));
    }).join('&');
}

/**
 * 将对象参数转化为POST参数
 * @param  {string} type   数据格式('json'/'form')
 * @param  {object} params 参数对象
 * @return {string|object} 参数字符串或FormData对象
 */
function genPostParams(type, params = {}) {
    const _type = type.toUpperCase();
    if (type === 'JSON') return JSON.stringify(params);
    if (type === 'FORM') {
        const formData = new FormData();
        Object.keys(params).forEach(key => {
            formData.append(key, params[key]);
        });
        return formData;
    }
    return genUrlParams(params);
}

/**
 * 从 Redux Store 中获取登录账户的信息
 * @return {Object} 账户信息
 */
function getAccountInfo() {
    // if (!process.env.__CLIENT__) return {};
    const state = getStore().getState();
    return state.user.get('accountInfo').toJS();
}

/**
 * 解析后台响应是否正常
 * @param  {Object} rsp 响应
 * @param {String} successCode
 * @return {Object} { success:Boolean, code:String, msg:String }
 */
export function parseResponseJson(rsp, successCode) {
    const resultcode = rsp.resultcode === undefined ? rsp.code : rsp.resultcode;
    const resultmsg = rsp.resultmsg === undefined
        ? (rsp.msg === undefined ? rsp.message : rsp.msg)
        : rsp.resultmsg;
    const isSuccess = rsp.success !== undefined ? rsp.success : (resultcode === successCode);
    const doRelogin = resultcode === '0011111100000001'
        || resultcode === 'RELOGIN001'
        || resultcode === 'FP10005';
    // const redirectUrl = doRelogin && (rsp.data && rsp.data.redirectUrl || '').replace(
    //   /^(.+redirectURL=).+$/, `$1${window.location.origin}`);
    return {
        success: isSuccess,
        code: resultcode,
        msg: doRelogin ? '会话失效,请重新登录' : resultmsg || rsp.statusText || '网络错误，请稍后重试',
        redirect: doRelogin
    };
}

/**
 * 接口请求通道锁
 */
const _channelUtils = (function () {
    const _fakePromise = {
        then: () => _fakePromise,
        catch: () => { },
    };
    let _choked = [];
    return {
        lock: (name, fn) => {
            const channel = _choked.find(ch => ch === name);
            if (channel) {
                console.error(`fetchData: channel '${name}' is busy.`);
                return _fakePromise;
            }
            _choked.push(name);
            return fn();
        },
        unlock: (name) => {
            _choked = _choked.filter(ch => ch !== name);
        },
    };
}());

/**
 * 组装 fetch 函数的调用参数
 * @param  {[type]} api    [description]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
export function genFetchArguments(api, params) {
    const { url, options: { method, type, credentials } } = getApiConfig(api);
    const _method = method.toUpperCase();
    const _type = type.toUpperCase();
    const getContentType = (type) => {
        let contentType = 'application/x-www-form-urlencoded;charset=UTF-8';
        if (type === 'JSON') contentType = 'application/json;charset=UTF-8';
        if (type === 'FORM') contentType = '';
        return contentType ? { 'content-type': contentType } : {};
    };
    const _url = _method == 'GET' ? (url + '?' + genUrlParams(params)) : url;
    const headers = { ...getContentType(_type), 'groupID': params.groupID, 'traceID': uuid() };
    const body = _method == 'POST' ? { body: genPostParams(_type, params) } : {};
    return { url: _url, method: _method, headers, credentials, ...body };
}

/**
 * 封装的 fetch 方法
 * !!This method can only be called on client side!!
 *
 * @param  {String}   api     API name, should be defined in './callserver.jsx'.
 * @param  {Object}   params  Request parameters.
 * @param  {Any}      cache   Use local cache without a remote request.
 * @param  {Object}   options See as follows.
 * @return {Promise}
 */
export function fetchData(api, params, cache, {
    delay = 0,              // delay for cached data
    path = 'data.records',  // path for response
    throttle = 500,         // wait time for frequent ajax request; pass false to turn off
    disablePrompt = false,
    successCode = '000'
} = {}, opts = {}) {
    const channel = `${api}_${JSON.stringify(params)}`;
    const actionFn = () => new Promise((resolve, reject) => {
        // use cache
        if (cache !== undefined && cache !== null) {
            return _.delay(() => {
                resolve(cache);
                _channelUtils.unlock(channel);
            }, delay);
        }

        // fetch data from remote server
        const { groupID } = getAccountInfo();
        const reqParams = {
            ...(groupID ? { groupID, _groupID: groupID } : {}),
            ...params,
        };
        const { url, ...options } = genFetchArguments(api, reqParams);
        fetch(url, options).then(response => {
            // unlock channel
            _.delay(_channelUtils.unlock, throttle, channel);

            if (response.status >= 200 && response.status < 300) {
                return response.json();
            } else {
                let error = new Error(response.statusText);
                error.response = response;
                throw error;
            }
        }).then(json => {
            const { redirect, success, code, msg } = parseResponseJson(json, successCode);
            if (!success) {
                if (!redirect && opts.needThrow) {
                    return Promise.reject();
                }
                !disablePrompt && Modal.error({
                    title: '啊哦！好像有问题呦~~',
                    content: `${msg}`,
                });
                redirect && window.setTimeout(() => doRedirect(), 1500);
                reject({ code, msg, response: json });
            }
            if (!path) resolve(json);
            else {
                const paths = path.split('.');
                const data = paths.reduce((ret, path) => {
                    if (!ret) return ret;
                    return ret[path];
                }, json);
                resolve(data);
            }
        }).catch(error => {
            reject(error);
        });
    });
    if (throttle === false) return actionFn();
    return _channelUtils.lock(channel, actionFn);
}

/**
 * 异步处理表单，返回一个 Promise 对象
 * 可以传入 form 数组迭代处理
 * @param  {antd form} form antd form 对象，可通过 Form.create 获取
 * @return {Promise}
 */
export function asyncParseForm(form) {
    const forms = form instanceof Array ? form : [form];
    return forms.reduce((pr, form) => {
        return pr.then(({ error, values }) => new Promise(resolve => {
            if (!form) return resolve({ error, values });
            form.validateFieldsAndScroll((err, vals) => {
                resolve({
                    error: error || err,
                    values: { ...values, ...vals }
                });
            });
        }));
    }, Promise.resolve({
        error: null,
        values: {}
    }));
}

/**
 * 格式化字符串
 * @param {string} text 待格式化的字符串
 */
export function encodeText(text) {
    if (!text || typeof text !== 'string') return '';
    return text.trim().replace(/[\n]/g, '<br/>');
}

/**
 * 解析字符串
 * @param {string} text 待解析的字符串
 */
export function decodeText(text) {
    if (!text || typeof text !== 'string') return '';
    return text.replace(/<br\/>/g, '\n');
}

/**
 * 将原始数据解析成组件可以使用的数据，配合 BaseForm 组件使用
 * @param  {object} itemsCfg 表单域配置
 * @param  {object} data     原始数据
 * @return {object}          解析后的数据，可直接传给 BaseForm 组件
 */
export function parseFormData(itemsCfg, data = {}) {
    return _.mapValues(data, (value, key) => {
        const itemCfg = itemsCfg[key] || {};
        switch (itemCfg.type) {
            case 'combo':
                return itemCfg.multiple === true ? value && value.split(',') || [] : value;
            case 'checkbox':
                const { splitter = ',' } = itemCfg;
                return value ? value.split(splitter) : [];
            case 'switcher':
                const { onValue = '1' } = itemCfg;
                return value == onValue;
            case 'text':
            case 'textarea':
                return decodeText(value);
            case 'combo':
                return value + '';
            default:
                return value;
        }
    });
}

/**
 * 将表单数据格式化为提交数据
 * @param  {object} itemsCfg 表单域配置
 * @param  {object} data     从表单获取的数据
 * @return {object}          格式化后的数据
 */
export function formatFormData(itemsCfg, data = {}) {
    return _.mapValues(data, (value, key) => {
        const itemCfg = itemsCfg[key] || {};
        switch (itemCfg.type) {
            case 'combo':
                return itemCfg.multiple === true ? value && value.join(',') || '' : value;
            case 'checkbox':
                const { splitter = ',' } = itemCfg;
                return value ? value.join(splitter) : '';
            case 'switcher':
                const { onValue = '1', offValue = '0' } = itemCfg;
                return value ? onValue : offValue;
            case 'text':
            case 'textarea':
                return encodeText(value);
            default:
                return value !== undefined ? value : '';
        }
    });
}

/**
 * 将日期字符串分格为年/月/日
 * @param  {object} str 日期字符串
 * @param  {object} l
 * @return {object} sp 格式化后的数据分隔符
 */
export function formatDateStr(str = '', l = 8, sp = '/') {
    let ln = str.length;
    if (ln < 8) return '';
    let ret = [str.substr(0, 4), str.substr(4, 2), str.substr(6, 2)].join(sp);
    if (l == 12 && ln >= 12)
        ret += ' ' + str.substr(8, 2) + ':' + str.substr(10, 2);
    else if (l == 14) {
        if (ln >= 12)
            ret += ' ' + str.substr(8, 2) + ':' + str.substr(10, 2);
        if (ln >= 14)
            ret += ':' + str.substr(12, 2);
    }
    return ret;
}


/**
 * @description : Generate corresponding x-www-form-urlencoded supported format from Object.
 *
 * */

export function generateXWWWFormUrlencodedParams(opts) {

    if (!(opts instanceof Object || typeof opts === 'object')) {
        throw new Error(`'opts' must be type of 'object'.`);
    }

    let params = Object.keys(opts)
        .filter((key) => {
            return !(null == opts[key] || undefined == opts[key])
        })
        .map((key) => {
            let value = opts[key];
            if (value instanceof Object || typeof value === 'object') {
                value = JSON.stringify(value);
            }
            return encodeURIComponent(key) + '=' + encodeURIComponent(value)
        }).join('&');

    return params;
}

/**
 * 获取字符串字节数
 * @param  {string} str 字符串
 */
export function getByteLength(string) {
    let b = 0,
        str = _.isString(string) ? string : String(string),
        l = str.length;
    if (l) {
        for (let s of str) {
            if (s.codePointAt(0) > 255) {
                b += 2;
            } else {
                b++;
            }
        }
        return b;
    } else {
        return 0;
    }
}


/*
* 重定向
* */

// const PROD_ENV_URL = {
//     'production-release':'http://passport.hualala.com/login?redirectURL=http%3A%2F%2Fshop.hualala.com/',
//     'production-pre':'http://pre.login.hualala.com/login?redirectURL=http%3A%2F%2Fpre.shop.hualala.com/',
//     'production-mu':'http://mu.passport.login.hualala.com/login?redirectURL=http%3A%2F%2Fmu.shop.hualala.com/',
//     'production-dohko-sc':'http://dohko.login.hualala.com:31251/login?redirectURL=http%3A%2F%2Fdohko.sc.shop.hualala.com/',
//     'production-dohko-crm':'http://dohko.login.hualala.com:31251/login?redirectURL=http%3A%2F%2Fdohko.scm.shop.hualala.com/',
//     'production-dohko-bp':'http://dohko.login.hualala.com:31251/login?redirectURL=http%3A%2F%2Fdohko.bp.shop.hualala.com/',
//     'production-dohko-hr':'http://dohko.login.hualala.com:31251/login?redirectURL=http%3A%2F%2Fdohko.hr.shop.hualala.com/',
//     'production-dohko':'http://dohko.login.hualala.com:31251/login?redirectURL=http%3A%2F%2Fdohko.shop.hualala.com/',
// }

export const PASSPORT_URL = {
    'mu': 'http://mu.passport.login.hualala.com',
    'dohko': 'http://dohko.login.hualala.com:31251',
    'pre': 'http://pre.login.hualala.com',
    'release': 'http://passport.hualala.com',
    'vip': 'http://passport.hualala.com',
    'kr': 'http://passport.hualala.com',
};

export function doRedirect() {
    const host = window.location.host;
    const match = host.match(/^((\w+)\.)?.*shop\.hualala\.com$/);
    const env = match ? (match[2] || 'release') : 'dohko';
    const passportUrl = PASSPORT_URL[env] || PASSPORT_URL.release;
    window.location = `${passportUrl}/login?redirectURL=http%3A%2F%2F${host}`;
}

export function Focus(dom, callback) {
    if (process.env.__CLIENT__ === true) {
        if (dom) {
            let index = 0
            let initFlag = true;
            document.onkeydown = (eve) => {
                if (eve.keyCode === 13) {
                    let inputlist = $(dom).find(":input");
                    if (initFlag) {
                        inputlist.map((i, item) => {
                            item.onfocus = () => {
                                index = i + 1;
                            }
                        })
                        initFlag = false;
                    }
                    if (index < inputlist.length) {
                        let Dom = $(inputlist[index]);
                        if (Dom[0].tagName.toLowerCase().indexOf("input") !== -1) {
                            Dom.trigger("click");
                            Dom[0].focus();
                        }
                        else {
                            let input = Dom.find(":input");
                            if (input[0]) {
                                input.trigger("click");
                                input[0].focus();
                            }
                        }
                        //index++
                    } else {
                        callback();
                        initFlag = true;
                    }
                }
            }
        }
    }
}
export function enterKeyHandler(dom, callback) {
    if (process.env.__CLIENT__ === true) {
        window.focusIndex = 0;
        $(dom).on("keydown", '.enter-focus', function (e) {
            let index = -1,
                enterfocusEls = $(dom).find('.enter-focus').not(':disabled'),
                meEl = $(e.currentTarget),
                nextFocusEl = "";

            if (e.keyCode == 13) {
                index = enterfocusEls.index(meEl);
                nextFocusEl = enterfocusEls.eq(index + 1);
                window.focusIndex = index + 1;
                if (nextFocusEl.hasClass('enter-focus-antd-select')) {
                    nextFocusEl.find("input").click();
                } else {
                    nextFocusEl.focus().select();
                }
                if (meEl.hasClass("add-row") && !$(dom).find(".ant-table-tbody tr").length || meEl.hasClass("add-row-sure")) {
                    callback();
                    $(dom).find('.enter-focus').eq(window.focusIndex).find("input").click().select();
                }
            }
        });
    }
}

export function enterKeyHandlerLeftTable(dom, rightTableFocusNum) {
    if (process.env.__CLIENT__ === true) {
        window.rightFocusIndex = 0;
        $(dom).on("keydown", '.left-enter-focus', function (e) {
            if (e.keyCode == 13) {
                let closestTr = $(e.target).closest("tr");
                let allTrEl = $(e.target).closest("tbody").find("tr");
                let index = allTrEl.index(closestTr);
                window.rightFocusIndex = index * rightTableFocusNum;
            }
        });
    }
}
/* eslint-enable */

/**
 * Uses a binary search to find the first element in a list.
 * @param {Array} array List where to apply the search.
 * @param {Any} value Target search value.
 * @param {Function} iteratee Custom predicator.
 */
function sortedFindBy(
    array = [],
    value = '',
    iteratee = item => item,
) {
    const findIdx = _.sortedIndexBy(array, value, iteratee);
    const findResult = array[findIdx];
    if (findResult && iteratee(findResult) === iteratee(value)) return findResult;
    return null;
}

const getRightListFromRedux = (() => {
    let $cachedFuncPermissions = null;
    let cachedRightList = null;
    return () => {
        const { user } = getStore().getState()
        const $funcPermissions = user.getIn(['accountInfo', 'funcPermissions']);
        if ($cachedFuncPermissions !== $funcPermissions) {
            $cachedFuncPermissions = $funcPermissions;
            cachedRightList = $funcPermissions ? $funcPermissions.toJS() : [];
        }
        return cachedRightList;
    };
})();

/**
 * 检查当前账户是否具有该权限
 * @param {String} rightCode 权限编码，多个编码用逗号隔开，有任一权限即可通过检查
 * @return {Boolean}
 */
export function checkPermission(rightCode) {
    const rightList = getRightListFromRedux();
    if (!rightCode || !rightList || !rightList.length) return false;
    const rightCodes = rightCode.split(',');
    return !!rightCodes.find(
        code => !!sortedFindBy(rightList, { rightCode: code }, right => right.rightCode)
    );
}

export function authorityFunc(user, rightCode) {
    return checkPermission(rightCode);
}

/**
 * 判断一个对象是否与一个检索字符串匹配。
 * 对象有两个可选的域值:
 *   - name:String 中文名称
 *   - py:String 拼音名称，例如“拼音”格式为 pin;yin;py;
 * @param {Object} item 具有 name 和 py 属性的对象
 * @param {String} search 目标匹配字符串
 * @return {Boolean}
 */
export function pyMatch({ name = '', py = '' }, search = '') {
    if (!search) return true;
    const len = search.length;
    const pyParts = py.slice(0, -1).split(';');
    const quanpin = pyParts.slice(0, -1).reduce((ret, val, idx, arr) => {
        return ret.concat(arr.slice(idx).join(''));
    }, []);
    const jianpin = pyParts.slice(-1).join('');
    return (name.indexOf(search) !== -1
        || jianpin.indexOf(search) !== -1
        || !!quanpin.find(spell => spell.substr(0, len) === search)
    );
}

/**
 * 调整滚动条的封装方法
 * @param  {Object}   dom 父节点
 * @param  {Object}   value 设置高度 正常设置为115像素
 */
export function onWindowResize(dom, value) {
    const parentDoms = ReactDOM.findDOMNode(dom);
    if (parentDoms !== null) {
        const parentHeight = parentDoms.offsetHeight;
        const contentrDoms = parentDoms.querySelectorAll('.layoutsContent');
        if (undefined !== contentrDoms && contentrDoms.length > 0) {
            const layoutsContent = contentrDoms[0];
            const headerDoms = parentDoms.querySelectorAll('.layoutsHeader');
            const headerHeight = headerDoms[0].offsetHeight;
            layoutsContent.style.height = `${parentHeight - headerHeight - 10}px`;
            const tableHeight = layoutsContent.offsetHeight - value;
            return tableHeight;
        }
    }
}

/**
 * 通过文件链接下载文件
 * @param {string} url 文件链接地址
 * @param {string} filename 文件名
 */
export function downloadFile(url = '', filename = '') {
    const a = document.createElement('a');
    a.href = url;
    a.style = 'display:none';
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
}

export const generateUniqID = uuid

// 封装营销专用的axios
// axios.post('/api/v1/universal', {
//     service: 'HTTP_SERVICE_URL_PROMOTION_NEW',
//     method: '/gift/add.ajax',
//     type: 'post',
//     data: { ...params, groupName, groupID: this.props.gift.data.groupID }
// })
//     .then(data => console.log(data)).catch(err => console.log(err))

export function axiosData(api, params, opts, {
    path = 'data.records',  // path for response
} = {}, domain = 'HTTP_SERVICE_URL_CRM') {
    const { groupID } = getAccountInfo();
    const reqParams = {
        ...(groupID ? { groupID, _groupID: groupID } : {}),
        ...params,
    };
    return axios.post('/api/v1/universal', {
        service: domain, //? domain :'HTTP_SERVICE_URL_CRM', //'HTTP_SERVICE_URL_PROMOTION_NEW'
        method: api,
        type: 'post',
        data: reqParams
    })
        .then(json => {
            const { code, message } = json;
            if (code !== '000') {
                const {redirect, msg} = parseResponseJson(json, '000');
                if (!redirect && opts && opts.needThrow) {
                    return Promise.reject(msg);
                }
                Modal.error({
                    title: '啊哦！好像有问题呦~~',
                    content: `${msg}`,
                });
                redirect && window.setTimeout(() => doRedirect(), 1500);
                return Promise.reject({ code, message, response: json });
            }
            if (!path) {
                console.log(json);
                return Promise.resolve(json);
            }
            else {
                const paths = path.split('.');
                const data = paths.reduce((ret, path) => {
                    if (!ret) return ret;
                    return ret[path];
                }, json);
                return Promise.resolve(data);
            }
        })
        .catch(error => {
            return Promise.reject(error);
        });
}
