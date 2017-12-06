/*
 *组件名称：TreeSelect (树选择)
 * 功能：树状多选
 * 张亚男   2016/12/09
 */
import React, { Component } from 'react';
import { Input, Icon, Button, Tree, Row, Col, Checkbox, message, Table, Popconfirm } from 'antd';
import { connect } from 'react-redux';

const Search = Input.Search;
const CheckboxGroup = Checkbox.Group;
import Immutable, { List } from 'immutable';
import styles from './treeSelect.less';
import { Iconlist } from '../../basic/IconsFont/IconsFont';

import CC2PY from '../CC2PY';
import {
    fetchFoodCategoryInfoAC,
    fetchFoodMenuInfoAC,
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenter/promotionDetailInfo.action';

/*
 搜索框组件
 */
const TreeNode = Tree.TreeNode;
/*
 const x = 3;
 const y = 2;
 const z = 1;
 const gData = [];
 const generateData = (_level, _preKey, _tns) => {
 const preKey = _preKey || '0';
 const tns = _tns || gData;

 const children = [];
 for (let i = 0; i < x; i++) {
 const key = `${preKey}-${i}`;
 tns.push({ title: key, key });
 if (i < y) {
 children.push(key);
 }
 }
 if (_level < 0) {
 return tns;
 }
 const level = _level - 1;
 children.forEach((key, index) => {
 tns[index].children = [];
 return generateData(level, key, tns[index].children);
 });
 };

 generateData(z);

 const dataList = [];
 const generateList = (data) => {
 for (let i = 0; i < data.length; i++) {
 const node = data[i];
 const key = node.key;
 dataList.push({ key, title: key });
 if (node.children) {
 generateList(node.children, node.key);
 }
 }
 };

 generateList(gData);

 const getParentKey = (key, tree) => {
 let parentKey;
 for (let i = 0; i < tree.length; i++) {
 const node = tree[i];
 if (node.children) {
 if (node.children.some(item => item.key === key)) {
 parentKey = node.key;
 } else if (getParentKey(key, node.children)) {
 parentKey = getParentKey(key, node.children);
 }
 }
 }
 return parentKey;
 };
 */


class SearchInput extends Component {
    constructor(props) {
        super(props);
    }
    handleInputChange = (e) => {
        this.props.onChange(e.target.value);
    }
    render() {
        return (<Input
            addonBefore={<Icon type="search" />}
            placeholder="请选择"
            onChange={this.handleInputChange}
            onFocus={this.props.onFocus}
        />);
    }
}

class SelectLevel1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.treeData[0][this.props.levelsNames],
            ulDisplay: 'normal-ul',
        };
    }
    onChange=(item) => {
        this.props.onchange(item);
        this.props.onFocus();
    }
    handleUlDisplay=() => {
        this.setState({
            ulDisplay: (this.state.ulDisplay == 'normal-ul' ? 'ul-hide' : 'normal-ul'),
        })
    }
    render() {
        return (
            <Col span={8}>
                <div className={styles.SelectLevel1}>
                    <div className={styles.SelectTit} onClick={() => { this.handleUlDisplay() }}>
                        {this.props.level1Title}
                    </div>
                    <ul className={this.state.ulDisplay}>
                        {
                            this.props.treeData.map((item, index) => {
                                const province = item[this.props.levelsNames];
                                return (
                                    <a className={styles.Selectlia} key={`${province.content}${index}`}>
                                        <li
                                            key={`${province.content}-${index}`}
                                            className={[item.selected, styles.SelectLi].join(' ')}
                                            onClick={() => { this.onChange(index) }}
                                        >
                                            {province.content}
                                        </li>
                                    </a>)
                            })
                        }
                    </ul>
                </div>
            </Col>
        );
    }
}

class SelectLevel2 extends Component {
    constructor(props) {
        super(props);
        const array = []
        if (this.props.selectedCities) {
            this.props.selectedCities.map((item) => {
                array.push(item.content);
            })
        }

        this.plainOptions = [];
        if (this.props.plainOptions) {
            this.props.plainOptions.map((item) => {
                this.plainOptions.push(item.content);
            })
        }

        this.state = {
            checkedList: array,
            indeterminate: false,
            checkAll: false,
        };
    }

