import React, { Component } from 'react';
import { Modal, Button } from 'antd';

export default class Protocol extends Component {
	constructor(props) {
		super(props);
		this.state = {
			protocalVisible: false,
		};
	}

	seeProtocal = () => {
		this.setState({ protocalVisible: true });
	};
	render() {
		return (
			<Modal
				title="声明与授权"
                width={900}
				maskClosable={false}
				visible={this.state.protocalVisible}
				onCancel={() => this.setState({ protocalVisible: false })}
				footer={[
					<Button key="back" onClick={() => this.setState({ protocalVisible: false })}>
						返回
					</Button>,
				]}
			>
				<div>
                    <p style={{ color: '#333', lineHeight: '21px', fontWeight: 'bold' }}>您通过网络点击、勾选、确认或以其它方式选择接受本声明的，即表示您已理解并同意本声明，如您不同意接受本协议的任意内容，或者无法准确理解相关条款含义的，请不要进行后续操作。</p>
					<p style={{ color: '#333', lineHeight: '21px', fontSize: 14, fontWeight: 'bold' }}>一、声明与授权</p>
					<p style={{ color: '#666', lineHeight: '21px' }}>
						1.您承诺，储值业务、优惠券以及优惠活动等信息均由您发布，基于发布的信息您提供的商品/服务均由您独立运营并承担全部责任；
                        <span style={{ color: '#666', fontWeight: 'bold' }}>北京多来点信息技术有限公司及关联公司（以下简称“哗啦啦系统”或“我们”）仅受您委托为您提供信息发布相关的技术支持服务，我们并不对您发布的信息和提供的服务负责。</span>
					</p>
					<p style={{ color: '#333', lineHeight: '21px', fontSize: 14, fontWeight: 'bold' }}>二、责任限制和免责</p>
					<p style={{ color: '#333', lineHeight: '21px', fontWeight: 'bold' }}>
						1.您提供产品或服务前，应具备法律法规规定的与为您提供服务相适应的权利及资格亦或
                        <span style={{ textDecoration: 'underline' }}>经过权利人的合法授权或经过政府主管部门的审批或已经向政府主管部门作备案，获得相关部门的明确批准或认可，如您不具备上述主体资格的，请勿同意本声明。</span>
					</p>
					<p style={{ color: '#333', lineHeight: '21px', fontWeight: 'bold' }}>
						2.如用户因使用您提供的商品或服务过程中与您发生任何争议，包括但不限于商家提供的商品或服务质量、价格、有效期、退货退款、退卡、售后服务、服务态度等问题发生争议，由您与用户自行协商解决，并保证我们免于承担任何责任；如果您无法有效解决相关纠纷而导致用户向我方投诉或投诉我方，我们将根据用户和您提供的信息进行判断并代你解决相关问题，你对此认可并同意承担由此产生的赔付。
					</p>
					<p style={{ color: '#666', lineHeight: '21px' }}>
						3.我们对提供的技术服务所涉的技术和信息的有效性、准确性、正确性、可靠性、质量、稳定、完整和及时性均不作承诺和保证。我们在任何情况下都无需向您发布相关信息时在传输或联络中的迟延、不准确、错误或疏漏及因此而致使的损害负责。
					</p>
					<p style={{ color: '#666', lineHeight: '21px' }}>4.对下列情形，我们不承担任何责任：</p>
					<p style={{ color: '#666', lineHeight: '21px' }}>4.1由于您的故意或过失导致您及/或任何第三方遭受损失的。</p>
					<p style={{ color: '#666', lineHeight: '21px' }}>4.2在您和第三方发生的任何争议，或双方就该争议无法达成一致时，我们单方中止和（或）终止提供信息发布服务。</p>
					<p style={{ color: '#666', lineHeight: '21px' }}>4.3因不可抗力导致我们不能履行其义务的。</p>
					<p style={{ color: '#333', lineHeight: '21px', fontSize: 14, fontWeight: 'bold' }}>三、根据《单用途商业预付卡管理办法（试行）》及其他相关规定，如您设置储值预付卡业务的，建议您：</p>
					<p style={{ color: '#666', lineHeight: '21px' }}>1.发卡企业应在开展单用途卡业务之日起30日内按照下列规定办理备案:</p>
					<p style={{ color: '#666', lineHeight: '21px' }}>1.1集团发卡企业和品牌发卡企业向其工商登记注册地省、自治区、直辖市人民政府商务主管部门备案;</p>
					<p style={{ color: '#666', lineHeight: '21px' }}>1.2规模发卡企业向其工商登记注册地设区的市人民政府商务主管部门备案;</p>
					<p style={{ color: '#666', lineHeight: '21px' }}>1.3其他发卡企业向其工商登记注册地县(市、区)人民政府商务主管部门备案。</p>
					<p style={{ color: '#666', lineHeight: '21px' }}>2.储值卡储值金额限制：</p>
					<p style={{ color: '#666', lineHeight: '21px' }}>
						2.1个人或单位购买(含充值，下同)记名卡的，或一次性购买1万元(含)以上不记名卡的，发卡企业或售卡企业应要求购卡人及其代理人出示有效身份证件，并留存购卡人及其代理人姓名或单位名称、有效身份证件号码和联系方式。
					</p>
					<p style={{ color: '#666', lineHeight: '21px' }}>
						2.2单位一次性购买单用途卡金额达5000元(含)以上或个人一次性购卡金额达5万元(含)以上的，以及单位或个人采用非现场方式购卡的，应通过银行转账，不得使用现金，发卡企业或售卡企业应对转出、转入账户名称、账号、金额等进行逐笔登记。
					</p>
					<p style={{ color: '#666', lineHeight: '21px' }}>2.3 单张记名卡限额不得超过5000元，单张不记名卡限额不得超过1000元。</p>
				</div>
			</Modal>
		);
	}
}
