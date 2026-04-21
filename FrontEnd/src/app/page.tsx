'use client'

import LoginAdmin from "@/componentes/Login/LoginAdmin";
import LoginAlumnos from "@/componentes/Login/LoginAlumnos";
import LoginProfesores from "@/componentes/Login/LoginProfesores";
import {  useState } from "react";
import "./mainPage.css"
const Page = () => {
  const [token, setToken] = useState<string>('')

  return (
    <div>
      <h1>Pagina principal</h1>
      <div className="logins">
        <LoginProfesores setToken={setToken} token={token}  />
        <LoginAlumnos setToken={setToken} token={token}  />
        <LoginAdmin setToken={setToken} token={token} />
      </div>
    </div>
  );
}

export default Page;