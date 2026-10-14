import { Card } from '@/components/ui/card'
import { AiAvatar } from './AiAvatar'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface AiAvatarSectionProps {
  isSpeaking: boolean
  isTTSLoading: boolean
  isMuted: boolean
  onMuteToggle: () => void
}

export const AiAvatarSection = ({
  isSpeaking,
  isTTSLoading,
  isMuted,
  onMuteToggle,
}: AiAvatarSectionProps) => {
  const { t } = useTranslation()
  return (
    <Card className='p-4'>
      <div className='aspect-video rounded-lg overflow-hidden shadow-lg'>
        <AiAvatar 
          isSpeaking={isSpeaking}
          isMuted={isMuted}
          onMuteToggle={onMuteToggle}
        />
      </div>
      {isTTSLoading && (
        <div className='mt-3 flex items-center gap-2 text-sm text-gray-600'>
          <Loader2 className='w-4 h-4 animate-spin' />
          <span>{t('pages.interviewDetail.loadingIntiVoice')}</span>
        </div>
      )}
    </Card>
  )
}

