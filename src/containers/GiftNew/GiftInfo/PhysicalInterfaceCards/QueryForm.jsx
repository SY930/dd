import React, { PureComponent as Component } from 'react';
import moment from 'moment';
import BaseForm from 'components/common/BaseForm';
import { Button } from 'antd';
import { FORM_ITEMS, CARDS } from './Common';
import styles from './index.less';

export default class QueryForm extends Component {
    state = {
        brands: []
    };

    /* 点击查询把参数传给父组件 */
    onQuery = () => {
        // let { pageType } = this.props
        const { createTime = [], ...formVal } = this.form.getFieldsValue();
        const startTime = createTime[0] ? moment(createTime[0]).format('YYYY-MM-DD') : '';
        const endTime = createTime[1] ? moment(createTime[1]).format('YYYY-MM-DD') : '';
        const params = { pageNo: 1, ...formVal, startTime, endTime, createTime: undefined };
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
        const { q, ...other } = FORM_ITEMS;
        const render = () => (<div><Button {...btnProp}>查询</Button></div>);
        other.brandID.options = this.state.brands;
        other.templateType.options = [{ value: '', label: '全部' },].concat(this.props.cardTypeList);
        return {
            ...other,
            q: { ...q, render },
        };
    }

    render() {
        const formItems = this.resetFormItems();
        return (
            <div className={styles.queryform}>
                <BaseForm
                    getForm={this.onGetForm}
                    formItems={formItems}
                    formKeys={CARDS[this.props.pageType].formKeys}
                    layout="inline"
                />
            </div>
        );
    }
}
