/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-04-01T17:02:43+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: deepTreeSelect.jsx
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-07T18:43:45+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */


/*
 *组件名称：TreeSelect (树选择)
 * 功能：树状多选
 * 杨珂   2016/12/09
 */
import React, { Component } from 'react'
import { Input, Icon, Button, Row, Col, Checkbox, Tree } from 'antd';

const Search = Input.Search;
const CheckboxGroup = Checkbox.Group;

import styles from './treeSelect.less';
import { Iconlist } from '../../basic/IconsFont/IconsFont';

import CC2PY from '../CC2PY';

/*
 搜索框组件
 */
const TreeNode = Tree.TreeNode;

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
    onChange=(item, e) => {
        this.props.onchange(item);
        this.props.onFocus();
    }
    handleUlDisplay=() => {
        this.setState({
            ulDisplay: (this.state.ulDisplay == 'normal-ul' ? 'ul-hide' : 'normal-ul'),
        })
    }
    render() {
        /*
        this.props.treeData.map((item,index)=>{
            let province=item[this.props.levelsNames];
            return (
                <a className={styles.Selectlia} key={`${province.content}${index}`}>
                    <li key={`${province.content}-${index}`}
                        className={[item.selected, styles.SelectLi].join(' ')}
                        onClick={()=>{this.onChange(index)}}>
                        {province.content}
                    </li>
                </a>)
        })
        titleField : this.props.titleField,
        keyField :this.props.keyField,
        */
        return (
            <Col span={8}>
                <div className={styles.SelectLevel1}>
                    <div className={styles.SelectTit} onClick={() => { this.handleUlDisplay() }}>
                        {/* <Iconlist iconName={'youjiantou'} className="youjiantou"/> */}
                        {this.props.level1Title}
                    </div>
                    <ul className={this.state.ulDisplay}>
                        {
                            <Tree
                                titleField={this.props.titleField}
                                keyField={this.props.keyField}
                                treeData={this.props.treeData}
                                onSelect={this.onChange}
                            />

                        }
                    </ul>
                </div>
            </Col>
        );
    }
}
const selected = 'selected';

class SelectLevel2 extends Component {
    constructor(props) {
        super(props);
        const array = [];
        if (this.props.selectedCities) {
            this.props.selectedCities.map((item) => {
                array.push(item[this.props.levelsNames]);
            })
        }

        this.plainOptions = [];
        if (this.props.plainOptions) {
            this.props.plainOptions.map((item) => {
                this.plainOptions.push(item[this.props.levelsNames]);
            })
        }

        this.state = {
            checkedList: array,
            indeterminate: false,
            checkAll: false,
        };
    }

    componentDidMount() {
        this.setState({ plainOptions: this.props.searchInTree(this.props.treeData[0][this.props.childrenNames], '', true) });// this.props.treeData[0][this.props.childrenNames]
    }

    onChange=(checkedList) => {
        this.setState({
            checkedList,
            indeterminate: false,
            checkAll: checkedList.length === this.props.plainOptions.length,
        }, () => {
            const array = this.props.plainOptions.filter((item, idx, array) => {
                return (this.state.checkedList.indexOf(item[this.props.levelsNames]) != -1)
            })

            this.props.onChange(array);
        });
    }

