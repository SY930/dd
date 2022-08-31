import React, { PureComponent as Component } from 'react';
import moment from 'moment';
import BaseForm from 'components/common/BaseForm';
import { Button } from 'antd';
import { qFormKeys, qFormItems, } from './Common';
import styles from './index.less';

export default class QueryForm extends Component {
    state = {};
    /* 点击查询把参数传给父组件 */
    onQuery = () => {
        let {pageType} = this.props
        let couponPackageStatus = pageType == 2 ? 1 : 2
        const { name, couponPackageType } = this.form.getFieldsValue();
        const params = { name, couponPackageType, couponPackageStatus, pageSize: 30, pageNo: 1 };
        // 如果是点查询按钮要恢复分页初始值
        this.props.onQuery(params);
    }

    componentDidMount(){
        document.addEventListener('keydown',this.handleEnterKey);
    }

    componentWillUnmount(){
        document.removeEventListener('keydown',this.handleEnterKey);
    }

    handleEnterKey = (e) => {
        let { pageType } = this.props;
        if(e.keyCode === 13 && (pageType == 2 || pageType == 4)){ 
            this.onQuery()
        }
    }

    /* 获取form对象 */
    onGetForm = (form) => {
        this.form = form;
    }
    /* 整理formItems对象 */
    resetFormItems = () => {
        const btnProp = { type: 'primary', icon: 'search', onClick: this.onQuery };
        const { q, ...other } = qFormItems;
        const render = () => (<div><Button {...btnProp}>查询</Button></div>);
        return {
            ...other,
            q: { ...q, render },
        };
    }
    render() {
        const { onThrow } = this.props;
        const formItems = this.resetFormItems();
        return (
            <div className={styles.queryform}>
                <BaseForm
                    getForm={this.onGetForm}
                    formItems={formItems}
                    formKeys={qFormKeys}
                    layout="inline"
                />
                <Button className={styles.throw} onClick={onThrow}>投放</Button>
            </div>
        );
    }
}
