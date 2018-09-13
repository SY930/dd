import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Modal,
    Button,
    Tooltip,
    Spin,
    Icon,
    Table,
    Select,
    message

} from 'antd';
import styles from '../ActivityPage.less';
import {
    closePromotionAutoRunListModal, queryPromotionAutoRunList,
    savePromotionAutoRunList
} from "../../../redux/actions/saleCenterNEW/promotionAutoRun.action";

class PromotionAutoRunModal extends Component {

    constructor(props) {
        super(props);
        const promotionList = props.promotionList.toJS();
        this.state = {
            innerModalVisible: false,
            promotionList,
            selectedRowKeys: promotionList.map(item => item.promotionID)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.promotionList !== this.props.promotionList) {
            this.setState({
                promotionList: nextProps.promotionList.toJS()
            })
        }
    }

    renderInnerSelectorModal() {
        const {
            innerModalVisible,
            promotionList,
            selectedRowKeys
        } = this.state;
        const {
            availableList
        } = this.props;
        return (
            <Modal
                width="520px"
                visible={innerModalVisible}
                maskClosable={false}
                onCancel={() => {
                    this.setState({
                        selectedRowKeys: promotionList.map(item => item.promotionID),
                        innerModalVisible: false
                    })
                }}
                onOk={() => {
                    this.setState({
                        promotionList: availableList
                            .filter(item => selectedRowKeys.includes(item.promotionID))  // 已选项
                            .sort((a, b) => { // 按照已排序列表中的顺序进行排序
                                return (promotionList.findIndex(promotion => promotion.promotionID === a.promotionID) -
                                promotionList.findIndex(promotion => promotion.promotionID === b.promotionID))
                            }
                            ),
                        innerModalVisible: false
                    })
                }}
                title={'请选择需要自动执行的活动'}
            >
                {this.renderInnerTable()}
            </Modal>
        );
    }

