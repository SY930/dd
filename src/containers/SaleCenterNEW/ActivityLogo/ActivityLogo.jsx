/**
* @Author: Xiao Feng Wang  <xf>
* @Date:   2017-03-27T15:53:58+08:00
* @Email:  wangxiaofeng@hualala.com
* @Filename: ActivityLogo.jsx
* @Last modified by:   xf
* @Last modified time: 2017-03-28T16:40:01+08:00
* @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
*/


import React from 'react';
import styles from './styles.less';
import style from '../ActivityPage.less';

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
