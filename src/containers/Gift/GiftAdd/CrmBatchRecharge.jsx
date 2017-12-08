import React, { Component } from 'react'
import { render } from 'react-dom'
import { Row, Col, Input, Form, TreeSelect } from 'antd';

import BaseForm from '../../../components/common/BaseForm';
import SetModal from './SetModal';

import { fetchData } from '../../../helpers/util';

import Cfg from '../../../constants/CrmOperationCfg';
import styles from './styles/CrmBatchRecharge.less';
import _ from 'lodash';

const FormItem = Form.Item;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
export default class CrmBatchRecharge extends React.Component {
    constructor(props) {
        super(props);
        this.basicParamForm = null;
        this.profileSetForm = null;
        this.data={};
        this.state = {
          data: this.props.data,
          keys: this.props.type == 'batchRecharge' ? ['chongzhifangshi','taocanxuanze','chongzhijine','zengsongjine','fanzengjifen','fukuanfangshi'] : ['chongzhidianpu','chongzhifangshi','taocanxuanze','chongzhijine','zengsongjine','fanzengjifen','fukuanfangshi']
        };
    }

    componentDidMount() {
        this.props.getSubmitFn(this.handleSubmit);
    }

    componentWillReceiveProps(nextProps) {
        [this.basicParamForm, this.profileSetForm].forEach(form => {
            form && form.resetFields();
        });
    }

    componentWillUnmount() {
        this.props.callback && this.props.callback(_.merge(this.props.data, this.data));
    }

    handleSubmit = (currentFn, cbFn) => {
      this.basicParamForm.validateFieldsAndScroll((err1, basicValues) => {
        this.profileSetForm.validateFieldsAndScroll((err2, businessValues) => {
          if (err1 || err2) return;
          const data = { ...basicValues, ...businessValues };
          this.data= data;
          currentFn();
        });
      });
    }
    handleFormChange = (key, value) => {
      switch(key) {
        case 'setSelected':
          this.profileSetForm.setFieldsValue({
            setValue: value == undefined ? '' : value.setName,
            setInfo: value == undefined ? '' : `充值金额：${value.setSaveMoney}\n赠送金额：${value.returnMoney}\n返积分：${value.returnPoint}\n可用会员卡类型：${value.saveMoneySetCardLevels}`,
          });
          break;
        case 'chongzhifangshi':
          if(this.props.type == 'batchRecharge'){
            if(value == 'false') {
              const key1 = ['chongzhifangshi','chongzhijine','zengsongjine','fanzengjifen','fukuanfangshi'];
              this.setState({ keys: key1});
            } else {
              const key1 = ['chongzhifangshi','taocanxuanze','taocanxinxi','fukuanfangshi'];
              this.setState({ keys: key1});
            }
          } else {
            if(value == 'false') {
              const key1 = ['chongzhidianpu','chongzhifangshi','chongzhijine','zengsongjine','fanzengjifen','fukuanfangshi'];
              this.setState({ keys: key1});
            } else {
              const key1 = ['chongzhidianpu','chongzhifangshi','taocanxuanze','taocanxinxi','fukuanfangshi'];
              this.setState({ keys: key1});
            }
          }
          // const key1 = ['chongzhidianpu','chongzhifangshi','chongzhijine','zengsongjine','fanzengjifen','fukuanfangshi'];
          // const key2 = ['chongzhidianpu','chongzhifangshi','taocanxuanze','taocanxinxi','fukuanfangshi'];
          // value == "false" ? this.setState({ keys: key1}) : this.setState({ keys: key2 });
      }
    }

