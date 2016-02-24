(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        root.ajax = factory(root);
    }
})(this, function (root) {

    'use strict';

    var ajax = {};
    var config = {
        contentType: 'application/x-www-form-urlencoded'
    };

    var parse = function (req) {
        var result;
        try {
            result = JSON.parse(req.responseText);
        } catch (e) {
            result = req.responseText;
        }
        return [result, req];
    };

    var xhr = function (type, url, data) {
        var methods = {
            success: function () {},
            error: function () {},
            always: function () {}
        };
        var XHR = root.XMLHttpRequest || ActiveXObject;
        var request = new XHR('MSXML2.XMLHTTP.3.0');

        request.open(type, url, true);
        request.setRequestHeader('Content-type', config.contentType);
        request.onreadystatechange = function () {
            var req;
            if (request.readyState === 4) {
                req = parse(request);
                if (request.status >= 200 && request.status < 300) {
                    methods.success.apply(methods, req);
                } else {
                    methods.error.apply(methods, req);
                }
                methods.always.apply(methods, req);
            }
        };
        request.send(data);

        var xhrRequest = {
            success: function (callback) {
                methods.success = callback;
                return xhrRequest;
            },
            error: function (callback) {
                methods.error = callback;
                return xhrRequest;
            },
            always: function (callback) {
                methods.always = callback;
                return xhrRequest;
            }
        };
        return xhrRequest;
    };

    ajax.get = function (src) {
        return xhr('GET', src);
    };

    ajax.put = function (url, data) {
        return xhr('PUT', url, data);
    };

    ajax.post= function (url, data) {
        return xhr('POST', url, data);
    };

    ajax.delete = function (url) {
        return xhr('DELETE', url);
    };

    ajax.setContentType = function(value) {
        config.contentType = value;
    };

    return ajax;
});