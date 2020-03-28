const request = require("supertest");
const app = require("./index");

describe("Search Cities", () => {
  it("Search for Monte", async () => {
    // expect(true).toBe(true);
    const res = await request(app).get("/search/?q=Monte");
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
