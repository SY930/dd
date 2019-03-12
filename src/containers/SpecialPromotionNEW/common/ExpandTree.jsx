import React from 'react';
import { Tree, Input } from 'antd';
// import styles from '../../SaleCenterNEW/ActivityPage.less';
import _ from 'lodash';
import {
    SALE_CENTER_GIFT_TYPE,
} from '../../../redux/actions/saleCenterNEW/types';

if (process.env.__CLIENT__ === true) {
    // require('../../../../client/componentsPage.less');
}
const TreeNode = Tree.TreeNode;
const Search = Input.Search;
class ExpandTree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expandedKeys: [],
            gift: '',
            selectedKeys: [],
            defaultExpandedKeys: [],
            disArr: [],
            searchValue: '',
        };
        this.renderTreeNodes = this.renderTreeNodes.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.listenClick = this.listenClick.bind(this);
    }
    componentDidMount() {
        document.body.addEventListener('click', this.listenClick)
    }
    listenClick(e) {
        if (e.target.matches('.ExpandTreeVisibel') || e.target.matches('.ant-input-suffix') || e.target.matches('.ant-input-search-icon') ||
            e.target.matches('.ant-tree-noline_close') || e.target.matches('.ant-tree-node-content-wrapper') ||
            e.target.matches('.ant-tree-node-content-wrapper-close') ||
            e.target.matches('.ant-tree-title') || e.target.matches('.ant-tree-child-tree') || e.target.matches('.ant-tree-child-tree-open') ||
            e.target.matches('.ant-tree-node-content-wrapper-normal') || e.target.matches('.ant-tree-switcher') ||
            e.target.matches('.ant-tree-noline_open')) {
            //
        } else if (e.target.matches('.input_click')) {
            //
        } else {
            // 全部消失
            this.props.onClick && this.props.onClick()
        }
    }
    componentWillUnmount() {
        document.body.removeEventListener('click', this.listenClick);
    }

    componentWillReceiveProps(nextProps) {
        const expandedKeys = [];
        nextProps.data.forEach((cat) => {
            cat.crmGifts.forEach((gift) => {
                if (gift.giftItemID == (nextProps.value || '').split(',')[0]) {
                    expandedKeys.push(`${gift.giftType}`)
                }
            })
        })
        this.setState({
            gift: (nextProps.value || '').split(',')[1],
            selectedKeys: [nextProps.value || ''],
            expandedKeys,
            disArr: nextProps.disArr,
        })
    }
    renderTreeNodes(data) {
        return (
            data.map((cat) => {
                return (
                    <TreeNode
                        title={_.find(SALE_CENTER_GIFT_TYPE, { value: String(cat.giftType) }) ? _.find(SALE_CENTER_GIFT_TYPE, { value: String(cat.giftType) }).label : ''}
                        key={cat.giftType}
                        className={'ExpandTreeVisibel'}
                        style={{ maxHeight: 280 }}
                    >
                        {
                            cat.crmGifts.map((gift) => {
                                return (
                                    <TreeNode
                                        title={gift.giftName}
                                        key={`${gift.giftItemID},${gift.giftName},${gift.giftType},${gift.giftValue}`}
                                        className={'ExpandTreeVisibel'}
                                    />
                                )
                            })
                        }
                    </TreeNode>
                )
            })
        )
    }
    onSelect(selectedKeys, info) {
        if (!selectedKeys[0] || selectedKeys[0] < 1000) {
            if (selectedKeys[0] == this.state.expandedKeys[0]) {
                this.setState({ expandedKeys: [] })
            } else {
                this.setState({ expandedKeys: selectedKeys })
            }
        } else {
            this.props.onChange && this.props.onChange(selectedKeys[0])
            const gift = selectedKeys[0] ? selectedKeys[0].split(',')[1] : '';
            this.setState({ gift })
            // 全部消失
            this.props.onClick && this.props.onClick()
        }
    }
    render() {
        const { expandedKeys, _expandedKeys = [], searchValue } = this.state;

        const _data = searchValue !== '' ?
            this.props.data.map((cat) => {
                return {
                    giftType: cat.giftType,
                    crmGifts: cat.crmGifts.filter((gift) => {
                        return gift.giftName.indexOf(searchValue) > -1
                    }),
                }
            }) : this.props.data;

        if (searchValue !== '') {
            this.props.data.forEach((cat) => {
                let has = false;
                cat.crmGifts.forEach((gift) => {
                    if (gift.giftName.indexOf(searchValue) > -1) {
                        has = true;
                    }
                });
                if (has) {
                    _expandedKeys.push(`${cat.giftType}`)
                }
            })
        }
        return (
            <div style={{ position: 'relative' }} className={'ExpandTreeVisibel'}>
                {this.props.children}
                {
                    this.state.disArr[this.props.idx] ?
                        <div style={{ position: 'relative' }} className={'ExpandTreeVisibel'}>
                            <div
                                className={'ExpandTreeVisibel'}
                                style={{
                                    borderRadius: 2,
                                    position: 'absolute',
                                    top: 0,
                                    width: '100%',
                                    margin: 0,
                                    zIndex: 999,
                                    backgroundColor: 'white',
                                    borderBottom: 'none',
                                    border: '1px solid rgb(217, 217, 217)',
                                }}
                            >
                                <Search
                                    style={{ width: '90%', margin: '5px 14px' }}
                                    placeholder="Search"
                                    className={'ExpandTreeVisibel'}
                                    value={this.state.searchValue}
                                    onChange={(e) => { this.setState({ searchValue: e.target.value }) }}
                                />
                            </div>
                            <div
                                className={'ExpandTreeVisibel'}
                                style={{
                                    margin: '0 0 10px 0px',
                                    position: 'absolute',
                                    top: 39,
                                    width: '100%',
                                    minHeight: 184,
                                    maxHeight: 300,
                                    overflow: 'auto',
                                    zIndex: 1000,
                                    backgroundColor: 'white',
                                    border: '1px solid rgb(217, 217, 217)',
                                    borderTop: 'none',
                                    paddingLeft: 6,
                                }}
                            >
                                <Tree
                                    key={'TREE'}
                                    className={'ExpandTreeVisibel'}
                                    expandedKeys={searchValue !== '' ? _expandedKeys : expandedKeys}
                                    selectedKeys={this.state.selectedKeys}
                                    onSelect={this.onSelect}
                                    onExpand={(expandedKeys) => {
                                        this.setState({
                                            expandedKeys,
                                        });
                                    }
                                    }
                                >
                                    {this.renderTreeNodes(_data)}
                                </Tree>
                            </div>
                        </div>
                        : null
                }

            </div>
        )
    }
}
export default ExpandTree;
