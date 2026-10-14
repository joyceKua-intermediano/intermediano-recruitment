import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from '@react-pdf/renderer'
import { ResumeBuilderFormSchemaType } from '../schemas/resumeBuilderSchema'

Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf' },
    {
      src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9fBBc9.ttf',
      fontWeight: 'bold',
    },
  ],
})

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    fontSize: 11,
    marginTop: '5px',
    paddingBottom: '5px',
  },
  header: {
    backgroundColor: '#7c2a1c',
    color: '#ffffff',
    padding: 32,
    position: 'relative',
    marginBottom: 0,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  avatar: {
    width: 96,
    height: 96,
    backgroundColor: '#d1d5db',
    borderRadius: 48,
    marginRight: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#6b7280',
    fontSize: 48,
    fontWeight: 'bold',
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 16,
  },
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '48%',
  },
  contactBar: {
    width: 4,
    height: 24,
    backgroundColor: '#f9a8d4',
    marginRight: 12,
  },
  contactLabel: {
    fontSize: 10,
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  logoContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  content: {
    padding: 32,
  },
  section: {
    marginBottom: 32,
  },

  personalInfo: {
    marginBottom: 8,
  },
  personalLabel: {
    fontWeight: 'bold',
    color: '#374151',
  },
  personalValue: {
    color: '#374151',
  },
  aboutMeBox: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 4,
    borderLeft: '4pt solid #d1d5db',
    marginTop: 8,
  },
  aboutMeText: {
    color: '#374151',
    lineHeight: 1.5,
  },
  experienceItem: {
    marginBottom: 24,
    paddingLeft: 16,
    borderLeft: '4pt solid #7c2a1c',
  },
  experienceTitle: {
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  experienceCompany: {
    color: '#374151',
    marginBottom: 4,
  },
  experienceLocation: {
    color: '#374151',
    marginBottom: 4,
  },
  experienceDates: {
    color: '#374151',
    marginBottom: 8,
  },
  experienceResponsibilities: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 4,
    marginTop: 8,
  },
  experienceResponsibilitiesText: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.4,
  },

  languageSkills: {
    color: '#374151',
    fontSize: 10,
  },
  digitalSkillCategory: {
    marginBottom: 12,
  },
  digitalSkillLabel: {
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  digitalSkillValue: {
    color: '#374151',
    marginLeft: 16,
    fontSize: 10,
  },
  additionalInfo: {
    marginBottom: 8,
  },
  additionalLabel: {
    fontWeight: 'bold',
    color: '#374151',
  },
  additionalValue: {
    color: '#374151',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  languageItem: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#222',
  },
  skillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  skillLabel: {
    fontWeight: '500',
    color: '#555',
  },
  skillValue: {
    color: '#111',
  },
  emptyState: {
    fontStyle: 'italic',
    color: '#888',
  },
})

interface ResumePDFDocumentProps {
  data: ResumeBuilderFormSchemaType | null
}

