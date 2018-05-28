import React from 'react';
import registerPage from '../../index';
import styles from '../SaleCenterNEW/ActivityPage.less';
import { SET_MSG_TEMPLATE } from '../../constants/entryCodes';

@registerPage([SET_MSG_TEMPLATE], {
})
class MessageTemplatesPage extends React.Component {
    constructor(props) {
        super(props);
    }

    onWindowResize() {
        const contentHeight = document.querySelector('.ant-tabs-tabpane-active').offsetHeight - 40;
        this.setState({ contentHeight });
    }

    render() {
        return (
            <Row className="layoutsContainer">
                <Col span={24} className="layoutsHeader">
                    <div className="layoutsTool">
                        <div className="layoutsToolLeft">
                            <h1>新建基础营销</h1>
                        </div>
                        <Button
                            type="ghost"
                            icon="plus"
                            className={styles.jumpToCreate}
                            onClick={
                                () => {
                                    console.log('123');
                                }
                            }>新建</Button>
                    </div>
                </Col>
                <Col span={24} className="layoutsLineBlock"></Col>
                <Col span={24} className="layoutsContent" style={{ overflow: 'auto', height: this.state.contentHeight || 800 }}>
                    <ul>
                        {this.renderActivityButtons()}
                    </ul>
                    {this.state.modal1Visible ? this.renderModal() : null}
                </Col>
            </Row>
        );
    }
}

export default MessageTemplatesPage;
