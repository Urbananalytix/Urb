"use strict";

const util = require("util");
const { Base, populateLocation, csvExtractor } = require("./base");
const extractOnspdVal = csvExtractor(require("../../data/onspd_schema.json"));
const async = require("async");
const Pc = require("postcode");

const PoliticsSchema = {
    id: "SERIAL PRIMARY KEY",
    postcode:	"varchar",
    pc_compact:	"varchar",
    brexitleave: "numeric",
    brexitleaveindex: "numeric",
    brexitremain: "numeric",
    brexitremainindex: "numeric",
    con17: "numeric",
    con_index: "numeric",
    lab17: "numeric",
    lab_index: "numeric",
    ld17: "numeric",
    ld_index: "numeric",
    snp17: "integer",
    snp_index: "integer",	
    pc17: "integer",
    pc_index: "integer",	
    ukip17: "numeric",
    ukip_index: "numeric",
    green17: "numeric",
    green_index: "numeric",
    dup17: "integer",	
    dup_index: "integer",	
    sf17: "integer",	
    sf_index: "integer",	
    sdlp17:	"integer",	
    sdlp_index:	"integer",	
    uup17: "integer",	
    uup_index: "integer",	
};

const indexes = [
  {
    unique: true,
    column: "pc_compact",
  },
];

function Politics() {
  this.idCache = {};
  Base.call(this, "politics", PoliticsSchema, indexes);
}

util.inherits(Politics, Base);

const findQuery = `
	SELECT *
	FROM 
		politics 
	WHERE pc_compact=$1
`;

Politics.prototype.find = function(postcode, callback) {
  if (typeof postcode !== "string") return callback(null, null);
  postcode = postcode.trim().toUpperCase();
  if (!new Pc(postcode).valid()) return callback(null, null);
  this._query(findQuery, [postcode.replace(/\s/g, "")], (error, result) => {
    if (error) return callback(error, null);
    if (result.rows.length === 0) return callback(null, null);
    callback(null, result.rows[0]);
  });
};

Politics.prototype.whitelistedAttributes = [
  "postcode",
  "brexitleave",
    "brexitleaveindex",
    "brexitremain",
    "brexitremainindex",
    "con17",
    "con_index",
    "lab17",
    "lab_index",
    "ld17",
    "ld_index",
    "snp17",
    "snp_index",
    "pc17",
    "pc_index",
    "ukip17",
    "ukip_index",
    "green17",
    "green_index",
    "dup17",
    "dup_index",
    "sf17",
    "sf_index",
    "sdlp17",
    "sdlp_index",
    "uup17",
    "uup_index",
];

/**
 * Turn terminated postcode data into json object
 * @param  {Object} Politics - Raw instance of terminated postcode data
 * @return {Object}                    - Terminated postcode object containing only whitelisted attributes
 */
Politics.prototype.toJson = function(Politics) {
  return this.whitelistedAttributes.reduce((acc, attr) => {
    acc[attr] = Politics[attr];
    return acc;
  }, {});
};



module.exports = new Politics();
