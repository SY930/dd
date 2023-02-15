/*
 * @Author: 张博奥 zhangboao@hualala.com
 * @Date: 2022-09-29 15:07:54
 * @LastEditors: 张博奥 zhangboao@hualala.com
 * @LastEditTime: 2022-09-30 11:45:39
 * @FilePath: /platform-sale/src/containers/SpecialPromotionNEW/common/AddCategorys.jsx
 * @Description: 统计类别、标签组件
 */
import React from "react";
import { connect } from "react-redux";
import { Input, Tag, Modal, Form, message, Button, Row, Col } from "antd";
import { SALE_LABEL } from "i18n/common/salecenter";
import { injectIntl } from "../../SaleCenterNEW/IntlDecor";
import {
    fetchPromotionCategoriesAC,
    fetchPromotionTagsAC,
    saleCenterAddPhrase,
    saleCenterDeletePhrase,
} from "../../../redux/actions/saleCenterNEW/promotionBasicInfo.action";
import styles from "../../SaleCenterNEW/ActivityPage.less";

const FormItem = Form.Item;

@injectIntl()
class AddCategorys extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cateVisible: false,
            recommendType: 0,
            categoryList: [],
            tagList: [],
        };
    }
    componentDidMount() {
        this.props.fetchPromotionCategories({
            groupID: this.props.user.accountInfo.groupID,
            shopID:
                this.props.user.shopID && this.props.user.shopID !== ""
                    ? this.props.user.shopID
                    : undefined,
            phraseType: "0",
        });
        this.props.fetchPromotionTags({
            groupID: this.props.user.accountInfo.groupID,
            shopID:
                this.props.user.shopID && this.props.user.shopID !== ""
                    ? this.props.user.shopID
                    : undefined,
            phraseType: "2",
        });
    }
    componentWillReceiveProps(nextProps) {
        if (
            nextProps.promotionBasicInfo.getIn(["$categoryList", "initialized"])
        ) {
            const categoryList = nextProps.promotionBasicInfo.getIn([
                "$categoryList",
                "data",
            ])
                ? nextProps.promotionBasicInfo
                      .getIn(["$categoryList", "data"])
                      .toJS()
                : [];
            this.setState({
                categoryList,
            });
        }
        if (nextProps.promotionBasicInfo.getIn(["$tagList", "initialized"])) {
            const tagList = nextProps.promotionBasicInfo.getIn([
                "$tagList",
                "data",
            ])
                ? nextProps.promotionBasicInfo
                      .getIn(["$tagList", "data"])
                      .toJS()
                : [];
            this.setState({
                tagList,
            });
        }
    }
    showAddCategory = () => {
        this.setState({
            cateVisible: true,
        });
    };
    hideAddCategory = () => {
        const type =
            this.props.catOrtag == "cat"
                ? "fetchPromotionCategories"
                : "fetchPromotionTags";
        this.props.form.validateFieldsAndScroll((err1) => {
            if (err1) return;
            this.setState({
                loading: false,
            });
            this.props.addPhrase({
                data: {
                    groupID: this.props.user.accountInfo.groupID,
                    shopID:
                        this.props.user.shopID && this.props.user.shopID !== ""
                            ? this.props.user.shopID
                            : undefined,
                    phraseType: this.props.catOrtag == "cat" ? "0" : "1",
                    nameList: [this.state.newCategory],
                },
                success: () => {
                    this.props[type]({
                        groupID: this.props.user.accountInfo.groupID,
                        shopID:
                            this.props.user.shopID &&
                            this.props.user.shopID !== ""
                                ? this.props.user.shopID
                                : undefined,
                        phraseType: this.props.catOrtag == "cat" ? "0" : "1",
                    });
                    this.setState({
                        loading: false,
                        newCategory: "",
                    });
                    this.props.form.setFieldsValue({ addName: "" });
                    message.success(SALE_LABEL.k5do0ps6);
                },
                fail: () => {
                    this.setState({
                        loading: false,
                    });
                    message.error(SALE_LABEL.k5doax7i);
                },
            });
        });
    };
    handleCancel = () => {
        this.setState({
            loading: false,
            cateVisible: false,
        });
    };
    handleDeletePhrase = (name, itemID) => {
        this.props.deletePhrase({
            data: {
                groupID: this.props.user.accountInfo.groupID,
                shopID:
                    this.props.user.shopID && this.props.user.shopID !== ""
                        ? this.props.user.shopID
                        : undefined,
                phraseType: this.props.catOrtag == "cat" ? "0" : "1",
                name,
                itemID,
            },
            success: () => {
                const type =
                    this.props.catOrtag == "cat"
                        ? "fetchPromotionCategories"
                        : "fetchPromotionTags";
                this.props[type]({
                    groupID: this.props.user.accountInfo.groupID,
                    shopID:
                        this.props.user.shopID && this.props.user.shopID !== ""
                            ? this.props.user.shopID
                            : undefined,
                    phraseType: this.props.catOrtag == "cat" ? "0" : "1",
                });
                message.success(SALE_LABEL.k5do0ps6);
            },
        });
        if (this.props.catOrtag == "cat") {
            // 手动删除已选添加类别（而不是加载时），清空已选类别
            this.props.resetCategorgOrTag();
        }
        if (this.props.catOrtag == "tag") {
            // 手动删除已选添加标签（而不是加载时），清空已选
            this.props.resetCategorgOrTag();
        }
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 19 },
        };
        const title = this.props.catOrtag == "cat" ? "类别" : "标签";
        const list =
            this.props.catOrtag == "cat"
                ? this.state.categoryList
                : this.state.tagList;
        return (
            <div>
                <a
                    className={styles.linkSelectorBtn}
                    onClick={this.showAddCategory}
                >{`管理${title}`}</a>
                <Modal
                    title={`管理${title}`}
                    visible={this.state.cateVisible}
                    width={580}
                    confirmLoading={this.state.loading}
                    onCancel={this.handleCancel}
                    wrapClassName={styles.linkSelectorModalHasTag}
                    footer={[
                        <Button key="0" style={{ display: "none" }}></Button>,
                        <Button
                            key="1"
                            type="primary"
                            onClick={this.handleCancel}
                        >
                            关闭
                        </Button>,
                    ]}
                >
                    <Form className={styles.FormStyleSmall}>
                        <FormItem
                            label={`${title}名称`}
                            className={styles.FormItemStyle}
                            {...formItemLayout}
                        >
                            {getFieldDecorator("addName", {
                                rules: [
                                    {
                                        whitespace: true,
                                        required: true,
                                        message:
                                            "汉字、字母、数字组成，不多于50个字符",
                                        pattern:
                                            /^[\u4E00-\u9FA5A-Za-z0-9\s\.]{1,50}$/,
                                    },
                                ],
                                onChange: (e) => {
                                    this.setState({
                                        newCategory: e.target.value,
                                    });
                                },
                            })(
                                <Input
                                    style={{
                                        width: "285px",
                                        marginRight: "10px",
                                    }}
                                    placeholder={`${title}`}
                                />
                            )}
                            <Button
                                type="default"
                                onClick={this.hideAddCategory}
                            >{`点击添加${title}`}</Button>
                        </FormItem>
                        <FormItem style={{ marginLeft: "19px" }}>
                            <h5>删除{title}</h5>
                            <div
                                style={{
                                    height: 135,
                                    overflow: "auto",
                                    marginTop: 10,
                                    paddingRight: 14,
                                }}
                            >
                                {list.map((cat) => {
                                    return (
                                        <Tag
                                            key={cat.itemID}
                                            closable={true}
                                            onClose={(e) => {
                                                this.handleDeletePhrase(
                                                    cat.name,
                                                    cat.itemID
                                                );
                                            }}
                                        >
                                            {cat.name}
                                        </Tag>
                                    );
                                })}
                            </div>
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        promotionBasicInfo: state.sale_promotionBasicInfo_NEW,
        user: state.user.toJS(),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addPhrase: (opts) => {
            dispatch(saleCenterAddPhrase(opts));
        },
        fetchPromotionCategories: (opts) => {
            dispatch(fetchPromotionCategoriesAC(opts));
        },
        fetchPromotionTags: (opts) => {
            dispatch(fetchPromotionTagsAC(opts));
        },
        deletePhrase: (opts) => {
            dispatch(saleCenterDeletePhrase(opts));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form.create()(AddCategorys));
