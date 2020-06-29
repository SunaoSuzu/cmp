
import * as CommonCost from "./common/CommonConst"
// 設定系の　JSON
// Mst 仕様
// Conf (configuration) 顧客定義(のちにテナント毎にデータを分ける)



const tenantListGridColumnsDef = {
  1: { caption: "テナント", propName: "name" },
  2: { caption: "状況", propName: "statusCaption" }
};

const tenantVpcTypeMst = {
  1: {
    id: 1,
    caption: "環境毎にVPC",
    description: "環境数分VPCの作成を行います"
  },
  2: {
    id: 2,
    caption: "テナント毎にVPC",
    description: "テナント専用VPCに全環境を構築します"
  },
  9: {
    id: 9,
    caption: "マルチテナント",
    description: "マルチテナント環境に配備します"
  }
};

const environmentVpcTypeMst = {
  1: { id: 1, caption: "独自VPC", description: "環境数分VPCの作成を行います" },
  2: {
    id: 2,
    caption: "テナントVPC",
    description: "テナント専用VPCに全環境を構築します"
  },
  9: {
    id: 9,
    caption: "マルチテナントVPC",
    description: "マルチテナント環境に配備します"
  }
};

const landscapeTypeMst = {
  1: { id: 1, caption: "開発環境", description: "開発専用の環境です", use: 1 },
  10: {
    id: 10,
    caption: "ステージング環境",
    description: "受け入れ試験を行う環境です",
    use: 1
  },
  100: { id: 100, caption: "本番環境", description: "本番環境です", use: 1 },
  200: {
    id: 200,
    caption: "訓練環境",
    description: "本番ユーザがオペレーションを訓練する環境",
    use: 1
  }
};

const environmentStatusMst = [
  { id: CommonCost.STATUS_DRAFT, caption: "下書き", description: "下書き" },
  { id: CommonCost.STATUS_PLANED, caption: "未作成（予定あり）", description: "作業待ち" },
  { id: CommonCost.STATUS_CREATING, caption: "構築中", description: "作業待ち" },
  { id: CommonCost.STATUS_OK, caption: "作成済み", description: "作成済み（予定なし）" },
  {id: CommonCost.STATUS_MOD_PLANED, caption: "作成済み(予定あり)", description: "作成済み（予定あり）", use: 1},
  {id: CommonCost.STATUS_CHANGE_SETTING, caption: "作成済み(更新差分取得中)", description: "作成済み（予定あり）", use: 1},
  {id: CommonCost.STATUS_CHANGE_SET, caption: "作成済み(更新差分)", description: "作成済み（予定あり）", use: 1},
  {id: CommonCost.STATUS_MOD_ING, caption: "作成済み（環境更新中）", description: "環境更新中", use: 1},
];

const tenantStatusMst = [
  { id: 1, caption: "下書き", description: "下書き", use: 1 },
  { id: 10, caption: "環境作成予定あり", description: "環境作成予定あり", use: 1 },
  { id: 100, caption: "環境作成済み", description: "環境作成済み", use: 1 },
];

//以下は設定ではなくマスタ。将来は不要になるはず
//販売製品
const productLicensesConf = {
  TEST: {
    id: 99,
    name: "TEST",
    caption: "Ryoさんに作ってもらった試験用",
    options: []
  },
  CJK: { id: 1, name: "CJK", caption: "CJK", options: [] },
  CWS: { id: 2, name: "CWS", caption: "CWS", options: [] },
  CSR: { id: 3, name: "CSR", caption: "CSR", options: [] },
  CTM: { id: 4, name: "CTM", caption: "CTM", options: [] }
};

const installableComponentConf = {
  SpringBootAp: {
    id: 99,
    name: "SpringBootAp",
    caption: "SpringBootAp",
    type: 1,
    params: []
  },
  CJK_AP: {
    id: 1,
    name: "CJK_AP",
    caption: "CJK_AP",
    type: 1,
    params: [
      {
        name: "p1",
        caption: "パラメータ1",
        default: "",
        now: "hoge",
        pattern: ["", "hoge", "foo"]
      },
      {
        name: "p2",
        caption: "パラメータ2",
        default: "",
        now: "hoge",
        pattern: ["", "hoge", "foo"]
      },
      {
        name: "p3",
        caption: "パラメータ3",
        default: "",
        now: "hoge",
        pattern: ["", "hoge", "foo"]
      }
    ]
  },
  CJK_DB: {
    id: 2,
    name: "CJK_DB",
    caption: "CJK_DB",
    type: 2,
    params: [
      {
        name: "p1",
        caption: "param1",
        default: "",
        now: "hoge",
        pattern: ["", "hoge", "foo"]
      },
      {
        name: "p2",
        caption: "param2",
        default: "",
        now: "hoge",
        pattern: ["", "hoge", "foo"]
      }
    ]
  },
  CJK_BS: { id: 3, name: "CJK_BS", caption: "CJK_BS", type: 3, params: [] },
  CWS_AP: { id: 4, name: "CWS_AP", caption: "CWS_AP", type: 1, params: [] },
  CWS_DB: { id: 5, name: "CWS_DB", caption: "CWS_DB", type: 2, params: [] },
  CWS_BD: { id: 6, name: "CWS_BD", caption: "CWS_BD", type: 3, params: [] },
  CTM_AP: { id: 7, name: "CTM_AP", caption: "CTM_AP", type: 1, params: [] },
  CTM_DB: { id: 8, name: "CTM_DB", caption: "CTM_DB", type: 2, params: [] },
  CTM_ES: { id: 9, name: "CTM_ES", caption: "CTM_ES", type: 4, params: [] },
  CTM_BS: { id: 10, name: "CTM_BS", caption: "CTM_BS", type: 3, params: [] }
};

const requiredComponentConf = {
  TEST: { main: ["SpringBootAp"], sub: [] },
  CJK: { main: ["CJK_AP", "CJK_DB", "CJK_BS"], sub: [] },
  CWS: {
    main: ["CWS_AP", "CWS_DB", "CWS_BS", "CWS_DL"],
    sub: ["CJK_AP", "CJK_DB", "CJK_BS"]
  },
  CSR: {
    main: [],
    sub: ["CWS_AP", "CWS_DB", "CWS_BS", "CWS_DL", "CJK_AP", "CJK_DB", "CJK_BS"]
  },
  CTM: { main: ["CTM_AP", "CTM_DB", "CTM_ES", "CTM_BS"], sub: [] }
};

const awsTagUsage = {
  flg: true,
  tenant: "tenant",
  environment: "landscape",
  system: "",
  component: ""
};

const whi_configuration = {
  tagUsage: awsTagUsage,
  tenantStatusMst: tenantStatusMst,
  requiredComponent: requiredComponentConf,
  installableComponentConf: installableComponentConf,
  tenantVpcTypeMst: [tenantVpcTypeMst[1], tenantVpcTypeMst[2]],
  environmentVpcTypeMst: [environmentVpcTypeMst[1], environmentVpcTypeMst[2]],

  landscapeTypes: [
    landscapeTypeMst[1],
    landscapeTypeMst[10],
    landscapeTypeMst[100]
  ],
  productLicensesConf: [
    productLicensesConf["TEST"],
    productLicensesConf["CJK"],
    productLicensesConf["CWS"],
    productLicensesConf["CSR"],
    productLicensesConf["CTM"]
  ],
  environmentStatusMst: environmentStatusMst,

  tenantListGridConf: {
    columnsDef: [tenantListGridColumnsDef[1], tenantListGridColumnsDef[2]]
  },
};

//いずれテナントで分岐
export default function getConfiguration() {
  return whi_configuration;
}
