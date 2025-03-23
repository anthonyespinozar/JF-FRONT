"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bus, Wrench, Clock } from "lucide-react";
import Link from "next/link";
import { OwnerDashboardStats } from "@/components/owners/owner-dashboard-stats";
import { OwnerMaintenanceChart } from "@/components/owners/owner-maintenance-chart";
import { OwnerRecentMaintenances } from "@/components/owners/owner-recent-maintenances";
import { OwnerMaintenanceAlerts } from "@/components/owners/owner-maintenance-alerts";

const owners = [
  {
    id: "1",
    name: "Transportes Rápidos S.A.",
    contactPerson: "Roberto Gómez",
    email: "roberto.gomez@transportesrapidos.com",
    phone: "+52 555 123 4567",
    address: "Av. Principal 123, Ciudad de México",
    unitsCount: 8,
    status: "Activo",
  },
  {
    id: "2",
    name: "Autobuses del Norte",
    contactPerson: "María Rodríguez",
    email: "maria.rodriguez@autobusesnorte.com",
    phone: "+52 555 987 6543",
    address: "Calle Norte 456, Monterrey",
    unitsCount: 12,
    status: "Activo",
  },
];

export default function OwnerDashboardPage({ params }) {
  const router = useRouter();
  const [owner, setOwner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const foundOwner = owners.find((o) => o.id === params.id);
      if (foundOwner) {
        setOwner(foundOwner);
      } else {
        router.push("/duenos");
      }
      setIsLoading(false);
    }, 500);
  }, [params.id, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/duenos" passHref>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" /> Volver a Dueños
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard de {owner.name}</h1>
          <p className="text-muted-foreground">Resumen de unidades, mantenimientos y alertas</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/duenos/${owner.id}/unidades`} passHref>
            <Button variant="outline">
              <Bus className="mr-2 h-4 w-4" /> Ver Unidades
            </Button>
          </Link>
          <Link href={`/reportes/por-dueno?dueno=${owner.id}`} passHref>
            <Button variant="outline">
              <Wrench className="mr-2 h-4 w-4" /> Ver Reportes
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Información del Dueño</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Contacto</h3>
              <p className="font-medium">{owner.contactPerson}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p className="font-medium">{owner.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Teléfono</h3>
              <p className="font-medium">{owner.phone}</p>
            </div>
            <div className="md:col-span-3">
              <h3 className="text-sm font-medium text-muted-foreground">Dirección</h3>
              <p className="font-medium">{owner.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <OwnerMaintenanceAlerts ownerId={owner.id} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <OwnerDashboardStats ownerId={owner.id} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="bg-primary/10 p-1.5 rounded-md mr-2">
                <Wrench className="h-5 w-5 text-primary" />
              </span>
              Mantenimientos por Mes
            </CardTitle>
            <CardDescription>Distribución de mantenimientos preventivos y correctivos</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <OwnerMaintenanceChart ownerId={owner.id} />
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="bg-primary/10 p-1.5 rounded-md mr-2">
                <Clock className="h-5 w-5 text-primary" />
              </span>
              Mantenimientos Recientes
            </CardTitle>
            <CardDescription>Últimos mantenimientos registrados para este dueño</CardDescription>
          </CardHeader>
          <CardContent>
            <OwnerRecentMaintenances ownerId={owner.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
