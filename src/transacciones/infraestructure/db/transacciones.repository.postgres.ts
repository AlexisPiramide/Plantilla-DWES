import executeQuery from "../../../../context/postgres.connector";
import Transaccion from "../../domain/Transaccion";
import transaccionesRepository from "../../domain/transacciones.repository";

export default class transaccionesRepositoryPostgres implements transaccionesRepository{

    async getTransacionesUsuario(correo: string): Promise<Transaccion[]> {

        const query = `SELECT * FROM transaccion WHERE transaccion.usuario='${correo}'`

        try {
            const transaccionDB: any[] = await executeQuery(query)
            if (!transaccionDB) throw new Error("No se ha encontrado usuario especificado, ¿seguro que existe?");
            
            const transaccionesMap: Transaccion[] = transaccionDB.map((transaccion)=>{
                return {
                    id: transaccion.id,
                    concepto: transaccion.concepto,
                    usuario: transaccion.usuario,
                    conserje:transaccion.conserje,
                    importe: transaccion.importe,
                    fecha: transaccion.fecha
                }
            })
            return transaccionesMap

        } catch (error) {
            throw new Error("Error al conectar a la base de datos")
        }
    }

    async getTodasTransacciones(): Promise<Transaccion[]> {
        const query = `SELECT * FROM transaccion`

        try {
            const transaccionDB: any[] = await executeQuery(query)
            
            const transaccionesMap: Transaccion[] = transaccionDB.map((transaccion)=>{
                return {
                    id: transaccion.id,
                    concepto: transaccion.concepto,
                    usuario: transaccion.usuario,
                    conserje:transaccion.conserje,
                    importe: transaccion.importe,
                    fecha: transaccion.fecha
                }
            })
            return transaccionesMap

        } catch (error) {
            throw new Error("Error al conectar a la base de datos")
        }
    }

    async recargar(usuario: string,conserje:string, importe: number): Promise<Transaccion> {
       
        const query = `INSERT INTO transaccion(usuario,concepto,conserje,importe,fecha) VALUES ('${usuario}','Recarga de saldo','${conserje}','${importe}',NOW()) RETURNING *`
        
        try {
            const transaccionDB: any[] = await executeQuery(query)
             
            const transaccion: Transaccion = {
                id: transaccionDB[0].id,
                concepto: transaccionDB[0].concepto,
                usuario: transaccionDB[0].usuario,
                conserje:transaccionDB[0].conserje,
                importe: transaccionDB[0].importe,
                fecha: transaccionDB[0].fecha
            }

            const query2 =  `UPDATE usuario SET saldo = saldo + ${importe} WHERE correo='${usuario}' returning *`
  
            const result = await executeQuery(query2)
            if(!result)throw new Error("Error al añadir el importe")
            return transaccion

        } catch (error) {
            throw new Error("Error al conectar a la base de datos")
        }
    }
    
    async transaccion(usuario: string,conserje:string,concepto:string, importe: number): Promise<Transaccion> {
        const negativo = -(Math.abs(importe))
        const query = `INSERT INTO transaccion(usuario,concepto,conserje,importe,fecha) VALUES ('${usuario}','${concepto}','${conserje}','${negativo}',NOW()) RETURNING *`

        try {
            const transaccionDB: any[] = await executeQuery(query)
            
            const query2 =  `UPDATE usuario SET saldo = saldo +${negativo} WHERE correo='${usuario}'`

            const result = await executeQuery(query2)
            if(!result)throw new Error("Error al añadir el importe")

            const transaccion: Transaccion = {
                id: transaccionDB[0].id,
                concepto: transaccionDB[0].concepto,
                usuario: transaccionDB[0].usuario,
                conserje:transaccionDB[0].conserje,
                importe: transaccionDB[0].importe,
                fecha: transaccionDB[0].fecha
            }
        
            return transaccion

        } catch (error) {
            throw new Error("Error al conectar a la base de datos")
        }
    }

}