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
import { getSettleList } from './TicketBag/AxiosFactory';

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
        tabkey: '1',
        settlesOpts: [],
    }
    componentDidMount(){
        const { groupID } = this.props;
        getSettleList({ groupID }).then(list => {
            const settlesOpts = list.map(x => ({ value: `${x.settleUnitID}`, label: x.settleUnitName }));
            this.setState({ settlesOpts });
        })
    }
    /** 切换页面 不传默认列表页 */
    togglePage = (page = '', detail = null, check) => {
        this.setState({ page, detail, check });
    }
    toggleTabs = (tabkey) => {
        this.setState({ tabkey });
    }
    render() {
        const { page, detail, check, tabkey, settlesOpts } = this.state;
        const {isCreatingOrEditing, groupID} = this.props;

        if(page==='ticket'){
            // 券包
            return <Editor groupID={groupID} check={check} settlesOpts={settlesOpts} detail={detail} toggleTabs={this.toggleTabs} togglePage={this.togglePage} />
        }
        if (!isCreatingOrEditing) {
            return (
                <GiftDetailTable tabkey={tabkey} togglePage={this.togglePage} toggleTabs={this.toggleTabs} />
            )
        } else {
            return (
                <GiftEditPage toggleTabs={this.toggleTabs}/>
            )
        }

    }
}
