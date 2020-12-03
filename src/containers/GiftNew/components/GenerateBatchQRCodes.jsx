import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { COMMON_LABEL } from 'i18n/common';
import Immutable from 'immutable';
import {
    Table,
    Button,
    Icon,
    DatePicker,
    Radio,
    Input,
    Modal,
    Form,
    Select,
    message,
    Tooltip,
} from 'antd';
import styles from '../../SaleCenterNEW/ActivityPage.less';
import PriceInput from "../../SaleCenterNEW/common/PriceInput";
import {axiosData} from "../../../helpers/util";
import {
    queryWechatMpInfo,
    FetchQuotaCardBatchNo,
} from "../../GiftNew/_action";
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const QR_CODE_EFFECT_DAYS = new Array(30)
    .fill(0)
    .map((_, index) => ({
        value: `${index + 1}`,
        label: `${index + 1}天`
    }));
const { Button: RadioButton, Group: RadioGroup } = Radio;
class GenerateBatchQRCodes extends Component {

    constructor(props) {
        super(props);
        this.state = {
            historyList: [],
            loading: false,
            pageSizes: 10,
            pageNo: 1,
            total: 0,
            queryDateRange: [],                 // 列表查询时的日期选择
            confirmLoading: false,
            modalVisible: false,
            batchItemID: undefined,
            mpID: undefined,
            startNo: undefined,
            endNo: undefined,
            qrEffectDays: '30',                 // 二维码默认有效期30天, 0代表永久有效
            selectedBatchEntity: null,
            description: '',
            exportType: '0',
            qrCodeType: '0',                    // 0 公众号关注二维码， 1 普通二维码
            qrCodeValidateType: '0',            // 0 临时二维码， 1 永久二维码
        };
    }

    componentDidMount(){
        this.props.queryWechatMpInfo();
        this.props.fetchQuotaCardBatchNo({giftItemID: this.props.giftItemID})
        this.handleQuery()
    }

    handleQuery = (pageNo = this.state.pageNo) => {
        this.setState({
           loading: true,
        });
        const params = {
            giftItemID: this.props.giftItemID,
            batchType: 3,
        };
        if (this.state.queryDateRange[0] && this.state.queryDateRange[1]) {// Moment[]
            params.startDate = this.state.queryDateRange[0].format('YYYYMMDD');
            params.endDate = this.state.queryDateRange[1].format('YYYYMMDD');
        }
        axiosData('/coupon/couponEntityService_getGiftBatchs.ajax', {...params, pageNo}, {}, {path: 'data'}, )
            .then(res => {
                this.setState({
                    historyList: res.giftBatchResList || [],
                    total: (res.giftBatchResList || []).length ? (res.totalSize || 0) : 0,
                    pageNo: (res.giftBatchResList || []).length ? (res.pageNo || 1) : 1,
                    loading: false,
                });
            })
            .catch(err => {
                this.setState({
                    loading: false,
                });
            })
    }

    handleBatchNoChange = (v) => {
        const batchNoList = Immutable.List.isList(this.props.$$batchNoInfo) ?
            this.props.$$batchNoInfo.toJS() : [];
        const batchEntity = batchNoList.find(item => item.itemID === v);
        this.setState({
            batchItemID: v,
            selectedBatchEntity: batchEntity,
        });
    }

    handleMpIDChange = (v) => {
        this.setState({
            mpID: v,
        });
    }

    handleQueryDateRangeChange = (val) => {
        this.setState({
            queryDateRange: val,
        });
    }

    handleGiftCountChange = (val) => {
        this.setState({
            giftCount: val.number,
        });
    }

    handleStartNoChange = (val) => {
        this.setState({
            startNo: val.number,
        }, () => {
            const endNoValue = this.props.form.getFieldValue('endNo');
            if (endNoValue.number && (Number(val.number || 0) > Number(endNoValue.number))) {
                this.props.form.setFields({
                    endNo: {
                        value: endNoValue,
                        errors: ['终止号必须大于等于起始号'],
                    }
                })
            } else {
                this.props.form.setFields({
                    endNo: {
                        value: endNoValue,
                        // errors: [],
                    }
                })
            }
        });
    }

