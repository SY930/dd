/**
* @Author: Xiao Feng Wang  <xf>
* @Date:   2017-03-28T09:25:16+08:00
* @Email:  wangxiaofeng@hualala.com
* @Filename: activityMain.jsx
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-05T17:21:16+08:00
* @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
*/

import React from 'react';
import {connect} from 'react-redux';
import {Row, Col} from 'antd';

if (process.env.__CLIENT__ === true) {
    require('../../components/common/components.less');
}

import {ActivityLogo} from "../SaleCenter/ActivityLogo/ActivityLogo"; //活动logo
import NewBirthdayGift from "./birthdayGift/NewBirthdayGift"; //生日赠送
import NewCardGive from "./newCardGive/NewCardGive"; //开卡赠送
import NewFreeGet from "./freeGet/NewFreeGet"; //免费领取
import NewShackGift from "./shackGift/NewShackGift"; //摇奖
import NewScoreConvert from "./scoreConvert/NewScoreConvert"; //摇奖
import NewSendMsgs from "./sendMsgs/NewSendMsgs"; //摇奖
import NewSendGifts from "./sendGifts/NewSendGifts"; //摇奖
import NewSignUp from "./signUp/NewSignUp"; //摇奖

import ActivitySidebar from "../SaleCenter/ActivitySidebar/ActivitySidebar"; //左侧展示信息
import styles from '../SaleCenter/ActivityPage.less'

// 模态框内容组件， 左边为SideBar, 内容区域为 CustomProgressBar
class ActivityMain extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            current: 0, //模态框当前步骤
            pages: [],
            promotionType:this.props.saleCenter.get("characteristicCategories").toJS()
        };

        this.renderActivityTags = this.renderActivityTags.bind(this);
        this.renderSideBar = this.renderSideBar.bind(this);
    }

    renderSideBar() {
        switch (this.state.current) {
            case 1:
                return (
                    <div style={{margin:'110px 4px 10px 10px'}}>
                        <ActivitySidebar listsTitle={'1 | 基本信息'} key="1"/>
                    </div>
                );
            case 2:
                return (
                    <div style={{margin:'110px 4px 10px 10px'}}>
                        <ActivitySidebar listsTitle={'1 | 基本信息'} key="1"/>
                        <ActivitySidebar listsTitle={'2 | 活动范围'} key="2"/>
                    </div>
                );
            default:
                return null;
        }
    }

    /**
     * 加载所有的营销活动页，并转换对应的React组件存放到 state属性 pages中存储。
     * 用户点击对应的index加载对应的页面内容（营销活动）
     */
    componentDidMount(){

        let activityCategories = this.state.promotionType;

        let _pages = [
            NewBirthdayGift, // 生日赠送
            NewCardGive,     // 开卡赠送
            NewFreeGet,    // 免费领取
            NewShackGift,     // 摇奖
            NewScoreConvert,  //积分兑换
            // NewSendMsgs,    //群发短信
            // NewSendGifts,    //群发礼品
            NewSignUp //限时报名
        ].map((promotion, index) => {
            return React.createElement(promotion, {
                callbacktwo: (arg) => {
                    this.props.callbackthree(arg);
                },
                key: index,
                isNew: this.props.isNew,
                promotionType:activityCategories[index].key,
                component: promotion
            });
        });

        this.setState({
            pages: _pages
        });
    }

    // 渲染对应的营销活动页面
    renderActivityTags() {
        return this.state.pages[this.props.index];
    }

    render() {
        const index = this.props.index;
        return (
            <div className={['ActivityMain',styles.activityModal].join(' ')} style={{padding:'0'}}>
                <Row>
                    <Col span={6} className="ActivityMain-Left">
                        <ActivityLogo index={index} titletext={this.state.promotionType[index].title} activityMain={true}/>
                        <br/>
                        {
                            //this.renderSideBar()
                        }
                        <br/>
                     </Col>
                     <Col span = {18} className="ActivityMain-Right">
                         {this.renderActivityTags()}
                    </Col>
                </Row>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {saleCenter: state.sale_old_saleCenter};
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityMain);
