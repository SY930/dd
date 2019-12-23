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
                        叮咚！你想要的2020年餐饮营销日历来啦！
                    </h1>
                    <p>
                        这届餐饮人的共同难题：今天营销该怎么做？想做一个：<span className={style.fairRed}>有创意、走心、符合节日氛围</span>的活动，真的太太太难了。
                    </p>
                    <br/>
                    <p>
                        餐饮人的福利来啦！！！让你餐饮营销不再愁。小哗给大家整理了一份《2020年餐饮营销日历》供大家参考～
                    </p>
                    <img src="http://res.hualala.com/basicdoc/18329428-a273-4816-b233-9251d53f53fd.png" alt=""></img>
                    <h2>一月营销日历</h2>
                    <img src="http://res.hualala.com/basicdoc/194a5abe-e01d-4ee7-9034-6c5c079602d0.png" alt=""></img>
                    <h3>元旦节</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>元旦·开年领好礼</p>
                        <p><span className={style.fairRed}>活动时间：</span>1月1日—1月10日（时间不宜过长）</p>
                        <p><span className={style.fairRed}>方案1：</span>买三免一，例如消费4份免单最低的一份</p>
                        <p><span className={style.fairRed}>方案2：</span>累计消费送礼，激励顾客消费达标赠送相应礼品</p>
                        <p><span className={style.fairRed}>方案3：</span>摇奖活动，大转盘抽奖可配置代金券、菜品、酒水等</p>
                    </div>
                    <h3>腊八节</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>来碗腊八粥</p>
                        <p><span className={style.fairRed}>活动时间：</span>1月2日（限节日当天）</p>
                        <p><span className={style.fairRed}>方案1：</span>关注送礼，当天到店消费，关注公众号免费领取腊八粥</p>
                        <p><span className={style.fairRed}>方案2：</span>群发短信，将节日问候及节日活动及时传递给每一位顾客</p>
                    </div>
                    <h3>除夕&春节</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>年夜饭过团圆夜</p>
                        <p><span className={style.fairRed}>活动时间：</span>1月10日-1月31日（节日前15天）</p>
                        <p><span className={style.fairRed}>方案1：</span>随机立减，满X额随机减一定金额，顾客获得幸福感</p>
                        <p><span className={style.fairRed}>方案2：</span>限时免费领取礼品（对联、灯笼、吉祥物），达到短期拉新的效果</p>
                        <p><span className={style.fairRed}>方案3：</span>满赠，顾客到店消费一定金额，送热饮/菜品</p>
                    </div>
                    <h2>二月营销日历</h2>
                    <img src="http://res.hualala.com/basicdoc/ffc25b38-8b44-4f98-9665-932290a73f04.png" alt=""></img>
                    <h3>元宵节</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>喜闹元宵兑大奖</p>
                        <p><span className={style.fairRed}>活动时间：</span>2月1日-2月8日</p>
                        <p><span className={style.fairRed}>活动方案1：</span>积分兑换，会员消费满X元送积分，积分可兑换元宵</p>
                        <p><span className={style.fairRed}>活动方案2：</span>组合减免，可制定多款家庭团圆套餐，购买套餐组合即可享受相应折扣价（活动力度大于团购）</p>
                        <p><span className={style.fairRed}>活动方案3：</span>限时免费领取礼品，节日当天赠送元宵甜品券</p>
                    </div>
                    <h3>情人节</h3>
                    <div>
                        <p>活动主题：情人双双寻大礼</p>
                        <p>活动时间：2月10日-14日</p>
                        <p><span className={style.fairRed}>方案1：</span>分享裂变，将活动分享给好友，好友参与即可获礼品，有利于拉新</p>
                        <p><span className={style.fairRed}>方案2：</span>积分兑好礼，会员消费满X积分可兑换礼品（如一对杯子、围巾、玫瑰花等）</p>
                        <p><span className={style.fairRed}>方案3：</span>第二份半价，适合情侣消费，属于更实在的折扣优惠，与节日氛围吻合</p>
                        <p><span className={style.fairRed}>方案4：</span>有奖活动，增加游戏环节（如亲吻、拥抱时间）晒图赢对应优惠</p>
                        <p><span className={style.fairRed}>方案5：</span>关注送礼，用户关注公众号后可赠2杯饮品，刺激会员关注</p>
                    </div>
                    <h2>三月营销日历</h2>
                    <img src="http://res.hualala.com/basicdoc/6bf70d6b-3dc1-418e-97a6-c2f2e3b7e5df.png" alt=""></img>
                    <h3>女生节&妇女节</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>翻牌吧，女王！</p>
                        <p><span className={style.fairRed}>活动时间：</span>3月7日-8日</p>
                        <p><span className={style.fairRed}>方案1：</span>免费领取，当天到店所有女士限时可领取礼品一份</p>
                        <p><span className={style.fairRed}>方案2：</span>随机立减，消费满X元随机立减一定金额，顾客可获得幸福感</p>
                    </div>
                    <h2>四月营销日历</h2>
                    <img src="http://res.hualala.com/basicdoc/eb8e27b2-553b-44f4-93f4-563eb583f6ef.png" alt=""></img>
                    <h3>愚人节</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>愚你同乐</p>
                        <p><span className={style.fairRed}>活动时间：</span>4月1日（仅限当天）</p>
                        <p><span className={style.fairRed}>方案1：</span>分享裂变，活动分享好友参与后，好友获得礼品，有利于获得新用户</p>
                        <p><span className={style.fairRed}>方案2：</span>买三免一，消费满X份菜品即可在X中免单Y份最低价菜品</p>
                    </div>
                    <h2>五月营销日历</h2>
                    <img src="http://res.hualala.com/basicdoc/906790a6-fb8e-407a-bf00-bd147db1c809.png" alt=""></img>
                    <h3>劳动节</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>五一疯狂逛吃</p>
                        <p><span className={style.fairRed}>活动时间：</span>5月1日-7日</p>
                        <p><span className={style.fairRed}>方案1：</span>加价升级换新，例如：消费满88元，点中杯拿铁，加2元可升级成大杯拿铁</p>
                        <p><span className={style.fairRed}>方案2：</span>膨胀大礼包，参与活动领礼品，邀请好友助力礼品更丰厚</p>
                    </div>
                    <h3>母亲节</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>感谢最漂亮的妈妈</p>
                        <p><span className={style.fairRed}>活动时间：</span>5月5日-5月10日（提前5天举行）</p>
                        <p><span className={style.fairRed}>方案1：</span>报名活动，公众号发文章留言互动，说出母亲最感动的一件事，上榜者送菜品</p>
                        <p><span className={style.fairRed}>方案2：</span>晒图集赞，推出“我与妈妈的合照”并发送指定文字，集赞到店即可送菜品</p>
                        <p><span className={style.fairRed}>方案3：</span>免费领取，当天母亲到店消费即免费送康乃馨一朵</p>
                    </div>
                    <h2>六月营销日历</h2>
                    <img src="http://res.hualala.com/basicdoc/f9a8d36c-8ed6-4f2a-b71a-c2d0785134c6.png" alt=""></img>
                    <h3>儿童节</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>谁还不是个宝宝</p>
                        <p><span className={style.fairRed}>活动时间：</span>6月1日（仅限当天）</p>
                        <p><span className={style.fairRed}>方案1：</span>当天到店儿童赠送甜品一份（或特色小吃）</p>
                        <p><span className={style.fairRed}>方案2：</span>朋友圈晒出“童年照”，并发送指定文字，到店即可兑换限量菜品一份</p>
                        <p><span className={style.fairRed}>方案3：</span>消费满额送礼，例如送儿童玩具等，结合门店顾客群体制定</p>
                    </div>
                    <h3>父亲节</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>“爸”气好礼等你来</p>
                        <p><span className={style.fairRed}>活动时间：</span>6月16日-21日</p>
                        <p><span className={style.fairRed}>方案1：</span>累计消费送礼，例如：按摩椅、足浴盆等适合父母的礼物</p>
                        <p><span className={style.fairRed}>方案2：</span>组合减免，感恩父爱（包桌套餐）购买X组菜品组合即可享受相应折扣或减价</p>
                        <p><span className={style.fairRed}>方案3：</span>节日当天，父亲到店免费领取相应礼品</p>
                    </div>
                    <h3>端午节</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>好礼接“粽”而来</p>
                        <p><span className={style.fairRed}>活动时间：</span>6月19日-30日（前后7-10天，需提前准备）</p>
                        <p><span className={style.fairRed}>方案1：</span>摇奖活动，例如：大转盘抽奖送代金券、凉菜、酒水、饮料、粽子礼盒等</p>
                        <p><span className={style.fairRed}>方案2：</span>组合减免/折扣，购买X组菜品组合即可享受相应折扣或减价</p>
                    </div>
                    <h2>七月营销日历</h2>
                    <img src="http://res.hualala.com/basicdoc/74f12fce-016b-4689-9b4e-4d6d0a64da4c.png" alt=""></img>
                    <p>天气逐渐炎热，暑期来临，可以准备一些降暑茶饮。</p>
                    <h2>八月营销日历</h2>
                    <img src="http://res.hualala.com/basicdoc/df2760fc-95e3-4ae7-8a60-7148a5e7e2c5.png" alt=""></img>
                    <h3>建军节</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>热血铸军魂</p>
                        <p><span className={style.fairRed}>活动时间：</span>8月1日（仅限当天）</p>
                        <p><span className={style.fairRed}>方案1：</span>折扣活动，军人、老兵本人当日到店消费享5折</p>
                        <p><span className={style.fairRed}>方案2：</span>免费领取，持相关证件者可赠送一份菜品</p>
                    </div>
                    <h3>七夕节</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>七夕“价”给你</p>
                        <p><span className={style.fairRed}>活动时间：</span>8月25日（仅限当天）</p>
                        <p><span className={style.fairRed}>方案1：</span>消费满额送礼，情侣到店消费送礼品（成对的产品）</p>
                        <p><span className={style.fairRed}>方案2：</span>菜品推荐，可享会员专享双人套餐</p>
                    </div>
                    <h2>九月营销日历</h2>
                    <img src="http://res.hualala.com/basicdoc/6381aca8-3188-482a-8945-89b36e369b67.png" alt=""></img>
                    <h3>教师节</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>老师您辛苦啦！</p>
                        <p><span className={style.fairRed}>活动时间：</span>9月10日（仅限当天）</p>
                        <p><span className={style.fairRed}>方案1：</span>消费返礼品，消费后获得奖励，促使顾客再次复购</p>
                        <p><span className={style.fairRed}>方案2：</span>折扣，包桌套餐（谢师宴）</p>
                        <p><span className={style.fairRed}>方案3：</span>节日当天，凭教师资格证到店免费领取相应礼品</p>
                    </div>
                    <h2>十月营销日历</h2>
                    <img src="http://res.hualala.com/basicdoc/e6edd62e-7b10-423f-bdb5-f5c7efca8c17.png" alt=""></img>
                    <h3>国庆节&中秋节</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>双节同庆 好礼嗨翻天</p>
                        <p><span className={style.fairRed}>活动时间：</span>9月25日-10月7日（重点节日营销）</p>
                        <p><span className={style.fairRed}>方案1：</span>群发礼品，提前赠送优惠券或免费菜品券，吸引顾客到店消费</p>
                        <p><span className={style.fairRed}>方案2：</span>加价换购，指定消费满X元再加Y元可换购指定菜品或月饼礼盒</p>
                        <p><span className={style.fairRed}>方案3：</span>随机立减，顾客到店消费满X元随机立减一定金额，突出顾客惊喜</p>
                    </div>
                    <h2>十一月营销日历</h2>
                    <img src="http://res.hualala.com/basicdoc/365e0a64-976c-4c17-8100-31a0fa6071b5.png" alt=""></img>
                    <h3>双十一</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>双十一 我拼啦！</p>
                        <p><span className={style.fairRed}>活动时间：</span>11月11日（仅限当天）</p>
                        <p><span className={style.fairRed}>方案1：</span>储值1111元，送111元代金券两张</p>
                        <p><span className={style.fairRed}>方案2：</span>人均消费111元以上，打9折或送代金券</p>
                        <p><span className={style.fairRed}>方案3：</span>积分兑换，使用111积分兑换礼品（菜品、酒水等）</p>
                    </div>
                    <h2>十二月营销日历</h2>
                    <img src="http://res.hualala.com/basicdoc/60dc80cc-3a82-4743-8fc4-4b864e08d607.png" alt=""></img>
                    <h3>平安夜&圣诞节</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>圣诞狂欢 等你来</p>
                        <p><span className={style.fairRed}>活动时间：</span>12月24日-25日</p>
                        <p><span className={style.fairRed}>方案1：</span>会员到店消费即可送平安果一个</p>
                        <p><span className={style.fairRed}>方案2：</span>到店消费满一定的金额赠送奖品（热饮、围巾等）</p>
                        <p><span className={style.fairRed}>方案3：</span>摇奖活动，大转盘摇奖（代金券、凉菜、酒水、饮料等）</p>
                    </div>
                    <p>当然，以上各式活动，哗啦啦营销中心均可以实现，丰富的活动形式满足餐饮商户多样营销需求~</p>
                    <br/>
                    <p>如果想要《2020年餐饮营销日历》PDF完整版，欢迎关注“<span className={style.fairRed}>哗啦啦产品社区</span>”公众号，回复“<span className={style.fairRed}>2020</span>”即可获取小哗祝大家2020年餐饮营销不再愁！</p>
                    <img style={{ display: 'block', width: 200, margin: '0 auto 30px' }} src="http://res.hualala.com/basicdoc/b59d7f40-180b-469d-870e-f2855bc0f85f.png" alt=""/>
                </div>
            </div>
        )
    }
}

export default PromotionCalendar;