    handleDescriptionChange = (event) => {
        this.setState({
            description: event.target.value,
        });
    }

    handleEndNoChange = (val) => {
        this.setState({
            endNo: val.number,
        });
    }

    handleQrEffectDaysChange = (value) => {
        this.setState({
            qrEffectDays: value
        })
    }
    handleExportTypeChange = (value) => {
        this.setState({
            exportType: value.target.value,
        })
    }

    // 接口文档
    // @ref http://wiki.hualala.com/pages/viewpage.action?pageId=33301063
    mapStateToRequestParams = () => {
        const {
            selectedBatchEntity,
            startNo,
            endNo,
            mpID,
            batchItemID,
            description: remark,
            qrEffectDays,
            exportType,
            qrCodeType,
            qrCodeValidateType,
        } = this.state;
        return {
            giftItemID: this.props.giftItemID,
            startNo,
            endNo,
            itemID: batchItemID,
            batchNo: selectedBatchEntity.batchNO,
            mpID,
            remark,
            qrEffectDays: this.handleQrEffectDays(), // 0 代表永久有效
            exportType,
            qrCodeType,                                                 // 普通二维码，关注二维码
        };
    }

    handleQrEffectDays = ()=>{
        const { qrCodeValidateType, qrCodeType, qrEffectDays } = this.state;
        if(qrCodeType == '1') {
            return '0'
        } else if (qrCodeType == '0' && qrCodeValidateType == '1'){
            return '0'
        } else {
            return qrEffectDays;
        }
    }


