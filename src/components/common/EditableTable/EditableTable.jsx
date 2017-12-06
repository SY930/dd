/*
*组件名称：EditableTable (可编辑表格)
* 功能：动态加载表格格式，实现可编辑，上移下移置顶置底等功能
* 陈双   2016/12/2
 */
import React from 'react';
import { Table, Icon, Popconfirm, Modal, Button, Switch, Input, Tag, Checkbox } from 'antd';
import { Iconlist } from '../../basic/IconsFont/IconsFont';
import styles from './EditableTable.less';

// if (process.env.__CLIENT__ === true) {
//   require('../../../../client/components.less');
// }

class EditableCell extends React.Component {
  state = {
      value: this.props.value,
      editable: this.props.editable || false,
      visible: false,
  }
  componentWillReceiveProps(nextProps) {
      if (nextProps.editable !== this.state.editable) {
          this.setState({ editable: nextProps.editable });
          if (nextProps.editable) {
              this.cacheValue = this.state.value;
          }
      }
      if (nextProps.status && nextProps.status !== this.props.status) {
          if (nextProps.status === 'save') {
              this.props.onChange(this.state.value);
          } else if (nextProps.status === 'cancel') {
              this.setState({ value: this.cacheValue });
              this.props.onChange(this.cacheValue);
          }
      }
  }
  shouldComponentUpdate(nextProps, nextState) {
      return nextProps.editable !== this.state.editable ||
      nextState.value !== this.state.value;
  }
  handleChange(e) {
      const value = e.target.value;
      this.setState({ value });
      this.props.onChanges(value);
  }
  render() {
      const { value, editable } = this.state;
      return (<div>
          {
              editable ?
                  <div>
                      <Input
                          value={value}
                          ref={'newref'}
                          onChange={e => this.handleChange(e)}
                      />
                  </div>
                  :
                  <div className="editable-row-text">
                      {value || ' '}
                  </div>
          }
      </div>);
  }
}

