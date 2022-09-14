import { message } from "antd";
import { fetchData } from "../../../helpers/util";

export async function fetchSpecialCardLevel(params) {
    const response = await fetchData("getSetUsedLevels_dkl", params, null, {
        path: "",
    });
    let { code, message: msg, data } = response;
    if (code === "000") {
        (data.groupCardTypeList || []).forEach((cat) => {
            (cat.cardTypeLevelList || []).forEach((level) => {
                level.cardTypeName = cat.cardTypeName;
                level.cardLevelName = `${cat.cardTypeName} - ${level.cardLevelName}`;
            });
        });
        return data.groupCardTypeList;
    }
    message.error(msg);
    return false;
}
