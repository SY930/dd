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
                        叮咚！你想要的2021年餐饮营销日历来啦！
                    </h1>
                    <p>
                        这届餐饮人的共同难题：今天营销该怎么做？想做一个：<span className={style.fairRed}>有创意、走心、符合节日氛围</span>的活动，真的太太太难了。
                    </p>
                    <br/>
                    <p>
                        餐饮人的福利来啦！！！让你餐饮营销不再愁。小哗给大家整理了一份《2021年餐饮营销日历》供大家参考～
                    </p>
                    <img src="http://res.hualala.com/basicdoc/e6980561-5650-45ca-9658-9df1eb7d9fdc.png" alt=""></img>
                    <h2>礼品卡小程序</h2>
                    <div>
                        <p>礼品卡小程序使用场景：</p>
                        <p>春节、情人节、母亲节、父亲节、教师节、中秋节这样人情来往的节日，可制作专属节日礼品卡配合特定卡面购买、赠送，实现顾客线上送礼表达心意。</p>
                    </div>
                    <img src="http://res.hualala.com/basicdoc/60aa0e26-7ab5-438a-8703-4fd1adc85e4a.png" alt=""></img>
                    
                    
                    <h2>一月营销日历</h2>
                    <img src="http://res.hualala.com/basicdoc/32d0d3ee-9381-4d02-ac57-8fffaa13ebf2.png" alt=""></img>
                    <h3>元旦节</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>元旦·开年领好礼</p>
                        <p><span className={style.fairRed}>活动时间：</span>1月1日—1月3日（时间不宜过长）</p>
                        <p>
                            <span className={style.fairRed}>营销方案：</span>
                            <p><img src="http://res.hualala.com/basicdoc/0eca1cee-1b68-4216-895e-627c22884a1c.png" alt=""></img></p>
                        </p>
                    </div>
                    <h3>腊八节</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>来碗腊八粥</p>
                        <p><span className={style.fairRed}>活动时间：</span>1月20日（限节日当天）</p>
                        <p>
                            <span className={style.fairRed}>营销方案：</span>
                            <p><img src="http://res.hualala.com/basicdoc/07a46543-5562-42f2-97ad-7cff267f4669.png" alt=""></img></p>
                        </p>
                    </div>

                    <h2>二月营销日历</h2>
                    <img src="http://res.hualala.com/basicdoc/1b32d55c-8d93-40de-a041-b3ca40441ada.png" alt=""></img>
                    <h3>除夕&春节</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>吃年夜饭过团圆夜</p>
                        <p><span className={style.fairRed}>活动时间：</span>2月1日-2月12日（节日前15天）</p>
                        <p>
                            <span className={style.fairRed}>营销方案：</span>
                            <p><img src="http://res.hualala.com/basicdoc/5e77109d-a39d-4c3e-a04d-c7f0fd8acd7a.png" alt=""></img></p>
                        </p>
                    </div>
                    <h3>情人节</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>爱要大声说出来</p>
                        <p><span className={style.fairRed}>活动时间：</span>2月14日（由于与春节时间相近，建议活动限1天）</p>
                        <p>
                            <span className={style.fairRed}>营销方案：</span>
                            <p><img src="http://res.hualala.com/basicdoc/845fab5a-df17-45c4-8385-723c02ba907a.png" alt=""></img></p>
                        </p>
                    </div>
                    <h3>元宵节</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>喜闹元宵兑大奖</p>
                        <p><span className={style.fairRed}>活动时间：</span>2月20日-26日（提前7天开始，活动当天截止）</p>
                        <p>
                            <span className={style.fairRed}>营销方案：</span>
                            <p><img src="http://res.hualala.com/basicdoc/204bf1b1-eee9-489e-8fc8-c1716c7d8faf.png" alt=""></img></p>
                        </p>
                    </div>

                    <h2>三月营销日历</h2>
                    <img src="http://res.hualala.com/basicdoc/05df3def-3729-4604-b3fd-41e4df7d1047.png" alt=""></img>
                    <h3>女生节&妇女节</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>我是女王我最大</p>
                        <p><span className={style.fairRed}>活动时间：</span>3月7日-8日（限节日当天）</p>
                        <p>
                            <span className={style.fairRed}>营销方案：</span>
                            <p><img src="http://res.hualala.com/basicdoc/6856ca99-8272-454e-be77-b798ba2c9b35.png" alt=""></img></p>
                        </p>
                    </div>
                    <h3>龙抬头</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>龙抬头，开好头</p>
                        <p><span className={style.fairRed}>活动时间：</span>3月14日（限节日当天）</p>
                        <p>
                            <span className={style.fairRed}>营销方案：</span>
                            <p><img src="http://res.hualala.com/basicdoc/daabef31-ae21-4b58-aa3a-a0387a774f2a.png" alt=""></img></p>
                        </p>
                    </div>

                    <h2>四月营销日历</h2>
                    <img src="http://res.hualala.com/basicdoc/ad6a5f2e-acfa-431a-b541-fb5ef16d2d6b.png" alt=""></img>
                    <h3>愚人节</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>愚你同乐</p>
                        <p><span className={style.fairRed}>活动时间：</span>4月1日（仅限当天）</p>
                        <p>
                            <span className={style.fairRed}>营销方案：</span>
                            <p><img src="http://res.hualala.com/basicdoc/30ee9d05-c532-4af6-b90f-a858f5d4a818.png" alt=""></img></p>
                        </p>
                    </div>

                    <h2>五月营销日历</h2>
                    <img src="http://res.hualala.com/basicdoc/d1702ac6-3951-43f4-bf20-476a43588004.png" alt=""></img>
                    <h3>劳动节</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>五一大放“价”</p>
                        <p><span className={style.fairRed}>活动时间：</span>5月1日-3日</p>
                        <p>
                            <span className={style.fairRed}>营销方案：</span>
                            <p><img src="http://res.hualala.com/basicdoc/bd77d761-0d68-4aee-84e8-cdfd06d1d202.png" alt=""></img></p>
                        </p>
                    </div>
                    <h3>母亲节</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>我和妈妈的约会</p>
                        <p><span className={style.fairRed}>活动时间：</span>5月9日（5月第2个星期日）</p>
                        <p>
                            <span className={style.fairRed}>营销方案：</span>
                            <p><img src="http://res.hualala.com/basicdoc/755a2c95-6312-4680-92f0-f9fc99a926e1.png" alt=""></img></p>
                        </p>
                    </div>

                    <h2>六月营销日历</h2>
                    <img src="http://res.hualala.com/basicdoc/f45f2a93-b37a-409f-908b-af8604278820.png" alt=""></img>
                    <h3>儿童节</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>童心飞扬 快乐成长</p>
                        <p><span className={style.fairRed}>活动时间：</span>6月1日（仅限当天）</p>
                        <p>
                            <span className={style.fairRed}>营销方案：</span>
                            <p><img src="http://res.hualala.com/basicdoc/c3ad247b-157a-4b50-9fea-88da6ad8a8b1.png" alt=""></img></p>
                        </p>
                    </div>
                    <h3>端午节</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>好礼接“粽”而来</p>
                        <p><span className={style.fairRed}>活动时间：</span>6月7日-14日（需提前准备，建议7天左右）</p>
                        <p>
                            <span className={style.fairRed}>营销方案：</span>
                            <p><img src="http://res.hualala.com/basicdoc/2ca288bf-8774-42d3-a2ff-75a66dcadac7.png" alt=""></img></p>
                        </p>
                    </div>
                    <h3>父亲节</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>“爸”气十足</p>
                        <p><span className={style.fairRed}>活动时间：</span>6月20日（前后7-10天，需提前准备）</p>
                        <p>
                            <span className={style.fairRed}>营销方案：</span>
                            <p><img src="http://res.hualala.com/basicdoc/90c5bcad-23cc-47c9-bf1d-72335493a500.png" alt=""></img></p>
                        </p>
                    </div>

                    <h2>七月营销日历</h2>
                    <img src="http://res.hualala.com/basicdoc/1526e49c-b84a-423f-82e7-db290208af5f.png" alt=""></img>
                    <p>天气逐渐炎热，暑期来临，可以准备一些降暑茶饮。</p>

                    <h2>八月营销日历</h2>
                    <img src="http://res.hualala.com/basicdoc/4ce9713c-a360-48ae-917a-eb6b3223a891.png" alt=""></img>
                    <h3>建军节</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>热血铸军魂</p>
                        <p><span className={style.fairRed}>活动时间：</span>8月1日（仅限当天）</p>
                        <p>
                            <span className={style.fairRed}>营销方案：</span>
                            <p><img src="http://res.hualala.com/basicdoc/384622a3-d9e4-4315-8ccd-4cec082557be.png" alt=""></img></p>
                        </p>
                    </div>
                    <h3>立秋</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>暑去凉来</p>
                        <p><span className={style.fairRed}>活动时间：</span>8月7日（仅限当天）</p>
                        <p>
                            <span className={style.fairRed}>营销方案：</span>
                            <p><img src="http://res.hualala.com/basicdoc/463b2d04-ae29-4790-9a49-50fefc9f3ba5.png" alt=""></img></p>
                        </p>
                    </div>
                    <h3>七夕情人节</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>浪漫七夕  一“惠”到底</p>
                        <p><span className={style.fairRed}>活动时间：</span>8月14日（仅限当天）</p>
                        <p>
                            <span className={style.fairRed}>营销方案：</span>
                            <p><img src="http://res.hualala.com/basicdoc/c47a9d2b-b6a6-4cd1-a781-7dc52dbf99c8.png" alt=""></img></p>
                        </p>
                    </div>

                    <h2>九月营销日历</h2>
                    <img src="http://res.hualala.com/basicdoc/0827bc7f-106b-43fd-836b-313228666ad9.png" alt=""></img>
                    <h3>教师节</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>感念师恩  金秋特惠</p>
                        <p><span className={style.fairRed}>活动时间：</span>9月10日（仅限当天）</p>
                        <p>
                            <span className={style.fairRed}>营销方案：</span>
                            <p><img src="http://res.hualala.com/basicdoc/ffed75f3-2afb-4923-845c-e4d885086829.png" alt=""></img></p>
                        </p>
                    </div>
                    <h3>中秋节</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>情浓中秋  花好月圆</p>
                        <p><span className={style.fairRed}>活动时间：</span>9月21日（前后7天）</p>
                        <p>
                            <span className={style.fairRed}>营销方案：</span>
                            <p><img src="http://res.hualala.com/basicdoc/0a7cfdef-c2a1-4a78-b505-274e5930c496.png" alt=""></img></p>
                        </p>
                    </div>

                    <h2>十月营销日历</h2>
                    <img src="http://res.hualala.com/basicdoc/8b9267b8-df2e-4ae2-806a-97b82c65a335.png" alt=""></img>
                    <h3>国庆节</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>迎国庆 大放“价”</p>
                        <p><span className={style.fairRed}>活动时间：</span>10月1日（前后7天）</p>
                        <p>
                            <span className={style.fairRed}>营销方案：</span>
                            <p><img src="http://res.hualala.com/basicdoc/aabeb654-55e9-4748-b223-583b74b958b9.png" alt=""></img></p>
                        </p>
                    </div>

                    <h2>十一月营销日历</h2>
                    <img src="http://res.hualala.com/basicdoc/c12fa5e0-883e-43ec-b989-c450fdae6ab9.png" alt=""></img>
                    <h3>万圣节</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>万圣节  不给优惠就捣蛋！</p>
                        <p><span className={style.fairRed}>活动时间：</span>11月1日（仅限当天）</p>
                        <p>
                            <span className={style.fairRed}>营销方案：</span>
                            <p><img src="http://res.hualala.com/basicdoc/762ef15e-a1de-45ba-875a-4cd3883a3cfd.png" alt=""></img></p>
                        </p>
                    </div>
                    <h3>双11购物节</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>双11狂欢 一起high！</p>
                        <p><span className={style.fairRed}>活动时间：</span>11月11日（仅限当天）</p>
                        <p>
                            <span className={style.fairRed}>营销方案：</span>
                            <p><img src="http://res.hualala.com/basicdoc/7f608eb4-3e90-45a4-9abc-2c3081a87e60.png" alt=""></img></p>
                        </p>
                    </div>

                    <h2>十二月营销日历</h2>
                    <img src="http://res.hualala.com/basicdoc/76264b72-8c7d-4078-a678-9f5381cfe1df.png" alt=""></img>
                    <h3>冬至</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>温暖冬至 问候而至！</p>
                        <p><span className={style.fairRed}>活动时间：</span>12月21日（仅限当天）</p>
                        <p>
                            <span className={style.fairRed}>营销方案：</span>
                            <p><img src="http://res.hualala.com/basicdoc/3cc25c7b-5d7d-4133-a1f0-9ea2180c1744.png" alt=""></img></p>
                        </p>
                    </div>
                    <h3>平安夜&圣诞节</h3>
                    <div>
                        <p><span className={style.fairRed}>活动主题：</span>缤纷圣诞 好礼不断！</p>
                        <p><span className={style.fairRed}>活动时间：</span>12月24日-25日（共两天）</p>
                        <p>
                            <span className={style.fairRed}>营销方案：</span>
                            <p><img src="http://res.hualala.com/basicdoc/41a96c02-85ec-4acc-8e78-beb7a13bec1a.png" alt=""></img></p>
                        </p>
                    </div>

                    <p>当然，以上各式活动，哗啦啦营销中心均可以实现，丰富的活动形式满足餐饮商户多样营销需求~</p>
                    <br/>
                    <p>如果想要《2021年餐饮营销日历》PDF完整版，欢迎关注“<span className={style.fairRed}>哗啦啦产品社区</span>”公众号，回复“<span className={style.fairRed}>2021</span>”即可获取小哗祝大家2021年餐饮营销不再愁！</p>
                    <img style={{ display: 'block', width: 200, margin: '0 auto 30px' }} src="http://res.hualala.com/basicdoc/b59d7f40-180b-469d-870e-f2855bc0f85f.png" alt=""/>
                </div>
            </div>
        )
    }
}

export default PromotionCalendar;
