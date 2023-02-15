/*
 * @Author: Songnana
 * @Date: 2022-12-06 14:23:34
 * @Modified By: modifier Songnana
 * @Descripttion: 
 */
import DateRange from '../../PromotionV3/Camp/DateRange';
import { Tooltip, Icon } from 'antd';
import styles from './styles.less'
import classnames from 'classnames';

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 14 },
};

const wrapperCol = { offset: 5, span: 14 };

const formItems1 = {
  eventType: {
    type: 'custom',
    label: '活动类型',
    render: () => (<p>权益卡砍价</p>),
    defaultValue: '78',
  },
  eventName: {
    type: 'text',
    label: '活动名称',
    rules: ['required', 'stringLength2'],
  },
  eventCode: {
    type: 'text',
    label: <span>活动编码 <Tooltip title='活动编码填写后不可修改'><Icon type="question-circle" style={{ marginLeft: 5 }} /></Tooltip></span>,
    placeholder: '请输入活动编码',
    rules: [
      { message: "字母、数字组成，不多于50个字符", pattern: /^[A-Za-z0-9]{1,50}$/ },
    ],
  },
  eventRange: {
    type: 'custom',
    label: '活动起止日期',
    rules: ['required'],
    // wrapperCol: { span: 17 },
    defaultValue: [],
    render: d => d()(<DateRange />),
  },
  eventRemark: {
    type: 'textarea',
    label: '活动说明',
    rules: ['description2'],
    placeholder: '请输入活动说明（最多1000字符）'
  },
};

const getValidator = (value) => {
  if (!value) {
    return true
  }
  if (!/^\d+$/.test(value)) {
    return true
  }
  if (+value < 1 || +value > 99) {
    return true
  }
  return false
}

const formItems2 = {
  cardTypeID: {
    type: 'custom',
    label: '选择权益卡',
    required: true,
    render: () => { },
  },
  gears: {
    type: 'custom',
    label: '',
    wrapperCol,
    required: true,
    render: () => { },
  },
  // giftGetRule: {
  //   type: 'radio',
  //   label: '砍价方式',
  //   defaultValue: 6,
  //   options: [
  //     { label: '砍至指定价格', value: 6 },
  //   ],
  // },
  // bargainTip: {
  //   type: 'custom',
  //   label: '',
  //   wrapperCol,
  //   render: () => (<p className={styles.tips}>“砍至指定价格”砍价到指定的价格才可以购买</p>),
  // },
  giftGetRuleValue: {
    type: 'text',
    label: '礼品底价',
    surfix: '元',
    rules: [{
      required: true,
      message: '请输入礼品底价',
    }, {
      pattern: /^(([1-9]\d{0,3})(\.\d{0,2})?|0.\d?[1-9]{1})$/,
      message: '必须>0，整数不超过4位且小数不超过2位',
    }],
  },
  giftCountTip: {
    type: 'custom',
    label: '',
    wrapperCol,
    render: () => (<p className={styles.tips}>用户将权益卡砍至此价格才完成购买，底价需小于权益卡原价</p>)
  },
  needCount: {
    type: 'text',
    label: '帮砍人数',
    rules: [{
      required: true,
      validator: (rule, value, callback) => {
        if (!value) {
          return callback('请输入帮砍人数')
        }
        if (!/^\d+$/.test(value)) {
          return callback('请输入数字');
        }
        if (+value < 1 || +value > 99) {
          return callback('人数设置支持1～99正整数');
        }
        return callback();
      },
    }],
  },
  bargainCountTip: {
    type: 'custom',
    label: '',
    wrapperCol,
    render: () => (<p className={styles.tips}>用户砍价至底价所需要邀请的帮砍助力人数</p>)
  },
  ratio: {
    type: 'custom',
    label: '首刀砍价比例',
    required: true,
    render: () => {},
  },
  ratioTip: {
    type: 'custom',
    label: '',
    wrapperCol,
    render: (d, form) => {
      const { rightIntervalValue } = form.getFieldsValue();
      const flag = getValidator(rightIntervalValue)
      return (<p className={classnames(styles.tips, {
        [styles.erorrPosition]: flag,
      })}
      >用户自己的首刀比例会在设置的区间范围内随机选择，若设置相同则为固定概率</p>)
    },
  },
  eventDuration: {
    type: 'text',
    label: '砍价有效期',
    surfix: '小时',
    rules: [{
      required: true,
      // message: '请输入砍价有效期',
      validator: (rule, value, callback) => {
        if (!value) {
          return callback('请输入砍价有效期');
        }
        if (!/^\d+$/.test(value)) {
          return callback('请输入数字');
        }
        if (value > 240 || value < 1) {
          return callback('请输入1-240的数字');
        }
        return callback();
      },
    }],
  },
  bargainValidityTip: {
    type: 'custom',
    label: '',
    wrapperCol,
    render: () => (<p className={styles.tips}>用户发起砍价，邀请好友有效时间</p>)
  },
  buyLimit: {
    type: 'text',
    label: '发起次数限制',
    surfix: '次',
    prefix: '活动期限内可发起',
    rules: [{
      required: true,
      validator: (rule, value, callback) => {
        if (!value) {
          return callback('请输入发起次数限制');
        }
        if (!/^\d+$/.test(value)) {
          return callback('请输入数字');
        }
        if (value > 99 || value < 1) {
          return callback('请输入1-99的数字');
        }
        return callback();
      },
    }],
  },
  countLimitTip: {
    type: 'custom',
    label: '',
    wrapperCol,
    render: () => (<p className={styles.tips}> 每个用户在此活动时间内可以发起的次数</p>)
  },
};

const formItems3 = {
  defaultCardType: {
    label: '新用户注册卡类',
    type: 'custom',
},
  cardTypeTips: {
    type: 'custom',
    label: '',
    wrapperCol,
    render: () => (<p className={styles.tips}> 针对所参与此活动的新用户自动注册为所选卡类下的会员</p>)
  }
}

const columns = [
  {
    title: '档位名称',
    dataIndex: 'indexName',
    key: 'indexName',
    width: 90,
    className: 'TableTxtCenter',
    render: (text, record, index) => {
      return <span title={text}>{text}</span>
    }
  }, {
    title: '权益时长(天)',
    dataIndex: 'validityDay',
    key: 'validityDay',
    width: 90,
    className: 'TableTxtRight',
    render: (text, record, index) => {
      return <span title={text}>{text}</span>
    },
  },
  {
    title: '售价(元)',
    dataIndex: 'realPrice',
    key: 'realPrice',
    width: 90,
    className: 'TableTxtRight',
    render: (text, record, index) => {
      return <span title={text}>{text}</span>
    },
  },
  {
    title: '可售数量(张)',
    dataIndex: 'stockCount',
    key: 'stockCount',
    width: 90,
    className: 'TableTxtRight',
    render: (text, record, index) => {
      return <span title={text}>{text}</span>
    },
  }
]

export {
  formItems1, formItemLayout, formItems2, formItems3, columns
}