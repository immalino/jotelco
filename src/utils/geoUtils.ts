export interface Point {
  lat: number;
  lon: number;
}

const toRadians = (deg: number) => (deg * Math.PI) / 180;
const toDegrees = (rad: number) => (rad * 180) / Math.PI;

export function calculateDestination(lat: number, lon: number, azimuth: number, distanceMeter: number): Point {
  const R = 6378137; // Radius bumi dalam meter
  const dR = distanceMeter / R;
  const brng = toRadians(azimuth);
  const lat1 = toRadians(lat);
  const lon1 = toRadians(lon);

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(dR) +
    Math.cos(lat1) * Math.sin(dR) * Math.cos(brng)
  );

  const lon2 = lon1 + Math.atan2(
    Math.sin(brng) * Math.sin(dR) * Math.cos(lat1),
    Math.cos(dR) - Math.sin(lat1) * Math.sin(lat2)
  );

  return { lat: toDegrees(lat2), lon: toDegrees(lon2) };
}

export function generateWedgePoints(lat: number, lon: number, azimuth: number, beamwidth: number, radius: number): Point[] {
  const points: Point[] = [{ lat, lon }]; // Titik pusat (BTS)
  const startAngle = azimuth - beamwidth / 2;
  const endAngle = azimuth + beamwidth / 2;
  const step = 5; // Detail busur setiap 5 derajat

  for (let angle = startAngle; angle <= endAngle; angle += step) {
    points.push(calculateDestination(lat, lon, angle, radius));
  }
  // Tambahkan titik terakhir busur agar presisi
  points.push(calculateDestination(lat, lon, endAngle, radius));
  points.push({ lat, lon }); // Kembali ke pusat

  return points;
}
