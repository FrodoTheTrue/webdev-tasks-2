'use strict';

var multivarka = require('./multivarka');
var m1 = new multivarka();
m1
    // Указываем url для подключения
    .server('mongodb://localhost/urfu-2015')

    // и коллекцию
    .collection('students')

    // Выбираем только те записи, в которых поле `group` равно значению «ПИ-301».
    .where('group').equal(2)

    .where('name').include(['Петр'])

    // После подготовки, делаем запрос
    .find(function (err, result) {
        console.log(err, result);
    });
