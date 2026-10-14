import { UploadResume } from '../schemas/uploadResume'

export const saveApplicantResume = async (data: UploadResume) => {
  try {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('applicantId', data.ownerId);
    formData.append('fileName', data.file.name);
    formData.append('fileSize', data.file.size.toString());

    const response = await fetch('/api/applicant/upload-resume', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message ||
          `Failed to save applicant data: ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'An unknown error occurred'
    );
  }
}
