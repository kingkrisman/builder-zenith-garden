import { RequestHandler } from "express";
import {
  Resource,
  ResourcesResponse,
  UploadResponse,
  CreateResourceRequest,
  ResourceCategory,
} from "../../shared/api";

// Mock database - in production, this would be a real database
let resources: Resource[] = [
  {
    id: "1",
    title: "Introduction to Data Structures and Algorithms",
    description:
      "Comprehensive lecture notes covering arrays, linked lists, stacks, queues, and basic algorithms with examples and exercises.",
    fileName: "dsa-intro.pdf",
    fileSize: 2048576,
    category: ResourceCategory.LECTURE_NOTES,
    subject: "Computer Science",
    uploadedBy: "Dr. Sarah Johnson",
    uploadedAt: "2024-01-15T10:00:00Z",
    downloadCount: 145,
    tags: ["algorithms", "data-structures", "programming"],
  },
  {
    id: "2",
    title: "Midterm Examination - Database Systems",
    description:
      "Previous year midterm questions covering normalization, SQL queries, transaction management, and database design.",
    fileName: "db-midterm-2023.pdf",
    fileSize: 1048576,
    category: ResourceCategory.PAST_QUESTIONS,
    subject: "Database Systems",
    uploadedBy: "Prof. Michael Chen",
    uploadedAt: "2024-01-10T14:30:00Z",
    downloadCount: 89,
    tags: ["midterm", "sql", "normalization", "database-design"],
  },
  {
    id: "3",
    title: "Software Engineering Assignment 2",
    description:
      "Design patterns assignment focusing on Factory, Observer, and Strategy patterns with implementation requirements.",
    fileName: "se-assignment-2.pdf",
    fileSize: 512000,
    category: ResourceCategory.ASSIGNMENT,
    subject: "Software Engineering",
    uploadedBy: "Dr. Emily Rodriguez",
    uploadedAt: "2024-01-12T09:15:00Z",
    downloadCount: 67,
    tags: ["design-patterns", "assignment", "java", "uml"],
  },
  {
    id: "4",
    title: "Machine Learning Fundamentals",
    description:
      "Introduction to machine learning concepts, supervised and unsupervised learning, with practical examples in Python.",
    fileName: "ml-fundamentals.pdf",
    fileSize: 3145728,
    category: ResourceCategory.LECTURE_NOTES,
    subject: "Artificial Intelligence",
    uploadedBy: "Dr. Alex Kumar",
    uploadedAt: "2024-01-08T16:20:00Z",
    downloadCount: 203,
    tags: ["machine-learning", "python", "ai", "supervised-learning"],
  },
  {
    id: "5",
    title: "Final Exam 2023 - Operating Systems",
    description:
      "Complete final examination with solutions covering process management, memory management, file systems, and security.",
    fileName: "os-final-2023.pdf",
    fileSize: 1572864,
    category: ResourceCategory.PAST_QUESTIONS,
    subject: "Operating Systems",
    uploadedBy: "Prof. Lisa Wang",
    uploadedAt: "2024-01-05T11:45:00Z",
    downloadCount: 178,
    tags: ["final-exam", "processes", "memory", "file-systems"],
  },
  {
    id: "6",
    title: "Network Security Course Syllabus",
    description:
      "Complete syllabus for Network Security course including topics, assessment criteria, and recommended readings.",
    fileName: "netsec-syllabus.pdf",
    fileSize: 256000,
    category: ResourceCategory.SYLLABUS,
    subject: "Network Security",
    uploadedBy: "Dr. Robert Black",
    uploadedAt: "2024-01-03T08:30:00Z",
    downloadCount: 45,
    tags: ["syllabus", "security", "networks", "cryptography"],
  },
];

