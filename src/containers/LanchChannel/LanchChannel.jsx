import React from "react";
import { connect } from "react-redux";
import { Icon, Button, Row, Col, Tooltip, Modal, message } from "antd";
import FiltersForm from "./components/FiltersForm";
import ChannelModal from "./components/ChannelModal";
import List from "./components/List";
import GroupTree from "./components/GroupTree";
import styles from "./style.less";
import { axiosData, setSensorsData } from "../../helpers/util";

class LanchChannel extends React.Component {
    state = {
        modalVisible: false,
        modalType: "group", //分组或渠道
        isEdit: false, //添加或编辑
        currentData: {}, //编辑的数据
        selectedRowKeys: [], //选中的行
        total: 0,
        list: [],
        loading: false,
        groupData: [],
        formData: {},
        channelGroupItemID: undefined,
    };

    componentDidMount() {
        this.getGroupList();
        this.getChannelList({ pageNo: 1, pageSize: 10 });
        setSensorsData("活动投放渠道管理");
    }

    getGroupList = () => {
        axiosData(
            "/launchchannel/launchChannelService_queryLaunchChannelGroupList.ajax",
            {},
            null,
            { path: "" },
            "HTTP_SERVICE_URL_PROMOTION_NEW"
        )
            .then((res) => {
                this.setState({
                    groupData: res.datas,
                });
            })
            .catch((err) => {
                // empty catch
            });
    };

    getChannelList = (payload) => {
        this.setState({ loading: true });
        axiosData(
            "/launchchannel/launchChannelService_queryChannelList.ajax",
            { ...payload },
            {},
            { path: "" },
            "HTTP_SERVICE_URL_PROMOTION_NEW"
        )
            .then((res) => {
                this.setState({
                    list: res.data.datas || [],
                    loading: false,
                    total: res.data.totalSize,
                });
            })
            .catch((err) => {
                // empty catch
                this.setState({
                    loading: false,
                });
            });
    };

    batchDelete = () => {
        if (!this.state.selectedRowKeys.length) {
            message.warning("请选择渠道");
            return;
        }
        this.delChannel(this.state.selectedRowKeys);
    };

    onSearch = (params) => {
        this.setState({ formData: params });
        this.getChannelList({
            ...params,
            pageNo: 1,
            pageSize: 10,
            channelGroupItemID: this.state.channelGroupItemID,
        });
    };

    openModal = (type, isEdit, data) => {
        this.setState({
            modalVisible: true,
            modalType: type,
            isEdit: isEdit,
            currentData: data,
        });
    };

    delChannel = (channelIDs) => {
        const payload = {
            channelItemIDs: channelIDs,
        };
        Modal.confirm({
            title: "确定要删除该渠道？",
            content: "删除渠道后，已引用的活动将无法继续记录用户的参与信息。",
            okText: "确定",
            cancelText: "取消",
            onOk: () => {
                axiosData(
                    "/launchchannel/launchChannelService_deleteChannel.ajax",
                    { ...payload },
                    {},
                    { path: "" },
                    "HTTP_SERVICE_URL_PROMOTION_NEW"
                )
                    .then((res) => {
                        if (res.code == "000") {
                            message.success("删除渠道成功");
                            this.setState({
                                selectedRowKeys: [],
                            });
                            this.getGroupList();
                            this.getChannelList({
                                pageNo: 1,
                                pageSize: 10,
                                channelGroupItemID: this.state
                                    .channelGroupItemID,
                                ...this.state.formData,
                            });
                        }
                    })
                    .catch((err) => {
                        // empty catch
                    });
            },
            onCancel() {
                console.log("Cancel");
            },
        });
    };

    onCancel = () => {
        this.setState({
            modalVisible: false,
            modalType: "group",
            isEdit: false,
            currentData: {},
        });
    };

    changeRowKeys = (keys, rows) => {
        this.setState({
            selectedRowKeys: keys,
        });
    };

    delGroup = (item) => {
        const payload = {
            channelGroupItemID: item.itemID,
        };
        Modal.confirm({
            title: "确定删除渠道分组？",
            content:
                "删除分组后，分组下渠道也将全部删除，已引用该渠道的活动将无法记录用户参与信息。",
            okText: "确定",
            cancelText: "取消",
            onOk: () => {
                axiosData(
                    "/launchchannel/launchChannelService_deleteLaunchChannelGroup.ajax",
                    { ...payload },
                    {},
                    { path: "" },
                    "HTTP_SERVICE_URL_PROMOTION_NEW"
                )
                    .then((res) => {
                        if (res.code == "000") {
                            message.success("删除分组成功");
                            this.getGroupList();
                            this.getChannelList({
                                pageNo: 1,
                                pageSize: 10,
                            });
                        }
                    })
                    .catch((err) => {
                        // empty catch
                        this.setState({
                            loading: false,
                        });
                    });
            },
            onCancel() {
                console.log("Cancel");
            },
        });
    };

