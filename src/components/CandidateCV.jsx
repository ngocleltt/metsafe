import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font
} from '@react-pdf/renderer';

Font.register({
  family: 'NotoSans',
  fonts: [
    {
      src: '/fonts/NotoSans-Regular.ttf',
      fontWeight: 400
    },
    {
      src: '/fonts/NotoSans-Bold.ttf',
      fontWeight: 700
    }
  ]
});

const colors = {
  navy: '#173D35',
  green: '#2F7352',
  mint: '#EAF4EE',
  pale: '#F5F8F5',
  line: '#DCE7DF',
  ink: '#1E2C25',
  muted: '#68776E',
  white: '#FFFFFF',
  amber: '#C88C36'
};

const styles = StyleSheet.create({
  page: {
    padding: 0,
    backgroundColor: colors.white,
    color: colors.ink,
    fontFamily: 'NotoSans'
  },
  header: {
    padding: '24 32 20 32',
    backgroundColor: colors.white,
    borderBottom: `2 solid ${colors.navy}`
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  logoBox: {
    width: 112,
    height: 62
  },
  logo: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  headerMeta: {
    flex: 1,
    paddingLeft: 18
  },
  documentTitle: {
    color: colors.navy,
    fontSize: 17,
    fontWeight: 700,
    letterSpacing: 0.4
  },
  documentSubtitle: {
    marginTop: 5,
    color: colors.muted,
    fontSize: 8.5
  },
  dateBox: {
    width: 86,
    padding: 8,
    borderRadius: 7,
    backgroundColor: colors.pale
  },
  dateLabel: {
    marginBottom: 3,
    color: colors.muted,
    fontSize: 7,
    fontWeight: 700,
    textTransform: 'uppercase'
  },
  dateValue: {
    color: colors.navy,
    fontSize: 8.5,
    fontWeight: 700
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 19
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    objectFit: 'cover'
  },
  identityText: {
    flex: 1,
    paddingLeft: 12
  },
  identityName: {
    color: colors.navy,
    fontSize: 21,
    fontWeight: 700
  },
  identityPosition: {
    marginTop: 4,
    color: colors.green,
    fontSize: 9,
    fontWeight: 700
  },
  body: {
    flexDirection: 'row',
    padding: '24 32 48 32'
  },
  sidebar: {
    width: '29%',
    paddingRight: 18,
    borderRight: `1 solid ${colors.line}`
  },
  main: {
    width: '71%',
    paddingLeft: 22
  },
  section: {
    marginBottom: 19
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 9
  },
  sectionMarker: {
    width: 4,
    height: 15,
    marginRight: 7,
    borderRadius: 2,
    backgroundColor: colors.green
  },
  sectionTitle: {
    color: colors.navy,
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.55
  },
  sideItem: {
    marginBottom: 11
  },
  sideLabel: {
    marginBottom: 3,
    color: colors.muted,
    fontSize: 7.3,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.35
  },
  sideValue: {
    color: colors.ink,
    fontSize: 8.8,
    lineHeight: 1.4
  },
  statusBadge: {
    alignSelf: 'flex-start',
    padding: '5 8',
    borderRadius: 6,
    backgroundColor: colors.mint,
    color: colors.green,
    fontSize: 8,
    fontWeight: 700
  },
  summaryBox: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: colors.mint,
    borderLeft: `4 solid ${colors.green}`
  },
  summaryText: {
    color: colors.ink,
    fontSize: 9.2,
    lineHeight: 1.55
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  infoCard: {
    width: '50%',
    minHeight: 49,
    marginBottom: 8,
    padding: 9,
    borderRadius: 8,
    backgroundColor: colors.pale,
    border: `1 solid ${colors.line}`
  },
  infoCardLeft: {
    paddingRight: 4
  },
  infoCardRight: {
    paddingLeft: 4
  },
  infoLabel: {
    marginBottom: 5,
    color: colors.muted,
    fontSize: 7.3,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.35
  },
  infoValue: {
    color: colors.ink,
    fontSize: 9.2,
    fontWeight: 700,
    lineHeight: 1.3
  },
  scorePanel: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 13,
    borderRadius: 10,
    backgroundColor: colors.navy
  },
  scoreCircle: {
    width: 58,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 29,
    backgroundColor: colors.white
  },
  scoreNumber: {
    color: colors.navy,
    fontSize: 17,
    fontWeight: 700,
    textAlign: 'center'
  },
  scoreCaption: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 7
  },
  scoreContent: {
    flex: 1,
    paddingLeft: 13
  },
  scoreTitle: {
    marginBottom: 5,
    color: colors.white,
    fontSize: 10,
    fontWeight: 700
  },
  scoreMeta: {
    color: '#D7E9DE',
    fontSize: 8.3,
    lineHeight: 1.45
  },
  progressTrack: {
    height: 5,
    marginTop: 9,
    borderRadius: 3,
    backgroundColor: '#416B5A'
  },
  progressFill: {
    height: 5,
    borderRadius: 3,
    backgroundColor: '#B9E1C6'
  },
  note: {
    marginTop: 7,
    color: colors.muted,
    fontSize: 7.3,
    lineHeight: 1.4
  },
  linkText: {
    color: colors.green,
    fontSize: 8.5,
    fontWeight: 700
  },
  footer: {
    position: 'absolute',
    right: 32,
    bottom: 20,
    left: 32,
    paddingTop: 7,
    borderTop: `1 solid ${colors.line}`,
    color: colors.muted,
    fontSize: 7.3,
    textAlign: 'center'
  }
});

