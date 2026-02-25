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
    description: 'List people, institutions, or principles with whom you are angry. Define the cause, how it affects your security/ambitions/relations, and find your own part (Selfish, Dishonest, Self-Seeking, Frightened).',
    cols: [
      { 
        key: 'col1', 
        header: "1. At whom/what?", 
        placeholder: "Person, Institution, or Principle (e.g., Dad, Church, My Boss)", 
        width: 'min-w-[180px]' 
      },
      { 
        key: 'col2', 
        header: '2. The Cause', 
        placeholder: "Specific incident or behavior that caused the resentment.", 
        width: 'min-w-[250px]' 
      },
      { 
        key: 'col3', 
        header: '3. Affects My...', 
        placeholder: "Check: Self-esteem, Pride, Emotional Security, Financial Security, Ambitions, Personal Relations, Sex Relations.", 
        width: 'min-w-[220px]' 
      },
      { 
        key: 'col4', 
        header: '4. Where was I at fault?', 
        placeholder: "Was I: Selfish? Dishonest? Self-Seeking? Frightened? Inconsiderate?", 
        width: 'min-w-[250px]' 
      },
      { 
        key: 'col5', 
        header: '5. The Turnaround', 
        placeholder: "The truth of the situation. My corrective action or prayer for them.", 
        width: 'min-w-[220px]' 
      }
    ]
  },
  fears: {
    title: 'Fear Inventory',
    description: 'Review your fears. Why do you have them? Did self-reliance fail you? Ask God to remove the fear and direct your attention to what He would have you be.',
    cols: [
      { 
        key: 'col1', 
        header: '1. What is the fear?', 
        placeholder: "Specific fear (e.g., fear of poverty, fear of people's opinions)", 
        width: 'min-w-[200px]' 
      },
      { 
        key: 'col2', 
        header: '2. Why do I have it?', 
        placeholder: "Underlying cause. Does it touch on my self-esteem or security?", 
        width: 'min-w-[250px]' 
      },
      { 
        key: 'col3', 
        header: '3. Self-reliance failed?', 
        placeholder: "How has trying to control this on my own made it worse?", 
        width: 'min-w-[200px]' 
      },
      { 
        key: 'col4', 
        header: '4. The Spiritual Remedy', 
        placeholder: "What would God have me be? Next right action.", 
        width: 'min-w-[250px]' 
      }
    ]
  },
  harms: {
    title: 'Sex Conduct & Harm to Others',
    description: 'Review your conduct. Where were you selfish, dishonest, or inconsiderate? Who was hurt? Did you arouse jealousy, suspicion, or bitterness? What should you have done instead?',
    cols: [
      { 
        key: 'col1', 
        header: '1. Who did I harm?', 
        placeholder: "Name of the person or group.", 
        width: 'min-w-[180px]' 
      },
      { 
        key: 'col2', 
        header: '2. What did I do?', 
        placeholder: "Specific conduct or harm caused.", 
        width: 'min-w-[250px]' 
      },
      { 
        key: 'col3', 
        header: '3. Where was I at fault?', 
        placeholder: "Selfish? Dishonest? Inconsiderate? Seeking power/control?", 
        width: 'min-w-[220px]' 
      },
      { 
        key: 'col4', 
        header: '4. Resulting Harm', 
        placeholder: "Did I arouse jealousy, bitterness, or suspicion? Who else was affected?", 
        width: 'min-w-[220px]' 
      },
      { 
        key: 'col5', 
        header: '5. The Amends / Right Action', 
        placeholder: "What should I have done? What is the ideal conduct?", 
        width: 'min-w-[250px]' 
      }
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