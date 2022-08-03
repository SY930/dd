import React, { PureComponent as Component } from 'react';
import { Table,  Modal } from 'antd';
import PagingFactory from 'components/PagingFactory';
import styles from "./style.less";
import { statusList } from "./QueryForm";

const popconfirmInfo = {
    'release': {
        title: '发布'
    },
    'start': {
        title: '启动'
    },
    'cancel': {
        title: '取消'
    },
    'delete': {
        title: '删除'
    }
}

/** 列表页表格数据 */
class MainTable extends Component {
    /* 页面需要的各类状态属性 */
    state = {
        popconfirmVisible: '',
        currentId: ''
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

    /* 生成表格头数据 */
    generateColumns() {
        let { tc } = styles;
        return [
            { 
                title: '编码',
                dataIndex: 'code',
                className: tc,
                width: 50
            },
            { 
                title: '名称',
                dataIndex: 'name',
                className: tc,
                width: 150,
            },
            { 
                title: '流程状态',
                dataIndex: 'status',
                className: tc,
                width: 150,
                render: (text, record) => {
                    let obj = statusList.find(item => item.value == record.status);
                    return obj && obj.label;
                }
            },
            { 
                title: '操作',
                dataIndex: '',
                className: tc,
                render: (text, record) => {
                    return (
                        <div className={styles.optBtn}>
                            <a href="#" onClick={() => this.props.onEdit(record)}>编辑</a>
                            <a 
                                href="#" 
                                onClick={() => this.setState({
                                    popconfirmVisible: 'release', 
                                    currentId: record.code})
                                }
                            >发布</a>
                            <a href="#" onClick={() => this.setState({popconfirmVisible: 'start', currentId: record.code})}>启动</a>
                            <a href="#" onClick={() => this.setState({popconfirmVisible: 'cancel', currentId: record.code})}>取消</a>
                            <a href="#" onClick={() => this.setState({popconfirmVisible: 'delete', currentId: record.code})}>删除</a>
                        </div>
                    )
                }
            },
        ];
    }
    /* 生成表格数据 */
    generateDataSource() {
        const { list } = this.props;
        return list.map((x, i) => ({
            key: x.couponPackageID,
            type: '',
            ...x,
        }));
    }

    onEdit = (record) => {
        console.log(999, record);
    }

    onClickOptBtn = () => {
        console.log(2222, this.state.popconfirmVisible, this.state.currentId);
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
        let { popconfirmVisible } = this.state;
        const title = popconfirmInfo[popconfirmVisible] && popconfirmInfo[popconfirmVisible].title;
        const that = this;
        const confirm = () =>  {
            Modal.confirm({
              title: `确定要${title}吗?`,
              okText: '确定',
              cancelText: '取消',
              onCancel() {
                that.setState({
                    popconfirmVisible: ''
                })
              },
              onOk(){
                that.onClickOptBtn()
              }
            });
        }

        return (
                <div>
                    <Table
                        bordered={true}
                        loading={loading}
                        columns={columns}
                        rowKey="code"
                        dataSource={dataSource}
                        style={{ maxWidth: 700 }}
                        scroll={{ y: 'calc(100vh - 440px)' }}
                        pagination={pagination}
                    />
                    {
                        popconfirmVisible != '' && confirm()
                    }
                </div>
        )
    }
}
export default PagingFactory(MainTable)
