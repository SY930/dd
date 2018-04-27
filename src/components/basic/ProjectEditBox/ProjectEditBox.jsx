/**
 * @Author: chenshuang
 * @Date:   2017-03-20T10:14:38+08:00
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-05T17:14:16+08:00
 */


/*
 *组件名称：ProjectEditBox (项目编辑框)
 * 功能：
 * 陈双   2016/12/6
 */
import React from 'react';
import { Icon, Modal, Tag, Row, Col, message } from 'antd';
import { fromJS, is, List } from 'immutable';
import _ from 'lodash'

import TreeSelect from '../../common/TreeSelect/treeSelect';
import DeepTreeSelect from '../../common/TreeSelect/deepTreeSelect'; // 树选择
import AsynTreeSelect from '../../common/TreeSelect/asynTreeSelect'; // 树选择
import styles from './ProjectEditBox.less';
import { Iconlist } from '../IconsFont/IconsFont';
import { toJSON, genAction, genFetchOptions, fetchData } from '../../../helpers/util';

if (process.env.__CLIENT__ === true) {
    // require('../../../../client/components.less')
}

export default class ProjectEditBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            tree: [],
            shops: [],
            arg: this.props.treeProps ? this.props.treeProps.showItems : [],
        }
    }
    // add by YQZ
    componentWillReceiveProps(nextProps) {
        let $$showItems = List([])
        if (this.props.treeProps && this.props.treeProps.showItems) {
            $$showItems = fromJS(this.props.treeProps.showItems)
        }

        let $$nextShowItems = List([])
        if (nextProps.treeProps && nextProps.treeProps.showItems) {
            $$nextShowItems = fromJS(nextProps.treeProps.showItems)
        }

        if (!is($$showItems, $$nextShowItems)) {
            this.setState({
                tree: $$nextShowItems.toJS(),
            })
        }

        this.setState({
            data: nextProps.data,
        });
    }
    componentWillMount() {
        this.setState({
            data: this.props.data || [],
            tagNames: [],
        });
    // this.props.callback && this.props.callback(this.props.data);
    }
  showModal=() => {
      const treeProps = this.props.treeProps
      || this.props.asynTreeProps
      || this.props.deepTreeProps;
      if (treeProps.treeData) {
          if (treeProps.treeData.length > 0) {
              this.setState({
                  visible: true,
              }, () => {
                  this.state.tagNames = [];
              });
          } else {
              message.error(`暂无可选${treeProps.level2Title}`);
          }
      } else {
          this.setState({
              visible: true,
          }, () => {
              this.state.tagNames = [];
          });
      }
  }

  handleOk=() => {
      const arg = this.state.arg;
      this.setState({
          visible: false,
          data: arg,
      })
      this.props.callback && this.props.callback(this.state.tree);
      this.props.onChange && this.props.onChange(this.state.tree);
  }
  handleCancel=() => {
      this.setState({
          visible: false,
      });
  }
  handleClose = (tag) => {
      // let tagNames = this.state.tagNames;
      // let tree = this.state.tree;
      // let data = this.state.data;
      const contentName = tag.content
          ? tag.content
          : this.props.asynTreeProps
              ? tag[this.props.asynTreeProps.itemName]
              : tag[this.props.deepTreeProps.titleField]
      ;
      const tagNames = this.state.tagNames.concat(tag);
      const tree = this.state.tree.filter((item) => {
          return item.content != contentName;
      });
      // 改变传给上级的值
      // tagNames.push(tag);
      // tree.map((item,index)=>{
      //   if(contentName==item.content){
      //     data.splice(index,1);
      //     tree.splice(index,1);
      //   }
      // });


      this.setState({
          tagNames,
          tree,
          data: tree,
      }, function () {
          this.props.callback && this.props.callback(this.state.tree);
          this.props.onChange && this.props.onChange(this.state.tree);
      })
  };

  forInArgs=(arg) => {
      const treeArg = [];
      if (this.props.asynTreeProps) {
          arg.map((item) => {
              treeArg.push(item[this.props.asynTreeProps.itemName]);
          })
      } else {
          arg.map((item) => {
              treeArg.push(item[this.props.deepTreeProps.titleField]);
          })
      }
      this.setState({ tree: treeArg });
  }
  render() {
      const data = this.state.data;
      const tree = this.state.tree;
      const style = this.props.title ? null : {
          'marginLeft': '100px',
      };
      const showStyle = (
          <div className={styles.proAll}>

              <div className={styles.proRight}>
                  <div className={styles.proRmain}>
                      {data && data.length != 0 ? (
                          <Row className={styles.proXz} >
                              {data.map((tag, i) =>

                                  (<div key={`ProjectEditBox${i}`} className={styles.projectTag}>
                                      {
                                          this.props.deepTreeProps ? (
                                              <Tag key={tag[this.props.deepTreeProps.keyField]} closable={true} afterClose={() => this.handleClose(tag)} className={styles.projectTags} >
                                                  {tag[this.props.deepTreeProps.titleField]}
                                              </Tag>
                                          ) : (
                                              this.props.asynTreeProps ? (
                                                  <Tag key={tag[this.props.asynTreeProps.itemID]} closable={true} afterClose={() => this.handleClose(tag)} className={styles.projectTags} >
                                                      {tag[this.props.asynTreeProps.itemName]}
                                                  </Tag>
                                              ) :
                                                  <Tag key={tag.id} closable={true} afterClose={() => this.handleClose(tag)} className={styles.projectTags} >
                                                      {tag.content}
                                                  </Tag>
                                          )

                                      }

                                  </div>)
                              )}
                          </Row>
                      ) : (
                          <div onClick={this.showModal} className={styles.proRBtn1}>
                              <Iconlist iconName={'plus'} className="plusSmall" />
                              <br />
                              <span className="colors">点击添加{this.props.label || this.props.title}</span>
                              {this.props.tips ? <p className={styles.helpTips}>{this.props.tips}</p> : null}
                          </div>
                      )
                      }

                  </div>
                  <div className={styles.projectIco}>
                      {data && data.length != 0 ? (<Iconlist iconName={'plus'} className="plusBig" onClick={this.showModal} />) : null}
                      <Modal maskClosable={false} title={`选择${this.props.label || this.props.title}`} visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel} width="600px">
                          <div style={{ width: '100%' }}>
                              {
                                  this.props.deepTreeProps ? (
                                      <DeepTreeSelect
                                          {...this.props.deepTreeProps}
                                          tagNames={this.state.tagNames}
                                          callback={(arg) => {
                                              this.setState({ arg, tree: arg });
                                          }
                                          }
                                      />
                                  ) : (
                                      this.props.asynTreeProps ? (
                                          <AsynTreeSelect
                                              {...this.props.asynTreeProps}
                                              tagNames={this.state.tagNames}
                                              callback={(arg) => {
                                                  this.setState({ arg, tree: arg });
                                              }
                                              }
                                          />
                                      ) : (this.state.visible ?
                                          <TreeSelect
                                              {...this.props.treeProps}
                                              tagNames={this.state.tagNames}
                                              callback={(arg) => {
                                                  // console.log('树参数',arg)
                                                  this.setState({
                                                      arg,
                                                      tree: arg,
                                                  }, ()=>console.log('gift:', arg));
                                                  // this.forInArg(arg);
                                              }
                                              }
                                          /> :
                                          null
                                      )
                                  )
                              }
                          </div>
                      </Modal>
                  </div>
              </div>
          </div>

      )


      return showStyle;
  }
}
/*
 *  <TreeSelect {...this.treeSelectProps}
 tagNames={this.state.tagNames}
 callback={(arg)=>{
 this.setState({arg:arg});
 this.forInArg(arg);
 }
 }
 /> */
