import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
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
          borderRadius: "36px",
        }}
      >
        {/* Larger pokeball icon for Apple devices */}
        <div
          style={{
            width: "140px",
            height: "140px",
            borderRadius: "50%",
            background: "linear-gradient(180deg, #ff4d4d 0%, #ff4d4d 45%, #1a1625 45%, #1a1625 55%, #f0f0f0 55%, #f0f0f0 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 40px rgba(255, 208, 0, 0.5)",
            border: "8px solid #ffd000",
          }}
        >
          {/* Center button */}
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "#ffd000",
              border: "8px solid #1a1625",
              boxShadow: "0 0 20px rgba(255, 208, 0, 0.8)",
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

