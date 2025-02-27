import express, { Request, Response } from "express";
import { createToken, isAuth, isConserje} from "../../../../context/security/auth";
import TransaccionesRepository from "../../domain/transacciones.repository"
import TransaccionesRepositoryPostgres from "../db/transacciones.repository.postgres";
import TransacionesUsecases from "../../application/transacciones.usecases";


import usuarioRepository from "./../../../usuarios/domain/usuarios.repository"
import UsuarioRepositoryPostgres from "./../../../usuarios/infraestructure/db/usuarios.repository.postgres";
import UsuarioUsecases from "../../../usuarios/application/usuarios.usecases";

const transaccionesRepositoryPostgres: TransaccionesRepository = new TransaccionesRepositoryPostgres();
const usuariorepositorypostgres: usuarioRepository = new UsuarioRepositoryPostgres();
const usuariousecases = new UsuarioUsecases(usuariorepositorypostgres);
const transacionesUsecases = new TransacionesUsecases(transaccionesRepositoryPostgres,usuariousecases);
const router = express.Router();


router.get("/",isAuth, async (req: Request, res: Response) => {
    /*
     * #swagger.tags = ['Transacciones']
     * #swagger.description = 'Endpoint para ver las transacciones de un usuario'
    */

    try {
            const correo : string = req.body.correo
    
            const transacciones = await transacionesUsecases.getTransacionesUsuario(correo);
     
            res.status(200).json({transacciones})
        
        } catch (error) {
            res.status(500).json({ mensaje: error.message });
    }
});

router.get("/todas",isConserje, async (req: Request, res: Response) => {
   /*
     * #swagger.tags = ['Transacciones']
     * #swagger.description = 'Endpoint para ver todas las transacciones'
    */

    try {
        const transacciones = await transacionesUsecases.getTodasTransacciones();


        const transaccionArregladasParaElFront = [];

        transacciones.map((transaccion)=>{
            transaccionArregladasParaElFront.push({
                id:transaccion.id,
                concepto: transaccion.concepto,
                "usuario":{email: transaccion.usuario},
                "conserje":{email: transaccion.conserje},
                importe: transaccion.importe,
                timestamp: transaccion.fecha
            })
        })

        res.status(200).json(transaccionArregladasParaElFront)

    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

router.post("/recargar",isConserje, async (req: Request, res: Response) => {
     /*
     * #swagger.tags = ['Transacciones']
     * #swagger.description = 'Endpoint para recargar'
    */

    const usuario = req.body.usuario
    const conserje = req.body.correo
    const importe: number  = req.body.importe

    try {
        const transacciones = await transacionesUsecases.recargar(usuario,conserje,importe);
        res.status(200).json({transacciones})

    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});

router.post("/transaccion",isConserje, async (req: Request, res: Response) => {
     /*
     * #swagger.tags = ['Transacciones']
     * #swagger.description = 'Endpoint para hacer transacciones'
    */
    const usuario = req.body.usuario
    const conserje = req.body.correo
    const concepto = req.body.concepto
    const importe: number = req.body.importe

    try {
        const transacciones = await transacionesUsecases.transaccion(usuario,conserje,concepto,importe);

        res.status(200).json({transacciones})

    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
});


export default router;