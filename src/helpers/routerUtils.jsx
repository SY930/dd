import { getStore, getHistory } from '@hualala/platform-base'
import { removeTab, removeCurrentTab } from '../containers/Skeleton/_actions';
import { HOME_PAGE_KEY, LOCAL_PAGE_CONFIG } from './routerConfig';

/**
 * 根据query参数生成query字符串。
 * 注意：空字符串将被省略
 * @param {Object} params query参数
 */
function getQueryString(params = {}) {
    const keys = Object.keys(params);
    if (keys.length === 0) return '';
    return keys.reduce((ret, key) => {
        let val = params[key];
        if (val === '' || val === undefined || val === null) return ret;
        if (typeof val === 'object') val = JSON.stringify(val);
        return ret.concat(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
    }, []).join('&');
}

/**
 * 将query字符串转化为query对象。
 * 默认取当前路径的参数进行解析。
 * @param {String} str query字符串
 */
export function getQueryParams(
    str = window.location.search.slice(1),
) {
    if (!str) return {};
    return str.split('&').reduce((ret, param) => {
        const match = param.match(/^(.+)=(.+)$/);
        if (!match) return ret;
        return {
            ...ret,
            [decodeURIComponent(match[1])]: decodeURIComponent(match[2]),
        };
    }, {});
}

// TO DO
// function checkDataPermission(orgID) {}

// TO DO
/**
 * 检查页面权限
 * @param {String} menuID 页面ID
 */
export function checkPagePermission(menuID = '') {
    if (LOCAL_PAGE_CONFIG[menuID]) return true;
    return false;
}

/**
 * 将路由参数转化为URL
 * @param {Object} params
 */
export function encodeUrl(params = {}) {
    const store = getStore().getState()
    const { user } = store
    const $viewpointID = user.get('viewpointID');
    const $activeTab = user.get('activeTab');
    const $orgID = user.get('orgID');
    const {
        viewpointID = $viewpointID,
        menuID = '',
        pageID = '',
        ...otherParams
    } = params;
    const queryParams = {
        orgID: $orgID,
        ...otherParams,
    };
    const queryString = getQueryString(queryParams);
    // 通过 entryCode(pageID) 获取目标菜单 menuID
    const $pageMenu = pageID ? user.get('menuList').find(($item) => {
        return $item.get('entryCode') === pageID;
    }) : null;
    const pageMenuID = $pageMenu ? $pageMenu.get('menuID') : '';
    // 仅切换视角时，跳转到主页
    let _menuID = pageMenuID || menuID || $activeTab;
    if (viewpointID !== $viewpointID && !menuID && !pageMenuID) {
        _menuID = HOME_PAGE_KEY;
    }

    return `/meta/${viewpointID}/${_menuID}${queryString ? `?${queryString}` : ''}`;
}

/**
 * 通过路由获取视角以及页面信息。
 * 默认取当前路径进行解析。
 * @param {String} path 完整的路由字符串
 */
export function decodeUrl(
    path = `${window.location.pathname}${window.location.search}`,
) {
    const match = path.match(/^\/meta\/([^?]+)\/([^?]+)(\?(.*))?$/);
    if (!match) return null;
    const [, viewpointID, menuID, , queryString] = match;
    const queryParams = getQueryParams(queryString);
    const store = getStore().getState()
    const { user } = store
    const $menu = user.get('menuList').find($item => $item.get('menuID') === menuID);
    const menuInfo = $menu ? $menu.toJS() : {};
    return {
        viewpointID,
        menuID,
        orgID: user.get('orgID'),
        shopID: user.get('shopID'),
        ...menuInfo,
        ...queryParams,
    };
}

/**
 * 传入指定的路由参数以跳转到指定的页面
 * @param {Object} params 路由参数
 */
export function jumpPage(params = {}) {
    const url = encodeUrl(params);
    getHistory().push(url);
}

/**
 * 返回我的桌面
 */
export function goHome() {
    const url = encodeUrl({ menuID: HOME_PAGE_KEY });
    getHistory().push(url);
}

/**
 * 关闭页面，不传入页面 ID 时默认关闭当前页面
 */
export function closePage(key) {
    getStore().dispatch(
        key ? removeTab(key) : removeCurrentTab()
    );
}
