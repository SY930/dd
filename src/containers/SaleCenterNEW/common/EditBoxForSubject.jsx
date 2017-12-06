import { HualalaEditorBox, HualalaTreeSelect, HualalaGroupSelect, HualalaSelected, HualalaSearchInput, CC2PY } from '../../../components/common';
import React from 'react';
import { connect } from 'react-redux'; import { Tree } from 'antd';

const TreeNode = Tree.TreeNode;

import styles from '../ActivityPage.less';

if (process.env.__CLIENT__ === true) {
    // require('../../../../client/componentsPage.less');
}

import { fetchSubjectListInfoAC } from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';

class EditBoxForSubject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            subjectCollection: [],
            subjectOptions: [],
            subjectSelections: new Set(),
            subjectCurrentSelections: [],
            mutexSubjects: [],
        };

        this.handleTreeNodeChange = this.handleTreeNodeChange.bind(this);
        this.handleGroupSelect = this.handleGroupSelect.bind(this);
        this.handleSelectedChange = this.handleSelectedChange.bind(this);
        this.handleEditorBoxChange = this.handleEditorBoxChange.bind(this);
        this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
        this.clear = this.clear.bind(this);
        this.initialState = this.initialState.bind(this);
    }

    initialState(mutexSubjects, subjectCollection) {
        if (mutexSubjects === undefined || subjectCollection === undefined) {
            return
        }

        const _subjectSelections = this.state.subjectSelections;
        subjectCollection.forEach((subjectList) => {
            subjectList.subjectName.forEach((subject) => {
                mutexSubjects.forEach((subjectKey) => {
                    if (subject.subjectKey == subjectKey) {
                        _subjectSelections.add(subject);
                    }
                })
            })
        });
        this.setState({
            subjectSelections: _subjectSelections,
        });
    }

    componentDidMount() {
        if (!this.props.promotionDetailInfo.getIn(['$subjectInfo', 'initialized'])) {
            this.props.fetchSubjectListInfo({
                _groupID: this.props.user.accountInfo.groupID,
            })
        }

        const _subjects = this.props.promotionDetailInfo.getIn(['$subjectInfo', 'data', 'subjectTree']).toJS();
        const _mutexSubjects = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'mutexSubjects']).toJS();

        this.setState({
            subjectCollection: _subjects,
            mutexSubjects: _mutexSubjects,
        }, () => {
            this.initialState(this.state.mutexSubjects, this.state.subjectCollection);
        });
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.promotionDetailInfo.getIn(['$subjectInfo', 'data', 'subjectTree']) !=
            nextProps.promotionDetailInfo.getIn(['$subjectInfo', 'data', 'subjectTree'])) {
            const _subjects = nextProps.promotionDetailInfo.getIn(['$subjectInfo', 'data', 'subjectTree']).toJS();
            this.setState({
                subjectCollection: _subjects,
                subjectSelections: new Set(),
            }, () => {
                this.initialState(this.state.mutexSubjects, this.state.subjectCollection);
            });
        }

        if (this.props.promotionDetailInfo.getIn(['$promotionDetail', 'mutexSubjects']) !=
            nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'mutexSubjects'])) {
            const _mutexSubjects = nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'mutexSubjects']).toJS();
            this.setState({
                mutexSubjects: _mutexSubjects,
            }, () => {
                this.initialState(this.state.mutexSubjects, this.state.subjectCollection);
            });
        }
    }

    render() {
        const _subjectCollection = this.state.subjectCollection;
        const loop = (data) => {
            if (undefined === data) {
                return null
            }

            return data.map((item, index) => {
                return <TreeNode key={index} title={item.subjectGroupName.content} />;
            });
        };
        return (
            <div className={styles.treeSelectMain}>
                <HualalaEditorBox
                    label={'结算方式互斥'}
                    itemName="subjectName"
                    itemID="subjectKey"
                    data={this.state.subjectSelections}
                    onChange={this.handleEditorBoxChange}
                    onTagClose={this.handleSelectedChange}
                >
                    <HualalaTreeSelect level1Title={'全部结算方式'}>
                        <HualalaSearchInput onChange={this.handleSearchInputChange} />
                        <Tree onSelect={this.handleTreeNodeChange}>
                            {loop(_subjectCollection)}
                        </Tree>
                        <HualalaGroupSelect
                            options={this.state.subjectOptions}
                            labelKey="subjectName"
                            valueKey="subjectKey"
                            value={this.state.subjectCurrentSelections}
                            onChange={this.handleGroupSelect}
                        />
                        <HualalaSelected itemName="subjectName" selectdTitle={'已选结算方式'} value={this.state.subjectSelections} onChange={this.handleSelectedChange} onClear={() => this.clear()} />
                    </HualalaTreeSelect>
                </HualalaEditorBox>
            </div>
        );
    }

    clear() {
        const { subjectSelections } = this.state;
        subjectSelections.clear();
        this.setState({
            subjectCurrentSelections: [],
            subjectSelections,
        })
    }

    handleSearchInputChange(value) {
        const subjectList = this.state.subjectCollection;
        if (undefined === subjectList) {
            return null;
        }

        if (!((subjectList instanceof Array) && subjectList.length > 0)) {
            return null;
        }

        const allMatchItem = [];
        subjectList.forEach((subjects) => {
            subjects.subjectName.forEach((subject) => {
                if (CC2PY(subject.subjectName).indexOf(value) !== -1 || subject.subjectName.indexOf(value) !== -1) {
                    allMatchItem.push(subject);
                }
            });
        });

        const subjectCurrentSelections = [];
        allMatchItem.forEach((storeEntity) => {
            if (this.state.subjectSelections.has(storeEntity)) {
                subjectCurrentSelections.push(storeEntity.subjectKey)
            }
        });

        this.setState({
            subjectOptions: allMatchItem,
            subjectCurrentSelections,
        });
    }

    // it's depends on
    handleEditorBoxChange(value) {
        const subjectSelections = value;
        // update currentSelections according the selections
        const subjectCurrentSelections = [];
        this.state.subjectOptions.forEach((storeEntity) => {
            if (subjectSelections.has(storeEntity)) {
                subjectCurrentSelections.push(storeEntity.subjectKey)
            }
        });

        this.setState({
            subjectSelections: value,
            subjectCurrentSelections,
        }, () => {
            this.props.onChange && this.props.onChange(Array.from(value));
        });
    }

    handleSelectedChange(value) {
        const subjectSelections = this.state.subjectSelections;
        let subjectCurrentSelections = this.state.subjectCurrentSelections;

        if (value !== undefined) {
            subjectSelections.delete(value);
            subjectCurrentSelections = subjectCurrentSelections.filter((item) => {
                return item !== value.subjectKey
            })
        }


        this.setState({
            subjectSelections,
            subjectCurrentSelections,
        }, () => {
            this.props.onChange && this.props.onChange(Array.from(subjectSelections));
        });
    }

    handleGroupSelect(value) {
        if (value instanceof Array) {
            // get the selections
            const selectionsSet = this.state.subjectSelections;
            this.state.subjectOptions.forEach((shopEntity) => {
                if (value.includes(shopEntity.subjectKey)) {
                    selectionsSet.add(shopEntity);
                } else {
                    selectionsSet.delete(shopEntity)
                }
            });

            this.setState({ subjectCurrentSelections: value, subjectSelections: selectionsSet });
        }
    }

    handleTreeNodeChange(value) {
        const { subjectSelections } = this.state;
        if (value === undefined || value[0] === undefined) {
            return null;
        }
        const indexArray = value[0].split('-').map((val) => {
            return parseInt(val)
        });
        let storeOptions = [];
        if (indexArray.length === 1) {
            storeOptions = storeOptions.concat(this.state.subjectCollection[indexArray[0]].subjectName);
        } else if (indexArray.length === 2) {
            storeOptions = storeOptions.concat(this.state.subjectCollection[indexArray[0]].children[indexArray[1]].children);
        }

        const subjectCurrentSelections = [];
        storeOptions.forEach((storeEntity) => {
            if (subjectSelections.has(storeEntity)) {
                subjectCurrentSelections.push(storeEntity.subjectKey)
            }
        });
        this.setState({ subjectOptions: storeOptions, subjectCurrentSelections });
    }
}

const mapStateToProps = (state) => {
    return {
        promotionDetailInfo: state.promotionDetailInfo_NEW,
        user: state.user.toJS() };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchSubjectListInfo: (opts) => {
            dispatch(fetchSubjectListInfoAC(opts));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditBoxForSubject);
