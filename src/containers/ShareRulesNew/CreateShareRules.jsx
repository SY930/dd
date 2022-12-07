import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Button, message, Dropdown, Row, Col, Table, Menu } from 'antd';
import registerPage from '../../index';
import styles from './style.less'
import {
    changeSearchName,
    changeSearchType,
    createOrUpdateCertainShareGroup,
    deleteCertainShareGroup,
    removeItemFromCertainShareGroup,
    startCreateShareGroup,
    startEditCertainShareGroup,
    refreshList
} from "../../redux/actions/shareRules/index";
import { getRuleDetail, updateRule, queryShareRuleDetail, deleteShareRuleGroup, queryConfiguredShopId, getInitRuleList } from './AxiosFactory';
import { fetchPromotionScopeInfo } from "../../redux/actions/saleCenterNEW/promotionScopeInfo.action";
import { injectIntl } from './IntlDecor';

import BaseForm from '../../components/common/BaseForm';
import ShopSelector from '../../components/ShopSelector';
import { getPromotionShopSchema } from "../../redux/actions/saleCenterNEW/promotionScopeInfo.action";
import { CREATE_SHARE_RULES_NEW, SHARE_RULES_GROUP_NEW } from '../../constants/entryCodes';
import { jumpPage, closePage } from '@hualala/platform-base';
import { decodeUrl } from '@hualala/platform-base';
import { loadShopSchema } from './utils';

@registerPage([CREATE_SHARE_RULES_NEW], {})
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl()
export default class CreateShareRules extends Component {
    constructor(props) {
        super(props);

        this.state = {
            metadataList: [],
            relationList: [],
            shopSchema: this.props.shopSchema.getIn(['shopSchema']).toJS(), // 后台请求来的值
            values: {},
            shops: [],
            shopInfoList: []
        }
    }

    loadShops() {
        return loadShopSchema()
            .then(({ shops }) => {
                this.setState({ shops }, () => {
                    this.setState({ allShops: shops })
                })
            });
    }

    getShopsName = (shopIds) => {

        let shops = this.state.shops.filter((i) => {
            return shopIds.includes(i.shopID)
        })

        let shopIDList = []
        shops.map((i) => {
            shopIDList.push({ shopId: i.shopID, shopName: i.shopName })
        })

        return shopIDList

    }

    componentDidMount() {
        let { groupID } = this.props.user.accountInfo;
        const { getPromotionShopSchema } = this.props;

        this.loadShops()

        getPromotionShopSchema({ groupID });

        const { from, id } = decodeUrl();

        queryConfiguredShopId({ groupID }).then(res => {
            this.setState({ selectedShops: res.shopIdList })
        })

        if (from == 'create') {
            getInitRuleList({ groupID, packageId: '' }).then(res => {
                this.setState({
                    metadataList: res.metadataList || [],
                    relationList: res.relationList || []
                })
            })
        } else {
            getRuleDetail({ groupID, packageId: id }).then(res => {
                this.setState({
                    packageId: res.packageId,
                    packageName: res.packageName,
                    shopInfoList: res.shopInfoList,
                    metadataList: res.metadataList,
                    relationList: res.relationList
                })
            })

        }
    }

    handleCancel = () => {
        this.setState({
            isCreate: false,
            isEdit: false,
            isCancelModal: false,
            selected: [],
            selectedGroupID: undefined,
            linkFlag: false,
            isEditModal: false
        })
    }
    handleOk = () => {
        this.form.validateFields((e, v) => {
            if (!e) {
                const { packageName, shopIDList } = v;
                let shopInfoList = this.getShopsName(shopIDList)

                const { from } = decodeUrl();
                let data = {}
                data.packageName = packageName
                data.relationList = this.state.relationList
                data.shopInfoList = shopInfoList
                data.metadataList = this.state.metadataList
                if (from == 'create') {
                    this.update(data)
                } else {
                    data.packageId = this.state.packageId
                    this.update(data)
                }
            }
        });
    }

    update(data) {
        const { refreshList } = this.props;
        updateRule(data).then(data => {
            if (data.code == '000') {
                message.success('保存成功');
                refreshList({ flag: true });
                closePage(CREATE_SHARE_RULES_NEW);
                jumpPage({ pageID: SHARE_RULES_GROUP_NEW });
            } else {
                message.error(data.message);
            }
        })
    }

    handleCloseDetailModal = () => {
        this.setState({
            isShowDetail: false
        })
        this.handleCancel()
    }
    handleEdit = (id) => {
        queryShareRuleDetail({ shareRuleID: id }).then(data => {
            this.setState({
                isEdit: true,
                isCreate: false,
                shareRuleInfo: data
            })
        })
    }
    //删除共享组
    handleDelete = () => {
        const { selectedGroupID } = this.state;
        deleteShareRuleGroup({ shareRuleID: selectedGroupID }).then((boolen) => {
            if (boolen) {
                message.success('删除成功');
                this.queryAll()
                this.handleCancel()
            } else {
                message.success('删除失败');
            }
        })
    }
    //展示共享组详情
    handleShowDetailModal = (e, id) => {
        queryShareRuleDetail({ shareRuleID: id }).then(data => {
            this.setState({
                isShowDetail: true,
                shareRuleInfo: data
            })
        })
    }

