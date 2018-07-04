/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-04-09T10:01:11+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: index.js
 * @Last modified by:   xf
 * @Last modified time: 2017-06-19T10:53:33+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */


import { combineEpics } from 'redux-observable';
import {queryOccupiedWeiXinAccountsEpic} from "../actions/saleCenterNEW/queryWeixinAccounts.action";
const rootEpic = combineEpics(
    queryOccupiedWeiXinAccountsEpic
);
export default rootEpic;
