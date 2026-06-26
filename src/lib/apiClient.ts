export const uploadMedia = async (file: File, folder: string = 'Other Media') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const res = await fetch('/api/media/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData: any = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to upload media');
  }
  return res.json();
};

export const getMediaList = async (page = 1, perPage = 24, folder = 'all', mimeType = '', search = '') => {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
  });
  if (folder !== 'all') params.append('folder', folder);
  if (mimeType) params.append('mime_type', mimeType);
  if (search) params.append('search', search);

  const res = await fetch(`/api/media?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch media');
  return res.json();
};

export const updateMedia = async (id: number, data: { alt_text?: string; caption?: string }) => {
  const res = await fetch(`/api/media/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update media');
  return res.json();
};

export const deleteMedia = async (id: number) => {
  const res = await fetch(`/api/media/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete media');
  return res.json();
};

export const getSiteSettings = async () => {
  const res = await fetch('/api/settings');
  if (!res.ok) throw new Error('Failed to fetch settings');
  return res.json();
};

export const updateSiteSettings = async (settings: Record<string, string>) => {
  const res = await fetch('/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error('Failed to update settings');
  return res.json();
};

export const getAccountProfile = async () => {
  const res = await fetch('/api/profile');
  if (!res.ok) throw new Error('Failed to fetch account profile');
  return res.json();
};

export const updateAccountProfile = async (data: { name?: string, email?: string, password?: string, image?: string }) => {
  const res = await fetch('/api/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update account profile');
  return res.json();
};
