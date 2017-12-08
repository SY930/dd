import React from 'react'
import { Row, Col, Input, DatePicker, Form, Select} from 'antd';
import { connect } from 'react-redux'
import styles from '../../SaleCenter/ActivityPage.less';
import '../../../components/common/ColorPicker.less';
import {
    saleCenterSetSpecialBasicInfoAC
} from '../../../redux/actions/saleCenter/specialPromotion.action'
var Immutable = require("immutable");
var moment = require("moment");
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

class StepOneWithDateRange extends React.Component{
    constructor(props){
        super(props);
        this.state={
            description:null,
            dateRange: Array(2),
            name:''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.getDateCount = this.getDateCount.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);

    }

    componentDidMount() {
        this.props.getSubmitFn({
            prev: undefined,
            next: this.handleSubmit,
            finish: undefined,
            cancel: undefined
        });
        let specialPromotion = this.props.specialPromotion.get('$eventInfo').toJS();
        if(specialPromotion.eventStartDate !== '20000101' && specialPromotion.eventEndDate !== '29991231' &&
            specialPromotion.eventStartDate !== '0' && specialPromotion.eventEndDate !== '0' &&
            specialPromotion.eventStartDate !== '' && specialPromotion.eventEndDate !== ''){
            this.setState({
                name:specialPromotion.eventName,
                description:specialPromotion.eventRemark,
                dateRange:[moment(specialPromotion.eventStartDate,'YYYYMMDD'),moment(specialPromotion.eventEndDate,'YYYYMMDD')]
            })
        }else{
            this.setState({
                name:specialPromotion.eventName,
                description:specialPromotion.eventRemark,
            })
        }


    };


    componentWillReceiveProps(nextProps) {
        // 是否更新
        if(this.props.specialPromotion.get('$eventInfo') != nextProps.specialPromotion.get('$eventInfo')){
            let specialPromotion = nextProps.specialPromotion.get('$eventInfo').toJS();
            if(specialPromotion.eventStartDate !== '20000101' && specialPromotion.eventEndDate !== '29991231' &&
                specialPromotion.eventStartDate !== '0' && specialPromotion.eventEndDate !== '0' &&
                specialPromotion.eventStartDate !== '' && specialPromotion.eventEndDate !== ''){
                this.setState({
                    name:specialPromotion.eventName,
                    description:specialPromotion.eventRemark,
                    dateRange:[moment(specialPromotion.eventStartDate,'YYYYMMDD'),moment(specialPromotion.eventEndDate,'YYYYMMDD')]
                })
            }else{
                this.setState({
                    name:specialPromotion.eventName,
                    description:specialPromotion.eventRemark,
                })
            }
        }

    };

    handleSubmit(){
        let nextFlag = true;
        this.props.form.validateFieldsAndScroll((err1, basicValues) => {
            if (err1) {
                nextFlag = false;
            }
            if(nextFlag){
                if(this.props.type == '53'){
                    this.props.setSpecialBasicInfo({
                        eventName:this.state.name,
                        eventRemark:this.state.description
                    })
                }else{
                    this.props.setSpecialBasicInfo({
                        eventName:this.state.name,
                        eventRemark:this.state.description,
                        eventStartDate: this.state.dateRange[0]?this.state.dateRange[0].format('YYYYMMDD'):'0',
                        eventEndDate: this.state.dateRange[1]?this.state.dateRange[1].format('YYYYMMDD'):'0'
                    })
                }

            }

        });
        return nextFlag;
    }

    getDateCount(){
        if (undefined === this.state.dateRange[0] || undefined === this.state.dateRange[1]) {
            return 0
        }

        if (null === this.state.dateRange[0] || null === this.state.dateRange[1]) {
            return 0
        }

        return this.state.dateRange[1]
                .diff(this.state.dateRange[0], 'days') + 1;

    }
    handleDescriptionChange(e){
        this.setState({
            description:e.target.value
        });
    }

    handleDateChange(date, dateString){
        this.setState({
            dateRange: date
        })
    }

    handleNameChange(e) {
        this.setState({
            name:e.target.value
        });
    }

    render(){
        let categorys = this.props.saleCenter.get("characteristicCategories").toJS();
        let type = this.props.type;
        let lab = categorys.find((cc)=>{
            return cc.key == type
        }).title;

        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 17},
        };
        const {getFieldDecorator} = this.props.form;

        //判断日期格式是否合法,不合法不设置defaultValue
        let dateRangeProps;
        if (this.state.dateRange[0] !== undefined && this.state.dateRange[1] !== undefined &&
            this.state.dateRange[0] !== '0' && this.state.dateRange[1] !== '0'
        ) {
            dateRangeProps = {
                className: styles.ActivityDateDayleft,
                onChange: this.handleDateChange,
                value: this.state.dateRange
            }
        } else {
            dateRangeProps = {
                className: styles.ActivityDateDayleft,
                onChange: this.handleDateChange
            }
        }
        return (
            <Form>
                <FormItem label='活动类型' className={styles.FormItemStyle} labelCol={{span:4}}
                          wrapperCol={{span:17}}>
                    <p>{lab}</p>
                </FormItem>
                <div>
                    <FormItem label="活动名称" className={styles.FormItemStyle} {...formItemLayout}>
                        {getFieldDecorator('promotionName', {
                            rules: [{
                                whitespace:true,
                                required: true,
                                message: '汉字、字母、数字组成，不多于50个字符',
                                pattern: /^[\u4E00-\u9FA5A-Za-z0-9\s\.]{1,50}$/,
                            }],
                            initialValue: this.state.name,
                        })(
                            <Input placeholder="请输入活动名称"  onChange={this.handleNameChange}/>
                        )}
                    </FormItem>
                    {
                        this.props.type =='53'?
                            null:
                            <FormItem label="活动起止日期" className={styles.FormItemStyle} labelCol={{span:4}}
                                      wrapperCol={{span: 17}}>
                                <Row>
                                    <Col span={21}>
                                        <RangePicker {...dateRangeProps}  style={{width:'100%'}}/>
                                    </Col>
                                    <Col offset={1} span={2}>
                                        <div className={styles.ActivityDateDay}>
                                <span>
                                    {
                                        this.getDateCount()
                                    }
                                </span>
                                            <span>天</span>
                                        </div>

                                    </Col>
                                </Row>

                            </FormItem>
                    }

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
                </div>


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

export default connect(mapStateToProps,mapDispatchToProps)(Form.create()(StepOneWithDateRange));
