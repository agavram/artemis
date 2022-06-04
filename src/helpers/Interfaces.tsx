export interface Notes {
  hidden: boolean;
  isDirectory: boolean;
  sub: {
    [key: string]: Notes;
  };
  content?: string
}
