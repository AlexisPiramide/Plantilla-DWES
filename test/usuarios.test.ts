import request from "supertest";
import app from "./../src/app";
import createMongoConnection from "../context/mongo.db";
import { collections } from "../context/mongo.db";

describe("API Usuarios Tests", () => {
    
    beforeAll(async () => {
        await createMongoConnection();
        await collections.usuarios.deleteMany({});
    });

    beforeEach(async () => {
        await collections.usuarios.deleteMany({});
    });


    it("POST /api/usuarios/registro", async () => {
        const response = await request(app)
            .post("/api/usuarios/registro")
            .send({
                "alias": "test",
                "correo": "test",
                "password": "test"
            });
        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
        expect(response.body.usuario.alias).toBe("test");
        expect(response.body.usuario.correo).toBe("test");
    });
   
    it("POST /api/usuarios/login", async () => {
        doRegistro("test", "test");
        const response = await request(app)
            .post("/api/usuarios/login")
            .send({
                "correo": "test",
                "password": "test"
            });

        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
        expect(response.body.usuario.alias).toBe("test");
        expect(response.body.usuario.correo).toBe("test");
    });

    const doRegistro = async (correo: string, password: string) => {
        await request(app)
            .post("/api/usuarios/registro")
            .send({
                "correo": correo,
                "password": password
            });
    };


});