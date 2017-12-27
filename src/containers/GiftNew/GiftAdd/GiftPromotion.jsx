import { HualalaEditorBox, HualalaTreeSelect, HualalaGroupSelect, HualalaSelected, HualalaSearchInput, CC2PY } from '../../../components/common';
import React from 'react';
import { connect } from 'react-redux';
import { Tree } from 'antd';
import styles from '../../SaleCenterNEW/ActivityPage.less';
import { fetchAllPromotionListAC } from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';

const TreeNode = Tree.TreeNode;
class GiftPromotion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            promotionCollection: [], // 拼好的allPromotionList,目前是所有基础营销活动-》[n个类别]-》活动列表,type
            mutexPromotions: [], // 后台detail拿过来的数据,含之前创建的共享活动idstr数组

            promotionOptions: [], // 当前的已选分类下子项,右侧option选项
            promotionCurrentSelections: [], // 已选打勾子项ID，右侧
            promotionSelections: new Set(), // 已选各个分类下子项，用于下方tag选项

            labelKeyType: 'finalShowName',
            valueKeyType: 'promotionIDStr',

        };

        this.handleTreeNodeChange = this.handleTreeNodeChange.bind(this);
        this.handleGroupSelect = this.handleGroupSelect.bind(this);
        this.handleSelectedChange = this.handleSelectedChange.bind(this);
        this.handleEditorBoxChange = this.handleEditorBoxChange.bind(this);
        this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
        this.clear = this.clear.bind(this);
        this.initialState = this.initialState.bind(this);
    }

    initialState(mutexPromotions, promotionCollection) {
        // 把detail查来的共享活动渲染到下方promotionSelections数组
        if (mutexPromotions === undefined || promotionCollection === undefined) {
            return
        }
        // 遍历活动匹配展示名称
        mutexPromotions.map((promotion) => {
            // 基础营销类
            promotionCollection.map((promotionCategery) => {
                promotionCategery.promotionName.map((saleItem) => {
                    if (saleItem.promotionIDStr == promotion.sharedIDStr) {
                        promotion.finalShowName = saleItem.promotionName || '基础营销活动';
                        promotion.promotionIDStr = promotion.sharedIDStr;
                    }
                })
            })
        })
        this.setState({
            promotionSelections: mutexPromotions,
        });
    }

    componentDidMount() {
        const user = this.props.user;
        // 请求获取promotionList--共享用
        this.props.fetchAllPromotionList({
            groupID: this.props.user.accountInfo.groupID,
        })
        // 活动列表
        const _promotions = this.props.promotionDetailInfo.getIn(['$allPromotionListInfo', 'data', 'promotionTree']).toJS();

        // 用户选择过的互斥活动
        // const _mutexPromotions = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'mutexPromotions']) ? this.props.promotionDetailInfo.getIn(['$promotionDetail', 'mutexPromotions']).toJS() : [];

        // this.setState({  })
        this.setState({
            promotionCollection: _promotions,
            // mutexPromotions: _mutexPromotions,
        }, () => {
            this.initialState(this.state.mutexPromotions, this.state.promotionCollection);
        });
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.promotionDetailInfo.getIn(['$allPromotionListInfo', 'data', 'promotionTree']) !=
            nextProps.promotionDetailInfo.getIn(['$allPromotionListInfo', 'data', 'promotionTree'])
        ) {
            const promotionCollection = nextProps.promotionDetailInfo.getIn(['$allPromotionListInfo', 'data', 'promotionTree']).toJS();
            this.setState({
                promotionCollection,
                promotionSelections: new Set(),
            }, () => {
                this.initialState(this.state.mutexPromotions, this.state.promotionCollection);
            })
        }


        // if (this.props.promotionDetailInfo.getIn(['$promotionDetail', 'mutexPromotions']) !==
        //     nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'mutexPromotions'])
        // ) {
        //     const _mutexPromotions = nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'mutexPromotions']).toJS();
        //     this.setState({
        //         mutexPromotions: _mutexPromotions,
        //     }, () => {
        //         this.initialState(this.state.mutexPromotions, this.state.promotionCollection);
        //     })
        // }
    }

    render() {
        const _promotionCollection = this.state.promotionCollection;
        const promotionSelections = this.state.promotionSelections;

        // 拼左侧树状结构
        const loop = (data) => {
            if (undefined === data) {
                return null
            }
            return data.map((item, index) => {
                return <TreeNode key={index} title={item.promotionType.content} />;
            });
        }
        return (
            <div className={styles.treeSelectMain}>
                <HualalaEditorBox
                    label={'对应基础营销券活动'}
                    itemName={'finalShowName'}
                    itemID={'promotionIDStr'}
                    data={this.state.promotionSelections}
                    onChange={this.handleEditorBoxChange}
                    onTagClose={this.handleSelectedChange}
                >
                    <HualalaTreeSelect level1Title={'营销券活动'}>
                        {/* //搜索框 */}
                        <HualalaSearchInput onChange={this.handleSearchInputChange} />
                        {/* //左侧树 */}
                        <Tree onSelect={this.handleTreeNodeChange} title={'content'}>
                            <TreeNode key={'salePromotion'} title={'基础营销'}>
                                {loop(_promotionCollection)}
                            </TreeNode>
                        </Tree>
                        {/* //右侧复选框 */}
                        <HualalaGroupSelect
                            options={this.state.promotionOptions}
                            labelKey={'finalShowName'}
                            valueKey={'promotionIDStr'}
                            value={this.state.promotionCurrentSelections}
                            onChange={this.handleGroupSelect}
                        />
                        {/* //下方已选的tag */}
                        <HualalaSelected
                            itemName={'finalShowName'}
                            itemID={'promotionIDStr'}
                            selectdTitle={'已选营销券活动'}
                            value={this.state.promotionSelections}
                            onChange={this.handleSelectedChange}
                            onClear={() => this.clear()}
                        />
                    </HualalaTreeSelect>
                </HualalaEditorBox>
            </div>
        );
    }

    // 清空
    clear() {
        const promotionSelections = new Set(this.state.promotionSelections);
        promotionSelections.clear();
        this.setState({
            promotionCurrentSelections: [],
            promotionSelections,
        })
    }

    // 搜索
    handleSearchInputChange(value) {
        const promotionList = this.state.promotionCollection;
        if (undefined === promotionList) {
            return null;
        }

        if (!((promotionList instanceof Array) && promotionList.length > 0)) {
            return null;
        }

        const allMatchItem = [];
        promotionList.forEach((promotions) => {
            promotions.promotionName.forEach((promotion) => {
                if (CC2PY(promotion.promotionName).indexOf(CC2PY(value)) !== -1 || promotion.promotionName.indexOf(CC2PY(value)) !== -1) {
                    allMatchItem.push(promotion);
                }
            });
        });
        const promotionCurrentSelections = [];
        allMatchItem.forEach((storeEntity) => {
            if (new Set(this.state.promotionSelections).has(storeEntity)) {
                promotionCurrentSelections.push(storeEntity.promotionIDStr)
            }
        });
        this.setState({
            promotionOptions: allMatchItem,
            promotionCurrentSelections,
        });
    }

    // 确定或取消
    handleEditorBoxChange(value) {
        // console.log(value);
        const promotionSelections = value;
        const valueKeyType = 'promotionIDStr';
        // update currentSelections according the selections
        const promotionCurrentSelections = [];
        this.state.promotionOptions.forEach((storeEntity) => {
            Array.from(promotionSelections).map((select) => {
                if (select[valueKeyType] == storeEntity[valueKeyType]) {
                    promotionCurrentSelections.push(storeEntity[valueKeyType])
                }
            })
        });

        this.setState({
            promotionSelections: value,
            promotionCurrentSelections,
        }, () => {
            this.props.onChange && this.props.onChange(Array.from(value));
        });
    }

    // 点击移除
    handleSelectedChange(value) {
        const promotionSelections = new Set(this.state.promotionSelections);
        let promotionCurrentSelections = this.state.promotionCurrentSelections;

        if (value !== undefined) {
            promotionSelections.delete(value);
            promotionCurrentSelections = promotionCurrentSelections.filter((item) => {
                return item !== value.promotionIDStr
            })
        }


        this.setState({
            promotionSelections,
            promotionCurrentSelections,
        }, () => {
            this.props.onChange && this.props.onChange(Array.from(promotionSelections));
        });
    }

    // CheckBox选择
    handleGroupSelect(value) {
        if (value instanceof Array) {
            // get the selections
            const selectionsSet = new Set(this.state.promotionSelections);
            const promotionCurrentSelections = this.state.promotionCurrentSelections;
            // 这次选中的列表长度大于上次选中的长度，说明是添加
            if (value.length > promotionCurrentSelections.length) {
                this.state.promotionOptions.map((promotion) => {
                    if (value.includes(promotion.promotionIDStr)) {
                        const selectedArr = (Array.from(selectionsSet)).map((selected) => {
                            return selected.promotionIDStr
                        })
                        if (!selectedArr.includes(promotion.promotionIDStr)) {
                            selectionsSet.add(promotion);
                        }
                    }
                })
            }
            // 这次选中的列表长度小于上次选中的长度，说明是删除
            if (value.length == 0 || value.length < promotionCurrentSelections.length) {
                promotionCurrentSelections.map((promotionIDStr) => {
                    if (!value.includes(promotionIDStr)) {
                        (Array.from(selectionsSet)).map((selected) => {
                            if (selected.promotionIDStr == promotionIDStr) {
                                selectionsSet.delete(selected);
                            }
                        })
                    }
                })
            }
            this.setState({ promotionCurrentSelections: value, promotionSelections: selectionsSet }, () => {
                console.log(this.state.promotionCurrentSelections);
                console.log(Array.from(this.state.promotionSelections));
            });
        }
    }

    // 左侧选择
    handleTreeNodeChange(value, info) {
        let { promotionOptions, promotionSelections, promotionCurrentSelections, labelKeyType, valueKeyType } = this.state;

        if (value === undefined || value[0] === undefined) {
            return null;
        }

        if (value[0] !== 'salePromotion' && value[0] !== 'hualala' && value[0] !== 'userRight') {
            // 普通基础营销
            const indexArray = value[0].split('-').map((val) => {
                return parseInt(val)
            });
            // 存储右侧 checkBox 选项,当前已选类别所有活动
            let storeOptions = [];
            if (indexArray.length === 1) {
                storeOptions = storeOptions.concat(this.state.promotionCollection[indexArray[0]].promotionName);
            } else if (indexArray.length === 2) {
                storeOptions = storeOptions.concat(this.state.promotionCollection[indexArray[0]].children[indexArray[1]].children);
            }
            promotionOptions = storeOptions;
        }
        const _promotionCurrentSelections = [];
        promotionOptions.forEach((storeEntity) => {
            Array.from(promotionSelections).map((promotion) => {
                if (promotion[valueKeyType] == storeEntity[valueKeyType]) {
                    _promotionCurrentSelections.push(storeEntity[valueKeyType])
                }
            })
        });
        this.setState({
            promotionOptions,
            promotionCurrentSelections: _promotionCurrentSelections,
        })
    }
}

const mapStateToProps = (state) => {
    return {
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        myActivities: state.sale_myActivities_NEW,
        user: state.user.toJS()
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllPromotionList: (opts) => {
            dispatch(fetchAllPromotionListAC(opts))
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(GiftPromotion);
