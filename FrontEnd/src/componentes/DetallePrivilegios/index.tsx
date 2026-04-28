import { GrupoPrivilegioTipo } from "@/types"
import { useState } from "react";
import "./style.css"
import { darPrivilegios } from "@/lib/spi/privilegios";

interface Props {
    privilegio: GrupoPrivilegioTipo,
    tipo: string,
    nombreObjetivo: string
}

export const DetallePrivilegios = (params: Props) => {
    const {privilegio, tipo, nombreObjetivo} = params
       

    return (
    <div className="detallePrivilegios">
      <div className="titulo-row">
        <h4>Privilegio {privilegio.nombre}</h4>
      </div>
      <div className="privilegio-row">
        <h4><strong>{tipo} </strong>{nombreObjetivo}</h4>
      </div>
      <div className="lista">
        
        <h4><strong>Privilegios</strong></h4>
        <div className="privilegio-row">
            <h5>Privilegios Basicos:  </h5>
            <input type="checkbox" 
            checked={privilegio.basicos} 
            disabled
            />
        </div>
        <div className="privilegio-row">
            <h5>Privilegios Avanzados:</h5>
            <input type="checkbox" 
                checked={privilegio.avanzados} 
                disabled
                />
        </div>
        {'profesores' in privilegio &&
        <div className="privilegio-row">
            <h5>Privilegios Profesores:</h5>
            <input type="checkbox" 
            checked={privilegio.profesores} 
            disabled
            />
        </div>
        }
        {'asignaturas' in privilegio&&
        <div className="privilegio-row">
            <h5>Privilegios Modificar Asignaturas:</h5>
             <input type="checkbox" 
            checked={privilegio.asignaturas} 
            disabled
            />
        </div>
        }
    </div>
    <div className="lista">
            <div className="titulo-row">
            <h4>Miembro</h4>
            </div>
            <div>
            {privilegio.miembros.map(e=>
                <div className="usuario-row" key={e.miembro}>
                    <p>{e.miembro}</p>
                    <p>{e.fechaFin}</p>
                </div>
            )}
            </div>
        </div>

    </div>
  );
};