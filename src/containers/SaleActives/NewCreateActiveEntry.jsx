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
import NewScoreConvertGift from "./NewScoreConvertGift"; //积分换礼
import SeckillInLimitedTime from "./SeckillInLimitedTime"; //限时秒杀活动
import BenefitCardBargain from './BenefitCardBargain'; // 权益卡砍价

const createActiveList = [
    {
        title: "千人千面",
        key: "85",
        comp: FaceFormWrapper,
    },
    {
        title: "线上餐厅弹窗送礼",
        key: "23",
        comp: OnlineRestaurantGiftGiving,
    },
    {
        title: "积分换礼",
        key: "89",
        comp: NewScoreConvertGift,
    },
    {
        title: "限时秒杀",
        key: "95",
        comp: SeckillInLimitedTime,
    },
    {
        title: '权益卡砍价',
        key: '91',
        comp: BenefitCardBargain,
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
                isActive: false,
                mode: 'add'
            }
        };
        this.saving = this.saving.bind(this);
        this.formRef = null;
        this.lockedSaving = throttle(this.saving, 500, { trailing: false });
        this.handleSubmitFn = null;
    }

    componentDidMount() {
        const { typeKey = "", itemID, isView, isActive, mode } = decodeUrl();
        if (!decodeUrl().typeKey) {
            // 刷新页面后无参数，关闭页面
            closePage();
        }
        this.setState({
            urlObj: {
                typeKey,
                itemID,
                isView,
                isActive,
                mode
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

    handleCallback = () => { };

    render() {
        const { typeKey = "", itemID, isView, isActive, mode } = this.state.urlObj;
        const { loading, clientType } = this.state;
        const currentInfo = createActiveList.find(v => v.key === typeKey) || {};
        let Comp = currentInfo.comp;
        return (
            <div className={styles.createActiveTwo}>
                <div className={styles.headers}>
                    <h1>
                        {mode && (itemID ? (mode === "edit" ? "编辑" : mode === "view" ? "查看" : "复制") : "创建")}
                        {!mode && (itemID ? (isView === "false" ? "编辑" : "查看") : "创建")}
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
                        mode={mode}
                        onChangDecorateType={this.onchageType}
                        onChangClientype={this.onchageClientType}
                        isActive={isActive}
                    /**
                     * @description: 
                     * @return {*}
                     */
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
