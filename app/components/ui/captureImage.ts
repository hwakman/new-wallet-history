export type CaptureResult = "shared" | "downloaded" | "cancelled";

// Saving a canvas on iOS Safari needs different handling than desktop:
//   - the `download` attribute is ignored, so an <a> click just navigates away
//   - huge `data:` URLs from toDataURL() fail, so we use a Blob object URL
//   - the native share sheet is the only way to reach Photos / Files
// Returns "cancelled" when the user dismisses the share sheet, so callers can
// avoid treating a dismissal as a successful save.
export async function captureAsImage(
  element: HTMLElement,
  filename: string,
): Promise<CaptureResult> {
  const html2canvas = (await import("html2canvas-pro")).default;
  const canvas = await html2canvas(element, {
    backgroundColor: "#ffffff",
    // iOS caps total canvas pixels, so don't scale up on small screens.
    scale: window.innerWidth < 768 ? 1.5 : 2,
  });

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );
  if (!blob) throw new Error("Could not render the image");

  const file = new File([blob], filename, { type: "image/png" });

  if (typeof navigator !== "undefined" && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file] });
      return "shared";
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return "cancelled";
      // Anything else (e.g. share unavailable in this context) falls through
      // to the regular download below.
    }
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);

  return "downloaded";
}
