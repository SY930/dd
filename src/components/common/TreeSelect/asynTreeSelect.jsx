/*
 *组件名称：TreeSelect (树选择)
 * 功能：树状多选
 * 杨珂   2016/12/09
 */
import React, { Component } from 'react'
import { Input, Icon, Button, Row, Col, Checkbox } from 'antd';

const Search = Input.Search;
const CheckboxGroup = Checkbox.Group;

import styles from './treeSelect.less';
import { Iconlist } from '../../basic/IconsFont/IconsFont';

import CC2PY from '../CC2PY';
import Tree from '../../basic/tree'
/*
 搜索框组件
 */
const TreeNode = Tree.TreeNode;

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
            value: '',
            ulDisplay: 'normal-ul',
        };
    }
  onChange=(item, e) => {
      this.props.onchange(e);
      this.props.onFocus();
  }
  handleUlDisplay=() => {
      this.setState({
          ulDisplay: (this.state.ulDisplay == 'normal-ul' ? 'ul-hide' : 'normal-ul'),
      })
  }
  /* <Iconlist iconName={'youjiantou'} className="youjiantou"/> */
  render() {
      return (
          <Col span={8}>
              <div className={styles.SelectLevel1}>
                  <div className={styles.SelectTit} onClick={() => { this.handleUlDisplay() }}>
                      <a style={{ color: '#676a6c', paddingLeft: '20px' }}>{this.props.level1Title}</a>
                  </div>
                  <ul className={this.state.ulDisplay}>
                      {
                          <Tree
                              titleField={this.props.titleField}
                              keyField={this.props.keyField}
                              treeData={this.props.treeData}
                              onSelect={this.onChange}
                          />

                      }
                  </ul>
              </div>
          </Col>
      );
  }
}
const selected = 'selected';

class SelectLevel2 extends Component {
    constructor(props) {
        super(props);
        const array = []
        if (this.props.selectedCities) {
            this.props.selectedCities.map((item) => {
                array.push(item[this.props.itemName]);
            })
        }

        this.plainOptions = [];
        if (this.props.plainOptions) {
            this.props.plainOptions.map((item) => {
                this.plainOptions.push(item[this.props.itemName]);
            })
        }

        this.state = {
            checkedList: array,
            indeterminate: false,
            checkAll: false,
        };
    }

    componentDidMount() {
    // this.props.treeData[0][this.childrenNames]
    }

  onChange=(checkedList) => {
      this.setState({
          checkedList,
          indeterminate: false,
          checkAll: checkedList.length === this.props.plainOptions.length,
      }, () => {
          const array = this.props.plainOptions.filter((item, idx, array) => {
              return (this.state.checkedList.indexOf(item[this.props.itemName]) != -1)
          })
          this.props.onChange(array);
      // console.log(array,'---array---');
      });
  }

