export const PizzaTypes = Object.freeze({
  normal: "normal",
  spicy: "spicy",
  veggie: "veggie",
  fungi: "fungi",
  chill: "chill",
});

export const Pizzas = Object.freeze({
  "s001": {
    name: "Fire, fire, fire...",
    type: PizzaTypes.spicy,
    src: "../../src/assets/characters/pizzas/s001.png",
    icon: "../../src/assets/icons/spicy.png",
    actions: ["damage1"],
  },
  "v001": {
    name: "Call Me Kale",
    type: PizzaTypes.veggie,
    src: "../../src/assets/characters/pizzas/v001.png",
    icon: "../../src/assets/icons/veggie.png",
    actions: ["damage1"],
  },
  "f001": {
    name: "Portobello Express",
    type: PizzaTypes.fungi,
    src: "../../src/assets/characters/pizzas/f001.png",
    icon: "../../src/assets/icons/fungi.png",
    actions: ["damage1"],
  },
  "c001": {
    name: "Slice Samourai",
    type: PizzaTypes.chill,
    src: "../../src/assets/characters/pizzas/c001.png",
    icon: "../../src/assets/icons/chill.png",
    actions: ["damage1"],
  },
})