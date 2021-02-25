import React, {Component} from 'react';
import {connect,Provider} from 'react-redux';
import {  decodeUrl } from '@hualala/platform-base'
import {
    Button,
    Icon,
    Modal
} from 'antd';
import registerPage from '../../index';
import  dvaApp from '../../utils/dva/index'
import { SALE_CENTER_PAYHAVEGIFT } from '../../constants/entryCodes';
import styles from './CreateActive.less'
import { actInfoList } from './constant'
import {
    isProfessionalTheme,
} from '../../helpers/util'
const store = dvaApp._store


@connect(({  loading, createActiveCom }) => ({  loading, createActiveCom }))
class CreateActive extends Component {

    componentDidMount(){
        this.dispatch = this.props.dispatch
        // TODO: 点击tab切换后，参数会丢失，暂时默认为微信支付有礼，后期解决
        const  { typeKey = '80', itemID, isView, isEdit } = decodeUrl()

        this.dispatch({
            type: 'createActiveCom/updateState',
            payload: {
                type: typeKey,
                groupID: this.props.groupID,
                isView: isView == 'true' ? true : false,
                isEdit: isEdit == 'true' ? true : false,
                itemID
            }
        })
        this.typeKey = typeKey

    }


    componentWillUnmount() {
        this.dispatch({
            type: 'createActiveCom/clearData'
        })
    }
    onCancel = () => {
        this.dispatch({
            type: 'createActiveCom/updateState',
            payload: {
                descModalIsShow:  false
            }
        })
    }
    showDescModal = () => {
        this.dispatch({
            type: 'createActiveCom/updateState',
            payload: {
                descModalIsShow:   true
            }
        })
    }
    render() {
        const {
            type,
            descModalIsShow
        } = this.props.createActiveCom
        const  { itemID, isView, isEdit } = decodeUrl()
        console.log(actInfoList,this.typeKey,'actInfoList-----------------')
        const currentInfo = actInfoList.find(v => v.key ===  this.typeKey) || {}
        console.log(currentInfo,'currentInfo--------------------------')
        let {dscList = [], warnInfo = ''} = currentInfo
        return (
            <div className={styles.createActive}>
                <div className={styles.header}>
                    <h1>{itemID ? isEdit === 'true' ? '编辑' : '查看': '创建'}{`${currentInfo.title}`}</h1>
                    {
                        dscList.length > 0 &&
                            <div onClick={this.showDescModal} style={isProfessionalTheme() ? {color: '#379ff1'} : {}} className={styles.desc}>
                                <Icon type="question-circle-o" />
                                <span style={{marginLeft: '2px'}}>活动说明</span>
                            </div>
                    }
                    {   !!warnInfo &&
                        <div className={styles.warnInfo}>
                            <Icon type="exclamation-circle" />
                            {warnInfo}
                        </div>
                    }
                </div>
                <div className={styles.line}></div>
                {currentInfo.render && currentInfo.render({})}
                <Modal
                    title="活动说明"
                    visible={descModalIsShow}
                    width="635px"
                    onCancel={this.onCancel}
                    footer={
                        <div className={styles.modalFooter}>
                            <Button onClick={this.onCancel}>关闭</Button>
                        </div>
                    }
                >

                <div className={styles.modalContent}>
                    {currentInfo.dscList && currentInfo.dscList.map(v => {
                        return  <div>
                        <div className={styles.modalTitle}>
                            <div className={styles.leftLine}></div>
                            <span>{v.title}</span>
                        </div>
                        <div className={styles.modalInfo}>
                            {v.dsc}
                        </div>
                    </div>
                    })}

                </div>
                </Modal>
            </div>
        )
    }
}

const getProvider = (props) => {
    return (<Provider store={store}><CreateActive {...props} /></Provider>)
}
const mapStateToProps = ({ user }) => {
    return {
        groupID: user.getIn(['accountInfo', 'groupID']),
    }
}
export default registerPage([SALE_CENTER_PAYHAVEGIFT])(connect(mapStateToProps)(getProvider))


