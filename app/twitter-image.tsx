import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Pokemon CRM - Compare Pokemon Stats & Battle Potential";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #14121a 0%, #1a1625 50%, #14121a 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow effects */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "-100px",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            right: "-100px",
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(255, 208, 0, 0.12) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "800px",
            height: "800px",
            background: "radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, transparent 60%)",
            borderRadius: "50%",
          }}
        />

        {/* Top badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 24px",
            borderRadius: "50px",
            background: "rgba(255, 208, 0, 0.1)",
            border: "1px solid rgba(255, 208, 0, 0.3)",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#ffd000",
              boxShadow: "0 0 10px rgba(255, 208, 0, 0.8)",
            }}
          />
          <span
            style={{
              color: "#ffd000",
              fontSize: "20px",
              fontWeight: 600,
              letterSpacing: "0.05em",
            }}
          >
            BATTLE ARENA
          </span>
        </div>

        {/* Main title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h1
            style={{
              fontSize: "72px",
              fontWeight: 900,
              color: "#f5f5f0",
              margin: 0,
              letterSpacing: "-0.02em",
              textAlign: "center",
            }}
          >
            Pokemon CRM
          </h1>
          <div
            style={{
              fontSize: "72px",
              fontWeight: 900,
              background: "linear-gradient(135deg, #ffd000 0%, #ff6b35 100%)",
              backgroundClip: "text",
              color: "transparent",
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            Compare & Battle
          </div>
        </div>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "24px",
            color: "rgba(245, 245, 240, 0.7)",
            margin: 0,
            maxWidth: "700px",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          Analyze stats, discover strengths, and find out who would win in epic Pokemon battles
        </p>

        {/* Pokeball decorations */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            gap: "24px",
            alignItems: "center",
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: `linear-gradient(180deg, #ff4d4d 0%, #ff4d4d 45%, #2a2535 45%, #2a2535 55%, #f0f0f0 55%, #f0f0f0 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "3px solid #ffd000",
                boxShadow: "0 0 15px rgba(255, 208, 0, 0.4)",
                opacity: i === 2 ? 1 : 0.6,
                transform: i === 2 ? "scale(1.2)" : "scale(1)",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#ffd000",
                  border: "2px solid #2a2535",
                }}
              />
            </div>
          ))}
        </div>

        {/* Corner decorative lines */}
        <div
          style={{
            position: "absolute",
            top: "30px",
            left: "30px",
            width: "80px",
            height: "80px",
            borderTop: "3px solid rgba(255, 208, 0, 0.5)",
            borderLeft: "3px solid rgba(255, 208, 0, 0.5)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "30px",
            right: "30px",
            width: "80px",
            height: "80px",
            borderTop: "3px solid rgba(168, 85, 247, 0.5)",
            borderRight: "3px solid rgba(168, 85, 247, 0.5)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            left: "30px",
            width: "80px",
            height: "80px",
            borderBottom: "3px solid rgba(168, 85, 247, 0.5)",
            borderLeft: "3px solid rgba(168, 85, 247, 0.5)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            right: "30px",
            width: "80px",
            height: "80px",
            borderBottom: "3px solid rgba(255, 208, 0, 0.5)",
            borderRight: "3px solid rgba(255, 208, 0, 0.5)",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}


