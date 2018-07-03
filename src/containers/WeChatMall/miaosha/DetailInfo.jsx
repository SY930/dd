import React from 'react';
import { connect } from 'react-redux';
import {
    Form,
    Select,
    Radio,
    Upload,
    message,
    Row,
    Col,
    Icon,
} from 'antd';
import styles from '../../SaleCenterNEW/ActivityPage.less';
import PriceInput from '../../SaleCenterNEW/common/PriceInput';
import { saleCenterSetSpecialBasicInfoAC } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import {queryGroupMembersList} from "../../../redux/actions/saleCenterNEW/mySpecialActivities.action";
import ENV from "../../../helpers/env";
import styles1 from '../../GiftNew/GiftAdd/GiftAdd.less';
import SpecialDishesTable from "../../SaleCenterNEW/common/SpecialDishesTable";

const FormItem = Form.Item;
const Option = Select.Option;
const Immutable = require('immutable');
const RadioGroup = Radio.Group;


class DetailInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userType: props.data.userType === undefined ? 2 : Number(props.data.userType) , // 0非会员 1会员 2全部
            goodsList : props.data.goodsList || [],
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRangeChange = this.handleRangeChange.bind(this);
        this.handleDishesChange = this.handleDishesChange.bind(this);
    }

    handleSubmit() {
        if (!this.state.goodsList.length) {
            message.warning('请至少设置一个商品');
            return false;
        } else {
            this.props.onChange && this.props.onChange(this.state);
            return true;
        }
    }
    componentDidMount() {
        this.props.getSubmitFn({
            finish: this.handleSubmit,
        });
    }

    handleDishesChange(val) {
        const goodsList = val.map(item => ({
            specType: item.unit,
            name: item.foodName,
            price: item.mPrice === undefined ? -1 : Number(item.mPrice),
            point: item.mPoint === undefined ? -1 : Number(item.mPoint),
            storage: item.totalAmount,
            purchaseLimit: item.limitAmount,
        }));
        this.setState({
            goodsList,
        })
    }

    handleRangeChange(value) {
        this.setState({
            userType: Number(value)
        })
    }

    componentWillReceiveProps(nextProps) {

    }

    render() {
        return (
            <div>
                <Form className={styles.FormStyle}>
                    <SpecialDishesTable
                        isWeChatMall={true} // 商城活动 实在太累了所以做了sloppy复用 sorry  -_-!
                        onChange={this.handleDishesChange}
                        goodsList={this.state.goodsList}
                    />
                    <div style={{height: '50px', marginTop: '8px'}} className={styles.flexContainer}>
                        <div style={{lineHeight: '28px', marginRight: '14px'}}>{'活动适用用户'}</div>
                        <div style={{width: '300px'}}>
                            <Col  span={24}>
                                <Select onChange={this.handleRangeChange}
                                        value={String(this.state.userType)}
                                        getPopupContainer={(node) => node.parentNode}
                                >
                                    <Option key="2" value={'2'}>不限制</Option>
                                    <Option key="1" value={'1'}>仅会员</Option>
                                    <Option key="0" value={'0'}>仅非会员</Option>
                                </Select>
                            </Col>
                        </div>
                    </div>
                </Form>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailInfo);
