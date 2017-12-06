/** ******************************
 * 进度条
 *
 * author: baitianshun
 * date: 2017-10-26
 *
******************************** */

import React from 'react';
import {
    Progress,
} from 'antd'
import styles from './ProgressBar.less'

export default class ProgressBar extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className={styles.ProgressBar} style={{ display: this.props.show === true ? 'block' : 'none' }}>
                <div className={styles.content}>
                    {this.props.content}
                </div>
                <div className={styles.content}>
                    <Progress
                        percent={this.props.percent}
                        status={this.props.status}
                        strokeWidth={20}
                    />
                </div>
            </div>
        )
    }
}
