import React, { PureComponent as Component } from 'react';
import { Table,  Modal, Switch } from 'antd';
import PagingFactory from 'components/PagingFactory';
import styles from "./style.less";
import moment from 'moment'

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

function transformTime(time, format = DATE_FORMAT){
    return moment(new Date(parseInt(time))).format(format)
}

/** 列表页表格数据 */
class MainTable extends Component {
    /* 页面需要的各类状态属性 */
    state = {
        itemID: ''
    };
    /* 根据父组件传来的数据判断是否需要更新分页组件 */
    componentWillReceiveProps(np) {
        if (this.props.pageObj !== np.pageObj) {
            this.props.onSavePaging(np.pageObj);
        }
    }

    /* 分页改变执行 */
    onPageChange = (pageNo, pageSize) => {
        const { onSavePaging, onQuery } = this.props;
        const params = { pageSize, pageNo };
        onSavePaging(params);
        onQuery(params);
    }

    changeStatus = (record) => {
        this.props.changeStatus(record);
    }

    onDelete = (itemID) => {
        let that = this;
        Modal.confirm({
            title: `确定要删除吗?`,
            okText: '确定',
            cancelText: '取消',
            onOk(){
                that.props.onDelete(itemID);
            }
          });
    }

    /* 生成表格头数据 */
    generateColumns() {
        let { tc } = styles;
        return [
            { 
                title: '序号',
                className: tc,
                width: 50,
                render:(text,record,index)=>`${index+1}`
            },
            { 
                title: '操作',
                className: tc,
                width: 100,
                render: (text, record) => {
                    return (
                        <div className={styles.optBtn}>
                            <a href="#" onClick={() => this.props.onOperate(record, 'edit')}>编辑</a>
                            <a href="#" onClick={() => this.props.onOperate(record, 'see')}>查看</a>
                            <a href="#" onClick={() => this.onDelete(record.itemID)}>删除</a>
                        </div>
                    )
                }
            },
            { 
                title: '启用/禁用',
                dataIndex: 'status',
                className: tc,
                width: 100,
                render: (text, record) => (
                    <Switch 
                        checked={record.status == 1} 
                        checkedChildren="启用" 
                        unCheckedChildren="禁用" 
                        size="small"
                        className={styles.switchBox}
                        onChange={() => this.changeStatus(record)}
                    />
                )
            },
            { 
                title: '活动编码',
                dataIndex: 'flowCode',
                className: tc,
                width: 150,
            },
            { 
                title: '名称',
                dataIndex: 'flowName',
                className: tc,
                width: 150,
            },
            { 
                title: '有效时间',
                className: tc,
                width: 100,
                render:(text,record,index) => {
                    let { eventStartDate, eventEndDate } = record;
                    eventStartDate = eventStartDate > 0 ? eventStartDate : '长期有效';
                    eventEndDate = eventEndDate > 0 ? eventEndDate : '长期有效';
                    return `${eventStartDate} / ${eventEndDate}`
                }
            },
            { 
                title: '创建人/修改人',
                dataIndex: 'code',
                className: tc,
                width: 140,
                render:(text,record,index) => `${record.creator} / ${record.modifier}`
            },            
            { 
                title: '创建时间/修改时间',
                className: tc,
                width: 200,
                render:(text,record,index) => {
                    return `${transformTime(record.createStamp)} / ${transformTime(record.actionStamp)}`;
                }
            },            

        ];
    }

    /* 生成表格数据 */
    generateDataSource() {
        const { list = [] } = this.props;
        return list.map((x, i) => ({
            key: x.couponPackageID,
            type: '',
            ...x,
        }));
    }

    render() {
        const { loading, page } = this.props;
        const columns = this.generateColumns();
        const dataSource = this.generateDataSource();
        const pagination = { 
            ...page,
            onChange: this.onPageChange,
            onShowSizeChange: this.onPageChange,  
        };
        return (
                <div>
                    <Table
                        bordered={true}
                        loading={loading}
                        columns={columns}
                        rowKey="itemID"
                        dataSource={dataSource}
                        scroll={{ x: 1600,  y: 'calc(100vh - 440px)' }}
                        pagination={pagination}
                    />
                </div>
        )
    }
}
export default PagingFactory(MainTable)
