import { config } from 'dotenv';
config();

import '@/ai/flows/initial-idea-initiation.ts';
import '@/ai/flows/output-synthesis.ts';
import '@/ai/flows/llm-orchestration.ts';