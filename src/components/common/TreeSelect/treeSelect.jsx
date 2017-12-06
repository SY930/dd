/**
* @Author: Xiao Feng Wang  <xf>
* @Date:   2017-02-17T16:34:11+08:00
* @Email:  wangxiaofeng@hualala.com
* @Filename: treeSelect.jsx
* @Last modified by:   xf
* @Last modified time: 2017-03-28T19:53:24+08:00
* @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
*/


/*
 *组件名称：TreeSelect (树选择)
 * 功能：树状多选
 * 张亚男   2016/12/09
 */
import React, { Component } from 'react'
import { Input, Icon, Button, Tree, Row, Col, Checkbox, message } from 'antd';

const Search = Input.Search;
const CheckboxGroup = Checkbox.Group;

import styles from './treeSelect.less';
import { Iconlist } from '../../basic/IconsFont/IconsFont';

import CC2PY from '../CC2PY';


/*
 搜索框组件
 */
const TreeNode = Tree.TreeNode;
/*
 const x = 3;
 const y = 2;
 const z = 1;
 const gData = [];
 const generateData = (_level, _preKey, _tns) => {
 const preKey = _preKey || '0';
 const tns = _tns || gData;

 const children = [];
 for (let i = 0; i < x; i++) {
 const key = `${preKey}-${i}`;
 tns.push({ title: key, key });
 if (i < y) {
 children.push(key);
 }
 }
 if (_level < 0) {
 return tns;
 }
 const level = _level - 1;
 children.forEach((key, index) => {
 tns[index].children = [];
 return generateData(level, key, tns[index].children);
 });
 };

 generateData(z);

 const dataList = [];
 const generateList = (data) => {
 for (let i = 0; i < data.length; i++) {
 const node = data[i];
 const key = node.key;
 dataList.push({ key, title: key });
 if (node.children) {
 generateList(node.children, node.key);
 }
 }
 };

 generateList(gData);

 const getParentKey = (key, tree) => {
 let parentKey;
 for (let i = 0; i < tree.length; i++) {
 const node = tree[i];
 if (node.children) {
 if (node.children.some(item => item.key === key)) {
 parentKey = node.key;
 } else if (getParentKey(key, node.children)) {
 parentKey = getParentKey(key, node.children);
 }
 }
 }
 return parentKey;
 };
 */


class SearchInput extends Component {
    constructor(props) {
        super(props);
    }
  handleInputChange = (e) => {
      this.props.onChange(e.target.value);
  }
  render() {
      return (<Input
          addonBefore={<Icon type="search" />}
          placeholder="请选择"
          onChange={this.handleInputChange}
          onFocus={this.props.onFocus}
      />);
  }
}

class SelectLevel1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.treeData[0][this.props.levelsNames],
            ulDisplay: 'normal-ul',
        };
    }
  onChange=(item) => {
      this.props.onchange(item);
      this.props.onFocus();
  }
  handleUlDisplay=() => {
      this.setState({
          ulDisplay: (this.state.ulDisplay == 'normal-ul' ? 'ul-hide' : 'normal-ul'),
      })
  }
  render() {
      return (
          <Col span={8}>
              <div className={styles.SelectLevel1}>
                  <div className={styles.SelectTit} onClick={() => { this.handleUlDisplay() }}>
                      {this.props.level1Title}
                  </div>
                  <ul className={this.state.ulDisplay}>
                      {
                          this.props.treeData.map((item, index) => {
                              const province = item[this.props.levelsNames];
                              return (
                                  <a className={styles.Selectlia} key={`${province.content}${index}`}>
                                      <li
                                          key={`${province.content}-${index}`}
                                          className={[item.selected, styles.SelectLi].join(' ')}
                                          onClick={() => { this.onChange(index) }}
                                      >
                                          {province.content}
                                      </li>
                                  </a>)
                          })
                      }
                  </ul>
              </div>
          </Col>
      );
  }
}

class SelectLevel2 extends Component {
    constructor(props) {
        super(props);
        const array = []
        if (this.props.selectedCities) {
            this.props.selectedCities.map((item) => {
                array.push(item.content);
            })
        }

        this.plainOptions = [];
        if (this.props.plainOptions) {
            this.props.plainOptions.map((item) => {
                this.plainOptions.push(item.content);
            })
        }

        this.state = {
            checkedList: array,
            indeterminate: false,
            checkAll: false,
        };
    }

