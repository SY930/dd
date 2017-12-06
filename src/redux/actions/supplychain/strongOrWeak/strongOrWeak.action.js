import { fetchData } from '../../../../helpers/util';

export const GET_CHAIN_TYPE_SUCCESS = 'supplychain_get_chain_type_sucess'
export function getChainType() {
    return (dispatch) => {
        return fetchData('rightsList', {}, null, { path: null }).then((res) => {
            const modules = res.data.authModule.groupAuthModules.modules;
            modules.forEach((value) => {
                if (value.appOrModuleCode === 'LIANSUO_GONGYINGLIAN' && value.appAuthStatus === 1) { // 强连锁
                    dispatch({
                        type: GET_CHAIN_TYPE_SUCCESS,
                        payload: '1',
                    })
                } else if (value.appOrModuleCode === 'MENDIAN_KUCUN' && value.appAuthStatus === 1) { // 弱连锁
                    dispatch({
                        type: GET_CHAIN_TYPE_SUCCESS,
                        payload: '2',
                    })
                }
            })
        })
    }
}
