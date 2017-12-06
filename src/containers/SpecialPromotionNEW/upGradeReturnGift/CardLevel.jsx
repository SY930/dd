/**
 * @Author: Sen Wang
 * 已废弃，无会员范围按钮
 */

import React from 'react';
import { connect } from 'react-redux';
import {
    Form,
    DatePicker,
    Select,
    Col,
    Radio,
    TreeSelect,
    Table,
    Icon,
} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

import { saleCenterSetSpecialBasicInfoAC, saleCenterGetExcludeCardLevelIds } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import styles from '../../SaleCenterNEW/ActivityPage.less';
import { fetchPromotionScopeInfo } from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action';
import { fetchSpecialCardLevel } from '../../../redux/actions/saleCenterNEW/mySpecialActivities.action'
import _ from 'lodash';

if (process.env.__CLIENT__ === true) {
    // require('../../../../client/componentsPage.less');
}

const Immutable = require('immutable');

class CardLevel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cardInfo: [],
            cardLevelIDList: this.props.value || [],
            getExcludeCardLevelIds: [],
            getExcludeCardLevelIdsStatus: false,
            tableDisplay: false,
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
    }

    componentWillReceiveProps(nextProps) {
        // 获取所有会员等级信息
        if (nextProps.mySpecialActivities.$specialDetailInfo.data.cardInfo.data) {
            if (nextProps.mySpecialActivities.$specialDetailInfo.data.cardInfo &&
                nextProps.mySpecialActivities.$specialDetailInfo.data.cardInfo.data &&
                nextProps.mySpecialActivities.$specialDetailInfo.data.cardInfo.data.groupCardTypeList) {
                this.setState({
                    cardInfo: nextProps.mySpecialActivities.$specialDetailInfo.data.cardInfo.data.groupCardTypeList,
                })
            } else {
                this.setState({
                    cardInfo: [],
                })
            }
        }
        // 获取已选会员等级信息
        if (this.props.changeValue && nextProps.changeValue && this.props.changeValue.length != nextProps.changeValue.length) {
            this.setState({ cardLevelIDList: nextProps.changeValue })
        }

        const thisEventInfo = this.props.specialPromotion.get('$eventInfo').toJS();
        const nextEventInfo = nextProps.specialPromotion.get('$eventInfo').toJS();
        // 编辑时，就重新获得排除卡id集合
        if (nextEventInfo.itemID && !this.state.getExcludeCardLevelIdsStatus) {
            const opts2 = {
                groupID: nextProps.user.accountInfo.groupID,
                eventWay: this.props.type,
                eventStartDate: nextEventInfo.eventStartDate,
                eventEndDate: nextEventInfo.eventEndDate,
                itemID: nextEventInfo.itemID,
            };
            this.setState({ getExcludeCardLevelIdsStatus: true }, () => {
                this.props.saleCenterGetExcludeCardLevelIds(opts2);
            })
        }
        // 每次第一步选择时间变化，就重新获得排除卡id集合
        if ((thisEventInfo.eventStartDate != nextEventInfo.eventStartDate || thisEventInfo.eventEndDate != nextEventInfo.eventEndDate) &&
            nextEventInfo.eventStartDate != '0' && nextEventInfo.eventEndDate != '0') {
            // 新建时，获取所有排除选项
            const opts = {
                groupID: this.props.user.accountInfo.groupID,
                eventWay: this.props.type,
                eventStartDate: nextEventInfo.eventStartDate,
                eventEndDate: nextEventInfo.eventEndDate,
            };
            if (nextProps.specialPromotion.get('$eventInfo').size > 30) {
                // 编辑时，解放自己的选项不被排除
                opts.itemID = nextEventInfo.itemID;
            }
            this.props.saleCenterGetExcludeCardLevelIds(opts);
            // 每次第一步选择时间变化,重置已选，
            this.setState({ cardLevelIDList: [], tableDisplay: false })
            this.props.onChange && this.props.onChange([])
        }
        // 比较前后数组是否一样
        // let diff = _.difference(thisEventInfo.excludeEventCardLevelIdModelList, nextEventInfo.excludeEventCardLevelIdModelList);
        // let _diff = _.difference(nextEventInfo.excludeEventCardLevelIdModelList, thisEventInfo.excludeEventCardLevelIdModelList);
        // if(diff.length >0 || _diff.length >0){
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
        // }
    }
    handleSelectChange(value) {
        console.log(value);
        const _value = value.filter((val) => {
            return val.indexOf('CAT_') == -1;
        })
        this.setState({ cardLevelIDList: _value })
        this.props.onChange && this.props.onChange(_value)
    }
    render() {
        const { cardInfo = [], getExcludeCardLevelIds = [] } = this.state;
        const treeData = [];
        // table数据
        const excludeData = [];
        const excludeEventCardLevelIdModelList = this.props.specialPromotion.get('$eventInfo').toJS().excludeEventCardLevelIdModelList || [];
        if (this.props.catOrCard == 'card') {
            excludeEventCardLevelIdModelList.map((excludeEvent) => {
                if (excludeEvent.allCardLevelCheck) {
                    excludeEvent.idNames = ['全部占用'];
                } else {
                    excludeEvent.idNames = [];
                    excludeEvent.cardLevelIDList.map((cardLevelID) => {
                        cardInfo.map((cardType, index) => {
                            cardType.cardTypeLevelList.map((card, i) => {
                                if (card.cardLevelID == cardLevelID) {
                                    excludeEvent.idNames.push(`${cardType.cardTypeName}类-${card.cardLevelName}`)
                                }
                            });
                        });
                    })
                }
                excludeData.push(excludeEvent);
            });
        } else {
            excludeEventCardLevelIdModelList.map((excludeEvent) => {
                if (excludeEvent.allCardLevelCheck) {
                    excludeEvent.idNames = ['全部占用'];
                } else {
                    excludeEvent.idNames = [];
                    excludeEvent.cardLevelIDList.map((cardLevelID) => {
                        cardInfo.map((cardType, index) => {
                            if (cardType.cardTypeID == cardLevelID) {
                                excludeEvent.idNames.push(cardType.cardTypeName)
                            }
                        });
                    })
                }
                excludeData.push(excludeEvent);
            });
        }

        if (this.props.catOrCard == 'card') {
            // 按卡等级，把类别标识以便排除onchange事件
            cardInfo.map((cardType, index) => {
                const children = [];
                let excludeCount = 0;
                const cardCount = cardType.cardTypeLevelList.length;
                cardType.cardTypeLevelList.map((card, i) => {
                    // 去掉互斥卡等级
                    if (!getExcludeCardLevelIds.includes(card.cardLevelID)) {
                        children.push({
                            label: `${cardType.cardTypeName}-${card.cardLevelName}`,
                            value: card.cardLevelID,
                            key: card.cardLevelID,
                        });
                    } else {
                        excludeCount++;
                    }
                });
                // 如果该分类下所有子卡等级都被排斥，就不渲染该分类
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
        const _placeholder = this.props.type == '61' ? (treeData.length == '0' ? '当前时段内无可选卡等级,请重选时段' : '请选择升级后的卡等级')
            : (treeData.length == '0' ? '当前时段内无可选卡类别,请重选时段' : '请选择适用的卡类别');


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
            <div className={styles.cardLevelTree}>
                <TreeSelect
                    style={{ width: '100%' }}
                    value={this.state.cardLevelIDList}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder={_placeholder}
                    allowClear={true}
                    multiple={true}
                    treeData={treeData}
                    onChange={this.handleSelectChange}
                />{
                    !this.props.specialPromotion.get('$eventInfo').toJS().allCardLevelCheck && getExcludeCardLevelIds.length == 0 ? null :

                    <Icon
                            type="exclamation-circle" className={styles.cardLevelTreeIcon}
                            onClick={() => {
                                this.setState({ tableDisplay: !this.state.tableDisplay })
                            }}
                        />
                }
                {
                    !this.props.specialPromotion.get('$eventInfo').toJS().allCardLevelCheck && getExcludeCardLevelIds.length == 0 ? null :
                    <div style={{ display: this.state.tableDisplay ? 'block' : 'none' }}>
                            <Table
                            dataSource={excludeData}
                            columns={columns}
                            pagination={false}
                            className={styles.cardIdNames}
                            bordered={true}
                            size="middle"
                            rowKey="uid"
                            title={() => { return this.props.catOrCard == 'card' ? '同时段内，卡等级被以下活动占用' : '同时段内，卡类被以下活动占用' }}
                        />
                        </div>
                }
            </div>

        );
    }
}
const mapStateToProps = (state) => {
    return {
        specialPromotion: state.specialPromotion_NEW,
        user: state.user.toJS(),
        mySpecialActivities: state.mySpecialActivities_NEW.toJS(),
        promotionScopeInfo: state.promotionScopeInfo_NEW,

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

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(CardLevel));
