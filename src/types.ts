/**
 * Type definitions for the LLM chat application.
 */

export interface Env {
  /**
   * Binding for the Workers AI API.
   */
  AI: Ai;

  /**
   * Binding for static assets.
   */
  ASSETS: { fetch: (request: Request) => Promise<Response> };
}

/**
 * Represents a chat message.
 */
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export type FileKind = 'vector' | 'raster' | 'unknown';

export interface MaxPrintAt300 {
widthIn: number; // inches
heightIn: number; // inches
widthCm: number;
heightCm: number;
}

export interface VectorInfo {
hasEmbeddedRaster: boolean;
colors: string[]; // unikke fill/stroke-hex
viewBox?: { width: number; height: number };
}

export interface RasterInfo {
width: number; // px
height: number; // px
dpi?: number | null; // forsøgt udtrukket
palette: Array<{ hex: string; percentage: number }>; // top 8
}

export interface PrintFit {
ppiAssumed: number; // typisk 300
maxFormat: 'A6' | 'A5' | 'A4' | 'A3' | 'A2' | '50x70' | 'Under A6';
limitingEdge: 'width' | 'height';
targetPx: { w: number; h: number }; // krav til maxFormat
}

export interface AnalysisReport {
fileName: string;
mime: string;
ext: string | null;
kind: FileKind;
vector?: VectorInfo;
raster?: RasterInfo;
maxPrintAt300?: MaxPrintAt300; // for raster
printFit?: PrintFit; // for raster
warnings: string[];
isPrintable: boolean; // samlet Go/No-Go
rationale: string; // kort begrundelse
}