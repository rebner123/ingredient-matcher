import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// Debug log the API key (don't log the full key in production!)
console.log('API Key present:', !!process.env.ANTHROPIC_API_KEY);

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { ingredient } = await request.json();
    console.log('Received ingredient:', ingredient);

    // First, try a simple Claude API call to test connection
    try {
      const message = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `Parse this ingredient into JSON format: "${ingredient}"`
        }]
      });

      console.log('Claude response:', message.content);

      // Mock response for now
      const response = {
        quantity: 2,
        unit: 'lb',
        ingredient: 'flour',
        notes: null,
        match: {
          id: '123',
          name: 'All-purpose flour',
          image: null
        },
        isValidIngredient: true,
        estimatedGrams: 907 // 2 lb = 907g
      };

      return NextResponse.json(response);

    } catch (claudeError) {
      console.error('Claude API Error:', claudeError);
      return NextResponse.json(
        { 
          error: "Claude API Error",
          details: claudeError.message
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Route Error:', error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error.message
      },
      { status: 500 }
    );
  }
}