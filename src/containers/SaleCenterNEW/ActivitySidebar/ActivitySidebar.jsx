/**
* @Author: Xiao Feng Wang  <xf>
* @Date:   2017-03-09T14:19:11+08:00
* @Email:  wangxiaofeng@hualala.com
* @Filename: ActivitySidebar.jsx
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-06T11:20:25+08:00
* @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
*/

/*
 Created by chengshuang on 2016/12/05. 添加活动页面组件
 */
import React from 'react';
import { connect } from 'react-redux';
import styles from './ActivitySidebar.less';
import { SALE_CENTER_ACTIVITY_ORDER_TYPE_LIST } from '../../../redux/actions/saleCenterNEW/types.js';

if (process.env.__CLIENT__ === true) {
    // require('../../../../client/componentsPage.less');
}

const moment = require('moment');

class ActivitySidebar extends React.Component {
    constructor(props) {
        super(props);
        this.info = [];
        this.range = [];
        this.content = [];
    }
    componentWillMount() {
        const { fullCut, promotionBasicInfo, promotionScopeInfo } = this.props;
        this.info = [
            {
                spanTitle: '活动类别',
                content: promotionBasicInfo.getIn(['$basicInfo', 'category']) || '',
            }, {
                spanTitle: '活动名称',
                content: promotionBasicInfo.getIn(['$basicInfo', 'name']) || '',
            }, {
                spanTitle: '展示名称',
                content: promotionBasicInfo.getIn(['$basicInfo', 'showName']) || '未填写',
            }, {
                spanTitle: '活动编码',
                content: promotionBasicInfo.getIn(['$basicInfo', 'code']) || '',
            }, {
                spanTitle: '活动标签',
                content: !promotionBasicInfo.getIn(['$basicInfo', 'tags']).isEmpty()
                    ? promotionBasicInfo.getIn(['$basicInfo', 'tags']).toJS()
                    : '未填写',
            }, {
                spanTitle: '开始日期',
                content: promotionBasicInfo.getIn(['$basicInfo', 'startDate']) || '不限制',
            }, {
                spanTitle: '结束日期',
                content: promotionBasicInfo.getIn(['$basicInfo', 'endDate']) || '不限制',
            }, {
                spanTitle: '活动说明',
                content: promotionBasicInfo.getIn(['$basicInfo', 'description']) || '未填写',
            },
        ];
        this.range = [
            {
                spanTitle: '活动品牌',
                content: !promotionScopeInfo.getIn(['$scopeInfo', 'brands']).isEmpty()
                    ? promotionScopeInfo.getIn(['$scopeInfo', 'brands']).toJS().map((brands) => {
                        return promotionScopeInfo.getIn(['refs', 'data', 'brands']).toJS().map((item) => {
                            if (brands == item.brandID) {
                                return item.brandName;
                            }
                        })
                    })
                    : '全部',
            }, {
                spanTitle: '适用场景',
                content: (() => {
                    switch(Number(promotionScopeInfo.getIn(['$scopeInfo', 'channel']))) {
                        case 0 : return '全部';
                        case 1 : return '云店';
                        case 2 : return '微信';
                        case 3 : return '饮食通';
                        default: return '全部';
                    }
                })()

            }, /*{
                spanTitle: '自动执行',
                content: promotionScopeInfo.getIn(['$scopeInfo', 'auto']) == 1
                    ? '是'
                    : '否',
            },*/ {
                spanTitle: '适用业务',
                content: promotionScopeInfo.getIn(['$scopeInfo', 'orderType'])
                    ? promotionScopeInfo.getIn(['$scopeInfo', 'orderType']).map((order) => {
                        return SALE_CENTER_ACTIVITY_ORDER_TYPE_LIST.map((item) => {
                            if (item.value == order) {
                                return item.label
                            }
                        })
                    })
                    : '堂食',
            }, {
                spanTitle: '适用店铺',
                content: !promotionScopeInfo.getIn(['$scopeInfo', 'shopsInfo']).isEmpty()
                    ? promotionScopeInfo.getIn(['$scopeInfo', 'shopsInfo']).toJS().map((shop) => {
                        return shop ? shop.shopName : ''
                    })
                    : '全部',
            },
        ];
    }

    render() {
        const listsTitle = this.props.listsTitle;
        const listNode = [];
        const finalList = listsTitle == '1 | 基本信息'
            ? this.info
            : listsTitle == '2 | 活动范围'
                ? this.range
                : this.content;
        finalList.map((item, index) => {
            if (typeof item.content === 'string') {
                listNode.push(
                    <li className={'clearfix'} key={`listsOne-${index}`}>
                        <span className={styles.liLeft}>{item.spanTitle}：</span>
                        <div className={styles.liRight}>{item.content}</div>
                    </li>
                )
            } else if (item.content._isAMomentObject) {
                listNode.push(
                    <li className={'clearfix'} key={`listsOne-${index}`}>
                        <span className={styles.liLeft}>{item.spanTitle}：</span>
                        <div className={styles.liRight}>{moment(item.content).format('YYYY-MM-DD')}</div>
                    </li>
                )
            } else {
                const contents = item.content.map((item, index) => {
                    return <p key={index}>{item}</p>
                })

                listNode.push(

                    <li className={'clearfix'} key={`listsOne-${index}`}>
                        <span className={styles.liLeft}>{item.spanTitle}：</span>
                        <div className={styles.liRight}>{contents}</div>
                    </li>
                )
            }
        });

        return (
            <div className={styles.SidebarMain}>
                <h3>{listsTitle}</h3>
                <ul>
                    {listNode}
                </ul>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        fullCut: state.sale_fullCut_NEW,
        promotionBasicInfo: state.sale_promotionBasicInfo_NEW,
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {}
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivitySidebar);
