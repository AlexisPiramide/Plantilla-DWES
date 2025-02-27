import Conserje from "../../domain/Conserje";
import Usuario from "../../domain/Usuario";
import usuariosRepository from "../../domain/usuarios.repository";
import executeQuery from "../../../../context/postgres.connector"

export default class UsuarioRepositoryPostgres implements usuariosRepository{

    async login(usuario: Usuario): Promise<Usuario | Conserje> {
        
        const query = `SELECT * FROM usuario WHERE usuario.correo='${usuario.correo}'`

        try {
            const usuarioDB: any[] = await executeQuery(query)
            if (!usuarioDB) throw new Error("Usuario/contraseña no es correcto");
            
            const usuarioMap: Usuario = {
                correo: usuarioDB[0].correo,
                contraseña: usuarioDB[0].contraseña,
                saldo: usuarioDB[0].saldo
            }
            return usuarioMap

        } catch (error) {
            throw new Error("Error al conectar a la base de datos")
        }
    }
    async  registro(usuario: Usuario): Promise<Usuario> {
        const query = `INSERT INTO usuario (correo,contraseña,saldo) VALUES ('${usuario.correo}','${usuario.contraseña}',0) RETURNING *`
        try {
            const usuarioDB: any[] = await executeQuery(query)
            if (!usuarioDB) throw new Error("Usuario/contraseña no es correcto");
            
            const usuarioMap: Usuario = {
                correo: usuarioDB[0].correo,
                contraseña: usuarioDB[0].contraseña,
                saldo: usuarioDB[0].saldo
            }
            return usuarioMap

        } catch (error) {
            throw new Error("Error al conectar a la base de datos")
        }
    }

    async saldo(usuario: string): Promise<number> {
        const query = `SELECT saldo FROM usuario WHERE usuario.correo='${usuario}'`
        try {
            const result: any[] = await executeQuery(query)
            if (!result) throw new Error("Error al recoger el usuario");
            
            const saldodb = result[0].saldo
     
            return saldodb

        } catch (error) {
            throw new Error("Error al conectar a la base de datos")
        }
    }

}