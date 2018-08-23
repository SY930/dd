import React from 'react';
import { connect } from 'react-redux';
import { jumpPage } from '@hualala/platform-base'
import _ from 'lodash';
import { fetchData, axiosData } from '../../../helpers/util';
import axios from 'axios';
import { Row, Col, Modal, Form, Button, Select, Input, Upload, message, Icon, Radio } from 'antd';
import styles from './GiftAdd.less';
import BaseForm from '../../../components/common/BaseForm';
import ENV from '../../../helpers/env';
import GiftCfg from '../../../constants/Gift';
import {
    cancelCreateOrEditGift, changeGiftFormKeyValue, endSaving,
    FetchGiftList, startSaving,
} from '../_action';
import IsSync from "./common/IsSync";
import {debounce} from 'lodash';
import ShopSelector from "../../../components/common/ShopSelector/ShopSelector";
import {getPromotionShopSchema} from "../../../redux/actions/saleCenterNEW/promotionScopeInfo.action";

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class GiftAddModal extends React.Component {
    constructor(props) {
        super(props);
        const shopSchema = props.shopSchema.getIn(['shopSchema']).toJS();

        this.state = {
            groupTypes: [],
            shopsData: [],
            shopSchema, // 后台请求来的值
            giftImagePath: '',
            values: {},
            finishLoading: false,
            imageUrl: '',
            transferType: 0,
            isUpdate: true,
        };
        this.baseForm = null;
        this.handleNameChangeDebounced = debounce(this.props.changeGiftFormKeyValue.bind(this), 400);
        this.handleRemarkChangeDebounced = debounce(this.props.changeGiftFormKeyValue.bind(this), 400);
        this.handleValueChangeDebounced = debounce(this.props.changeGiftFormKeyValue.bind(this), 400);
    }
    componentDidMount() {
        const { getPromotionShopSchema} = this.props;

        getPromotionShopSchema({groupID: this.props.accountInfo.toJS().groupID});
        const { gift: { data: { groupID, giftImagePath } }, type } = this.props;
        fetchData('getShopBrand', { _groupID: groupID, groupID, isActive: 1 }, null, { path: 'data.records' }).then((data) => {
            if (!data) return;
            const groupTypes = [];
            data.map((d) => {
                groupTypes.push({ value: d.brandID, label: d.brandName })
            });
            groupTypes.push({ value: '-1', label: '(空)' });
            this.setState({ groupTypes });
        });
        if (type == 'edit') {
            if (giftImagePath) {
                this.setState({
                    imageUrl: giftImagePath,
                })
            }
        }
        this.setState({
            isUpdate: this.props.myActivities.get('isUpdate'),
            transferType: this.props.gift.data.transferType || 0,
        })
    }
    componentWillReceiveProps(nextProps) {
        const { gift: { data: { giftImagePath, transferType = 0 } }, type } = nextProps;
        if (type === 'edit') {
            if (giftImagePath) {
                this.setState({
                    imageUrl: giftImagePath,
                })
            }
        }

        if (nextProps.shopSchema.getIn(['shopSchema']) !== this.props.shopSchema.getIn(['shopSchema'])) {
            this.setState({shopSchema: nextProps.shopSchema.getIn(['shopSchema']).toJS(), // 后台请求来的值
            });
        }
        this.setState({
            transferType,
        })
        if (this.props.myActivities.get('isUpdate') !== nextProps.myActivities.get('isUpdate')) {
            this.setState({ isUpdate: nextProps.myActivities.get('isUpdate') })
        }
    }
    handleFormChange(key, value) {
        switch (key) { // 这三个字段是靠手动输入的, 不加debounce的话在一般机器上有卡顿
            case 'giftName':    this.handleNameChangeDebounced({key, value});
                break;
            case 'giftRemark':    this.handleRemarkChangeDebounced({key, value});
                break;
            case 'giftValue':    this.handleValueChangeDebounced({key, value});
                break;
            default: this.props.changeGiftFormKeyValue({key, value});
        }
    }
    handleSubmit() {
        const { groupTypes, imageUrl, transferType } = this.state;
        const { type, gift: { value, data } } = this.props;
        this.baseForm.validateFieldsAndScroll((err, values) => {
            /*if (value === '30') {
                if (imageUrl === '' || imageUrl === undefined) {
                    message.error('请上传礼品图样!', 3);
                    return;
                }
            }*/ // 礼品图片现在可以不传
            if (err) return;
            let params = _.assign(values, { giftType: value });
            let callServer = '';
            let shopNames = '', shopIDs = '';
            try {
                if (params.shopNames) {
                    const shops = this.state.shopSchema.shops;
                    const selectedShopEntities = shops.filter(item => params.shopNames.includes(item.shopID)).map(shop => ({content: shop.shopName, id: shop.shopID}));
                    selectedShopEntities.forEach((shop) => {
                        shopNames += `${shop.content + ',' || ''}`;
                        shopIDs += `${shop.id + ',' || ''}`;
                    });
                }
            } catch (e) {
                console.log('no shop info');
            }
            params.shopNames = shopNames || ',';
            params.shopIDs = shopIDs || ',';
            params.giftImagePath = imageUrl;
            params.transferType = transferType;
            // 定额卡工本费
            if (value == '90') {
                params.giftCost = `${Number(params.giftCost || 0)}`;
            }
            if (type === 'add') {
                callServer = '/coupon/couponService_addBoard.ajax';
                if (values.brandID === '-1') {
                    params = _.omit(params, 'brandID');
                } else {
                    const brandJSON = _.find(groupTypes, { value: values.brandID }) || {};
                    params.giftName = `${brandJSON.label || ''}${values.giftName}`;
                }
            } else if (type === 'edit') {
                callServer = '/coupon/couponService_updateBoard.ajax';
                params.giftItemID = data.giftItemID;
            }
            const { accountInfo, startSaving, endSaving } = this.props;
            const { groupName } = accountInfo.toJS();
            startSaving();
            axiosData(callServer, { ...params, groupName }, null, { path: '' }).then((data) => {
                endSaving();
                message.success('成功', 3);
                this.props.cancelCreateOrEditGift()
            }).catch(err => {
                console.log(err);
                endSaving()
            });
        });
    }

    handleShopSelectorChange(values) {
        this.setState({
            values: {...this.state.values, shopNames: values}
        });
    }

    handleCancel() {
        this.baseForm.resetFields();
        this.setState({
            current: 0,
            values: {},
            finishLoading: false,
            imageUrl: '',
        });
        this.props.onCancel();
    }
    handleGiftName(decorator) {
        const { groupTypes } = this.state;
        return (
            <Row>
                <Col span={11}>
                    <FormItem>
                        {decorator({
                            key: 'brandID',
                            rule: [{ required: true, message: '请选择品牌' }],
                            // initialValue: '-1',
                        })(<Select
                            className="giftName"
                            placeholder={'请选择品牌名称'}
                            getPopupContainer={(node) => node.parentNode}
                        >
                            {
                                groupTypes.map((t, i) => {
                                    return <Option key={t.label} value={t.value}>{t.label}</Option>
                                })
                            }
                        </Select>)}
                    </FormItem>
                </Col>
                <Col span={1} offset={1}>-</Col>
                <Col span={11}>
                    <FormItem style={{ marginBottom: 0 }}>
                        {decorator({
                            key: 'giftName',
                            rules: [
                                {
                                    required: true,
                                    message: '汉字、字母、数字、小数点，50个字符以内',
                                    pattern: /^[\u4E00-\u9FA5A-Za-z0-9\.]{1,50}$/,
                                },
                            ],
                        })(<Input size="large" placeholder="请输入礼品名称" />)}
                    </FormItem>
                </Col>
            </Row>
        )
    }

    renderShopNames(decorator) {
        const { shopNames = [] } = this.state.values;
        return (
            <Row style={{ marginBottom: shopNames.length === 0 ? -15 : 0 }}>
                <Col>
                    {decorator({})(
                        <ShopSelector
                            onChange={
                                this.handleShopSelectorChange
                            }
                            schemaData={this.state.shopSchema}
                        />
                    )}
                </Col>
                <p style={{ color: 'orange', display: shopNames.length > 0 ? 'none' : 'block' }}>未选择门店时默认所有门店通用</p>
            </Row>
        )
    }

    renderGiftImagePath = (decorator) => {
        const props = {
            name: 'myFile',
            showUploadList: false,
            action: '/api/common/imageUpload',
            className: styles.avatarUploader,
            onChange: (info) => {
                const status = info.file.status;
                const fileList = info.fileList;
                const giftImagePath = fileList.length > 0 ? fileList[0].name : ''
                this.setState({
                    giftImagePath,
                })
                if (status !== 'uploading') {
                    // console.log(info.file, info.fileList);
                }
                if (status === 'done') {
                    message.success(`${info.file.name} 上传成功`);
                    this.setState({
                        imageUrl: `${ENV.FILE_RESOURCE_DOMAIN}/${info.file.response.url}`,
                    })
                } else if (status === 'error') {
                    message.error(`${info.file.name} 上传失败`);
                }
            },
        };
        return (
            <Row>
                <Col>
                    <FormItem style={{ height: 200 }}>
                        <Upload {...props}>
                            {
                                this.state.imageUrl ?
                                    <img src={this.state.imageUrl} alt="" className={styles.avatar} /> :
                                    <Icon type="plus" className={styles.avatarUploaderTrigger} />
                            }
                        </Upload>
                        <p className="ant-upload-hint">点击上传图片，图片格式为jpg、png</p>
                    </FormItem>
                </Col>
            </Row>
        )
    }
    renderTransferType(decorator) {
        return (
            <RadioGroup
                value={this.state.transferType}
                onChange={(e) => {
                    // console.log('radio checked', e.target.value);
                    this.setState({
                        transferType: e.target.value,
                    });
                }}
            >
                {
                    GiftCfg.transferType.map((cfg) => {
                        return (<Radio key={cfg.value} value={cfg.value}>{cfg.label}</Radio>)
                    })
                }
            </RadioGroup>
        )
    }
    render() {
        const { gift: { name: describe, value, data }, visible, type } = this.props;
        const valueLabel = value == '42' ? '积分数额' : '礼品价值';
        const formItems = {
            giftType: {
                label: '礼品类型',
                type: 'custom',
                render: () => describe,
            },
            transferType: {
                label: '券是否可分享',
                type: 'custom',
                render: decorator => this.renderTransferType(decorator),
            },
            shopNames: {
                type: 'custom',
                label: '可使用店铺',
                defaultValue: [],
                render: decorator => this.renderShopNames(decorator),
            },
            giftValue: {
                label: valueLabel,
                type: 'text',
                placeholder: `请输入${valueLabel}`,
                disabled: type !== 'add',
                surfix: value == '42' ? '分' : '元',
                rules: value == '30'
                    ? [{ required: true, message: '礼品价值不能为空' }, { pattern: /(^\+?\d{0,8}$)|(^\+?\d{0,8}\.\d{0,2}$)/, message: '请输入整数不超过8位，小数不超过2位的值' }]
                    : [{ required: true, message: `${valueLabel}不能为空` },
                    { pattern: /(^\+?\d{0,8}$)|(^\+?\d{0,8}\.\d{0,2}$)/, message: '请输入整数不超过8位，小数不超过2位的值' }],
            },
            giftName: {
                label: '礼品名称',
                type: 'custom',
                render: decorator => this.handleGiftName(decorator),
            },
            giftCost: {
                type: 'text',
                label: '卡片工本费',
                disabled: type !== 'add',
                placeholder: '请输入卡片工本费金额',
                surfix: '元',
                rules: [
                    { pattern: /(^\+?\d{0,9}$)|(^\+?\d{0,9}\.\d{0,2}$)/, message: '请输入大于或等于0的值，整数不超过9位，小数不超过2位' },
                    {
                        validator: (rule, v, cb) => {
                            const { getFieldValue } = this.baseForm;
                            const giftValue = getFieldValue('giftValue');
                            Number(v || 0) <= Number(giftValue || 0) ? cb() : cb(rule.message);
                        },
                        message: '工本费不能高于礼品价值',
                    }, {
                        validator: (rule, v, cb) => {
                            const { getFieldValue } = this.baseForm;
                            const giftValue = getFieldValue('giftValue');
                            const price = getFieldValue('price');
                            Number(v || 0) + Number(price || 0) <= Number(giftValue || 0) ? cb() : cb(rule.message);
                        },
                        message: '礼品价值扣除工本费后的数额应大于或等于售价',
                    }],
            },
            price: {
                type: 'text',
                label: '建议售价',
                disabled: type !== 'add',
                placeholder: '请输入建议售价金额',
                surfix: '元',
                rules: [{ required: true, message: '建议售价不能为空' },
                { pattern: /(^\+?\d{0,9}$)|(^\+?\d{0,9}\.\d{0,2}$)/, message: '请输入大于0的值，整数不超过9位，小数不超过2位' },
                {
                    validator: (rule, v, cb) => {
                        const { getFieldValue } = this.baseForm;
                        const giftValue = getFieldValue('giftValue');
                        Number(v || 0) <= Number(giftValue || 0) ? cb() : cb(rule.message);
                    },
                    message: '建议售价不能高于礼品价值',
                }, {
                    validator: (rule, v, cb) => {
                        const { getFieldValue } = this.baseForm;
                        const giftValue = getFieldValue('giftValue');
                        const giftCost = getFieldValue('giftCost');
                        Number(v || 0) + Number(giftCost || 0) <= Number(giftValue || 0) ? cb() : cb(rule.message);
                    },
                    message: '建议售价只能小于或等于礼品价值扣除工本费后的数额',
                }],
            },
            giftRemark: {
                label: '活动详情',
                type: 'textarea',
                placeholder: '请输入活动详情',
                rules: [
                    { required: true, message: '活动详情不能为空' },
                    { max: 400, message: '最多400个字符' },
                ],
            },
            isSynch: {
                label: ` `,
                type: 'custom',
                defaultValue: false,
                render: decorator => decorator({})(<IsSync/>),
            },
            giftImagePath: {
                label: '礼品图样',
                type: 'custom',
                render: decorator => this.renderGiftImagePath(decorator),
            },
            giftRule: {
                label: '使用规则',
                type: 'custom',
                render: () => {
                    switch (value) {
                        case '30':
                            return '顾客在获取实物礼品券后，礼品具体领取方式请联系商家，商家会在核对信息无误后进行赠送。';
                        case '40':
                            return '顾客在获取会员充值类礼品后，将直接充入其会员储值余额账户中！';
                        case '42':
                            return '顾客在获取会员积分类礼品后，将直接充入其会员积分余额账户中！';
                        case '90':
                            return '顾客在获取定额卡之后，具体使用规则请联系商家！';
                    }
                },
            },
        };
        const formKeys = {
            '实物礼品券': [{ col: { span: 24, pull: 2 }, keys: ['giftType', 'transferType', 'giftValue', 'giftName', 'giftRemark', 'shopNames', 'giftImagePath', 'giftRule', 'isSynch'] }],
            '会员积分券': [{ col: { span: 24, pull: 2 }, keys: ['giftType', 'giftValue', 'giftName', 'giftRemark', 'giftRule', ] }],
            '会员充值券': [{ col: { span: 24, pull: 2 }, keys: ['giftType', 'giftValue', 'giftName', 'giftRemark', 'giftRule', ] }],
            '礼品定额卡': [{ col: { span: 24, pull: 2 }, keys: ['giftType', 'giftName', 'giftValue', 'giftCost', 'price', 'giftRemark', 'giftRule', 'isSynch'] }],
        };
        let formData = {};
        if (type == 'edit') {
            formData = data === undefined ? {} : data;
        }
        if (data.shopNames && data.shopNames.length > 0 && data.shopNames[0].id) {
            formData.shopNames = data.shopNames.map(shop => shop.id);
        }
        formItems.giftName = type === 'add'
            ? { label: '礼品名称', type: 'custom', render: decorator => this.handleGiftName(decorator) }
            : { label: '礼品名称', type: 'text', disabled: true };
        /*return (
            <Modal
                title={`${type === 'edit' ? '修改' : '创建'}${describe}`}
                visible={visible}
                maskClosable={false}
                onCancel={() => {
                    this.handleCancel()
                }}
                footer={[<Button key="0" type="ghost" onClick={() => this.handleCancel()}>取消</Button>,
                <Button
                    key="1"
                    type="primary"
                    disabled={this.state.finishLoading}
                    style={{ display: this.state.isUpdate ? 'inline-block' : 'none' }}
                    onClick={() => this.handleOk()}>确定</Button>]}
                key={`${describe}-${type}`}
            >
                {visible && }
            </Modal>
        )*/
        return (
            <div className={styles.giftAddModal}>
                <BaseForm
                    getForm={form => this.baseForm = form}
                    formItems={formItems}
                    formData={formData}
                    formKeys={formKeys[describe]}
                    onChange={(key, value) => this.handleFormChange(key, value)}
                    key={`${describe}-${type}`}
                />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        params: state.sale_giftInfoNew.get('listParams'),
        accountInfo: state.user.get('accountInfo'),
        shopSchema: state.sale_shopSchema_New,
        menuList: state.user.get('menuList'),
        myActivities: state.sale_myActivities_NEW,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        changeGiftFormKeyValue: opts => dispatch(changeGiftFormKeyValue(opts)),
        FetchGiftList: opts => dispatch(FetchGiftList(opts)),
        startSaving: opts => dispatch(startSaving(opts)),
        endSaving: opts => dispatch(endSaving(opts)),
        getPromotionShopSchema: (opts) => {
            dispatch(getPromotionShopSchema(opts));
        },
        cancelCreateOrEditGift: opts => dispatch(cancelCreateOrEditGift(opts)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    {
        withRef: true
    }
)(GiftAddModal)
