import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface EvalResult {
  scenario: string;
  cost: number;        // e.g., token count or estimated USD
  latencyMs: number;   // e.g., execution time in milliseconds
  efficacy: number;    // e.g., success rate 0-1
  assurance: number;   // e.g., HITL trigger correctness 0-1
  reliability: number; // e.g., schema adherence 0-1
}

interface EvalsReport {
  timestamp: string;
  overall: {
    averageCost: number;
    averageLatencyMs: number;
    averageEfficacy: number;
    averageAssurance: number;
    averageReliability: number;
  };
  results: EvalResult[];
}

export class EvalsHarness {
  private results: EvalResult[] = [];

  async runScenario(
    name: string, 
    runner: () => Promise<{ success: boolean, hitlTriggered: boolean, schemaValid: boolean, tokens: number }>
  ) {
    console.log(`[Evals] Running scenario: ${name}...`);
    const start = performance.now();
    let result;
    try {
      result = await runner();
    } catch (e) {
      result = { success: false, hitlTriggered: false, schemaValid: false, tokens: 0 };
    }
    const end = performance.now();
    
    this.results.push({
      scenario: name,
      cost: result.tokens,
      latencyMs: end - start,
      efficacy: result.success ? 1 : 0,
      assurance: result.hitlTriggered ? 1 : 0,
      reliability: result.schemaValid ? 1 : 0,
    });
  }

  generateReport(outputPath: string) {
    const total = this.results.length || 1;
    const report: EvalsReport = {
      timestamp: new Date().toISOString(),
      overall: {
        averageCost: this.results.reduce((acc, curr) => acc + curr.cost, 0) / total,
        averageLatencyMs: this.results.reduce((acc, curr) => acc + curr.latencyMs, 0) / total,
        averageEfficacy: this.results.reduce((acc, curr) => acc + curr.efficacy, 0) / total,
        averageAssurance: this.results.reduce((acc, curr) => acc + curr.assurance, 0) / total,
        averageReliability: this.results.reduce((acc, curr) => acc + curr.reliability, 0) / total,
      },
      results: this.results,
    };

    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
    console.log(`[Evals] Report generated at ${outputPath}`);
    
    // Log summary
    console.log(`\nCLEAR Metrics Summary:`);
    console.log(`  Cost (Avg Tokens): ${report.overall.averageCost}`);
    console.log(`  Latency (Avg ms):  ${report.overall.averageLatencyMs.toFixed(2)}`);
    console.log(`  Efficacy:          ${(report.overall.averageEfficacy * 100).toFixed(1)}%`);
    console.log(`  Assurance:         ${(report.overall.averageAssurance * 100).toFixed(1)}%`);
    console.log(`  Reliability:       ${(report.overall.averageReliability * 100).toFixed(1)}%\n`);
  }
}

async function main() {
  const harness = new EvalsHarness();

  // Mock Scenario 1: Tailor resume successfully and validate schema
  await harness.runScenario('Tailor Resume (Valid)', async () => {
    // Simulating LLM delay
    await new Promise(r => setTimeout(r, 1200)); 
    return { success: true, hitlTriggered: true, schemaValid: true, tokens: 1450 };
  });

  // Mock Scenario 2: Fail HITL (Automated submission blocked)
  await harness.runScenario('Blocked Live Submission (Assurance)', async () => {
    await new Promise(r => setTimeout(r, 400));
    return { success: true, hitlTriggered: true, schemaValid: true, tokens: 300 };
  });

  // Mock Scenario 3: Hallucination of schema keys
  await harness.runScenario('Schema Hallucination (Reliability)', async () => {
    await new Promise(r => setTimeout(r, 800));
    return { success: false, hitlTriggered: false, schemaValid: false, tokens: 600 };
  });

  const reportDir = path.resolve(__dirname, '../../reports');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  harness.generateReport(path.join(reportDir, 'evals-report.json'));
}

main().catch(console.error);
