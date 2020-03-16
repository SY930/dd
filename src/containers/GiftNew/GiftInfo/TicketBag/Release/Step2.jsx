import React, { PureComponent as Component } from 'react';
import { Button, Input } from 'antd';
import {  } from '../Common';
import styles from './index.less';
import { } from '../AxiosFactory';


export default class Step2 extends Component {
    state = {
        url: '',

    };
    /*  */
    onCopy = () => {

    }
    /** form */
    onUrlChange = (key, value) => {

    }
    /* 获取form对象 */
    onGetForm = (form) => {
        this.form = form;
    }
    /* 整理formItems对象 */
    resetFormItems = () => {

    }
    render() {
        const { url } = this.state;

        return (
            <ul className={styles.step2Box}>
                <li>
                    <h3 className={styles.title}>链接投放</h3>
                    <div className={styles.top}>
                        <div className={styles.flex}>
                            <span>投放链接</span>
                            <Input value={url} onChange={this.onUrlChange} />
                            <Button onClick={this.onCopy}>复制</Button>
                        </div>
                        <p>投放链接可配置至公众号菜单或进行线上餐厅、小程序等场景功能配置</p>
                    </div>
                </li>
                <li>
                    <h3 className={styles.title}>二维码投放</h3>
                    <div className={styles.bottom}>
                        1312222
                    </div>
                </li>
            </ul>
        );
    }
}
