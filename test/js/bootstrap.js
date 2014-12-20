/**
 * starship data is bootstrapped in the HTML, so we simulate that here
 */

var bootstrap = {
  configurations: [
    { cost: "1.2", id: "1", name: "Needle" }
  ],
  starships: [
    { id: "545c53a77c6e192dc6000001", name: "Credibility Problem", mass: "1000000", configuration: "Sphere" },
    { id: "545c565f7c6e192dc6000003", name: "Not Invented Here", mass: "50000", configuration: "Needle" }
  ],
  starship: { id: "545c565f7c6e192dc6000003", name: "Not Invented Here", mass: "50000", configuration: "Needle" }
}

window.bootstrap = bootstrap;