    componentDidMount() {
        this.setState({ plainOptions: this.props.treeData[0][this.props.childrenNames] });
    }
    onChange=(checkedList) => {
        this.setState({
            checkedList,
            indeterminate: false,
            checkAll: checkedList.length === this.props.plainOptions.length,
        }, () => {
            const array = this.props.plainOptions.filter((item, idx, array) => {
                return (this.state.checkedList.indexOf(item.content) != -1)
            })

            this.props.onChange(array);
        });
    }
    onCheckAllChange=(e) => {
        let array = [],
            list = [];
        if (e.target.checked) {
            this.props.plainOptions.map((item) => {
                array.push(item.content);
                list.push(item);
            })
        }

        this.setState({
            checkedList: e.target.checked ? array : [],
            indeterminate: false,
            checkAll: e.target.checked,
        }, () => {
            /* let array =this.props.plainOptions.filter((item,idx,array)=>{
             return (this.state.checkedList.indexOf(item.content)!= -1)
             }) */
            this.props.onChange(list);
        });
    }
    componentWillReceiveProps(props) {
        const array = [];
        if (props.selectedCities) {
            props.selectedCities.map((item) => {
                array.push(item.content);
            })
        }
        this.plainOptions = [];
        props.plainOptions.map((item) => {
            this.plainOptions.push(item.content);
        })
        this.setState({
            checkedList: array,
        })
        if (!props.selectedCities || (props.selectedCities.length != props.plainOptions.length)) {
            this.setState({
                checkAll: false,
            })
        } else {
            this.setState({
                checkAll: true,
            })
        }
    }

    render() {
        return (
            <Col span={16} style={{ paddingLeft: 10 }}>
                <div className={styles.SelectLevel2}>
                    <div className={styles.SelectLevelTop}>
                        <div className={styles.Sche}>
                            <Checkbox indeterminate={this.state.indeterminate} onChange={this.onCheckAllChange} checked={this.state.checkAll}>

                            </Checkbox>
                        </div>
                        <div className={styles.Stit}>
                            {this.props.level2Title}
                        </div>
                    </div>
                    <div className={styles.SelectLevelB}>
                        <CheckboxGroup options={this.plainOptions} value={this.state.checkedList} onChange={this.onChange} />
                    </div>
                </div>
            </Col>
        );
    }
}

class Selected extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: this.props.showItems || [],
            columns: [
                {
                    title: '菜品',
                    dataIndex: 'dishes',
                    key: 'dishes',
                    fixed: 'left',
                    width: 160,
                    className: 'TableTxtLeft',
                },
                {
                    title: '编码',
                    dataIndex: 'code',
                    key: 'code',
                    fixed: 'left',
                    width: 90,
                    className: 'TableTxtCenter',
                },
                {
                    title: '分类',
                    dataIndex: 'category',
                    key: 'category',
                    width: 90,
                    className: 'TableTxtLeft',
                },
                {
                    title: '原价 (元)',
                    dataIndex: 'originalPrice',
                    key: 'originalPrice',
                    width: 85,
                    className: 'TableTxtRight',
                },
                {
                    title: '折扣',
                    dataIndex: 'salePercent',
                    key: 'salePercent',
                    width: 80,
                    className: 'TableTxtRight',
                    render: (text, record, index) => {
                        return `${Math.ceil(record.newPrice / record.originalPrice * 100)}%`
                    },
                },
                {
                    title: '特价 (元)',
                    width: 85,
                    dataIndex: 'newPrice',
                    key: 'newPrice',
                    className: 'TableTxtRight',
                    render: (text, record, index) => {
                        // TODO: fix the dispaly bug later
                        return (<span>
                            <Icon type="edit" />
                            <Input
                                type="text"
                                onClick={e => this.selected(e)}
                                ref={(input) => {
                                    this[`_input${index}`] = input
                                }}
                                defaultValue={text}
                                id={`${index}`}
                                onBlur={e => this.handleChange(e)}
                                onPressEnter={e => this.handleChange(e)}
                            />
                        </span>)
                    },
                }],
        }
        this.selected = this.selected.bind(this);
    }
    selected(e) {
        ReactDOM.findDOMNode(this[`_input${e.target.id}`]).select();
    }
    handleChange(e) {
        const { dataSource } = this.state;

        dataSource[e.target.id].newPrice = e.target.value;
        dataSource[e.target.id].salePercent = `${Math.ceil((e.target.value / dataSource[e.target.id].originalPrice) * 100)}%`;
        this.setState({ dataSource });
        this.props.callback && this.props.callback(dataSource);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.showItems != nextProps.showItems) {
            const $foodMenuListInfo = nextProps.promotionDetailInfo.getIn(['$foodMenuListInfo', 'data', 'records']).toJS();
            const selectedDishesInfo = nextProps.showItems
                .map((dishes) => {
                    return $foodMenuListInfo
                        .filter((foodItem) => {
                            return foodItem.foodID == dishes.id
                        })[0];
                });
            const dataSource = selectedDishesInfo
                .map((data, index) => {
                    return {
                        key: `${index}`,
                        dishes: data.foodName,
                        unit: data.unit,
                        code: data.foodCode,
                        category: data.foodCategoryName,
                        originalPrice: data.price,
                        newPrice: data.price,
                        salePercent: `${data.price / data.price * 100}%`,
                        foodUnitID: data.foodID,
                        foodUnitKey: data.foodKey,
                        foodID: data.foodID,
                    }
                });

            this.setState({
                dataSource,
            });
            this.props.callback && this.props.callback(dataSource);
        }
    }

    render() {
        return (
            <div className={styles.SelectedLi}>
                <div className={styles.SelectedLiT}><span>{this.props.selectdTitle}</span>（单击移除）</div>
                <Table bordered={true} dataSource={this.state.dataSource} columns={this.state.columns} pagination={false} scroll={{ x: 590, y: 170 }} />
            </div>
        );
    }
}


