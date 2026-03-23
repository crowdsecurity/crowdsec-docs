const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
// The directories to scan for snippets
const DOCS_DIRS = ['./docs', './unversioned']; 
// ---------------------

const snippetRegistry = new Map();
let isIndexed = false;

// Helper: Recursively find all .md/.mdx files
const getAllFiles = (dirPath, arrayOfFiles = []) => {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
      arrayOfFiles.push(fullPath);
    }
  });
  return arrayOfFiles;
};

// Helper: Extract Doc ID from Frontmatter
const getDocId = (content, filename) => {
  const idMatch = content.match(/^---\s+[\s\S]*?\nid:\s*(.*?)\s*[\n\r]/m);
  if (idMatch && idMatch[1]) {
    return idMatch[1].replace(/['"]/g, '').trim();
  }
  return filename;
};

// --- CORE LOGIC ---
const buildIndex = () => {
  if (isIndexed) return;
  console.log('[ExtractPreprocessor] ⚡ Indexing snippets via Regex...');

  const allFiles = [];
  DOCS_DIRS.forEach(dir => getAllFiles(path.resolve(process.cwd(), dir), allFiles));

  let count = 0;

  // Regex to find: <div data-extract="ID"> CONTENT </div>
  // We use [\s\S]*? to match content across multiple lines (lazy match)
  const extractRegex = /<div\s+data-extract=["']([^"']+)["'][^>]*>([\s\S]*?)<\/div>/g;

  allFiles.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const filename = path.basename(filePath, path.extname(filePath));
      const docId = getDocId(content, filename);

      let match;
      // Loop through all matches in the file
      while ((match = extractRegex.exec(content)) !== null) {
        let [fullTag, extractId, snippetContent] = match;
        
        // Clean up the content (optional: trim leading/trailing newlines)
        snippetContent = snippetContent.replace(/^\n+|\n+$/g, '');

        // Generate Key: "docId:snippetId"
        // If the ID already has a colon, assume user provided full ID
        const key = extractId.includes(':') ? extractId : `${docId}:${extractId}`;
        
        snippetRegistry.set(key, snippetContent);
        console.log(`[ExtractPreprocessor] ⚡ Indexed snippet: ${key}`);
        count++;
      }
    } catch (e) {
      console.warn(`[ExtractPreprocessor] Failed to read ${filePath}`);
    }
  });

  isIndexed = true;
  console.log(`[ExtractPreprocessor] ⚡ Indexed ${count} snippets.`);
};

// This function is called by Docusaurus for EVERY markdown file
const preprocessor = ({ filePath, fileContent }) => {
  // 1. Ensure Index exists (runs once)
  buildIndex();

  // 2. Regex to find: <div data-extract-copy="ID" />
  // Matches <div data-extract-copy="xyz"></div> OR <div data-extract-copy="xyz" />
  const copyRegex = /<div\s+data-extract-copy=["']([^"']+)["']\s*\/?>\s*(?:<\/div>)?/g;

  // 3. Replace with content
  return fileContent.replace(copyRegex, (match, requestedId) => {
    if (snippetRegistry.has(requestedId)) {
        // Return the stored snippet content
        return snippetRegistry.get(requestedId);
    } else {
        console.error(`[ExtractPreprocessor] ❌ Snippet not found: "${requestedId}" in ${path.basename(filePath)}`);
        // Return an error message in the UI so you see it
        return `> **Error: Snippet "${requestedId}" not found.**`;
    }
  });
};

module.exports = preprocessor;