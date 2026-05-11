import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchScope } from "./scope_api.ts";

beforeEach(() => { vi.resetAllMocks(); });

describe("fetchScope", () => {
  it("sends topic and returns scope result", async () => {
    const mockResult = {
      topic: "Photosynthesis",
      subtopics: [{ title: "Light Reactions", description: "ATP production", icon: "wb_sunny" }],
    };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResult),
    });

    const result = await fetchScope({ topic: "Photosynthesis" });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/scope"),
      expect.objectContaining({ method: "POST" })
    );
    expect(result.topic).toBe("Photosynthesis");
    expect(result.subtopics).toHaveLength(1);
  });

  it("throws when response is not ok", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false });
    await expect(fetchScope({ topic: "Test" })).rejects.toThrow("Scope request failed");
  });

  it("sends text notes payload", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ topic: "Calculus", subtopics: [] }),
    });

    await fetchScope({ text: "The derivative measures..." });

    const body = JSON.parse((fetch as ReturnType<typeof vi.fn>).mock.calls[0][1].body);
    expect(body.text).toBe("The derivative measures...");
    expect(body.topic).toBeUndefined();
  });
});