/*
 * Assert suite for reboard
 *
 * Copyright(c) 2011 M-WAY Solutions GmbH
 * GPLv3 Licensed
 *
 * @author pfleidi
 */

var Helper = require('../helpers/testhelper');
var Assert = require('assert');
var log = require('log4js')().getLogger();

var testObject = {
  a: 1,
  b: 'asdf',
  c: true,
  d: [1,2,3],
  e: { foo: 'baär' }
};

var headers = {
  'sessionid': '121212121',
  'x-client-test': '2342asadsagfdsa',
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

exports['test basic proxy functionality'] = function (beforeExit) {
  var echo = Helper.echoServer();
  var server = require('../lib/proxy').createProxy({
      log: log,
      url: echo.url
    });

  Assert.response(server, {
      method: 'POST',
      url: '/',
      timeout: 500,
      headers: headers,
      data: JSON.stringify(testObject)
    }, {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'x-test1': 'ASDF1',
        'x-test2': 'ASDF2'
      },
    }, function (resp) {
      var data = JSON.parse(resp.body);

      Assert.ok(data);
      Assert.ok(resp);
      Assert.deepEqual(JSON.parse(data.payload), testObject);
      Assert.strictEqual(data.headers['sessionid'], headers.sessionid);
      Assert.strictEqual(data.headers['x-client-test'], headers['x-client-test']);
    });

};

function basicTest(url) {
  var server = require('../lib/proxy').createProxy({
      log: log,
      url: url
    });

  Assert.response(server, {
      method: 'POST',
      url: '/',
      headers: headers,
      data: JSON.stringify(testObject)
    }, {
      status: 500
    });

}

exports['test domain not found'] = function (beforeExit) {
  basicTest('http://domain.does.not.exist'); 
};

exports['test tcp timeout'] = function (beforeExit) {
  basicTest('http://127.0.0.42:1234/'); 
};

exports['test wrong port'] = function (beforeExit) {
  basicTest('http://127.0.0.1:1234/'); 
};


