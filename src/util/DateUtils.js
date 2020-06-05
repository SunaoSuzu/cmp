
export function getNowYMD(){
    const dt = new Date();
    const y = dt.getFullYear();
    const m = ("00" + (dt.getMonth()+1)).slice(-2);
    const d = ("00" + dt.getDate()).slice(-2);

    let hh = dt.getHours();
    let mi = dt.getMinutes();
    let ss = dt.getSeconds();

    hh = ("00" + hh).slice(-2);
    mi = ("00" + mi).slice(-2);
    ss = ("00" + ss).slice(-2);

    const result = y + m + d + hh + mi + ss;
    return result;
}

//"2019-06-01T00:00:00Z"
export function getUCDSdate(n){
    const dt = new Date();
    dt.setMinutes(dt.getMinutes()+n);
    const y = dt.getUTCFullYear();
    const m = ("00" + (dt.getUTCMonth()+1)).slice(-2);
    const d = ("00" + dt.getUTCDate()).slice(-2);

    let hh = dt.getUTCHours();
    let mi = dt.getUTCMinutes();
    let ss = dt.getUTCSeconds();

    hh = ("00" + hh).slice(-2);
    mi = ("00" + mi).slice(-2);
    ss = ("00" + ss).slice(-2);

    const result = y + "-" + m + "-" + d + "T" + hh + ":" + mi + ":" + ss + "Z";
    return result;
}
