import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import LandingPage from "./LandingPage.tsx";

describe("LandingPage", () => {
  it("renders the main headline", () => {
    render(<LandingPage onStart={vi.fn()} />);
    expect(
      screen.getByText(/Master any topic by teaching it/i)
    ).toBeInTheDocument();
  });

  it("renders the three Feynman step cards", () => {
    render(<LandingPage onStart={vi.fn()} />);
    expect(screen.getByText("Choose a topic")).toBeInTheDocument();
    expect(screen.getByText("Explain it to Nemi")).toBeInTheDocument();
    expect(screen.getByText("Review the gaps")).toBeInTheDocument();
  });

  it("calls onStart when the hero 'Start Learning' button is clicked", async () => {
    const onStart = vi.fn();
    render(<LandingPage onStart={onStart} />);
    await userEvent.click(
      screen.getByRole("button", { name: /Start Learning/i })
    );
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it("calls onStart when the header 'Start Session' button is clicked", async () => {
    const onStart = vi.fn();
    render(<LandingPage onStart={onStart} />);
    await userEvent.click(
      screen.getByRole("button", { name: /Start Session/i })
    );
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it("calls onStart when the CTA banner button is clicked", async () => {
    const onStart = vi.fn();
    render(<LandingPage onStart={onStart} />);
    await userEvent.click(
      screen.getByRole("button", { name: /Start for Free/i })
    );
    expect(onStart).toHaveBeenCalledTimes(1);
  });
});
