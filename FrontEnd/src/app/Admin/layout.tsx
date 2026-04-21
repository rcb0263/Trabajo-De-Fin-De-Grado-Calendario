'use client'
import React from "react";
import "./layoutStyle.css"
import { useRouter } from "next/navigation";


export default function AdminLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
  const router = useRouter()

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-cell" onClick={()=>{router.push(`/Admin/crearAsignatura`)}}>Crear Asignatura</div>
        <div className="admin-cell" onClick={()=>{router.push(`/Admin/crearGrupoAsignatura`)}}>Crear Grupo Asignatura</div>
        <div className="admin-cell" onClick={()=>{router.push(`/Admin/crearUsuario`)}}>Crear Usuario</div>
        <div className="admin-cell" onClick={()=>{router.push(`/Admin/crearEliminarAdministrador`)}}>Administradores</div>
        <div className="admin-cell" onClick={()=>{router.push(`/Admin/crearPrivilegios`)}}>Crear Privilegios</div>
        <div className="admin-cell">Asignaturas</div>
        <div className="admin-cell">Configuración</div>
      </aside>

      {/* Contenido principal */}
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}