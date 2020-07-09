import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button, TreeSelect, Form, message, Input } from 'antd';
import _ from 'lodash';
import BaseForm from '../../../components/common/BaseForm';
import styles from './CrmCardInfoAddCardDetail.less';
import { FORMITEM_CONFIG } from './_QuatoCardFormConfig';
import {
    FetchQuotaCardShopByBatchNo,
    CrmBatchSellGiftCards,
    FetchQuotaCardBatchNo,
} from '../_action';

const FormItem = Form.Item;
class QuotaCardBatchSold extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            selectShops: [],
            selectShopNames: '',
            treeData: [],
            shops: [],
            buttonLoading: false,
            formKeys: [{
                col: { span: 17 },
                keys: ['batchNO', 'startEnd', 'price', 'shopID', 'transRemark'],
            }],
            batchNoData: [],
            batchSoldFormData: {},
        };
        this.batchSoldForm = null;
    }

    componentWillMount() {
        const { data, FetchQuotaCardBatchNoAC, FetchQuotaCardShopByBatchNoAC } = this.props;
        FetchQuotaCardBatchNoAC({ giftItemID: data.giftItemID }).then((record) => {
            // if (!record.length) return;
            // FetchQuotaCardShopByBatchNoAC({
            //     giftItemID: data.giftItemID,
            //     batchNO: record[0].batchNO,
            // });
        });
    }

    componentWillReceiveProps(nextProps) {
        this.batchSoldForm && this.batchSoldForm.resetFields();
        const { $$shopData, $$batchNoInfo } = nextProps;
        const _shopData = $$shopData.toJS();
        const _batchNoInfo = $$batchNoInfo.toJS();
        this.setState({
            batchNoData: _batchNoInfo,
            shops: _shopData,
        });
    }

    getBatchNoOptions = (data) => {
        return data.map(item => ({ value: String(item.batchNO), label: String(item.batchNO) }));
    }
    handleFormChange = (key, value) => {
        switch (key) {
            case 'batchNO':
                {
                    const { data, FetchQuotaCardShopByBatchNoAC } = this.props;
                    const { batchSoldFormData } = this.state;
                    if (value) {
                        FetchQuotaCardShopByBatchNoAC({ giftItemID: data.giftItemID, batchNO: value });
                        this.setState({
                            batchSoldFormData: { ...batchSoldFormData, [key]: value },
                        });
                        break;
                    }
                    break;
                }
            default:
                {
                    const { batchSoldFormData } = this.state;
                    this.setState({
                        batchSoldFormData: { ...batchSoldFormData, [key]: value },
                    });
                }
                break;
        }
    }

    preProShops = (data) => {
        const itemArray = [];
        const hh = _.groupBy(data, 'cityID');
        _.forEach(hh, (item, key) => {
            const ff = _.map(item, (_item) => {
                return _.pick(_item, ['shopName', 'shopID']);
            }).map((shop) => {
                return { content: shop.shopName, id: shop.shopID }
            });
            itemArray.push({
                province: { id: key, content: item[0].cityName },
                cities: ff,
            });
        });
        const shopsData = [];
        _.forEach(itemArray, (item, key) => {
            const children = [];
            _.forEach(item.cities, (city, index) => {
                children.push({
                    label: city.content,
                    value: String(city.id),
                    key: `${key}${index}`,
                })
            });
            shopsData.push({
                label: item.province.content,
                value: '',
                key,
                children,
            })
        });
        return shopsData;
    }

    checkStart = (rule, value, callback) => {
        const reg =  /^[1-9]\d{0,5}$/
        const form = this.batchSoldForm;
        const endNo = form.getFieldValue('endNO')
        if (value && parseFloat(value) > parseFloat(endNo)) {
            callback('不能大于终止号');
        } else if(!reg.test(value)) {
            callback('请输入六位以内的整数');
        } else {
            callback();
        }

        if(value && parseFloat(value) < parseFloat(endNo)) {
            form.setFields({
                endNO: {
                    value: endNo,
                }
            })
        }
    }

    checkEnd = (rule, value, callback) => {
        const form = this.batchSoldForm;
        const reg =  /^[1-9]\d{0,5}$/
        const startNO = form.getFieldValue('startNO')
        if (value && parseFloat(value) < parseFloat(startNO)) {
            callback('不能小于起始号');
        } else if(!reg.test(value)) {
            callback('请输入六位以内的整数');
        }   else {
            callback();
        }

        if(value && parseFloat(value) > parseFloat(startNO)) {
            form.setFields({
                startNO: {
                    value: startNO,
                }
            })
        }
    }

    checkPrice = (rule, value, callback) => {
        const { data: { giftValue } } = this.props;
        if (value) {
            if (Number(value) > Number(giftValue)) {
                callback('售价应该小于卡面值');
            } else {
                callback();
            }
        } else {
            callback();
        }
    }

    renderStartEnd(decorator, form) {
        return (
            <Row style={{ paddingBottom: 10 }}>
                <Col span={10}>
                    <FormItem>
                        {
                            decorator({
                                key: 'startNO',
                                rules: [
                                {
                                    validator: (rule, v, cb) => {
                                        this.checkStart(rule, v, cb)
                                    },
                                },
                                ],
                            })(<Input placeholder="起始卡号" />)
                        }
                    </FormItem>
                </Col>
                <Col span={4} className={styles.textCenter}>--</Col>
                <Col span={10}>
                    <FormItem>
                        {
                            decorator({
                                key: 'endNO',
                                rules: [
                                {
                                    validator: (rule, v, cb) => {
                                        this.checkEnd(rule, v, cb)
                                    },
                                },
                                ],
                            })(<Input placeholder="终止卡号" />)
                        }
                    </FormItem>
                </Col>
            </Row>
        )
    }

    formatFormData = (params) => {
        return _.mapValues(params, (value, key) => {
            switch (key) {
                default:
                    return value !== undefined ? value : '';
            }
        })
    }

    handleSave = () => {
        this.batchSoldForm.validateFieldsAndScroll((err, Values) => {
            if (err) return;
            this.setState({
                buttonLoading: true,
            }, () => {
                setTimeout(() => {
                    this.setState({
                        buttonLoading: false,
                    })
                }, 1000)
            });
            const { CrmBatchSellGiftCardsAC, data, $$accountInfo } = this.props;
            const params = this.formatFormData(Values);
            const shopName = this.getShopNameByID(Values.shopID);
            const _accountInfo = $$accountInfo.toJS();
            params.groupName = _accountInfo.groupName;
            params.operator = _accountInfo.loginName;
            CrmBatchSellGiftCardsAC({ ...params, giftItemID: data.giftItemID, shopName }).then(() => {
                message.success('批量售卖成功！', 1, () => {
                    this.batchSoldForm && this.batchSoldForm.resetFields();
                    this.setState({
                        batchSoldFormData: { price: data.price },
                    })
                });
            }, errorMsg => {
                message.warning(errorMsg, 2, () => {
                    this.batchSoldForm && this.batchSoldForm.resetFields();
                    this.setState({
                        batchSoldFormData: { price: data.price },
                    })
                });
            });
        });
    }

    getShopNameByID = (id) => {
        const { shops } = this.state;
        const selectedItem = shops.find(shopItem => String(shopItem.shopID) === id) || {};
        return selectedItem.shopName;
    }

    render() {
        const { formKeys, buttonLoading, batchNoData, shops, batchSoldFormData } = this.state;
        const { data: { price } } = this.props;
        const data = { price, ...batchSoldFormData };
        const formItems = {
            ...FORMITEM_CONFIG,
            startEnd: {
                label: '批次起止号',
                type: 'custom',
                render: (decorator, form) => this.renderStartEnd(decorator, form),
            },
            shopID: {
                label: '售出店铺',
                type: 'custom',
                render: decorator => (
                    <Row>
                        <Col span={24} className="manualAdjustBalanceShopName">
                            {decorator({
                                rules: [{
                                    required: true, message: '请选择售出店铺',
                                }],
                            })(
                                <TreeSelect
                                    dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
                                    treeData={this.preProShops(shops)}
                                    placeholder="请选择售出店铺"
                                    showSearch={true}
                                    notFoundContent={'未搜索到结果'}
                                    getPopupContainer={() => document.querySelector('.manualAdjustBalanceShopName')}
                                    // getPopupContainer={()=>this.refs.manualAdjustBalance}
                                    treeNodeFilterProp="label"
                                    treeCheckStrictly={true}
                                />
                            )}
                        </Col>
                    </Row>
                ),
            },
            batchNO: {
                type: 'combo',
                label: '批次号',
                placeholder: '请选择批次号',
                fixPopup: true,
                props: {
                    showSearch: true,
                },
                options: this.getBatchNoOptions(batchNoData),
            },
            price: {
                label: '售价',
                type: 'text',
                surfix: '元',
                placeholder: '请输入售价',
                rules: [
                    {
                        pattern: /^[+-]?\d{1,8}$|^[+-]?\d{1,8}[.]\d{1,2}$/,
                        message: '必须是整数部分不超过8位且小数部分不超过2位的数',
                    }, {
                        required: true, message: '售价不能为空',
                    }
                ],
            },
        };
        return (
            <div className={styles.crmCardInfoDetailTransfer} ref="manualAdjustBalance">
                <Row>
                    <Col offset={2}>
                        <BaseForm
                            getForm={form => this.batchSoldForm = form}
                            formItems={formItems}
                            formKeys={formKeys}
                            formData={data}
                            onChange={(key, value) => this.handleFormChange(key, value)}
                        />
                    </Col>
                </Row>
                <Row style={{ paddingTop: 10 }} type={'flex'}>
                    <Col offset={16}>
                        <Button loading={buttonLoading} type="primary" onClick={this.handleSave}>确定</Button>
                    </Col>
                </Row>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        $$shopData: state.sale_giftInfoNew.get('shopsByBatchNo'),
        $$batchNoInfo: state.sale_giftInfoNew.get('batchNoInfo'),
        $$accountInfo: state.user.get('accountInfo'),
    }
}
function mapDispatchToProps(dispatch) {
    return {
        FetchQuotaCardShopByBatchNoAC: opts => dispatch(FetchQuotaCardShopByBatchNo(opts)),
        CrmBatchSellGiftCardsAC: opts => dispatch(CrmBatchSellGiftCards(opts)),
        FetchQuotaCardBatchNoAC: opts => dispatch(FetchQuotaCardBatchNo(opts)),
    };
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(QuotaCardBatchSold);
