'use client'

import { useRouter } from "next/navigation";
import { GrupoPrivilegioTipo } from "@/types";

type Props = {
  privilegios: string[] | GrupoPrivilegioTipo[];
  urlBase: string;
};

export const ListaPrivilegios = ({ privilegios, urlBase }: Props) => {
  const router = useRouter();

  const isEmpty = !privilegios || privilegios.length === 0;

  return (
    <div className="lista-grupos-row lista">

      <div className="seccion-header">
        <strong>Grupos Privilegiados</strong>
      </div>

      <div className="lista-grupos-row">
        {!isEmpty ? (
          privilegios.map((g: any) => {
            const value = g.nombre;

            return (
              <div
                key={`${value}`}
                className="grupo-chip"
                onClick={() => router.push(`${urlBase}/privilegio/${value}`)}
              >
                {value}
              </div>
            );
          })
        ) : (
          <div
            className="grupo-chip"
            onClick={() => router.push(`/admin/crear/crearprivilegios`)}
          >
            <h3>Crear</h3>
          </div>
        )}
      </div>

    </div>
  );
};