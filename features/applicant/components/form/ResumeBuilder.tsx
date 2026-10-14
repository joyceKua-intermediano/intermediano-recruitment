'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { useForm, useFieldArray, Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, X, Trash2, User, Phone, Mail, MapPin, Calendar, Globe, Briefcase, GraduationCap, Award, Languages, Laptop, Plane, DollarSign, FileText } from 'lucide-react'
import {
  resumeBuilderSchema,
  ResumeBuilderFormSchemaType,
  languageLevels,
  DigitalSkills
} from '../../schemas/resumeBuilderSchema'
import { useApplicantStore } from '@/lib/stores/applicantStore'
import { useSaveResumeData } from '../../hooks/useSaveResumeData'
import { useGetResumeData } from '../../hooks/useGetResumeData'
import CollapsibleSection from './CollapsibleSection'

interface ResumeBuilderProps {
  onSubmitSuccess?: () => void
  onNext?: () => void
  onFormDataChange?: (data: ResumeBuilderFormSchemaType) => void
}

const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ onSubmitSuccess, onNext, onFormDataChange }) => {
  const { applicantBasicInformation, applicantSkillsExpertise } = useApplicantStore()
  const { mutate: saveResumeData, isPending: isSaving } = useSaveResumeData()
  const { data: existingResumeData, isLoading: isLoadingResumeData } = useGetResumeData()

  const form = useForm<ResumeBuilderFormSchemaType>({
    resolver: zodResolver(resumeBuilderSchema) as Resolver<ResumeBuilderFormSchemaType>,
    defaultValues: {
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
        softSkills: []
      },
      availabilityToTravel: false,
      travelFrequency: '',
      salaryExpectation: '',
      areasOfInterest: []
    }
  })

  const { control, handleSubmit, watch, setValue, formState: { errors } } = form

  const [nationalityInput, setNationalityInput] = useState('')

  const [relocationInput, setRelocationInput] = useState('')

  const nationalityRef = React.useRef<HTMLDivElement>(null)

  const handleFormDataChangeCallback = useCallback((value: ResumeBuilderFormSchemaType) => {
    if (onFormDataChange) {
      onFormDataChange(value)
    }
  }, [onFormDataChange])

  useEffect(() => {
    const subscription = watch((value) => {
      handleFormDataChangeCallback(value as ResumeBuilderFormSchemaType)
    })
    return () => subscription.unsubscribe()
  }, [watch, handleFormDataChangeCallback])

  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control,
    name: 'professionalExperience'
  })

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: 'education'
  })

  const { fields: certificationFields, append: appendCertification, remove: removeCertification } = useFieldArray({
    control,
    name: 'certifications'
  })

  const { fields: languageFields, append: appendLanguage, remove: removeLanguage } = useFieldArray({
    control,
    name: 'languageSkills'
  })

  useEffect(() => {
    if (existingResumeData) {
      Object.keys(existingResumeData).forEach((key) => {
        if (key in existingResumeData) {
          setValue(key as keyof ResumeBuilderFormSchemaType, existingResumeData[key as keyof ResumeBuilderFormSchemaType] as any)
        }
      })
    } else if (applicantBasicInformation) {
      setValue('fullName', applicantBasicInformation.name || '')
      setValue('city', applicantBasicInformation.city || '')
      setValue('country', applicantBasicInformation.country || '')
      setValue('phoneNumber', applicantBasicInformation.mobile || '')
      setValue('dateOfBirth', applicantBasicInformation.birthDate || undefined)
    }
  }, [existingResumeData, applicantBasicInformation, setValue])

  useEffect(() => {
    if (applicantSkillsExpertise?.skills) {
      const hardSkills = applicantSkillsExpertise.skills.map(skill => skill.name)
      setValue('digitalSkills.hardSkills', hardSkills)
    }
  }, [applicantSkillsExpertise, setValue])

  const onSubmit = async (data: any) => {
    const validatedData = data as ResumeBuilderFormSchemaType
    saveResumeData(validatedData, {
      onSuccess: () => {
        if (onSubmitSuccess) onSubmitSuccess()
      }
    })
  }

  const onError = (errors: any) => {
    const firstErrorField = Object.keys(errors)[0]
    if (firstErrorField) {
      let errorElement = null

      if (firstErrorField === 'nationalities' && nationalityRef.current) {
        errorElement = nationalityRef.current
      } else {
        errorElement = document.querySelector(`[name="${firstErrorField}"]`) ||
          document.querySelector(`[data-field="${firstErrorField}"]`)
      }

      if (errorElement) {
        errorElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
        if (errorElement instanceof HTMLInputElement || errorElement instanceof HTMLTextAreaElement) {
          errorElement.focus()
        }
      }
    }
  }

  const addExperience = () => {
    appendExperience({
      jobTitle: '',
      company: '',
      city: '',
      country: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      responsibilities: ''
    })
  }

  const addEducation = () => {
    appendEducation({
      degree: '',
      institution: '',
      city: '',
      country: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      eqfLevel: '',
      fieldOfStudy: ''
    })
  }

  const addCertification = () => {
    appendCertification({
      title: '',
      institution: '',
      city: '',
      country: '',
      startDate: '',
      endDate: '',
      content: ''
    })
  }

  const addLanguage = () => {
    appendLanguage({
      language: '',
      listening: 'Beginner',
      reading: 'Beginner',
      writing: 'Beginner',
      speaking: 'Beginner',
      interaction: 'Beginner'
    })
  }

  const addToArray = (field: keyof DigitalSkills, value: string) => {
    const currentValues = watch(`digitalSkills.${field}`) || []
    if (!currentValues.includes(value)) {
      setValue(`digitalSkills.${field}`, [...currentValues, value])
    }
  }

  const removeFromArray = (field: keyof DigitalSkills, value: string) => {
    const currentValues = watch(`digitalSkills.${field}`) || []
    setValue(`digitalSkills.${field}`, currentValues.filter(item => item !== value))
  }

  const addToInterest = (value: string) => {
    const currentValues = watch('areasOfInterest') || []
    if (!currentValues.includes(value)) {
      setValue('areasOfInterest', [...currentValues, value])
    }
  }

  const removeFromInterest = (value: string) => {
    const currentValues = watch('areasOfInterest') || []
    setValue('areasOfInterest', currentValues.filter(item => item !== value))
  }

  const isPersonalInfoComplete = watch('fullName') && watch('gender') && watch('nationalities')?.length > 0 && watch('address') && watch('city') && watch('country') && watch('phoneNumber') && watch('email')
  const isSummaryComplete = watch('careerSummary')
  const isExperienceComplete = watch('professionalExperience')?.length > 0
  const isEducationComplete = watch('education')?.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-4"
    >
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">

        <CollapsibleSection
          id="personal-info"
          title="Personal Information"
          icon={<User className="w-4 h-4" />}
          completed={!!isPersonalInfoComplete}
          required
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Full Name *</label>
                <Input
                  {...form.register('fullName')}
                  placeholder="Enter your full name"
                  className="w-full"
                />
                {errors.fullName && <p className="text-destructive text-xs mt-1">{errors.fullName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Date of Birth (Optional)</label>
                <Input
                  type="date"
                  {...form.register('dateOfBirth')}
                  className="w-full"
                />
                {errors.dateOfBirth && <p className="text-destructive text-xs mt-1">{errors.dateOfBirth.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Gender *</label>
                <Select onValueChange={(value) => setValue('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-destructive text-xs mt-1">{errors.gender.message}</p>}
              </div>
              <div ref={nationalityRef}>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Nationality(ies) *
                  <span className="ml-2 text-xs text-muted-foreground font-normal">(Press Enter to add a value)</span>
                </label>
                <Input
                  value={nationalityInput}
                  onChange={(e) => setNationalityInput(e.target.value)}
                  placeholder="e.g., American, Canadian"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const value = e.currentTarget.value.trim()
                      if (value) {
                        const current = watch('nationalities') || []
                        if (!current.includes(value)) {
                          setValue('nationalities', [...current, value])
                          setNationalityInput('')
                        }
                      }
                    }
                  }}
                  className="w-full"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {watch('nationalities')?.map((nationality, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {nationality}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => {
                          const current = watch('nationalities') || []
                          setValue('nationalities', current.filter((_, i) => i !== index))
                        }}
                      />
                    </Badge>
                  ))}
                </div>
                {errors.nationalities && <p className="text-destructive text-xs mt-1">{errors.nationalities.message}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-foreground">Address *</label>
                <Input
                  {...form.register('address')}
                  placeholder="Enter your full address"
                  className="w-full"
                />
                {errors.address && <p className="text-destructive text-xs mt-1">{errors.address.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">City *</label>
                <Input
                  {...form.register('city')}
                  placeholder="Enter your city"
                  className="w-full"
                />
                {errors.city && <p className="text-destructive text-xs mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Country *</label>
                <Input
                  {...form.register('country')}
                  placeholder="Enter your country"
                  className="w-full"
                />
                {errors.country && <p className="text-destructive text-xs mt-1">{errors.country.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Phone Number (DDI + DDD + Number) *</label>
                <Input
                  {...form.register('phoneNumber')}
                  placeholder="+1 (555) 123-4567"
                  className="w-full"
                />
                {errors.phoneNumber && <p className="text-destructive text-xs mt-1">{errors.phoneNumber.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">WhatsApp</label>
                <Input
                  {...form.register('whatsapp')}
                  placeholder="+1 (555) 123-4567"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Email Address *</label>
                <Input
                  type="email"
                  {...form.register('email')}
                  placeholder="your.email@example.com"
                  className="w-full"
                />
                {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">LinkedIn Profile</label>
                <Input
                  {...form.register('linkedin')}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  className='cursor-pointer'
                  id="relocate"
                  checked={watch('availabilityToRelocate') ?? false}
                  onCheckedChange={(checked) => setValue('availabilityToRelocate', !!checked)}
                />
                <label htmlFor="relocate" className="text-sm font-medium cursor-pointer text-foreground">
                  Availability to relocate?
                </label>
              </div>

              {watch('availabilityToRelocate') && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Which country/region of interest?</label>
                  <Input
                    value={relocationInput}
                    onChange={(e) => setRelocationInput(e.target.value)}
                    placeholder="e.g., United States, Europe, Asia"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        const value = e.currentTarget.value.trim()
                        if (value) {
                          const current = watch('relocationCountries') || []
                          if (!current.includes(value)) {
                            setValue('relocationCountries', [...current, value])
                            setRelocationInput('')
                          }
                        }
                      }
                    }}
                    className="w-full"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {watch('relocationCountries')?.map((country, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {country}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => {
                            const current = watch('relocationCountries') || []
                            setValue('relocationCountries', current.filter((_, i) => i !== index))
                          }}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          id="summary"
          title="About Me (Professional Summary)"
          icon={<FileText className="w-4 h-4" />}
          completed={!!isSummaryComplete}
          required
        >
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground">Career Summary *</label>
            <Textarea
              {...form.register('careerSummary')}
              placeholder="Please provide a brief personal and professional description..."
              className="w-full min-h-[120px]"
            />
            {errors.careerSummary && <p className="text-destructive text-xs mt-1">{errors.careerSummary.message}</p>}
            <p className="text-xs text-muted-foreground mt-2">
              Write 2-3 sentences highlighting your key skills, experience, and career goals.
            </p>
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          id="experience"
          title="Professional Experience"
          icon={<Briefcase className="w-4 h-4" />}
          completed={!!isExperienceComplete}
        >
          <div className="space-y-4">
            {experienceFields.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-border rounded-lg bg-muted/30">
                <Briefcase className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-4">No experience added yet</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addExperience}
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Experience
                </Button>
              </div>
            ) : (
              <>
                {experienceFields.map((field, index) => (
                  <div key={field.id} className="border border-border rounded-lg p-4 space-y-4 bg-card">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-foreground">Experience {index + 1}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeExperience(index)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">Job Title *</label>
                        <Input
                          {...form.register(`professionalExperience.${index}.jobTitle`)}
                          placeholder="e.g., Software Engineer"
                          className="w-full"
                        />
                        {errors.professionalExperience?.[index]?.jobTitle && (
                          <p className="text-destructive text-xs mt-1">{errors.professionalExperience[index]?.jobTitle?.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">Company *</label>
                        <Input
                          {...form.register(`professionalExperience.${index}.company`)}
                          placeholder="e.g., Google Inc."
                          className="w-full"
                        />
                        {errors.professionalExperience?.[index]?.company && (
                          <p className="text-destructive text-xs mt-1">{errors.professionalExperience[index]?.company?.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">City *</label>
                        <Input
                          {...form.register(`professionalExperience.${index}.city`)}
                          placeholder="e.g., San Francisco"
                          className="w-full"
                        />
                        {errors.professionalExperience?.[index]?.city && (
                          <p className="text-destructive text-xs mt-1">{errors.professionalExperience[index]?.city?.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">Country *</label>
                        <Input
                          {...form.register(`professionalExperience.${index}.country`)}
                          placeholder="e.g., United States"
                          className="w-full"
                        />
                        {errors.professionalExperience?.[index]?.country && (
                          <p className="text-destructive text-xs mt-1">{errors.professionalExperience[index]?.country?.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">Start Date *</label>
                        <Input
                          type="date"
                          {...form.register(`professionalExperience.${index}.startDate`)}
                          className="w-full"
                        />
                        {errors.professionalExperience?.[index]?.startDate && (
                          <p className="text-destructive text-xs mt-1">{errors.professionalExperience[index]?.startDate?.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">End Date</label>
                        <Input
                          type="date"
                          {...form.register(`professionalExperience.${index}.endDate`)}
                          className="w-full"
                          disabled={watch(`professionalExperience.${index}.isCurrent`)}
                        />
                        <div className="flex items-center space-x-2 mt-2">
                          <Checkbox
                            className='cursor-pointer'
                            id={`current-${index}`}
                            checked={watch(`professionalExperience.${index}.isCurrent`)}
                            onCheckedChange={(checked) => {
                              setValue(`professionalExperience.${index}.isCurrent`, !!checked)
                              if (checked) {
                                setValue(`professionalExperience.${index}.endDate`, '')
                              }
                            }}
                          />
                          <label htmlFor={`current-${index}`} className="text-sm cursor-pointer text-foreground">
                            Currently working here
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">Main Responsibilities / Achievements *</label>
                      <Textarea
                        {...form.register(`professionalExperience.${index}.responsibilities`)}
                        placeholder="Describe your main responsibilities and achievements..."
                        className="w-full min-h-[100px]"
                      />
                      {errors.professionalExperience?.[index]?.responsibilities && (
                        <p className="text-destructive text-xs mt-1">{errors.professionalExperience[index]?.responsibilities?.message}</p>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}

            {experienceFields.length > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={addExperience}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Experience
              </Button>
            )}
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          id="education"
          title="Education and Academic Background"
          icon={<GraduationCap className="w-4 h-4" />}
          completed={!!isEducationComplete}
        >
          <div className="space-y-4">
            {educationFields.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-border rounded-lg bg-muted/30">
                <GraduationCap className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-4">No education added yet</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addEducation}
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Education
                </Button>
              </div>
            ) : (
              <>
                {educationFields.map((field, index) => (
                  <div key={field.id} className="border border-border rounded-lg p-4 space-y-4 bg-card">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-foreground">Education {index + 1}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeEducation(index)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">Degree / Academic Program *</label>
                        <Input
                          {...form.register(`education.${index}.degree`)}
                          placeholder="e.g., Bachelor of Computer Science"
                          className="w-full"
                        />
                        {errors.education?.[index]?.degree && (
                          <p className="text-destructive text-xs mt-1">{errors.education[index]?.degree?.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">Institution *</label>
                        <Input
                          {...form.register(`education.${index}.institution`)}
                          placeholder="e.g., Stanford University"
                          className="w-full"
                        />
                        {errors.education?.[index]?.institution && (
                          <p className="text-destructive text-xs mt-1">{errors.education[index]?.institution?.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">City *</label>
                        <Input
                          {...form.register(`education.${index}.city`)}
                          placeholder="e.g., Stanford"
                          className="w-full"
                        />
                        {errors.education?.[index]?.city && (
                          <p className="text-destructive text-xs mt-1">{errors.education[index]?.city?.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">Country *</label>
                        <Input
                          {...form.register(`education.${index}.country`)}
                          placeholder="e.g., United States"
                          className="w-full"
                        />
                        {errors.education?.[index]?.country && (
                          <p className="text-destructive text-xs mt-1">{errors.education[index]?.country?.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">Start Date *</label>
                        <Input
                          type="date"
                          {...form.register(`education.${index}.startDate`)}
                          className="w-full"
                        />
                        {errors.education?.[index]?.startDate && (
                          <p className="text-destructive text-xs mt-1">{errors.education[index]?.startDate?.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">End Date</label>
                        <Input
                          type="date"
                          {...form.register(`education.${index}.endDate`)}
                          className="w-full"
                          disabled={watch(`education.${index}.isCurrent`)}
                        />
                        <div className="flex items-center space-x-2 mt-2">
                          <Checkbox
                            className='cursor-pointer'
                            id={`current-edu-${index}`}
                            checked={watch(`education.${index}.isCurrent`)}
                            onCheckedChange={(checked) => {
                              setValue(`education.${index}.isCurrent`, !!checked)
                              if (checked) {
                                setValue(`education.${index}.endDate`, '')
                              }
                            }}
                          />
                          <label htmlFor={`current-edu-${index}`} className="text-sm cursor-pointer text-foreground">
                            Currently studying
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">EQF Level (if applicable)</label>
                        <Input
                          {...form.register(`education.${index}.eqfLevel`)}
                          placeholder="e.g., Level 6"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">Field(s) of Study / Thesis</label>
                        <Input
                          {...form.register(`education.${index}.fieldOfStudy`)}
                          placeholder="e.g., Computer Science, AI Research"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {educationFields.length > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={addEducation}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Education
              </Button>
            )}
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          id="certifications"
          title="Certifications / Professional Courses"
          icon={<Award className="w-4 h-4" />}
          defaultOpen={false}
        >
          <div className="space-y-4">
            {certificationFields.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-border rounded-lg bg-muted/30">
                <Award className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-3">No certifications added yet</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addCertification}
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Certification
                </Button>
              </div>
            ) : (
              <>
                {certificationFields.map((field, index) => (
                  <div key={field.id} className="border border-border rounded-lg p-4 space-y-4 bg-card">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-foreground">Certification {index + 1}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeCertification(index)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">Course / Certification Title *</label>
                        <Input
                          {...form.register(`certifications.${index}.title`)}
                          placeholder="e.g., AWS Certified Solutions Architect"
                          className="w-full"
                        />
                        {errors.certifications?.[index]?.title && (
                          <p className="text-destructive text-xs mt-1">{errors.certifications[index]?.title?.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">Institution / School *</label>
                        <Input
                          {...form.register(`certifications.${index}.institution`)}
                          placeholder="e.g., Amazon Web Services"
                          className="w-full"
                        />
                        {errors.certifications?.[index]?.institution && (
                          <p className="text-destructive text-xs mt-1">{errors.certifications[index]?.institution?.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">City *</label>
                        <Input
                          {...form.register(`certifications.${index}.city`)}
                          placeholder="e.g., Seattle"
                          className="w-full"
                        />
                        {errors.certifications?.[index]?.city && (
                          <p className="text-destructive text-xs mt-1">{errors.certifications[index]?.city?.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">Country *</label>
                        <Input
                          {...form.register(`certifications.${index}.country`)}
                          placeholder="e.g., United States"
                          className="w-full"
                        />
                        {errors.certifications?.[index]?.country && (
                          <p className="text-destructive text-xs mt-1">{errors.certifications[index]?.country?.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">Start Date *</label>
                        <Input
                          type="date"
                          {...form.register(`certifications.${index}.startDate`)}
                          className="w-full"
                        />
                        {errors.certifications?.[index]?.startDate && (
                          <p className="text-destructive text-xs mt-1">{errors.certifications[index]?.startDate?.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">End Date</label>
                        <Input
                          type="date"
                          {...form.register(`certifications.${index}.endDate`)}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">Content / Main Topics Covered</label>
                      <Textarea
                        {...form.register(`certifications.${index}.content`)}
                        placeholder="Describe the main topics and content covered..."
                        className="w-full min-h-[80px]"
                      />
                    </div>
                  </div>
                ))}
              </>
            )}

            {certificationFields.length > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={addCertification}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Certification
              </Button>
            )}
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          id="languages"
          title="Language Skills"
          icon={<Languages className="w-4 h-4" />}
          defaultOpen={false}
        >
          <div className="space-y-4">
            {languageFields.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-border rounded-lg bg-muted/30">
                <Languages className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-3">No languages added yet</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addLanguage}
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Language
                </Button>
              </div>
            ) : (
              <>
                {languageFields.map((field, index) => (
                  <div key={field.id} className="border border-border rounded-lg p-4 space-y-4 bg-card">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-foreground">Language {index + 1}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeLanguage(index)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">Language *</label>
                        <Input
                          {...form.register(`languageSkills.${index}.language`)}
                          placeholder="e.g., English, Spanish, French"
                          className="w-full"
                        />
                        {errors.languageSkills?.[index]?.language && (
                          <p className="text-destructive text-xs mt-1">{errors.languageSkills[index]?.language?.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">Listening Level *</label>
                        <Select onValueChange={(value) => setValue(`languageSkills.${index}.listening`, value as any)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            {languageLevels.map((level) => (
                              <SelectItem key={level} value={level}>{level}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">Reading Level *</label>
                        <Select onValueChange={(value) => setValue(`languageSkills.${index}.reading`, value as any)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            {languageLevels.map((level) => (
                              <SelectItem key={level} value={level}>{level}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">Writing Level *</label>
                        <Select onValueChange={(value) => setValue(`languageSkills.${index}.writing`, value as any)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            {languageLevels.map((level) => (
                              <SelectItem key={level} value={level}>{level}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">Speaking Level *</label>
                        <Select onValueChange={(value) => setValue(`languageSkills.${index}.speaking`, value as any)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            {languageLevels.map((level) => (
                              <SelectItem key={level} value={level}>{level}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground">Interaction Level *</label>
                        <Select onValueChange={(value) => setValue(`languageSkills.${index}.interaction`, value as any)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            {languageLevels.map((level) => (
                              <SelectItem key={level} value={level}>{level}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {languageFields.length > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={addLanguage}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Language
              </Button>
            )}
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          id="digital-skills"
          title="Digital & Technical Skills"
          icon={<Laptop className="w-4 h-4" />}
          defaultOpen={false}
        >
          <div className="space-y-6">

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Software / Applications<span className="ml-2 text-xs text-gray-500 font-normal">(Press Enter to add a value)</span></label>
              <div className="space-y-2">
                <Input
                  placeholder="e.g., Excel, PowerPoint, Salesforce, Canva"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const value = e.currentTarget.value.trim()
                      if (value) addToArray('software', value)
                      e.currentTarget.value = ''
                    }
                  }}
                  className="w-full"
                />
                <div className="flex flex-wrap gap-2">
                  {watch('digitalSkills.software')?.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => removeFromArray('software', skill)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Systems<span className="ml-2 text-xs text-gray-500 font-normal">(Press Enter to add a value)</span></label>
              <div className="space-y-2">
                <Input
                  placeholder="e.g., Sydle, Salesforce, Internet user"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const value = e.currentTarget.value.trim()
                      if (value) addToArray('systems', value)
                      e.currentTarget.value = ''
                    }
                  }}
                  className="w-full"
                />
                <div className="flex flex-wrap gap-2">
                  {watch('digitalSkills.systems')?.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => removeFromArray('systems', skill)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Social Media Platforms<span className="ml-2 text-xs text-gray-500 font-normal">(Press Enter to add a value)</span></label>
              <div className="space-y-2">
                <Input
                  placeholder="e.g., LinkedIn, Facebook, WhatsApp, Instagram, YouTube, Twitter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const value = e.currentTarget.value.trim()
                      if (value) addToArray('socialMedia', value)
                      e.currentTarget.value = ''
                    }
                  }}
                  className="w-full"
                />
                <div className="flex flex-wrap gap-2">
                  {watch('digitalSkills.socialMedia')?.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => removeFromArray('socialMedia', skill)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Hard Skills<span className="ml-2 text-xs text-gray-500 font-normal">(Press Enter to add a value)</span></label>
              <div className="space-y-2">
                <Input
                  placeholder="e.g., Strategic Planning, Analytical Thinking, Decision-Making"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const value = e.currentTarget.value.trim()
                      if (value) addToArray('hardSkills', value)
                      e.currentTarget.value = ''
                    }
                  }}
                  className="w-full"
                />
                <div className="flex flex-wrap gap-2">
                  {watch('digitalSkills.hardSkills')?.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => removeFromArray('hardSkills', skill)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Soft Skills<span className="ml-2 text-xs text-gray-500 font-normal">(Press Enter to add a value)</span></label>
              <div className="space-y-2">
                <Input
                  placeholder="e.g., Resilience, Leadership, Communication, Active Listening, Adaptability"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const value = e.currentTarget.value.trim()
                      if (value) addToArray('softSkills', value)
                      e.currentTarget.value = ''
                    }
                  }}
                  className="w-full"
                />
                <div className="flex flex-wrap gap-2">
                  {watch('digitalSkills.softSkills')?.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => removeFromArray('softSkills', skill)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          id="additional-info"
          title="Additional Information"
          icon={<Plane className="w-4 h-4" />}
          defaultOpen={false}
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                className='cursor-pointer'
                id="travel"
                checked={watch('availabilityToTravel')}
                onCheckedChange={(checked) => setValue('availabilityToTravel', !!checked)}
              />
              <label htmlFor="travel" className="text-sm font-medium cursor-pointer text-foreground">
                Availability to travel?
              </label>
            </div>

            {watch('availabilityToTravel') && (
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">If yes, frequency:</label>
                <Select onValueChange={(value) => setValue('travelFrequency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="as-needed">As needed</SelectItem>
                    <SelectItem value="rarely">Rarely</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Salary Expectation</label>
              <Input
                {...form.register('salaryExpectation')}
                placeholder="e.g., $50,000 - $70,000 or Negotiable"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Areas of Professional Interest</label>
              <div className="space-y-2">
                <Input
                  placeholder="e.g., Technology, Healthcare, Finance, Education"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const value = e.currentTarget.value.trim()
                      if (value) addToInterest(value)
                      e.currentTarget.value = ''
                    }
                  }}
                  className="w-full"
                />
                <div className="flex flex-wrap gap-2">
                  {watch('areasOfInterest')?.map((interest, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {interest}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => removeFromInterest(interest)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
          <Button
            type="submit"
            disabled={isSaving}
            className="flex-1 bg-primary text-primary-foreground"
          >
            {isSaving ? 'Saving...' : 'Save Resume Data'}
          </Button>
          {onNext && (
            <Button
              type="button"
              variant="outline"
              onClick={onNext}
              className="flex-1"
            >
              Next
            </Button>
          )}
        </div>
      </form>
    </motion.div>
  )
}

export default ResumeBuilder
