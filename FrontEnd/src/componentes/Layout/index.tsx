'use client'
import { useRouter } from "next/navigation"
import Image from "next/image"
import "./styles.css"

export const Layout =()=>{
  const router = useRouter()

    return(
        <div className="header">
            <div className="logo"onClick={()=>{router.push(`/admin`)}}> 
                <Image
                className="imagen"
                    src="/imagenes/Planifica_Logo.jpg"
                    alt="Logo"
                    width={120}
                    height={60}
                /></div>
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