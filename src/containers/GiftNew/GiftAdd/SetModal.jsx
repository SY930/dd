import React, {Component} from 'react'
import {render} from 'react-dom'
import {Modal, Card, Row, Col, Button, message, Tooltip} from 'antd';
import {Iconlist} from '../../../components/basic/IconsFont/IconsFont'
import styles from './SetModal.less';
import {fetchData} from '../../../helpers/util';
import {mapValueToLabel} from '../GiftInfo/CommonFn';
import _ from 'lodash';
import { multiplyNumFloat, addNumFloat } from '../GiftInfo/CommonFn';
import Cfg from '../../../constants/CrmRechargePackageCfg';

export default class SetModal extends React.Component {
    constructor(props) {
        super(props);
        this.data = {};
        this.state = {
            visible: false,
            selectedSet: {},
            showShadow: false,
            // 控制left
            x: 0,
            // 控制top
            y: 0,
            index: 0,
            isAnothor: true,
            setData: [],
            cardTypeList: [],
            baseInfoData: this.props.baseInfoData,
            setShopID: this.props.setShopID,
        }
    }

    componentDidMount() {
        // if(Number(this.state.setShopID) < 0) {
        //     message.error('请先选择充值店铺');
        // }
        // fetchData('crmOperationCanUsedSet', { shopID: this.state.setShopID, cardID: this.state.baseInfoData.cardID }, null, {path:'data.cardSaveMoneyIDsList'}).then(data => {
        //     this.setState({
        //         setData: data,
        //     });
        //     return fetchData('getCrmCardList', { }, null, {path:'data.cardTypeParamsDataList'});
        // }).then(data => {
        //     this.setState({
        //         cardTypeList: data,
        //     })
        // });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            baseInfoData: nextProps.baseInfoData,
            setShopID: nextProps.setShopID,
        });
        // const { visible = false } = nextProps;
        // this.setState({
        //   visible
        // });
    }

    componentWillUnmount() {
        // this.props.callback && this.props.callback(this.data);
        // this.props.data = [];
    }

    showModal = () => {
        if (this.state.setShopID == undefined) {
            message.error('请先选择充值店铺');
            return;
        }
        fetchData('crmOperationCanUsedSet_dkl', {
            shopID: this.state.setShopID,
            cardID: this.state.baseInfoData.cardID,
        }, null, {path: ''}).then(data => {
            const setList = data.cardSaveMoneyIDsList || [];
            this.setState({
                setData: setList,
            });
            return fetchData('getCrmCardList_dkl', {}, null, {path: 'data.cardTypeParamsDataList'});
        }).then(data => {
            const cardTypeList = data || [];
            this.setState({
                cardTypeList: cardTypeList,
                visible: true,
            });
        });
    }
    handleClick = (e, id, index) => {
        const selectedSet = this.state.setData.find(record => record.saveMoneySetID == id) || {};
        this.setState(prevState => ({
            // showShadow: prevState.index == index ? !prevState.showShadow : prevState.showShadow,
            showShadow: ((prevState.index != index) && (prevState.showShadow == true)) ? prevState.showShadow : !prevState.showShadow,
            x: index,
            index: index,
            // isAnothor: prevState.index == index ? true : false,
            selectedSet,
        }));
    }
    handleShadowClick = (e) => {
        this.setState(prevState => ({
            showShadow: !prevState.showShadow,
            selectedSet: {},
        }));
    }
    handleOk = visible => {
        this.setState({visible});
        const {selectedSet} = this.state;
        let set = _.cloneDeep(selectedSet);
        this.proLevelorGiftData(set);
        this.props.onChange(set);
    }
    proLevelorGiftData = set => {
        if (!set.saveMoneySetCardLevels) {
            set.saveMoneySetCardLevels = '';
        } else {
            const levels = set.saveMoneySetCardLevels || [];
            set.saveMoneySetCardLevels = levels.map(level => {
                return this.findCardTypeNameByCardID(level.cardTypeID);
            }).join(',');

        }
        if (!set.crmEventGiftConfResList) {
            set.crmEventGiftConfResList = '';
        } else {
            const gifts = set.crmEventGiftConfResList || [];
            set.crmEventGiftConfResList = gifts.map(level => {
                return level.giftName;
            }).join(',');

        }
        return set;
    }
    handleCancel = visible => {
        this.setState({visible});
    }
    /*
     根据某一个字段找出一个对象数组中的某一条记录，并返回该条记录的某个字段
     */
    findCardTypeNameByCardID = id => {
        const {cardTypeList} = this.state;
        const ll = _.map(cardTypeList, list => {
            if (list.cardTypeID == id) return list.cardTypeName;
        });
        return _.compact(_.map(cardTypeList, list => {
            if (list.cardTypeID == String(id)) return list.cardTypeName;
            return undefined;
        }));
    }
    LevelOrGiftHtml = (item, cardItem) => {
        const data = cardItem[item.key] || [];
        if (data.length === 0) {return <Row key={item.key}>
                <Col span={10} style={{textAlign: "right"}}>
                    <label>{`${item.label} ：`}</label>
                </Col>
                <Col span={14} className={styles.toolTipWrapper}>
                    <span>{ '--' }</span>
                </Col>
            </Row>
        }
        let _data = [];
        if (item.key === 'saveMoneySetCardLevels') {
            _data = _.unionBy(data, 'cardTypeID');
        } else {
            _data = data;
        }
        const strArray = _.compact(_data.map((lst, idx) => {
            return `${
                        item.key === 'saveMoneySetCardLevels' ?
                        this.findCardTypeNameByCardID(lst.cardTypeID) || ' ' :
                        lst.giftName
                    }`
        }));
        const _str = strArray.join(',') || '--';
        return <Row key={item.key}>
            <Col span={10} style={{textAlign: "right"}}>
                <label>{`${item.label} ：`}</label>
            </Col>
            <Col span={14} className={styles.toolTipWrapper}>
                {
                    <Tooltip title={_str}>
                        <span>{_str}</span>
                    </Tooltip>
                }
            </Col>
        </Row>
    }
    getReturnMoney(record = {}) {
        const _record = { ...record, ...record.futureRightsRes };
        const type = this.getType(_record);
        const { firstStageReturnMoney, returnMoneyPreStage, stageCount } = _record;
        switch (type) {
            case 'rechargePackage':
                return '--';
            case 'recharge':
                return `${_record.returnMoney ? _record.returnMoney : '0'}元`;
            case 'futurePackage':
                {
                    if (record.futureRightsType == 1) return `${_record.returnMoney ? _record.returnMoney : '0'}元`;;
                    if (!firstStageReturnMoney || !returnMoneyPreStage || !stageCount) return '--';
                    if (record.futureRightsType == 2) {
                        const _total = multiplyNumFloat(returnMoneyPreStage, stageCount);
                        return `${addNumFloat(_total, firstStageReturnMoney)}元`;
                    }
                    return null;
                }
            default:
                return null;
        }
    }
    getType = (record) => {
        const {futureRightsType, isSellGift} = record;
        if (!futureRightsType || futureRightsType == 0) {
            return isSellGift ? 'rechargePackage' : 'recharge';
        }
        return 'futurePackage';
    }
    formatFormData = record => {
        return _.mapValues(record, (value, key) => {
            switch (key) {
                case 'salesAmount':
                    return record.salesAmountLimit == -1 ? '不限' : Number(record.salesAmountLimit) + Number(record.salesAmount);
                case 'isOpen':
                    return mapValueToLabel(Cfg.isOpen, String(record.isOpen));
                case 'isActive':
                    return record.isActive ? '开启' : '不开启';
                case 'returnMoney':
                    return this.getReturnMoney(record);
                case 'returnPoint':
                    return this.getType(record) === 'rechargePackage' ? '--' : `${record.returnPoint ? record.returnPoint : '0'}积分`;
                case 'timesOfUsage':
                    return record.timesOfUsage == -1 ? '不限' : record.timesOfUsage;
                case 'returnMoneyPreStage':
                case 'setSaveMoney':
                case 'firstStageReturnMoney':
                    return `${value || '--'}元`;
                case 'stageCycle':
                    return `${value || '--'}天`;
                case 'lockProportion':
                    return `${value || '--'}%`;
                case 'stageCount':
                    return `${value || '--'}次`;
                // case 'futureRightsType':
                //     return mapValueToLabel(Cfg.futureRightsType, String(record.futureRightsType));
                default:
                    return value !== undefined ? value : '--';
            }
        });
    }

    generateHtmByKey = (item, cardItem) => {
        const key = item.key;
        const value = cardItem[key];
        switch (key) {
            case 'saveMoneySetCardLevels':
            case 'crmEventGiftConfResList':
                return this.LevelOrGiftHtml(item, cardItem);
            case 'futureRightsType':
                if (value == 0) {
                    return null;
                }
                return <Row key={key}>
                                    <Col span={10} style={{textAlign: "right"}}>
                                        <label>{`${item.label} ：`}</label>
                                    </Col>
                                    <Col span={14}>
                                        <p>{mapValueToLabel(Cfg.futureRightsType, String(value))}</p>
                                    </Col>
                                </Row>
            case 'lockProportion':
                const typeVal = cardItem.futureRightsType;
                if (typeVal == 2 || typeVal == 0) {
                    return null;
                }
                return <Row key={key}>
                                    <Col span={10} style={{textAlign: "right"}}>
                                        <label>{`${item.label} ：`}</label>
                                    </Col>
                                    <Col span={14}>
                                        <p>{value}</p>
                                    </Col>
                                </Row>
            case 'returnMoneyPreStage':
            case 'stageCount':
            case 'stageCycle':
            case 'firstStageReturnMoney':
                const _typeVal = cardItem.futureRightsType;
                if (_typeVal == 1 || _typeVal == 0) {
                    return null;
                }
                return <Row key={key}>
                                    <Col span={10} style={{textAlign: "right"}}>
                                        <label>{`${item.label} ：`}</label>
                                    </Col>
                                    <Col span={14}>
                                        <p>{value}</p>
                                    </Col>
                                </Row>
            default:
                return <Row key={key}>
                                    <Col span={10} style={{textAlign: "right"}}>
                                        <label>{`${item.label} ：`}</label>
                                    </Col>
                                    <Col span={14}>
                                        <p>{value}</p>
                                    </Col>
                                </Row>
        }
    }

    render() {
        const style = {
            display: this.state.showShadow == true ? 'block' : 'none',
            top: (15 + 280) * Math.floor(this.state.index / 2),
            left: (this.state.index % 2) * (220 + 13),
        }
        const { setData } = this.state;
        const _setData = setData.filter((item) => {
            if (item.futureRightsType !== 0) {
                return true;
            }
            return item.isSellGift !== true;
        });
        const card = _setData.map((cardItem, pIndex) => {
            const _cardItem = { ...cardItem, ...cardItem.futureRightsRes };
            const _record = this.formatFormData(_cardItem);
            return <Col span="12" className={styles.Card} className={styles[`${pIndex % 2 == 0 ? 'Card1' : 'Card2'}`]}
                        key={pIndex}>
                <Card title={_record.setName} bordered={false}
                      onClick={e => this.handleClick(e, _record.saveMoneySetID, pIndex)}
                      className={styles.cardItemWrap}>
                    {
                        setCfg.map((item, _index) => {
                            return this.generateHtmByKey(item, _record);
                        })
                    }
                </Card>
            </Col>
        });
        return (
            <div>
                <Button type="ghost" onClick={() => this.showModal()}>选择套餐</Button>
                <Modal
                    title={'选择套餐'}
                    maskClosable={false}
                    width={'500px'}
                    visible={this.state.visible}
                    onCancel={() => this.handleCancel(false)}
                    key={this.props.type}
                    wrapClassName={styles.setWrap}
                    footer={[
                        <Button key="crmSetCancelBtn" onClick={() => this.handleCancel(false)} type="ghost">取消</Button>,
                        <Button key="crmSetSaveBtn" onClick={() => this.handleOk(false)} type="primary">完成</Button>
                    ]}
                >
                    <Row className={styles.cardWrap}>
                        {card}
                        <Col>
                            <p className={styles.yes} style={style} onClick={e => this.handleShadowClick(e)}>
                                <Iconlist iconName={'yesCircle'} className={'yesCircle'}/>
                            </p>
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }
}
const setCfg = [{
    label: '充值金额',
    key: 'setSaveMoney'
}, {
    label: '赠送金额',
    key: 'returnMoney'
}, {
    label: '返积分',
    key: 'returnPoint'
}, {
    label: '权益类型',
    key: 'futureRightsType'
},{
    label: '当天可用率',
    key: 'lockProportion'
},{
    label: '每次返赠额',
    key: 'returnMoneyPreStage'
},{
    label: '首次赠送额',
    key: 'firstStageReturnMoney'
},{
    label: '返赠次数',
    key: 'stageCount'
},{
    label: '返赠间隔数',
    key: 'stageCycle'
},{
    label: '可用卡类型',
    key: 'saveMoneySetCardLevels'
}, {
    label: '可使用礼品',
    key: 'crmEventGiftConfResList',
}];
