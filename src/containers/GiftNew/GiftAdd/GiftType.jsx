import { connect } from 'react-redux';
import React from 'react';
import { Row, Col, message, Button } from 'antd';
import {throttle } from 'lodash';
import { checkPermission } from '../../../helpers/util';
import { CrmLogo } from './CrmOperation';
import GiftCfg from '../../../constants/Gift';
import GiftAddModalStep from './GiftAddModalStep';
import GiftAddModal from './GiftAddModal';
import {
    emptyGetSharedGifts,
    queryWechatMpInfo,
} from '../_action';
import {
    toggleIsUpdateAC,
} from '../../../redux/actions/saleCenterNEW/myActivities.action';
import { queryUnbindCouponPromotion } from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import { jumpPage } from '@hualala/platform-base'
import {GIFT_PAGE} from "../../../constants/entryCodes";

class GiftType extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gift: { describe: '', value: '', data: { groupID: this.props.user.accountInfo.groupID } },
            visible: false,
        }
        this.onWindowResize = throttle(this.onWindowResize.bind(this), 100);
    }
    componentWillMount() {
        this.props.queryWechatMpInfo();
    }
    componentDidMount() {
        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize);
    }
    onWindowResize() {
        const contentHeight = document.querySelector('.ant-tabs-tabpane-active').getBoundingClientRect().height - 40;
        this.setState({ contentHeight });
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
    }
    handleAdd(g) {
        this.setState({ visible: true, gift: { ...this.state.gift, ...g } });
    }
    handleCancel() {
        this.setState({ visible: false });
        this.props.emptyGetSharedGifts();
    }
    render() {
        const value = this.state.gift.value;
        const giftTypes = GiftCfg.giftType;
        const GiftAdd = (v) => {
            switch (v) {
                case '10':
                case '20':
                case '80':
                case '100':
                case '21':
                case '91':
                case '110':
                case '111':
                case '115':
                case '22':
                case '81':
                    return <GiftAddModalStep type="add" {...this.state} onCancel={() => { this.handleCancel() }} />;
                case '30':
                case '40':
                case '42':
                case '90':
                    return <GiftAddModal type="add" {...this.state} onCancel={() => this.handleCancel()} />;
            }
        };
        return (
            <div>
                <Row className="layoutsContainer" ref={layoutsContainer => this.layoutsContainer = layoutsContainer}>
                    <Col className="layoutsHeader">
                        <Row className="layoutsTool">
                            <div className="layoutsToolLeft">
                                <h1>新建礼品</h1>
                                <Button
                                    type="ghost"
                                    icon="rollback"
                                    style={{
                                        position: 'absolute',
                                        top: '2px',
                                        left: '100px',
                                    }}
                                    onClick={
                                        () => {
                                            const menuID = this.props.user.menuList.find(tab => tab.entryCode === GIFT_PAGE).menuID
                                            menuID && jumpPage({ menuID })
                                        }
                                    }>返回列表</Button>
                            </div>
                        </Row>
                    </Col>
                    <Col className="layoutsLineBlock"></Col>
                    <Col className="layoutsContent" style={{ overflow: 'auto', height: this.state.contentHeight || 800 }}>
                        <ul>
                            {giftTypes.map((gift, index) => {
                                return (

                                    <div>
                                        <a
                                            key={gift.value}
                                            onClick={() => {
                                                if (!checkPermission("marketing.lipinxin.create")) {
                                                    message.warn('您没有新建活动的权限，请联系管理员');
                                                    return;
                                                }
                                                if (HUALALA.ENVIRONMENT === 'production-release' && (gift.value === '110' || gift.value === '111')) {
                                                    message.success('敬请期待~');
                                                    return;
                                                }
                                                this.props.toggleIsUpdate(true)
                                                this.handleAdd(gift)
                                            }}
                                        >
                                            <CrmLogo background={gift.color} tags={gift.tags} describe={gift.describe} index={index}>{gift.name}</CrmLogo>
                                        </a>
                                    </div>
                                    //{/* </Authority> */}
                                )
                            })}
                        </ul>
                    </Col>
                </Row>
                {GiftAdd(value)}
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
    return {
        emptyGetSharedGifts: opts => dispatch(emptyGetSharedGifts(opts)),
        toggleIsUpdate: (opts) => {
            dispatch(toggleIsUpdateAC(opts))
        },
        queryUnbindCouponPromotion: (opts) => dispatch(queryUnbindCouponPromotion(opts)),
        queryWechatMpInfo: () => dispatch(queryWechatMpInfo()),
    };
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GiftType)