  onCheckAllChange=(e) => {
      let array = [],
          list = [];
      if (e.target.checked) {
          this.props.plainOptions.map((item) => {
              array.push(item[this.props.itemName]);
              list.push(item);
          })
      }

      // console.log(array);

      this.setState({
          checkedList: e.target.checked ? array : [],
          indeterminate: false,
          checkAll: e.target.checked,
      }, () => {
      /* let array =this.props.plainOptions.filter((item,idx,array)=>{
       return (this.state.checkedList.indexOf(item[this.props.itemName])!= -1)
       }) */
      // console.log(list);
          this.props.onChange(list);
      });
  }
  componentWillReceiveProps(props) {
      const array = [];
      if (props.selectedCities) {
          props.selectedCities.map((item) => {
              array.push(item[this.props.itemName]);
          })
      }
      // console.log(array,'----------array----------');
      this.plainOptions = [];
      props.plainOptions.map((item) => {
      // console.log('`````````````item================>>>',item);
          this.plainOptions.push(item[this.props.itemName]);
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
  render() {
      // console.log(this.props.plainOptions);
      // console.log(this.plainOptions,"------this.plainOptions-------")
      // console.log(this.state.checkedList,"------this.state.checkedList-------")
      return (
          <Col span={16} style={{ paddingLeft: 10 }}>
              <div className={styles.SelectLevel2}>
                  <div className={styles.SelectLevelTop}>
                      <div className={styles.Sche}>
                          <Checkbox
                              indeterminate={this.state.indeterminate}
                              onChange={this.onCheckAllChange}
                              checked={this.state.checkAll}
                          >

                          </Checkbox>
                      </div>
                      <div className={styles.Stit}>
                          {this.props.level2Title}
                      </div>
                  </div>
                  <div className={styles.SelectLevelB}>
                      <CheckboxGroup
                          options={this.plainOptions}
                          value={this.state.checkedList}
                          onChange={this.onChange}
                      />
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


    render() {
    // console.log(this.props.showCities,'this.props.showCities')
        return (
            <div className={styles.SelectedLi}>
                <div className={styles.SelectedLiT}><span>{this.props.selectdTitle}</span>（单击移除）</div>
                <ul className={styles.SelectedLiB}>
                    {this.props.showCities.map((item, index) => {
                        return (<li
                            key={index}
                            onClick={
                                () => { this.props.onChange(item) }
                            }
                        >{item[this.props.itemName]}</li>)
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
        // console.log(this.props.treeData,'this.props.treeData-----------------------');
        this.props.treeData.map((item, idx) => {
            treelist.push(Object.assign({}, item));
        })
        // this.props.tagName && this.deleteItem(this.props.tagName);

        // this.treeCopy = treelist;//this.convertTree(treelist);
        const treeCopy = this.convertTree(treelist);

        this.state = {
            level1Title: this.props.level1Title,
            level2Title: this.props.level2Title,
            selectdTitle: this.props.selectdTitle,
            showCities: this.props.showCities ? this.props.showCities : [],
            treeData: treeCopy, // this.props.treeData.slice(0),//new Array(...this.props.treeData.slice(0)),//.slice()
            index: '', // treelist[0][this.props.keyField],
            searchResult: [], // this.allItem,
            plainOptions: [],
        }
        this.flag = true;
        this.allSelected = [];
        this.childrenNames = 'children';
    }
  convertTree = (treelist) => {
      let treeCopy = [],
          childrenNames = this.props.childrenNames,
          childFatherFlag;

      treelist.map((itm, idx) => {
      // itm['selected']='noSel';
          const item = {
              ...itm,
          }
          const children = item[childrenNames]


          if (children && children[0]) {
              /* childFatherFlag = (itm[childrenNames][0][childrenNames]
         &&itm[childrenNames][0][childrenNames][0]);
         if(!childFatherFlag){//itm['isLeafFather']
         children.map((it,index)=>{
         it['isLeaf']=true;
         })
         itm['isLeafFather']=true;
         //item['isLeafFather']=true;
         //item['children'] = children;
         }
         else { */


              // item['children'] = this.convertTree(children)
              // }
              if (childrenNames != this.childrenNames) {
                  item.children = this.convertTree(children);
                  item[this.props.childrenNames] = null;
                  // item[this.props.childrenNames] = null;
              }
          }
          treeCopy.push(item);
      });
      // console.log(treelist[0]);
      // treelist[0]['selected']='selected';
      return treeCopy
  }

  /* convertTree = (treelist)=>{
   let treeCopy = [];

   treelist.map((itm,idx)=>{
   //itm['selected']='noSel';
   let item = {
   ...itm
   }
   let children = itm[this.props.childrenNames]
   if(itm['isLeafFather']){

   //item[this.props.childrenNames] = null;
   }
   else {
   if(children){
   item[this.props.childrenNames] = this.convertTree(children)
   }
   }
   treeCopy.push(item);
   });
   console.log(treelist[0]);
   //treelist[0]['selected']='selected';
   return treeCopy
   } */

  componentWillReceiveProps(nextProps) {
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
                  this.deleteItem(nextProps.tagNames);
              }
          }
      }
      if (nextProps.plainOptions) {
          nextProps.plainOptions.map((item, index) => {
              // console.log(item,'-----------item--------')
              item.key = index;
          });
          this.state.plainOptions = nextProps.plainOptions;
      }
  }

  componentWillUnmount() {
      this.props.callback && this.props.callback(this.state.showCities);
      this.allItem = [];
      this.state.searchResult = [];
  }


  searchChildren = (treelist) => {

  }
  // 请求后台数据函数
  handleLevel1Change=(index) => {
      if (this.props.onTreeChange) {
          this.props.onTreeChange(index);
      }
      this.setState({ index: index.selectedNodes[0].key });
  }

  handleLevel2Change=(selectedCities) => {
      const index = this.state.index;
      const showCities = [];
      this.allSelected[index] = selectedCities;
      for (const i in this.allSelected) {
      // console.log(i,'i',this.allSelected[i],'this.allSelected[i]')
          this.allSelected[i].map((itm) => {
              showCities.push(itm);
          })
      }
      this.setState({
          showCities,
      }, function () {
          this.props.callback && this.props.callback(this.state.showCities);
      });
  };

  deleteItem=(item) => {
      let newShowCities = [];
      console.log(item, 'item--------------')

      if (Array.isArray(item)) {
          item.map((ele) => {
              newShowCities = this.state.showCities.filter((itm) => {
                  return (itm[this.props.itemID] != ele[this.props.itemID])
              })
              for (const i in this.allSelected) {
                  // console.log(i,'i',this.allSelected[i],'this.allSelected[i]')
                  this.allSelected[i] = this.allSelected[i].filter((itm) => {
                      return (itm[this.props.itemID] != ele[this.props.itemID])
                  })
              }
          })

          this.setState({
              showCities: newShowCities,
          }, function () {
              this.props.callback && this.props.callback(this.state.showCities);
          });
      } else {
          newShowCities = this.state.showCities.filter((itm, idx, array) => {
              return (itm[this.props.itemID] != item[this.props.itemID])
          })
          for (const i in this.allSelected) {
              // console.log(i,'i',this.allSelected[i],'this.allSelected[i]')
              this.allSelected[i] = this.allSelected[i].filter((itm) => {
                  return (itm[this.props.itemID] != item[this.props.itemID])
              })
          }
          this.setState({
              showCities: newShowCities,
          }, function () {
              this.props.callback && this.props.callback(this.state.showCities);
          });
      }
  }

  handleClear=() => {
      for (const i in this.allSelected) {
      // console.log(i,'i',this.allSelected[i],'this.allSelected[i]')
          this.allSelected[i] = [];
      }
      this.setState({ showCities: [] }, function () {
          this.props.callback && this.props.callback(this.state.showCities);
      })
  };

  getLevel1Props = () => {
      const level1Props = {

          level1Title: this.state.level1Title,
          treeData: this.state.treeData,
          levelsNames: this.props.levelsNames,
          childrenNames: this.childrenNames,
          titleField: this.props.titleField,
          keyField: this.props.keyField,
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
      return level1Props;
  }

  getLevel2Props = () => {
      let plainOptions;
      if (this.state.focus == '2') {
          plainOptions = this.props.searchResult ? this.props.searchResult : [];
          console.log(this.props.searchResult, '======11111111111111111=== >> searchData');
      } else {
          plainOptions = this.state.plainOptions
      }
      // console.log(this.props.plainOptions,'this.props.plainOptions')
      const level2Props = {
          level2Title: this.state.level2Title,
          treeData: this.state.treeData,
          plainOptions,
          itemName: this.props.itemName,
          childrenNames: this.childrenNames,
          titleField: this.props.titleField,
          keyField: this.props.itemID,
          // searchInTree:this.searchInTree,
          selectedCities: this.allSelected[this.state.index],
          style: {
              width: 300,
          },
          onChange: this.handleLevel2Change,
      };
      return level2Props
  };

  render() {
      this.props.getResult && this.props.getResult(this.state.showCities);

      const selectedProps = {
          itemName: this.props.itemName,
          childrenNames: this.childrenNames,
          selectdTitle: this.state.selectdTitle,
          showCities: this.state.showCities,
          onChange: this.deleteItem,
      };

      return (
          <div className={styles.treeSelectMain}>
              <SearchInput
                  onChange={(value) => {
                      this.props.searchChange && this.props.searchChange(value);
                  }}
                  onFocus={() => {
                      this.setState({
                          focus: '2',
                          index: '',
                      })
                  }}
              />
              <div className={styles.treeSelectBody}>
                  <Row>
                      <SelectLevel1 {...this.getLevel1Props()} />
                      <SelectLevel2 {...this.getLevel2Props()} />
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
