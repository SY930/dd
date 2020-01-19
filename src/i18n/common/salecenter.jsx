import { defineMessages, FormattedMessage } from 'react-intl';
// Date.now().toString(36) 生成 时间戳 key
const SALE_STRING = {
    k5ddu8nr: {id: 'Sale.k5ddu8nr', defaultMessage: '请选择店铺'},
    k5dlp2gl: {id: 'Sale.k5dlp2gl', defaultMessage: '未开始'},
    k5dlp7zc: {id: 'Sale.k5dlp7zc', defaultMessage: '执行中'},
    k5dlpczr: {id: 'Sale.k5dlpczr', defaultMessage: '已结束'},
    k5eng042: {id: 'Sale.k5eng042', defaultMessage: '全部'},
    k5eng7pt: {id: 'Sale.k5eng7pt', defaultMessage: '置顶'},
    k5engebq: {id: 'Sale.k5engebq', defaultMessage: '置底'},
    k5engk5b: {id: 'Sale.k5engk5b', defaultMessage: '上移'},
    k5engpht: {id: 'Sale.k5engpht', defaultMessage: '下移'},
    k5ey8jvj: {id: 'Sale.k5ey8jvj', defaultMessage: '本页'},
    k5ey8l0e: {id: 'Sale.k5ey8l0e', defaultMessage: '共'},
    k5ey8lip: {id: 'Sale.k5ey8lip', defaultMessage: '条'},
    k5ez4ovx: {id: 'Sale.k5ez4ovx', defaultMessage: '任意消费满'},
    k5ez4pdf: {id: 'Sale.k5ez4pdf', defaultMessage: '任意消费每满'},
    k5ez4pvb: {id: 'Sale.k5ez4pvb', defaultMessage: '指定菜品消费满'},
    k5ez4qew: {id: 'Sale.k5ez4qew', defaultMessage: '指定菜品消费每满'},
    k5hlxzmq: {id: "Sale.k5hlxzmq", defaultMessage: "同一菜品消费满"},
    k5hlxzv2: {id: "Sale.k5hlxzv2", defaultMessage: "同一菜品消费每满"},
    k5ez4qy4: {id: 'Sale.k5ez4qy4', defaultMessage: '份'},
    k5ezcuto: {id: 'Sale.k5ezcuto', defaultMessage: '减免金额'},
    k5ezcvbm: {id: 'Sale.k5ezcvbm', defaultMessage: '特定售价'},
    k5ezdbiy: {id: 'Sale.k5ezdbiy', defaultMessage: '元'},
    k5ezdc19: {id: 'Sale.k5ezdc19', defaultMessage: '折'},
    k5ezdckg: {id: 'Sale.k5ezdckg', defaultMessage: '例如8.8折'},
    k5f3y5ml: {id: 'Sale.k5f3y5ml', defaultMessage: '张'},
    k5f3y6b4: {id: 'Sale.k5f3y6b4', defaultMessage: '是'},
    k5f3y6yg: {id: 'Sale.k5f3y6yg', defaultMessage: '否'},
    k5f3y7iv: {id: 'Sale.k5f3y7iv', defaultMessage: '账单金额满'},
    k5f3y89j: {id: 'Sale.k5f3y89j', defaultMessage: '账单金额每满'},
    k5g5bcic: {id: "Sale.k5g5bcic", defaultMessage: "下单即赠送"},
    k5gez90v: {id: "Sale.k5gez90v", defaultMessage: "下单即折扣"},
    k5gfsugb: {id: "Sale.k5gfsugb", defaultMessage: "分类"},
    k5gfsuon: {id: "Sale.k5gfsuon", defaultMessage: "菜品"},
    k5hkj1v3: {id: "Sale.k5hkj1v3", defaultMessage: "条件"},
    k5kms08n: {id: "Sale.k5kms08n", defaultMessage: "每累计"},
    k5kms0gz: {id: "Sale.k5kms0gz", defaultMessage: "累计"},
    k5koakb3: {id: "Sale.k5koakb3", defaultMessage: "不限制"},
    k5koakjf: {id: "Sale.k5koakjf", defaultMessage: "按金额"},
    k5koakrr: {id: "Sale.k5koakrr", defaultMessage: "按数量"},
    k5koal03: {id: "Sale.k5koal03", defaultMessage: "任意菜品消费满"},
    k5koal8f: {id: "Sale.k5koal8f", defaultMessage: "任意菜品实收满"},
    k5koalgr: {id: "Sale.k5koalgr", defaultMessage: "活动菜品消费满"},
    k5koalp3: {id: "Sale.k5koalp3", defaultMessage: "活动菜品实收满"},
    k5koalxf: {id: "Sale.k5koalxf", defaultMessage: "任意菜品数量满"},
    k5koam5r: {id: "Sale.k5koam5r", defaultMessage: "同一菜品数量满"},
    k5koajdr: {id: "Sale.k5koajdr", defaultMessage: "不加价"},
    k5koajm3: {id: "Sale.k5koajm3", defaultMessage: "加价"},
    k5kp4vhr: {id: "Sale.k5kp4vhr", defaultMessage: "限制"},
    k5kqf1xr: {id: "Sale.k5kqf1xr", defaultMessage: "活动菜品消费每满"},
    k5kqf2ef: {id: "Sale.k5kqf2ef", defaultMessage: "任意菜品数量满"},
    k5kqf2mr: {id: "Sale.k5kqf2mr", defaultMessage: "任意菜品数量每满"},
    k5kqf2v3: {id: "Sale.k5kqf2v3", defaultMessage: "活动菜品数量满"},
    k5kqf33f: {id: "Sale.k5kqf33f", defaultMessage: "活动菜品数量每满"},
};
let COMMON_LABEL = defineMessages({
    k5dbdped: {id: 'Sale.k5dbdped', defaultMessage: '线上营销信息'},
    k5dbefat: {id: 'Sale.k5dbefat', defaultMessage: '基本营销信息'},
    k5dbiuws: {id: 'Sale.k5dbiuws', defaultMessage: '自动执行'},
    k5dk4m5r: {id: 'Sale.k5dk4m5r', defaultMessage: '活动时间'},
    k5dlbwqo: {id: 'Sale.k5dlbwqo', defaultMessage: '使用状态'},
    k5dlcm1i: {id: 'Sale.k5dlcm1i', defaultMessage: '活动名称'},
    k5dk5uwl: {id: 'Sale.k5dk5uwl', defaultMessage: '活动类型'},
    k5dldshc: {id: 'Sale.k5dldshc', defaultMessage: '高级查询'},
    k5dlggak: {id: 'Sale.k5dlggak', defaultMessage: '适用店铺'},
    k5dli0fu: {id: 'Sale.k5dli0fu', defaultMessage: '有效状态'},
    k5dljb1v: {id: 'Sale.k5dljb1v', defaultMessage: '统计类别'},
    k5dlpi06: {id: 'Sale.k5dlpi06', defaultMessage: '标签'},
    k5dlpn4t: {id: 'Sale.k5dlpn4t', defaultMessage: '品牌'},
    k5dlpt47: {id: 'Sale.k5dlpt47', defaultMessage: '适用业务'},
    k5dml2ik: {id: 'Sale.k5dml2ik', defaultMessage: '有效时间'},
    k5dmmiar: {id: 'Sale.k5dmmiar', defaultMessage: '活动编码'},
    k5dmps71: {id: 'Sale.k5dmps71', defaultMessage: '创建人/修改人'},
    k5dmrraa: {id: 'Sale.k5dmrraa', defaultMessage: '创建时间/修改时间'},
    k5dmw1z4: {id: 'Sale.k5dmw1z4', defaultMessage: '出错了，请稍后再试'},
    k5dn26n4: {id: 'Sale.k5dn26n4', defaultMessage: '不限制'},
    k5dnw1q3: {id: 'Sale.k5dnw1q3', defaultMessage: '您确定要删除吗'},
    k5do4z54: {id: 'Sale.k5do4z54', defaultMessage: '删除数据是不可恢复操作, 请慎重考虑'},
    k5do0ps6: {id: 'Sale.k5do0ps6', defaultMessage: '执行成功'},
    k5do6vse: {id: 'Sale.k5do6vse', defaultMessage: '您将删除'},
    k5doarw8: {id: 'Sale.k5doarw8', defaultMessage: '请求超时'},
    k5doax7i: {id: 'Sale.k5doax7i', defaultMessage: '请求失败'},
    k5dod8s9: {id: 'Sale.k5dod8s9', defaultMessage: '暂无数据'},
    k5dohc0d: {id: 'Sale.k5dohc0d', defaultMessage: '更新活动信息'},
    k5ez4n7x: {id: 'Sale.k5ez4n7x', defaultMessage: '活动方式'},
    k5ez4nw2: {id: 'Sale.k5ez4nw2', defaultMessage: '消费一定的菜品，可对价格最低菜品进行减免、折扣或特定售价的优惠活动'},
    k5ez4odk: {id: 'Sale.k5ez4odk', defaultMessage: '份数为'},
    k5ez4rmr: {id: 'Sale.k5ez4rmr', defaultMessage: '金额不得为空'},
    k5ezcavr: {id: 'Sale.k5ezcavr', defaultMessage: '折扣要大于0, 小于等于10'},
    k5ezccbt: {id: 'Sale.k5ezccbt', defaultMessage: '特定售价'},
    k5ezcd0f: {id: 'Sale.k5ezcd0f', defaultMessage: '减免'},
    k5ezcu1b: {id: 'Sale.k5ezcu1b', defaultMessage: '折扣'},
    k5hkj2k3: {id: "Sale.k5hkj2k3", defaultMessage: "减至"},
    k5ezdwpv: {id: 'Sale.k5ezdwpv', defaultMessage: '更多活动用户限制和互斥限制请使用'},
    k5ezdx9f: {id: 'Sale.k5ezdx9f', defaultMessage: '高级设置'},
    k5ezdxpr: {id: 'Sale.k5ezdxpr', defaultMessage: '对最低价菜品'},
    k5ezdxpr: {id: 'Sale.k5ezdxpr', defaultMessage: '对最低价菜品'},
    k5f2114y: {id: 'Sale.k5f2114y', defaultMessage: '请选择需要自动执行的活动'},
    k5f211mg: {id: 'Sale.k5f211mg', defaultMessage: '执行顺序'},
    k5f2124s: {id: 'Sale.k5f2124s', defaultMessage: '活动执行设置'},
    k5f212mo: {id: 'Sale.k5f212mo', defaultMessage: '设置自动执行后，在SaaS结账界面将会严格按您设置的执行顺序自动执行营销活动，不再需要手动选择，将减少营业员手动操作的步骤，方便结账更快进行'},
    k5f21352: {id: 'Sale.k5f21352', defaultMessage: '对SaaS结账时可使用的活动（除团购活动外）您可以根据店铺情况设置让活动自动执行'},
    k5f213qb: {id: 'Sale.k5f213qb', defaultMessage: '选择活动'},
    k5f49c4d: {id: 'Sale.k5f49c4d', defaultMessage: '券购买金额'},
    k5f49i2k: {id: 'Sale.k5f49i2k', defaultMessage: '券面金额'},
    k5f49nwg: {id: 'Sale.k5f49nwg', defaultMessage: '券交易手续费'},
    k5f49wf8: {id: 'Sale.k5f49wf8', defaultMessage: '选择核销后必须输入券交易手续费'},
    k5f4a4be: {id: 'Sale.k5f4a4be', defaultMessage: '费用是否计入实收'},
    k5f4aaf0: {id: 'Sale.k5f4aaf0', defaultMessage: '团购券使用'},
    k5f4ahaw: {id: 'Sale.k5f4ahaw', defaultMessage: '最多使用团购券'},
    k5f4ao7n: {id: 'Sale.k5f4ao7n', defaultMessage: '可使用一张, 最多使用'},
    k5f4avmq: {id: 'Sale.k5f4avmq', defaultMessage: '最多使用999张'},
    k5f4b1b9: {id: 'Sale.k5f4b1b9', defaultMessage: '必须大于0'},
    k5g5bcqo: {id: "Sale.k5g5bcqo", defaultMessage: "基本信息"},
    k5g5bcz0: {id: "Sale.k5g5bcz0", defaultMessage: "活动内容"},
    k5gdz0vu: {id: "Sale.k5gdz0vu", defaultMessage: "满减金额不得为空, 且门槛金额不能小于减免金额"},
    k5gdz146: {id: "Sale.k5gdz146", defaultMessage: "满减金额要大于上一档位的金额"},
    k5gdz1ci: {id: "Sale.k5gdz1ci", defaultMessage: "任意或指定消费满或每满一定金额即可得到一定的减价优惠"},
    k5gdz1ku: {id: "Sale.k5gdz1ku", defaultMessage: "满减优惠不包含运费，所有商品适用，最大可设置5级满减"},
    k5gdz1t6: {id: "Sale.k5gdz1t6", defaultMessage: "满减优惠"},
    k5gez998: {id: "Sale.k5gez998", defaultMessage: "默认折扣"},
    k5gez9pw: {id: "Sale.k5gez9pw", defaultMessage: "请输入正确折扣范围"},
    k5gfcri5: {id: "Sale.k5gfcri5", defaultMessage: "可以采用下单即折扣、任意或指定消费满一定金额三种方式设置不同折扣"},
    k5gfsuwz: {id: "Sale.k5gfsuwz", defaultMessage: "活动范围"},
    k5gfsv5b: {id: "Sale.k5gfsv5b", defaultMessage: "批量添加"},
    k5gfsvdn: {id: "Sale.k5gfsvdn", defaultMessage: "排除菜品"},
    k5gfsvlz: {id: "Sale.k5gfsvlz", defaultMessage: "适用菜品"},
    k5gfsvub: {id: "Sale.k5gfsvub", defaultMessage: "未选择时默认所有"},
    k5hkj0xq: {id: "Sale.k5hkj0xq", defaultMessage: "请输入菜品数量"},
    k5hkj162: {id: "Sale.k5hkj162", defaultMessage: "组合条件不能重复"},
    k5hkj1ef: {id: "Sale.k5hkj1ef", defaultMessage: "不得为空"},
    k5hkj1mr: {id: "Sale.k5hkj1mr", defaultMessage: "至少选择两个组合条件"},
    k5hkj23f: {id: "Sale.k5hkj23f", defaultMessage: "任意选择下组中"},
    k5hl5wkk: {id: "Sale.k5hl5wkk", defaultMessage: "当只设置一个条件组合时，活动可多次执行。例如，条件设置：1杯饮品+1个甜品，减免5元。结果：同一账单，1杯咖啡+1块蛋糕，减免5元；2杯咖啡+2块蛋糕，减免10元，依次类推。"},
    k5hl5wsw: {id: "Sale.k5hl5wsw", defaultMessage: "当设置2个及2个以上条件组合时，活动只能执行一次。例如，条件设置1：1杯饮品+1个甜品，减免5元。条…套餐，减免15元。结果：同一账单，1杯咖啡+1块蛋糕，减免5元；2杯咖啡+2块蛋糕，也是减免5元。"},
    k5hl5x18: {id: "Sale.k5hl5x18", defaultMessage: "注意：同一菜品不要在多个条件中重复设置"},
    k5hlhwpg: {id: "Sale.k5hlhwpg", defaultMessage: "菜品、赠菜数据不完整"},
    k5hly03e: {id: "Sale.k5hly03e", defaultMessage: "菜品赠送数量"},
    k5hly0bq: {id: "Sale.k5hly0bq", defaultMessage: "赠送菜品"},
    k5hly0k2: {id: "Sale.k5hly0k2", defaultMessage: "表示赠送菜品的总数，如输入2，代表所有赠送菜品任选，共赠送2份"},
    k5kec0v8: {id: "Sale.k5kec0v8", defaultMessage: "优惠方式"},
    k5kec13k: {id: "Sale.k5kec13k", defaultMessage: "减金额"},
    k5kec1bw: {id: "Sale.k5kec1bw", defaultMessage: "打折扣"},
    k5kec1k8: {id: "Sale.k5kec1k8", defaultMessage: "打"},
    k5keycet: {id: "Sale.k5keycet", defaultMessage: "输入不大于购买数的值"},
    k5keycn5: {id: "Sale.k5keycn5", defaultMessage: "请输入不小于免费数的值"},
    k5keycvh: {id: "Sale.k5keycvh", defaultMessage: "任意或指定消费满或每满一定份数菜品,即可在已选购菜品中对一定份数的最低价商品进行免单"},
    k5keyd3t: {id: "Sale.k5keyd3t", defaultMessage: "免"},
    k5keydc5: {id: "Sale.k5keydc5", defaultMessage: "份最低价菜品"},
    k5kmrzrz: {id: "Sale.k5kmrzrz", defaultMessage: "必须是2~99998之间的整数"},
    k5kms00b: {id: "Sale.k5kms00b", defaultMessage: "日期段内消费满足"},
    k5kms0pc: {id: "Sale.k5kms0pc", defaultMessage: "次"},
    k5kms0xo: {id: "Sale.k5kms0xo", defaultMessage: "之间"},
    k5kms160: {id: "Sale.k5kms160", defaultMessage: "整数"},
    k5kms1ec: {id: "Sale.k5kms1ec", defaultMessage: "可两位小数"},
    k5kn0ay5: {id: "Sale.k5kn0ay5", defaultMessage: "到"},
    k5kn0bn5: {id: "Sale.k5kn0bn5", defaultMessage: "赠送"},
    k5koai82: {id: "Sale.k5koai82", defaultMessage: "升级前菜品"},
    k5koaigf: {id: "Sale.k5koaigf", defaultMessage: "升级后菜品"},
    k5koaior: {id: "Sale.k5koaior", defaultMessage: "单笔订单最多升级换新数量限制"},
    k5koaix3: {id: "Sale.k5koaix3", defaultMessage: "单笔订单同一菜品最多升级换新数量限制"},
    k5koaj5f: {id: "Sale.k5koaj5f", defaultMessage: "同一菜品数量不能大于单笔订单最多数量"},
    k5koajuf: {id: "Sale.k5koajuf", defaultMessage: "必须小于上面的数字"},
    k5koak2r: {id: "Sale.k5koak2r", defaultMessage: "活动条件限制"},
    k5kp4v9f: {id: "Sale.k5kp4v9f", defaultMessage: "加价方式"},
    k5kqf033: {id: "Sale.k5kqf033", defaultMessage: "至少要设置一份活动菜品"},
    k5kqf0bf: {id: "Sale.k5kqf0bf", defaultMessage: "活动价必须大于0"},
    k5kqf0jr: {id: "Sale.k5kqf0jr", defaultMessage: "活动价不能超过售价"},
    k5kqf0s3: {id: "Sale.k5kqf0s3", defaultMessage: "以下活动菜品用户可任选其一参与换购"},
    k5kqf10f: {id: "Sale.k5kqf10f", defaultMessage: "限制份数不能超过活动菜品数"},
    k5kqf18r: {id: "Sale.k5kqf18r", defaultMessage: "每单换购数量"},
    k5kqf1h3: {id: "Sale.k5kqf1h3", defaultMessage: "任意或指定消费满一定金额或数量后，再加价一定金额即可换购指定菜品"},
    k5kqf1pf: {id: "Sale.k5kqf1pf", defaultMessage: "请输入消费金额"},
    k5kqf263: {id: "Sale.k5kqf263", defaultMessage: "请输入菜品数量"},
    k5kqz279: {id: "Sale.k5kqz279", defaultMessage: "单位"},
    k5kqz2fl: {id: "Sale.k5kqz2fl", defaultMessage: "售价"},
    k5kqz2nx: {id: "Sale.k5kqz2nx", defaultMessage: "活动价"},
});

for (const key in COMMON_LABEL) {
    const val = COMMON_LABEL[key];
    COMMON_LABEL[key] = <FormattedMessage {...val} />;
}

export {
    COMMON_LABEL as SALE_LABEL, SALE_STRING,
};
