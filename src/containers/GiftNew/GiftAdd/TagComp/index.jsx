
import React from 'react';
import { Col, Form, Select } from 'antd';
import styles from "./style.less";
import AdminTagModal from "./AdminTagModal";
import { axiosData } from 'helpers/util';

const Option = Select.Option;

class TagComp extends React.Component {
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
                phraseType: 1 // _TODO
            },
            {},
            { path: 'data' },
            'HTTP_SERVICE_URL_CRM'
        ).then(res => {
            this.setState({
                loading: false
            })
            const phraseList = res.phraseList || [];
            const { getFieldsValue, setFieldsValue } = this.props.form;
            let { category: newCategory = [] } = getFieldsValue();
            newCategory = newCategory.filter(id => phraseList.map(item => item.itemID).includes(id));
            setFieldsValue({
                category: newCategory
            })
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
            <Col span={24} className={styles.tagComp}>
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
                                    <Option value={item.itemID} key={item.itemID}>{item.name}</Option>
                                ))
                            }
                        </Select>
                    )
                }
                <span className={styles.adminTag} onClick={() => this.setState({ modalVisible: true })}>管理标签</span>
                {
                    modalVisible &&
                    <AdminTagModal
                        onClose={this.onClose}
                    />
                }
            </Col>
        );
    }
}

export default TagComp;

