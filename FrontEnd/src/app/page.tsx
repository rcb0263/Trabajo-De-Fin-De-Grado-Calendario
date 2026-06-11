'use client'

import LoginAdmin from "@/componentes/Login/LoginAdmin";
import LoginAlumnos from "@/componentes/Login/LoginAlumnos";
import LoginProfesores from "@/componentes/Login/LoginProfesores";
import {  useState } from "react";
import "./mainPage.css"
const Page = () => {

  return (
    <div className="maincontainer">
      <div className="logins">
        <LoginProfesores  />
        <LoginAlumnos />
        <LoginAdmin />
      </div>
    </div>
  );
}

export default Page;