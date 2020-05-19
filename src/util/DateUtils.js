import React from "react";

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