// GET /api/resources - List all resources
export const handleGetResources: RequestHandler = (req, res) => {
  try {
    const { category, subject, search } = req.query;

    let filteredResources = [...resources];

    // Filter by category
    if (category && typeof category === "string") {
      filteredResources = filteredResources.filter(
        (r) => r.category === category,
      );
    }

    // Filter by subject
    if (subject && typeof subject === "string") {
      filteredResources = filteredResources.filter((r) =>
        r.subject.toLowerCase().includes(subject.toLowerCase()),
      );
    }

    // Filter by search query
    if (search && typeof search === "string") {
      const searchLower = search.toLowerCase();
      filteredResources = filteredResources.filter(
        (r) =>
          r.title.toLowerCase().includes(searchLower) ||
          r.description.toLowerCase().includes(searchLower) ||
          r.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
      );
    }

    const response: ResourcesResponse = {
      resources: filteredResources,
      totalCount: filteredResources.length,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ error: "Failed to fetch resources" });
  }
};

// POST /api/resources - Upload new resource
export const handleUploadResource: RequestHandler = (req, res) => {
  try {
    const file = req.file; // Provided by multer middleware

    if (!file) {
      const response: UploadResponse = {
        success: false,
        message: "No file provided",
      };
      return res.status(400).json(response);
    }

    // Parse metadata from form data
    let metadata: CreateResourceRequest;
    try {
      metadata = JSON.parse(req.body.metadata || "{}");
    } catch (parseError) {
      const response: UploadResponse = {
        success: false,
        message: "Invalid metadata format",
      };
      return res.status(400).json(response);
    }

    if (!metadata.title || !metadata.category || !metadata.subject) {
      const response: UploadResponse = {
        success: false,
        message:
          "Missing required metadata: title, category, and subject are required",
      };
      return res.status(400).json(response);
    }

    // Create new resource
    const newResource: Resource = {
      id: Date.now().toString(), // In production, use proper ID generation
      title: metadata.title,
      description: metadata.description || "",
      fileName: file.originalname,
      fileSize: file.size,
      category: metadata.category,
      subject: metadata.subject,
      uploadedBy: "Current User", // In production, get from authenticated user
      uploadedAt: new Date().toISOString(),
      downloadCount: 0,
      tags: metadata.tags || [],
    };

    // In production, you would save the file to cloud storage here
    // For demo, we just store the metadata
    resources.push(newResource);

    const response: UploadResponse = {
      success: true,
      resource: newResource,
      message: "Resource uploaded successfully",
    };

    res.json(response);
  } catch (error) {
    console.error("Error uploading resource:", error);
    const response: UploadResponse = {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to upload resource",
    };
    res.status(500).json(response);
  }
};

// GET /api/resources/:id/download - Download resource
export const handleDownloadResource: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const resource = resources.find((r) => r.id === id);

    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    // Update download count
    resource.downloadCount += 1;

    // In a real application, you would:
    // 1. Get file from cloud storage
    // 2. Stream the file to the client
    // 3. Log the download for analytics

    // For demo purposes, send a placeholder response
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${resource.fileName}"`,
    );
    res.setHeader("Content-Type", "application/pdf");

    // Send a minimal PDF response for demo
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(${resource.title}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000206 00000 n
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
300
%%EOF`;

    res.send(Buffer.from(pdfContent));
  } catch (error) {
    console.error("Error downloading resource:", error);
    res.status(500).json({ error: "Failed to download resource" });
  }
};

// DELETE /api/resources/:id - Delete resource
export const handleDeleteResource: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const resourceIndex = resources.findIndex((r) => r.id === id);

    if (resourceIndex === -1) {
      return res.status(404).json({ error: "Resource not found" });
    }

    // In a real application, you would:
    // 1. Check user permissions
    // 2. Delete file from cloud storage
    // 3. Remove from database

    resources.splice(resourceIndex, 1);
    res.json({ success: true, message: "Resource deleted successfully" });
  } catch (error) {
    console.error("Error deleting resource:", error);
    res.status(500).json({ error: "Failed to delete resource" });
  }
};

// GET /api/resources/:id - Get single resource
export const handleGetResource: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const resource = resources.find((r) => r.id === id);

    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    res.json(resource);
  } catch (error) {
    console.error("Error fetching resource:", error);
    res.status(500).json({ error: "Failed to fetch resource" });
  }
};
