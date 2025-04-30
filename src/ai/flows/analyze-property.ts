// This is an auto-generated file from Firebase Studio.

'use server';

/**
 * @fileOverview Generates a structured text analysis for a selected property and reboot type.
 *
 * - analyzeProperty - A function that handles the property analysis generation.
 * - AnalyzePropertyInput - The input type for the analyzeProperty function.
 * - AnalyzePropertyOutput - The return type for the analyzeProperty function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {getProperty, Property} from '@/services/property-data';

const AnalyzePropertyInputSchema = z.object({
  propertyId: z.string().describe('The ID of the property to analyze.'),
  rebootType: z.enum(['TV Show', 'Movie', 'Video Game', 'Toys']).describe('The type of reboot to consider.'),
});
export type AnalyzePropertyInput = z.infer<typeof AnalyzePropertyInputSchema>;

const AnalyzePropertyOutputSchema = z.object({
  analysis: z.string().describe('The AI-generated analysis of the property, formatted in Markdown.'),
});
export type AnalyzePropertyOutput = z.infer<typeof AnalyzePropertyOutputSchema>;

export async function analyzeProperty(input: AnalyzePropertyInput): Promise<AnalyzePropertyOutput> {
  return analyzePropertyFlow(input);
}

const analyzePropertyPrompt = ai.definePrompt({
  name: 'analyzePropertyPrompt',
  input: {
    schema: z.object({
      propertyName: z.string().describe('The name of the property to analyze.'),
 rebootType: z.enum(['TV Show', 'Movie', 'Video Game', 'Toys']).describe('The type of reboot to consider.'),
    }),
  },
  output: {
    schema: z.object({
      analysis: z.string().describe('The AI-generated analysis of the property, formatted in Markdown.'),
    }),
  },
  prompt: `You are an experienced entertainment industry analyst.

  Analyze the potential of the property {{propertyName}} as a {{rebootType}} reboot.

  Your analysis should cover the following aspects:

  *   Potential Appeal: Who is the target audience? What are the nostalgic elements that would resonate with them?
  *   Format Compatibility: How well does the property translate to the {{rebootType}} format? What adaptations would be necessary?
  *   Opportunities: What are the unique selling points of this reboot? What are the potential marketing angles?
  *   Challenges: What are the potential pitfalls and obstacles to a successful reboot? What are the risks involved?

  Format your analysis using Markdown, including headings, lists, and paragraphs to enhance readability.
  Be sure to include illustrative numbers and figures.
  `,
});

const analyzePropertyFlow = ai.defineFlow<
  typeof AnalyzePropertyInputSchema,
  typeof AnalyzePropertyOutputSchema
>({
  name: 'analyzePropertyFlow',
  inputSchema: AnalyzePropertyInputSchema,
  outputSchema: AnalyzePropertyOutputSchema,
},
async input => {
  const property: Property = await getProperty(input.propertyId);
  const {output} = await analyzePropertyPrompt({
    propertyName: property.name,
    rebootType: input.rebootType,
  });
  return output!;
});
