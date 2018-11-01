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
import { Input, Form, Select, Icon, Button } from 'antd';
import { connect } from 'react-redux'
import styles from '../../SaleCenterNEW/ActivityPage.less';
import '../../../components/common/ColorPicker.less';
// import { WrappedAdvancedTimeSetting } from '../../SaleCenterNEW/common/AdvancedTimeSetting';
import PriceInput from '../../../containers/SaleCenterNEW/common/PriceInput';
import {
    saleCenterSetSpecialBasicInfoAC,
    saleCenterGetExcludeCardLevelIds,
    saleCenterQueryFsmGroupSettleUnit,
} from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import { SEND_MSG } from '../../../redux/actions/saleCenterNEW/types'
import {queryWechatMpInfo} from "../../GiftNew/_action";

const FormItem = Form.Item;
const Option = Select.Option;

class PromotionBasicInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            advanceDaysFlag: true,
            advanceDays: null,
            description: null,
            sendMsg: '1',
            name: '',
            tipDisplay: 'none',
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAdvanceDaysChange = this.handleAdvanceDaysChange.bind(this);
        this.handleSendMsgChange = this.handleSendMsgChange.bind(this);
        this.handleMpIDChange = this.handleMpIDChange.bind(this);
        this.renderPromotionType = this.renderPromotionType.bind(this);
        this.renderMoreInfo = this.renderMoreInfo.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
    }

    componentDidMount() {
        this.props.getSubmitFn({
            prev: undefined,
            next: this.handleSubmit,
            finish: undefined,
            cancel: undefined,
        });
        this.props.queryWechatMpInfo();
        const specialPromotion = this.props.specialPromotion.get('$eventInfo').toJS();
        let mpID;
        try {
            mpID = JSON.parse(specialPromotion.pushMessageMpID).mpID
        } catch (e) {
            mpID = undefined
        }
        this.setState({
            advanceDays: specialPromotion.giftAdvanceDays,
            description: specialPromotion.eventRemark,
            mpID,
            sendMsg: `${specialPromotion.smsGate || this.state.smsGate || '0'}`,
            name: specialPromotion.eventName,
        });
        // 生日赠送查询排除卡类
        // if (this.props.type === '51') {
        const opts = {
            groupID: this.props.user.accountInfo.groupID,
            eventWay: this.props.type,
        };
        if (Object.keys(specialPromotion).length < 30) {
            // 新建时查询排除卡类
            this.props.saleCenterGetExcludeCardLevelIds(opts)
        }
        // }
        this.props.saleCenterQueryFsmGroupSettleUnit({ groupID: this.props.user.accountInfo.groupID });
    }


    componentWillReceiveProps(nextProps) {
        // 是否更新
        if (this.props.specialPromotion.get('$eventInfo') !== nextProps.specialPromotion.get('$eventInfo')) {
            const specialPromotion = nextProps.specialPromotion.get('$eventInfo').toJS();
            let mpID;
            try {
                mpID = JSON.parse(specialPromotion.pushMessageMpID).mpID
            } catch (e) {
                mpID = undefined
            }
            this.setState({
                advanceDays: specialPromotion.giftAdvanceDays,
                description: specialPromotion.eventRemark,
                mpID,
                sendMsg: `${specialPromotion.smsGate || this.state.smsGate || '0'}`,
                name: specialPromotion.eventName,
            })
        }
    }

    handleSubmit() {
        let nextFlag = true;
        const appID = (this.props.allWeChatAccountList.find(item => item.mpID === this.state.mpID) || {}).appID;
        this.props.form.validateFieldsAndScroll((err1) => {
            if (this.props.type === '51') {
                if (err1) {
                    nextFlag = false;
                }
                if (this.state.advanceDays == null || this.state.advanceDays === '') {
                    nextFlag = false;
                    this.setState({ advanceDaysFlag: false });
                }

                // save state to redux

                if (nextFlag) {
                    this.props.setSpecialBasicInfo({
                        giftAdvanceDays: this.state.advanceDays,
                        eventRemark: this.state.description,
                        smsGate: this.state.sendMsg,
                        pushMessageMpID: this.state.sendMsg >= 2 ? JSON.stringify({mpID: this.state.mpID, appID}) : '',
                        eventName: this.state.name,
                    })
                }
            } else {
                if (err1) {
                    nextFlag = false;
                }
                if (nextFlag) {
                    this.props.setSpecialBasicInfo({
                        eventRemark: this.state.description,
                        smsGate: this.state.sendMsg,
                        pushMessageMpID: this.state.sendMsg >= 2 ? JSON.stringify({mpID: this.state.mpID, appID}) : '',
                        eventName: this.state.name,
                    })
                }
            }
        });
        return nextFlag;
    }

    handleMpIDChange(v) {
        this.setState({
            mpID: v,
        });
    }

    handleDescriptionChange(e) {
        this.setState({
            description: e.target.value,
        });
    }
    handleAdvanceDaysChange(value) {
        let advanceDaysFlag = true;
        if (value.number == null || value.number === '') {
            advanceDaysFlag = false;
        }
        this.setState({
            advanceDays: value.number,
            advanceDaysFlag,
        });
    }
    handleSendMsgChange(value) {
        this.setState({
            sendMsg: value,
        });
    }

    handleNameChange(e) {
        this.setState({
            name: e.target.value,
        });
    }

    renderPromotionType() {
        const categorys = this.props.saleCenter.get('characteristicCategories').toJS();
        const type = this.props.type;
        const item = categorys.find(v => v.key === type);
        const lab = type ? categorys.find((cc) => {
            return cc.key === type
        }).title : '';
        const rangeType = this.props.specialPromotion.getIn(['$eventInfo', 'cardLevelRangeType']);
        // console.log('cardLevelRangeType', this.props.specialPromotion.getIn(['$eventInfo', 'cardLevelRangeType']));
        const tip = (
            <div style={{ display: this.state.tipDisplay, height: 135, width: 470 }} className={styles.tip}>
                <p>{type ?  item ? item.tip : '' : ''}</p>
                <div>
                    <div className={styles.tipBtn}>
                        <Button
                            type="ghost"
                            style={{ color: '#787878' }}
                            onClick={() => {
                                this.setState({ tipDisplay: 'none' });
                            }}
                        >我知道了
                        </Button>
                    </div>
                </div>
            </div>
        );
        return (
            <FormItem
                label={'活动类型'}
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >
                <p>{lab}</p>
                {
                    item && item.tip && (rangeType !== undefined && rangeType != '5') ?
                        <Icon
                            type="question-circle-o"
                            className={styles.question}
                            style={{ marginLeft: 6 }}
                            onMouseOver={() => {
                                this.setState({ tipDisplay: 'block' })
                            }}
                        /> : null
                }
                {tip}
            </FormItem>
        )
    }
    renderMoreInfo() {
        switch (this.props.type) {
            case '51':
                return (
                    <div>
                        <FormItem
                            label="提前赠送天数"
                            className={[styles.FormItemStyle, styles.priceInputSingle].join(' ')}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 17 }}
                            required={true}
                            validateStatus={this.state.advanceDaysFlag ? 'success' : 'error'}
                            help={this.state.advanceDaysFlag ? null : '请输入提前赠送天数'}
                        >

                            <PriceInput
                                addonBefore={''}
                                addonAfter={'天'}
                                placeholder={'请输入提前赠送天数'}
                                value={{ number: this.state.advanceDays }}
                                defaultValue={{ number: this.state.advanceDays }}
                                onChange={this.handleAdvanceDaysChange}
                                modal="int"
                            />

                        </FormItem>
                    </div>
                );
            default:
                return null;
        }
    }
    render() {
        // TODO:编码不能重复
        const { getFieldDecorator } = this.props.form;

        return (
            <Form>

                {this.renderPromotionType()}
                <FormItem
                    label="活动名称"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {getFieldDecorator('promotionName', {
                        rules: [{
                            whitespace: true,
                            required: true,
                            message: '汉字、字母、数字组成，不多于50个字符',
                            pattern: /^[\u4E00-\u9FA5A-Za-z0-9\.\（\）\(\)\-\-]{1,50}$/,
                        }],
                        initialValue: this.state.name,
                    })(
                        <Input placeholder="请输入活动名称" onChange={this.handleNameChange} />
                        )}
                </FormItem>
                {this.renderMoreInfo()}

                <FormItem
                    label="是否发送消息"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <Select size="default"
                            value={this.state.sendMsg}
                            onChange={this.handleSendMsgChange}
                            getPopupContainer={(node) => node.parentNode}
                    >
                        {
                            SEND_MSG.map((item) => {
                                return (<Option value={`${item.value}`} key={`${item.value}`}>{item.label}</Option>)
                            })
                        }
                    </Select>
                </FormItem>
                { this.state.sendMsg >= 2
                    ?
                    <FormItem
                        label="微信公众号选择"
                        required
                        className={styles.FormItemStyle}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17 }}
                    >{getFieldDecorator('mpID', {
                        rules: [{
                            required: true,
                            message: '请选择微信推送的公众号',
                        }],
                        initialValue: this.state.mpID,
                        onChange: this.handleMpIDChange
                    })(
                        <Select size="default"
                                placeholder="请选择微信推送的公众号"
                                getPopupContainer={(node) => node.parentNode}
                        >
                            {
                                this.props.allWeChatAccountList.map((item) => {
                                    return (<Option value={`${item.mpID}`} key={`${item.mpID}`}>{item.mpName}</Option>)
                                })
                            }
                        </Select>
                    )}
                    </FormItem> : null
                }
                <FormItem
                    label="活动说明"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {getFieldDecorator('description', {
                        rules: [{
                            required: true,
                            message: '不多于200个字符',
                            pattern: /^.{1,200}$/,
                        }],
                        initialValue: this.state.description,
                    })(
                        <Input type="textarea" placeholder="请输入活动说明" onChange={this.handleDescriptionChange} />
                        )}
                </FormItem>

            </Form>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        promotionBasicInfo: state.sale_promotionBasicInfo_NEW,
        saleCenter: state.sale_saleCenter_NEW,
        user: state.user.toJS(),
        specialPromotion: state.sale_specialPromotion_NEW,
        allWeChatAccountList: state.sale_giftInfoNew.get('mpList').toJS().filter(item => String(item.mpTypeStr) === '21'),
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSpecialBasicInfo: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
        saleCenterGetExcludeCardLevelIds: (opts) => {
            dispatch(saleCenterGetExcludeCardLevelIds(opts));
        },
        saleCenterQueryFsmGroupSettleUnit: (opts) => {
            dispatch(saleCenterQueryFsmGroupSettleUnit(opts));
        },
        queryWechatMpInfo: (opts) => {
            dispatch(queryWechatMpInfo())
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(PromotionBasicInfo));
