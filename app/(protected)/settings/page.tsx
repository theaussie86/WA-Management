import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function SettingsPage() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Einstellungen</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Einstellungen</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-muted/50 p-6 rounded-xl">
            <h3 className="font-semibold mb-2">Allgemein</h3>
            <p className="text-sm text-muted-foreground">
              Allgemeine Einstellungen
            </p>
          </div>
          <div className="bg-muted/50 p-6 rounded-xl">
            <h3 className="font-semibold mb-2">Team</h3>
            <p className="text-sm text-muted-foreground">Team-Einstellungen</p>
          </div>
          <div className="bg-muted/50 p-6 rounded-xl">
            <h3 className="font-semibold mb-2">Sicherheit</h3>
            <p className="text-sm text-muted-foreground">
              Sicherheitseinstellungen
            </p>
          </div>
          <div className="bg-muted/50 p-6 rounded-xl">
            <h3 className="font-semibold mb-2">API</h3>
            <p className="text-sm text-muted-foreground">API-Einstellungen</p>
          </div>
        </div>
      </div>
    </>
  );
}

