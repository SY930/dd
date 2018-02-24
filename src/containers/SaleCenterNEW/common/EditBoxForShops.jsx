import { HualalaEditorBox, HualalaTreeSelect, HualalaGroupSelect, HualalaSelected, HualalaSearchInput, CC2PY } from '../../../components/common';
import React from 'react';
import { connect } from 'react-redux'; import { Tree } from 'antd';

const TreeNode = Tree.TreeNode;

import styles from '../ActivityPage.less';

if (process.env.__CLIENT__ === true) {
    // require('../../../../client/componentsPage.less');
}

import { fetchPromotionScopeInfo } from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action';
import { shopsAllSet } from '../../../redux/actions/saleCenterNEW/promotionBasicInfo.action';
import Immutable from 'immutable';

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
        // fetch('/api/v1/universal',{
        //     method: 'POST',
        //     credentials: 'include',
        //     headers: {
        //         'Accept': '*/*',
        //         'Content-Type': 'application/json; charset=UTF-8',
        //     },
        //     body:{
        //         service:'HTTP_SERVICE_URL_PROMOTION_NEW',
        //         method: '/specialPromotion/queryEvents.ajax',
        //         type: 'post',
        //         data: JSON.stringify({groupID: this.props.user.accountInfo.groupID}),
        //     }
        // }).then((response) => {
        //     if (response.status >= 200 && response.status < 300) {
        //         if (response.headers.get('content-type').includes('application/json')) {
        //             return response.json();
        //         }
        //         return response.text();
        //     }
        //     return Promise.reject(new Error(response.statusText))
        // }).then((responseJSON) => {
        //     if (responseJSON.code === '000') {
        //         console.log(responseJSON)
        //     }
        // }).catch((error) => {
        // })

        const _data = this.props.value || this.props.promotionScopeInfo.getIn(['$scopeInfo']).toJS();
        const _cityAreasShops = this.props.promotionScopeInfo.getIn(['refs', 'data', 'cityAreasShops']);
        const _selections = this.state.selections;

        if (_cityAreasShops) {
            _cityAreasShops.forEach((city) => {
                city.children.forEach((area) => {
                    area.children.forEach((shop) => {
                        (_data.shopsInfo || []).forEach((id) => {
                            if (shop.itemID == id) {
                                _selections.add(shop)
                            }
                        })
                    })
                })
            })

            this.setState({
                cityAreasShops: this.props.promotionScopeInfo.getIn(['refs', 'data', 'cityAreasShops']),
                selections: _selections,
            })
        }
    }
    componentWillReceiveProps(nextProps) {
        const _data = nextProps.value || nextProps.promotionScopeInfo.getIn(['$scopeInfo']).toJS();
        const _cityAreasShops = nextProps.promotionScopeInfo.getIn(['refs', 'data', 'cityAreasShops']);
        const _selections = this.state.selections;
        const filterBrands = nextProps.filterBrands,
            sameBrands = Immutable.is(Immutable.fromJS(this.props.filterBrands), Immutable.fromJS(filterBrands));
        let _cityAreasShops_filter = [],
            _filterOption = [];
        if (this.props.promotionScopeInfo.getIn(['refs', 'data', 'cityAreasShops']) !==
            nextProps.promotionScopeInfo.getIn(['refs', 'data', 'cityAreasShops']) ||
            nextProps.value !== this.props.value
        ) {
            if (_cityAreasShops) {
                if (_data.shopsInfo !== undefined) {
                    _cityAreasShops.forEach((city) => {
                        city.children.forEach((area) => {
                            area.children.forEach((shop) => {
                                (_data.shopsInfo || []).forEach((id) => {
                                    if (shop.itemID == id) {
                                        _selections.add(shop);
                                    }
                                })
                            })
                        })
                    })
                }
                this.setState({
                    cityAreasShops: nextProps.promotionScopeInfo.getIn(['refs', 'data', 'cityAreasShops']),
                    selections: _selections,
                }, () => {
                    this.props.onChange && this.props.onChange(Array.from(this.state.selections))
                })
            }
        }

        if (this.props.promotionBasicInfo.get('$filterShops') != nextProps.promotionBasicInfo.get('$filterShops')) {
            const { allShopSet = false, shopList = [] } = nextProps.promotionBasicInfo.get('$filterShops').toJS();
            let shopsCount = 0;
            // 更新店铺源
            if (allShopSet) {
                // 全部占用，清空店铺源
                _cityAreasShops_filter = []
            } else {
                // 局部占用，删除店铺
                _cityAreasShops_filter = _cityAreasShops.map((city) => {
                    return {
                        ...city,
                        children: city.children.map((area) => {
                            return {
                                ...area,
                                children: area.children.filter((shop) => {
                                    shopsCount++;
                                    return !shopList.includes(shop.itemID)
                                }),
                            }
                        }),
                    }
                })
            }
            // 更新选择框右侧选项，不然显示的 仍是上次的状态
            _filterOption = this.state.storeOptions.filter((option) => {
                return !shopList.includes(option.shopID)
            })
            this.setState({
                cityAreasShops: _cityAreasShops_filter,
                options: _filterOption,
            });
            // 全部占用，不允许提交
            const opts = !!(allShopSet || shopsCount == shopList.length)
            this.props.handleAllShopSet && this.props.handleAllShopSet(opts)
            this.props.shopsAllSet(opts);
        }
        if (nextProps.promotionBasicInfo.get('$filterShops').size > 0) {
            const formAt = (moment) => {
                if (!moment) {
                    return ''
                }
                return moment.format('YYYYMMDD')
            }
            const basicInfo = this.props.promotionBasicInfo.get('$basicInfo').toJS();
            const _basicInfo = nextProps.promotionBasicInfo.get('$basicInfo').toJS();
            if (formAt(basicInfo.startDate) != formAt(_basicInfo.startDate) ||
                formAt(basicInfo.endDate) != formAt(_basicInfo.endDate)) {
                this.setState({
                    selections: new Set(),
                }, () => {
                    this.props.onChange && this.props.onChange([])
                })
            }
        }
        if (!sameBrands) {
            // 若选择了品牌，则筛掉所有不属于品牌的店铺源
            _cityAreasShops_filter = filterBrands.length === 0 ? _cityAreasShops
                : _cityAreasShops.map((city) => {
                    return {
                        ...city,
                        children: city.children.map((area) => {
                            return {
                                ...area,
                                children: area.children.filter((shop) => {
                                    return filterBrands.includes(shop.brandID)
                                }),
                            }
                        }),
                    }
                })
            // 若选择了品牌，则筛掉不属于品牌的店铺
            if (filterBrands.length > 0) {
                Array.from(_selections).forEach(selected => {
                    !filterBrands.includes(selected.brandID) && console.log(filterBrands, selected);
                    !filterBrands.includes(selected.brandID) && _selections.delete(selected);
                })
            }
            this.setState({
                selections: _selections,
            }, () => {
                this.props.onChange && this.props.onChange(Array.from(this.state.selections))
            })
            // 若选择了品牌，则筛掉右侧checkBox不属于品牌的店铺选项
            _filterOption = filterBrands.length === 0 ? this.state.storeOptions
                : this.state.storeOptions.filter((option) => {
                    return filterBrands.includes(option.brandID)
                })
            this.setState({
                cityAreasShops: _cityAreasShops_filter,
                options: _filterOption,
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
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        promotionBasicInfo: state.sale_promotionBasicInfo_NEW,
        user: state.user.toJS()
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchPromotionScopeInfo: (opts) => {
            dispatch(fetchPromotionScopeInfo(opts));
        },
        shopsAllSet: (opts) => {
            dispatch(shopsAllSet(opts));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditBoxForShops);

// // add by zhangyanan
// const mapStateToPropsForCrm = (state) => {
//     return {
//         promotionBasicInfo: state.sale_promotionBasicInfo_NEW,
//         promotionScopeInfo: state.CrmCardInfoAll.equalShopsData.queryInfo,
//         user: state.user.toJS() };
// };

// const mapDispatchToPropsForCrm = (dispatch) => {
//     return {
//         fetchPromotionScopeInfo: (opts) => {
//             dispatch(fetchPromotionScopeInfo(opts));
//         },
//     };
// };


// export const EditBoxForShopsForCrm = connect(mapStateToPropsForCrm, mapDispatchToPropsForCrm)(EditBoxForShops);

