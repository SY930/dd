import React, { Component } from 'react';
import PropTypes from 'prop-types';

class PageHeader extends Component {
    render() {
        const { title } = this.props;
        return (
            <div className="layoutsHeader">
                <div className="layoutsTool">
                    <div className="layoutsToolLeft">
                        <h1>{title}</h1>
                    </div>
                </div>
            </div>
        );
    }
}

PageHeader.propTypes = {
    /** 页面标题 */
    title: PropTypes.string,
};

export default PageHeader;