class TreeSelectTable extends Component {
    constructor(props) {
        super(props);
        const treelist = [];
        this.allItem = [];
        this.allItemPY = []
        this.deletList = [];
        this.props.treeData.map((item, idx) => {
            treelist.push(Object.assign({}, item));
        });
        // this.props.tagName && this.deleteCity(this.props.tagName);
        if (treelist && treelist.length > 0) {
            treelist.map((itm, idx) => {
                itm.selected = 'noSel';
                const children = itm[this.props.childrenNames]
                const array = [];
                if (children) {
                    children.map((item, index) => {
                        /* if(item){
                         item["PY"] = CC2PY(item);
                         } */
                        this.allItem.push(item);
                        this.allItemPY.push(CC2PY(item.content));
                        this.props.showItems.map((shop) => {
                            if (shop.id == item.id) {
                                array.push(shop);
                            }
                        })
                    })
                }
                itm.selectedCities = array;
            });
            if (treelist[0]) {
                treelist[0].selected = 'selected';
            }

            this.state = {
                level1Title: this.props.level1Title,
                level2Title: this.props.level2Title,
                selectdTitle: this.props.selectdTitle,
                // showItems:[],
                showItems: this.props.showItems,
                treeData: treelist, // this.props.treeData.slice(0),//new Array(...this.props.treeData.slice(0)),//.slice()
                index: 0,
                searchResult: this.allItem,
                plainOptions: treelist[0][this.props.childrenNames],
            }
        }
    }
    error = () => {
        message.error('This is a message of error');
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.tagNames) {
            if (this.deletList.length == 0 || (nextProps.tagNames[0] !== this.deletList[0])) {
                this.deletList = [];
                nextProps.tagNames.map((item) => {
                    this.deletList.push(item);
                })
                if (nextProps.tagNames.length != 0) {
                    this.deleteCity(nextProps.tagNames);
                }
            }
        }
    }

    componentWillUnmount() {
        this.allItem = [];
        this.state.searchResult = [];
    }

    componentDidUpdate() {

    }

    handleLevel1Change=(index) => {
        this.state.treeData.map((itm, idx) => {
            this.state.treeData[idx].selected = 'noSel'
        });
        this.state.treeData[index].selected = 'selected';

        this.setState({
            index,
            plainOptions: this.state.treeData[index][this.props.childrenNames],
        });
    }
    handleLevel2Change=(selectedCities) => {
        const index = this.state.index;
        this.state.treeData[index].selectedCities = selectedCities;
        const showItems = [];
        this.state.treeData.map((item, index) => {
            if (item.selectedCities) {
                item.selectedCities.map((itm, idx) => {
                    showItems.push(itm)
                })
            }
        })
        this.setState({
            showItems,
        }, function () {
            if (this.props.onTreeChange) {
                this.props.onTreeChange();
            }
        });
    }

    deleteCity=(item) => {
        if (Array.isArray(item)) {
            let newShowItems = this.state.showItems;
            item.map((ele) => {
                newShowItems = newShowItems.filter((itm) => {
                    return (itm.id != ele.id)
                })
                this.state.treeData.map((itm, idx) => {
                    if (itm.selectedCities) {
                        const newSelects = itm.selectedCities.filter((it, idx, array) => {
                            return (it.id != ele.id)
                        })
                        itm.selectedCities = newSelects;
                    }
                })
            })
            this.setState({
                showItems: newShowItems,
            });
        } else {
            const newShowItems = this.state.showItems.slice().filter((itm, idx, array) => {
                return (itm.id != item.id)
            })
            this.state.treeData.map((itm, idx) => {
                if (itm.selectedCities) {
                    const newSelectes = itm.selectedCities.filter((it, idx, array) => {
                        return (it.id != item.id)
                    })
                    itm.selectedCities = newSelectes;
                }
            })
            this.setState({
                showItems: newShowItems,
            });
        }
    }

    handleClear=() => {
        const treeData = this.state.treeData.map((item, index) => {
            item.selectedCities = item.selectedCities ? [] : [];
            return item
        })
        this.setState({
            showItems: [],
            treeData,
        })
    }

    render() {
        let plainOptions;
        if (this.state.focus == '2') {
            plainOptions = this.state.searchResult;
        } else {
            plainOptions = this.state.plainOptions
        }

        const level1Props = {
            level1Title: this.state.level1Title,
            treeData: this.state.treeData,
            levelsNames: this.props.levelsNames,
            childrenNames: this.props.childrenNames,
            style: {
                width: 300,
            },
            onchange: this.handleLevel1Change,
            onFocus: () => {
                this.setState({
                    focus: '1',
                })
            },
        };
        const level2Props = {
            level2Title: this.state.level2Title,
            treeData: this.state.treeData,
            plainOptions,
            levelsNames: this.props.levelsNames,
            childrenNames: this.props.childrenNames,
            selectedCities: this.state.treeData[this.state.index].selectedCities,
            style: {
                width: 300,
            },
            onChange: this.handleLevel2Change,
        };
        const selectedProps = {
            selectdTitle: this.state.selectdTitle,
            showItems: this.state.showItems,
            onChange: this.deleteCity,
            promotionDetailInfo: this.props.promotionDetailInfo,
            setPromotionDetail: this.props.setPromotionDetail,
            callback: this.props.callback,
        };

        return (
            <div className={styles.treeSelectMain}>
                <SearchInput
                    onChange={(value) => {
                        let list
                        if (!value) {
                            list = this.allItem
                        } else {
                            list = this.allItem.filter((node, index) => {
                                if (node.content.indexOf(value) != -1 || this.allItemPY[index].indexOf(value) != -1) {
                                    return true;
                                }
                                return false;
                            });
                        }
                        this.setState({
                            searchResult: list,
                        })
                    }}

                    onFocus={() => {
                        this.setState({
                            focus: '2',
                        })
                    }}


                />
                <div className={styles.treeSelectBody}>
                    <Row>
                        <SelectLevel1 {...level1Props} />
                        <SelectLevel2 {...level2Props} />
                    </Row>
                </div>
                <div className={styles.treeSelectFooter}>
                    <Selected {...selectedProps} />
                    <div onClick={this.handleClear} className={styles.Tclear}>清空</div>
                </div>

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        promotionDetailInfo: state.promotionDetailInfo,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setPromotionDetail: (opts) => {
            dispatch(saleCenterSetPromotionDetailAC(opts))
        },

        fetchFoodCategoryInfo: (opts) => {
            dispatch(fetchFoodCategoryInfoAC(opts))
        },

        fetchFoodMenuInfo: (opts) => {
            dispatch(fetchFoodMenuInfoAC(opts))
        },
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(TreeSelectTable);
