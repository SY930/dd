import React from 'react';
import { Button, Row, Col, Select } from 'antd';


class ShopSelectorTabs extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            info: [
                {
                    code: 'org',
                    title: '组织',
                    selected: true,
                    activate: true,
                },

                {
                    code: 'city',
                    title: '城市',
                    selected: true,
                    activate: false,
                },

                {
                    code: 'brand',
                    title: '品牌',
                    selected: true,
                    activate: false,
                },

                {
                    code: 'group',
                    title: '门店组',
                    selected: true,
                    activate: false,
                },

                {
                    code: 'businessPattern',
                    title: '经营方式',
                    selected: false,
                    activate: false,
                },

                {
                    code: 'businessMode',
                    title: '运营模式',
                    selected: false,
                    activate: false,
                },
            ],

        }
    }

    componentDidMount() {
        if (this.props.onChange) {
            this.props.onChange(this.state.info[0])
        }
    }

    handleButtonClick = (val) => {
        const buttonsInfo = this.state.info;

        const _info = buttonsInfo.map((item, index) => {
            if (val.code !== item.code) {
                item.activate = false;
                return item
            }

            val.activate = true;
            return val;
        });

        this.setState({
            info: _info,
        }, () => {
            if (this.props.onChange) {
                this.props.onChange(val);
            }
        });
    };

    render() {
        return (
            <div>
                <Row>
                    <Col span={20}>
                        <Row type="flex" justify="start">
                            {
                                this.state.info.filter(item => item.selected).map((item, index) => {
                                    return (
                                        <Button
                                            type={item.activate ? 'primary' : 'default'}
                                            onClick={() => {
                                                this.handleButtonClick(item)
                                            }}
                                        >{item.title}</Button>
                                    )
                                })
                            }
                        </Row>
                    </Col>
                    <Col span={4}>
                        <Select
                            multiple={true}
                            value={
                                this.state.info
                                    .filter((item) => {
                                        return item.selected;
                                    })
                                    .map((item) => {
                                        return item.code
                                    })
                            }
                        >
                            {this.state.info.map((item) => {
                                return (
                                    <Option value={item.code}>{item.title}</Option>
                                )
                            })}
                        </Select>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default ShopSelectorTabs;
