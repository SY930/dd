import React, {Component} from 'react';
import registerPage from '../../../index';
import {PROMOTION_CALENDAR_GROUP, PROMOTION_CALENDAR_SHOP} from "../../constants/entryCodes";
import style from './style.less'

@registerPage([PROMOTION_CALENDAR_GROUP, PROMOTION_CALENDAR_SHOP])
class PromotionCalendar extends Component {

    render() {
        return (
            <div className={style.calendar} style={{ height: '100%', overflowY: 'auto' }} >
                <div
                    style={{
                        width: 800,
                        margin: '0 auto',
                    }}
                >
                    <h1>
                        叮咚！你想要的2019年餐饮营销日历来啦！
                    </h1>
                    <p>
                        2019年开始了，你准备好营销推广计划了么？
                    </p>
                    <img src="http://res.hualala.com/group3/M02/92/D7/wKgVw1w9u37AHk__AADwQEmPfH0972.jpg"/>
                    <p>
                        小哗为大家准备好了 <span className={style.fairRed}>《2019年餐饮营销日历》</span>，大家可以提前按照日历上的固定热点制定好自己的营销计划哦~事不宜迟，马上开始吧！
                    </p>
                    <img src="http://res.hualala.com/group3/M01/18/43/wKgVwlw-7f2x7XBWAAD-SLZsvBc734.png" alt=""/>
                    <p>
                        一月份的元旦以及腊八节已经过去了，春节临近你们的年夜饭是否开始预定了？营销活动是否开始策划了？
                    </p>
                    <img src="http://res.hualala.com/group3/M01/18/50/wKgVwlw-7g_UENquAADxyl64DEA344.png" alt=""/>
                    <h2>
                        <span className={style.fairRed}>除夕&春节（2月4日-5日）</span>
                    </h2>
                    <p>
                        由来：除夕，又称大年夜、除夜、岁除、大晦日，是农历一年最后一天的晚上，即春节前一天晚。农历十二月多为大月，有三十天，所以又称为大年三十、年三十、年三十晚、年三十夜。而十二月小月時为廿九日，有些地区又会改称二九暝。“除夕”中“除”字的本义是“去”，引申为“易”，即交替；“夕”字的本义是“日暮”，引申为“夜晚”。因而“除夕”便含有旧岁到次夕而除，明日即另换新岁的意思。
                    </p>
                    <p>
                        <span className={style.bold}>目的：</span>让会员在节日里感受到关怀与餐厅带给他的优惠
                    </p>
                    <p>
                        <span className={style.bold}>方式：</span>短信与微信（除夕与初一活动一起）
                    </p>
                    <p className={style.lastPara}><span className={style.bold}>时间：</span>前15天</p>
                    <p><span className={style.bold}>方案1：</span>积分兑换年货</p>
                    <p><span className={style.bold}>方案2：</span>家庭套餐，年夜饭（赠送灯笼，对联）</p>
                    <p><span className={style.bold}>方案3：</span>会员关怀（节日当天赠礼品）</p>
                    <p><span className={style.bold}>方案4：</span>到店满一定的消费额，送热饮</p>
                    <h2>
                        <span className={style.fairRed}>情人节（2月14日）</span>
                    </h2>
                    <p>
                        由来：情人节（英语：Valentine's Day），情人节的起源有多个版本，其中一个说法是在公元三世纪，古罗马暴君为了征召更多士兵，禁止婚礼，一名叫瓦伦丁Valentine的修士不理禁令，秘密替人主持婚礼，结果被收监，最后处死。而他死的那天就是2月14日，为纪念Valentine的勇敢精神，人们将每年的2月14日定为Valentine的纪念日。因此成了后来的“情人节”。
                    </p>
                    <p>
                        <span className={style.bold}>目的：</span>让会员在节日里感受到关怀与餐厅带给他的优惠
                    </p>
                    <p>
                        <span className={style.bold}>方式：</span>短信与微信
                    </p>
                    <p className={style.lastPara}>
                        <span className={style.bold}>时间：</span>2月10日-14日
                    </p>
                    <p>
                        <span className={style.bold}>方案1：</span>大额的储值溢价（如充1000元赠300元）
                    </p>
                    <p>
                        <span className={style.bold}>方案2：</span>积分兑换好礼（如一对杯子，一对围巾等）
                    </p>
                    <p>
                        <span className={style.bold}>方案3：</span>情人节双人套餐（也可在团购网站做宣传）
                    </p>
                    <p>
                        <span className={style.bold}>方案4：</span>可增加游戏环节，做到互动
                    </p>
                    <p>
                        <span className={style.bold}>方案5：</span>情人到店可免费获得玫瑰花一只
                    </p>

                    <h2>
                        <span className={style.fairRed}>元宵节（2月19日）</span>
                    </h2>
                    <p>
                        由来：农历正月十五元宵节，又称为“上元节”（Lantern Festival），上元佳节，是中国传统节日之一，亦是汉字文化圈的地区和海外华人的传统节日之一。司马迁创建“太初历”时，就已将元宵节确定为重大节日。正月是农历的元月，古人称夜为“宵”，而十五日又是一年中第一个月圆之夜，所以称正月十五为元宵节。又称为小正月、元夕或灯节，是春节之后的第一个重要节日。
                    </p>
                    <p>
                        <span className={style.bold}>目的：</span>让会员在节日里感受到关怀与餐厅带给他的优惠
                    </p>
                    <p>
                        <span className={style.bold}>方式：</span>短信与微信
                    </p>
                    <p className={style.lastPara}>
                        <span className={style.bold}>时间：</span>2月18日-19日
                    </p>
                    <p>
                        <span className={style.bold}>方案1：</span>积分兑换元宵
                    </p>
                    <p>
                        <span className={style.bold}>方案2：</span>制定多款家庭套餐（活动力度要大于团购）
                    </p>
                    <p>
                        <span className={style.bold}>方案3：</span>会员关怀（节日当天赠元宵甜品）
                    </p>
                    <p>
                        <span className={style.bold}>方案4：</span>到店满一定的消费额，送元宵
                    </p>
                    <img src="http://res.hualala.com/group3/M01/18/5A/wKgVwlw-7h6jwa_gAAEVMwGWhls490.png" alt=""/>
                    <h2>
                        <span className={style.fairRed}>二月二龙抬头（3月8日）</span>
                    </h2>
                    <p>
                        由来：龙头节，又称“龙抬头”或“青龙节”，是中国的传统节日之一。根据民间传说，此为主管云雨的龙王抬头之日，也意谓著在此之后雨水会渐多
                        农历二月二，人们祈望龙抬头兴云作雨、滋润万物，素有“二月二剃龙头”的说法因此，民谚说“二月二剃龙头，一年都有精神头”。每逢二月二这一天，家家理发店都是顾客盈门，生意兴隆。
                    </p>
                    <p>
                        <span className={style.bold}>目的：</span>做会员关怀，让会员知道每个节气我们不单单只做营销活动，还做关怀
                    </p>
                    <p className={style.lastPara}>
                        <span className={style.bold}>时间：</span>仅一天
                    </p>
                    <p>
                        <span className={style.bold}>方式一：</span>短信与微信关怀
                    </p>
                    <p>
                        <span className={style.bold}>方式二：</span>到店消费，每人送礼品一份
                    </p>

                    <h2>
                        <span className={style.fairRed}>三八妇女节（3月8日）</span>
                    </h2>
                    <p>
                        由来：国际劳动妇女节，全称为“联合国妇女权益和国际和平日”，在中国又称“三八”妇女节，是联合国从1975年国际妇女年开始，每年于3月8日为庆祝妇女在经济、政治和社会等领域做出的重要贡献和取得的巨大成就而设立的节日
                    </p>
                    <p>
                        <span className={style.bold}>目的：</span>做会员关怀，让会员知道每个节气我们不单单只做营销活动，还做关怀
                    </p>
                    <p>
                        <span className={style.bold}>时间：</span>仅一天
                    </p>
                    <p className={style.lastPara}>
                        <span className={style.bold}>方式：</span>短信与微信关怀（导出会员资料发起活动）
                    </p>
                    <p>
                        <span className={style.bold}>方案1：</span>当天到店所有女士可获得礼品一份
                    </p>
                    <p>
                        <span className={style.bold}>方案2：</span>消费满额赠送礼品
                    </p>

                    <img src="http://res.hualala.com/group3/M01/18/62/wKgVwlw-7irOuJ8FAADu8gz2CE4360.png" alt=""/>
                    <h2>
                        <span className={style.fairRed}>愚人节（4月1日）</span>
                    </h2>
                    <p>
                        由来：愚人节（April Fool's Day、April Fool's Day或All Fools' Day）也称万愚节、幽默节，是西方社会民间传统节日，节期在每年4月1日。愚人节与古罗马的嬉乐节和印度的欢悦节有相似之处
                    </p>
                    <p>
                        <span className={style.bold}>目的：</span>做会员关怀，让会员知道每个节气我们不单单只做营销活动，还做关怀
                    </p>
                    <p className={style.lastPara}>
                        <span className={style.bold}>时间：</span>仅一天
                    </p>
                    <p>
                        <span className={style.bold}>方案1：</span>会员到店消费满额赠送礼品
                    </p>
                    <p>
                        <span className={style.bold}>方案2：</span>大力度活动吸引顾客（如4人进店一人免单）
                    </p>
                    <img src="http://res.hualala.com/group3/M01/18/6D/wKgVwlw-7jmn5C-LAAEYRgWqKqE446.png" alt=""/>
                    <h2>
                        <span className={style.fairRed}>劳动节（5月1日）</span>
                    </h2>
                    <p>
                        由来：国际劳动节（International Labor Day或者May Day），又称五一国际劳动节、劳动节，是世界上大多数国家的劳动节。节日源于美国芝加哥城的工人大罢工，为纪念这次伟大的工人运动，1889年的第二国际成立大会上宣布将每年的五月一日定为国际劳动节。中国中央人民政府政务院于1949年12月作出决定，将5月1日确定为劳动节。
                    </p>
                    <p>
                        <span className={style.bold}>目的：</span>做会员关怀，让会员知道每个节气我们不单单只做营销活动，还做关怀
                    </p>

                    <p className={style.lastPara}>
                        <span className={style.bold}>时间：</span>5月1日-7日
                    </p>
                    <p>
                        <span className={style.bold}>方案1：</span>储值赠礼（原溢价不变，增加大额储值赠送券，为淡季铺垫）
                    </p>
                    <p>
                        <span className={style.bold}>方案2：</span>消费满额赠送礼品或菜品
                    </p>
                    <h2>
                        <span className={style.fairRed}>母亲节（5月第二个星期日）</span>
                    </h2>
                    <p>
                        由来：母亲节（Mother's Day），是一个感谢母亲的节日，这个节日最早出现在古希腊；而现代的母亲节起源于美国，是每年5月的第二个星期日。
                        母亲们在这一天通常会收到礼物，康乃馨被视为献给母亲的花，而中国的母亲花是萱草花，又叫忘忧草。
                    </p>
                    <p>
                        <span className={style.bold}>目的：</span>让会员在节日里感受到关怀与餐厅带给他的优惠
                    </p>
                    <p>
                        <span className={style.bold}>方式：</span>短信与微信
                    </p>
                    <p className={style.lastPara}>
                        <span className={style.bold}>时间：</span>前5天
                    </p>
                    <p>
                        <span className={style.bold}>方案1：</span>推出家庭套餐（感恩宴）
                    </p>
                    <p>
                        <span className={style.bold}>方案2：</span>当天携母亲到店消费即赠康乃馨一束
                    </p>
                    <img src="http://res.hualala.com/group3/M01/18/78/wKgVwlw-7knwIkbAAAEuCelYPZI658.png" alt=""/>
                    <h2>
                        <span className={style.fairRed}>六一儿童节（6月1日）</span>
                    </h2>
                    <p>
                        由来：六一国际儿童节（International Children's Day），又称儿童节，是保障世界各国儿童的生存权、保健权和受教育权，为了改善儿童的生活，为了反对虐杀儿童和毒害儿童的节日。1950年3月30日，旧的4月4日儿童节被废除。1951年6月1日，国际儿童节定名。1954年12月14日，联合国教科文组织定11月20日为国际儿童日。大多数国家通常定为每年的6月1日，所以通常称六一儿童节为国际儿童节。
                    </p>
                    <p>
                        <span className={style.bold}>目的：</span>做会员关怀，让会员知道每个节气我们不单单只做营销活动，还做关怀
                    </p>
                    <p  className={style.lastPara}>
                        <span className={style.bold}>时间：</span>仅一天
                    </p>
                    <p>
                        <span className={style.bold}>方案1：</span>当天到店儿童赠送甜品一份（或特色小吃）
                    </p>
                    <p>
                        <span className={style.bold}>方案2：</span>消费满额赠送儿童玩具（依据各门店顾客群体制定）
                    </p>
                    <h2>
                        <span className={style.fairRed}>端午节（农历5月5日）</span>
                    </h2>
                    <p>
                        由来：端午节为每年农历五月初五，又称端阳节、午日节、五月节、五日节、艾节、端五、重午、重五、午日、夏节、蒲节，本来是夏季的一个驱除瘟疫的节日，后来楚国诗人屈原于端午节投江自尽，就变成纪念屈原的节日（一说纪念吴国忠臣伍子胥的忌日），与春节、中秋等节日同属东亚文化圈的大中华地区及日本、朝鲜、韩国的重要传统节日。
                    </p>
                    <p>
                        <span className={style.bold}>目的：</span>让会员在节日里感受到关怀与餐厅带给他的优惠
                    </p>
                    <p>
                        <span className={style.bold}>方式：</span>短信与微信
                    </p>
                    <p className={style.lastPara}>
                        <span className={style.bold}>时间：</span>前后7天--10天
                    </p>
                    <p>
                        <span className={style.bold}>方案1：</span>大额的储值溢价（如充1000元赠300元）
                    </p>
                    <p>
                        <span className={style.bold}>方案2：</span>积分兑换礼品
                    </p>
                    <p>
                        <span className={style.bold}>方案3：</span>家庭套餐
                    </p>
                    <p>
                        <span className={style.bold}>方案4：</span>会员到店消费满额赠粽子
                    </p>
                    <p>
                        <span className={style.bold}>方案5：</span>赠送菜品券或代金券
                    </p>
                    <h2>
                        <span className={style.fairRed}>父亲节（6月的第三个星期日）</span>
                    </h2>
                    <p>
                        由来：2014年6月15日，星期日。父亲节，是一年中特别感谢父亲而庆祝的节日，始于二十世纪初的美国。每个国家的父亲节日期都不尽相同，也有各种的庆祝方式，大部分都与赠送礼物、家族聚餐或活动有关。全球大部份国家和地区是在6月的第三个星期日庆祝父亲节，包括香港及澳门等地。与父亲节对应还有母亲节，是在5月的第二个星期日。
                    </p>
                    <p>
                        <span className={style.bold}>目的：</span>让会员在节日里感受到关怀与餐厅带给他的优惠
                    </p>
                    <p>
                        <span className={style.bold}>方式：</span>短信与微信
                    </p>
                    <p className={style.lastPara}>
                        <span className={style.bold}>时间：</span>前5天
                    </p>
                    <p>
                        <span className={style.bold}>方案1：</span>储值赠礼（按摩椅，足浴盆等老年人所需）
                    </p>
                    <p>
                        <span className={style.bold}>方案2：</span>感恩父爱（包桌套餐）
                    </p>
                    <p>
                        <span className={style.bold}>方案3：</span>会员关怀（当日父亲到店即赠礼品一份）
                    </p>
                    <img src="http://res.hualala.com/group3/M01/18/82/wKgVwlw-7ljJTvlDAADd-Y1k3aE082.png" alt=""/>
                    <p>
                        7月份没有什么大型节日营销节点，因为到达夏天，可以推出消费满多少送啤酒、送西瓜、送冷饮的活动。
                    </p>
                    <img src="http://res.hualala.com/group3/M02/31/3A/wKgVw1w-7mX3f7kAAAEAYS9LDJQ601.png" alt=""/>
                    <h2>
                        <span className={style.fairRed}>建军节（8月1日）</span>
                    </h2>
                    <p>
                        由来：1933年7月11日，中华苏维埃共和国临时中央政府根据中央革命军事委员会6月30日的建议，决定8月1日为中国工农红军（中国人民解放军前身）成立纪念日
                    </p>
                    <p>
                        <span className={style.bold}>目的：</span>做会员关怀，让会员知道每个节气我们不单单只做营销活动，还做关怀
                    </p>
                    <p className={style.lastPara}>
                        <span className={style.bold}>时间：</span>仅一天
                    </p>
                    <p>
                        <span className={style.bold}>方案1：</span>当日当店消费军人，老兵本人5折
                    </p>
                    <p>
                        <span className={style.bold}>方案2：</span>持相关证件者可赠送一份历年阅兵式纪念册一份
                    </p>
                    <h2>
                        <span className={style.fairRed}>立秋（8月8日）</span>
                    </h2>
                    <p>
                        由来：立秋，是二十四节气中的第13个节气，更是干支历未月的结束以及申月的起始;时间在农历每年七月初一前后(公历8月7-9日之间)。"秋"就是指暑去凉来，意味着秋天的开始。到了立秋，梧桐树开始落叶，因此有"落叶知秋"的成语。从文字角度来看，"秋"字由禾与火字组成，是禾谷成熟的意思。秋季是天气由热转凉，再由凉转寒的过渡性季节，立秋是秋季的第一个节气。
                    </p>
                    <p>
                        <span className={style.bold}>目的：</span>做会员关怀，让会员知道每个节气我们不单单只做营销活动，还做关怀
                    </p>
                    <p>
                        <span className={style.bold}>时间：</span>仅当天
                    </p>
                    <p className={style.lastPara}>
                        <span className={style.bold}>方式：</span>短信与微信关怀
                    </p>
                    <p>
                        <span className={style.bold}>方案1：</span>针对积分会员与储值余额较低会员赠送肉品 券一张
                    </p>
                    <p>
                        <span className={style.bold}>方案2：</span>消费满额赠送酒水，饮品，菜品（提高桌均）
                    </p>

                    <h2>
                        <span className={style.fairRed}>七夕情人节（农历7月7日）</span>
                    </h2>
                    <p>
                        由来：七夕节，又名乞巧节、七巧节或七姐诞，发源于中国，是华人地区以及东亚各国的传统节日，该节日来自于牛郎与织女的传说，在农历七月初七庆祝（日本在明治维新后改为阳历7月7日）。因为此日活动的主要参与者是少女，而节日活动的内容又是以乞巧为主，所以人们称这天为“乞巧节”或“少女节”、“女儿节”。2006年5月20日，七夕被中国国务院列入第一批国家非物质文化遗产名录。
                        七夕节以牛郎织女的民间传说为载体，表达的是已婚男女之间不离不弃、白头偕老”的情感，恪守的是双方对爱的承诺。随着时间演变，七夕现已成为中国情人节。
                    </p>
                    <p>
                        <span className={style.bold}>目的：</span>做会员关怀，让会员知道每个节气我们不单单只做营销活动，还做关怀
                    </p>
                    <p className={style.lastPara}>
                        <span className={style.bold}>时间：</span>仅当天
                    </p>
                    <p>
                        <span className={style.bold}>方案1：</span>情侣到店消费送礼品一份（鲜花，装饰品等成对的产品）
                    </p>
                    <p>
                        <span className={style.bold}>方案2：</span>会员双人套餐
                    </p>
                    <img src="http://res.hualala.com/group3/M02/31/44/wKgVw1w-7nWDT9FiAADgA3K0jOQ166.png" alt=""/>
                    <h2>
                        <span className={style.fairRed}>中秋节（农历八月十五）</span>
                    </h2>
                    <p>
                        由来：中秋节，是我国最重要的传统节日之一，为每年农历八月十五。“中秋”一词，最早见于《周礼》。根据我国古代历法，一年有四季，每季三个月，分别被称为孟月、仲月、季月三部分，因此秋季的第二月叫仲秋，又因农历八月十五日，在八月中旬，故称“中秋”。到唐朝初年，中秋节才成为固定的节日。中秋节一般有吃月饼以及赏月的习俗。
                    </p>
                    <p>
                        <span className={style.bold}>目的：</span>让会员在节日里感受到关怀与餐厅带给他的优惠
                    </p>
                    <p>
                        <span className={style.bold}>方式：</span>短信与微信
                    </p>
                    <p className={style.lastPara}>
                        <span className={style.bold}>时间：</span>前后7天
                    </p>
                    <p>
                        <span className={style.bold}>方案1：</span>大额的储值溢价（如充1000元赠300元）
                    </p>
                    <p>
                        <span className={style.bold}>方案2：</span>积分兑换好礼（可兑换月饼）
                    </p>
                    <p>
                        <span className={style.bold}>方案3：</span>会员中秋特价菜品
                    </p>
                    <p>
                        <span className={style.bold}>方案4：</span>中秋家庭套餐
                    </p>
                    <p>
                        <span className={style.bold}>方案5：</span>到店满一定的消费额，送积分卡
                    </p>
                    <h2>
                        <span className={style.fairRed}>教师节（9月10日）</span>
                    </h2>
                    <p>
                        由来：教师节是一个感谢教师为教育事业所做贡献的节日，不同国家定订的教师节时间不同，我国的教师节为每年的9月10日。1985年，第六届全国人大常委会第九次会议同意了国务院关于建立教师节的议案，会议决定每年的9月10日为教师节，1994年联合国教科文组织（UNESCO）定每年10月5日为“世界教师日”。2014年9月10日，是新中国的第30个教师节。
                    </p>
                    <p>
                        <span className={style.bold}>目的：</span>做会员关怀，让会员知道每个节气我们不单单只做营销活动，还做关怀
                    </p>
                    <p className={style.lastPara}>
                        <span className={style.bold}>时间：</span>仅当天
                    </p>
                    <p>
                        <span className={style.bold}>方案1：</span>当日携老师到店消费赠礼品（教师当餐免单）
                    </p>
                    <p>
                        <span className={style.bold}>方案2：</span>包桌套餐（谢师宴)
                    </p>
                    <img src="http://res.hualala.com/group3/M01/18/A2/wKgVwlw-7oa-IYcFAADaDqv44_U341.png" alt=""/>
                    <h2>
                        <span className={style.fairRed}>国庆节（10月1日）</span>
                    </h2>
                    <p>
                        由来：国庆节，也称国庆日、国庆纪念日，是指由一个国家制定的用来纪念国家本身的法定节日，通常是这个国家的独立、宪法的签署、或其他有重大意义的周年纪念日。在这个日子里，每个国家都会举行各种各样的庆典活动。
                        在我国，国庆节特指中华人民共和国正式成立的纪念日，因此全国各地人民会在每年的10月1日举行庆祝活动。
                    </p>
                    <p>
                        <span className={style.bold}>目的：</span>让会员在节日里感受到关怀与餐厅带给他的优惠
                    </p>
                    <p>
                        <span className={style.bold}>方式：</span>短信与微信
                    </p>
                    <p className={style.lastPara}>
                        <span className={style.bold}>时间：</span>前后7天
                    </p>
                    <p>
                        <span className={style.bold}>方案1：</span>储值赠券（针对节日后淡季赠券，或午餐券
                    </p>
                    <p>
                        <span className={style.bold}>方案2：</span>积分兑换好礼（依据门店位置兑换冬季礼品）
                    </p>
                    <p>
                        <span className={style.bold}>方案3：</span>到店满一定的消费额，送菜品（提升桌均）
                    </p>
                    <img src="http://res.hualala.com/group3/M01/18/AB/wKgVwlw-7paFz2f9AADlnEN0bB0317.png" alt=""/>
                    <h2>
                        <span className={style.fairRed}>双十一光棍节&购物狂欢（11.11）</span>
                    </h2>
                    <p>
                        由来：光棍节是一种流传于年轻人的娱乐性节日，以庆祝自己仍是单身一族为骄傲("光棍"的意思便是"单身")。11月11日，光棍节，源于这一天日期里有四个阿拉伯数字"1"形似四根光滑的棍子，而光棍在中文有单身的意思，所以光棍节是单身一族的一个另类节日，这个日子便被定为"光棍节"(One's Day)。光棍节产生于校园，并通过网络等媒介传播，逐渐形成了一种光棍节的文化。如今越来越多的人选在光棍节结婚，于此同时，也是各大商家以脱光为由打折促销的时期。
                        双十一一般指双十一购物狂欢节双十一购物狂欢节，是指每年11月11日的网络促销日，源于淘宝商城（天猫）2009年11月11日举办的网络促销活动，当时参与的商家数量和促销力度有限，但营业额远超预想的效果，于是11月11日成为天猫举办大规模促销活动的固定日期。双十一已成为中国电子商务行业的年度盛事，并且逐渐影响到国际电子商务行业。
                    </p>
                    <p className={style.lastPara}>
                        <span className={style.bold}>时间：</span>仅一天
                    </p>
                    <p>
                        <span className={style.bold}>方案1：</span>储值1111元赠送111元代金券2张（午餐券）
                    </p>
                    <p>
                        <span className={style.bold}>方案2：</span>人均消费111元以上九折或赠送肉品代金券
                    </p>
                    <p>
                        <span className={style.bold}>方案3：</span>使用111积分兑换礼品（菜品，酒水等）
                    </p>
                    <img src="http://res.hualala.com/group3/M02/31/63/wKgVw1w-7qPkfBEVAAD_UJfVg_I018.png" alt=""/>
                    <h2>
                        <span className={style.fairRed}>圣诞节&平安夜（12.24-25）</span>
                    </h2>
                    <p>
                        由来：平安夜（silent Night），又称圣诞夜（Christmas Eve），即圣诞前夕（12月24日），在大部份基督教社会是圣诞节日庆祝节日之一。传统教会的圣诞期在平安夜开始。除非当日是星期日（参看待降节），守夜的聚会据说是在12月24日早上。然而，在午夜前参加圣诞节的聚会是不被允许的。圣诞季节继续直至1月4日，如当日是星期六，则至1月5日，当主显节（显现日）庆祝时。
                        <br/>
                        由来：圣诞节(Christmas)本身是一个宗教节，用来庆祝耶稣的诞辰，因而又名耶诞节，位于每年12月25日，这是西方国家一年中最重要的节日。在圣诞节，大部分的天主教教堂都会先在12月24日的平安夜及12月25日凌晨举行子夜弥撒；而基督教的另一分支——东正教的圣诞节庆祝则在每年的1月7日。
                    </p>
                    <p>
                        <span className={style.bold}>目的：</span>做会员关怀，让会员知道每个节气我们不单单只做营销活动，还做关怀
                    </p>
                    <p className={style.lastPara}>
                        <span className={style.bold}>时间：</span>2天
                    </p>
                    <p>
                        <span className={style.bold}>方案1：</span>会员到店消费即送平安果一个
                    </p>
                    <p>
                        <span className={style.bold}>方案2：</span>到店满一定的消费额赠送（热饮，围巾）
                    </p>
                    <br/>
                    <br/>
                    <p>
                        作为一个餐饮市场／策划／营销人员，如果能对即将到来的重要节日、事件时间点，提前做到心中有数，无疑会使你的餐饮品牌宣传工作事半功倍。
                    </p>
                    <br/>
                    <p>
                        祝大家：猪年大吉，猪事顺意！
                    </p>
                    <p>
                        当然，如果想要《2019年餐饮营销日历》PDF完整版，欢迎关注“<span className={style.fairRed}>哗啦啦餐饮学堂</span>”公众号，回复“<span className={style.fairRed}>日历</span>”即可获取。
                    </p>
                    <img src="http://res.hualala.com/group3/M02/94/23/wKgVw1w9vIqkE0JFAAKrm7BcNf8597.png" alt=""/>
                </div>
            </div>
        )
    }
}

export default PromotionCalendar;
