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
    <div>

      <div className="seccion-header">
        <strong>Grupos Privilegiados</strong>
      </div>

      <div className="lista-grupos-row">
        {!isEmpty ? (
          privilegios.map((g: any, i: number) => {
            const value = typeof g === "string" ? g : g.nombre || g._id;

            return (
              <div
                key={`${value}-${i}`}
                className="grupo-chip"
                onClick={() => router.push(`${urlBase}/${value}`)}
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