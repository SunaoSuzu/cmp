/**
 * ドメイン毎にワイルドカード証明書のarnと紐付け
 **/

const DomainSetting = {
    default : {
        url      : "sutech.co.jp",
        internal : "sutech.internal",
        certificateArn : "arn:aws:acm:ap-northeast-1:510229950882:certificate/8d7b9200-8285-4869-8014-031c45dbd5a5"
    }
}
module.exports = DomainSetting;