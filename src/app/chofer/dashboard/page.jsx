"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { unitService } from "@/services/unitService";
import { maintenanceService } from "@/services/maintenanceService";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table } from "@/components/ui/table";

export default function DriverDashboard() {
  const { data: session } = useSession();
  const [unit, setUnit] = useState(null);
  const [parts, setParts] = useState([]);
  const [maintenances, setMaintenances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDriverData() {
      try {
        // Cargar unidad asignada
        const unitData = await unitService.getDriverUnit(session.user.id);
        setUnit(unitData);

        // Cargar partes de la unidad
        const partsData = await unitService.getUnitParts(unitData.id);
        setParts(partsData);

        // Cargar historial de mantenimientos
        const maintenanceData = await maintenanceService.getMaintenancesByUnit(unitData.id);
        setMaintenances(maintenanceData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (session?.user?.id) {
      loadDriverData();
    }
  }, [session]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Información de la unidad */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Mi Unidad</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Placa</p>
            <p className="font-medium">{unit?.placa}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Modelo</p>
            <p className="font-medium">{unit?.modelo}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Año</p>
            <p className="font-medium">{unit?.año}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Kilometraje</p>
            <p className="font-medium">{unit?.kilometraje} km</p>
          </div>
        </div>
      </Card>

      {/* Estado de componentes */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Estado de Componentes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {parts.map((part) => (
            <Card key={part.id} className="p-4">
              <h3 className="font-medium">{part.nombre}</h3>
              <p className="text-sm text-muted-foreground">
                Último mantenimiento: {part.ultimo_mantenimiento_km} km
              </p>
              <Alert className={part.estado === 'ALERTA' ? 'bg-red-100' : 'bg-green-100'}>
                <AlertTitle>Estado: {part.estado}</AlertTitle>
                <AlertDescription>
                  {part.estado === 'ALERTA' ? 'Requiere revisión' : 'En buen estado'}
                </AlertDescription>
              </Alert>
            </Card>
          ))}
        </div>
      </Card>

      {/* Historial de mantenimientos */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Historial de Mantenimientos</h2>
        <Table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Kilometraje</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {maintenances.map((maintenance) => (
              <tr key={maintenance.id}>
                <td>{new Date(maintenance.fecha_solicitud).toLocaleDateString()}</td>
                <td>{maintenance.tipo}</td>
                <td>{maintenance.kilometraje_actual} km</td>
                <td>{maintenance.estado}</td>
                <td>
                  <Button variant="ghost" size="sm">
                    Ver detalles
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Botón para nuevo mantenimiento */}
      <Button className="w-full">Registrar Nuevo Mantenimiento</Button>
    </div>
  );
} 