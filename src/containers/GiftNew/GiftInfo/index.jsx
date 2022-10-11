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
import { getSettleList,getCardTypeList } from './TicketBag/AxiosFactory';

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
        groupCardTypeList: [],
    }
    componentDidMount(){
        const { groupID } = this.props;
        getSettleList({ groupID }).then(list => {
            const settlesOpts = list.map(x => ({ value: `${x.settleUnitID}`, label: x.settleUnitName }));
            this.setState({ settlesOpts });
        })
        getCardTypeList().then(list => {
            this.setState({ groupCardTypeList: list });
        })
    }
    /** 切换页面 不传默认列表页 */
    togglePage = (page = '', detail = null, check) => {
        this.setState({ page, detail, check });
    }
    toggleTabs = (tabkey) => {
        if(tabkey){
            this.setState({ tabkey });
        }else{
            this.setState({ tabkey: this.state.tabkey });
        }
    }
    render() {
        const { page, detail, check, tabkey, settlesOpts ,groupCardTypeList} = this.state;
        const {isCreatingOrEditing, groupID} = this.props;
        let couponPackageFirstGift=[],couponPackageFollowGift=[];
        if(page==='ticket'){
            if(detail && detail.couponSendWay && detail.couponSendWay == '2'){
                if(detail.couponPackageGiftConfigs && detail.couponPackageGiftConfigs.length > 0){
                    detail.couponPackageGiftConfigs.forEach((item) => {
                        if(item.stage == 1){
                            couponPackageFirstGift.push(item);
                        }else if(item.stage == 0){
                            couponPackageFollowGift.push(item)
                        }
                    })
                    detail['couponPackageFirstGift'] = couponPackageFirstGift;
                    if(couponPackageFirstGift.length > 0 ){
                        // detail['couponPackageGiftConfigs'] = ['1'];
                        detail['couponPackageRadioSelect'] = '2';
                        detail['couponPackageFollowGift'] = couponPackageFollowGift;
                    }else{
                        // detail['couponPackageGiftConfigs'] = ['0'];
                        detail['couponPackageRadioSelect'] = '1';
                        detail['couponPackageGift'] = couponPackageFollowGift;
                    }
                }
            }
            // 券包
            return <Editor groupID={groupID} check={check} settlesOpts={settlesOpts} detail={detail} toggleTabs={this.toggleTabs} togglePage={this.togglePage} groupCardTypeList={groupCardTypeList}/>
        }
        if (!isCreatingOrEditing) {
            return (
                <GiftDetailTable tabkey={tabkey} togglePage={this.togglePage} toggleTabs={this.toggleTabs} />
            )
        } else {
            // _TODO
            // return (
            //     <GiftEditPage toggleTabs={this.toggleTabs}/>
            // )
        }

    }
}
