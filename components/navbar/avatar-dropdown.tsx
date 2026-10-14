'use client'

import { useState } from 'react'
import { LogOut, User as LucideUser, KeyRound } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { User } from '@auth0/nextjs-auth0/types'

type AvatarDropdownProps = {
  user: User | undefined
}

const AvatarDropdown: React.FC<AvatarDropdownProps> = ({ user }) => {
  const { t } = useTranslation()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSendResetEmail = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
      })
      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || t('common.passwordResetEmailFailed'))
        return
      }

      toast.success(t('common.passwordResetEmailSent'))
      setDialogOpen(false)
    } catch {
      toast.error(t('common.somethingWentWrong'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar>
            <AvatarImage
              src={user?.picture || ''}
              alt='User Avatar'
              width={50}
              height={50}
              className='cursor-pointer'
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56'>
          <DropdownMenuLabel>{t('common.myAccount')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <LucideUser />
              <span>
                {' '}
                <a href='/dashboard'>{t('navigation.dashboard')}</a>
              </span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className='cursor-pointer'
              onSelect={(e) => {
                e.preventDefault()
                setDialogOpen(true)
              }}
            >
              <KeyRound />
              <span>{t('common.changePassword')}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className='cursor-pointer'>
            <LogOut />
            <span>
              {' '}
              <a href='/auth/logout'>{t('navigation.logout')}</a>
            </span>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('common.changePassword')}</DialogTitle>
            <DialogDescription>
              {t('common.changePasswordDialogDescription')}
              {user?.email && (
                <>
                  {' '}
                  <span className='font-medium text-foreground'>
                    {t('common.changePasswordEmailNote', { email: user.email })}
                  </span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setDialogOpen(false)}
              disabled={isLoading}
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleSendResetEmail}
              loading={isLoading}
              loadingText={t('common.loading')}
            >
              {t('common.sendResetEmail')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AvatarDropdown
