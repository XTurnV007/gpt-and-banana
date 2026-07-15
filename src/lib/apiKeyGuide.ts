export const API_KEY_REGISTRATION_URL = 'https://api.cursorai.art/register?aff=xoXg'
export const API_KEY_GUIDE_PAGE = 'api-key-guide'
export const API_KEY_GUIDE_URL = `?page=${API_KEY_GUIDE_PAGE}`

export function isApiKeyGuidePage(search: string) {
  return new URLSearchParams(search).get('page') === API_KEY_GUIDE_PAGE
}
