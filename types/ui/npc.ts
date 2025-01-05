// app/types/npc.ts
export enum NPCType {
  MENTOR = 'MENTOR',
  CHALLENGER = 'CHALLENGER',
  GUIDE = 'GUIDE',
  ALIEN = 'ALIEN',
  ROBOT = 'ROBOT',
  HOLOGRAM = 'HOLOGRAM'
}

export interface NPCDialogue {
  greeting: string;
  hint: string;
  success: string;
  failure: string;
}


export interface NPC {
  type: NPCType;  
  name: string;
  dialogue: NPCDialogue;
  appearance: string;
  defaultPosition: {
    x: number;
    y: number;
  };
}
  
export interface NPCPosition {
  x: number;
  y: number;
}
  