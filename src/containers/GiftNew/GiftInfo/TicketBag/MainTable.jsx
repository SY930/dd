import React, { PureComponent as Component } from 'react';
import { Table, message, Modal, Popconfirm, Tooltip } from 'antd';
import moment from 'moment';
import styles from './index.less';
import { href, DF, TF } from './Common';
import PagingFactory from 'components/PagingFactory';
import { deleteTicketBag, getTicketBagInfo } from './AxiosFactory';
import DetailModal from './Detail';

/** 列表页表格数据 */
class MainTable extends Component {
    /* 页面需要的各类状态属性 */
    state = {
        visible: !1,            // 是否显示弹层
        detail: {},
        couponPackageID: '',
    };
    /* 根据父组件传来的数据判断是否需要更新分页组件 */
    componentWillReceiveProps(np) {
        if (this.props.pageObj !== np.pageObj) {
            this.props.onSavePaging(np.pageObj);
        }
    }
    /** 编辑 */
    onDelete = (couponPackageID) => {
        const { groupID, onQuery } = this.props;
        const params = { couponPackageID, groupID };
        deleteTicketBag(params).then((flag) => {
            if (flag) {
                message.success('删除成功');
                onQuery();
            }
        });
    }
    /** 查看详情 */
    onPreview = ({ target }) => {
        const { id: couponPackageID } = target.closest('p');
        const { groupID } = this.props;
        const params = { couponPackageID, groupID, isNeedDetailInfo: !0 };
        getTicketBagInfo(params).then(x => {
            if(x) {
                this.setState({ detail: x, couponPackageID });
                this.onToggleModal();
            }
        });
    }
    /** 编辑 */
    onEdit = ({ target }) => {
        const { id: couponPackageID } = target.closest('p');
        const { groupID, onGoEdit } = this.props;
        const params = { couponPackageID, groupID, isNeedDetailInfo: !0 };
        getTicketBagInfo(params).then(x => {
            if(x) {
                const data = this.resetFormData(x);
                const obj = { ...data, couponPackageID };
                onGoEdit('ticket', obj);
            }
        });
    }
    resetFormData = (detail) => {
        const { couponPackageGiftConfigs, couponPackageInfo: info, shopInfos: shops } = detail;
        const { couponSendWay: way, couponPackageType: type, validCycle: cycle } = info;
        const shopInfos = shops.map(x=>`${x.shopID}`);
        const { sellBeginTime, sellEndTime, sendTime: time } = info;
        let sellTime = [];
        if(+sellBeginTime && +sellEndTime){
            sellTime = [moment(sellBeginTime, DF), moment(sellEndTime, DF)];
        }
        const sendTime = +time ? moment(time, TF) : '';
        const cycleType = cycle ? cycle[0][0] : ''; // ["w2", "w3"] 获取第一个字符
        return { ...info, sellTime, sendTime, shopInfos, couponSendWay: `${way}`,
            couponPackageType: `${type}`, cycleType, couponPackageGiftConfigs };
    }
    /* 分页改变执行 */
    onPageChange = (pageNo, pageSize) => {
        const { onSavePaging, onQuery } = this.props;
        const params = { pageSize, pageNo };
        onSavePaging(params);
        onQuery(params);
    }
    /* 是否显示 */
    onToggleModal = () => {
        this.setState(ps => ({ visible: !ps.visible }));
    }
    /* 生成表格头数据 */
    generateColumns() {
        const { tc } = styles;
        const render = (v, o) => {
            const { couponPackageID } = o;
            return (
                <p id={couponPackageID}>
                    <a href={href} onClick={this.onEdit}>编辑</a>
                    <a href={href} onClick={this.onPreview}>查看</a>
                    <Popconfirm
                        title="确定删除吗?"
                        onConfirm={() => { this.onDelete(couponPackageID) }}
                    >
                        <a href={href}>删除</a>
                    </Popconfirm>
                    <a href={href} onClick={this.onPreview}>详情</a>
                </p>);
        };

        // 表格头部的固定数据
        return [
            { width: 50, title: '序号', dataIndex: 'idx', className: tc },
            { width: 160, title: '操作', dataIndex: 'op', className: tc, render },
            { width: 160, title: '券包名称', dataIndex: 'couponPackageName' },
            { width: 160, title: '券包ID', dataIndex: 'couponPackageID' },
            { title: '券包说明', dataIndex: 'couponPackageDesciption' },
            { width: 160, title: '创建人/修改人', dataIndex: 'postBy', className: tc },
            { width: 160, title: '时间', dataIndex: 'range', className: tc },
        ];
    }
    /* 生成表格数据 */
    generateDataSource() {
        const { list } = this.props;
        return list.map((x, i) => ({
            key: x.id,
            idx: i + 1,
            range: x.sellBeginTime + ' ~ ' + x.sellEndTime,
            postBy: (x.createBy || '') + ' / ' + (x.modifyBy || ''),
            ...x,
        }));
    }
    render() {
        const { visible, detail, couponPackageID } = this.state;
        const { loading, page, groupID, accountID } = this.props;
        const columns = this.generateColumns();
        const dataSource = this.generateDataSource();
        const pagination = { ...page, onChange: this.onPageChange, onShowSizeChange: this.onPageChange };
        return (
                <div className={styles.tableBox}>
                    <Table
                        bordered={true}
                        loading={loading}
                        columns={columns}
                        dataSource={dataSource}
                        style={{ maxWidth: 1200 }}
                        scroll={{ y: 'calc(100vh - 440px)' }}
                        pagination={pagination}
                    />
                    {visible &&
                        <DetailModal
                            ids={{groupID, couponPackageID, accountID}}
                            detail={detail}
                            onClose={this.onToggleModal}
                        />
                    }
                </div>
        )
    }
}
export default PagingFactory(MainTable)
