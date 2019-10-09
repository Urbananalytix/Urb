"use strict";

const Demographics = require("../models/demographics");
const Pc = require("postcode");
const {
  InvalidPostcodeError,
  TPostcodeNotFoundError,
} = require("../lib/errors.js");

exports.show = (request, response, next) => {
	const { postcode } = request.params;
	if (!new Pc(postcode.trim()).valid()) return next(new InvalidPostcodeError());
	
	Demographics.find(postcode, (error, result) => {
		if (error) return next(error);
    if (!result) return next(new TPostcodeNotFoundError());   
    response.jsonApiResponse = {
      status: 200,
      result: Demographics.toJson(result)
    };
    return next();
	});
};

