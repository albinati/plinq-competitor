import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
});

export async function enrichProfileWithAI(rawData: any, sources: string[]): Promise<string> {
  // Skip AI processing during build if no API key
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'dummy-key-for-build') {
    return 'AI analysis will be available when API key is configured.';
  }

  try {
    const prompt = `
Analyze the following profile data and create a comprehensive, professional summary. 
Focus on key insights, credibility indicators, and notable achievements.

Raw Data: ${JSON.stringify(rawData, null, 2)}
Data Sources: ${sources.join(', ')}

Please provide:
1. A professional summary (2-3 sentences)
2. Key credibility indicators
3. Notable achievements or highlights
4. Any red flags or inconsistencies
5. Overall assessment of profile completeness

Format as a structured, professional report suitable for a people search platform.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert profile analyst specializing in people search and verification. Provide accurate, professional assessments based on available data."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.3,
    });

    return completion.choices[0]?.message?.content || 'Unable to generate AI summary';
  } catch (error) {
    console.error('OpenAI API error:', error);
    return 'AI analysis temporarily unavailable';
  }
}

export async function generateVerificationInsights(profileData: any): Promise<string> {
  // Skip AI processing during build if no API key
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'dummy-key-for-build') {
    return 'Verification analysis will be available when API key is configured.';
  }

  try {
    const prompt = `
Analyze this profile data for verification insights and trust indicators:

${JSON.stringify(profileData, null, 2)}

Provide:
1. Trust score assessment (0-100)
2. Verification recommendations
3. Data consistency analysis
4. Missing information that would improve verification
5. Risk factors or concerns

Be concise and actionable.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a verification expert. Provide objective assessments of profile trustworthiness and data quality."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.2,
    });

    return completion.choices[0]?.message?.content || 'Verification analysis unavailable';
  } catch (error) {
    console.error('OpenAI verification analysis error:', error);
    return 'Verification analysis temporarily unavailable';
  }
}
