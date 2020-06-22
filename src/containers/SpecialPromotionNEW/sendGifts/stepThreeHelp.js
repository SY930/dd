/**
 * 群发礼品第三步操作逻辑
 * 营销活动的第三步操作都在一个文件夹中，导致SpecialPromotionDetailInfo.jsx文件过大，新增的逻辑放在此文件夹中
 */
import { axiosData } from "../../../helpers/util";

const createMemberGroup = function (data) {
    console.log("----", this, data);
    const { eventInfo, RFMParams } = data;

    return axiosData(
        "/crm/rfmModelService_addRfmGroupMembers.ajax",
        RFMParams,
        null,
        { path: "data" },
        "HTTP_SERVICE_URL_CRM"
    )
        .then((res) => {
            console.log("res", res);
            const {
                groupMembersID,
                groupMembersName,
                totalMembers,
                groupMembersRemark,
            } = res;
            this.props.setSpecialBasicInfo({
                ...eventInfo,
                cardGroupID: groupMembersID,
                cardGroupName: groupMembersName,
                cardCount: totalMembers,
                cardGroupRemark: groupMembersRemark,
            });
            return true;
        })
        .catch((err) => {});
};

export { createMemberGroup };

export default {
    createMemberGroup,
};
