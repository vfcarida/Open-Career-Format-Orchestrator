import { useState } from 'react';
import { ServerCog, CheckCircle, XCircle, RefreshCw, AlertTriangle, FileText, Clock, MapPin } from 'lucide-react';

export function SystemHealth() {
  const [validating, setValidating] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleValidate = async () => {
    setValidating(true);
    setError(null);
    try {
      const res = await fetch('/api/profile/validate', { method: 'POST' });
      const data = await res.json();
      if (data.isError || !res.ok) {
        throw new Error(data.content?.[0]?.text || data.error);
      }
      
      const parsed = JSON.parse(data.content[0].text);
      if (parsed.ok === false && parsed.error) {
        // It's a ToolFailure
        throw new Error(parsed.error.message);
      }

      // parsed is ToolSuccess
      setReport(parsed.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setValidating(false);
    }
  };

  const handleMigrate = async () => {
    if (!confirm('Are you sure you want to migrate and backup your OKF bundle?')) return;
    setMigrating(true);
    setError(null);
    try {
      const res = await fetch('/api/profile/migrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ write: true }),
      });
      const data = await res.json();
      if (data.isError || !res.ok) {
        throw new Error(data.content?.[0]?.text || data.error);
      }
      
      const parsed = JSON.parse(data.content[0].text);
      if (parsed.ok === false && parsed.error) {
        throw new Error(parsed.error.message);
      }

      // We expect the migration tool to return a report object
      setReport({ migrationReport: parsed.data });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setMigrating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
          <ServerCog className="w-6 h-6 text-neon-blue" />
          System Health & Maintenance
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          Validate your OKF career bundle against the latest schemas or migrate legacy formats.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-neon-blue">
          <h3 className="font-medium text-zinc-200 mb-2">Schema Validation</h3>
          <p className="text-sm text-zinc-400 mb-4 h-10">
            Check all Markdown files in the bundle for OCF Profile v1 compliance.
          </p>
          <button
            onClick={handleValidate}
            disabled={validating || migrating}
            className="w-full py-2 bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue font-medium rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {validating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            {validating ? 'Validating...' : 'Run Validation'}
          </button>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-neon-indigo">
          <h3 className="font-medium text-zinc-200 mb-2">Bundle Migration</h3>
          <p className="text-sm text-zinc-400 mb-4 h-10">
            Automatically upgrade legacy v0 OKF files to OCF Profile v1. Backups are created.
          </p>
          <button
            onClick={handleMigrate}
            disabled={validating || migrating}
            className="w-full py-2 bg-neon-indigo/20 hover:bg-neon-indigo/30 text-neon-indigo font-medium rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {migrating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {migrating ? 'Migrating...' : 'Run Migration'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
          <h3 className="text-red-400 font-medium">Operation Failed</h3>
          <pre className="text-red-400/80 text-xs mt-2 whitespace-pre-wrap">{error}</pre>
        </div>
      )}

      {report && (
        <div className="glass-panel p-6 rounded-2xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="font-medium text-zinc-200 text-lg">Execution Report</h3>
            {report.checkedAt && (
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Clock className="w-3.5 h-3.5" />
                {new Date(report.checkedAt).toLocaleString()}
              </div>
            )}
          </div>
          
          {report.migrationReport ? (
            <div className="space-y-4">
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
                <h4 className="text-emerald-400 font-medium">Migration Successful</h4>
                <p className="text-emerald-400/80 text-xs mt-1">Files Checked: {report.migrationReport.filesChecked}</p>
                <p className="text-emerald-400/80 text-xs">Files Migrated: {report.migrationReport.filesMigrated}</p>
              </div>
              <pre className="text-sm text-zinc-300 font-mono whitespace-pre-wrap bg-zinc-900 p-4 rounded-xl border border-white/5">
                {JSON.stringify(report.migrationReport.changes, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="space-y-6">
              
              {report.bundlePath && (
                <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900/50 p-2 rounded-lg border border-white/5">
                  <MapPin className="w-4 h-4 text-neon-blue" />
                  <span className="truncate">{report.bundlePath}</span>
                </div>
              )}

              <div className="grid grid-cols-4 gap-4">
                <div className="bg-zinc-800/50 p-4 rounded-xl border border-white/5 flex flex-col items-center text-center">
                  <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2 font-semibold">Total Checked</div>
                  <div className="text-3xl text-zinc-200">{report.summary?.filesChecked ?? 0}</div>
                </div>
                <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10 flex flex-col items-center text-center">
                  <div className="text-xs text-emerald-500/70 uppercase tracking-wider mb-2 font-semibold">Valid</div>
                  <div className="text-3xl text-emerald-400">{report.summary?.validDocuments ?? 0}</div>
                </div>
                <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/10 flex flex-col items-center text-center">
                  <div className="text-xs text-red-500/70 uppercase tracking-wider mb-2 font-semibold">Invalid</div>
                  <div className="text-3xl text-red-400">{report.summary?.invalidDocuments ?? 0}</div>
                </div>
                <div className="bg-amber-500/5 p-4 rounded-xl border border-amber-500/10 flex flex-col items-center text-center">
                  <div className="text-xs text-amber-500/70 uppercase tracking-wider mb-2 font-semibold">Warnings</div>
                  <div className="text-3xl text-amber-400">{report.summary?.warnings ?? 0}</div>
                </div>
              </div>

              {report.diagnostics && report.diagnostics.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h4 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" /> 
                    Diagnostics ({report.diagnostics.length})
                  </h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    {report.diagnostics.map((d: any, i: number) => (
                      <div key={i} className={`p-3 rounded-lg border ${d.severity === 'error' ? 'bg-red-500/5 border-red-500/20' : 'bg-amber-500/5 border-amber-500/20'} flex gap-3 items-start`}>
                        {d.severity === 'error' ? (
                          <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5 truncate">
                              <FileText className="w-3.5 h-3.5" /> {d.file}
                            </span>
                            {d.code && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-zinc-500 font-mono tracking-wider">
                                {d.code}
                              </span>
                            )}
                          </div>
                          <p className={`text-sm ${d.severity === 'error' ? 'text-red-200' : 'text-amber-200'} leading-relaxed`}>
                            {d.message}
                          </p>
                          {d.suggestion && (
                            <p className="text-xs text-zinc-500 mt-2 italic">
                              Suggestion: {d.suggestion}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {report.ok && report.diagnostics?.length === 0 && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-xl text-center">
                  <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3 opacity-80" />
                  <h4 className="text-emerald-400 font-medium text-lg mb-1">Bundle is perfectly healthy!</h4>
                  <p className="text-emerald-400/70 text-sm">All career records are strictly schema compliant with OCF Profile v1.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
