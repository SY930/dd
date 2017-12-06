import Immutable from 'immutable'
import { isFunction, findIndex } from 'lodash'

// 用户登陆
export const PLATFORM_UI_STEPS_SET_INFO = 'PLATFORM_UI_STEPS_SET_INFO'


const $$initialState = Immutable.fromJS({
    stepInfo: '',
});

export function steps($$state = $$initialState, action) {
    switch (action.type) {
    /* case 'PLATFORM_UI_TAB_ADD':
     let key = `newTab${newTabIndex}`,
     newTabItem = {...action.value, key: key};//title: title, index: index, content: content
     return $$state
     /!*.update('panes',panes => {
     const _panes = Immutable.Iterable.prototype.isPrototypeOf(panes) ? panes.toJS() : panes;
     //console.log('panes push');
     let index = findIndex(_panes, ['index', newTabItem.index]);
     if (index === -1) {
     _panes.push(newTabItem);
     newTabIndex++;
     }
     else {
     key = _panes[index].key;
     }
     return _panes
     })
     .merge({activeKey : key,newTabIndex : newTabIndex,tabflag : true});*!/
     break; */
        case PLATFORM_UI_STEPS_SET_INFO:
            console.log('yyy', action.stepInfo);
            return $$state
                .merge({ stepInfo: action.stepInfo });
            break;
        default :
            return $$state;
    }
}

export function setStepInfo(value) {
    return ((dispatch) => {
        dispatch({
            type: PLATFORM_UI_STEPS_SET_INFO,
            stepInfo: value,
        })
    })
}
