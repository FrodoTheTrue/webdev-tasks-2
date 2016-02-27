'use strict';
var MongoClient = require('mongodb').MongoClient;
var multivarka = {
    url: '',
    whereString: '',
    collectionName: '',
    request: '',
    isNot: false,

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
        var tmpObj = {};
        if (this.isNot === true) {
            tmpObj[this.whereString] = { $ne: data };
            this.isNot = false;
        } else {
            tmpObj[this.whereString] = { $eq: data };
        }
        this.request = tmpObj;
        return this;
    },
    lessThan: function (data) {
        var tmpObj = {};
        if (this.isNot === true) {
            tmpObj[this.whereString] = { $gte: data };
            this.isNot = false;
        } else {
            tmpObj[this.whereString] = { $lt: data };
        }
        this.request = tmpObj;
        return this;
    },
    greatThan: function (data) {
        var tmpObj = {};
        if (this.isNot === true) {
            tmpObj[this.whereString] = { $lte: data };
            this.isNot = false;
        } else {
            tmpObj[this.whereString] = { $gt: data };
        }
        this.request = tmpObj;
        return this;
    },
    include: function (data) {
        var orArray = [];
        for (var i = 0; i < data.length; i++) {
            var tmpObj = {};
            tmpObj[this.whereString] = data[i];
            orArray.push(tmpObj);
        }
        if (this.isNot === true) {
            this.request = {
                $nor: orArray
            };
            this.isNot = false;
        } else {
            this.request = {
                $or: orArray
            };
        }
        return this;
    },
    find: function (callback) {
        var columnName = this.whereString;
        var requestName = this.request;
        var colName = this.collectionName;
        MongoClient.connect(this.url, function (err, db) {
            var collection = db.collection(colName);
            var result = collection.find(requestName).toArray(function (err, result) {
                callback(result);
                db.close();
            });
        });
    }
};
module.exports = multivarka;
