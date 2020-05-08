import React from 'react';
import { connect } from 'react-redux';
import { throttle } from 'lodash';
import registerPage from '../../index';
import styles from '../SaleCenterNEW/ActivityPage.less'
import selfStyle from './style.less'
import { jumpPage } from '@hualala/platform-base'
import {
    Modal,
    Row,
    Col,
    message,
    Button,
} from 'antd';
import { checkPermission } from '../../helpers/util';
import {
    WECHAT_MALL_ACTIVITIES,
} from '../../constants/promotionType';
import { saleCenter_NEW as sale_saleCenter_NEW } from '../../redux/reducer/saleCenterNEW/saleCenter.reducer';
import { ActivityLogo } from '../SaleCenterNEW/ActivityLogo/ActivityLogo';
import ActivityMain from './WeChatMaLLActivityMain';
import Authority from './../../components/common/Authority';
import {
    saleCenterResetBasicInfoAC,
    saleCenterSetBasicInfoAC,
} from '../../redux/actions/saleCenterNEW/promotionBasicInfo.action';
import {
    saleCenterResetScopeInfoAC,
} from '../../redux/actions/saleCenterNEW/promotionScopeInfo.action';
import {
    saleCenterResetDetailInfoAC,
    getMallGoodsAndCategories,
} from '../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import {
    toggleIsUpdateAC,
} from '../../redux/actions/saleCenterNEW/myActivities.action';
import {WECHAT_MALL_CREATE, WECHAT_MALL_LIST} from "../../constants/entryCodes";
import {BASIC_PROMOTION_CREATE} from "../../constants/authorityCodes";
import NewPromotionCard from '../NewCreatePromotions/NewPromotionCard'
import { axiosData } from '../../helpers/util';
import { axios } from '@hualala/platform-base';
import { getStore } from '@hualala/platform-base'

