describe("Test flow", () => {
  beforeEach(() => {
    cy.request("DELETE", "http://localhost:8080/api/cart/1");
    cy.visit("http://localhost:3000");
    cy.window().then((win) => {
      win.localStorage.setItem("cartId", "1");
    });
    cy.contains("Products").click();
    cy.get("li").should("have.length.at.least", 2);
  });

  it("1. Displays product list", () => {
    cy.contains("Products").should("exist");
    cy.get("li").should("have.length.at.least", 1);
  });

  it("2. Adds first product to cart", () => {
    cy.contains("li", "Coffee").find("button").click();
  });

  it("3. Navigates to cart", () => {
    cy.contains("Cart").click();
    cy.url().should("include", "/cart");
    cy.contains("Your Cart").should("exist");
  });

  it("4. Product appears in cart", () => {
    cy.contains("li", "Coffee").find("button").click();
    cy.contains("Cart").click();
    cy.get("li").should("contain", "×").and("contain", "zł");
  });

  it("5. Total is displayed", () => {
    cy.contains("li", "Coffee").find("button").click();
    cy.contains("Cart").click();
    cy.contains("Total:").should("exist");
  });

  it("6. Payment page shows inputs", () => {
    cy.contains("Payment").click();
    cy.get("input").should("have.attr", "placeholder", "Card number");
    cy.get("button").contains("Pay").should("exist");
  });

  it("7. Pay fails with empty input", () => {
    cy.contains("Payment").click();
    cy.get("button").contains("Pay").click();
    cy.get(".message").should("exist");
  });

  it("8. Pays with valid card number", () => {
    cy.contains("li", "Coffee").find("button").click();
    cy.contains("Payment").click();
    cy.get("input").type("4242424242424242");
    cy.get("button").contains("Pay").click();
    cy.get(".message").should("contain", "successfully");
  });

  it("9. Cart is empty after payment", () => {
    cy.contains("Cart").click();
    cy.contains("The cart is empty.").should("exist");
  });

  it("10. Can re-add product after payment", () => {
    cy.contains("Products").click();
    cy.contains("li", "Coffee").find("button").click();
    cy.contains("Cart").click();
    cy.get("li").should("have.length", 1);
  });

  it("11. Can remove item from cart", () => {
    cy.contains("Products").click();
    cy.contains("li", "Tea").find("button").click();
    cy.contains("Cart").click();
    cy.get("button").contains("Remove").click();
    cy.contains("The cart is empty.").should("exist");
  });

  it("12. Add multiple products to cart", () => {
    cy.contains("Products").click();
    cy.contains("li", "Coffee").find("button").click();
    cy.contains("li", "Tea").find("button").click();
    cy.contains("Cart").click();
    cy.get("li").should("have.length.at.least", 2);
  });

  it("13. Each product line includes × and zł", () => {
    cy.contains("li", "Coffee").find("button").click();
    cy.contains("li", "Juice").find("button").click();
    cy.contains("Cart").click();
    cy.get("li").each(($el) => {
      cy.wrap($el).should("contain", "×").and("contain", "zł");
    });
  });

  it("14. Total updates when adding products", () => {
    cy.contains("li", "Coffee").find("button").click();
    cy.contains("li", "Tea").find("button").click();
    cy.contains("Cart").click();
    cy.contains("Total:").should("exist");
  });

  it("15. Pays again successfully", () => {
    cy.contains("li", "Tea").find("button").click();
    cy.contains("Payment").click();
    cy.get("input").type("1234567812345678");
    cy.get("button").contains("Pay").click();
    cy.get(".message").should("contain", "successfully");
  });

  it("16. Confirms cart is reset again", () => {
    cy.contains("Cart").click();
    cy.get("li").should("have.length", 0);
  });

  it("17. Navbar navigation works", () => {
    cy.get("nav").should("contain", "Products");
    cy.get("nav").should("contain", "Cart");
    cy.get("nav").should("contain", "Payment");
  });

  it("18. Add to cart buttons exist", () => {
    cy.get("li button").contains("Add to cart").should("exist");
  });

  it("19. Invalid card number shows error", () => {
    cy.contains("Payment").click();
    cy.get("input").clear().type("123");
    cy.get("button").contains("Pay").click();
    cy.get(".message").should("exist");
  });

  it("20. Add product, reload, and verify cart still works", () => {
    cy.contains("li", "Juice").find("button").click();
    cy.reload();
    cy.contains("Cart").click();
    cy.get("li").should("have.length.at.least", 1);
  });
});
