import { z } from 'zod';

export const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  GEMINI_API_KEY: z.string().min(1),
});

export type EnvConfig = z.infer<typeof envSchema>;

export const validateEnv = (config: Record<string, unknown>): EnvConfig => {
  const parsed = envSchema.safeParse(config);
  
  if (!parsed.success) {
    const errorMsg = "Invalid environment variables: " + 
      JSON.stringify(parsed.error.format(), null, 2);
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  
  return parsed.data;
};