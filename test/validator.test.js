const request = require("supertest");
const app = require("../validator");
const mongoose = require('mongoose');

beforeAll(async () => {
  await mongoose.connect(process.env.DATABASE_URL);
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  process.on( 'SIGTERM', function () {
    
    app.close(function () {
      console.log( "Closed out remaining connections.");
      mongoose.connection.close();
    });
    
    setTimeout( function () {
      console.error("Could not close connections in time, forcefully shutting down");
      process.exit(1); 
    }, 30*1000);
 
 });
});

describe("Validator service", () => {
  test("correct number", async () => {
    const res = await request(app).post("/validateNumber").send({
      callingCode: "+91",
      phoneNumber: "7006982023",
    });
    expect(res.body.valid).toBe(true);
  });

  test("wrong number", async () => {
    const res = await request(app).post("/validateNumber").send({
      callingCode: "+91",
      phoneNumber: "70069820230",
    });
    expect(res.body.valid).toBe(false);
  });
});
