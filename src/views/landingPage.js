import React from "react";
import { withRouter } from "react-router-dom";


class LandingPage extends React.Component{

    go

    render(){
        return(
            <div className="container text-center">
                <h2>Bem Vindo(a) ao sistema Minas Finanças</h2>
                <p>Este é seu sistema para controle de finanças pessoais, clique no botão abaixo para acessar o sistema:</p><br/><br/>
                <div className="offset-md-4 col-md-4">
                    <button style={{width: '100%'}} className="btn btn-success">
                        <i className="pi pi-sign-in"></i> Acessar
                    </button>
                </div>
            </div>
        )
    }
}

export default withRouter(LandingPage)