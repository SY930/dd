/**
 * 群发礼品第三步操作逻辑
 * 营销活动的第三步操作都在一个文件夹中，导致SpecialPromotionDetailInfo.jsx文件过大，新增的逻辑放在此文件夹中
 */
import { axiosData } from "../../../helpers/util";

const createMemberGroup = function (data) {
    const { RFMParams } = data;

    return axiosData(
        "/crm/rfmModelService_addRfmGroupMembers.ajax",
        RFMParams,
        null,
        { path: "data" },
        "HTTP_SERVICE_URL_CRM"
    );
};

export { createMemberGroup };

export default {
    createMemberGroup,
};
