/**
* @Author: Xiao Feng Wang  <xf>
* @Date:   2017-03-15T10:50:38+08:00
* @Email:  wangxiaofeng@hualala.com
* @Filename: promotionScopeInfo.jsx
 * @Last modified by:   xf
 * @Last modified time: 2017-04-08T16:46:12+08:00
* @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
*/

import React from 'react';
import {connect} from 'react-redux';
import {
    Row,
    Col,
    Form,
    Button,
    Input
} from 'antd';
const FormItem = Form.Item;

import {saleCenterSetSpecialBasicInfoAC} from '../../../redux/actions/saleCenter/specialPromotion.action'
import styles from '../../SaleCenter/ActivityPage.less';
if (process.env.__CLIENT__ === true) {
    require('../../../components/common/components.less');
}

let Immutable = require('immutable');

class SendMsgInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message:'',
        };

        this.handleMsgChange = this.handleMsgChange.bind(this);
        this.addMessageInfo = this.addMessageInfo.bind(this);
    }

    componentDidMount() {
        this.setState({
            message: this.props.value
        })
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.value != nextProps.value ){
            this.setState({
                message: nextProps.value
            },()=>{
                this.props.onChange && this.props.onChange(this.state.message);
            })
        }
    }
    handleMsgChange(e){
        this.props.form.setFieldsValue({
            message:e.target.value
        });
        this.setState({
            message:e.target.value
        },()=>{
            this.props.onChange && this.props.onChange(this.state.message);
        });

    }
    addMessageInfo(e){
        let {message} = this.state;
        message += `[${e.target.textContent}]`;
        this.props.form.setFieldsValue({
            message:message
        });
        this.setState({
            message :message
        },()=>{
            this.props.onChange && this.props.onChange(this.state.message);
        })
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        if(this.props.sendFlag){
            return (
                <div>

                    <FormItem label="短信模板" className={styles.FormItemStyle}  labelCol={{span:4}}
                              wrapperCol={{span:17}} >
                        {getFieldDecorator('message', {
                            rules: [{
                                required:true,
                                message:'请输入短信模板'
                            }],
                            initialValue:this.state.message,
                            onChange:this.handleMsgChange
                        })(
                            <Input rows={4} type="textarea" placeholder="请输入短信模板" onChange={this.handleDescriptionChange}/>
                        )}

                    </FormItem>
                    <FormItem label="" className={styles.FormItemStyle} wrapperCol={{span:17, offset:4}} >
                        <Button onClick={this.addMessageInfo}>会员姓名</Button>
                        <Button onClick={this.addMessageInfo}>先生/女士</Button>
                        <Button onClick={this.addMessageInfo}>卡名称</Button>
                        <Button onClick={this.addMessageInfo}>卡号后四位</Button>
                        <Row>
                            <Col span={2}> <span className={styles.titleHeight}>规则:</span></Col>
                            <Col span={22}>
                                <p className={styles.blockP}>
                                    请不要输入"【】" "[]"符号
                                </p>
                                <p className={styles.blockP}>
                                    预计字数：38字，67字为一条，最多500字（含标点空格）
                                </p>
                                <p className={styles.blockP}>
                                    短信费用0.08元/条
                                </p>
                            </Col>
                            <Col span={2} ><span className={styles.titleHeight}>注:</span></Col>
                            <Col span={22}>
                                <p className={styles.blockP}>1.  统计字数中含"回复TD退订【互联网餐厅】"</p>
                                <p className={styles.blockP}>2.  字数以最终发出短信内容为准</p>
                            </Col>

                        </Row>
                    </FormItem>
                </div>
            );
        }else{
            return (
                <div className={styles.noMsg}>
                    您没有开启发送短信功能，可以直接跳过该步骤
                </div>
            )
        }

    }
}
const mapStateToProps = (state) => {
    return {
        specialPromotion: state.sale_old_specialPromotion
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSpecialBasicInfo:(opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SendMsgInfo);
