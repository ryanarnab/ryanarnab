import projectsData from "@/data/projects.json";

export interface ProjectColor {
  name: string;
  hex: string;
}

export interface ProjectSpec {
  label: string;
  value: string;
}

export interface ProjectNarrative {
  objective: string;
  architecture: string;
  impact: string;
}

export interface ProjectItem {
  id: string;
  code: string;
  number?: string;
  title: string;
  category: "Identity" | "Typography" | "3D & CGI" | "Art Direction" | "Editorial" | string;
  year: string;
  client?: string;
  role?: string;
  src: string;
  conceptSrc?: string;
  desc: string;
  description?: string;
  isUploadingSoon?: boolean;
  dossierId?: string;
  narrative?: ProjectNarrative;
  colors?: ProjectColor[];
  specs?: ProjectSpec[];
  tags: string[];
  status: "showcase" | "uploading_soon";
  externalUrl?: string;
}

export const PROJECTS: ProjectItem[] = projectsData as ProjectItem[];

/**
 * Returns all registered projects
 */
export function getAllProjects(): ProjectItem[] {
  return PROJECTS;
}

/**
 * Returns only actively showcased projects (publicly inspectable)
 */
export function getShowcaseProjects(): ProjectItem[] {
  return PROJECTS.filter((p) => p.status === "showcase");
}

/**
 * Returns projects in "uploading soon" status
 */
export function getUploadingSoonProjects(): ProjectItem[] {
  return PROJECTS.filter((p) => p.status === "uploading_soon");
}

/**
 * Find project by either id ("01") or code ("EXP-01")
 */
export function getProjectById(identifier: string): ProjectItem | undefined {
  return PROJECTS.find(
    (p) => p.id === identifier || p.code === identifier || p.id === identifier.replace(/^0+/, "")
  );
}

/**
 * Compute reactive numerical metrics for tactical telemetry and header UI
 */
export function getProjectMetrics() {
  const all = getAllProjects();
  const showcase = getShowcaseProjects();
  const uploadingSoon = getUploadingSoonProjects();

  const showcaseCount = showcase.length;
  const totalCount = all.length;

  return {
    totalCount,
    showcaseCount,
    uploadingSoonCount: uploadingSoon.length,
    formattedShowcaseCount: showcaseCount < 10 ? `0${showcaseCount}` : `${showcaseCount}`,
    formattedTotalCount: totalCount < 10 ? `0${totalCount}` : `${totalCount}`,
  };
}