const formatDate = (locale) =>
  new Date().toLocaleDateString(locale || 'en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });


const translate = (map, value) =>
  map?.[value] || value || '—';

const getLocalizedSummary = ({
  locale,
  totalTests,
  completedTests,
  latestScore,
  latestLevel,
  applicationStatus
}) => {
  const hasScore = Number.isFinite(latestScore);

  const completionRate =
    totalTests > 0
      ? Math.round((completedTests / totalTests) * 100)
      : 0;

  if (locale === 'vi-VN') {
    const completion =
      totalTests > 0
        ? `Ứng viên đã hoàn thành ${completedTests}/${totalTests} bài đánh giá được giao (${completionRate}%).`
        : 'Ứng viên chưa hoàn thành bài đánh giá nào.';

    const score = hasScore
      ? `Điểm gần nhất là ${latestScore.toFixed(1)}${latestLevel ? ` (${latestLevel})` : ''}.`
      : 'Chưa có điểm đánh giá năng lực.';

    const readiness = !hasScore
      ? 'Mức độ sẵn sàng về năng lực và an toàn đang tiếp tục được cập nhật.'
      : latestScore >= 70
      ? 'Kết quả hiện tại cho thấy mức độ sẵn sàng tốt về năng lực và an toàn.'
      : latestScore >= 50
      ? 'Kết quả hiện tại cho thấy mức độ sẵn sàng ở mức trung bình và còn một số điểm cần phát triển.'
      : 'Ứng viên đang tiếp tục phát triển năng lực cốt lõi về an toàn.';

    return `${completion} ${score} ${readiness} Trạng thái ứng tuyển hiện tại: ${applicationStatus}.`;
  }

  if (locale === 'ru-RU') {
    const completion =
      totalTests > 0
        ? `Кандидат завершил ${completedTests} из ${totalTests} назначенных оценок (${completionRate}%).`
        : 'Кандидат ещё не завершил ни одной оценки.';

    const score = hasScore
      ? `Последний результат — ${latestScore.toFixed(1)}${latestLevel ? ` (${latestLevel})` : ''}.`
      : 'Результат оценки компетентности пока недоступен.';

    const readiness = !hasScore
      ? 'Уровень готовности к безопасной работе ещё формируется.'
      : latestScore >= 70
      ? 'Текущие результаты показывают высокий уровень готовности к безопасной работе.'
      : latestScore >= 50
      ? 'Текущие результаты показывают средний уровень готовности и возможности для развития.'
      : 'Кандидат продолжает развивать ключевые компетенции безопасности.';

    return `${completion} ${score} ${readiness} Текущий статус заявки: ${applicationStatus}.`;
  }

  const completion =
    totalTests > 0
      ? `The candidate has completed ${completedTests} of ${totalTests} assigned assessments (${completionRate}%).`
      : 'No assessments have been completed yet.';

  const score = hasScore
    ? `The latest recorded score is ${latestScore.toFixed(1)}${latestLevel ? ` (${latestLevel})` : ''}.`
    : 'A competence score is not available yet.';

  const readiness = !hasScore
    ? 'Safety and competence readiness are still being established.'
    : latestScore >= 70
    ? 'The current results indicate strong safety and competence readiness.'
    : latestScore >= 50
    ? 'The current results indicate moderate readiness with opportunities for development.'
    : 'The candidate is still developing core safety and competence readiness.';

  return `${completion} ${score} ${readiness} Current application status: ${applicationStatus}.`;
};

const CandidateCV = ({
  profile,
  candidate,
  testStats,
  latestAssessment,
  t,
  locale
}) => {
  const profileText = t?.profile || {};
  const pdfLocale =
  locale === 'vi' || locale === 'vi-VN'
    ? 'vi-VN'
    : locale === 'ru' || locale === 'ru-RU'
    ? 'ru-RU'
    : 'en-GB';

  const fullName =
    candidate?.full_name ||
    profile?.full_name ||
    '—';

  const email =
    candidate?.email ||
    profile?.email ||
    '—';

  const phone =
    candidate?.phone ||
    profile?.phone ||
    '—';

  const candidateCode =
    candidate?.candidate_code ||
    '—';

  const desiredPosition =
    candidate?.desired_position ||
    '—';

  const applicationStatus = translate(
    t?.candidate?.status,
    candidate?.application_status
  );

  const totalTests = testStats?.total ?? 0;
  const completedTests = testStats?.completed ?? 0;
  const draftTests = testStats?.draft ?? 0;
  const cancelledTests = testStats?.cancelled ?? 0;

  const latestType = translate(
    t?.assessment?.type,
    latestAssessment?.assessment_type
  );

  const latestStatus = translate(
    t?.assessment?.status,
    latestAssessment?.status
  );

  const latestScore =
    latestAssessment?.total_score != null
      ? Number(latestAssessment.total_score)
      : null;

  const latestLevel =
    latestAssessment?.level != null
      ? `${pdfLocale === 'vi-VN'
        ? 'Cấp'
        : pdfLocale === 'ru-RU'
        ? 'Уровень'
        : 'Level'} ${latestAssessment.level}`
      : '';

  const scoreProgress =
    latestScore == null
      ? 0
      : Math.max(0, Math.min(100, latestScore));

  const summaryText = getLocalizedSummary({
    locale: pdfLocale,
    totalTests,
    completedTests,
    latestScore,
    latestLevel,
    applicationStatus
  });

  const cvUrl = candidate?.cv_url || '';
  const notes = candidate?.notes || '';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={styles.logoBox}>
              <Image
                style={styles.logo}
                src="/logo.png"
              />
            </View>

            <View style={styles.headerMeta}>
              <Text style={styles.documentTitle}>
                {locale === 'vi-VN'
                  ? 'Hồ sơ năng lực ứng viên'
                  : locale === 'ru-RU'
                  ? 'Профиль компетенций кандидата'
                  : 'Candidate competence profile'}
              </Text>

              <Text style={styles.documentSubtitle}>
                METSAFE digital competence assessment
              </Text>
            </View>

            <View style={styles.dateBox}>
              <Text style={styles.dateLabel}>
                {locale === 'vi-VN'
                  ? 'Ngày tạo'
                  : locale === 'ru-RU'
                  ? 'Дата'
                  : 'Issued'}
              </Text>

              <Text style={styles.dateValue}>
                {formatDate(locale)}
              </Text>
            </View>
          </View>

          <View style={styles.identityRow}>
            <Image
              style={styles.avatar}
              src="/assets/ava.png"
            />

            <View style={styles.identityText}>
              <Text style={styles.identityName}>
                {fullName}
              </Text>

              <Text style={styles.identityPosition}>
                {desiredPosition}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.sidebar}>
            <View style={styles.section}>
              <View style={styles.sectionHeading}>
                <View style={styles.sectionMarker} />
                <Text style={styles.sectionTitle}>
                  {locale === 'vi-VN'
                    ? 'Liên hệ'
                    : locale === 'ru-RU'
                    ? 'Контакты'
                    : 'Contact'}
                </Text>
              </View>

              <View style={styles.sideItem}>
                <Text style={styles.sideLabel}>
                  {profileText.emailAddress || 'Email'}
                </Text>
                <Text style={styles.sideValue}>
                  {email}
                </Text>
              </View>

              <View style={styles.sideItem}>
                <Text style={styles.sideLabel}>
                  {profileText.phoneNumber || 'Phone'}
                </Text>
                <Text style={styles.sideValue}>
                  {phone}
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeading}>
                <View style={styles.sectionMarker} />
                <Text style={styles.sectionTitle}>
                  {locale === 'vi-VN'
                    ? 'Hồ sơ ứng viên'
                    : locale === 'ru-RU'
                    ? 'Данные кандидата'
                    : 'Candidate record'}
                </Text>
              </View>

              <View style={styles.sideItem}>
                <Text style={styles.sideLabel}>
                  {profileText.candidateCode || 'Candidate code'}
                </Text>
                <Text style={styles.sideValue}>
                  {candidateCode}
                </Text>
              </View>

              <View style={styles.sideItem}>
                <Text style={styles.sideLabel}>
                  {profileText.applicationStatus || 'Application status'}
                </Text>
                <Text style={styles.statusBadge}>
                  {applicationStatus}
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeading}>
                <View style={styles.sectionMarker} />
                <Text style={styles.sectionTitle}>
                  {locale === 'vi-VN'
                    ? 'Hoạt động đánh giá'
                    : locale === 'ru-RU'
                    ? 'Оценочная активность'
                    : 'Assessment activity'}
                </Text>
              </View>

              <View style={styles.sideItem}>
                <Text style={styles.sideLabel}>
                  {profileText.totalTests || 'Total tests'}
                </Text>
                <Text style={styles.sideValue}>
                  {totalTests}
                </Text>
              </View>

              <View style={styles.sideItem}>
                <Text style={styles.sideLabel}>
                  {profileText.completedTests || 'Completed'}
                </Text>
                <Text style={styles.sideValue}>
                  {completedTests}
                </Text>
              </View>

              <View style={styles.sideItem}>
                <Text style={styles.sideLabel}>
                  {profileText.draftTests || 'Not started'}
                </Text>
                <Text style={styles.sideValue}>
                  {draftTests}
                </Text>
              </View>

              <View style={styles.sideItem}>
                <Text style={styles.sideLabel}>
                  {profileText.cancelledTests || 'Cancelled'}
                </Text>
                <Text style={styles.sideValue}>
                  {cancelledTests}
                </Text>
              </View>
            </View>

            {cvUrl && (
              <View style={styles.section}>
                <View style={styles.sectionHeading}>
                  <View style={styles.sectionMarker} />
                  <Text style={styles.sectionTitle}>
                    {profileText.cv || 'CV'}
                  </Text>
                </View>

                <Text style={styles.linkText}>
                  {profileText.viewCv || 'Available online'}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.main}>
            <View style={styles.section}>
              <View style={styles.sectionHeading}>
                <View style={styles.sectionMarker} />
                <Text style={styles.sectionTitle}>
                  {profileText.summary || 'Summary'}
                </Text>
              </View>

              <View style={styles.summaryBox}>
                <Text style={styles.summaryText}>
                  {summaryText}
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeading}>
                <View style={styles.sectionMarker} />
                <Text style={styles.sectionTitle}>
                  {locale === 'vi-VN'
                    ? 'Thông tin chi tiết'
                    : locale === 'ru-RU'
                    ? 'Профиль кандидата'
                    : 'Candidate profile'}
                </Text>
              </View>

              <View style={styles.infoGrid}>
                <View style={[styles.infoCard, styles.infoCardLeft]}>
                  <Text style={styles.infoLabel}>
                    {profileText.fullName || 'Full name'}
                  </Text>
                  <Text style={styles.infoValue}>
                    {fullName}
                  </Text>
                </View>

                <View style={[styles.infoCard, styles.infoCardRight]}>
                  <Text style={styles.infoLabel}>
                    {profileText.desiredPosition || 'Desired position'}
                  </Text>
                  <Text style={styles.infoValue}>
                    {desiredPosition}
                  </Text>
                </View>

                <View style={[styles.infoCard, styles.infoCardLeft]}>
                  <Text style={styles.infoLabel}>
                    {profileText.candidateCode || 'Candidate code'}
                  </Text>
                  <Text style={styles.infoValue}>
                    {candidateCode}
                  </Text>
                </View>

                <View style={[styles.infoCard, styles.infoCardRight]}>
                  <Text style={styles.infoLabel}>
                    {profileText.applicationStatus || 'Application status'}
                  </Text>
                  <Text style={styles.infoValue}>
                    {applicationStatus}
                  </Text>
                </View>

                <View style={[styles.infoCard, styles.infoCardLeft]}>
                  <Text style={styles.infoLabel}>
                    {profileText.emailAddress || 'Email'}
                  </Text>
                  <Text style={styles.infoValue}>
                    {email}
                  </Text>
                </View>

                <View style={[styles.infoCard, styles.infoCardRight]}>
                  <Text style={styles.infoLabel}>
                    {profileText.phoneNumber || 'Phone'}
                  </Text>
                  <Text style={styles.infoValue}>
                    {phone}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeading}>
                <View style={styles.sectionMarker} />
                <Text style={styles.sectionTitle}>
                  {profileText.latestAssessment || 'Latest assessment'}
                </Text>
              </View>

              <View style={styles.scorePanel}>
                <View style={styles.scoreCircle}>
                  <Text style={styles.scoreNumber}>
                    {latestScore != null
                      ? latestScore.toFixed(1)
                      : '—'}
                  </Text>

                  <Text style={styles.scoreCaption}>
                    / 100
                  </Text>
                </View>

                <View style={styles.scoreContent}>
                  <Text style={styles.scoreTitle}>
                    {latestType}
                  </Text>

                  <Text style={styles.scoreMeta}>
                    {latestStatus}
                    {latestLevel ? ` • ${latestLevel}` : ''}
                  </Text>

                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${scoreProgress}%` }
                      ]}
                    />
                  </View>
                </View>
              </View>

              <Text style={styles.note}>
                {locale === 'vi-VN'
                  ? 'Điểm số và phân loại được lấy từ kết quả đánh giá METSAFE gần nhất.'
                  : locale === 'ru-RU'
                  ? 'Баллы и классификация основаны на последней доступной оценке METSAFE.'
                  : 'Scores and classification are based on the latest available METSAFE assessment.'}
              </Text>
            </View>

            {notes && (
              <View style={styles.section}>
                <View style={styles.sectionHeading}>
                  <View style={styles.sectionMarker} />
                  <Text style={styles.sectionTitle}>
                    {profileText.notes || 'Notes'}
                  </Text>
                </View>

                <Text style={styles.summaryText}>
                  {notes}
                </Text>
              </View>
            )}
          </View>
        </View>

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `METSAFE  •  ${candidateCode}  •  ${pageNumber}/${totalPages}`
          }
        />
      </Page>
    </Document>
  );
};

export default CandidateCV;