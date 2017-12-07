/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-06-19T16:24:02+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: index.jsx
 * @Last modified by:   xf
 * @Last modified time: 2017-06-19T17:43:18+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */


import React from 'react';
import styles from './style.less';
import { Row, Col, Tree } from 'antd';
import { connect } from 'react-redux';
import HualalaSearchInput from '../HualalaSearchInput';
import HualalaGroupSelect from '../HualalaGroupSelect';
import HualalaSelected from '../HualalaSelected';
import ShopSelectorTabs from './ShopSelectorTabs';


import {
    getSpecifiedUrlConfig,
    generateXWWWFormUrlencodedParams,
} from '../../../helpers/apiConfig';

const TreeNode = Tree.TreeNode;

import { fetchPromotionScopeInfo } from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action';


class ShopsSelector extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            shops: [], // 所有店铺
            cities: [],
            brands: [],
            selectorTabInfo: undefined, // 选择的Tabs
            areas: [],
            groups: [], // 门店组


            // TODO: 尚未对分页数据进行处理
            orgsInfo: {
                initialized: false,
                data: {},
            },


            // settled filter term
            selectedCities: [],
            selectedBrands: [],
            selectedGroups: [],

            selectedOrgs: [],


            // filtered shops, shop[]
            filteredShops: [],

            // picked shop's id collection , shopID[]

            currentSelections: [],


        }
    }

    componentDidMount() {
        const $promotionScopeInfo = this.props.promotionScopeInfo;
        const $user = this.props.user;

        // Already initialized
        if ($promotionScopeInfo.getIn(['refs', 'initialized'])) {
            this.setState({
                shops: $promotionScopeInfo.getIn(['refs', 'data', 'shops']).toJS(),
                cities: $promotionScopeInfo.getIn(['refs', 'data', 'cities']).toJS(),
                brands: $promotionScopeInfo.getIn(['refs', 'data', 'brands']).toJS(),
                groups: $promotionScopeInfo.getIn(['refs', 'data', 'shopCategorys']).toJS(),
                filteredShops: $promotionScopeInfo.getIn(['refs', 'data', 'shops']).toJS(),
            })
        }
        // Post the request if the refs data was not prepared
        else {
            this.props.fetchSchema({
                _groupID: $user.getIn(['accountInfo', 'groupID']),
            })
        }


        // fetch orgs info
        if (!this.state.orgsInfo.initialized) {
            this.fetchOrgInfo({
                groupID: $user.getIn(['accountInfo', 'groupID']), // groupID
                orgTypeID: 1,
                returnParentOrg: 1,
            })
        }
    }
    /**
     * @desc fetch the specified org
     * @param {opts}  opts.orgTypeID, only the org with specified orgType will be return.
     * opts.returnParentOrg indicate that the specified org parent will also be return
     * */
    fetchOrgInfo = (opts) => {
        const self = this;
        const params = generateXWWWFormUrlencodedParams(opts);
        fetch('/org/selectOrgs.svc', {
            method: 'POST',
            credentials: 'include',
            body: params,
            headers: {
                'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
        })
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    if (response.headers.get('content-type').indexOf('application/json') >= 0) {
                        return response.json()
                    }
                    return Promise.reject(new Error('The server return the wrong format'));
                }
                return Promise.reject(new Error(response.statusText));
            })
            .then((result) => {
            // TODO: page info still not handle yet!! Be cautious.
                self.setState({
                    orgsInfo: {
                        initialized: true,
                        data: result.data.records,
                    },
                })
            })
            .catch((error) => {
                throw new Error(`fetchPromotionDetailAC cause problem with msg ${error}`);
            })
    };

    componentWillReceiveProps(nextProps) {
        // update the state once the schema return the new dataset
        if (this.props.promotionScopeInfo.get('refs')
            !== nextProps.promotionScopeInfo.get('refs')) {
            this.setState({
                shops: nextProps.promotionScopeInfo.getIn(['refs', 'data', 'shops']).toJS(),
                cities: nextProps.promotionScopeInfo.getIn(['refs', 'data', 'cities']).toJS(),
                brands: nextProps.promotionScopeInfo.getIn(['refs', 'data', 'brands']).toJS(),
                groups: nextProps.promotionScopeInfo.getIn(['refs', 'data', 'shopCategorys']).toJS(),
                filteredShops: nextProps.promotionScopeInfo.getIn(['refs', 'data', 'shops']).toJS(),
            })
        }
    }


    renderTree = () => {
        const selectorTabInfo = this.state.selectorTabInfo;
        const cities = this.state.cities;
        const brands = this.state.brands;
        const areas = this.state.areas;


        if (undefined === selectorTabInfo) {
            return
        }

        let component;

        switch (selectorTabInfo.code) {
            case 'org':
                component = this.renderOrgTree();
                break;

            case 'city':
                component = this.renderCityTree()
                break;

            case 'brand':
                component = this.renderBrandTree()
                break;

            case 'group':
                component = this.renderGroupTree()
                break;
            case 'businessPattern':
                component = this.renderBusinessPatternTree()
                break;
            case 'businessMode':
                component = this.renderBusinessModeTree()
                break;
        }

        return component;
    }


    constructorOrgDataToTreeFormat = (records) => {
        // 最大8层

        const result = [];

        for (let i = 1; i <= 8; i++) {
            const arrs = records.filter((record) => {
                return record.depth == i
            });

            if (arrs.length > 0) {
                result.push(arrs);
            } else {
                break;
            }
        }

        for (let j = 0; j < result.length - 1; j++) {
            const currentDepthArr = result[j];
            currentDepthArr.map((parent) => {
                const children = result[j + 1].filter((child) => {
                    return child.parentID == parent.orgID;
                });

                parent.children = children;

                return parent;
            })
        }

        return result[0];
    };

    onOrgTreeCheck = (val) => {
        const checkedOrgSet = new Set(val);

        const orgsWithShop = this.state.orgsInfo.data.filter((org) => {
            return checkedOrgSet.has(org.orgID) && org.orgTypeID == 1;
        });

        this.setState({
            selectedOrgs: orgsWithShop,
        }, () => {
            this.filter()
        })
    }


    // 渲染组织
    renderOrgTree = () => {
        const loop = data => data.map((item) => {
            if (item.children instanceof Array && item.children.length > 0) {
                return (
                    <TreeNode key={item.orgID} title={item.orgName}>
                        {loop(item.children)}
                    </TreeNode>
                )
            }

            return <TreeNode key={item.orgID} title={item.orgName}></TreeNode>
        });

        if (this.state.orgsInfo.initialized) {
            let data = this.state.orgsInfo.data;
            data = this.constructorOrgDataToTreeFormat(data);
            return (
                <Tree
                    checkable={true}
                    onCheck={this.onOrgTreeCheck}

                >
                    {
                        loop(data)
                    }
                </Tree>
            )
        }
        return (
            <div> 组织信息尚未加载成功 </div>
        )
    }
    // checkedKeys={this.state.selectedOrg}

    // 门店组树形结构

    onGroupTreeSelect = () => {

    }

    onGroupTreeCheck = (value) => {
        this.setState({
            selectedGroups: value,
        }, () => {
            this.filter()
        })
    }

    renderGroupTree = () => {
        const groups = this.state.groups;
        return (
            <Tree
                checkable={true}
                onSelect={this.onGroupTreeSelect}
                onCheck={this.onGroupTreeCheck}
                checkedKeys={this.state.selectedGroups}
            >
                {
                    groups.map((group, index) => {
                        return <TreeNode title={group.shopCategoryName} key={index}></TreeNode>
                    })
                }
            </Tree>
        )
    }


    onCityTreeSelect = (value) => {
        // console.log('onCityTreeCheck',value)
    }

    filter = () => {
        const shops = this.state.shops;
        const selectedCities = this.state.selectedCities;
        const selectedBrands = this.state.selectedBrands;
        const selectedGroups = this.state.selectedGroups;

        const selectedOrgs = this.state.selectedOrgs;
        let filteredShops = shops;


        if (selectedOrgs instanceof Array && selectedOrgs.length !== 0) {
            const orgs = new Set(selectedOrgs.map((org) => { return org.shopID }));

            filteredShops = filteredShops
                .filter((shop, index) => {
                    return orgs.has(shop.shopID);
                })
        }

        // filer with city
        if (selectedCities instanceof Array && selectedCities.length !== 0) {
            filteredShops = filteredShops
                .filter((shop, index) => {
                    return selectedCities.reduce((result, item) => {
                        return (this.state.cities[item].cityID == shop.cityID) || result;
                    }, false);
                })
        }

        // filter with brand
        if (selectedBrands instanceof Array && selectedBrands.length !== 0) {
            filteredShops = filteredShops
                .filter((shop) => {
                    return selectedBrands.reduce((result, item) => {
                        return (this.state.brands[item].brandID == shop.brandID) || result;
                    }, false);
                })
        }

        // filter with group
        if (selectedGroups instanceof Array && selectedGroups.length !== 0) {
            filteredShops = filteredShops
                .filter((shop) => {
                    return selectedGroups.reduce((result, item) => {
                        return this.state.groups[item].shopIDs.reduce((val, shopID) => {
                            // Notice: == is more suitable here than ===.
                            return shopID == shop.shopID || val
                        }, false)
                        || result;
                    }, false)
                })
        }


        // update currentSelections

        let currentSelections = this.state.currentSelections;

        const filteredShopsKeysInSet = new Set(filteredShops.map((shop) => {
            return shop.shopID
        }));

        currentSelections = currentSelections.filter((item) => {
            return filteredShopsKeysInSet.has(item)
        });


        // update component state
        this.setState({
            filteredShops,
            currentSelections,
        });
    }

    onCityTreeCheck = (value) => {
        this.setState({
            selectedCities: value,
        }, () => {
            this.filter()
        })
    }


    // render tree component constructed with citys
    renderCityTree = () => {
        const cities = this.state.cities;
        return (
            <Tree
                checkable={true}
                onSelect={this.onCityTreeSelect}
                onCheck={this.onCityTreeCheck}
                checkedKeys={this.state.selectedCities}
            >
                {
                    cities.map((city, index) => {
                        return <TreeNode title={city.cityName} key={`${index}`}></TreeNode>
                    })
                }
            </Tree>
        )
    }


    onBrandTreeCheck = (value) => {
        this.setState({
            selectedBrands: value,
        }, () => {
            this.filter()
        })
    }


    // render tree component with brand infos
    renderBrandTree = () => {
        const brands = this.state.brands;
        return (
            <Tree
                checkable={true}
                onCheck={this.onBrandTreeCheck}
                checkedKeys={this.state.selectedBrands}
            >
                {
                    brands.map((brand, index) => {
                        return <TreeNode title={brand.brandName} key={index}></TreeNode>
                    })
                }
            </Tree>
        )
    }

    handleGroupSelect = (currentSelections) => {
        this.setState({
            currentSelections,
        });
    }

    handleSelectedChange = (val) => {
        if (undefined !== val) {
            const shopID = val.shopID;

            // remove the selected item
            this.setState({
                currentSelections: this.state.currentSelections.filter((item) => {
                    return item != shopID
                }),
            })
        }
    }

    handleShopSelectorStateChange = (selectorTabInfo) => {
        this.setState({
            selectorTabInfo,
        })
    };

    // clear up the whole currentSelections
    handleClearCurrentSelection = () => {
        this.setState({
            currentSelections: [],
        })
    }


    renderFilterConditionInfo = () => {
        const { selectedCities, selectedBrands, selectedGroups } = this.state;


        let citysInfo = null;
        let brandInfo = null;
        let selectedGroupsInfo = null;
        const info = [];

        if (selectedCities instanceof Array && selectedCities.length !== 0) {
            citysInfo = selectedCities.map((cityIndex) => {
                return this.state.cities[cityIndex].cityName
            }).join(',');
        }


        if (selectedBrands instanceof Array && selectedBrands.length !== 0) {
            brandInfo = selectedBrands.map((brandIndex) => {
                return this.state.brands[brandIndex].brandName
            }).join(',');
        }

        if (selectedGroups instanceof Array && selectedGroups.length !== 0) {
            selectedGroupsInfo = selectedGroups.map((index) => {
                return this.state.groups[index].shopCategoryName
            }).join(',');
        }

        if (citysInfo) {
            info.push(citysInfo);
        }

        if (brandInfo) {
            info.push(brandInfo);
        }

        if (selectedGroupsInfo) {
            info.push(selectedGroupsInfo);
        }

        return (
            <div>
                <span>已选条件 :</span>
                {
                    info.length > 0 ? info.join(' / ') : <span>尚未选择过滤条件</span>
                }
            </div>
        )
    }

    render() {
        return (
            <div className={styles.treeSelectMain}>
                <ShopSelectorTabs onChange={this.handleShopSelectorStateChange} />
                <div>
                    {this.renderFilterConditionInfo()}
                </div>
                <div className={styles.treeSelectBody}>
                    <Row>
                        <Col span={8}>
                            <HualalaSearchInput />
                            <div className={styles.SelectLevel1}>

                                <div className={styles.SelectTit}>
                                    {this.props.level1Title}
                                </div>
                                <div>{this.renderTree()}</div>
                            </div>
                        </Col>
                        <HualalaGroupSelect
                            options={this.state.filteredShops}
                            labelKey="shopName"
                            valueKey="shopID"
                            value={this.state.currentSelections}
                            onChange={this.handleGroupSelect}
                        />
                    </Row>
                </div>

                <div className={styles.treeSelectFooter}>
                    <HualalaSelected
                        itemName="shopName"
                        selectdTitle={'已选店铺'}
                        value={
                            this.state.filteredShops.filter((shop) => {
                                return this.state.currentSelections.reduce((val, shopID) => {
                                    return shop.shopID == shopID || val;
                                }, false)
                            })}
                        onChange={(value) => {
                            this.handleSelectedChange(value)
                        }}
                        onClear={() => { this.handleClearCurrentSelection() }}
                    />
                </div>
            </div>
        )
    }
}

ShopsSelector.propTypes = {
    // children: PropTypes.element.isRequired
};

ShopsSelector.defaultProps = {

};


const mapStateToProps = (state) => {
    return {
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        user: state.user,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchSchema: (opts) => {
            dispatch(fetchPromotionScopeInfo(opts))
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopsSelector);
