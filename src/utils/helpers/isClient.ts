export const isClient = !!(typeof window !== 'undefined' && window?.document?.createElement)
