import React, { Component } from 'react'
import { render } from 'react-dom'
import { Modal, Card, Row, Col, Button, message, Tooltip } from 'antd';

import BaseForm from '../../../components/common/BaseForm';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont' //字体图标的调用
import BaseInfo from './BaseInfo';
import ProfileSetting from './ProfileSetting';
import styles from './styles/SetModal.less';
import { fetchData } from '../../../helpers/util';
import Cfg from '../../../constants/CrmOperationCfg';
import _ from 'lodash';

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
        // console.log(this.state);
        if (this.state.setShopID == undefined) {
            message.error('请先选择充值店铺');
            return;
        }
        fetchData('crmOperationCanUsedSet', { shopID: this.state.setShopID, cardID: this.state.baseInfoData.cardID }, null, { path: 'data.cardSaveMoneyIDsList' }).then(data => {
            const setList = data || [];
            this.setState({
                setData: setList,
            });
            return fetchData('getCrmCardList', {}, null, { path: 'data.cardTypeParamsDataList' });
        }).then(data => {
            const cardTypeList = data || [];
            this.setState({
                cardTypeList: cardTypeList,
                visible: true,
            });
        });
    }
    handleClick = (e, id, index) => {
        //console.log('saveMoneySetID', id);
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
        this.setState({ visible });
        const { selectedSet } = this.state;
        let set = _.cloneDeep(selectedSet) || [];
        set.level = this.proLevelorGiftToUniq({ data: set.saveMoneySetCardLevels, type: 'level'});
        set.gift = this.proLevelorGiftToUniq({ data: set.crmEventGiftConfResList, type: 'gift'})
            // this.proLevelorGiftData(set);
        this.props.onChange(set);
    }
    proLevelorGiftToUniq = ({ data = [], type = 'gift' }) => {
        if (!data.length) return '';
        let proData = data.map((item, idx) => item[`${type === 'gift' ? 'giftName' : 'cardTypeID'}`]);
        proData = _.uniq(proData);
        return proData.map(preItem => {
            return (type == 'gift' ? preItem : this.findCardTypeNameByCardID(preItem));
        }).join(',');
    }

    handleCancel = visible => {
        this.setState({ visible });
    }
    /*
        根据某一个字段找出一个对象数组中的某一条记录，并返回该条记录的某个字段
     */
    findCardTypeNameByCardID = id => {
        const { cardTypeList } = this.state;
        return _.compact(_.map(cardTypeList, list => {
            if (list.cardTypeID == id) return list.cardTypeName;
        }));
    }

    LevelOrGiftHtml = (cfg, cardItem) => {
        const data = cardItem[cfg.key] || [];
        const html = this.proLevelorGiftToUniq({ data, type: cfg.type});
        return <Row key={cfg.key}>
            <Col span={10} style={{ textAlign: "right" }} >
                <label>{`${cfg.label} ：`}</label>
            </Col>
            <Col span={14} className={styles.toolTipWrapper}>
                {
                    <Tooltip title={html}>
                        <span>{html}</span>
                    </Tooltip>
                }
            </Col>
        </Row>
    }
    render() {
        const style = {
            display: this.state.showShadow == true ? 'block' : 'none',
            top: (15 + 160) * Math.floor(this.state.index / 2),
            left: (this.state.index % 2) * (220 + 13),
        }
        const { setData } = this.state;
        const set = setData.filter(item => item.isSellGift !== true);
        const card = set.map((cardItem, pIndex) => {
            return <Col span="12" className={styles.Card} className={styles[`${pIndex % 2 == 0 ? 'Card1' : 'Card2'}`]} key={pIndex}>
                <Card title={cardItem.setName} bordered={false} onClick={e => this.handleClick(e, cardItem.saveMoneySetID, pIndex)} className={styles.cardItemWrap}>
                    {
                        setCfg.map((item, _index) => {
                            if (item.key == 'saveMoneySetCardLevels' || item.key == 'crmEventGiftConfResList') {
                                return this.LevelOrGiftHtml(item, cardItem);
                            } else {
                                return <Row key={pIndex + _index}>
                                    <Col span={10} style={{ textAlign: "right" }}>
                                        <label>{`${item.label} ：`}</label>
                                    </Col>
                                    <Col span={14}>
                                        <p>{`${cardItem[item.key]}${item.key == 'returnPoint' ? '分' : '元'}`}</p>
                                    </Col>
                                </Row>
                            }
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
                    //   okText="完成"
                    //   cancelText="取消"
                    maskClosable={false}
                    width={'500px'}
                    visible={this.state.visible}
                    //   onOk={() => this.handleOk(false)}
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
                                <Iconlist iconName={'yesCircle'} className={'yesCircle'} />
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
    label: '可用卡类型',
    key: 'saveMoneySetCardLevels',
    type: 'level',
}, {
    label: '可使用礼品',
    key: 'crmEventGiftConfResList',
    type: 'gift',
}];
