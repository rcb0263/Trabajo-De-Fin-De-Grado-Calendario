import React from "react";
import "./layoutStyle.css"
import "./formularioStyle.css"
import { AdminMenu } from "@/componentes/LayoutAdmin";


export default function AdminLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {

  return (
    <div className="admin-layout">
      <AdminMenu />
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}