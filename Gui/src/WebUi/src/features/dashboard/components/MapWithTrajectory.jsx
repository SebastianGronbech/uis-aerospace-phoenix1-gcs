
import mapImage from "@/assets/map.png";
 
const mapBounds = {
  topLeft: { lat: 40.730610, lng: -74.0060 },
  bottomRight: { lat: 40.7128, lng: -73.9352 },
};

const width = 750;
const height = 500;

export default function MapWithTrajectory({ points }) {
  const convertCoordsToPixels = ({ lat, lng }) => {
    const x = ((lng - mapBounds.topLeft.lng) / (mapBounds.bottomRight.lng - mapBounds.topLeft.lng)) * width;
    const y = ((mapBounds.topLeft.lat - lat) / (mapBounds.topLeft.lat - mapBounds.bottomRight.lat)) * height;
    return { x, y };
  };

  const pixelPoints = points.map(convertCoordsToPixels);

  return (
    <div className="relative" style={{ width, height }}>
      <img src={mapImage} alt="Map" style={{ width, height }} />
      <svg
        width={width}
        height={height}
        className="absolute top-0 left-0"
      >
        <polyline
          points={pixelPoints.map(p => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="red"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
