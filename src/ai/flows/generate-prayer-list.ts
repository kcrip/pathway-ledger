'use server';
/**
 * @fileOverview A Genkit flow that generates a personalized spiritual prayer list based on 5th step completion.
 *
 * - generatePrayerList - A function that handles the generation of prayers.
 * - GeneratePrayerListInput - The input type for the generatePrayerList function.
 * - GeneratePrayerListOutput - The return type for the generatePrayerList function.
 *
 * SECURITY NOTE:
 * This is a public server action for a local-first application without user authentication.
 * It is protected by:
 * 1. Strict Input Validation (Zod Schema) to prevent large payload injections.
 * 2. Rate Limiting (IP-based) to mitigate abuse and resource exhaustion.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {headers} from 'next/headers';
import {rateLimit} from '@/lib/rate-limiter';

const InventoryRowSchema = z.object({
  id: z.number(),
  col1: z.string().max(1000).optional(),
  col2: z.string().max(1000).optional(),
  col3: z.string().max(1000).optional(),
  col4: z.string().max(1000).optional(),
  col5: z.string().max(1000).optional(),
  fifthStepNotes: z.string().max(2000).optional(),
});

const InventoryDataSchema = z.object({
  resentments: z.array(InventoryRowSchema).max(100),
  fears: z.array(InventoryRowSchema).max(100),
  harms: z.array(InventoryRowSchema).max(100),
});

const GeneratePrayerListInputSchema = z.object({
  inventory: InventoryDataSchema.describe('The full inventory data object containing resentments, fears, and harms.'),
});
export type GeneratePrayerListInput = z.infer<typeof GeneratePrayerListInputSchema>;

const GeneratePrayerListOutputSchema = z.object({
  prayerList: z.string().describe('A collection of prayers and spiritual redirections in markdown format.'),
});
export type GeneratePrayerListOutput = z.infer<typeof GeneratePrayerListOutputSchema>;

export async function generatePrayerList(input: GeneratePrayerListInput): Promise<GeneratePrayerListOutput> {
  const headersList = await headers();
  const forwardedFor = headersList.get('x-forwarded-for');

  // Extract the first IP if multiple are present (common with proxies)
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';

  rateLimit(ip);
  return generatePrayerListFlow(input);
}

const prompt = ai.definePrompt({
  name: 'prayerListPrompt',
  input: {schema: GeneratePrayerListInputSchema},
  output: {schema: GeneratePrayerListOutputSchema},
  prompt: `You are a supportive spiritual companion helping someone conclude their 4th and 5th step process. 

They have just shared their "exact nature of their wrongs." Now, they need a list of prayers, meditations, and redirections to help them "direct prayers and give things up to God" as they move into Steps 6 and 7.

Based on the provided inventory data:
1. Identify key people/institutions they need to pray for (based on Resentments and "The Turnaround").
2. Identify fears they need to ask for removal of (based on Fears and "The Spiritual Remedy").
3. Identify areas where they need strength to make amends (based on Harms).

Generate a "Spiritual Prayer & Meditation List". 

CRITICAL SPIRITUAL GUIDELINE:
Structure the prayers around universal principles of spiritual alignment:
- Recognizing an Eternal Source or Higher Power.
- Seeking to align personal will with a Divine/Higher Will ("Thy will be done").
- Asking for daily strength, guidance, and "bread" for the current 24-hour period.
- Focusing on the release of resentment through forgiveness of others as a prerequisite for personal spiritual progress ("Forgive as we forgive").
- Asking for protection from the pitfalls of ego, pride, and old character defects ("Deliverance from temptation").

DO NOT explicitly name any specific religious figures (e.g., Jesus, Buddha, etc.). Use language that is inclusive of any "God of one's understanding." Use a compassionate, non-judgmental, and traditional recovery tone.

Format the output beautifully in Markdown with sections like:
- "Prayers for Resentment & Release"
- "Daily Petitions for Strength"
- "Meditations on Character & Change"

Inventory Data:
{{{inventory}}}`,
});

const generatePrayerListFlow = ai.defineFlow(
  {
    name: 'generatePrayerListFlow',
    inputSchema: GeneratePrayerListInputSchema,
    outputSchema: GeneratePrayerListOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
