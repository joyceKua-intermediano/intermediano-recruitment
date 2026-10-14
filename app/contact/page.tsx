'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/loading'
import {
  Mail,
  Phone,
  MapPin,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function ContactPage() {
  const { t } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    inquiryType: '',
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
        inquiryType: '',
      })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      title: t('pages.contact.emailUs'),
      details: [
        'hr@intermediano.com',
      ],
      description: t('pages.contact.emailDescription'),
    },
    {
      icon: Phone,
      title: t('pages.contact.callUs'),
      details: ['+1 514-907-5393'],
      description: t('pages.contact.callDescription'),
    },
    {
      icon: MapPin,
      title: t('pages.contact.visitUs'),
      details: ['4388 Rue Saint-Denis Suite 200 #763 Montreal, QC H2J 2L1'],
      description: t('pages.contact.visitDescription'),
    },
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#c40e12]/5 via-white to-[#a0522d]/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>

      <section className='relative pt-24 pb-6 overflow-hidden'>
        <div className='absolute inset-0'>
          <div className='absolute inset-0 bg-gradient-to-r from-[#c40e12]/10 via-[#a0522d]/10 to-[#8b4513]/10' />
          <div className='absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(124,42,28,0.1),transparent_50%)]' />
        </div>

        <div className='container px-4 mx-auto relative z-10'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className='text-center max-w-4xl mx-auto'
          >
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className='text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-[#7c2a1c] via-[#c40e12] to-[#c40e12] bg-clip-text text-transparent'
            >
              {t('pages.contact.title')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className='text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto'
            >
              {t('pages.contact.subtitle')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className='py-16 bg-gray-50 dark:bg-gray-900'>
        <div className='container px-4 mx-auto'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className='text-center mb-12'
          >
            <h2 className='text-3xl font-bold text-primary dark:text-[#a0522d] mb-4'>
              {t('pages.contact.officesTitle')}
            </h2>
            <p className='text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
              {t('pages.contact.officesSubtitle')}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'
          >

            {[
              {
                country: 'CANADÁ',
                company: 'Gate Intermediano Inc.',
                address: '4388 Rue Saint-Denis Suite 200 #763 Montreal, QC H2J 2L1',
              },
              {
                country: 'CHILE',
                company: 'Intermediano Chile SPA',
                address: 'Calle El Gobernador 20, Oficina 202, Providencia, Santiago, Chile',
              },
              {
                country: 'COLOMBIA',
                company: 'Intermediano Colombia S.A.S',
                address: 'Calle Carrera 9 #115-30, Edificio Tierra Firme Oficina 1745 Bogotá, Bogotá DC, Colombia',
              },
              {
                country: 'BRASIL',
                company: 'Intermediano do Brasil LTDA.',
                address: 'Avenida das Américas 02901, sala 516, Barra da Tijuca, Rio de Janeiro/RJ – Brasil, CEP: 22.631-002',
              },
              {
                country: 'ECUADOR',
                company: 'Intermecu S.A.S.',
                address: 'Av Francisco Orellana E12-148 y Av 12 de Octubre, Oficina 206, Mariscal Sucre, Quito, Pichincha, Ecuador',
              },
              {
                country: 'HONG KONG',
                company: 'Intermediano Hong Kong LTD',
                address: 'Flat A11/F, Cheung Lung Ind Bldg 10, Cheung Yee St., Cheung Sha Wan, Hong Kong',
              },
              {
                country: 'MÉXICO',
                company: 'Intermediano SA de CV',
                address: 'Calzada Gral. Mariano Escobedo 476-piso 12, Chapultepec Morales, Verónica Anzúres, Miguel Hidalgo, 11590 CDMX, México',
              },
              {
                country: 'PERÚ',
                company: 'Intermediano Perú SAC',
                address: 'Avenida Paseo de Republica 3195 Oficina 401, San Isidro, Perú',
              },
              {
                country: 'URUGUAY',
                company: 'Intermediano S.A.S.',
                address: 'Faustino Carambula 1203, Rivera, Uruguay',
              },
              {
                country: 'COSTA RICA',
                company: 'Intermediano S.R.L.',
                address: 'Escazú Corporate Center, 6th Floor, Escazú San José, Costa Rica',
              },
            ].map((office, idx) => (
              <Card key={office.country} className='shadow-lg border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl'>
                <CardContent className='p-6'>
                  <div className='flex flex-col h-full'>
                    <div className='flex items-center gap-3 mb-2'>
                      <MapPin className='w-6 h-6 text-primary dark:text-[#a0522d]' />
                      <span className='text-lg font-bold text-gray-800 dark:text-gray-200'>{office.country}</span>
                    </div>
                    <div className='mb-1 text-base font-semibold text-gray-700 dark:text-gray-300'>{office.company}</div>
                    <div className='text-gray-600 dark:text-gray-400 text-sm'>{office.address}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
