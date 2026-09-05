import fs from 'fs';
import path from 'path';
import { generateSingleFileHtmlCode } from '../src/utils/generateSingleFileHtml';

const content = generateSingleFileHtmlCode();
const outputPath = path.resolve(process.cwd(), 'public/standalone.html');
fs.writeFileSync(outputPath, content, 'utf8');
console.log(`Successfully generated ${outputPath}. Total length: ${content.length} bytes.`);
