export const ROLES = {
  VIEWER: 'viewer',
  EDITOR: 'editor',
  ADMIN: 'admin',
  OWNER: 'owner',
} as const

export const ROLE_LEVELS: Record<UserRole, number> = {
  [ROLES.VIEWER]: 1,
  [ROLES.EDITOR]: 2,
  [ROLES.ADMIN]: 3,
  [ROLES.OWNER]: 4,
}

export const ROLE_OPTIONS = [
  { value: ROLES.VIEWER, label: 'Viewer' },
  { value: ROLES.EDITOR, label: 'Editor' },
  { value: ROLES.ADMIN, label: 'Admin' },
]

export type UserRole = typeof ROLES[keyof typeof ROLES]

export const ONBOARDING_EDITOR_ID = 'm73CYbjf2VVgZ8j20fndfj9h4Te2'