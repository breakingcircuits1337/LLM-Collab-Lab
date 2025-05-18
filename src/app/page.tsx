"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

import { initialIdeaInitiation, type InitialIdeaInitiationInput, type InitialIdeaInitiationOutput } from '@/ai/flows/initial-idea-initiation';
import { orchestrateLLMs, type LLMOrchestrationInput, type LLMOrchestrationOutput } from '@/ai/flows/llm-orchestration';
import { synthesizeIdeas, type SynthesizeIdeasInput, type SynthesizeIdeasOutput } from '@/ai/flows/output-synthesis';

export default function LLMCollabLabPage() {
  const [initialIdea, setInitialIdea] = useState<string>("");
  const [chainLength, setChainLength] = useState<number>(3);
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!initialIdea.trim()) {
      setError("Please enter an initial idea.");
      toast({
        title: "Input Required",
        description: "Please enter an initial idea to start collaboration.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedOutput(null);

    try {
      const initiationInput: InitialIdeaInitiationInput = { initialIdea };
      const initiationOutput: InitialIdeaInitiationOutput = await initialIdeaInitiation(initiationInput);
      const refinedIdeaFromResult1 = initiationOutput.refinedIdea;

      const orchestrationInput: LLMOrchestrationInput = { initialIdea: refinedIdeaFromResult1, chainLength };
      const orchestrationOutput: LLMOrchestrationOutput = await orchestrateLLMs(orchestrationInput);
      const finalChainedIdeaFromResult2 = orchestrationOutput.finalIdea;
      
      const synthesisInput: SynthesizeIdeasInput = { ideas: [refinedIdeaFromResult1, finalChainedIdeaFromResult2] };
      const synthesisOutput: SynthesizeIdeasOutput = await synthesizeIdeas(synthesisInput);
      
      setGeneratedOutput(synthesisOutput.suggestion);
      toast({
        title: "Idea Generated!",
        description: "The LLMs have collaborated to create a new idea.",
      });

    } catch (e) {
      console.error("Error during LLM collaboration:", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to generate idea: ${errorMessage}`);
      toast({
        title: "Error",
        description: `Failed to generate idea: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-background p-4 sm:p-8 selection:bg-accent selection:text-accent-foreground">
      <header className="mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground flex items-center justify-center">
          <Sparkles className="w-10 h-10 mr-3 text-primary" />
          LLM Collab Lab
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Generate innovative ideas through collaborative LLM chains.
        </p>
      </header>

      <Card className="w-full max-w-2xl shadow-xl rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Start a New Collaboration</CardTitle>
          <CardDescription>Enter your initial concept and set the collaboration depth.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="initial-idea" className="text-md font-medium">Your Initial Idea</Label>
            <Textarea
              id="initial-idea"
              placeholder="e.g., A sustainable solution for urban food deserts..."
              value={initialIdea}
              onChange={(e) => setInitialIdea(e.target.value)}
              rows={4}
              disabled={isLoading}
              aria-label="Initial idea input"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="chain-length" className="text-md font-medium">
              Collaboration Depth (Chain Length): <span className="font-bold text-primary">{chainLength}</span>
            </Label>
            <Slider
              id="chain-length"
              min={1}
              max={10}
              step={1}
              value={[chainLength]}
              onValueChange={(value) => setChainLength(value[0])}
              disabled={isLoading}
              aria-label={`Collaboration depth slider, current value ${chainLength}`}
            />
            <p className="text-sm text-muted-foreground">
              Number of LLM iterations building upon each other's ideas.
            </p>
          </div>

          <Button onClick={handleSubmit} disabled={isLoading} className="w-full text-lg py-3 h-auto">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Idea"
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="w-full max-w-2xl mt-6 rounded-lg">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Collaboration Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {generatedOutput && !isLoading && (
        <Card className="w-full max-w-2xl mt-8 shadow-xl rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Synthesized Idea</CardTitle>
            <CardDescription>The final outcome of the LLM collaboration.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-foreground whitespace-pre-wrap leading-relaxed">{generatedOutput}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
