import type { LLDContent } from "./types";

export const UML_CONTENT: LLDContent[] = [
  {
    slug: "class-diagram",
    title: "Class Diagram",
    section: "UML Diagrams",
    tagline: "Structure of classes, attributes, methods, and their relationships at a glance",
    blocks: [
      {
        type: "text",
        md: "A **class diagram** is the most commonly used UML diagram. It shows the static structure of a system — the classes, their attributes and methods, and the relationships between them. Class diagrams are the blueprint you draw before writing code, and the documentation you produce after. Every LLD interview answer should be accompanied by a class diagram sketch.",
      },
      {
        type: "text",
        md: "Each class box has three compartments: the class name at the top, attributes in the middle, and methods at the bottom. Visibility is shown with `+` (public), `-` (private), and `#` (protected). Relationships have different line styles: **association** (plain line), **aggregation** (hollow diamond), **composition** (filled diamond), **inheritance** (open arrow), and **dependency** (dashed arrow).",
      },
      {
        type: "heading",
        text: "Key elements",
      },
      {
        type: "bullets",
        items: [
          "Class box: 3 compartments — name | attributes | methods",
          "Visibility: `+` public, `-` private, `#` protected",
          "Inheritance: open arrow from subclass pointing to superclass",
          "Composition: filled diamond on the owner side",
          "Aggregation: hollow diamond on the container side",
          "Multiplicity: `1`, `0..*`, `1..*`, `0..1` on relationship ends",
        ],
      },
      {
        type: "heading",
        text: "Example: e-commerce system",
      },
      {
        type: "code",
        lang: "text",
        code: `+----------------------+          +----------------------+
|        User          |          |        Order         |
+----------------------+          +----------------------+
| - id: int            |  1    *  | - id: int            |
| - name: str          |----------| - status: str        |
| - email: str         |  places  | - created_at: date   |
+----------------------+          | - total: float       |
| + register()         |          +----------------------+
| + login()            |          | + add_item()         |
| + get_orders()       |          | + cancel()           |
+----------------------+          | + calculate_total()  |
                                  +----------+-----------+
                                             | contains *
                                             | (composition)
                                  +----------v-----------+
                                  |      OrderItem       |
                                  +----------------------+
                                  | - quantity: int      |
                                  | - unit_price: float  |
                                  +----------------------+
                                  | + subtotal()         |
                                  +----------+-----------+
                                             | refers to 1
                                  +----------v-----------+
                                  |       Product        |
                                  +----------------------+
                                  | - id: int            |
                                  | - name: str          |
                                  | - price: float       |
                                  | - stock: int         |
                                  +----------------------+
                                  | + update_stock()     |
                                  +----------------------+`,
        caption: "E-commerce class diagram: User places Orders which compose OrderItems referencing Products",
      },
      {
        type: "heading",
        text: "How to read it",
      },
      {
        type: "bullets",
        items: [
          "A User places 0 or more Orders (1 to * relationship)",
          "An Order is composed of 1 or more OrderItems (filled diamond = lifecycle dependency)",
          "Each OrderItem references exactly one Product (association arrow)",
          "If an Order is deleted, its OrderItems are also deleted (composition semantics)",
          "Products exist independently of Orders (association, not composition)",
        ],
      },
    ],
  },
  {
    slug: "use-case-diagram",
    title: "Use Case Diagram",
    section: "UML Diagrams",
    tagline: "Who does what — actors, use cases, and system boundaries at a glance",
    blocks: [
      {
        type: "text",
        md: "A **use case diagram** shows the functional requirements of a system from the user's perspective. It answers: who uses this system (actors), and what can they do with it (use cases)? It is deliberately high-level — no implementation details, just the interactions between external entities and the system. Use case diagrams are useful early in a project to align on scope.",
      },
      {
        type: "text",
        md: "The key elements are: **actors** (stick figures representing users or external systems), **use cases** (ovals representing a goal the actor can achieve), the **system boundary** (a rectangle around the use cases), and relationship lines. `<<include>>` means one use case always includes another. `<<extend>>` means one use case optionally extends another under certain conditions.",
      },
      {
        type: "heading",
        text: "Key elements",
      },
      {
        type: "bullets",
        items: [
          "Actor: a role that interacts with the system — human user or external system",
          "Use case (oval): a goal the actor can accomplish through the system",
          "System boundary (rectangle): what is inside vs outside the system",
          "`<<include>>`: the base use case always triggers the included use case",
          "`<<extend>>`: an optional extension triggered under specific conditions",
          "Association (plain line): connects actor to their use cases",
        ],
      },
      {
        type: "heading",
        text: "Example: ATM system",
      },
      {
        type: "code",
        lang: "text",
        code: `+----------------------------------------------+
|                  ATM System                  |
|                                              |
|  (Withdraw Cash) ----<<include>>---+         |
|       |                            |         |
|  (Deposit Cash)  ----<<include>>---+--> (Authenticate)
|       |                            |         |
|  (Check Balance) ----<<include>>---+         |
|                                              |
|  (Change PIN)    ----<<include>>---+         |
|                                              |
|  (Print Receipt) ....<<extend>>....          |
|         extends Withdraw Cash optionally     |
+----------------------------------------------+
     |
  [Customer]

+----------------------------------------------+
|  (Load Cash) <--- [Bank Teller]              |
+----------------------------------------------+`,
        caption: "ATM use case: Customer and Bank Teller actors, Authenticate included by all main actions",
      },
      {
        type: "heading",
        text: "How to read it",
      },
      {
        type: "bullets",
        items: [
          "Every use case connected to an actor is a goal they can initiate",
          "All three main actions <<include>> Authenticate — it always happens",
          "Print Receipt <<extend>> Withdraw — optional, only if user requests it",
          "Bank Teller is a separate actor with their own use case (Load Cash)",
          "Everything inside the rectangle is in scope for this system",
        ],
      },
    ],
  },
  {
    slug: "sequence-diagram",
    title: "Sequence Diagram",
    section: "UML Diagrams",
    tagline: "Message flow over time — who calls who, and in what order",
    blocks: [
      {
        type: "text",
        md: "A **sequence diagram** shows how objects interact with each other in time-ordered sequence. It is read left to right (participants) and top to bottom (time). Each participant has a vertical **lifeline**, and messages between participants are shown as horizontal arrows. Sequence diagrams are excellent for documenting API flows, authentication sequences, and distributed system interactions.",
      },
      {
        type: "text",
        md: "Solid arrows represent synchronous calls (caller waits for response); dashed return arrows show the response. **Activation boxes** (thin rectangles on the lifeline) show when a participant is actively processing. `alt` frames show conditional branches (like if/else), `loop` frames show repetition, and `ref` frames reference another sequence diagram.",
      },
      {
        type: "heading",
        text: "Key elements",
      },
      {
        type: "bullets",
        items: [
          "Participants (boxes at top): actors or objects in the interaction",
          "Lifelines (dashed vertical lines): the existence of a participant over time",
          "Solid arrow (-->): synchronous message / method call",
          "Dashed arrow (<--): return value / response",
          "Activation box (thin rectangle): period of active execution",
          "`alt` frame: conditional logic; `loop` frame: repeated interaction",
        ],
      },
      {
        type: "heading",
        text: "Example: user login sequence",
      },
      {
        type: "code",
        lang: "text",
        code: `Browser          Server           Database
   |                |                  |
   | POST /login    |                  |
   | {user, pass}   |                  |
   |--------------->|                  |
   |                | SELECT * FROM    |
   |                | users WHERE      |
   |                | email = ?        |
   |                |----------------->|
   |                |                  |
   |                |   User record    |
   |                |<-----------------|
   |                |                  |
   |         [verify password hash]    |
   |                |                  |
   |    alt         |                  |
   |   [valid]      |                  |
   |  200 + JWT     |                  |
   |<---------------|                  |
   |                |                  |
   |   [invalid]    |                  |
   |  401 Unauth.   |                  |
   |<---------------|                  |
   |                |                  |`,
        caption: "Login sequence: Browser sends credentials, Server checks DB, returns JWT or 401",
      },
      {
        type: "heading",
        text: "How to read it",
      },
      {
        type: "bullets",
        items: [
          "Read top to bottom — earlier events are higher on the diagram",
          "Each arrow is one message or method call; label it with the message name",
          "The `alt` block shows two alternative paths — only one executes per scenario",
          "Dashed return arrows can be omitted for simple calls where the return is obvious",
          "Activation boxes show which participant is actively processing at each moment",
        ],
      },
    ],
  },
  {
    slug: "activity-diagram",
    title: "Activity Diagram",
    section: "UML Diagrams",
    tagline: "Workflow and logic flow — steps, decisions, and parallel paths through a process",
    blocks: [
      {
        type: "text",
        md: "An **activity diagram** models the workflow or logic flow of a system — it is similar to a flowchart but with richer UML semantics. It shows the sequence of actions, decision points, parallel execution (forks/joins), and start/end nodes. Activity diagrams are ideal for documenting complex business processes, algorithm logic, or the internal flow of a use case.",
      },
      {
        type: "text",
        md: "The start node is a filled black circle; the end node is a filled circle inside a ring. Decision nodes (diamonds) split the flow into conditional branches. Fork bars (thick horizontal lines) split into parallel flows, and join bars merge them back. **Swimlanes** can be added to show which actor or component is responsible for each activity.",
      },
      {
        type: "heading",
        text: "Key elements",
      },
      {
        type: "bullets",
        items: [
          "Start node: filled black circle",
          "End node: filled circle inside a ring",
          "Action: rounded rectangle — one step in the process",
          "Decision: diamond with condition labels on outgoing arrows",
          "Fork/Join: thick horizontal bar — creates or merges parallel flows",
          "Swimlane: vertical partition showing which actor performs which action",
        ],
      },
      {
        type: "heading",
        text: "Example: order processing flow",
      },
      {
        type: "code",
        lang: "text",
        code: `        (start)
           |
           v
   +---------------+
   |  Place Order  |
   +-------+-------+
           |
           v
   +---------------+
   |  Check Stock  |
   +-------+-------+
           |
        <decision> -- In stock? --+
           | Yes                  | No
           |              +-------v-------+
           |              | Notify: Out   |
           |              | of Stock      |
           |              +-------+-------+
           |                      |
           v                      v
   +---------------+           (end)
   | Process Pay.  |
   +-------+-------+
           |
        <decision> -- Payment OK? --+
           | Yes                    | No
           |                +-------v-------+
           |                | Send Failed   |
           |                | Email         |
           |                +-------+-------+
           |                        |
           v                     (end)
   ================== (fork) ==================
           |                        |
           v                        v
   +---------------+       +---------------+
   |  Ship Order   |       |  Send Confirm |
   |               |       |  Email        |
   +-------+-------+       +-------+-------+
           |                        |
   ================== (join) ==================
           |
           v
   +---------------+
   |  Close Order  |
   +-------+-------+
           |
         (end)`,
        caption: "Order processing: stock check, payment decision, parallel ship+email, close",
      },
    ],
  },
  {
    slug: "state-machine-diagram",
    title: "State Machine Diagram",
    section: "UML Diagrams",
    tagline: "Object lifecycle — states an object can be in and events that trigger transitions",
    blocks: [
      {
        type: "text",
        md: "A **state machine diagram** (also called a statechart) models the different states an object can be in throughout its lifetime, and the events or conditions that cause it to transition from one state to another. It answers: what states can this object be in, and what must happen to move between them? State machines are particularly useful for orders, tickets, workflows, and UI components.",
      },
      {
        type: "text",
        md: "Each state is a rounded rectangle. Transitions are arrows labelled with the **event** that triggers them, optionally a **guard condition** in square brackets, and an **action** after a `/`. The initial pseudostate is a filled black circle. The final state is a filled circle inside a ring. State machines make invalid state transitions visible and help you design validation logic.",
      },
      {
        type: "heading",
        text: "Key elements",
      },
      {
        type: "bullets",
        items: [
          "State (rounded box): a stable condition the object can be in",
          "Transition (arrow): moves the object from one state to another",
          "Event (label on arrow): what triggers the transition",
          "Guard [condition]: transition only fires if the condition is true",
          "Action /action: side-effect that happens when the transition fires",
          "Initial state (filled circle) and Final state (circle inside ring)",
        ],
      },
      {
        type: "heading",
        text: "Example: order states",
      },
      {
        type: "code",
        lang: "text",
        code: `        (start)
           |
           v
   +---------------+
   |    PLACED     |---cancel_requested---> +------------+
   +-------+-------+                        | CANCELLED  |
           | payment_confirmed              +------------+
           v
   +---------------+
   |  PROCESSING   |---cancel_requested---> CANCELLED
   +-------+-------+
           | items_picked
           v
   +---------------+
   |    SHIPPED    |
   +-------+-------+
           | delivered
           v
   +---------------+
   |   DELIVERED   |
   +---------------+
         (end)


   Restock path:
   PROCESSING --restock_failed [retry]--> +-------------+
                                          | BACK_ORDER  |
                                          +------+------+
                                                 | restocked
                                                 v
                                           PROCESSING`,
        caption: "Order lifecycle: Placed > Processing > Shipped > Delivered, with Cancelled and BackOrder branches",
      },
      {
        type: "heading",
        text: "How to read it",
      },
      {
        type: "bullets",
        items: [
          "Start at the filled circle — this is where the object begins its life",
          "Follow labelled arrows to see what event causes each transition",
          "States with no outgoing arrows (DELIVERED, CANCELLED) are terminal states",
          "A guard `[retry]` means the transition only fires under that condition",
          "Use this to validate business rules: a SHIPPED order cannot go to PROCESSING",
        ],
      },
    ],
  },
];
