
import { isZhouheiya, isGeneral } from "../../../constants/WhiteList";

export default (ID) => {
    //1、只针对周黑鸭的条件要用&&；2、要对之前的做隐藏的要用||;
    //1、 isShow为true
    //this.rightControl && this.rightControl.shopIDList && this.rightControl.shopIDList.isShow
    //2、 isShow为false
    //(!this.rightControl || !this.rightControl.isVipBirthdayMonth || this.rightControl.isVipBirthdayMonth.isShow)
    if(isZhouheiya(ID)) {
        return [
            {
                key: '88',
                activityList: {
                    giveTypeOption: ['1']
                },
            },
            // {
            //     key: '30',
            //     isVipBirthdayMonth: {
            //         isShow: false,
            //         defaultValue: '0'
            //     },
            //     auditSet: {
            //         isShow: true
            //     },
            // }
        ]
    }
    
    return []
}