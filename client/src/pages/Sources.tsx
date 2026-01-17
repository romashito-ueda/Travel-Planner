import { TripData } from "@/lib/types";
import { FileText, Link as LinkIcon, Download } from "lucide-react";

interface SourcesProps {
  data: TripData;
}

export default function Sources({ data }: SourcesProps) {
  return (
    <div className="pb-24 pt-8 px-4 max-w-md mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold mb-2">Documents & Links</h1>
        <p className="text-muted-foreground text-sm">Important references for the trip.</p>
      </header>

      <div className="bg-card rounded-xl border shadow-sm divide-y divide-border">
        {data.sources.map((source, idx) => (
          <a 
            key={idx} 
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
              {source.type === 'pdf' ? (
                <FileText className="w-5 h-5 text-red-500" />
              ) : (
                <LinkIcon className="w-5 h-5 text-blue-500" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{source.title}</h3>
              <p className="text-xs text-muted-foreground uppercase">{source.type}</p>
            </div>
            {source.type === 'pdf' && <Download className="w-4 h-4 text-muted-foreground" />}
          </a>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-bold text-muted-foreground uppercase mb-3">Emergency Contacts</h3>
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 text-amber-900 space-y-2 text-sm">
          <p className="font-bold">Embassy of Japan in France</p>
          <p>+33 1 48 88 62 00</p>
          <hr className="border-amber-200" />
          <p className="font-bold">Global Police/Ambulance (EU)</p>
          <p className="text-lg font-mono font-bold">112</p>
        </div>
      </div>
    </div>
  );
}
