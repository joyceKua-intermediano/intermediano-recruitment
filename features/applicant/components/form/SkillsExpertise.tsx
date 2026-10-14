import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
  Skill,
  skillsExpertiseSchema,
  SkillsExpertiseSchemaType,
} from '../../schemas/skillsExpertiseSchema'
import { useSaveSkillsExpertise } from '../../hooks/useSaveSkillsExpertise'
import { useApplicantStore } from '@/lib/stores/applicantStore'
import { useGetJobDetails } from '@/features/job/hooks/useGetJobDetails'
import { toast } from 'sonner'

interface ShowcaseSkillsFormProps {
  onSubmitSuccess: () => void
  onNext?: () => void
  jobId?: string
}
const ShowcaseSkillsForm: React.FC<ShowcaseSkillsFormProps> = ({
  onSubmitSuccess,
  onNext,
  jobId,
}) => {
  const { mutate } = useSaveSkillsExpertise()
  const { applicantBasicInformation, applicantSkillsExpertise } =
    useApplicantStore()
  const [initialSkills, setInitialSkills] = useState<Skill[]>([])

  const [skills, setSkills] = useState<Skill[]>([])
  const [skillName, setSkillName] = useState('')
  const [skillYears, setSkillYears] = useState('')
  const [suggestedSkillsQualification, setSuggestedSkillsQualificaition] = useState<string[]>([])

  const { data: jobData, isLoading: isLoadingJob } = useGetJobDetails(jobId || null)
  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SkillsExpertiseSchemaType>({
    resolver: zodResolver(skillsExpertiseSchema),
    defaultValues: { skills: [] },
  })

  const addSkill = (newSkill: Skill) => {
    if (newSkill.name.trim() && newSkill.years > 0) {
      if (
        skills.find(
          (skill) => skill.name.toLowerCase() === newSkill.name.toLowerCase()
        )
      ) {
        toast.error('Skill already exists!', {
          icon: '⚠️',
          duration: 5000,
          style: {
            borderRadius: '8px',
            background: '#fff4e6',
            color: '#c05621',
          },
          description: 'Please input a different skill or expertise.',
        })
        return
      }
      setSkills((prevSkills) => [...prevSkills, newSkill])
      setValue('skills', [...skills, newSkill])
    }
  }

  const addSuggestedSkill = (skillName: string) => {
    setSkillName(skillName)
    setSkillYears('')
  }

  const handleAddSkill = () => {
    const name = skillName.trim()
    const years = Number(skillYears)
    if (name && years) {
      addSkill({ name, years })
      setSkillName('')
      setSkillYears('')
    }
  }

  const removeSkill = (index: number) => {
    const updatedSkills = skills.filter((_, i) => i !== index)
    setSkills(updatedSkills)
    setValue('skills', updatedSkills)
  }

  const onSubmit = (data: SkillsExpertiseSchemaType) => {
    if (!applicantBasicInformation?.id) {
      throw new Error('Applicant ID is required.')
    }
    const skillsExpertiseData = {
      skills: data.skills,
      applicantId: applicantBasicInformation.id,
    }
    mutate(skillsExpertiseData, {
      onSuccess: () => {
        if (onSubmitSuccess) onSubmitSuccess()
      },
    })
  }

  const handleNext = () => {
    if (onNext) onNext()
  }

  useEffect(() => {
    if (applicantSkillsExpertise?.skills) {
      setSkills(applicantSkillsExpertise.skills)
      setValue('skills', applicantSkillsExpertise.skills)
      setInitialSkills(applicantSkillsExpertise.skills)
    }
  }, [applicantSkillsExpertise, setValue])

  useEffect(() => {
    if (jobData?.job?.essentialSkills || jobData?.job?.qualifications) {
      setSuggestedSkillsQualificaition([...jobData.job.essentialSkills, ...jobData.job.qualifications])
    }
  }, [jobData])
  const areSkillsEqual = (a: Skill[], b: Skill[]) => {
    if (a.length !== b.length) return false
    const sortedA = [...a].sort((x, y) => x.name.localeCompare(y.name))
    const sortedB = [...b].sort((x, y) => x.name.localeCompare(y.name))
    return JSON.stringify(sortedA) === JSON.stringify(sortedB)
  }
  const isSubmitDisabled = skills.length === 0 || areSkillsEqual(skills, initialSkills)

  const hasUnsavedChanges = () => {
    if (initialSkills.length === 0) {
      return skills.length > 0
    }
    return !areSkillsEqual(skills, initialSkills)
  }

  const isNextDisabled = skills.length === 0 || hasUnsavedChanges()

  return (
    <Card className='bg-gray-50 shadow-sm'>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='flex flex-wrap gap-2'>
            {skills.map((skill, index) => (
              <span
                key={index}
                className='flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full'
              >
                {skill.name} ({skill.years} yrs)
                <button
                  type='button'
                  onClick={() => removeSkill(index)}
                  className='text-red-500 hover:text-red-700'
                  title='Remove Skill'
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          {suggestedSkillsQualification.length > 0 && (
            <div className='space-y-3'>
              <div className='flex items-center gap-2'>
                <h3 className='text-sm font-medium text-gray-700'>
                  💡 Suggested Skills for this Job:
                </h3>
                <span className='text-xs text-gray-500'>
                  (Click to add to input field)
                </span>
              </div>
              <div className='flex flex-wrap gap-2'>
                {suggestedSkillsQualification.map((skill, index) => {
                  const isAlreadyAdded = skills.some(
                    (existingSkill) => existingSkill.name.toLowerCase() === skill.toLowerCase()
                  )
                  const isInInputField = skillName.toLowerCase() === skill.toLowerCase()
                  return (
                    <button
                      key={index}
                      type='button'
                      onClick={() => addSuggestedSkill(skill)}
                      disabled={isAlreadyAdded}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        isAlreadyAdded
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : isInInputField
                          ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                          : 'bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer'
                      }`}
                      title={isAlreadyAdded ? 'Already added' : 'Click to add to input field'}
                    >
                      {skill} {isAlreadyAdded && '✓'} {isInInputField && '📝'}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
          <div className='flex flex-wrap gap-2 items-center'>
            <div className='flex-2'>
              <label
                htmlFor='skillName'
                className='block text-sm text-gray-600'
              >
                Skill or Expertise
              </label>
              <Input
                id='skillName'
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                placeholder='E.g., React, Node.js, or UX Design'
                className='w-full'
              />
            </div>
            <div className='flex-1'>
              <label
                htmlFor='skillYears'
                className='block text-sm text-gray-600'
              >
                Years of Experience
              </label>
              <Input
                id='skillYears'
                type='number'
                value={skillYears}
                onChange={(e) => setSkillYears(e.target.value)}
                placeholder='E.g., 2, 5, 10'
                className='w-full'
              />
            </div>
            <Button
              type='button'
              onClick={handleAddSkill}
              className='mt-6'
            >
              Add Skill
            </Button>
          </div>
          {errors.skills && (
            <p className='text-red-500 text-sm'>{errors.skills.message}</p>
          )}
          <CardFooter className='flex flex-col space-y-3'>
            <Button type='submit' className='w-full cursor-pointer' disabled={isSubmitDisabled}>
              Submit Skills
            </Button>
            {onNext && (
              <>
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleNext}
                  disabled={isNextDisabled}
                  className='w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isNextDisabled ? (skills.length === 0 ? 'Add Skills First' : 'Save Skills First') : 'Next'}
                </Button>
                {isNextDisabled && (
                  <p className='text-sm text-amber-600 text-center'>
                    {skills.length === 0
                      ? 'Please add at least one skill before proceeding.'
                      : 'Please save your skills before proceeding.'
                    }
                  </p>
                )}
              </>
            )}
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}

export default ShowcaseSkillsForm
