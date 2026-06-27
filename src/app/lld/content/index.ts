import type { LLDContent } from "./types";

// Re-export everything as content files are populated
export { OOP_CONTENT } from "./oop";
export { PRINCIPLES_CONTENT } from "./principles";
export { UML_CONTENT } from "./uml";
export { CREATIONAL_CONTENT } from "./creational";
export { STRUCTURAL_CONTENT } from "./structural";
export { BEHAVIORAL_CONTENT } from "./behavioral";
export { TIPS_CONTENT } from "./tips";
export { EASY_CONTENT } from "./easy";
export { MEDIUM_CONTENT } from "./medium";
export { HARD_CONTENT } from "./hard";

import { OOP_CONTENT } from "./oop";
import { PRINCIPLES_CONTENT } from "./principles";
import { UML_CONTENT } from "./uml";
import { CREATIONAL_CONTENT } from "./creational";
import { STRUCTURAL_CONTENT } from "./structural";
import { BEHAVIORAL_CONTENT } from "./behavioral";
import { TIPS_CONTENT } from "./tips";
import { EASY_CONTENT } from "./easy";
import { MEDIUM_CONTENT } from "./medium";
import { HARD_CONTENT } from "./hard";

export const ALL_CONTENT: LLDContent[] = [
  ...OOP_CONTENT,
  ...PRINCIPLES_CONTENT,
  ...UML_CONTENT,
  ...CREATIONAL_CONTENT,
  ...STRUCTURAL_CONTENT,
  ...BEHAVIORAL_CONTENT,
  ...TIPS_CONTENT,
  ...EASY_CONTENT,
  ...MEDIUM_CONTENT,
  ...HARD_CONTENT,
];

export const CONTENT_BY_SLUG = new Map(ALL_CONTENT.map((c) => [c.slug, c]));
