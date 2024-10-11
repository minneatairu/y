import sharp from "sharp";
import fetch from "node-fetch";

const API_HOST = process.env.REPLICATE_API_HOST || "https://api.replicate.com";

export async function POST(req) {
  console.log("called POST in predictions2 route");

  try {
    // Parse the request body as JSON
    const body = await req.json();

    // Remove null and undefined values
    const cleanedBody = Object.entries(body).reduce(
      (a, [k, v]) => (v == null ? a : ((a[k] = v), a)),
      {}
    );

    if (cleanedBody.mask) {
      cleanedBody.mask = addBackgroundToPNG(cleanedBody.mask);
    }

    const requestBody = JSON.stringify({
      version:
        "c221b2b8ef527988fb59bf24a8b97c4561f1c671f73bd389f866bfb27c061316",
      input: {
        prompt: `${cleanedBody.prompt}, photograph, 35mm`, // Append a directive for monochromatic color scheme
        width: 576,
        height: 768,
        num_outputs: 3,
        mask: cleanedBody.mask
          ? addBackgroundToPNG(cleanedBody.mask)
          : undefined,
      },
    });

    const response = await fetch(`${API_HOST}/v1/predictions`, {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: requestBody,
    });

    if (response.status !== 201) {
      const error = await response.json();
      return new Response(JSON.stringify({ detail: error.detail }), {
        status: 500,
      });
    }

    const prediction = await response.json();
    const imageUrl = prediction.output[0];

    // Download the image from the URL
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.buffer();

    // Add text overlay using Sharp
    const overlayText = "Sample Overlay Text";

    const modifiedBuffer = await sharp(imageBuffer)
      .composite([
        {
          input: Buffer.from(
            `<svg>
              <text x="10" y="50" font-size="30" fill="white">${overlayText}</text>
            </svg>`
          ),
          gravity: "southeast",
        },
      ])
      .toBuffer();

    return new Response(modifiedBuffer, {
      status: 200,
      headers: { "Content-Type": "image/png" },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ detail: "Internal Server Error" }), {
      status: 500,
    });
  }
}

function addBackgroundToPNG(mask) {
  // Your implementation for adding background to PNG
  return mask;
}
