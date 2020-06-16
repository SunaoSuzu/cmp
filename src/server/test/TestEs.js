const es = require("../sendToEs");

async function test() {
    await es.upsert("cmp_sutech_pro_product_default","latest",159999999,
        {name : "佐藤" , caption : "佐藤"});
}
test();
