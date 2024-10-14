import React from "react";
import {Route, Switch, HashRouter} from "react-router-dom";
import Login from "../views/Login";
import CadastroUsuario from "../views/CadastroUsuario";
import Home from "../views/Home";
import ConsultaLancamentos from "../views/lancamentos/ConsultaLancamentos";
import CadastroLancamentos from "../views/lancamentos/CadastroLancamentos";
import LandingPage from "../views/LandingPage";
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
                    <Redirect to={{pathname: '/Login', state : {from: componentProps.location}}} />
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
                <Route path="/CadastroUsuario" component={CadastroUsuario} />
                <Route path="/Login" component={Login} />
                

                <RotaAutenticada isUsuarioAutenticado={props.isUsuarioAutenticado} path="/Home" component={Home} />
                <RotaAutenticada isUsuarioAutenticado={props.isUsuarioAutenticado} path="/ConsultaLancamentos" component={ConsultaLancamentos} />
                <RotaAutenticada isUsuarioAutenticado={props.isUsuarioAutenticado} path="/CadastroLancamentos/:id?" component={CadastroLancamentos} />
            </Switch>
        </HashRouter>
    )
}

export default () => (
    <AuthConsumer>
        {(context) => (<Rotas isUsuarioAutenticado={context.isAutenticado} />)}
    </AuthConsumer>
)