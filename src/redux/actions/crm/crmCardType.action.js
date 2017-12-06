export const CRMCARD_LIST = 'CRMCARD_LIST';
export const CRMCARD_PAGE_STYLE = 'CRMCARD_PAGE_STYLE';
export const CRMCARD_SELECT_CARD_TYPE_VISIBLE = 'crm card type:: select card type visible';
export const CRMCARD_SELECT_CARD_TYPE = 'crm card:: select card type';
export function clickPic(value) {
    return {
        type: CRMCARD_LIST,
        listType: value,
    }
}
export function pageStyle(value) {
    return {
        type: CRMCARD_PAGE_STYLE,
        pageStyle: value,
    }
}

export function UpdateSelectCardVisible(value) {
    return {
        type: CRMCARD_SELECT_CARD_TYPE_VISIBLE,
        payload: value.visible,
    }
}

export function UpdateSelectCardType(value) {
    return {
        type: CRMCARD_SELECT_CARD_TYPE,
        payload: value.type,
    }
}
