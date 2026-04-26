'use client'


import { useEffect, useState } from "react";
import { Excepcion, GrupoAsignatura, GrupoPrivilegioTipo, Hora, Sesion } from "@/types";
import { GetGrupoPrivilegios } from "@/lib/spi/privilegios";
import { useRouter } from "next/navigation";
import "./style.css"
import { ListaPrivilegios } from "@/componentes/GruposPrivilegios";
type Props = {
  grupoData: GrupoAsignatura;
  curso: number,
  nombre: string
};

export const GrupoDetalle = (params: Props) => {
  const {grupoData, curso, nombre} = params
  const [gruposPrivilegiados, setGruposPrivilegiados] = useState<GrupoPrivilegioTipo[]>([]);
  const [loading, setLoading] = useState(true);
  const urlBase =window.location.pathname;
  const router = useRouter();

  useEffect(() => {
    const fetchPrivilegios = async () => {
      setLoading(true);
     console.log(grupoData.privilegios)
      try {
        const results = await Promise.all(
          grupoData.privilegios.map((idPriv) =>
            GetGrupoPrivilegios({ id: idPriv })
          )
        );

        setGruposPrivilegiados(results);
      } finally {
        setLoading(false);
      }
    };

    if (grupoData?.privilegios?.length) {
      fetchPrivilegios();
    } else {
      setLoading(false);
      setGruposPrivilegiados([]);
    }
  }, [grupoData]);

  return (
    <div className="grupo-detalle">
      <h2>{nombre}</h2>
      <h3>{grupoData.tipo} Grupo {grupoData.grupo}</h3>
      <div className="seccion-grupos">
        <div className="lista">
          <div className="titulo-row">
            <h4>Profesores</h4>
            <button className="row-button">Añadir</button>
          </div>
          {grupoData.profesores?.length>0&&
            <ListaUsuarios usuarios={grupoData.profesores}/>
          }
        </div>
        <div className="lista">
          <div className="titulo-row">
            <h4>Alumnos</h4>
            <button className="row-button">Añadir</button>
          </div>

          {grupoData.alumnos?.length>0 &&
            <ListaUsuarios usuarios={grupoData.alumnos}/>
          }
        </div>

        <ListaPrivilegios privilegios={gruposPrivilegiados} urlBase={urlBase}/>
        <div>
          {grupoData.horarios?.length>0 &&
            <ListaHorarios horarios={grupoData.horarios}/>
          }
        </div>
        <div>
          {grupoData.fechas?.length>0&&
            <ListaFechas fechas={grupoData.fechas}/>
          }
        </div>

      </div>
      

    </div>
  );
};
type ListaUsuariosProps = {
  usuarios: string[];
};
const ListaUsuarios = ({usuarios}: ListaUsuariosProps) =>{

  return(
    <div >
      {usuarios.map((e) => (
        <div className="usuario-row" key={e}>
          <h4>{e}</h4>
          <button className="row-button">Eliminar</button>
        </div>
      ))}
    </div>
  )
}

type ListaHorariosProps = {
  horarios: Sesion[];
};
const formatearHora = (h:Hora) =>{

  return (h.hora+':'+h.minuto)
};
const ListaHorarios = ({ horarios }: ListaHorariosProps) => {


  return (
    <div className="lista">
     <div className="titulo-row">
        <h4>Horarios</h4>
        <button className="row-button">Añadir</button>
      </div>

      {horarios?.length ? (
        <div >
          {horarios.map((h, i) => (
            <div className="horario-card" key={i}>
             <div>
                <p><strong>Día:</strong> {h.dia}</p>
                <p><strong>Aula:</strong> {h.aula}</p>
                <p>
                  <strong>Duración:</strong>{" "}
                  {formatearHora(h.horaInicio)} - {formatearHora(h.horaFin)}
                </p>
             </div>
             <button>Eliminar</button>
            </div>
          ))}
        </div>
      ) : (
        <p>—</p>
      )}
    </div>
  );
};

type ListaFechasProps = {
  fechas: Excepcion[];
};

export const ListaFechas = ({ fechas }: ListaFechasProps) => {
  return (
    <div>
      <strong>Fechas:</strong>

      {fechas?.length ? (
        <div className="lista">
          {fechas.map((f, i) => (
            <div className="horario-card" key={i}>
              <div className="horario-info">
                <p><strong>Fecha:</strong> {f.fecha}</p>
                <p><strong>Aula:</strong> {f.aula}</p>
                <p>
                  <strong>Duración:</strong>{" "}
                  {formatearHora(f.horaInicio)} - {formatearHora(f.horaFin)}
                </p>
              </div>

              <button className="row-button eliminar-btn">
                Eliminar
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>—</p>
      )}
    </div>
  );
};