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
import WeChatMallGroupSale from './groupSale/Wrapper';
import WeChatMallReturnPoints from './returnPoints/Wrapper';
import { axiosData, getAccountInfo } from '../../helpers/util';

import {
    WECHAT_MALL_ACTIVITIES,
} from '../../constants/promotionType';
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
            WeChatMallGroupSale, // 拼团活动
            WeChatMallReturnPoints, // 消费返积分
        ];
    }

    renderSideBar() {
        return (
            <div className={styles.promotionTip}>
                <div style={{ marginBottom: 20 }}>{WECHAT_MALL_ACTIVITIES[this.props.index].text || ''}</div>
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
            promotionType: WECHAT_MALL_ACTIVITIES[index].key,
            callbacktwo: (arg) => {
                this.props.callbackthree(arg);
            },
            onFinish: (cb) => (data) => {
                this.setState({
                    confirmLoading: true,
                });
                const url = this.props.data ? '/promotion/extra/extraEventService_updateExtraEvent.ajax'
                : '/promotion/extra/extraEventService_addExtraEvent.ajax';
                const params = {
                    ...data,
                    extraEventType: WECHAT_MALL_ACTIVITIES[index].key,
                    shopID: this.props.user.shopID
                };
                const userName = getAccountInfo().userName
                if (this.props.data && this.props.data.itemID) {
                    params.itemID = data.itemID;
                    params.modifiedBy = userName;
                } else {
                    params.createBy = userName;
                }
                axiosData(url, params, null, {}, 'HTTP_SERVICE_URL_PROMOTION_NEW')
                    .then(() => {
                        this.setState({
                            confirmLoading: false,
                        });
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
                        <ActivityLogo index={index} titletext={WECHAT_MALL_ACTIVITIES[index].title} activityMain={true} />
                        <br />
                        {
                            this.renderSideBar()
                        }
                        <br />
                    </Col>
                    <Col span={18} className={styles.activityMainRight} style={{ padding: '15px 15px 10px 15px' }}>
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
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityMain);
