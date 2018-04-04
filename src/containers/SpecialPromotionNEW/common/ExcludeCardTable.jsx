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

class ExcludeCardTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cardInfo: [],
            cardLevelIDList: this.props.value || [],
            getExcludeCardLevelIds: [],
            getExcludeCardLevelIdsStatus: false,
            tableDisplay: false,
        };
    }

    componentDidMount() {
        this.setState({        
            cardInfo: this.props.crmCardTypeNew.get('cardTypeLst').toJS(),
            getExcludeCardLevelIds: this.props.specialPromotion.get('$eventInfo').toJS().excludeEventCardLevelIdModelList || [],
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            cardInfo: nextProps.crmCardTypeNew.get('cardTypeLst').toJS(),
            getExcludeCardLevelIds: nextProps.specialPromotion.get('$eventInfo').toJS().excludeEventCardLevelIdModelList || [],
        });
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

        const columns = [{
            title: '活动名称',
            dataIndex: 'eventName',
            key: 'eventName',
            className: 'TableTxtCenter',
            render: (text, record, index) => {
                return (
                    <div key={'eventName'}><h5 className={styles.cardName} key={'eventName'}>{`${record.eventName || '（无）'}`}</h5></div>
                )
            },
        }, {
            title: '起止日期',
            dataIndex: 'eventDate',
            key: 'eventDate',
            className: 'TableTxtCenter',
            render: (text, record, index) => {
                return (
                    <div key={'eventDate'}><h5 className={styles.cardName} key={'eventDate'}>{`${record.eventStartDate || '--'}/${record.eventEndDate || '--'}`}</h5></div>
                )
            },
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

        );
    }
}
const mapStateToProps = (state) => {
    return {
        specialPromotion: state.sale_specialPromotion_NEW,
        user: state.user.toJS(),
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ExcludeCardTable));
