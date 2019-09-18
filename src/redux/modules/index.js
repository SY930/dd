import { combineEpics } from 'redux-observable';
import {queryOccupiedWeiXinAccountsEpic} from "../actions/saleCenterNEW/queryWeixinAccounts.action";
const rootEpic = combineEpics(
    queryOccupiedWeiXinAccountsEpic
);
export default rootEpic;
