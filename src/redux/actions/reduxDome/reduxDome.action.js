export const REDUX_DOME_DATA = 'redux::redux dome data';
export const CHANGE_REDUX_DOME_ONE = 'REDUX::change redux dome one';

export const reduxDomeData = (opts) => {
    return {
        type: REDUX_DOME_DATA,
        payload: opts,
    }
}

export const changgeReduxDomeOne = (opts) => {
    return {
        type: CHANGE_REDUX_DOME_ONE,
        payload: opts,
    }
}
