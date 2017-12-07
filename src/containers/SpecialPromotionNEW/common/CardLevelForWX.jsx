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
    Radio,
    TreeSelect,
    Icon,
    Tag,
} from 'antd';
import { saleCenterSetSpecialBasicInfoAC, saleCenterGetExcludeCardLevelIds } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import styles from '../../SaleCenterNEW/ActivityPage.less';
import { fetchPromotionScopeInfo } from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action';
import { fetchSpecialCardLevel } from '../../../redux/actions/saleCenterNEW/mySpecialActivities.action';
import ExcludeCardTable from './ExcludeCardTable';
// import _ from 'lodash';
// import { FetchCrmCardTypeLst, FetchSelectedShops } from '../../../redux/actions/crmNew/crmCardType.action';
import { FetchCrmCardTypeLst } from '../../../redux/actions/saleCenterNEW/crmCardType.action';

const FormItem = Form.Item;
// const Option = Select.Option;
const RadioGroup = Radio.Group;
// const SHOW_PARENT = TreeSelect.SHOW_PARENT;
// const Immutable = require('immutable');
if (process.env.__CLIENT__ === true) {
    // require('../../../../client/componentsPage.less');
}

class CardLevelForWX extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cardInfo: [],
            cardLevelIDList: [],
            cardLevelRangeType: '0',
            cardTypeHadQuery: {}, // 存储查询过的{卡类：[店铺s], 卡类：[店铺s]}
        };
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);
        this.renderTags = this.renderTags.bind(this);
    }

    componentDidMount() {
        this.props.FetchCrmCardTypeLst({});
        const thisEventInfo = this.props.specialPromotion.get('$eventInfo').toJS();
        const cardLevelRangeType = thisEventInfo.cardLevelRangeType == '4' ? '0' : thisEventInfo.cardLevelRangeType;
        this.setState({
            cardLevelRangeType: cardLevelRangeType || '0',
            cardLevelIDList: thisEventInfo.cardLevelIDList || [],
        }, () => {
            this.props.onChange({
                cardLevelRangeType: this.state.cardLevelRangeType,
                cardLevelIDList: this.state.cardLevelIDList,
            });
        })
    }

    componentWillReceiveProps(nextProps) {
        const thisEventInfo = this.props.specialPromotion.get('$eventInfo').toJS();
        const nextEventInfo = nextProps.specialPromotion.get('$eventInfo').toJS();
        if (this.props.crmCardTypeNew.get('cardTypeLst') !== nextProps.crmCardTypeNew.get('cardTypeLst')) {
            const cardInfo = nextProps.crmCardTypeNew.get('cardTypeLst').toJS();
            this.setState({
                cardInfo: cardInfo.filter((cardType) => {
                    return cardType.regFromLimit
                }),
            }, () => {
                this.props.form.setFieldsValue({ 'treeSelect': this.state.cardLevelIDList })
            });
        }
        // 每次第一步选择时间变化，就清空已选
        if ((thisEventInfo.eventStartDate !== nextEventInfo.eventStartDate || thisEventInfo.eventEndDate !== nextEventInfo.eventEndDate) &&
            nextEventInfo.eventStartDate && thisEventInfo.eventStartDate) {
            this.handleSelectChange([]);
        }
        // 获得排除卡id集合  &&  禁用全部会员按钮
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
            ((nextEventInfo.excludeEventCardLevelIdModelList && nextEventInfo.excludeEventCardLevelIdModelList.length > 0)
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
    handleSelectChange(value) {
        // const { cardTypeHadQuery = {} } = this.state;
        // if (!Object.keys(cardTypeHadQuery).includes(value[value.length - 1]) && value[value.length - 1]) { // 判断是否已被查询过
        //     this.props.FetchSelectedShopsAC({
        //         cardTypeID: value[value.length - 1],
        //     })
        //         .then((record) => {
        //             console.log(record);
        //             this.setState({
        //                 cardTypeHadQuery: {
        //                     ...cardTypeHadQuery, // ...{id:[shopName,shopName], id:[shopName,shopName], id:[shopName,shopName]}
        //                     [value[value.length - 1]]: record, // id:[shopName,shopName]
        //                 },
        //             })
        //         })
        // }
        this.setState({
            cardLevelIDList: value,
        }, () => {
            this.props.form.setFieldsValue({ 'treeSelect': value });
        })
        this.props.onChange && this.props.onChange({ cardLevelIDList: value });
    }
    handleRadioChange(e) {
        const opts = {
            cardLevelRangeType: e.target.value,
            cardLevelIDList: [],
        };
        this.setState(opts)
        this.props.onChange && this.props.onChange(opts)
    }
    renderTags() {
        const { cardLevelIDList = [], cardTypeHadQuery = {} } = this.state;
        const tags = cardLevelIDList.map((cardTypeId) => { // 已选卡类ids
            return (cardTypeHadQuery[cardTypeId] || []).map((shop) => {
                return <Tag key={shop} > {shop} </Tag>
            })
        });
        return tags;
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { cardInfo = [], getExcludeCardLevelIds = [] } = this.state;
        const treeData = [];
        const eventInfo = this.props.specialPromotion.get('$eventInfo').toJS();
        const excludeEvent = eventInfo.excludeEventCardLevelIdModelList || [];
        if (!this.props.specialPromotion.get('$eventInfo').toJS().allCardLevelCheck) {
            cardInfo.forEach((cardType) => {
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
        return (
            <Form className={styles.cardLevelTree}>
                <FormItem label="会员范围" className={styles.FormItemStyle} labelCol={{ span: 4 }} wrapperCol={{ span: 17 }}>
                    <RadioGroup onChange={this.handleRadioChange} value={`${this.state.cardLevelRangeType}`}>
                        <Radio key={'0'} value={'0'} disabled={this.state.allCheckDisabel}>全部微信卡类别</Radio>
                        <Radio key={'2'} value={'2'}>{'选择微信卡类别'}</Radio>
                    </RadioGroup>
                </FormItem>
                {
                    this.state.cardLevelRangeType == '2' ?
                        <FormItem
                            label={'适用卡类别'}
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
                                        placeholder={'请选择适用卡类别'}
                                        allowClear={true}
                                        multiple={true}
                                        treeData={treeData}
                                        onChange={this.handleSelectChange}
                                    />
                                )
                            }
                            {
                                !eventInfo.allCardLevelCheck && excludeEvent.length == 0 ? null :
                                <Icon
                                        type="exclamation-circle"
                                        className={styles.cardLevelTreeIcon}
                                        onClick={() => {
                                            this.setState({ tableDisplay: !this.state.tableDisplay })
                                        }}
                                    />
                            }
                        </FormItem> : null
                }
                {
                    !eventInfo.allCardLevelCheck && excludeEvent.length === 0 ? null :
                    <div
                            style={{ display: this.state.tableDisplay ? 'block' : 'none', width: '71%', marginLeft: '110px' }}
                        >
                            <ExcludeCardTable catOrCard={'cat'} />
                        </div>
                }
                {/* {
                    this.state.cardLevelIDList.length > 0 ?
                        <FormItem
                            label={'卡类适用店铺'}
                            className={[styles.FormItemStyle, styles.cardLevelTree].join(' ')}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 17 }}
                        >
                            <div
                                style={{ padding: 10, border: '1px solid #e2dcdc', minHeight: 33, borderRadius: 3 }}
                            >
                                {this.renderTags()}
                            </div>
                        </FormItem> : null
                } */}
            </Form>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        specialPromotion: state.sale_specialPromotion_NEW,
        user: state.user.toJS(),
        mySpecialActivities: state.sale_mySpecialActivities_NEW.toJS(),
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        crmCardTypeNew: state.sale_crmCardTypeNew,
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
        FetchCrmCardTypeLst: (opts) => {
            dispatch(FetchCrmCardTypeLst(opts));
        },
        // FetchSelectedShopsAC: (opts) => {
        //     return dispatch(FetchSelectedShops(opts));
        // },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CardLevelForWX);
