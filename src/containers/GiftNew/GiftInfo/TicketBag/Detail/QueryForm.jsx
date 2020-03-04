import React, { PureComponent as Component } from 'react';
import moment from 'moment';
import { BaseForm } from '@hualala/platform-components';
import { Button } from 'antd';
import { dFormKeys, dFormItems, DF } from '../Common';
import styles from './index.less';

export default class QueryForm extends Component {
    state = {};
    /* 点击查询把参数传给父组件 */
    onQuery = () => {
        const { getWay, customerMobile, sendTime, couponPackageStatus } = this.form.getFieldsValue();
        let dateObj = {};
        if(sendTime) {
            const [sd, ed] = sendTime;
            const sendTimeBegin = moment(sd).format(DF);
            const sendTimeEnd = moment(ed).format(DF);
            dateObj = { sendTimeBegin, sendTimeEnd };
        }
        const params = { getWay, customerMobile, couponPackageStatus,
            pageSize: 10, pageNo: 1, ...dateObj };
        // 如果是点查询按钮要恢复分页初始值
        this.props.onQuery(params);
    }
    /* 获取form对象 */
    onGetForm = (form) => {
        this.form = form;
    }
    /* 整理formItems对象 */
    resetFormItems = () => {
        const btnProp = { type: 'primary', icon: 'search', onClick: this.onQuery };
        const { q, ...other } = dFormItems;
        const render = () => (<div><Button {...btnProp}>查询</Button></div>);
        return {
            ...other,
            q: { ...q, render },
        };
    }
    render() {
        const {  } = this.props;
        const formItems = this.resetFormItems();
        return (
            <div className={styles.queryform}>
                <BaseForm
                    getForm={this.onGetForm}
                    formItems={formItems}
                    formKeys={dFormKeys}
                    layout="inline"
                />
            </div>
        );
    }
}
