import React, { PureComponent as Component } from 'react';
import { Button, Icon, message } from 'antd'
import css from './style.less';
import Gift from '../Gift';
import { axios, getStore } from '@hualala/platform-base';
import _ from 'lodash'

const giftTypeName = [
    { label: '全部', value: '' },
    { label: '代金券', value: '10' },
    { label: '菜品优惠券', value: '20' },
    { label: '菜品兑换券', value: '21' },
    { label: '实物礼品券', value: '30' },
    { label: '会员充值券', value: '40' },
    { label: '会员积分券', value: '42' },
    { label: '会员权益券', value: '80' },
    { label: '礼品定额卡', value: '90' },
    { label: '线上礼品卡', value: '91' },
    { label: '买赠券', value: '110' },
    { label: '折扣券', value: '111' },
    { label: '现金红包', value: '113' },
    { label: '配送券', value: '22' },
];
const [service, type, api, url] = ['HTTP_SERVICE_URL_CRM', 'post', 'alipay/', '/api/v1/universal?'];

const href = 'javascript:;';
// TODO：支持多个礼品
class MutliGift extends Component {
    state = {
        treeData: this.props.treeData || [],
        formList: [],
    }
    componentDidMount() {
        const { cacheTreeData, treeData } = this.props
        // 初始化一个礼品
        this.initGift()
        // 请求礼品列表
        if (!(Array.isArray(treeData) && treeData.length)) {
            this.getCardList({}).then((x) => {
                this.setState({ treeData: x });
                if (typeof cacheTreeData === 'function') {
                    cacheTreeData(x)
                }
            })
        }
    }


    onChange = (idx, params) => {
        const { value, onChange } = this.props;
        const { treeData } = this.state
        const list = [...value];
        const giftObj = value[idx];
        list[idx] = { ...giftObj, ...params };
        //
        if (treeData.length > 0) {
            const flatTree = treeData.map(x => x.children).flat(Infinity)
            list.forEach((item) => {
                const ids = flatTree.findIndex(x => x.value == item.giftID)
                if (ids >= 0) {
                    const { label = '' } = flatTree[ids]
                    item.giftName = label
                }
            })
        }
        onChange(list);
    }
    onAdd = () => {
        const { value = [], onChange } = this.props;
        if (value[9]) { return; }
        const list = [...value];
        const id = Date.now().toString(36); // 随机不重复ID号
        list.push({ id, effectType: '1' });
        onChange(list);
    }
    onDel = ({ target }) => {
        const { idx } = target.closest('a').dataset;
        const { value, onChange } = this.props;
        const list = [...value];
        list.splice(+idx, 1);
        onChange(list);
    }

    getCardList = async (data) => {
        const method = '/coupon/couponService_getSortedCouponBoardList.ajax';
        const params = { service, type, data, method };
        const response = await axios.post(url + method, params);
        const { code, message: msg, data: obj } = response;
        if (code === '000') {
            const { crmGiftTypes = [] } = obj;
            return this.proGiftTreeData(crmGiftTypes);
        }
        message.error(msg);
        return [];
    }

    proGiftTreeData = (giftTypes) => {
        const _giftTypes = _.filter(giftTypes, (giftItem) => {
            if (giftItem.giftType == 10 || giftItem.giftType == 20 || giftItem.giftType == 21 || giftItem.giftType == 30 || giftItem.giftType == 40 || giftItem.giftType == 42 || giftItem.giftType == 80 || giftItem.giftType == 110 || giftItem.giftType == 111 || giftItem.giftType == 22) return true;
            return false;
        });
        let treeData = [];
        const gifts = [];
        _giftTypes.map((gt, idx) => {
            const giftTypeItem = _.find(giftTypeName, { value: String(gt.giftType) }) || {};
            treeData.push({
                label: giftTypeItem.label || '--',
                key: gt.giftType,
                children: [],
            });
            gt.crmGifts.map((gift) => {
                treeData[idx].children.push({
                    label: gift.giftName,
                    value: String(gift.giftItemID),
                    key: gift.giftItemID,
                    giftValue: gift.giftValue,
                    giftType: gt.giftType,
                });
                gifts.push({
                    label: gift.giftName,
                    value: String(gift.giftItemID),
                });
            });
        });
        return treeData = _.sortBy(treeData, 'key');
    }

    initGift = () => {
        const { value } = this.props
        if (!value || (Array.isArray(value) && !value.length)) {
            this.onAdd()
        }
    }

    getForm = (form) => {
        const { formList } = this.state
        const { getGiftForm } = this.props
        formList.push(form)

        if (typeof getGiftForm === 'function') {
            getGiftForm(form)
        }
    }

    render() {
        const { treeData } = this.state;
        const { value, isMulti } = this.props;

        return (
            <div className={css.multiGiftBox}>
                {
                    Array.isArray(value) && value.length && value.map((x, i) => {
                        return (
                            <div key={x.id} className={css.giftBox}>
                                <em>礼品{i + 1}</em>
                                { i > 0 &&
                                <a data-idx={i} href={href} onClick={this.onDel}>
                                    <Icon type="close-circle" />
                                </a>
                                }
                                <Gift
                                    idx={i}
                                    treeData={treeData}
                                    formData={x}
                                    onChange={this.onChange}
                                    getForm={this.getForm}
                                />
                            </div>)
                    })
                }
                {
                    isMulti ? <Button onClick={this.onAdd}>
                        <Icon type="plus" />点击添加礼品
                    </Button> : null
                }

            </div>
        )
    }
}

export default MutliGift
