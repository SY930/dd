/**
 * 暂时将dva放入项目文件中，后期确认与platform-base中的redux不冲突之后，直接作为包安装
 */

import { create } from "./dva";
import createLoading from "./dva-loading";
import createActiveCom from "../../containers/SaleActives/models/common";
const app = create();

const models = [createActiveCom];

models.forEach((v) => {
    app.model(v);
});
app.use(createLoading());
app.start();

// export const dvaApp = app
export default app;
