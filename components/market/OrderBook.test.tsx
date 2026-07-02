import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import OrderBook from "./OrderBook";

vi.mock("@/hooks/useMarketData", () => ({
  useOrderBook: () => ({
    data: null,
    loading: true,
    error: null,
    refetch: vi.fn(),
  }),
}));

describe("OrderBook", () => {
  it("shows loading state initially", () => {
    const { container } = render(
      <OrderBook yesMarketId="mkt_yes" noMarketId="mkt_no" />
    );
    const loadingBars = container.querySelectorAll(".animate-pulse");
    expect(loadingBars.length).toBeGreaterThan(0);
  });

  it("renders tab buttons", () => {
    render(<OrderBook yesMarketId="mkt_yes" noMarketId="mkt_no" />);
    expect(screen.getByText("Yes Offers")).toBeDefined();
    expect(screen.getByText("No Offers")).toBeDefined();
  });

  it("renders with null market ids", () => {
    render(<OrderBook yesMarketId={null} noMarketId={null} />);
    expect(screen.getByText("Order Book")).toBeDefined();
  });
});
