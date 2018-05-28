import { connect } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import { Row, Col, message } from 'antd';
import {throttle } from 'lodash';
import { checkPermission } from '../../../helpers/util';
import { CrmLogo } from './CrmOperation';
import GiftCfg from '../../../constants/Gift';
import Moment from 'moment';
import GiftAddModalStep from './GiftAddModalStep';
import GiftAddModal from './GiftAddModal';
import { fetchData, axiosData } from '../../../helpers/util';
import _ from 'lodash';
import Authority from '../../../components/common/Authority';
import {
    emptyGetSharedGifts,
    queryWechatMpInfo,
} from '../_action';
import {
    toggleIsUpdateAC,
} from '../../../redux/actions/saleCenterNEW/myActivities.action';
import { queryUnbindCouponPromotion } from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';

const format = 'YYYY/MM/DD HH:mm:ss';
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
        const contentHeight = document.querySelector('.ant-tabs-tabpane-active').offsetHeight - 40;
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
        // console.log(this.props)
        const value = this.state.gift.value;
        // const releaseENV = HUALALA.ENVIRONMENT == 'production-release';
        // const giftTypes = releaseENV ? GiftCfg.giftType.filter(type => type.value != 100) : GiftCfg.giftType
        const giftTypes = GiftCfg.giftType
        const GiftAdd = (v) => {
            switch (v) {
                case '10':
                case '20':
                case '80':
                case '100':
                case '999':
                case '91':
                case '110':
                case '111':
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
                            </div>
                        </Row>
                    </Col>
                    <Col className="layoutsLineBlock"></Col>
                    <Col className="layoutsContent" style={{ overflow: 'auto', height: this.state.contentHeight || 800 }}>
                        <ul>
                            {giftTypes.map((gift, index) => {
                                return (
                                    //{/* <Authority rightCode="marketing.lipinxin.create" key={gift.value}> */ }
                                    <div>
                                        <a
                                            key={gift.value}
                                            onClick={() => {
                                                if (!checkPermission("marketing.lipinxin.create")) {
                                                    message.warn('您没有新建活动的权限，请联系管理员');
                                                    return;
                                                }
                                                if (gift.value === '110' || gift.value === '111') {
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
