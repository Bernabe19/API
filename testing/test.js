const test = require("supertest");
require('dotenv').config();
const baseURL = `http://localhost:${process.env.PORT}/api/usuarios`;

describe("GET /nombre", () =>{
    it("debería devolver los nombres de usuario", async () =>{
        const response = await test(baseURL).get("/nombre");
        expect(response.statusCode).toBe(201);
        expect(response.body.ok).toBe(true);
        expect(response.body.msg).toBe("Obtención de nombres de Usuarios");
        expect(response.body.length != {}).toBe(true);
    })
})