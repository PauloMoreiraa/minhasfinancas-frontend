import React from "react";
import { withRouter } from "react-router-dom";


class LandingPage extends React.Component{

    goToHomePage = () => {
        this.props.history.push("/home");
    }

    render(){
        return(
            <div className="text-center">
                <h2>Bem Vindo(a) ao sistema <b>Minhas Finanças</b></h2>
                <p className="lead">Este é o seu sistema para controle de finanças pessoais, clique no botão abaixo para acessar o sistema.</p>
                <div className="d-flex justify-content-center align-items-center">
                    <button className="btn gap-1 btn-info d-flex align-items-center justify-content-center" onClick={this.goToHomePage}>
                        <i className="pi pi-sign-in"></i>Acessar
                    </button>
                </div>
            </div>
        )
    }
}

export default withRouter(LandingPage);