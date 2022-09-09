import { Col, Form, Icon, Input, Radio, Row, Tooltip } from 'antd';
import ImageUpload from 'components/common/ImageUpload';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import BaseForm from '../../../components/common/BaseForm';
import { httpQueryDistributionParams } from '../AxiosFactory';
import { setDistributionItemIDAC } from '../store/action';
import { distributionTypesOptions, relationRuleOptions } from './constant';
import styles from './style.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const FormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.adminForm = null;
    this.state = {
      withdrawRuleType: 1,
      formData: {},
    }
  }

  componentDidMount() {
    this.props.onRef(this);
    this.getDistribution()
  }

  onChangeForm = (key, value) => {
    if (key === 'withdrawRuleType') {
      this.setState({
        withdrawRuleType: value,
      });
      this.adminForm.resetFields(['withdrawTimeStep1', 'withdrawTimeStep2']);
    }
  }

  getDistribution = () => {
    this.adminForm.resetFields();
    httpQueryDistributionParams().then((res) => {
      if (res) {
        const { setDistributionItemID } = this.props;
        const { bannerUri, distributionStatus, itemID, withdrawRuleType, distributionTypes, withdrawTimeStep } = res;
        setDistributionItemID(itemID);
        const copiedRes = _.cloneDeep(res);
        copiedRes.distributionStatus = +distributionStatus === 1;
        copiedRes.distributionTypes = distributionTypes.split(',')
        if (bannerUri) {
          copiedRes.bannerUri = {
            fileName: bannerUri,
            url: bannerUri,
          }
        }
        if (+withdrawRuleType === 1) {
          copiedRes.withdrawTimeStep1 = withdrawTimeStep;
        } else if (+withdrawRuleType === 2) {
          copiedRes.withdrawTimeStep2 = withdrawTimeStep;
        }
        this.setState({
          withdrawRuleType,
          formData: copiedRes,
        })
      }
    })
  }

  render() {
    const formKeys = [
      'distributionStatus',
      'distributionTypes',
      'relationRule',
      'distributionTimeStep',
      'rebateRatio',
      'withdrawRuleType',
      'rakeBackID',
      'bannerUri',
    ];

    const formItems = {
      distributionStatus: {
        label: '启用状态:',
        type: 'switcher',
        defaultValue: false,
        onLabel: '开',
        offLabel: '关',
      },
      distributionTypes: {
        label: '分销商品类型:',
        type: 'checkbox',
        defaultValue: [1],
        rules: [{
          required: true, message: '请选择分销商品类型',
        }],
        options: distributionTypesOptions,
      },
      relationRule: {
        label: '分销关系建立规则:',
        type: 'radio',
        defaultValue: 1,
        options: relationRuleOptions,
      },
      distributionTimeStep: {
        label: '分销关系持续时间:',
        type: 'custom',
        defaultValue: 1,
        render: decorator => (
          <Row>
            <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
              {decorator({
                rules: [
                  {
                    pattern: /^([1-9]\d{0,1})$|^100$/,
                    message: '请输入1-100的正整数',
                  }],
              })(<Input addonAfter="天" />)}
              <Tooltip
                placement="top"
                title="此配置仅针对新邀请用户有效，即上线邀请后，系统记录关系绑定时间，到期后自动解绑，上线不再享受佣金。"
              >
                <Icon type="question-circle-o" style={{ marginLeft: '8px' }} className={styles.questionIcon} />
              </Tooltip>
            </Col>
          </Row>
        ),
      },
      rebateRatio: {
        label: '分销返佣比例:',
        type: 'custom',
        defaultValue: 1,
        render: decorator => (
          <Row>
            <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '5px' }}>订单实付金额的</span>
              {decorator({
                rules: [
                  {
                    pattern: /^([1-9]\d{0,1})$|^100$/,
                    message: '请输入1-100的正整数',
                  }],
              })(<Input addonAfter="%" />)}
              <Tooltip
                placement="top"
                title="为避免被人重复下单退单所产生的刷单行为，建议在支付/交易完成1～10天后允许提现。"
              >
                <Icon type="question-circle-o" style={{ marginLeft: '8px' }} className={styles.questionIcon} />
              </Tooltip>
            </Col>
          </Row>
        ),
      },
      withdrawRuleType: {
        label: '返佣提现规则:',
        type: 'custom',
        render: decorator => (
          <Row>
            <Col span={24} style={{ display: 'flex', alignItems: 'center' }}>
              {decorator({
                initialValue: this.state.withdrawRuleType,
              })(
                <RadioGroup>
                  <Radio value={1} style={{ display: 'block' }}>
                    <span>被邀请人支付成功</span>
                    <FormItem style={{ display: 'inline-block', marginTop: '-4px' }}>
                      {decorator({
                        key: 'withdrawTimeStep1',
                        rules: [
                          { required: +this.state.withdrawRuleType === 1, message: '请输入0-10的正整数' },
                          {
                            pattern: /^([0-9]|10)$/,
                            message: '请输入0-10的正整数',
                          }],
                      })(
                        <Input style={{ width: '100px', margin: '0 5px' }} disabled={this.state.withdrawRuleType !== 1} />
                      )}
                    </FormItem>
                    <span>天后可提现</span>
                    <Tooltip
                      placement="top"
                      title="为避免被邀人重复下单退单所产生的刷单行为，建议在支付/交易完成1~10天后允许提现"
                    >
                      <Icon type="question-circle-o" style={{ marginLeft: '8px' }} />
                    </Tooltip>
                  </Radio>
                  <Radio value={2} style={{ display: 'block' }}>
                    <span>被邀请人交易完成</span>
                    <FormItem style={{ display: 'inline-block', marginTop: '-4px' }}>
                      {decorator({
                        key: 'withdrawTimeStep2',
                        rules: [
                          { required: +this.state.withdrawRuleType === 2, message: '请输入0-10的正整数' },
                          {
                            pattern: /^([0-9]|10)$/,
                            message: '请输入0-10的正整数',
                          }],
                      })(
                        <Input style={{ width: '100px', margin: '0 5px' }} disabled={this.state.withdrawRuleType !== 2} />
                      )}
                    </FormItem>
                    <span>天后可提现</span>
                    <Tooltip
                      placement="top"
                      title="为避免被邀人重复下单退单所产生的刷单行为，建议在支付/交易完成1~10天后允许提现"
                    >
                      <Icon type="question-circle-o" style={{ marginLeft: '8px' }} />
                    </Tooltip>
                  </Radio>
                </RadioGroup>
              )}
            </Col>
          </Row>
        ),
      },
      rakeBackID: {
        label: '权益包账户ID:',
        type: 'custom',
        render: decorator => (
          <Row>
            <Col span={24}>
              {decorator({
                rules: [
                  { required: true, message: '最大输入限制50字符' },
                ],
              })(<Input style={{ width: '400px' }} />)}
            </Col>
          </Row>
        ),
      },
      bannerUri: {
        label: '分销引导图:',
        type: 'custom',
        render: decorator => (
          <Row style={{ position: 'relative' }}>
            <Col className={styles.bannerUriBox}>
              <Col className={styles.leftBanner}>
                {
                  decorator({})(
                    <ImageUpload
                      limitType={'.jpeg,.jpg,.png,.JPEG,.JPG,.PNG'}
                      limitSize={5 * 1024 * 1024}
                      getFileName={true}
                      tips={'上传图片'}
                    />
                  )
                }
              </Col>
              <Col>
                <div className={styles.rightDesc}>
                  <p>图片大小不要超过1M</p>
                  <p>建议尺寸750*2000</p>
                  <p>支持JPG、PNG图片文件</p>
                </div>
              </Col>
            </Col>
          </Row>
        ),
      },
    }

    return (
      <Col span={24} className={styles.adminContainer} style={{ height: 'calc(100vh - 100px' }}>
        <BaseForm
          getForm={(form) => { this.adminForm = form }}
          formKeys={formKeys}
          formItems={formItems}
          formData={this.state.formData}
          formItemLayout={FormItemLayout}
          onChange={this.onChangeForm}
        />
      </Col>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setDistributionItemID: opts => dispatch(setDistributionItemIDAC(opts)),
  }
};

export default connect(null, mapDispatchToProps)(Admin);

