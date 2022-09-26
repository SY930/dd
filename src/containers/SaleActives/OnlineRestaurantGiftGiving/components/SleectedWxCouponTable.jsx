/*
 * @Author: 张博奥 zhangboao@hualala.com
 * @Date: 2022-09-25 16:33:02
 * @LastEditors: 张博奥 zhangboao@hualala.com
 * @LastEditTime: 2022-09-26 10:28:26
 * @FilePath: /platform-sale/src/containers/SaleActives/OnlineRestaurantGiftGiving/components/SleectedWxCouponTable.jsx
 * @Description: 选中的第三方微信券列表
 */
import React, { Component } from "react";
import { Modal, Table, Tooltip, Popconfirm } from "antd";
import styles from "../styles.less";

class SleectedWxCouponTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNo: 1,
            pageSize: 30,
        };
    }

    handleRemove = (itemID) => {
        const slectedWxCouponList = this.props.slectedWxCouponList.filter(
            (item) => item.itemID !== itemID
        );
        this.setState({ slectedWxCouponList });
        this.props.onWxCouponChange(slectedWxCouponList);
    };

    render() {
        const columns = [
            {
                title: "券ID",
                dataIndex: "itemID",
                key: "itemID",
                className: "TableTxtCenter",
                width: 160,
                render: (text) => text,
            },
            {
                title: "券名称",
                dataIndex: "batchName",
                className: "TableTxtCenter",
                key: "batchName",
                width: 200,
                render: (text, record) => (
                    <Tooltip title={text || record.giftName}>
                        {text || record.giftName}
                    </Tooltip>
                ),
            },
            {
                title: "操作",
                key: "operation",
                className: "TableTxtCenter",
                width: 80,
                render: (text, record, index) => {
                    return (
                        <Popconfirm
                            title="确定要删除吗？"
                            onConfirm={() => this.handleRemove(record.itemID)}
                        >
                            <a href="#"> 删除</a>
                        </Popconfirm>
                    );
                },
            },
        ];
        return (
            <div style={{ marginTop: 10 }}>
                <Table
                    scroll={{ x: 500 }}
                    className={styles.WxCouponTable}
                    bordered={true}
                    columns={columns}
                    dataSource={this.props.slectedWxCouponList}
                    rowKey={"itemID"}
                    pagination={false}
                />
            </div>
        );
    }
}

export default SleectedWxCouponTable;
