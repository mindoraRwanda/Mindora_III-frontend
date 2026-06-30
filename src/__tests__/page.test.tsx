import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home page", () => {
  it("renders without crashing", () => {
    render(<Home />);
    expect(document.body).toBeTruthy();
  });

  it("displays the edit instruction heading", () => {
    render(<Home />);
    expect(screen.getByRole("heading")).toBeInTheDocument();
  });
});
