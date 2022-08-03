import React from 'react';
import { Button, Select, Modal, DatePicker, message } from "antd";
import BaseForm from 'components/common/BaseForm';
import { httpCreate } from "./AxiosFactory";
import moment from "moment";

const format = "YYYYMMDD";
const { RangePicker } = DatePicker;
const formKeys = ['code', 'name', 'validTime', 'desc'];
const formItems = {
    code: {
        type: 'text',
        label: '编码',
        placeholder: '',
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
        rules: [{
            required: true,
            message: '请输入编码',
        }],
    },
    name: {
        type: 'text',
        label: '用户名',
        placeholder: '',
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
        rules: [{
            required: true,
            message: '请输入用户名',
        }],
    },
    validTime: {
        type: 'custom',
        label: '有效时间',
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
        defaultValue: '1',
        render: (decorator) => decorator({})(
            <Select
                style={{width: '100px'}}
                placeholder="请选择"
            >
                <Select.Option key={1} value='1'>长期有效</Select.Option>
                <Select.Option key={2} value='2'>指定时间段</Select.Option>
            </Select>
        )
    },
    startAndEndTime: {
        type: 'custom',
        label: '',
        placeholder: '',
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
        render: (decorator) => decorator({})(
            <RangePicker
                style={{ width: '100%', marginLeft: '20%'}}
                format="YYYY-MM-DD"
                placeholder={['开始日期', '结束日期']}
            />
        )
    },
    desc: {
        type: 'textarea',
        label: '描述',
        placeholder: '',
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    },
};

export default class Main extends React.PureComponent {
    constructor(props){
        super(props);
        this.queryFrom = null;
        this.state = {
            loading: false,
        }
    }

    onChange = (key, value) => {
        if(key == 'validTime'){ 
            let index = formKeys.indexOf('validTime');
            let index1 = formKeys.indexOf('startAndEndTime');
            if(value == '2'){
                formKeys.splice(index + 1, 0, 'startAndEndTime');
            }else{
                if(index1 != -1){
                    formKeys.splice(index1, 1);
                }
            }
        }
    }

    onSubmit = () => {
        this.queryFrom.validateFields((e, v) => {
        let { code, name, validTime, desc } = v;
        let param = {
            code, 
            name, 
            validTime, 
            desc 
        };
        if(+validTime == 2){
            if(v.startAndEndTime && v.startAndEndTime.length > 0){
                param.startTime = moment(v.startAndEndTime[0]).format(format);
                param.endTime = moment(v.startAndEndTime[1]).format(format);
            }
        }
        this.setState({
            loading: true
        }, () => {
            httpCreate(param)
            .then(() => {
                this.setState({
                    loading: false,
                });
                this.props.onClose();
                this.props.onQuery();
                message.success(this.props.modalType == 'add' ? '创建成功' : '编辑成功');
            })
        })
        });
    }

    render() {
        const { modalType, modalContent } = this.props;
        return (
            <Modal
                width="500px"
                title={`${modalType == 'add' ? '新增' : '编辑'}流程`}
                visible={true}
                confirmLoading={this.state.loading}
                onCancel={this.props.onClose}
                footer={
                    <div style={{textAlign: 'center'}}>
                        <Button type="ghost" onClick={this.props.onClose}>取消</Button>
                        <Button
                            style={{marginLeft:8}}
                            type="primary"
                            onClick={this.onSubmit}
                        >
                            确定
                        </Button>
                    </div>
                }
            >
                <BaseForm
                    getForm={form => this.queryFrom = form}
                    formItems={formItems}
                    formKeys={formKeys}
                    layout="horizontal"
                    onChange={this.onChange}
                />
            </Modal>
        )
    }
}
