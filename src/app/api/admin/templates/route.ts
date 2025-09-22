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

export async function GET() {
  try {
    // For development purposes, allow access without authentication
    // In production, you should add proper admin role checking here
    
    return NextResponse.json({
      success: true,
      data: mockTemplates,
    });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // For development purposes, allow access without authentication
    // In production, you should add proper admin role checking here

    const body = await request.json();
    const { name, displayName, description, type, isActive, colors } = body;

    // Validate required fields
    if (!name || !displayName || !description || !type) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new template
    const newTemplate = {
      id: (mockTemplates.length + 1).toString(),
      name,
      displayName,
      description,
      type,
      isActive: isActive ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      previewImage: `/images/templates/${type}-preview.jpg`,
      colors: colors || ["#146EF4", "#815ffd", "#2C2C2C"],
    };

    // In a real app, you would save to database
    mockTemplates.push(newTemplate);

    return NextResponse.json({
      success: true,
      data: newTemplate,
    });
  } catch (error) {
    console.error("Error creating template:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    // For development purposes, allow access without authentication
    // In production, you should add proper admin role checking here

    const body = await request.json();
    const { id, name, displayName, description, type, isActive, colors } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Template ID is required" },
        { status: 400 }
      );
    }

    // Find template by ID
    const templateIndex = mockTemplates.findIndex((t) => t.id === id);

    if (templateIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Template not found" },
        { status: 404 }
      );
    }

    // Update template
    const updatedTemplate = {
      ...mockTemplates[templateIndex],
      ...(name && { name }),
      ...(displayName && { displayName }),
      ...(description && { description }),
      ...(type && { type }),
      ...(isActive !== undefined && { isActive }),
      ...(colors && { colors }),
      updatedAt: new Date().toISOString(),
    };

    // In a real app, you would update in database
    mockTemplates[templateIndex] = updatedTemplate;

    return NextResponse.json({
      success: true,
      data: updatedTemplate,
    });
  } catch (error) {
    console.error("Error updating template:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
