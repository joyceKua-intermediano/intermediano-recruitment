'use client'
import React from 'react'
import { ResumeBuilderFormSchemaType } from '../../schemas/resumeBuilderSchema'
import { User } from 'lucide-react'
import Image from 'next/image'

interface ResumePreviewProps {
  data: ResumeBuilderFormSchemaType | null
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data }) => {
  const formatDate = (dateString: any) => {
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

  return (
    <div className='w-full bg-white shadow-lg' style={{ width: '210mm', minHeight: '297mm' }}>
      <div className='bg-gradient-to-r from-[#7c2a1c] to-[#8b3a2c] text-white p-8 relative overflow-hidden page-break-inside-avoid'>
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16'></div>
          <div className='absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12'></div>
          <div className='absolute top-1/2 right-1/4 w-16 h-16 bg-white rounded-full'></div>
        </div>

        <div className='relative z-10 flex items-start justify-between'>
          <div className='flex items-start gap-6'>
            <div className='w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center'>
              <User className='w-12 h-12 text-gray-500' />
            </div>

            <div className='flex-1'>
              <h1 className='text-3xl font-bold uppercase mb-2'>
                {data.fullName || 'YOUR NAME'}
              </h1>
              <p className='text-lg opacity-90 mb-4'>
                {data.careerSummary
                  ? data.careerSummary.split('.')[0]
                  : 'Principal Function'}
              </p>
              <div className='grid grid-cols-2 gap-4'>
                {data.email && (
                  <div className='flex items-center gap-3'>
                    <div className='w-1 h-6 bg-pink-300'></div>
                    <div>
                      <span className='text-sm opacity-80'>Email Address:</span>
                      <div className='text-sm font-medium'>{data.email}</div>
                    </div>
                  </div>
                )}

                <div className='flex items-center gap-3'>
                  <div className='w-1 h-6 bg-pink-300'></div>
                  <div>
                    <span className='text-sm opacity-80'>Phone Number:</span>
                    <div className='text-sm font-medium'>
                      {data.phoneNumber || 'Your phone number'}
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='w-1 h-6 bg-pink-300'></div>
                  <div>
                    <span className='text-sm opacity-80'>
                      City and Country:
                    </span>
                    <div className='text-sm font-medium'>
                      {data.city || 'Your city'}{' '}
                      {data.country || 'Your country'}
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='w-1 h-6 bg-pink-300'></div>
                  <div>
                    <span className='text-sm opacity-80'>LinkedIn:</span>
                    <div className='text-sm font-medium'>
                      {data.linkedin || 'Your LinkedIn Account'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='text-right'>
            <div className='mb-0'>
              <div className='w-16 h-16 bg-white rounded-lg flex items-center justify-center mb-0'>
                <Image
                  src='/logo_Intermediano.png'
                  alt='Intermediano Logo'
                  width={56}
                  height={56}
                  className='object-contain'
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='p-8'>
        <div className='mb-8 page-break-inside-avoid'>
          <h3 className='text-lg font-bold text-black mb-4'>
            1. Personal Information
          </h3>
          <div className='space-y-2 text-gray-700'>
            <div>
              <strong>Full Name:</strong> {data.fullName || ''}
            </div>
            <div>
              <strong>Date of Birth:</strong>{' '}
              {data.dateOfBirth ? formatDate(data.dateOfBirth) : undefined}
            </div>
            <div>
              <strong>Gender:</strong> {data.gender || ''}
            </div>
            <div>
              <strong>Nationality(ies):</strong>{' '}
              {data.nationalities?.join(', ') || ''}
            </div>
            <div>
              <strong>Address:</strong> {data.address || ''}
            </div>
            <div>
              <strong>WhatsApp:</strong> {data.whatsapp || ''}
            </div>
            <div>
              <strong>Availability to relocate?</strong>{' '}
              {data.availabilityToRelocate ? 'Yes' : 'No'}
            </div>
            {data.availabilityToRelocate &&
              data.relocationCountries &&
              data.relocationCountries.length > 0 && (
                <div className='ml-4'>
                  <div>
                    <strong>If yes, which country/region of interest:</strong>{' '}
                    {data.relocationCountries.join(', ')}
                  </div>
                </div>
              )}
          </div>
        </div>

        <div className='mb-8 page-break-inside-avoid'>
          <h3 className='text-lg font-bold text-black mb-4'>
            2. About Me (Professional Summary)
          </h3>
          <div className='space-y-2 text-gray-700'>
            <div>
              <strong>Career Summary:</strong>
            </div>
            <div className='bg-gray-50 p-4 rounded border-l-4 border-gray-300'>
              {data.careerSummary || ''}
            </div>
          </div>
        </div>

        <div className='mb-8 page-break-before'>
          <h3 className='text-lg font-bold text-black mb-4'>
            3. Professional Experience
          </h3>
          <div className='space-y-6'>
            {data.professionalExperience &&
            data.professionalExperience.length > 0 ? (
              data.professionalExperience.map((exp, index) => (
                <div key={index} className='border-l-4 border-[#7c2a1c] pl-4 page-break-inside-avoid'>
                  <div className='space-y-2 text-gray-700'>
                    <div>
                      <strong>Job Title:</strong> {exp.jobTitle || ''}
                    </div>
                    <div>
                      <strong>Company:</strong> {exp.company || ''}
                    </div>
                    <div>
                      <strong>City / Country:</strong> {exp.city || ''} /{' '}
                      {exp.country || ''}
                    </div>
                    <div>
                      <strong>Start Date:</strong>{' '}
                      {exp.startDate ? formatDate(exp.startDate) : ''}
                    </div>
                    <div>
                      <strong>End Date:</strong>{' '}
                      {exp.isCurrent
                        ? 'Current'
                        : exp.endDate
                        ? formatDate(exp.endDate)
                        : ''}
                    </div>
                    <div>
                      <strong>Main Responsibilities / Achievements:</strong>
                    </div>
                    <div className='bg-gray-50 p-3 rounded text-sm'>
                      {exp.responsibilities || ''}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='text-gray-500 italic'>
                No professional experience added yet
              </div>
            )}
          </div>
        </div>

        <div className='mb-8 page-break-before'>
          <h3 className='text-lg font-bold text-black mb-4'>
            4. Education and Academic Background
          </h3>
          <div className='space-y-6'>
            {data.education && data.education.length > 0 ? (
              data.education.map((edu, index) => (
                <div key={index} className='border-l-4 border-[#7c2a1c] pl-4 page-break-inside-avoid'>
                  <div className='space-y-2 text-gray-700'>
                    <div>
                      <strong>Degree / Academic Program:</strong>{' '}
                      {edu.degree || ''}
                    </div>
                    <div>
                      <strong>Institution:</strong> {edu.institution || ''}
                    </div>
                    <div>
                      <strong>City / Country:</strong> {edu.city || ''} /{' '}
                      {edu.country || ''}
                    </div>
                    <div>
                      <strong>Start Date:</strong>{' '}
                      {edu.startDate ? formatDate(edu.startDate) : ''}
                    </div>
                    <div>
                      <strong>End Date:</strong>{' '}
                      {edu.isCurrent
                        ? 'Current'
                        : edu.endDate
                        ? formatDate(edu.endDate)
                        : ''}
                    </div>
                    <div>
                      <strong>EQF Level (if applicable):</strong>{' '}
                      {edu.eqfLevel || ''}
                    </div>
                    <div>
                      <strong>
                        Field(s) of Study / Thesis (if applicable):
                      </strong>{' '}
                      {edu.fieldOfStudy || ''}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='text-gray-500 italic'>No education added yet</div>
            )}
          </div>
        </div>

        <div className='mb-8 page-break-before'>
          <h3 className='text-lg font-bold text-black mb-4'>
            5. Certifications / Professional Courses
          </h3>

          <div className='space-y-6'>
            {data.certifications && data.certifications.length > 0 ? (
              data.certifications.map((cert, index) => (
                <div key={index} className='border-l-4 border-[#7c2a1c] pl-4 page-break-inside-avoid'>
                  <div className='space-y-2 text-gray-700'>
                    <div>
                      <strong>Course / Certification Title:</strong>{' '}
                      {cert.title || ''}
                    </div>
                    <div>
                      <strong>Institution / School:</strong>{' '}
                      {cert.institution || ''}
                    </div>
                    <div>
                      <strong>City / Country:</strong> {cert.city || ''} /{' '}
                      {cert.country || ''}
                    </div>
                    <div>
                      <strong>Start Date:</strong>{' '}
                      {cert.startDate ? formatDate(cert.startDate) : ''}
                    </div>
                    <div>
                      <strong>End Date:</strong>{' '}
                      {cert.endDate ? formatDate(cert.endDate) : ''}
                    </div>
                    <div>
                      <strong>Content / Main Topics Covered:</strong>{' '}
                      {cert.content || ''}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='text-gray-500 italic'>
                No certifications added yet
              </div>
            )}
          </div>
        </div>

        <div className='mb-8 page-break-before'>
          <h3 className='text-lg font-bold text-black mb-4'>
            6. Language Skills
          </h3>

          <div className='space-y-4'>
            {data.languageSkills && data.languageSkills.length > 0 ? (
              data.languageSkills.map((lang, index) => (
                <div key={index} className='border-l-4 border-[#7c2a1c] pl-4'>
                  <div className='space-y-2 text-gray-700'>
                    <div>
                      <strong>Language:</strong> {lang.language || ''}
                    </div>
                    <div>
                      <strong>Listening (level):</strong> {lang.listening || ''}
                    </div>
                    <div>
                      <strong>Reading (level):</strong> {lang.reading || ''}
                    </div>
                    <div>
                      <strong>Writing (level):</strong> {lang.writing || ''}
                    </div>
                    <div>
                      <strong>Speaking (level):</strong> {lang.speaking || ''}
                    </div>
                    <div>
                      <strong>Interaction (level):</strong>{' '}
                      {lang.interaction || ''}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='text-gray-500 italic'>
                No language skills added yet
              </div>
            )}
          </div>
        </div>

        <div className='mb-8 page-break-before'>
          <h3 className='text-lg font-bold text-black mb-4'>
            7. Digital & Technical Skills
          </h3>
          <div className='space-y-4 text-gray-700'>
            <div>
              <strong>Software / Applications:</strong>
              <div className='ml-4 mt-1'>
                {data.digitalSkills?.software &&
                data.digitalSkills.software.length > 0 ? (
                  data.digitalSkills.software.join(', ')
                ) : (
                  <span className='text-gray-500 italic'>None added yet</span>
                )}
              </div>
            </div>

            <div>
              <strong>Systems:</strong>
              <div className='ml-4 mt-1'>
                {data.digitalSkills?.systems &&
                data.digitalSkills.systems.length > 0 ? (
                  data.digitalSkills.systems.join(', ')
                ) : (
                  <span className='text-gray-500 italic'>None added yet</span>
                )}
              </div>
            </div>

            <div>
              <strong>Social Media Platforms:</strong>
              <div className='ml-4 mt-1'>
                {data.digitalSkills?.socialMedia &&
                data.digitalSkills.socialMedia.length > 0 ? (
                  data.digitalSkills.socialMedia.join(', ')
                ) : (
                  <span className='text-gray-500 italic'>None added yet</span>
                )}
              </div>
            </div>

            <div>
              <strong>Hard Skills:</strong>
              <div className='ml-4 mt-1'>
                {data.digitalSkills?.hardSkills &&
                data.digitalSkills.hardSkills.length > 0 ? (
                  data.digitalSkills.hardSkills.join(', ')
                ) : (
                  <span className='text-gray-500 italic'>None added yet</span>
                )}
              </div>
            </div>

            <div>
              <strong>Soft Skills:</strong>
              <div className='ml-4 mt-1'>
                {data.digitalSkills?.softSkills &&
                data.digitalSkills.softSkills.length > 0 ? (
                  data.digitalSkills.softSkills.join(', ')
                ) : (
                  <span className='text-gray-500 italic'>None added yet</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className='mb-8 page-break-before'>
          <h3 className='text-lg font-bold text-black mb-4'>
            8. Additional Information
          </h3>
          <div className='space-y-2 text-gray-700'>
            <div>
              <strong>Availability to travel?</strong>{' '}
              {data.availabilityToTravel ? 'Yes' : 'No'}
            </div>
            {data.availabilityToTravel && data.travelFrequency && (
              <div className='ml-4'>
                <div>
                  <strong>If yes, frequency:</strong> {data.travelFrequency}
                </div>
              </div>
            )}
            <div>
              <strong>Salary Expectation:</strong>{' '}
              {data.salaryExpectation || ''}
            </div>
            <div>
              <strong>Areas of Professional Interest:</strong>
            </div>
            <div className='ml-4'>
              {data.areasOfInterest && data.areasOfInterest.length > 0 ? (
                data.areasOfInterest.join(', ')
              ) : (
                <span className='text-gray-500 italic'>None added yet</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumePreview
