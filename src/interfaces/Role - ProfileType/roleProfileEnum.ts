export enum Role {
  Reader = 'reader',
  Subscriber = 'subscriber',
  Reporter = 'reporter',
  Editor = 'editor',
  Admin = 'admin'
}

export enum ProfileType {
  ReaderProfile = 'ReaderProfile',
  ReporterProfile = 'ReporterProfile',
  EditorProfile = 'EditorProfile',
  AdminProfile = 'AdminProfile'
}
export const validProfiles: Record<Role, ProfileType> = {
  [Role.Reader]: ProfileType.ReaderProfile,
  [Role.Subscriber]: ProfileType.ReaderProfile,
  [Role.Reporter]: ProfileType.ReporterProfile,
  [Role.Editor]: ProfileType.EditorProfile,
  [Role.Admin]: ProfileType.AdminProfile
};
