'use client'
import "./styles.css"

export const Layout =()=>{

    return(
        <div className="header">
            <div className="logo">Logo</div>
            <div className="usuario">
                <h2>Usuario</h2>
                <button onClick={()=>{}}>Log Off</button>
            </div>
        </div>
    )
}