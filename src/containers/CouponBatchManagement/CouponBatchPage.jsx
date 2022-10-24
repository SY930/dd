
import React, { Component } from 'react';
import { Form, Row, Col, Button, Table, Icon, Tabs, Modal, Input, DatePicker, TreeSelect, message, Select } from 'antd';
import { COMMON_LABEL } from 'i18n/common';
import moment from 'moment';
import BaseForm from '../../components/common/BaseForm';
// import Authority from '../../components/common/Authority';
import styles from './CouponInfo.less';
import styles2 from '../SaleCenterNEW/ActivityPage.less';
import { queryList, deactivate, audit, addCouponBatch, queryConTractList, getBoardsByGiftName, updateGiftBatch } from './Controller/index'
import { getCardList } from '../ThirdCoupon/AxiosFactory';
import PriceInput from '../SaleCenterNEW/common/PriceInput';
import { timeFormat, getAccountInfo } from '../../helpers/util';
import { throttle, isNumber } from 'lodash';


const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const { RangePicker } = DatePicker;

const statusMap = {
    0: '未同步',
    1: '已同步',
    2: '同步失败',
}

const auditStatusMap = {
    0: '未发起审批',
    1: '审批中',
    2: '审批通过',
    3: '审批不通过',
    4: '无需审批',
}

const aduitColorMap = {
    1: '#ffdb1c',
    2: 'green',
    3: 'red',
}

const giftTypeMap = {
    '10': '代金券',
    '20': '优惠券',
    '21': '兑换券',
    '111': '折扣券',
}


class CouponBatchPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            visible: false,
            deactivateVisible: false,
            createCouponVisible: false,
            queryParams: {
                pageNo: 1,
                pageSize: 25,
            },
            dataSource: [],
            treeData: [],
            total: 0,
            tabkey: '1',
            couponList: [],
            groupID: getAccountInfo().groupID,
            remarkList: [],
            record: {},
            operateKey: '',
            estimatedSales: 0,
            activityCost: 0,
            discountRate: 0,
            modalType: null,

        };
        this.check = false
    }


    componentDidMount = () => {
        this.queryTableData()
        this.queryCouponList()

        getCardList({ giftTypes: [10, 111, 21, 20], groupID: this.state.groupID }).then((x) => {
            this.setState({ treeData: x.map((item) => {
                return {
                    ...item,
                    children: item.children.map((items) => {
                        return {
                            ...items,
                            value: items.value.substring(0, items.value.lastIndexOf('_')),
                        }
                    }),
                }
            }) });
        });
    }


    componentWillUnmount() {
    }


    setDiscountRate = ({ number }, key) => {
        const { activityCost, estimatedSales } = this.state;

        if (key === 'estimatedSales') {
            this.setState({

                estimatedSales: +number,
                discountRate: (activityCost && +number) ?
                    ((activityCost / +number) * 100).toFixed(2) : '0.00',
            })
        }


        if (key === 'activityCost') {
            this.setState({

                activityCost: +number,
                discountRate: (estimatedSales && +number) ?
                    ((estimatedSales / +number) * 100).toFixed(2) : '0.00',
            })
        }
    }

    startLoad = () => this.setState({ loading: true })

    endLoad = () => this.setState({ loading: false })


    queryTableData = () => {
        const { queryParams, tabkey } = this.state;

        this.startLoad()

        const queryobj = {
            '1': this.queryFroms1,
            '2': this.queryFroms2,
        }
        queryobj[tabkey].validateFields(async (err, values) => {
            if (err) return;

            const params = {
                pageNo: queryParams.pageNo,
                pageSize: queryParams.pageSize,
                ...values };

            const tableData = await queryList(params, tabkey)

            this.endLoad()
            this.setState({
                dataSource: tableData && tableData.giftBatchList,
                queryParams: { pageNo: 1, pageSize: queryParams.pageSize || 1, ...params },
                total: tableData && tableData.totalSize,
            })
        });
    }

    handlePageChange = async (pageNo, pageSize) => {
        const { queryParams } = this.state;

        const tableData = await queryList({
            ...queryParams,
            pageNo,
            pageSize,
        })

        this.setState({
            dataSource: tableData.giftBatchList,
            queryParams: { ...queryParams, pageNo, pageSize },
            total: tableData.totalSize,
        })
    }

    tabChange = (v) => {
        this.setState({
            tabkey: v,
        }, () => {
            this.queryTableData()
        })
    }
    selecthandleSearch = throttle(async (v) => {
        if (!v) return;
        const res = await getBoardsByGiftName(v)
        this.setState({
            remarkList: res.crmGiftList || [],
        })
    }, 1000)

    selecthandleChange = (v) => {
        const { tabkey } = this.state;
        const queryobj = {
            '1': this.queryFroms1,
            '2': this.queryFroms2,
        }
        queryobj[tabkey].setFields({
            remark: {
                value: v,
            },
        }
        )
    }
    handleOperate = async (r, key) => {
        this.setState({
            operateKey: key,
        })
        if (key === 'deactivate') {
            Modal.confirm({
                title: '您确定要停用吗？',
                content: (
                    <div>
                        {`您将停用礼品
                        【${r.giftName}】`}
                        <br />
                        <span>停用是不可恢复操作，被停用的券批次中已发放、为发放的券码全部作废～</span>
                    </div>
                ),
                onOk: async () => {
                    const res = await deactivate(r)
                    if (res.code === '000') {
                        message.success('停用成功');
                        this.queryTableData()
                    }
                },
                onCancel: () => {
                },
            })
        } else if (key === 'aduit') {
            this.startLoad()
            const res = await audit(r)
            if (res.code === '000') {
                this.endLoad()
                message.success('发起成功，等待审批');
                this.queryTableData()
            } else {
                this.endLoad()
            }
        } else if (key === 'exportCoupon') {
            const a = document.createElement('a');
            a.href = r.downLoadUrl;
            // a.download = r.fileName;
            a.click();
        } else if (key === 'edit') {
            this.setState({
                record: r,
                discountRate: r.discountRate,
                estimatedSales: r.estimatedSales,
                activityCost: r.activityCost,
                modalType: 'edit',
            }, () => {
                this.setState({
                    createCouponVisible: true,
                })
            })
        }
    }


    createCouponOk=() => {
        const { operateKey, record, discountRate } = this.state;
        const { form } = this.props;

        const { validateFieldsAndScroll } = form;

        if (!this.check) {
            validateFieldsAndScroll(async (err, values) => {
                if (err) return
                this.check = true
                let res;
                if (operateKey === 'edit') {
                    res = await updateGiftBatch({ ...values, discountRate }, record)
                } else {
                    res = await addCouponBatch({ ...values, discountRate })
                }


                if (res.code === '000') {
                    this.queryTableData()
                    this.closeModal()
                } else {
                    this.check = false
                }
            })
        }
    }


    queryCouponList = async () => {
        const tableData = await queryConTractList({
            pageNo: 1,
            pageSize: 10000,
        })

        this.setState({
            couponList: tableData && tableData.contractList && tableData.contractList.map(({ contractCode, channelName }) => {
                return {
                    label: `${contractCode}(${channelName})`,
                    value: contractCode,
                }
            }),
        })
    }

    closeModal = () => {
        this.setState({
            createCouponVisible: false,
            record: {},
            discountRate: 0,
            estimatedSales: 0,
            activityCost: 0,
            modalType: null,
        }, () => {
            setTimeout(() => {
                this.check = false
            }, 1000)
        })
    }
    // 优惠券
     renderCoupon = () => {
         const { record } = this.state;
         const { form } = this.props;
         const { getFieldDecorator } = form;
         return (
             <Row>
                 <Col span={16} offset={6} className={styles.CouponGiftBox}>
                     <FormItem
                         label="总数量"
                         labelCol={{ span: 6 }}
                         wrapperCol={{ span: 17 }}
                     >
                         {getFieldDecorator('stock', {
                             initialValue: { number: record.totalNum },
                             rules: [
                                 { required: true, message: '总数量为必填项' },
                                 {
                                     validator: (rule, v, cb) => {
                                         if (!v) {
                                             return cb();
                                         }
                                         v.number > 0 && v.number <= 999999 ? cb() : cb(rule.message);
                                     },
                                     message: '礼品个数为1到999999',
                                 },
                             ],
                         })(<PriceInput
                             // addonBefore={'礼品个数:'}
                             addonAfter="个"
                             modal="int"
                         />)}
                     </FormItem>
                     <FormItem
                         label="固定有效期"
                         // className={[styles.FormItemStyle, styles.labeleBeforeSlect].join(' ')}
                         labelCol={{ span: 6 }}
                         wrapperCol={{ span: 16 }}
                         required={true}
                     >
                         {getFieldDecorator('giftValidRange', {
                             initialValue: record.effectTime ? [moment(record.effectTime, 'YYYYMMDD'), moment(record.validUntilDate, 'YYYYMMDD')] : [],
                             rules: [
                                 { required: true, message: '请输入有效时间' },
                             ],
                         })(
                             <RangePicker
                                 disabled={!!this.state.douyinGift}
                                 format="YYYY-MM-DD"
                                 showTime="HH:mm:ss"
                             />
                         )}
                     </FormItem>
                 </Col>
             </Row>
         )
     }

     render() {
         const { loading, queryParams, dataSource = [], total, tabkey, record, createCouponVisible, treeData, couponList, remarkList, estimatedSales, activityCost, discountRate } = this.state;

         const { form } = this.props;

         const { getFieldDecorator } = form || {};
         const { pageNo, pageSize } = queryParams;
         const formItems = {
             giftItemIds: {
                 label: '礼品名称',
                 type: 'custom',
                 key: 'giftItemIds',
                 placeholder: '请输入礼品名称',
                 render: decorator => (
                     <span>
                         {decorator({
                             key: 'giftItemIds',
                         })(
                             <Select
                                 showSearch={true}
                                 style={{ width: 200 }}
                                 placeholder="请输入礼品名称"
                                 //  optionFilterProp="children"
                                 filterOption={false}
                                 size="default"
                                 allowClear={true}
                                 onSearch={this.selecthandleSearch}
                                 onChange={this.selecthandleChange}
                             >
                                 {
                                     remarkList.length ? remarkList.map(({ giftItemID, giftName }) => (
                                         <Select.Option key={giftItemID}>{giftName}</Select.Option>
                                     )) : []
                                 }
                             </Select>
                         )}
                     </span>
                 ),
             },
             remark: {
                 label: '券批次名称',
                 type: 'text',
                 placeholder: '请输入券批次名称',
             },
             //  },
             itemID: {
                 label: '券批次ID',
                 type: 'text',
                 placeholder: '请输入券批次ID',
             },
             contractCode: {
                 label: '合同编号',
                 type: 'text',
                 placeholder: '请输入合同编号',
             },
             auditStatus: {
                 label: '审批状态',
                 type: 'combo',
                 allowClear: true,
                 options: [
                     //  { label: '全部', value: '' },
                     { label: '未发起审批', value: '0' },
                     { label: '审批中', value: '1' },
                     { label: '审批通过', value: '2' },
                     { label: '审批不通过', value: '3' },
                     { label: '无需审批', value: '4' },
                 ],
             },
             giftType: {
                 label: '礼品类型',
                 type: 'combo',
                 allowClear: true,
                 options: [
                     //  { label: '全部', value: '' },
                     { label: '代金券', value: '10' },
                     { label: '兑换券', value: '21' },
                     { label: '折扣券', value: '111' },
                     { label: '优惠券', value: '20' },
                 ],
             },
         };
         const formKeys = ['giftItemIds', 'remark', 'itemID', 'contractCode', 'auditStatus', 'giftType'];
         const columns = handleOperate => [
             {
                 title: COMMON_LABEL.serialNumber,
                 dataIndex: 'index',
                 key: 'index',
                 className: 'x-tc',
                 // fixed: 'left',
                 width: 50,
                 render: (text, record, index) => {
                     return (pageNo - 1) * pageSize + index + 1;
                 },
             },
             {
                 title: COMMON_LABEL.actions,
                 dataIndex: 'operate',
                 className: 'TableTxtCenter',
                 key: 'operate',
                 // fixed: 'left',
                 width: 150,
                 render(value, record) {
                     const { auditStatus, downLoadUrl, action, status } = record;


                     // 生成状态
                     // 1：新建
                     // 2：准备
                     // 3：正在生成
                     // 4：已完成


                     //  0: '未发起审批',
                     //  1: '审批中',
                     //  2: '审批通过',
                     //  3: '审批不通过',
                     //  4: '无需审批',


                     //  const push = <a href="javaScript:;" onClick={() => { handleOperate(record, 'push') }} >推送 </a>

                     const operateView = []

                     const aduitDom = <a href="javaScript:;" onClick={() => { handleOperate(record, 'aduit') }} >发起审批 </a>

                     const exportCouponDom = <a href="javaScript:;" onClick={() => { handleOperate(record, 'exportCoupon') }} >导出券码 </a>

                     const deactivateDom = (<a href="javaScript:;" onClick={() => { handleOperate(record, 'deactivate') }} >
                         停用
                     </a>)

                     const editDom = (<a href="javaScript:;" onClick={() => { handleOperate(record, 'edit') }} >
                         编辑
                     </a>)

                     // todo 停用状态，如果是 -1 不能操作 修改停用为停用中
                     if (auditStatus !== 1 && status !== 3) {
                         if (action === -1) {
                             operateView.push(<span>停用中&nbsp;&nbsp;</span>)
                         } else {
                             operateView.push(deactivateDom)
                         }
                     }

                     if (auditStatus === 0) {
                         operateView.push(editDom, aduitDom)
                     }

                     if (auditStatus === 3) {
                         operateView.push(editDom)
                     }

                     if (downLoadUrl) {
                         operateView.push(exportCouponDom)
                     }

                     return operateView
                 },
             }, {
                 title: '礼品名称',
                 dataIndex: 'giftName',
                 key: 'giftName',
                 // fixed: 'left',
                 width: 100,
                 render: (value) => {
                     return <span title={value}>{value}</span>
                 },
             }, {
                 title: '礼品ID',
                 dataIndex: 'giftItemID',
                 key: 'giftItemID',
                 render: (value) => {
                     return <span title={value}>{value}</span>
                 },
                 // fixed: 'left',
                 width: 150,
             }, {
                 title: '礼品类型',
                 dataIndex: 'giftType',
                 key: 'giftType',
                 // fixed: 'left',
                 render: (value) => {
                     return <span title={giftTypeMap[value]}>{giftTypeMap[value]}</span>
                 },
                 width: 100,
             }, {
                 title: '券批次名称',
                 dataIndex: 'remark',
                 key: 'remark',
                 width: 100,
                 //  fixed: 'left',
                 //  className: 'x-tr',
                 render: (value) => {
                     return <span title={value}>{value}</span>
                 },
             }, {
                 title: '券批次ID',
                 dataIndex: 'itemID',
                 key: 'itemID',
                 width: 150,
                 render: (value) => {
                     return <span title={value}>{value}</span>
                 },
             }, {
                 title: '批次有效期',
                 dataIndex: 'effectTime',
                 key: 'effectTime',
                 width: 150,
                 render: (value, { effectTime, validUntilDate }) => {
                     return (<span title={moment(effectTime).format('YYYY/MM/DD') - moment(validUntilDate).format('YYYY/MM/DD')}>
                         {moment(effectTime).format('YYYY/MM/DD')}-{moment(validUntilDate).format('YYYY/MM/DD')}
                     </span>)
                 },
             }, {
                 title: '批次库存',
                 dataIndex: 'totalNum',
                 key: 'totalNum',
                 width: 100,
                 render: (value) => {
                     return <span title={value}>{value}</span>
                 },
             },
             {
                 title: '合同编号',
                 dataIndex: 'contractCode',
                 key: 'contractCode',
                 width: 150,
                 render: (value) => {
                     return <span title={value}>{value}</span>
                 },
             },
             {
                 title: '活动费用（元）',
                 dataIndex: 'activityCost',
                 key: 'activityCost',
                 width: 120,
                 render: (value) => {
                     return <span title={value}>{value}</span>
                 },
             },
             {
                 title: '预计销售额（元）',
                 dataIndex: 'estimatedSales',
                 key: 'estimatedSales',
                 width: 120,
                 render: (value) => {
                     return <span title={value}>{value}</span>
                 },
             },
             {
                 title: '折扣率 （%）',
                 dataIndex: 'discountRate',
                 key: 'discountRate',
                 width: 100,
                 render: (value) => {
                     return <span title={value}>{value}</span>
                 },
             },
             {
                 title: '单张券售卖价格',
                 dataIndex: 'singlePrice',
                 key: 'singlePrice',
                 width: 120,
                 render: (value) => {
                     if (!value) return '—'
                     return <span title={value}>{value}</span>
                 },
             },
             {
                 title: '创建人',
                 dataIndex: 'createBy',
                 key: 'createBy',
                 width: 100,
                 render: (value) => {
                     return <span title={value}>{value}</span>
                 },
             },
             {
                 title: '创建时间',
                 dataIndex: 'createStamp',
                 key: 'createStamp',
                 width: 150,
                 render: (value) => {
                     return <span title={moment(value).format('YYYY-MM-DD HH:mm:ss')}>{moment(value).format('YYYY-MM-DD HH:mm:ss')}</span>
                 },
             },
             {
                 title: '审批状态',
                 dataIndex: 'auditStatus',
                 key: 'auditStatus',
                 width: 100,
                 render: (value) => {
                     return <span style={{ color: aduitColorMap[value] }}title={auditStatusMap[value]}>{auditStatusMap[value]}</span>
                 },
             },
             {
                 title: '发起审批时间',
                 dataIndex: 'applyTime',
                 key: 'applyTime',
                 width: 150,
                 render: (value, { auditStatus }) => {
                     if (!value) return '—'
                     return auditStatus !== 0 ? <span title={timeFormat(value)}>{timeFormat(value) || '—'}</span> : '—'
                 },
             },
             {
                 title: '推送状态',
                 dataIndex: 'syncStatus',
                 key: 'syncStatus',
                 width: 100,
                 render: (value) => {
                     if (!value) return '—'
                     return <span title={statusMap[value] || '—'}>{statusMap[value] || '—'}</span>
                 },
             },
             {
                 title: '推送时间',
                 dataIndex: 'syncTime',
                 key: 'syncTime',
                 width: 130,
                 render: (value) => {
                     if (!value) return '—'
                     return <span title={timeFormat(value)}>{timeFormat(value) }</span>
                 },
             },

         ];

         const headerClasses = `layoutsToolLeft ${styles2.headerWithBgColor} ${styles2.basicPromotionHeader}`;

         const tableColumns = columns(this.handleOperate)

         if (tabkey === '2') {
             tableColumns.splice(1, 1)
         }


         const contextBody = key => (
             <div>
                 <div style={{ padding: '0' }} className="layoutsHeader">
                     <div className="layoutsSearch">
                         <ul>
                             <li className={styles.formWidth}>
                                 <BaseForm
                                     getForm={form => (key === '1' ? this.queryFroms1 = form : this.queryFroms2 = form)}
                                     formItems={formItems}
                                     formKeys={formKeys}
                                     formData={queryParams}
                                     layout="inline"
                                 />
                             </li>
                             <li>
                                 {/* <Authority rightCode={GIFT_LIST_QUERY}> */}
                                 <Button type="primary" onClick={() => this.queryTableData()}>
                                     <Icon type="search" />
                                     查询
                                 </Button>
                                 {/* </Authority> */}
                             </li>
                         </ul>
                     </div>
                     <div style={{ margin: '0' }} className="layoutsLine"></div>
                 </div>
                 <div className={[styles.giftTable, styles2.tableClass, 'layoutsContent'].join(' ')}>

                     <Table
                         bordered={true}
                         columns={tableColumns}
                         dataSource={dataSource}
                         pagination={{
                             showSizeChanger: true,
                             pageSize,
                             pageSizeOptions: ['25', '50', '100', '200'],
                             current: pageNo,
                             total,
                             showQuickJumper: true,
                             onChange: this.handlePageChange,
                             onShowSizeChange: this.handlePageChange,
                             showTotal: (total, range) => `本页${range[0]}-${range[1]}/ 共 ${total}条`,
                         }}
                         loading={loading}
                         scroll={{ x: 1000, y: 'calc(100vh - 440px)' }}
                     />
                 </div>
             </div>
         )
         return (
             <div className="layoutsContainer" ref={layoutsContainer => this.layoutsContainer = layoutsContainer}>
                 <div className="layoutsTool" style={{ height: '64px' }}>
                     <div className={headerClasses}>
                         <span className={styles2.customHeader}>
                             券批次管理
                         </span>
                         <p style={{ marginLeft: 'auto' }}>
                             {/* <Authority rightCode={GIFT_LIST_CREATE}> */}
                             <Button
                                 type="primary"
                                 icon="plus"
                                 className={styles2.jumpToCreateInfo}
                                 style={{ margin: 5 }}
                                 onClick={
                                     () => {
                                         this.setState({
                                             createCouponVisible: true,
                                             operateKey: 'add',
                                         }, () => {
                                             this.queryCouponList()
                                         })
                                     }
                                 }
                             >创建券批次</Button>
                             {/* </Authority> */}
                         </p>
                     </div>
                 </div>
                 <div className={styles2.pageContentWrapper}>
                     <div>

                         <Tabs activeKey={tabkey} onChange={this.tabChange} className={styles.tabBox} >
                             <TabPane tab="券批次查询" key="1">
                                 {contextBody('1')}
                             </TabPane>
                             <TabPane tab="已停用券批次" key="2">
                                 {contextBody('2')}
                             </TabPane>
                         </Tabs>
                     </div>
                 </div>


                 {createCouponVisible && <Modal title={`${this.state.modalType === 'edit' ? '编辑' : '创建'}券批次`} width={700} visible={createCouponVisible} onOk={this.createCouponOk} onCancel={this.closeModal}>

                     <Row>
                         <Col span={24} offset={1}>
                             <Form className={styles.crmSuccessModalContentBox}>
                                 <FormItem
                                     label="券批次名称"
                                     labelCol={{ span: 6 }}
                                     wrapperCol={{ span: 16 }}
                                     required={true}
                                 >

                                     {getFieldDecorator('remark', {
                                         initialValue: record.remark,
                                         rules: [
                                             { required: true,
                                                 // message: '请输入券批次名称',

                                                 validator: (rule, value, callback) => {
                                                     // 正则汉字
                                                     if (value && value.length > 20) {
                                                         return callback('最多输入20位')
                                                     }

                                                     if (!value) {
                                                         return callback('券批次名称');
                                                     }
                                                     return callback();
                                                 },
                                             },
                                         ],
                                     })(
                                         <Input
                                             placeholder="请输入券批次名称"
                                         />
                                     )}
                                 </FormItem>
                                 <FormItem
                                     label="选择优惠券"
                                     labelCol={{ span: 6 }}
                                     wrapperCol={{ span: 16 }}
                                     required={true}
                                 >
                                     {
                                         getFieldDecorator('giftItemID', {
                                             //  initialValue: { [record.giftName]: record.giftItemID },

                                             initialValue: record.giftItemID && record.giftType ? `${record.giftItemID}_${record.giftType}` : '',
                                             onChange: this.handleCouponChange,
                                             rules: [
                                                 { required: true, message: '请选择优惠券' },
                                             ],
                                         })(
                                             <TreeSelect
                                                 dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                 treeData={treeData}
                                                 placeholder="请选择优惠券"
                                                 showSearch={true}
                                                 treeNodeFilterProp="label"
                                                 allowClear={true}
                                             />
                                         )
                                     }
                                 </FormItem>
                                 {this.renderCoupon()}
                                 <FormItem
                                     label="合同编号"
                                     labelCol={{ span: 6 }}
                                     wrapperCol={{ span: 16 }}
                                     required={true}
                                 >
                                     {getFieldDecorator('contractCode', {
                                         initialValue: record.contractCode,
                                         rules: [
                                             { required: true,
                                                 validator: (rule, value, callback) => {
                                                 // 正则汉字
                                                     //  if (/[^\u00-\uFF]/.test(value)) {
                                                     //      return callback('请输入合同编号')
                                                     //  }


                                                     if (!value) {
                                                         return callback('请输入合同编号');
                                                     }

                                                     return callback();
                                                 },
                                             },


                                         ],
                                     })(
                                         <Select placeholder="请输入合同编号" >
                                             {
                                                 couponList && couponList.length ? couponList.map(({ label, value }) => (
                                                     <Select.Option key={value}>{label}</Select.Option>
                                                 )) : []
                                             }

                                         </Select>
                                     )}
                                 </FormItem>
                                 <FormItem
                                     label="单张券售卖价格"
                                     labelCol={{ span: 6 }}
                                     wrapperCol={{ span: 16 }}
                                 >

                                     {getFieldDecorator('singlePrice', {
                                         initialValue: { number: record.singlePrice },
                                         rules: [
                                             { required: false,
                                                 validator: (rule, value, callback) => {
                                                     // 正则正数 8位 保留两位小数
                                                     //  const pattern = /^(([1-9]\d{0,7})|0)(\.\d{0,2})?$/;
                                                     //  if (!pattern.test(value.number)) {
                                                     //      return callback('最大支持8位整数，2位小数');
                                                     //  }

                                                     return callback();
                                                 } },
                                         ],
                                     })(

                                         <PriceInput
                                             maxNum={8}
                                             modal="int"
                                             placeholder="请输入单张券售卖价格"
                                         />
                                     )}
                                 </FormItem>


                                 <FormItem
                                     label="活动费用"
                                     labelCol={{ span: 6 }}
                                     wrapperCol={{ span: 16 }}
                                     required={true}
                                 >

                                     {getFieldDecorator('activityCost', {
                                         initialValue: { number: isNumber(record.activityCost) ? `${record.activityCost}` : '' },
                                         onChange: e => this.setDiscountRate(e, 'activityCost'),
                                         rules: [
                                             { required: true,
                                                 validator: (rule, value, callback) => {
                                                     if (!value || value.number === '' || value.number === null) {
                                                         return callback('请输入活动费用');
                                                     }
                                                     // 正则正数 8位 保留两位小数
                                                     //  const pattern = /^(([1-9]\d{0,7})|0)(\.\d{0,2})?$/;
                                                     //  if (!pattern.test(value.number)) {
                                                     //      return callback('最大支持8位整数，2位小数');
                                                     //  }

                                                     return callback();
                                                 } },
                                         ],
                                     })(
                                         <PriceInput
                                             maxNum={8}
                                             value={{ number: activityCost }}
                                             modal="int"
                                             placeholder="请输入活动费用"
                                         />
                                     )}
                                 </FormItem>

                                 <FormItem
                                     label="预计销售额"
                                     labelCol={{ span: 6 }}
                                     wrapperCol={{ span: 16 }}
                                     required={true}
                                 >

                                     {getFieldDecorator('estimatedSales', {
                                         initialValue: { number: isNumber(record.estimatedSales) ? `${record.estimatedSales}` : '' },
                                         onChange: e => this.setDiscountRate(e, 'estimatedSales'),
                                         rules: [
                                             { required: true,
                                                 validator: (rule, value, callback) => {
                                                     if (!value || value.number === '' || value.number === null) {
                                                         return callback('请输入预计销售额');
                                                     }
                                                     // 正则正数 8位 保留两位小数
                                                     //  const pattern = /^(([1-9]\d{0,7})|0)(\.\d{0,2})?$/;
                                                     //  if (!pattern.test(value.number)) {
                                                     //      return callback('最大支持8位整数，2位小数');
                                                     //  }
                                                     return callback();
                                                 },
                                             },
                                         ],

                                     })(
                                         <PriceInput
                                             maxNum={8}
                                             value={{ number: estimatedSales }}
                                             modal="int"
                                             placeholder="请输入预计销售额"
                                         />
                                     )}
                                 </FormItem>

                                 <FormItem
                                     label="折扣率"
                                     labelCol={{ span: 6 }}
                                     wrapperCol={{ span: 16 }}
                                     required={true}
                                 >
                                     {getFieldDecorator('discountRate', {
                                         initialValue: record.discountRate,
                                     })(
                                         <span>{discountRate}%</span>
                                     )}
                                 </FormItem>
                             </Form>
                         </Col>
                     </Row>
                 </Modal>}
             </div>
         )
     }
}


export default Form.create({})(CouponBatchPage);
