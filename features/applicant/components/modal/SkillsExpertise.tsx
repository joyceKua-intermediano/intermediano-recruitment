import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ShowcaseSkillsForm from '../form/SkillsExpertise';
import { useGetSkillsExpertise } from '../../hooks/useGetSkillsExpertise';

interface SkillsExpertiseModalProps {
  title: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmitSuccess?: () => void;
  onNext?: () => void;
  jobId?: string;
}

const SkillsExpertiseModal: React.FC<SkillsExpertiseModalProps> = ({
  title,
  onSubmitSuccess,
  onNext,
  jobId,
}) => {
  const { refetch } = useGetSkillsExpertise();
  useEffect(() => { refetch(); }, [refetch]);
  const handleSubmitSuccess = () => { if (onSubmitSuccess) onSubmitSuccess(); };
  const handleNext = () => { if (onNext) onNext(); };
  return (
    <>
      <div className='mb-4'>
        <p className='text-gray-600 mb-4'>Showcase your skills and experience to enhance your profile.</p>
      </div>
      <ShowcaseSkillsForm onSubmitSuccess={handleSubmitSuccess} onNext={handleNext} jobId={jobId}/>
    </>
  );
};
export default SkillsExpertiseModal;
