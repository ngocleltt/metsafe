export const en = {
  nav: { home: "Home", assessment: "CI Assessment", seminars: "News & Seminars", login: "Login / Signup" },
  sidebar: {
    home: "Home", profile: "Profile", dashboard: "Dashboard", assessments: "Assessments", employees: "Employees", candidates: "Candidates",
    myDashboard: "My Dashboard", myCompetence: "My Competence", myTests: "My Tests", training: "Training", myApplication: "My Application", myResults: "My Results",
    closeNavigation: "Close navigation", mainNavigation: "Main navigation", goToDashboard: "Go to dashboard",
    roles: { admin: "Administrator", employee: "Employee", candidate: "Candidate" }
  },
  hero: { title: "METSAFE", subtitle: "Digital model application for safety optimization and labor accident reduction in metallurgy", cta: "Start Assessment", learnMore: "Learn More" },
  news: {
    title: "News & Seminars",
    readMore: "Read More",
    card1: {
      category: "Research",
      date: "Sep 15, 2026",
      title: "Competence, awareness, and knowledge regarding occupational health and safety",
      desc: "Analysis of the relationship between professional readiness and production incident rates.",
      link: "https://journal.ecostandard.ru/ot/skills/kompetentnost-osvedomlennost-i-informirovannost-v-okhrane-truda/",
      linkLabel: "Read more",
    },
    card2: {
      category: "Innovation",
      date: "Sep 28, 2026",
      title: "Digitalization in Metallurgy",
      desc: "Replacing traditional training and testing methods with advanced digital technologies."
    },
    card3: {
      category: "Technology",
      date: "Oct 01, 2026",
      title: "AI in Risk Prediction",
      desc: 
      "Leveraging machine learning to identify high-risk personnel and prevent accidents.",
      link: "https://riskprediction2024.web.app/",
      linkLabel: "Risk Prediction",
    },
    card4: {
      category: "Event",
      date: "Oct 03, 2026",
      title: "Russian Labour Safety Week 2026",
      desc:
        "7–10 October 2026, Sirius Federal Territory, Sirius University. Join leading experts to discuss the future of occupational safety in Russia.",
      link: "https://rusafetyweek.com/en/",
      linkLabel: "Learn more"
    }
  },
  aboutProject: {
    tag: "About the Project", title: "Safer metallurgy starts with clearer human insight",
    description: "METSAFE helps industrial teams evaluate competence more clearly, reduce fragmented safety checks, and support better risk prevention through digital assessment.",
    sideLabel: "About Us", imageAlt: "Industrial team working in a metallurgy environment",
    body1: "METSAFE was created to make competence evaluation more structured, visible, and practical in real metallurgical settings. Instead of depending on isolated checks and manual interpretation, the project brings key readiness indicators into one clearer digital framework.",
    body2: "By combining weighted metrics, operational criteria, and human-factor signals, the platform supports smarter training priorities, stronger supervision, and safer day-to-day decisions across high-risk workplaces."
  },
  footer: {
    description: "Enhancing personnel safety through digital competency evaluation", quickLinks: "Quick Links", about: "About the Project", assessment: "Start Assessment",
    contact: "Contact Us", support: "Support", faq: "FAQ", privacy: "Privacy Policy",
    copyright: "METSAFE Project - Metallurgy Competence Digital Assessment. All rights reserved."
  },
  assessment: {
    title: "Competence Index (CI) Assessment", subtitle: "Real-time quantitative calculation of personnel competence and safety risk layers",
    description: "Detailed profiles, evaluation of metrics, and competence classification based on mathematical weighting model.",
    submit: "Calculate Score", reset: "Reset Form", input_label: "Score Input", calculate_btn: "Calculate CI Score", result_title: "Calculated Competence Index",
    selectCandidate: "Select Candidate Profile", candidateProfile: "Candidate Core Metrics Data", sidebarTitle: "Candidate List", yearsExp: "years of experience",
    classification: "Competence Classification", metricsTitle: "Detailed Metric Scores",
    categories: { workplace: "Workplace Safety", equipment: "Equipment Operation", human: "Human Factors" },
    levels: { l0: "Level 0 (Unqualified)", l1: "Level 1 (Novice)", l2: "Level 2 (Basic)", l3: "Level 3 (Intermediate)", l4: "Level 4 (Advanced)", l5: "Level 5 (Expert)" },
    fields: { experience: "Years of Experience", years: "years", certificates: "Certificates Count", testScore: "Exam Test Score", incidents: "Incidents Involved", majorViolation: "Major Safety Violation", yes: "YES", no: "NO", coreMetrics: "Core Competency Metrics Matrix Breakdown" },
    metrics: { risk: "Risk Assessment", emergency: "Emergency Response", hygiene: "Industrial Hygiene", operation: "Furnace Operation", ppe: "PPE Compliance", maintenance: "Equipment Maintenance", health: "Physical Health", focus: "Attention & Focus", teamwork: "Team Coordination" }
  },
  auth: { signIn: "Sign In", register: "Register", fullName: "Full Name", emailAddress: "Email Address", password: "Password", rememberMe: "Remember me", forgotPassword: "Forgot password?", createAccount: "Create Account" },
  adminCandidates: {
    eyebrow: "Administration", title: "Candidates", description: "Review candidate accounts and application information.", addCandidate: "Add candidate",
    totalCandidates: "Total candidates", underReview: "Under review", approved: "Approved",
    searchPlaceholder: "Search candidates...", allStatuses: "All statuses", loading: "Loading candidates...",
    emptyTitle: "No candidates found", emptyDescription: "Try changing your search or status filter.", loadError: "Unable to load candidates.",
    columns: { candidate: "Candidate", contact: "Contact", position: "Position", status: "Status", actions: "Actions" },
    unnamedCandidate: "Unnamed candidate", noCandidateCode: "No candidate code", noEmail: "No email", noPhone: "No phone", candidateInitial: "C", actionsFor: "Actions for {name}",
    assignTest: "Assign assessment", assignTitle: "Assign assessment to candidate", chooseTest: "Choose a test", choosePlaceholder: "Select a test...",
    questionCount: "questions", randomTenQuestions: "10 randomly selected", notEnoughQuestions: "Fewer than 10 questions",
    cancelAssign: "Cancel", confirmAssign: "Confirm assignment", assigning: "Assigning...", loadingTests: "Loading tests...",
    noTests: "No active tests available.", noModel: "Missing model version", noQuestions: "No questions",
    testsError: "Unable to load tests.", assignError: "Unable to assign the assessment. Please try again.",
    assignSuccess: "Successfully assigned {test} to {name}.",
    statuses: { unknown: "Unknown", applied: "Applied", screening: "Screening", testing: "Assessment", interview: "Interview", accepted: "Accepted", rejected: "Rejected", hired: "Hired", under_review: "Under review", approved: "Approved", withdrawn: "Withdrawn", pending: "Pending" },
    trackColumn: "Assessment track",
    selectTrack: "Candidate's assessment track",
    trackUnassigned: "Not assigned",
    saveTrack: "Save track",
    savingTrack: "Saving...",
    trackSaved: "Assessment track saved.",
    trackSaveError: "Unable to save the assessment track.",
    noAvailableTests: "No active assessments are available for this candidate.",
    trackNames: {
      ACC: "Accounting",
      HR: "Human resources",
      OFF: "Office staff",
      WRK: "Production",
      ENG: "Engineering",
      HSE: "Health and safety"
    },
  },
  adminDashboard: {
    loading: "Loading admin dashboard...", loadError: "Unable to load admin dashboard data.", eyebrow: "Administration", title: "Admin overview",
    description: "Monitor people, assessments and pending actions across METSAFE.", refreshing: "Refreshing...", refresh: "Refresh data",
    totalEmployees: "Total employees", active: "active", totalCandidates: "Total candidates", needReview: "need review", completedAssessments: "Completed assessments", inProgress: "in progress", pendingActions: "Pending actions", candidateApplications: "Candidate applications",
    needsAttention: "Needs attention", viewAll: "View all", nothingNeedsAttention: "Nothing needs attention", noPendingApplications: "There are no pending candidate applications.",
    shortcuts: "Shortcuts", quickActions: "Quick actions", manageEmployees: "Manage employees", reviewCandidates: "Review candidates", openAssessments: "Open assessments",
    unnamedCandidate: "Unnamed candidate", noCandidateCode: "No candidate code", candidateInitial: "C",
    statuses: { unknown: "Unknown", pending: "Pending", under_review: "Under review" }
  },
  adminEmployees: {
    eyebrow: "Administration", title: "Employees", description: "Manage employee records and workplace information.", addEmployee: "Add employee",
    totalEmployees: "Total employees", activeEmployees: "Active employees", inactiveEmployees: "Inactive employees",
    searchPlaceholder: "Search employees...", allStatuses: "All statuses", active: "Active", inactive: "Inactive",
    loading: "Loading employees...", emptyTitle: "No employees found", emptyDescription: "Try changing your search or filter.", loadError: "Unable to load employees.",
    columns: { employee: "Employee", position: "Position", experience: "Experience", status: "Status", actions: "Actions" },
    unnamedEmployee: "Unnamed employee", noCode: "No code", employeeInitial: "E", years: "years", actionsFor: "Actions for {name}"
  },
  profile: {
    userFallback: "User", eyebrow: "Personal profile", description: "Manage your METSAFE account information.", editProfile: "Edit profile",
    accountInformation: "Account information", accountDescription: "Update the information shown on your profile.", cancel: "Cancel", saving: "Saving...", saveChanges: "Save changes",
    fullName: "Full name", emailAddress: "Email address", emailConfirmation: "Email changes require confirmation.", phoneNumber: "Phone number", phonePlaceholder: "Enter a phone number",
    accountRole: "Account role", accountStatus: "Account status", active: "Active", inactive: "Inactive", notAvailable: "Not available", notProvided: "Not provided",
    roleInformation: "Role information", roleDescription: "Information specific to your METSAFE role.", candidateCode: "Candidate code", applicationStatus: "Application status", employeeCode: "Employee code", department: "Department", accessLevel: "Access level", systemAdministrator: "System administrator", notAvailableYet: "Not available yet",
    messages: { nameRequired: "Please enter your full name.", sessionUnavailable: "User session is not available.", updateFailed: "Unable to update your profile.", updated: "Your profile has been updated." },

    // New keys for enriched candidate profile
    candidateInformation: "Candidate information",
    candidateDescription: "Application and assessment details.",
    desiredPosition: "Desired position",
    cv: "CV",
    viewCv: "View CV",
    notes: "Notes",
    assessmentsTitle: "Tests & assessments",
    assessmentsDescription: "Overview of assigned tests and latest results.",
    loading: "Loading additional information...",
    totalTests: "Total tests",
    draftTests: "Not started",
    completedTests: "Completed",
    cancelledTests: "Cancelled",
    noAssessments: "No assessments available.",
    latestAssessment: "Latest assessment",
    type: "Type",
    status: "Status",
    score: "Score",
    level: "Level"
  },
  candidateApplication: {
    loading: "Loading your application...", errorTitle: "Unable to load application", tryAgain: "Try again",
    errors: { sessionUnavailable: "Your session is not available.", profileNotLinked: "Your candidate profile is not linked yet.", loadError: "Unable to load your application." },
    eyebrow: "Candidate workspace", title: "My application", description: "Follow your application status and review your submitted information.", refreshing: "Refreshing...", refresh: "Refresh", currentStatus: "Current application status",
    progress: "Progress", journey: "Application journey",
    steps: {
      submitted: { title: "Application submitted", description: "Your candidate profile was created." },
      review: { title: "Application under review", description: "The recruitment team is reviewing your information." },
      assessment: { title: "Assessment stage", description: "You may be invited to complete a competence assessment." },
      decision: { title: "Final decision", description: "The recruitment team will communicate the final result." }
    },
    applicationDetails: "Application details", submittedInformation: "Submitted information", candidateCode: "Candidate code", emailAddress: "Email address", phoneNumber: "Phone number", position: "Position", submittedOn: "Submitted on", notAssigned: "Not assigned", notProvided: "Not provided", notSpecified: "Not specified", notAvailable: "Not available",
    nextStep: "Next step", reviewProfile: "Review profile",
    statuses: { unknown: "Unknown", pending: "Pending", under_review: "Under review", approved: "Approved", interview: "Interview", accepted: "Accepted", rejected: "Rejected", withdrawn: "Withdrawn" },
    statusDescriptions: {
      unknown: "Your application status is not available yet.", pending: "Your application has been submitted and is waiting for review.", under_review: "The recruitment team is reviewing your application.", approved: "Your application has passed the initial review.", interview: "Your application has reached the interview stage.", accepted: "Congratulations. Your application has been accepted.", rejected: "Your application was not selected at this stage.", withdrawn: "This application is no longer active."
    },
    nextSteps: {
      unknown: { title: "Keep your profile up to date", description: "Review your personal information and keep it accurate." },
      pending: { title: "Wait for application review", description: "No action is required now. We will update your application when the review begins." },
      under_review: { title: "Application under review", description: "Keep your contact details available in case the recruitment team needs more information." },
      approved: { title: "Prepare for assessment", description: "Your next step may include a competence or safety assessment." },
      interview: { title: "Prepare for the interview", description: "Keep your contact details up to date for further information." },
      accepted: { title: "Review your next steps", description: "The recruitment team will provide information about the next stage." },
      rejected: { title: "Keep your profile updated", description: "You can update your profile for future opportunities." },
      withdrawn: { title: "Review your profile", description: "Keep your personal information up to date." }
    }
  },
  candidateDashboard: {
    loading: "Loading your dashboard...", errorTitle: "Unable to load dashboard", tryAgain: "Try again", eyebrow: "Candidate workspace", welcomeBack: "Welcome back,", candidateFallback: "Candidate", description: "Track your application and assessment progress from one place.", refreshing: "Refreshing...", refresh: "Refresh",
    applicationStatus: "Application status", candidateCode: "Candidate code", assessment: "Assessment", notAssigned: "Not assigned", notStarted: "Not started",
    applicationJourney: "Application journey", applicationProgress: "Application progress", steps: { submitted: "Application submitted", underReview: "Application under review", assessment: "Assessment", finalDecision: "Final decision" },
    nextStep: "Next step", keepProfileReady: "Keep your profile ready", contactReminder: "Make sure your contact information is complete so the recruitment team can reach you.", reviewProfile: "Review my profile",
    competenceAssessment: "Competence assessment", latestAssessment: "Latest assessment result", noAssessment: "No assessment available yet", resultPending: "Your assessment result will appear here when it is ready.", assessmentStatus: "Assessment status", totalScore: "Total score", level: "Level", notClassified: "Not classified", viewResults: "View results",
    statuses: { unknown: "Unknown", pending: "Pending", under_review: "Under review", approved: "Approved", interview: "Interview", accepted: "Accepted", rejected: "Rejected", withdrawn: "Withdrawn", completed: "Completed", cancelled: "Cancelled", in_progress: "In progress" }
  },
  candidateTests: {
    loading: "Loading your tests...", errorTitle: "Unable to load tests", tryAgain: "Try again", eyebrow: "Candidate workspace", title: "My tests", description: "Complete your assigned assessments and track your competence results.", refreshing: "Refreshing...", refresh: "Refresh",
    assignedTests: "Assigned tests", inProgress: "In progress", completed: "Completed", averageScore: "Average score",
    recommendedAction: "Recommended next action", continueDescription: "Continue the assessment you already started.", startDescription: "This assessment is ready for you to begin.", continueTest: "Continue test", startTest: "Start test",
    assessmentCentre: "Assessment centre", availableTests: "Available tests", candidateFallback: "Candidate", filters: { all: "All", pending: "Pending", inProgress: "In progress", completed: "Completed" }, emptyTitle: "No tests available", emptyDescription: "Your assigned assessments will appear here when they are available.",
    howItWorks: "How your assessment works", howItWorksDescription: "METSAFE evaluates competence groups such as knowledge, practical skills, safety behaviour, experience, safety record, psychological readiness and assessment results.", ciExplanation: "Your Competence Index (CI) is calculated on a 0–100 scale and classified into Levels 0–5.",
    assessmentTitle: "Competence Assessment", defaultAssessmentTitle: "METSAFE Competence Assessment", assessmentCategory: "Competence and safety assessment", assignedAssessment: "Assigned assessment", score: "Score", viewResult: "View result", continue: "Continue", start: "Start",
    statuses: { pending: "Pending", assigned: "Assigned", started: "Started", in_progress: "In progress", completed: "Completed", cancelled: "Cancelled" }
  },
  candidate: {
    status: {
      applied: "Applied",
      screening: "Screening",
      testing: "Assessment",
      interview: "Interview",
      accepted: "Accepted",
      rejected: "Rejected",
      hired: "Hired",
      under_review: "Under review",
      approved: "Approved",
      withdrawn: "Withdrawn",
      pending: "Pending"
    }
  },
  riskPrediction: {
    eyebrow: "Previous Project",
    title: "RiskPrediction",
    description:
      "RiskPrediction is a web application for reporting occupational safety risks in enterprises and factories.",
    button: "Visit RiskPrediction",
    externalLinkLabel: "Opens in a new tab"
  }
};