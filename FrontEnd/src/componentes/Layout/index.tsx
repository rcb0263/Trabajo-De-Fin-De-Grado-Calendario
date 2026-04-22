'use client'
import { useRouter } from "next/navigation"
import "./styles.css"

export const Layout =()=>{
  const router = useRouter()

    return(
        <div className="header">
            <div className="logo"onClick={()=>{router.push(`/admin`)}}>Logo</div>
            <div className="usuario">
                <h2>Usuario</h2>
                <button onClick={()=>{router.push(`/`)}}>Log Off</button>
            </div>
        </div>
    )
}