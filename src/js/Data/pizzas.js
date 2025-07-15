export const PizzaTypes = Object.freeze({
  normal: "normal",
  spicy: "spicy",
  veggie: "veggie",
  fungi: "fungi",
  chill: "chill",
});

export const Pizzas = Object.freeze({
  "s001": {
    name: "Pyro pizza",
    description: "Fire, fire, fire...",
    type: PizzaTypes.spicy,
    src: "./src/assets/characters/pizzas/s001.png",
    icon: "./src/assets/icons/spicy.png",
    actions: ["saucyStatus", "clumsyStatus", "damage1"],
  },
  "s002": {
    name: "Samourai brigade",
    description: "I will kill you...",
    type: PizzaTypes.spicy,
    src: "./src/assets/characters/pizzas/s002.png",
    icon: "./src/assets/icons/spicy.png",
    actions: ["damage1", "saucyStatus", "clumsyStatus"],
  },
  "v001": {
    name: "Call Me Kale",
    description: "Vegans are crazy btw",
    type: PizzaTypes.veggie,
    src: "./src/assets/characters/pizzas/v001.png",
    icon: "./src/assets/icons/veggie.png",
    actions: ["damage1"],
  },
  "f001": {
    name: "Portobello Express",
    description: "Pizza or train we don't know...",
    type: PizzaTypes.fungi,
    src: "./src/assets/characters/pizzas/f001.png",
    icon: "./src/assets/icons/fungi.png",
    actions: ["damage1"],
  },
  "c001": {
    name: "Slice Samourai",
    description: "Cousin of pyro pizza",
    type: PizzaTypes.chill,
    src: "./src/assets/characters/pizzas/c001.png",
    icon: "./src/assets/icons/chill.png",
    actions: ["damage1"],
  },
})