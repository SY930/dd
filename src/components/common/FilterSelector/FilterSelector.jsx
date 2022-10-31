
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Icon, Input, Button, message, Modal, Radio, Upload } from 'antd';
import classnames from 'classnames';
import { isEqual } from 'lodash';
const RadioGroup = Radio.Group;
import CheckboxList from '../CheckboxList';
import SelectedList from './SelectedList';
import { filterOptions } from './_utils';

import style from './assets/FilterSelector.less';
import { isProfessionalTheme } from '../../../helpers/util'
import { Iconlist } from '../../../components/IconsFont/IconsFont'
import { isZhouheiya } from '../../../constants/WhiteList'
import { axiosData } from '../../../helpers/util';

class FilterSelector extends React.Component {
    state = {
        filterKey: '',
        filters: {},
        selected: this.props.defaultValue,
        filteredOptions: filterOptions(this.props.options, this.props.extraFilters),
        batchAddVisible: false,
        inputText: '',
        batchType: '1',
        fileList: [],
        uploading: false,
        excelUrl: '',
        shopIds: [],
        inputTextArr: [],
        shopOrgCode: []
    }

    componentDidMount() {
        const { filters } = this.props;
        if (filters.length > 0) {
            this.handleFilterKeyChange(filters[0].key);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!isEqual(this.props.options, nextProps.options) ||
            !isEqual(this.props.extraFilters, nextProps.extraFilters)
        ) {
            this.setState({
                filteredOptions: filterOptions(nextProps.options, nextProps.extraFilters),
            });
        }
    }

    handleFilterKeyChange = (filterKey) => {
        const { onFilterKeyChange } = this.props;
        Promise.resolve(onFilterKeyChange(filterKey)).then(
            () => this.setState({ filterKey })
        );
    }

    handleFilterChange = (values) => {
        const { options, extraFilters, isPromotion } = this.props;
        const { filterKey, filters } = this.state;
        let nextFilters = {};
        if (isPromotion) {
            nextFilters = { [filterKey]: values };
        } else {
            nextFilters = { ...filters, [filterKey]: values };
        }
        this.setState({
            filters: nextFilters,
            filteredOptions: filterOptions(options, {
                ...nextFilters,
                ...extraFilters,
            }),
        });
    }

    handleFilterClear = () => {
        const { options, extraFilters } = this.props;
        this.setState({
            filters: {},
            filteredOptions: filterOptions(options, extraFilters),
        });
    }

    handleResultChange = (values) => {
        const { onChange } = this.props;
        onChange(values);
        this.setState({
            selected: values,
        });
    }

    checkDisabled = () => {

        let flag = false
        let inputText = this.state.inputText
        let inputTextArr = inputText.split(',')
        inputTextArr = inputTextArr.filter(i => i != '')
        if (!this.state.inputText || inputTextArr.length == 0) {
            flag = true
        }
        return flag
    }

    checkAll = (param) => {

        let inputText = param
        let options = this.props.options
        let inputTextArr = inputText.split(',')
        inputTextArr = inputTextArr.filter(i => i != '')

        let selected = []

        inputTextArr.map((i) => {
            let flag = false
            options.map((j) => {
                if (i.trim() == j.shopID) {
                    flag = true
                }
            })

            if (!flag) {
                selected.push(i.trim())
            }
        })

        return selected
    }

    batchAdd = (params) => {

        if (isZhouheiya(this.props.groupID)) {
            let options = this.props.options || []

            let selected = this.state.selected

            let inputTextArr = params.split(',')

            let checkArr = []
            let shopOrgCode = this.state.shopOrgCode
            if (this.state.batchType == 1) {
                checkArr = this.checkAll(this.state.inputText)
                if (checkArr.length > 0) {
                    this.setState({ failVisible: true, checkArr, batchAddVisible: false })
                    return
                }
                this.setState({ selected, inputTextArr, batchAddVisible: !this.state.batchAddVisible, successVisible: true })
            } else {
                inputTextArr = []
                options = options.filter(
                    option => shopOrgCode.includes(option.orgCode)
                );
                options.map((i) => {

                    let index = selected.findIndex(ele => ele == i.shopID)
                    if (index == -1) {
                        selected.push(i.shopID)
                        inputTextArr.push(i.shopID)
                    }
                })
                this.setState({ selected, inputTextArr, batchAddVisible: !this.state.batchAddVisible, successVisible: true })

            }


        } else {
            let options = this.props.options || []

            let selected = this.state.selected

            let inputTextArr = params.split(',')

            let checkArr = []
            if (this.state.batchType == 1) {
                checkArr = this.checkAll(this.state.inputText)
            } else {
                checkArr = this.checkAll(this.state.shopIds.join(','))
            }
            if (checkArr.length > 0) {
                this.setState({ failVisible: true, checkArr, batchAddVisible: false })
                return
            }
            options.map((i) => {
                inputTextArr.map((j) => {
                    if (i.shopID == j) {
                        if (selected.indexOf(j) == -1) {
                            selected.push(j)
                        }
                    }
                })
            })

            this.setState({ selected, inputTextArr, batchAddVisible: !this.state.batchAddVisible, successVisible: true })

        }

    }

