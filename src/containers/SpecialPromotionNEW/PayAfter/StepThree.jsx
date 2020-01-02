import React from 'react';
import { Button, Icon, Tabs, message, Select, Row, Col } from 'antd';
import _ from 'lodash';
import { connect } from 'react-redux';
import { 
    addSpecialPromotion, 
    updateSpecialPromotion, 
    saleCenterLotteryLevelPrizeData, 
    saleCenterSetSpecialBasicInfoAC, 
    saleCenterSetSpecialGiftInfoAC, 
} from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import {
    fetchGiftListInfoAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import {
    UpdateGiftLevel,
} from '../../../redux/actions/saleCenterNEW/mySpecialActivities.action';
import {
    SALE_CENTER_GIFT_TYPE,
    SALE_CENTER_GIFT_EFFICT_TIME,
    SALE_CENTER_GIFT_EFFICT_DAY,
} from '../../../redux/actions/saleCenterNEW/types';
import { axiosData } from '../../../helpers/util';
import BaseForm from '../../../components/common/BaseForm';
import styles from './payAfter.less'
import CropperUploader from 'components/common/CropperUploader'
import phone from './assets/phone.png';
import jingdong from './assets/jingdong.png';
class StepThree extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            ifError: true,
            wechatVisible: false,
            saleVisible: false,
            activeWechat: '',
            jumpDes: '',
            saleImg: '',
            jingdongVisible: false,
            selfImagePath1Visible: false,
            selfImagePath1Img: '',
            selfImagePath2Visible: false,
            selfImagePath2Img: '',
            selfImagePath3Visible: false,
            selfImagePath3Img: '',
            errorVisible: false,
            formData: {},
            formItems: {
                afterPayJumpType: {
                    label: '支付后页面定制',
                    type: 'radio',
                    labelCol: { span: 4 },
                    wrapperCol: { span: 20 },
                    defaultValue: '1',
                    options: [
                        {value:'1',label:'停留在支付成功页'},
                        {value:'2',label:'3秒后自动跳转指定连接'},
                    ],
                },
                jumpUrl: {
                    label: '跳转链接',
                    type: 'text',
                    placeholder: '请输入跳转链接',
                    labelCol: { span: 4 },
                    wrapperCol: { span: 20 },
                    rules: [
                        { required: true, message: '请输入跳转链接' },
                    ],
                },
                wechatPublic: {
                    label: <span style={{position: 'relative'}}><span style={{color: 'red', position:'absolute', left:'-10px'}}>*</span><span>广告投放</span></span>,
                    type: 'checkbox',
                    // defaultValue: ['2', '1'],
                    labelCol: { span: 4 },
                    wrapperCol: { span: 5 },
                    options: [
                        { label: '关注公众号', value: '1' },
                    ],
                    rules: [{ type: 'array', }],
                },
                saleActivity: {
                    label: <span style={{color: 'transparent'}}>xxx</span>,
                    type: 'checkbox',
                    labelCol: { span: 4 },
                    wrapperCol: { span: 5 },
                    options: [
                        { label: '营销活动', value: '2' },
                    ],
                },
                diffAds:{
                    label: <span style={{color: 'transparent'}}>xxx</span>,
                    type: 'checkbox',
                    labelCol: { span: 4 },
                    wrapperCol: { span: 5 },
                    options: [
                        { label: '异页广告投放', value: '3' },
                    ],
                },
                jingdong: {
                    label: <span style={{color: 'transparent'}}>xxx</span>,
                    type: 'checkbox',
                    labelCol: { span: 5 },
                    wrapperCol: { span: 5 },
                    disabled: true,
                    defaultValue: 'JD_GOLD_URL',
                    options: [
                         { label: <span className='secondLayerOption' style={{color: '#787878',}}>京东金条广告</span>, value: 'JD_GOLD_URL' },
                    ],
                },
                selDifineAds: {
                    label: <span style={{color: 'transparent'}}>xxx</span>,
                    type: 'checkbox',
                    labelCol: { span: 4 },
                    wrapperCol: { span: 5 },
                    options: [
                          { label: '自定义海报广告', value: '4' },
                    ],
                },
                mpID: {
                    label: '选择公众号',
                    labelCol: { span: 7 },
                    wrapperCol: { span: 8 },
                    type: 'custom',
                    render: (decorator) => decorator({
                        key: 'mpID',
                        rules: [
                            { required: true, message: '公众号不能为空' },
                        ],
                    })(
                        <Select
                            placeholder="请选择引导关注公众号"
                        >
                            {
                                this.state.wechatList.map(({mpID, mpName}) => (
                                    <Select.Option key={mpID} value={mpID}>{mpName}</Select.Option>
                                ))
                                
                            }
                        </Select>
                    )
                },
                jumpRemark: {
                    label: '引导语',
                    type: 'text',
                    labelCol: { span: 7 },
                    wrapperCol: { span: 8 },
                },
                speEventID: {
                    label: '选择活动',
                    labelCol: { span: 7 },
                    wrapperCol: { span: 8 },
                    type: 'custom',
                    render: (decorator) => decorator({
                        key: 'speEventID',
                        rules: [
                            { required: true, message: '活动不能为空' },
                        ],
                    })(
                        <Select
                            placeholder="请选择活动"
                        >
                            {
                                this.state.activityList.map(({eventID, eventName}) => (
                                    <Select.Option key={eventID} value={eventID}>{eventName}</Select.Option>
                                ))
                            }
                        </Select>
                    )
                },
                saleImagePath: {
                    type: 'custom',
                    label: <span style={{color: 'transparent'}}>xxx</span>,
                    labelCol: { span: 7 },
                    wrapperCol: { span: 15 },
                    render: decorator => (
                        <Row>
                            <Col span={12} >
                                {decorator({
                                    key: 'saleImagePath',
                                })(
                                    <CropperUploader 
                                        className={styles.uploadCom}
                                        width={120}
                                        height={110}
                                        cropperRatio={695/298}
                                        limit={1000}
                                        uploadTest='上传宣传图片'
                                    />
                                )}
                            </Col>
                            <Col span={12} className={styles.grayFontPic} >
                                <p style={{ position: 'relative', top: 40, left: -62,}}>格式仅限jpg、jpeg、png、gif</p>
                            </Col>
                        </Row>
                    ),
                },
                selfImagePath1: {
                    type: 'custom',
                    label: <span>广告1</span>,
                    labelCol: { span: 7 },
                    wrapperCol: { span: 15 },
                    render: decorator => (
                        <Row style={{position: 'relative'}}>
                            <Icon type="plus-circle" className={styles.addIcon} style={{ display: this.state.formKeys.indexOf('selfImagePath2')>=0 ? 'none' : 'inline-block' }} onClick={this.addSelfAds.bind(this, 2)}/>
                            <Col span={12} >
                                {decorator({
                                    key: 'selfImagePath1',
                                    rules: [
                                        { required: true, message: '必须有海报的图片' },
                                    ],
                                })(
                                    <CropperUploader 
                                        className={styles.uploadCom}
                                        width={120}
                                        height={110}
                                        cropperRatio={695/298}
                                        limit={1000}
                                        uploadTest='上传海报图片'
                                    />
                                )}
                            </Col>
                            <Col span={12} className={styles.grayFontPic} >
                                <p style={{ position: 'relative', top: 40, left: -62,}}>格式仅限jpg、jpeg、png、gif</p>
                            </Col>
                        </Row>
                    ),
                },
                selfJumpUrl1: {
                    label: '跳转链接',
                    type: 'text',
                    placeholder: '请输入跳转链接',
                    labelCol: { span: 7 },
                    wrapperCol: { span: 8 },
                },
                selfImagePath2: {
                    type: 'custom',
                    label: <span>广告2</span>,
                    labelCol: { span: 7 },
                    wrapperCol: { span: 15 },
                    render: decorator => (
                        <Row style={{position: 'relative'}}>
                            <Icon type="plus-circle" className={styles.addIcon} style={{ display: this.state.formKeys.indexOf('selfImagePath3')>=0 ? 'none' : 'inline-block' }} onClick={this.addSelfAds.bind(this, 3)}/>
                            <Icon type="close-circle" className={styles.closeIcon} style={{ display: this.state.formKeys.indexOf('selfImagePath3')>=0 ? 'none' : 'inline-block' }} onClick={this.deleteSelfAds.bind(this, 1)}  />
                            <Col span={12} >
                                {decorator({
                                    key: 'selfImagePath2',
                                    rules: [
                                        { required: true, message: '必须有海报的图片' },
                                    ],
                                })(
                                    <CropperUploader 
                                        className={styles.uploadCom}
                                        width={120}
                                        height={110}
                                        cropperRatio={695/298}
                                        limit={1000}
                                        uploadTest='上传海报图片'
                                    />
                                )}
                            </Col>
                            <Col span={12} className={styles.grayFontPic} >
                                <p style={{ position: 'relative', top: 40, left: -62,}}>格式仅限jpg、jpeg、png、gif</p>
                            </Col>
                        </Row>
                    ),
                },
                selfJumpUrl2: {
                    label: '跳转链接',
                    type: 'text',
                    placeholder: '请输入跳转链接',
                    labelCol: { span: 7 },
                    wrapperCol: { span: 8 },
                },
                selfImagePath3: {
                    type: 'custom',
                    label: <span>广告3</span>,
                    labelCol: { span: 7 },
                    wrapperCol: { span: 15 },
                    render: decorator => (
                        <Row style={{position: 'relative'}}>
                                <Icon type="close-circle" className={styles.closeIcon} onClick={this.deleteSelfAds.bind(this, 2)}  />
                            <Col span={12} >
                                {decorator({
                                    key: 'selfImagePath3',
                                    rules: [
                                        { required: true, message: '必须有海报的图片' },
                                    ],
                                })(
                                    <CropperUploader 
                                        className={styles.uploadCom}
                                        width={120}
                                        height={110}
                                        cropperRatio={695/298}
                                        limit={1000}
                                        uploadTest='上传海报图片'
                                    />
                                )}
                            </Col>
                            <Col span={12} className={styles.grayFontPic} >
                                <p style={{ position: 'relative', top: 40, left: -62,}}>格式仅限jpg、jpeg、png、gif</p>
                            </Col>
                        </Row>
                    ),
                },
                selfJumpUrl3: {
                    label: '跳转链接',
                    type: 'text',
                    placeholder: '请输入跳转链接',
                    labelCol: { span: 7 },
                    wrapperCol: { span: 8 },
                }
            },
            formKeys: ['afterPayJumpType', 'wechatPublic','saleActivity','diffAds','selDifineAds'],
            wechatList: [],
            activityList: [],
            selfAdsNum: 1,
        }
        this.queryForm = null;
    }
    componentDidMount() {
        this.props.getSubmitFn({
            prev: undefined,
            next: undefined,
            finish: this.handleSubmit,
            cancel: undefined,
        });
        axiosData(
            '/specialPromotion/queryListWithoutCustomerInfo.ajax',
            {},
            {},
            { path: 'eventList' },
            'HTTP_SERVICE_URL_PROMOTION_NEW'
        ).then(res => {
                this.setState({
                    activityList: res,
                });
            })
        //带微信图片的接口
        axiosData(
            `/mpInfo/queryMpInfo`,
            {pageNo: 1, pageSize: 500,},
            {},
            { path: 'mpInfoResDataList' },
            'HTTP_SERVICE_URL_WECHAT'
        ).then(res => {
            this.setState({
                wechatList: res,
            })
        }).catch(e => {
        })
        let newData = {};
        const { $jumpUrlInfos: jumpUrlInfos, $eventInfo: eventInfo } = this.props.specialPromotion;
        const newObj = this.handleJumpUrlInfos(jumpUrlInfos);
        newData = Object.assign(eventInfo, newObj);
        this.setState({
            formData: newData,
        })

    }
    componentWillReceiveProps(nextProps) {
    }
    addSelfAds = (howMany) => {
        this.queryForm.validateFieldsAndScroll((err, values) => {
            if(!err){
                const { formKeys } = this.state;
                formKeys.push('selfImagePath'+howMany);
                formKeys.push('selfJumpUrl'+howMany);
                this.setState({
                    selfAdsNum: howMany,
                    formKeys,
                })
            }
        });
    }
    deleteSelfAds = (howMany) => {
        const { formKeys } = this.state;
        formKeys.splice(formKeys.indexOf('selfImagePath'+(howMany+1)))
        this.setState({
            selfAdsNum: howMany,
            formKeys,
        })
    }
    handleJumpUrlInfos = (obj) => {
        const result = {};
        let selCount = 1;
        obj.forEach((item, index) => {
            switch(item.jumpType){
                case 1:
                    result.wechatPublic = ['1'],
                    result.mpID = item.mpID;
                    result.jumpRemark = item.jumpRemark || '';
                    return;
                case 2:
                    result.saleActivity = ['2'];
                    result.speEventID = item.jumpEventID;
                    result.saleImagePath = item.imagePath;
                    return;
                case 3:
                    result.diffAds = ['3'];
                    result.jingdong = [].concat(item.yiyeAd);
                    return;
                case 4:
                    result.selDifineAds = ['4'];
                    let name = `selfImagePath${selCount}`;
                    let secondName = `selfJumpUrl${selCount}`;
                    result[name] = item.imagePath;
                    result[secondName] = item.jumpUrl;
                    selCount += 1;
                    return;
            }
        })
        return result;
    }
    handleSubmit = () => {
        let flag = true;
        this.queryForm.validateFieldsAndScroll((err, values) => {
            if (err) {
                flag = false;
            }
            if (flag) {
                const JumpUrlInfo = [];
                if( values.afterPayJumpType == 1){
                    if(values.wechatPublic && values.wechatPublic.length || values.saleActivity && values.saleActivity.length || values.diffAds && values.diffAds.length || values.selDifineAds && values.selDifineAds.length){
                        //数据正确
                        this.setState({
                            errorVisible: false,
                        })
                        if(values.wechatPublic&&values.wechatPublic.length){
                            JumpUrlInfo.push(
                                {
                                    jumpType: 1,
                                    mpID: values.mpID,
                                    jumpRemark: values.jumpRemark,
                                }
                            )
                        }
                        if(values.saleActivity&&values.saleActivity.length){
                            JumpUrlInfo.push(
                                {
                                    jumpType: 2,
                                    jumpEventID: values.speEventID,
                                    imagePath: values.saleImagePath,
                                }
                            )
                        }
                        if(values.diffAds&&values.diffAds.length){
                            JumpUrlInfo.push(
                                {
                                    jumpType: 3,
                                    yiyeAd: 'JD_GOLD_URL',
                                }
                            )
                        }
                        if(values.selDifineAds&&values.selDifineAds.length){
                            JumpUrlInfo.push(
                                {
                                    jumpType: 4,
                                    imagePath: values.selfImagePath1,
                                    jumpUrl: values.selfJumpUrl1,
                                }
                            )
                        }
                        if(values.selfImagePath2){
                            JumpUrlInfo.push(
                                {
                                    jumpType: 4,
                                    imagePath: values.selfImagePath2,
                                    jumpUrl: values.selfJumpUrl2,
                                }
                            )
                        }
                        if(values.selfImagePath3){
                            JumpUrlInfo.push(
                                {
                                    jumpType: 4,
                                    imagePath: values.selfImagePath3,
                                    jumpUrl: values.selfJumpUrl3,
                                }
                            )
                        }
                    }else{
                        this.setState({
                            errorVisible: true,
                        })
                        flag = false;
                        return false;
                    }
                }
                //会把对应的baseform的参数传过去
                this.props.setSpecialBasicInfo({
                    afterPayJumpType: +values.afterPayJumpType,
                    jumpUrl: values.jumpUrl,
                    jumpUrlInfos: JumpUrlInfo,
                });
            }
        });
        return flag;
    }
    showImg = () => {
        const { activeWechat, wechatList} = this.state;
        if(!activeWechat){
            return null;
        }else{
            let activeLogo = '';
            for(let i in wechatList){
                if(wechatList[i].mpID == activeWechat){
                    activeLogo = wechatList[i].headImg;
                }
            }
            const frameid = 'frameimg' + activeWechat;
            window[frameid] = '<img id="img"'+ activeWechat +' style="width: 40px; height: 40px; border-radius: 50%; position: relative;" src=\'' + activeLogo + '?' + Math.random() + '\' /> <script>window.onload = function() { parent.document.getElementById(\'' + frameid + '\').contentWindow.document.querySelectorAll("body")[0].style.margin=0 }<' + '/script>'
            return <iframe id= {frameid} src={`javascript:parent.${frameid}`} frameBorder="0" scrolling="no" style={{width: 40, height: 40}}></iframe>;
        }
    }
    getName = (type) => {
        const { activeWechat, wechatList} = this.state;
        if(!activeWechat){
            return null;
        }else{
            let activeName = '';
            for(let i in wechatList){
                if(wechatList[i].mpID == activeWechat){
                    activeName = wechatList[i].mpName;
                }
            }
            return activeName;
        }
    }
    handleFormChange = (key, value, data) => {
        switch(key){
            case 'afterPayJumpType':
                if(value == 2){
                    this.setState({
                        formKeys: ['afterPayJumpType', 'jumpUrl'],
                    })
                }else {
                    this.setState({
                        formKeys: ['afterPayJumpType', 'wechatPublic','saleActivity','diffAds','selDifineAds'],
                    })
                }
                return;
            case 'wechatPublic':
                if(value && value.length){
                    const { formKeys: tempKeys, formData } = this.state;
                    const tempPosition = tempKeys.indexOf('wechatPublic');
                    tempKeys.splice((tempPosition+1), 0, 'mpID');
                    tempKeys.splice((tempPosition+2), 0, 'jumpRemark');
                    this.setState({
                        formKeys: tempKeys,
                        wechatVisible: true,
                        activeWechat: formData.activeWechat,
                    })
                }else {
                    const { formKeys: tempKeys, formData  } = this.state;
                    const tempPosition = tempKeys.indexOf('mpID');
                    if(tempPosition >= 0){
                        tempKeys.splice((tempPosition), 1);
                    }
                    const tempSecond = tempKeys.indexOf('jumpRemark');
                    if(tempSecond >= 0){
                        tempKeys.splice((tempSecond), 1);
                    }
                    this.setState({
                        formKeys: tempKeys,
                        wechatVisible: false,  
                        activeWechat: formData.activeWechat,                      
                    })
                }
                return;
            case 'saleActivity':
                if(value && value.length){
                    const { formKeys: tempKeys, formData } = this.state;
                    const tempPosition = tempKeys.indexOf('saleActivity');
                    tempKeys.splice((tempPosition+1), 0, 'speEventID');
                    tempKeys.splice((tempPosition+2), 0, 'saleImagePath');
                    this.setState({
                        formKeys: tempKeys,
                        saleVisible: formData.saleImagePath ? true : false,
                        saleImg: formData.saleImagePath,
                    })
                }else {
                    const { formKeys: tempKeys, formData } = this.state;
                    const tempPosition = tempKeys.indexOf('speEventID');
                    if(tempPosition >= 0){
                        tempKeys.splice((tempPosition), 1);
                    }
                    const tempSecond = tempKeys.indexOf('saleImagePath');
                    if(tempSecond >= 0){
                        tempKeys.splice((tempSecond), 1);
                    }
                    this.setState({
                        formKeys: tempKeys,
                        saleVisible: false,
                        saleImg: formData.saleImagePath,
                    })
                }
                return;
            case 'diffAds':
                if(value && value.length){
                    const { formKeys: tempKeys } = this.state;
                    const tempPosition = tempKeys.indexOf('diffAds');
                    tempKeys.splice((tempPosition+1), 0, 'jingdong');
                    this.setState({
                        formKeys: tempKeys,
                        jingdongVisible: true,
                    })
                }else {
                    const { formKeys: tempKeys } = this.state;
                    const tempPosition = tempKeys.indexOf('jingdong');
                    if(tempPosition >= 0){
                        tempKeys.splice((tempPosition), 1);
                    }
                    this.setState({
                        formKeys: tempKeys,
                        jingdongVisible: false,
                    })
                }
                return;
            case 'selDifineAds':
                if(value && value.length){
                    const { formKeys: tempKeys,} = this.state;
                    let { selfAdsNum } = this.state;
                    const tempArr = [];
                    for(let i = 1; i <= selfAdsNum; i++){
                        tempArr.push('selfImagePath'+ i);
                        tempArr.push('selfJumpUrl'+ i);
                    }
                    let arr = tempKeys.concat(tempArr);
                    this.setState({
                        formKeys: arr,
                    })
                }else {
                    if(this.props.isNew) {
                        this.setState({
                            selfAdsNum: 1,
                            selfImagePath1Visible: false,
                            selfImagePath2Visible: false,
                            selfImagePath3Visible: false,
                        })
                    }
                    const { formKeys: tempKeys } = this.state;
                    const tempPosition = tempKeys.indexOf('selfImagePath1');
                    if(tempPosition >= 0){
                        tempKeys.splice(tempPosition);
                    }
                    this.setState({
                        formKeys: tempKeys,
                    })
                }
                return ;
            case 'mpID':
                if(value && value.length){
                    this.setState({
                        activeWechat: value,
                        wechatVisible: true,
                    }, () =>{
                        this.showImg();
                    })
                }else{
                    this.setState({
                        activeWechat: '',
                        wechatVisible: false,
                    }, () =>{
                        this.showImg();
                    })
                }
                return;
            case 'jumpRemark':
                if(value && value.length){
                    this.setState({
                        jumpDes: value,
                    })
                }
                return;
            case 'saleImagePath':
                if(value && value.length){
                    this.setState({
                        saleImg: value,
                        saleVisible: true,
                    })
                }else{
                    this.setState({
                        saleImg: '',
                        // saleVisible: false,
                    })
                }
                return;
            case 'selfImagePath1':
                if(value && value.length){
                    this.setState({
                        selfImagePath1Img: value,
                        selfImagePath1Visible: true,
                    })
                }else{
                    this.setState({
                        selfImagePath1Img: '',
                    })
                }
                return;
            case 'selfImagePath2':
                if(value && value.length){
                    this.setState({
                        selfImagePath2Img: value,
                        selfImagePath2Visible: true,
                    })
                }else{
                    this.setState({
                        selfImagePath2Img: '',
                    })
                }
                return;
            case 'selfImagePath3':
                if(value && value.length){
                    this.setState({
                        selfImagePath3Img: value,
                        selfImagePath3Visible: true,
                    })
                }else{
                    this.setState({
                        selfImagePath3Img: '',
                    })
                }
                return;
            default:
                return;
        }
    }
    render() {
        const a = this.state.formData;
        const { 
                wechatVisible, 
                jumpDes, 
                saleVisible, 
                saleImg, 
                jingdongVisible, 
                selfImagePath1Visible, 
                selfImagePath1Img, 
                selfImagePath2Visible, 
                selfImagePath2Img, 
                selfImagePath3Visible, 
                selfImagePath3Img,
                errorVisible,   
            } = this.state;
        return (
            <div className={styles.relativeDiv}>
                <div className={styles.responseDiv}>
                    <div className={styles.phoneDiv}>
                        <img className={styles.phoneImg} src={phone}></img>
                        <div className={styles.scrollDiv}>
                        <div><Icon type="check-circle" className={styles.checkIcon} /></div>
                        <div><span className={styles.sucFont}>支付成功</span></div>
                        <Button className={styles.checkDetailBtn} type='ghost'>查看订单详情</Button>
                        <div className={styles.addContent}>
                            {wechatVisible ? 
                                <div className={styles.wechatReview}>
                                    <div className={styles.wechatLogo}>
                                        {this.showImg()}
                                    </div>
                                    <div className={styles.desDiv}>
                                        <p className={styles.wechatName}>
                                            {this.getName()}
                                        </p>
                                        <p className={styles.wechatDes}>
                                            {jumpDes}
                                        </p>
                                    </div>
                                    <Button type='primary' className={styles.followBtn}>关注</Button>
                                </div> 
                            : null}
                            {saleVisible ? 
                                <div className={styles.saleReview}>
                                   {saleImg ? <img className={styles.saleImg} src={`http://res.hualala.com/${saleImg}`}></img> : null}
                                </div>
                            : null}
                            {jingdongVisible ? 
                                <div className={styles.saleReview}>
                                   <img className={styles.saleImg} src={jingdong}></img>
                                </div>
                            : null}
                            {selfImagePath1Visible ? 
                                <div className={styles.saleReview}>
                                    {selfImagePath1Img ? <img className={styles.saleImg} src={`http://res.hualala.com/${selfImagePath1Img}`}></img> : null}
                                </div> : null
                            }
                            {selfImagePath2Visible ? 
                                <div className={styles.saleReview}>
                                    {selfImagePath2Img ? <img className={styles.saleImg} src={`http://res.hualala.com/${selfImagePath2Img}`}></img> : null}
                                </div> : null
                            }
                            {selfImagePath3Visible ? 
                                <div className={styles.saleReview}>
                                    {selfImagePath3Img ? <img className={styles.saleImg} src={`http://res.hualala.com/${selfImagePath3Img}`}></img> : null}
                                </div> : null
                            }
                        </div>
                        </div>
                    </div>
                </div>
                <div className={styles.speForm}>
                    <span className={styles.errorSpan}>{errorVisible ? '至少选择一项' : ''}</span>
                    <BaseForm
                        getForm={form => this.queryForm = form}
                        formItems={this.state.formItems}
                        formData={this.state.formData}
                        formKeys={this.state.formKeys}
                        onChange={(key, value) => this.handleFormChange(key, value, this.queryForm)}
                    />
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        specialPromotion: state.sale_specialPromotion_NEW.toJS(),
        user: state.user.toJS(),
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        mySpecialActivities: state.sale_mySpecialActivities_NEW,
        levelPrize: state.sale_mySpecialActivities_NEW.getIn(['giftsLevel']),
        disabled: state.sale_specialPromotion_NEW.getIn(['$eventInfo', 'userCount']) > 0,
        allWeChatAccountList: state.sale_giftInfoNew.get('mpList'),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSpecialBasicInfo: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
        addSpecialPromotion: (opts) => {
            dispatch(addSpecialPromotion(opts));
        },
        updateSpecialPromotion: (opts) => {
            dispatch(updateSpecialPromotion(opts));
        },
        saleCenterLotteryLevelPrizeData: (opts) => {
            dispatch(saleCenterLotteryLevelPrizeData(opts));
        },
        fetchGiftListInfoAC: (opts) => {
            dispatch(fetchGiftListInfoAC(opts));
        },
        setSpecialGiftInfo: (opts) => {
            dispatch(saleCenterSetSpecialGiftInfoAC(opts));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(StepThree);