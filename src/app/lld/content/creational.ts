import type { LLDContent } from "./types";

export const CREATIONAL_CONTENT: LLDContent[] = [
  {
    slug: "singleton",
    title: "Singleton",
    section: "Design Patterns — Creational",
    tagline: "One instance for the whole app — thread-safe global access point",
    blocks: [
      {
        type: "text",
        md: "The **Singleton** pattern ensures that a class has only one instance and provides a global access point to it. It is useful when exactly one object is needed to coordinate actions across the system — a configuration manager, a connection pool, or a logging system. Without Singleton, multiple instantiations could produce inconsistent state.",
      },
      {
        type: "text",
        md: "In Python, a naive Singleton can be broken in multi-threaded code if two threads check 'does an instance exist?' simultaneously, both see `None`, and both create an instance. The solution is to use a `threading.Lock` so only one thread can enter the creation code at a time. The double-checked locking pattern avoids acquiring the lock on every call after the instance exists.",
      },
      {
        type: "heading",
        text: "When to use",
      },
      {
        type: "bullets",
        items: [
          "A shared resource must be accessed from many places but created once (DB connection pool)",
          "Configuration that must be consistent across the entire application",
          "A logging system that all modules write to",
          "Hardware interface managers where multiple instances would cause conflicts",
        ],
      },
      {
        type: "text",
        md: "**Real-world analogy**: A country's government — there is only one government at a time, and it provides a single point of access for governance.",
      },
      {
        type: "code",
        lang: "python",
        code: `import threading


class Logger:
    _instance: "Logger | None" = None
    _lock: threading.Lock = threading.Lock()

    def __new__(cls) -> "Logger":
        if cls._instance is None:
            with cls._lock:                  # thread-safe creation
                if cls._instance is None:    # double-checked locking
                    cls._instance = super().__new__(cls)
                    cls._instance._log_entries: list[str] = []
        return cls._instance

    def log(self, message: str) -> None:
        entry = f"[LOG] {message}"
        self._log_entries.append(entry)
        print(entry)

    def get_history(self) -> list[str]:
        return list(self._log_entries)


# Same object every time
logger1 = Logger()
logger2 = Logger()
logger1.log("Application started")
logger2.log("User logged in")

print(logger1 is logger2)          # True — same instance
print(len(logger1.get_history()))  # 2 — both loggers share state`,
        caption: "Thread-safe Singleton Logger using double-checked locking with threading.Lock",
      },
    ],
  },
  {
    slug: "factory-method",
    title: "Factory Method",
    section: "Design Patterns — Creational",
    tagline: "Let subclasses decide which class to instantiate — defer object creation to subclasses",
    blocks: [
      {
        type: "text",
        md: "The **Factory Method** pattern defines an interface for creating an object but lets subclasses decide which class to instantiate. The creator class has an abstract `create_product()` method — each subclass overrides it to create a different product. This decouples the creator from the concrete product classes and makes it easy to add new product types without modifying existing code.",
      },
      {
        type: "text",
        md: "The key insight is that Factory Method is about *inheritance-based* creation. The abstract creator provides a template for an operation and calls `create_product()` as part of it. Concrete creators plug in their specific product. This differs from the Simple Factory (a switch statement), and from Abstract Factory (which uses composition to create families).",
      },
      {
        type: "heading",
        text: "When to use",
      },
      {
        type: "bullets",
        items: [
          "The exact class to create is not known until runtime",
          "You want subclasses to control what gets created",
          "Adding a new product type should not require changes to existing creators",
          "You need to provide a hook for subclasses to extend a framework's creation logic",
        ],
      },
      {
        type: "text",
        md: "**Real-world analogy**: A logistics company uses different transport methods (truck, ship, plane) — each subsidiary handles creating the appropriate transport, but they all follow the same delivery process.",
      },
      {
        type: "code",
        lang: "python",
        code: `from abc import ABC, abstractmethod


# Product interface
class Notification(ABC):
    @abstractmethod
    def send(self, message: str) -> None: ...


# Concrete products
class EmailNotification(Notification):
    def __init__(self, email: str): self.email = email
    def send(self, message: str):
        print(f"Email to {self.email}: {message}")

class SMSNotification(Notification):
    def __init__(self, phone: str): self.phone = phone
    def send(self, message: str):
        print(f"SMS to {self.phone}: {message}")

class PushNotification(Notification):
    def __init__(self, device: str): self.device = device
    def send(self, message: str):
        print(f"Push to {self.device}: {message}")


# Creator abstract class with factory method
class NotificationFactory(ABC):
    @abstractmethod
    def create_notification(self) -> Notification: ...

    def notify(self, message: str) -> None:
        notif = self.create_notification()   # factory method call
        notif.send(message)


# Concrete creators — each decides which product to make
class EmailFactory(NotificationFactory):
    def __init__(self, email: str): self.email = email
    def create_notification(self): return EmailNotification(self.email)

class SMSFactory(NotificationFactory):
    def __init__(self, phone: str): self.phone = phone
    def create_notification(self): return SMSNotification(self.phone)

class PushFactory(NotificationFactory):
    def __init__(self, device: str): self.device = device
    def create_notification(self): return PushNotification(self.device)


EmailFactory("alice@example.com").notify("Your order shipped!")
SMSFactory("+447700000000").notify("Your order shipped!")
PushFactory("device-abc123").notify("Your order shipped!")`,
        caption: "Factory Method: each NotificationFactory subclass decides which Notification to create",
      },
    ],
  },
  {
    slug: "abstract-factory",
    title: "Abstract Factory",
    section: "Design Patterns — Creational",
    tagline: "Family of related objects without specifying concrete classes — consistent cross-platform UIs",
    blocks: [
      {
        type: "text",
        md: "The **Abstract Factory** pattern provides an interface for creating *families* of related objects without specifying their concrete classes. While Factory Method uses inheritance, Abstract Factory uses composition — a factory object creates multiple related products. The key benefit is that all products from one factory are guaranteed to be compatible with each other.",
      },
      {
        type: "text",
        md: "The classic example is a cross-platform UI toolkit. A `WindowsFactory` creates a Windows Button and a Windows Checkbox. A `MacFactory` creates a Mac Button and a Mac Checkbox. Client code uses the factory interface and never knows which platform it runs on. Swap the factory and the entire UI family changes consistently — you never get a Mac button paired with a Windows checkbox.",
      },
      {
        type: "heading",
        text: "When to use",
      },
      {
        type: "bullets",
        items: [
          "A system must be independent of how its products are created",
          "A system must work with multiple families of products (Windows vs Mac, Light vs Dark theme)",
          "You want to enforce that products from the same family are used together",
          "You want to provide a class library of products and reveal only their interfaces",
        ],
      },
      {
        type: "text",
        md: "**Real-world analogy**: A furniture showroom sells matching sets — the EKTORP sofa and EKTORP armchair are designed to go together. A different family (SÖDERHAMN) is internally consistent but stylistically separate.",
      },
      {
        type: "code",
        lang: "python",
        code: `from abc import ABC, abstractmethod


# Abstract products
class Button(ABC):
    @abstractmethod
    def render(self) -> str: ...

class Checkbox(ABC):
    @abstractmethod
    def render(self) -> str: ...


# Windows product family
class WindowsButton(Button):
    def render(self): return "[ Windows Button ]"

class WindowsCheckbox(Checkbox):
    def render(self): return "[x] Windows Checkbox"


# Mac product family
class MacButton(Button):
    def render(self): return "(  Mac Button  )"

class MacCheckbox(Checkbox):
    def render(self): return "(x) Mac Checkbox"


# Abstract factory interface
class UIFactory(ABC):
    @abstractmethod
    def create_button(self) -> Button: ...

    @abstractmethod
    def create_checkbox(self) -> Checkbox: ...


# Concrete factories — each produces a consistent family
class WindowsFactory(UIFactory):
    def create_button(self): return WindowsButton()
    def create_checkbox(self): return WindowsCheckbox()

class MacFactory(UIFactory):
    def create_button(self): return MacButton()
    def create_checkbox(self): return MacCheckbox()


def build_ui(factory: UIFactory) -> None:
    btn = factory.create_button()
    chk = factory.create_checkbox()
    print(btn.render(), "|", chk.render())

build_ui(WindowsFactory())   # [ Windows Button ] | [x] Windows Checkbox
build_ui(MacFactory())       # (  Mac Button  )   | (x) Mac Checkbox`,
        caption: "Swap WindowsFactory for MacFactory to get an entire consistent UI family",
      },
    ],
  },
  {
    slug: "builder",
    title: "Builder",
    section: "Design Patterns — Creational",
    tagline: "Construct complex objects step by step — readable chaining over telescoping constructors",
    blocks: [
      {
        type: "text",
        md: "The **Builder** pattern separates the construction of a complex object from its representation. Instead of a constructor with many parameters (the 'telescoping constructor' anti-pattern), you use a builder that sets each attribute through chained method calls and then produces the final object via a `build()` call. This makes object creation readable, flexible, and self-documenting.",
      },
      {
        type: "text",
        md: "An optional **Director** class can encapsulate specific construction sequences (like 'build a Margherita pizza') so that the same Director can produce different products depending on which builder it's given. The builder holds the state during construction; the Director knows the steps; the product is the result. Builders shine when some parameters are optional and have sensible defaults.",
      },
      {
        type: "heading",
        text: "When to use",
      },
      {
        type: "bullets",
        items: [
          "The constructor would need more than 4-5 parameters — a common code smell",
          "Some constructor parameters are optional and have sensible defaults",
          "You want to produce different representations using the same construction process",
          "Step-by-step construction is needed (SQL query builders, configuration builders)",
        ],
      },
      {
        type: "text",
        md: "**Real-world analogy**: Ordering a custom pizza — you tell the server your crust, size, sauce, and toppings one by one. The kitchen (Director) assembles it in the correct sequence.",
      },
      {
        type: "code",
        lang: "python",
        code: `from __future__ import annotations
from dataclasses import dataclass


@dataclass
class Pizza:
    size: str
    crust: str
    sauce: str
    toppings: list[str]

    def __str__(self) -> str:
        tops = ", ".join(self.toppings) or "none"
        return f"{self.size} | {self.crust} crust | {self.sauce} sauce | toppings: {tops}"


class PizzaBuilder:
    def __init__(self) -> None:
        self._size = "medium"
        self._crust = "thin"
        self._sauce = "tomato"
        self._toppings: list[str] = []

    def set_size(self, size: str) -> PizzaBuilder:
        self._size = size
        return self

    def set_crust(self, crust: str) -> PizzaBuilder:
        self._crust = crust
        return self

    def set_sauce(self, sauce: str) -> PizzaBuilder:
        self._sauce = sauce
        return self

    def add_topping(self, topping: str) -> PizzaBuilder:
        self._toppings.append(topping)
        return self

    def build(self) -> Pizza:
        return Pizza(self._size, self._crust, self._sauce, list(self._toppings))


class PizzaDirector:
    """Knows specific pizza recipes."""

    def margherita(self, b: PizzaBuilder) -> Pizza:
        return b.set_size("large").set_sauce("tomato").add_topping("mozzarella").build()

    def bbq_chicken(self, b: PizzaBuilder) -> Pizza:
        return (b.set_size("large").set_crust("thick").set_sauce("bbq")
                 .add_topping("chicken").add_topping("onion").build())


director = PizzaDirector()
print(director.margherita(PizzaBuilder()))
print(director.bbq_chicken(PizzaBuilder()))
# Custom order without director
custom = PizzaBuilder().set_size("small").add_topping("pepperoni").build()
print(custom)`,
        caption: "PizzaBuilder with chained methods and an optional Director for known recipes",
      },
    ],
  },
  {
    slug: "prototype",
    title: "Prototype",
    section: "Design Patterns — Creational",
    tagline: "Clone existing objects instead of creating from scratch — avoid costly initialisation",
    blocks: [
      {
        type: "text",
        md: "The **Prototype** pattern creates new objects by copying (cloning) an existing object rather than creating one from scratch. This is useful when object creation is expensive (e.g. querying a database or doing heavy computation) and you need many similar objects. You create one prototype, clone it, and then customise the clone rather than repeating the expensive setup.",
      },
      {
        type: "text",
        md: "Python's `copy` module provides `copy.copy()` for shallow copies and `copy.deepcopy()` for deep copies. A **shallow copy** duplicates the top-level object but nested mutable objects still share references. A **deep copy** recursively copies everything, producing a fully independent object. For Prototype, you almost always want `deepcopy` so clones are truly independent.",
      },
      {
        type: "heading",
        text: "When to use",
      },
      {
        type: "bullets",
        items: [
          "Object creation is expensive and you need many similar instances",
          "Classes to instantiate are specified at runtime",
          "You want to avoid building a factory class hierarchy that mirrors product hierarchy",
          "Objects have complex state that is easier to copy than reconstruct from parameters",
        ],
      },
      {
        type: "text",
        md: "**Real-world analogy**: Biological cell division — a cell copies itself rather than being built from raw materials each time. Or a document template that you duplicate and then customise.",
      },
      {
        type: "code",
        lang: "python",
        code: `import copy


class Shape:
    def __init__(self, color: str, x: int, y: int):
        self.color = color
        self.x = x
        self.y = y
        self.tags: list[str] = []

    def clone(self) -> "Shape":
        return copy.deepcopy(self)   # fully independent deep copy

    def __repr__(self) -> str:
        return (f"{type(self).__name__}(color={self.color!r}, "
                f"pos=({self.x},{self.y}), tags={self.tags})")


class Circle(Shape):
    def __init__(self, color: str, x: int, y: int, radius: float):
        super().__init__(color, x, y)
        self.radius = radius

    def __repr__(self) -> str:
        return (f"Circle(color={self.color!r}, pos=({self.x},{self.y}), "
                f"r={self.radius}, tags={self.tags})")


# Prototype registry
class ShapeRegistry:
    def __init__(self):
        self._prototypes: dict[str, Shape] = {}

    def register(self, name: str, shape: Shape) -> None:
        self._prototypes[name] = shape

    def create(self, name: str) -> Shape:
        proto = self._prototypes.get(name)
        if not proto:
            raise KeyError(f"No prototype: {name!r}")
        return proto.clone()


registry = ShapeRegistry()
registry.register("red-circle", Circle("red", 0, 0, 5.0))

c1 = registry.create("red-circle")
c2 = registry.create("red-circle")
c1.color = "blue"
c1.tags.append("selected")

print(c1)   # Circle(color='blue', ..., tags=['selected'])
print(c2)   # Circle(color='red', ..., tags=[]) — unaffected`,
        caption: "Prototype registry — clone shapes instead of reconstructing; mutations on clones don't affect others",
      },
    ],
  },
];
