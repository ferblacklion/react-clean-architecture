import { render } from "@testing-library/react";
import AppView from "../src/app/main/infrastructure/view/AppView";

describe("App", () => {
  it("should render properly", async () => {
    const { queryByText } = render(<AppView />);
    expect(await queryByText("dec")).toBeDefined();
    expect(await queryByText("inc")).toBeDefined();
  });
});
