import React from "react";
import NavbarItem from "./NavbarItem";
import { AuthConsumer } from "../main/provedorAutenticacao";

function Navbar(props){
    return(
    <div className="navbar navbar-expand-lg bg-primary fixed-top">
        <div className="container">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" style={{color:"#fff"}}><i className="pi pi-bars"></i></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarResponsive">
                <ul className="navbar-nav">
                    <NavbarItem render={props.isUsuarioAutenticado} href="#/Home" label="Início" />
                    <NavbarItem render={props.isUsuarioAutenticado} href="#/CadastroUsuario" label="Usuários" />
                    <NavbarItem render={props.isUsuarioAutenticado} href="#/ConsultaLancamentos" label="Lançamentos" />
                    <NavbarItem render={props.isUsuarioAutenticado} onClick={props.deslogar} href="#/Login" label="Sair" />
                </ul>
            </div>
            <a href="#/home" className="navbar-brand branco">Minhas Finanças</a>
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