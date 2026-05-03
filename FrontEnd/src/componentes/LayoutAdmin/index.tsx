'use client'
import { useRouter } from "next/navigation"

export const AdminMenu =()=>{
  const router = useRouter()

    return(
      <aside className="admin-sidebar">
        <div className="admin-cell" onClick={()=>{router.push(`/admin`)}}>Asignaturas</div>
        <div className="admin-cell" onClick={()=>{router.push(`/admin`)}}>Usuario</div>
        <div className="admin-cell" onClick={()=>{router.push(`/admin`)}}>Aula</div>
        <div className="admin-cell" onClick={()=>{router.push(`/admin/crear/crearasignatura`)}}>Crear Asignatura</div>
        <div className="admin-cell" onClick={()=>{router.push(`/admin/crear/creargrupoasignatura`)}}>Crear Grupo Asignatura</div>
        <div className="admin-cell" onClick={()=>{router.push(`/admin/crear/crearusuario`)}}>Crear Usuario</div>
        <div className="admin-cell" onClick={()=>{router.push(`/admin/crear/creareliminaradministrador`)}}>Administradores</div>
        <div className="admin-cell" onClick={()=>{router.push(`/admin/crear/crearprivilegios`)}}>Crear Privilegios</div>
        <div className="admin-cell" onClick={()=>{router.push(`/admin/crear/cambiarprivilegios`)}}>Cambiar Privilegios</div>
      </aside>
    )
}