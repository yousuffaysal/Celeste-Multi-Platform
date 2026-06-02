import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 7,
          backgroundImage:
            "url(https://ik.imagekit.io/2lax2ytm2/Screenshot%202026-05-30%20at%203.58.44%E2%80%AFPM.png)",
          backgroundSize: "160%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
    ),
    { ...size }
  );
}
