export default function AboutPage() {
  return (
    <div className='flex flex-col '>
      <main className='flex-1'>
        <section className='py-10 bg-gradient-to-r from-primary to-red-600'>
          <div className='container px-4 mx-auto text-center'>
            <h2 className='text-3xl md:text-4xl font-bold text-white mb-6'>
              Ready to find your perfect match?
            </h2>
            <p className='text-xl text-white/90 mb-8 max-w-3xl mx-auto'>
              Whether youre looking for talent or looking to be found,
              we&apos;re here to help.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <a
                href='/auth/login?screen_hint=signup'
                className='px-8 py-3 bg-white text-primary font-medium rounded-lg hover:bg-gray-100 transition-colors'
              >
                Join as Candidate
              </a>
              <a
                href='/partner'
                className='px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors'
              >
                Hire Talent
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
