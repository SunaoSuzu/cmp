
/**
 * とりあえずRyoさん作のプログラムで色々やってみる
 * */
export const productMeta = {
    1 : {
        AP : {
            needPublicZone    : true  ,   //Web公開用のゾーン
            canDistribute     : true  ,   //APは冗長化可能か
            isStateless       : false ,   //うーーん。冗長化方法みたいなのが良いかな
            canDocker         : true  ,   //
        }
    }
}