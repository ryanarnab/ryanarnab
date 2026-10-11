import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "projects.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "images", "works");

export async function GET() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const projects = JSON.parse(raw);
    const showcaseCount = projects.filter((p: { status: string }) => p.status === "showcase").length;
    const totalCount = projects.length;

    return NextResponse.json({
      success: true,
      projects,
      metrics: {
        totalCount,
        showcaseCount,
        uploadingSoonCount: totalCount - showcaseCount,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // 1. Image upload handling
    const imageFile = formData.get("image") as File | null;
    let imagePath = "/images/works/brand-identity-1.png"; // fallback

    if (imageFile && typeof imageFile === "object" && imageFile.name) {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });

      const safeName = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const filePath = path.join(UPLOAD_DIR, safeName);
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      await fs.writeFile(filePath, buffer);
      imagePath = `/images/works/${safeName}`;
    }

    // 2. Read existing projects
    let projects: any[] = [];
    try {
      const raw = await fs.readFile(DATA_FILE, "utf-8");
      projects = JSON.parse(raw);
    } catch {
      projects = [];
    }

    // 3. Generate ID and Code
    const nextNum = projects.length + 1;
    const padNum = nextNum < 10 ? `0${nextNum}` : `${nextNum}`;

    const title = (formData.get("title") as string) || `EXPEDITION // ${padNum}`;
    const category = (formData.get("category") as string) || "Identity";
    const year = (formData.get("year") as string) || new Date().getFullYear().toString();
    const client = (formData.get("client") as string) || "Studio Expedition";
    const role = (formData.get("role") as string) || "Creative Direction & Design";
    const desc = (formData.get("desc") as string) || "Artifact exploration in spatial interface and relativistic design.";
    const status = (formData.get("status") as string) || "showcase"; // "showcase" or "uploading_soon"

    const rawTags = (formData.get("tags") as string) || "";
    const tags = rawTags
      ? rawTags.split(",").map((t) => t.trim()).filter(Boolean)
      : [category, "Expedition"];

    const objective = (formData.get("objective") as string) || "";
    const architecture = (formData.get("architecture") as string) || "";
    const impact = (formData.get("impact") as string) || "";

    const rawColors = (formData.get("colors") as string) || "";
    let colors = [
      { name: "Orbital Gold", hex: "#d4b068" },
      { name: "Deep Void", hex: "#08080C" },
    ];
    if (rawColors) {
      try {
        colors = JSON.parse(rawColors);
      } catch {
        colors = rawColors.split(",").map((c, i) => ({
          name: `Color ${i + 1}`,
          hex: c.trim().startsWith("#") ? c.trim() : `#${c.trim()}`,
        }));
      }
    }

    const newProject = {
      id: padNum,
      code: `EXP-${padNum}`,
      title,
      category,
      year,
      client,
      role,
      src: imagePath,
      desc,
      narrative: {
        objective: objective || desc,
        architecture: architecture || "Constructed on relativistic grid geometry with dynamic micro-interactions.",
        impact: impact || "Archived and deployed as an active artifact in the personal telemetry portfolio.",
      },
      colors,
      specs: [
        { label: "GRID SCALE", value: "8pt Modular System" },
        { label: "STATUS", value: status === "showcase" ? "Verified · Active" : "Archived · Locked" },
      ],
      tags,
      status,
    };

    // If new project is showcase, insert right after existing showcases or append
    projects.push(newProject);

    await fs.writeFile(DATA_FILE, JSON.stringify(projects, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      project: newProject,
      totalCount: projects.length,
      showcaseCount: projects.filter((p) => p.status === "showcase").length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
