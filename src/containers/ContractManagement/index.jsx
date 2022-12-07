/**
 *
 * @description 合同管理 入口文件
*/

import React, { Component } from 'react';
import registerPage from '../../../index';
import { CONTRACT_MANAGEMENT } from "../../constants/entryCodes";
import ContractPage from './ContractPage';




@registerPage([CONTRACT_MANAGEMENT], {
})


class ContractInfo extends Component {
        constructor(props) {
                super(props)
        }


        render(){
                return <ContractPage/>
        }

}




export default ContractInfo;