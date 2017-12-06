import {
    fetchData,
} from '../../../../helpers/util'
import _ from 'lodash'
import getApiConfig from '../../../../helpers/callserver'

// 初始化元素
export const initElement = (init, callback) => {
    const elements = init.normal.concat(init.more)
    const fetchs = []

    elements.forEach((element) => {
        if (element.fetch) {
            const fetch = element.fetch
            const fp = fetchData(fetch.url, fetch.params, null, { path: 'data' })
                .then((data) => {
                    if (element.type === 'select-tree') {
                        formatTreeData(element, data, element.format)
                    } else if (element.type === 'select-simple') {
                        formatSelectData(element, data, element.format)
                    }
                })
            fetchs.push(fp)
        }
    })

    Promise.all(fetchs).then(() => {
        init.ready = true
        callback(init)
    })
}

// 格式化下拉列表数据
export const formatSelectData = (element, data, option) => {
    const records = data.records

    if (records && records.length > 0) {
        records.forEach((op) => {
            element.data.push({
                name: op[option.label],
                value: op[option.value],
            })
        })
    }
}

// 格式化树数据
export const formatTreeData = (element, data, option) => {
    const loop = (nodes, key) => {
        nodes = nodes.map((node, i) => {
            let result = {}
            const value = ''

            node.key = `${key}-${i}`

            if (node.childs && node.childs.length > 0) {
                node.children = loop(node.childs, node.key)
            }

            result = {
                label: node[option.label],
                value: node[option.value],
                key: node.key,
            }

            if (node.children) {
                result.children = node.children
            }

            return result
        })

        return nodes
    }

    data.records = loop(data.records, '0')
    element.data = data.records
}

// 格式化查询参数
export const formatSearchParams = (params, fields) => {
    const result = {}

    if (params) {
        for (const [k, v] of Object.entries(params)) {
            const element = fields.find((el) => {
                return el.name === k
            })

            switch (element.type) {
                case 'input-date':
                    result[k] = v.format('YYYY-MM-DD')
                    break
                case 'input-month':
                    result[k] = v.format('YYYY-MM')
                    break
                case 'select-tree':
                    result[k] = v.value
                    break
                case 'select-good':
                    result[k] = v.value
                    break
                case 'select-repertory':
                    result[k] = v.value
                    break

                default:
                    result[k] = v
            }
        }
    }

    return result
}

// 当前视角
export const getCurrentDemandType = (value) => {
    if (value === 3) {
        value = 1
    } else if (value === 4) {
        value = 0
    }

    return value
}

// 导出
export const exportFormExcel = (groupID, url, params, id) => {
    const action = getApiConfig(url).url
    const form = $(`<form id="${id}Export"></form>`)

    form.attr('action', action)
    form.attr('method', 'get')
    form.attr('target', '_self')

    form.append(`<input type="hidden" name="groupID" value="${groupID}" />`)

    for (const [k, v] of Object.entries(params)) {
        form.append(`<input type="hidden" name="${k}" value="${v}" />`)
    }

    $('body').append(form)
    $(`#${id}Export`).submit()

    _.defer(() => $(`#${id}Export`).remove())
}
