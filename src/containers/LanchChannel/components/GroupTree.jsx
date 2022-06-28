import React, { Component } from 'react';
import { Button, Icon } from 'antd';
import styles from '../style.less'

class GroupTree extends Component {

  state = {

  }

  delChannel = () => { }

  render() {
    const { groupData, addGroup, editGroup, delGroup } = this.props

    return (
      <div className={styles.groupWrapper}>
        <div className={styles.addButton}>
          <Button icon='plus' onClick={addGroup}>添加分组</Button>
        </div>
        <div className={styles.groupList}>
          {
            groupData.map((item) => (
              <div className={styles.groupItem}>
                <span>{item.groupName}</span>
                <span className={styles.groupOperation}>
                  <Icon type='edit' onClick={editGroup} />
                  <Icon type='delete' style={{ marginLeft: 6 }} onClick={delGroup} />
                </span>
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}

export default GroupTree