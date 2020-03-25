import React, { PureComponent as Component } from 'react';
import { Table, message, Modal, Tooltip } from 'antd';
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
        visible: false,            // 是否显示弹层
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
    onDelete = (couponPackageID, name) => {
        const { groupID, onQuery } = this.props;
        const params = { couponPackageID, groupID };
        Modal.confirm({
            title: '您确定要删除吗？',
            content: (
                <div>
                    {`您将删除券包
                        【${name}】`}
                    <br />
                    <span>删除是不可恢复操作，被删除的券包可以在已删除的券包中查看~</span>
                </div>
            ),
            onOk: () => {
                deleteTicketBag(params).then((flag) => {
                    if (flag) {
                        message.success('删除成功');
                        onQuery();
                    }
                });
            },
        })
    }
    /** 查看详情 */
    onPreview = ({ target }) => {
        const { id: couponPackageID } = target.closest('p');
        const { groupID } = this.props;
        const params = { couponPackageID, groupID, isNeedDetailInfo: true };
        getTicketBagInfo(params).then(x => {
            if(x) {
                this.setState({ detail: x, couponPackageID });
                this.onToggleModal();
            }
        });
    }
    /** 编辑 */
    onEdit = ({ target }) => {
        const { name = '' } = target;
        const { id: couponPackageID } = target.closest('p');
        const { groupID, onGoEdit } = this.props;
        const params = { couponPackageID, groupID, isNeedDetailInfo: true };
        getTicketBagInfo(params).then(x => {
            if(x) {
                const data = this.resetFormData(x);
                const obj = { ...data, couponPackageID };
                onGoEdit('ticket', obj, name);
            }
        });
    }
    resetFormData = (detail) => {
        const { couponPackageGiftConfigs, couponPackageInfo: info, shopInfos: shops } = detail;
        const { couponSendWay: way, couponPackageType: type, validCycle: cycle,
            couponPackagePrice: price, couponPackageStock: stock } = info;
        const shopInfos = shops.map(x=>`${x.shopID}`);
        const { sellBeginTime, sellEndTime, sendTime: time } = info;
        let sellTime = [];
        if(+sellBeginTime && +sellEndTime){
            sellTime = [moment(sellBeginTime, DF), moment(sellEndTime, DF)];
        }
        const sendTime = +time ? moment(time, TF) : '';
        const cycleType = cycle ? cycle[0][0] : ''; // ["w2", "w3"] 获取第一个字符
        const couponPackageStock = (stock === -1) ? '' : stock;    // 库存为-1和0 都显示空
        return { ...info, sellTime, sendTime, shopInfos, couponSendWay: `${way}`,
            couponPackageType: `${type}`, cycleType, couponPackageGiftConfigs,
            couponPackagePrice2: price, couponPackageStock };
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
        const { pageObj } = this.props;
        const { tc } = styles;
        const render = (v, o) => {
            const { couponPackageID: id, couponPackageName: name } = o;
            return (
                <p id={id}>
                    <a href={href} onClick={this.onEdit}>编辑</a>
                    <a href={href} name="check" onClick={this.onEdit}>查看</a>
                    <a href={href} onClick={()=>{this.onDelete(id,name)}}>删除</a>
                    <a href={href} onClick={this.onPreview}>详情</a>
                </p>);
        };
        const render1 = (v, o) => {
            return (
                <Tooltip title={v}>
                    <span>{v}</span>
                </Tooltip>);
        };
        const render2 = (v, o) => {
            const { pageSize, pageNo } = pageObj;
            const idx = v + (pageSize * (pageNo - 1));
            return (<span>{idx}</span>);
        };

        // 表格头部的固定数据
        return [
            { width: 50, title: '序号', dataIndex: 'idx', className: tc, render: render2 },
            { width: 160, title: '操作', dataIndex: 'op', className: tc, render },
            { width: 160, title: '券包名称', dataIndex: 'couponPackageName', render: render1 },
            { width: 160, title: '券包ID', dataIndex: 'couponPackageID' },
            { title: '券包说明', dataIndex: 'couponPackageDesciption' },
            { width: 160, title: '创建人/修改人', dataIndex: 'postBy', className: tc },
            { width: 260, title: '创建时间/修改时间', dataIndex: 'postTime', className: tc },
        ];
    }
    /* 生成表格数据 */
    generateDataSource() {
        const { list } = this.props;
        return list.map((x, i) => ({
            key: x.id,
            idx: i + 1,
            postBy: (x.createBy || '') + ' / ' + (x.modifyBy || ''),
            postTime: (x.createTime || '') + ' / ' + (x.modifyTime || ''),
            ...x,
        }));
    }
    render() {
        const { visible, detail, couponPackageID } = this.state;
        const { loading, page, groupID } = this.props;
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
                        style={{ maxWidth: 1300 }}
                        scroll={{ y: 'calc(100vh - 440px)' }}
                        pagination={pagination}
                    />
                    {visible &&
                        <DetailModal
                            ids={{groupID, couponPackageID}}
                            detail={detail}
                            onClose={this.onToggleModal}
                        />
                    }
                </div>
        )
    }
}
export default PagingFactory(MainTable)