    handleModalOk = () => {
        let flag = true;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                flag = false;
            }
        });
        if (!flag) return;
        const {
            selectedBatchEntity,
            startNo,
            endNo,
        } = this.state;
        if (!selectedBatchEntity) {
            return message.warning('请重新选择批次号');
        }
        if (startNo < selectedBatchEntity.startNO || endNo > selectedBatchEntity.endNO) {
            return message.warning('所输入起止号要符合该批次起止号范围');
        }
        this.setState({
            confirmLoading: true,
        });
        const params = this.mapStateToRequestParams();
        axiosData('/coupon/couponQuotaService_genQRCode.ajax', params, {}, {path: 'data'}, )
            .then(res => {
                this.setState({
                    confirmLoading: false,
                    modalVisible: false,
                    batchItemID: undefined,
                    mpID: undefined,
                    startNo: undefined,
                    endNo: undefined,
                    selectedBatchEntity: null,
                    description: '',
                    qrEffectDays: '30',
                    exportType: '0'
                }, () => {
                    this.handleQuery();
                    this.props.form.resetFields();
                });
            })
            .catch(err => {
                this.setState({
                    confirmLoading: false,
                });
            })
    }

    showModal = () => {
        this.setState({
            modalVisible: true,
        });
    }

    hideModal = () => {
        this.setState({
            modalVisible: false,
            confirmLoading: false,
            validDateRange: [], // 制券时选择的有效日期
            giftCount: undefined, // 张数
            startNo: undefined,
            endNo: undefined,
            description: '',
        }, () => {
            this.handleQuery();
            this.props.form.resetFields();
        });
    }

    /**
     * 二维码类型处理
    */
    handleQrType = ({target: {value}}) => {
        this.setState({
            qrCodeType: value,
        })
    }

    /**
     * 集中处理 state 数据变更
    */
    handleStateValChange = (key, val)=>{
        this.setState({
            [key]: val
        })
    }


    renderHeader() {
        return (
            <div className={styles.generateBatchGiftsHeader}>
                <div>
                    制码时间：
                    <RangePicker
                        style={{ width: 240 }}
                        value={this.state.queryDateRange}
                        onChange={this.handleQueryDateRangeChange}
                    />
                </div>
                <div>
                    <Button
                        type="primary"
                        disabled={this.state.loading}
                        onClick={() => {
                            this.handleQuery(1)
                        }}
                    >
                        <Icon type="search" />
                        { COMMON_LABEL.query }
                    </Button>

                    <Button
                        style={{ marginLeft: 15 }}
                        type="primary"
                        onClick={this.showModal}
                    >
                        生成二维码
                    </Button>
                </div>
            </div>
        )
    }

    renderTable() {
        const columns = [
            {
                title: COMMON_LABEL.serialNumber,
                className: 'TableTxtCenter',
                width: 50,
                key: 'index',
                render: (text, record, index) => {
                    return (this.state.pageNo - 1) * this.state.pageSizes + index +1;
                },
            },
            {
                title: '制码时间',
                className: 'TableTxtCenter',
                width: 120,
                dataIndex: 'createStamp',
                key: 'key5',
                render: (text, record, index) => {
                    return moment(new Date(text)).format('YYYY-MM-DD HH:mm:ss')
                },
            },
            {
                title: '批次号',
                className: 'TableTxtCenter',
                width: 80,
                dataIndex: 'batchNo',
                key: 'batchNo',
            },
            {
                title: '起始号',
                className: 'TableTxtCenter',
                width: 80,
                dataIndex: 'startNo',
                key: 'startNo',
            },
            {
                title: '终止号',
                className: 'TableTxtCenter',
                width: 80,
                dataIndex: 'endNo',
                key: 'endNo',
            },
            {
                title: COMMON_LABEL.remark,
                className: 'TableTxtCenter',
                dataIndex: 'remark',
                width: 160,
                key: 'key3',
                render: text => {
                    return <span title={text}>{text}</span> ;
                },
            },
            {
                title: '操作员',
                className: 'TableTxtCenter',
                width: 120,
                dataIndex: 'createBy',
                key: 'key4',
            },
            {
                title: '二维码/链接剩余有效期',
                className: 'TableTxtCenter',
                width: 110,
                dataIndex: 'qrEffectDays',
                key: 'key11',
                render: (qrEffectDays, record) => {
                    if(qrEffectDays == 0) {
                        return '永久有效'
                    }

                    if (!(qrEffectDays > 0)) {
                        return '--'
                    }
                    const remainDays = moment(new Date(record.createStamp)).add(qrEffectDays, 'days')
                    .diff(moment(), 'days', true).toFixed(1); // float
                    return remainDays >= 0 ? `${remainDays}天` : '已过期'
                }
            },
            {
                title: COMMON_LABEL.status,
                className: 'TableTxtCenter',
                width: 80,
                dataIndex: 'status',
                key: 'key6',
                render: (status, record, index) => {
                    const text = ((stat) => {
                        switch (stat) {
                            case 1: return '新建';
                            case 2: return '准备';
                            case 3: return '正在生成';
                            case 4: return '生成完毕';
                            case 5: return '正在导出';
                            case 6: return '已导出';
                            case 7: return '导出失败';
                            case 8: return '生成失败';
                            default: return '--'
                        }
                    })(status);
                    return <span title={text}>{text}</span> ;
                },
            },
            {
                title: COMMON_LABEL.actions,
                className: 'TableTxtCenter',
                width: 50,
                key: 'key7',
                dataIndex: 'downLoadUrl',
                render: (text, record, index) => {
                    if (record.status == 6 && text) {
                        return <a download target="_blank" href={text}>{ COMMON_LABEL.download }</a>
                    }
                    return '--'
                },
            },
        ];
        return (
            <Table
                bordered={true}
                columns={columns}
                scroll={{x: '1025'}}
                dataSource={this.state.historyList}
                loading={this.state.loading}
                pagination={{
                    pageSize: this.state.pageSizes,
                    current: this.state.pageNo,
                    showQuickJumper: true,
                    total: this.state.total ? this.state.total : 0,
                    showTotal: (total, range) => `本页${range[0]}-${range[1]} / 共 ${total} 条`,
                    onChange: (page, pageSize) => {
                        this.setState({
                            pageNo: page,
                        }, () => {
                            this.handleQuery()
                        })
                    },
                }}
            />
        )
    }

    renderStartAndEndNumber() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <FormItem
                    label="批次起止号"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 11 }}
                    required
                >
                    <div className={styles.flexFormItem}>
                        <FormItem
                            className={`${styles.FormItemStyle} ${styles.childFormItem}`}
                            wrapperCol={{ span: 24 }}
                        >
                            {
                                getFieldDecorator('startNo', {
                                    initialValue: {number: this.state.startNo},
                                    onChange: this.handleStartNoChange,
                                    rules: [
                                        {
                                            validator: (rule, v, cb) => {
                                                if (!v || !v.number) {
                                                    return cb('起始号为必填项');
                                                }
                                                if(v.number > 999999){
                                                    return cb('请输入6位以内的整数');
                                                }
                                                cb()
                                            },
                                        },
                                    ],
                                })(
                                    <PriceInput
                                        modal="int"
                                        placeholder="批次起始号"
                                        maxNum={15}
                                    />
                                )
                            }
                        </FormItem>
                        &nbsp;-&nbsp;
                        <FormItem
                            className={`${styles.FormItemStyle} ${styles.childFormItem}`}
                            wrapperCol={{ span: 24 }}
                        >
                            {
                                getFieldDecorator('endNo', {
                                    initialValue: {number: this.state.endNo},
                                    onChange: this.handleEndNoChange,
                                    rules: [
                                        {
                                            validator: (rule, v, cb) => {
                                                if (!v || !v.number) {
                                                    return cb('终止号为必填项');
                                                }
                                                if (Number(v.number || 0) < Number(this.props.form.getFieldValue('startNo').number || 0)) {
                                                    return cb('不能小于起始号')
                                                }
                                                if(v.number > 999999){
                                                    return cb('请输入6位以内的整数');
                                                }
                                                cb()
                                            },
                                        },
                                    ],
                                })(
                                    <PriceInput
                                        modal="int"
                                        maxNum={15}
                                        placeholder="批次终止号"
                                    />
                                )
                            }
                        </FormItem>
                    </div>
                </FormItem>
            </div>

        )
    }

    // 渲染二维码有效期类型（是否永久）
    renderQrTypeSetting = ()=>{
        const { qrCodeType, qrCodeValidateType } = this.state;
        // 普通二维码
        if(qrCodeType == '1') {
            return null;
        }
        return (
            <FormItem
                label={(
                    <div style={{ display: 'inline-block'}}>
                        <span>二维码有效期</span>
                        <Tooltip title={
                            <div>
                                <p>
                                    临时码：受微信限制，有效期最长可设置30天；
                                </p>
                                <p>
                                    永久码：永久有效，但会占用10000条/公众号 永久码额度；
                                </p>
                            </div>
                        }>
                            <Icon style={{ marginLeft: 5, marginRight: -5}} type="question-circle-o" />
                        </Tooltip>
                    </div>
                )}
                className={styles.FormItemStyle}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 11 }}
                required
            >
                <RadioGroup style={{ width: '100%' }} value={qrCodeValidateType} onChange={({target: {value}})=>this.handleStateValChange('qrCodeValidateType', value)}>
                    <div>
                        <Radio key={'0'} value={'0'} style={{marginRight: 0}}>
                            <Tooltip
                                placement="topRight"
                                title={'受微信限制，有效期最长可设置30天'}
                            >临时码</Tooltip>
                        </Radio>{this.renderQrExpiringDate()}
                    </div>
                    <div>
                        <Radio key={'1'} value={'1'}>
                            <Tooltip
                                placement="topRight"
                                title={'永久有效，但会占用10000条/公众号 永久码的额度'}
                            >
                                永久码
                            </Tooltip>
                        </Radio>
                    </div>
                </RadioGroup>
            </FormItem>
        )
    }

    // 渲染二维码有效期
    // 永久码不渲染日期设置， 二维码类型为普通码不设置日期（长期有效）
    renderQrExpiringDate = ()=>{
        const { qrCodeValidateType, qrCodeType } = this.state;
        if(qrCodeValidateType == '1' || qrCodeType == '1') {
            return null
        }
        return (
            <FormItem
                    label="，有效期"
                    className={styles.validity}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 10 }}
                >
                    <Select
                        value={this.state.qrEffectDays}
                        onChange={this.handleQrEffectDaysChange}
                    >
                        {
                            QR_CODE_EFFECT_DAYS.map(({value, label}) => (
                                <Select.Option key={value} value={value}>{label}</Select.Option>
                            ))
                        }
                    </Select>
                </FormItem>
        )
    }

    // 选择公众号
    renderOfficeAccountSetting = ()=>{

        const { qrCodeType } = this.state;
        // 普通二维码
        if(qrCodeType == '1') {
            return null;
        }
        const {
            form: {
                getFieldDecorator,
            },
            allWeChatAccountList,
        } = this.props;
        const mpInfoList = Immutable.List.isList(allWeChatAccountList) ? allWeChatAccountList.toJS() : [];

        return (
            <FormItem
                    label="关注公众号"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 11 }}
                    required
                >{
                    getFieldDecorator('mpID', {
                        onChange: this.handleMpIDChange,
                        rules: [
                            { required: true, message: '公众号不能为空' },
                        ],
                    })(
                        <Select
                            placeholder="请选择需要关注的公众号"
                        >
                            {
                                mpInfoList.map(({mpID, mpName}) => (
                                    <Select.Option key={mpID} value={mpID}>{mpName}</Select.Option>
                                ))
                            }
                        </Select>
                    )
                }
                </FormItem>
        )
    }

    renderModalContent() {
        const {
            form: {
                getFieldDecorator,
            },
            $$batchNoInfo,
        } = this.props;
        const batchNoList = Immutable.List.isList($$batchNoInfo) ? $$batchNoInfo.toJS() : [];
        return (
            <div>
                <div className={styles.qrModalTitCon}>
                    <p>二维码/实体卡在给到用户前，请先操作批量售卖，或在POS上操作礼品卡售卖，否则用户无法充值或使用</p>
                </div>
                <Form>
                    <FormItem
                        label="批次号"
                        className={styles.FormItemStyle}
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 11 }}
                        required
                    >{
                        getFieldDecorator('batchItemID', {
                            onChange: this.handleBatchNoChange,
                            rules: [
                                { required: true, message: '批次号不能为空' },
                            ],
                        })(
                            <Select
                                size="default"
                                placeholder="请选择定额卡批次"
                                getPopupContainer={(node) => node.parentNode}
                            >
                                {
                                    batchNoList.map(item => (
                                        <Select.Option
                                            key={item.itemID}
                                            value={`${item.itemID}`}
                                        >
                                            {`${item.batchNO}（该批次起始号：${item.startNO}，终止号：${item.endNO}）`}
                                        </Select.Option>
                                    ))
                                }
                            </Select>
                        )
                    }
                    </FormItem>
                    {
                        this.renderStartAndEndNumber()
                    }
                    <FormItem
                        label= {
                            (
                                <div style={{ display: 'inline-block'}}>
                                    <span>二维码类型</span>
                                    <Tooltip title={
                                        <div style={{maxWidth: 600}}>
                                        <h4>公众号关注二维码 </h4>
                                        <div style={{paddingBottom: 10}}>
                                                <p>优势：只能使用微信扫码进行充值。用户使用微信扫描二维码后需要先关注公众号再充值礼品卡。优势是可以增加公众号粉丝并且用户完成充值后可以通过公众号配置的菜单快捷找到会员卡看到充值金额。</p>
                                                <p>劣势：</p>
                                                <ul style={{
                                                    listStyle: 'disc',
                                                    paddingLeft: 40
                                                }}>
                                                    <li>
                                                        仅能使用微信进行扫码充值
                                                    </li>
                                                    <li>
                                                        永久码占用微信公众号10000关注码上限额度；临时码最长仅支持30天有效期。
                                                    </li>
                                                </ul>
                                        </div>

                                        <h4>普通二维码 </h4>
                                        <div>

                                                <p>优势：</p>
                                                <ul style={{
                                                    listStyle: 'disc',
                                                    paddingLeft: 40
                                                }}>
                                                    <li>
                                                        用户无需关注公众号，支持使用微信、支付宝扫码进行充值
                                                    </li>
                                                    <li>
                                                        二维码永久有效
                                                    </li>
                                                </ul>
                                                <p>劣势：用户充值后不方便查找充值金额</p>
                                        </div>
                                        </div>
                                    }>
                                        <Icon style={{ marginLeft: 5, marginRight: -5}} type="question-circle-o" />
                                    </Tooltip>
                                </div>
                            )
                        }
                        className={styles.FormItemStyle}
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 11 }}
                        required
                    >
                        <RadioGroup value={this.state.qrCodeType} onChange={this.handleQrType}>
                            <Radio key={'0'} value={'0'}>公众号关注二维码</Radio>
                            <Radio key={'1'} value={'1'}>普通二维码</Radio>
                        </RadioGroup>
                    </FormItem>
                    {this.renderOfficeAccountSetting()}
                    {this.renderQrTypeSetting()}
                    {/*this.renderQrExpiringDate()*/}
                    <FormItem
                        label={(
                            <div style={{ display: 'inline-block'}}>
                                <span>导出样式</span>
                                <Tooltip title={
                                    <div>
                                        <p>
                                            当二维码类型为“公众号关注二维码”，且导出样式为“普通链接”时，普通链接无法点击打开，需要转成二维码后使用微信扫码打开；
                                        </p>
                                        <p>
                                            应用场景：部分卡厂在制卡时，需要导入链接再转为二维码体现在实体卡上，此时导出样式可以选择“普通链接”
                                        </p>
                                    </div>
                                }>
                                    <Icon style={{ marginLeft: 5, marginRight: -5}} type="question-circle-o" />
                                </Tooltip>
                            </div>
                        )}
                        className={styles.FormItemStyle}
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 11 }}
                    >
                        <RadioGroup value={this.state.exportType} onChange={this.handleExportTypeChange}>
                            <Radio key={'0'} value={'0'}>二维码</Radio>
                            <Radio key={'1'} value={'1'}>普通链接</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem
                        label={ COMMON_LABEL.remark }
                        className={styles.FormItemStyle}
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 11 }}
                        required
                    >{
                        getFieldDecorator('description', {
                            initialValue: this.state.description,
                            onChange: this.handleDescriptionChange,
                            rules: [
                                { required: true, message: '不能为空' },
                                {
                                    message: '汉字、字母、数字组成，不多于20个字符',
                                    pattern: /^[\u4E00-\u9FA5A-Za-z0-9.（）()\-]{1,20}$/,
                                },
                            ],
                        })(
                            <Input
                                type="textarea"
                                placeholder="请输入备注信息"
                            />
                        )
                    }
                    </FormItem>
                </Form>
            </div>
        )
    }



    render() {
        return (
            <div>
                {this.renderHeader()}
                {this.renderTable()}
                <Modal
                    key="批量生成二维码"
                    title="批量生成二维码"
                    maskClosable={false}
                    visible={this.state.modalVisible}
                    confirmLoading={this.state.confirmLoading}
                    width={950}
                    onCancel={this.hideModal}
                    onOk={this.handleModalOk}
                >
                    {this.state.modalVisible && this.renderModalContent()}
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        $$batchNoInfo: state.sale_giftInfoNew.get('batchNoInfo'),
        allWeChatAccountList: state.sale_giftInfoNew.get('mpList'),
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        queryWechatMpInfo: (opts) => {
            dispatch(queryWechatMpInfo(opts))
        },
        fetchQuotaCardBatchNo: opts => dispatch(FetchQuotaCardBatchNo(opts)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(GenerateBatchQRCodes));
