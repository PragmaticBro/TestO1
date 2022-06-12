const express = require("express");
const { startSession } = require("mongoose");
require("dotenv").config();
const { Headers } = require("node-fetch");
const fetch = require("node-fetch");
const cors = require("cors");

let app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

function start() {
  app.post("/validateNumber", async (req, res) => {
    try {
      const { phoneNumber, callingCode } = req.body;
      if (!callingCode) {
        return res.status(400).send({
          valid: false,
          error: "callingCode missing from the body",
        });
      }
      if (!phoneNumber) {
        return res.status(400).send({
          valid: false,
          error: "phoneNumber missing from the body",
        });
      }
      var myHeaders = new Headers();
      myHeaders.append("apikey", process.env.apilayer_key);
      var requestOptions = {
        method: "GET",
        redirect: "follow",
        headers: myHeaders,
      };
      const data = await fetch(
        `${process.env.apilayer_base_url}/number_verification/validate?number=${callingCode}${phoneNumber}`,
        requestOptions
      );
      const resp = await data.json();

      if (!resp.valid) {
        return res.status(200).send({
          valid: false,
          error: "Number not valid",
        });
      }

      return res.send({
        valid: true,
        countryCode: resp.country_code,
        countryName: resp.country_name,
        operatorName: resp.carrier,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        error: "Error in servicing your request",
      });
    }
  });
}

start();
app.listen(4000, () => {
  console.log("Server running on 4000");
});
module.exports = app;
