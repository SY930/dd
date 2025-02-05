import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Select,
    Row,
    Col,
    Form
} from 'antd';
import {axiosData, fetchData} from "../../../helpers/util";
const Option = Select.Option;
const FormItem = Form.Item;

class SelectCardTypes extends Component {

    state = {
        cardTypeList: []
    };

    componentDidMount() {
        axiosData(
            '/crm/groupParamsService_getGroupShopCardTypeLevels.ajax',
            {},
            null,
            {path: 'data.groupCardTypeList'}
        ).then((list) => {
            const cardTypeList = [];
            const cardLevelIDList = [];
            if (Array.isArray(list)) {
                cardTypeList.push(...list.map(item => ({cardTypeID: String(item.cardTypeID), cardTypeName: item.cardTypeName})));
                cardLevelIDList.push(...list.map(item => (String(item.cardTypeID))));
            }
            this.setState({ cardTypeList },() => {
                this.props.onSendCardLevelID(cardLevelIDList)
            });
        });
    }

    getMergedList = () => {
        const { value } = this.props;
        const listFromValue = (value || []).map(target => ({cardTypeID: String(target.cardTypeID), cardTypeName: target.cardTypeName}));
        const mergeList = this.state.cardTypeList.slice();
        if (listFromValue.length) {
            listFromValue.forEach(item => {
                if (mergeList.findIndex(entity => String(entity.cardTypeID) === String(item.cardTypeID)) === -1) {
                    mergeList.push(item)
                }
            })
        }
        return mergeList;
    }

    handleSelectChange = (value) => {
        const listToBeSentToParent = [];
        const mergedList = this.getMergedList();
        (value || []).forEach(id => {
            const index = mergedList.findIndex(brand => String(brand.cardTypeID) === String(id));
            if (index > -1) {
                listToBeSentToParent.push({cardTypeID: mergedList[index].cardTypeID, cardTypeName: mergedList[index].cardTypeName})
            }
        });
        this.props.onChange(listToBeSentToParent);
    }

    render() {
        const realValue = (this.props.value || []).map(target => String(target.cardTypeID))

        return (
            <Row style={{ marginTop: -6 }}>
                <Col span={24}>
                    <FormItem required style={{ marginBottom: 0 }}>
                        <Select
                            placeholder="默认全部适用"
                            notFoundContent={'未搜索到结果'}
                            multiple={true}
                            allowClear={true}
                            showSearch={false}
                            filterOption={(inputValue, option) => {
                                let flag = false;
                                try {
                                    flag = option.props.children.includes(inputValue)
                                } catch (e) {
                                    flag = false;
                                }
                                return flag
                            }}
                            value={realValue}
                            onChange={this.handleSelectChange}
                        >
                            {
                                this.getMergedList().map(brand => <Option key={String(brand.cardTypeID)} value={String(brand.cardTypeID)}>{brand.cardTypeName}</Option>)
                            }
                        </Select>
                    </FormItem>
                </Col>
            </Row>
        )
    }
}

export default SelectCardTypes;
