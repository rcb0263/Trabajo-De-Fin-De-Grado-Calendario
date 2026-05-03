'use client'

import { useRouter } from "next/navigation";
import { GrupoPrivilegio, GrupoPrivilegioTipo } from "@/types";
import { DeleteGrupoPrivilegios, quitarPrivilegios } from "@/lib/spi/privilegios";

type Props = {
  tipo: string
  setCambio: React.Dispatch<React.SetStateAction<boolean>>;
  setDerecha: React.Dispatch<React.SetStateAction<string>>;
  privilegios: string[] | GrupoPrivilegioTipo[];
  urlBase: string;
};

export const ListaPrivilegios = ({ privilegios, setDerecha, setCambio, tipo }: Props) => {
  const router = useRouter();

  const isEmpty = !privilegios || privilegios.length === 0;

  return (
    <div className="lista-grupos-row lista">
      <div className="titulo-row">
        <h4>Grupos Privilegiados:</h4>
        <button
            className="row-button"
            onClick={()=>{
              setDerecha('crearPrivilegio')
              setCambio(true)
            }}>
            Crear
          </button>
      </div>

      <div className="lista-grupos-row">
        {!isEmpty ? (
          privilegios.map((g: any) => {
            return ( 
              <div
                key={`${g.nombre}`}
                className="grupo-chip"
                onClick={() => {
                  setDerecha('detallePrivilegios')
                  setCambio(true)
                }}
              >
                <div >
                  <h3>Grupo: {g.nombre}</h3>
                  <h4>Mimebros: {g.miembros.length}</h4>
                </div>
                <button className="row-button"  onClick={() => {
                  DeleteGrupoPrivilegios({
                    objetivo: g.objetivo,
                    nombre: g.nombre,
                    tipo: tipo
                  })
                  setCambio(true)
                }
                }>Eliminar</button>
              </div>
            );
          })
        ) : (
          <p></p>
        )}
      </div>

    </div>
  );
};