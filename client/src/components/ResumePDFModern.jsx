import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1a1a1a',
    backgroundColor: '#ffffff',
    padding: 0,
  },
  header: {
    backgroundColor: '#0f172a',
    padding: '30 40 24 40',
  },
  name: {
    fontSize: 26,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    marginBottom: 6,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 10,
    color: '#94a3b8',
    marginBottom: 10,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  contactItem: {
    fontSize: 9,
    color: '#cbd5e1',
    marginRight: 14,
    backgroundColor: '#1e293b',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
  },
  body: {
    padding: '20 40 30 40',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#0ea5e9',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 6,
    paddingBottom: 4,
    borderBottom: '1.5px solid #e2e8f0',
  },
  summary: {
    fontSize: 10,
    color: '#475569',
    lineHeight: 1.6,
  },
  itemBlock: {
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  itemTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    color: '#0f172a',
  },
  dateBadge: {
    fontSize: 8,
    color: '#ffffff',
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 3,
  },
  itemSubtitle: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 3,
  },
  itemDescription: {
    fontSize: 9,
    color: '#475569',
    lineHeight: 1.5,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  skillTag: {
    backgroundColor: '#f0f9ff',
    color: '#0369a1',
    border: '1px solid #bae6fd',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
  },
  projectLink: {
    fontSize: 9,
    color: '#0ea5e9',
    marginTop: 2,
  },
})

export default function ResumePDFModern({ resume }) {
  const { personalInfo, education, experience, skills, projects } = resume

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo?.name || 'Your Name'}</Text>
          {personalInfo?.summary && (
            <Text style={styles.tagline} numberOfLines={1}>
              {personalInfo.summary.substring(0, 80)}{personalInfo.summary.length > 80 ? '...' : ''}
            </Text>
          )}
          <View style={styles.contactRow}>
            {personalInfo?.email && <Text style={styles.contactItem}>{personalInfo.email}</Text>}
            {personalInfo?.phone && <Text style={styles.contactItem}>{personalInfo.phone}</Text>}
            {personalInfo?.location && <Text style={styles.contactItem}>{personalInfo.location}</Text>}
            {personalInfo?.linkedin && <Text style={styles.contactItem}>LinkedIn: {personalInfo.linkedin}</Text>}
            {personalInfo?.github && <Text style={styles.contactItem}>GitHub: {personalInfo.github}</Text>}
          </View>
        </View>

        <View style={styles.body}>
          {personalInfo?.summary && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Profile</Text>
              <Text style={styles.summary}>{personalInfo.summary}</Text>
            </View>
          )}

          {education?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Education</Text>
              {education.map((edu, i) => (
                <View key={i} style={styles.itemBlock}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</Text>
                    <Text style={styles.dateBadge}>{edu.startYear}{edu.endYear ? ` – ${edu.endYear}` : ''}</Text>
                  </View>
                  <Text style={styles.itemSubtitle}>{edu.institution}{edu.grade ? ` · ${edu.grade}` : ''}</Text>
                </View>
              ))}
            </View>
          )}

          {experience?.length > 0 && experience.some(e => e.company) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Experience</Text>
              {experience.filter(e => e.company).map((exp, i) => (
                <View key={i} style={styles.itemBlock}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>{exp.role}</Text>
                    <Text style={styles.dateBadge}>{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}</Text>
                  </View>
                  <Text style={styles.itemSubtitle}>{exp.company}</Text>
                  {exp.description && <Text style={styles.itemDescription}>{exp.description}</Text>}
                </View>
              ))}
            </View>
          )}

          {skills?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Skills</Text>
              <View style={styles.skillsRow}>
                {skills.map((skill, i) => (
                  <Text key={i} style={styles.skillTag}>{skill}</Text>
                ))}
              </View>
            </View>
          )}

          {projects?.length > 0 && projects.some(p => p.name) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Projects</Text>
              {projects.filter(p => p.name).map((proj, i) => (
                <View key={i} style={styles.itemBlock}>
                  <Text style={styles.itemTitle}>{proj.name}</Text>
                  {proj.techStack && <Text style={styles.itemSubtitle}>Stack: {proj.techStack}</Text>}
                  {proj.description && <Text style={styles.itemDescription}>{proj.description}</Text>}
                  {proj.link && <Text style={styles.projectLink}>{proj.link}</Text>}
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  )
}