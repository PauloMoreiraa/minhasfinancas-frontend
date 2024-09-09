import localStorageService from "./localstorageService"

export const USUARIO_LOGADO = '_usuario_logado'

export default class AuthService{

    static idUsuarioAutenticado(){
        const usuario = localStorageService.obterItem('_usuario_logado')
        return usuario && usuario.id;
    }

    static removerUsuarioAutenticado(){
        localStorageService.removerItem('_usuario_logado')
    }
}