const path = require("path");
const gateway = require("express-gateway");
require("./validator");
require("./customer");

gateway().load(path.join(__dirname, "config")).run();
