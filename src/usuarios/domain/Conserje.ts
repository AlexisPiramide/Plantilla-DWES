import Usuario from "./Usuario";

export default interface Conserje extends Usuario{
    correo: string;
    contraseña: string;
}