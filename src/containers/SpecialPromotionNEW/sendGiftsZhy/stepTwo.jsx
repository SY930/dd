/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-03-15T10:50:38+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: promotionScopeInfo.jsx
 * @Last modified by:   xf
 * @Last modified time: 2017-04-08T16:46:12+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */

import React from 'react';
import { connect } from 'react-redux';
import {
    Form,
    message,
    Icon,
    Upload,
    Button
} from 'antd';
import {
    saleCenterSetSpecialBasicInfoAC,
} from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import styles from '../../SaleCenterNEW/ActivityPage.less';
import _ from 'lodash';
import { injectIntl } from 'i18n/common/injectDecorator'
import { axiosData } from '../../../helpers/util';
import ENV from '../../../helpers/env'
import Approval from '../../../containers/SaleCenterNEW/common/Approval';

const moment = require('moment');
const Immutable = require('immutable');
const FormItem = Form.Item;
@injectIntl
class Two extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            fileList: [],
            importCardPath: '',
            api_importCardPath: '',
            pathName: '',
            approvalInfo: {},//审批字段
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit() {
        const { importCardPath, api_importCardPath, approvalInfo } = this.state;
        if(!importCardPath) {
            message.warning('请上传文件！');
            return
        }
        
        if(!approvalInfo.activityCost || !approvalInfo.activityRate || !approvalInfo.estimatedSales || !approvalInfo.auditRemark) {
            return;
        }

        this.props.setSpecialBasicInfo({
            importCardPath: api_importCardPath ? api_importCardPath : ENV.FILE_RESOURCE_DOMAIN + '/' + importCardPath,
            pathName: this.state.fileList[0].name,
            ...this.state.approvalInfo,
        })
        return true;
    }

    componentDidMount() {
        // return;
        this.props.getSubmitFn({
            prev: undefined,
            next: this.handleSubmit,
            finish: undefined,
            cancel: undefined,
        });
        const specialPromotion = this.props.specialPromotion.get('$eventInfo').toJS();
        if (Object.keys(specialPromotion).length > 30) {
            console.log(specialPromotion);
            this.setState({
                importCardPath: specialPromotion.importCardPath,
                api_importCardPath: specialPromotion.importCardPath,
                fileList: specialPromotion.importCardPath ? [{
                    name: specialPromotion.pathName,
                    uid: '1',
                }] : [
                    // {
                    //     name: '会员群体导4',
                    //     uid: '1',
                    // }
                ]
            })
        }
    }

    componentWillReceiveProps(nextProps) {}

    downLoadTemp = () => {
        if (process.env.NODE_ENV === 'production') {
            window.open('http://res.hualala.com/crmexport/%E7%BE%A4%E5%8F%91%E7%A4%BC%E5%93%81%E4%BA%BA%E7%BE%A4%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx');
        } else {
            window.open(`${ENV.FILE_RESOURCE_DOMAIN}/crmexport/%E7%BE%A4%E5%8F%91%E7%A4%BC%E5%93%81%E4%BA%BA%E7%BE%A4%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx`);
        }
    }

    handleUploadChange = ({ file }) => {
        if (file.status === 'done') {
            this.setState({ importCardPath: file.response.data.url, api_importCardPath: '' });
            message.success('自定义群体上传成功！');
        } else if (file.status === 'error') {
            message.error('自定义群体上传失败！');
        }
    }

    handleBeforeUpload = (file) => {
        if (!file) return true; // in case of browser compatibility
        const types = ['.xlsx', '.xls'];
        const matchedType = types.find((type) => {
            const regexp = new RegExp(`^.*${type.replace('.', '\\.')}$`);
            return file.name.match(regexp);
        });
        if (types.length && !matchedType) {
            message.error('上传文件格式错误');
            return false;
        }
        console.log(file);
        this.setState({
            fileList: [file],
        });
        return true;
    }

    handleUploadRemove = (file) => {
        this.setState({
            importCardPath: '',
            fileList: []
         });
        return true;
    }
    
    renderApproverSet = () => {
        return (
            <Approval type="special" onApprovalInfoChange={(val) => {
                this.setState({
                    approvalInfo: {
                        ...val
                    }
                })
            }} />
        )
    }

    render() { 
        return (
            <div style={{ position: "relative" }}>
                <Form>
                    <FormItem
                        label="会员群体"
                        className={styles.FormItemStyle}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17 }}
                    >
                        <div style={{ margin: '6px' }}>
                            <a href="#" onClick={this.downLoadTemp}>
                                <Icon type="cloud-download-o" style={{ fontSize: '20px', verticalAlign: 'middle' }} />下载会员群体导入模版
                            </a>
                        </div>
                    </FormItem>
                    <FormItem
                        label="上传文件"
                        className={styles.FormItemStyle}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17 }}
                        required
                    >
                        <Upload
                            fileList={this.state.fileList}
                            action="/api/v1/upload?service=HTTP_SERVICE_URL_CRM&method=/crm/uploadFile.ajax"
                            name="file"
                            onChange={this.handleUploadChange}
                            onRemove={this.handleUploadRemove}
                            beforeUpload={this.handleBeforeUpload}
                        >
                            <Button>
                                选择文件
                            </Button>
                        </Upload>
                    </FormItem>
                    <div style={{ height: '20px' }}></div>
                    {this.renderApproverSet()}
                </Form>
                {
                    this.props.isUpdate && !this.props.isCopy && !this.props.isNew && <div className={styles.stepOneDisabled} style={{ height: '100%', top: 0 }}></div>
                }
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        specialPromotion: state.sale_specialPromotion_NEW,
        user: state.user.toJS(),
        mySpecialActivities: state.sale_mySpecialActivities_NEW.toJS(),
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        isUpdate: state.sale_myActivities_NEW.get('isUpdate'),

    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSpecialBasicInfo: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Two));
