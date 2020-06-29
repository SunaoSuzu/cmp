
/**
 * Material-Tableのfieldのlookup定義をSelection用に変換
 * lookup  : { "crud": 'CRUD', "listMod": '一覧編集'}
 *         ↓↓↓↓
 * options :[{id:"crud" , caption : 'CRUD' ,},{id:"listMod", caption : '一覧編集'}]
 * */
export function options(lookup){
    return Object.keys(lookup).map( key => ({ id : key , caption : lookup[key]}));
}
