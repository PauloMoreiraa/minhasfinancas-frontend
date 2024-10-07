import ApiService from "../ApiService";
import localStorageService from "./LocalstorageService";

import jwt from "jsonwebtoken";

export const USUARIO_LOGADO = "_usuario_logado";
export const TOKEN = "access_token";

export default class AuthService{

    static isUsuarioAutenticado(){
        
        const token = localStorageService.obterItem(TOKEN);

        if(!token){
            return false;
        }

        const decodedToken = jwt.decode(token);

        const expiration = decodedToken.exp;
        const isTokenInvalido = Date.now() >= (expiration * 1000);

        return !isTokenInvalido;
    }

    static removerUsuarioAutenticado(){
        localStorageService.removerItem(USUARIO_LOGADO);
        localStorageService.removerItem(TOKEN);
    }

    static logar(usuario, token){
        localStorageService.adicionarItem(USUARIO_LOGADO, usuario);
        localStorageService.adicionarItem(TOKEN, token);
        ApiService.registrarToken(token);
    }

    static obterUsuarioAutenticado(){
        return localStorageService.obterItem(USUARIO_LOGADO);
    }

    static refreshSession(){
        const token = localStorageService.obterItem(TOKEN);
        const usuario = AuthService.obterUsuarioAutenticado();
        AuthService.logar(usuario, token);
        return usuario;
    }
}