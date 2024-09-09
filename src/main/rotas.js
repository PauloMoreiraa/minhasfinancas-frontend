import React from "react";
import {Route, Switch, HashRouter} from 'react-router-dom'
import Login from "../views/login";
import CadastroUsuario from "../views/cadastroUsuario";
import Home from "../views/home";
import consultaLancamentos from "../views/lancamentos/consulta-lancamentos";
import cadastroLancamentos from "../views/lancamentos/cadastro-lancamentos";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import AuthService from "../app/service/authService";


function RotaAutenticada({component: Component, ...props}){
    return(
        <Route {...props} render={(componentProps)=> {
            if(AuthService.idUsuarioAutenticado()){
               return(
                    <Component {...componentProps} />
               ) 
            }else{
                return(
                    <Redirect to={{pathname: '/login', state : {from: componentProps.location}}} />
                )
            }
        }} />
    )
}

function Rotas(){
    return(
        <HashRouter>
            <Switch>
                <Route path="/cadastro-usuarios" component={CadastroUsuario} />
                <Route path="/login" component={Login} />

                <RotaAutenticada path="/home" component={Home} />
                <RotaAutenticada path="/consulta-lancamentos" component={consultaLancamentos} />
                <RotaAutenticada path="/cadastro-lancamentos/:id?" component={cadastroLancamentos} />
            </Switch>
        </HashRouter>
    )
}

export default Rotas