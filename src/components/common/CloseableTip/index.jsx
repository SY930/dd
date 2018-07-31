import React, { Component } from 'react';
import {
    Button,
    Icon,
} from 'antd';
import styles from '../../../containers/SaleCenterNEW/ActivityPage.less'

class CloseableTip extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        };
        this.handleIconHover = this.handleIconHover.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        this.setState({
            visible: false,
        });
    }

    handleIconHover() {
        this.setState({
            visible: true,
        });
    }

    renderTipPanel() {
        return (
            <div style={{ display: this.state.visible ? 'block' : 'none', height: 'auto', width: '470px' }} className={styles.tip}>
                {this.props.content || <p/>}
                <div>
                    <div className={styles.tipBtn}>
                        <Button
                            type="ghost"
                            style={{ color: '#787878' }}
                            onClick={this.handleClose}
                        >我知道了
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <span>
                {this.renderTipPanel()}
                <Icon
                    type="question-circle-o"
                    className={styles.question}
                    style={this.props.style}
                    onMouseOver={this.handleIconHover}
                />
            </span>
        )
    }

}

export default CloseableTip;
