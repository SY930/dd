import React from 'react';
import { connect } from 'react-redux';
import GiftDetailTable from './GiftDetailTable';
import registerPage from '../../../index';
import { GIFT_PAGE } from '../../../constants/entryCodes';

import { myActivities_NEW as sale_myActivities_NEW } from '../../../redux/reducer/saleCenterNEW/myActivities.reducer';
import { giftInfoNew as sale_giftInfoNew } from '../_reducers';
import { editGiftInfoNew as sale_editGiftInfoNew } from '../_reducers';
import { promotionDetailInfo_NEW as sale_promotionDetailInfo_NEW } from '../../../redux/reducer/saleCenterNEW/promotionDetailInfo.reducer';
import GiftEditPage from "../components/GiftEditPage";
import Editor from './TicketBag/Editor';

function mapStateToProps(state) {
    return {
        isCreatingOrEditing: state.sale_editGiftInfoNew.get('isCreatingOrEditing'),
        groupID: state.user.getIn(['accountInfo', 'groupID']),
        accountID: state.user.getIn(['accountInfo', 'accountID']),
    }
}

@registerPage([GIFT_PAGE], {
    sale_myActivities_NEW,
    sale_giftInfoNew,
    sale_editGiftInfoNew,
    sale_promotionDetailInfo_NEW,
})
@connect(mapStateToProps)
export default class GiftInfo extends React.Component {
    state = {
        page: '',
    }
    /** 切换页面 不传默认列表页 */
    togglePage = (page = '', detail = null) => {
        this.setState({ page, detail });
    }
    render() {
        const { page, detail } = this.state;
        const {isCreatingOrEditing, groupID, accountID} = this.props;
        if(page==='ticket'){
            return <Editor groupID={groupID} accountID={accountID} detail={detail} togglePage={this.togglePage} />
        }
        if (!isCreatingOrEditing) {
            return (
                <GiftDetailTable togglePage={this.togglePage} />
            )
        } else {
            return (
                <GiftEditPage/>
            )
        }

    }
}
