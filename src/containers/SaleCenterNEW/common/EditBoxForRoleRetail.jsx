import React from 'react';
import { connect } from 'react-redux';
import styles from '../ActivityPage.less';
import BaseHualalaModal from './BaseHualalaModal';
import { fetchRoleListInfoAC, saleCenterSetPromotionDetailAC } from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import { is } from 'immutable';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from '../IntlDecor';
import { fetchData } from '../../../helpers/util';
import _ from 'lodash';


@injectIntl()
class EditBoxForRoleRetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            roleCollection: [],
            roleOptions: [],
            roleSelections: new Set(),
            roleCurrentSelections: [],
            role: [], // 后台取过来的role
        };
        this.initialState = this.initialState.bind(this);
    }

    initialState(roleList, roleCollection) {
        if (roleList === undefined || roleCollection === undefined || roleList.size === 0 || roleCollection.length === 0) {
            return
        }

        const _roleSelections = this.state.roleSelections;
        _roleSelections.clear()
        roleCollection.forEach((roles) => {
            roles.roleName.forEach((role) => {
                roleList.forEach((roleID) => {
                    if (role.roleID == roleID) {
                        _roleSelections.add(role);
                    }
                })
            })
        });
        this.setState({
            roleSelections: _roleSelections,
        });
    }

    componentDidMount() {
        this.getRoleReatail()
    }

    getRoleReatail = () => {
        const _this = this;
        fetchData('getRoleList', { groupID: this.props.user.accountInfo.groupID }, null, {
            path: 'data.records',
        })
            .then((records) => {
                const dataRole = []
                let id = 0;
                _.map(_.groupBy(records, 'isGlobalName'), (item, key, index) => {
                    dataRole.push({
                        roleGroupName: { id: ++id, content: key },
                        roleName: item
                    })
                })

                this.setState({
                    roleCollection: dataRole,
                }, () => {
                    let _role = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'role']);
                    _role = _role ? _role.toJS() : [];
                    this.setState({
                        role: _role,
                    }, () => {
                        this.initialState(this.state.role, this.state.roleCollection);
                    });  
                })
            });
    }


    render() {
        const { roleCollection = [], roleSelections = [] } = this.state;
        const { intl } = this.props;
        const k5m3opsk = intl.formatMessage(SALE_STRING.k5m3opsk);
        return (
            <div className={styles.treeSelectMain}>
                <BaseHualalaModal
                    outLabel={k5m3opsk} //   外侧选项+号下方文案
                    outItemName="roleName" //   外侧已选条目选项的label
                    outItemID="roleID" //   外侧已选条目选项的value
                    innerleftTitle={SALE_LABEL.k5m5awlc} //   内部左侧分类title
                    innerleftLabelKey={'roleGroupName.content'}//   内部左侧分类对象的哪个属性为分类label
                    leftToRightKey={'roleName'} // 点击左侧分类，的何种属性展开到右侧
                    innerRightLabel="roleName" //   内部右侧checkbox选项的label
                    innerRightValue="roleID" //   内部右侧checkbox选项的value
                    innerBottomTitle={SALE_LABEL.k5m5awto} //   内部底部box的title
                    innerBottomItemName="roleName" //   内部底部已选条目选项的label
                    treeData={roleCollection} // 树形全部数据源【{}，{}，{}】
                    data={Array.from(roleSelections)} // 已选条目数组【{}，{}，{}】】,编辑时向组件内传递值
                    onChange={(value) => {
                        // 组件内部已选条目数组【{}，{}，{}】,向外传递值
                        this.props.onChange && this.props.onChange(value)
                    }}
                />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        myActivities: state.sale_myActivities_NEW,
        user: state.user.toJS()
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setPromotionDetail: (opts) => {
            dispatch(saleCenterSetPromotionDetailAC(opts))
        },

        fetchRoleList: (opts) => {
            dispatch(fetchRoleListInfoAC(opts));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditBoxForRoleRetail);
