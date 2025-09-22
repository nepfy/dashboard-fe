import { NextResponse } from "next/server";

// Mock data for templates - in a real app, this would come from a database
const mockTemplates = [
  {
    id: "1",
    name: "flash",
    displayName: "Flash",
    description:
      "Template moderno e dinâmico com design limpo e foco na conversão",
    type: "flash" as const,
    isActive: true,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    previewImage: "/images/templates/flash-preview.jpg",
    colors: ["#146EF4", "#815ffd", "#2C2C2C", "#78838E", "#294D41", "#5E4D35"],
  },
  {
    id: "2",
    name: "prime",
    displayName: "Prime",
    description:
      "Template premium com layout sofisticado e elementos visuais avançados",
    type: "prime" as const,
    isActive: true,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
    previewImage: "/images/templates/prime-preview.jpg",
    colors: ["#815ffd", "#146EF4", "#2C2C2C", "#7C4257", "#5E4D35", "#78838E"],
  },
  {
    id: "3",
    name: "grid",
    displayName: "Grid",
    description:
      "Template com layout em grade para apresentação organizada de informações",
    type: "grid" as const,
    isActive: false,
    createdAt: "2024-01-05T10:00:00Z",
    updatedAt: "2024-01-05T10:00:00Z",
    previewImage: "/images/templates/grid-preview.jpg",
    colors: ["#2C2C2C", "#146EF4", "#78838E", "#294D41", "#5E4D35", "#7C4257"],
  },
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // For development purposes, allow access without authentication
    // In production, you should add proper admin role checking here

    const { id } = await params;
    const template = mockTemplates.find((t) => t.id === id);

    if (!template) {
      return NextResponse.json(
        { success: false, error: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error("Error fetching template:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // For development purposes, allow access without authentication
    // In production, you should add proper admin role checking here

    const { id } = await params;
    const templateIndex = mockTemplates.findIndex((t) => t.id === id);

    if (templateIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Template not found" },
        { status: 404 }
      );
    }

    // In a real app, you would delete from database
    const deletedTemplate = mockTemplates.splice(templateIndex, 1)[0];

    return NextResponse.json({
      success: true,
      data: deletedTemplate,
    });
  } catch (error) {
    console.error("Error deleting template:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
