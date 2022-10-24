
import React from 'react';
import { Modal, Form, Button, Col, Input, message, Tag, Spin } from 'antd';
import { axiosData } from 'helpers/util';

const FormItem = Form.Item;
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
}

class NewAddCategorys extends React.Component {
    state = {
        phraseList: [],
        phrase: '',
        newCategory: '',
        loading: true,
        addTagLoading: false
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
            const phraseList = res.phraseList || [];
            this.setState({
                phraseList,
                loading: false
            })
        }).catch((error) => {
            console.error(error);
            this.setState({
                loading: false
            })
        });
    }

    onAddTag = () => {
        const { validateFieldsAndScroll, resetFields } = this.props.form;
        validateFieldsAndScroll((err, values) => {
            if (err) return;
            this.setState({
                addTagLoading: true
            })
            axiosData(
                "/promotion/phrasePromotionService_add.ajax",
                {
                    phraseType: this.props.phraseType,
                    nameList: [values.phrase]
                },
                {},
                { path: '' },
                'HTTP_SERVICE_URL_PROMOTION_NEW'
            ).then(res => {
                this.setState({
                    addTagLoading: false
                })
                if (res.code == '000') {
                    message.success('执行成功');
                    this.getPhraseList();
                    resetFields();
                }
            }).catch(error => {
                console.error(error);
                this.setState({
                    addTagLoading: false
                })
            });
        })
    }

    handleDeletePhrase = (name, itemID) => {
        axiosData(
            "/promotion/phrasePromotionService_delete.ajax",
            {
                name,
                itemID,
            },
            {},
            { path: '' },
            'HTTP_SERVICE_URL_PROMOTION_NEW'
        ).then(res => {
            if (res.code == '000') {
                this.getPhraseList()
            }
        }).catch(error => {
            console.error(error)
        });
    }


    render() {
        const { onClose } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { phraseList, loading, addTagLoading } = this.state;
        return (
            <Modal
                visible={true}
                title='管理标签'
                onCancel={onClose}
                footer={[
                    <Button key="0" style={{ display: "none" }}></Button>,
                    <Button
                        key="1"
                        type="primary"
                        onClick={onClose}
                    >
                        关闭
                    </Button>,
                ]}
            >
                <Form inline>
                    <FormItem label='点击添加标签' {...formItemLayout}>
                        {getFieldDecorator('phrase', {
                            rules: [
                                {
                                    whitespace: true,
                                    required: true,
                                    message:
                                        "汉字、字母、数字组成，不多于50个字符",
                                    pattern:
                                        /^[\u4E00-\u9FA5A-Za-z0-9\s\.]{1,50}$/,
                                },
                            ],
                        })(
                            <Input
                                style={{
                                    width: "285px",
                                    marginRight: "10px",
                                }}
                            />
                        )}
                    </FormItem>
                </Form>
                <Col span={24} push={5}>
                    <Button type="default" onClick={this.onAddTag} disabled={addTagLoading}>点击添加标签</Button>
                </Col>
                <Col span={24}>
                    <div>删除标签</div>
                    <div
                        style={{
                            height: 135,
                            overflow: "auto",
                            marginTop: 10,
                            paddingRight: 14,
                        }}
                    >
                        {
                            loading ?
                                <div
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                    <Spin />
                                </div>
                                :
                                phraseList && phraseList.map((cat) => {
                                    return (
                                        <Tag
                                            key={cat.itemID}
                                            closable={true}
                                            onClose={(e) => {
                                                this.handleDeletePhrase(
                                                    cat.name,
                                                    cat.itemID
                                                );
                                            }}
                                        >
                                            {cat.name}
                                        </Tag>
                                    );
                                })
                        }
                    </div>
                </Col>
            </Modal>
        );
    }
}

export default Form.create()(NewAddCategorys)


