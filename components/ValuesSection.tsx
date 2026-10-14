'use client'

export function ValuesSection() {
  const values = [
    {
      title: 'Efficiency',
      description: "We look for the simplest and most cost-effective solution that meets our customer's needs.",
      icon: '⚡'
    },
    {
      title: 'Confidence',
      description: 'Our solutions are fully compliant with the local legislation, in order to generate confidence with our clients.',
      icon: '🔒'
    },
    {
      title: 'Speed',
      description: 'We are fast on assisting our customers, whether in preparing a quote, in the hiring process as well as in meeting customer requirements during the management of their payroll.',
      icon: '🚀'
    },
    {
      title: 'Proactivity',
      description: 'We take the initiative to suggest the best alternative according to customer preferences.',
      icon: '🌟'
    },
    {
      title: 'People',
      description: 'We are a global company and our culture is enriched by the diversity of our people.',
      icon: '🌍'
    },
  ]

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Our Values</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            The foundation of our company culture
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">{value.icon}</div>
              <h3 className="text-xl font-bold mb-2">{value.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}