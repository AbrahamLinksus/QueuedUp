export type LLDItem = {
  title: string;
  slug: string;
  difficulty?: "EASY" | "MEDIUM" | "HARD";
};

export type LLDSection = {
  title: string;
  slug: string;
  items: LLDItem[];
};

const AM = "https://algomaster.io/learn/lld/";

function url(slug: string) {
  return `${AM}${slug}`;
}

export const LLD_SECTIONS: LLDSection[] = [
  {
    title: "Object Oriented Programming",
    slug: "oop",
    items: [
      { title: "Classes & Objects", slug: "classes-and-objects" },
      { title: "Interfaces", slug: "interfaces" },
      { title: "Inheritance", slug: "inheritance" },
      { title: "Polymorphism", slug: "polymorphism" },
      { title: "Abstraction", slug: "abstraction" },
      { title: "Encapsulation", slug: "encapsulation" },
      { title: "Aggregation", slug: "aggregation" },
      { title: "Composition", slug: "composition" },
      { title: "Association", slug: "association" },
    ],
  },
  {
    title: "Design Principles",
    slug: "design-principles",
    items: [
      { title: "Don't Repeat Yourself (DRY)", slug: "dry-principle" },
      { title: "Keep It Simple Stupid (KISS)", slug: "kiss-principle" },
      { title: "You Aren't Gonna Need It (YAGNI)", slug: "yagni-principle" },
      { title: "Law of Demeter (LoD)", slug: "law-of-demeter" },
      { title: "Single Responsibility Principle (SRP)", slug: "single-responsibility-principle" },
      { title: "Open/Closed Principle (OCP)", slug: "open-closed-principle" },
      { title: "Liskov Substitution Principle (LSP)", slug: "liskov-substitution-principle" },
      { title: "Interface Segregation Principle (ISP)", slug: "interface-segregation-principle" },
      { title: "Dependency Inversion Principle (DIP)", slug: "dependency-inversion-principle" },
      { title: "SOLID Principles Summary", slug: "solid-principles" },
    ],
  },
  {
    title: "UML Diagrams",
    slug: "uml",
    items: [
      { title: "Class Diagram", slug: "class-diagram" },
      { title: "Use Case Diagram", slug: "use-case-diagram" },
      { title: "Sequence Diagram", slug: "sequence-diagram" },
      { title: "Activity Diagram", slug: "activity-diagram" },
      { title: "State Machine Diagram", slug: "state-machine-diagram" },
    ],
  },
  {
    title: "Design Patterns — Creational",
    slug: "creational-patterns",
    items: [
      { title: "Singleton", slug: "singleton" },
      { title: "Factory Method", slug: "factory-method" },
      { title: "Abstract Factory", slug: "abstract-factory" },
      { title: "Builder", slug: "builder" },
      { title: "Prototype", slug: "prototype" },
    ],
  },
  {
    title: "Design Patterns — Structural",
    slug: "structural-patterns",
    items: [
      { title: "Adapter", slug: "adapter" },
      { title: "Facade", slug: "facade" },
      { title: "Decorator", slug: "decorator" },
      { title: "Composite", slug: "composite" },
      { title: "Proxy", slug: "proxy" },
      { title: "Bridge", slug: "bridge" },
      { title: "Flyweight", slug: "flyweight" },
    ],
  },
  {
    title: "Design Patterns — Behavioral",
    slug: "behavioral-patterns",
    items: [
      { title: "Iterator", slug: "iterator" },
      { title: "Observer", slug: "observer" },
      { title: "Strategy", slug: "strategy" },
      { title: "Command", slug: "command" },
      { title: "State", slug: "state" },
      { title: "Template Method", slug: "template-method" },
      { title: "Visitor", slug: "visitor" },
      { title: "Mediator", slug: "mediator" },
      { title: "Memento", slug: "memento" },
      { title: "Chain of Responsibility", slug: "chain-of-responsibility" },
    ],
  },
  {
    title: "LLD Interview Tips",
    slug: "tips",
    items: [
      { title: "How to Answer LLD Interview Questions", slug: "how-to-answer-lld-questions" },
    ],
  },
  {
    title: "Interview Questions — Easy",
    slug: "easy-problems",
    items: [
      { title: "Tic Tac Toe", slug: "tic-tac-toe", difficulty: "EASY" },
      { title: "Snake and Ladder", slug: "snake-and-ladder", difficulty: "EASY" },
      { title: "LRU Cache", slug: "lru-cache", difficulty: "EASY" },
      { title: "Parking Lot", slug: "parking-lot", difficulty: "EASY" },
      { title: "Task Management System", slug: "task-management-system", difficulty: "EASY" },
    ],
  },
  {
    title: "Interview Questions — Medium",
    slug: "medium-problems",
    items: [
      { title: "Stack Overflow", slug: "stack-overflow", difficulty: "MEDIUM" },
      { title: "ATM", slug: "atm", difficulty: "MEDIUM" },
      { title: "Logging Framework", slug: "logging-framework", difficulty: "MEDIUM" },
      { title: "Pub Sub System", slug: "pub-sub-system", difficulty: "MEDIUM" },
      { title: "Elevator System", slug: "elevator-system", difficulty: "MEDIUM" },
      { title: "Splitwise", slug: "splitwise", difficulty: "MEDIUM" },
      { title: "Vending Machine", slug: "vending-machine", difficulty: "MEDIUM" },
      { title: "Car Rental System", slug: "car-rental-system", difficulty: "MEDIUM" },
      { title: "Hotel Management System", slug: "hotel-management-system", difficulty: "MEDIUM" },
      { title: "Digital Wallet", slug: "digital-wallet", difficulty: "MEDIUM" },
      { title: "Airline Management System", slug: "airline-management-system", difficulty: "MEDIUM" },
      { title: "Library Management System", slug: "library-management-system", difficulty: "MEDIUM" },
      { title: "Traffic Signal Control", slug: "traffic-signal-control", difficulty: "MEDIUM" },
      { title: "Concert Ticket Booking", slug: "concert-ticket-booking", difficulty: "MEDIUM" },
      { title: "Social Network", slug: "social-network", difficulty: "MEDIUM" },
    ],
  },
  {
    title: "Interview Questions — Hard",
    slug: "hard-problems",
    items: [
      { title: "Spotify", slug: "spotify", difficulty: "HARD" },
      { title: "Amazon", slug: "amazon", difficulty: "HARD" },
      { title: "LinkedIn", slug: "linkedin", difficulty: "HARD" },
      { title: "CricInfo", slug: "cricinfo", difficulty: "HARD" },
      { title: "Chess", slug: "chess", difficulty: "HARD" },
      { title: "Coffee Vending Machine", slug: "coffee-vending-machine", difficulty: "HARD" },
      { title: "Restaurant Management System", slug: "restaurant-management-system", difficulty: "HARD" },
      { title: "Stock Exchange", slug: "stock-exchange", difficulty: "HARD" },
      { title: "Course Registration System", slug: "course-registration-system", difficulty: "HARD" },
      { title: "Movie Ticket Booking", slug: "movie-ticket-booking", difficulty: "HARD" },
      { title: "Online Auction System", slug: "online-auction-system", difficulty: "HARD" },
      { title: "Food Delivery System", slug: "food-delivery-system", difficulty: "HARD" },
      { title: "Ride-Sharing (Uber)", slug: "ride-sharing-app", difficulty: "HARD" },
    ],
  },
];

export const LLD_BASE_URL = AM;
export function lldUrl(slug: string) {
  return url(slug);
}

export const TOTAL_ITEMS = LLD_SECTIONS.reduce((s, sec) => s + sec.items.length, 0);
