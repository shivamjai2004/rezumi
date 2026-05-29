import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: '44 50 44 50',
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#111111',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#111111',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  contactItem: {
    fontSize: 9,
    color: '#555555',
    marginRight: 16,
  },
  divider: {
    borderBottom: '1.5px solid #111111',
    marginTop: 14,
  },
  section: {
    marginBottom: 14,
    marginTop: 14,
  },
  sectionRow: {
    flexDirection: 'row',
  },
  sectionLabel: {
    width: 100,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#111111',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingTop: 1,
    flexShrink: 0,
  },
  sectionContent: {
    flex: 1,
  },
  summary: {
    fontSize: 10,
    color: '#333333',
    lineHeight: 1.6,
  },
  itemBlock: {
    marginBottom: 9,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1,
  },
  itemTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    color: '#111111',
  },
  itemDate: {
    fontSize: 9,
    color: '#777777',
  },
  itemSubtitle: {
    fontSize: 9,
    color: '#555555',
    marginBottom: 2,
    fontFamily: 'Helvetica-Oblique',
  },
  itemDescription: {
    fontSize: 9,
    color: '#444444',
    lineHeight: 1.5,
  },
  skillsText: {
    fontSize: 10,
    color: '#333333',
    lineHeight: 1.6,
  },
  projectLink: {
    fontSize: 9,
    color: '#333333',
    marginTop: 2,
  },
  sectionDivider: {
    borderBottom: '0.5px solid #dddddd',
    marginBottom: 14,
  },
})

export default function ResumePDFMinimal({ resume }) {
  const { personalInfo, education, experience, skills, projects } = resume

  const hasContent = (arr) => arr?.length > 0

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo?.name || 'Your Name'}</Text>
          <View style={styles.contactRow}>
            {personalInfo?.email && <Text style={styles.contactItem}>{personalInfo.email}</Text>}
            {personalInfo?.phone && <Text style={styles.contactItem}>{personalInfo.phone}</Text>}
            {personalInfo?.location && <Text style={styles.contactItem}>{personalInfo.location}</Text>}
            {personalInfo?.linkedin && <Text style={styles.contactItem}>linkedin.com/in/{personalInfo.linkedin}</Text>}
            {personalInfo?.github && <Text style={styles.contactItem}>github.com/{personalInfo.github}</Text>}
          </View>
          <View style={styles.divider} />
        </View>

        {personalInfo?.summary && (
          <>
            <View style={styles.section}>
              <View style={styles.sectionRow}>
                <Text style={styles.sectionLabel}>Summary</Text>
                <View style={styles.sectionContent}>
                  <Text style={styles.summary}>{personalInfo.summary}</Text>
                </View>
              </View>
            </View>
            <View style={styles.sectionDivider} />
          </>
        )}

        {hasContent(education) && (
          <>
            <View style={styles.section}>
              <View style={styles.sectionRow}>
                <Text style={styles.sectionLabel}>Education</Text>
                <View style={styles.sectionContent}>
                  {education.map((edu, i) => (
                    <View key={i} style={styles.itemBlock}>
                      <View style={styles.itemHeader}>
                        <Text style={styles.itemTitle}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</Text>
                        <Text style={styles.itemDate}>{edu.startYear}{edu.endYear ? `–${edu.endYear}` : ''}</Text>
                      </View>
                      <Text style={styles.itemSubtitle}>{edu.institution}{edu.grade ? `, ${edu.grade}` : ''}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
            <View style={styles.sectionDivider} />
          </>
        )}

        {experience?.some(e => e.company) && (
          <>
            <View style={styles.section}>
              <View style={styles.sectionRow}>
                <Text style={styles.sectionLabel}>Experience</Text>
                <View style={styles.sectionContent}>
                  {experience.filter(e => e.company).map((exp, i) => (
                    <View key={i} style={styles.itemBlock}>
                      <View style={styles.itemHeader}>
                        <Text style={styles.itemTitle}>{exp.role}</Text>
                        <Text style={styles.itemDate}>{exp.startDate}{exp.endDate ? `–${exp.endDate}` : ''}</Text>
                      </View>
                      <Text style={styles.itemSubtitle}>{exp.company}</Text>
                      {exp.description && <Text style={styles.itemDescription}>{exp.description}</Text>}
                    </View>
                  ))}
                </View>
              </View>
            </View>
            <View style={styles.sectionDivider} />
          </>
        )}

        {hasContent(skills) && (
          <>
            <View style={styles.section}>
              <View style={styles.sectionRow}>
                <Text style={styles.sectionLabel}>Skills</Text>
                <View style={styles.sectionContent}>
                  <Text style={styles.skillsText}>{skills.join('  ·  ')}</Text>
                </View>
              </View>
            </View>
            <View style={styles.sectionDivider} />
          </>
        )}

        {projects?.some(p => p.name) && (
          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionLabel}>Projects</Text>
              <View style={styles.sectionContent}>
                {projects.filter(p => p.name).map((proj, i) => (
                  <View key={i} style={styles.itemBlock}>
                    <Text style={styles.itemTitle}>{proj.name}{proj.techStack ? `  —  ${proj.techStack}` : ''}</Text>
                    {proj.description && <Text style={styles.itemDescription}>{proj.description}</Text>}
                    {proj.link && <Text style={styles.projectLink}>{proj.link}</Text>}
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </Page>
    </Document>
  )
}