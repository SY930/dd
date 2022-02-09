import React, { Component } from 'react';
import moment from 'moment';
import { COMMON_LABEL } from 'i18n/common';
import {
    Table,
    Button,
    Icon,
    DatePicker,
    Radio,
    Checkbox,
    Input,
    Modal,
    Form,
    Row,
    Col,
    message,
    Alert,
    Tooltip,
    Select
} from 'antd';
import { getAccountInfo } from 'helpers/util'
import styles from '../../SaleCenterNEW/ActivityPage.less';
import PriceInput from "../../SaleCenterNEW/common/PriceInput";
import CloseableTip from "../../../components/common/CloseableTip/index";
import { axiosData } from "../../../helpers/util";
import {
    getWechatMpInfo, getImgTextList
} from './AxiosFactory';
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;
const BATCH_LIMIT = 100000;
const defaultImgTxt = { resTitle: '叮咚！天上掉下一堆券，点我点我点我', digest: '为小主准备的超级大礼包，点我查看' };
const imgURI = 'http://res.hualala.com/';
class GenerateBatchGifts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            historyList: [],
            loading: false,
            pageSizes: 10,
            pageNo: 1,
            total: 0,
            queryDateRange: [], // 列表查询时的日期选择
            confirmLoading: false,
            modalVisible: false,
            autoGenerating: '1', // 是否系统自动生成券码 1 自动, 2 手动填写起止号, string
            validDateRange: [], // 制券时选择的有效日期
            giftCount: undefined, // 张数
            startNo: undefined,
            endNo: undefined,
            description: '',
            includeRandomCode: false, // 券码是否包含随机码 true: 包含, false: 不包含
            mpError: false,
            imgError: false,
            mpInfoList: [],//公众号列表
            imgList: [],//图文消息列表
            sendCouponType: '1',//生成形式 1 券码 2 二维码" 默认券码
            sendCouponExpand: '1',
            mpID: '',//选中公众号ID
            imgID: '',//选中的图文消息ID
            mpTitle: '',//图文title
            imageUrl: '',//图文imageUr
            mpDescription: '',//图文description
            item: defaultImgTxt,
        };
        this.handleQuery = this.handleQuery.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.handleAutoGeneratingChange = this.handleAutoGeneratingChange.bind(this);
        this.handleSelectSendCouponType = this.handleSelectSendCouponType.bind(this);
        this.handleModalOk = this.handleModalOk.bind(this);
        this.handleValidDateRangeChange = this.handleValidDateRangeChange.bind(this);
        this.handleQueryDateRangeChange = this.handleQueryDateRangeChange.bind(this);
        this.handleGiftCountChange = this.handleGiftCountChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleStartNoChange = this.handleStartNoChange.bind(this);
        this.handleEndNoChange = this.handleEndNoChange.bind(this);
        this.handleIncludeRandomCode = this.handleIncludeRandomCode.bind(this);
    }

    componentDidMount() {
        this.handleQuery()
        this.onQueryStep2Data();
    }

    isDisabledTime = () => {
        const time = moment().format('HHmm')
        return (time >= 1100 && time <= 1400) || (time >= 1700 && time <= 2030)
    }
    onQueryStep2Data = () => {
        const { groupID } = this.props;
        const params = { groupID, pageNo: 1, pageSize: 1000 };
        getWechatMpInfo(params).then(mpInfoList => {
            this.setState({ mpInfoList });
        });
        const params2 = { ...params, resType: 0 };
        getImgTextList(params2).then(imgList => {
            this.setState({ imgList });
        });
    }
    handleQuery(pageNo = this.state.pageNo) {
        this.setState({
            loading: true,
        });
        const params = {
            giftItemID: this.props.giftItemID,
        };
        if (this.state.queryDateRange[0] && this.state.queryDateRange[1]) {// Moment[]
            params.startDate = this.state.queryDateRange[0].format('YYYYMMDD');
            params.endDate = this.state.queryDateRange[1].format('YYYYMMDD');
        }
        axiosData('/gift/getCouponBatch.ajax', { ...params, pageNo }, {}, { path: '' }, 'HTTP_SERVICE_URL_PROMOTION_NEW')
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

    handleAutoGeneratingChange(event) {
        this.setState({
            autoGenerating: event.target.value,
        });
    }
    handleSelectSendCouponType(event) {
        this.setState({
            sendCouponType: event.target.value,
        });
    }

    handleSelectSendCouponExpand = (e) => {
        this.setState({
            sendCouponExpand: e.target.value,
        });
    }
    handleDescriptionChange(event) {
        this.setState({
            description: event.target.value,
        });
    }

    handleIncludeRandomCode(event) {
        this.setState({
            includeRandomCode: event.target.checked,
        });
    }

    handleValidDateRangeChange(val) {
        this.setState({
            validDateRange: val,
        });
    }

    handleQueryDateRangeChange(val) {
        this.setState({
            queryDateRange: val,
        });
    }

    handleGiftCountChange(val) {
        this.setState({
            giftCount: val.number,
        });
    }

    handleStartNoChange(val) {
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
            } else if (endNoValue.number && (Number(endNoValue.number) - (Number(val.number || 0)) >= BATCH_LIMIT)) {
                this.props.form.setFields({
                    endNo: {
                        value: endNoValue,
                        errors: [`张数不能超过${BATCH_LIMIT}`],
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

    handleEndNoChange(val) {
        this.setState({
            endNo: val.number,
        });
    }

    handleExport(record) {
        const { itemID } = record;
        axiosData('/crmimport/crmExportService_doExportGiftPwdInfo.ajax', { itemID, giftItemID: this.props.giftItemID }, {}, { path: 'data' },)
            .then(res => {
                this.handleQuery()
            })
            .catch(err => {
            })
    }
    handleRetry(record) {
        axiosData(
            '/gift/batchGenCouponCode.ajax',
            { ...record, createBy: getAccountInfo().userName },
            {},
            { path: 'message' },
            'HTTP_SERVICE_URL_PROMOTION_NEW'
        ).then(res => {
            message.success(res || '请求成功');
            this.handleQuery();
        })
    }

    getDateCount() {
        const { validDateRange } = this.state;
        if (!validDateRange[0] || !validDateRange[1]) {
            return '永久';
        } else {
            return `${validDateRange[1].diff(validDateRange[0], 'days') + 1} 天`;
        }
    }

    mapStateToRequestParams() {
        const params = { giftItemID: this.props.giftItemID };
        // 映射state到后端字段
        let {
            includeRandomCode: pwdEndByRand,
            startNo: startNO,
            endNo: endNO,
            giftCount: giftNum,
            sendCouponType,
            sendCouponExpand,
            autoGenerating: generatePwdType, // 生成方式  1：系统自动生成随机的唯一密码 2：按照指定的规则生成 默认为自动生成
            description: remark,
            validDateRange: [EGiftEffectTime, validUntilDate], // EGiftEffectTime 属于后端typo; [0] 为券有效期起始时间, [1] 为券有效期终止时间
            item,
            mpID,
            imgID
        } = this.state;
        if (sendCouponType == '2') {//如果是二维码
            if (!mpID) {
                message.warning('请选择公众号')
                return
            }
            if (!imgID) {
                message.warning('请选择图文消息')
                return
            }
            let { imgPath, digest: description, resTitle: title } = item
            params.mpID = mpID;
            params.title = title;
            params.description = description;
            params.imageUrl = imgURI + imgPath;
        }
        if (generatePwdType === '1') {// 系统自动生成
            params.giftNum = giftNum;
        } else {
            params.startNO = startNO;
            params.endNO = endNO;
            params.giftNum = endNO - startNO + 1; // 按规则生成的券张数是由终止码-起始码+1算出来的, 其实传给后端没什么用, 但是后端要传...
            params.pwdEndByRand = pwdEndByRand ? 1 : 2; // 是否包含随机码1 是 2 否
        }
        if (EGiftEffectTime && validUntilDate) {
            EGiftEffectTime = EGiftEffectTime.format('YYYYMMDD'); // 格式化成字符串
            validUntilDate = validUntilDate.format('YYYYMMDD'); // 格式化成字符串
        } else {
            EGiftEffectTime = moment().format('YYYYMMDD'); // 不填为永久, 实现上为今天 + 100 年
            validUntilDate = moment().add(100, 'year').format('YYYYMMDD');
        }
        params.sendCouponType = sendCouponType == 2 ? sendCouponType : sendCouponExpand;
        params.remark = remark;
        params.EGiftEffectTime = EGiftEffectTime;
        params.validUntilDate = validUntilDate;
        params.generatePwdType = generatePwdType;
        return params;
    }

    handleModalOk() {
        let flag = true;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                flag = false;
            }
        });
        if (flag) {
            this.setState({
                confirmLoading: true,
            });
            const params = this.mapStateToRequestParams();
            axiosData('/gift/batchGenCouponCode.ajax', { ...params, createBy: getAccountInfo().userName }, {}, { path: 'message' }, 'HTTP_SERVICE_URL_PROMOTION_NEW')
                .then(res => {
                    this.setState({
                        confirmLoading: false,
                        modalVisible: false,
                        autoGenerating: '1', // 是否系统自动生成券码 1 自动, 2 手动填写起止号, string
                        sendCouponType: '1',//生成形式 1 券码 2 二维码" 默认券码
                        sendCouponExpand: '1',
                        validDateRange: [], // 制券时选择的有效日期
                        giftCount: undefined, // 张数
                        startNo: undefined,
                        endNo: undefined,
                        description: '',
                        includeRandomCode: false,
                    }, () => {
                        this.handleQuery();
                        this.props.form.resetFields();
                    });
                    message.success(res || '请求成功');
                })
                .catch(err => {
                    this.setState({
                        confirmLoading: false,
                    });
                    this.props.form.resetFields()
                })
        }
    }

    showModal() {
        this.setState({
            modalVisible: true,
        });
    }

    hideModal() {
        this.setState({
            modalVisible: false,
            confirmLoading: false,
            autoGenerating: '1', // 是否系统自动生成券码 1 自动, 2 手动填写起止号, string
            sendCouponType: '1',//生成形式 1 券码 2 二维码" 默认券码
            sendCouponExpand: '1',
            validDateRange: [], // 制券时选择的有效日期
            giftCount: undefined, // 张数
            startNo: undefined,
            endNo: undefined,
            description: '',
            includeRandomCode: false,
        }, () => {
            this.handleQuery();
            this.props.form.resetFields();
        });
    }

    renderHeader() {
        return (
            <div className={styles.generateBatchGiftsHeader}>
                <div>
                    制券时间：
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
                        {COMMON_LABEL.query}
                    </Button>

                    <Button
                        style={{ marginLeft: 15 }}
                        type="primary"
                        onClick={this.showModal}
                    >
                        生成券码
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
                    return (this.state.pageNo - 1) * this.state.pageSizes + index + 1;
                },
            },
            {
                title: '张数',
                className: 'TableTxtCenter',
                width: 50,
                dataIndex: 'totalNum',
                key: 'num',
                render: (text, record, index) => {
                    return record.status == 6 ? Number(text || 0) : text == undefined ? '--' : text;
                },
            },
            {
                title: '制券时间',
                className: 'TableTxtCenter',
                width: 120,
                dataIndex: 'createStamp',
                key: 'key5',
                render: (text, record, index) => {
                    return moment(new Date(text)).format('YYYY-MM-DD HH:mm:ss')
                },
            },
            {
                title: '备注',
                className: 'TableTxtCenter',
                dataIndex: 'remark',
                width: 90,
                key: 'key3',
                render: text => {
                    return <span title={text}>{text}</span>;
                },
            },
            {
                title: '操作员',
                className: 'TableTxtCenter',
                width: 60,
                dataIndex: 'createBy',
                key: 'key4',
            },
            {
                title: '礼品有效期',
                className: 'TableTxtCenter',
                width: 160,
                key: 'key1',
                render: (text, record, index) => {
                    return `${moment(record.effectTime, 'YYYYMMDD').format('YYYY/MM/DD')} ~ ${moment(record.validUntilDate, 'YYYYMMDD').format('YYYY/MM/DD')}`;
                },
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
                            case 3: return '正在生成券码';
                            case 4: return '券码生成完毕';
                            case 5: return '正在导出';
                            case 6: return '已导出';
                            case 7: return '导出失败';
                            case 8: return '生成券码失败';
                            default: return '--'
                        }
                    })(status);
                    return <span title={text}>{text}</span>;
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
                        return <a download="券码" target="_blank" href={text}>下载</a>
                    } else if (record.status == 4 || record.status == 7) {
                        return (
                            <a
                                onClick={() => {
                                    this.handleExport(record)
                                }}
                            >{COMMON_LABEL.export}</a>
                        )
                    } else if (record.status == 8) {
                        return (
                            <a
                                onClick={() => {
                                    this.handleRetry(record)
                                }}
                            >重试</a>
                        )
                    }
                    return '--'
                },
            },
        ];
        return (
            <Table
                // scroll={{ x: 1600 }}
                bordered={true}
                columns={columns}
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

    renderAutoGeneratingRules() {
        const { getFieldDecorator } = this.props.form;
        return (
            <FormItem
                label="张数"
                className={styles.FormItemStyle}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 8 }}
                required
            >{
                    getFieldDecorator('giftCount', {
                        initialValue: { number: this.state.giftCount },
                        onChange: this.handleGiftCountChange,
                        rules: [
                            {
                                validator: (rule, v, cb) => {
                                    if (!v || !v.number) {
                                        return cb('张数为必填项');
                                    }
                                    v.number > 0 && v.number <= BATCH_LIMIT ? cb() : cb(`不能超过${Math.floor(BATCH_LIMIT / 10000)}万张`);
                                },
                            },
                        ]
                    })(
                        <PriceInput
                            modal="int"
                            addonAfter="张"
                        />
                    )
                }
            </FormItem>
        )
    }

    renderManualGeneratingRules() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <FormItem
                    label="券码起止号"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                    required
                >
                    <div className={styles.flexFormItem}>
                        <FormItem
                            className={`${styles.FormItemStyle} ${styles.childFormItem}`}
                            wrapperCol={{ span: 24 }}
                        >
                            {
                                getFieldDecorator('startNo', {
                                    initialValue: { number: this.state.startNo },
                                    onChange: this.handleStartNoChange,
                                    rules: [
                                        {
                                            validator: (rule, v, cb) => {
                                                if (!v || !v.number) {
                                                    return cb('起始号为必填项');
                                                }
                                                cb()
                                            },
                                        },
                                    ],
                                })(
                                    <PriceInput
                                        modal="int"
                                        placeholder="券码起始号"
                                        maxNum={15}
                                    />
                                )
                            }
                        </FormItem>
                        至
                        <FormItem
                            className={`${styles.FormItemStyle} ${styles.childFormItem}`}
                            wrapperCol={{ span: 24 }}
                        >
                            {
                                getFieldDecorator('endNo', {
                                    initialValue: { number: this.state.endNo },
                                    onChange: this.handleEndNoChange,
                                    rules: [
                                        {
                                            validator: (rule, v, cb) => {
                                                if (!v || !v.number) {
                                                    return cb('终止号为必填项');
                                                }
                                                if (Number(v.number || 0) < Number(this.props.form.getFieldValue('startNo').number || 0)) {
                                                    return cb('终止号必须大于等于起始号')
                                                }
                                                if (Number(v.number || 0) - Number(this.props.form.getFieldValue('startNo').number || 0) >= BATCH_LIMIT) {
                                                    return cb(`张数不能超过${BATCH_LIMIT}`)
                                                }
                                                cb()
                                            },
                                        },
                                    ],
                                })(
                                    <PriceInput
                                        modal="int"
                                        maxNum={15}
                                        placeholder="券码终止号"
                                    />
                                )
                            }
                        </FormItem>
                    </div>
                </FormItem>
                <FormItem
                    label="张数"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 8 }}
                >
                    <PriceInput
                        modal="int"
                        addonAfter="张"
                        disabled
                        value={{ number: (this.state.endNo >= this.state.startNo) ? Number(this.state.endNo || 0) - Number(this.state.startNo || 0) + 1 : '' }}
                    />
                </FormItem>
                <FormItem
                    label="随机码"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 8 }}
                >
                    <div className={styles.flexFormItem}>
                        <Checkbox
                            checked={this.state.includeRandomCode}
                            onChange={this.handleIncludeRandomCode}
                        >
                            券码包含随机码
                        </Checkbox>
                    </div>
                </FormItem>
                <FormItem
                    label="券码组成"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 8 }}
                >
                    <Input
                        type="text"
                        value={this.state.includeRandomCode ? '起止号 + 3位随机码' : '起止号'}
                        disabled
                    />
                </FormItem>
            </div>

        )
    }
    onAccountChange = (mpID) => {
        // const { imgID, item, shopInfo } = this.state;
        // const {
        //     onSetMpID,
        // } = this.props
        // onSetMpID(mpID)
        // this.onGetQrImg({ mpID, imgID, item, shops: shopInfo })
        this.setState({
            mpID,
        });
    }
    onImgTxtChange = (imgID) => {
        const { imgList } = this.state;
        let temp = {};
        if (imgID) {
            const { resContent = {} } = imgList.find(x => `${x.itemID}` === imgID);
            const { resources = [] } = JSON.parse(resContent);
            temp = resources[0];
            this.setState({
                item: temp,
                imgID,
            });
            return
        }
        // this.onGetQrImg({ mpID, imgID, item, shops: shopInfo })
        this.setState({
            imgID,
        });
    }
    renderPictureAndTextMsg() {
        const { mpInfoList, imgList, mpID, item, imgID } = this.state;
        return (
            <div style={{ marginBottom: 20 }} className={styles.typeBox}>
                <div className={styles.accountBox}>
                    <span><span className={styles.redFont}>*</span>请选择公众号</span>
                    <div>
                        <Select allowClear={true} value={mpID} onChange={this.onAccountChange}>
                            {mpInfoList.map(x => <Option value={x.mpID} key={x.mpID}>{x.mpName}</Option>)}
                        </Select>
                    </div>
                </div>
                {mpID &&
                    <div className={styles.imgListBox}>
                        <span><span className={styles.redFont}>*</span>图文消息</span>
                        <div>
                            <Select allowClear={true} value={imgID} onChange={this.onImgTxtChange}>
                                {imgList.map(x => <Option value={`${x.itemID}`} key={x.mpID}>{x.resTitle}</Option>)}
                            </Select>
                            <p className={styles.tips}>选择图文消息后，生成链接会覆盖原图文素材配置的自定义链接</p>
                        </div>
                    </div>
                }
                {mpID &&
                    <div className={styles.previewBox}>
                        <span>图文预览</span>
                        <div className={styles.view}>
                            <dl>
                                <dt>{item.resTitle}</dt>
                                <dd>{item.digest}</dd>
                            </dl>
                            {
                                item.imgPath ? <img src={imgURI + item.imgPath} alt="" /> : null
                            }
                        </div>
                    </div>}
            </div>
        )

    }
    renderModalContent() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Alert style={{ width: 500, marginLeft: 220 }} message="营业高峰期（11:00-14:00，17:00-20:30）暂停使用批量生成券码功能" type="warning"></Alert>
                <Form>
                    <FormItem
                        label="有效期"
                        className={styles.FormItemStyle}
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                    >
                        <Row>
                            <Col span={19}>
                                <RangePicker value={this.state.validDateRange} onChange={this.handleValidDateRangeChange} />
                            </Col>
                            <Col offset={1} span={3}>
                                <div className={styles.ActivityDateDay}>
                                    <span>{this.getDateCount()}</span>
                                </div>
                            </Col>
                        </Row>
                        {/*这里用了点小hack, 强行移位tip, 组件做的不够好*/}
                        <CloseableTip
                            style={{
                                position: 'absolute',
                                right: '6px',
                                top: '3px'
                            }}
                            width="100%"
                            content={
                                <div>
                                    <p>有效期</p>
                                    <br />
                                    <p>有效期<span style={{ fontWeight: 'bold' }}>不填</span>代表<span style={{ fontWeight: 'bold' }}>永久</span>有效</p>
                                </div>
                            }
                        />
                    </FormItem>
                    <FormItem
                        label="生成方式"
                        className={styles.FormItemStyle}
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                    >
                        <RadioGroup onChange={this.handleAutoGeneratingChange} value={this.state.autoGenerating}>
                            <Radio key={'1'} value={'1'}>系统自动生成</Radio>
                            <Radio key={'2'} value={'2'}>按规则生成</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem
                        label="生成形式"
                        className={styles.FormItemStyle}
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                    >
                        <RadioGroup onChange={this.handleSelectSendCouponType} value={this.state.sendCouponType}>
                            <Radio key={'1'} value={'1'}>券码</Radio>
                            <Radio key={'2'} value={'2'}>领取码</Radio>
                        </RadioGroup>

                        <Tooltip title={'选择二维码时，显示”请选择公众号“，必须选择一个公众号，默认生成的二维码有效期为30天'}>
                            <Icon type="question-circle-o" />
                        </Tooltip>
                    </FormItem>
                    {
                        this.state.sendCouponType == 1 ?
                            <FormItem
                                label={<span></span>}
                                className={styles.FormItemStyle}
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                style={{ marginTop: -20 }}
                            >
                                <RadioGroup onChange={this.handleSelectSendCouponExpand} value={this.state.sendCouponExpand}>
                                    <Radio key={'1'} value={'1'}>文本</Radio>
                                    <Radio key={'2'} value={'3'}>条形码</Radio>
                                    <Radio key={'3'} value={'4'}>二维码</Radio>
                                </RadioGroup>
                            </FormItem> : null
                    }

                    {
                        this.state.sendCouponType === '2' && this.renderPictureAndTextMsg()
                    }
                    {
                        this.state.autoGenerating === '1' && this.renderAutoGeneratingRules()
                    }
                    {
                        this.state.autoGenerating === '2' && this.renderManualGeneratingRules()
                    }
                    <FormItem
                        label="备注"
                        className={styles.FormItemStyle}
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 8 }}
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
                    key="批量生成券码"
                    title="批量生成券码"
                    maskClosable={false}
                    visible={this.state.modalVisible}
                    confirmLoading={this.state.confirmLoading}
                    width={950}
                    onCancel={this.hideModal}
                    footer={[
                        <Button type="ghost" onClick={this.hideModal}>关闭</Button>,
                        <Button disabled={this.isDisabledTime()} type="primary" onClick={this.handleModalOk}>确定</Button>,
                    ]}
                >
                    {this.state.modalVisible && this.renderModalContent()}
                </Modal>
            </div>
        )
    }
}

export default Form.create()(GenerateBatchGifts);
