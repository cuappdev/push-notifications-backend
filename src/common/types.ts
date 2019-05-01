export type SerializedApp = SerializedBase & {
  name: string
};

export type SerializedBase = {
  id: string,
  createdAt: Date,
  updatedAt: Date,
};

export type SerializedUser = SerializedBase & {
  deviceToken: string,
  isNotificationsEnabled: boolean,
  uuid: string,
}