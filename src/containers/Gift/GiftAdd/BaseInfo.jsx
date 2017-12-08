import React from 'react';
import { Row, Col } from 'antd';
import * as utils from '../../../helpers/util';
import styles from './styles/BaseInfo.less';
import Cfg from '../../../constants/CrmOperationCfg';
import _ from 'lodash';
import { addNumFloat } from '../GiftInfo/CommonFn';
const BaseInfo = ({ data }) => {
  const proSourceData = formatFormData(data);
  proSourceData.cardResidueMoney = addNumFloat(proSourceData.moneyBalance, proSourceData.giveBalance);
  // proSourceData.cardTypeName = proSourceData.cardTypeCrmParam.cardTypeName;
  const info = baseInfoCfg.map((rowItem, pIndex) =>
    <Col span={12} key={pIndex}>
        {
            rowItem.map((data,index) => {
                let value = proSourceData[data.key];
                return (
                    <Row key={index} >
                        {
                            pIndex == 1 ?
                            <Col span={12} style={{textAlign:"right"}} pull={3}>
                                <label>{`${data.label} ：`}</label>
                            </Col> :
                            <Col span={12} style={{textAlign:"right"}} >
                                <label>{`${data.label} ：`}</label>
                            </Col>
                        }
                        {
                            pIndex == 1 ?
                            <Col span={9} pull={3} className={styles.fontColor}>
                                <p>{value}</p>
                            </Col> :
                            <Col span={9} className={styles.fontColor}>
                                <p>{value}</p>
                            </Col>
                        }
                    </Row>
                )
            })
        }
    </Col>
  );
  return (
    <div className={styles.crmSet}>
      <Row>
        <Col span={24}>
            <div className={[styles.titleWrap_2,'clearfix'].join(' ')}><p className={styles.flag}></p><h5 className={styles.title}>基本信息</h5></div>
        </Col>
      </Row>
      <Row >
        { info }
      </Row>
    </div>
  );
}
function formatFormData(record) {
  return _.mapValues(record, (value, key) => {
    switch(key){
        case 'cardValidUntiDate':
            return value = value == 0 ? '永久有效' : utils.formatDateStr(String(value));
        case 'cardStatus':
            let color = value == 10 ? {color: '#1ab495'} : {color: '#DC143C'};
            return value = (<span style={color}>{ mapValueToLabel(Cfg.cardStatus, String(value)) }</span>);
        case 'cardLevelName':
            return value = value;
        case 'moneyBalance':
            return value = value;
        // case 'cardResidueMoney':
        //     return value = record.moneyBalance + record.giveBalance;
        default:
            return value !== undefined ? value : '';
    }
  })
}
function mapValueToLabel(cfg, val) {
  return _.result(_.find(cfg, { value : val}), 'label');
}

const baseInfoCfg = [[{
        label:'会员卡号',
        key:'cardNO'
      },{
        label:'会员姓名',
        key:'customerName'
      },{
        label:'本卡类别',
        key:'cardTypeName'
      },{
        label:'卡上余额',
        key:'cardResidueMoney'
      },{
        label:'现金卡值',
        key:'moneyBalance'
      },{
        label:'本卡状态',//
        key:'cardStatus'
      }],
      [{
        label:'联系方式',
        key:'customerMobile'
      },{
        label:'会员生日',
        key:'customerBirthday'
      },{
        label:'本卡等级',
        key:'cardLevelName'
      },{
        label:'剩余积分',
        key:'pointBalance'
      },{
        label:'赠送卡值',
        key:'giveBalance'
      },{
        label:'有效期至',
        key:'cardValidUntiDate'
      }]
  ];
export default BaseInfo;
