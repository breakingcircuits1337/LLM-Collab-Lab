'use server';

/**
 * @fileOverview This file defines a Genkit flow for synthesizing a set of varied ideas
 * into a final, coherent suggestion.
 *
 * - synthesizeIdeas - A function that synthesizes a list of ideas into a coherent suggestion.
 * - SynthesizeIdeasInput - The input type for the synthesizeIdeas function.
 * - SynthesizeIdeasOutput - The return type for the synthesizeIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SynthesizeIdeasInputSchema = z.object({
  ideas: z.array(z.string()).describe('A list of ideas to synthesize.'),
});
export type SynthesizeIdeasInput = z.infer<typeof SynthesizeIdeasInputSchema>;

const SynthesizeIdeasOutputSchema = z.object({
  suggestion: z.string().describe('A coherent suggestion that incorporates the best aspects of the input ideas.'),
});
export type SynthesizeIdeasOutput = z.infer<typeof SynthesizeIdeasOutputSchema>;

export async function synthesizeIdeas(input: SynthesizeIdeasInput): Promise<SynthesizeIdeasOutput> {
  return synthesizeIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'synthesizeIdeasPrompt',
  input: {schema: SynthesizeIdeasInputSchema},
  output: {schema: SynthesizeIdeasOutputSchema},
  prompt: `You are an AI expert in synthesizing ideas. You will be provided with a list of ideas. Your task is to synthesize these ideas into a single, coherent suggestion that incorporates the best aspects of each idea.

Here are the ideas:
{{#each ideas}}- {{{this}}}
{{/each}}

Suggestion:`, // Note: handlebars automatically escapes content. Use {{{this}}} to prevent it. https://handlebarsjs.com/guide/#html-escaping
});

const synthesizeIdeasFlow = ai.defineFlow(
  {
    name: 'synthesizeIdeasFlow',
    inputSchema: SynthesizeIdeasInputSchema,
    outputSchema: SynthesizeIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