const ResumePDFDocument: React.FC<ResumePDFDocumentProps> = ({ data }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    })
  }

  if (!data) {
    data = {
      fullName: '',
      dateOfBirth: undefined,
      gender: '',
      nationalities: [],
      address: '',
      city: '',
      country: '',
      phoneNumber: '',
      whatsapp: '',
      email: '',
      linkedin: '',
      availabilityToRelocate: false,
      relocationCountries: [],
      careerSummary: '',
      professionalExperience: [],
      education: [],
      certifications: [],
      languageSkills: [],
      digitalSkills: {
        software: [],
        systems: [],
        socialMedia: [],
        hardSkills: [],
        softSkills: [],
      },
      availabilityToTravel: false,
      travelFrequency: '',
      salaryExpectation: '',
      areasOfInterest: [],
    }
  }

  const splitFullName = data.fullName.trim().split(/\s+/)
  const firstName = splitFullName[0]
  const lastName = splitFullName[splitFullName.length - 1]

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <View style={styles.headerInfo}>
                <Text style={styles.name}>
                  {firstName} {lastName.charAt(0)}.
                </Text>
                <Text style={styles.title}>
                  {data.careerSummary
                    ? data.careerSummary.split('.')[0]
                    : 'Principal Function'}
                </Text>
                <View style={styles.contactGrid}></View>
              </View>
            </View>
            <View style={styles.logoContainer}>
              <Image
                src='/logo_Intermediano.png'
                style={{
                  width: 48,
                  height: 48,
                  objectFit: 'contain',
                }}
              />
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Personal Information</Text>
            <View style={styles.personalInfo}>
              <Text style={styles.personalLabel}>Full Name: </Text>
              <Text style={styles.personalValue}>{data.fullName || ''}</Text>
            </View>

            <View style={styles.personalInfo}>
              <Text style={styles.personalLabel}>Gender: </Text>
              <Text style={styles.personalValue}>{data.gender || ''}</Text>
            </View>
            <View style={styles.personalInfo}>
              <Text style={styles.personalLabel}>Nationality(ies): </Text>
              <Text style={styles.personalValue}>
                {data.nationalities?.join(', ') || ''}
              </Text>
            </View>

            <View style={styles.personalInfo}>
              <Text style={styles.personalLabel}>
                Availability to relocate?{' '}
              </Text>
              <Text style={styles.personalValue}>
                {data.availabilityToRelocate ? 'Yes' : 'No'}
              </Text>
            </View>
            {data.availabilityToRelocate &&
              data.relocationCountries &&
              data.relocationCountries.length > 0 && (
                <View style={styles.personalInfo}>
                  <Text style={styles.personalLabel}>
                    If yes, which country/region of interest:{' '}
                  </Text>
                  <Text style={styles.personalValue}>
                    {data.relocationCountries.join(', ')}
                  </Text>
                </View>
              )}
            <Text style={styles.sectionTitle}>
              2. About Me (Professional Summary)
            </Text>
            <View style={styles.personalInfo}>
              <Text style={styles.personalLabel}>Career Summary:</Text>
            </View>
            <View style={styles.aboutMeBox}>
              <Text style={styles.aboutMeText}>{data.careerSummary || ''}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Professional Experience</Text>
            {data.professionalExperience &&
            data.professionalExperience.length > 0 ? (
              data.professionalExperience.map((exp, index) => (
                <View key={index} style={styles.experienceItem}>
                  <Text style={styles.experienceTitle}>
                    Job Title: {exp.jobTitle || ''}
                  </Text>
                  <Text style={styles.experienceLocation}>
                    City / Country: {exp.city || ''} / {exp.country || ''}
                  </Text>
                  <Text style={styles.experienceDates}>
                    Start Date: {exp.startDate ? formatDate(exp.startDate) : ''}
                  </Text>
                  <Text style={styles.experienceDates}>
                    End Date:{' '}
                    {exp.isCurrent
                      ? 'Current'
                      : exp.endDate
                      ? formatDate(exp.endDate)
                      : ''}
                  </Text>
                  <Text style={styles.personalLabel}>
                    Main Responsibilities / Achievements:
                  </Text>
                  <View style={styles.experienceResponsibilities}>
                    <Text style={styles.experienceResponsibilitiesText}>
                      {exp.responsibilities || ''}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyState}>
                No professional experience added yet
              </Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              4. Education and Academic Background
            </Text>
            {data.education && data.education.length > 0 ? (
              data.education.map((edu, index) => (
                <View key={index} style={styles.experienceItem}>
                  <Text style={styles.experienceTitle}>
                    Degree / Academic Program: {edu.degree || ''}
                  </Text>
                  <Text style={styles.experienceCompany}>
                    Institution: {edu.institution || ''}
                  </Text>
                  <Text style={styles.experienceLocation}>
                    City / Country: {edu.city || ''} / {edu.country || ''}
                  </Text>
                  <Text style={styles.experienceDates}>
                    Start Date: {edu.startDate ? formatDate(edu.startDate) : ''}
                  </Text>
                  <Text style={styles.experienceDates}>
                    End Date:{' '}
                    {edu.isCurrent
                      ? 'Current'
                      : edu.endDate
                      ? formatDate(edu.endDate)
                      : ''}
                  </Text>
                  <Text style={styles.personalInfo}>
                    <Text style={styles.personalLabel}>
                      EQF Level (if applicable):{' '}
                    </Text>
                    <Text style={styles.personalValue}>
                      {edu.eqfLevel || ''}
                    </Text>
                  </Text>
                  <Text style={styles.personalInfo}>
                    <Text style={styles.personalLabel}>
                      Field(s) of Study / Thesis (if applicable):{' '}
                    </Text>
                    <Text style={styles.personalValue}>
                      {edu.fieldOfStudy || ''}
                    </Text>
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyState}>No education added yet</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              5. Certifications / Professional Courses
            </Text>
            {data.certifications && data.certifications.length > 0 ? (
              data.certifications.map((cert, index) => (
                <View key={index} style={styles.experienceItem}>
                  <Text style={styles.experienceTitle}>
                    Course / Certification Title: {cert.title || ''}
                  </Text>
                  <Text style={styles.experienceCompany}>
                    Institution / School: {cert.institution || ''}
                  </Text>
                  <Text style={styles.experienceLocation}>
                    City / Country: {cert.city || ''} / {cert.country || ''}
                  </Text>
                  <Text style={styles.experienceDates}>
                    Start Date:{' '}
                    {cert.startDate ? formatDate(cert.startDate) : ''}
                  </Text>
                  <Text style={styles.experienceDates}>
                    End Date: {cert.endDate ? formatDate(cert.endDate) : ''}
                  </Text>
                  <Text style={styles.personalInfo}>
                    <Text style={styles.personalLabel}>
                      Content / Main Topics Covered:{' '}
                    </Text>
                    <Text style={styles.personalValue}>
                      {cert.content || ''}
                    </Text>
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyState}>No certifications added yet</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Language Skills</Text>
            {data.languageSkills && data.languageSkills.length > 0 ? (
              data.languageSkills.map((lang, index) => (
                <View key={index} style={styles.languageItem}>

                  <Text style={styles.languageName}>
                    {lang.language || 'Unnamed Language'}
                  </Text>

                  <View style={styles.skillRow}>
                    <Text style={styles.skillLabel}>Listening:</Text>
                    <Text style={styles.skillValue}>
                      {lang.listening || '-'}
                    </Text>
                  </View>
                  <View style={styles.skillRow}>
                    <Text style={styles.skillLabel}>Reading:</Text>
                    <Text style={styles.skillValue}>{lang.reading || '-'}</Text>
                  </View>
                  <View style={styles.skillRow}>
                    <Text style={styles.skillLabel}>Writing:</Text>
                    <Text style={styles.skillValue}>{lang.writing || '-'}</Text>
                  </View>
                  <View style={styles.skillRow}>
                    <Text style={styles.skillLabel}>Speaking:</Text>
                    <Text style={styles.skillValue}>
                      {lang.speaking || '-'}
                    </Text>
                  </View>
                  <View style={styles.skillRow}>
                    <Text style={styles.skillLabel}>Interaction:</Text>
                    <Text style={styles.skillValue}>
                      {lang.interaction || '-'}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyState}>
                No language skills added yet
              </Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              7. Digital & Technical Skills
            </Text>
            <View style={styles.digitalSkillCategory}>
              <Text style={styles.digitalSkillLabel}>
                Software / Applications:
              </Text>
              <Text style={styles.digitalSkillValue}>
                {data.digitalSkills?.software &&
                data.digitalSkills.software.length > 0
                  ? data.digitalSkills.software.join(', ')
                  : 'None added yet'}
              </Text>
            </View>
            <View style={styles.digitalSkillCategory}>
              <Text style={styles.digitalSkillLabel}>Systems:</Text>
              <Text style={styles.digitalSkillValue}>
                {data.digitalSkills?.systems &&
                data.digitalSkills.systems.length > 0
                  ? data.digitalSkills.systems.join(', ')
                  : 'None added yet'}
              </Text>
            </View>
            <View style={styles.digitalSkillCategory}>
              <Text style={styles.digitalSkillLabel}>
                Social Media Platforms:
              </Text>
              <Text style={styles.digitalSkillValue}>
                {data.digitalSkills?.socialMedia &&
                data.digitalSkills.socialMedia.length > 0
                  ? data.digitalSkills.socialMedia.join(', ')
                  : 'None added yet'}
              </Text>
            </View>
            <View style={styles.digitalSkillCategory}>
              <Text style={styles.digitalSkillLabel}>Hard Skills:</Text>
              <Text style={styles.digitalSkillValue}>
                {data.digitalSkills?.hardSkills &&
                data.digitalSkills.hardSkills.length > 0
                  ? data.digitalSkills.hardSkills.join(', ')
                  : 'None added yet'}
              </Text>
            </View>
            <View style={styles.digitalSkillCategory}>
              <Text style={styles.digitalSkillLabel}>Soft Skills:</Text>
              <Text style={styles.digitalSkillValue}>
                {data.digitalSkills?.softSkills &&
                data.digitalSkills.softSkills.length > 0
                  ? data.digitalSkills.softSkills.join(', ')
                  : 'None added yet'}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Additional Information</Text>
            <View style={styles.additionalInfo}>
              <Text style={styles.additionalLabel}>
                Availability to travel?{' '}
              </Text>
              <Text style={styles.additionalValue}>
                {data.availabilityToTravel ? 'Yes' : 'No'}
              </Text>
            </View>
            {data.availabilityToTravel && data.travelFrequency && (
              <View style={styles.additionalInfo}>
                <Text style={styles.additionalLabel}>If yes, frequency: </Text>
                <Text style={styles.additionalValue}>
                  {data.travelFrequency}
                </Text>
              </View>
            )}
            <View style={styles.additionalInfo}>
              <Text style={styles.additionalLabel}>Salary Expectation: </Text>
              <Text style={styles.additionalValue}>
                {data.salaryExpectation || ''}
              </Text>
            </View>
            <View style={styles.additionalInfo}>
              <Text style={styles.additionalLabel}>
                Areas of Professional Interest:
              </Text>
            </View>
            <View style={styles.additionalInfo}>
              <Text style={styles.additionalValue}>
                {data.areasOfInterest && data.areasOfInterest.length > 0
                  ? data.areasOfInterest.join(', ')
                  : 'None added yet'}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default ResumePDFDocument
