var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render("admin/moduleBuilder.html");
});

router.get("/modules", function (req, res) {
    res.render("admin/modules.html");
});

router.get("/modules/add", function (req, res) {
    res.render("admin/add-module.html");
});

module.exports = router;
