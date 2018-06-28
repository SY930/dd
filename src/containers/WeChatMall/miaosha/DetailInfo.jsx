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


class RangeInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            range: 0, // 0 不限制, 1 仅会员, 2 仅非会员
            data : []
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRangeChange = this.handleRangeChange.bind(this);
        this.handleDishesChange = this.handleDishesChange.bind(this);
    }

    handleSubmit() {
        let flag = true;
        this.props.form.validateFieldsAndScroll((err1) => {
            if (err1) {
                flag = false;
            }
        });
        return flag;
    }
    componentDidMount() {
        this.props.getSubmitFn({
            prev: undefined,
            next: this.handleSubmit,
            finish: undefined,
            cancel: undefined,
        });
    }

    handleDishesChange(val) {
        val.forEach(item => {
            if (Number(item.newPrice) === 0) {
                item.newPrice = 0;
            } else if (item.newPrice === -1) {
                item.newPrice = item.price
            }
        });
        this.setState({
            data: val,
        })
    }

    handleRangeChange(value) {
        this.setState({
            range: Number(value)
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
                    />
                    <div style={{height: '50px', marginTop: '8px'}} className={styles.flexContainer}>
                        <div style={{lineHeight: '28px', marginRight: '14px'}}>{'活动适用用户'}</div>
                        <div style={{width: '300px'}}>
                            <Col  span={24}>
                                <Select onChange={this.handleRangeChange}
                                        value={String(this.state.range)}
                                        getPopupContainer={(node) => node.parentNode}
                                >
                                    <Option key="0" value={'0'}>不限制</Option>
                                    <Option key="1" value={'1'}>仅会员</Option>
                                    <Option key="2" value={'2'}>仅非会员</Option>
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

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(RangeInfo));