export default class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        // 特价活动页面的表格
        this.columnsone = [
            {
                title: '序号',
                dataIndex: 'num',
                key: 'num',
                width: '50',
                fixed: 'left',
                className: styles.EditTableTextCenter,
                // 参数分别为当前行的值，当前行数据，行索引，return可以决定表格里最终存放的值
                render: (text, record, index) => {
                    return <span>{index + 1}</span>
                },
            }, {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                width: '50',
                fixed: 'left',
                className: styles.EditTableTextCenter,
                render: (text, record, index) => {
                    return (
                        <div className="editable-row-operations">
                            <span>
                                <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDel(index)}>
                                    <a title="删除" alt="删除">删除</a>
                                </Popconfirm>
                            </span>
                        </div>
                    );
                },
            }, {
                title: '菜品',
                dataIndex: 'dishes',
                key: 'dishes',
                width: '160',
                fixed: 'left',
                className: [styles.EditTableTextLeft, styles.EditTableText1].join(' '),
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'category', text),
            }, {
                title: '单位',
                dataIndex: 'unit',
                key: 'unit',
                className: styles.EditTableTextLeft,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'category', text),
            }, {
                title: '编码',
                dataIndex: 'code',
                key: 'code',
                className: styles.EditTableTextLeft,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'code', text),
            }, {
                title: '分类',
                dataIndex: 'category',
                key: 'category',
                className: styles.EditTableTextLeft,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'category', text),
            }, {
                title: '原价格(元)',
                dataIndex: 'originalprice',
                key: 'originalprice',
                className: styles.EditTableTextRight,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'originalprice', text),
            }, {
                title: '打折比例(%)',
                dataIndex: 'salepercent',
                key: 'salepercent',
                className: styles.EditTableTextRight,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'salepercent', text),
            }, {
                title: '特价(元)',
                dataIndex: 'editprice',
                key: 'editprice',
                className: styles.EditTableTextRight,
                render: (text, record, index) => {
                    const { editable } = this.state.data[index].editprice;
                    return (<div className={styles.EditableLast}>
                        {
                            editable ?
                                <span className={styles.EditableClick1} onBlur={() => this.editDone(index, record)}>
                                    {this.renderColumns(this.state.data, index, 'editprice', text)}
                                </span>
                                :
                                <div className={styles.EditableClick2} onClick={() => this.edit(index, record)}>
                                    <span><Iconlist className={'table-edit'} iconName={'edit'} /></span>
                                    <span>
                                        {this.renderColumns(this.state.data, index, 'editprice', text)}
                                    </span>
                                </div>
                        }
                    </div>);
                },
            }];
        // 我的活动 页面
        this.columnstwo = [
            {
                title: '序号',
                dataIndex: 'num',
                key: 'num',
                width: '50',
                fixed: 'left',
                // 参数分别为当前行的值，当前行数据，行索引，return可以决定表格里最终存放的值
                render: (text, record, index) => {
                    return <span>{index + 1}</span>
                },
            }, {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                width: '110',
                fixed: 'left',
                render: (text, record, index) => {
                    return (
                        <div className="editable-row-operations">
                            <span>
                                <a onClick={() => this.handleAdd()}>查看</a>
                &nbsp;
                                <a onClick={() => this.handleAdd()}>修改</a>
                &nbsp;

                                <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDel(index)}>
                                    <a>删除</a>
                                </Popconfirm>
                &nbsp;
                                {/* <a onClick={() => this.handleAdd()}>适应店铺</a> */}
                            </span>
                        </div>
                    );
                },
            }, {
                title: '活动类别',
                dataIndex: 'promotionCategory',
                key: 'promotionCategory',
                width: '90',
                fixed: 'left',
                className: styles.EditTableTextLeft,
            }, {
                title: '活动类型',
                dataIndex: 'promotionType',
                key: 'promotionType',
                width: '90',
                fixed: 'left',
                className: styles.EditTableTextLeft,
            }, {
                title: '活动名称',
                dataIndex: 'promotionName',
                key: 'promotionName',
                width: '120',
                fixed: 'left',
                className: [styles.EditTableTextLeft, styles.EditTableTxt2].join(' '),
            }, {
                title: '活动编码',
                dataIndex: 'promotionCode',
                key: 'promotionCode',
                className: styles.EditTableTextLeft,
            }, {
                title: '有效时间',
                dataIndex: 'validTime',
                key: 'validTime',
                className: styles.EditTableTextLeft,
            }, {
                title: '条件',
                dataIndex: 'condition',
                key: 'condition',
                width: '150',
                className: [styles.EditTableTextLeft, styles.EditTableTxt33].join(' '),
                render: (text, record, index) => {
                    const tags = [];
                    record.condition.map((item) => {
                        tags.push(<Tag className={styles.EidtTableTag}>{item.name}</Tag>)
                    });
                    return tags;
                },
            }, {
                title: '活动状态',
                dataIndex: 'activityState',
                key: 'activityState',
                className: styles.EditTableTextLeft,
            }, {
                title: '创建人/修改人',
                dataIndex: 'createBy',
                key: 'createBy',
                className: styles.EditTableTextLeft,
            }, {
                title: '创建时间/修改时间',
                dataIndex: 'createTime',
                key: 'createTime',
                className: styles.EditTableTextLeft,
            }, {
                title: '启用状态',
                dataIndex: 'isActive',
                key: 'isActive',
                className: styles.EditTableTextLeft,
            }, {
                title: '排序',
                dataIndex: 'sort',
                key: 'sort',
                className: styles.EditTableTextCenter,
                render: (text, record, index) => {
                    return (
                        <span>
                            <span onClick={() => this.toTop(this.state.data, index)} title="置顶"><Iconlist className={'icon-zhiding'} iconName={'zhiding'} /></span>
                            <span onClick={() => this.toBottom(this.state.data, index)} title="置底"><Iconlist className={'icon-zhidi'} iconName={'zhidi'} /></span>
                            <span onClick={() => this.upRecord(this.state.data, index)} title="上移一位"><Iconlist className={'icon-shangyi'} iconName={'shang'} /></span>
                            <span onClick={() => this.downRecord(this.state.data, index)} title="下移一位"><Iconlist className={'icon-xiayi'} iconName={'xia'} /></span>
                        </span>
                    );
                },
            }];
        // 桌台（账单）活动明细统计
        this.columnsthree = [
            {
                title: '序号',
                dataIndex: 'num',
                key: 'num',
                width: '50',
                fixed: 'left',
                // 参数分别为当前行的值，当前行数据，行索引，return可以决定表格里最终存放的值
                render: (text, record, index) => {
                    return <span>{index + 1}</span>
                },
            }, {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                width: '100',
                fixed: 'left',
                render: (text, record, index) => {
                    return (
                        <div className="editable-row-operations">
                            <span>
                                <a title="活动菜品详情" alt="活动菜品详情">活动菜品详情</a>
                            </span>
                        </div>
                    );
                },
            }, {
                title: '店铺名称',
                dataIndex: 'shopName',
                key: 'shopName',
                width: '120',
                fixed: 'left',
                className: styles.EditTableTextLeft,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'shopName', text),
            }, {
                title: '账单号',
                dataIndex: 'billNo',
                key: 'billNo',
                className: styles.EditTableTextLeft,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'billNo', text),
            }, {
                title: '台位号',
                dataIndex: 'tableNo',
                key: 'tableNo',
                className: styles.EditTableTextLeft,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'tableNo', text),
            }, {
                title: '人数',
                dataIndex: 'peopleNum',
                key: 'peopleNum',
                className: styles.EditTableTextRight,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'peopleNum', text),
            }, {
                title: '活动实收',
                dataIndex: 'received',
                key: 'received',
                className: styles.EditTableTextRight,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'received', text),
            }, {
                title: '活动优免',
                dataIndex: 'free',
                key: 'free',
                className: styles.EditTableTextRight,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'free', text),
            },
            {
                title: '活动加收',
                dataIndex: 'add',
                key: 'add',
                className: styles.EditTableTextRight,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'add', text),
            }, {
                title: '活动超收',
                dataIndex: 'excess',
                key: 'excess',
                className: styles.EditTableTextRight,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'excess', text),
            }, {
                title: '活动编码',
                dataIndex: 'activeNo',
                key: 'activeNo',
                className: styles.EditTableTextLeft,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'activeNo', text),
            }, {
                title: '活动名称',
                dataIndex: 'activeName',
                key: 'activeName',
                className: styles.EditTableTextLeft,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'activeName', text),
            }, {
                title: '活动数量',
                dataIndex: 'activeNum',
                key: 'activeNum',
                className: styles.EditTableTextRight,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'activeNum', text),
            }, {
                title: '日期',
                dataIndex: 'date',
                key: 'date',
                className: styles.EditTableTextLeft,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'date', text),
            }, {
                title: '执行时间',
                dataIndex: 'doTime',
                key: 'doTime',
                className: styles.EditTableTextLeft,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'doTime', text),
            }];
        // 菜品活动明细
        this.columnsfour = [
            {
                title: '序号',
                dataIndex: 'num',
                key: 'num',
                width: '50',
                fixed: 'left',
                // 参数分别为当前行的值，当前行数据，行索引，return可以决定表格里最终存放的值
                render: (text, record, index) => {
                    return <span>{index + 1}</span>
                },
            }, {
                title: '店铺名称',
                dataIndex: 'shopName',
                key: 'shopName',
                width: '150',
                fixed: 'left',
                className: styles.EditTableTextLeft,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'shopName', text),
            }, {
                title: '菜品编码',
                dataIndex: 'dishCode',
                key: 'dishCode',
                className: styles.EditTableTextLeft,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'dishCode', text),
            }, {
                title: '菜品名称',
                dataIndex: 'dishName',
                key: 'dishName',
                className: styles.EditTableTextLeft,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'dishName', text),
            }, {
                title: '菜品部门',
                dataIndex: 'dishDepart',
                key: 'dishDepart',
                className: styles.EditTableTextLeft,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'dishDepart', text),
            }, {
                title: '单价',
                dataIndex: 'price',
                key: 'price',
                className: styles.EditTableTextRight,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'price', text),
            }, {
                title: '标准价',
                dataIndex: 'standardPrice',
                key: 'standardPrice',
                className: styles.EditTableTextRight,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'standardPrice', text),
            }, {
                title: '商品数量',
                dataIndex: 'number',
                key: 'number',
                className: styles.EditTableTextRight,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'number', text),
            },
            {
                title: '活动优免',
                dataIndex: 'free',
                key: 'free',
                className: styles.EditTableTextRight,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'free', text),
            }, {
                title: '活动加收',
                dataIndex: 'add',
                key: 'add',
                className: styles.EditTableTextRight,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'add', text),
            }, {
                title: '活动编码',
                dataIndex: 'activeNo',
                key: 'activeNo',
                className: styles.EditTableTextLeft,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'activeNo', text),
            }, {
                title: '活动名称',
                dataIndex: 'activeName',
                key: 'activeName',
                className: styles.EditTableTextLeft,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'activeName', text),
            }, {
                title: '台位号',
                dataIndex: 'tableNo',
                key: 'tableNo',
                className: styles.EditTableTextRight,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'tableNo', text),
            }, {
                title: '日期',
                dataIndex: 'date',
                key: 'date',
                className: styles.EditTableTextLeft,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'date', text),
            }, {
                title: '执行时间',
                dataIndex: 'doTime',
                key: 'doTime',
                className: styles.EditTableTextLeft,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'doTime', text),
            }];
        // 礼品管理明细
        this.columns5 = [
            {
                title: '序号',
                dataIndex: 'num',
                key: 'num',
                width: '50',
                fixed: 'left',
                // 参数分别为当前行的值，当前行数据，行索引，return可以决定表格里最终存放的值
                render: (text, record, index) => {
                    return <span>{index + 1}</span>
                },
            }, {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                width: '110',
                fixed: 'left',
                render: (text, record, index) => {
                    return (
                        <div className="editable-row-operations">
                            <span>
                                <a onClick={() => this.handleAdd()}>编辑</a>
                &nbsp;
                                <a onClick={() => this.handleAdd()}>详情</a>
                &nbsp;

                                <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDel(index)}>
                                    <a>删除</a>
                                </Popconfirm>
                &nbsp;
                                {/* <a onClick={() => this.handleAdd()}>适应店铺</a> */}
                            </span>
                        </div>
                    );
                },
            }, {
                title: '礼品类型',
                dataIndex: 'giftType',
                key: 'giftType',
                width: '110',
                fixed: 'left',
                className: styles.EditTableTextLeft,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'giftType', text),
            }, {
                title: '礼品名称',
                dataIndex: 'giftName',
                key: 'giftName',
                width: '150',
                fixed: 'left',
                className: styles.EditTableTextLeft,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'giftName', text),
            }, {
                title: '礼品金额',
                dataIndex: 'giftMoney',
                key: 'giftMoney',
                className: styles.EditTableTextRight,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'giftMoney', text),
            }, {
                title: '已发送数量',
                dataIndex: 'giftNumber',
                key: 'giftNumber',
                className: styles.EditTableTextRight,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'giftNumber', text),
            }, {
                title: '已使用数量',
                dataIndex: 'giftNumber2',
                key: 'giftNumber2',
                className: styles.EditTableTextRight,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'giftNumber2', text),
            }, {
                title: '礼品规则',
                dataIndex: 'giftRule',
                key: 'giftRule',
                width: '280',
                className: styles.EditTableTextLeft,
                render: (text, record, index) => {
                    const RuleList = [];
                    record.giftRule.map((item) => {
                        RuleList.push(<div className={styles.EidtTableRule}>{item.Rule}</div>)
                    });
                    return RuleList;
                },
            }, {
                title: '礼品描述',
                dataIndex: 'giftDescribe',
                key: 'giftDescribe',
                className: styles.EditTableTextLeft,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'giftDescribe', text),
            }, {
                title: '创建人/修改人',
                dataIndex: 'giftCreatePerson',
                key: 'giftCreatePerson',
                className: styles.EditTableTextLeft,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'giftCreatePerson', text),
            }, {
                title: '创建时间/修改时间',
                dataIndex: 'giftCreateTime',
                key: 'giftCreateTime',
                className: styles.EditTableTextLeft,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'giftCreateTime', text),
            }];
        // 活动统计分析
        this.columns6 = [
            {
                title: '序号',
                width: '50',
                fixed: 'left',
                // 参数分别为当前行的值，当前行数据，行索引，return可以决定表格里最终存放的值
            }, {
                title: '活动类型',
                width: '150',
                fixed: 'left',
            }, {
                title: '活动名称',
                width: '150',
                fixed: 'left',
            }, {
                title: '2016-11-12',
                children: [
                    {
                        title: '标题1',
                    }, {
                        title: '标题2',
                    }, {
                        title: '标题3',
                    }, {
                        title: '标题4',
                    },
                ],
            }, {
                title: '2016-11-12',
                children: [
                    {
                        title: '标题1',
                    }, {
                        title: '标题2',
                    }, {
                        title: '标题3',
                    }, {
                        title: '标题4',
                    },
                ],
            }, {
                title: '2016-11-12',
                children: [
                    {
                        title: '标题1',
                    }, {
                        title: '标题2',
                    }, {
                        title: '标题3',
                    }, {
                        title: '标题4',
                    },
                ],
            }, {
                title: '2016-11-12',
                children: [
                    {
                        title: '标题1',
                    }, {
                        title: '标题2',
                    }, {
                        title: '标题3',
                    }, {
                        title: '标题4',
                    },
                ],
            }, {
                title: '合计',
                children: [
                    {
                        title: '标题1',
                    }, {
                        title: '标题2',
                    }, {
                        title: '标题3',
                    },
                ],
            }];
        // 我的加工品
        this.columns7 = [
            {
                title: '序号',
                dataIndex: 'num',
                key: 'num',
                width: '50',
                fixed: 'left',
                className: styles.EditTableTextCenter,
                // 参数分别为当前行的值，当前行数据，行索引，return可以决定表格里最终存放的值
                render: (text, record, index) => {
                    return <span>{index + 1}</span>
                },
            }, {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                width: '80',
                fixed: 'left',
                render: (text, record, index) => {
                    return (
                        <div className="editable-row-operations">
                            <span>
                                <a onClick={() => this.handleAdd()}>编辑</a>
                &nbsp;
                                <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDel(index)}>
                                    <a>删除</a>
                                </Popconfirm>
                &nbsp;
                                {/* <a onClick={() => this.handleAdd()}>适应店铺</a> */}
                            </span>
                        </div>
                    );
                },
            }, {
                title: '品项编码',
                dataIndex: 'pxCode',
                key: 'pxCode',
                width: '100',
                fixed: 'left',
                className: styles.EditTableTextRight,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'pxCode', text),
            }, {
                title: '品项名称',
                dataIndex: 'pxName',
                key: 'pxName',
                width: '150',
                fixed: 'left',
                className: styles.EditTableTextLeft,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'pxName', text),
            }, {
                title: '助记码',
                dataIndex: 'helpCode',
                key: 'helpCode',
                width: '150',
                className: [styles.EditTableTextLeft, styles.EditTableZjm].join(' '),
                render: (text, record, index) => {
                    const helpCodelist = [];
                    record.helpCode.map((item) => {
                        helpCodelist.push(<span className={styles.EidtTableZjm}>{item.Rule},</span>)
                    });
                    return helpCodelist;
                },
            }, {
                title: '品项规格',
                dataIndex: 'pxSpeci',
                key: 'pxSpeci',
                width: '80',
                className: styles.EditTableTextLeft,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'pxSpeci', text),
            }, {
                title: '标准单位',
                dataIndex: 'standardUnit',
                key: 'standardUnit',
                width: '80',
                className: styles.EditTableTextLeft,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'standardUnit', text),
            }, {
                title: '品项类别',
                dataIndex: 'pxCategory',
                key: 'pxCategory',
                width: '100',
                className: styles.EditTableTextLeft,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'pxCategory', text),
            }, {
                title: '成本单位',
                dataIndex: 'costUnit',
                key: 'costUnit',
                width: '80',
                className: styles.EditTableTextLeft,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'costUnit', text),
            }, {
                title: '换算率(标准对成本)',
                dataIndex: 'conversionRate',
                key: 'conversionRate',
                width: '130',
                className: styles.EditTableTextRight,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'conversionRate', text),
            }, {
                title: '加工间',
                dataIndex: 'processingJian',
                key: 'processingJian',
                width: '120',
                className: styles.EditTableTextLeft,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'processingJian', text),
            }, {
                title: '默认加工间',
                dataIndex: 'defProcessingJian',
                key: 'defProcessingJian',
                className: styles.EditTableTextLeft,
                render: (text, record, index) => this.renderColumns(this.state.data, index, 'defProcessingJian', text),
            }];

        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
    }
    componentWillMount() {
        this.setState({ data: this.props.data });
        this.columns = this.getColumns();
    }
    // 根据colName来获取相应的表格格式
    getColumns() {
        const colName = this.props.colName;
        switch (colName) {
            case 1:
                return this.columnsone;
                break;
            case 2:
                return this.columnstwo;
                break;
            case 3:
                return this.columnsthree;
                break;
            case 4:
                return this.columnsfour;
                break;
            case 5:
                return this.columns5;
                break;
            case 6:
                return this.columns6;
                break;
            case 7:
                return this.columns7;
                break;
        }
    }

    renderColumns(data, index, key, text) {
        const { editable, status } = data[index][key];
        if (typeof editable === 'undefined') {
            return text;
        }
        // 用回调函数获取EditableCell里边的value
        return (<EditableCell
            editable={editable}
            value={text}
            index={index}
            key={key}
            onChanges={(arg) => {
                data[index].editprice.value = arg;
                data[index].salepercent.value = parseInt(arg / data[index].originalprice.value * 100);
            }}
            onChange={value => this.handleChanges(index, key, value)}
            status={status}
        />);
    }

    // 编辑
    edit(index, record) {
        const { data } = this.state;
        Object.keys(data[index]).forEach((item) => {
            if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
                data[index][item].editable = true;
            }
        });
        this.setState({ data });
    }
    // 编辑结束,计算打折比例
    editDone(index) {
        const data = this.state.data;
        Object.keys(data[index]).forEach((item) => {
            if (data[index][item] && typeof data[index][item].editable !== 'undefined') {
                data[index][item].editable = false;
            }
        });
        this.setState({ data });
    }

    handleAdd() {
        this.setState({
            visible: true,
        });
    }

    handleOk() {
        this.setState({
            visible: false,
        });
    }
    handleCancel() {
        this.setState({
            visible: false,
        });
    }
    // 删除一行数据
    handleDel(index) {
        const DelDataSource = this.state.data;
        DelDataSource.splice(index, 1);
        this.setState({
            data: DelDataSource,
        });
    }

  // 交换数组元素
  swapItems = (arr, index1, index2) => {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr;
  };

  // 上移
  upRecord =(arr, index) => {
      if (index == 0) {
          return;
      }
      this.swapItems(arr, index, index - 1);
      this.setState({
          data: arr,
      });
      // console.log("up");
  };

  // 下移
  downRecord =(arr, index) => {
      if (index == arr.length - 1) {
          return;
      }
      this.swapItems(arr, index, index + 1);
      this.setState({
          data: arr,
      });
      // console.log("down");
  };
  // 置顶
  toTop = (arr, index) => {
      // console.log("upTop");
      arr.unshift(arr[index]);
      arr.splice(index + 1, 1);
      this.setState({
          data: arr,
      });
  }
  // 置底
  toBottom = (arr, index) => {
      // console.log("downBottom");
      arr.push(arr[index]);
      arr.splice(index, 1);
      this.setState({
          data: arr,
      });
  }

  render() {
      const { data } = this.state;
      const dataSource = data.map((item) => {
          const obj = {};
          Object.keys(item).forEach((key) => {
              obj[key] = key === 'key' ? item[key] : item[key].value;
          });
          return obj;
      });
      const rowSelection = {};
      return (
          <div className={styles.EditTableMain}>

              <Table
                  size="small"
                  bordered={true}
                  className={styles.EditTable}
                  dataSource={dataSource}
                  scroll={this.props.scroll}
                  columns={this.columns}
                  pagination={this.props.pagination}
                  rowSelection={this.props.rowSelection}
              />
              <Modal
                  title={this.props.ModalTitle}
                  visible={this.state.visible}
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
                  okText="OK"
                  cancelText="Cancel"
              >
                  {this.props.children}
              </Modal>
          </div>);
  }
}
