import AboutPage from '@/components/About'
import { WorldMapHeroSection } from '@/components/WorldMapHeroSection'

export default async function Home() {
  return (
    <div className='flex flex-col min-h-screen'>
      <main className='flex-1 flex flex-col'>
        <div className='flex-1'>
          <WorldMapHeroSection />
        </div>

        <div className='w-full'>
          <AboutPage />
        </div>
      </main>
    </div>
  )
}
