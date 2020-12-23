import React, { PureComponent as Component } from 'react';
import moment from 'moment';
import BaseForm from 'components/common/BaseForm';
import { Button, TreeSelect, Row, Col } from 'antd';
import { dFormKeys, dFormItems, dFormKeys2, dFormKeys3 } from '../Common';
import styles from './index.less';

const DF = 'YYYYMMDDHHmmss';
export default class QueryForm extends Component {
    state = {
    };

    componentDidMount() {

    }

    /* 点击查询把参数传给父组件 */
    onQuery = () => {
        const { sendTime, useTime, ...others } = this.form.getFieldsValue();
        let dateObj = {};
        if(sendTime) {
            const [sd, ed] = sendTime || [];
            const sendTimeBegin = sd ? moment(sd).format(DF) : '';
            const sendTimeEnd = ed ? moment(ed).format(DF) : '';
            dateObj = { sendTimeBegin, sendTimeEnd };
        }
        if(useTime) {
            const [sd, ed] = useTime || [];
            const usingTimeBegin = sd ? moment(sd).format(DF) : '';
            const usingTimeEnd = ed ? moment(ed).format(DF) : '';
            dateObj = { usingTimeBegin, usingTimeEnd };
        }
        const params = { pageSize: 10, pageNo: 1, ...dateObj, ...others };
        // 如果是点查询按钮要恢复分页初始值
        this.props.onQuery(params);
    }
    /* 获取form对象 */
    onGetForm = (form) => {
        this.form = form;
    }

    /* 整理formItems对象 */
    resetFormItems = () => {
        const { onRefund } = this.props;
        const btnProp = { type: 'primary', icon: 'search', onClick: this.onQuery };
        const { q, ...other } = dFormItems;
        const render = () => (<div>
            <Button {...btnProp}>查询</Button>
            {onRefund &&
                <Button className={styles.refundBtn} name="refund" onClick={onRefund}>商家退款</Button>
            }
        </div>);
        return {
            ...other,
            sendShopID: {
                label: '发出店铺',
                labelCol: { span: 4 },
                wrapperCol: { span: 20 },
                type: 'custom',
                render: decorator => (
                    <Row>
                        <Col>
                            {decorator({})(
                                <TreeSelect
                                    dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
                                    treeData={this.props.treeData || []}
                                    placeholder="请选择店铺"
                                    showSearch={true}
                                    treeNodeFilterProp="label"
                                    allowClear={true}
                                />
                            )}
                        </Col>
                    </Row>
                ),
            },
            q: { ...q, render },
        };
    }
    render() {
        const { type } = this.props;
        const formItems = this.resetFormItems();
        let newKeys = dFormKeys;
        if(type === 2) {
            newKeys = dFormKeys2;
        }
        if(type === 3) {
            newKeys = dFormKeys3;
        }
        return (
            <div className={styles.queryform2}>
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
