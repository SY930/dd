import React, { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import BaseHualalaModal from "containers/SaleCenterNEW/common/BaseHualalaModal";
import { fetchSpecialCardLevel } from 'redux/actions/saleCenterNEW/mySpecialActivities.action';


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
        } = this.props;
        const {
            cardInfo, // 全量卡类，卡等级信息
            excludeEventList, // 与当前活动冲突的活动列表 [{cardLevelIDList: Array}]
        } = this.state;
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
        filteredCardInfo.forEach(cardType => {
            cardType.cardTypeLevelList = cardType.cardTypeLevelList.filter(cardLevel => {
                return !excludeCardTypeAndLevelIDList.includes(cardLevel.cardLevelID)
            })
        })
        return (
            <BaseHualalaModal
                outLabel={'卡等级'} //   外侧选项+号下方文案
                outItemName="cardLevelName" //   外侧已选条目选项的label
                outItemID="cardLevelID" //   外侧已选条目选项的value
                innerleftTitle={'全部卡类'} //   内部左侧分类title
                innerleftLabelKey={'cardTypeName'}//   内部左侧分类对象的哪个属性为分类label
                leftToRightKey={'cardTypeLevelList'} // 点击左侧分类，的何种属性展开到右侧
                innerRightLabel="cardLevelName" //   内部右侧checkbox选项的label
                innerRightValue="cardLevelID" //   内部右侧checkbox选项的value
                innerBottomTitle={'已选卡等级'} //   内部底部box的title
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


