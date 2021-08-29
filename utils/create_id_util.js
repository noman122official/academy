'use strict';
const shortid = require('shortid');
const citycode = require('./city_code_resolve');

module.exports.create_id = (prefix,city,pin,callback)=> {

 shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');

	citycode.resolve(city,(code)=>{
		var id = prefix+"-"+code+"-"+pin+"-"+shortid.generate();
	   callback({'id':id});
	})
	


}