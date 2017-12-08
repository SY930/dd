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
    Form,
    DatePicker,
    Select,
    Col,
    Radio,
    TreeSelect
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

import {saleCenterSetSpecialBasicInfoAC} from '../../../redux/actions/saleCenter/specialPromotion.action'
import styles from '../../SaleCenter/ActivityPage.less';
import SendMsgInfo from '../common/SendMsgInfo';
import {fetchSpecialCardLevel} from '../../../redux/actions/saleCenter/mySpecialActivities.action'
import {fetchPromotionScopeInfo} from '../../../redux/actions/saleCenter/promotionScopeInfo.action';
import _ from 'lodash';
var moment = require("moment");

if (process.env.__CLIENT__ === true) {
    require('../../../components/common/components.less');
}

let Immutable = require('immutable');

class StepTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message:'',
            cardInfo:[],
            lastTransTimeFilter: '0',  //最后消费时间限制
            lastTransTime: '',         //最后消费时间
            lastTransTimeStatus: 'success', //最后消费时间校验状态
            startTime: '',               //短信发送时间
            lastTransShopID: '0',       //最后消费店铺ID
            lastTransShopName: '不限',    //最后消费店铺名称
            isVipBirthdayMonth:'0',       //当月生日
            cardLevelID:'0',        //卡等级ID
            shopsData:[]
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.msgSendTime = this.msgSendTime.bind(this);
        this.TimeChange = this.TimeChange.bind(this);
        this.TimeFilterChange = this.TimeFilterChange.bind(this);
        this.onShopChange = this.onShopChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleVipBirthdayMonthChange = this.handleVipBirthdayMonthChange.bind(this);
        this.preProShops = this.preProShops.bind(this);
        this.renderOptions = this.renderOptions.bind(this);
    }

    handleSubmit() {
        let flag = true;
        this.props.form.validateFieldsAndScroll((err1, basicValues) => {
            if (err1) {
                flag = false;
            }
            //校验最后消费时间
            if(this.state.lastTransTimeFilter !== '0' && (this.state.lastTransTime == '' || this.state.lastTransTime == '0')){
                flag = false;
                this.setState({
                    lastTransTimeStatus: 'error'
                })
            }
            if(flag){
                this.props.setSpecialBasicInfo({
                    smsTemplate:this.state.message,
                    lastTransTimeFilter: this.state.lastTransTimeFilter,
                    lastTransTime: this.state.lastTransTime || '',
                    startTime: this.state.startTime || '',
                    lastTransShopID: this.state.lastTransShopID,
                    lastTransShopName: this.state.lastTransShopName,
                    isVipBirthdayMonth: this.state.isVipBirthdayMonth,
                    cardLevelID: this.state.cardLevelID,
                })
            }
        });

        return flag;
    }

    componentDidMount() {
        let user = this.props.user;
        let opts = {
            _groupID: user.accountInfo.groupID,
            _role:user.accountInfo.roleType,
            _loginName:user.accountInfo.loginName,
            _groupLoginName:user.accountInfo.groupLoginName,
        };
        this.props.fetchSpecialCardLevel({
            data:opts
        });
        this.props.getSubmitFn({
            prev: undefined,
            next: undefined,
            finish: this.handleSubmit,
            cancel: undefined
        });
        let specialPromotion = this.props.specialPromotion.get('$eventInfo').toJS();
        if(Object.keys(specialPromotion).length >30 ){
            //修改时,初始化state
            this.setState({
                message:specialPromotion.smsTemplate,
                lastTransTimeFilter: specialPromotion.lastTransTimeFilter,
                lastTransTime: specialPromotion.lastTransTime,
                startTime: specialPromotion.startTime,
                lastTransShopID: specialPromotion.lastTransShopID,
                lastTransShopName: specialPromotion.lastTransShopName,
                isVipBirthdayMonth: specialPromotion.isVipBirthdayMonth,
                cardLevelID: specialPromotion.cardLevelID
            })
        }
        //初始化店铺信息
        if (!this.props.promotionScopeInfo.getIn(["refs", "initialized"])) {
            this.props.fetchPromotionScopeInfo({_groupID: this.props.user.accountInfo.groupID});
        }else{
            let $shops = Immutable.List.isList(this.props.promotionScopeInfo.getIn(["refs", "data", "shops"]))?
                this.props.promotionScopeInfo.getIn(["refs", "data", "shops"]).toJS():
                this.props.promotionScopeInfo.getIn(["refs", "data", "shops"]);
            this.setState({
                shopsData: this.preProShops($shops)
            });
        }



    }

    componentWillReceiveProps(nextProps) {
        //修改时,初始化state
        if(this.props.specialPromotion.get('$eventInfo') != nextProps.specialPromotion.get('$eventInfo') &&
            nextProps.specialPromotion.get('$eventInfo').size >30 ){
            let specialPromotion = nextProps.specialPromotion.get('$eventInfo').toJS();
            this.setState({
                message:specialPromotion.smsTemplate,
                lastTransTimeFilter: specialPromotion.lastTransTimeFilter,
                lastTransTime: specialPromotion.lastTransTime,
                startTime: specialPromotion.startTime,
                lastTransShopID: specialPromotion.lastTransShopID,
                lastTransShopName: specialPromotion.lastTransShopName,
                isVipBirthdayMonth: specialPromotion.isVipBirthdayMonth,
                cardLevelID: specialPromotion.cardLevelID
            })
        }
        //获取会员等级信息
        if(nextProps.mySpecialActivities.$specialDetailInfo.data.cardInfo.data){
            if(nextProps.mySpecialActivities.$specialDetailInfo.data.cardInfo &&
                nextProps.mySpecialActivities.$specialDetailInfo.data.cardInfo.data &&
                nextProps.mySpecialActivities.$specialDetailInfo.data.cardInfo.data.groupCardTypeList){
                this.setState({
                    cardInfo:nextProps.mySpecialActivities.$specialDetailInfo.data.cardInfo.data.groupCardTypeList
                })
            }else{
                this.setState({
                    cardInfo:[]
                })
            }
        }

        //初始化店铺信息
        if(JSON.stringify(nextProps.promotionScopeInfo.getIn(["refs", "data"])) !=
            JSON.stringify(this.props.promotionScopeInfo.getIn(["refs", "data"]))){
            let $shops = Immutable.List.isList(nextProps.promotionScopeInfo.getIn(["refs", "data", "shops"]))?
                nextProps.promotionScopeInfo.getIn(["refs", "data", "shops"]).toJS():
                nextProps.promotionScopeInfo.getIn(["refs", "data", "shops"]);
            this.setState({
                shopsData: this.preProShops($shops)
            });
        }

    }

    //cardLevelID change
    handleSelectChange(val){
        this.setState({
            cardLevelID: val
        })
    }

    //isVipBirthdayMonth change
    handleVipBirthdayMonthChange(e){
        this.setState({
            isVipBirthdayMonth:e.target.value
        });
    }
    //拼接treeSelect数据
    preProShops(data){
        let itemArray = [];
        let hh = _.groupBy(data, 'cityID');
        _.forEach(hh, (item, key) => {
            let ff = _.map(item, function(_item){
                return _.pick(_item, ['shopName','shopID']);
            }).map(shop => {
                return {content: shop.shopName, id: `${shop.shopID},${shop.shopName}`}
            });
            itemArray.push({
                province: {id:key, content: item[0].cityName},
                cities:ff
            });
        });
        let shopsData = [];
        _.forEach(itemArray, (item, key) => {
            let children = [];
            _.forEach(item.cities, (city, index) => {
                children.push({
                    label: city.content,
                    value: String(city.id),
                    key: key+''+index,
                })
            });
            shopsData.push({
                label: item.province.content,
                value: '',
                key: key,
                children:children,
            })
        });
        shopsData.unshift({
            label: '不限',
            value: '0,不限',
            key: '0'
        });
        return shopsData;
    }

    //startTime change
    msgSendTime(val){
        this.setState({
            startTime:val.format('YYYYMMDDHHmmss')
        })
    }
    //lastTransTimeFilter change
    TimeFilterChange(val){
        //不限制的时候把日期置空
        if(val == '0'){
            this.setState({
                lastTransTimeFilter :val,
                lastTransTimeStatus: 'success',
                lastTransTime: ''
            })
        }else{
            this.setState({
                lastTransTimeFilter :val
            })
        }

    }
    //lastTransTime change
    TimeChange(val){
        if(val == null){
            this.setState({
                lastTransTimeStatus: 'error',
                lastTransTime :null,
            })
        }else{
            this.setState({
                lastTransTime :val.format('YYYYMMDD'),
                lastTransTimeStatus: 'success'
            })
        }

    }
    //最后购买店铺 change
    onShopChange(val){
        if(val == undefined || val == ''){
            return
        }
        let nameAndID = val.split(',');
        this.setState({
            lastTransShopID: nameAndID[0],
            lastTransShopName: nameAndID[1],
        })
    }
    //会员等级Option
    renderOptions(){

        let cardInfo = this.state.cardInfo;
        let options = [
            <Option key={`-1`} value={'-1'}>不限</Option>,
            <Option key={`0`} value={'0'}>全部会员</Option>
        ];
        options = options.concat(cardInfo.map((cardType) =>{
            return cardType.cardTypeLevelList.map((card, index) =>{
                return (
                    <Option key={`${index+1}`} value={card.cardLevelID}>{`${cardType.cardTypeName} - ${card.cardLevelName}`}</Option>
                )
            })
        }));
        return options;
    }

    render() {
        let sendFlag = true;
        let{lastTransTimeFilter, lastTransTime, startTime, lastTransShopID, lastTransShopName, lastTransTimeStatus} = this.state,
            // treeselect props
            treeProps = {
                treeData: this.state.shopsData,
                showSearch: true,
                onChange: this.onShopChange,
                showCheckedStrategy: SHOW_PARENT,
                searchPlaceholder: '请搜索店铺',
                treeNodeFilterProp: "label",
                allowClear: true,
                getPopupContainer: () => document.querySelector('.crmOperationTree')
            },
            lastTimeProps = {
                onChange: this.TimeChange
            },
            sendTimeProps = {
                showTime: true,
                format: "YYYY-MM-DD HH:mm:ss",
                placeholder: "请选择日期和时间",
                style: {width:'100%'},
                onChange: this.msgSendTime
            },
            getFieldDecorator = this.props.form.getFieldDecorator;

        //treeSelect value: 店铺ID,店铺Name
        if(lastTransShopID !== '' && lastTransShopName !== ''){
            treeProps.value = `${lastTransShopID},${lastTransShopName}`
        }
        //字符串转成moment
        if(lastTransTime !== '' && lastTransTime !== '0' && lastTransTime !== null){
            lastTimeProps.value = moment(lastTransTime,"YYYYMMDD")
        }

        if(lastTransTimeFilter == '0'){
            lastTimeProps.disabled = true;
        }
        if(startTime !== '' && startTime !== 0){
            sendTimeProps.initialValue = moment(startTime,"YYYYMMDDHHmmss")
        }
        return (
            <div>
                <FormItem label="短信发送时间" className={styles.FormItemStyle}  labelCol={{span:4}}
                          wrapperCol={{span:17}} >
                    {getFieldDecorator('sendTime', {
                        rules: [{
                            required:true,
                            message: '请选择短信发送时间'
                        }],
                        ...sendTimeProps
                    })(
                        <DatePicker />
                    )}

                </FormItem>
                <FormItem label="最后消费日期" className={styles.FormItemStyle}  labelCol={{span:4}}
                          wrapperCol={{span:17}} >

                    <Col span={11} className='selectContanier'>
                        <FormItem  className={styles.FormItemStyle} >
                            <Select size="default"
                                    value={`${lastTransTimeFilter}`}
                                    onChange={this.TimeFilterChange}
                                    getPopupContainer={() => document.querySelector('.selectContanier')}>
                                <Option value={'0'}>不限制</Option>
                                <Option value={'1'}>早于</Option>
                                <Option value={'2'}>晚于</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={12} offset={1}>
                        <FormItem className={styles.FormItemStyle} validateStatus={lastTransTimeStatus} help={lastTransTimeStatus == 'success'? null :'请选择最后消费日期'}>
                            {/*选择不限制的时候,不能选择最后消费日期*/}
                            <DatePicker disabled={lastTransTimeFilter == '0'} {...lastTimeProps}/>
                        </FormItem>
                    </Col>
                </FormItem>

                <FormItem label="最后消费店铺" className={styles.FormItemStyle}  labelCol={{span:4}}
                          wrapperCol={{span:17}} >
                    <Col span={24} className='crmOperationTree'>
                        <TreeSelect {...treeProps}/>
                    </Col>
                </FormItem>

                <FormItem label="顾客范围" className={styles.FormItemStyle}  labelCol={{span:4}}
                          wrapperCol={{span:17}} >
                    <Select onChange={this.handleSelectChange} value={this.state.cardLevelID} size="default">
                        {this.renderOptions()}
                    </Select>
                </FormItem>

                <FormItem label="其他限制" className={styles.noPadding}
                          wrapperCol={{span:17}} labelCol={{span:4}}>
                    <RadioGroup onChange={this.handleVipBirthdayMonthChange} value={this.state.isVipBirthdayMonth}>
                        <Radio value={'0'}>不限制</Radio>
                        <Radio value={'1'}>仅限本月生日的会员参与</Radio>
                    </RadioGroup>
                </FormItem>

                <SendMsgInfo
                    sendFlag={sendFlag}
                    form ={this.props.form}
                    value={this.state.message}
                    onChange={
                        (val)=>{
                            this.setState({message: val});
                        }
                    }
                />
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        specialPromotion: state.specialPromotion,
        user: state.user.toJS(),
        mySpecialActivities: state.mySpecialActivities.toJS(),
        promotionScopeInfo: state.promotionScopeInfo

    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSpecialBasicInfo:(opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
        fetchSpecialCardLevel:(opts) => {
            dispatch(fetchSpecialCardLevel(opts));
        },
        fetchPromotionScopeInfo: (opts) => {
            dispatch(fetchPromotionScopeInfo(opts));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(StepTwo));
