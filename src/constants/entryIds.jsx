//页面id,用来控制页面中各种操作权限，例如 编辑 删除 等，权限控制由entryId 和 rightCode 共同控制

let flag = HUALALA.ENVIRONMENT === 'production-release';//true 为线上环境
console.log(flag,'flag================')
export const BASIC_PROMOTION_MANAGE_PAGE = flag ? '10000922' : '10000398'; 
export const SPECIAL_PROMOTION_MANAGE_PAGE = flag ? '10000932' : '10000400';


