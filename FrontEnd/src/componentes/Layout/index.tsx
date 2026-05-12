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
                <button onClick={()=>{
                    router.push(`/`)
                    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
                    }}>Log Off</button>
            </div>
        </div>
    )
}