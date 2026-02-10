import { generateWedgePoints, calculateDestination } from './geoUtils';

/**
 * DEFINISI STYLE
 * Opacity 20% = 33 dalam Hex (0.2 * 255)
 * Format KML: AABBGGRR
 */
const styles = `
    <Style id="style_line">
      <LineStyle><color>ff00ffff</color><width>2</width></LineStyle>
      <LabelStyle><scale>0.8</scale></LabelStyle>
    </Style>
    <Style id="style_bw35">
      <LineStyle>
        <color>ffffffff</color> <width>1</width>
      </LineStyle>
      <PolyStyle>
        <color>33FF00FF</color> <outline>1</outline>
      </PolyStyle>
    </Style>
    <Style id="style_circle">
      <LineStyle><color>ff00ffff</color><width>1</width></LineStyle>
      <PolyStyle><fill>0</fill></PolyStyle>
    </Style>
`;

export interface SiteData {
  Site_ID: string;
  Lat: string | number;
  Lon: string | number;
  Azim_S1: string | number | null;
  Azim_S2: string | number | null;
  Azim_S3: string | number | null;
  Radius_Meter?: string | number;
}

export function createKMLString(sites: SiteData[]): string {
  const siteFolders = sites.map(site => {
    const lat = Number(site.Lat);
    const lon = Number(site.Lon);
    const baseRadius = Number(site.Radius_Meter || 500);

    // 1. GENERATE CIRCLE 50M
    const radiusCircle = 50;
    const circlePoints = [];
    for (let i = 0; i <= 360; i += 10) {
      circlePoints.push(calculateDestination(lat, lon, i, radiusCircle));
    }
    const circleCoords = circlePoints.map(p => `${p.lon},${p.lat},0`).join(' ');
    
    const circleKML = `
        <Placemark>
          <name>Range 50m</name>
          <styleUrl>#style_circle</styleUrl>
          <Polygon>
            <outerBoundaryIs><LinearRing><coordinates>${circleCoords}</coordinates></LinearRing></outerBoundaryIs>
          </Polygon>
        </Placemark>`;

    // 2. GENERATE SECTORS (BW & AZZ)
    const azzPlacemarks: string[] = [];
    const bwPlacemarks: string[] = [];

    const sectorInputs = [
      { az: site.Azim_S1, name: 'S1' },
      { az: site.Azim_S2, name: 'S2' },
      { az: site.Azim_S3, name: 'S3' }
    ];

    sectorInputs.forEach(sector => {
      if (sector.az === null || sector.az === undefined || sector.az === '') return;

      const azimuth = Number(sector.az);
      const label = `${site.Site_ID}_${sector.name}`;

      // Garis Tengah (Azz)
      const endLine = calculateDestination(lat, lon, azimuth, baseRadius);
      const lineCoords = `${lon},${lat},0 ${endLine.lon},${endLine.lat},0`;
      azzPlacemarks.push(`
          <Placemark>
            <name>${label} (${azimuth}°)</name>
            <styleUrl>#style_line</styleUrl>
            <LineString><coordinates>${lineCoords}</coordinates></LineString>
          </Placemark>`);

      // Kipas BW 35 (Purple 20%)
      const purplePoints = generateWedgePoints(lat, lon, azimuth, 35, baseRadius * 0.8);
      const purpleCoords = purplePoints.map(p => `${p.lon},${p.lat},0`).join(' ');
      bwPlacemarks.push(`
          <Placemark>
            <name>${label} (35°)</name>
            <styleUrl>#style_bw35</styleUrl>
            <Polygon>
              <outerBoundaryIs><LinearRing><coordinates>${purpleCoords}</coordinates></LinearRing></outerBoundaryIs>
            </Polygon>
          </Placemark>`);
    });

    // SUSUNAN FOLDER PER SITE
    return `
      <Folder>
        <name>${site.Site_ID}</name>
        <Folder>
          <name>BW</name>
          ${bwPlacemarks.join('\n')}
        </Folder>
        <Folder>
          <name>Azz</name>
          ${azzPlacemarks.join('\n')}
        </Folder>
        <Folder>
          <name>Circle</name>
          ${circleKML}
        </Folder>
      </Folder>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>BTS Azimuth Visualizer</name>
    <open>1</open>
    ${styles}
    <Folder>
      <name>Hasil generate</name>
      ${siteFolders}
    </Folder>
  </Document>
</kml>`;
}
