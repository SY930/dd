import React, {Component} from 'react';
import styles from './fakeBorderedLabel.less';

/**
 * 表单分割符，无数据层面含义
 */
class FakeBorderedLabel extends Component {

    render() {
        const {
            title,
        } = this.props;
        return (
            <div
                className={styles.logoGroupHeader}
            >
                {title}
            </div>
        )
    }
}

export default FakeBorderedLabel;
