import React from "react";
import NavbarItem from "./navbarItem";
import { AuthConsumer } from "../main/provedorAutenticacao";
import "../css/navbar.css"

function Navbar(props){
    return(
    <div className="navbar nav-color navbar-expand-lg fixed-top">
        <div className="container">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarResponsive">
                <ul className="navbar-nav">
                    <NavbarItem render={props.isUsuarioAutenticado} href="#/home" label="Início" />
                    <NavbarItem render={props.isUsuarioAutenticado} href="#/cadastro-usuarios" label="Usuários" />
                    <NavbarItem render={props.isUsuarioAutenticado} href="#/consulta-lancamentos" label="Lançamentos" />
                    <NavbarItem render={props.isUsuarioAutenticado} onClick={props.deslogar} href="#/login" label="Sair" />
                </ul>
            </div>
            <a href="#/home" className="navbar-brand logo">Minhas Finanças</a>
        </div>
      </div>
    )
}

export default () => (
    <AuthConsumer>
        {(context) => (
            <Navbar isUsuarioAutenticado={context.isAutenticado} deslogar={context.encerrarSessao} />
        )}
    </AuthConsumer>
)