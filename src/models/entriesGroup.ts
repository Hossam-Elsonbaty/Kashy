interface Entry {
  entryName: string;
  entryTotal: number;
  entryDate: string;
  entryType:string;
  entryMethod:string;
}

export interface EntryGroup {
  date: string;
  entries: Entry[];
}
