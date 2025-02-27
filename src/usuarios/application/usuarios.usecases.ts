import Usuario from '../domain/Usuario';
import UsuarioRepository from '../domain/usuarios.repository';
import Conserje from '../domain/Conserje';
import { compare } from "bcrypt";
import { hash } from "../../../context/security/encrypter";


export default class UsuariosUsecases {
    constructor(private usuariosRepository: UsuarioRepository) {}

    async registro(usuario: Usuario): Promise<Usuario> {
        if (!usuario.contraseña) throw new Error("Falta contraseña");
        
        usuario.contraseña = hash(usuario.contraseña);

        const usuarioBD = await this.usuariosRepository.registro(usuario)
        
        if (!usuarioBD) throw new Error("Usuario no encontrado");
        return usuarioBD
    }

    async login(usuario: Usuario): Promise<Usuario | Conserje> {
        if (!usuario.contraseña) throw new Error("Falta contraseña");

        const usuarioBD = await this.usuariosRepository.login(usuario);

        if (!usuarioBD) throw new Error("Usuario no encontrado");

        const iguales = await compare(usuario.contraseña, String(usuarioBD.contraseña));
        if (iguales) {
            return usuarioBD;
        } else {
            throw new Error("Usuario/contraseña no es correcto");
        }
    }

    async saldo(usuario: string): Promise<number>{

        const saldo = await this.usuariosRepository.saldo(usuario);

        if (!saldo) throw new Error("Error al recoger el saldo");

        return saldo
    }


   
}