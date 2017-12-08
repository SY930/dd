/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-02-09T11:12:25+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: FullCutInfo.jsx
 * @Last modified by:   xf
 * @Last modified time: 2017-04-10T14:57:36+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */

import React from 'react'
import { Row, Col, Input, DatePicker, Form, Select} from 'antd';
import { connect } from 'react-redux'

import styles from '../../SaleCenter/ActivityPage.less';
import '../../../components/common/ColorPicker.less';
import {WrappedAdvancedTimeSetting} from '../../SaleCenter/common/AdvancedTimeSetting';
import PriceInput from '../../../containers/SaleCenter/common/PriceInput';

import {
    saleCenterSetSpecialBasicInfoAC
} from '../../../redux/actions/saleCenter/specialPromotion.action'
import {SEND_MSG} from '../../../redux/actions/saleCenter/types'

const FormItem = Form.Item;
const Option = Select.Option;

class PromotionBasicInfo extends React.Component{
    constructor(props){
        super(props);
        this.state={
            advanceDaysFlag:true,
            advanceDays:null,
            description:null,
            sendMsg:'1',
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAdvanceDaysChange = this.handleAdvanceDaysChange.bind(this);
        this.handleSendMsgChange = this.handleSendMsgChange.bind(this);
        this.renderPromotionType = this.renderPromotionType.bind(this);
        this.renderMoreInfo = this.renderMoreInfo.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);

    }

    componentDidMount() {
        this.props.getSubmitFn({
            prev: undefined,
            next: this.handleSubmit,
            finish: undefined,
            cancel: undefined
        });
        let specialPromotion = this.props.specialPromotion.get('$eventInfo').toJS();
        this.setState({
            advanceDays:specialPromotion.giftAdvanceDays,
            description:specialPromotion.eventRemark,
            sendMsg:`${specialPromotion.smsGate}`
        })

    };


    componentWillReceiveProps(nextProps) {
        // 是否更新
        if(this.props.specialPromotion.get('$eventInfo') != nextProps.specialPromotion.get('$eventInfo')){
            let specialPromotion = nextProps.specialPromotion.get('$eventInfo').toJS();
            this.setState({
                advanceDays:specialPromotion.giftAdvanceDays,
                description:specialPromotion.eventRemark,
                sendMsg:`${specialPromotion.smsGate}`
            })
        }

    };

    handleSubmit(){
        let nextFlag = true;
        this.props.form.validateFieldsAndScroll((err1, basicValues) => {
            if(this.props.type =='51'){
                if (err1) {
                    nextFlag = false;
                }
                if(this.state.advanceDays == null ||this.state.advanceDays == ''){
                    nextFlag = false;
                    this.setState({advanceDaysFlag:false});
                }

                // save state to redux

                if(nextFlag){
                    this.props.setSpecialBasicInfo({
                        giftAdvanceDays:this.state.advanceDays,
                        eventRemark:this.state.description,
                        smsGate:this.state.sendMsg
                    })

                }
            }else{
                if (err1) {
                    nextFlag = false;
                }
                if(nextFlag){
                    this.props.setSpecialBasicInfo({
                        eventRemark:this.state.description
                    })
                }
            }

        });
        return nextFlag;
    }

    handleDescriptionChange(e){
        this.setState({
            description:e.target.value
        });
    }
    handleAdvanceDaysChange(value){
        let advanceDaysFlag = true;
        if(value.number== null || value.number == ''){
            advanceDaysFlag = false;
        }
        this.setState({
            advanceDays:value.number,
            advanceDaysFlag
        });
    }
    handleSendMsgChange(value){
        this.setState({
            sendMsg:value
        });
    }



    renderPromotionType(){
        let categorys = this.props.saleCenter.get("characteristicCategories").toJS();
        let type = this.props.type;
        let lab = categorys.find((cc)=>{
            return cc.key == type
        }).title;
        return (
            <FormItem label='活动类型' className={styles.FormItemStyle} labelCol={{span:4}}
                      wrapperCol={{span:17}}>
                <p>{lab}</p>
            </FormItem>
        )
    }
    renderMoreInfo(){
        switch (this.props.type) {
            case '51' :
                return (
                    <Form>
                        <FormItem label="提前赠送天数" className={[styles.FormItemStyle, styles.priceInputSingle].join(' ')}
                                  labelCol={{span: 4}}
                                  wrapperCol={{span: 17}} required={true}
                                  validateStatus={this.state.advanceDaysFlag ? 'success' : 'error'}
                                  help={this.state.advanceDaysFlag ? null : '请输入提前赠送天数'}>

                            <PriceInput addonBefore={''}
                                        addonAfter={'天'}
                                        placeholder = '请输入提前赠送天数'
                                        value={{number: this.state.advanceDays}}
                                        defaultValue={{number: this.state.advanceDays}}
                                        onChange={this.handleAdvanceDaysChange}
                                        modal="int"
                            />

                        </FormItem>

                        <FormItem label="是否发送消息" className={styles.FormItemStyle} labelCol={{span: 4}}
                                  wrapperCol={{span: 17}}>
                            <Select size="default" value={this.state.sendMsg} onChange={this.handleSendMsgChange}>
                                {
                                    SEND_MSG.map((item)=>{
                                        return(<Option value={`${item.value}`} key={`${item.value}`}>{item.label}</Option>)
                                    })
                                }
                            </Select>

                        </FormItem>
                    </Form>
                );
            default :
                return null;
        }
    }
    render(){
        //TODO:编码不能重复
        const { getFieldDecorator } = this.props.form;

        return (
            <Form>
                {this.renderPromotionType()}
                {this.renderMoreInfo()}

                <FormItem label="活动说明" className={styles.FormItemStyle}  labelCol={{span:4}}
                          wrapperCol={{span:17}} >
                    {getFieldDecorator('description', {
                        rules: [{
                            required:true,
                            message: '不多于200个字符',
                            pattern:/.{1,200}/,
                        }],
                        initialValue:this.state.description,
                    })(
                    <Input type="textarea" placeholder="请输入活动说明" onChange={this.handleDescriptionChange}/>
                    )}
                </FormItem>

            </Form>
        )
    }
}

const mapStateToProps = (state)=>{
    return {
        promotionBasicInfo:state.promotionBasicInfo,
        saleCenter: state.saleCenter,
        user:state.user.toJS(),
        specialPromotion: state.specialPromotion
    }
};

const mapDispatchToProps = (dispatch) =>{
    return {
        setSpecialBasicInfo:(opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(Form.create()(PromotionBasicInfo));
