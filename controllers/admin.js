var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.redirect("/admin/devices");
});

router.get("/devices", function (req, res) {
    res.render("admin/devices.html")
});

module.exports = router;
