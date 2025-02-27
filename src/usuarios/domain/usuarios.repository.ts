import Conserje from "./Conserje";
import Usuario from "./Usuario";

export default interface usuariosRepository{
    login(usuario:Usuario): Promise<Usuario | Conserje>
    registro(usuario: Usuario): Promise<Usuario> 
    saldo(usuario: string): Promise<number>
}