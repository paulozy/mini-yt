import request from "supertest";
import app from "./app";

describe("GET /health", () => {
  it("should return status ok with service and timestamp", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.service).toBe("backend");
    expect(typeof response.body.timestamp).toBe("string");
    expect(new Date(response.body.timestamp).toISOString()).toBe(
      response.body.timestamp
    );
  });
});
