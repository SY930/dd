/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-02-06T16:21:55+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: EditableInput.jsx
 * @Last modified by:   xf
 * @Last modified time: 2017-02-07T15:53:08+08:00
 * @Copyright: Copyright(c) 2017-2020 Hualala Co.,Ltd.
 */


/*
 *组件名称：AddOrDelInput (可增删输入框)
 * 功能：增加或删除输入框
 * 陈双   2016/12/5
 */
import React from 'react';
import { Row, Col, Form, TimePicker, Input, Icon, InputNumber, Select } from 'antd';
import style from './NDiscount.less';
import styles from '../ActivityPage.less';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont';
import PriceInput from '../../../containers/SaleCenterNEW/common/PriceInput';
const InputGroup = Input.Group;
const Option = Select.Option;
if (process.env.__CLIENT__ === true) {
    // require('../../../../client/components.less')
}

const FormItem = Form.Item;

export class NDiscount extends React.Component {
    constructor(props) {
        super(props);
        this.uuid = 0;
        this.state = {
            data: {
                0: {
                    value: '',
                    validateFlag: true,
                },
            },
            stageType: String(props.stageType)
        };
        this.renderHandleIcon = this.renderHandleIcon.bind(this);
        this.handleStageTypeChange = this.handleStageTypeChange.bind(this);
    }

    remove = (k) => {
        const { data } = this.state;
        delete data[this.uuid];
        this.uuid--;
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        if (keys.length === 1) {
            return;
        }
        form.setFieldsValue({
            keys: keys.filter(key => key != k),
        });
        this.setState({ data });
        this.props.onChange && this.props.onChange(data);
    };

    add = () => {
        this.uuid++;
        const { data } = this.state;
        data[this.uuid] = {
            value: '',
            validateFlag: true,
        };
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(this.uuid);
        form.setFieldsValue({
            keys: nextKeys,
        });
        this.setState({ data });
        this.props.onChange && this.props.onChange(data);
    };

    componentDidMount() {
        this.props.onChange && this.props.onChange(this.state.data);
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.value != nextProps.value) {
            this.setState({ data: nextProps.value });
            this.uuid = Object.keys(nextProps.value).length - 1;
        }
        if (this.props.stageType != nextProps.stageType) {
            this.setState({ stageType: String(nextProps.stageType) });
        }
    }
    renderHandleIcon(index) {
        if (index == 0 && index == this.uuid) {
            return (<Icon className={style.pulsIcon} type="plus-circle-o" onClick={this.add} />)
        } else if (index == this.uuid && index < 9) {
            return (
                <span>
                    <Icon className={style.pulsIcon} type="plus-circle-o" onClick={this.add} />
                    <Icon className={style.deleteIcon} type="minus-circle-o" onClick={() => this.remove(index)} />
                </span>
            )
        } else if (index == this.uuid && index == 9) {
            return <Icon className={[style.deleteIcon, style.deleteIconLeft].join(' ')} type="minus-circle-o" onClick={() => this.remove(index)} />;
        }
        return null
    }

    handleStageTypeChange(value) {
        const data = Object.assign({}, {0: this.state.data['0']});
        if (value === '1') {
            this.props.onChange && this.props.onChange({data, stageType: '1'});
            this.uuid = 0;
        } else {
            this.props.onChange && this.props.onChange({data, stageType: '2'})
        }
    }

    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formItemLayout = {
            label: '折扣设置',
            labelCol: { span: 4 },
            wrapperCol: { span: 17 },
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: { span: 17, offset: 4 },
        };
        getFieldDecorator('keys', { initialValue: Object.keys(this.state.data) });

        /*const keys = getFieldValue('keys');*/
        const formItemInside = Object.keys(this.state.data).map((k, index) => {
            k = parseInt(k);
            return (
                <FormItem
                    className={styles.FormItemStyle}
                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                    required={true}
                    key={k}
                    validateStatus={this.state.data[k].validateFlag ? 'success' : 'error'}
                    help={this.state.data[k].validateFlag ? null : '请输入正确的折扣率'}
                >
                    {k === 0 && <PriceInput
                        addonBefore={<Select value={this.state.stageType} onChange={this.handleStageTypeChange}>
                            <Option value="2">第2份当前菜品折扣</Option>
                            <Option value="1">第2份指定菜品折扣</Option>
                        </Select>}
                        addonAfter={'%'}
                        modal="float"
                        placeholder="输入不大于100的数字, 88%表示88折"
                        onChange={(value) => {
                            const { data } = this.state;
                            if (value.number == null || value.number == '' || value.number > 100) {
                                data[k].validateFlag = false;
                            } else {
                                data[k].validateFlag = true;
                            }

                            data[k].value = value.number;
                            this.setState({ data });
                            this.props.onChange && this.props.onChange(data);
                        }}
                        value={{ number: this.state.data[k].value }}
                    />}
                    {k > 0 &&<PriceInput
                        addonBefore={`第${k + 2}份当前菜品折扣`}
                        addonAfter={'%'}
                        modal="float"
                        placeholder="输入不大于100的数字, 88%表示88折"
                        onChange={(value) => {
                            const { data } = this.state;
                            if (value.number == null || value.number == '' || value.number > 100) {
                                data[k].validateFlag = false;
                            } else {
                                data[k].validateFlag = true;
                            }

                            data[k].value = value.number;
                            this.setState({ data });
                            this.props.onChange && this.props.onChange(data);
                        }}
                        value={{ number: this.state.data[k].value }}
                    />}
                    <div className={style.iconsStyle}>
                        {this.state.stageType == '2' && this.renderHandleIcon(k)}
                    </div>
                </FormItem>);
        });

        return (
            <div className={[styles.NDiscount, style.NDiscount].join(' ')}>
                {formItemInside}
            </div>
        );
    }
}
