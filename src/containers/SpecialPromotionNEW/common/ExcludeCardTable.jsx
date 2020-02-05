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
    Table,
} from 'antd';

import { saleCenterSetSpecialBasicInfoAC, saleCenterGetExcludeCardLevelIds } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import styles from '../../SaleCenterNEW/ActivityPage.less';
import { fetchPromotionScopeInfo } from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action';
import { fetchSpecialCardLevel } from '../../../redux/actions/saleCenterNEW/mySpecialActivities.action'
import _ from 'lodash';
import { injectIntl } from 'i18n/common/injectDecorator'
import { STRING_SPE } from 'i18n/common/special';


@injectIntl
class ExcludeCardTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cardInfo: [],
            weChatCardInfo: [],
            cardLevelIDList: this.props.value || [],
            getExcludeCardLevelIds: [],
            getExcludeCardLevelIdsStatus: false,
            tableDisplay: false,
        };
    }

    componentDidMount() {
        this.setState({
            cardInfo: this.props.groupCardTypeList,
            weChatCardInfo: this.props.crmCardTypeNew.get('cardTypeLst').toJS(),
            getExcludeCardLevelIds: this.props.specialPromotion.get('$eventInfo').toJS().excludeEventCardLevelIdModelList || [],
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.groupCardTypeList.length) {
            this.setState({
                cardInfo: nextProps.groupCardTypeList,
            })
        }
        this.setState({
            weChatCardInfo: nextProps.crmCardTypeNew.get('cardTypeLst').toJS(),
            getExcludeCardLevelIds: nextProps.specialPromotion.get('$eventInfo').toJS().excludeEventCardLevelIdModelList || [],
        });
    }

    render() {
        let { cardInfo = [], getExcludeCardLevelIds = [], weChatCardInfo = [] } = this.state;
        if (this.props.isWeChatOnly) {
            cardInfo = weChatCardInfo;
        }
        // table数据
        const excludeData = [];
        const excludeEventCardLevelIdModelList = getExcludeCardLevelIds;
        if (this.props.catOrCard == 'card' && !this.props.isWeChatOnly) {
            excludeEventCardLevelIdModelList.map((excludeEvent) => {
                if (excludeEvent.allCardLevelCheck) {
                    excludeEvent.idNames = [`${this.props.intl.formatMessage(STRING_SPE.da8og068ff0212)}`];
                } else {
                    excludeEvent.idNames = [];
                    excludeEvent.cardLevelIDList.map((cardLevelID) => {
                        cardInfo.map((cardType, index) => {
                            (cardType.cardTypeLevelList || []).map((card, i) => {
                                if (card.cardLevelID == cardLevelID) {
                                    excludeEvent.idNames.push(card.cardLevelName)
                                }
                            });
                        });
                        cardInfo.map((cardType, index) => {
                            if (cardType.cardTypeID == cardLevelID) {
                                excludeEvent.idNames.push(cardType.cardTypeName)
                            }
                        });
                    })
                }
                excludeData.push(excludeEvent);
            });
        } else {
            excludeEventCardLevelIdModelList.map((excludeEvent) => {
                if (excludeEvent.allCardLevelCheck) {
                    excludeEvent.idNames = [`${this.props.intl.formatMessage(STRING_SPE.da8og068ff0212)}`];
                } else {
                    excludeEvent.idNames = [];
                    excludeEvent.cardLevelIDList.map((cardLevelID) => {
                        cardInfo.map((cardType, index) => {
                            (cardType.cardTypeLevelList || []).map((card, i) => {
                                if (card.cardLevelID == cardLevelID) {
                                    excludeEvent.idNames.push(card.cardLevelName)
                                }
                            });
                        });
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
            title: `${this.props.intl.formatMessage(STRING_SPE.d4546grade4128)}`,
            dataIndex: 'eventName',
            key: 'eventName',
            className: 'TableTxtCenter',
            render: (text, record, index) => {
                return (
                    <div key={'eventName'}><h5 className={styles.cardName} key={'eventName'}>{`${record.eventName || `${this.props.intl.formatMessage(STRING_SPE.d31eifji3f4063)}`}`}</h5></div>
                )
            },
        }, {
            title: `${this.props.intl.formatMessage(STRING_SPE.d5g337jqji179)}`,
            dataIndex: 'eventDate',
            key: 'eventDate',
            className: 'TableTxtCenter',
            render: (text, record, index) => {
                return (
                    <div key={'eventDate'}><h5 className={styles.cardName} key={'eventDate'}>
                        {record.eventStartDate == '20000101' && record.eventEndDate == '29991231' ? `${this.props.intl.formatMessage(STRING_SPE.d16hfi5gh45088)}` : `${record.eventStartDate || '--'}/${record.eventEndDate || '--'}`}
                        </h5></div>
                )
            },
        }, {
            title: `${this.props.intl.formatMessage(STRING_SPE.d1qe2n6mbf241)}`,
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
                title={() => { return `${this.props.intl.formatMessage(STRING_SPE.d31eifh489a3138)}` }}
            />
        );
    }
}
const mapStateToProps = (state) => {
    const groupCardTypeList = state.sale_mySpecialActivities_NEW.getIn(['$specialDetailInfo', 'data', 'cardInfo', 'data', 'groupCardTypeList']);
    return {
        specialPromotion: state.sale_specialPromotion_NEW,
        user: state.user.toJS(),
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        crmCardTypeNew: state.sale_crmCardTypeNew,
        groupCardTypeList:  groupCardTypeList? groupCardTypeList.toJS() : [],
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
