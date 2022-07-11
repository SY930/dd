import React, { Component } from 'react';
import { Button, Icon, Menu, Dropdown } from 'antd';
import classnames from 'classnames';
import styles from '../style.less'
import operationImg from '../assets/operation.png'

class GroupTree extends Component {

  state = {
    currentGroup: undefined,
    isExpand: true,
  }

  delChannel = () => { }

  changeGroup = (item, index) => {
    const { selectGroup } = this.props
    this.setState({
      currentGroup: index
    })
    selectGroup(item.itemID)
  }

  changeExpand = (e) => {
    e.stopPropagation()
    this.setState({
      isExpand: !this.state.isExpand,
    })
  }

  clickTotal = () => {
    const { selectGroup } = this.props
    this.setState({
      currentGroup: '',
    })
    selectGroup('')
  }

  render() {
    const { groupData, addGroup, editGroup, delGroup } = this.props
    const { currentGroup, isExpand } = this.state

    return (
      <div className={styles.groupWrapper}>
        <div className={classnames(styles.addButton, { [styles.active]: currentGroup === '' })}>
          <div className={styles.totalItem}>
            <Icon type={isExpand ? "caret-down" : "caret-right"} className={styles.totalIcon} onClick={this.changeExpand} />
            <span onClick={this.clickTotal} className={styles.totalText} style={currentGroup === '' ? { color: '#fff' } : { color: '#333' }}>全部分组(4)</span>
          </div>
          <Icon type='plus' onClick={() => addGroup('group', false, {})} style={{ fontSize: 15, color: '#333' }} />
        </div>
        {isExpand && <div className={styles.groupList}>
          {
            groupData.map((item, index) => (
              <div
                className={classnames(styles.groupItem, { [styles.active]: index === currentGroup })}
                onClick={() => this.changeGroup(item, index)}
                key={item.itemID}
              >
                <span>{item.channelGroupName}</span>
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
            ))
          }
        </div>}
      </div>
    )
  }
}

export default GroupTree