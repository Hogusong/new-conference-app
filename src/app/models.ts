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

export interface Speaker {
  id?: string;
  name: string;
  profilePic?: string;
  twitter?: string;
  github?: string;
  instagram?: string;
  about?: string;
  location?: string;
  email: string;
  phone?: string;
  sessions?: { id: string, name: string }[];   // session id & name
}

export interface Session {
  id?: string;
  name: string;
  date: string;         // 2018-12-06
  timeStart: string;    // 15:30 for 3:30pm
  timeEnd?: string;
  location?: string;
  description?: string;
  speakerIDs: string[];   // speaker's id
  tracks: string[];     //  name of track
  hide?: boolean;
}
