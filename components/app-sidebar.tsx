"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Users,
  FolderOpen,
  BarChart3,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "WA Management",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "WA Apps",
      logo: AudioWaveform,
      plan: "Professional",
    },
    {
      name: "Development",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart3,
      isActive: true,
      items: [
        {
          title: "Übersicht",
          url: "/dashboard",
        },
        {
          title: "Statistiken",
          url: "/dashboard/stats",
        },
        {
          title: "Einstellungen",
          url: "/dashboard/settings",
        },
      ],
    },
    {
      title: "Projekte",
      url: "/projects",
      icon: FolderOpen,
      items: [
        {
          title: "Alle Projekte",
          url: "/projects",
        },
        {
          title: "Neues Projekt",
          url: "/projects/new",
        },
        {
          title: "Archiv",
          url: "/projects/archive",
        },
      ],
    },
    {
      title: "Benutzer",
      url: "/users",
      icon: Users,
      items: [
        {
          title: "Benutzerliste",
          url: "/users",
        },
        {
          title: "Berechtigungen",
          url: "/users/permissions",
        },
        {
          title: "Gruppen",
          url: "/users/groups",
        },
      ],
    },
    {
      title: "Einstellungen",
      url: "/settings",
      icon: Settings2,
      items: [
        {
          title: "Allgemein",
          url: "/settings/general",
        },
        {
          title: "Team",
          url: "/settings/team",
        },
        {
          title: "Sicherheit",
          url: "/settings/security",
        },
        {
          title: "API",
          url: "/settings/api",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "/projects/design",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "/projects/sales",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "/projects/travel",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
