import { GetAsignaturaById } from "@/lib/spi/asignaturas";
import { Asignatura, Aula, GrupoAsignatura, GrupoPrivilegio, GrupoPrivilegioTipo, Usuario } from "@/types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ListaPrivilegios } from "@/componentes/ListaPrivilegiosNombres";
import { DetallePrivilegios } from "@/componentes/DetallePrivilegios";
import { PrivilegiosUsuario } from "@/componentes/crear/FormularioCrearPrivilegios/Usuario";
import { EliminarUsuario, GetUsuario } from "@/lib/spi/usuarios";
import { AsignaturaBox } from "@/componentes/Buscadores/Asignatura/AsignaturaBox";
import "./style.css"
import { GetGrupoPrivilegios } from "@/lib/spi/privilegios";
import { PrivilegiosAula } from "@/componentes/crear/FormularioCrearPrivilegios/Aula";
import { EliminarAula, GetAula } from "@/lib/spi/aula";
import { ListaFechas, ListaHorarios } from "@/componentes/Buscadores/Asignatura/AsignaturaBox/AsignaturaInfo/GrupoAsignatura";
type AulaProps = {
  id: string
};

export const AulaDetalleCard = (params: AulaProps) => {
  const [aula, setAula] = useState<Aula|null>(null)
  const [cambio, setCambio] = useState(true);
  const [derecha, setDerecha] = useState<string>('')
  const [privilegio, setPrivilegio] = useState<GrupoPrivilegioTipo | null>(null);

  
  useEffect(()=>{
    if(cambio==true){
      GetAula({id: params.id }).then((e)=>{
        setAula(e)
    }).finally(() => {
        setCambio(false)
    });
    }
  },[params.id, cambio])


  return (
    <>
    
   {aula && <div className="ContenedorObjetoYPrivilegios">
          
      <div className="grupo-detalle">
        <h2>{aula.aula}</h2>
        <div className="seccion-grupos">

          <ListaPrivilegios 
            privilegios={aula.privilegios}
            setDerecha={setDerecha}
            setCambio={setCambio}
            setPrivilegio={setPrivilegio}
            tipo={'Aula'}
          />
          <div>
            <ListaHorarios 
                horarios={aula.horarios} 
                tipo={"Aula"}/>
          </div>
          <div>
              <ListaFechas 
              fechas={aula.exepciones}
              />
          </div>
        </div>
      

      </div>
      {aula && derecha=='crearPrivilegio' && 
        <PrivilegiosAula 
        data={{
          aula: aula.aula,
          setCambio: setCambio
        }}
        />
      }
      {derecha=='detallePrivilegios' && privilegio && 
      <DetallePrivilegios 
      privilegio={privilegio} 
      tipo={'Aula'} 
      nombreObjetivo={aula.aula}
      />}
    </div>}
    </>
  );
};