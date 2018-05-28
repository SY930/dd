import React from 'react';
import registerPage from '../../index';
import {
    Row,
    Button,
    Col,
} from 'antd';
import styles from '../SaleCenterNEW/ActivityPage.less';
import { SET_MSG_TEMPLATE } from '../../constants/entryCodes';
import MessageDisplayBox from './MessageDisplayBox'

const mock = new Array(50).fill(1);

@registerPage([SET_MSG_TEMPLATE], {
})
class MessageTemplatesPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contentHeight: 800,
        };
        this.onWindowResize = this.onWindowResize.bind(this);
    }

    componentDidMount() {
        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
    }

    onWindowResize() {
        const contentHeight = document.querySelector('.ant-tabs-tabpane-active').offsetHeight - 86;
        this.setState({ contentHeight });
    }

    render() {
        const headerClasses = `layoutsToolLeft ${styles.headerWithBgColor}`;
        return (
        <div style={{backgroundColor: '#F3F3F3'}} className="layoutsContainer">
            <div className="layoutsTool" style={{height: '80px'}}>
                <div className={headerClasses} style={{lineHeight: '80px'}}>
                    <span style={{lineHeight: '80px'}} className={styles.customHeader}>短信模板</span>
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
                <div style={{height: this.state.contentHeight}} className={styles.scrollableMessageContainer}>
                    {mock.map((item, index) => {
                        return <MessageDisplayBox key={index}/>;
                    })}
                </div>

            </div>
        </div>
        );
    }
}

export default MessageTemplatesPage;
