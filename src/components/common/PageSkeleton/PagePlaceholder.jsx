import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PageHeader from './PageHeader';
import styles from './styles/PagePlaceholder.less';

class PagePlaceholder extends Component {
    render() {
        const { title, description } = this.props;
        return (
            <div className="layoutsContainer">
                <PageHeader title={title} />
                <div className="layoutsLineBlock" />
                <div className={styles.content}>
                    <img alt="coming soon..." src="/img/coming.png" />
                    <p>{description || `${title}功能开发中，敬请期待`}</p>
                </div>
            </div>
        );
    }
}

PagePlaceholder.defaultProps = {
    description: '',
};

PagePlaceholder.propTypes = {
    /** 页面的标题 */
    title: PropTypes.string.isRequired,
    /** 提示文字 */
    description: PropTypes.string,
};

export default PagePlaceholder;
