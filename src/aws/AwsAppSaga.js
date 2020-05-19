import { put, takeEvery, all, call } from "redux-saga/effects";
import * as AwsAppModule from "./AwsAppModule";
import axios from "axios";
import aws from "aws-sdk";
import EC2 from "aws-sdk/clients/ec2";
import getConfiguration from "../Configuration";
import * as TenantAppModule from "../tenant/TenantAppModule";

const baseEndPoint = process.env.REACT_APP_DEV_API_URL;
const accessKeyId = process.env.REACT_APP_DEV_AWS_API_KEY;
const secretAccessKey = process.env.REACT_APP_DEV_AWS_API_PWD;

//https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeVpcs-property
//https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeInstances-property

function getEc2ByTag(action) {
  console.log(action);
  const conf = getConfiguration();
  const tagUsage = conf.tagUsage;
  const tenantTag = action.tenantTag;
  const envTag = action.envTag;
  const apiKey = action.apiKey;
  const apiPwd = action.apiPwd;

  aws.config.logger = console; // 通信のデバッグ用。不要であれば削除可。

  const ec2 = new EC2({
    accessKeyId: apiKey,
    secretAccessKey: apiPwd,
    region: "ap-northeast-1",
  });

  const params = {
    Filters: [
      {
        Name: "tag:" + tagUsage.tenant,
        Values: [tenantTag],
      },
      {
        Name: "tag:" + tagUsage.environment,
        Values: [envTag],
      },
    ],
  };
  console.log(params);

  return ec2
    .describeInstances(params)
    .promise()
    .then(function (data) {
      return data.Reservations;
    })
    .catch((error) => ({ error }));
}

function getVpcByTag(action) {
  console.log(action);
  const conf = getConfiguration();
  const tagUsage = conf.tagUsage;
  const tenantTag = action.tenantTag;
  const envTag = action.envTag;
  const apiKey = action.apiKey;
  const apiPwd = action.apiPwd;

  aws.config.logger = console; // 通信のデバッグ用。不要であれば削除可。

  const ec2 = new EC2({
    accessKeyId: apiKey,
    secretAccessKey: apiPwd,
    region: "ap-northeast-1",
  });

  const params = {
    Filters: [
      {
        Name: "tag:" + tagUsage.tenant,
        Values: [tenantTag],
      },
      {
        Name: "tag:" + tagUsage.environment,
        Values: [envTag],
      },
    ],
  };
  console.log(params);

  return ec2
    .describeVpcs(params)
    .promise()
    .then(function (data) {
      return data.Vpcs;
    })
    .catch((error) => ({ error }));
}

export function* handleAttachByTag(action) {
  try {
    const [vpcs, ec2] = yield all([
      yield call(getVpcByTag, action),
      yield call(getEc2ByTag, action),
    ]);
    console.log("data=" + vpcs);

    yield put({
      type: TenantAppModule.ATTACH_AWS_SUCCESS,
      data: { ec2, vpcs },
    });
  } catch (e) {
    console.log(e);
    yield put({
      type: TenantAppModule.ATTACH_AWS_FAIL,
    });
  }
}

function getVpcList() {
  aws.config.logger = console; // 通信のデバッグ用。不要であれば削除可。

  const ec2 = new EC2({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: "ap-northeast-1",
  });

  const params = {};

  return ec2
    .describeVpcs(params)
    .promise()
    .then(function (data) {
      return data.Vpcs;
    })
    .catch((error) => ({ error }));
}

function getEc2List() {
  aws.config.logger = console; // 通信のデバッグ用。不要であれば削除可。

  const ec2 = new EC2({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: "ap-northeast-1",
  });

  const params = {};

  return ec2
    .describeInstances(params)
    .promise()
    .then(function (data) {
      return data.Reservations;
    })
    .catch((error) => ({ error }));
}

function* handleGetFromAws() {
  try {
    const [vpcs, ec2] = yield all([
      yield call(getVpcList),
      yield call(getEc2List),
    ]);
    console.log("data=" + ec2);

    yield put({
      type: AwsAppModule.IMPORT_SUCCESS,
      data: { ec2, vpcs },
    });
  } catch (e) {
    console.log(e);
    yield put({
      type: AwsAppModule.IMPORT_FAIL,
    });
  }
}

function* handleStore(action) {
  try {
    const data = action.data;
    let currentRevision = data["revision"];
    if (currentRevision === null) {
      //for dirty data
      currentRevision = 1;
    }
    data["revision"] = currentRevision + 1;
    data["id"] = 1;
    const res = yield axios.put(baseEndPoint + `/aws/1`, data);
    yield put({
      type: AwsAppModule.STORE_SUCCESS,
      data: res.data,
      receivedAt: Date.now(),
    });
  } catch (e) {
    yield put({
      type: AwsAppModule.STORE_FAIL,
      e,
    });
  }
}

function* mySaga() {
  all(
    yield takeEvery(AwsAppModule.IMPORT_REQUEST, handleGetFromAws),
    yield takeEvery(AwsAppModule.STORE_REQUEST, handleStore)
  );
}

export default mySaga;
