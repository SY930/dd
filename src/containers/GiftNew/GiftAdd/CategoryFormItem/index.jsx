
import React from 'react';
import { Col, Form, Select } from 'antd';
import styles from "./style.less";
import NewAddCategorys from "./NewAddCategorys";
import { axiosData } from 'helpers/util';

const Option = Select.Option;

class CategoryFormItem extends React.Component {
    state = {
        phraseList: [], // 标签列表
        modalVisible: false,
        loading: false
    }

    componentDidMount() {
        this.getPhraseList();
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
                const { getFieldsValue, setFieldsValue } = this.props.form;
                let { tagLst: newTagLst = [] } = getFieldsValue();
                newTagLst = newTagLst.filter(id => phraseList.map(item => item.name).includes(id));
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

    render() {
        const { decorator, key } = this.props;
        const { modalVisible, phraseList } = this.state;
        return (
            <Col span={24} className={styles.CategoryFormItem}>
                {
                    decorator({
                        key
                    })(
                        <Select
                            size="default"
                            notFoundContent='暂无数据'
                            placeholder=""
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
                }
                {
                    !this.props.hideBtn &&
                    <span className={styles.adminTag} onClick={() => this.setState({ modalVisible: true })}>管理标签</span>
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

