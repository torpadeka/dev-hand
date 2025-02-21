// /app/admin/expert-applications/dummyData.ts

// Dummy data for expert applications
export const dummyApplications = [
  {
    id: 1,
    user_id: 101,
    name: "John Doe",
    github: "https://github.com/johndoe",
    status: "Pending",
    applied_at: "2024-02-19T10:00:00Z",
  },
  {
    id: 2,
    user_id: 102,
    name: "Jane Smith",
    github: "https://github.com/janesmith",
    status: "Approved",
    applied_at: "2024-02-18T14:30:00Z",
  },
  {
    id: 3,
    user_id: 103,
    name: "Alice Johnson",
    github: "https://github.com/alicejohnson",
    status: "Rejected",
    applied_at: "2024-02-17T09:15:00Z",
  },
];

interface ApplicationDetail {
  application_id: number;
  name: String;
  github: String;
  category_name: String;
  about: String;
  motivation: String;
  applied_at: String;
  certificates: {
    certificate_id: number;
    file_url: String;
    description: String;
  }[];
}

// Dummy data for application details
export const dummyApplicationDetails: Record<number, ApplicationDetail> = {
  1: {
    application_id: 1,
    name: "John Doe",
    github: "https://github.com/johndoe",
    category_name: "Web Development",
    about:
      "I'm passionate about building web applications using modern frameworks like React and Next.js.",
    motivation:
      "I want to contribute to the community by sharing my knowledge and helping others grow.",
    applied_at: "2024-02-19T10:00:00Z",
    certificates: [
      {
        certificate_id: 1,
        file_url: "https://example.com/certificate1.pdf",
        description: "React Developer Certificate from Meta",
      },
      {
        certificate_id: 2,
        file_url: "https://example.com/certificate2.pdf",
        description: "Next.js Advanced Course Completion",
      },
    ],
  },
  2: {
    application_id: 2,
    name: "Jane Smith",
    github: "https://github.com/janesmith",
    category_name: "Data Science",
    about:
      "Experienced in Python, Machine Learning, and data visualization tools like Tableau.",
    motivation:
      "My goal is to empower others by simplifying complex data concepts.",
    applied_at: "2024-02-18T14:30:00Z",
    certificates: [],
  },
  3: {
    application_id: 3,
    name: "Alice Johnson",
    github: "https://github.com/alicejohnson",
    category_name: "Mobile Development",
    about: "Skilled in Kotlin, Flutter, and mobile UX best practices.",
    motivation:
      "I want to contribute by creating guides for efficient mobile app development.",
    applied_at: "2024-02-17T09:15:00Z",
    certificates: [
      {
        certificate_id: 3,
        file_url: "https://example.com/certificate3.pdf",
        description: "Flutter App Development Certificate",
      },
    ],
  },
};
