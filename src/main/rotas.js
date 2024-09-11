import React from "react";
import {Route, Switch, HashRouter} from 'react-router-dom'
import Login from "../views/login";
import CadastroUsuario from "../views/cadastroUsuario";
import Home from "../views/home";
import consultaLancamentos from "../views/lancamentos/consulta-lancamentos";
import cadastroLancamentos from "../views/lancamentos/cadastro-lancamentos";
import LandingPage from "../views/landingPage";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import { AuthConsumer } from "./provedorAutenticacao";


function RotaAutenticada({component: Component, isUsuarioAutenticado, ...props}){
    return(
        <Route exact {...props} render={(componentProps)=> {
            if(isUsuarioAutenticado){
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

function Rotas(props){
    return(
        <HashRouter>
            <Switch>
                <Route exact path="/" component={LandingPage}/>
                <Route path="/cadastro-usuarios" component={CadastroUsuario} />
                <Route path="/login" component={Login} />
                

                <RotaAutenticada isUsuarioAutenticado={props.isUsuarioAutenticado} path="/home" component={Home} />
                <RotaAutenticada isUsuarioAutenticado={props.isUsuarioAutenticado} path="/consulta-lancamentos" component={consultaLancamentos} />
                <RotaAutenticada isUsuarioAutenticado={props.isUsuarioAutenticado} path="/cadastro-lancamentos/:id?" component={cadastroLancamentos} />
            </Switch>
        </HashRouter>
    )
}

export default () => (
    <AuthConsumer>
        {(context) => (<Rotas isUsuarioAutenticado={context.isAutenticado} />)}
    </AuthConsumer>
)