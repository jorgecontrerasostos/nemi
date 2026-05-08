import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendMessage } from "./companion_api.ts";

beforeEach(() => {
  globalThis.fetch = vi.fn();
});

describe("sendMessage", () => {
  it("calls /chat with POST and correct body", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Hello!" }),
    } as Response);

    const result = await sendMessage([{ role: "user", content: "hi" }], "en");

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/chat"),
      expect.objectContaining({ method: "POST" })
    );
    expect(result).toBe("Hello!");
  });

  it("includes language in the request body", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "¡Hola!" }),
    } as Response);

    await sendMessage([], "es");

    const body = JSON.parse(
      vi.mocked(globalThis.fetch).mock.calls[0][1]?.body as string
    );
    expect(body.language).toBe("es");
  });

  it("throws on non-ok response", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    await expect(sendMessage([], "en")).rejects.toThrow("API error: 500");
  });
});
