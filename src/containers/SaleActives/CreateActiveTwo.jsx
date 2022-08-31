import React, {Component} from 'react';
import {connect,Provider} from 'react-redux';
import {  decodeUrl, closePage, jumpPage } from '@hualala/platform-base'
import { throttle } from 'lodash';
import {
    Button,
    Icon,
    Modal
} from 'antd';
import PhonePreviewLeft from './components/PhonePreview'
import registerPage from '../../index';
// import  dvaApp from '../../utils/dva/index'
import { SALE_ACTIVE_NEW_PAGE } from '../../constants/entryCodes';
import styles from './CreateActive.less'
import FaceFormWrapper from './ManyFace';
// import { actInfoList } from './constant'

// const store = dvaApp._store;

const actInfoList = [{
  title: '千人千面',
  key: '85',

}];


@connect(({  loading, createActiveTwoCom }) => ({  loading, createActiveTwoCom }))
class CreateActiveTwo extends Component {

    constructor() {
      super();
      this.state = {
        loading: false,
        type: '1', 
      }
      this.saving = this.saving.bind(this);
      this.formRef = null;
      this.lockedSaving = throttle(this.saving , 500, {trailing: false});
    }

    componentDidMount(){
        // // TODO: 点击tab切换后，参数会丢失，暂时默认为微信支付有礼，后期解决
        // const  { typeKey = '85' } = decodeUrl()
        // this.typeKey = typeKey

    }

    onchageType = (type) => {
      this.setState({
        type,
      })
    }

    saving = () => {
      this.handleSubmitFn(this.handleCallback) 
    }

    handleCallback = () => {}

    render() {
        const  { itemID, isView, typeKey, isActive } = decodeUrl()
        const currentInfo = actInfoList.find(v => v.key === typeKey) || {}
        const { loading } = this.state;
        const Comp = FaceFormWrapper
        return (
            <div className={styles.createActiveTwo}>
                <div className={styles.headers}>
                    <h1>{itemID ? isView === 'false' ? '编辑' : '查看': '创建'}{`${currentInfo.title}`}</h1>
                    <p>
                      <Button
                          type="ghost"
                          style={{
                              marginRight: '10px'
                          }}
                          onClick={()=>{
                            closePage()
                            if (itemID) {
                              jumpPage({ pageID: '1000076003' })
                            } else {
                              jumpPage({ pageID: '10000730008' })
                            }
                          }}
                      >
                        取消
                      </Button>
                      <Button
                          type="primary"
                          disabled={isView === 'true'}
                          loading={loading}
                          onClick={this.lockedSaving}
                      >
                        保存
                      </Button>
                    </p>
                </div>
                <div className={styles.line}></div>
                <div className={styles.centerContent} style={{ height: 'calc(100% - 70px)', overflow: 'hidden', display: 'flex'}}>
                  <PhonePreviewLeft type={this.state.type}/>
                  <div className={styles.centerLine}>
                    <div className={styles.arrow}></div>
                  </div>

                  <Comp 
                     getSubmitFn={(fn) => { this.handleSubmitFn = fn }}
                     itemID={itemID}
                     isView={isView}
                     onChangDecorateType={this.onchageType}
                     isActive={isActive}
                  />
                </div>
            </div>
        )
    }
}

// const getProvider = (props) => {
//     return (<Provider store={store}><CreateActiveTwo {...props} /></Provider>)
// }
const mapStateToProps = ({ user }) => {
    return {
        groupID: user.getIn(['accountInfo', 'groupID']),
    }
}
export default registerPage([SALE_ACTIVE_NEW_PAGE])(connect(mapStateToProps)(CreateActiveTwo))


