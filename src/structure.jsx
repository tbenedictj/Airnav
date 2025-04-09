import React from 'react';

const ProjectStructure = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Source Directory Structure</h2>
      <div className="font-mono text-sm">
        <pre className="whitespace-pre-wrap">
          {`
src/
├── assets/                    # Static assets and resources
├── Component/                 # Reusable UI components
│   ├── BarChart/             # Chart components
│   │   ├── bar.html
│   │   └── chart.js
│   ├── Header/               # Header components for different roles
│   │   ├── Header.jsx       # Base header component
│   │   ├── Header - Admin.jsx
│   │   ├── Header - CNS.jsx
│   │   ├── Header - Manager.jsx
│   │   ├── Header - Sup.jsx
│   │   ├── Header - Supervisor.jsx
│   │   └── Header - Viewer.jsx
│   ├── LogoutButton/         # Logout functionality
│   │   └── LogoutButton.jsx
│   ├── Nav/                  # Navigation components
│   │   └── Navigation.jsx
│   ├── Sidebar/             # Sidebar components for different roles
│   │   ├── Sidebar.jsx      # Base sidebar component
│   │   ├── Sidebar.css
│   │   ├── Sidebar - Admin.jsx
│   │   ├── Sidebar - CNS.jsx
│   │   ├── Sidebar - Manager.jsx
│   │   ├── Sidebar - Sup.jsx
│   │   ├── Sidebar - Supervisor.jsx
│   │   └── Sidebar - Viewer.jsx
│   └── Signature/           # Signature related components
│       ├── Tandatangan.jsx
│       └── signature.jsx
├── Pages/                   # Application pages
│   ├── Alat/               # Equipment related pages
│   │   ├── CNS/            # CNS equipment management
│   │   │   ├── EditAlatCNS.jsx
│   │   │   ├── PeralatanCNS.jsx
│   │   │   └── TambahAlatCNS.jsx
│   │   ├── Supervisor/     # Supervisor equipment views
│   │   └── Support/        # Support equipment management
│   │       ├── EditAlatSup.jsx
│   │       ├── PeralatanSup.jsx
│   │       └── TambahAlatSupport.jsx
│   ├── Approval/           # Approval system pages
│   │   └── Approval.jsx
│   ├── Auth/               # Authentication pages
│   │   └── Login.jsx
│   ├── Catatan/           # Notes and records
│   │   └── CNS/           # CNS related notes
│   │       ├── CB-CNS.jsx
│   │       ├── CH-CNS.jsx
│   │       └── CM-CNS.jsx
│   └── chatBot/           # Chatbot functionality
├── config/                # Configuration files
├── scripts/              # Utility scripts
├── .env                  # Environment variables
├── App.css              # Main application styles
├── App.jsx              # Root application component
├── index.css            # Global styles
└── main.jsx             # Application entry point
          `}
        </pre>
      </div>
    </div>
  );
};

export default ProjectStructure;
