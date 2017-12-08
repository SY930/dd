import { connect } from 'react-redux';
import React from 'react';
import { Row, Col, Table, Modal, Tabs, Button, Icon, Tooltip, TreeSelect } from 'antd';
import _ from 'lodash';
import Moment from 'moment';
import { fetchData } from '../../../helpers/util';
import GiftCfg from '../../../constants/Gift';
import { sex } from '../../../constants/CrmCardInfo';
import BaseForm from '../../../components/common/BaseForm';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont';
import styles from './GiftInfo.less';
import { SENDCARD_COLUMNS } from './_tableSendCardListConfig';
import SendCard from './SendCard';
import { 
    UpdateTabKey, 
} from '../_action';
const TabPane = Tabs.TabPane;
const formatDetail = "YYYY/MM/DD HH:mm";
class QuatoCardDetailModalTabs extends React.Component{
    constructor(props){
        super(props);
        this.state={
            activeKey: 'send',
            formData: {},
        }
    }
    onChange(activeKey,batchNO){
        let formData = {};
        if(batchNO !== void(0)){
            formData.batchNO = batchNO;
        }
        const { UpdateTabKey } = this.props;
        UpdateTabKey({
            key: activeKey,
        });
        this.setState({activeKey, formData});
    }
    componentWillReceiveProps(nextProps){
        // this.setState({activeKey:'send'});
        const { tabKey } = nextProps;
        this.setState({
            activeKey: tabKey,
        })
    }
    render(){
        const tabs = [
                {tab:'发卡',key:'send'},
                {tab:'已制卡明细',key:'made'},
                {tab:'卡汇总',key:'sum'}
            ];
        const { data } = this.props;
        const { activeKey:activeK, formData } = this.state;
        return(
            <div className={styles.giftDetailModalTabs}  key={+new Date()+Math.random()}>
                <Tabs
                    className="tabsStyles"
                    onChange={ activeKey => this.onChange(activeKey)}
                    activeKey={ activeK }
                >
                    {
                        tabs.map((tab,index)=>{
                            return <TabPane tab={tab.tab} key={tab.key}>
                                <SendCard
                                    formData={formData} 
                                    _key={tab.key} 
                                    // onChange={(activeKey,batchNO)=>this.onChange(activeKey,batchNO)} 
                                    data={data}
                                />
                            </TabPane>
                        })
                    }
                </Tabs>
            </div>
        )
    }
}

export class PWDSafe extends React.Component{
    constructor(props){
        super(props);
        this.state={
            safe:false,
        }
    }
    handleSafe(){
        const { safe } = this.state;
        let newSafe = !safe;
        this.setState({safe:newSafe});
    }
    render(){
        const { value } = this.props;
        const { safe } = this.state;
        return(
            <div onClick={()=>this.handleSafe()}>
                {
                    safe
                    ?<a href="javaScript:;">{value}<Iconlist className="eye-blue" iconName={'可视'} /></a>
                    :<a href="javaScript:;">{value.replace(/\d/g,'*')}<Iconlist className="eye-blue" iconName={'不可视'} /></a>
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        tabKey: state.sale_old_giftInfo.get('tabKey'),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        UpdateTabKey: opts => dispatch(UpdateTabKey(opts)),
    }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuatoCardDetailModalTabs);
