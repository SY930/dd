import { HualalaEditorBox, HualalaTreeSelect, HualalaGroupSelect, HualalaSelected, HualalaSearchInput, CC2PY } from '../../../components/common';
import React from 'react';
import { connect } from 'react-redux'; import { Tree } from 'antd';

import styles from '../../SaleCenterNEW/ActivityPage.less';
import { fetchPromotionScopeInfo } from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action';
import Immutable from 'immutable';

const TreeNode = Tree.TreeNode;

class EditBoxForShops extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cityAreasShops: [],
            options: [],
            selections: new Set(),
            currentSelections: [],
            storeOptions: [],
        };

        this.handleTreeNodeChange = this.handleTreeNodeChange.bind(this);
        this.handleGroupSelect = this.handleGroupSelect.bind(this);
        this.handleSelectedChange = this.handleSelectedChange.bind(this);
        this.handleEditorBoxChange = this.handleEditorBoxChange.bind(this);
        this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
        this.clear = this.clear.bind(this);
    }
    componentDidMount() {
        if (!this.props.initialized) {
            this.props.fetchPromotionScopeInfo({ _groupID: this.props.user.accountInfo.groupID });
        }
        const data = this.props.value;
        const shopsInfo = !data.shopsInfo || data.shopsInfo === '[]' ? [] : data.shopsInfo
        const cityAreasShops = this.props.cityAreasShops || [];
        const selections = this.state.selections;

        if (cityAreasShops) {
            cityAreasShops.forEach((city) => {
                city.children.forEach((area) => {
                    area.children.forEach((shop) => {
                        shopsInfo.forEach((id) => {
                            if (shop.itemID == id) {
                                selections.add(shop)
                            }
                        })
                    })
                })
            })

            this.setState({
                cityAreasShops,
                selections,
            })
        }
    }
    componentWillReceiveProps(nextProps) {
        const data = nextProps.value;
        const shopsInfo = !data.shopsInfo || data.shopsInfo === '[]' ? [] : data.shopsInfo
        const cityAreasShops = nextProps.cityAreasShops || [];
        const selections = new Set();
        let cityAreasShops_filter = [],
            filterOption = [];
        if (this.props.cityAreasShops !== nextProps.cityAreasShops ||
            !Immutable.is(Immutable.fromJS(nextProps.value), Immutable.fromJS(this.props.value))) {
            if (cityAreasShops) {
                if (data.shopsInfo !== undefined) {
                    cityAreasShops.forEach((city) => {
                        city.children.forEach((area) => {
                            area.children.forEach((shop) => {
                                shopsInfo.forEach((id) => {
                                    if (shop.itemID == id) {
                                        selections.add(shop);
                                    }
                                })
                            })
                        })
                    })
                }
                this.setState({
                    cityAreasShops,
                    selections,
                }, () => {
                    this.props.onChange && this.props.onChange(Array.from(this.state.selections))
                })
            }
        }
        if (!Immutable.is(Immutable.fromJS(this.props.canUseShops), Immutable.fromJS(nextProps.canUseShops)) ||
            !Immutable.is(Immutable.fromJS(nextProps.value), Immutable.fromJS(this.props.value))) {
            const { canUseShops = [] } = nextProps
            // 更新店铺源
            cityAreasShops_filter = (cityAreasShops || []).map((city) => {
                return {
                    ...city,
                    children: city.children.map((area) => {
                        return {
                            ...area,
                            children: area.children.filter((shop) => {
                                return canUseShops.includes(shop.itemID)
                            }),
                        }
                    }),
                }
            })
            // 更新选择框右侧选项，不然显示的 仍是上次的状态
            filterOption = this.state.storeOptions.filter((option) => {
                return canUseShops.includes(option.shopID)
            })
            this.setState({
                cityAreasShops: cityAreasShops_filter,
                options: filterOption,
            });
        }
    }

    render() {
        const _cityAreasShops = this.state.cityAreasShops;

        const loop = (data) => {
            if (undefined === data) {
                return null
            }

            return data.map((item, index) => {
                if (item.children) {
                    return (
                        <TreeNode key={`${index}`} title={item.itemName}>
                            {
                                item.children.map((subItem, index2) => {
                                    return (<TreeNode key={`${index}-${index2}`} title={subItem.itemName} />);
                                })
                            }
                        </TreeNode>
                    );
                }
                return <TreeNode key={index} title={item.itemName} />;
            });
        };
        return (
            <div className={styles.treeSelectMain}>
                <HualalaEditorBox
                    label={'适用店铺'}
                    itemName="itemName"
                    itemID="itemID"
                    data={this.state.selections}
                    onChange={this.handleEditorBoxChange}
                    onTagClose={this.handleSelectedChange}
                >
                    <HualalaTreeSelect level1Title={'全部城市'}>
                        <HualalaSearchInput onChange={this.handleSearchInputChange} />
                        <Tree onSelect={this.handleTreeNodeChange}>
                            {loop(_cityAreasShops)}
                        </Tree>
                        <HualalaGroupSelect
                            options={this.state.options}
                            labelKey="itemName"
                            valueKey="itemID"
                            value={this.state.currentSelections}
                            onChange={this.handleGroupSelect}
                        />
                        <HualalaSelected itemName="itemName" selectdTitle={'已选城市'} value={this.state.selections} onChange={this.handleSelectedChange} onClear={() => this.clear()} />
                    </HualalaTreeSelect>
                </HualalaEditorBox>
            </div>
        );
    }

    clear() {
        this.setState({
            currentSelections: [],
            selections: new Set(),
        })
    }

    handleSearchInputChange(value) {
        const data = this.state.cityAreasShops;
        if (undefined === data) {
            return null;
        }

        if (!((data instanceof Array) && data.length > 0)) {
            return null;
        }

        const allMatchItem = [];
        data.forEach((city) => {
            city.children.forEach((area) => {
                area.children.forEach((shop) => {
                    if (CC2PY(shop.shopName).indexOf(CC2PY(value)) !== -1) {
                        allMatchItem.push(shop);
                    }
                })
            })
        });

        // update currentSelections according the selections
        const currentSelections = [];
        allMatchItem.forEach((storeEntity) => {
            if (this.state.selections.has(storeEntity)) {
                currentSelections.push(storeEntity.itemID)
            }
        })

        this.setState({
            options: allMatchItem,
            currentSelections,
        });
    }

    // it's depends on
    handleEditorBoxChange(value) {
        const selections = value;
        // update currentSelections according the selections
        const currentSelections = [];
        this.state.options.forEach((storeEntity) => {
            if (selections.has(storeEntity)) {
                currentSelections.push(storeEntity.itemID)
            }
        });

        this.setState({
            selections: value,
            currentSelections,
        }, () => {
            this.props.onChange && this.props.onChange(Array.from(value));
        });
    }

    handleSelectedChange(value) {
        const selections = this.state.selections;
        let currentSelections = this.state.currentSelections;

        if (value !== undefined) {
            selections.delete(value);
            currentSelections = currentSelections.filter((item) => {
                return item !== value.itemID
            })
        }


        this.setState({
            selections,
            currentSelections,
        }, () => {
            this.props.onChange && this.props.onChange(Array.from(selections));
        });
    }

    handleGroupSelect(value) {
        if (value instanceof Array) {
            // get the selections
            const selectionsSet = this.state.selections;
            this.state.options.forEach((shopEntity) => {
                if (value.includes(shopEntity.itemID)) {
                    selectionsSet.add(shopEntity);
                } else {
                    selectionsSet.delete(shopEntity)
                }
            });

            this.setState({ currentSelections: value, selections: selectionsSet });
        }
    }

    handleTreeNodeChange(value) {
        const { selections } = this.state;
        if (value === undefined || value[0] === undefined) {
            return null;
        }
        const indexArray = value[0].split('-').map((val) => {
            return parseInt(val)
        });
        let storeOptions = [];
        if (indexArray.length === 1) {
            this.state.cityAreasShops[indexArray[0]].children.map((area) => {
                storeOptions = storeOptions.concat(area.children);
            })
        } else if (indexArray.length === 2) {
            storeOptions = storeOptions.concat(this.state.cityAreasShops[indexArray[0]].children[indexArray[1]].children);
        }
        // update currentSelections according the selections
        const currentSelections = [];
        storeOptions.forEach((storeEntity) => {
            if (selections.has(storeEntity)) {
                currentSelections.push(storeEntity.itemID)
            }
        });
        this.setState({ options: storeOptions, currentSelections, storeOptions });
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user.toJS(),
        cityAreasShops: state.sale_promotionScopeInfo_NEW.getIn(['refs', 'data', 'cityAreasShops']),
        initialized: state.sale_promotionScopeInfo_NEW.getIn(['refs', 'initialized']),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchPromotionScopeInfo: (opts) => {
            dispatch(fetchPromotionScopeInfo(opts));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditBoxForShops);

