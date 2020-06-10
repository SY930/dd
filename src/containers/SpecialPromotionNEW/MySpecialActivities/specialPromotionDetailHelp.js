/**
 *  将specialPromotionDetail中部分逻辑拆出来，原文件过大
 */
import React from "react";
import { Table } from "antd";
import {
    dataOverviewColumns,
    beRecommendTitleList,
    tempColumns,
} from "./constant";

/** 推荐有礼开始 */
export const renderOverViewData = function () {
    const { dataOverviewDataSource } = this.state;

    return (
        <Table
            style={{ width: "80%" }}
            dataSource={dataOverviewDataSource}
            columns={dataOverviewColumns}
            bordered={true}
            pagination={false}
        />
    );
};
/** 推荐有礼结束 */
