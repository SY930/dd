import React from 'react';
import { Icon, Button, Row, Col } from 'antd';
import FiltersForm from './components/FiltersForm'
import ChannelModal from './components/ChannelModal'
import List from './components/List'
import GroupTree from './components/GroupTree'
import styles from './style.less'

class LanchChannel extends React.Component {

  state = {
    modalVisible: false,
    modalType: 'group',//分组或渠道
    idEdit: false,//添加或编辑
    currentData: {},//编辑的数据
    selectedRowKeys: [],//选中的行
    total: 0,
    list: [],
    loading: false,
    groupData: [{ groupName: '渠道1' }, { groupName: '渠道2' }],
  }

  batchDelete = () => { }

  onSearch = () => { }

  addChannel = () => {
    this.setState({
      modalVisible: true,
      modalType: 'channel',
      idEdit: false,
      currentData: {},
    })
  }

  editChannel = () => { }

  onCancel = () => {
    this.setState({
      modalVisible: false,
      modalType: 'group',
      idEdit: false,
      currentData: {},
    })
  }

  changeRowKeys = (keys, rows) => {
    this.setState({
      selectedRowKeys: keys,
    })
  }

  addGroup = () => {
    this.setState({
      modalVisible: true,
      modalType: 'group',
      idEdit: false,
      currentData: {},
    })
  }

  editGroup = () => { }

  delGroup = () => { }

  render() {
    const { modalVisible, modalType, idEdit, loading, list, selectedRowKeys, total, groupData } = this.state

    return (
      <div className="layoutsContainer">
        <div className={styles.header}>
          <div className={styles.titleArea}>
            <span className={styles.title}>
              活动投放渠道管理
            </span>
          </div>
          <div>
            <Button onClick={this.addChannel} type="ghost"><Icon type="plus" />添加渠道</Button>
            <Button type="ghost" onClick={this.batchDelete} style={{ marginLeft: 20 }}>批量删除</Button>
          </div>
        </div>
        <div style={{ padding: '0 20px' }} className={styles.headerActions}>
          <FiltersForm onSearch={this.onSearch} />
        </div>
        <div className={styles.divideLine} />
        <Row style={{ padding: 20, display: 'flex' }}>
          <Col>
            <GroupTree
              groupData={groupData}
              addGroup={this.addGroup}
              editGroup={this.editGroup}
              delGroup={this.delGroup}
            />
          </Col>
          <Col style={{ flex: 1 }}>
            <List
              editChannel={this.editChannel}
              loading={loading}
              list={list}
              selectedRowKeys={selectedRowKeys}
              changeRowKeys={this.changeRowKeys}
              total={total}
            />
          </Col>
        </Row>
        {
          modalVisible && (
            <ChannelModal
              modalVisible={modalVisible}
              modalType={modalType}
              idEdit={idEdit}
              onCancel={this.onCancel}
            ></ChannelModal>
          )
        }
      </div>
    )
  }
}

export default LanchChannel