import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 28,
    color: '#1f2923',
    fontFamily: 'Helvetica'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    paddingBottom: 14,
    borderBottom: '1 solid #cfd8c9'
  },
  logoBox: {
    width: 90,
    height: 90
  },
  logo: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  headerText: {
    flex: 1,
    paddingLeft: 16
  },
  title: {
    fontSize: 20,
    fontWeight: 800,
    marginBottom: 4,
    color: '#2f4f3a',
    letterSpacing: 0.3
  },
  subtitle: {
    fontSize: 10,
    color: '#5d6d63'
  },
  section: {
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 800,
    marginBottom: 8,
    color: '#2f4f3a',
    textTransform: 'uppercase',
    letterSpacing: 0.6
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6
  },
  cell: {
    width: '50%',
    paddingRight: 10,
    marginBottom: 6
  },
  cellRight: {
    width: '50%',
    paddingLeft: 10,
    marginBottom: 6
  },
  label: {
    fontSize: 9,
    color: '#5d6d63',
    marginBottom: 2,
    fontWeight: 600
  },
  value: {
    fontSize: 10,
    color: '#1f2923',
    fontWeight: 700
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 28,
    right: 28,
    fontSize: 8,
    color: '#7d8d83',
    borderTop: '1 solid #e3e9e1',
    paddingTop: 6,
    textAlign: 'center'
  },
  divider: {
    height: 1,
    backgroundColor: '#e3e9e1',
    marginVertical: 8
  },
  summaryText: {
    fontSize: 10,
    color: '#1f2923',
    lineHeight: 1.4
  }
});

const generateSummary = ({
  totalTests,
  completedTests,
  latestScore,
  latestLevel,
  applicationStatus,
  t
}) => {
  const completionRate =
    totalTests > 0 ? (completedTests / totalTests) * 100 : 0;

  let readiness = 'developing';
  const scoreNum = Number(latestScore);

  if (!Number.isNaN(scoreNum)) {
    if (scoreNum >= 70) readiness = 'strong';
    else if (scoreNum >= 50) readiness = 'moderate';
    else readiness = 'developing';
  }

  const lines = [];

  if (totalTests > 0) {
    lines.push(
      `Has completed ${completedTests} of ${totalTests} assigned assessments (${Math.round(
        completionRate
      )}%).`
    );
  } else {
    lines.push(`No assessments completed yet.`);
  }

  if (latestScore !== '—') {
    lines.push(
      `Latest assessment score is ${latestScore}${
        latestLevel !== '—' ? ` (${latestLevel})` : ''
      }.`
    );
  }

  const readinessMap = {
    strong: 'demonstrates strong safety and competence readiness.',
    moderate:
      'shows moderate readiness with some areas for improvement.',
    developing:
      'is still developing core safety and competence readiness.'
  };

  lines.push(
    `Overall, the candidate ${readinessMap[readiness] ||
      readinessMap.developing}`
  );

  if (applicationStatus && applicationStatus !== '—') {
    lines.push(
      `Current application status: ${applicationStatus}.`
    );
  }

  return lines.join(' ');
};