function mapStateToProps(state) {
    return {
        saleCenter: state.sale_saleCenter_NEW,
        user: state.user.toJS(),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setPromotionType: (opts) => {
            dispatch(saleCenterSetBasicInfoAC(opts));
        },
        saleCenterResetBasicInfo: (opts) => {
            dispatch(saleCenterResetBasicInfoAC(opts));
        },
        saleCenterResetScopeInfo: (opts) => {
            dispatch(saleCenterResetScopeInfoAC(opts));
        },
        saleCenterResetDetailInfo: (opts) => {
            dispatch(saleCenterResetDetailInfoAC(opts));
        },
        toggleIsUpdate: (opts) => {
            dispatch(toggleIsUpdateAC(opts))
        },
        getMallGoodsAndCategories: (opts) => {
            dispatch(getMallGoodsAndCategories(opts))
        },
    };
}
@registerPage([WECHAT_MALL_CREATE], {
    sale_saleCenter_NEW,
})
@connect(mapStateToProps, mapDispatchToProps)
class NewActivity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal1Visible: false,
            index: 0,
            contentHeight: document.documentElement.clientHeight || document.body.clientHeight,
            whiteList: [],
        };
        this.onWindowResize = throttle(this.onWindowResize.bind(this), 100);
    }
    componentDidMount() {
        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize);
        this.getWhite();
    }
    getWhite(){
        axiosData(
            'specialPromotion/queryOpenedEventTypes.ajax',
            {},
            { needThrow: true },
            { path: '' },
            'HTTP_SERVICE_URL_PROMOTION_NEW',
        ).then(data => {
            const { eventTypeInfoList = [] } = data;
            this.setState({ whiteList: eventTypeInfoList });
        })
    }
    getAccountInfo() {
        const state = getStore().getState();
        return state.user.get('accountInfo').toJS();
    }
    onClickOpen = async (eventWay) => {
        const state = getStore().getState();
        const { groupID } = state.user.get('accountInfo').toJS();
        const [service, type, api, url] = ['HTTP_SERVICE_URL_PROMOTION_NEW', 'post', 'alipay/', '/api/v1/universal?'];
        const method = '/specialPromotion/freeTrialOpen.ajax';
        const params = { service, type, data: { eventWay, groupID }, method };
        const response = await axios.post(url + method, params);
        const { code, message: msg } = response;
        if (code === '000') {
            message.success('开通成功，欢迎使用！')
            this.getWhite();
            return;
        }
        message.error(msg);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
    }
    onWindowResize() {
        const contentHeight = document.querySelector('.ant-tabs-tabpane-active').getBoundingClientRect().height - 40;
        this.setState({ contentHeight });
    }
    setModal1Visible = (modal1Visible) => {
        this.setState({ modal1Visible });
    }

    clear = () => {
        this.setState({ modal1Visible : false });
    }

    render() {
        return (
            <Row className="layoutsContainer">
                <Col span={24} style={{padding: 0}} className="layoutsHeader">
                    <div style={{height: '79px', backgroundColor: '#F3F3F3'}}>
                        <div className={styles.headerWithBgColor}>
                            <span  className={styles.customHeader}>
                                新建商城活动&nbsp;&nbsp;
                                <Button
                                    type="ghost"
                                    icon="rollback"
                                    onClick={
                                        () => {
                                            const menuID = this.props.user.menuList.find(tab => tab.entryCode === WECHAT_MALL_LIST).menuID
                                            menuID && jumpPage({ menuID })
                                        }
                                    }>返回列表</Button>
                            </span>
                        </div>
                    </div>
                </Col>
                <Col
                    span={24}
                    className="layoutsContent"
                    style={{
                        overflow: 'auto',
                        height: this.state.contentHeight || 800,
                        padding: '10px 10px 30px 30px',
                    }}>
                    <div style={{ paddingBottom: 30 }} className={selfStyle.flexContainer}>
                        {this.renderActivityButtons()}
                    </div>
                    {this.state.modal1Visible ? this.renderModal() : null}
                </Col>
            </Row>

        );
    }


    renderActivityButtons = () => {
        const {whiteList} = this.state;
        return (
            WECHAT_MALL_ACTIVITIES.map((activity, index) => {
                return (
                    <Authority key={activity.key} rightCode={BASIC_PROMOTION_CREATE}>
                        <NewPromotionCard
                            key={activity.key}
                            promotionEntity={activity}
                            onCardClick={() => {
                                this.props.toggleIsUpdate(true);
                                this.onButtonClicked(index, activity);
                            }}
                            index={index}
                            whiteList={whiteList}
                            onClickOpen={this.onClickOpen}
                        />
                    </Authority>
                );
            })
        );
    }

    renderModal = () => {
        const promotionType = WECHAT_MALL_ACTIVITIES[this.state.index].title;
        const title = <span>创建{promotionType}</span>;
        return (
            <Modal
                wrapClassName="progressBarModal"
                title={title}
                maskClosable={false}
                footer={false}
                style={{
                    top: 20,
                }}
                width={1000}
                visible={this.state.modal1Visible}
                onOk={this.clear}
                onCancel={this.clear}
            >
                <ActivityMain
                    index={this.state.index}
                    steps={this.props.steps}
                    isNew={true}
                    callbackthree={(arg) => {
                        if (arg == 3) {
                            this.setModal1Visible(false)
                        }
                    }}
                />
            </Modal>
        );
    }

    onButtonClicked = (index, activity) => {
        if (!checkPermission("marketing.jichuyingxiaoxin.create")) {
            message.warn('您没有新建活动的权限，请联系管理员');
            return;
        }
        const shopID = this.props.user.shopID;
        this.props.getMallGoodsAndCategories(shopID);
        this.setState({
            updateModalVisible: true,
            currentPromotionID: arguments[1].promotionIDStr,
        });
        this.setModal1Visible(true);
        this.setState({
            index,
        });
    }
}


export default NewActivity;
