
import React from 'react';
import { Col, Select } from 'antd';
import styles from "./style.less";
import _ from "lodash";
import NewAddCategorys from "./NewAddCategorys";
import { axiosData } from 'helpers/util';

const Option = Select.Option;

class CategoryFormItem extends React.Component {
    state = {
        phraseList: [], // 标签列表
        modalVisible: false,
        selectedPhrases: [],
        loading: false
    }

    componentDidMount() {
        this.getPhraseList();
    }

    componentWillReceiveProps(nextProps){
        if(!_.isEqual(this.props.selectedPhrases, nextProps.selectedPhrases)){
            this.setState({
                selectedPhrases: nextProps.selectedPhrases
            })
        }
    }

    getPhraseList = () => {
        this.setState({
            loading: true
        })
        axiosData(
            '/promotion/phrasePromotionService_query.ajax',
            {
                phraseType: this.props.phraseType
            },
            {},
            { path: 'data' },
            'HTTP_SERVICE_URL_CRM'
        ).then(res => {
            this.setState({
                loading: false
            })
            const phraseList = res.phraseList || [];
            if(this.props.form){
                // BaseForm组件使用
                const { getFieldsValue, setFieldsValue } = this.props.form;
                let { tagLst: newTagLst = [] } = getFieldsValue();
                if(newTagLst.length > 0){
                    newTagLst = newTagLst.filter(id => phraseList.map(item => item.name).includes(id));
                }
                setFieldsValue({
                    tagLst: newTagLst
                })
            }else{
                let selectedPhrases = this.state.selectedPhrases.filter(id => phraseList.map(item => item.name).includes(id));
                this.props.onChange(selectedPhrases);
                this.setState({
                    selectedPhrases,
                })
            }
            this.setState({
                phraseList
            })
        }).catch((error) => {
            this.setState({
                loading: false
            })
        });
    }

    onClose = () => {
        this.setState({
            modalVisible: false,
        });
        this.getPhraseList();
    }

    onChange = (value) => {
        this.setState({
            selectedPhrases: value
        });
        this.props.onChange(value);
    }

    render() {
        const { decorator, key } = this.props;
        const { modalVisible, phraseList, selectedPhrases } = this.state;
        const adminTag = {
            width: 30,
            display: 'inline-block',
            color: '#108ee9',
            lineHeight: '13px',
            marginLeft: 5,
            cursor: 'pointer',
        }
        return (
            <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
                {
                    decorator ? 
                        decorator({
                            key,
                        })(
                            <Select
                                size="default"
                                notFoundContent='暂无数据'
                                placeholder="可输入中文、英文、数字"
                                multiple
                                showSearch
                            >
                                {
                                    phraseList && phraseList.map(item => (
                                        <Option value={item.name} key={item.itemID}>{item.name}</Option>
                                    ))
                                }
                            </Select>
                        )
                        : 
                        <Select
                            size="default"
                            notFoundContent='暂无数据'
                            placeholder="可输入中文、英文、数字"
                            multiple
                            showSearch
                            onChange={this.onChange}
                            value={selectedPhrases}
                        >
                            {
                                phraseList && phraseList.map(item => (
                                    <Option value={item.name} key={item.itemID}>{item.name}</Option>
                                ))
                            }
                        </Select>
                }
                {
                    !this.props.hideBtn &&
                    <span style={adminTag} onClick={() => this.setState({ modalVisible: true })}>管理标签</span>
                }
                {
                    modalVisible &&
                    <NewAddCategorys
                        onClose={this.onClose}
                        phraseType={this.props.phraseType}
                    />
                }
            </Col>
        );
    }
}

export default CategoryFormItem;

