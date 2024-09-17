import React from "react";
import { withRouter } from "react-router-dom";
import '../css/landingPage.css'


class LandingPage extends React.Component{

    goToHomePage = () => {
        this.props.history.push("/home")
    }

    render(){
        return(
            <div className="centralizado">
                <span className="bem-vindo">Bem Vindo(a) ao sistema </span>
                <h1><span className="destaque">Minhas Finanças</span></h1>
                <p>Este é o seu sistema para controle de finanças pessoais, clique no botão abaixo para acessar o sistema.</p>
                <button style={{width: '100%'}} className="btn-azul" onClick={this.goToHomePage}>
                    <span className="acessar">Acessar</span>&nbsp;<i className="pi pi-arrow-right"></i>
                </button>
            </div>
        )
    }
}

export default withRouter(LandingPage)