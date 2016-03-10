'use strict';
var MongoClient = require('mongodb').MongoClient;

module.exports = new Multivarka();

function Multivarka() {
    this.isNot = false;
    this.requestPull = {$and: []};
    this.firstRequest = false;

    this._requestCreator = function (requestNot, request) {
        var tmpObj = {};
        if (this.isNot) {
            tmpObj[this.whereString] = requestNot;
            this.isNot = false;
        } else {
            tmpObj[this.whereString] = request;
        }
        this.requestPull['$and'].push(tmpObj);
        this.firstRequest = true;
    },

    this.server = function (url) {
        this.url = url;
        return this;
    },
    this.collection = function (collection) {
        this.collectionName = collection;
        return this;
    },
    this.where = function (data) {
        this.whereString = data;
        return this;
    },
    this.not = function () {
        this.isNot = true;
        return this;
    },
    this.equal = function (data) {
        this._requestCreator({ $ne: data }, { $eq: data });
        return this;
    },
    this.lessThan = function (data) {
        this._requestCreator({ $gte: data }, { $lt: data });
        return this;
    },
    this.greatThan = function (data) {
        this._requestCreator({ $lte: data }, { $gt: data });
        return this;
    },
    this.include = function (data) {
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
        this.firstRequest = true;
        return this;
    },
    this.find = function (callback) {
        var columnName = this.whereString;
        var colName = this.collectionName;
        var pull = this.requestPull;
        var firstRequest = this.firstRequest;
        MongoClient.connect(this.url, function (err, db) {
            var collection = db.collection(colName);
            if (!firstRequest) {
                pull = {};
            }
            var result = collection.find(pull).toArray(function (err, result) {
                callback(err, result);
                db.close();
            });
        });
    };
};
