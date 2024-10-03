import React from "react";

function NavbarItem({render, ...props}){

    if(render){
        return(
            <li className="nav-item">
                <a onClick={props.onClick} style={{color:"#fff", transition:".4s"}} className="nav-link link" href={props.href}>{props.label}</a>
            </li>
        )
    }else{
        return false;
    }
    
}

export default NavbarItem;