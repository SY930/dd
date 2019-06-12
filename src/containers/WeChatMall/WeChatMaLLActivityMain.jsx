import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';
import { ActivityLogo } from '../SaleCenterNEW/ActivityLogo/ActivityLogo'; // 活动logo
import styles from '../SaleCenterNEW/ActivityPage.less';
import WeChatMallSale from './miaosha/Wrapper';
import WeChatMallGroupSale from './groupSale/Wrapper';

import {
    WECHAT_MALL_ACTIVITIES,
} from '../../constants/promotionType';
// 模态框内容组件， 左边为SideBar, 内容区域为 CustomProgressBar
class ActivityMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0, // 模态框当前步骤
            pages: [],
        };
    }

    renderSideBar() {
        return (
            <div className={styles.promotionTip}>
                <div style={{ marginBottom: 20 }}>{WECHAT_MALL_ACTIVITIES[this.props.index].text || ''}</div>
            </div>
        );
    }

    /**
     * 加载所有的营销活动页，并转换对应的React组件存放到 state属性 pages中存储。
     * 用户点击对应的index加载对应的页面内容（营销活动）
     */
    componentDidMount() {
        const _pages = [
            WeChatMallSale, // 商城秒杀
            WeChatMallGroupSale, // 拼团活动
        ];
        const pages = _pages.map((promotion, index) => {
            return React.createElement(promotion, {
                callbacktwo: (arg) => {
                    this.props.callbackthree(arg);
                },
                key: index,
                isNew: this.props.isNew,
                previousData: this.props.data,
                promotionType: WECHAT_MALL_ACTIVITIES[index].key,
                component: promotion,
            });
        });
        this.setState({
            pages,
        });
    }

    // 渲染对应的营销活动页面
    renderActivityTags() {
        return this.state.pages[this.props.index];
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
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityMain);
