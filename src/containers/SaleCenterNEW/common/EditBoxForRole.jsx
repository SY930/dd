import { HualalaEditorBox, HualalaTreeSelect, HualalaGroupSelect, HualalaSelected, HualalaSearchInput, CC2PY } from '../../../components/common';
import React from 'react';
import { connect } from 'react-redux'; import { Tree } from 'antd';
import styles from '../ActivityPage.less';
import BaseHualalaModal from './BaseHualalaModal';
import { fetchRoleListInfoAC, saleCenterSetPromotionDetailAC } from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import { is } from 'immutable';

const TreeNode = Tree.TreeNode;

class EditBoxForSubject extends React.Component {
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
        this.props.fetchRoleList({
            _groupID: this.props.user.accountInfo.groupID,
        })

        let _roles = this.props.promotionDetailInfo.getIn(['$roleInfo', 'data', 'roleTree']);
        _roles = _roles ? _roles.toJS() : [];
        let _role = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'role']);
        _role = _role ? _role.toJS() : [];
        const ProDetail = this.props.myActivities.toJS().$promotionDetailInfo.data;
        const filterFlag = this.props.user.shopID > 0 && (!ProDetail || ProDetail.promotionInfo.master.maintenanceLevel == '1');

        if (this.props.promotionScopeInfo.get('$scopeInfo').toJS().auto == '1') {
            this.clear();
            this.props.setPromotionDetail({
                role: '',
            });
        } else {
            this.setState({
                roleCollection: filterFlag ? _roles.map((roles) => {
                    return {
                        ...roles,
                        roleName: roles.roleName.filter((roleMan => roleMan.shopIDs.indexOf(this.props.user.shopID) > -1))
                    }
                }) : _roles,
                role: _role,
            }, () => {
                this.initialState(this.state.role, this.state.roleCollection);
            });
        }
    }
    componentWillReceiveProps(nextProps) {
        if (!is(this.props.promotionDetailInfo.getIn(['$roleInfo', 'data', 'roleTree']),
            nextProps.promotionDetailInfo.getIn(['$roleInfo', 'data', 'roleTree']))) {
            let _roles = nextProps.promotionDetailInfo.getIn(['$roleInfo', 'data', 'roleTree']);
            _roles = _roles ? _roles.toJS() : [];
            if (nextProps.promotionScopeInfo.get('$scopeInfo').toJS().auto == '1') {
                this.clear();
                this.props.setPromotionDetail({
                    role: '',
                });
            }
            const ProDetail = nextProps.myActivities.toJS().$promotionDetailInfo.data;
            const filterFlag = nextProps.user.shopID > 0 && (!ProDetail || ProDetail.promotionInfo.master.maintenanceLevel == '1');
            this.setState({
                roleCollection: filterFlag ? _roles.map((roles) => {
                    return {
                        ...roles,
                        roleName: roles.roleName.filter((roleMan => roleMan.shopIDs.indexOf(nextProps.user.shopID) > -1))
                    }
                }) : _roles,
                roleSelections: new Set(),
            }, () => {
                this.initialState(this.state.role, this.state.roleCollection);
            });
        }
        if (!is(this.props.promotionDetailInfo.getIn(['$promotionDetail', 'role']),
            nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'role']))) {
            let _role = nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'role']);
            _role = _role ? _role.toJS() : [];
            this.setState({
                role: _role,
            }, () => {
                this.initialState(this.state.role, this.state.roleCollection);
            });
        }
    }

    render() {
        const { roleCollection, roleSelections } = this.state;

        return (
            <div className={styles.treeSelectMain}>
                <BaseHualalaModal
                    outLabel={'活动执行角色'} //   外侧选项+号下方文案
                    outItemName="roleName" //   外侧已选条目选项的label
                    outItemID="roleID" //   外侧已选条目选项的value
                    innerleftTitle={'全部执行角色'} //   内部左侧分类title
                    innerleftLabelKey={'roleGroupName.content'}//   内部左侧分类对象的哪个属性为分类label
                    leftToRightKey={'roleName'} // 点击左侧分类，的何种属性展开到右侧
                    innerRightLabel="roleName" //   内部右侧checkbox选项的label
                    innerRightValue="roleID" //   内部右侧checkbox选项的value
                    innerBottomTitle={'已选执行角色'} //   内部底部box的title
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

export default connect(mapStateToProps, mapDispatchToProps)(EditBoxForSubject);
