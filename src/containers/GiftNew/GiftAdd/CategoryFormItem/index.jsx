
import React from 'react';
import { Col, Select } from 'antd';
import styles from "./style.less";
import NewAddCategorys from "./NewAddCategorys";
import { axiosData } from 'helpers/util';

const Option = Select.Option;

class CategoryFormItem extends React.Component {
    state = {
        phraseList: [], // 标签列表
        modalVisible: false,
        loading: false,
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
            const { getFieldsValue } = this.props.form;
            let { tagLst = [] } = getFieldsValue();
            if(tagLst.length > 0){
                tagLst = tagLst.filter(id => phraseList.map(item => item.itemID).includes(id));
            }
            this.props.onChange(tagLst);
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
        console.log('=======', this.props);
        return (
            <Col span={24} className={styles.CategoryFormItem}>
                {
                    decorator({
                        key,
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
                                    <Option value={item.itemID} key={item.itemID}>{item.name}</Option>
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

