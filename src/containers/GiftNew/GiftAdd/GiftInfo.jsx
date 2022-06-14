import React, { Component } from 'react';
import { Button, Table, Tooltip } from 'antd';
import styles from './Crm.less';
import GiftModalNew from './GiftModalNew';
import { getCardList, getCouponList } from './AxiosFactory';
import { SALE_CENTER_GIFT_EFFICT_TIME, SALE_CENTER_GIFT_EFFICT_DAY } from '../../../redux/actions/saleCenterNEW/types';
import GiftCfg from '../../../constants/Gift';
const [service, type, api, url] = ['HTTP_SERVICE_URL_PROMOTION_NEW', 'post', 'alipay/', '/api/v1/universal?'];
import { connect } from 'react-redux';
const href = 'javascript:;';
const DF = 'YYYYMMDD';
/** 任意金额组件 */
class GiftInfo extends Component {
    state = {
        visible: false,      // 弹层是否显示
        giftTreeData: [],
        giftTreeDataByCoupon: []
    }
    componentDidMount() {
        getCardList({}).then(x => {
            this.setState({ giftTreeData: x });
        });
        const { accountInfo } = this.props;
        const groupID = accountInfo.get('groupID');
        getCouponList({ groupID }).then(y => {
            this.setState({ giftTreeDataByCoupon: y });
        });
    }


    /* 生成表格头数据 */
    generateColumns() {
        const { disabled } = this.props;
        const { tc } = styles;
        const render = (v) => {
            return (
                <a href={href} name={v} disabled={disabled} onClick={this.onDelete}>删除</a>
            );
        };
        const render1 = (v, o) => {
            const { effectType, giftEffectTimeHours,
                giftValidUntilDayCount, effectTime, validUntilDate } = o;
            let text = '';
            if ([1, 3].includes(+effectType)) {
                const options = (+effectType === 1) ? SALE_CENTER_GIFT_EFFICT_TIME : SALE_CENTER_GIFT_EFFICT_DAY;
                const { label } = options.find(x => +x.value === +giftEffectTimeHours);
                text = <span>发放后{label}，有效期{giftValidUntilDayCount}天</span>;
            } else {
                text = effectTime + ' - ' + validUntilDate;
            }
            return (<Tooltip title={text}><span>{text}</span></Tooltip>);
        };
        const render3 = (v) => {
            const { giftTypeName } = GiftCfg;
            const { label } = giftTypeName.find(x => +x.value === +v) || {};
            return (<Tooltip title={label}><span>{label}</span></Tooltip>);
        };
        const render4 = (v) => {
            return (<Tooltip title={v}><span>{v}</span></Tooltip>);
        };
        // 表格头部的固定数据
        return [
            { width: 40, title: '序号', dataIndex: 'idx', className: tc },
            { width: 100, title: '礼品类型', dataIndex: 'giftType', className: tc, render: render3 },
            { width: 100, title: '礼品名称', dataIndex: 'giftName', className: tc, render: render4, },
            { width: 100, title: '礼品金额(元)', dataIndex: 'giftValue', className: tc },
            { width: 60, title: '礼品个数', dataIndex: 'giftCount', className: tc },
            { width: 180, title: '礼品有效期', dataIndex: 'effectTime', render: render1, className: tc },
            { width: 60, title: '操作', dataIndex: 'index', className: tc, render },
        ];
    }
    /* 生成表格数据 */
    generateDataSource() {
        const { value } = this.props;
        return value && value.length > 0 && value.map((x, i) => ({
            key: x.giftItemID + i,
            idx: i + 1,
            index: i,
            ...x,
        }));
    }
    /* 关闭模态框 */
    toggleModal = () => {
        this.setState(ps => ({ visible: !ps.visible }));
    }
    /** 增加 */
    onPost = (params) => {
        if (params.giftItemType == 1) {
            const { giftTreeData } = this.state;
            const { value, onChange } = this.props;
            // effectType有效期限 如果为小时是 1 如果为天是 3 如果是固定有效期是 2
            const { giftItemID, effectType, rangeDate, countType } = params;
            let date = {};
            if (effectType === '2') {
                const [start, end] = rangeDate;
                const effectTime = start.format(DF);
                const validUntilDate = end.format(DF);
                date = { effectTime, validUntilDate };
            }
            let newEffectType = effectType;
            if (countType === '1') {
                newEffectType = '3';
            }
            let obj = null;
            giftTreeData.forEach(x => {
                const { children } = x;
                const card = children.find(y => y.value === giftItemID);
                if (card) {
                    const { value: giftItemID, giftType, giftTypeName, label: giftName, giftValue } = card;
                    obj = { giftType, giftTypeName, giftItemID, giftName, giftValue };
                }
            });
            const list = [...value, { ...params, ...obj, ...date, effectType: newEffectType }];
            onChange(list);
        } else {
            const { value, onChange } = this.props;
            const list = [...value, { presentType: params.giftItemType, giftItemID: params.giftItemID.split('_')[0], giftName: params.giftItemID.split('_')[1], giftCount: params.giftCount }];
            onChange(list);
        }


    }
    /** 删除 */
    onDelete = ({ target }) => {
        const { name: index } = target;
        const { value, onChange } = this.props;
        const list = [...value];
        list.splice(index, 1);
        onChange(list);
    }
    render() {
        const { visible, giftTreeData, giftTreeDataByCoupon } = this.state;
        const { value = [], disabled, isNeedMt } = this.props;
        const columns = this.generateColumns();
        const dataSource = this.generateDataSource();
        //礼品定额卡添加优惠券限制最多10种
        return (
            <div className={isNeedMt ? styles.cGiftInfo1 : styles.cGiftInfo}>
                {!value[9] && <Button icon="plus" disabled={disabled} onClick={this.toggleModal}>添加礼品</Button>}
                <Table
                    bordered={true}
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                />
                {visible &&
                    <GiftModalNew
                        treeData={giftTreeData}
                        onClose={this.toggleModal}
                        onPost={this.onPost}
                        couponData={giftTreeDataByCoupon}
                    />
                }
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        accountInfo: state.user.get('accountInfo'),
    }
}

export default connect(
    mapStateToProps,
)(GiftInfo)
