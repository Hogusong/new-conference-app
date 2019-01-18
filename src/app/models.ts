export interface USER {
  id?: string;
  avatar?: string;
  username: string;
  password: string;
  email: string;
  favorites: { id: string, name: string }[];       // session's id and name.
  trackFilter: { name: string, isChecked: boolean }[];
  seenTutorial?: boolean;
}

export interface TRACK {
  id?: string;
  name: string;
}
