/* Mixin.js -- Transforms raw style information into a mixin object
 *
 * Copyright (C) 2016 Michael Seibt
 *
 * With contributions from: -
 *
 * This software may be modified and distributed under the terms
 * of the MIT license. See the LICENSE file for details.
 */

'use strict';

var Entity = require('./Entity');
var marked = require('marked');

var Mixin = function(raw) {
  // Call parent constructor
  Entity.call(this, raw);

  // Set mixin-specific entity properties
  this.type = "Mixin";
  this.fillable = ['mixin', 'param', 'section', 'description', 'example', 'deprecated'];

  // Validate the raw input data for common mistakes
  if (!this.validate()) return {};

  return {
    name: raw.descriptor.match(/[^\s\(]+/)[0],
    descriptor: raw.descriptor,
    type: 'mixin',
    file: raw.file,
    example: this.getExample(),
    section: 'Nuclides > Mixins > ' + this.getSection(),
    description: raw.annotations.description,
    deprecated: raw.annotations.deprecated,
    signature: raw.descriptor.match(/[^\s\(]+(.*)/)[1],
    parameters: this.getParameters(),
    location: 'nuclides.html',
    hash: this.hash()
  };

};

Mixin.prototype = Object.create(Entity.prototype);

/**
 * Collects information about the parameters of the mixin from annotations and
 * the raw source code element.
 *
 * @return {object}
 */
Mixin.prototype.getParameters = function() {
  var parameters = [];
  var paramString = this.raw.descriptor.match(/\((.*)\)/);
  var docParameters = this.raw.annotations.param;

  // If there're no parameters in the descriptor definition,
  // we don't need to take a closer look
  if(!paramString) {
    return [];
  }

  // If there's only one parameter, make it an array
  if(typeof docParameters === 'string') {
    docParameters = [docParameters];
  }

  for(var p in docParameters) {
    var param = this.getParameter(docParameters[p]);
    var paramCodeRE = new RegExp("(\\"+param.name+".*?(?=\\,\\s\\$|$))");
    var paramCode = paramString[1].match(paramCodeRE)[0];
    param.optional = paramCode.match(/:/) ? true : false;
    parameters.push(param);
  }

  return parameters;
};

/**
 * Parses a parameter annotation to parameter name and description part.
 *
 * @param  {param} parameterString
 * @return {object}
 */
Mixin.prototype.getParameter = function( parameterString ) {
  // Finds first space or line breaks to separate name from description
  parameterString = parameterString.replace(/\n|\s/,"@@@");
  var param = parameterString.split("@@@");

  return {
    name: param[0].trim(),
    description: marked(param[1].trim())
  };
};

Mixin.prototype.getExample = function() {
  return this.raw.annotations.example;
};


module.exports = Mixin;
