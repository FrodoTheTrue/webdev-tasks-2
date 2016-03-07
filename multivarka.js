'use strict';
var MongoClient = require('mongodb').MongoClient;

var multivarka = {
    url: '',
    whereString: '',
    collectionName: '',
    isNot: false,
    requestPull: {$and: []},

    _requestCreator: function (requestNot, request) {
        var tmpObj = {};
        if (this.isNot) {
            tmpObj[this.whereString] = requestNot;
            this.isNot = false;
        } else {
            tmpObj[this.whereString] = request;
        }
        this.requestPull['$and'].push(tmpObj);
    },

    server: function (url) {
        this.url = url;
        return this;
    },
    collection: function (collection) {
        this.collectionName = collection;
        return this;
    },
    where: function (data) {
        this.whereString = data;
        return this;
    },
    not: function () {
        this.isNot = true;
        return this;
    },
    equal: function (data) {
        this._requestCreator({ $ne: data }, { $eq: data });
        return this;
    },
    lessThan: function (data) {
        this._requestCreator({ $gte: data }, { $lt: data });
        return this;
    },
    greatThan: function (data) {
        this._requestCreator({ $lte: data }, { $gt: data });
        return this;
    },
    include: function (data) {
        var orArray = [];
        var request;
        for (var i = 0; i < data.length; i++) {
            var tmpObj = {};
            tmpObj[this.whereString] = data[i];
            orArray.push(tmpObj);
        }
        if (this.isNot) {
            request = {
                $nor: orArray
            };
            this.isNot = false;
        } else {
            request = {
                $or: orArray
            };
        }
        this.requestPull['$and'].push(request);
        return this;
    },
    find: function (callback) {
        var columnName = this.whereString;
        var colName = this.collectionName;
        var pull = this.requestPull;
        MongoClient.connect(thise a nonempty array',.url, function (err, db) {
            var collection = db.collection(colName);
            var result = collection.find(pull).toArray(function (err, result) {
                callback(err, result);
                db.close();
            });
        });
    }
};
module.exports = multivarka;
