import React, { PureComponent as Component } from 'react';
import { Modal, Button, Steps } from 'antd';
import styles from './index.less';
import { getTotalList } from '../AxiosFactory';
import { imgURI } from '../Common';
import style from 'components/basic/ProgressBar/ProgressBar.less';

const Step = Steps.Step;
class Release extends Component {
    /* 页面需要的各类状态属性 */
    state = {
        current: 0,
    };
    componentDidMount() {
        // this.onQueryList();
    }
    /**
     * 加载列表
     */
    onQueryList = (params) => {
        const { queryParams } = this.state;
        const { ids } = this.props;
        // 查询请求需要的参数
        // 第一次查询params会是null，其他查询条件默认是可为空的。
        const obj = { ...queryParams, ...params,  ...ids };
        // 把查询需要的参数缓存
        this.setState({ queryParams: obj, loading: true });
        getTotalList({ ...ids, ...params }).then((obj) => {
            const { pageObj, list } = obj;
            this.setState({ pageObj, list, loading: false });
        });
    }
    /* 是否显示 */
    onToggleModal = () => {
        this.setState(ps => ({ visible: !ps.visible }));
    }
    onGoStep = () => {
        this.setState(ps => ({ current: +!ps.current }));
    }
    render() {
        const { current } = this.state;
        const { onClose } = this.props;
        return (
            <Modal
                title=""
                visible={true}
                width="800"
                maskClosable={false}
                onCancel={onClose}
                footer={[<Button key="0" onClick={this.onGoStep}>下一步</Button>]}
            >
                <section className={styles.mainBox}>
                    <Steps className={style.ProgressBar} current={current}>
                        <Step title="选择券包" />
                        <Step title="券包投放" />
                    </Steps>
                </section>
            </Modal>
        )
    }
}
export default Release
