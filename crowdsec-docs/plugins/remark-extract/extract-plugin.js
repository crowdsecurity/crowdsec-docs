const fs = require('fs');
const path = require('path');

// 1. Helper: Recursive directory walker
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

// 2. Helper: Frontmatter Parser
const getDocId = (content, filename) => {
  const idMatch = content.match(/^---\s+[\s\S]*?\nid:\s*(.*?)\s*[\n\r]/m);
  if (idMatch && idMatch[1]) {
    return idMatch[1].replace(/['"]/g, '').trim();
  }
  return filename;
};

// 3. Helper: Attribute getter
const getAttribute = (node, name) => {
  const attr = node.attributes?.find((a) => a.name === name);
  return attr ? attr.value : null;
};

// Registry to store snippets
const extractRegistry = new Map();

module.exports = function plugin(options = {}) {
  let sourceDirs = options.paths || (options.path ? [options.path] : ['./docs']);
  if (!Array.isArray(sourceDirs)) sourceDirs = [sourceDirs];

  return async (root) => {
    // Import Docusaurus internal dependencies
    const { visit } = await import('unist-util-visit');
    const { unified } = await import('unified');
    const remarkParse = (await import('remark-parse')).default;
    const remarkMdx = (await import('remark-mdx')).default;
    // We add GFM (GitHub Flavored Markdown) to support Tables, Strikethrough, etc.
    const remarkGfm = (await import('remark-gfm')).default;

    // --- PHASE A: INDEXING ---
    if (extractRegistry.size === 0) {
      console.log(`[ExtractPlugin] Indexing snippets from: ${sourceDirs.join(', ')}`);
      
      let allFiles = [];
      for (const dir of sourceDirs) {
        const absDir = path.resolve(process.cwd(), dir);
        getAllFiles(absDir, allFiles);
      }

      // Configure processor with GFM support
      const processor = unified()
        .use(remarkParse)
        .use(remarkGfm) 
        .use(remarkMdx);

      for (const filePath of allFiles) {
        try {
          let content = fs.readFileSync(filePath, 'utf8');
          
          // --- CLEANING CONTENT ---
          // 1. Remove HTML comments <!-- ... --> to prevent MDX crash
          content = content.replace(/<!--[\s\S]*?-->/g, '');
          
          // 2. Remove Frontmatter --- ... --- to focus on body
          content = content.replace(/^---\s+[\s\S]*?---/, '');
          
          // --- END CLEANING ---

          // Get Doc ID from original file (or filename)
          const rawContent = fs.readFileSync(filePath, 'utf8');
          const filename = path.basename(filePath, path.extname(filePath));
          const docId = getDocId(rawContent, filename);

          const tree = processor.parse(content);
          
          visit(tree, 'mdxJsxFlowElement', (node) => {
            if (node.name === 'extract') {
              const extractId = getAttribute(node, 'id');
              if (extractId) {
                const key = `${docId}:${extractId}`;
                // We store the AST children (the content inside the tag)
                extractRegistry.set(key, node.children);
              }
            }
          });
        } catch (e) {
          const filename = path.basename(filePath);
          console.warn(`[ExtractPlugin] Skipped ${filename}: ${e.message}`);
        }
      }
      console.log(`[ExtractPlugin] Indexed ${extractRegistry.size} snippets.`);
    }

    // --- PHASE B: TRANSFORMING ---
    visit(root, 'mdxJsxFlowElement', (node, index, parent) => {
      // 1. Unwrap <extract> (Display content normally in source page)
      if (node.name === 'extract') {
        parent.children.splice(index, 1, ...node.children);
        return index;
      }

      // 2. Inject <extractCopy> (Copy content from registry)
      if (node.name === 'extractCopy') {
        const targetId = getAttribute(node, 'id');
        
        if (targetId && extractRegistry.has(targetId)) {
          // Clone the AST nodes to avoid reference issues
          const cloned = JSON.parse(JSON.stringify(extractRegistry.get(targetId)));
          parent.children.splice(index, 1, ...cloned);
          return index + cloned.length;
        } else {
          console.warn(`[ExtractPlugin] Warning: Extract ID "${targetId}" not found in registry.`);
        }
      }
    });
  };
};