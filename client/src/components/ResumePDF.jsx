import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1a1a1a',
    backgroundColor: '#ffffff'
  },
  // Header
  header: { marginBottom: 16, borderBottom: '2px solid #6366f1', paddingBottom: 12 },
  name: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: '#6366f1', marginBottom: 4 },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, fontSize: 9, color: '#555' },
  contactItem: { marginRight: 12 },

  // Section
  section: { marginBottom: 14 },
  sectionTitle: {
    fontSize: 12, fontFamily: 'Helvetica-Bold',
    color: '#6366f1', borderBottom: '1px solid #e0e0e0',
    paddingBottom: 3, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1
  },

  // Summary
  summary: { fontSize: 10, color: '#444', lineHeight: 1.5 },

  // Education / Experience
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  itemTitle: { fontFamily: 'Helvetica-Bold', fontSize: 10 },
  itemSubtitle: { fontSize: 9, color: '#555', marginBottom: 2 },
  itemDate: { fontSize: 9, color: '#888' },
  itemDescription: { fontSize: 9, color: '#444', lineHeight: 1.5, marginTop: 3 },
  itemBlock: { marginBottom: 8 },

  // Skills
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  skillTag: {
    backgroundColor: '#ede9fe', color: '#5b21b6',
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 4, fontSize: 9, fontFamily: 'Helvetica-Bold'
  },

  // Projects
  projectLink: { fontSize: 9, color: '#6366f1', marginTop: 2 }
})

export default function ResumePDF({ resume }) {
  const { personalInfo, education, experience, skills, projects } = resume

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo?.name || 'Your Name'}</Text>
          <View style={styles.contactRow}>
            {personalInfo?.email && <Text style={styles.contactItem}>✉ {personalInfo.email}</Text>}
            {personalInfo?.phone && <Text style={styles.contactItem}>📞 {personalInfo.phone}</Text>}
            {personalInfo?.location && <Text style={styles.contactItem}>📍 {personalInfo.location}</Text>}
            {personalInfo?.linkedin && <Text style={styles.contactItem}>LinkedIn: {personalInfo.linkedin}</Text>}
            {personalInfo?.github && <Text style={styles.contactItem}>GitHub: {personalInfo.github}</Text>}
          </View>
        </View>

        {/* Summary */}
        {personalInfo?.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.summary}>{personalInfo.summary}</Text>
          </View>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu, i) => (
              <View key={i} style={styles.itemBlock}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{edu.degree} {edu.field ? `in ${edu.field}` : ''}</Text>
                  <Text style={styles.itemDate}>{edu.startYear} {edu.endYear ? `- ${edu.endYear}` : ''}</Text>
                </View>
                <Text style={styles.itemSubtitle}>{edu.institution} {edu.grade ? `| Grade: ${edu.grade}` : ''}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Experience */}
        {experience?.length > 0 && experience.some(e => e.company) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {experience.filter(e => e.company).map((exp, i) => (
              <View key={i} style={styles.itemBlock}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{exp.role}</Text>
                  <Text style={styles.itemDate}>{exp.startDate} {exp.endDate ? `- ${exp.endDate}` : ''}</Text>
                </View>
                <Text style={styles.itemSubtitle}>{exp.company}</Text>
                {exp.description && <Text style={styles.itemDescription}>{exp.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
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

        {/* Projects */}
        {projects?.length > 0 && projects.some(p => p.name) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.filter(p => p.name).map((proj, i) => (
              <View key={i} style={styles.itemBlock}>
                <Text style={styles.itemTitle}>{proj.name}</Text>
                {proj.techStack && <Text style={styles.itemSubtitle}>Tech: {proj.techStack}</Text>}
                {proj.description && <Text style={styles.itemDescription}>{proj.description}</Text>}
                {proj.link && <Text style={styles.projectLink}>{proj.link}</Text>}
              </View>
            ))}
          </View>
        )}

      </Page>
    </Document>
  )
}