import { NextResponse } from 'next/server';
import { findBestMatch } from '@/lib/data/ingredients';

export async function POST(request) {
  try {
    const { ingredient } = await request.json();
    
    // Parse the ingredient string
    const pattern = /^([\d.]+)\s+([a-zA-Z]+)\s+(?:of\s+)?([a-zA-Z]+)(?:\s+(.+))?$/;
    const match = ingredient.match(pattern);
    
    if (match) {
      const [_, quantity, unit, ingredientName, notes] = match;
      
      // Find the best match in the database
      const bestMatch = await findBestMatch(ingredientName);
      
      if (!bestMatch) {
        return NextResponse.json(
          { error: "No matching ingredient found in database" },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        quantity: parseFloat(quantity),
        unit: unit.toLowerCase(),
        ingredient: ingredientName.toLowerCase(),
        notes: notes ? notes.toLowerCase() : null,
        match: bestMatch
      });
    }
    
    return NextResponse.json(
      { error: "Could not parse ingredient string" },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}