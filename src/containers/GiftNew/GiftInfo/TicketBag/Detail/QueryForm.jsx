import React, { PureComponent as Component } from 'react';
import moment from 'moment';
import BaseForm from 'components/common/BaseForm';
import { Button } from 'antd';
import { dFormKeys, dFormItems, DF, dFormKeys2 } from '../Common';
import styles from './index.less';

export default class QueryForm extends Component {
    state = {};
    /* 点击查询把参数传给父组件 */
    onQuery = () => {
        const { getWay, customerMobile, sendTime, useTime, couponPackageStatus } = this.form.getFieldsValue();
        let dateObj = {};
        if(sendTime) {
            const [sd, ed] = sendTime;
            const sendTimeBegin = moment(sd).format(DF);
            const sendTimeEnd = moment(ed).format(DF);
            dateObj = { sendTimeBegin, sendTimeEnd };
        }
        if(useTime) {
            const [sd, ed] = useTime;
            const usingTimeBegin = moment(sd).format(DF);
            const usingTimeEnd = moment(ed).format(DF);
            dateObj = { usingTimeBegin, usingTimeEnd };
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
        const { use } = this.props;
        const formItems = this.resetFormItems();
        const newKeys = use ? dFormKeys2 : dFormKeys;
        return (
            <div className={styles.queryform}>
                <BaseForm
                    getForm={this.onGetForm}
                    formItems={formItems}
                    formKeys={newKeys}
                    layout="inline"
                />
            </div>
        );
    }
}
