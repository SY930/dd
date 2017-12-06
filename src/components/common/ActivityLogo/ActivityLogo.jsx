/**
* @Author: Xiao Feng Wang  <xf>
* @Date:   2017-03-27T15:53:58+08:00
* @Email:  wangxiaofeng@hualala.com
* @Filename: ActivityLogo.jsx
* @Last modified by:   xf
* @Last modified time: 2017-03-28T09:46:58+08:00
* @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
*/


import React, { Component } from 'react'
import { render } from 'react-dom'
import { bindActionCreators } from 'redux'
import styles from '../../../containers/Crm/CrmLess/Crm.less'
import style from '../../../containers/SaleCenter/ActivityPage.less'

export class ActivityLogo extends React.Component {
    render() {
        const index = this.props.index;
        return (
            <div className={this.props.activityMain ? style[`cardWrap_${index}`] : styles[`cardWrap_${index}`]} >
                <div className={this.props.activityMain ? style.title : styles.title}>{this.props.titletext}</div>
                <div className={styles.describe}>{this.props.spantext}</div>
                <div className={styles.describe}>{this.props.example}</div>
            </div>
        );
    }
}
