import { combineEpics } from 'redux-observable';
import { queryOccupiedWeiXinAccountsEpic, queryOccupiedDouYinAccountsEpic } from "../actions/saleCenterNEW/queryWeixinAccounts.action";
const rootEpic = combineEpics(
    queryOccupiedWeiXinAccountsEpic,
    queryOccupiedDouYinAccountsEpic
);
export default rootEpic;
