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
    message,
    Checkbox,
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

const CheckboxGroup = Checkbox.Group;

@injectIntl()
class PromotionAutoRunModal extends Component {

    constructor(props) {
        super(props);
        const promotionList = props.promotionList.toJS();
        this.state = {
            innerModalVisible: false,
            promotionList,
            selectedRowKeys: promotionList.map(item => item.promotionID),
            checkedValues: [],
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
            selectedRowKeys: rowKeys,
            checkedValues,
        } = this.state;
        const {
            availableList
        } = this.props;
        const selectedRowKeys = [...checkedValues, ...rowKeys];
        let tempList = availableList
            .filter(item => selectedRowKeys.includes(item.promotionID))  // 已选项
            .sort((a, b) => { // 按照已排序列表中的顺序进行排序
                    return (promotionList.findIndex(promotion => promotion.promotionID === a.promotionID) -
                    promotionList.findIndex(promotion => promotion.promotionID === b.promotionID))
                }
            );
        const c1 = promotionList.find(x=>x.promotionID === '-10'); // 会员价
        const c2 = promotionList.find(x=>x.promotionID === '-20');  // 会员折扣
        const i1 = selectedRowKeys.includes('-10');
        const i2 = selectedRowKeys.includes('-20');
        // 已选列表无 ，但 已选缓存有
        if(!c2 && i2){
            const f2 = tempList.findIndex(x=>x.promotionID === '-20');  // 会员折扣
            const o = tempList.splice(f2, 1)[0];
            const first = promotionList.findIndex(x=>x.promotionID === '-10');
            const idx =  first === 0 ? 1 : 0; // 会员价已经是第一了就不动
            tempList.splice(idx, 0, o);
        }
        if(!c1 && i1){
            const f1 = tempList.findIndex(x=>x.promotionID === '-10'); // 会员价
            const o = tempList.splice(f1, 1)[0];
            tempList.splice(0, 0, o);
        }
        this.setState({
            promotionList: tempList,
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
    onEventChange = (checkedValues) => {
        this.setState({ checkedValues });
    }
    renderInnerTable() {
        const { checkedValues } = this.state;
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                if(selectedRowKeys.length >= 30 + 1){
                    message.warning('自动执行活动不能超过30个');
                    return;
                }
                this.setState({
                    selectedRowKeys
                })
            },
            getCheckboxProps: (record) => ({
                disabled: this.state.selectedRowKeys.length >= 3 && !this.state.selectedRowKeys.includes(record.promotionID),
                name: record.name,
            }),
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
        const options = [
            { label: <span className={styles.vip1}>会员价</span>, value: '-10' },
            { label: <span className={styles.vip2}>会员折扣</span>, value: '-20' },
        ];
        const [, , ...otherList] = [...this.props.availableList];
        return (
            <div>
                <div>
                    <h3 className={styles.autoTitle}>会员权益</h3>
                    <CheckboxGroup className={styles.ckGroup} options={options} value={checkedValues} onChange={this.onEventChange} />
                </div>
                <h3 className={styles.autoTitle}>账单活动</h3>
                <Table
                    bordered={true}
                    scroll={{ y: 352 }}
                    rowSelection={rowSelection}
                    rowKey="promotionID"
                    columns={columns}
                    pagination={false}
                    dataSource={otherList}
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
                render: (promotionName, row) => {
                    let text = promotionName;
                    let clazz = '';
                    if (promotionName === undefined || promotionName === null || promotionName === '') {
                        text = '--';
                    }
                    if(row.promotionID === '-10') {
                        text = '会员价';
                        clazz = styles.vip1;
                    }
                    if(row.promotionID === '-20') {
                        text = '会员折扣';
                        clazz = styles.vip2;
                    }
                    return (<span className={clazz} title={text}>{text}</span>);
                },
            },
            {
                title: SALE_LABEL.k5f211mg,
                dataIndex: 'order',
                className: styles.noPadding,
                width: 80,
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
        const list = this.state.promotionList.filter(x=>{
            return ['-10', '-20'].includes(x.promotionID);
        });
        const list2 = this.state.promotionList.filter(x=>{
            return !['-10', '-20'].includes(x.promotionID);
        });
        const checkedValues = list.map(item => item.promotionID);
        const selectedRowKeys = list2.map(item => item.promotionID);
        this.setState({
            innerModalVisible: true,
            selectedRowKeys,
            checkedValues,
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
