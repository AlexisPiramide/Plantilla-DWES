import Transaccion from "./Transaccion";

export default interface transaccionesRepository{
    getTransacionesUsuario(correo: string):Promise<Transaccion[]>;
    getTodasTransacciones():Promise <Transaccion[]>;
    recargar(usuario:string,conserje:string,importe:number):Promise <Transaccion>;
    transaccion(usuario:string,conserje:string,concepto:string,importe:number):Promise <Transaccion>;
}