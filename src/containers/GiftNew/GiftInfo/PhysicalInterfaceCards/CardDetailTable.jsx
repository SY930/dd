import React from "react";
import moment from "moment";
import { Row, Table, Button, Menu, Dropdown, message, Modal } from "antd";
import _ from "lodash";
import BaseForm from "../../../../components/common/BaseForm";
import OpenCard from "./OpenCard";
import { DETAIL_CONFIG, FORM_ITEMS, MODAL_CONFIG } from "./DetailCommon";
import SendDetailModal from "./SendDetailModal";
import SendCard from "./SendCard";
import {
    CARD_CREATE,
    CARD_QUERY,
    CARD_UPDATE,
    CARD_DELETE,
    CARD_CHECK,
} from "../../../../constants/authorityCodes";
import Authority from "../../../../components/common/Authority";
import {
    getOpenCardList,
    openCardOperate,
    getCompanyList,
    cardSync,
    cardExport,
} from "./AxiosFactory";
import ExportModal from "./ExportModal";
import styles from "./index.less";

export default class CardDetailTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            dataSource: [],
            queryParams: { pageNo: 1, pageSize: 25 },
            pageObj: { current: 1, pageSize: 25, total: 0 },
            selectedRowKeys: [],
            selectedRows: [],
            openModalType: "add",
            sendCardType: "eCard",
            companyList: [],
        };
        this.queryForm = null;
        this.menu = (
            <Menu>
                <Menu.Item>
                    <Authority rightCode={CARD_CHECK}>
                        <a
                            onClick={() => {
                                this.handleBtnClick("pass");
                            }}
                        >
                            通过
                        </a>
                    </Authority>
                </Menu.Item>
                <Menu.Item>
                    <Authority rightCode={CARD_CHECK}>
                        <a
                            onClick={() => {
                                this.handleBtnClick("reject");
                            }}
                        >
                            驳回
                        </a>
                    </Authority>
                </Menu.Item>
            </Menu>
        );
        this.btnObj = {
            activeCard: (disabled) => (
                <div className="btn-item">
                    <Button
                        type="primary"
                        onClick={() => this.handleBtnClick("activeCard")}
                        disabled={disabled}
                    >
                        新建开卡
                    </Button>
                </div>
            ),
            checkCard: (disabled) => (
                <div className="btn-item">
                    <Dropdown overlay={this.menu}>
                        <Authority rightCode={CARD_CHECK}>
                            <Button
                                type="ghost"
                                className="layoutsToolRight"
                                disabled={disabled}
                            >
                                审核
                            </Button>
                        </Authority>
                    </Dropdown>
                </div>
            ),
            sendCard: (disabled) => (
                <div className="btn-item">
                    <Authority rightCode={CARD_CREATE}>
                        <Button
                            type="primary"
                            onClick={() => this.handleBtnClick("sendCard")}
                            disabled={disabled}
                        >
                            新建发卡
                        </Button>
                    </Authority>
                </div>
            ),
            push: (disabled) => (
                <div className="btn-item">
                    <Authority rightCode={CARD_UPDATE}>
                        <Button
                            type="ghost"
                            onClick={() => this.handleBtnClick("push")}
                            disabled={disabled}
                        >
                            推送sap
                        </Button>
                    </Authority>
                </div>
            ),
            exportEXCEL: () => (
                <div className="btn-item">
                    <Authority rightCode={CARD_QUERY}>
                        <Button
                            type="ghost"
                            onClick={() => this.handleBtnClick("exportEXCEL")}
                        >
                            导出
                        </Button>
                    </Authority>
                </div>
            ),
            cancel: (disabled) => (
                <div className="btn-item">
                    <Authority rightCode={CARD_DELETE}>
                        <Button
                            type="ghost"
                            onClick={() => this.handleBtnClick("cancel")}
                            disabled={disabled}
                        >
                            作废
                        </Button>
                    </Authority>
                </div>
            ),
            cancelCancel: (disabled) => (
                <div className="btn-item">
                    <Authority rightCode={CARD_UPDATE}>
                        <Button
                            type="ghost"
                            onClick={() => this.handleBtnClick("cancelCancel")}
                            disabled={disabled}
                        >
                            取消作废
                        </Button>
                    </Authority>
                </div>
            ),
        };
    }

    componentDidMount() {
        this.fetchList();
        getCompanyList({
            groupID: this.props.groupID,
            pageNo: 1,
            pageSize: 2000,
        }).then((res) => {
            const { list = [] } = res;
            this.setState({ companyList: list });
        });
    }

    /* 点击查询把参数传给父组件 */
    onQuery = () => {
        const {
            createTime = [],
            openCardTime = [],
            sendCardTime = [],
            ...formVal
        } = this.form.getFieldsValue();
        const { tabKey } = this.props;
        const { createTime: createTimeKey } = DETAIL_CONFIG[tabKey];
        const startTime = createTime[0]
            ? moment(createTime[0]).format("YYYY-MM-DD")
            : "";
        const endTime = createTime[1]
            ? moment(createTime[1]).format("YYYY-MM-DD")
            : "";
        const params = { pageNo: 1, ...formVal, createTime: undefined };
        if (tabKey === "cardTotal") {
            params.openCardStartTime = openCardTime[0]
                ? moment(openCardTime[0]).format("YYYY-MM-DD")
                : "";
            params.openCardEndTime = openCardTime[1]
                ? moment(openCardTime[1]).format("YYYY-MM-DD")
                : "";
            params.sendCardStartTime = sendCardTime[0]
                ? moment(sendCardTime[0]).format("YYYY-MM-DD")
                : "";
            params.sendCardEndTime = sendCardTime[1]
                ? moment(sendCardTime[1]).format("YYYY-MM-DD")
                : "";
        } else {
            params[createTimeKey["startTime"]] = startTime;
            params[createTimeKey["endTime"]] = endTime;
        }
        this.setState(
            ({ queryParams }) => ({
                queryParams: {
                    ...queryParams,
                    ...params,
                },
            }),
            () => {
                this.fetchList();
            }
        );
    };

    fetchList = () => {
        const { item, groupID } = this.props;
        getOpenCardList(
            { templateID: item.itemID, groupID, ...this.state.queryParams },
            DETAIL_CONFIG[this.props.tabKey].listMethod
        ).then((obj) => {
            const { pageObj, list } = obj;
            this.setState({
                pageObj: pageObj || this.state.pageObj,
                dataSource: list,
                loading: false,
            });
        });
    };

    handlePageChange = (pageNo, pageSize) => {
        const { pageObj } = this.state;
        this.setState(
            ({ queryParams }) => ({
                queryParams: {
                    ...queryParams,
                    pageNo: pageObj.pageSize !== pageSize ? 1 : pageNo,
                    pageSize,
                },
            }),
            this.fetchList
        );
    };

    /* 获取form对象 */
    onGetForm = (form) => {
        this.form = form;
    };

    handleSendCardOpen = () => {
        const { item } = this.props;
        this.setState({
            sendCardVisible: true,
            sendCardType: item.templateType === "A" ? "eCard" : "pCard",
            record: {},
        });
    };

    handleBtnClick = (key) => {
        switch (key) {
            case "activeCard": //开卡
                this.setState({
                    openVisible: true,
                    openModalType: "add",
                    record: {},
                });
                break;
            case "pass": //通过
            case "reject": //驳回
            case "push": //推送sap
            case "cancel": //作废
            case "cancelCancel": //取消作废
                this.handleModalTips(key);
                break;
            case "sendCard": //发卡
                this.handleSendCardOpen();
                break;
            case "exportEXCEL": //导出
                this.handleExportEXCEL();
                break;
            default:
                break;
        }
    };

    handleModalTips = (key) => {
        const {
            title,
            checkTips,
            unselectedTips,
            okBtn = "确定",
            operateType,
        } = MODAL_CONFIG[key];
        const { selectedRowKeys, selectedRows } = this.state;
        const { item, groupID, tabKey } = this.props;
        if (selectedRowKeys.length === 0 && unselectedTips) {
            message.warning(unselectedTips);
            return;
        }
        if (checkTips) {
            let flag = false;
            if (key === "reject") {
                const arr = tabKey === "openCard" ? [1] : [1, 2];
                flag = selectedRows.some(
                    (item) => !arr.includes(item.auditStatus)
                );
            }
            if (key === "pass" || key === "cancel") {
                flag = selectedRows.some((item) => item.auditStatus !== 1);
            }
            if (key === "cancelCancel") {
                flag = selectedRows.some((item) => item.auditStatus !== 4);
            }
            if (flag) {
                message.warning(checkTips);
                return;
            }
        }
        if (key === "pass") {
            this.handelOpenCardOperate(
                {
                    operateType,
                    itemIDs: selectedRowKeys,
                },
                "audit"
            );
            return;
        }
        const _this = this;
        Modal.confirm({
            title,
            onOk: () => {
                if (key === "push") {
                    cardSync({
                        groupID,
                        templateID: item.itemID,
                        taskIDs: selectedRowKeys,
                    }).then((res) => {
                        if (res) {
                            setTimeout(() => {
                                this.fetchList();
                            }, 1000);
                            this.setState({
                                selectedRowKeys: [],
                                selectedRows: [],
                            });
                        }
                        this.setState({ loading: false });
                    });
                    return;
                }
                _this.handelOpenCardOperate(
                    {
                        operateType,
                        itemIDs: selectedRowKeys,
                    },
                    key === "cancel" || key === "cancelCancel"
                        ? "invalid"
                        : "audit"
                );
            },
            onCancel: () => {
                if (key === "sendCard") {
                    this.setState({ cardValue: "" });
                }
            },
            okText: okBtn,
        });
    };

    handleExportEXCEL = () => {
        const { item, groupID } = this.props;
        const { selectedRowKeys, selectedRows } = this.state;
        if (selectedRowKeys.length === 0) {
            message.warning("请选择需要导出的数据");
            return;
        }
        if (selectedRows.some((item) => item.auditStatus !== 2)) {
            message.warning("审核通过的任务才可导出！");
            return;
        }
        cardExport(
            {
                templateID: item.itemID,
                groupID,
                taskIDs: selectedRowKeys,
            },
            "cardInfoExport"
        ).then((res) => {
            if (res) {
                this.setState({
                    selectedRowKeys: [],
                    selectedRows: [],
                    exportVisible: true,
                });
            }
        });
    };

    handelOpenCardOperate = _.throttle(
        (params, invalidOraudit) => {
            this.setState({ loading: true });
            const { item, groupID, tabKey } = this.props;
            const { operationMethod } = DETAIL_CONFIG[tabKey];
            openCardOperate(
                { templateID: item.itemID, groupID, ...params },
                `${operationMethod[0]}/${invalidOraudit}${operationMethod[1]}`
            ).then((res) => {
                if (res) {
                    setTimeout(() => {
                        this.fetchList();
                    }, 1000);
                    this.setState({ selectedRowKeys: [], selectedRows: [] });
                }
                this.setState({ loading: false });
            });
        },
        1500,
        { trailing: true }
    );

    handleSelected = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows });
    };

    handleOperate = (key, item) => {
        switch (key) {
            case "preview":
                if (this.props.tabKey === "openCard") {
                    this.setState({
                        openVisible: true,
                        openModalType: key,
                        record: item,
                    });
                } else {
                    this.setState({ sendDetailVisible: true, record: item });
                }
                break;
            case "edit":
                if (this.props.tabKey === "openCard") {
                    this.setState({
                        openVisible: true,
                        openModalType: key,
                        record: item,
                    });
                } else {
                    this.setState({
                        sendCardVisible: true,
                        record: item,
                        sendCardType:
                            this.props.item.templateType === "A"
                                ? "eCard"
                                : "pCard",
                    });
                }
                break;
            default:
                break;
        }
    };

    /* 整理formItems对象 */
    resetFormItems = () => {
        const qProp = {
            type: "primary",
            icon: "search",
            onClick: this.onQuery,
        };
        const {
            taskNo,
            companyCode,
            q,
            activeCard,
            checkCard,
            sendCard,
            push,
            exportEXCEL,
            cancel,
            cancelCancel,
            ...other
        } = FORM_ITEMS;
        companyCode.options = this.state.companyList;

        return {
            ...other,
            taskNo: {
                ...taskNo,
                label:
                    this.props.tabKey === "cardSend"
                        ? "发卡任务编号"
                        : taskNo.label,
            },
            companyCode,
            q: {
                ...q,
                render: () => (
                    <div>
                        <Button {...qProp}>查询</Button>
                    </div>
                ),
            },
        };
    };

    getBtnItems = () => {
        const { tabKey, item } = this.props;
        const { btnList } = DETAIL_CONFIG[tabKey];
        const disabled = item.status == 2 ? true : false;
        return btnList.map((item) => this.btnObj[item](disabled));
    };

    /* 生成表格头数据 */
    generateColumns() {
        const { tabKey } = this.props;
        const { columns } = DETAIL_CONFIG[tabKey];
        return columns({ handleOperate: this.handleOperate });
    }

    handleCancel = () => {
        this.setState({
            openVisible: false,
            sendDetailVisible: false,
            sendCardVisible: false,
            exportVisible: false,
        });
    };

    render() {
        const {
            tabKey = "openCard",
            item,
            upDateParentState,
            groupID,
        } = this.props;
        const {
            loading,
            dataSource,
            selectedRowKeys,
            openVisible,
            openModalType,
            sendDetailVisible,
            sendCardVisible,
            sendCardType,
            pageObj,
            record,
            companyList,
            exportVisible,
        } = this.state;
        const { formKeys, scroll } = DETAIL_CONFIG[tabKey];
        const formItems = this.resetFormItems();
        const btnItems = this.getBtnItems();
        const columns = this.generateColumns();
        return (
            <div className={styles.card_table_wrap}>
                <Row className="card_table_query_form">
                    <BaseForm
                        getForm={this.onGetForm}
                        formItems={formItems}
                        formKeys={formKeys}
                        layout="inline"
                    />
                    <div className="btn_list_wrap">
                        {btnItems.map((item) => item)}
                    </div>
                </Row>
                <Row className="table_wrap">
                    <Table
                        rowKey="itemID"
                        className="tableStyles"
                        bordered={true}
                        columns={columns}
                        dataSource={dataSource}
                        scroll={{ x: scroll.x, y: 300 }}
                        rowSelection={
                            tabKey !== "cardTotal"
                                ? {
                                      onChange: this.handleSelected,
                                      selectedRowKeys,
                                  }
                                : null
                        }
                        loading={loading}
                        pagination={{
                            showSizeChanger: true,
                            pageSize: pageObj.pageSize,
                            current: pageObj.current,
                            total: pageObj.total,
                            onChange: this.handlePageChange,
                            onShowSizeChange: this.handlePageChange,
                            showTotal: (totalSize, range) =>
                                `本页${range[0]}-${range[1]}/ 共 ${totalSize}条`,
                        }}
                    />
                </Row>
                {openVisible && (
                    <OpenCard
                        visible={openVisible}
                        handleCancel={this.handleCancel}
                        type={openModalType}
                        fetchList={this.fetchList}
                        groupID={groupID}
                        templateID={item.itemID}
                        record={record}
                        upDateParentState={upDateParentState}
                    />
                )}
                {sendDetailVisible && (
                    <SendDetailModal
                        visible={sendDetailVisible}
                        handleCancel={this.handleCancel}
                        record={record}
                        templateType={item.templateType}
                    />
                )}
                {sendCardVisible && (
                    <SendCard
                        visible={sendCardVisible}
                        handleCancel={this.handleCancel}
                        type={sendCardType}
                        item={item}
                        groupID={groupID}
                        templateID={item.itemID}
                        fetchList={this.fetchList}
                        record={record}
                        upDateParentState={upDateParentState}
                        companyList={companyList}
                    />
                )}
                {exportVisible && (
                    <ExportModal
                        visible={exportVisible}
                        handleClose={this.handleCancel}
                        templateID={item.itemID}
                        groupID={groupID}
                    />
                )}
            </div>
        );
    }
}
