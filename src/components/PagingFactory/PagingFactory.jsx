/**
 * 分页的高阶组件
 * 使用方式：
 * 引入此组件，导出PageHOCFactory（使用组件名）
 * 默认触发引用组件的handleQueryList函数
 * 如果想自定义查询函数名，可以在组件did函数中执行getQueryFun，传入组件自身的查询函数
 * 获得list后，执行setPageState，重置分页的数据
 * pagnation 参数改成{{...this.props.page}}
 * 建议使用redux的compose组合HOC使用，方便调用多个HOC
 *
 * author: gfz
 */
import React, { Component } from 'react';
import styles from './PageStyles.less';

// 默认分页显示文字
export const DEFAULT_SHOW_TOTAL = (total, range) => `本页${range[0]}-${range[1]}/共${total}条`;
const PagingFactory = WrappedComponent => class extends Component {
    state = {
        total: 0,
        pageNo: 1,
        pageSize: 30,
    };

    /* 点击分页页码触发 */
    handleSavePaging = (params) => {
        this.setState(params);
    }

    render() {
        const { total, pageSize, pageNo: current } = this.state;
        const newProps = {
            ...this.props,
            page: {
                total,
                pageSize,
                current,
                showQuickJumper: true,
                showSizeChanger: true,
                showTotal: DEFAULT_SHOW_TOTAL,
            },
            onSavePaging: this.handleSavePaging,
            pageClass: styles.pageClass,
        };
        return <WrappedComponent {...newProps} />
    }
}
export default PagingFactory
/**
 * PS：
 * 1.
 * import PageHOCFactory from './PageHOCFactory'
 * import { compose } from 'redux'
 * 2.
 * fetchData(url,params,null, {path: 'data',})
 *   .then((data) => {
 *      const { totalSize: total, pageNo, pageSize } = data.pageInfo;
 *      this.props.setPageState({ total,pageNo,pageSize })
 *   });
 * 3.
 *  handleQueryList = (params = {}) => {
 *     ...组件内查询的必要函数，如想自定义，看6
 *  }
 * 4.
 * pagination={{ ...this.props.page }}
 * <Pagination {...this.props.page} />
 * 5.
 * export default compose(PageHOCFactory)(Main)
 * 或 export default PageHOCFactory(Main)
 * 6.
 * 获取自定义的查询函数（可选项，3和6二选一）
 * componentDidMount() {
 *    this.props.getQueryFun(this.handleQuery)
 * }
 * pagination={{
 *  ...page,
 *  onChange: this.handlePageChange,
 *  onShowSizeChange: this.handlePageChange,
 * }}
 */
