export interface RhetoricalVerb {
  category: 'EMPHASIZE' | 'CONTRAST' | 'ARGUE';
  verb: string;
}

export interface SpacecatData {
  speaker?: string;
  purpose?: string;
  audience?: string;
  context?: string;
  exigence?: string;
  choices?: string;
  appeals?: string;
  tone?: string;
}

export interface Annotation {
  id: string;
  textId: string;
  anchorStart: number;
  anchorEnd: number;
  selectedText: string;
  content: string;
  verb?: RhetoricalVerb;
  templateData?: SpacecatData;
  createdAt: string; // ISO Date
}

export interface RhetoricalTag {
  id: string;
  name: string;
  description?: string;
}

export interface RhetoricalContextType {
  speaker: string;
  audience: string;
  exigence: string;
  know?: string;
  wantToLearn?: string;
}
