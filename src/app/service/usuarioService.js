import ApiService from "../apiservice";
import ErroValidacao from "./exception/ErroValidacao";

class UsuarioService extends ApiService{
    constructor(){
        super('/api/usuarios');
    }

    autenticar(credenciais){
        return this.post('/autenticar', credenciais);
    }

    obterSaldoPorUsuario(id){
        return this.get(`/${id}/saldo`);
    }

    salvar(usuario){
        return this.post('', usuario);
    }

    validar(usuario){
        const erros = []

        if(!usuario.nome){
            erros.push('O campo Nome é obrigatório.');
        }
        if(!usuario.email){
            erros.push('O campo Email é obrigatório.');
        }else if(!usuario.email.match(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]/)){
            erros.push('Informe um Email válido.');
        }

        if(!usuario.senha || !usuario.senhaRepeticao){
            erros.push('Digite a senha 2x.');
        }else if(usuario.senhaRepeticao !== usuario.senha ){
            erros.push('As senhas não correspondem.');
        }else{
            if (usuario.senha.length < 8) {
                erros.push('A senha deve ter pelo menos 8 caracteres.');
            }
            if (!/[a-zA-Z]/.test(usuario.senha)) {
                erros.push('A senha deve conter pelo menos uma letra.');
            }
            if (!/\d/.test(usuario.senha)) {
                erros.push('A senha deve conter pelo menos um número.');
            }
        }

        if(erros && erros.length>0){
            throw new ErroValidacao(erros);
        }
    }
}

export default UsuarioService;