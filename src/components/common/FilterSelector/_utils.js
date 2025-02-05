/**
 * 根据过滤器对选项进行过滤
 * 过滤逻辑：过滤器间取交集，过滤器内取并集
 * @param {Array} options 选项
 * @param {Any} filters 过滤器
 */
export function filterOptions(options, filters = {}) {
    const filterKeys = Object.keys(filters).filter(
        key => filters[key] && filters[key].length > 0
    );
    const filterOption = (value, filter = []) => {
        if (value === undefined) return false;
        const _filter = Array.isArray(filter) ? filter : [filter];
        const values = value.split ? value.split(',') : [value];
        return !!values.find(item => _filter.find(f => f == item));
    };
    return options.filter(option => !filterKeys.find(
        key => !filterOption(option[key], filters[key])
    ));
}
