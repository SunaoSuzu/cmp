const region = require("../../conf/Region");
const AWS = require('aws-sdk');
AWS.config.setPromisesDependency(Promise);

let dns = require("./Route53Command");
dns.addPublic({region: region.name},{});