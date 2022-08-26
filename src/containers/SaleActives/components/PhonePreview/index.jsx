/*
 * @Author: Songnana
 * @Date: 2022-08-23 14:39:15
 * @Modified By: modifier Songnana
 * @Descripttion: 
 */

import React, { Component } from 'react'
import { Icon } from 'antd';
import style from './styles.less';

const typeMap = {
    1: '弹窗海报',
    2: 'banner广告',
}

export class PhonePreview extends Component {
  static propTypes = {}

  render() {
      const { type = '1' } = this.props;
      return (
          <div className={style.previewAreaNew}>
              <div>
                  <div className={style.platformArea}>
                      <div className={style.platformBox}>
                          {
                              [{ name: '弹窗海报', value: '1' }, { name: 'banner广告', value: '2' }].map((item, index) => (
                                  <div className={`${style.platformItem} ${item.value === type ? style.selectedItem : ''}`}><span>{item.name}</span></div>
                              ))
                          }
                      </div>
                  </div>
                  <div className={style.bannerImg}>
                      <img src="http://res.hualala.com/basicdoc/3e3d526c-00a7-410f-b9b3-d8017051841d.png" alt="" />
                      <div className={style.simpleDisplayBlock}>
                          <div className={style.imgWrapper} style={{ height: '100%' }}>
                              <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                                  <img src="http://res.hualala.com/basicdoc/884351d8-1788-4c2d-b0fd-949936d92369.png" style={{ width: '100%', height: '100%' }} alt="" />
                              </div>
                          </div>

                          <Icon className={style.closeBtn} type="close-circle-o" />
                      </div>
                  </div>
              </div>
          </div>
      )
  }
}

export default PhonePreview
