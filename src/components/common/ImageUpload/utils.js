/** 图片文件类型 */
export const FILE_TYPE_IMAGE = '0';
/** 视频文件类型 */
export const FILE_TYPE_VIDEO = '1';
/** 其他文件类型 */
export const FILE_TYPE_OTHERS = '2';

export const FILE_THUMBNAIL = {
    [FILE_TYPE_VIDEO]: '/img/video.png',
    [FILE_TYPE_OTHERS]: '/img/document.png',
};

/**
 * 根据文件名获取文件类型
 * @param {string} filename 文件名
 */
export function getFileTypeByName(filename) {
    const match = filename.match(/[^.]+$/);
    if (!match) return FILE_TYPE_OTHERS;
    switch (match[0]) {
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
            return FILE_TYPE_IMAGE;
        case 'mp4':
        case 'avi':
            return FILE_TYPE_VIDEO;
        default:
            return FILE_TYPE_OTHERS;
    }
}