    componentDidMount() {
        this.setState({ plainOptions: this.props.treeData[0][this.props.childrenNames] });
    }
  onChange=(checkedList) => {
      this.setState({
          checkedList,
          indeterminate: false,
          checkAll: checkedList.length === this.props.plainOptions.length,
      }, () => {
          const array = this.props.plainOptions.filter((item, idx, array) => {
              return (this.state.checkedList.indexOf(item.content) != -1)
          })

          this.props.onChange(array);
      });
  }
  onCheckAllChange=(e) => {
      let array = [],
          list = [];
      if (e.target.checked) {
          this.props.plainOptions.map((item) => {
              array.push(item.content);
              list.push(item);
          })
      }

      this.setState({
          checkedList: e.target.checked ? array : [],
          indeterminate: false,
          checkAll: e.target.checked,
      }, () => {
      /* let array =this.props.plainOptions.filter((item,idx,array)=>{
       return (this.state.checkedList.indexOf(item.content)!= -1)
       }) */
          this.props.onChange(list);
      });
  }
  componentWillReceiveProps(props) {
      const array = [];
      if (props.selectedCities) {
          props.selectedCities.map((item) => {
              array.push(item.content);
          })
      }
      this.plainOptions = [];
      props.plainOptions.map((item) => {
          this.plainOptions.push(item.content);
      })
      this.setState({
          checkedList: array,
      })
      if (!props.selectedCities || (props.selectedCities.length != props.plainOptions.length)) {
          this.setState({
              checkAll: false,
          })
      } else {
          this.setState({
              checkAll: true,
          })
      }
  }
  /* componentWillUnmount(){
   console.log("SelectLevel2Unmount")
   console.log(this.state.checkedList)
   } */
  render() {
      // console.log(this.props.plainOptions);
      return (
          <Col span={16} style={{ paddingLeft: 10 }}>
              <div className={styles.SelectLevel2}>
                  <div className={styles.SelectLevelTop}>
                      <div className={styles.Sche}>
                          <Checkbox indeterminate={this.state.indeterminate} onChange={this.onCheckAllChange} checked={this.state.checkAll}>

                          </Checkbox>
                      </div>
                      <div className={styles.Stit}>
                          {this.props.level2Title}
                      </div>
                  </div>
                  <div className={styles.SelectLevelB}>
                      <CheckboxGroup options={this.plainOptions} value={this.state.checkedList} onChange={this.onChange} />
                  </div>
              </div>
          </Col>
      );
  }
}

class Selected extends Component {
    constructor(props) {
        super(props);
    }

    /* componentWillUnmount(){
   console.log("SelectedUnmount");
   } */

    render() {
        return (
            <div className={styles.SelectedLi}>
                <div className={styles.SelectedLiT}><span>{this.props.selectdTitle}</span>（单击移除）</div>
                <ul className={styles.SelectedLiB}>
                    {this.props.showItems.map((item, index) => {
                        return (<li key={index} onClick={() => { this.props.onChange(item) }}>{item.content}</li>)
                    })}
                </ul>
            </div>
        );
    }
}


export default class TreeSelect extends Component {
    constructor(props) {
        super(props);
        const treelist = [];
        this.allItem = [];
        this.allItemPY = []
        this.deletList = [];
        this.props.treeData.map((item, idx) => {
            treelist.push(Object.assign({}, item));
        })
        // this.props.tagName && this.deleteCity(this.props.tagName);
        treelist.map((itm, idx) => {
            itm.selected = 'noSel';
            const children = itm[this.props.childrenNames]
            const array = [];
            if (children) {
                children.map((item, index) => {
                    /* if(item){
           item["PY"] = CC2PY(item);
           } */
                    this.allItem.push(item);
                    this.allItemPY.push(CC2PY(item.content));
                    this.props.showItems.map((shop) => {
                        if (shop.id == item.id) {
                            array.push(shop);
                        }
                    })
                })
            }
            itm.selectedCities = array;
        });

        if (treelist[0] instanceof Object) {
            treelist[0].selected = 'selected';
        }

        this.state = {
            level1Title: this.props.level1Title,
            level2Title: this.props.level2Title,
            selectdTitle: this.props.selectdTitle,
            // showItems:[],
            showItems: this.props.showItems,
            treeData: treelist, // this.props.treeData.slice(0),//new Array(...this.props.treeData.slice(0)),//.slice()
            index: 0,
            searchResult: this.allItem,
            plainOptions: treelist[0][this.props.childrenNames],
        }
    }
  error = () => {
      message.error('This is a message of error');
  }
  componentWillReceiveProps(nextProps) {
      // console.log("componentWillReceiveProps");
      if (nextProps.tagNames) {
      // console.log(nextProps.tagNames);
      // console.log(this.deletList);
          if (this.deletList.length == 0 || (nextProps.tagNames[0] !== this.deletList[0])) {
              // console.log(nextProps.tagNames);
              // console.log(this.deletList);
              this.deletList = [];
              nextProps.tagNames.map((item) => {
                  this.deletList.push(item);
              })
              if (nextProps.tagNames.length != 0) {
                  this.deleteCity(nextProps.tagNames);
              }
          }
      }
  }

  componentWillUnmount() {
      this.props.callback && this.props.callback(this.state.showItems);
      this.allItem = [];
      this.state.searchResult = [];
  }


