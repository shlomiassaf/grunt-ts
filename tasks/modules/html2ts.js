/// <reference path="../../defs/tsd.d.ts"/>
var _ = require('underscore');
var fs = require('fs');
var path = require('path');

/////////////////////////////////////////////////////////////////////
// HTML -> TS
////////////////////////////////////////////////////////////////////
// html -> js processing functions:
// Originally from karma-html2js-preprocessor
// Refactored nicely in html2js grunt task
// https://github.com/karlgoldstein/grunt-html2js/blob/master/tasks/html2js.js
// Modified nlReplace to be an empty string
var escapeContent = function (content, quoteChar) {
    if (typeof quoteChar === "undefined") { quoteChar = '\''; }
    var quoteRegexp = new RegExp('\\' + quoteChar, 'g');
    var nlReplace = '';
    return content.replace(quoteRegexp, '\\' + quoteChar).replace(/\r?\n/g, nlReplace);
};

// Remove bom when reading utf8 files
function stripBOM(str) {
    return 0xFEFF === str.charCodeAt(0) ? str.substring(1) : str;
}

var htmlTemplate = _.template('module <%= modulename %> { export var <%= varname %> =  \'<%= content %>\' } ');

// Compile an HTML file to a TS file
// Return the filename. This filename will be required by reference.ts
function compileHTML(filename) {
    var htmlContent = escapeContent(fs.readFileSync(filename).toString());
    htmlContent = stripBOM(htmlContent);

    // TODO: place a minification pipeline here if you want.
    var ext = path.extname(filename);
    var extFreename = path.basename(filename, ext);
    var fileContent = htmlTemplate({ modulename: extFreename, varname: ext.replace('.', ''), content: htmlContent });

    // Write the content to a file
    var outputfile = filename + '.ts';

    fs.writeFileSync(outputfile, fileContent);
    return outputfile;
}
exports.compileHTML = compileHTML;
//# sourceMappingURL=html2ts.js.map
