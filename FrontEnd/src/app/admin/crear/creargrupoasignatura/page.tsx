'use client'
import CrearGrupoAsignatura from "@/componentes/crear/GrupoAsignatura";
import {  crearGrupoAsignatura } from "@/lib/spi/asignaturas";
import { useEffect, useState } from "react";
const Page = () => {
  
  return (
    <CrearGrupoAsignatura/>
  );
}

export default Page;