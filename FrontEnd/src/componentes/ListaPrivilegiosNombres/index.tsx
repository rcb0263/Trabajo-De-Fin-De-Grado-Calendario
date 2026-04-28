'use client'

import { useRouter } from "next/navigation";
import { GrupoPrivilegioTipo } from "@/types";

type Props = {
  setPrivilegios: React.Dispatch<React.SetStateAction<GrupoPrivilegioTipo | null>>;
  setCrearPrivilegios: React.Dispatch<React.SetStateAction<boolean>>;
  crearPrivilegio: boolean;
  privilegios: string[] | GrupoPrivilegioTipo[];
  urlBase: string;
};

export const ListaPrivilegios = ({ privilegios, urlBase, crearPrivilegio, setPrivilegios, setCrearPrivilegios }: Props) => {
  const router = useRouter();

  const isEmpty = !privilegios || privilegios.length === 0;

  return (
    <div className="lista-grupos-row lista">

      <div className="seccion-header">
        <div className="lista">
          <div className="titulo-row">
          <strong>Grupos Privilegiados</strong>
          
          <button
            className="row-button"
            onClick={()=>{
              setCrearPrivilegios(!crearPrivilegio)
            }}>
            Crear
          </button>
        </div>
        </div>
      </div>

      <div className="lista-grupos-row">
        {!isEmpty ? (
          privilegios.map((g: any) => {
            return ( 
              <div
                key={`${g.nombre}`}
                className="grupo-chip"
                onClick={() => {
                  setPrivilegios(g)
                  setCrearPrivilegios(false)
                }}
              >
                {g.nombre}
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