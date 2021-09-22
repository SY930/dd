import React from 'react';
import { connect } from 'react-redux';
import {
    Row,
    Col,
    message,
} from 'antd';
import { ActivityLogo } from '../SaleCenterNEW/ActivityLogo/ActivityLogo'; // 活动logo
import styles from '../SaleCenterNEW/ActivityPage.less';
import WeChatMallSale from './miaosha/Wrapper';
import { axiosData, getAccountInfo } from '../../helpers/util';
import {
    promotionScopeInfoAdapter,
} from '../../redux/actions/saleCenterNEW/types';
// import { myActivities_NEW as sale_myActivities_NEW } from '../../redux/reducer/saleCenterNEW/myActivities.reducer';
import {
    toggleIsCopyAC,
} from '../../redux/actions/saleCenterNEW/myActivities.action';
// import {
//     WECHAT_MALL_ACTIVITIES,
// } from '../../../constants/promotionType';

// 模态框内容组件， 左边为SideBar, 内容区域为 CustomProgressBar
class ActivityMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0, // 模态框当前步骤
            confirmLoading: false,
        };
        this._pages = [
            WeChatMallSale, // 商城秒杀
        ];
    }

    renderSideBar = () => {
        return (
            <div className={styles.promotionTip}>
                <div style={{ marginBottom: 20 }}>限时秒杀活动，低价刺激用户购买商品，为商城引入用户流量</div>
            </div>
        );
    }

    // 渲染对应的营销活动页面
    renderActivityTags() {
        const { index } = this.props;
        const promotion = this._pages[index];
        return React.createElement(promotion, {
            key: index,
            isNew: this.props.isNew,
            confirmLoading: this.state.confirmLoading,
            previousData: this.props.data,
            promotionType: '10072',
            callbacktwo: (arg) => {
                this.props.callbackthree(arg);
            },
            onFinish: (cb) => (data) => {
                const { promotionScopeInfo } = this.props
                this.setState({
                    confirmLoading: true,
                });
                const url = this.props.data ?
                    this.props.isCopy ? '/promotion/extra/shopExtraEventService_addExtraEvent.ajax' : '/promotion/extra/shopExtraEventService_updateExtraEvent.ajax'
                    : '/promotion/extra/shopExtraEventService_addExtraEvent.ajax';
                // const scopeInfo = promotionScopeInfoAdapter(promotionScopeInfo.get('$scopeInfo').toJS(), true); // 店铺信息
                const params = {
                    ...data,
                    extraEventType: '10072',
                    shopID: this.props.user.shopID,
                    shopIDs: promotionScopeInfo.get('$scopeInfo').toJS().brands,
                    // shopID: scopeInfo.brandIDLst,
                };
                const userName = getAccountInfo().userName
                if (this.props.data && this.props.data.itemID) {
                    params.itemID = data.itemID;
                    params.modifiedBy = userName;
                    if(this.props.isCopy) {
                        delete params.itemID
                    }
                } else {
                    params.createBy = userName;
                }
                axiosData(url, params, null, {}, 'HTTP_SERVICE_URL_PROMOTION_NEW')
                    .then(() => {
                        this.setState({
                            confirmLoading: false,
                        });
                        this.props.toggleIsCopy(false)
                        message.success(`活动${this.props.data ? '更新' : '创建'}完成`);
                        cb && cb();
                    }, err => {
                        this.setState({
                            confirmLoading: false,
                        });
                    })
            },
        });
    }
    render() {
        const index = this.props.index;
        return (
            <div className={[styles.activityMain, styles.activityModal].join(' ')} style={{ padding: '0' }}>
                <Row>
                    <Col span={6} className={styles.activityMainLeft}>
                        <ActivityLogo index={index} titletext={'秒杀'} activityMain={true} />
                        <br />
                        {
                            this.renderSideBar()
                        }
                        <br />
                    </Col>
                    <Col span={18} className={styles.activityMainRight} style={{ padding: '15px 15px 10px 15px' }}>
                        {
                            !this.props.isUpdate ?
                                <div className={styles.stepOneDisabled}></div> : null
                        }
                        {this.renderActivityTags()}
                    </Col>
                </Row>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        saleCenter: state.sale_saleCenter_NEW,
        user: state.user.toJS(),
        isCopy: state.sale_myActivities_NEW.get('isCopy'),
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        isUpdate: state.sale_myActivities_NEW.get('isUpdate'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleIsCopy: (opts) => {
            dispatch(toggleIsCopyAC(opts))
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityMain);
