import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #14121a 0%, #1a1625 100%)",
          borderRadius: "6px",
        }}
      >
        {/* Pokeball-inspired icon with battle theme */}
        <div
          style={{
            width: "26px",
            height: "26px",
            borderRadius: "50%",
            background: "linear-gradient(180deg, #ff4d4d 0%, #ff4d4d 45%, #1a1625 45%, #1a1625 55%, #f0f0f0 55%, #f0f0f0 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 8px rgba(255, 208, 0, 0.6)",
            border: "2px solid #ffd000",
          }}
        >
          {/* Center button */}
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#ffd000",
              border: "2px solid #1a1625",
              boxShadow: "0 0 6px rgba(255, 208, 0, 0.8)",
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

