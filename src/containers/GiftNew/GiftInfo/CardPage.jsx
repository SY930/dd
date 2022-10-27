import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Col, Button } from 'antd';
import _ from 'lodash';
import Authority from '../../../components/common/Authority';
import styles2 from '../../SaleCenterNEW/ActivityPage.less';
import PhysicalInterfaceCards from './PhysicalInterfaceCards';
import CardEditPage from './PhysicalInterfaceCards/EditPage';
import CardDetailsModal from './PhysicalInterfaceCards/DetailsModal'
import { CARD_CREATE, } from "../../../constants/authorityCodes";
import { SALE_GROUP_PHYSICALLNTERFACECARDS, SALE_GROUP_ELECTRONICCARDS } from "../../../constants/entryCodes";
import registerPage from '../../../index';
import { getCardTypeList } from './PhysicalInterfaceCards/AxiosFactory';

@registerPage([SALE_GROUP_PHYSICALLNTERFACECARDS, SALE_GROUP_ELECTRONICCARDS])
@connect(mapStateToProps, mapDispatchToProps)
export default class CardPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageType: 'pCard', //pCard - 实体卡, eCard - 电子卡
            type: 'add', //'add' or 'edit' or 'preview'
            detailData: {},
            showEditPage: false,
            reloadList: false,
            cardTypeList: []
        };
    }

    componentWillMount() {
        this.setState({
            pageType: this.props.entryCode === SALE_GROUP_PHYSICALLNTERFACECARDS ? 'pCard' : 'eCard'
        })
    }

    componentDidMount() {
        const { groupID } = this.props.user.accountInfo;
        getCardTypeList(groupID).then((obj) => {
            const { list } = obj;
            this.setState({ cardTypeList: list, });
        });
    }

    togglePage = (pageType = '') => {
        this.setState({ pageType });
    }

    addOrEdit = (type, detailData) => {
        this.setState({
            type, detailData: type === 'add' ? {
                templateType: 'D'
            } : detailData, showEditPage: true
        });
    }

    cancelEditPage = (reloadList) => {
        this.setState({ showEditPage: false, reloadList: !!reloadList });
    }

    upDateParentState = (obj) => {
        this.setState(() => obj)
    }

    handleCloseCardVisible = () => {
        this.setState({ visibleCard: false })
    }

    render() {
        const headerClasses = `layoutsToolLeft ${styles2.headerWithBgColor} ${styles2.basicPromotionHeader}`;
        const { groupID } = this.props.user.accountInfo;
        const { pageType, showEditPage, detailData, type, visibleCard, reloadList, item = {}, cardTypeList } = this.state;


        if (showEditPage && pageType === 'pCard') {
            return (
                <CardEditPage
                    groupID={groupID}
                    disabled={type === 'preview'}
                    detail={detailData}
                    cancelEditPage={this.cancelEditPage}
                    type={type}
                    cardTypeList={cardTypeList}
                />
            )
        }

        return (
            <div className="layoutsContainer" ref={layoutsContainer => this.layoutsContainer = layoutsContainer}>
                <div className="layoutsTool" style={{ height: '64px' }}>
                    <div className={headerClasses}>
                        <span className={styles2.customHeader}>
                            实体卡/电子礼品卡管理
                        </span>
                        <p style={{ marginLeft: 'auto' }}>
                            <Authority rightCode={CARD_CREATE}>
                                <Button
                                    type="ghost"
                                    icon="plus"
                                    className={styles2.jumpToCreateInfo}
                                    style={{ margin: 5 }}
                                    onClick={() => { this.addOrEdit('add') }}
                                >新增卡种类</Button>
                            </Authority>
                        </p>
                    </div>
                </div>
                <Col span={24} className="layoutsLineBlock" />
                <PhysicalInterfaceCards
                    pageType={pageType}
                    groupID={groupID}
                    onGoEdit={this.addOrEdit}
                    upDateParentState={this.upDateParentState}
                    reloadList={reloadList}
                    cardTypeList={cardTypeList}
                />
                {visibleCard && <CardDetailsModal
                    onCancel={this.handleCloseCardVisible}
                    visible={visibleCard}
                    groupID={groupID}
                    item={item}
                    upDateParentState={this.upDateParentState}
                />}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user.toJS(),
    }
}

function mapDispatchToProps(dispatch) {
    return {};
}