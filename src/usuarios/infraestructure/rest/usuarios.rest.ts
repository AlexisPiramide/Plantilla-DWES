import express, { Request, Response } from "express";
import { createToken, isAuth} from "../../../../context/security/auth";
import usuarioRepository from "../../domain/usuarios.repository";
import UsuarioRepositoryPostgres from "../db/usuarios.repository.postgres";
import UsuarioUsecases from "../../application/usuarios.usecases";
import Usuario from "../../domain/Usuario";
import Conserje from "../../domain/Conserje";

const usuariorepositorypostgres: usuarioRepository = new UsuarioRepositoryPostgres();
const usuariousecases = new UsuarioUsecases(usuariorepositorypostgres);
const router = express.Router();



const nuevoUsuarioAPI = (req: Request) => {
    const correo : String = req.body.email
   
    const contraseña : String = req.body.password

    const id = correo.split("@")[0];

    if(isNaN(Number(id))){
        return {correo,contraseña} as Conserje
    }else{
        return {correo,contraseña } as Usuario;
    }
};

router.post("/registro", async (req: Request, res: Response) => {
    /*
     * #swagger.tags = ['Usuarios']
     * #swagger.description = 'Endpoint para registrar un usuario'
    */
    try {
        const usuarioAPI = nuevoUsuarioAPI(req);
        const usuario = await usuariousecases.registro(usuarioAPI);
        const token = createToken(usuario);
        res.status(201).json({user:{email:usuario.correo},token})
    } catch (error) {
       
        res.status(500).json({ mensaje: error.message });
    }
});

router.post("/entrar", async (req: Request, res: Response) => {
    /*
     * #swagger.tags = ['Usuarios']
     * #swagger.description = 'Endpoint para loguear un usuario'
    */
    try {
        const usuarioAPI = nuevoUsuarioAPI(req);
        const usuario = await usuariousecases.login(usuarioAPI);
        const token = createToken(usuario);
        res.status(200).json({result:{user:{email:usuario.correo},token}}) 
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

router.get("/saldo",isAuth, async (req: Request, res: Response) => {
    /*
     * #swagger.tags = ['Usuarios']
     * #swagger.description = 'Endpoint para ver el saldo de un usuario'
    */
    try {
        const correo : string = req.body.correo

        const saldo = await usuariousecases.saldo(correo);
        res.status(200).json({saldo})
    
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

export default router;