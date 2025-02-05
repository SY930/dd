/*
 * @Author: 张博奥 zhangboao@hualala.com
 * @Date: 2022-09-25 16:33:02
 * @LastEditors: 张博奥 zhangboao@hualala.com
 * @LastEditTime: 2022-09-26 10:29:16
 * @FilePath: /platform-sale/src/containers/SaleActives/OnlineRestaurantGiftGiving/components/WxCouponModal.jsx
 * @Description: 添加第三方微信券弹框
 */
import React, { Component } from "react";
import { Modal, Table, Input, Button, message } from "antd";
import { axiosData } from "../../../../helpers/util";

const Search = Input.Search;

const columns = [
    {
        title: "券ID",
        dataIndex: "itemID",
        className: "TableTxtCenter",
        key: "itemID",
        width: 200,
        render: (text) => text,
    },
    {
        title: "券名称",
        dataIndex: "batchName",
        className: "TableTxtCenter",
        key: "batchName",
        width: 200,
        render: (text) => text,
    },
    {
        title: "剩余数量",
        dataIndex: "stock",
        key: "stock",
        className: "TableTxtCenter",
        width: 80,
        render: (text, record) => {
            const { receive } = record;
            if (text) {
                return Number(text) - Number(receive);
            }
        },
    },
];

class WxCouponModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wxCouponList: [],
            pageNo: 1,
            pageSize: 10,
            slectedWxCouponList: [],
            selectedRowKeys: [],
            keyword: "",
        };
    }
    componentDidMount() {
        this.handleQuery();
        this.initSelectedRowKey();
    }

    initSelectedRowKey = () => {
        const selectedRowKeys = (this.props.slectedWxCouponList || []).map(
            (item) => item.itemID
        );
        this.setState({
            selectedRowKeys,
        });
    };

    handleSearch = ({ target: { value } }) => {
        this.setState({
            keyword: value,
        });
    };

    handleSubmit = () => {
        const { slectedWxCouponList } = this.state;
        if (slectedWxCouponList.length) {
            this.props.onWxCouponChange(this.state.slectedWxCouponList);
        } else {
            this.props.onWxCouponChange(this.props.slectedWxCouponList);
        }
        this.props.onCancel();
    };

    handleQuery = (itemID = "") => {
        if (itemID && !/^\d+$/.test(itemID)) {
            return message.warn("请输入正确的券ID");
        }
        const { user } = this.props;
        const {
            accountInfo: { groupID },
        } = user;
        const params1 = {
            groupID,
            pageNo: this.state.pageNo,
            pageSize: this.state.pageSize,
            platformType: "3",
            itemID,
            batchStatus: "0,1",
        };
        axiosData(
            "couponCodeBatchService/queryBatchList.ajax",
            { ...params1 },
            null,
            { path: null },
            "HTTP_SERVICE_URL_PROMOTION_NEW"
        ).then((records) => {
            const { code, data } = records;
            if (code === "000") {
                const { couponCodeBatchInfos = [], totalSize = 0 } = data;
                this.setState({
                    wxCouponList: couponCodeBatchInfos || [],
                    total: totalSize,
                });
            }
        });
    };

    onShowSizeChange = (pageNo, pageSize) => {
        this.setState(
            {
                pageSizes: pageSize,
                pageNo,
            },
            () => {
                this.handleQuery();
            }
        );
    };

    render() {
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                if (selectedRowKeys.length > 1) {
                    return message.warn("最多选择1个券");
                }
                this.setState({
                    slectedWxCouponList: selectedRows,
                    selectedRowKeys,
                });
            },
            selectedRowKeys: this.state.selectedRowKeys,
        };
        const { keyword } = this.state;
        return (
            <Modal
                visible={true}
                width={700}
                title="添加第三方微信优惠券"
                onCancel={this.props.onCancel}
                onOk={this.handleSubmit}
            >
                <div style={{ display: "flex", marginBottom: 10 }}>
                    <Search
                        value={keyword}
                        placeholder="请输入券ID查询"
                        onChange={this.handleSearch}
                        style={{ width: 240 }}
                    />
                    <Button
                        onClick={() => {
                            this.handleQuery(keyword);
                        }}
                        style={{ marginLeft: 10 }}
                        type="primary"
                    >
                        查询
                    </Button>
                </div>
                <Table
                    scroll={{ x: 500 }}
                    bordered={true}
                    columns={columns}
                    dataSource={this.state.wxCouponList}
                    rowSelection={rowSelection}
                    rowKey={"itemID"}
                    pagination={{
                        pageSize: this.state.pageSizes,
                        current: this.state.pageNo,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        onShowSizeChange: this.onShowSizeChange,
                        total: this.state.total || 0,
                        showTotal: (total, range) =>
                            `本页${range[0]}-${range[1]} / 共 ${total} 条`,
                        onChange: (page, pageSize) => {
                            this.setState(
                                {
                                    pageSizes: pageSize,
                                    pageNo: page,
                                },
                                () => {
                                    this.handleQuery();
                                }
                            );
                        },
                    }}
                />
            </Modal>
        );
    }
}

export default WxCouponModal;
