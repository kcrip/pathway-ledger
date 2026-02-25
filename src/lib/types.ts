export type InventoryCategory = 'resentments' | 'fears' | 'harms';

export interface InventoryRow {
  id: number;
  col1: string;
  col2: string;
  col3: string;
  col4: string;
  col5?: string;
}

export interface InventoryData {
  resentments: InventoryRow[];
  fears: InventoryRow[];
  harms: InventoryRow[];
}

export interface ColumnConfig {
  key: keyof Omit<InventoryRow, 'id'>;
  header: string;
  placeholder: string;
  width: string;
}

export interface CategoryConfig {
  title: string;
  description: string;
  cols: ColumnConfig[];
}

export const INVENTORY_CONFIG: Record<InventoryCategory, CategoryConfig> = {
  resentments: {
    title: 'Resentment Inventory',
    description: 'List people, institutions, or principles with whom you are angry. Ask yourself why you are angry, what part of your life it affects, and where you were to blame (your part).',
    cols: [
      { key: 'col1', header: "1. I'm Resentful At", placeholder: "Who or what?", width: 'min-w-[200px]' },
      { key: 'col2', header: '2. The Cause', placeholder: "What did they do?", width: 'min-w-[250px]' },
      { key: 'col3', header: '3. Affects My...', placeholder: "Self-esteem, Security, Ambitions, Personal/Sex Relations", width: 'min-w-[200px]' },
      { key: 'col4', header: '4. My Part / Exact Nature', placeholder: "Selfish, Dishonest, Self-Seeking, Frightened", width: 'min-w-[250px]' },
      { key: 'col5', header: '5. Corrective Action / Prayer', placeholder: "What is the turnaround?", width: 'min-w-[200px]' }
    ]
  },
  fears: {
    title: 'Fear Inventory',
    description: 'Review your fears thoroughly. Put them on paper, even if there is no resentment connected to them. Ask why you have the fear and if self-reliance failed you.',
    cols: [
      { key: 'col1', header: '1. Who/What am I afraid of?', placeholder: "Specific fear", width: 'min-w-[200px]' },
      { key: 'col2', header: '2. Why do I have this fear?', placeholder: "Underlying reason / cause", width: 'min-w-[250px]' },
      { key: 'col3', header: '3. Did self-reliance fail me?', placeholder: "Yes/No, and how?", width: 'min-w-[200px]' },
      { key: 'col4', header: '4. What should I do instead?', placeholder: "Trust God, Corrective Action", width: 'min-w-[250px]' }
    ]
  },
  harms: {
    title: 'Sex Conduct & Harm to Others',
    description: 'Review your conduct over the years. Where were you selfish, dishonest, or inconsiderate? Who was hurt? Did you arouse jealousy or bitterness? What should you have done instead?',
    cols: [
      { key: 'col1', header: '1. Who did I harm?', placeholder: "Name or group", width: 'min-w-[200px]' },
      { key: 'col2', header: '2. What did I do?', placeholder: "Exact nature of the harm", width: 'min-w-[250px]' },
      { key: 'col3', header: '3. Where was I at fault?', placeholder: "Selfish, Dishonest, Inconsiderate", width: 'min-w-[200px]' },
      { key: 'col4', header: '4. Aroused jealousy/bitterness?', placeholder: "Yes/No", width: 'min-w-[200px]' },
      { key: 'col5', header: '5. What should I have done instead?', placeholder: "Better action", width: 'min-w-[250px]' }
    ]
  }
};

export const INITIAL_DATA: InventoryData = {
  resentments: [
    { id: 1, col1: 'Mr. Brown (Example)', col2: 'His attention to my wife. Told my wife of my mistress.', col3: 'Sex relations, Self-esteem (fear), Personal relations.', col4: 'I was dishonest, selfish, self-seeking, and inconsiderate.', col5: 'Pray for his well-being. Focus on my own conduct and amends.' },
  ],
  fears: [
    { id: 1, col1: 'Losing my job (Example)', col2: 'Fear of not having enough money (Financial Insecurity).', col3: 'Yes. My own schemes have not provided peace or security.', col4: 'Trust my Higher Power to provide; do the next right thing at work.' },
  ],
  harms: [
    { id: 1, col1: 'My spouse (Example)', col2: 'Lied about my whereabouts. Was emotionally unavailable.', col3: 'Dishonest, Selfish, Inconsiderate.', col4: 'Yes, aroused bitterness and suspicion.', col5: 'Should have been honest, present, and prioritizing the relationship.' },
  ]
};
