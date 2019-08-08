import React, { Component } from 'react';
import { Row, Col } from 'antd';
import MicroneMemberTabs from './Tab';
import { isProfessionalTheme } from '../../helpers/util'

export default class TrdMember extends Component {
    constructor(props) {
        super(props);
        this.basicForm = null;
        this.data = {};
        this.state = {
            tableHeight: '100%',
            contentHeight: '100%',
        }
    }

    componentDidMount() {
        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
    }

    onWindowResize = () => {
        const parentDoms = ReactDOM.findDOMNode(this.layoutsContainer); // 获取父级的doms节点
        if (parentDoms !== null) { // 如果父级节点不是空将执行下列代码
            const parentHeight = parentDoms.offsetHeight; // 获取到父级的高度存到变量 parentHeight
            const contentrDoms = parentDoms.querySelectorAll('.layoutsContent'); // 从父节点中获取 类名是 layoutsContent 的doms节点 存到变量 contentrDoms 中
            if (undefined !== contentrDoms && contentrDoms.length > 0) { // 如果 contentrDoms 节点存在 并且length>0 时执行下列代码
                const layoutsContent = contentrDoms[0]; // 把获取到的 contentrDoms 节点存到 变量 layoutsContent 中
                const headerDoms = parentDoms.querySelectorAll('.layoutsHeader');
                const headerHeight = headerDoms[0].offsetHeight;
                layoutsContent.style.height = `${parentHeight - headerHeight - 15 - 20}px`; // layoutsContent 的高度，等于父节点的高度-头部-横线-padding值
                this.setState({
                    contentHeight: parentHeight - headerHeight - 15,
                    tableHeight: layoutsContent.offsetHeight - 160 - 68,
                })
            }
        }
    }

    render() {
        const { tableHeight, contentHeight, styleName } = this.state;
        return (
            <Row className={'layoutsContainer'} ref={layoutsContainer => this.layoutsContainer = layoutsContainer}>
                <Col span={24} className={'layoutsHeader'}>
                    <div className="layoutsTool">
                        <div className="layoutsToolLeft">
                            <h1>第三方对接</h1>
                        </div>
                    </div>
                </Col>
                <Col span={24} className="layoutsLineBlock"></Col>
                <Col span={24} className={'layoutsContent tableClass'} style={{ height: this.state.contentHeight }}>
                    <MicroneMemberTabs
                        isProfessionalTheme={isProfessionalTheme()}
                        tableHeight={tableHeight}
                        contentHeight={contentHeight}
                    />
                </Col>
            </Row>
        )
    }
}
