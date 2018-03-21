import { connect } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import { Row, Col, message } from 'antd';
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
    }
    componentWillMount() {
        this.getData();
        this.props.queryWechatMpInfo();
    }
    componentDidMount() {
        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize);
    }
    onWindowResize = () => {
        const contentHeight = document.querySelector('.ant-tabs-tabpane-active').offsetHeight - 40;
        this.setState({ contentHeight });
    }
    getData(params = {}) {
        const { user } = this.props;
        params.groupID = user.accountInfo.groupID;
        axiosData('/coupon/couponService_getBoards.ajax', params, null, { path: 'data' }).then((gifts) => {
            // console.log('gifts,', gifts);
            if (gifts === undefined) {
                return;
            }
            const newDataSource = gifts.map((g, i) => {
                g.key = i + 1;
                g.giftType = String(g.giftType);
                g.giftTypeName = _.find(GiftCfg.giftTypeName, { value: String(g.giftType) }).label;
                g.createStamp = g.createStamp == 0 ? '————/——/—— ——:——:——' : Moment(g.createStamp).format(format);
                g.actionStamp = g.actionStamp == 0 ? '————/——/—— ——:——:——' : Moment(g.actionStamp).format(format);
                g.operateTime = <div>{g.createStamp}<br />{g.actionStamp}</div>;
                g.createBy = g.createBy == undefined ? '——  ——' : '——  ——';
                g.operator = `${g.createBy} / ${g.createBy}`;
                g.giftRule = g.giftRule.split('</br>');
                g.num = i + 1;
                g.usingTimeType = g.usingTimeType.split(',');
                g.supportOrderTypes = g.supportOrderTypes ? g.supportOrderTypes.split(',') : [];
                g.shopNames = g.shopNames === undefined ? '不限' : g.shopNames;
                return g;
            });
            this.setState({ dataSource: [...newDataSource] }, () => {
                // console.log('this.state', this.state);
            })
        });
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
                                                this.props.toggleIsUpdate(true)
                                                this.handleAdd(gift)
                                            }}
                                        >
                                            <CrmLogo background={gift.color} describe={gift.describe} index={index}>{gift.name}</CrmLogo>
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
