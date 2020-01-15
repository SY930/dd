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
import Authority from "../../../components/common/Authority/index";
import {AUTO_RUN_UPDATE} from "../../../constants/authorityCodes";
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from '../IntlDecor';

@injectIntl()
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
    handleInnerOk = () => {
        const {
            promotionList,
            selectedRowKeys
        } = this.state;
        const {
            availableList
        } = this.props;
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
    }

    handleInnerCancel = () => {
        const {
            promotionList,
        } = this.state;
        const {
        } = this.props;
        this.setState({
            selectedRowKeys: promotionList.map(item => item.promotionID),
            innerModalVisible: false
        })
    }

    renderInnerSelectorModal() {

        return (
            <Modal
                width={550}
                style={{
                    top: 20
                }}
                visible={this.state.innerModalVisible}
                maskClosable={false}
                onCancel={this.handleInnerCancel}
                onOk={this.handleInnerOk}
                title={SALE_LABEL.k5f2114y}
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
                title: COMMON_LABEL.serialNumber,
                className: 'TableTxtCenter',
                width: 50,
                render: (order, record, index) => index + 1,
            },
            {
                title: SALE_LABEL.k5dlcm1i,
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
            <div>
                <Table
                    bordered={true}
                    scroll={{ y: 352 }}
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
                title: SALE_LABEL.k5dlcm1i,
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
                title: SALE_LABEL.k5f211mg,
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
                            placeholder=""
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
                title: COMMON_LABEL.actions,
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
                            }}>{ COMMON_LABEL.delete }</a>
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
                    scroll={{ y: 300 }}
                    rowKey="promotionID"
                    columns={columns}
                    pagination={false}
                    dataSource={promotionList}
                />
            </div>

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
                message.success(SALE_LABEL.k5do0ps6);
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
            innerModalVisible: true,
            selectedRowKeys: this.state.promotionList.map(item => item.promotionID)
        })
    }

    render() {
        const {
            isVisible,
            isLoading,
            isSaving,
            hasError,
        } = this.props;
        const {
            promotionList
        } = this.state;
        return (
            <Modal
                visible={isVisible}
                title={SALE_LABEL.k5f2124s}
                width="720px"
                style={{
                    top: 20
                }}
                maskClosable={false}
                onCancel={this.handleCancel}
                footer={hasError ? false : [
                    <Button
                        type="ghost"
                        onClick={this.handleCancel}
                    >
                        { COMMON_LABEL.cancel }
                    </Button>,
                    <Authority rightCode={AUTO_RUN_UPDATE}>
                        <Button
                            type="primary"
                            style={{
                                marginLeft: 10
                            }}
                            onClick={this.handleOk}
                            loading={isSaving}
                        >{ COMMON_LABEL.confirm }</Button>
                    </Authority>
                ]}
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
                                {SALE_LABEL.k5dmw1z4} <a onClick={this.handleRetry}>{ COMMON_LABEL.retry }</a>
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
                                            {SALE_LABEL.k5dbiuws}&nbsp;&nbsp;
                                            <Tooltip title={
                                                <p style={{
                                                    maxWidth: '390px'
                                                }}>
                                                    {SALE_LABEL.k5f212mo}
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
                                            {SALE_LABEL.k5f21352}
                                        </div>
                                    </div>
                                    {
                                        !!promotionList.length && (
                                            <Button
                                                type="ghost"
                                                icon="plus"
                                                onClick={this.openInnerModal}
                                        >{SALE_LABEL.k5f213qb}</Button>
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
                                                    {SALE_LABEL.k5f213qb}
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
