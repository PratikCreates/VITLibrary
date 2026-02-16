import { useMutation } from '@tanstack/react-query';
import api from '../client';

export const useUploadKyc = () => {
    return useMutation({
        mutationFn: async ({ file, doc_type }: { file: File, doc_type: string }) => {
            const formData = new FormData();
            formData.append('document', file);
            formData.append('doc_type', doc_type);

            return await api.post('/kyc/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        },
    });
};
