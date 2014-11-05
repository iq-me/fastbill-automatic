/*!
 * fastbill-automatic - node plugin
 *
 * Author:
 *     Robert Wachtel <robert.wachtel@glanzkinder.com>
 *     Robert Boeing <robert.boeing@konexmedia.com>
 *     Paul Em <paul3m@gamil.com>
 *
 * MIT Licensed
 *
 */
'use strict';


var Client = require('node-rest-client').Client;
var _ = require('lodash');

var FastBill = function (config) {

    var _credentials = {
        user: config.user,
        password: config.apiKey
    };

    //authenticate and build our client
    var client = new Client(_credentials);

    var _config = {
        user: config.user,
        apiKey: config.apiKey,
        serviceUrl: "https://automatic.fastbill.com/api/1.0/api.php",
        headers: {"Content-Type": "application/json"}
    };

    function _post(params, callback) {
        // enrich params with configuration headers
        params.headers = _config.headers;
        // use node-rest-client for communication
        client.post(_config.serviceUrl, params, function (data, response) {
            // parsed response body as js object
            var res = null;
            try {
                res = JSON.parse(data);
            } catch (e) {
                console.error('FastBill error: could not parse response');
                return callback && callback(e.message);
            }
            if (res && typeof res === 'object' && res.RESPONSE) {
                if (res.RESPONSE.ERRORS) {
                    return callback && callback(res.RESPONSE.ERRORS, res.RESPONSE);
                }
                if (/\.get$/.test(params.data.SERVICE) && res.RESPONSE && res.RESPONSE[Object.keys(res.RESPONSE)[0]]) {
                    // for get methods return first property of response object
                    var resultArray = [];
                    res.RESPONSE[Object.keys(res.RESPONSE)[0]].forEach(function (e) {
                        resultArray.push(e);
                    });

                    return callback && callback(null, resultArray);
                }
                return callback && callback(null, res.RESPONSE);
            }
            callback && callback('FastBill error: empty response');
        });
    }

    return {
        get: function (type, params, callback) {
            params = {
                data: _.extend(params, {"SERVICE": type + '.get'})
            };

            _post(params, callback);

            return this;
        },
        getOne: function (type, params, callback) {
            params = {
                data: _.extend(params, {"SERVICE": type + '.get', "LIMIT": 1})
            };

            _post(params, function(err, res) {
                if (!err && res.length == 1) {
                    res = res[0];
                }
                callback && callback(err, res);
            });

            return this;
        },
        create: function (type, params, callback) {
            params = {
                data: {
                    "SERVICE": type + '.create',
                    "DATA": params
                }
            };

            _post(params, callback);
        },
        update: function (type, id, params, callback) {
            params.CUSTOMER_ID = id;
            params = {
                data: {
                    "SERVICE": type + '.update',
                    "DATA": params
                }
            };

            _post(params, callback);
        },
        del: function (type, id, callback) {
            var params = {
                data: {
                    "SERVICE": type + '.delete',
                    "DATA": {
                        'CUSTOMER_ID': id
                    }
                }
            };

            _post(params, callback);
        },
        subscriptionSetAddOn: function(params, callback) {
            var params = {
                data: {
                    "SERVICE": 'subscription.setaddon',
                    "DATA": params
                }
            };

            _post(params, callback);
        }
    }
};

module.exports = FastBill;