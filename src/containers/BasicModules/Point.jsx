import React from 'react';
import { Form, Select, Option, Input } from 'antd';
import { getCardList, getCardTypeList } from '../RequestCenter';

export default class Point extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            point: 0,                  // 积分
            cardList: [],               // 卡列表
            cardTypeID: '',             // 当前选中卡
        }
    }


    componentDidMount() {
        // 获取卡列表
        getCardTypeList().then(cardList => {
            // this.setState({ cardList });
            console.log('cardlist', cardList);
        });
    }

    render() {
        const {
            point,
            cardList,
            cardTypeID
        } = this.state;
        return (
            <div>
                <Form.Item
                    label={'赠送积分'}
                    labelCol={{span: 4, offset: 0}}
                    wrapperCol = {{ span: 10 }}
                >
                    <Input value={point} addonAfter="积分" onChange={({target:{value:val}})=>this.modifyStateWithKeyVal('point', val)}/>
                </Form.Item>
                <Form.Item
                    label={'充值到会员卡'}
                    labelCol={{span: 4, offset: 0}}
                    wrapperCol = {{ span: 10 }}
                >
                    <Select value={cardTypeID || ''} onChange={this.onCardTypeIDChange}>
                        {
                            cardList.map(c => {
                                return (<Option
                                    key={c.cardTypeID}
                                    value={c.cardTypeID}
                                >
                                    {c.cardTypeName}
                                </Option>)
                            })
                        }
                    </Select>
                </Form.Item>   
            </div>
        )
    }
}