import React, { Component } from 'react'
import { Modal, Form, Input, message } from 'antd';
import { getStore } from '@hualala/platform-base'
import { axiosData } from '../../../helpers/util';

const FormItem = Form.Item

class PlanModal extends Component {
	constructor() {
		super();
		this.state = {}
	}

	componentDidMount() {
	}

	handlePlanOk = () => {
		if (this.props.filterSchemeList.length >= 50) {
			return message.warning('最多添加50个方案')
		}
		this.props.form.validateFields((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);
				const groupID = getStore().getState().user.getIn(['accountInfo', 'groupID']);
				const filterRule = { groupID, isActive: this.props.isActive, schemeName: values.schemeName }
				axiosData(
					'/filterSchemeService/add.ajax',
					{
						filterSchemeInfo: {
							filterType: 11,
							filterRule: JSON.stringify(filterRule),
						},
						groupID,
					},
					null,
					{ path: '' },
					'HTTP_SERVICE_URL_PROMOTION_NEW'
				).then((res) => {
					if (res.code === '000') {
						this.props.onCancel()
						this.props.onSearch()
					}
					// let { data = {} } = res
					// this.setState({ authLicenseData: data })
					// let { authStatus } = checkAuthLicense(this.state.authLicenseData)
					// this.setState({ authStatus })
				});
			}
		});
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<Modal
				title="请输入方案名称"
				onCancel={this.props.onCancel}
				visible={true}
				width={600}
				onOk={this.handlePlanOk}
			>
				<Form>
					<FormItem label="方案名称" layout="horizontal" wrapperCol={{span: 16}} labelCol={{ span: 4}}>
						{getFieldDecorator('schemeName', {
							initialValue: '',
							rules: [
								{
									required: true,
									validator: (rule, value, callback) => {
										if (!value) {
											return callback('方案名称不能为空');
										}
										if (value.length > 50) {
											return callback('最多50个字符')
										}
										return callback();
									},
								}
							],
						})(<Input />)}
					</FormItem>
				</Form>
			</Modal>
		)
	}
}

export default Form.create()(PlanModal);