    onFormChange = (key, value) => {
        if (key === 'countType') {

        }
    }
    /** 得到form */
    getForm = (node) => {
        this.form = node;
    }

    renderShopNames(decorator) {
        const { shopNames = [] } = this.state.values;
        return (
            <Row>
                <Col>
                    {decorator({})(
                        <ShopSelector disabledShops={this.state.selectedShops} />
                    )}
                </Col>
            </Row>
        )
    }

    renderBaseForm() {

        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 },
        }

        const formKeys = ['packageName', 'shopIDList'];

        let shopIDList = []
        this.state.shopInfoList && this.state.shopInfoList.map((i) => {
            shopIDList.push(i.shopId)
        })

        let formData = { shopIDList: shopIDList, packageName: this.state.packageName }

        const formItems = {
            packageName: {
                type: 'text',
                label: '方案名称',
                defaultValue: '',
                rules: [
                    { required: true, message: '请填写方案名称' },
                ]
            },
            shopIDList: {
                type: 'custom',
                label: '适用店铺',
                defaultValue: [],
                rules: [
                    { required: true, message: '请选择适用店铺' },
                ],
                render: decorator => this.renderShopNames(decorator),
            },
        };

        return (
            <div style={{ marginLeft: 20, marginTop: 20 }}>
                <h4 style={{ marginLeft: 20 }}>基础设置</h4>
                <BaseForm
                    getForm={this.getForm}
                    formItems={formItems}
                    formKeys={formKeys}
                    formData={formData}
                    onChange={this.onFormChange}
                    formItemLayout={formItemLayout}
                />
            </div>
        )
    }

    renderHeader(isEmpty) {
        return (
            <div className={styles.header}>
                <div className={styles.titleArea} style={{ position: 'relative' }}>
                    <span className={styles.title}>
                        创建互斥叠加方案
                    </span>
                </div>

                <div>
                    <Button style={{ marginRight: 10, marginLeft: 10 }} onClick={() => {
                        let { groupID } = this.props.user.accountInfo;
                        getInitRuleList({ groupID, packageId: '' }).then(res => {
                            this.setState({
                                metadataList: res.metadataList || [],
                                relationList: res.relationList || []
                            })
                        })
                    }}>重置</Button>

                    <Button
                        onClick={() => {
                            closePage(CREATE_SHARE_RULES_NEW);
                            jumpPage({ pageID: SHARE_RULES_GROUP_NEW });
                        }}
                        type="ghost"
                        style={{ marginRight: 10 }}
                    >
                        取消
                </Button>
                    <Button
                        onClick={this.handleOk}
                        type="primary"
                        className={styles.addRuleBtn}
                    >
                        保存
                </Button>
                </div>
            </div>
        )
    }
    handleChange = (record, type, changeType) => {

        record.targetRelationList && record.targetRelationList.map((i) => {
            if (i.targetType == type) {
                i.relation = changeType
            }
        })

        this.state.relationList.map((i) => {
            if (i.sourceType == type) {
                i.targetRelationList.map((j) => {
                    if (j.targetType == record.sourceType) {
                        j.relation = changeType
                    }
                })
            }
        })

        this.setState({ relationList: this.state.relationList })

    }

    renderTableItem = (record, type) => {

        return (
            <Menu>
                <Menu.Item key="0">
                    <a href="javascript:;" onClick={() => this.handleChange(record, type, 2)}>活动类型共享</a>
                </Menu.Item>
                <Menu.Item key="1">
                    <a href="javascript:;" onClick={() => this.handleChange(record, type, 0)}>活动类型互斥</a>
                </Menu.Item>
                <Menu.Item key="2">
                    <a href="javascript:;" onClick={() => this.handleChange(record, type, 1)}>部分活动叠加</a>
                </Menu.Item>
            </Menu>
        );

    }

    //目标活动类型的关系,互斥=0,共享叠加=1,共享不叠加=2
    renderContent() {

        let tableColumns = [
            {
                title: '活动类型',
                key: '0',
                dataIndex: 'name',
                className: 'TableTxtCenter',
                width: 100,
                fixed: 'left',
                render: (text, record) => this.state.metadataList.find(item => item.type == record.sourceType).name,
            },
            ...this.state.metadataList.map((item, index) => ({
                title: item.name,
                dataIndex: item.type,
                className: 'TableTxtCenter',
                width: 100,
                render: (text, record, index) => {
                    if (record.sourceType == item.type) {
                        return '一'
                    }

                    let relation = ''
                    record.targetRelationList.map((i) => {
                        if (i.targetType == item.type) {
                            relation = i.relation
                        }
                    })

                    if (relation == 0) {
                        return <Dropdown overlay={this.renderTableItem(record, item.type)} trigger={['click']}>
                            <img style={{ height: 18, width: 18 }} src={'http://res.hualala.com/basicdoc/2a8a4e3b-48bf-4352-9b74-777e6da88752.png'} alt="" />
                        </Dropdown>
                    } else if (relation == 1) {
                        return <Dropdown overlay={this.renderTableItem(record, item.type)} trigger={['click']}>
                            <img style={{ height: 18, width: 18 }} src={'http://res.hualala.com/basicdoc/53372625-4377-48cd-ac37-f55afba70582.png'} alt="" />
                        </Dropdown>
                    } else {
                        return <Dropdown overlay={this.renderTableItem(record, item.type)} trigger={['click']}>
                            <img style={{ height: 18, width: 18 }} src={'http://res.hualala.com/basicdoc/c512e6a3-326f-4e96-aa96-0116612e1193.png'} alt="" />
                        </Dropdown>
                    }

                }
            })),
        ]

        return (
            <div style={{ marginLeft: 20, marginTop: 20 }}>
                <div style={{ display: "flex", flexDirection: 'column', marginLeft: 20 }}>
                    <h4 style={{ margin: '15px 0 5px 0' }}>活动类型说明</h4>
                    <div style={{ marginLeft: 40 }}>
                        <div style={{ display: 'flex' }}>
                            <div style={{ margin: '5px 0' }}>【特价】特价菜，低价促销（特定售价）</div>
                            <div style={{ margin: '5px 40px' }}>【赠送】满赠/每满赠，买赠，买三免一，搭赠，称重买赠</div>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <div style={{ margin: '5px 0' }}>【换购】加价换购，加价升级换新</div>
                            <div style={{ margin: '5px 76px' }}>【商品折扣】折扣（指定商品），买折（指定商品），第二份打折，组合折扣，低价促销（折扣）</div>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <div style={{ margin: '5px 0' }}>【商品满减】满减/每满减（指定商品），组合减免，低价促销（减免）</div>
                            <div style={{ margin: '5px 30px' }}>【订单折扣】折扣（全部商品）</div>
                            <div style={{ margin: '5px 0' }}>【订单满减】满减/每满减（全部商品）</div>
                        </div>
                    </div>
                    <h4 style={{ marginTop: 20, marginBottom: 10 }}>规则设置</h4>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginRight: 16 }}><img style={{ marginRight: 6, height: 18, width: 18 }} src={'http://res.hualala.com/basicdoc/c512e6a3-326f-4e96-aa96-0116612e1193.png'} alt="" />活动类型共享</div>
                            <div style={{ display: 'flex', alignItems: 'center', marginRight: 16 }}><img style={{ marginRight: 6, height: 18, width: 18 }} src={'http://res.hualala.com/basicdoc/2a8a4e3b-48bf-4352-9b74-777e6da88752.png'} alt="" />活动类型互斥</div>
                            <div style={{ display: 'flex', alignItems: 'center', marginRight: 16 }}><img style={{ marginRight: 6, height: 18, width: 18 }} src={'http://res.hualala.com/basicdoc/53372625-4377-48cd-ac37-f55afba70582.png'} alt="" />部分活动叠加</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                        </div>
                    </div>
                </div>
                <div>
                    <Table
                        scroll={{ x: 1000 }}
                        style={{ paddingLeft: 10, paddingRight: 10, marginTop: 10 }}
                        bordered
                        columns={tableColumns}
                        dataSource={this.state.relationList}
                        pagination={false}
                        rowKey={record => record.type}
                    />
                </div>
            </div>
        )
    }
    render() {

        return (
            <div style={{ height: '100%', width: '100%', overflow: 'auto', paddingBottom: 30 }}>
                {this.renderHeader()}
                <div className={styles.divideLine} />
                {this.renderBaseForm()}
                {this.renderContent()}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        shopSchema: state.sale_shopSchema_New,
        user: state.user.toJS(),
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        changeSearchType: opts => dispatch(changeSearchType(opts)),
        changeSearchName: opts => dispatch(changeSearchName(opts)),
        startCreateShareGroup: opts => dispatch(startCreateShareGroup(opts)),
        startEditCertainShareGroup: opts => dispatch(startEditCertainShareGroup(opts)),
        // queryShareGroups: opts => dispatch(queryShareGroups(opts)),
        createOrUpdateCertainShareGroup: (opts) => dispatch(createOrUpdateCertainShareGroup(opts)),
        deleteCertainShareGroup: opts => dispatch(deleteCertainShareGroup(opts)),
        removeItemFromCertainShareGroup: opts => dispatch(removeItemFromCertainShareGroup(opts)),
        getAllShops: (opts) => {
            dispatch(fetchPromotionScopeInfo(opts));
        },

        getPromotionShopSchema: (opts) => {
            dispatch(getPromotionShopSchema(opts));
        },

        refreshList: (opts) => dispatch(refreshList(opts)),
    };
}
