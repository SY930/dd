import React, {Component} from 'react';
import {connect} from 'react-redux';
import { jumpPage,closePage,decodeUrl } from '@hualala/platform-base'
import  BaseForm  from '../../../components/common/BaseForm';
import styles from './housekeeper.less'

@connect(({  loading, createActiveCom }) => ({  loading, createActiveCom }))
class Housekeeper extends React.Component {
    constructor(){
        super();
        this.state = {

        }
    }

    componentDidMount(){
        this.getDetail()
    }

    getDetail = () => {
        this.props.dispatch({
            type: 'createActiveCom/getEventRuleDetail',
            payload: {}
        })
    }

    handleFromChange = (key, value) => {

    }


    render(){

        let formItems = {
            active: {
                type: 'switcher',
                label: '启用状态',
                labelCol: { span: 4 },
                wrapperCol: { span: 15 },
                rules: ['required'],
                onLabel: '启用',
                offLabel: '',
                defaultValue: true,
            }, 
        };
        let formKeys = ['active'];
        let formData = {};

        return (
            <div className={styles.actWrap}>
                <BaseForm
                    getForm={(form) => this.eventRuleForm = form}
                    formItems={formItems}
                    formData={formData}
                    formKeys={formKeys}
                    onChange={this.handleFromChange}
                    formItemLayout={{
                        labelCol: { span: 3 },
                        wrapperCol: { span: 21 },
                    }}
                />
            </div>
        )
    }
}

export default Housekeeper