  handleLevel1Change=(index) => {
      this.state.treeData.map((itm, idx) => {
          this.state.treeData[idx].selected = 'noSel'
      });
      this.state.treeData[index].selected = 'selected';

      this.setState({
          index,
          plainOptions: this.state.treeData[index][this.props.childrenNames],
      });
  }

  handleLevel2Change=(selectedCities) => {
      const index = this.state.index;
      this.state.treeData[index].selectedCities = selectedCities;
      const showItems = [];
      this.state.treeData.map((item, index) => {
          if (item.selectedCities) {
              item.selectedCities.map((itm, idx) => {
                  showItems.push(itm)
              })
          }
      })
      this.setState({
          showItems,
      }, function () {
          this.props.callback && this.props.callback(this.state.showItems);
          if (this.props.onTreeChange) {
              this.props.onTreeChange(this.state.showItems);
          }
      });
  }

  deleteCity=(item) => {
      // console.log('------------------------------');
      // console.log(item);
      if (Array.isArray(item)) {
          let newShowItems = this.state.showItems;
          item.map((ele) => {
              newShowItems = newShowItems.filter((itm) => {
                  return (itm.id != ele.id)
              })
              this.state.treeData.map((itm, idx) => {
                  if (itm.selectedCities) {
                      const newSelects = itm.selectedCities.filter((it, idx, array) => {
                          return (it.id != ele.id)
                      })
                      itm.selectedCities = newSelects;
                  }
              })
          })
          this.setState({
              showItems: newShowItems,
          }, function () {
              this.props.callback && this.props.callback(this.state.showItems);
          });
      } else {
          const newShowItems = this.state.showItems.slice().filter((itm, idx, array) => {
              return (itm.id != item.id)
          })
          this.state.treeData.map((itm, idx) => {
              if (itm.selectedCities) {
                  const newSelectes = itm.selectedCities.filter((it, idx, array) => {
                      return (it.id != item.id)
                  })
                  itm.selectedCities = newSelectes;
              }
          })
          this.setState({
              showItems: newShowItems,
          }, function () {
              this.props.callback && this.props.callback(this.state.showItems);
          });
      }
  }

  handleClear=() => {
      // console.log('333333');
      const treeData = this.state.treeData.map((item, index) => {
          item.selectedCities = item.selectedCities ? [] : [];
          return item
      })
      this.setState({
          showItems: [],
          treeData,
      }, function () {
          this.props.callback && this.props.callback(this.state.showItems);
      })
      // console.log(treeData);
  }

  render() {
      // console.log('--------------------------------------');
      // console.log(this.props.showItems);

      this.props.getResult && this.props.getResult(this.state.showItems);
      let plainOptions;
      if (this.state.focus == '2') {
          plainOptions = this.state.searchResult;
      } else {
          plainOptions = this.state.plainOptions
      }

      const level1Props = {
          level1Title: this.state.level1Title,
          treeData: this.state.treeData,
          levelsNames: this.props.levelsNames,
          childrenNames: this.props.childrenNames,
          style: {
              width: 300,
          },
          onchange: this.handleLevel1Change,
          onFocus: () => {
              this.setState({
                  focus: '1',
              })
          },
      };
      const level2Props = {
          level2Title: this.state.level2Title,
          treeData: this.state.treeData,
          plainOptions,
          levelsNames: this.props.levelsNames,
          childrenNames: this.props.childrenNames,
          selectedCities: this.state.treeData[this.state.index].selectedCities,
          style: {
              width: 300,
          },
          onChange: this.handleLevel2Change,
      };
      const selectedProps = {
          selectdTitle: this.state.selectdTitle,
          showItems: this.state.showItems,
          onChange: this.deleteCity,
      };

      return (
          <div className={styles.treeSelectMain}>
              <SearchInput
                  onChange={(value) => {
                      let list
                      if (!value) {
                          list = this.allItem
                      } else {
                          list = this.allItem.filter((node, index) => {
                              // console.log(this.allItemPY[index])
                              if (node.content.indexOf(value) != -1 || this.allItemPY[index].indexOf(value) != -1) {
                                  return true;
                              }
                              return false;
                          });
                      }


                      this.setState({
                          searchResult: list,
                      })
                      // console.log(this.searchResult);
                  }}

                  onFocus={() => {
                      this.setState({
                          focus: '2',
                      })
                  }}
              />
              <div className={styles.treeSelectBody}>
                  <Row>
                      <SelectLevel1 {...level1Props} />
                      <SelectLevel2 {...level2Props} />
                  </Row>
              </div>
              <div className={styles.treeSelectFooter}>
                  <Selected {...selectedProps} />
                  <div onClick={this.handleClear} className={styles.Tclear}>清空</div>
              </div>

          </div>
      );
  }
}
