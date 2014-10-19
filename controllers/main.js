var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.redirect("/dashboard");
});

router.get("/dashboard", function (req, res) {
    res.render("dashboard.html")
});

module.exports = router;
