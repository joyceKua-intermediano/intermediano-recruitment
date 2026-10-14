'use client'

import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

export function PartnerSection() {
  const benefits = [
    'Access to top global talent pool',
    'Dedicated recruitment specialist',
    'AI-powered candidate matching',
    '90-day replacement guarantee',
    'Competitive pricing plans',
    'Diversity hiring solutions',
  ]

  return (
    <section className='w-full py-20 bg-white dark:bg-black'>
      <div className='container px-4 mx-auto'>

        <div className='text-center mb-16'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent mb-6'
          >
            Partner With Us
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className='text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto'
          >
            Join hundreds of companies who trust Intermediano for their hiring
            needs
          </motion.p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20'>
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className='bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow'
            >
              <div className='flex items-start gap-4'>
                <CheckCircle2 className='w-6 h-6 text-primary flex-shrink-0 mt-1' />
                <h3 className='text-lg font-medium'>{benefit}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        <div className='mb-20'>
          <h3 className='text-2xl font-bold text-center mb-12'>
            How Our Partnership Works
          </h3>
          <div className='grid md:grid-cols-3 gap-8'>
            {[
              {
                title: '1. Tell Us Your Needs',
                description:
                  'Schedule a call with our team to discuss your hiring requirements.',
                icon: '📞',
              },
              {
                title: '2. Get Matched',
                description:
                  'Our AI matches you with pre-vetted candidates in 48 hours.',
                icon: '⚡',
              },
              {
                title: '3. Hire & Scale',
                description: 'Interview and onboard your perfect candidates.',
                icon: '🚀',
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className='text-center p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition-shadow'
              >
                <div className='text-4xl mb-4'>{step.icon}</div>
                <h4 className='text-xl font-bold mb-2'>{step.title}</h4>
                <p className='text-gray-600 dark:text-gray-300'>
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className='bg-gradient-to-r from-primary to-red-600 rounded-2xl p-8 md:p-12 text-center'>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className='text-2xl md:text-3xl font-bold text-white mb-4'
          >
            Ready to Transform Your Hiring?
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className='text-white/90 mb-8 max-w-2xl mx-auto'
          >
            Join our partner network and get access to the best global talent.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className='flex flex-col sm:flex-row gap-4 justify-center'
          >
            <a
              href='mailto:gbd@intermediano.com?subject=Partnership Inquiry&body=Hi, I’m interested in partnering with you.'
              className='px-8 py-3 bg-white text-primary font-medium rounded-lg hover:bg-gray-100 transition-colors'
            >
              Email Us
            </a>
            <a
              href='/brochure.pdf'
              target='_blank'
              rel='noopener noreferrer'
              className='px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors'
            >
              Download Brochure
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
