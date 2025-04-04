const fs = require('fs');

// Read the kpiData.js file
const data = fs.readFileSync('src/data/kpiData.js', 'utf8');

// Count occurrences of each tile size
const tileSize1x1 = (data.match(/tileSize: ['"]1x1['"]/g) || []).length;
const tileSize1x2 = (data.match(/tileSize: ['"]1x2['"]/g) || []).length;
const tileSize2x1 = (data.match(/tileSize: ['"]2x1['"]/g) || []).length;
const tileSize2x2 = (data.match(/tileSize: ['"]2x2['"]/g) || []).length;

// Count total KPIs
const totalKPIs = (data.match(/id: ['"][^'"]+['"]/g) || []).length;
const importantKPIs = totalKPIs - (data.match(/notImportant: \[[^]*?id: ['"][^'"]+['"]/g) || []).length;

// Calculate total grid cells
const totalCells = tileSize1x1 + (tileSize1x2 * 2) + (tileSize2x1 * 2) + (tileSize2x2 * 4);
const defaultTileSize = importantKPIs - tileSize1x1 - tileSize1x2 - tileSize2x1 - tileSize2x2;

console.log('KPI Tile Size Analysis:');
console.log(`- Total KPIs: ${totalKPIs}`);
console.log(`- Important KPIs: ${importantKPIs}`);
console.log(`- KPIs with default tile size (1x1): ${defaultTileSize}`);
console.log(`- KPIs with 1x1 tile size: ${tileSize1x1}`);
console.log(`- KPIs with 1x2 tile size: ${tileSize1x2}`);
console.log(`- KPIs with 2x1 tile size: ${tileSize2x1}`);
console.log(`- KPIs with 2x2 tile size: ${tileSize2x2}`);
console.log(`- Total grid cells used: ${totalCells + defaultTileSize}`);
console.log(`- Grid cells needed for 4x4 grid: 16`);
console.log(`- Difference: ${totalCells + defaultTileSize - 16}`);
