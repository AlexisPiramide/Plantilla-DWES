import request from "supertest";
import app from "./../src/app";
import  executeQuery  from "../context/postgres.connector";

describe("API Transacciones Tests", () => {
    
    beforeAll(async () => {
       await executeQuery("DELETE FROM usuario")
       await executeQuery("DELETE FROM transaccion")
    });

    beforeEach(async () => {
        await executeQuery("DELETE FROM transaccion")
        await executeQuery("DELETE FROM usuario")
    });


    it("GET /api/transacciones/", async () => {
        const token = await doRegistro("1234@gmail.com","test")
        const response = await request(app)
            .get("/api/transacciones/")
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.transacciones).toStrictEqual([]);
    });

    it("GET /api/transacciones/todas", async () => {
        const token = await doRegistro("pepe@gmail.com","test")
        const response = await request(app)
            .get("/api/transacciones/todas")
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual([]);
    });

    it("GET /api/transacciones/todas", async () => {
        const token = await doRegistro("1234@gmail.com","test")
        const response = await request(app)
            .get("/api/transacciones/todas")
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(401);
    });
   
    it("POST /api/transacciones/recargar", async () => {
        const token = await doRegistro("pepe@gmail.com", "test");
        await doRegistro("1234@gmail.com", "test");
        const usuario = "1234@gmail.com"
        const importe = 10.00;
        const response = await request(app)
            .post("/api/transacciones/recargar")
            .set('Authorization', `Bearer ${token}`)
            .send({
                usuario,
                importe
            });

        expect(response.status).toBe(200);
       
    });

    it("POST /api/transacciones/transaccion", async () => {
        const token = await doRegistro("pepe@gmail.com", "test");
        await doRegistro("1234@gmail.com", "test");
        await doRecarga(token,"1234@gmail.com",20)

        const usuario = "1234@gmail.com"
        const concepto = "Test"
        const importe = 15;
        
        const response = await request(app)
            .post("/api/transacciones/transaccion")
            .set('Authorization', `Bearer ${token}`)
            .send({
                usuario,
                concepto,
                importe
            });
        
        expect(response.status).toBe(200);
        expect(response.body.transacciones.concepto).toBe("Test")
        expect(response.body.transacciones.conserje).toBe("pepe@gmail.com")
        expect(response.body.transacciones.usuario).toBe("1234@gmail.com")
        expect(response.body.transacciones.importe).toBe("-15.00")
       
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

    const doRecarga = async (token:string,usuario: string,importe: number) => {
        const response = await request(app)
            .post("/api/transacciones/recargar")
            .set('Authorization', `Bearer ${token}`)
            .send({
                usuario,
                importe
            });
        return response.body;
    }

        
});