    // handleUploadChange = (info) => {

    //     let files = info.fileList[0];
    //     // 获取文件名称
    //     let name = files.name
    //     // 获取文件后缀
    //     let suffix = name.substr(name.lastIndexOf("."));
    //     let reader = new FileReader();
    //     reader.onload = (event) => {
    //         try {
    //             let { result } = event.target;
    //             // 读取文件
    //             let workbook = XLSX.read(result, { type: 'binary' });
    //             let data = [];
    //             // 循环文件中的每个表
    //             for (let sheet in workbook.Sheets) {
    //                 if (workbook.Sheets.hasOwnProperty(sheet)) {
    //                     // 将获取到表中的数据转化为json格式
    //                     data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
    //                 }
    //             }
    //             let shopIds = []
    //             data.map((i) => {
    //                 shopIds.push(i.店铺ID);
    //             })
    //             this.setState({
    //                 shopIds
    //             })

    //         } catch (e) {
    //             message.error('文件类型不正确！');
    //         }
    //     }
    //     reader.readAsBinaryString(files);
    // }

    handleBeforeUpload = (file) => {
        if (!file) return true; // in case of browser compatibility
        const types = ['.xlsx', '.xls'];
        const matchedType = types.find((type) => {
            const regexp = new RegExp(`^.*${type.replace('.', '\\.')}$`);
            return file.name.match(regexp);
        });
        if (types.length && !matchedType) {
            message.error('上传文件格式错误');
            return false;
        }
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('上传文件必须小于10MB!');
            return false;
        }
        this.setState({
            fileList: [file],
        });
        return true;
    }

    query(fileName) {
        let newFileName = fileName.split('/')[1]
        axiosData('/shopImport/parseShopId.ajax', { fileName: newFileName },
            null, { path: 'data' }, 'HTTP_SERVICE_URL_PROMOTION_NEW')
            .then((data) => {
                if (isZhouheiya(this.props.groupID)) {
                    this.setState({
                        shopOrgCode: data.shopIdLists || []
                    })
                } else {
                    this.setState({
                        shopIds: data.shopIdLists
                    })
                }
            })
    }

    handleUploadChange = ({ file }) => {
        if (file.status === 'done') {
            this.setState({ shopIDPath: file.response.data.url });
            this.query(file.response.data.url)
        } else if (file.status === 'error') {
            message.error('自定义群体上传失败！');
        }
    }

    downLoadExcel = () => {
        if(isZhouheiya(this.props.groupID)){
            window.open('https://res.hualala.com/crmexport/%E5%BA%97%E9%93%BA%E7%BC%96%E7%A0%81%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx');
        }else{
            window.open('http://res.hualala.com/crmexport/%E5%BA%97%E9%93%BA%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx');
        }
        
    }

    render() {
        const {
            title, className, options, filters: oriFilters, tableColumns,
        } = this.props;
        let { filterKey, filters, selected, filteredOptions } = this.state;

        let newTableColumns = []
        if (isZhouheiya(this.props.groupID)) {
            newTableColumns = [
                {
                    title: '门店名称',
                    dataIndex: 'shopName',
                    key: 'shopName',
                    width: 150,
                    className: 'TableTxtLeft',
                    render: (text, record, index) => {
                        return <span title={text}>{text}</span>
                    },
                },
                {
                    title: '门店编码',
                    dataIndex: 'orgCode',
                    key: 'orgCode',
                    width: 90,
                    className: 'TableTxtCenter',
                    render: (text, record, index) => {
                        return <span title={text}>{text}</span>
                    },
                }
            ]
        } else {
            newTableColumns = tableColumns
        }

        const resultDisplay = newTableColumns.length ? 'table' : 'stripped';
        const curFilter = oriFilters.find(filter => filter.key === filterKey) || {};
        const selectedFilters = oriFilters.reduce((ret, filter) => {
            const filterValues = filters[filter.key];
            if (filterValues && filterValues.length > 0) {
                return ret.concat(filter.options.filter(
                    option => filterValues.indexOf(option.value) !== -1
                ));
            }
            return ret;
        }, []);
        const selectedItems = options.filter(
            option => selected.indexOf(option.value) !== -1
        );

        const props = {
            fileList: this.state.fileList,
        };
        let fileList = this.state.fileList
        let fileName = ''
        if (fileList && fileList.length > 0) {
            fileName = fileList[0].name
        }

        //周黑鸭禁用门店
        let disabledShops = this.props.disabledShops || []
        if (disabledShops.length > 0) {
            filteredOptions = filteredOptions.filter(item => {
                return !disabledShops.includes(item.shopID)
            })
        }

        return (
            <div className={classnames(isProfessionalTheme() ? style.hllFilterSelectorPro : style.hllFilterSelector, className)}>
                <div className={style.filterKeyList}>
                    {oriFilters.map(({ key, label }) => (
                        <span
                            key={key}
                            className={classnames(style.filterKey, {
                                [style.active]: key === filterKey,
                            })}
                            role="button"
                            tabIndex="0"
                            onClick={() => this.handleFilterKeyChange(key)}
                        >
                            {label}
                        </span>
                    ))}
                </div>

                <Row style={{ display: 'flex', alignItems: 'center' }}>
                    <p className={style.selectedFilters} style={{ width: 530 }}>
                        {selectedFilters.length > 0 ? (
                            <span>
                                已选条件：
                                {selectedFilters.map(filter => filter.label).join(' / ')}
                                <Icon
                                    type="close-circle"
                                    title="清空所有条件"
                                    className={style.clearBtn}
                                    onClick={this.handleFilterClear}
                                />
                            </span>
                        ) : '已选条件：尚未选择过滤条件'}
                    </p>
                    {/* <div style={{ float: 'right' }}> */}
                    <a style={{ marginLeft: 25 }} onClick={() => {
                        this.setState({ batchAddVisible: !this.state.batchAddVisible, inputText: '', batchType: isZhouheiya(this.props.groupID)?'2':'1', excelUrl: '', fileList: [] })
                    }}>批量添加店铺</a>
                    {/* </div> */}
                </Row>
                <Row type="flex">
                    <div className={style.filterList}>
                        <CheckboxList
                            width={200}
                            showCheckAll={false}
                            display={curFilter.display}
                            options={curFilter.options}
                            value={filters[filterKey] || []}
                            onChange={this.handleFilterChange}
                        />
                    </div>
                    <div className={style.resultList}>
                        <CheckboxList
                            display={resultDisplay}
                            showCollapse={false}
                            options={filteredOptions}
                            value={selected}
                            tableColumns={newTableColumns}
                            onChange={this.handleResultChange}
                        />
                    </div>
                </Row>
                <SelectedList
                    title={title}
                    className={style.selectedList}
                    display={resultDisplay}
                    items={selectedItems}
                    tableColumns={newTableColumns}
                    onChange={this.handleResultChange}
                />
                <Modal
                    title="批量添加店铺"
                    visible={this.state.batchAddVisible}
                    width="500px"
                    onOk={() => {
                        if (this.state.batchType == 1) {
                            this.batchAdd(this.state.inputText)
                        } else {
                            this.batchAdd(this.state.shopIds.join(','))
                        }
                    }}
                    onCancel={() => {
                        this.setState({ batchAddVisible: false })
                    }}
                    maskClosable={false}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: 150 }}>
                        <RadioGroup style={{ marginTop: 20, marginBottom: 20 }} onChange={(e) => {
                            this.setState({ batchType: e.target.value })
                        }} value={this.state.batchType}>
                            <Radio key={'1'} value={'1'} style={{marginRight: 60, display:isZhouheiya(this.props.groupID)?'none':'inline-block'}}>店铺ID录入</Radio>
                            <Radio key={'2'} value={'2'}>Excel导入</Radio>
                        </RadioGroup>

                        {this.state.batchType == 1 && <Row>
                            <Input style={{ width: 400, minHeight: 80 }}
                                type="textarea"
                                placeholder="在此录入门店ID，多个门店ID以“,”分隔"
                                value={this.state.inputText}
                                onChange={(e) => {
                                    this.setState({ inputText: e.target.value })
                                }}
                            />
                        </Row>}
                        {this.state.batchType == 2 &&
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Row style={{ marginBottom: 10 }}>
                                    <span href="#" style={{ marginTop: '10px', display: 'block', cursor: 'pointer' }} onClick={this.downLoadExcel}>
                                        <div style={{ display: 'flex' }}><div style={{ marginRight: 5 }}><Iconlist iconName={'downloads'} className="header" /></div><a>下载Excel模板</a></div>
                                    </span>
                                </Row>
                                <Row>
                                    <div style={{ display: 'flex' }}>
                                        <Input style={{ width: 200, backgroundColor: '#ffffff', marginLeft: 50 }} disabled placeholder='请上传标准excel格式文件' value={fileName}></Input>
                                        <div style={{ float: 'left' }}>
                                            <Upload
                                                {...props}
                                                showUploadList={false}
                                                action="/api/v1/upload?service=HTTP_SERVICE_URL_CRM&method=/crm/uploadFile.ajax"
                                                name="file"
                                                onChange={this.handleUploadChange}
                                                beforeUpload={this.handleBeforeUpload}
                                            >
                                                <Button type='ghost' style={{ marginLeft: 10 }}>选择文件</Button>
                                            </Upload>
                                        </div>
                                    </div>
                                </Row>
                            </div>}
                    </div>
                </Modal>
                <Modal
                    title="导入成功"
                    visible={this.state.successVisible}
                    width="500px"
                    maskClosable={false}
                    footer={[
                        <Button style={{ display: 'none' }} onClick={() => {
                            this.setState({ successVisible: false })
                        }}>关闭</Button>,
                        <Button type="primary" onClick={() => {
                            this.setState({ successVisible: false })
                        }}>确定</Button>,
                    ]}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '16px', marginTop: 50, marginBottom: 50 }}>
                        {`导入成功，已导入${this.state.inputTextArr.length}条店铺数据`}
                    </div>
                </Modal>
                <Modal
                    title="导入失败"
                    visible={this.state.failVisible}
                    width="500px"
                    maskClosable={false}
                    onCancel={() => {
                        this.setState({ failVisible: false })
                    }}
                    footer={[
                        <Button style={{ display: 'none' }} onClick={() => {
                            this.setState({ failVisible: false })
                        }}>关闭</Button>,
                        <Button type="primary" onClick={() => {
                            this.setState({ failVisible: false })
                        }}>确定</Button>,
                    ]}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '14px', marginTop: 30 }}>
                        <span style={{
                            wordWrap: 'break-word',
                            wordBreak: 'break-all',
                            borderRadius: '5px',
                            padding: '10px',
                            backgroundColor: '#f0f0f0'
                        }}>{`导入文件中，门店${this.state.checkArr}未匹配成功`}</span>
                        <div style={{ marginTop: 20, display: this.state.batchType == 2 ? 'block' : 'none' }}>请修改Excel后重新导入</div>
                    </div>
                </Modal>
            </div>
        );
    }
}

