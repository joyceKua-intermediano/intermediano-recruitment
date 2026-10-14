'use client'

export function StatsSection() {
  const stats = [
    { value: '48 Hours', label: 'Average time to interviews' },
    { value: '98%', label: 'Technical and cultural alignment' },
    { value: '90%', label: 'Retention rate' },
    { value: '1k', label: 'Active talent pool' },
  ]

  return (
    <section className="py-20 bg-white dark:bg-black">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-red-600 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-lg text-gray-600 dark:text-gray-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}