import type { LLDContent } from "./types";

export const TIPS_CONTENT: LLDContent[] = [
  {
    slug: "how-to-answer-lld-questions",
    title: "How to Answer LLD Interview Questions",
    section: "LLD Interview Tips",
    tagline: "5-step approach to ace any system design low-level round — clarify, entities, relationships, API, trade-offs",
    blocks: [
      {
        type: "text",
        md: "LLD interviews are not about producing perfect code in 45 minutes. They are about demonstrating that you can think systematically about software design, communicate clearly, and make principled trade-offs. Interviewers are evaluating your **thought process** as much as your output.",
      },
      {
        type: "heading",
        text: "The 5-Step Approach",
      },
      {
        type: "bullets",
        items: [
          "**Step 1 — Clarify requirements**: Ask questions before writing a single class",
          "**Step 2 — Identify core entities**: What are the real-world nouns in this system?",
          "**Step 3 — Define relationships**: How do entities relate? HAS-A, IS-A, uses?",
          "**Step 4 — Design the API / class skeleton**: Methods, return types, key operations",
          "**Step 5 — Discuss trade-offs**: What did you sacrifice? What are the alternatives?",
        ],
      },
      {
        type: "heading",
        text: "Step 1: Clarify Requirements",
      },
      {
        type: "text",
        md: "Never start designing immediately. Spend 3-5 minutes asking questions. Interviewers deliberately leave requirements vague to see if you notice. Distinguish between **functional requirements** (what the system must do) and **non-functional requirements** (performance, scale, consistency).",
      },
      {
        type: "bullets",
        items: [
          "Functional: 'What actions can a user take? What are the core features?'",
          "Non-functional: 'How many concurrent users? Any real-time requirements?'",
          "'Should I handle authentication, or just assume users are logged in?'",
          "'Are there any specific edge cases you want me to handle?'",
          "'Should I focus on the happy path first and add error handling later?'",
          "For LLD specifically: 'Should I focus on the class design or also write implementation?'",
        ],
      },
      {
        type: "heading",
        text: "Step 2: Identify Core Entities",
      },
      {
        type: "text",
        md: "Extract the **nouns** from the requirements — these become your classes. For a Parking Lot: parking lot, floor, spot, vehicle, ticket, payment. Group them: which are primary entities (core of the domain) vs supporting entities (enums, value objects, helpers)?",
      },
      {
        type: "bullets",
        items: [
          "Primary entities become classes with state and behaviour",
          "Enums for finite sets of values (SpotType.SMALL, Status.OCCUPIED)",
          "Value objects for immutable data bundles (Money, Address, Coordinates)",
          "Write entity names on the whiteboard/paper before drawing relationships",
          "Ask yourself: 'Does this concept exist in the real world independently?'",
        ],
      },
      {
        type: "heading",
        text: "Step 3: Define Relationships",
      },
      {
        type: "text",
        md: "For each pair of entities, ask: what is the relationship? Draw a rough UML class diagram. Mark cardinalities (1-to-1, 1-to-many, many-to-many). Identify which relationships are composition (part cannot exist without whole) vs aggregation (part can exist independently).",
      },
      {
        type: "bullets",
        items: [
          "IS-A (inheritance): `ElectricCar IS-A Car` — use subclassing carefully",
          "HAS-A strong (composition): `Order HAS OrderItems` — item dies with order",
          "HAS-A weak (aggregation): `Department HAS Employees` — employee lives on",
          "USES (association/dependency): `OrderService USES PaymentGateway`",
          "Many-to-many: `Student ↔ Course` — usually needs a join entity (Enrollment)",
        ],
      },
      {
        type: "heading",
        text: "Step 4: Design the API",
      },
      {
        type: "text",
        md: "Write class skeletons with method signatures. Don't implement yet — show the interface. Think about: what data goes in, what comes out, what exceptions could be thrown, what validations are needed. The method signatures are the contract.",
      },
      {
        type: "bullets",
        items: [
          "Start with the most important class and work outward",
          "Method names should be verbs: `book_ride()`, `process_payment()`, `cancel_order()`",
          "Return types matter: does `get_user()` return `User | None`? or raise `UserNotFound`?",
          "Show constructor dependencies — this reveals your design's coupling",
          "Mention thread-safety if concurrent access is possible",
        ],
      },
      {
        type: "heading",
        text: "Step 5: Discuss Trade-offs",
      },
      {
        type: "text",
        md: "This is where senior engineers shine. Every design decision has an alternative. Talk through what you chose and why, what you gave up, and what you'd do differently at scale.",
      },
      {
        type: "bullets",
        items: [
          "'I used a list for simplicity; in production I'd use a heap for priority queue'",
          "'I chose composition over inheritance here because the alternative explodes class count'",
          "'I didn't implement caching but would add a Redis cache layer in production'",
          "'This design is single-machine; for distributed we'd need a central lock manager'",
          "'I used polling; push notifications via WebSockets would reduce latency'",
        ],
      },
      {
        type: "heading",
        text: "Common Mistakes to Avoid",
      },
      {
        type: "bullets",
        items: [
          "Jumping to code before understanding requirements — the most common failure",
          "Over-engineering: don't build a microservice architecture for a Tic Tac Toe",
          "Under-engineering: skipping error handling, enums, or validation entirely",
          "Ignoring relationships: standalone classes with no connections don't show design skill",
          "Missing obvious edge cases: what if the parking lot is full? what if payment fails?",
          "Not narrating your thought process — silence is worse than thinking out loud",
          "Designing only the happy path without mentioning how you'd extend it",
        ],
      },
      {
        type: "heading",
        text: "Handling Scale Questions in LLD",
      },
      {
        type: "text",
        md: "LLD interviews sometimes blur into HLD territory with questions like 'how would this scale to a million users?' You don't need to design distributed systems, but you should know the scaling bottlenecks in your design and mention mitigation strategies.",
      },
      {
        type: "bullets",
        items: [
          "Identify shared mutable state: concurrent bookings, inventory counts, wallet balances",
          "Suggest database-level locking or optimistic concurrency for race conditions",
          "Mention caching layers (Redis) for read-heavy data like product catalogues",
          "Connection pooling for database access at scale",
          "Queue-based decoupling (Kafka/SQS) for write-heavy async flows",
          "If they push further, acknowledge you'd need HLD discussion for full distributed design",
        ],
      },
      {
        type: "heading",
        text: "What Interviewers Actually Look For",
      },
      {
        type: "bullets",
        items: [
          "**Clarity of thinking**: can you decompose a problem into logical parts?",
          "**Communication**: do you explain decisions as you make them?",
          "**OOP fundamentals**: correct use of encapsulation, inheritance, polymorphism",
          "**Principled design**: SOLID principles, design patterns where appropriate",
          "**Pragmatism**: not gold-plating, solving the problem at hand",
          "**Anticipating change**: 'If we added X feature later, the design would need...'",
          "**Confidence in trade-offs**: knowing why you chose A over B",
        ],
      },
      {
        type: "heading",
        text: "Worked Example: Designing a Parking Lot",
      },
      {
        type: "text",
        md: "Let's walk through the 5-step approach for a Parking Lot system to show how it works in practice.",
      },
      {
        type: "bullets",
        items: [
          "**Step 1 (Clarify)**: 'Multiple floors? Different vehicle sizes? Payment at exit or upfront? Need to track specific spots or just availability count?'",
          "**Step 2 (Entities)**: ParkingLot, ParkingFloor, ParkingSpot, Vehicle (Car/Bike/Truck), Ticket, Payment",
          "**Step 3 (Relationships)**: ParkingLot HAS many ParkingFloors (composition). Floor HAS many Spots (composition). Spot is currently occupied by one Vehicle (association). Ticket is issued to a Vehicle and tracks which Spot (association).",
          "**Step 4 (API)**: `ParkingLot.park(vehicle) -> Ticket | None`, `ParkingLot.unpark(ticket) -> Payment`, `ParkingFloor.find_spot(size) -> ParkingSpot | None`",
          "**Step 5 (Trade-offs)**: 'I used a flat list to find free spots — O(n). A production system would maintain a priority queue of free spots per size for O(log n) lookup. For concurrent access, each spot assignment should be atomic — I'd add a database transaction or optimistic locking.'",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `# Quick class skeleton — show this during an interview
from enum import Enum, auto
from dataclasses import dataclass, field
from datetime import datetime


class SpotSize(Enum):
    SMALL = auto()   # motorbikes
    MEDIUM = auto()  # cars
    LARGE = auto()   # trucks


class VehicleType(Enum):
    MOTORBIKE = auto()
    CAR = auto()
    TRUCK = auto()


VEHICLE_TO_SPOT = {
    VehicleType.MOTORBIKE: SpotSize.SMALL,
    VehicleType.CAR: SpotSize.MEDIUM,
    VehicleType.TRUCK: SpotSize.LARGE,
}


@dataclass
class Vehicle:
    plate: str
    type: VehicleType


@dataclass
class ParkingSpot:
    spot_id: str
    size: SpotSize
    vehicle: Vehicle | None = None

    @property
    def is_free(self) -> bool:
        return self.vehicle is None


@dataclass
class Ticket:
    ticket_id: str
    vehicle: Vehicle
    spot: ParkingSpot
    entry_time: datetime = field(default_factory=datetime.now)


class ParkingLot:
    def __init__(self, name: str):
        self.name = name
        self._spots: list[ParkingSpot] = []

    def add_spot(self, spot: ParkingSpot) -> None:
        self._spots.append(spot)

    def park(self, vehicle: Vehicle) -> Ticket | None:
        required_size = VEHICLE_TO_SPOT[vehicle.type]
        for spot in self._spots:
            if spot.is_free and spot.size == required_size:
                spot.vehicle = vehicle
                return Ticket(f"T-{vehicle.plate}", vehicle, spot)
        return None   # lot full

    def unpark(self, ticket: Ticket) -> float:
        hours = (datetime.now() - ticket.entry_time).seconds / 3600
        ticket.spot.vehicle = None   # free the spot
        return max(1.0, hours) * 2.50   # £2.50/hour, min 1 hour


lot = ParkingLot("City Centre")
for i in range(3):
    lot.add_spot(ParkingSpot(f"M{i}", SpotSize.MEDIUM))

car = Vehicle("AB12 XYZ", VehicleType.CAR)
ticket = lot.park(car)
if ticket:
    print(f"Parked at spot {ticket.spot.spot_id}")
    print(f"Fee: £{lot.unpark(ticket):.2f}")`,
        caption: "Interview-ready Parking Lot skeleton — entities, enums, relationships, and core operations",
      },
    ],
  },
];