    selectGroup = (channelGroupItemID) => {
        this.setState({ channelGroupItemID });
        this.getChannelList({
            channelGroupItemID: channelGroupItemID,
            pageNo: 1,
            pageSize: 10,
            ...this.state.formData,
        });
    };

    onChangeTable = (pagination) => {
        this.getChannelList({
            pageNo: pagination.current,
            pageSize: pagination.pageSize,
            channelGroupItemID: this.state.channelGroupItemID,
            ...this.state.formData,
        });
    };

    handleSubmit = (url, params) => {
        const { isEdit, modalType } = this.state;
        let resetParams = {};
        if (modalType == "group") {
            resetParams = isEdit
                ? {
                      pageNo: 1,
                      pageSize: 10,
                      channelGroupItemID: this.state.channelGroupItemID,
                  }
                : { pageNo: 1, pageSize: 10 };
        } else if (modalType == "channel") {
            resetParams = isEdit
                ? {
                      pageNo: 1,
                      pageSize: 10,
                      channelGroupItemID: this.state.channelGroupItemID,
                      ...this.state.formData,
                  }
                : {
                      pageNo: 1,
                      pageSize: 10,
                      channelGroupItemID: this.state.channelGroupItemID,
                  };
        }
        axiosData(
            url,
            { ...params },
            {},
            { path: "" },
            "HTTP_SERVICE_URL_PROMOTION_NEW"
        )
            .then((res) => {
                if (res.code == "000") {
                    message.success(
                        `${isEdit ? "编辑" : "添加"}${
                            modalType == "group" ? "分组" : "渠道"
                        }成功`
                    );
                    this.onCancel();
                    this.modalForm.resetFields();
                    this.getGroupList();
                    this.getChannelList(resetParams);
                }
            })
            .catch((err) => {
                // empty catch
            });
    };

    changeGroup = (item, index) => {
        this.setState({
            channelGroupItemID: index,
        });
        this.selectGroup(item.itemID);
    };

    clickTotal = () => {
        this.setState({
            channelGroupItemID: "",
        });
        this.selectGroup("");
    };

    render() {
        const {
            modalVisible,
            modalType,
            isEdit,
            loading,
            list,
            selectedRowKeys,
            total,
            groupData,
            currentData,
            channelGroupItemID,
        } = this.state;

        return (
            <div className="layoutsContainer">
                <div className={styles.header}>
                    <div className={styles.titleArea}>
                        <span className={styles.title}>活动投放渠道管理</span>
                        <Tooltip
                            placement="right"
                            title="营销活动提取活动链接/小程序码时添加投放渠道，可在活动跟踪中查看该活动参与者渠道来源。"
                        >
                            <Icon
                                type="question-circle-o"
                                style={{ fontSize: 14, marginLeft: 8 }}
                            />
                        </Tooltip>
                    </div>
                    <div>
                        <Button
                            onClick={() =>
                                this.openModal("channel", false, {
                                    channelGroupItemID:
                                        channelGroupItemID || undefined,
                                })
                            }
                            type="ghost"
                            icon="plus"
                        >
                            新增渠道
                        </Button>
                        <Button
                            type="ghost"
                            onClick={this.batchDelete}
                            style={{ marginLeft: 20 }}
                            icon="delete"
                        >
                            批量删除
                        </Button>
                    </div>
                </div>
                <div
                    style={{ padding: "0 20px" }}
                    className={styles.headerActions}
                >
                    <FiltersForm onSearch={this.onSearch} />
                </div>
                <div className={styles.divideLine} />
                <Row
                    style={{
                        padding: "12px 20px",
                        display: "flex",
                        height: "calc(100vh - 200px)",
                    }}
                >
                    <Col>
                        <GroupTree
                            groupData={groupData}
                            addGroup={this.openModal}
                            editGroup={this.openModal}
                            delGroup={this.delGroup}
                            currentGroup={channelGroupItemID}
                            changeGroup={this.changeGroup}
                            clickTotal={this.clickTotal}
                        />
                    </Col>
                    <Col style={{ flex: 1 }} className={styles.tableClass}>
                        <List
                            editChannel={this.openModal}
                            loading={loading}
                            list={list}
                            selectedRowKeys={selectedRowKeys}
                            changeRowKeys={this.changeRowKeys}
                            total={total}
                            onChangeTable={this.onChangeTable}
                            delChannel={this.delChannel}
                        />
                    </Col>
                </Row>
                <ChannelModal
                    ref={(form) => (this.modalForm = form)}
                    modalVisible={modalVisible}
                    modalType={modalType}
                    isEdit={isEdit}
                    onCancel={this.onCancel}
                    groupData={groupData}
                    handleSubmit={this.handleSubmit}
                    formData={currentData}
                ></ChannelModal>
            </div>
        );
    }
}

function matStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(matStateToProps, mapDispatchToProps)(LanchChannel);
