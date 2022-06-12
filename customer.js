const express = require("express");
const fetch = require("node-fetch");
require("./models/db_connector");
const Customer = require("./models/customer");
const cors = require("cors");

let app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

async function start() {
  app.post("/customers", async (req, res) => {
    try {
      if (!req.body.callingCode) {
        return res.status(400).send({
          valid: false,
          error: "callingCode is missing from the body",
        });
      }
      if (!req.body.phoneNumber) {
        return res.status(400).send({
          valid: false,
          error: "phoneNumber is missing from the body",
        });
      }

      if (!req.body.name) {
        return res.status(400).send({
          valid: false,
          error: "name is missing from the body",
        });
      }
      if (!req.body.address) {
        return res.status(400).send({
          valid: false,
          error: "address is missing from the body",
        });
      }
      // check if user already exists
      const customer = await Customer.findOne({
        callingCode: req.body.callingCode,
        phoneNumber: req.body.phoneNumber,
      });
      if (customer) {
        return res.status(400).send({
          valid: false,
          error: "Customer already exists",
        });
      }
      let response = await fetch("http://localhost:8080/validateNumber", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          callingCode: req.body.callingCode,
          phoneNumber: req.body.phoneNumber,
        }),
      });
      response = await response.json();
      if (!response.valid) {
        return res.status(400).send({
          valid: false,
          error: "Number not valid",
        });
      }
      const data = new Customer({
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        callingCode: req.body.callingCode,
        country: response.countryName,
        operator: response.operatorName,
      });

      const resp = await data.save();
      return res.status(200).send(resp);
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        error: "Error in servicing your request",
      });
    }
  });

  app.get("/customers", async (req, res) => {
    try {
      const resp = await Customer.find();
      if (resp.length === 0) {
        return res.status(404).send({
          error: "No customers found",
        });
      }
      return res.status(200).send(resp);
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        error: "Error in servicing your request",
      });
    }
  });

  app.delete("/customers/:id", async (req, res) => {
    try {
      const resp = await Customer.findByIdAndDelete(req.params.id);
      if (!resp) {
        return res.status(404).send({
          error: "No customer found",
        });
      }
      return res.status(200).send(resp);
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        error: "Error in servicing your request",
      });
    }
  });

  app.put("/customers/:id", async (req, res) => {
    try {
      var response = {};
      //find one
      const user = await Customer.findById(req.params.id);
      if (user) {
        if (user.phoneNumber !== req.body.phoneNumber) {
          const customer = await Customer.findOne({
            phoneNumber: req.body.phoneNumber,
          });
          if (customer) {
            return res.status(400).send({
              valid: false,
              error: "Number already exists",
            });
          }
          response = await fetch("http://localhost:8080/validateNumber", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              callingCode: req.body.callingCode,
              phoneNumber: req.body.phoneNumber,
            }),
          });
          response = await response.json();
          if (!response.valid) {
            return res.status(400).send({
              valid: false,
              error: "Number not valid",
            });
          }
        }
        const resp = await Customer.updateOne(
          { id: req.params.id },
          {
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            callingCode: req.body.callingCode,
            country: response.countryName
              ? response.countryName
              : req.body.country,
            operator: response.operatorName
              ? response.operatorName
              : req.body.operator,
          }
        );
        return res.status(200).send({
          message: "Customer updated successfully",
        });
      } else {
        return res.status(404).send({
          error: "No customer found",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        error: "Error in servicing your request",
      });
    }
  });
}

start();
app.listen(8000, () => {
  console.log("Server running on 8000");
});

module.exports = app;
