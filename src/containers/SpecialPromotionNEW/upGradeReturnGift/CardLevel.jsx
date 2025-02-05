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
import Immutable from 'immutable';
import BaseHualalaModal from "../../SaleCenterNEW/common/BaseHualalaModal";
import ExcludeCardTable from '../common/ExcludeCardTable';
import { injectIntl } from 'i18n/common/injectDecorator'
import { STRING_SPE } from 'i18n/common/special';
// import _ from 'lodash';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const DEFAULT_CARD_TYPE_SELECTOR_PROMOTIONS = [
    '20',
    '21',
    '22',
    '30',
];



@injectIntl
class CardLevel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cardInfo: [],
            cardLevelIDList: [],
            getExcludeCardLevelIds: [], // 不同的活动，可能是卡类，可能是卡等级
            getExcludeCardLevelIdsStatus: false,
            tableDisplay: false,
            cardLevelRangeType: '0',
            allCheckDisabel: false,
            defaultCardType: '',
            excludeEventList: Immutable.List.isList(props.excludeEventList) ? props.excludeEventList.toJS() : props.excludeEventList || [],
        };
        this.handleSelectChange = this.handleSelectChange.bind(this);
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
        if (this.state.cardLevelRangeType != nextProps.cardLevelRangeType){
            this.setState({cardLevelRangeType: nextProps.cardLevelRangeType, cardLevelIDList: []})
        }
        if (this.state.cardLevelIDList != nextProps.cardLevelIDList){
            this.setState({cardLevelIDList: nextProps.cardLevelIDList})
        }
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
                this.setState({ allCheckDisabel: true }, () => {
                    this.props.onChange({ cardLevelRangeType: this.state.cardLevelRangeType })
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
                validateStatus={defaultCardType ? 'success' : 'error'}
                help={defaultCardType ? null : `${this.props.intl.formatMessage(STRING_SPE.d5g3303e750262)}`}
                label={this.props.intl.formatMessage(STRING_SPE.dd5a3f52gg51143)}
                required
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >
                <Select
                    showSearch={true}
                    notFoundContent={`${this.props.intl.formatMessage(STRING_SPE.d2c8a4hdjl248)}`}
                    optionFilterProp="children"
                    onChange={this.handleDefaultCardTypeChange}
                    value={defaultCardType || undefined}
                    placeholder={this.props.intl.formatMessage(STRING_SPE.d1700a2d61fb3202)}
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
        const { cardInfo = [], cardTypeLevelList = [], excludeEventList = [] } = this.state;
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
                            label: card.cardLevelName,
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
            cardInfo.map((cardType, index) => {
                // 在生日赠送活动中（51）getExcludeCardLevelIds 既有卡类ID又有卡等级ID
                if (!getExcludeCardLevelIds.includes(cardType.cardTypeID) &&
                    cardType.cardTypeLevelList.map(({cardLevelID}) => cardLevelID)
                    .every(id => !getExcludeCardLevelIds.includes(id))
                ) {
                    treeData.push({
                        label: cardType.cardTypeName,
                        value: cardType.cardTypeID,
                        key: cardType.cardTypeID,
                    });
                }
            })
        }
        // 
        const boxData = [];
        this.state.cardLevelIDList.forEach((id) => {
            cardInfo.forEach((cat) => {
                cat.cardTypeLevelList.forEach((level) => {
                    if (level.cardLevelID === id) {
                        boxData.push(level)
                    }
                })
            })
        });
        const excludeCardTypeAndLevelIDList = excludeEventList.reduce((acc, curr) => {
            return acc.concat(curr.cardLevelIDList)
        }, []);
        // 先对卡类做一次过滤
        let filteredCardInfo = cardInfo.filter(cardType => {
            return !excludeCardTypeAndLevelIDList.includes(cardType.cardTypeID)
        })
        filteredCardInfo = filteredCardInfo.filter(cardType => {
            cardType.cardTypeLevelList = cardType.cardTypeLevelList.filter(cardLevel => {
                return !excludeCardTypeAndLevelIDList.includes(cardLevel.cardLevelID)
            })
            return !!(cardType.cardTypeLevelList || []).length;
        })
        return (
            <Form className={styles.cardLevelTree}>
                {
                    <FormItem
                        label={this.props.type == '61' ? `${this.props.intl.formatMessage(STRING_SPE.d2b1b89d4996543)}` : (this.props.catOrCard == 'card' ? `${this.props.intl.formatMessage(STRING_SPE.d5g31n12fm1627)}` : (this.props.cusSelectorLabel || `${this.props.intl.formatMessage(STRING_SPE.d170093144c212281)}`))}
                        className={[styles.FormItemStyle, styles.cardLevelTree].join(' ')}
                        labelCol={{ span: 4 }}
                        required={eventInfo.allCardLevelCheck || excludeEvent.length > 0}
                        wrapperCol={{ span: 17 }}
                    >
                        {
                            this.state.cardLevelRangeType == '2' ?
                            <TreeSelect
                                style={{ width: '100%' }}
                                dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
                                placeholder={`${this.props.intl.formatMessage(STRING_SPE.d34id95hnj7281)}${this.props.catOrCard == 'card' ? `${this.props.intl.formatMessage(STRING_SPE.d34id95hnj8241)}` : `${this.props.intl.formatMessage(STRING_SPE.d170093144c11061)}`}`}
                                allowClear={true}
                                multiple={true}
                                showSearch
                                value={this.state.cardLevelIDList}
                                treeNodeFilterProp="label"
                                treeData={treeData}
                                getPopupContainer={(node) => node.parentNode}
                                onChange={this.handleSelectChange}
                            /> : 
                            (<BaseHualalaModal
                                outLabel={`${this.props.intl.formatMessage(STRING_SPE.du380iqhn0125)}`} //   外侧选项+号下方文案
                                outItemName="cardLevelName" //   外侧已选条目选项的label
                                outItemID="cardLevelID" //   外侧已选条目选项的value
                                innerleftTitle={`${this.props.intl.formatMessage(STRING_SPE.du380iqhn1240)}`} //   内部左侧分类title
                                innerleftLabelKey={'cardTypeName'}//   内部左侧分类对象的哪个属性为分类label
                                leftToRightKey={'cardTypeLevelList'} // 点击左侧分类，的何种属性展开到右侧
                                innerRightLabel="cardLevelName" //   内部右侧checkbox选项的label
                                innerRightValue="cardLevelID" //   内部右侧checkbox选项的value
                                innerBottomTitle={`${this.props.intl.formatMessage(STRING_SPE.dd5a318e4162103)}`} //   内部底部box的title
                                innerBottomItemName="cardLevelName" //   内部底部已选条目选项的label
                                itemNameJoinCatName={'cardTypeName'} // item条目展示名称拼接类别名称
                                treeData={filteredCardInfo} // 树形全部数据源【{}，{}，{}】
                                data={boxData} // 已选条目数组【{}，{}，{}】】,编辑时向组件内传递值
                                onChange={(value) => {
                                    // 组件内部已选条目数组【{}，{}，{}】,向外传递值
                                    const _value = value.map(level => level.cardLevelID)
                                    this.handleSelectChange(_value)
                                }}
                            />)
                        }
                        {
                            !eventInfo.allCardLevelCheck && excludeEvent.length == 0 ? null :
                                <Icon
                                    type="exclamation-circle" className={styles.cardLevelTreeIcon}
                                    style={{marginTop: this.state.cardLevelRangeType == '2'?0:'22px'}}
                                    onClick={() => {
                                        this.setState({ tableDisplay: !this.state.tableDisplay })
                                    }}
                                />
                        }
                    </FormItem> 
                }
                {
                    !eventInfo.allCardLevelCheck && excludeEvent.length == 0 ? null :
                        <div style={{ display: this.state.tableDisplay ? 'block' : 'none', width: '71%', marginLeft: '110px' }}>
                            <ExcludeCardTable catOrCard={this.props.catOrCard} />
                        </div>
                }
                {
                    DEFAULT_CARD_TYPE_SELECTOR_PROMOTIONS.includes(`${this.props.type}`) ?
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
        excludeEventList: state.sale_specialPromotion_NEW.getIn(['$eventInfo', 'excludeEventCardLevelIdModelList']),

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
