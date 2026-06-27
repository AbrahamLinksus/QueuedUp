import type { LLDContent } from "./types";

export const STRUCTURAL_CONTENT: LLDContent[] = [
  {
    slug: "adapter",
    title: "Adapter",
    section: "Design Patterns — Structural",
    tagline: "Make incompatible interfaces work together — wrap the old to fit the new",
    blocks: [
      {
        type: "text",
        md: "The **Adapter** pattern converts the interface of a class into another interface that clients expect. It lets classes work together that otherwise couldn't because of incompatible interfaces. Think of it as a translator: you have existing code that calls a `NewPaymentGateway` interface, but you're integrating a legacy `OldPaymentGateway` whose method signatures are different. The Adapter wraps the old and speaks the new.",
      },
      {
        type: "text",
        md: "There are two forms: **object adapter** (wraps an instance via composition — preferred in Python) and **class adapter** (uses multiple inheritance). The object adapter is more flexible because you don't need the adaptee's source code and can adapt at runtime. Adapters are very common when integrating third-party libraries whose interfaces you cannot modify.",
      },
      {
        type: "heading",
        text: "When to use",
      },
      {
        type: "bullets",
        items: [
          "You want to use an existing class but its interface doesn't match what you need",
          "Integrating a third-party library whose API you cannot change",
          "You want to create a reusable class that cooperates with classes with incompatible interfaces",
          "Legacy system integration — wrapping the old so the rest of your code uses the new interface",
        ],
      },
      {
        type: "text",
        md: "**Real-world analogy**: A power plug adapter — your UK plug doesn't fit a US socket, so you use a physical adapter that converts the interface.",
      },
      {
        type: "code",
        lang: "python",
        code: `from abc import ABC, abstractmethod


# Target interface — what our code expects
class PaymentProcessor(ABC):
    @abstractmethod
    def pay(self, amount: float, currency: str) -> bool: ...


# Adaptee — existing legacy class with incompatible interface
class LegacyPaymentGateway:
    def make_payment(self, amount_cents: int, currency_code: str) -> str:
        """Returns 'SUCCESS' or 'FAILED'."""
        print(f"Legacy gateway: processing {amount_cents} cents in {currency_code}")
        return "SUCCESS"


# Adapter — makes LegacyPaymentGateway look like PaymentProcessor
class LegacyPaymentAdapter(PaymentProcessor):
    def __init__(self, legacy: LegacyPaymentGateway):
        self._legacy = legacy

    def pay(self, amount: float, currency: str) -> bool:
        # Translate: float pounds -> int cents, str -> uppercase
        cents = int(amount * 100)
        result = self._legacy.make_payment(cents, currency.upper())
        return result == "SUCCESS"


# Client code — only knows about PaymentProcessor
def checkout(processor: PaymentProcessor, total: float) -> None:
    if processor.pay(total, "gbp"):
        print("Payment successful!")
    else:
        print("Payment failed.")


legacy = LegacyPaymentGateway()
adapter = LegacyPaymentAdapter(legacy)
checkout(adapter, 29.99)   # client doesn't know it's talking to legacy code`,
        caption: "LegacyPaymentAdapter wraps the old gateway so it fits the new PaymentProcessor interface",
      },
    ],
  },
  {
    slug: "facade",
    title: "Facade",
    section: "Design Patterns — Structural",
    tagline: "Simplified interface to a complex subsystem — one entry point, many moving parts",
    blocks: [
      {
        type: "text",
        md: "The **Facade** pattern provides a simplified, unified interface to a complex subsystem of classes. The client doesn't need to know about the DVD player, projector, amplifier, and lights that make up a home theater — they just call `watch_movie()` on the Facade and everything is coordinated. The Facade hides subsystem complexity but doesn't prevent advanced users from accessing subsystems directly.",
      },
      {
        type: "text",
        md: "Facade is not just 'a wrapper' — it actively simplifies the interaction. It combines multiple steps into logical operations, provides a sensible default ordering, and shields clients from changes to the subsystem. A good Facade makes the 80% use case trivial while the 20% power user can still bypass it.",
      },
      {
        type: "heading",
        text: "When to use",
      },
      {
        type: "bullets",
        items: [
          "You want to provide a simple interface to a complex body of code",
          "There are many dependencies between clients and implementation classes",
          "You want to layer your subsystems — each layer has a Facade as its entry point",
          "Onboarding new developers — show them the Facade, not the entire subsystem",
        ],
      },
      {
        type: "text",
        md: "**Real-world analogy**: A hotel concierge — they coordinate restaurants, taxis, and tickets so you don't have to call each directly.",
      },
      {
        type: "code",
        lang: "python",
        code: `class DVDPlayer:
    def on(self): print("DVD Player: ON")
    def play(self, movie: str): print(f"DVD Player: playing '{movie}'")
    def off(self): print("DVD Player: OFF")

class Projector:
    def on(self): print("Projector: ON")
    def widescreen(self): print("Projector: widescreen mode")
    def off(self): print("Projector: OFF")

class Amplifier:
    def on(self): print("Amplifier: ON")
    def set_volume(self, v: int): print(f"Amplifier: volume {v}")
    def off(self): print("Amplifier: OFF")

class Lights:
    def dim(self, pct: int): print(f"Lights: dimmed to {pct}%")
    def on(self): print("Lights: ON (100%)")


# Facade — simplified interface
class HomeTheaterFacade:
    def __init__(self):
        self.dvd  = DVDPlayer()
        self.proj = Projector()
        self.amp  = Amplifier()
        self.lights = Lights()

    def watch_movie(self, movie: str) -> None:
        print("--- Setting up movie night ---")
        self.lights.dim(20)
        self.amp.on()
        self.amp.set_volume(15)
        self.proj.on()
        self.proj.widescreen()
        self.dvd.on()
        self.dvd.play(movie)

    def end_movie(self) -> None:
        print("--- Shutting down ---")
        self.dvd.off()
        self.proj.off()
        self.amp.off()
        self.lights.on()


theater = HomeTheaterFacade()
theater.watch_movie("Inception")
theater.end_movie()`,
        caption: "HomeTheaterFacade coordinates 4 subsystems behind 2 simple methods",
      },
    ],
  },
  {
    slug: "decorator",
    title: "Decorator",
    section: "Design Patterns — Structural",
    tagline: "Add behaviour to objects dynamically — wrap objects at runtime without changing their class",
    blocks: [
      {
        type: "text",
        md: "The **Decorator** pattern attaches additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing for extending functionality. Instead of creating `CoffeeWithMilk`, `CoffeeWithMilkAndSugar`, `CoffeeWithMilkSugarAndWhip` (exponential class explosion), you create small decorator classes that each add one feature and can be layered.",
      },
      {
        type: "text",
        md: "Each decorator wraps a component (which might itself be another decorator) and adds behaviour before or after delegating to the wrapped object. This creates a chain of responsibility. The key is that both the concrete component and each decorator implement the same interface, so they are interchangeable from the client's perspective.",
      },
      {
        type: "heading",
        text: "When to use",
      },
      {
        type: "bullets",
        items: [
          "Add responsibilities to objects without affecting other objects of the same class",
          "Subclassing would lead to an explosion of classes for every combination of features",
          "Responsibilities need to be assigned dynamically and can be withdrawn",
          "Layering behaviours: logging + caching + authentication on a function",
        ],
      },
      {
        type: "text",
        md: "**Real-world analogy**: A plain t-shirt is the base component. Adding a jacket is a decorator. Adding a scarf on top of the jacket is another decorator. Each layer adds behaviour (warmth) without replacing the shirt.",
      },
      {
        type: "code",
        lang: "python",
        code: `from abc import ABC, abstractmethod


class Coffee(ABC):
    @abstractmethod
    def description(self) -> str: ...

    @abstractmethod
    def cost(self) -> float: ...


class SimpleCoffee(Coffee):
    def description(self): return "Simple coffee"
    def cost(self): return 1.00


# Base decorator
class CoffeeDecorator(Coffee, ABC):
    def __init__(self, coffee: Coffee):
        self._coffee = coffee

    def description(self): return self._coffee.description()
    def cost(self): return self._coffee.cost()


# Concrete decorators
class MilkDecorator(CoffeeDecorator):
    def description(self): return self._coffee.description() + ", milk"
    def cost(self): return self._coffee.cost() + 0.25

class SugarDecorator(CoffeeDecorator):
    def description(self): return self._coffee.description() + ", sugar"
    def cost(self): return self._coffee.cost() + 0.10

class WhipDecorator(CoffeeDecorator):
    def description(self): return self._coffee.description() + ", whipped cream"
    def cost(self): return self._coffee.cost() + 0.50


# Build a fancy coffee by wrapping
coffee = SimpleCoffee()
coffee = MilkDecorator(coffee)
coffee = SugarDecorator(coffee)
coffee = WhipDecorator(coffee)

print(coffee.description())   # Simple coffee, milk, sugar, whipped cream
print(f"£{coffee.cost():.2f}")  # £1.85`,
        caption: "Coffee decorators chain — add Milk, Sugar, Whip without subclassing every combination",
      },
    ],
  },
  {
    slug: "composite",
    title: "Composite",
    section: "Design Patterns — Structural",
    tagline: "Tree structures where individual items and groups are treated uniformly",
    blocks: [
      {
        type: "text",
        md: "The **Composite** pattern composes objects into tree structures to represent part-whole hierarchies. It lets clients treat individual objects (leaves) and compositions of objects (composites) uniformly — calling `display()` on a file or on a directory both work, but the directory recursively calls `display()` on all its children. This eliminates the need for the client to distinguish between a leaf and a node.",
      },
      {
        type: "text",
        md: "The pattern has three roles: **Component** (abstract base), **Leaf** (has no children — does the actual work), and **Composite** (has children — delegates to them). The composite's methods iterate over children and call the same method on each. This naturally produces recursive behaviour for tree traversal.",
      },
      {
        type: "heading",
        text: "When to use",
      },
      {
        type: "bullets",
        items: [
          "You want to represent part-whole hierarchies of objects",
          "You want clients to ignore the difference between compositions of objects and individual objects",
          "File system trees, UI component trees, organisation charts, XML/HTML parsing",
          "Recursive algorithms over nested structures",
        ],
      },
      {
        type: "text",
        md: "**Real-world analogy**: A file system — a directory contains files and other directories. You can call 'get size' on a file (returns its size) or on a directory (recursively sums all children).",
      },
      {
        type: "code",
        lang: "python",
        code: `from abc import ABC, abstractmethod


class FileSystemComponent(ABC):
    def __init__(self, name: str):
        self.name = name

    @abstractmethod
    def display(self, indent: int = 0) -> None: ...

    @abstractmethod
    def size(self) -> int: ...


class File(FileSystemComponent):
    def __init__(self, name: str, size_bytes: int):
        super().__init__(name)
        self._size = size_bytes

    def display(self, indent: int = 0) -> None:
        print(" " * indent + f"[FILE] {self.name} ({self._size}B)")

    def size(self) -> int:
        return self._size


class Directory(FileSystemComponent):
    def __init__(self, name: str):
        super().__init__(name)
        self._children: list[FileSystemComponent] = []

    def add(self, component: FileSystemComponent) -> None:
        self._children.append(component)

    def display(self, indent: int = 0) -> None:
        print(" " * indent + f"[DIR]  {self.name}/")
        for child in self._children:
            child.display(indent + 2)

    def size(self) -> int:
        return sum(c.size() for c in self._children)


root = Directory("root")
src  = Directory("src")
src.add(File("main.py", 1200))
src.add(File("utils.py", 800))
root.add(src)
root.add(File("README.md", 300))

root.display()
print(f"Total: {root.size()}B")   # 2300B`,
        caption: "Composite file tree — display() and size() work uniformly on files and directories",
      },
    ],
  },
  {
    slug: "proxy",
    title: "Proxy",
    section: "Design Patterns — Structural",
    tagline: "A surrogate that controls access to another object — lazy load, cache, or guard",
    blocks: [
      {
        type: "text",
        md: "The **Proxy** pattern provides a surrogate or placeholder for another object to control access to it. The proxy implements the same interface as the real object, so clients can't tell the difference. Common uses: **virtual proxy** (lazy loading — defer expensive creation until needed), **protection proxy** (access control), **caching proxy** (cache results), and **remote proxy** (represent a remote object locally).",
      },
      {
        type: "text",
        md: "The proxy intercepts calls to the real object and can add behaviour before/after forwarding the request. In the image example below, a high-resolution image might take 2 seconds to load from disk. A ProxyImage defers that load until `display()` is first called, so your image gallery loads instantly and only pays the disk cost for images the user actually views.",
      },
      {
        type: "heading",
        text: "When to use",
      },
      {
        type: "bullets",
        items: [
          "Lazy initialisation — create expensive object only when first needed",
          "Access control — proxy checks permissions before forwarding",
          "Caching — proxy caches results so the real object isn't called repeatedly",
          "Logging/monitoring — proxy logs calls transparently without changing the real object",
        ],
      },
      {
        type: "text",
        md: "**Real-world analogy**: A credit card is a proxy for your bank account — it provides the same interface (payment) but adds security checks, logging, and credit limits.",
      },
      {
        type: "code",
        lang: "python",
        code: `from abc import ABC, abstractmethod
import time


class Image(ABC):
    @abstractmethod
    def display(self) -> None: ...


class RealImage(Image):
    def __init__(self, filename: str):
        self.filename = filename
        self._load_from_disk()

    def _load_from_disk(self) -> None:
        print(f"Loading {self.filename} from disk...")
        time.sleep(0.1)   # simulate expensive I/O

    def display(self) -> None:
        print(f"Displaying {self.filename}")


class ProxyImage(Image):
    """Lazy-loading proxy — defers disk access until display() is called."""
    def __init__(self, filename: str):
        self.filename = filename
        self._real: RealImage | None = None

    def display(self) -> None:
        if self._real is None:
            self._real = RealImage(self.filename)   # load on first access
        self._real.display()


# Gallery: proxy images created instantly — no disk access yet
gallery = [ProxyImage(f"photo_{i}.jpg") for i in range(5)]
print("Gallery created (no disk I/O yet)")

# Only pay disk cost for images user actually views
gallery[0].display()   # Loading photo_0.jpg... Displaying photo_0.jpg
gallery[0].display()   # Displaying photo_0.jpg (already loaded — no reload)
gallery[2].display()   # Loading photo_2.jpg... Displaying photo_2.jpg`,
        caption: "ProxyImage defers disk loading until display() is first called — lazy virtualproxy",
      },
    ],
  },
  {
    slug: "bridge",
    title: "Bridge",
    section: "Design Patterns — Structural",
    tagline: "Decouple abstraction from implementation — vary them independently without class explosion",
    blocks: [
      {
        type: "text",
        md: "The **Bridge** pattern decouples an abstraction from its implementation so that the two can vary independently. Without Bridge, combining M shapes with N colours produces M×N subclasses (`RedCircle`, `BlueCircle`, `RedSquare`, `BlueSquare`...). Bridge introduces a `Color` interface that shapes hold as a reference — now you have M+N classes that compose freely.",
      },
      {
        type: "text",
        md: "The 'bridge' is the reference the abstraction holds to the implementation. The abstraction (`Shape`) delegates colour-specific work to the `Color` implementor it was given. Adding a new colour (Purple) only requires one new `Color` class — no shape classes change. Adding a new shape (Triangle) only requires one new `Shape` class — no colour classes change.",
      },
      {
        type: "heading",
        text: "When to use",
      },
      {
        type: "bullets",
        items: [
          "You want to avoid a permanent binding between abstraction and implementation",
          "Both abstraction and implementation should be extensible by subclassing independently",
          "Changes in implementation should not affect client code",
          "You have a class hierarchy that is growing in two independent dimensions",
        ],
      },
      {
        type: "text",
        md: "**Real-world analogy**: A TV remote (abstraction) works with different TV brands (implementations). You can have multiple remote styles (basic, advanced) and multiple TV brands without combinatorial explosion.",
      },
      {
        type: "code",
        lang: "python",
        code: `from abc import ABC, abstractmethod


# Implementor interface
class Color(ABC):
    @abstractmethod
    def fill(self) -> str: ...


# Concrete implementors
class RedColor(Color):
    def fill(self): return "red"

class BlueColor(Color):
    def fill(self): return "blue"

class GreenColor(Color):
    def fill(self): return "green"


# Abstraction
class Shape(ABC):
    def __init__(self, color: Color):
        self.color = color   # bridge — hold reference to implementor

    @abstractmethod
    def draw(self) -> str: ...


# Refined abstractions
class Circle(Shape):
    def __init__(self, color: Color, radius: float):
        super().__init__(color)
        self.radius = radius

    def draw(self) -> str:
        return f"Circle(r={self.radius}, color={self.color.fill()})"

class Square(Shape):
    def __init__(self, color: Color, side: float):
        super().__init__(color)
        self.side = side

    def draw(self) -> str:
        return f"Square(side={self.side}, color={self.color.fill()})"


# M shapes x N colors = M+N classes, not M*N
shapes = [
    Circle(RedColor(), 5),
    Circle(BlueColor(), 3),
    Square(GreenColor(), 4),
    Square(RedColor(), 2),
]
for s in shapes:
    print(s.draw())`,
        caption: "Bridge: 2 shapes + 3 colors = 5 classes instead of 6 (2x3) subclasses",
      },
    ],
  },
  {
    slug: "flyweight",
    title: "Flyweight",
    section: "Design Patterns — Structural",
    tagline: "Share common state across many fine-grained objects — reduce memory for large object sets",
    blocks: [
      {
        type: "text",
        md: "The **Flyweight** pattern uses sharing to efficiently support a large number of fine-grained objects. When you have thousands of similar objects, storing all their data in each object wastes memory. Flyweight splits an object's state into **intrinsic** (shared, immutable — stored in the flyweight) and **extrinsic** (unique per context — passed in at runtime). One flyweight object is shared by many contexts.",
      },
      {
        type: "text",
        md: "The Flyweight Factory maintains a cache (pool) of existing flyweights and returns a cached instance when the same intrinsic state is requested. In a text editor, each character glyph is a flyweight — the font and size are intrinsic (shared), but the position on screen is extrinsic (different per character instance). This reduces thousands of character objects to a few dozen unique glyphs.",
      },
      {
        type: "heading",
        text: "When to use",
      },
      {
        type: "bullets",
        items: [
          "The application uses a large number of objects (thousands or millions)",
          "Storage costs are high because of the sheer quantity",
          "Most object state can be made extrinsic (passed in rather than stored)",
          "Many groups of objects can be replaced by a few shared objects once extrinsic state is removed",
        ],
      },
      {
        type: "text",
        md: "**Real-world analogy**: Chess pieces — a game board has 32 pieces but only 12 distinct types. A Flyweight factory returns the shared 'White Pawn' object; the board records where each instance is positioned (extrinsic).",
      },
      {
        type: "code",
        lang: "python",
        code: `class TreeType:
    """Flyweight — intrinsic (shared) state: species, color, texture."""
    def __init__(self, name: str, color: str, texture: str):
        self.name = name
        self.color = color
        self.texture = texture

    def draw(self, x: int, y: int) -> None:
        print(f"Drawing {self.name} tree [{self.color}] at ({x},{y})")


class TreeFactory:
    """Creates and caches TreeType flyweights."""
    _cache: dict[str, TreeType] = {}

    @classmethod
    def get_tree_type(cls, name: str, color: str, texture: str) -> TreeType:
        key = f"{name}:{color}:{texture}"
        if key not in cls._cache:
            cls._cache[key] = TreeType(name, color, texture)
            print(f"  [Factory] Created new flyweight: {key}")
        return cls._cache[key]


class Tree:
    """Context — stores extrinsic (unique) state: position."""
    def __init__(self, x: int, y: int, tree_type: TreeType):
        self.x = x
        self.y = y
        self.tree_type = tree_type   # shared flyweight

    def draw(self) -> None:
        self.tree_type.draw(self.x, self.y)


# Plant a forest with 6 trees but only 2 unique types
forest: list[Tree] = []
for x, y in [(1,1),(2,3),(5,7)]:
    tt = TreeFactory.get_tree_type("Oak", "green", "rough")
    forest.append(Tree(x, y, tt))
for x, y in [(3,2),(4,6),(8,1)]:
    tt = TreeFactory.get_tree_type("Pine", "dark-green", "smooth")
    forest.append(Tree(x, y, tt))

print(f"Trees: {len(forest)}, Flyweights: {len(TreeFactory._cache)}")
for tree in forest:
    tree.draw()`,
        caption: "TreeFactory caches flyweight TreeTypes — 6 tree instances share only 2 type objects",
      },
    ],
  },
];
