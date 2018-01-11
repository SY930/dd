import { HualalaEditorBox, HualalaTreeSelect, HualalaGroupSelect, HualalaSelected, HualalaSearchInput, CC2PY } from '../../../components/common';
import React from 'react';
import { connect } from 'react-redux'; import { Tree } from 'antd';

const TreeNode = Tree.TreeNode;

import styles from '../ActivityPage.less';

if (process.env.__CLIENT__ === true) {
    // require('../../../../client/componentsPage.less');
}

import { fetchRoleListInfoAC, saleCenterSetPromotionDetailAC } from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';

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

        this.handleTreeNodeChange = this.handleTreeNodeChange.bind(this);
        this.handleGroupSelect = this.handleGroupSelect.bind(this);
        this.handleSelectedChange = this.handleSelectedChange.bind(this);
        this.handleEditorBoxChange = this.handleEditorBoxChange.bind(this);
        this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
        this.clear = this.clear.bind(this);
        this.initialState = this.initialState.bind(this);
    }

    initialState(roleList, roleCollection) {
        if (roleList === undefined || roleCollection === undefined) {
            return
        }

        const _roleSelections = this.state.roleSelections;
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
        if (!this.props.promotionDetailInfo.getIn(['$roleInfo', 'initialized'])) {
            this.props.fetchRoleList({
                _groupID: this.props.user.accountInfo.groupID,
            })
        }

        const _roles = this.props.promotionDetailInfo.getIn(['$roleInfo', 'data', 'roleTree']).toJS();
        const _role = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'role']).toJS();
        const ProDetail = this.props.myActivities.toJS().$promotionDetailInfo.data;
        const thisProID = ProDetail ? ProDetail.promotionInfo.master.shopID : undefined; // detail是否编辑or查看
        const filterFlag = this.props.user.shopID > 0 && (!ProDetail || ProDetail.promotionInfo.master.maintenanceLevel == 'SHOP_LEVEL');

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
        if (this.props.promotionDetailInfo.getIn(['$roleInfo', 'data', 'roleTree']) !=
            nextProps.promotionDetailInfo.getIn(['$roleInfo', 'data', 'roleTree'])) {
            const _roles = nextProps.promotionDetailInfo.getIn(['$roleInfo', 'data', 'roleTree']).toJS();
            if (nextProps.promotionScopeInfo.get('$scopeInfo').toJS().auto == '1') {
                this.clear();

                this.props.setPromotionDetail({
                    role: '',
                });
            } else {
                const ProDetail = nextProps.myActivities.toJS().$promotionDetailInfo.data;
                const thisProID = ProDetail ? ProDetail.promotionInfo.master.shopID : undefined; // detail是否编辑or查看
                const filterFlag = nextProps.user.shopID > 0 && (!ProDetail || ProDetail.promotionInfo.master.maintenanceLevel == 'SHOP_LEVEL');
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
        }

        if (this.props.promotionDetailInfo.getIn(['$promotionDetail', 'role']) !=
            nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'role'])) {
            const _role = nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'role']).toJS();
            this.setState({
                role: _role,
            }, () => {
                this.initialState(this.state.role, this.state.roleCollection);
            });
        }
    }

    render() {
        const _roleCollection = this.state.roleCollection;
        const loop = (data) => {
            if (undefined === data) {
                return null
            }

            return data.map((item, index) => {
                return <TreeNode key={index} title={item.roleGroupName.content} />;
            });
        };
        return (
            <div className={styles.treeSelectMain}>
                <HualalaEditorBox
                    label={'活动执行角色'}
                    itemName="roleName"
                    itemID="roleID"
                    data={this.state.roleSelections}
                    onChange={this.handleEditorBoxChange}
                    onTagClose={this.handleSelectedChange}
                >
                    <HualalaTreeSelect level1Title={'全部执行角色'}>
                        <HualalaSearchInput onChange={this.handleSearchInputChange} />
                        <Tree onSelect={this.handleTreeNodeChange}>
                            {loop(_roleCollection)}
                        </Tree>
                        <HualalaGroupSelect
                            options={this.state.roleOptions}
                            labelKey="roleName"
                            valueKey="roleID"
                            value={this.state.roleCurrentSelections}
                            onChange={this.handleGroupSelect}
                        />
                        <HualalaSelected itemName="roleName" selectdTitle={'已选执行角色'} value={this.state.roleSelections} onChange={this.handleSelectedChange} onClear={() => this.clear()} />
                    </HualalaTreeSelect>
                </HualalaEditorBox>
            </div>
        );
    }

    clear() {
        const { roleSelections } = this.state;
        roleSelections.clear();
        this.setState({
            roleCurrentSelections: [],
            roleSelections,
        })
    }

    handleSearchInputChange(value) {
        const roleList = this.state.roleCollection;
        if (undefined === roleList) {
            return null;
        }

        if (!((roleList instanceof Array) && roleList.length > 0)) {
            return null;
        }

        const allMatchItem = [];
        roleList.forEach((promotions) => {
            promotions.roleName.forEach((promotion) => {
                if (CC2PY(promotion.roleName).indexOf(value) !== -1 || promotion.roleName.indexOf(value) !== -1) {
                    allMatchItem.push(promotion);
                }
            });
        });

        const roleCurrentSelections = [];
        allMatchItem.forEach((storeEntity) => {
            if (this.state.roleSelections.has(storeEntity)) {
                roleCurrentSelections.push(storeEntity.roleID)
            }
        });

        this.setState({
            roleOptions: allMatchItem,
            roleCurrentSelections,
        });
    }

    // it's depends on
    handleEditorBoxChange(value) {
        const roleSelections = value;
        // update currentSelections according the selections
        const roleCurrentSelections = [];
        this.state.roleOptions.forEach((storeEntity) => {
            if (roleSelections.has(storeEntity)) {
                roleCurrentSelections.push(storeEntity.roleID)
            }
        });

        this.setState({
            roleSelections: value,
            roleCurrentSelections,
        }, () => {
            this.props.onChange && this.props.onChange(Array.from(value));
        });
    }

    handleSelectedChange(value) {
        const roleSelections = this.state.roleSelections;
        let roleCurrentSelections = this.state.roleCurrentSelections;
        if (value !== undefined) {
            roleSelections.delete(value);
            roleCurrentSelections = roleCurrentSelections.filter((item) => {
                return item !== value.roleID
            })
        }

        this.setState({
            roleSelections,
            roleCurrentSelections,
        }, () => {
            this.props.onChange && this.props.onChange(Array.from(roleSelections));
        });
    }

    handleGroupSelect(value) {
        if (value instanceof Array) {
            // get the selections
            const selectionsSet = this.state.roleSelections;
            this.state.roleOptions.forEach((shopEntity) => {
                if (value.includes(shopEntity.roleID)) {
                    selectionsSet.add(shopEntity);
                } else {
                    selectionsSet.delete(shopEntity)
                }
            });

            this.setState({ roleCurrentSelections: value, roleSelections: selectionsSet });
        }
    }

    handleTreeNodeChange(value) {
        const { roleSelections } = this.state;
        if (value === undefined || value[0] === undefined) {
            return null;
        }
        const indexArray = value[0].split('-').map((val) => {
            return parseInt(val)
        });
        let storeOptions = [];
        if (indexArray.length === 1) {
            storeOptions = storeOptions.concat(this.state.roleCollection[indexArray[0]].roleName);
        } else if (indexArray.length === 2) {
            storeOptions = storeOptions.concat(this.state.roleCollection[indexArray[0]].children[indexArray[1]].children);
        }

        const roleCurrentSelections = [];
        storeOptions.forEach((storeEntity) => {
            if (roleSelections.has(storeEntity)) {
                roleCurrentSelections.push(storeEntity.roleID)
            }
        });
        this.setState({ roleOptions: storeOptions, roleCurrentSelections });
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
