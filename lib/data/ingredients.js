import { promises as fs } from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

let ingredients = null;

export async function loadIngredients() {
  if (ingredients) return ingredients;
  
  try {
    const filePath = path.join(process.cwd(), 'lib/data/all-ingredients.csv');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    ingredients = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });
    
    return ingredients;
  } catch (error) {
    console.error('Error loading ingredients:', error);
    return [];
  }
}

export async function findBestMatch(searchTerm) {
  const allIngredients = await loadIngredients();
  
  // Simple matching logic - can be improved
  const matches = allIngredients.filter(ing => 
    ing['Simple Name'].toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (matches.length === 0) return null;
  
  // Return the first match
  return {
    id: matches[0].ID,
    name: matches[0]['Simple Name']
  };
}