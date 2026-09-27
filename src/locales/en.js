export const en = {
  nav: {
    home: "Home",
    assessment: "CI Assessment",
    seminars: "News & Seminars",
    login: "Login / Signup"
  },
  sidebar: {
    home: "Home",
    profile: "Profile",
    dashboard: "Dashboard",
    assessments: "Assessments",
    employees: "Employees",
    candidates: "Candidates",
    myDashboard: "My Dashboard",
    myCompetence: "My Competence",
    myTests: "My Tests",
    training: "Training",
    myApplication: "My Application",
    myResults: "My Results",
    closeNavigation: "Close navigation",
    mainNavigation: "Main navigation",
    goToDashboard: "Go to dashboard",
    roles: {
      admin: "Administrator",
      employee: "Employee",
      candidate: "Candidate"
    }
  },
  hero: {
    title: "METSAFE",
    subtitle: "Digital model application for safety optimization and labor accident reduction in metallurgy",
    cta: "Start Assessment",
    learnMore: "Learn More"
  },
  news: {
    title: "News & Seminars",
    readMore: "Read More",
    card1: {
      category: "Research",
      date: "May 28, 2026",
      title: "Competency & Safety Correlation",
      desc: "Analysis of the relationship between professional readiness and production incident rates."
    },
    card2: {
      category: "Innovation",
      date: "May 15, 2026",
      title: "Digitalization in Metallurgy",
      desc: "Replacing traditional training and testing methods with advanced digital technologies."
    },
    card3: {
      category: "Technology",
      date: "May 02, 2026",
      title: "AI in Risk Prediction",
      desc: "Leveraging machine learning to identify high-risk personnel and prevent accidents."
    }
  },
  aboutProject: {
    tag: "About the Project",
    title: "Safer metallurgy starts with clearer human insight",
    description: "METSAFE helps industrial teams evaluate competence more clearly, reduce fragmented safety checks, and support better risk prevention through digital assessment.",
    sideLabel: "About Us",
    imageAlt: "Industrial team working in a metallurgy environment",
    body1: "METSAFE was created to make competence evaluation more structured, visible, and practical in real metallurgical settings. Instead of depending on isolated checks and manual interpretation, the project brings key readiness indicators into one clearer digital framework.",
    body2: "By combining weighted metrics, operational criteria, and human-factor signals, the platform supports smarter training priorities, stronger supervision, and safer day-to-day decisions across high-risk workplaces."
  },
  footer: {
    description: "Enhancing personnel safety through digital competency evaluation",
    quickLinks: "Quick Links",
    about: "About the Project",
    assessment: "Start Assessment",
    contact: "Contact Us",
    support: "Support",
    faq: "FAQ",
    privacy: "Privacy Policy",
    copyright: "METSAFE Project - Metallurgy Competence Digital Assessment. All rights reserved."
  },
  assessment: {
    title: "Competence Index (CI) Assessment",
    subtitle: "Real-time quantitative calculation of personnel competence and safety risk layers",
    description: "Detailed profiles, evaluation of metrics, and competence classification based on mathematical weighting model.",
    submit: "Calculate Score",
    reset: "Reset Form",
    input_label: "Score Input",
    calculate_btn: "Calculate CI Score",
    result_title: "Calculated Competence Index",
    selectCandidate: "Select Candidate Profile",
    candidateProfile: "Candidate Core Metrics Data",
    sidebarTitle: "Candidate List",
    yearsExp: "years of experience",
    classification: "Competence Classification",
    metricsTitle: "Detailed Metric Scores",
    categories: {
      workplace: "Workplace Safety",
      equipment: "Equipment Operation",
      human: "Human Factors"
    },
    levels: {
      l0: "Level 0 (Unqualified)",
      l1: "Level 1 (Novice)",
      l2: "Level 2 (Basic)",
      l3: "Level 3 (Intermediate)",
      l4: "Level 4 (Advanced)",
      l5: "Level 5 (Expert)"
    },
    fields: {
      experience: "Years of Experience",
      years: "years",
      certificates: "Certificates Count",
      testScore: "Exam Test Score",
      incidents: "Incidents Involved",
      majorViolation: "Major Safety Violation",
      yes: "YES",
      no: "NO",
      coreMetrics: "Core Competency Metrics Matrix Breakdown"
    },
    metrics: {
      risk: "Risk Assessment",
      emergency: "Emergency Response",
      hygiene: "Industrial Hygiene",
      operation: "Furnace Operation",
      ppe: "PPE Compliance",
      maintenance: "Equipment Maintenance",
      health: "Physical Health",
      focus: "Attention & Focus",
      teamwork: "Team Coordination"
    }
  },
  auth: {
    signIn: "Sign In",
    register: "Register",
    fullName: "Full Name",
    emailAddress: "Email Address",
    password: "Password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    createAccount: "Create Account"
  },
  adminCandidates: {
    eyebrow: "Administration",
    title: "Candidates",
    description: "Review candidate accounts and application information.",
    addCandidate: "Add candidate",

    totalCandidates: "Total candidates",
    underReview: "Under review",
    approved: "Approved",

    searchPlaceholder: "Search candidates...",
    allStatuses: "All statuses",

    loading: "Loading candidates...",
    emptyTitle: "No candidates found",
    emptyDescription: "Try changing your search or status filter.",
    loadError: "Unable to load candidates.",

    columns: {
      candidate: "Candidate",
      contact: "Contact",
      position: "Position",
      status: "Status",
      actions: "Actions"
    },

    unnamedCandidate: "Unnamed candidate",
    noCandidateCode: "No candidate code",
    noEmail: "No email",
    noPhone: "No phone",
    candidateInitial: "C",

    actionsFor: "Actions for {name}",

    statuses: {
      unknown: "Unknown",
      under_review: "Under review",
      approved: "Approved",
      rejected: "Rejected",
      withdrawn: "Withdrawn",
      pending: "Pending"
    }
  },
  adminDashboard: {
    loading: "Loading admin dashboard...",
    loadError: "Unable to load admin dashboard data.",

    eyebrow: "Administration",
    title: "Admin overview",
    description: "Monitor people, assessments and pending actions across METSAFE.",
    refreshing: "Refreshing...",
    refresh: "Refresh data",

    totalEmployees: "Total employees",
    active: "active",
    totalCandidates: "Total candidates",
    needReview: "need review",
    completedAssessments: "Completed assessments",
    inProgress: "in progress",
    pendingActions: "Pending actions",
    candidateApplications: "Candidate applications",

    needsAttention: "Needs attention",
    viewAll: "View all",
    nothingNeedsAttention: "Nothing needs attention",
    noPendingApplications: "There are no pending candidate applications.",

    shortcuts: "Shortcuts",
    quickActions: "Quick actions",
    manageEmployees: "Manage employees",
    reviewCandidates: "Review candidates",
    openAssessments: "Open assessments",

    unnamedCandidate: "Unnamed candidate",
    noCandidateCode: "No candidate code",
    candidateInitial: "C",

    statuses: {
      unknown: "Unknown",
      pending: "Pending",
      under_review: "Under review"
    }
  },
  adminEmployees: {
    eyebrow: "Administration",
    title: "Employees",
    description: "Manage employee records and workplace information.",
    addEmployee: "Add employee",

    totalEmployees: "Total employees",
    activeEmployees: "Active employees",
    inactiveEmployees: "Inactive employees",

    searchPlaceholder: "Search employees...",
    allStatuses: "All statuses",
    active: "Active",
    inactive: "Inactive",

    loading: "Loading employees...",
    emptyTitle: "No employees found",
    emptyDescription: "Try changing your search or filter.",
    loadError: "Unable to load employees.",

    columns: {
      employee: "Employee",
      position: "Position",
      experience: "Experience",
      status: "Status",
      actions: "Actions"
    },

    unnamedEmployee: "Unnamed employee",
    noCode: "No code",
    employeeInitial: "E",
    years: "years",
    actionsFor: "Actions for {name}"
  },
};