import React, {
    Component,
} from 'react'
import ReactDOM from 'react-dom'
import {
    Col,
    Table,
} from 'antd'
import _ from 'lodash'
import styles from './SCAntdTable.less'

export default class SCAntdTable extends Component {
    constructor(props) {
        super(props)

        this.state = {
            wraperWidth: 0,
            wraperHeight: 0,
        }

        this.getTableWidthByColumns = this.getTableWidthByColumns.bind(this)
        this.onWindowResize = this.onWindowResize.bind(this)
        this.footerChange = this.footerChange.bind(this)
        this.triggerWindowResize = this.triggerWindowResize.bind(this)
    }

    // 计算table宽度
    getTableWidthByColumns(columns) {
        let tw = 0

        if (columns && columns.length > 0) {
            columns.forEach((column) => {
                tw += column.width
            })
        }

        return tw
    }

    // 列表的footer
    footerChange() {
        const footer = this.props.footer

        return (
            <Table
                bordered={true}
                rowKey={(record, index) => index}
                showHeader={false}
                columns={footer.columns}
                dataSource={footer.dataSource}
                pagination={false}
            />
        )
    }

    // 窗口大小变化处理
    onWindowResize() {
        const columns = this.props.columns
        const parentDom = ReactDOM.findDOMNode(this.props.layoutsContainer)

        let tableHeight = 0
        let wraperHeight = 0
        let wraperWidth = 0

        if (parentDom) {
            const parentHeight = parentDom.offsetHeight;
            const contentrDoms = parentDom.querySelectorAll('.layoutsContent')
            const headerDoms = parentDom.querySelectorAll('.layoutsHeader')

            if (contentrDoms && contentrDoms.length > 0) {
                const layoutsContent = contentrDoms[0]
                const headerHeight = headerDoms[0].offsetHeight

                wraperHeight = parentHeight - headerHeight - 45
                wraperWidth = parentDom.offsetWidth - 100

                if (wraperHeight !== this.state.wraperHeight || wraperWidth !== this.state.wraperWidth) {
                    this.setState({
                        wraperHeight: parentHeight - headerHeight - 45,
                        wraperWidth: parentDom.offsetWidth - 100,
                    }, () => {
                        if (this.state.wraperWidth < this.getTableWidthByColumns(columns)) {
                            tableHeight = layoutsContent.offsetHeight - 68 - 118
                        } else {
                            tableHeight = layoutsContent.offsetHeight - 68 - 98
                        }

                        if (tableHeight !== this.state.tableHeight) {
                            this.setState({
                                tableHeight,
                            })
                        }
                    })
                }
            }
        }
    }

    triggerWindowResize() {
        const self = this

        _.delay(() => {
            self.onWindowResize()
        }, 0)
    }

    render() {
        const {
            columns,
            dataSource,
            total,
            footer,
            pageSizeChange,
            currentChange,
            pageSize,
            current,
        } = this.props

        const {
            wraperHeight,
            wraperWidth,
            tableHeight,
        } = this.state

        return (
            <div
                className={`${styles.SCAntdTable} tableClass`}
                style={{
                    height: wraperHeight,
                    width: wraperWidth,
                    overflowX: 'auto',
                }}
            >
                <Table
                    bordered={true}
                    scroll={{ y: tableHeight }}
                    style={{ width: this.getTableWidthByColumns(columns) }}
                    columns={columns}
                    rowKey={(record, index) => index}
                    dataSource={dataSource}
                    footer={footer && footer.dataSource.length > 0 ? this.footerChange : null}
                    pagination={{
                        pageSize,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        current,
                        onShowSizeChange: pageSizeChange,
                        onChange: currentChange,
                        total,
                        showTotal: (total, range) => `本页 ${range[0]}-${range[1]} / 共 ${total} 条`,
                    }}
                />
            </div>
        )
    }

    componentDidUpdate() {
        this.triggerWindowResize()
    }

    componentDidMount() {
        const self = this

        window.addEventListener('resize', this.triggerWindowResize)
        this.triggerWindowResize()
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.triggerWindowResize)
    }
}
