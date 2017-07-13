var express = require('express');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(express.static(__dirname + '/site/public'))
var con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '123456',
	database: 'test'
})
con.connect();
app.listen(3000, function () {
	console.log('服务器在3000端口启动') //监听,找一个端口号，创建一个服务器
})
app.get('/admin', function (req, res) { //请求admin时候，调用函数
	res.sendFile(__dirname + '/site/view/admin.html')
})
app.get('/cats', function (req, res) { //请求admin时候，调用函数
	var sql = 'select * from cats';
	con.query(sql, function (err, rows, fields) {
		res.json(rows);
	})
}).post('/cats', function (req, res) {
	var sql = 'insert into cats set title=?,parentid=?';
	con.query(sql, [req.body.title, req.body.id], function (err, r) {
		res.json(r.insertId)
	})
}).put('/cats', function (req, res) {
	var sql = 'update cats set title=? where id =?';
	con.query(sql, [req.body.title, req.body.id], function (err, r) {
		res.json({
			state: 'ok'
		})
	})
}).delete('/cats', function (req, res) {
	con.query('delete from cats where id in (' + req.body.ids + ')',
		function (err, r) {
			res.json({
				state: 'ok'
			})
		})
})