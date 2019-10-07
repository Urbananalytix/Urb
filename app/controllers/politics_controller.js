"use strict";

const Politics = require("../models/politics");
const Pc = require("postcode");
const {
  InvalidPostcodeError,
  TPostcodeNotFoundError,
} = require("../lib/errors.js");

exports.show = (request, response, next) => {
	const { postcode } = request.params;
	if (!new Pc(postcode.trim()).valid()) return next(new InvalidPostcodeError());
	
	Politics.find(postcode, (error, result) => {
		if (error) return next(error);
    if (!result) return next(new TPostcodeNotFoundError());   
    response.jsonApiResponse = {
      status: 200,
      result: Politics.toJson(result)
    };
    return next();
	});
};

