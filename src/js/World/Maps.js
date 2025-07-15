import { Person } from "../Objects/Person.js";
import { utils } from "../utils.js";

const x = utils.withGrid(5);
const y = utils.withGrid(5);

export const OverworldMaps = {
  DemoRoom: {
    lowerSrc: './src/assets/maps/DemoLower.png',
    upperSrc: './src/assets/maps/DemoUpper.png',
    gameObjects: {
      hero: new Person({ x: utils.withGrid(5), y: utils.withGrid(10), isPlayerControlled: true, direction: "up" }),
      npcA: new Person({
        x: utils.withGrid(4), y: utils.withGrid(7), src: "./src/assets/characters/people/npc1.png", direction: "up",
        behaviourLoop: [
          { type: "walk", direction: "left" },
          { type: "stand", direction: "left", time: 800 },
          { type: "walk", direction: "right" },
          { type: "stand", direction: "right", time: 800 },
        ],
        talking: [
          {
            required: ["TALKED_TO_ERIO"],
            events: [
              { type: "textMessage", text: "Isn't Erio the coolest ?", faceHero: "npcA" },
            ]
          },
          {
            events: [
              { type: "textMessage", text: "I'm going to crush you", faceHero: "npcA" },
              { type: "battle", enemyId: "beth" },
              { type: "addStoryFlag", flag: "DEFEATED_BETH" },
              { type: "textMessage", text: "You crushed me like weak pepper", faceHero: "npcA" },
            ]
          },
          // {
          //   required: ["LOST_BATTLE"],
          //   events: [
          //     { type: "textMessage", text: "You are weak come back later", faceHero: "npcA" },
          //   ]
          // },
        ]
      }),
      npcB: new Person({
        x: utils.withGrid(8), y: utils.withGrid(5), src: "./src/assets/characters/people/erio.png", direction: "up",
        behaviourLoop: [
          { type: "stand", direction: "up", time: 800 },
          { type: "stand", direction: "up", time: 300 },
          { type: "stand", direction: "right", time: 1200 },
          { type: "stand", direction: "down", time: 600 },
        ],
        talking: [
          {
            events: [
              { type: "textMessage", text: "Bahaha!", faceHero: "npcB" },
              { type: "addStoryFlag", flag: "TALKED_TO_ERIO" },
              // { type: "battle", enemyId: "erio" },
            ]
          }
        ]
      }),
    },
    walls: {
      [utils.asGridCoord(7, 6)]: true,
      [utils.asGridCoord(8, 6)]: true,
      [utils.asGridCoord(7, 7)]: true,
      [utils.asGridCoord(8, 7)]: true,
    },
    cutsceneSpaces: {
      [utils.asGridCoord(7, 4)]: [
        {
          events: [
            { who: "npcB", type: "walk", direction: "left" },
            { who: "npcB", type: "stand", direction: "up", time: 500 },
            { type: "textMessage", text: "You cannot be in here!" },
            { who: "npcB", type: "walk", direction: "right" },
            { who: "hero", type: "walk", direction: "down" },
            { who: "hero", type: "walk", direction: "left" },
          ]
        }
      ],
      [utils.asGridCoord(5, 10)]: [
        {
          events: [
            { type: "changeMap", map: "Kitchen" },
          ]
        }
      ]
    }
  },
  Kitchen: {
    lowerSrc: './src/assets/maps/KitchenLower.png',
    upperSrc: './src/assets/maps/KitchenUpper.png',
    gameObjects: {
      hero: new Person({ x, y, isPlayerControlled: true, direction: "down", }),
      npcA: new Person({
        x: utils.withGrid(2), y: utils.withGrid(6), src: "./src/assets/characters/people/npc4.png", direction: "left",
        talking: [
          {
            events: [
              { type: "textMessage", text: "HELLO THERE FRIEND, you wanna cook some (not suspiscious) MEDICINE ?", faceHero: "npcA" },
            ]
          }
        ]
      }),
    },
    cutsceneSpaces: {
      [utils.asGridCoord(5, 10)]: [
        {
          events: [
            { type: "changeMap", map: "DemoRoom" },
          ]
        }
      ]
    }
  },
};