/**
 * 新改版营销活动入口文件
 * 以后得营销活动都走页面形式
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import { decodeUrl, closePage, jumpPage } from "@hualala/platform-base";
import { throttle } from "lodash";
import { Button } from "antd";
import PhonePreviewLeft from "./components/PhonePreview";
import registerPage from "../../index";
import { SALE_ACTIVE_NEW_PAGE } from "../../constants/entryCodes";
import styles from "./CreateActive.less";
import FaceFormWrapper from "./ManyFace"; //千人千面
import OnlineRestaurantGiftGiving from "./OnlineRestaurantGiftGiving"; //线上餐厅弹窗送礼
const createActiveList = [
    {
        title: "千人千面",
        key: "85",
        comp: FaceFormWrapper
    },
    {
        title: "线上餐厅弹窗送礼",
        key: "23",
        comp: OnlineRestaurantGiftGiving
    },
];

@connect(({ loading, createActiveTwoCom }) => ({ loading, createActiveTwoCom }))
class NewCreateActiveEntry extends Component {
    constructor() {
        super();
        this.state = {
            loading: false,
            type: "1",
            clientType: "2",
            urlObj: {
                typeKey: "",
                itemID: "",
                isView: false,
                isActive: false
            }
        };
        this.saving = this.saving.bind(this);
        this.formRef = null;
        this.lockedSaving = throttle(this.saving, 500, { trailing: false });
    }

    componentDidMount() {
        const { typeKey = "", itemID, isView, isActive } = decodeUrl();
        if (!decodeUrl().typeKey) {
            // 刷新页面后无参数，关闭页面
            closePage();
        }
        this.setState({
            urlObj: {
                typeKey,
                itemID,
                isView,
                isActive
            }
        });
    }

    onchageType = type => {
        this.setState({
            type
        });
    };

    onchageClientType = clientType => {
        this.setState({
            clientType
        });
    };

    saving = () => {
        this.handleSubmitFn(this.handleCallback);
    };

    handleCallback = () => {};

    render() {
        const { typeKey = "", itemID, isView, isActive } = this.state.urlObj;
        const { loading, clientType } = this.state;
        const currentInfo = createActiveList.find(v => v.key === typeKey) || {};
        let Comp = currentInfo.comp;
        return (
            <div className={styles.createActiveTwo}>
                <div className={styles.headers}>
                    <h1>
                        {itemID ? (isView === "false" ? "编辑" : "查看") : "创建"}
                        {`${currentInfo.title}`}
                    </h1>
                    <p>
                        <Button
                            type="ghost"
                            style={{
                                marginRight: "10px"
                            }}
                            onClick={() => {
                                closePage();
                                if (itemID) {
                                    jumpPage({ pageID: "1000076003" });
                                } else {
                                    jumpPage({ pageID: "10000730008" });
                                }
                            }}
                        >
                            取消
                        </Button>
                        <Button type="primary" disabled={isView === "true" || clientType === "1"} loading={loading} onClick={this.lockedSaving}>
                            保存
                        </Button>
                    </p>
                </div>
                <div className={styles.line}></div>
                <div className={styles.centerContent} style={{ height: "calc(100% - 70px)", overflow: "hidden", display: "flex" }}>
                    <PhonePreviewLeft type={this.state.type} typeKey={typeKey} />
                    <div className={styles.centerLine}>
                        <div className={styles.arrow}></div>
                    </div>
                    {/* 右侧具体内容 */}
                    {Comp && <Comp
                        getSubmitFn={fn => {
                            this.handleSubmitFn = fn;
                        }}
                        itemID={itemID}
                        isView={isView}
                        onChangDecorateType={this.onchageType}
                        onChangClientype={this.onchageClientType}
                        isActive={isActive}
                    />}
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ user }) => {
    return {
        groupID: user.getIn(["accountInfo", "groupID"])
    };
};
export default registerPage([SALE_ACTIVE_NEW_PAGE])(connect(mapStateToProps)(NewCreateActiveEntry));
