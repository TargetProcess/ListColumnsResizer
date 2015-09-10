var $ = require('jquery');

var configurator = require('tau/configurator');

var storageApi = {

    get: function get(group, key) {
        return $.ajax({
            type: 'GET',
            url: configurator.getApplicationPath() + '/storage/v1/' + group + '/' + key,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json'
        })
        .then(function(res) {
            return Object.keys(res.userData).length ? res.userData : res.publicData;
        }, function(res) {
            if (res.status === 200) {
                return new $.Deferred().resolve({});
            } else {
                return res;
            }
        });
    },

    set: function set(group, key, data) {

        return $.ajax({
            type: 'POST',
            url: configurator.getApplicationPath() + '/storage/v1/' + group + '/' + key,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify({
                userData: data,
                scope: 'Public'
            })

        });
    },

    setPublic: function set(group, key, data) {

        return $.ajax({
            type: 'POST',
            url: configurator.getApplicationPath() + '/storage/v1/' + group + '/' + key,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify({
                publicData: data,
                scope: 'Public'
            })

        });
    }
};

module.exports = storageApi;