    render() {
      const tProps = {
        treeData: this.props.shopsData,
        showSearch: true,
        showCheckedStrategy: SHOW_PARENT,
        searchPlaceholder: '请搜索店铺',
      };
      const formItems = {
        crmCardType: {
          type: 'text',
          label: '会员卡类别',
          labelCol:  { span: 7 },
          wrapperCol:  { span: 13 },
          placeholder:'请选择卡类别',
        },
        crmCardName: {
          type: 'text',
          label: '会员卡名称',
          labelCol:  { span: 7 },
          wrapperCol:  { span: 13 },
          placeholder:'请输入卡名称',
        },
        startNO: {
          type: 'text',
          label: '起始卡号',
          labelCol:  { span: 7 },
          wrapperCol:  { span: 13 },
          placeholder:'请输入起始卡号',
        },
        endNO: {
          type: 'text',
          label: '终止卡号',
          labelCol:  { span: 7 },
          wrapperCol:  { span: 13 },
          placeholder:'请输入终止卡号',
        },
        chongzhidianpu: {
          type: 'custom',
          label: '充值店铺',
          labelCol:  { span: 7 },
          wrapperCol:  { span: 13 },
          placeholder:'请选择店铺',
          render: decorator => (
              <Row>
                <Col >
                  <FormItem>
                    {decorator({
                    })(<TreeSelect {...tProps} />)}
                  </FormItem>
                </Col>
              </Row>
            )
          },
        zhikahouzhuangtai: {
          type: 'radio',
          label: '制卡后状态',
          labelCol:  { span: 7 },
          wrapperCol:  { span: 13 },
          placeholder:'请输入充值金额',
          options: Cfg.zhikahouzhuangtai,
          defaultValue: 'true',
        },
        chongzhifangshi: {
          type: 'radio',
          label: '充值方式',
          labelCol:  { span: 7 },
          wrapperCol:  { span: 13 },
          placeholder:'请输入充值金额',
          options: Cfg.rechargeWay,
          defaultValue: 'false',
        },
        chongzhijine: {
          type: 'text',
          label: '充值金额',
          labelCol:  { span: 7 },
          wrapperCol:  { span: 13 },
          placeholder:'请输入充值金额',
          surfix:'元',
        },
        zengsongjine: {
          type: 'text',
          label: '赠送金额',
          labelCol:  { span: 7 },
          wrapperCol:  { span: 13},
          placeholder:'请输入赠送金额',
          surfix:'元',
        },
        fanzengjifen: {
          type: 'text',
          label: '返增积分',
          labelCol:  { span: 7 },
          wrapperCol:  { span: 13 },
          placeholder:'请输入返增积分',
          surfix:'分',
        },
        fukuanfangshi: {
          type: 'radio',
          label: '付款方式',
          labelCol:  { span: 7 },
          wrapperCol:  { span: 13 },
          options: Cfg.paymentWay,
          defaultValue: '0',
        },
        taocanxuanze: {
          type: 'custom',
          label: '套餐选择',
          labelCol:  { span: 7 },
          wrapperCol:  { span: 13 },
          placeholder:'请选择套餐',
          render: decorator => (
              <Row className={styles.setSelectedWrap}>
                <Col span={15}>
                  <FormItem>
                    {decorator({
                      key: 'setValue',
                    })(<Input disabled/>)}
                  </FormItem>
                </Col>
                <Col span={9} >
                  <FormItem>
                    {decorator({
                      key: 'setSelected',
                    })(<SetModal />)}
                  </FormItem>
                </Col>
              </Row>
            )
          },
        taocanxinxi: {
          type: 'custom',
          label: '套餐信息',
          labelCol:  { span: 7 },
          wrapperCol:  { span: 13 },
          placeholder:'请选择套餐',
          render: decorator => (
              <Row className={styles.setInfoWrap}>
                <Col span={24} >
                  <FormItem>
                    {decorator({
                      key: 'setInfo',
                    })(<Input  type="textarea"/>)}
                  </FormItem>
                </Col>
              </Row>
            )
        },
      };
      const { type } = this.props;
      let basicKeys = type == 'batchRecharge' ? ['startNO','endNO','chongzhidianpu'] : ['crmCardType','crmCardName','startNO','endNO','zhikahouzhuangtai']
      const basicParamFormKeys = [{
        col: { span: 24 },
        keys: basicKeys,
      }];
      const profileSetFormKeys = [{
        col: { span: 24 },
        keys: this.state.keys,
      }];
      const title = Cfg.operationTypeCfg.filter(item => {
        if(item.type == this.props.type) return item.describe;
      });
      return (
        <Row className={styles.crmSet}>
          <Col span={24} >
            <div className={[styles.titleWrap_2,'clearfix'].join(' ')}><p className={styles.flag}></p><h5 className={styles.title}>基本信息</h5></div>
          </Col>
          <Col span={24} className={styles.crmCardBase}>
            <BaseForm getForm={form => this.basicParamForm = form}
              formItems={formItems}
              formData={this.props.data}
              formKeys={basicParamFormKeys}
              onChange={this.handleFormChange}
            />
          </Col>
          <Col span={24}>
            <div className={[styles.titleWrap_2,'clearfix'].join(' ')}><p className={styles.flag}></p><h5 className={styles.title}>{`${title.length > 0 ? title[0].name : ''}信息`}</h5></div>
          </Col>
          <Col span={24} className={styles.formWrap}>
            <BaseForm getForm={form => this.profileSetForm = form}
              formItems={formItems}
              formData={this.props.data}
              formKeys={profileSetFormKeys}
              onChange={this.handleFormChange}
            />
          </Col>
        </Row>
      );
  }
}
