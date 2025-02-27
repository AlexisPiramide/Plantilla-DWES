import UsuariosUsecases from "../../usuarios/application/usuarios.usecases";
import Transaccion from "../domain/Transaccion";
import transaccionesRepository from "../domain/transacciones.repository";

export default class transacionesUsecases{
    constructor(private transaccionRepository: transaccionesRepository, private usuarioUsecases: UsuariosUsecases) {}


    async getTransacionesUsuario(correo: string):Promise<Transaccion[]>{
        return this.transaccionRepository.getTransacionesUsuario(correo);
    }

    async getTodasTransacciones(): Promise<Transaccion[]> {
        return this.transaccionRepository.getTodasTransacciones();
    }

    async recargar(usuario:string,conserje:string,importe:number):Promise <Transaccion>{
        return this.transaccionRepository.recargar(usuario,conserje,importe);
    }
    async transaccion(usuario:string,conserje:string,concepto:string,importe:number):Promise <Transaccion>{
        
        const saldo = await this.usuarioUsecases.saldo(usuario);
        if(saldo>=importe){
            return this.transaccionRepository.transaccion(usuario,conserje,concepto,importe);
        }else{
            throw new Error("No hay saldo suficiente");
        }

        
    }
}