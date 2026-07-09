import type { OKFDocument } from '../domain/types.js';
import type { ContextPackRequest, ContextPackResult } from '../domain/context-pack.js';

export class ContextPacker {
  /**
   * Deterministic simple token estimation.
   */
  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  /**
   * Simple relevance heuristic based on task keywords.
   */
  private calculateRelevance(doc: OKFDocument, task: string): number {
    const taskLower = task.toLowerCase();
    const title = (doc.frontmatter.title || '').toLowerCase();
    const type = (doc.frontmatter.type || '').toLowerCase();
    
    let score = 0.5; // Base relevance

    if (taskLower.includes(title)) score += 0.3;
    if (taskLower.includes(type)) score += 0.2;
    
    // Cap at 1.0
    return Math.min(score, 1.0);
  }

  public pack(documents: OKFDocument[], request: ContextPackRequest): ContextPackResult {
    const result: ContextPackResult = {
      summary: `Context Pack generated for profile: ${request.profile} (Mode: ${request.mode})`,
      documents: [],
      omitted: [],
      totalEstimatedTokens: 0,
    };

    // 1. Score and Sort documents
    const scoredDocs = documents.map(doc => ({
      doc,
      relevance: this.calculateRelevance(doc, request.task),
    })).sort((a, b) => b.relevance - a.relevance);

    // 2. Process and Compress
    for (const { doc, relevance } of scoredDocs) {
      let excerpt = '';
      
      const fmStr = JSON.stringify(doc.frontmatter, null, 2);
      
      if (request.mode === 'minimal') {
        excerpt = `---\n${fmStr}\n---`;
      } else if (request.mode === 'balanced') {
        const truncatedBody = doc.body.length > 500 ? doc.body.substring(0, 500) + '\n...[TRUNCATED]' : doc.body;
        excerpt = `---\n${fmStr}\n---\n\n${truncatedBody}`;
      } else {
        // full or audit
        excerpt = `---\n${fmStr}\n---\n\n${doc.body}`;
      }

      const estimatedTokens = this.estimateTokens(excerpt);

      // 3. Enforce Budget
      if (request.mode !== 'audit' && (result.totalEstimatedTokens + estimatedTokens > request.maxTokens)) {
        result.omitted.push({
          id: doc.conceptId,
          reason: `Budget Exceeded (Cost: ${estimatedTokens} tokens)`,
        });
        continue;
      }

      result.documents.push({
        id: doc.conceptId,
        title: doc.frontmatter.title || doc.conceptId,
        relevance,
        estimatedTokens,
        excerpt,
        provenance: request.includeProvenance ? doc.filePath : 'provenance_omitted',
      });

      result.totalEstimatedTokens += estimatedTokens;
    }

    return result;
  }
}
