import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Form,
    Radio,
    Row,
    Col,
} from 'antd';
import styles from '../../../../containers/SaleCenterNEW/ActivityPage.less';
import {Iconlist} from "../../../../components/basic/IconsFont/IconsFont";
import GiftCfg from "../../../../constants/Gift";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class IsSync extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showOptions: false,
        }
    }

    toggleOption = () => {
        this.setState(prevState => ({
            showOptions: !prevState.showOptions
        }))
    }

    render() {
        return (
            <div style={{
                visibility: this.props.operationType === 'add' ? 'hidden' : 'visible',
                position: 'relative',
                left: -93,
            }} >
                <FormItem className={[styles.FormItemStyle, styles.formItemForMore].join(' ')} wrapperCol={{ span: 24 }} >
                    <span className={styles.gTip}>更多礼品限制请使用</span>
                    <span className={styles.gDate} onClick={this.toggleOption}>
                    高级设置 {!this.state.showOptions && <Iconlist className="down-blue" iconName={'down'} width="13px" height="13px" />}
                        {this.state.showOptions && <Iconlist className="down-blue" iconName={'up'} width="13px" height="13px" />}
                </span>
                    {this.state.showOptions && <FormItem style={{
                        marginLeft: 20,
                        width: '100%',
                    }}>
                        券同步&nbsp;&nbsp;&nbsp;&nbsp;
                        <RadioGroup
                            value={this.props.value}
                            onChange={e => {
                                this.props.onChange && this.props.onChange(e.target.value)
                            }}
                        >
                            {
                                GiftCfg.isSynch.map(r => {
                                    return (<Radio key={r.value} value={r.value}>{r.label}</Radio>)
                                })
                            }
                        </RadioGroup>
                    </FormItem>}
                    <div style={{
                        margin: '8px 20px 0 0',
                        width: '100%',
                        visibility: this.state.showOptions && this.props.value ? 'visible' : 'hidden'
                    }}>
                        <span style={{color: 'orange'}}>此设置项将对已发出的券产生变更，请务必慎重操作！</span>
                    </div>
                </FormItem>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        operationType: state.sale_editGiftInfoNew.get('operationType'),
    }
}

export default connect(mapStateToProps, null)(IsSync);
