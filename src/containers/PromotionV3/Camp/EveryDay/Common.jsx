
const weekMap = ['', '一', '二', '三', '四', '五', '六', '日'];
const weekList = (() => {
    const week = [];
    for(let i = 1; i < 8; i++) {
        week.push('w'+i);
    }
    return week;
})();
const monthList = (() => {
    const month = [];
    for(let i = 1; i < 32; i++) {
        month.push('m'+i);
    }
    return month;
})();

// 对应传入的值
// const cycleOpts = [
//     { label: '每日', value: '' },
//     { label: '每周', value: 'w' },
//     { label: '每月', value: 'm' },
// ];
export {
    weekMap, weekList, monthList,
}
