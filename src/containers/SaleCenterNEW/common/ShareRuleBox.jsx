import { HualalaSearchInput } from '../../../components/common';
import React from 'react';
import { connect } from 'react-redux'; import { Tree, message } from 'antd';
import { injectIntl } from '../IntlDecor';
const TreeNode = Tree.TreeNode;
import styles from '../ActivityPage.less';
import { Table, Row, Col, Button, Modal } from 'antd';
import { axiosData } from '../../../helpers/util';

function isNumber(val) {
    return !isNaN(val);
}

@injectIntl()
class ShareRuleBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            categoryType: 1,
            selectedRowKeys: [],
            selectedData: [],
            allSelectedRows: [],
            activityTreeData: [],
            categoryTreeData: [],
            filterKey: '1'
        };

        this.handleTreeNodeChangeCategory = this.handleTreeNodeChangeCategory.bind(this);
        this.handleTreeNodeChangeActivity = this.handleTreeNodeChangeActivity.bind(this);
        this.handleSelectedChange = this.handleSelectedChange.bind(this);
        this.handleEditorBoxChange = this.handleEditorBoxChange.bind(this);
        this.handleSearchInputChangeCagegory = this.handleSearchInputChangeCagegory.bind(this);
        this.handleSearchInputChangeActivity = this.handleSearchInputChangeActivity.bind(this);
        this.clear = this.clear.bind(this);

    }



    getCouponList() {
        axiosData(
            '/promotion/v2/activityTypeRule/queryTypeMetadata.ajax',
            { pageNo: 1, pageSize: 10000, },
            null,
            { path: 'data' },
            'HTTP_SERVICE_URL_PROMOTION_NEW'
        ).then((responseJSON) => {
            let activityTreeData = []
            responseJSON.aggregateRelationList.map((i) => {
                let children = []
                i.activityTypeInfoList.map((j) => {
                    let treeObj = {}
                    treeObj.title = j.name
                    treeObj.key = j.type
                    children.push(treeObj)

                })
                activityTreeData.push({ title: i.aggregateName, key: i.aggregateName, children })
            })

            let categoryTreeData = []
            responseJSON.aggregateRelationList.map((i) => {
                categoryTreeData.push({ title: i.aggregateName, key: i.aggregateCode })
            })

            this.setState({ activityTreeData, categoryTreeData })

        }).catch((error) => {
            console.log(error)
        });

    }

    componentDidMount() {

        this.getCouponList()

        const mutexActivityId = this.props.mutexActivityId
        const mutexActivityType = this.props.mutexActivityType
        const sharedAndNotOverlieActivityId = this.props.sharedAndNotOverlieActivityId
        const sharedAndNotOverlieType = this.props.sharedAndNotOverlieType
        const sharedAndOverlieActivityId = this.props.sharedAndOverlieActivityId
        const sharedAndOverlieType = this.props.sharedAndOverlieType
        let allSelectedRows = []
        let categorySelectedRowKeys = []
        let activitySelectedRowKeys = []
        if (this.props.modalTitle == '与其他活动互斥') {
            allSelectedRows = mutexActivityId.concat(mutexActivityType)
            categorySelectedRowKeys = mutexActivityType.map(item => { return item.activityTypeId })
            activitySelectedRowKeys = mutexActivityId.map(item => { return item.activityId })
        } else if (this.props.modalTitle == '与其他活动共享') {
            allSelectedRows = sharedAndNotOverlieActivityId.concat(sharedAndNotOverlieType)
            categorySelectedRowKeys = sharedAndNotOverlieType.map(item => { return item.activityTypeId })
            activitySelectedRowKeys = sharedAndNotOverlieActivityId.map(item => { return item.activityId })
        } else {
            allSelectedRows = sharedAndOverlieActivityId.concat(sharedAndOverlieType)
            categorySelectedRowKeys = sharedAndOverlieType.map(item => { return item.activityTypeId })
            activitySelectedRowKeys = sharedAndOverlieActivityId.map(item => { return item.activityId })
        }

        let allSelectedTypeCategory = mutexActivityType.concat(sharedAndNotOverlieType).concat(sharedAndOverlieType)
        let allSelectedTypeActivity = mutexActivityId.concat(sharedAndNotOverlieActivityId).concat(sharedAndOverlieActivityId)

        this.setState({ allSelectedRows, categorySelectedRowKeys, activitySelectedRowKeys, allSelectedTypeCategory, allSelectedTypeActivity })
    }

    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} />;
        });
    }

    render() {

        let columns = [
            {
                title: '类型',
                dataIndex: 'activityTypeName',
                key: 'activityTypeName',
                width: 150,
                className: 'TableTxtLeft',
                render: (text, record, index) => {
                    return <span title={text}>{text}</span>
                },
            },
            {
                title: '名称',
                dataIndex: 'activityName',
                key: 'activityName',
                width: 90,
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    return <span title={text}>{text ? text : '-'}</span>
                },
            },
            {
                title: '编码',
                dataIndex: 'activityCode',
                key: 'activityCode',
                width: 80,
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    let textStr = text ? text : record.activityTypeId
                    return <span title={textStr}>{textStr}</span>
                },
            },
            {
                title: '操作',
                width: 85,
                dataIndex: 'newPrice',
                key: 'filterPrice',
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    return (
                        <a onClick={() => {
                            if (record.activityId) {
                                let selectedRows = this.state.allSelectedRows
                                let allSelectedRows = selectedRows.filter((item) => {
                                    return item.activityId != record.activityId
                                })

                                let selectedRowKeys = []
                                selectedRowKeys = this.state.activitySelectedRowKeys.filter((item) => {
                                    return item != record.activityId
                                })

                                this.setState({ allSelectedRows, activitySelectedRowKeys: selectedRowKeys })
                            } else {
                                let selectedRows = this.state.allSelectedRows
                                let allSelectedRows = selectedRows.filter((item) => {
                                    if (item.activityId) {
                                        return true
                                    }
                                    return item.activityTypeId != record.activityTypeId
                                })

                                let selectedRowKeys = []
                                selectedRowKeys = this.state.categorySelectedRowKeys.filter((item) => {
                                    return item != record.activityTypeId
                                })

                                this.setState({ allSelectedRows, categorySelectedRowKeys: selectedRowKeys })
                            }

                        }}>删除</a>

                    );
                },
            }
        ];

        let columnsRightCagegory = [
            {
                title: '名称',
                dataIndex: 'activityTypeName',
                key: 'activityTypeName',
                width: 150,
                className: 'TableTxtLeft',
                render: (text, record, index) => {
                    return <span title={text}>{text}</span>
                },
            },
            {
                title: '编码',
                dataIndex: 'activityTypeId',
                key: 'activityTypeId',
                width: 90,
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    return <span title={text}>{text}</span>
                },
            },
            // {
            //     title: '互斥叠加关系',
            //     dataIndex: 'relation',
            //     key: 'relation',
            //     width: 80,
            //     className: 'TableTxtCenter',
            //     render: (text, record, index) => {
            //         return <span title={text}>{text == -1 ? '-' : text == 0 ? '互斥' : text == '1' ? '共享叠加' : '共享不叠加'}</span>
            //     },
            // }
        ];

        let columnsRightActivity = [
            {
                title: '名称',
                dataIndex: 'activityName',
                key: 'activityName',
                width: 150,
                className: 'TableTxtLeft',
                render: (text, record, index) => {
                    return <span title={text}>{text}</span>
                },
            },
            {
                title: '编码',
                dataIndex: 'activityCode',
                key: 'activityCode',
                width: 90,
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    return <span title={text}>{text}</span>
                },
            },
            {
                title: '互斥叠加关系',
                dataIndex: 'relation',
                key: 'relation',
                width: 80,
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    return <span title={text}>{text == -1 ? '-' : text == 0 ? '互斥' : text == '1' ? '共享叠加' : '共享不叠加'}</span>
                },
            }
        ];


        const rowSelectionCategory = {

            onChange: (categorySelectedRowKeys, selectedRows) => {

                let allSelectedRows = this.state.allSelectedRows
                selectedRows.forEach(item => {
                    if (allSelectedRows.findIndex(brand => brand.activityTypeId === item.activityTypeId) == -1) {
                        allSelectedRows.push(item)
                    }
                })
                this.setState({ allSelectedRows, categorySelectedRowKeys })
            },
            selectedRowKeys: this.state.categorySelectedRowKeys,
            onSelect: (record, categorySelectedRowKeys, selectedRows) => {
                let allSelectedRows = []
                if (!categorySelectedRowKeys) {
                    allSelectedRows = this.state.allSelectedRows.filter((item) => {
                        if (item.activityId) {
                            return true
                        }
                        return item.activityTypeId != record.activityTypeId
                    })
                    this.setState({ allSelectedRows })
                } else {
                    let allSelectedRows = this.state.allSelectedRows
                    selectedRows.forEach(item => {
                        if (allSelectedRows.findIndex(brand => brand.activityTypeId === item.activityTypeId && brand.activityId === item.activityId) == -1) {
                            allSelectedRows.push(item)
                        }
                    })
                    this.setState({ allSelectedRows })
                }

            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                if (!selected) {
                    let otherSelectedRows = []
                    otherSelectedRows = this.state.allSelectedRows.filter(item => item.activityId)
                    let allSelectedRowsTypeCategory = this.state.allSelectedRows.filter(item =>
                        !changeRows.some(brand => brand.activityTypeId == item.activityTypeId)
                    )
                    let newArr = allSelectedRowsTypeCategory.concat(otherSelectedRows)
                    this.setState({ allSelectedRows: newArr })
                }
            }
        };

        const rowSelectionActivity = {
            onChange: (activitySelectedRowKeys, selectedRows) => {
                let allSelectedRows = this.state.allSelectedRows
                selectedRows.forEach(item => {
                    if (allSelectedRows.findIndex(brand => brand.activityId === item.activityId) == -1) {
                        allSelectedRows.push(item)
                    }
                })
                this.setState({ allSelectedRows, activitySelectedRowKeys })
            },
            selectedRowKeys: this.state.activitySelectedRowKeys,
            onSelect: (record, activitySelectedRowKeys, selectedRows) => {

                let allSelectedRows = []
                if (!activitySelectedRowKeys) {
                    allSelectedRows = this.state.allSelectedRows.filter((item) => {
                        return item.activityId != record.activityId
                    })
                    this.setState({ allSelectedRows })
                } else {
                    let allSelectedRows = this.state.allSelectedRows
                    selectedRows.forEach(item => {
                        if (allSelectedRows.findIndex(brand => brand.activityId === item.activityId) == -1) {
                            allSelectedRows.push(item)
                        }
                    })
                    this.setState({ allSelectedRows })
                }
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                if (!selected) {
                    let otherSelectedRows = []
                    otherSelectedRows = this.state.allSelectedRows.filter(item => !item.activityId)
                    let allSelectedRowsTypeActivity = this.state.allSelectedRows.filter(item =>
                        !changeRows.some(brand => brand.activityId == item.activityId) && item.activityId
                    )
                    let newArr = allSelectedRowsTypeActivity.concat(otherSelectedRows)
                    this.setState({ allSelectedRows: newArr })
                }
            }

        };

        return (
            <Modal maskClosable={false} title={this.props.modalTitle} visible={true} onOk={() => {
                let obj = {}
                obj.title = this.props.modalTitle
                let activityIdList = this.state.allSelectedRows.filter((item) => {
                    return item.activityId
                })

                let activityTypeList = this.state.allSelectedRows.filter((item) => {
                    return !item.activityId
                })

                obj.activityIdList = activityIdList
                obj.activityTypeList = activityTypeList
                this.props.onChange && this.props.onChange(obj);
                this.props.closeModal()
            }} onCancel={() => {
                this.props.closeModal()
            }} width="922px"
                bodyStyle={{ maxHeight: 800 }}>
                <div className={styles.treeSelectMain}>
                    {/* <HualalaEditorBox
                        label={k5m5auqn}
                        itemName={'finalShowName'}
                        itemID={'promotionIDStr'}
                        data={promotionSelections}
                        onChange={this.handleEditorBoxChange}
                        onTagClose={this.handleSelectedChange}
                    > */}
                    <div>
                        <Button style={{ marginRight: 10 }} type={this.state.categoryType == 1 ? 'primary' : 'ghost'} onClick={() => {
                            this.setState({ categoryType: 1 })
                        }}>优惠分类</Button>
                        <Button type={this.state.categoryType == 2 ? 'primary' : 'ghost'} onClick={() => {
                            this.setState({ categoryType: 2 })
                        }}>优惠活动</Button>
                    </div>
                    <div style={{ marginTop: 10 }}>
                        {/* //搜索框 */}

                        <Row style={{ display: this.state.categoryType == 1 ? 'block' : 'none' }}>
                            <Col span={8}>
                                <div style={{ height: 500, border: 'solid 1px #d4d4d4', maxHeight: 500, overflow: 'auto' }}>
                                    {/* //左侧树 */}
                                    <Tree onSelect={this.handleTreeNodeChangeCategory} title={'content'}>
                                        {this.renderTreeNodes(this.state.categoryTreeData)}
                                    </Tree>

                                </div>
                            </Col>
                            <Col span={16}>
                                <div style={{ height: 500, marginLeft: 10, padding: '10', border: 'solid 1px #d4d4d4', maxHeight: 500, overflow: 'auto' }}>
                                    {/* //右侧复选框  isLimit 数量限制 */}
                                    <div style={{ marginTop: 5, }}>
                                        <HualalaSearchInput onChange={this.handleSearchInputChangeCagegory} />
                                    </div>
                                    <div style={{ marginTop: 10 }}>
                                        <Table
                                            bordered={true}
                                            rowSelection={rowSelectionCategory}
                                            rowKey={'activityTypeId'}
                                            dataSource={this.state.activityRuleClassifyPageQueryData}
                                            columns={columnsRightCagegory} pagination={false}
                                            scroll={{ y: 1700 }} />
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <Row style={{ display: this.state.categoryType == 2 ? 'block' : 'none' }}>
                            <Col span={8}>
                                <div style={{ height: 500, border: 'solid 1px #d4d4d4', maxHeight: 500, overflow: 'auto' }}>
                                    {/* //左侧树 */}
                                    <Tree onSelect={this.handleTreeNodeChangeActivity} title={'content'} style={{}}>
                                        {this.renderTreeNodes(this.state.activityTreeData)}
                                    </Tree>

                                </div>
                            </Col>
                            <Col span={16}>
                                <div style={{ height: 500, marginLeft: 10, padding: '10', border: 'solid 1px #d4d4d4', maxHeight: 500, overflow: 'auto' }}>
                                    {/* //右侧复选框  isLimit 数量限制 */}
                                    <div style={{ marginTop: 5, }}>
                                        <HualalaSearchInput onChange={this.handleSearchInputChangeActivity} />
                                    </div>
                                    <div style={{ marginTop: 10 }}>
                                        <Table
                                            bordered={true}
                                            rowSelection={rowSelectionActivity}
                                            rowKey={'activityId'}
                                            dataSource={this.state.activityRulePageQueryData}
                                            columns={columnsRightActivity} pagination={false}
                                            scroll={{ y: 1700 }} />
                                    </div>
                                </div>

                            </Col>
                        </Row>


                        <div style={{ marginTop: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>已选{this.state.allSelectedRows.length}个项目</div>
                                <div><a onClick={() => {
                                    this.setState({ allSelectedRows: [], categorySelectedRowKeys: [], activitySelectedRowKeys: [] })
                                }}>清空</a></div>
                            </div>
                            {/* //下方已选的tag */}

                            <div style={{ marginTop: 10 }} >
                                <Table
                                    bordered={true}
                                    dataSource={this.state.allSelectedRows}
                                    columns={columns}
                                    pagination={false}
                                    scroll={{ y: 170 }}
                                />
                            </div>
                        </div>
                    </div>
                    {/* </HualalaEditorBox> */}
                </div>
            </Modal>
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
    handleSearchInputChangeCagegory = (value) => {
        let newArr = this.state.activityRuleClassifyPageQueryDataBySearch.filter(item => item.activityTypeName.indexOf(value) >= 0 || String(item.activityTypeId).indexOf(value) >= 0)
        this.setState({ activityRuleClassifyPageQueryData: newArr })
    }

    handleSearchInputChangeActivity = (value) => {
        let newArr = this.state.activityRulePageQueryDataBySearch.filter(item => item.activityName.indexOf(value) >= 0 || String(item.activityCode).indexOf(value) >= 0)
        this.setState({ activityRulePageQueryData: newArr })
    }

    // 确定或取消
    handleEditorBoxChange(value) {
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

    // 左侧选择
    handleTreeNodeChangeActivity = (value) => {
        if (value && value.length > 0) {
            const shopScopeList = this.props.promotionScopeInfo.getIn(['$scopeInfo', 'shopScopeList'])
            let orgs = this.props.bizType == '2' ? (this.props.orgs || []) : (shopScopeList ? shopScopeList.toJS() : [])
            let shopIdList = orgs.length ? orgs.map(item => { return item.shopID }) : []
            let promotionType = this.props.bizType == '2' ? this.props.giftType : this.props.promotionBasicInfo.getIn(['$basicInfo', 'promotionType'])
            let promotionId = this.props.bizType == '2' ? this.props.giftItemID : this.props.promotionBasicInfo.getIn(['$basicInfo', 'promotionID'])
            if (isNumber(value[0])) {
                axiosData(
                    '/promotion/v2/activityRule/queryListForActivity.ajax',
                    { searchName: "", currentActivityType: promotionType, currentActivityId: promotionId, bizType: this.props.bizType || 1, chooseActivityType: value[0].split('-')[0], shopIdList },
                    null,
                    { path: 'data' },
                    'HTTP_SERVICE_URL_PROMOTION_NEW'
                ).then((responseJSON) => {
                    let data = responseJSON.activityRulePageQueryData
                    data = data.filter(item => !this.state.allSelectedTypeActivity.some((i) => i.activityId == item.activityId))
                    if (promotionId) {
                        data = data.filter(item => item.activityId != promotionId)
                    }
                    this.setState({
                        activityRulePageQueryData: data,
                        activityRulePageQueryDataBySearch: data
                    })
                })

            }
        }
    }
    // 左侧选择
    handleTreeNodeChangeCategory = (value) => {
        if (value && value.length > 0) {
            const shopScopeList = this.props.promotionScopeInfo.getIn(['$scopeInfo', 'shopScopeList'])
            let orgs = this.props.bizType == '2' ? (this.props.orgs || []) : (shopScopeList ? shopScopeList.toJS() : [])
            let shopIdList = orgs.length ? orgs.map(item => { return item.shopID }) : []
            let promotionType = this.props.bizType == '2' ? this.props.giftType : this.props.promotionBasicInfo.getIn(['$basicInfo', 'promotionType'])

            axiosData(
                '/promotion/v2/activityRule/queryListForClassify.ajax',
                { currentActivityType: promotionType, activityAggregateType: value[0], bizType: this.props.bizType || 1, searchName: '', shopIdList },
                null,
                { path: 'data' },
                'HTTP_SERVICE_URL_PROMOTION_NEW'
            ).then((responseJSON) => {
                let data = responseJSON.activityRuleClassifyPageQueryData
                data = data.filter(item => !this.state.allSelectedTypeCategory.some((i) => i.activityTypeId == item.activityTypeId))
                this.setState({
                    activityRuleClassifyPageQueryData: data,
                    activityRuleClassifyPageQueryDataBySearch: data
                })
            })
        }
    }

}

const mapStateToProps = (state) => {
    return {
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        myActivities: state.sale_myActivities_NEW,
        giftInfoNew: state.sale_giftInfoNew, // 所有哗啦啦券列表--共享用
        mySpecialActivities: state.sale_mySpecialActivities_NEW, // 所有会员等级列表--共享用
        user: state.user.toJS(),
        promotionBasicInfo: state.sale_promotionBasicInfo_NEW,
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ShareRuleBox);
