/**
 * 判断是不是正式线上环境: HUALALA.ENVIRONMENT === 'production-release'
 */
export const isFormalRelease = () => {
    let flag = false;
    try {
        flag = HUALALA.ENVIRONMENT === 'production-release'
    } catch (e) {
        flag = false;
    }
    return flag;
}
