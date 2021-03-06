
export function getProperty(obj, path) {
  const paths = path.split(".");
  let base = obj;
  let result = null;
  paths.forEach(function (p, index) {
    if (index === paths.length - 1) {
      result = base[p];
    } else {
      base   = base[p];
    }
  });
  return result;
}

export function setProperty(obj, path, value) {
  const paths = path.split(".");
  let base = obj;
  paths.forEach(function (p, index) {
    if (index === paths.length - 1) {
      try {
        if (value === null || "" === value) {
          delete base[p]; //項目削除。Dynamo対策
        } else {
          base[p] = value;
        }
      } catch (e) {
        if (path.indexOf(" ") > 0) {
          console.log(
            "setProperty(空白あり。pathを見直すべし。" + path + "," + value
          );
        }
        console.log(
          "setProperty(" + JSON.stringify(obj) + "," + path + "," + value
        );
        console.log("base[path](base=" + JSON.stringify(base) + ",path=" + p);
        throw e;
      }
    } else {
      base = base[p];
    }
  });
  return obj;
}

export function pushEmptyToArray(obj, path, empty) {
  const paths = path.split(".");
  let base = obj;
  paths.forEach(function (path, index) {
    if (index === paths.length - 1) {
      base[path] = base[path].concat(empty);
    } else {
      base = base[path];
    }
  });
  return obj;
}
export function spliceObjOfArray(obj, path, i) {
  console.log("spliceObjOfArray:" + JSON.stringify(obj));
  console.log("spliceObjOfArray:" + path);
  console.log("spliceObjOfArray:" + i);

  const paths = path.split(".");
  let base = obj;
  paths.forEach(function (p, index) {
    if (index === paths.length - 1) {
      console.log("spliceObjOfArray:" + base[p]);
      base[p].splice(i, 1);
      console.log("spliceObjOfArray:" + base[p]);
    } else {
      base = base[p];
    }
  });
  return obj;
}
