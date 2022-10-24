/**
 *
 * @description 券批次管理 入口文件
*/

import React, { Component } from 'react';
import registerPage from '../../../index';
import { COUPON_BATCH_MANAGEMENT } from "../../constants/entryCodes";
import CouponBatch from './CouponBatchPage';




@registerPage([COUPON_BATCH_MANAGEMENT], {
})


class CouponBatchInfo extends Component {
        constructor(props) {
                super(props)
        }


        render(){
                return <CouponBatch/>
        }

}




export default CouponBatchInfo;