export const CRM_RECHARGEPACKAGE_MODAL_DETAIL_SHOW = 'crm:: crmRechargePackage detail modal visible show';
export const CRM_RECHARGEPACKAGE_MODAL_DETAIL_HIDE = 'crm:: crmRechargePackage detail modal visible hide';

export function showModal() {
    return {
        type: 'CRM_RECHARGEPACKAGE_MODAL_DETAIL_SHOW',
    };
}

export function hideModal() {
    return {
        type: 'CRM_RECHARGEPACKAGE_MODAL_DETAIL_HIDE',
    };
}