    renderInnerTable() {
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys
                })
            },
            selectedRowKeys: this.state.selectedRowKeys,
        };
        const columns = [
            {
                title: '序号',
                className: 'TableTxtCenter',
                width: 50,
                render: (order, record, index) => index + 1,
            },
            {
                title: '活动名称',
                dataIndex: 'promotionName',
                width: 360,
                render: (promotionName) => {
                    let text = promotionName;
                    if (promotionName === undefined || promotionName === null || promotionName === '') {
                        text = '--';
                    }
                    return (<span title={text}>{text}</span>);
                },
            },
        ];
        return (
            <div
                style={{
                    marginTop: 15,
                }}
            >
                <Table
                    bordered={true}
                    rowSelection={rowSelection}
                    rowKey="promotionID"
                    columns={columns}
                    pagination={false}
                    dataSource={this.props.availableList}
                />
            </div>
        )
    }

    handleOptionChange = (value, index) => {
        let { promotionList } = this.state;
        const promotion = promotionList.splice(index, 1);
        promotionList.splice(Number(value - 1), 0, promotion[0]);
        this.setState({
            promotionList
        })
    }

    renderAutoRunTable() {
        let {
            promotionList
        } = this.state;
        const columns = [
            {
                title: '活动名称',
                dataIndex: 'promotionName',
                width: 480,
                render: (promotionName) => {
                    let text = promotionName;
                    if (promotionName === undefined || promotionName === null || promotionName === '') {
                        text = '--';
                    }
                    return (<span title={text}>{text}</span>);
                },
            },
            {
                title: '执行顺序',
                dataIndex: 'order',
                className: styles.noPadding,
                width: 110,
                render: (order, record, index) => {
                    return (
                        <Select
                            onChange={(value) => this.handleOptionChange(value, index)}
                            value={`${index+1}`}
                            showSearch
                            style={{
                                width: '100%'
                            }}
                            placeholder="请选择排序"
                        >
                            {promotionList.map((item, innerIndex) =>
                                (<Select.Option key={innerIndex} value={`${innerIndex+1}`}>
                                    {innerIndex+1}
                                </Select.Option>)
                            )}
                        </Select>
                    )
                },
            },
            {
                title: '操作',
                dataIndex: 'order1',
                className: 'TableTxtCenter',
                render: (order, record, index) => {
                    return (
                        <span>
                            <a onClick={(e) => {
                                e.preventDefault();
                                const {promotionList} = this.state;
                                promotionList.splice(index, 1)
                                this.setState({
                                    promotionList
                                })
                            }}>删除</a>
                        </span>
                    )
                },
            },
        ];
        return (
            <div
                style={{
                    marginTop: 15,
                }}
            >
                <Table
                    bordered={true}
                    rowKey="promotionID"
                    columns={columns}
                    pagination={false}
                    dataSource={promotionList}
                />
            </div>

        )
    }

    renderAutoRunFooter() {
        const {
            hasError,
            isSaving,
        } = this.props;
        return (
            hasError ? null : (
                <div>
                    <Button
                        type="ghost"
                        onClick={this.handleCancel}
                    >
                        取消
                    </Button>
                    <Button
                        type="primary"
                        style={{
                            marginLeft: 10
                        }}
                        onClick={this.handleOk}
                        loading={isSaving}
                    >确定</Button>
                </div>
            )
        )
    }

    handleCancel = () => {
        const list = this.props.promotionList.toJS();
        this.setState({
            promotionList: list,
            selectedRowKeys: list.map(item => item.promotionID)
        })
        this.props.closePromotionAutoRunListModal();
    }

    handleOk = () => {
        const { promotionList } = this.state;
        this.props
            .savePromotionAutoRunList({autoExecuteActivityItems: promotionList.map((item, index) => ({...item, order: index + 1}))})
            .then(() => {
                this.props.closePromotionAutoRunListModal();
                message.success('设置成功');
            })
            .catch(e => {
                console.log('e: ', e);
            })
        ;
    }

    handleRetry = () => {
        this.props.queryPromotionAutoRunList();
    }

    openInnerModal = () => {
        this.setState({
            selectedRowKeys: this.state.promotionList.map(item => item.promotionID)
        })
        this.setState({
            innerModalVisible: true,
        })
    }

    render() {
        const {
            isVisible,
            isLoading,
            hasError,
        } = this.props;
        const {
            promotionList
        } = this.state;
        return (
            <Modal
                visible={isVisible}
                title={'活动执行设置'}
                width="720px"
                height="569px"
                maskClosable={false}
                onCancel={this.handleCancel}
                footer={this.renderAutoRunFooter()}
            >
                <Spin spinning={isLoading}>
                    {
                        hasError ? (
                            <div
                                style={{
                                    height: 400,
                                    lineHeight: '300px',
                                    textAlign: 'center',
                                    fontSize: 16
                                }}
                            >
                                查询自动执行信息出错！点击 <a onClick={this.handleRetry}>重试</a>
                            </div>
                        ) : (
                            <div className={styles.autoRunWrapper}>
                                <div className={styles.flexHeader}>
                                    <div>
                                        <div
                                            style={{
                                                fontSize: '16px',
                                                color: '#666666'
                                            }}
                                        >
                                            自动执行&nbsp;&nbsp;
                                            <Tooltip title={
                                                <p style={{
                                                    maxWidth: '390px'
                                                }}>
                                                    设置自动执行后，在SaaS结账界面将会严格按您设置的执行顺序自动执行营销活动，不再需要手动选择，将减少营业员手动操作的步骤，方便结账更快进行。
                                                </p>
                                            }
                                            >
                                                <Icon
                                                    type="question-circle-o"
                                                    style={{
                                                        color: '#1AB495'
                                                    }}
                                                />
                                            </Tooltip>
                                        </div>
                                        <div style={{
                                            fontSize: '12px',
                                            color: '#999999'
                                        }}>
                                            对SaaS结账时可使用的活动（除团购活动外）您可以根据店铺情况设置让活动自动执行。
                                        </div>
                                    </div>
                                    {
                                        !!promotionList.length && (
                                            <Button
                                                type="ghost"
                                                icon="plus"
                                                onClick={this.openInnerModal}
                                            >选择活动</Button>
                                        )
                                    }
                                </div>
                                <div>
                                    {
                                        !promotionList.length ? (
                                            <div className={styles.emptyAutoRunBox} onClick={this.openInnerModal}>
                                                <div className={styles.emptyAutoRunBoxTip}>
                                                    <div style={{
                                                        fontSize: 24,
                                                        textAlign: 'center'
                                                    }}>
                                                        <Icon type="plus" />
                                                    </div>
                                                    <div>
                                                        点击选择活动
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (this.renderAutoRunTable())
                                    }
                                </div>
                            </div>
                        )
                    }
                </Spin>
                {this.renderInnerSelectorModal()}
            </Modal>
        )
    }
}

function mapStateToProps(state) {
    return {
        isVisible: state.sale_promotionAutoRunState.get('isModalVisible'),
        isSaving: state.sale_promotionAutoRunState.get('isSaving'),
        isLoading: state.sale_promotionAutoRunState.get('isLoading'),
        hasError: state.sale_promotionAutoRunState.get('hasError'),
        promotionList: state.sale_promotionAutoRunState.get('promotionList'),
        availableList: state.sale_promotionAutoRunState.get('allAvailablePromotionList').toJS(),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        closePromotionAutoRunListModal: opts => dispatch(closePromotionAutoRunListModal(opts)),
        savePromotionAutoRunList: opts => dispatch(savePromotionAutoRunList(opts)),
        queryPromotionAutoRunList: opts => dispatch(queryPromotionAutoRunList(opts)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PromotionAutoRunModal)
