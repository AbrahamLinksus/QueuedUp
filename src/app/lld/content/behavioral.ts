import type { LLDContent } from "./types";

export const BEHAVIORAL_CONTENT: LLDContent[] = [
  {
    slug: "iterator",
    title: "Iterator",
    section: "Design Patterns — Behavioral",
    tagline: "Traverse a collection without exposing its underlying structure",
    blocks: [
      {
        type: "text",
        md: "The **Iterator** pattern provides a way to sequentially access elements of a collection without exposing how the collection is stored internally. Whether the collection is a list, tree, graph, or database result set, the client always uses the same `__iter__` / `__next__` interface. Python's `for` loop is built entirely on this pattern.",
      },
      {
        type: "text",
        md: "In Python, implementing `__iter__` (returns the iterator object itself) and `__next__` (returns the next element or raises `StopIteration`) makes your class a full iterator that works with `for` loops, `list()`, `sum()`, and any other built-in that accepts iterables. This is one of the most useful dunder methods to understand.",
      },
      {
        type: "heading",
        text: "When to use",
      },
      {
        type: "bullets",
        items: [
          "You want a standard way to traverse different data structures",
          "You want multiple simultaneous traversals of the same collection",
          "You want lazy iteration over a potentially infinite or very large sequence",
          "Hiding the internal representation of a collection from its clients",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `class CountUpRange:
    """Custom iterator: counts from start to stop (inclusive) by step."""

    def __init__(self, start: int, stop: int, step: int = 1):
        self.start = start
        self.stop = stop
        self.step = step
        self._current = start

    def __iter__(self) -> "CountUpRange":
        self._current = self.start   # reset on each loop
        return self

    def __next__(self) -> int:
        if self._current > self.stop:
            raise StopIteration
        value = self._current
        self._current += self.step
        return value


# Works with for loops, list(), sum(), etc.
rng = CountUpRange(1, 10, 2)
for n in rng:
    print(n, end=" ")   # 1 3 5 7 9
print()

print(list(CountUpRange(0, 8, 3)))   # [0, 3, 6]
print(sum(CountUpRange(1, 100)))     # 5050

# Also works as a generator (Pythonic alternative)
def count_up(start, stop, step=1):
    current = start
    while current <= stop:
        yield current
        current += step

for n in count_up(1, 10, 2):
    print(n, end=" ")   # 1 3 5 7 9`,
        caption: "CountUpRange implements __iter__/__next__ so Python's for loop can drive it",
      },
    ],
  },
  {
    slug: "observer",
    title: "Observer",
    section: "Design Patterns — Behavioral",
    tagline: "Publish-subscribe — notify multiple objects when one object's state changes",
    blocks: [
      {
        type: "text",
        md: "The **Observer** pattern defines a one-to-many dependency between objects. When the subject (publisher) changes state, all its observers (subscribers) are automatically notified and updated. The subject doesn't know who its observers are — it just calls `update()` on each. This decoupling allows observers to be added or removed without changing the subject.",
      },
      {
        type: "text",
        md: "Observer is the foundation of event-driven programming, React's component re-rendering, and messaging systems. The subject maintains a list of observers and broadcasts changes to all of them. Pull model: observers receive a notification and then pull data from the subject. Push model: the subject sends the new data directly in the notification call.",
      },
      {
        type: "heading",
        text: "When to use",
      },
      {
        type: "bullets",
        items: [
          "A change in one object requires changing others, and you don't know how many",
          "An object should be able to notify others without assumptions about who those objects are",
          "Event systems, UI data binding, financial price feeds, notification systems",
          "Decoupling producer of events from consumers of events",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `from abc import ABC, abstractmethod


class Observer(ABC):
    @abstractmethod
    def update(self, symbol: str, price: float) -> None: ...


class StockMarket:
    """Subject (publisher) — notifies observers when stock prices change."""

    def __init__(self):
        self._observers: list[Observer] = []
        self._prices: dict[str, float] = {}

    def subscribe(self, observer: Observer) -> None:
        self._observers.append(observer)

    def unsubscribe(self, observer: Observer) -> None:
        self._observers.remove(observer)

    def set_price(self, symbol: str, price: float) -> None:
        self._prices[symbol] = price
        self._notify(symbol, price)

    def _notify(self, symbol: str, price: float) -> None:
        for obs in self._observers:
            obs.update(symbol, price)


class TradingBot(Observer):
    def update(self, symbol: str, price: float) -> None:
        if price < 100:
            print(f"TradingBot: BUY {symbol} at £{price:.2f}")
        elif price > 200:
            print(f"TradingBot: SELL {symbol} at £{price:.2f}")

class PriceAlertService(Observer):
    def update(self, symbol: str, price: float) -> None:
        print(f"PriceAlert: {symbol} is now £{price:.2f}")


market = StockMarket()
market.subscribe(TradingBot())
market.subscribe(PriceAlertService())

market.set_price("AAPL", 95.50)
market.set_price("AAPL", 215.00)`,
        caption: "StockMarket notifies TradingBot and PriceAlertService whenever a stock price changes",
      },
    ],
  },
  {
    slug: "strategy",
    title: "Strategy",
    section: "Design Patterns — Behavioral",
    tagline: "Swap algorithms at runtime — encapsulate families of algorithms behind one interface",
    blocks: [
      {
        type: "text",
        md: "The **Strategy** pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable. It lets the algorithm vary independently from clients that use it. Instead of a long `if/elif` chain switching between sorting algorithms, you define a `SortStrategy` interface and inject whichever concrete strategy you want at runtime.",
      },
      {
        type: "text",
        md: "The context object holds a reference to a strategy and delegates the algorithm to it. The client can change the strategy at any time. This follows OCP — adding a new algorithm means adding a new class, not modifying the context. Python's `sorted(key=...)` and `list.sort(key=...)` are themselves built on this pattern: the `key` function is the strategy.",
      },
      {
        type: "heading",
        text: "When to use",
      },
      {
        type: "bullets",
        items: [
          "Multiple related classes differ only in their behaviour",
          "You need different variants of an algorithm that you want to switch at runtime",
          "An algorithm uses data the client shouldn't know about",
          "A class defines many behaviours that appear as multiple conditionals — extract them",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `from abc import ABC, abstractmethod


class SortStrategy(ABC):
    @abstractmethod
    def sort(self, data: list[int]) -> list[int]: ...


class BubbleSort(SortStrategy):
    def sort(self, data: list[int]) -> list[int]:
        arr = list(data)
        n = len(arr)
        for i in range(n):
            for j in range(n - i - 1):
                if arr[j] > arr[j + 1]:
                    arr[j], arr[j + 1] = arr[j + 1], arr[j]
        return arr

class MergeSort(SortStrategy):
    def sort(self, data: list[int]) -> list[int]:
        if len(data) <= 1:
            return list(data)
        mid = len(data) // 2
        left = self.sort(data[:mid])
        right = self.sort(data[mid:])
        return self._merge(left, right)

    def _merge(self, l: list[int], r: list[int]) -> list[int]:
        result, i, j = [], 0, 0
        while i < len(l) and j < len(r):
            if l[i] <= r[j]:
                result.append(l[i]); i += 1
            else:
                result.append(r[j]); j += 1
        return result + l[i:] + r[j:]

class QuickSort(SortStrategy):
    def sort(self, data: list[int]) -> list[int]:
        if len(data) <= 1: return list(data)
        pivot = data[len(data) // 2]
        left  = [x for x in data if x < pivot]
        mid   = [x for x in data if x == pivot]
        right = [x for x in data if x > pivot]
        return self.sort(left) + mid + self.sort(right)


class SortContext:
    def __init__(self, strategy: SortStrategy):
        self._strategy = strategy

    def set_strategy(self, strategy: SortStrategy) -> None:
        self._strategy = strategy

    def sort(self, data: list[int]) -> list[int]:
        return self._strategy.sort(data)


data = [64, 34, 25, 12, 22, 11, 90]
ctx = SortContext(BubbleSort())
print(ctx.sort(data))
ctx.set_strategy(QuickSort())
print(ctx.sort(data))`,
        caption: "SortContext swaps between BubbleSort, MergeSort, and QuickSort at runtime",
      },
    ],
  },
  {
    slug: "command",
    title: "Command",
    section: "Design Patterns — Behavioral",
    tagline: "Encapsulate requests as objects — enable undo/redo, queuing, and logging of operations",
    blocks: [
      {
        type: "text",
        md: "The **Command** pattern encapsulates a request as an object, allowing you to parameterise clients with different requests, queue or log requests, and support undoable operations. Each command object knows how to execute an operation AND how to undo it. An Invoker (like a menu or button) just calls `execute()` without knowing what operation it triggers.",
      },
      {
        type: "text",
        md: "The pattern separates the object that invokes the operation (Invoker) from the object that performs it (Receiver). The Command object bridges them. For undo/redo, a history stack of executed commands is maintained. `Ctrl+Z` pops the last command and calls `undo()`. This is how virtually every text editor, drawing tool, and game implements undo.",
      },
      {
        type: "heading",
        text: "When to use",
      },
      {
        type: "bullets",
        items: [
          "You want to parameterise objects with an operation (pass commands as arguments)",
          "You want to queue, schedule, or log operations",
          "You need undo/redo functionality",
          "You want to implement transactional behaviour — execute a batch of operations atomically",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `from abc import ABC, abstractmethod


class Command(ABC):
    @abstractmethod
    def execute(self) -> None: ...

    @abstractmethod
    def undo(self) -> None: ...


class TextEditor:
    """Receiver — knows how to perform text operations."""
    def __init__(self):
        self.text = ""

    def insert(self, text: str) -> None:
        self.text += text

    def delete(self, n: int) -> None:
        self.text = self.text[:-n] if n <= len(self.text) else ""


class InsertCommand(Command):
    def __init__(self, editor: TextEditor, text: str):
        self._editor = editor
        self._text = text

    def execute(self) -> None:
        self._editor.insert(self._text)

    def undo(self) -> None:
        self._editor.delete(len(self._text))


class DeleteCommand(Command):
    def __init__(self, editor: TextEditor, n: int):
        self._editor = editor
        self._n = n
        self._deleted = ""

    def execute(self) -> None:
        self._deleted = self._editor.text[-self._n:]
        self._editor.delete(self._n)

    def undo(self) -> None:
        self._editor.insert(self._deleted)


class EditorInvoker:
    """Maintains command history for undo/redo."""
    def __init__(self):
        self._history: list[Command] = []

    def run(self, cmd: Command) -> None:
        cmd.execute()
        self._history.append(cmd)

    def undo(self) -> None:
        if self._history:
            self._history.pop().undo()


editor   = TextEditor()
invoker  = EditorInvoker()
invoker.run(InsertCommand(editor, "Hello"))
invoker.run(InsertCommand(editor, ", World"))
print(editor.text)   # Hello, World
invoker.undo()
print(editor.text)   # Hello
invoker.undo()
print(editor.text)   # (empty)`,
        caption: "TextEditor with Command undo stack — InsertCommand and DeleteCommand are reversible",
      },
    ],
  },
  {
    slug: "state",
    title: "State",
    section: "Design Patterns — Behavioral",
    tagline: "Object changes behaviour when internal state changes — eliminates state-conditional logic",
    blocks: [
      {
        type: "text",
        md: "The **State** pattern allows an object to alter its behaviour when its internal state changes. The object will appear to change its class. Instead of writing a `VendingMachine` with massive `if self.state == 'idle': ... elif self.state == 'has_money': ...` blocks, you create a class for each state that knows what to do in that state, and the context simply delegates to the current state object.",
      },
      {
        type: "text",
        md: "The state object also handles transitions — it tells the context which state to switch to next. This means adding a new state is isolated: create a new state class and update the transitions in the states it can be reached from. The context's code doesn't change. This dramatically reduces the complexity of state machines in practice.",
      },
      {
        type: "heading",
        text: "When to use",
      },
      {
        type: "bullets",
        items: [
          "An object's behaviour depends on its state, and the state can change at runtime",
          "Operations have large multi-part conditionals that depend on the object's state",
          "States transition into each other in complex ways",
          "Traffic lights, vending machines, game characters, TCP connections, order workflows",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `from __future__ import annotations
from abc import ABC, abstractmethod


class VendingMachineState(ABC):
    @abstractmethod
    def insert_coin(self, machine: "VendingMachine") -> None: ...

    @abstractmethod
    def select_item(self, machine: "VendingMachine") -> None: ...

    @abstractmethod
    def dispense(self, machine: "VendingMachine") -> None: ...


class IdleState(VendingMachineState):
    def insert_coin(self, machine: "VendingMachine") -> None:
        print("Coin inserted. Select an item.")
        machine.set_state(HasMoneyState())

    def select_item(self, machine: "VendingMachine") -> None:
        print("Please insert a coin first.")

    def dispense(self, machine: "VendingMachine") -> None:
        print("Please insert a coin first.")


class HasMoneyState(VendingMachineState):
    def insert_coin(self, machine: "VendingMachine") -> None:
        print("Coin already inserted. Select an item.")

    def select_item(self, machine: "VendingMachine") -> None:
        print("Item selected. Dispensing...")
        machine.set_state(DispensingState())

    def dispense(self, machine: "VendingMachine") -> None:
        print("Select an item first.")


class DispensingState(VendingMachineState):
    def insert_coin(self, machine: "VendingMachine") -> None:
        print("Please wait — dispensing in progress.")

    def select_item(self, machine: "VendingMachine") -> None:
        print("Please wait — dispensing in progress.")

    def dispense(self, machine: "VendingMachine") -> None:
        print("Item dispensed! Thank you.")
        machine.set_state(IdleState())


class VendingMachine:
    def __init__(self):
        self._state: VendingMachineState = IdleState()

    def set_state(self, state: VendingMachineState) -> None:
        self._state = state

    def insert_coin(self): self._state.insert_coin(self)
    def select_item(self): self._state.select_item(self)
    def dispense(self):    self._state.dispense(self)


vm = VendingMachine()
vm.select_item()    # Please insert a coin first.
vm.insert_coin()    # Coin inserted. Select an item.
vm.select_item()    # Item selected. Dispensing...
vm.dispense()       # Item dispensed! Thank you.`,
        caption: "VendingMachine delegates behaviour to current state — no giant if/elif blocks",
      },
    ],
  },
  {
    slug: "template-method",
    title: "Template Method",
    section: "Design Patterns — Behavioral",
    tagline: "Define a skeleton algorithm in a base class — subclasses fill in specific steps",
    blocks: [
      {
        type: "text",
        md: "The **Template Method** pattern defines the skeleton of an algorithm in a base class method, deferring some steps to subclasses. The base class calls abstract 'hook' methods at the right points in the algorithm, and subclasses override only those hooks without changing the overall structure. 'Don't call us, we'll call you' — the Hollywood Principle.",
      },
      {
        type: "text",
        md: "Template Method is about inheritance: the base class controls the sequence of steps. This is different from Strategy (which uses composition to swap the entire algorithm). Template Method is great when you have multiple classes that share the same high-level algorithm structure but differ in specific steps — like different data parsers that all read, parse, validate, and output, but parse differently.",
      },
      {
        type: "heading",
        text: "When to use",
      },
      {
        type: "bullets",
        items: [
          "Multiple classes implement the same algorithm structure with different specific steps",
          "You want to control extension points — subclasses can only override the 'hooks'",
          "Avoid code duplication — the common skeleton lives in one place",
          "Data processors, report generators, game AI turn sequences, test setup/teardown",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `from abc import ABC, abstractmethod


class DataProcessor(ABC):
    """Template: read → parse → validate → save. Only parse() changes."""

    def process(self, path: str) -> None:
        raw = self.read(path)
        data = self.parse(raw)
        if self.validate(data):
            self.save(data)
        else:
            print("Validation failed — data not saved.")

    def read(self, path: str) -> str:
        print(f"Reading file: {path}")
        return f"raw content of {path}"   # simulate file read

    @abstractmethod
    def parse(self, raw: str) -> dict: ...   # subclass fills this in

    def validate(self, data: dict) -> bool:
        return bool(data)   # default validation — can be overridden

    def save(self, data: dict) -> None:
        print(f"Saving data: {data}")


class CSVProcessor(DataProcessor):
    def parse(self, raw: str) -> dict:
        print("Parsing as CSV")
        return {"format": "csv", "rows": 10, "source": raw}


class JSONProcessor(DataProcessor):
    def parse(self, raw: str) -> dict:
        print("Parsing as JSON")
        return {"format": "json", "keys": ["name", "age"], "source": raw}


class XMLProcessor(DataProcessor):
    def parse(self, raw: str) -> dict:
        print("Parsing as XML")
        return {"format": "xml", "nodes": 5, "source": raw}

    def validate(self, data: dict) -> bool:
        return data.get("nodes", 0) > 0   # override validation for XML


CSVProcessor().process("data.csv")
JSONProcessor().process("data.json")
XMLProcessor().process("data.xml")`,
        caption: "DataProcessor template: read+validate+save are shared; only parse() varies per subclass",
      },
    ],
  },
  {
    slug: "visitor",
    title: "Visitor",
    section: "Design Patterns — Behavioral",
    tagline: "Add operations to objects without changing them — separate algorithm from object structure",
    blocks: [
      {
        type: "text",
        md: "The **Visitor** pattern lets you add new operations to a class hierarchy without modifying the classes. You define a `Visitor` interface with a visit method for each concrete element type. Each element implements `accept(visitor)` which calls `visitor.visit_circle(self)` (or the appropriate method). The visitor carries the operation logic; the elements just dispatch to the right visitor method.",
      },
      {
        type: "text",
        md: "This is known as 'double dispatch' in Python. The first dispatch is calling `accept()` on a shape (determines the runtime type of the shape). The second dispatch is calling the visitor's appropriate method (carries the specific operation). Visitor is ideal when you have a stable element hierarchy but frequently add new operations over it.",
      },
      {
        type: "heading",
        text: "When to use",
      },
      {
        type: "bullets",
        items: [
          "You need to add many distinct operations to a class hierarchy without polluting it",
          "The object structure rarely changes but you often define new operations",
          "Operations need to work across classes in the hierarchy (e.g. calculate cost of mixed item types)",
          "Compilers (AST traversal), document export, serialisation, reporting",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `from abc import ABC, abstractmethod
import math


class ShapeVisitor(ABC):
    @abstractmethod
    def visit_circle(self, circle: "Circle") -> float: ...

    @abstractmethod
    def visit_rectangle(self, rect: "Rectangle") -> float: ...


class Shape(ABC):
    @abstractmethod
    def accept(self, visitor: ShapeVisitor) -> float: ...


class Circle(Shape):
    def __init__(self, radius: float): self.radius = radius
    def accept(self, visitor: ShapeVisitor) -> float:
        return visitor.visit_circle(self)   # double dispatch

class Rectangle(Shape):
    def __init__(self, w: float, h: float): self.w = w; self.h = h
    def accept(self, visitor: ShapeVisitor) -> float:
        return visitor.visit_rectangle(self)


# New operations without touching Shape, Circle, or Rectangle
class AreaCalculator(ShapeVisitor):
    def visit_circle(self, c: Circle) -> float:
        return math.pi * c.radius ** 2
    def visit_rectangle(self, r: Rectangle) -> float:
        return r.w * r.h

class PerimeterCalculator(ShapeVisitor):
    def visit_circle(self, c: Circle) -> float:
        return 2 * math.pi * c.radius
    def visit_rectangle(self, r: Rectangle) -> float:
        return 2 * (r.w + r.h)


shapes: list[Shape] = [Circle(5), Rectangle(4, 6), Circle(3)]
area_calc = AreaCalculator()
perim_calc = PerimeterCalculator()

for s in shapes:
    print(f"{type(s).__name__}: area={s.accept(area_calc):.2f}, "
          f"perim={s.accept(perim_calc):.2f}")`,
        caption: "AreaCalculator and PerimeterCalculator added as visitors without modifying Shape classes",
      },
    ],
  },
  {
    slug: "mediator",
    title: "Mediator",
    section: "Design Patterns — Behavioral",
    tagline: "Central coordinator — objects communicate via a mediator instead of directly with each other",
    blocks: [
      {
        type: "text",
        md: "The **Mediator** pattern defines an object that encapsulates how a set of objects interact. Objects no longer communicate directly with each other — they all send messages to the mediator, which decides what to do and who to notify. This reduces many-to-many relationships between objects to a star topology where everything passes through the mediator.",
      },
      {
        type: "text",
        md: "Without Mediator, a chat room where users message each other would require each user to hold references to all other users. With Mediator, each user only knows about the ChatRoom. Adding or removing users doesn't change how any existing user works — only the mediator's participant list changes. Air traffic control (planes don't talk to each other, only to the tower) is the classic analogy.",
      },
      {
        type: "heading",
        text: "When to use",
      },
      {
        type: "bullets",
        items: [
          "Many objects communicate in complex ways, resulting in tight coupling",
          "You want to reuse objects that interact with many others",
          "Customising behaviour distributed across many classes without much subclassing",
          "Chat rooms, air traffic control, event bus, UI form coordination",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `from __future__ import annotations


class ChatRoom:
    """Mediator — routes messages between users."""

    def __init__(self, name: str):
        self.name = name
        self._users: dict[str, "User"] = {}

    def join(self, user: "User") -> None:
        self._users[user.username] = user
        self.broadcast(f"{user.username} joined the room.", sender=None)

    def send_message(self, message: str, sender: "User") -> None:
        for username, user in self._users.items():
            if username != sender.username:
                user.receive(f"[{sender.username}]: {message}")

    def send_private(self, message: str, sender: "User", to: str) -> None:
        recipient = self._users.get(to)
        if recipient:
            recipient.receive(f"[DM from {sender.username}]: {message}")
        else:
            sender.receive(f"User {to!r} not found.")

    def broadcast(self, message: str, sender: "User | None") -> None:
        for user in self._users.values():
            user.receive(f"[System]: {message}")


class User:
    def __init__(self, username: str, room: ChatRoom):
        self.username = username
        self._room = room
        room.join(self)

    def send(self, message: str) -> None:
        print(f"{self.username} says: {message}")
        self._room.send_message(message, self)

    def whisper(self, to: str, message: str) -> None:
        self._room.send_private(message, self, to)

    def receive(self, message: str) -> None:
        print(f"  >> {self.username} received: {message}")


room = ChatRoom("Python Devs")
alice = User("Alice", room)
bob   = User("Bob",   room)
carol = User("Carol", room)

alice.send("Hey everyone!")
bob.whisper("Alice", "Nice to meet you!")`,
        caption: "ChatRoom mediator — users only know about the room, not about each other",
      },
    ],
  },
  {
    slug: "memento",
    title: "Memento",
    section: "Design Patterns — Behavioral",
    tagline: "Capture and restore object state — snapshot-based undo without exposing internals",
    blocks: [
      {
        type: "text",
        md: "The **Memento** pattern captures an object's internal state and stores it outside the object, so it can be restored later — without violating encapsulation. Three roles: **Originator** (the object whose state is saved), **Memento** (an opaque snapshot of the state), and **Caretaker** (stores mementos but never looks inside them). The originator creates and restores from mementos; the caretaker just holds them.",
      },
      {
        type: "text",
        md: "The key design constraint is that the Memento is opaque to the Caretaker — it can hold it and give it back, but it cannot read or modify the state inside. This preserves encapsulation. Only the Originator knows what a Memento contains and how to restore from it. The Caretaker manages the history (a list of mementos for undo/redo).",
      },
      {
        type: "heading",
        text: "When to use",
      },
      {
        type: "bullets",
        items: [
          "You need to save snapshots of an object's state for later restoration (undo)",
          "A direct interface to getting the state would expose implementation details",
          "Text editors, game save states, database transaction rollbacks, form wizards",
          "You want to separate state management from the core object logic",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `from dataclasses import dataclass


@dataclass(frozen=True)
class EditorMemento:
    """Opaque snapshot — only TextEditor can interpret it."""
    content: str
    cursor_pos: int


class TextEditor:
    """Originator — creates and restores mementos."""

    def __init__(self):
        self._content = ""
        self._cursor = 0

    def type(self, text: str) -> None:
        self._content = (self._content[:self._cursor]
                         + text
                         + self._content[self._cursor:])
        self._cursor += len(text)

    def save(self) -> EditorMemento:
        return EditorMemento(self._content, self._cursor)

    def restore(self, memento: EditorMemento) -> None:
        self._content = memento.content
        self._cursor  = memento.cursor_pos

    def show(self) -> None:
        print(f"Content: {self._content!r}  cursor={self._cursor}")


class History:
    """Caretaker — manages memento stack, never peeks inside."""

    def __init__(self, editor: TextEditor):
        self._editor = editor
        self._stack: list[EditorMemento] = []

    def backup(self) -> None:
        self._stack.append(self._editor.save())

    def undo(self) -> None:
        if not self._stack:
            print("Nothing to undo.")
            return
        self._editor.restore(self._stack.pop())


editor  = TextEditor()
history = History(editor)

history.backup()
editor.type("Hello")
history.backup()
editor.type(", World")
editor.show()   # Hello, World

history.undo()
editor.show()   # Hello

history.undo()
editor.show()   # (empty)`,
        caption: "EditorMemento snapshots editor state; History caretaker manages the undo stack",
      },
    ],
  },
  {
    slug: "chain-of-responsibility",
    title: "Chain of Responsibility",
    section: "Design Patterns — Behavioral",
    tagline: "Pass requests along a handler chain — each handler decides to process or forward",
    blocks: [
      {
        type: "text",
        md: "The **Chain of Responsibility** pattern passes a request along a chain of handlers. Each handler either handles the request or passes it to the next handler in the chain. The sender doesn't know which handler will process the request — it just sends it into the chain. This decouples senders from receivers and lets you compose processing pipelines dynamically.",
      },
      {
        type: "text",
        md: "Common implementations set a `next_handler` attribute on each handler. When `handle()` is called, the handler checks if it can process the request. If yes, it processes it. If no, it delegates to `self.next_handler.handle(request)`. The chain can be assembled at runtime in any order. Middleware stacks, logging pipelines, and support escalation systems all use this pattern.",
      },
      {
        type: "heading",
        text: "When to use",
      },
      {
        type: "bullets",
        items: [
          "More than one object may handle a request, and the handler is not known a priori",
          "You want to issue a request without specifying the receiver explicitly",
          "The set of handlers should be specified dynamically",
          "Support ticket escalation, middleware pipelines, event bubbling in UIs, auth layers",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass
from enum import IntEnum


class Priority(IntEnum):
    LOW    = 1
    MEDIUM = 2
    HIGH   = 3


@dataclass
class SupportTicket:
    title: str
    priority: Priority


class SupportHandler(ABC):
    def __init__(self):
        self._next: SupportHandler | None = None

    def set_next(self, handler: SupportHandler) -> SupportHandler:
        self._next = handler
        return handler   # allows chaining: h1.set_next(h2).set_next(h3)

    @abstractmethod
    def handle(self, ticket: SupportTicket) -> None: ...

    def pass_to_next(self, ticket: SupportTicket) -> None:
        if self._next:
            self._next.handle(ticket)
        else:
            print(f"No handler for ticket: {ticket.title!r}")


class L1Handler(SupportHandler):
    def handle(self, ticket: SupportTicket) -> None:
        if ticket.priority == Priority.LOW:
            print(f"L1 resolved: {ticket.title!r}")
        else:
            print(f"L1 escalating: {ticket.title!r}")
            self.pass_to_next(ticket)

class L2Handler(SupportHandler):
    def handle(self, ticket: SupportTicket) -> None:
        if ticket.priority == Priority.MEDIUM:
            print(f"L2 resolved: {ticket.title!r}")
        else:
            print(f"L2 escalating: {ticket.title!r}")
            self.pass_to_next(ticket)

class L3Handler(SupportHandler):
    def handle(self, ticket: SupportTicket) -> None:
        print(f"L3 (senior engineer) resolved: {ticket.title!r}")


l1 = L1Handler()
l2 = L2Handler()
l3 = L3Handler()
l1.set_next(l2).set_next(l3)

tickets = [
    SupportTicket("Password reset", Priority.LOW),
    SupportTicket("API down", Priority.MEDIUM),
    SupportTicket("Data breach detected", Priority.HIGH),
]
for t in tickets:
    l1.handle(t)`,
        caption: "Support tickets escalate through L1 → L2 → L3 chain; each handles what it can",
      },
    ],
  },
];
