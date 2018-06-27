import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';
import { ActivityLogo } from '../SaleCenterNEW/ActivityLogo/ActivityLogo'; // 活动logo

import ActivitySidebar from '../SaleCenterNEW/ActivitySidebar/ActivitySidebar'; // 左侧展示信息
import styles from '../SaleCenterNEW/ActivityPage.less';
import WeChatMallSale from './miaosha/Wrapper';

import {
    WECHAT_MALL_ACTIVITIES,
} from '../../redux/actions/saleCenterNEW/types';

if (process.env.__CLIENT__ === true) {
    require('../../components/common/components.less');
}
// 模态框内容组件， 左边为SideBar, 内容区域为 CustomProgressBar
class ActivityMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0, // 模态框当前步骤
            pages: [],
            promotionType: this.props.saleCenter.get('weChatMallPromotions').toJS(),
        };

        this.renderActivityTags = this.renderActivityTags.bind(this);
        this.renderSideBar = this.renderSideBar.bind(this);
    }

    renderSideBar() {
        switch (this.state.current) {
            case 1:
                return (
                    <div style={{ margin: '110px 4px 10px 10px' }}>
                        <ActivitySidebar listsTitle={'1 | 基本信息'} key="1" />
                    </div>
                );
            case 2:
                return (
                    <div style={{ margin: '110px 4px 10px 10px' }}>
                        <ActivitySidebar listsTitle={'1 | 基本信息'} key="1" />
                        <ActivitySidebar listsTitle={'2 | 活动范围'} key="2" />
                    </div>
                );
            default:
                return (
                    <div className={styles.promotionTip}>
                        <div style={{ marginBottom: 20 }}>{this.props.eventWay ? WECHAT_MALL_ACTIVITIES.find(type => type.key == this.props.eventWay).text || '' : ''}</div>
                    </div>
                );
        }
    }

    /**
     * 加载所有的营销活动页，并转换对应的React组件存放到 state属性 pages中存储。
     * 用户点击对应的index加载对应的页面内容（营销活动）
     */
    componentDidMount() {
        const activityCategories = this.state.promotionType;
        const _pages = [
            WeChatMallSale, // 商城秒杀
        ];
        const pages = _pages.map((promotion, index) => {
            return React.createElement(promotion, {
                callbacktwo: (arg) => {
                    this.props.callbackthree(arg);
                },
                key: index,
                isNew: this.props.isNew,
                promotionType: activityCategories[index].key,
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
    // style={{ padding: '15px 15px 10px 15px' }}
    render() {
        const index = this.props.index;
        return (
            <div className={[styles.activityMain, styles.activityModal].join(' ')} style={{ padding: '0' }}>
                <Row>
                    <Col span={6} className={styles.activityMainLeft} style={{ padding: '15px 15px 10px 15px' }}>
                        <ActivityLogo index={index} titletext={this.state.promotionType[index].title} activityMain={true} />
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
