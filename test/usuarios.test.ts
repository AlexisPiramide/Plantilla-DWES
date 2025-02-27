import request from "supertest";
import app from "./../src/app";
import  executeQuery  from "../context/postgres.connector";

describe("API Usuarios Tests", () => {
    
    beforeAll(async () => {
       await executeQuery("DELETE FROM usuario")
    });

    beforeEach(async () => {
        await executeQuery("DELETE FROM usuario")
    });


    it("POST /api/usuarios/registro", async () => {
        const response = await request(app)
            .post("/api/usuarios/registro")
            .send({
                "email": "test@gmail.com",
                "password": "test"
            });
        expect(response.status).toBe(201);
        expect(response.body.token).toBeDefined();
        expect(response.body.user.email).toBe("test@gmail.com");
    });
   
    it("POST /api/usuarios/entrar", async () => {
        doRegistro("test@gmail.com", "test");
        const response = await request(app)
            .post("/api/usuarios/entrar")
            .send({
                "email": "test@gmail.com",
                "password": "test"
            });
        expect(response.status).toBe(200);
        expect(response.body.result.user.email).toBe("test@gmail.com");
    });

    it("POST /api/usuarios/entrar", async () => {
        doRegistro("1234@gmail.com", "test");
        const response = await request(app)
            .post("/api/usuarios/entrar")
            .send({
                "email": "1234@gmail.com",
                "password": "test"
            });

        expect(response.status).toBe(200);
        expect(response.body.result.user.email).toBe("1234@gmail.com");
    });

    it("GET /api/usuarios/saldo", async () => {
        const token = await doRegistro("1234@gmail.com", "test");
        const response = await request(app)
            .get("/api/usuarios/saldo")
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(Number(response.body.saldo)).toBe(0.00);
        
    });

    it("GET /api/usuarios/saldo", async () => {
        const token = await doRegistro("test@gmail.com", "test");
        const response = await request(app)
            .get("/api/usuarios/saldo")
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(401);
        
    });

    const doRegistro = async (email: string, password: string) => {
        const response = await request(app)
            .post("/api/usuarios/registro")
            .send({
                email,
                password,
            });
            
        return response.body.token;
    }

});