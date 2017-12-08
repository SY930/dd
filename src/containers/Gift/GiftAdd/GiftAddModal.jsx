import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Moment from 'moment';
import { fetchData } from '../../../helpers/util';
import { Row, Col, Modal, Form, Steps, Button, Select, Input, Upload, message, Icon } from 'antd';
import styles from './GiftAdd.less';
// import stylesBar from '../../../components/basic/ProgressBar/ProgressBar.less';
import { CrmLogo } from './CrmOperation';
import GiftCfg from '../../../constants/Gift';
import ProjectEditBox from "../../../components/basic/ProjectEditBox/ProjectEditBox";
import BaseForm from '../../../components/common/BaseForm';
import CustomProgressBar from '../../SaleCenter/common/CustomProgressBar';
import ENV from '../../../helpers/env';
import {
    FetchGiftList,
} from '../_action';
const FormItem = Form.Item;
const Step = Steps.Step;
const Option = Select.Option;
const Dragger = Upload.Dragger;

export class GiftAddModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            groupTypes: [],
            giftImagePath: '',
            values: {},
            finishLoading:false,
            imageUrl: ''
        },
        this.baseForm = null;
    }
    componentWillMount() {
        const { gift: { data: { groupID, giftImagePath } } , type} = this.props;
        fetchData('getShopBrand', { _groupID: groupID, groupID, isActive : 1  }, null, { path: 'data.records' }).then(data => {
            if (!data) return;
            let groupTypes = [];
            data.map((d) => {
                groupTypes.push({ value: d.brandID, label: d.brandName })
            });
            this.setState({ groupTypes });
        });
        if (type == 'edit') {
            if (giftImagePath) {
                this.setState({
                    imageUrl: giftImagePath
                })
            }
        }
    }
    componentWillReceiveProps(nextProps) {
        const { gift: { data: { giftImagePath } }, type } = nextProps;
        if (type == 'edit') {
            if (giftImagePath) {
                this.setState({
                    imageUrl: giftImagePath
                })
            }
        }
    }
    handleFormChange(key, value) {

    }
    handleOk() {
        const { groupTypes, giftImagePath, imageUrl } = this.state;
        const { type, gift: { value, data } } = this.props;
        this.baseForm.validateFieldsAndScroll((err, values) => {
            if (err) return;
            let params = _.assign(values, { giftType: value });
            let callServer = '';
            if (type === 'add') {
                callServer = 'addGift';
                if(values.brandID){
                    params.giftName = _.find(groupTypes, { value: values.brandID }).label + values.giftName;
                }
                params.giftImagePath = imageUrl;
            } else if (type === 'edit') {
                callServer = 'updateGift';
                params.giftItemID = data.giftItemID;
                params.giftImagePath = imageUrl;
            }
            this.setState({
                finishLoading:true
            })
            fetchData(callServer, params,null,{path:'data'}).then(data => {
                this.setState({
                    finishLoading:false
                });
                if(data){
                    message.success('成功',3)
                    this.handleCancel();
                }else{
                    message.success('失败',3)
                }
                if(type === 'edit') {
                    const { params, FetchGiftList } = this.props;
                    const listParams = params.toJS();
                    FetchGiftList(listParams);
                }

            });
        });
    }
    handleCancel() {
        this.baseForm.resetFields();
        this.setState({
            current: 0,
            values: {},
            imageUrl: ''
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
                            rule: [{ required: true, message: '请选择品牌' }]
                        })(<Select
                            className='giftName'
                            getPopupContainer={() => document.querySelector('.giftName')}
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
                            rules: [{ required: true, message: '礼品名称不能为空' }, { max: 50, message: '最多50个字符' }]
                        })(<Input size="large" placeholder="请输入礼品名称" />)}
                    </FormItem>
                </Col>
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
                let giftImagePath = fileList.length > 0 ? fileList[0].name : ''
                this.setState({
                    giftImagePath
                })
                if (status !== 'uploading') {
                    //console.log(info.file, info.fileList);
                }
                if (status === 'done') {
                    message.success(`${info.file.name} 上传成功`);
                    this.setState({
                        imageUrl: `${ENV.FILE_RESOURCE_DOMAIN}/${info.file.response.url}`
                    })
                } else if (status === 'error') {
                    message.error(`${info.file.name} 上传失败`);
                }
            },
        };
        return (
            <Row>
                <Col>
                    <FormItem style={{height:200}}>
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
    render() {
        const { gift: { name: describe, value, data }, visible, type } = this.props;
        const valueLabel = value == '42' ? '积分数额' : '礼品价值';
        const formItems = {
            giftType: {
                label: '礼品类型',
                type: 'custom',
                render: () => describe,
            },
            giftValue: {
                label: valueLabel,
                type: 'text',
                placeholder: `请输入${valueLabel}`,
                disabled: type === 'add' ? false : true,
                surfix: value == '42' ? '分' : '元',
                rules: value == '30'
                    ? [{ pattern: /(^\+?\d{0,8}$)|(^\+?\d{0,8}\.\d{0,2}$)/, message: '请输入整数不超过8位，小数不超过2位的值' }]
                    : [{ required: true, message: `${valueLabel}不能为空` },
                    { pattern: /(^\+?\d{0,8}$)|(^\+?\d{0,8}\.\d{0,2}$)/, message: '请输入整数不超过8位，小数不超过2位的值' }]
            },
            giftName: {
                label: '礼品名称',
                type: 'custom',
                render: (decorator) => this.handleGiftName(decorator)
            },
            price: {
                type: "text",
                label: "建议售价",
                placeholder: '请输入建议售价金额',
                surfix: '元',
                rules: [{ required: true, message: '建议售价不能为空' },
                { pattern: /(^\+?\d{0,9}$)|(^\+?\d{0,9}\.\d{0,2}$)/, message: '请输入大于0的值，整数不超过9位，小数不超过2位' },
                {
                    validator: (rule, v, cb) => {
                        const { getFieldValue } = this.baseForm;
                        const giftValue = getFieldValue('giftValue');
                        parseFloat(v) <= parseFloat(giftValue) ? cb() : cb(rule.message);
                    },
                    message: '建议售价只能小于或等于礼品价值'
                }],
            },
            giftRemark: {
                label: '礼品描述',
                type: 'textarea',
                placeholder: '请输入礼品描述',
                rules: [
                    { required: true, message: '礼品描述不能为空' },
                    { max: 400, message: '最多400个字符' }
                ]
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
                            return '顾客在获取实物礼品券后，礼品集体领取方式请联系商家，商家会在核对信息无误后进行赠送。';
                        case '40':
                            return '顾客在获取会员充值类礼品后，将直接充入其会员储值余额账户中！';
                        case '42':
                            return '顾客在获取会员积分类礼品后，将直接充入其会员积分余额账户中！';
                        case '90':
                            return '顾客在获取定额卡之后，具体使用规则请联系商家！';
                    }
                }
            }
        };
        const formKeys = {
            '实物礼品券': [{ col: { span: 24, pull: 2 }, keys: ['giftType', 'giftValue', 'giftName', 'giftRemark', 'giftImagePath', 'giftRule'] }],
            '会员积分券': [{ col: { span: 24, pull: 2 }, keys: ['giftType', 'giftValue', 'giftName', 'giftRemark', 'giftRule'] }],
            '会员充值券': [{ col: { span: 24, pull: 2 }, keys: ['giftType', 'giftValue', 'giftName', 'giftRemark', 'giftRule'] }],
            '礼品定额卡': [{ col: { span: 24, pull: 2 }, keys: ['giftType', 'giftValue', 'giftName', 'price', 'giftRemark', 'giftRule'] }],
        };
        let formData = {};
        if(type == 'edit'){
            formData = data === undefined ? {} : data;
        }
        formItems.giftName = type === 'add'
            ? { label: '礼品名称', type: 'custom', render: (decorator) => this.handleGiftName(decorator) }
            : { label: '礼品名称', type: 'text', disabled: true };
        return (
            <Modal
                title={`新建${describe}`}
                visible={visible}
                maskClosable={false}
                onCancel={()=>{
                    this.handleCancel()
                }}
                footer={[<Button key="0" type="ghost" onClick={() => this.handleCancel()}>取消</Button>,
                <Button key="1" type="primary" onClick={() => this.handleOk()}>确定</Button>]}
                key={`${describe}-${type}`}
            >
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
            </Modal>
        )
    }
}


function mapStateToProps(state) {
    return {
        user: state.user.toJS(),
        params: state.giftInfo.get('listParams'),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        FetchGiftList: opts => dispatch(FetchGiftList(opts)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GiftAddModal)
