import React, { Component } from 'react';
import { Button, Icon, Menu, Dropdown } from 'antd';
import classnames from 'classnames';
import styles from '../style.less'
import operationImg from '../assets/operation.png'

class GroupTree extends Component {

  state = {
    isExpand: true,
    total: 0
  }

  componentWillReceiveProps(nextProps) {
    const { groupData = [] } = nextProps
    if(this.props.groupData != groupData) {
      let total = 0
      if(groupData.length) {
          groupData.map(item => {
            total += Number(item.count)
          })
      }
      this.setState({
        total,
      })
    }
  }

  changeExpand = (e) => {
    e.stopPropagation()
    this.setState({
      isExpand: !this.state.isExpand,
    })
  }

  render() {
    const { groupData = [], addGroup, editGroup, delGroup, currentGroup, changeGroup, clickTotal } = this.props
    const { isExpand, total } = this.state

    return (
      <div className={styles.groupWrapper}>
        <div className={classnames(styles.addButton, { [styles.active]: currentGroup === '' })}>
          <div className={styles.totalItem}>
            <Icon type={isExpand ? "caret-down" : "caret-right"} className={styles.totalIcon} onClick={this.changeExpand} />
            <span onClick={clickTotal} className={styles.totalText} style={currentGroup === '' ? { color: '#fff' } : { color: '#333' }}>全部分组({total})</span>
          </div>
          <Icon type='plus' onClick={() => addGroup('group', false, {})} style={{ fontSize: 15, color: '#333' }} />
        </div>
        {isExpand && <div className={styles.groupList}>
          {
            groupData.length ? groupData.map((item, index) => (
              <div
                className={classnames(styles.groupItem, { [styles.active]: item.itemID === currentGroup })}
                onClick={() => changeGroup(item, index)}
                key={item.itemID}
              >
                <span>{`${item.channelGroupName}(${item.count})`}</span>
                <Dropdown overlay={<Menu>
                  <Menu.Item key="0">
                    <a onClick={() => editGroup('group', true, item)}>编辑分组</a>
                  </Menu.Item>
                  <Menu.Item key="1">
                    <a onClick={() => delGroup(item)}>删除分组</a>
                  </Menu.Item>
                </Menu>} trigger={['hover']}>
                  <img src={operationImg} style={{ width: 16, height: 16 }} />
                </Dropdown>
              </div>
            )) : null
          }
        </div>}
      </div>
    )
  }
}

export default GroupTree