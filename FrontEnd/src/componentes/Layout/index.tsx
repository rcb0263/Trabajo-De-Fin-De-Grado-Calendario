'use client'
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import "./styles.css"

export const Layout =()=>{
  const router = useRouter()
  const pathname = usePathname()

    return(
        <div className="header">
            <div className="logo"onClick={()=>{router.push(`/admin`)}}> 
                <Image
                className="imagen"
                    src="/imagenes/Planifica_Logo.jpg"
                    alt="Logo"
                    width={70}
                    height={46}
                /></div>
            <div className="usuario">
                { pathname.includes('admin')  &&<h2>Admin</h2>}
                { pathname.includes('profesores')  &&<h2>Profesor</h2>}
                { pathname.includes('alumnos')  &&<h2>Alumno</h2>}
                <button onClick={()=>{
                    router.push(`/`)
                    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
                    }}>Log Off</button>
            </div>
        </div>
    )
}