FilterSelector.defaultProps = {
    title: '',
    className: '',
    options: [],
    filters: [],
    extraFilters: {},
    defaultValue: [],
    tableColumns: [],
    onChange() { },
    onFilterKeyChange() { },
};

FilterSelector.propTypes = {
    /** 选择项目的名称 */
    title: PropTypes.string,
    /** 样式类 */
    className: PropTypes.string,
    /** 所有的可选项 */
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string, // 选项值
        label: PropTypes.string, // 选项名称
        [PropTypes.string]: PropTypes.string,
    })),
    /** 所有的过滤器 */
    filters: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string, // 过滤器的字段名称
        label: PropTypes.string, // 过滤器的名称
        options: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.string,
            label: PropTypes.string,
            [PropTypes.string]: PropTypes.string,
        })),
    })),
    /** 追加的过滤器 */
    extraFilters: PropTypes.shape({
        [PropTypes.string]: PropTypes.any,
    }),
    /** 默认值 */
    defaultValue: PropTypes.arrayOf(PropTypes.string),
    /** 显示类型为 table 时表格列配置 */
    tableColumns: PropTypes.arrayOf(PropTypes.any),
    /** 已选项改变时的回调函数 */
    onChange: PropTypes.func,
    /** 改变当前过滤器时触发的回调函数 */
    onFilterKeyChange: PropTypes.func,
};

export default FilterSelector;


