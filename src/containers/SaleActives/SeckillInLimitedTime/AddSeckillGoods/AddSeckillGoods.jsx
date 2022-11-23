import React, { Component } from "react";
import { Icon, Form, Select, message, Input, Button, Tooltip,Radio } from "antd";
import BaseForm from "components/common/BaseForm";
import {ruleFormItem, giftRemainSettings} from "../common";
import {isEqual} from "lodash";
import classNames from 'classnames';
import AddModal from '../TicketBag/AddModal';
import { initVal } from "./common";
import styles from "./styles.less";
import drag from '../../asssets/drag.png';
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
            couponData: [],
            couponVisible: false,
            counponIndex: 0,
            sortableDom: true,
        };
    }
    componentDidMount() {
        // 请求零售券
        // this.getCouponsData({});
        const {value} = this.props;
        console.log(value,'value in componetDidMount>>>>>>>>>>>>>>>>>>')
        this.setState({
            formList: value ? value : [{...initVal}]
        });
        this.initSortable();
    }
    componentWillReceiveProps(nextProps){
        if(!isEqual(this.props.value, nextProps.value)) {
            this.setState({
                formList: nextProps
            });
        }
    }
    initSortable = () => {
        const _this = this;
        let el = document.getElementById('items');
        let sortedData = [];
        sortable = Sortable.create(el, {
            animation: 500,
            handle: ".move",
            draggable: ".draggable",
            onEnd: function (evt) {
                let { formList, pageNo, pageSize } = _this.state;
                let arr = sortable.toArray();
                sortedData = arr.map((item) => {
                    return records[item].cardTypeID
                })
            }
        });
    }
    onChange = (key, value, index) => {
        console.log(key, value, index,'params--------------->')
        const { formList } = this.state;
        if (!formList[0]) {
            formList.push({ ...initVal });
        }
        const list = [...formList];
        const giftObj = formList[index];
        list[index] = { ...giftObj, [key]: value};
        console.log(list,'list----------->>>>')
        this.setState({
            formList: list,
            couponIndex: index
        })
        // onChange(list);
    }
    add = () => {
        let { formList = [], onChange } = this.state;
        const id = Date.now().toString(36); // 随机不重复ID号
        if (!formList[0]) {
            formList.push({ ...initVal });
        }
        if (formList[9]) return null;
        formList.push({ ...initVal, id});
        console.log(formList,'formlist==================add')
        this.setState({
            ...formList,
        })
        // onChange(list);
        // return null;
    }
    del = ({ target }, data) => {
        const { idx } = target.closest("a").dataset;
        const { formList, onChange } = this.state;
        const list = [...formList];
        list.splice(+idx, 1);
        this.setState({
            formList: list,
        })
        // onChange(list);
    }
    getForm = (idx, form) => {
        console.log(form, 'form>>>>>>>>>>>>>>>>>>>>')
        const { formList } = this.state;
        const { getGiftForm } = this.props;
        formList.push(form);
        this.setState({ formList });
        if (typeof getGiftForm === "function") {
            getGiftForm(formList);
        }
    }
    onToggleModal = (i) => {
        console.log(i,'i-------------in onToggle')
        this.setState(ps => ({ couponVisible: !ps.couponVisible, couponIndex: i }));
    }
    onSelectBag = (item) => {
        const { formList = [], couponIndex } = this.state;
        console.log(formList, couponIndex, item, 'item>>>>>>>>>>>>>>')
        formList[couponIndex].giftID = item.couponPackageID;
        formList[couponIndex].giftNumber = item.couponPackageName;
        console.log(formList,'formListpppppppppppppppppppppp')
        this.setState({
            ...formList
        })
        // onChange(list);
        // this.setState({ value });
        // this.triggerChange(item);
        this.onToggleModal(couponIndex);
    }
    resetFormItems = (i) => {
        console.log(i,'i>>>>>>>>>')
        const { coupon } = ruleFormItem;
        return {
            ...ruleFormItem,
            coupon: {
                ...coupon,
                render: (d, form) =>
                    d()(
                        <span onClick={() => this.onToggleModal(i)} style={{cursor:"pointer",color:"#1BB496"}}>添加券包</span>
                    )
            },
        }
    }
    render() {
        const { getForm, accountInfo } = this.props;
        const { formList, couponVisible, sortableDom = true, } = this.state;
        if (!formList[0]) {
            formList.push({ ...initVal });
        }
        return (
            <div id="items" ref={(dom) => { this.crmCarddom = dom }}>
                {formList.map((v, i) => (
                    <div key={v.id || i} data-id={i} key={i} className={classNames(styles.addGiftsBox, 'draggable')}>
                        <div className={styles.addGiftsConntet}>
                            <div className={classNames(styles.changeGiftType, 'move')}>
                                <span>商品{i + 1}</span>
                                <img src={drag} className={styles.moveIcon} alt="move"></img>
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <BaseForm
                                    getForm={getForm}
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
                            {formList.length < 10 && (
                                <a data-idx={i} onClick={this.add}>
                                    <Icon
                                        type="plus-circle-o"
                                        style={{
                                            fontSize: 24,
                                            color: "#12B493",
                                        }}
                                    />
                                </a>
                            )}
                            {formList.length > 1 && (
                                <a onClick={(e) => this.del(e, v)} data-idx={i}>
                                    <Icon
                                        type="minus-circle-o"
                                        style={{
                                            fontSize: 24,
                                            color: "#Ed7773",
                                            marginLeft: 4
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
            </div>
            
        );
    }
}

export default AddSeckillGoods;
