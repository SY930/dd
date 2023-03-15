import { Switch, Tooltip } from 'antd';
import moment from 'moment';
import { BASIC_LOOK_PROMOTION_QUERY,
  BASIC_PROMOTION_DELETE, BASIC_PROMOTION_UPDATE } from '../../../constants/authorityCodes';
import { BASIC_PROMOTION_MANAGE_PAGE } from '../../../constants/entryIds';
import Authority from '../../../components/common/Authority';
import { isBrandOfHuaTianGroupList, isGroupOfHuaTianGroupList, isHuaTian, isMine } from '../../../constants/projectHuatianConf';
import { isZhouheiya, isGeneral, businessTypesList } from '../../../constants/WhiteList';
import styles from '../ActivityPage.less';

// 活动列表字段针对魏家重新排序
export const getWJLPCoulums = (_this, state) => {
  return (
    [
      {
        title: '序号',
        dataIndex: 'index',
        className: 'TableTxtCenter',
        width: 50,
        key: 'key',
        fixed: 'left',
        render: (text, record, index) => {
          return (_this.state.pageNo - 1) * _this.state.pageSizes + text;
        },
      },
      {
        title: '操作',
        key: 'operation',
        className: 'TableTxtCenter',
        width: 180,
        fixed: 'left',
        render: (text, record, index) => {
          const isGroupPro = record.maintenanceLevel == '0'; // 区分集团和店铺
          //禁用的消费返礼品、消费返积分不展示删除
          const isHidden = _this.state.isConsumeReturnWhiteList ? false : (record.promotionType == '3010' || record.promotionType == '3020') && (record.isActive == '0' || record.status == 3)
          return (
            <span>
              <Authority rightCode={BASIC_LOOK_PROMOTION_QUERY} entryId={BASIC_PROMOTION_MANAGE_PAGE}>
                <a
                  href="#"
                  onClick={() => {
                    _this.props.toggleIsUpdate(false);
                    _this.handleUpdateOpe(text, record, index);
                  }}
                >
                  查看
                </a>
              </Authority>
              {isHuaTian() || isHidden ? null : (
                <Authority rightCode={BASIC_PROMOTION_UPDATE} entryId={BASIC_PROMOTION_MANAGE_PAGE}>
                  <a
                    href="#"
                    disabled={isZhouheiya(_this.props.user.accountInfo.groupID) ? _this.editIsDisabled(record) : false}
                    // disabled={!isGroupPro}
                    onClick={async () => {
                      if (isZhouheiya(_this.props.user.accountInfo.groupID)) {
                        const isPass = await _this.permissionVerify(record);
                        if (!isPass) {
                          return;
                        }
                      }
                      _this.handleEditActive(record)(() => {
                        _this.props.toggleIsUpdate(true);
                        if (!isGeneral(_this.props.user.accountInfo.roleType) && (record.auditStatus == 2 || record.auditStatus == 4) && isZhouheiya(_this.props.user.accountInfo.groupID)) {
                          _this.setState({ onlyModifyShop: true });
                          _this.props.saleCenterSetPromotionDetailOnlyModifyShop(true);
                        }
                        _this.handleUpdateOpe(text, record, index);
                      });
                    }}
                  >
                    编辑
                  </a>
                </Authority>
              )}
              <Authority rightCode={BASIC_PROMOTION_DELETE} entryId={BASIC_PROMOTION_MANAGE_PAGE}>
                {/* 非禁用状态不能删除 */}
                <a
                  href="#"
                  disabled={!isMine(record)}
                  onClick={async () => {
                    if (!isMine(record)) {
                      return
                    }
                    if (isZhouheiya(_this.props.user.accountInfo.groupID)) {
                      const isPass = await _this.permissionVerify(record);
                      if (!isPass) {
                        return;
                      }
                    }

                    _this.handleDelActive(record)(() => _this.confirmDelete(record));
                  }}
                >
                  删除
                </a>
              </Authority>
              {/* 华天集团促销活动不可编辑 */}
              {
                record.promotionType === '1050' ? (
                  <a
                    href="#"
                    disabled={isHuaTian()}
                    onClick={async () => {
                      if (isZhouheiya(_this.props.user.accountInfo.groupID)) {
                        const isPass = await _this.permissionVerify(record);
                        if (!isPass) {
                          return;
                        }
                      }
                      _this.props.toggleIsUpdate(true)
                      _this.setState({
                        isCopy: true,
                        modalTitle: '复制活动信息',
                      })
                      _this.handleUpdateOpe(text, record, index);
                    }}
                  >复制</a>
                ) : (
                  <a
                    href="#"
                    disabled={!isGroupPro || isHuaTian()}
                    onClick={async () => {
                      if (isZhouheiya(_this.props.user.accountInfo.groupID)) {
                        const isPass = await _this.permissionVerify(record);
                        if (!isPass) {
                          return;
                        }
                      }
                      _this.props.toggleIsUpdate(true)
                      _this.setState({
                        isCopy: true,
                        modalTitle: '复制活动信息',
                      })
                      _this.handleUpdateOpe(text, record, index);
                    }}
                  >复制</a>
                )}
            </span>
          );
        },
      },
      {
        title: '启用/禁用',
        key: 'status',
        dataIndex: 'status',
        width: 90,
        className: 'TableTxtCenter',
        fixed: 'left',
        render: (text, record, index) => {
          const defaultChecked = record.isActive == '1'; // 开启 / 禁用
          const isGroupPro = record.maintenanceLevel == '0';
          const isToggleActiveDisabled = (() => {
            if (!isGroupOfHuaTianGroupList()) {
              // 门店创建
              return false;
            }
            if (isHuaTian()) {
              return record.userType == 2 || record.userType == 0;
            }
            if (isBrandOfHuaTianGroupList()) {
              return record.userType == 1 || record.userType == 3 || !isGroupPro;
            }
          })();
          //禁用的消费返礼品、消费返积分不展示删除
          const isHidden = _this.state.isConsumeReturnWhiteList ? false : (record.promotionType == '3010' || record.promotionType == '3020') && (record.isActive == '0' || record.status == 3)
          if(isHidden) {
            return null
         }
          return (
            <Switch
              // size="small"
              className={styles.switcherSale}
              checkedChildren={'启用'}
              unCheckedChildren={'禁用'}
              checked={defaultChecked}
              onChange={() => {
                _this.handleSattusActive(record)(isAudit => _this.handleDisableClickEvent(record.operation, record, index, null, isAudit === 'audit' ? '已成功发起审批，审批通过后自动启用' : '使用状态修改成功'))
              }}
              disabled={isToggleActiveDisabled}
            />
          );
        },
      },
      {
        title: '活动类型',
        dataIndex: 'promotionType',
        key: 'promotionType',
        fixed: 'left',
        width: 120,
        render: (promotionType) => {
          const promotion = _this.getAllPromotionTypes().filter((promotion) => {
            return promotion.key === promotionType;
          });
          return promotion.length ? promotion[0].title : '--';
        },
      },

      {
        title: '活动名称',
        dataIndex: 'promotionName',
        key: 'promotionName',
        fixed: 'left',
        width: 200,
        render: (promotionName) => {
          let text = promotionName;
          if (promotionName === undefined || promotionName === null || promotionName === '') {
            text = '--';
          }
          return <span title={text}>{text}</span>;
        },
      },
      {
        title: '有效时间',
        // className: 'TableTxtCenter',
        dataIndex: 'validDate',
        key: '',
        width: 180,
        render: (validDate) => {
          if (validDate.start === 20000101 || validDate.end === 29991231) {
            return '不限制';
          }
          const text = `${moment(String(validDate.start)).format('YYYY.MM.DD')} / ${moment(String(validDate.end)).format('YYYY.MM.DD')}`;
          return text;
        },
      },
      {
        title: '活动状态',
        className: 'TableTxtCenter',
        dataIndex: 'status',
        key: 'valid',
        width: 72,
        render: (status) => {
          return status == '1' ? <span className={styles.unBegin}>未开始</span> : status == '2' ? <span className={styles.begin}>执行中</span> : status == '3' ? <span className={styles.end}>已结束</span> : <span className={styles.end}>已禁用</span>;
        },
      },
      {
        title: '适用店铺',
        className: 'TableTxtCenter',
        dataIndex: 'shopIDLst',
        key: 'shopIDLst',
        width: 160,
        render: (text) => {
          const t = text
          return <Tooltip title={text}><p className={styles.multilineTexts}>{t}</p></Tooltip>
        },
      },
      {
        title: '备注',
        className: 'TableTxtCenter',
        dataIndex: 'description',
        key: 'description',
        width: 160,
        render: (text) => {
          const t = text
          return <Tooltip title={text}><p className={styles.multilineTexts}>{t}</p></Tooltip>
        },
      },
      {
        title: '适用商品',
        className: 'TableTxtCenter',
        dataIndex: 'applyGoodsName',
        key: 'applyGoodsName',
        width: 160,
        render: (text) => {
          const t = text
          return <Tooltip title={text}><p className={styles.multilineTexts}>{t}</p></Tooltip>
        },
      },
      {
        title: '活动编码',
        dataIndex: 'promotionCode',
        key: 'promotionCode',
        width: 140,
        render: text => <span title={text}>{text}</span>
      },
      {
        title: '创建来源',
        className: 'TableTxtCenter',
        dataIndex: 'maintenanceLevel',
        key: 'maintenanceLevel',
        // width: 80,
        render: (t) => {
          return t == '0' ? '集团创建' : '门店创建';
        },
      },
      {
        title: "业态",
        className: "TableTxtCenter",
        dataIndex: "promotionVersion",
        key: "promotionVersion",
        width: 80,
        render: t => {
            return t == "1.0" ? "餐饮" : t == '2.0' ? '零售' : '';
        }
      },
      {
        title: 'BPM单号',
        className: 'TableTxtCenter',
        dataIndex: 'auditNo',
        key: 'auditNo',
        width: 120,
        render: text => <Tooltip title={text}>{text}</Tooltip>,
      },
      {
        title: '审批状态',
        className: 'TableTxtCenter',
        dataIndex: 'auditStatus',
        key: 'auditStatus',
        width: 72,
        // ellipsis: true,
        render: (text, record) => {
          const items = _this.cfg.auditStatus.find(item => item.value == record.auditStatus);
          return <span>{items ? items.label : '--'}</span>
        },
      },
      {
        title: '创建人/修改人',
        dataIndex: '',
        key: 'createBy',
        width: 140,
        render: (text, record, index) => {
          if (record.createBy === '' && record.modifiedBy === '') {
            return '--';
          }
          return `${record.createBy}/${record.modifiedBy || record.createBy}`;
        },
      },

      {
        title: '创建时间/修改时间',
        dataIndex: '',
        className: 'TableTxtCenter',
        key: 'createTime',
        width: 300,
        render: (text, record, index) => {
          if (record.createTime == '0' && record.actionTime == '0') {
            return '--';
          }
          const t = `${moment(new Date(parseInt(record.createTime))).format('YYYY-MM-DD HH:mm:ss')} / ${moment(new Date(parseInt(record.actionTime))).format('YYYY-MM-DD HH:mm:ss')}`;
          return <Tooltip title={t}>{t}</Tooltip>;
        },
      },
    ]
  )
}
