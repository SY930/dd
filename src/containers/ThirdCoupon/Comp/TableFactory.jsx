import React, { Component } from 'react';
import _ from 'lodash';
import axios from 'axios';
import { connect } from 'react-redux';

const DEFAULT_OPTIONS = {
    mapStateToProps: undefined,
    mapLoadingToProps: loading => ({ loading }),
    mapDataToProps: data => ({ data }),
    mapErrorToProps: error => ({ error }),
};


export default function connectTable(options) {
    return (Comp) => {
        const finalOptions = {
            ...DEFAULT_OPTIONS,
            ...options,
        };
        const {
            mapLoadingToProps,
            mapDataToProps,
            mapErrorToProps,
            callserver,
            columns,
        } = finalOptions;

        class AsyncTableComponent extends Component {
            constructor(props) {
                super(props);
                this.state = {
                    dataSource: [],
                    loading: true,
                    // total: 1,
                    page: {},
                };
            }
            componentDidMount() {
                this.getData();
            }
            getData = (opts = {}) => {
                const { params, $$groupID } = this.props;
                const dataParams = _.cloneDeep(params)
                axios.post(`/api/v1/universal?${callserver}`, {
                    service: 'HTTP_SERVICE_URL_PROMOTION_DOUYIN',
                    method: callserver,
                    type: 'post',
                    data: { groupID: $$groupID, ...dataParams, ...opts },
                }).then((response) => {
                    this.setState({ dataSource: response.data, loading: false, page: response.data.pageInfo ? response.data.pageInfo : {} });
                }).catch((error) => {
                    this.setState({ error, loading: false });
                });
            }
            render() {
                const { dataSource, error, loading } = this.state;
                const dataProps = dataSource ? mapDataToProps(dataSource) : undefined;
                const errorProps = error ? mapErrorToProps(error) : undefined;
                return (
                    <Comp
                        {...mapLoadingToProps(loading)}
                        {...errorProps}
                        {...this.props}
                        dataSource={dataProps}
                        columns={columns}
                        getData={this.getData}
                        // total={this.state.total}
                        page={this.state.page}
                    />
                );
            }
        }

        function mapStateToProps({ user }) {
            return {
                $$groupID: user.getIn(['accountInfo', 'groupID']),
            }
        }

        const TableFactory = connect(mapStateToProps)(AsyncTableComponent)
        TableFactory.getData = new AsyncTableComponent().getData;
        return TableFactory
    };
}
