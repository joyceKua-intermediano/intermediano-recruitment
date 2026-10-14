'use client'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardVariants } from '@/components/ui/card'
import { Spinner, PulseLoader } from '@/components/ui/loading'
import { User, Phone, Calendar, MapPin, Globe } from 'lucide-react'
import {
  basicInformationSchema,
  BasicInformationFormSchemaType,
} from '../../schemas/basicInformationSchema'
import { useSaveApplicantBasicInfo } from '../../hooks/useSaveApplicantInformation'
import { useApplicantStore } from '@/lib/stores/applicantStore'

const formFields = [
  {
    name: 'name',
    label: 'Name',
    placeholder: 'Enter your First name and  Last name',
    type: 'text',
    icon: User,
  },
  {
    name: 'mobile',
    label: 'Mobile Number',
    placeholder: 'Enter your phone number',
    type: 'text',
    icon: Phone,
  },
  {
    name: 'birthDate',
    label: 'Birth Date (Optional)',
    placeholder: '',
    type: 'date',
    icon: Calendar,
  },
  {
    name: 'city',
    label: 'City',
    placeholder: 'Enter your city',
    type: 'text',
    icon: MapPin,
  },
  {
    name: 'country',
    label: 'Country',
    placeholder: 'Enter your country',
    type: 'text',
    icon: Globe,
  },
] as const

interface BasicInformationProps {
  onSubmitSuccess: () => void
  onNext?: () => void
}

const BasicInformation: React.FC<BasicInformationProps> = ({ onSubmitSuccess, onNext }) => {
  const { applicantBasicInformation } = useApplicantStore()

  const { mutate, isPending: isSaving } = useSaveApplicantBasicInfo()

  const form = useForm<BasicInformationFormSchemaType>({
    resolver: zodResolver(basicInformationSchema),
    defaultValues: applicantBasicInformation || {
      name: '',
      mobile: '',
      birthDate: undefined,
      city: '',
      country: '',
    },
  })

  const { reset, watch } = form
  const formValues = watch()

  const onSubmit = (data: BasicInformationFormSchemaType) => {
    mutate(data, {
      onSuccess: () => {
        if (onSubmitSuccess) onSubmitSuccess()
      },
    })
  }

  const handleNext = () => {
    if (onNext) onNext()
  }

  const isFormValid = () => {
    const { name, mobile, birthDate, city, country } = formValues
    return name?.trim() && mobile?.trim() && birthDate && city?.trim() && country?.trim()
  }

  const hasUnsavedChanges = () => {
    if (!applicantBasicInformation) return true
    const { name, mobile, birthDate, city, country } = formValues
    const stored = applicantBasicInformation
    return (
      name?.trim() !== stored.name?.trim() ||
      mobile?.trim() !== stored.mobile?.trim() ||
      birthDate !== stored.birthDate ||
      city?.trim() !== stored.city?.trim() ||
      country?.trim() !== stored.country?.trim()
    )
  }

  const isNextDisabled = !isFormValid() || hasUnsavedChanges()

  useEffect(() => {
    if (applicantBasicInformation) {
      reset(applicantBasicInformation)
    }
  }, [applicantBasicInformation, reset])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='w-full mx-auto'
    >
      <Card className={CardVariants.elevated}>
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#7c2a1c] to-[#a0522d] bg-clip-text text-transparent">
            Personal Information
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Please provide your basic details to complete your profile
          </p>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            {isSaving ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='space-y-6'
              >
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <Spinner size="lg" className="mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                      Saving your information...
                    </p>
                  </div>
                </div>
                <PulseLoader lines={5} />
              </motion.div>
            ) : (
              <motion.form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {formFields.map(({ name, label, placeholder, type, icon: Icon }, index) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <FormField
                      control={form.control}
                      name={name}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className='text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2'>
                            <Icon className="w-4 h-4" />
                            {label}
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={type}
                                placeholder={placeholder}
                                className='w-full border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:border-[#7c2a1c] focus:ring focus:ring-[#7c2a1c]/20 dark:focus:ring-[#7c2a1c]/20 transition-all duration-200 pl-10 bg-white dark:bg-gray-800'
                                {...field}
                                value={field.value || ''}
                                onChange={(e) => {
                                  if (type === 'date') {
                                    field.onChange(e.target.value || undefined)
                                  } else {
                                    field.onChange(e)
                                  }
                                }}
                              />
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Icon className="h-5 w-5 text-gray-400" />
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage className='text-red-500 text-sm' />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="pt-4 space-y-3"
                >
                  <Button
                    type='submit'
                    className='w-full py-3 text-white font-medium rounded-lg shadow-md transition-all duration-200 bg-gradient-to-r from-[#7c2a1c] to-[#a0522d] hover:from-[#5d1f15] hover:to-[#8b4513] hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]'
                    disabled={isSaving}
                    loading={isSaving}
                    loadingText="Saving..."
                  >
                    {isSaving ? 'Saving...' : 'Save Information'}
                  </Button>
                  {onNext && (
                    <>
                      <Button
                        type='button'
                        variant='outline'
                        onClick={handleNext}
                        disabled={isNextDisabled}
                        className='w-full py-3 font-medium rounded-lg shadow-md transition-all duration-200 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        {isNextDisabled ? 'Complete Required Fields' : 'Next'}
                      </Button>
                      {isNextDisabled && (
                        <p className='text-sm text-amber-600 text-center'>
                          {!isFormValid()
                            ? 'Please fill in all required fields before proceeding.'
                            : 'Please save your information before proceeding.'
                          }
                        </p>
                      )}
                    </>
                  )}
                </motion.div>
              </motion.form>
            )}
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default BasicInformation
