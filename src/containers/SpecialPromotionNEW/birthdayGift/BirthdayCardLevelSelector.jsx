import React, { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import BaseHualalaModal from "containers/SaleCenterNEW/common/BaseHualalaModal";
import { fetchSpecialCardLevel } from 'redux/actions/saleCenterNEW/mySpecialActivities.action';

import { injectIntl } from 'i18n/common/injectDecorator'
import { STRING_SPE } from 'i18n/common/special';


@injectIntl
class BirthdayCardLevelSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cardInfo: Immutable.List.isList(props.cardInfo) ? props.cardInfo.toJS() : [],
            excludeEventList: Immutable.List.isList(props.excludeEventList) ? props.excludeEventList.toJS() : props.excludeEventList || [],
        }
    }
    componentDidMount() {
        const user = this.props.user.toJS();
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
        const nextEventInfo = nextProps.specialPromotion.get('$eventInfo').toJS();
        if (this.props.cardInfo !== nextProps.cardInfo) {
            this.setState({
                cardInfo: Immutable.List.isList(nextProps.cardInfo) ? nextProps.cardInfo.toJS() : [],
            })
        }
        if (this.props.excludeEventList !== nextProps.excludeEventList) {
            this.setState({
                excludeEventList: Immutable.List.isList(nextProps.excludeEventList) ?
                nextProps.excludeEventList.toJS() : nextProps.excludeEventList || [],
            })
        }
    }
    render() {
        const {
            value = [],
            onChange,
            allCardLevelCheck, // 所有卡等级都不能选
            specialPromotion
        } = this.props;
        let {
            cardInfo, // 全量卡类，卡等级信息
            excludeEventList, // 与当前活动冲突的活动列表 [{cardLevelIDList: Array}]
        } = this.state;
        // 根据时间过滤
        const nextEventInfo = specialPromotion.get('$eventInfo').toJS();
        excludeEventList = excludeEventList.filter(item => {
            // 判断时间区间是否重合
            return !(item.eventStartDate > nextEventInfo.eventEndDate || item.eventEndDate < nextEventInfo.eventStartDate) || item.eventStartDate == '20000101' || item.eventEndDate == '29991231'
        })
        const boxData = [];
        value.forEach((id) => {
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
        let filteredCardInfo = allCardLevelCheck ? [] : cardInfo.filter(cardType => {
            return !excludeCardTypeAndLevelIDList.includes(cardType.cardTypeID)
        })
        filteredCardInfo = filteredCardInfo.filter(cardType => {
            cardType.cardTypeLevelList = cardType.cardTypeLevelList.filter(cardLevel => {
                return !excludeCardTypeAndLevelIDList.includes(cardLevel.cardLevelID)
            })
            return !!(cardType.cardTypeLevelList || []).length;
        })
        return (
            <BaseHualalaModal
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
                    onChange(value.map(level => level.cardLevelID))
                }}
            />
        )
    }
}
const mapStateToProps = (state) => {
    return {
        user: state.user,
        specialPromotion: state.sale_specialPromotion_NEW,
        // 历史遗留问题：这个字段不是immutable
        excludeEventList: state.sale_specialPromotion_NEW.getIn(['$eventInfo', 'excludeEventCardLevelIdModelList']),
        allCardLevelCheck: state.sale_specialPromotion_NEW.getIn(['$eventInfo', 'allCardLevelCheck']),
        cardInfo: state.sale_mySpecialActivities_NEW.getIn(['$specialDetailInfo', 'data', 'cardInfo', 'data', 'groupCardTypeList']),
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        fetchSpecialCardLevel: (opts) => {
            dispatch(fetchSpecialCardLevel(opts));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BirthdayCardLevelSelector)


