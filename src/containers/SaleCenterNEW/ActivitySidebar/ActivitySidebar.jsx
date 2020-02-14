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
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from '../IntlDecor';

const moment = require('moment');

@injectIntl()
class ActivitySidebar extends React.Component {
    constructor(props) {
        super(props);
        this.info = [];
        this.range = [];
        this.content = [];
    }
    componentWillMount() {
        const { fullCut, promotionBasicInfo, promotionScopeInfo } = this.props;

        const { intl } = this.props;
        const k5eng042 = intl.formatMessage(SALE_STRING.k5eng042);
        const k5koakb3 = intl.formatMessage(SALE_STRING.k5koakb3);
        const k5krn6qx = intl.formatMessage(SALE_STRING.k5krn6qx);
        const k5krn6z9 = intl.formatMessage(SALE_STRING.k5krn6z9);
        const k5krn77l = intl.formatMessage(SALE_STRING.k5krn77l);

        this.info = [
            {
                spanTitle: SALE_LABEL.k5dk5uwl,
                content: promotionBasicInfo.getIn(['$basicInfo', 'category']) || '',
            }, {
                spanTitle: SALE_LABEL.k5dlcm1i,
                content: promotionBasicInfo.getIn(['$basicInfo', 'name']) || '',
            }, {
                spanTitle: SALE_LABEL.k5krn5l9,
                content: promotionBasicInfo.getIn(['$basicInfo', 'showName']) || SALE_LABEL.k5hkj1ef,
            }, {
                spanTitle: SALE_LABEL.k5dmmiar,
                content: promotionBasicInfo.getIn(['$basicInfo', 'code']) || '',
            }, {
                spanTitle: SALE_LABEL.k5dlpi06,
                content: !promotionBasicInfo.getIn(['$basicInfo', 'tags']).isEmpty()
                    ? promotionBasicInfo.getIn(['$basicInfo', 'tags']).toJS()
                    : SALE_LABEL.k5hkj1ef,
            }, {
                spanTitle: SALE_LABEL.k5krn5tl,
                content: promotionBasicInfo.getIn(['$basicInfo', 'startDate']) || k5koakb3,
            }, {
                spanTitle: SALE_LABEL.k5krn61x,
                content: promotionBasicInfo.getIn(['$basicInfo', 'endDate']) || k5koakb3,
            }, {
                spanTitle: SALE_LABEL.k5krn6a9,
                content: promotionBasicInfo.getIn(['$basicInfo', 'description']) || SALE_LABEL.k5hkj1ef,
            },
        ];
        this.range = [
            {
                spanTitle: SALE_LABEL.k5dlpn4t,
                content: !promotionScopeInfo.getIn(['$scopeInfo', 'brands']).isEmpty()
                    ? promotionScopeInfo.getIn(['$scopeInfo', 'brands']).toJS().map((brands) => {
                        return promotionScopeInfo.getIn(['refs', 'data', 'brands']).toJS().map((item) => {
                            if (brands == item.brandID) {
                                return item.brandName;
                            }
                        })
                    })
                    : k5eng042,
            }, {
                spanTitle: SALE_LABEL.k5krn6il,
                content: (() => {
                    switch(Number(promotionScopeInfo.getIn(['$scopeInfo', 'channel']))) {
                        case 0 : return k5eng042;
                        case 1 : return k5krn6qx;
                        case 2 : return k5krn6z9;
                        case 3 : return k5krn77l;
                        default: return k5eng042;
                    }
                })()

            }, /*{
                spanTitle: '自动执行',
                content: promotionScopeInfo.getIn(['$scopeInfo', 'auto']) == 1
                    ? '是'
                    : '否',
            },*/ {
                spanTitle: SALE_LABEL.k5dlpt47,
                content: promotionScopeInfo.getIn(['$scopeInfo', 'orderType'])
                    ? promotionScopeInfo.getIn(['$scopeInfo', 'orderType']).map((order) => {
                        return SALE_CENTER_ACTIVITY_ORDER_TYPE_LIST.map((item) => {
                            if (item.value == order) {
                                return item.label
                            }
                        })
                    })
                    : SALE_LABEL.k5krn7fx,
            }, {
                spanTitle: SALE_LABEL.k5dlggak,
                content: !promotionScopeInfo.getIn(['$scopeInfo', 'shopsInfo']).isEmpty()
                    ? promotionScopeInfo.getIn(['$scopeInfo', 'shopsInfo']).toJS().map((shop) => {
                        return shop ? shop.shopName : ''
                    })
                    : k5eng042,
            },
        ];
    }

    render() {
        const listsTitle = this.props.listsTitle;
        const listNode = [];
        const finalList = listsTitle == '1 | '+SALE_LABEL.k5g5bcqo
            ? this.info
            : listsTitle == '2 | '+ SALE_LABEL.k5gfsuwz
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
