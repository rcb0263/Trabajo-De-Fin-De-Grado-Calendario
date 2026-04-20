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
        <div className="admin-cell" onClick={()=>{router.push(`/admin/crearAsignatura`)}}>Crear Asignatura</div>
        <div className="admin-cell" onClick={()=>{router.push(`/admin/crearGrupoAsignatura`)}}>Crear Grupo Asignatura</div>
        <div className="admin-cell" onClick={()=>{router.push(`/admin/crearUsuario`)}}>Crear Usuario</div>
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