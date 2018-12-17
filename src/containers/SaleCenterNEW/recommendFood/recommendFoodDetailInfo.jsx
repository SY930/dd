
import React, { Component } from 'react'
import { Form, Select, message, Checkbox, Input, Icon, Button } from 'antd';
import { connect } from 'react-redux'


if (process.env.__CLIENT__ === true) {
    // require('../../../../client/componentsPage.less')
}

import styles from '../ActivityPage.less';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont'; // 引入icon图标组件库
import CollocationTable from '../common/CollocationTable'; // 表格
import EditBoxForDishes from '../../../containers/SaleCenterNEW/common/EditBoxForDishes';

const FormItem = Form.Item;
const Option = Select.Option;
const Immutable = require('immutable');

import {
    saleCenterSetPromotionDetailAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';


class Tip extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        const tip = (
            <div style={{ display: this.state.tipDisplay || 'none', height: 140, width: 500, marginLeft: this.props.marginLeft }} className={styles.tip}>
                {
                    this.props.words.map(word => <p>{word}</p>)
                }
                <div>
                    <div className={styles.tipBtn}>
                        <Button
                            type="ghost"
                            style={{ color: '#787878' }}
                            onClick={() => {
                                this.setState({ tipDisplay: 'none' });
                            }}
                        >我知道了
                        </Button>
                    </div>
                </div>
            </div>
        );
        return (
            <div style={this.props.style}>
                <Icon
                    type="question-circle-o"
                    className={styles.question}
                    // style={{ marginLeft: 6 }}
                    onMouseOver={() => {
                        this.setState({ tipDisplay: 'block' })
                    }}
                />
                <p>{tip}</p>
            </div>
        )
    }
}

class RecommendFoodDetailInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            priceLst: [],
            scopeLst: [],
            handSetChecked: true,
            autoSetChecked: true,
            // autoSetChecked: false,
            priceLstHand: [],
            priceLstAuto: [],
            stageType: 1,
            recommendNum: '',
            recommendTopNum: '',
            recommendNumStatus: 'success',
            recommendTopNumStatus: 'success',
        };

        this.onHandSetChange = this.onHandSetChange.bind(this);
        this.onAutoSetChange = this.onAutoSetChange.bind(this);
        this.handDishesChange = this.handDishesChange.bind(this);
        this.autoDishesChange = this.autoDishesChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.props.getSubmitFn({
            finish: this.handleSubmit,
        });
        let _priceLst = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']);
        let _scopeLst = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'scopeLst']);
        let rule = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'rule']);
        _priceLst = Immutable.List.isList(_priceLst) ? _priceLst.toJS() : [];
        _scopeLst = Immutable.List.isList(_scopeLst) ? _scopeLst.toJS() : [];
        rule = rule ? rule.toJS() : {};
        let { stageType = '1', recommendNum = '', recommendTopNum = '' } = rule;
        let { display } = this.state;
        display = !this.props.isNew;
        const priceLstHand = _priceLst.filter((food) => { return food.stageNo > -1 })
        const priceLstAuto = _priceLst.filter((food) => { return food.stageNo == -1 })
        this.setState({
            display,
            // priceLst: _priceLst,
            priceLstHand,
            priceLstAuto,
            scopeLst: _scopeLst,
            // handSetChecked: !!(stageType == 0 || stageType == 1),
            // autoSetChecked: !!(stageType == 0 || stageType == 2),
            handSetChecked: true,
            autoSetChecked: true,
            recommendNum,
            recommendTopNum,
        }, () => {
            this.props.form.setFieldsValue({ 'priceLst': this.state.priceLstAuto })
        });
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.promotionDetailInfo.get('$promotionDetail') != this.props.promotionDetailInfo.get('$promotionDetail')) {
            let _priceLst = nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']);
            let _scopeLst = nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'scopeLst']);
            if (Immutable.List.isList(_priceLst)) {
                _priceLst = _priceLst.toJS();
            } else {
                _priceLst = [];
            }
            if (Immutable.List.isList(_scopeLst)) {
                _scopeLst = _scopeLst.toJS();
            } else {
                _scopeLst = [];
            }
            const priceLstHand = _priceLst.filter((food) => { return food.stageNo > -1 })
            const priceLstAuto = _priceLst.filter((food) => { return food.stageNo == -1 })
            this.setState({
                // priceLst: _priceLst,
                priceLstHand,
                priceLstAuto,
                scopeLst: _scopeLst,
            }, () => {
                this.props.form.setFieldsValue({ 'priceLst': this.state.priceLstAuto })
            });
        }
    }

    handleSubmit() {
        let { data, stageType, handSetChecked, autoSetChecked, priceLstAuto, recommendNum, recommendTopNum, recommendNumStatus, recommendTopNumStatus } = this.state;
        let priceLst = [],
            scopeLst = [],
            nextFlag = true,
            dataFalg = true;
        stageType = handSetChecked && !autoSetChecked ? 1 : !handSetChecked && autoSetChecked ? 2 : handSetChecked && autoSetChecked ? 0 : ''
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                nextFlag = false;
            }
        })
        if (handSetChecked) {
            if (Array.isArray(data)) {
                const unCompleteIndex = data.findIndex(group => {
                    return ((Object.keys(group.free[0]).length === 2 && Object.keys(group.foods[0]).length !== 2) || (
                        (Object.keys(group.free[0]).length !== 2 && Object.keys(group.foods[0]).length === 2)
                        ))
                });
                if (unCompleteIndex > -1) {
                    message.warning(`组合${unCompleteIndex + 1}没有搭配完整`)
                    return false;
                }
            }
            data ? data.forEach((group, groupIdx) => {
                // TODO: 用这种方法去判断是否选过菜品是真的蠢, 但是需求真的太多 来不及改了
                if (Object.keys(group.free[0]).length !== 2 && Object.keys(group.foods[0]).length !== 2) {
                    group.free.forEach((free) => {
                        priceLst.push({
                            foodUnitID: free.itemID,
                            foodUnitCode: free.foodKey,
                            foodName: free.foodName,
                            foodUnitName: free.unit,
                            price: parseFloat(free.price),
                            stageNo: groupIdx,
                            num: group.freeCountInfo[free.itemID],
                        })
                    });
                    group.foods.forEach((food) => {
                        scopeLst.push({
                            scopeType: '2',
                            targetID: food.itemID,
                            targetCode: food.foodKey,
                            targetName: food.foodName,
                            targetUnitName: food.unit,
                            stageNo: groupIdx,
                            num: group.foodsCountInfo[food.itemID],
                        })
                    });
                } else {
                    nextFlag = false;
                    dataFalg = false;
                }
            }) : nextFlag = false
        }
        if (autoSetChecked) {
            priceLstAuto.map((free) => {
                priceLst.push({
                    foodUnitID: free.foodUnitID || free.itemID,
                    foodUnitCode: free.foodKey || free.foodUnitCode,
                    foodName: free.foodName,
                    foodUnitName: free.unit || free.foodUnitName,
                    price: parseFloat(free.price),
                    stageNo: -1,
                    num: 1,
                })
            })
        }
        if (!handSetChecked && !autoSetChecked) {
            nextFlag = false;
            message.warning('请至少选择一种推荐方式');
            return;
        }
        if (!(recommendNumStatus === 'success' && recommendTopNumStatus === 'success')) {
            return;
        }
        const rule = { stageType };
        recommendNum ? rule.recommendNum = recommendNum : null;
        recommendTopNum ? rule.recommendTopNum = recommendTopNum : null;
        this.props.setPromotionDetail({
            priceLst,
            scopeLst,
            rule,
        });
        return true;
    }

    handDishesChange(val) {
        this.setState({
            data: val,
        })
    }
    autoDishesChange(val) {
        // console.log(val)
        this.setState({
            priceLstAuto: val,
        })
    }
    onHandSetChange(e) {
        // this.setState({ handSetChecked: e.target.checked })
    }
    onAutoSetChange(e) {
        // this.setState({ autoSetChecked: e.target.checked })
    }
    render() {
        const { recommendNumStatus, recommendTopNumStatus } = this.state;
        return (
            <div>
                <Form className={styles.FormStyle}>
                    <FormItem style={{ marginLeft: 89, position: 'relative', display: 'none' }}>
                        <Checkbox onChange={this.onHandSetChange} checked={this.state.handSetChecked}>手动设置推荐菜</Checkbox>
                        <Tip
                            style={{ position: 'absolute', top: 0, left: 120 }}
                            marginLeft={-98}
                            words={['推荐菜品的数量大于列表中推荐菜品数量，微信页面呈现会智能补齐剩余数量', '推荐菜品的数量小于列表中推荐菜品数量，以推荐菜品总数量为准']}
                        />
                    </FormItem>
                    {
                        this.state.handSetChecked ?
                            <div>
                                <FormItem label="" colon={false} labelCol={{ span: 0 }} wrapperCol={{ span: 0 }}
                                    validateStatus={recommendNumStatus}
                                    help={recommendNumStatus === 'success' ? null : '推荐菜品数量最大值为50'}
                                >
                                    <Input
                                        addonAfter='个'
                                        value={this.state.recommendNum}
                                        onChange={(e) => {
                                            this.setState({
                                                recommendNum: e.target.value,
                                                recommendNumStatus: e.target.value > 50 ? 'error' : 'success',
                                            })
                                        }}
                                    />
                                </FormItem>
                                <FormItem label="猜你喜欢" colon={false} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                    <CollocationTable
                                        onChange={this.handDishesChange}
                                        priceLst={this.state.priceLstHand}
                                        scopeLst={this.state.scopeLst}
                                        type="5010"
                                    />
                                </FormItem>
                            </div> : null
                    }
                    <FormItem style={{ marginLeft: 89, position: 'relative', display: 'none' }}>
                        <Checkbox
                            onChange={this.onAutoSetChange}
                            checked={this.state.autoSetChecked}
                            style={{ marginTop: 30 }}
                        >热销推荐</Checkbox>
                        <Tip
                            style={{ position: 'absolute', top: 31, left: 134 }}
                            marginLeft={-114}
                            words={['热销推荐菜品数量大于所选菜品，微信页面呈现会智能补齐剩余数量', '热销推荐菜品的数量小于所选菜品，以填写的数量为准']}
                        />
                    </FormItem>
                    {
                        this.state.autoSetChecked ?
                            <div>
                                <FormItem label="" colon={false} labelCol={{ span: 0 }} wrapperCol={{ span: 0 }}
                                    validateStatus={recommendTopNumStatus}
                                    help={recommendTopNumStatus === 'success' ? null : '推荐菜品数量最大值为50'}
                                >
                                    <Input
                                        addonAfter='个'
                                        value={this.state.recommendTopNum}
                                        onChange={(e) => {
                                            this.setState({
                                                recommendTopNum: e.target.value,
                                                recommendTopNumStatus: e.target.value > 50 ? 'error' : 'success',
                                            })
                                        }}
                                    />
                                </FormItem>
                                <FormItem label="热销推荐" colon={false} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                                    {
                                        this.props.form.getFieldDecorator('priceLst', {
                                            initialValue: this.state.priceLstAuto,
                                        })(
                                            <EditBoxForDishes onChange={this.autoDishesChange} type="5010" />
                                        )}
                                </FormItem>
                            </div> : null
                    }
                </Form>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        stepInfo: state.sale_steps.toJS(),
        fullCut: state.sale_fullCut_NEW,
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        user: state.user.toJS(),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setPromotionDetail: (opts) => {
            dispatch(saleCenterSetPromotionDetailAC(opts))
        },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form.create()(RecommendFoodDetailInfo));
