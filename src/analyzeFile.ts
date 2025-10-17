// src/analyzeFile.ts
// SVG: udlæs farver og viewBox
if (mime === 'image/svg+xml' || ext === 'svg') {
    const svgText = textProbe ?? new TextDecoder().decode(buf);
    const vinfo = await analyzeSVG(svgText);
    if (vinfo.hasEmbeddedRaster) warnings.push('SVG indeholder indlejrede raster-billeder');
    return {
    fileName: file.name,
    mime, ext: ext ?? null,
    kind,
    vector: vinfo,
    warnings,
    isPrintable: true,
    rationale: vinfo.hasEmbeddedRaster ? 'Vektor (SVG) men indeholder raster; skalerbar med forbehold.' : 'Ren vektor – ubegrænset skalerbar.'
    };
    }
    // PDF/EPS/AI: marker som vektor
    return {
    fileName: file.name,
    mime, ext: ext ?? null,
    kind,
    vector: { hasEmbeddedRaster: false, colors: [] },
    warnings,
    isPrintable: true,
    rationale: 'Vektorformat (PDF/EPS/AI) – normalt skalerbar til høj kvalitet. (Detaljeanalyse kræver PDF-parser).'
    };
    }
    
    // RASTER
    if (kind === 'raster') {
    // Udtræk DPI
    const dpi = extractDPI(file, mime, buf);
    // Læs dimensioner
    const blobUrl = URL.createObjectURL(new Blob([buf], { type: mime || file.type || 'application/octet-stream' }));
    const img = await createImageBitmap(await (await fetch(blobUrl)).blob());
    URL.revokeObjectURL(blobUrl);
    const width = img.width; const height = img.height;
    // Palette
    const palette = await rasterPalette(img);
    
    // Max print ved 300 PPI
    const fit = computePrintFit(width, height, 300);
    const maxAt300: import('./types').MaxPrintAt300 = {
    widthIn: +(width/300).toFixed(2),
    heightIn: +(height/300).toFixed(2),
    widthCm: +((width/300)*2.54).toFixed(1),
    heightCm: +((height/300)*2.54).toFixed(1)
    };
    
    if (!dpi) warnings.push('Ingen indlejret DPI fundet – vurderer ud fra 300 PPI.');
    
    const ok = ['A6','A5','A4'].includes(fit.maxFormat) || (fit.maxFormat === 'A3' && Math.min(width,height) >= 3508);
    const rationale = `Raster ${width}×${height}px. Anslået max: ${fit.maxFormat} ved 300 PPI (≈ ${maxAt300.widthCm}×${maxAt300.heightCm} cm).`;
    
    return {
    fileName: file.name,
    mime, ext: ext ?? null,
    kind,
    raster: { width, height, dpi: dpi ?? null, palette },
    maxPrintAt300: maxAt300,
    printFit: fit,
    warnings,
    isPrintable: ok,
    rationale
    };
    }
    
    // UNKNOWN
    return {
    fileName: file.name,
    mime, ext: ext ?? null,
    kind,
    warnings: ['Ukendt filtype – kan ikke analyseres.'],
    isPrintable: false,
    rationale: 'Filtypen kan ikke afgøres som vektor eller raster.'
    };
    }