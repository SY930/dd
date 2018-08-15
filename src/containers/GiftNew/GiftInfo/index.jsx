import React from 'react';
import { connect } from 'react-redux';
import GiftDetailTable from './GiftDetailTable';
import registerPage from '../../../index';
import { GIFT_PAGE } from '../../../constants/entryCodes';

import { myActivities_NEW as sale_myActivities_NEW } from '../../../redux/reducer/saleCenterNEW/myActivities.reducer';
import { giftInfoNew as sale_giftInfoNew } from '../_reducers';
import { promotionDetailInfo_NEW as sale_promotionDetailInfo_NEW } from '../../../redux/reducer/saleCenterNEW/promotionDetailInfo.reducer';
import { crmOperation_dkl as sale_crmOperation_dkl } from '../../../redux/reducer/saleCenterNEW/crmOperation.reducer';
import { steps as sale_steps } from '../../../redux/modules/steps';
import GiftEditPage from "../components/GiftEditPage";

function mapStateToProps(state) {
    return {
        isCreatingOrEditing: state.sale_giftInfoNew.get('isCreatingOrEditing')
    }
}

@registerPage([GIFT_PAGE], {
    sale_myActivities_NEW,
    sale_giftInfoNew,
    sale_promotionDetailInfo_NEW,
    sale_crmOperation_dkl,
    sale_steps,
})
@connect(mapStateToProps)
export default class GiftInfo extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {isCreatingOrEditing} = this.props;
        if (!isCreatingOrEditing) {
            return (
                <GiftDetailTable />
            )
        } else {
            return (
                <GiftEditPage/>
            )
        }

    }
}
