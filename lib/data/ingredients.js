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
  try {
    const allIngredients = await loadIngredients();
    
    const matches = allIngredients.filter(ing => 
      ing['Simple Name'].toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (matches.length === 0) return null;
    
    const bestMatch = matches[0];
    
    return {
      id: bestMatch.ID,
      name: bestMatch['Simple Name'],
      image: bestMatch['Image Found']
    };
  } catch (error) {
    console.error('Error finding match:', error);
    return null;
  }
}