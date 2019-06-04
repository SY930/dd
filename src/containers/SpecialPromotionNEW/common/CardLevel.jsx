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
import { connect } from 'react-redux';
import {
    Form,
    Select,
    Radio,
    TreeSelect,
    Icon,
    Col,
} from 'antd';
import { saleCenterSetSpecialBasicInfoAC, saleCenterGetExcludeCardLevelIds } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import styles from '../../SaleCenterNEW/ActivityPage.less';
import { fetchPromotionScopeInfo } from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action';
import { fetchSpecialCardLevel } from '../../../redux/actions/saleCenterNEW/mySpecialActivities.action';
import ExcludeCardTable from './ExcludeCardTable';
// import _ from 'lodash';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const Immutable = require('immutable');

if (process.env.__CLIENT__ === true) {
    // require('../../../../client/componentsPage.less');
}

class CardLevel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cardInfo: [],
            cardLevelIDList: [],
            getExcludeCardLevelIds: [],
            getExcludeCardLevelIdsStatus: false,
            tableDisplay: false,
            cardLevelRangeType: '0',
            allCheckDisabel: false,
            defaultCardType: '',
        };
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);
    }

    componentDidMount() {
        const user = this.props.user;
        const opts = {
            _groupID: user.accountInfo.groupID,
            _role: user.accountInfo.roleType,
            _loginName: user.accountInfo.loginName,
            _groupLoginName: user.accountInfo.groupLoginName,
        };
        this.props.fetchSpecialCardLevel({
            data: opts,
        });
        const cardLevelRangeType = this.props.cardLevelRangeType;
        const thisEventInfo = this.props.specialPromotion.get('$eventInfo').toJS();

        // 渲染&&通知父组件数据
        if (Object.keys(thisEventInfo).length > 30 && thisEventInfo.cardLevelID && thisEventInfo.cardLevelID != '0') {
            // console.log('旧版本局部会员');
            // ID是一长串字符串，说明是旧版本局部会员，因其cardLevelRangeType默认返回0，前端会渲染为全部会员，
            // 所以要更改为cardLevelRangeType为2（局部范围），并且按照新版把cardLevelIDList数组加入原来局部的cardLevelID
            let cardLevelRangeType = '2',
                cardLevelID = '0',
                cardLevelIDList = thisEventInfo.cardLevelID ? [thisEventInfo.cardLevelID] : [];
            this.setState({
                cardLevelRangeType,
                cardLevelIDList,
            }, () => {
                this.props.onChange({
                    cardLevelRangeType: this.state.cardLevelRangeType,
                    cardLevelIDList: this.state.cardLevelIDList,
                    cardLevelID: '0',
                })
            })
        } else {
            this.setState({
                cardLevelRangeType: cardLevelRangeType || thisEventInfo.cardLevelRangeType || '0',
                cardLevelIDList: thisEventInfo.cardLevelIDList || [],
                defaultCardType: thisEventInfo.defaultCardType || '',
            }, () => {
                this.props.onChange({
                    cardLevelRangeType: this.state.cardLevelRangeType,
                    cardLevelIDList: this.state.cardLevelIDList,
                    defaultCardType: this.state.defaultCardType,
                })
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        const thisEventInfo = this.props.specialPromotion.get('$eventInfo').toJS();
        const nextEventInfo = nextProps.specialPromotion.get('$eventInfo').toJS();
        // 获取会员等级信息
        if (nextProps.groupCardTypeList) {
            this.setState({
                cardInfo: nextProps.groupCardTypeList.toJS(),
            })
        }
        // 【升级，累计】：每次第一步选择时间变化，就清空已选
        if (this.props.type === '61' || this.props.type === '62') {
            if ((thisEventInfo.eventStartDate != nextEventInfo.eventStartDate || thisEventInfo.eventEndDate != nextEventInfo.eventEndDate) &&
                nextEventInfo.eventStartDate && thisEventInfo.eventStartDate) {
                this.handleSelectChange([]);
            }
        }
        // 【生日，升级，累计】：获得排除卡id集合  &&  禁用全部会员按钮
        if (this.props.type === '51' || this.props.type === '52' || this.props.type === '61' || this.props.type === '62') {
            // 编辑时，就重新获得排除卡id集合，就执行一次，场景：不改变日期，第一步日期控件不触发接口，但要获取排除，还不能排除自己
            if (nextEventInfo.itemID && !this.state.getExcludeCardLevelIdsStatus) {
                const opts2 = {
                    groupID: nextProps.user.accountInfo.groupID,
                    eventWay: this.props.type,
                    eventStartDate: nextEventInfo.eventStartDate,
                    eventEndDate: nextEventInfo.eventEndDate,
                    itemID: nextEventInfo.itemID,
                };
                this.setState({
                    getExcludeCardLevelIdsStatus: true,
                }, () => {
                    this.props.saleCenterGetExcludeCardLevelIds(opts2);
                })
            }

            const arr = [];
            const excludeEvent = nextEventInfo.excludeEventCardLevelIdModelList || [];
            // 遍历所有排除卡
            if (this.props.specialPromotion.get('$eventInfo').toJS().allCardLevelCheck) {
                // true全部占用
                this.setState({ getExcludeCardLevelIds: this.state.cardInfo })
            } else {
                // false 无/局部 占用
                excludeEvent.map((event) => {
                    event.cardLevelIDList && event.cardLevelIDList.map((card) => {
                        arr.push(card)
                    })
                })
                this.setState({ getExcludeCardLevelIds: arr })
            }
            const fun = () => {
                this.setState({ cardLevelRangeType: '2', allCheckDisabel: true }, () => {
                    this.props.onChange({ cardLevelRangeType: '2' })
                })
            }
            // 禁用全部会员按钮
            if (Object.keys(nextEventInfo).length < 30 &&
                (nextEventInfo.excludeEventCardLevelIdModelList && nextEventInfo.excludeEventCardLevelIdModelList.length > 0
                    || nextEventInfo.allCardLevelCheck)) {
                // 新建&&局部被使用||全部被使用
                fun();
            } else if (Object.keys(nextEventInfo).length > 30 && nextEventInfo.allCardLevelCheck) {
                // 编辑&&true全部被使用
                fun();
            } else if (Object.keys(nextEventInfo).length > 30 && !nextEventInfo.allCardLevelCheck
                && nextEventInfo.excludeEventCardLevelIdModelList && nextEventInfo.excludeEventCardLevelIdModelList.length > 0) {
                // 编辑&&false&&局部被使用
                fun();
            } else {
                this.setState({ allCheckDisabel: false })
            }
        }
    }
    handleSelectChange(value) {
        let { cardInfo = [], defaultCardType = '' } = this.state;
        const DefaultCardTypes = cardInfo.filter((cat) => {
            // 若当前卡类的cardTypeLevelList的ids和用户已选的cardLevelIDList有交集，就返回该新用户注册卡类
            const thisCatIds = cat.cardTypeLevelList.map(card => card.cardLevelID);
            return _.intersection(thisCatIds, value).length > 0
        });
        const DefaultCardTypesIDs = DefaultCardTypes.map(cate => cate.cardTypeID); // 当前可选新用户注册卡类
        defaultCardType = DefaultCardTypesIDs.includes(defaultCardType) ? defaultCardType : ''; // 当前可选新用户注册卡类包含已选注册卡类吗？

        // 点击适用卡等级，对点击卡类不作出反应
        const _value = value.filter(val => val.indexOf('CAT_') == -1)
        this.setState({
            cardLevelIDList: _value,
            defaultCardType,
        }, () => {
            this.props.form.setFieldsValue({ 'treeSelect': _value });
        })
        this.props.onChange && this.props.onChange({ cardLevelIDList: _value, defaultCardType })
        this.props.onHandleSelect && this.props.onHandleSelect({ cardLevelIDList: _value, defaultCardType })
    }
    handleRadioChange(e) {
        const opts = {
            cardLevelRangeType: e.target.value,
            cardLevelIDList: [],
            defaultCardType: '',
        };
        this.setState(opts)
        this.props.onChange && this.props.onChange(opts)
    }
    handleDefaultCardTypeChange = (value) => {
        this.setState({ defaultCardType: value })
        this.props.onChange && this.props.onChange({ defaultCardType: value })
    }
    renderDefaultCardType = () => {
        const { cardInfo = [], cardLevelIDList = [], cardLevelRangeType, defaultCardType = '' } = this.state;
        const DefaultCardTypes = cardLevelRangeType == 0 ? cardInfo : cardInfo.filter((cat) => {
            // 若当前卡类的cardTypeLevelList的ids和用户已选的cardLevelIDList有交集，就返回该新用户注册卡类
            const thisCatIds = cat.cardTypeLevelList.map(card => card.cardLevelID);
            return _.intersection(thisCatIds, cardLevelIDList).length > 0
        });

        return (
            <FormItem
                style={{ marginLeft: -13 }}
                validateStatus={defaultCardType ? 'success' : 'error'}
                help={defaultCardType ? null : '不可为空'}
                label="新用户注册成为会员的卡类选择"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 14 }}
            >
                <Select
                    showSearch={true}
                    onChange={this.handleDefaultCardTypeChange}
                    value={defaultCardType}
                    getPopupContainer={(node) => node.parentNode}
                >
                    {
                        DefaultCardTypes.map(cate => <Option key={cate.cardTypeID} value={cate.cardTypeID}>{cate.cardTypeName}</Option>)
                    }
                </Select>
            </FormItem>
        )
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        // const { cardInfo = [], getExcludeCardLevelIds = [] } = this.state;
        const { cardInfo = [] } = this.state;
        let getExcludeCardLevelIds = []
        if(this.props.type == '52') {
          getExcludeCardLevelIds = this.props.getExcludeCardLevelIds
        }else {
          getExcludeCardLevelIds = this.state.getExcludeCardLevelIds
        }
        const treeData = [];
        const eventInfo = this.props.specialPromotion.get('$eventInfo').toJS();
        const excludeEvent = eventInfo.excludeEventCardLevelIdModelList || [];
        if (this.props.catOrCard == 'card') {
            // 按卡等级，把类别标识以便排除onchange事件
            cardInfo.map((cardType, index) => {
                const children = [];
                let excludeCount = 0;
                const cardCount = cardType.cardTypeLevelList.length;
                cardType.cardTypeLevelList.map((card, i) => {
                    // 若互斥卡等级数组不包含该等级 && !(是升级送礼 && 是默认卡等级)，就加到children渲染
                    if (!getExcludeCardLevelIds.includes(card.cardLevelID) && !(this.props.type == '61' && card.isDefaultLevel)) {
                        children.push({
                            label: `${cardType.cardTypeName}-${card.cardLevelName}`,
                            value: card.cardLevelID,
                            key: card.cardLevelID,
                        });
                    } else {
                        excludeCount++;
                    }
                });
                // 如果该分类下互斥的卡等级数量不等于所有卡等级数量，就渲染该分类名称，并以CAT_开头标识，以便onChange时，使分类不被勾选
                if (excludeCount != cardCount) {
                    treeData.push({
                        label: cardType.cardTypeName,
                        value: `CAT_${cardType.cardTypeID}`,
                        key: `CAT_${cardType.cardTypeID}`,
                        children,
                    })
                }
            })
        } else if (!this.props.specialPromotion.get('$eventInfo').toJS().allCardLevelCheck) {
            // 按卡类别，把卡等级排除
            cardInfo.map((cardType, index) => {
                // 去掉互斥卡类别等级
                if (!getExcludeCardLevelIds.includes(cardType.cardTypeID)) {
                    treeData.push({
                        label: cardType.cardTypeName,
                        value: cardType.cardTypeID,
                        key: cardType.cardTypeID,
                    });
                }
            })
        }
        const columns = [{
            title: '活动名称',
            dataIndex: 'eventName',
            key: 'eventName',
            className: 'TableTxtCenter',
        }, {
            title: this.props.catOrCard == 'card' ? '占用卡等级信息' : '占用卡类信息',
            dataIndex: 'idNames',
            key: 'idNames',
            className: 'TableTxtCenter',
            render: (text, record, index) => {
                return record.idNames.map((idName, i) => {
                    return (
                        <div key={`idName${i}`}><h5 className={styles.cardName} key={`cardName${i}`}>{idName}</h5></div>
                    )
                })
            },
        },
        ];
        return (
            <Form className={styles.cardLevelTree}>
                {
                    this.props.type != '61' ?
                        <FormItem label={this.props.label || '会员范围'} className={styles.FormItemStyle} labelCol={{ span: 4 }} wrapperCol={{ span: 17 }}>
                            <RadioGroup onChange={this.handleRadioChange} value={`${this.state.cardLevelRangeType}`}>
                                <Radio key={'0'} value={'0'} disabled={this.state.allCheckDisabel}>{this.props.cusAllLabel || '全部会员'}</Radio>
                                <Radio key={'2'} value={'2'}>{this.props.catOrCard == 'card' ? '会员等级' : (this.props.cusPartialLabel || '会员卡类')}</Radio>
                            </RadioGroup>
                        </FormItem> : null
                }
                {
                    this.props.type == '61' || this.state.cardLevelRangeType == '2' ?
                        <FormItem
                            label={this.props.type == '61' ? '升级后的等级为' : (this.props.catOrCard == 'card' ? '适用卡等级' : (this.props.cusSelectorLabel || '适用卡类'))}
                            className={[styles.FormItemStyle, styles.cardLevelTree].join(' ')}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 17 }}
                        >
                            {
                                getFieldDecorator('treeSelect', {
                                    rules: [{
                                        type: 'array',
                                        required: true,
                                        message: '不得为空，请至少选择一种!',
                                    }],
                                    initialValue: this.state.cardLevelIDList,
                                })(
                                    <TreeSelect
                                        style={{ width: '100%' }}
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                        placeholder={`请选择${this.props.catOrCard == 'card' ? '会员等级' : '会员卡类'}`}
                                        allowClear={true}
                                        multiple={true}
                                        treeData={treeData}
                                        getPopupContainer={(node) => node.parentNode}
                                        onChange={this.handleSelectChange}
                                    />
                                )
                            }
                            {
                                !eventInfo.allCardLevelCheck && excludeEvent.length == 0 ? null :

                                    <Icon
                                        type="exclamation-circle" className={styles.cardLevelTreeIcon}
                                        onClick={() => {
                                            this.setState({ tableDisplay: !this.state.tableDisplay })
                                        }}
                                    />
                            }
                        </FormItem> : null
                }
                {
                    !eventInfo.allCardLevelCheck && excludeEvent.length == 0 ? null :
                        <div style={{ display: this.state.tableDisplay ? 'block' : 'none', width: '71%', marginLeft: '110px' }}>
                            <ExcludeCardTable catOrCard={this.props.catOrCard} />
                        </div>
                }
                {
                    this.props.type === '20' || this.props.type === '21' || this.props.type === '22' || this.props.type === '30' ?
                        this.renderDefaultCardType() : null
                }
            </Form>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        specialPromotion: state.sale_specialPromotion_NEW,
        user: state.user.toJS(),
        groupCardTypeList: state.sale_mySpecialActivities_NEW.getIn(['$specialDetailInfo', 'data', 'cardInfo', 'data', 'groupCardTypeList']),
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,

    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSpecialBasicInfo: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
        fetchSpecialCardLevel: (opts) => {
            dispatch(fetchSpecialCardLevel(opts));
        },
        fetchPromotionScopeInfo: (opts) => {
            dispatch(fetchPromotionScopeInfo(opts));
        },
        saleCenterGetExcludeCardLevelIds: (opts) => {
            dispatch(saleCenterGetExcludeCardLevelIds(opts));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CardLevel);
