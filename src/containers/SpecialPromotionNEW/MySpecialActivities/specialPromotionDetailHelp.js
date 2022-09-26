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
            dataSource={dataOverviewDataSource}
            columns={dataOverviewColumns}
            bordered={true}
            pagination={false}
            scroll={{ x: 800 }}
        />
    );
};
/** 推荐有礼结束 */
