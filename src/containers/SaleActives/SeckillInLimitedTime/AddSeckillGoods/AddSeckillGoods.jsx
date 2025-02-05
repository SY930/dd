import React, { Component } from "react";
import { Icon, Form, Select, message, Input, Button, Tooltip,Radio } from "antd";
import BaseForm from "components/common/BaseForm";
import {ruleFormItem, giftRemainSettings} from "../common";
import {isEqual} from "lodash";
import classNames from 'classnames';
import AddModal from '../TicketBag/AddModal';
import { initVal } from "./common";
import styles from "./styles.less";
import drag from '../../asssets/drag-white.png';
import Sortable from 'sortablejs';
let sortable = null;
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};
class AddSeckillGoods extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formList: [],
            giftList: [],
            couponVisible: false,
            counponIndex: 0,
            sortableDom: true,
        };
    }
    componentDidMount() {
        // 请求零售券
        // this.getCouponsData({});
        const {value} = this.props;
        this.setState({
            giftList: value ? value : [{...initVal}]
        });
        this.initSortable();
    }
    componentWillReceiveProps(nextProps){
        if(!isEqual(this.props.value, nextProps.value)) {
            this.setState({
                giftList: nextProps.value
            });
        }
    }
    initSortable = () => {
        const _this = this;
        const { onGiftChange } = _this.props;
        let el = document.getElementById('items');
        let sortedData = [];
        sortable = Sortable.create(el, {
            animation: 500,
            handle: ".move",
            draggable: ".draggable",
            onEnd: function (evt) {
                let { giftList } = _this.state;
                let arr = sortable.toArray();
                sortedData = arr.map((item) => {
                    return giftList[Number(item)]
                })
                _this.setState({
                    sortableDom: false,
                },() => {
                    _this.setState({
                        sortableDom: true,
                        giftList: sortedData
                    },() => {
                        _this.initSortable()

                    })
                    onGiftChange(sortedData)
                })
            }
        });
    }
    onChange = (key, value, index) => {
        const { giftList } = this.state;
        if (!giftList[0]) {
            giftList.push({ ...initVal });
        }
        const list = [...giftList];
        const giftObj = giftList[index];
        list[index] = { ...giftObj, [key]: value};
        this.setState({
            giftList: list,
            couponIndex: index
        })
        this.props.onGiftChange(list)
    }
    add = () => {
        let { giftList = [], onChange } = this.state;
        const id = Date.now().toString(36); // 随机不重复ID号
        if (!giftList[0]) {
            giftList.push({ ...initVal });
        }
        if (giftList[9]) return null;
        giftList.push({ ...initVal, id});
        this.setState({
            ...giftList,
        })
        this.props.onGiftChange(giftList)
    }
    del = ({ target }, data) => {
        const { idx } = target.closest("a").dataset;
        const { giftList, onChange } = this.state;
        const list = [...giftList];
        list.splice(+idx, 1);
        this.setState({
            giftList: list,
        })
        this.props.onGiftChange(list)
    }
    getForm = (form) => {
        const { formList } = this.state;
        const { getGiftForm } = this.props;
        if(form){
            formList.push(form);
        }
        if (typeof getGiftForm === "function") {
            getGiftForm(formList);
        }
        this.setState({ formList });
    }
    onToggleModal = (i) => {
        this.setState(ps => ({ couponVisible: !ps.couponVisible, couponIndex: i }));
    }
    onSelectBag = (item) => {
        const { giftList = [], couponIndex } = this.state;
        giftList[couponIndex].giftID = item.couponPackageID;
        giftList[couponIndex].giftName = item.couponPackageName;
        giftList[couponIndex].presentType = 4;
        this.setState({
            ...giftList
        })
        this.onToggleModal(couponIndex);
    }
    resetFormItems = (i) => {
        const { giftName } = ruleFormItem;
        const { giftList } = this.state;
        return {
            ...ruleFormItem,
            giftName: {
                ...giftName,
                render: (d, form) =>
                    d()(
                        <div>
                            <span className={styles.couponName}>{ giftList[i] && giftList[i].giftName ? giftList[i].giftName : '' }</span>
                            <span onClick={() => this.onToggleModal(i)} style={{cursor:"pointer",color:"#1BB496"}}>添加券包</span>
                        </div>
                    )
            },
        }
    }
    render() {
        const { accountInfo, isView, itemID} = this.props;
        const { giftList, couponVisible, sortableDom = true } = this.state;
        if (!giftList[0]) {
            giftList.push({ ...initVal });
        }
        return (
                sortableDom ? 
                <div id="items">
                    {isView == "false" && itemID ? <div className={styles.stepOneDisabled} style={{height: 360 * (giftList.length)}}></div> : null}
                    {giftList.map((v, i) => (
                        <div key={v.id || i} data-id={i} key={i} className={classNames(styles.addGiftsBox, 'draggable')}>
                            <div className={styles.addGiftsConntet}>
                                <div className={classNames(styles.changeGiftType, 'move')}>
                                    <span>商品{i + 1}</span>
                                    <img src={drag} className={styles.moveIcon} alt="move"></img>
                                </div>
                                <div style={{ marginBottom: 16 }}>
                                    <BaseForm
                                        getForm={this.getForm}
                                        formItems={this.resetFormItems(i)}
                                        formKeys={giftRemainSettings}
                                        onChange={(key, value) => this.onChange(key, value, i)}
                                        formData={ v || {}}
                                        formItemLayout={formItemLayout}
                                    />
                                </div>
                            </div>
                            {/* 添加删除操作 */}
                            <div>
                                {giftList.length < 10 && (
                                    <a data-idx={i} onClick={this.add}>
                                        <Icon
                                            type="plus-circle-o"
                                            style={{
                                                fontSize: 24,
                                                color: "#12B493",
                                                display: isView ? 'none' : 'block'
                                            }}
                                        />
                                    </a>
                                )}
                                {giftList.length > 1 && (
                                    <a onClick={(e) => this.del(e, v)} data-idx={i}>
                                        <Icon
                                            type="minus-circle-o"
                                            style={{
                                                fontSize: 24,
                                                color: "#Ed7773",
                                                marginLeft: 4,
                                                display: isView ? 'none' : 'block'
                                            }}
                                        />
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                    { couponVisible &&
                        <AddModal
                            groupID={accountInfo.groupID}
                            onAdd={this.onSelectBag}
                            onClose={this.onToggleModal}
                        />
                    }
                </div> : null
        );
    }
}

export default AddSeckillGoods;
