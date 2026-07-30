import { Paths, File } from "expo-file-system";

function base64ToBytes(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function buildCompleteFormData(
  payload: Record<string, any>,
  signature: string,
  slotImages: Record<string, string>,
): Promise<FormData> {
  const formData = new FormData();
  formData.append("payload", JSON.stringify(payload));

  if (signature && signature.length > 10) {
    const base64 = signature.includes("base64,")
      ? signature.split("base64,")[1]
      : signature;
    const file = new File(Paths.cache, `sig-${Date.now()}.png`);
    await file.write(base64ToBytes(base64));
    formData.append("signature", {
      uri: file.uri,
      name: "signature.png",
      type: "image/png",
    } as any);
  }

  for (const [key, uri] of Object.entries(slotImages)) {
    const parts = key.split("_");
    if (parts.length < 2) continue;
    const assetId = parts[0];
    const slot = parts.slice(1).join("_");
    const ext = uri.endsWith(".png") ? "png" : "jpeg";
    formData.append(`images[${assetId}][${slot}]`, {
      uri,
      name: `${slot}.${ext}`,
      type: `image/${ext}`,
    } as any);
  }

  return formData;
}
