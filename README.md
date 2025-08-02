# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.


Here’s a high-level tour of the repository and what it actually does.

    Purpose / What you can do with it
    • It’s a little web app called “LLM Collab Lab”.
    • You type an idea, pick how many times you want large-language-models (LLMs) to riff on it, and click “Generate Idea”.
    • Behind the scenes three server-side AI “flows” talk to Google’s Gemini model, iterate on the idea, then merge the results into one final “synthesised” suggestion.
    • The finished suggestion is streamed back to the browser and displayed in a card; success/error states are surfaced with toast notifications.

    Main tech stack
    • Next.js 15 (app router, TypeScript)
    • React 18 on the client
    • Tailwind CSS + shadcn/ui (Radix primitives wrapped in Tailwind-friendly components)
    • Genkit 1.8 + @genkit-ai/googleai – thin wrapper around Google Gemini 2.0 Flash
    • zod – input/output validation for each AI flow
    • Misc: lucide-react icons, react-hook-form scaffolding, TanStack Query + Firebase packages ready for future use (not used yet)

    How the AI part works (src/ai/*)
        genkit.ts – sets up Genkit with the Gemini 2.0 Flash model.
        Each flow file (initial-idea-initiation.ts, llm-orchestration.ts, output-synthesis.ts) does three things:
        a. Define zod schemas for its input and output.
        b. Register a prompt template (ai.definePrompt).
        c. Wrap the prompt in a reusable server-side function (ai.defineFlow).
        Flows in plain English • InitialIdeaInitiationFlow – “Refine this raw idea.”
        • LLMOrchestrationFlow – loop N times, each time refining the idea a bit more.
        • SynthesizeIdeasFlow – take the best parts of two ideas and merge into one suggestion.

    How the UI ties in (src/app/page.tsx)
    • Client component with local React state (idea text, chainLength, loading/error flags).
    • On “Generate Idea”:
        Calls initialIdeaInitiation() (server action).
        Feeds that output into orchestrateLLMs().
        Combines both with synthesizeIdeas().
        Shows the final suggestion or an error toast.
        • Fancy UI elements come from @/components/ui/* (shadcn build).

    Configuration / scripts
    • npm run dev – launches Next.js (port 9002).
    • npm run genkit:dev – local Genkit server for the AI flows.
    • next.config.ts loosens TypeScript/ESLint checks during builds and whitelists remote images.
    • Tailwind, PostCSS, tsconfig settings are standard.

    Files/folders worth noting
    • src/hooks/use-toast.ts – small in-memory toast store (no external state lib).
    • src/lib/utils.ts – Tailwind className combiner (cn).
    • docs/ – placeholder for future documentation (currently empty).
    • Firebase & TanStack Query deps are installed but not wired up yet.

In short: this repo is a polished starter that demonstrates how to chain multiple Gemini LLM calls from a Next.js front-end, present the results nicely, and leave room for Firebase or further backend work later.
