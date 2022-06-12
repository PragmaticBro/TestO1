const request = require("supertest");
const app = require("../customer");
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

describe("Customer Service", () => {
  test("get all customers", async () => {
    const res = await request(app)
      .get("/customers");
      expect(res.body).toBeInstanceOf(Array);
  });


  test("get all customers if list empty", async () => {
    const res = await request(app)
      .get("/customers");
      if(res.body.length === 0) {
        expect(res.status).toBe(404);
      }
      expect(res.body).toBeInstanceOf(Array);
  });

  test("adds, updates and deletes customer", async () => {
    const res = await request(app)
      .post("/customers")
      .send({
        name: "John",
        phoneNumber: "7051085271",
        address: "123 Main St",
        callingCode: "91",
      });
      expect(res.status).toBe(200);
      const upd = await request(app)
      .put("/customers/" + res.body._id)
      .send({
        name: "John Doe",
        phoneNumber: "7051085271",
        address: "123 Main St",
        callingCode: "91",
      });
      expect(upd.body.message).toContain("Customer updated successfully");
      const del = await request(app)
      .delete("/customers/" + res.body._id);
      expect(del.body.name).toContain("John Doe");
  });
});
