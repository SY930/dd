/*
AUTH: wangsen 2018/04/02 qq:295656753
DEMO:

<HualalaModal
    outLabel={'活动执行角色'} //   外侧选项+号下方文案
    outItemName="roleName" //   外侧已选条目选项的label
    outItemID="roleID" //   外侧已选条目选项的value

    innerleftTitle={'全部执行角色'} //   内部左侧分类title
    innerleftLabelKey={'roleGroupName.content'}//   内部左侧分类对象的哪个属性为展示分类label
    leftToRightKey={'roleName'} // 点击左侧分类，的何种属性展开到右侧

    innerRightLabel="roleName" //   内部右侧checkbox选项的label
    innerRightValue="roleID" //   内部右侧checkbox选项的value

    innerBottomTitle={'已选执行角色'} //   内部底部box的title
    innerBottomItemName="roleName" //   内部底部已选条目选项的label

    treeData={roleCollection} // 树形全部数据源【{}，{}，{}】
    data={roleSelections} // 已选条目数组【{}，{}，{}】】,编辑时向组件内传递值
    onChange={(value) => {
        // 组件内部已选条目数组【{}，{}，{}】,向外传递值
        this.props.onChange && this.props.onChange(value)
    }}
/>

*/

import { HualalaEditorBox, HualalaTreeSelect, HualalaGroupSelect, HualalaSelected, HualalaSearchInput, CC2PY } from '../../../components/common';
import React from 'react';
import { Tree } from 'antd';
import { fromJS, is } from 'immutable';
import styles from '../ActivityPage.less';

const TreeNode = Tree.TreeNode;

class BaseHualalaModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            leftTreeData: Array.isArray(props.treeData) ? [...props.treeData] : [],
            rightOptionsData: [],
            hadSelected: Array.isArray(props.data) ? [...props.data] : [],
            CurrentSelections: [],
        };

        this.handleTreeNodeChange = this.handleTreeNodeChange.bind(this);
        this.handleGroupSelect = this.handleGroupSelect.bind(this);
        this.handleSelectedChange = this.handleSelectedChange.bind(this);
        this.handleEditorBoxChange = this.handleEditorBoxChange.bind(this);
        this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
        this.clear = this.clear.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (!is(fromJS(this.props.treeData), fromJS(nextProps.treeData)) || !is(fromJS(this.props.data), fromJS(nextProps.data))) {
            const hadSelected = Array.isArray(nextProps.data) ? [...nextProps.data] : [];
            const CurrentSelections = [];
            let { rightOptionsData } = this.state;

            // 左侧树数据变化   右侧选项置空   需重新选左侧
            rightOptionsData = []

            rightOptionsData.forEach((entity) => {
                if (hadSelected.findIndex(item => item[nextProps.innerRightValue] === entity[nextProps.innerRightValue]) > -1) {
                    CurrentSelections.push(entity[nextProps.innerRightValue])
                }
            });
            this.setState({
                leftTreeData: nextProps.treeData,
                hadSelected,
                CurrentSelections,
                rightOptionsData
            })
        }
    }

    render() {
        const { outItemName = '', outItemID = '', innerleftLabelKey = '', innerRightLabel = '', innerRightValue = '', innerBottomItemName = '' } = this.props
        const { outLabel = '', innerleftTitle = '', innerBottomTitle = '' } = this.props
        // loop左侧类别树
        const { leftTreeData, hadSelected = [] } = this.state;
        const loop = (data) => {
            if (undefined === data) {
                return null
            }
            const getTitle = (item) => {
                return (innerleftLabelKey || '').split('.').reduce((pre, cur) => pre[cur], item)
            }
            return data.map((item, index) => {
                return <TreeNode key={index} title={getTitle(item)} />;
            });
        };
        return (
            <div className={styles.treeSelectMain}>
                <HualalaEditorBox
                    label={outLabel} // 外层➕下方文案
                    itemName={outItemName} // 外层已选，条目对应的展示name的key
                    itemID={outItemID} // 外层已选，条目对应的展示id的key
                    data={hadSelected} // 外层已选，展示条目数据s
                    onChange={this.handleEditorBoxChange}
                    onTagClose={this.handleSelectedChange}
                >
                    <HualalaTreeSelect level1Title={innerleftTitle}>
                        <HualalaSearchInput onChange={this.handleSearchInputChange} />
                        <Tree onSelect={this.handleTreeNodeChange}>
                            {loop(leftTreeData)}
                        </Tree>
                        <HualalaGroupSelect
                            options={this.state.rightOptionsData} // Modal内右侧可选项s
                            labelKey={innerRightLabel} // Modal内右侧可选项的label的key
                            valueKey={innerRightValue} // Modal内右侧可选项value的key
                            value={this.state.CurrentSelections} // Modal内右侧已勾选项s
                            onChange={this.handleGroupSelect}
                        />
                        <HualalaSelected
                            selectdTitle={innerBottomTitle} // Modal内下侧框title
                            itemName={innerBottomItemName} // Modal内下侧已选条目展示name对应的key
                            value={hadSelected} // Modal内下侧已选项s
                            onChange={this.handleSelectedChange}
                            onClear={() => this.clear()}
                        />
                    </HualalaTreeSelect>
                </HualalaEditorBox>
            </div>
        );
    }

    clear() {
        this.setState({
            CurrentSelections: [],
            hadSelected: [],
        })
    }

    handleSearchInputChange(value) {
        const { leftTreeData } = this.state;
        if (undefined === leftTreeData) {
            return null;
        }

        if (!((leftTreeData instanceof Array) && leftTreeData.length > 0)) {
            return null;
        }

        const allMatchItem = [];
        const { leftToRightKey, innerRightLabel, innerRightValue } = this.props;
        leftTreeData.forEach((CatTree) => {
            CatTree[leftToRightKey].forEach((child) => {
                if (CC2PY(child[innerRightLabel]).indexOf(value) !== -1 || child[innerRightLabel].indexOf(value) !== -1) {
                    allMatchItem.push(child);
                }
            });
        });

        const CurrentSelections = [];
        allMatchItem.forEach((entity) => {
            if (this.state.hadSelected.findIndex(item => item[innerRightValue] === entity[innerRightValue]) > -1) {
                CurrentSelections.push(entity[innerRightValue])
            }
        });

        this.setState({
            rightOptionsData: allMatchItem,
            CurrentSelections,
        });
    }

    handleEditorBoxChange(value) {
        const hadSelected = Array.from(value);
        const CurrentSelections = [];
        const { innerRightValue } = this.props;
        this.state.rightOptionsData.forEach((entity) => {
            if (hadSelected.findIndex(item => item[innerRightValue] === entity[innerRightValue]) > -1) {
                CurrentSelections.push(entity[innerRightValue])
            }
        });


        this.setState({
            hadSelected,
            CurrentSelections,
        }, () => {
            this.props.onChange && this.props.onChange(hadSelected);
        });
    }

    handleSelectedChange(value) {
        const hadSelected = this.state.hadSelected.slice();
        const { innerRightValue } = this.props;
        let CurrentSelections = this.state.CurrentSelections;
        if (value !== undefined) {
            const index = hadSelected.findIndex(item => item[innerRightValue] === value[innerRightValue]);
            if (index > -1) {
                hadSelected.splice(index, 1)
            }
            CurrentSelections = CurrentSelections.filter((item) => {
                return item !== value[innerRightValue]
            })
        }

        this.setState({
            hadSelected,
            CurrentSelections,
        }, () => {
            this.props.onChange && this.props.onChange(hadSelected);
        });
    }

    handleGroupSelect(value) {
        if (value instanceof Array) {
            const selectionsSet = this.state.hadSelected.slice();
            const { innerRightValue } = this.props;
            this.state.rightOptionsData.forEach((shopEntity) => {
                if (value.includes(shopEntity[innerRightValue])) {
                    const index = selectionsSet.findIndex(item => item[innerRightValue] === shopEntity[innerRightValue]);
                    if (index === -1) {
                        selectionsSet.push(shopEntity)
                    }
                } else {
                    const index = selectionsSet.findIndex(item => item[innerRightValue] === shopEntity[innerRightValue]);
                    if (index > -1) {
                        selectionsSet.splice(index, 1)
                    }
                }
            });
            this.setState({ CurrentSelections: value, hadSelected: selectionsSet });
        }
    }

    handleTreeNodeChange(value) {
        if (value === undefined || value[0] === undefined) {
            return null;
        }
        const indexArray = value[0].split('-').map((val) => {
            return parseInt(val)
        });
        let storeOptions = [];
        const { leftToRightKey, innerRightValue } = this.props;
        if (indexArray.length === 1) {
            storeOptions = storeOptions.concat(this.state.leftTreeData[indexArray[0]][leftToRightKey]);
        } else if (indexArray.length === 2) {
            storeOptions = storeOptions.concat(this.state.leftTreeData[indexArray[0]].children[indexArray[1]].children);
        }

        const CurrentSelections = [];
        const hadSelected = this.state.hadSelected.slice();
        storeOptions.forEach((storeEntity) => {
            if (hadSelected.findIndex(item => item[innerRightValue] === storeEntity[innerRightValue]) > -1) {
                CurrentSelections.push(storeEntity[innerRightValue])
            }
        });
        this.setState({ rightOptionsData: storeOptions, CurrentSelections });
    }
}


export default BaseHualalaModal;
