'use server';
/**
 * @fileOverview A remix concept generation AI agent.
 *
 * - generateRemix - A function that handles the remix concept generation process.
 * - GenerateRemixInput - The input type for the generateRemix function.
 * - GenerateRemixOutput - The return type for the generateRemix function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {getProperty, Property} from '@/services/property-data';

const GenerateRemixInputSchema = z.object({
  propertyIds: z.array(z.string()).describe('The IDs of the properties to remix.'),
  rebootType: z.enum(['TV Show', 'Movie', 'Video Game', 'Toys']).describe('The type of reboot to generate.'),
});
export type GenerateRemixInput = z.infer<typeof GenerateRemixInputSchema>;

const GenerateRemixOutputSchema = z.object({
  remixTitle: z.string().describe('The title of the remix.'),
  remixPremise: z.string().describe('A robust premise for the remix (1-2 paragraphs).'),
  conceptBreakdowns: z.array(
    z.object({
      propertyId: z.string().describe('The ID of the property.'),
      conceptBreakdown: z.string().describe('A brief overview of the original concept.'),
    })
  ).describe('A list of concept breakdowns for each selected property.'),
  conceptImageUrl: z.string().optional().describe('URL of the generated concept image, if available.'),
});
export type GenerateRemixOutput = z.infer<typeof GenerateRemixOutputSchema>;

export async function generateRemix(input: GenerateRemixInput): Promise<GenerateRemixOutput> {
  return generateRemixFlow(input);
}

const generateRemixPrompt = ai.definePrompt({
  name: 'generateRemixPrompt',
  input: {
    schema: z.object({
      propertyData: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
        })
      ).describe('Data for the properties to remix.'),
 rebootType: z.enum(['TV Show', 'Movie', 'Video Game', 'Toys']).describe('The type of reboot to generate (TV Show, Movie, Video Game, Toys).'),
    }),
  },
  output: {
    schema: z.object({
      remixTitle: z.string().describe('The title of the remix.'),
      remixPremise: z.string().describe('A robust premise for the remix (1-2 paragraphs).'),
      conceptBreakdowns: z.array(
        z.object({
          propertyId: z.string().describe('The ID of the property.'),
          conceptBreakdown: z.string().describe('A brief overview of the original concept.'),
        })
      ).describe('A list of concept breakdowns for each selected property.'),
    }),
  },
  prompt: `You are a creative concept generator for the entertainment industry.

You will be given a list of properties and a reboot type. Your job is to generate a creative remix premise that combines these properties into a cohesive new concept.

Generate a remix title, a robust remix premise (1-2 paragraphs), and an original concept breakdown for each selected property. The concept breakdown should be a brief overview of the original concept.

Properties:
{{#each propertyData}}
  - Name: {{this.name}}, ID: {{this.id}}
{{/each}}

Reboot Type: {{rebootType}}

Output:
Remix Title:
Remix Premise:
Concept Breakdowns:
{{#each propertyData}}
  - Property ID: {{this.id}}
    Concept Breakdown:
{{/each}}`,
});

const generateRemixFlow = ai.defineFlow<
  typeof GenerateRemixInputSchema,
  typeof GenerateRemixOutputSchema
>(
  {
    name: 'generateRemixFlow',
    inputSchema: GenerateRemixInputSchema,
    outputSchema: GenerateRemixOutputSchema,
  },
  async input => {
    const propertyData: Property[] = [];
    for (const propertyId of input.propertyIds) {
      const property = await getProperty(propertyId);
      if (property) {
        propertyData.push(property);
      }
    }

    const {output} = await generateRemixPrompt({
      propertyData: propertyData.map(property => ({
        id: property.id,
        name: property.name,
      })),
      rebootType: input.rebootType,
    });

    return {
      remixTitle: output!.remixTitle,
      remixPremise: output!.remixPremise,
      conceptBreakdowns: output!.conceptBreakdowns,
      conceptImageUrl: undefined,
    };
  }
);
