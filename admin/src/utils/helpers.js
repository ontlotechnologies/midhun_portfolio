export const getPreviewUrl = (value) => {
  if (!value) return '';
  if (value instanceof File) {
    return URL.createObjectURL(value);
  }
  return value;
};

export const getYoutubeId = (url) => {
  if (!url) return '';
  const regExp = /^(?:.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=))([^#&?]{11}).*/;
  const match = url.match(regExp);
  return (match && match[1] && match[1].length === 11) ? match[1] : '';
};

export const getTabWorkType = (tab) => {
  switch (tab) {
    case 'short-films': return 'short_film';
    case 'web-series': return 'web_series';
    case 'tv-programs': return 'tv_program';
    case 'feature-films': return 'movie';
    case 'independent-works': return 'independent_work';
    default: return 'short_film';
  }
};
