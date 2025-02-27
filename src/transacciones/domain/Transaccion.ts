import Conserje from "../../usuarios/domain/Conserje";
import Usuario from "../../usuarios/domain/Usuario";

export default interface Transaccion{
    id: Number;
    concepto: string;
    usuario: Usuario;
    conserje: Conserje;
    importe: Number;
    fecha: Date;
}