    onCheckAllChange=(e) => {
        let array = [],
            list = [];
        if (e.target.checked) {
            this.props.plainOptions.map((item) => {
                array.push(item[this.props.levelsNames]);
                list.push(item);
            })
        }

        // console.log(array);

        this.setState({
            checkedList: e.target.checked ? array : [],
            indeterminate: false,
            checkAll: e.target.checked,
        }, () => {
            /* let array =this.props.plainOptions.filter((item,idx,array)=>{
             return (this.state.checkedList.indexOf(item[this.props.levelsNames])!= -1)
             }) */
            // console.log(list);
            this.props.onChange(list);
        });
    }
    componentWillReceiveProps(props) {
        const array = [];
        if (props.selectedCities) {
            props.selectedCities.map((item) => {
                array.push(item[this.props.levelsNames]);
            })
        }
        this.plainOptions = [];
        props.plainOptions.map((item) => {
            this.plainOptions.push(item[this.props.levelsNames]);
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
    /* componentWillUnmount(){
     console.log("SelectLevel2Unmount")
     console.log(this.state.checkedList)
     } */
    render() {
        // console.log(this.props.plainOptions);
        return (
            <Col span={16} style={{ paddingLeft: 10 }}>
                <div className={styles.SelectLevel2}>
                    <div className={styles.SelectLevelTop}>
                        <div className={styles.Sche}>
                            <Checkbox
                                indeterminate={this.state.indeterminate}
                                onChange={this.onCheckAllChange}
                                checked={this.state.checkAll}
                            >

                            </Checkbox>
                        </div>
                        <div className={styles.Stit}>
                            {this.props.level2Title}
                        </div>
                    </div>
                    <div className={styles.SelectLevelB}>
                        <CheckboxGroup
                            options={this.plainOptions}
                            value={this.state.checkedList}
                            onChange={this.onChange}
                        />
                    </div>
                </div>
            </Col>
        );
    }
}

class Selected extends Component {
    constructor(props) {
        super(props);
    }

    /* componentWillUnmount(){
     console.log("SelectedUnmount");
     } */

    render() {
        return (
            <div className={styles.SelectedLi}>
                <div className={styles.SelectedLiT}><span>{this.props.selectdTitle}</span>（单击移除）</div>
                <ul className={styles.SelectedLiB}>
                    {this.props.showCities.map((item, index) => {
                        return (<li key={index} onClick={() => { this.props.onChange(item) }}>{item[this.props.levelsNames]}</li>)
                    })}
                </ul>
            </div>
        );
    }
}


/**
 * treelist props description
 * @params {Array} treeData: treeData should be an array
 */
export default class TreeSelect extends Component {
    constructor(props) {
        super(props);
        const treelist = [];
        this.allItem = [];
        this.allItemPY = []
        this.deletList = [];

        this.props.treeData.map((item, idx) => {
            treelist.push(Object.assign({}, item));
        })
        // this.props.tagName && this.deleteItem(this.props.tagName);

        this.treeCopy = this.convertTree(treelist);

        this.state = {
            focus: '1',
            level1Title: this.props.level1Title,
            level2Title: this.props.level2Title,
            selectdTitle: this.props.selectdTitle,
            showCities: this.props.showCities,
            treeData: treelist, // this.props.treeData.slice(0),//new Array(...this.props.treeData.slice(0)),//.slice()
            index: treelist[0][this.props.keyField],
            searchResult: this.allItem,
            plainOptions: this.searchInTree(treelist[0][this.childrenNames], '', true),
        }

        this.flag = true;
    }


    convertTree = (treelist) => {
        let treeCopy = [],
            childrenNames = this.props.childrenNames,
            childFatherFlag;

        treelist.map((itm, idx) => {
            const item = {
                ...itm,
            }

            const children = itm[childrenNames]
            if (children && children[0]) {
                childFatherFlag = (itm[childrenNames][0][childrenNames]
                && itm[childrenNames][0][childrenNames][0]);
                if (!childFatherFlag) { // itm['isLeafFather']
                    children.map((it, index) => {
                        it.isLeaf = true;
                        this.allItem.push(it);
                        this.allItemPY.push(CC2PY(it[this.props.levelsNames]));
                    })
                    itm.isLeafFather = true;
                    item.isLeafFather = true;
                    item.children = null;
                } else {
                    if (this.props.childrenNames !== 'children') {
                        itm.children = itm[this.props.childrenNames];
                        itm[this.props.childrenNames] = null;
                        item[this.props.childrenNames] = null;
                    }
                    this.childrenNames = 'children';
                    item.children = this.convertTree(children)
                }
            }
            treeCopy.push(item);
        });
        // console.log(treelist[0]);
        treelist[0].selected = 'selected';
        return treeCopy
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.tagNames) {
            // console.log(nextProps.tagNames);
            // console.log(this.deletList);
            if (this.deletList.length == 0 || (nextProps.tagNames[0] !== this.deletList[0])) {
                // console.log(nextProps.tagNames);
                // console.log(this.deletList);
                this.deletList = [];
                nextProps.tagNames.map((item) => {
                    this.deletList.push(item);
                })
                if (nextProps.tagNames.length != 0) {
                    this.deleteItem(nextProps.tagNames);
                }
            }
        }
    }

    componentWillUnmount() {
        this.props.callback && this.props.callback(this.state.showCities);
        this.allItem = [];
        this.state.searchResult = [];
    }

    searchInTree = (tree, key, selected, condition) => {
        /* if(!this.flag&&!selected){
            return[];
        } */
        let plainOptions = [];
        if (key == '') {
            selected = true;
        }
        if (tree && tree.length != 0) {
            for (let i = 0; i < tree.length; i++) { // &&!flag
                if (tree[i][this.props.keyField] == key || selected) {
                    if (!selected) {
                        this.flag = selected;
                    }
                    // tree[i].selected = 'selected';
                    if (tree[i][this.childrenNames]) {
                        if (tree[i].isLeafFather) {
                            tree[i][this.childrenNames].map((e) => {
                                if (condition) {
                                    if (condition(e)) {
                                        plainOptions.push(e);
                                    }
                                } else {
                                    plainOptions.push(e);
                                }
                            })
                        } else {
                            plainOptions
                                = plainOptions.concat(
                                    this.searchInTree(tree[i][this.childrenNames],
                                        key,
                                        true,
                                        condition
                                    ));
                        }
                    }
                } else {
                    // tree[i].selected = 'noSel';
                    if (tree[i][this.childrenNames]) {
                        if (!tree[i].isLeafFather) {
                            plainOptions = plainOptions.concat(
                                this.searchInTree(tree[i][this.childrenNames],
                                    key,
                                    false,
                                    condition
                                ));
                        }
                    }
                }
            }
            return plainOptions;
        }
    }

    handleLevel1Change=(index) => {
        this.setState({
            index,
            plainOptions: this.searchInTree(this.state.treeData, index, false),
        });
    }

    handleLevel2Change=(selectedCities) => {
        const index = this.state.index;
        this.searchInTree(this.state.treeData, index, false, (item) => {
            if (selectedCities.filter((itm) => {
                return item[this.props.levelsNames] == itm[this.props.levelsNames]
            }).length != 0) {
                item[selected] = true;
            } else {
                item[selected] = false;
            }
            return false;
        });

        const showCities = [];
        this.allItem.map((item, index) => {
            if (item[selected]) {
                showCities.push(item);
            }
        });
        this.setState({
            showCities,
        }, function () {
            this.props.callback && this.props.callback(this.state.showCities);
        });
    };

    deleteItem=(item) => {
        let newShowCities = [];
        // console.log(item,'item--------------');

        if (Array.isArray(item)) {
            item.map((ele) => {
                newShowCities = this.state.showCities.filter((itm) => {
                    return (itm[this.props.keyField] != ele[this.props.keyField])
                })
            });
            this.allItem.map((it, index) => {
                if (newShowCities.filter((itm) => {
                    return it[this.props.levelsNames] == itm[this.props.levelsNames]
                }).length != 0) {
                    it[selected] = true;
                } else {
                    it[selected] = false;
                }
            });

            this.setState({
                showCities: newShowCities,
            }, function () {
                this.props.callback && this.props.callback(this.state.showCities);
            });
        } else {
            newShowCities = this.state.showCities.filter((itm, idx, array) => {
                return (itm[this.props.keyField] != item[this.props.keyField])
            });
            /* this.state.treeData.map((itm,idx)=>{
                if(itm.selectedCities){
                    let newSelectes=itm.selectedCities.filter((it,idx,array)=>{
                        return (it[this.props.keyField]!=item[this.props.keyField])
                    })
                    itm.selectedCities=newSelectes;
                }
            }) */
            this.allItem.map((it, index) => {
                if (it[this.props.keyField] == item[this.props.keyField]) {
                    it[selected] = false;
                }
            });
            this.setState({
                showCities: newShowCities,
            }, function () {
                this.props.callback && this.props.callback(this.state.showCities);
            });
        }
    }

    handleClear=() => {
        this.allItem.map((it, index) => {
            it[selected] = false;
        });
        this.setState({ showCities: [] }, function () {
            this.props.callback && this.props.callback(this.state.showCities);
        })
    }

    render() {
        let plainOptions;
        if (this.state.focus == '2') {
            plainOptions = this.state.searchResult;
        } else {
            plainOptions = this.state.plainOptions
        }

        this.props.getResult && this.props.getResult(this.state.showCities);

        const level1Props = {
            level1Title: this.state.level1Title,
            treeData: this.treeCopy, // this.state.treeData,
            levelsNames: this.props.levelsNames,
            childrenNames: this.childrenNames,
            titleField: this.props.titleField,
            keyField: this.props.keyField,
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
            childrenNames: this.childrenNames,
            titleField: this.props.titleField,
            keyField: this.props.keyField,
            searchInTree: this.searchInTree,
            selectedCities: this.searchInTree(this.props.treeData, this.state.index, false, (item) => {
                return item[selected]
            }),
            style: {
                width: 300,
            },
            onChange: this.handleLevel2Change,
        };
        const selectedProps = {
            levelsNames: this.props.levelsNames,
            childrenNames: this.childrenNames,
            selectdTitle: this.state.selectdTitle,
            showCities: this.state.showCities,
            onChange: this.deleteItem,
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
                                if (node[this.props.levelsNames].indexOf(value) != -1 || this.allItemPY[index].indexOf(value) != -1) {
                                    return true;
                                }
                                return false;
                            });
                        }
                        // console.log(value,'--------value---------')
                        // console.log(list,'--------list---------')
                        this.setState({
                            searchResult: list,
                        })
                    }}
                    onFocus={() => {
                        this.setState({
                            focus: '2',
                            index: '',
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
