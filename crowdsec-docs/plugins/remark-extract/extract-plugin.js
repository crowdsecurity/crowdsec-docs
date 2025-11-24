const fs = require('fs');
const path = require('path');

// Recursive file walker
const getAllFiles = (dirPath, arrayOfFiles) => {
  if (!fs.existsSync(dirPath)) return arrayOfFiles || [];
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      if (file.endsWith('.md') || file.endsWith('.mdx')) {
        arrayOfFiles.push(fullPath);
      }
    }
  });
  return arrayOfFiles;
};

const getDocId = (content, filename) => {
  const idMatch = content.match(/^---\s+[\s\S]*?\nid:\s*(.*?)\s*[\n\r]/m);
  if (idMatch && idMatch[1]) {
    return idMatch[1].replace(/['"]/g, '').trim();
  }
  return filename;
};

const getAttribute = (node, name) => {
  const attr = node.attributes?.find((a) => a.name === name);
  return attr ? attr.value : null;
};

// Global Registry
const extractRegistry = new Map();
let isIndexed = false;

module.exports = function plugin(options = {}) {
  let sourceDirs = options.paths || (options.path ? [options.path] : ['./docs']);
  if (!Array.isArray(sourceDirs)) sourceDirs = [sourceDirs];

  return async (root, vfile) => {
    const { visit } = await import('unist-util-visit');
    const { unified } = await import('unified');
    const remarkParse = (await import('remark-parse')).default;
    const remarkMdx = (await import('remark-mdx')).default;
    const remarkGfm = (await import('remark-gfm')).default;

    // --- PHASE A: INDEXING ---
    if (!isIndexed) {
      console.log(`\n[ExtractPlugin] ========== INDEXING ==========`);
      
      let allFiles = [];
      for (const dir of sourceDirs) {
        const absDir = path.resolve(process.cwd(), dir);
        getAllFiles(absDir, allFiles);
      }

      const processor = unified().use(remarkParse).use(remarkGfm).use(remarkMdx);

      for (const filePath of allFiles) {
        try {
          let content = fs.readFileSync(filePath, 'utf8');
          content = content.replace(/<!--[\s\S]*?-->/g, '');
          content = content.replace(/^---\s+[\s\S]*?---/, '');
          
          const rawContent = fs.readFileSync(filePath, 'utf8');
          const filename = path.basename(filePath, path.extname(filePath));
          const docId = getDocId(rawContent, filename);

          const tree = processor.parse(content);
          
          visit(tree, ['mdxJsxFlowElement', 'mdxJsxTextElement'], (node) => {
            // STRATEGY CHANGE: Look for <div>
            if (node.name === 'div') {
              const extractId = getAttribute(node, 'data-extract');
              if (extractId) {
                // If ID does not contain a colon, prepend the DocID automatically
                const key = extractId.includes(':') ? extractId : `${docId}:${extractId}`;
                extractRegistry.set(key, node.children);
              }
            }
          });
        } catch (e) { /* ignore */ }
      }
      isIndexed = true;
      
      console.log(`[ExtractPlugin] Indexed ${extractRegistry.size} snippets.`);
      extractRegistry.forEach((val, key) => console.log(`   - ${key}`));
      console.log(`[ExtractPlugin] ========== INDEXING DONE==========\n`);
    }

    // --- PHASE B: TRANSFORMING ---
    visit(root, ['mdxJsxFlowElement', 'mdxJsxTextElement'], (node, index, parent) => {
      
      // We only care about DIVs
      if (node.name === 'div') {
        
        // 1. Handle Definitions: <div data-extract="...">
        const extractId = getAttribute(node, 'data-extract');
        if (extractId) {
            // Unwrap: Remove the div wrapper, leave the content
            if (parent && Array.isArray(parent.children)) {
                parent.children.splice(index, 1, ...node.children);
                return index;
            }
        }

        // 2. Handle Copies: <div data-extract-copy="...">
        const copyId = getAttribute(node, 'data-extract-copy');
        if (copyId) {
            if (extractRegistry.has(copyId)) {
                const clonedNodes = JSON.parse(JSON.stringify(extractRegistry.get(copyId)));
                if (parent && Array.isArray(parent.children)) {
                    parent.children.splice(index, 1, ...clonedNodes);
                    return index + clonedNodes.length;
                }
            } else {
                console.error(`[ExtractPlugin] ❌ Missing Snippet: "${copyId}"`);
            }
        }
      }
    });
  };
};