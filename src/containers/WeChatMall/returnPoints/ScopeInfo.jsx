import React from 'react';
import { connect } from 'react-redux';
import {
    Form,
    Select,
    Radio,
} from 'antd';
import { axiosData } from '../../../helpers/util';
import styles from '../../SaleCenterNEW/ActivityPage.less';
import BaseHualalaModal from '../../SaleCenterNEW/common/BaseHualalaModal';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

const mapStateToProps = (state) => {
    return {
        shopID: state.user.get('shopID'),
    }
}

class ScopeInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cardType: props.data.cardType || 0,
            cardScopeList: props.data.cardScopeList || [],
            cardInfo: [],
        };
    }

    componentDidMount() {
        this.props.getSubmitFn({
            prev: undefined,
            next: this.handleSubmit,
            finish: undefined,
            cancel: undefined,
        });
        this.queryCardInfo();
    }

    queryCardInfo() {
        axiosData(
            '/crm/groupParamsService_getGroupShopCardTypeLevels.ajax',
            { shopIDs: this.props.shopID },
            null,
            { path: 'data.groupCardTypeList' }
        ).then(data => {
            this.setState({
                cardInfo: Array.isArray(data) ? (data.forEach((cat) => {
                    (cat.cardTypeLevelList || []).forEach((level) => {
                        level.cardTypeName = cat.cardTypeName;
                        level.cardLevelName = `${cat.cardTypeName} - ${level.cardLevelName}`;
                    })
                }), data) : [],
            })
        })
    }

    handleSubmit = () => {
        let nextFlag = true;
        this.props.form.validateFieldsAndScroll((err) => {
            if (err) {
                nextFlag = false;
            }
        });
        // 存到wrapper
        if (nextFlag) {
            this.props.onChange({
                cardType: this.state.cardType,
                cardScopeList: this.state.cardScopeList,
            });
        }
        return nextFlag;
    }


    render() {
        const {
            cardType,
            cardScopeList,
            cardInfo,
        } = this.state;
        const boxData = []
        cardScopeList.forEach(({cardLevelID: id}) => {
            cardInfo.forEach((cat) => {
                cat.cardTypeLevelList.forEach((level) => {
                    if (level.cardLevelID === id) {
                        boxData.push(level)
                    }
                })
            })
        })
        return (
            <Form className={styles.FormStyle}>
                <FormItem
                    label="会员范围"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <RadioGroup
                        value={cardType}
                        onChange={(e) => {
                            this.setState({
                                cardType: e.target.value,
                                cardScopeList: [],
                            });
                        }
                        }
                    >
                        <Radio key={0} value={0}>卡类别</Radio >
                        <Radio key={1} value={1}>卡等级</Radio >
                    </RadioGroup >
                </FormItem>
                <FormItem
                    label={`适用${cardType == 0 ? '卡类' : '卡等级'}`}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {
                        cardType == 0
                            ?
                            (<Select
                                size={'default'}
                                multiple={true}
                                showSearch={true}
                                placeholder="请选择适用卡类"
                                value={cardScopeList.map(item => item.cardTypeID)}
                                className={styles.linkSelectorRight}
                                getPopupContainer={(node) => node.parentNode}
                                onChange={(val) => {
                                    this.setState({
                                        cardScopeList: val.map(id => ({ cardTypeID: id })),
                                    });
                                }}
                            >
                                {cardInfo.map(type => <Option key={type.cardTypeID} value={type.cardTypeID}>{type.cardTypeName}</Option>)}
                            </Select>)
                            :
                            (<BaseHualalaModal
                                outLabel={'卡等级'} //   外侧选项+号下方文案
                                outItemName="cardLevelName" //   外侧已选条目选项的label
                                outItemID="cardLevelID" //   外侧已选条目选项的value
                                innerleftTitle={'全部卡类'} //   内部左侧分类title
                                innerleftLabelKey={'cardTypeName'}//   内部左侧分类对象的哪个属性为分类label
                                leftToRightKey={'cardTypeLevelList'} // 点击左侧分类，的何种属性展开到右侧
                                innerRightLabel="cardLevelName" //   内部右侧checkbox选项的label
                                innerRightValue="cardLevelID" //   内部右侧checkbox选项的value
                                innerBottomTitle={'已选卡等级'} //   内部底部box的title
                                innerBottomItemName="cardLevelName" //   内部底部已选条目选项的label
                                itemNameJoinCatName={'cardTypeName'} // item条目展示名称拼接类别名称
                                treeData={cardInfo} // 树形全部数据源【{}，{}，{}】
                                data={boxData} // 已选条目数组【{}，{}，{}】】,编辑时向组件内传递值
                                onChange={(value) => {
                                    // 组件内部已选条目数组【{}，{}，{}】,向外传递值
                                    const _value = value.map(level => level.cardLevelID)
                                    this.setState({
                                        cardScopeList: _value.map(id => ({ cardLevelID: id })),
                                    });
                                }}
                            />)
                    }
                </FormItem>
                {
                    cardScopeList.length === 0 ? <p style={{ color: 'orange', marginLeft: 110 }}>不选择默认全选</p> : null
                }
            </Form>
        )
    }
}

export default connect(mapStateToProps)(Form.create()(ScopeInfo));