const CandidateCV = ({
  profile,
  candidate,
  testStats,
  latestAssessment,
  t
}) => {
  const fullName =
    candidate?.full_name ||
    profile?.full_name ||
    '—';

  const email = candidate?.email || profile?.email || '—';
  const phone = candidate?.phone || profile?.phone || '—';

  const candidateCode = candidate?.candidate_code || '—';
  const applicationStatus =
    candidate?.application_status || '—';

  const desiredPosition =
    candidate?.desired_position || '—';

  const totalTests = testStats?.total ?? 0;
  const completedTests = testStats?.completed ?? 0;

  const latestType =
    latestAssessment?.assessment_type || '—';
  const latestStatus =
    latestAssessment?.status || '—';
  const latestScoreRaw = latestAssessment?.total_score;
  const latestScore =
    latestScoreRaw != null
      ? Number(latestScoreRaw).toFixed(1)
      : '—';
  const latestLevel =
    latestAssessment?.level != null
      ? `Level ${latestAssessment.level}`
      : '—';

  const now = new Date();
  const dateStr = now.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const summaryText = generateSummary({
    totalTests,
    completedTests,
    latestScore,
    latestLevel,
    applicationStatus,
    t
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Image
              style={styles.logo}
              src="/logo.png"
            />
          </View>

          <View style={styles.headerText}>
            <Text style={styles.title}>METSAFE – Candidate CV</Text>
            <Text style={styles.subtitle}>
              {t.profile.candidateInformation ||
                'Candidate information'}{' '}
              • {dateStr}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t.profile.accountInformation || 'Account information'}
          </Text>

          <View style={styles.grid}>
            <View style={styles.cell}>
              <Text style={styles.label}>
                {t.profile.fullName || 'Full name'}
              </Text>
              <Text style={styles.value}>{fullName}</Text>
            </View>

            <View style={styles.cellRight}>
              <Text style={styles.label}>
                {t.profile.emailAddress || 'Email'}
              </Text>
              <Text style={styles.value}>{email}</Text>
            </View>

            <View style={styles.cell}>
              <Text style={styles.label}>
                {t.profile.phoneNumber || 'Phone'}
              </Text>
              <Text style={styles.value}>{phone}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t.profile.candidateInformation || 'Candidate information'}
          </Text>

          <View style={styles.grid}>
            <View style={styles.cell}>
              <Text style={styles.label}>
                {t.profile.candidateCode || 'Candidate code'}
              </Text>
              <Text style={styles.value}>{candidateCode}</Text>
            </View>

            <View style={styles.cellRight}>
              <Text style={styles.label}>
                {t.profile.applicationStatus || 'Application status'}
              </Text>
              <Text style={styles.value}>{applicationStatus}</Text>
            </View>

            <View style={styles.cell}>
              <Text style={styles.label}>
                {t.profile.desiredPosition || 'Desired position'}
              </Text>
              <Text style={styles.value}>{desiredPosition}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t.profile.summary || 'Summary'}
          </Text>

          <Text style={styles.summaryText}>
            {summaryText}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t.profile.assessmentsTitle || 'Tests & assessments'}
          </Text>

          <View style={styles.grid}>
            <View style={styles.cell}>
              <Text style={styles.label}>
                {t.profile.totalTests || 'Total tests'}
              </Text>
              <Text style={styles.value}>{totalTests}</Text>
            </View>

            <View style={styles.cellRight}>
              <Text style={styles.label}>
                {t.profile.completedTests || 'Completed'}
              </Text>
              <Text style={styles.value}>{completedTests}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t.profile.latestAssessment || 'Latest assessment'}
          </Text>

          <View style={styles.grid}>
            <View style={styles.cell}>
              <Text style={styles.label}>
                {t.profile.type || 'Type'}
              </Text>
              <Text style={styles.value}>{latestType}</Text>
            </View>

            <View style={styles.cellRight}>
              <Text style={styles.label}>
                {t.profile.status || 'Status'}
              </Text>
              <Text style={styles.value}>{latestStatus}</Text>
            </View>

            <View style={styles.cell}>
              <Text style={styles.label}>
                {t.profile.score || 'Score'}
              </Text>
              <Text style={styles.value}>{latestScore}</Text>
            </View>

            <View style={styles.cellRight}>
              <Text style={styles.label}>
                {t.profile.level || 'Level'}
              </Text>
              <Text style={styles.value}>{latestLevel}</Text>
            </View>
          </View>
        </View>

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `METSAFE • ${t.profile.candidateCode || 'Candidate'}: ${candidateCode} • ${pageNumber} / ${totalPages}`
          }
        />
      </Page>
    </Document>
  );
};

export default CandidateCV;