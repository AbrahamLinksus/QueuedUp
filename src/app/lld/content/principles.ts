import type { LLDContent } from "./types";

export const PRINCIPLES_CONTENT: LLDContent[] = [
  {
    slug: "dry-principle",
    title: "Don't Repeat Yourself (DRY)",
    section: "Design Principles",
    tagline: "Eliminate duplication — every piece of knowledge should have a single authoritative source",
    blocks: [
      {
        type: "text",
        md: "The **DRY principle** states that 'every piece of knowledge must have a single, unambiguous, authoritative representation within a system.' When the same logic exists in multiple places, a bug fix or change must be applied everywhere — and you will inevitably miss one. DRY is about **eliminating knowledge duplication**, not just copy-pasted code.",
      },
      {
        type: "text",
        md: "DRY violations often creep in under time pressure — it seems faster to copy-paste than to refactor. The cost is paid later when you need to change behaviour and hunt down every copy. The fix is to extract repeated logic into a single function, class, or module and have all callers go through that one source of truth.",
      },
      {
        type: "heading",
        text: "What violates DRY",
      },
      {
        type: "bullets",
        items: [
          "Copy-pasting validation logic across multiple functions",
          "Duplicating a calculation formula in several places",
          "Repeating the same query building logic in multiple service methods",
          "Storing the same configuration value in multiple config files",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `# ── BAD: discount logic duplicated in two places ─────────────────────
def calculate_order_total_bad(price: float, qty: int) -> float:
    subtotal = price * qty
    if subtotal > 100:
        subtotal *= 0.9   # 10% discount — duplicated!
    return subtotal

def calculate_invoice_total_bad(price: float, qty: int) -> float:
    subtotal = price * qty
    if subtotal > 100:
        subtotal *= 0.9   # same rule, copied again
    return subtotal


# ── GOOD: single authoritative discount function ──────────────────────
def apply_bulk_discount(subtotal: float) -> float:
    """10% discount on orders over £100. Change here, changes everywhere."""
    return subtotal * 0.9 if subtotal > 100 else subtotal

def calculate_order_total(price: float, qty: int) -> float:
    return apply_bulk_discount(price * qty)

def calculate_invoice_total(price: float, qty: int) -> float:
    return apply_bulk_discount(price * qty)


print(calculate_order_total(12, 10))    # 108.0
print(calculate_invoice_total(12, 10))  # 108.0`,
        caption: "Extract repeated discount logic into one function — change once, applies everywhere",
      },
    ],
  },
  {
    slug: "kiss-principle",
    title: "Keep It Simple, Stupid (KISS)",
    section: "Design Principles",
    tagline: "Prefer the simplest solution that works — complexity is a liability",
    blocks: [
      {
        type: "text",
        md: "The **KISS principle** says that systems work best when they are kept simple. Unnecessary complexity makes code harder to read, harder to test, harder to debug, and harder to hand off to another developer. Simplicity is not a sign of laziness — it's a sign of mastery. Einstein's advice applies here: 'Make everything as simple as possible, but not simpler.'",
      },
      {
        type: "text",
        md: "KISS is violated when developers over-engineer solutions, add premature abstractions, or solve problems that don't exist yet. Common symptoms include classes with a single method, deep inheritance hierarchies for simple problems, or elaborate configuration systems when a constant would do. Always ask: is this complexity actually required by the problem, or am I anticipating a need that might never arise?",
      },
      {
        type: "heading",
        text: "What violates KISS",
      },
      {
        type: "bullets",
        items: [
          "Using a plugin architecture for a script that runs once",
          "Creating a factory for a class that only ever has one implementation",
          "Abstract base classes when there's only ever one concrete subclass",
          "Deeply nested conditional logic that could be a simple lookup",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `# ── BAD: over-engineered temperature converter ───────────────────────
class TemperatureConversionStrategy:
    def convert(self, value: float) -> float:
        raise NotImplementedError

class CelsiusToFahrenheitStrategy(TemperatureConversionStrategy):
    def convert(self, value: float) -> float:
        return value * 9/5 + 32

class TemperatureConverter:
    def __init__(self, strategy: TemperatureConversionStrategy):
        self._strategy = strategy
    def convert(self, value: float) -> float:
        return self._strategy.convert(value)

converter = TemperatureConverter(CelsiusToFahrenheitStrategy())
print(converter.convert(100))   # 212.0 — 5 classes for one formula!


# ── GOOD: just a function ─────────────────────────────────────────────
def celsius_to_fahrenheit(c: float) -> float:
    return c * 9/5 + 32

print(celsius_to_fahrenheit(100))   # 212.0`,
        caption: "A formula doesn't need a class hierarchy — keep it a function",
      },
    ],
  },
  {
    slug: "yagni-principle",
    title: "You Aren't Gonna Need It (YAGNI)",
    section: "Design Principles",
    tagline: "Don't build features until they are actually needed — avoid speculative generality",
    blocks: [
      {
        type: "text",
        md: "**YAGNI** (from Extreme Programming) says: don't implement something until it is needed. Developers often add features or abstractions 'just in case' — a plugin system for an app that has two hard-coded plugins, an i18n layer for a system used only in English, a caching layer before any performance problem exists. All of this is wasted effort that adds complexity and maintenance burden.",
      },
      {
        type: "text",
        md: "YAGNI is not an excuse to write throwaway code. It's a discipline to implement what the current requirements demand and nothing more. When a new requirement arrives, extend then. The cost of adding a feature when you need it is almost always lower than maintaining a feature you built speculatively — because speculative features are almost always wrong in some way.",
      },
      {
        type: "heading",
        text: "What violates YAGNI",
      },
      {
        type: "bullets",
        items: [
          "Building a plugin architecture before you have more than one plugin",
          "Adding multi-currency support to a system that only operates in one currency",
          "Implementing a full audit log 'because we might need it someday'",
          "Generic base classes for hierarchies that never materialise",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `# ── BAD: user storage with speculative multi-backend support ─────────
class UserRepository:
    def __init__(self, backend: str = "postgres"):
        self.backend = backend   # we only ever use postgres

    def find_by_id(self, user_id: int):
        if self.backend == "postgres":
            return self._find_postgres(user_id)
        elif self.backend == "mysql":      # never used
            return self._find_mysql(user_id)
        elif self.backend == "mongodb":    # never used
            return self._find_mongo(user_id)

    def _find_postgres(self, user_id): ...
    def _find_mysql(self, user_id): ...     # dead code
    def _find_mongo(self, user_id): ...     # dead code


# ── GOOD: solve the problem you have ─────────────────────────────────
class UserRepository:
    def find_by_id(self, user_id: int):
        # Query postgres — the only backend we use today
        # If we need MySQL later, we refactor then
        return {"id": user_id, "name": "Alice"}

repo = UserRepository()
print(repo.find_by_id(1))`,
        caption: "Don't add MySQL/MongoDB backends until you actually need them",
      },
    ],
  },
  {
    slug: "law-of-demeter",
    title: "Law of Demeter (LoD)",
    section: "Design Principles",
    tagline: "Talk only to your immediate friends — don't chain method calls through object graphs",
    blocks: [
      {
        type: "text",
        md: "The **Law of Demeter** (also called the 'principle of least knowledge') says an object should only call methods on: itself, objects it created, objects passed as parameters, and its own direct attributes. It should NOT reach through another object to call methods on *that* object's internals. The colloquial rule is: 'Don't talk to strangers.'",
      },
      {
        type: "text",
        md: "Violations create **train-wreck code**: `customer.getOrder().getItems().get(0).getPrice()`. This chain means your code now knows about Customer, Order, list of Items, and Item — a huge hidden dependency. If the Order's internal structure changes, the calling code breaks even though it was only working with a Customer. LoD says wrap the traversal in a method on the object you actually have.",
      },
      {
        type: "heading",
        text: "What violates LoD",
      },
      {
        type: "bullets",
        items: [
          "Long method chains: `a.b.c.do_something()`",
          "Accessing an attribute of an attribute: `order.customer.address.city`",
          "Reaching into a returned list and operating on its contents",
          "Calling methods on the return value of another method call",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `# ── BAD: train-wreck chaining ─────────────────────────────────────────
class Address:
    def __init__(self, city: str):
        self.city = city

class Customer:
    def __init__(self, name: str, address: Address):
        self.name = name
        self.address = address

class Order:
    def __init__(self, customer: Customer):
        self.customer = customer

def print_city_bad(order: Order):
    # Knows about Order, Customer, AND Address — fragile!
    print(order.customer.address.city)


# ── GOOD: each class exposes what callers need ────────────────────────
class Address:
    def __init__(self, city: str):
        self.city = city

class Customer:
    def __init__(self, name: str, address: Address):
        self.name = name
        self._address = address

    def city(self) -> str:           # delegate — hide Address internals
        return self._address.city

class Order:
    def __init__(self, customer: Customer):
        self._customer = customer

    def customer_city(self) -> str:  # delegate — hide Customer internals
        return self._customer.city()

def print_city_good(order: Order):
    print(order.customer_city())     # only knows about Order

order = Order(Customer("Alice", Address("London")))
print_city_good(order)   # London`,
        caption: "Wrap traversal logic inside the class you have — don't reach through object graphs",
      },
    ],
  },
  {
    slug: "single-responsibility-principle",
    title: "Single Responsibility Principle (SRP)",
    section: "Design Principles",
    tagline: "One class, one reason to change — separate concerns to keep classes focused",
    blocks: [
      {
        type: "text",
        md: "The **Single Responsibility Principle** states that a class should have only one reason to change — meaning it should only have one job or responsibility. A class that handles data persistence, business logic, AND email notifications will need to be modified for three completely different reasons, making it fragile and hard to test. SRP asks you to separate these concerns into distinct classes.",
      },
      {
        type: "text",
        md: "SRP doesn't mean a class can only have one method — it means all the methods should be cohesively working toward the same responsibility. A `User` class can have `full_name()` and `age()` — both are about representing user data. But adding `send_welcome_email()` mixes in a communication responsibility that should live elsewhere.",
      },
      {
        type: "heading",
        text: "What violates SRP",
      },
      {
        type: "bullets",
        items: [
          "A `Report` class that generates AND saves AND emails the report",
          "A `User` class that validates, persists, AND sends notifications",
          "A god class with hundreds of methods spanning unrelated concerns",
          "A module that handles both business logic and database access",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `# ── BAD: User class does too many things ─────────────────────────────
class UserBad:
    def __init__(self, name: str, email: str):
        self.name = name
        self.email = email

    def save_to_db(self): ...          # persistence responsibility
    def send_welcome_email(self): ...  # email responsibility
    def validate_email(self): ...      # validation responsibility
    # Three separate reasons to change!


# ── GOOD: separate into focused classes ───────────────────────────────
class User:
    """Responsibility: represent user data."""
    def __init__(self, name: str, email: str):
        self.name = name
        self.email = email

class UserRepository:
    """Responsibility: persist User objects."""
    def save(self, user: User) -> None:
        print(f"Saving {user.name} to database")

    def find_by_email(self, email: str) -> User | None:
        ...  # query database

class UserNotifier:
    """Responsibility: send notifications about users."""
    def send_welcome(self, user: User) -> None:
        print(f"Sending welcome email to {user.email}")

# Each class changes for only one reason
user = User("Alice", "alice@example.com")
UserRepository().save(user)
UserNotifier().send_welcome(user)`,
        caption: "Split a multi-responsibility class into three focused classes",
      },
    ],
  },
  {
    slug: "open-closed-principle",
    title: "Open/Closed Principle (OCP)",
    section: "Design Principles",
    tagline: "Open for extension, closed for modification — add behaviour without changing existing code",
    blocks: [
      {
        type: "text",
        md: "The **Open/Closed Principle** states that software entities should be **open for extension but closed for modification**. Once a class is working and tested, you shouldn't need to change its source code to add new behaviour — you should be able to extend it. This protects existing, tested code from being broken by new requirements.",
      },
      {
        type: "text",
        md: "The typical mechanism is abstraction: define an interface or base class, write code that depends on that abstraction, then add new implementations of the abstraction without touching the calling code. The classic anti-pattern is a long `if/elif` chain that must be modified every time a new type is added — each addition risks breaking existing branches.",
      },
      {
        type: "heading",
        text: "What violates OCP",
      },
      {
        type: "bullets",
        items: [
          "`if shape == 'circle': ... elif shape == 'rectangle': ...` chains that grow with every new shape",
          "Adding a `new_payment_method` case to an existing `process_payment` function",
          "Modifying a tested class to support a new variant of behaviour",
          "Switch statements over type enums that require modification for every new type",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `from abc import ABC, abstractmethod


# ── BAD: adding a new shape requires modifying this function ──────────
def area_bad(shape: dict) -> float:
    if shape["type"] == "circle":
        return 3.14159 * shape["r"] ** 2
    elif shape["type"] == "rectangle":
        return shape["w"] * shape["h"]
    # Adding Triangle means editing this function — risky!


# ── GOOD: closed for modification, open for extension ─────────────────
class Shape(ABC):
    @abstractmethod
    def area(self) -> float: ...

class Circle(Shape):
    def __init__(self, r): self.r = r
    def area(self): return 3.14159 * self.r ** 2

class Rectangle(Shape):
    def __init__(self, w, h): self.w = w; self.h = h
    def area(self): return self.w * self.h

class Triangle(Shape):             # NEW type added without modifying anything
    def __init__(self, b, h): self.b = b; self.h = h
    def area(self): return 0.5 * self.b * self.h

def total_area(shapes: list[Shape]) -> float:
    return sum(s.area() for s in shapes)   # never needs to change

shapes = [Circle(5), Rectangle(4, 6), Triangle(3, 8)]
print(total_area(shapes))   # 120.57`,
        caption: "Add Triangle without touching total_area() — it's closed for modification",
      },
    ],
  },
  {
    slug: "liskov-substitution-principle",
    title: "Liskov Substitution Principle (LSP)",
    section: "Design Principles",
    tagline: "Subclasses must be substitutable for their base class without breaking callers",
    blocks: [
      {
        type: "text",
        md: "The **Liskov Substitution Principle** states that if S is a subtype of T, then objects of type T may be replaced with objects of type S without altering the correctness of the program. In plain English: anywhere your code uses a `Bird`, you should be able to pass a `Penguin` (which IS-A Bird) and have everything still work correctly. If it doesn't, the subclass violates LSP.",
      },
      {
        type: "text",
        md: "LSP is violated when a subclass weakens preconditions, strengthens postconditions, or raises exceptions the parent doesn't raise. The famous example is `Square extends Rectangle` — setting width on a Square also changes height, which breaks code that expects them to be independent. The fix is usually to reconsider the inheritance hierarchy or use composition instead.",
      },
      {
        type: "heading",
        text: "What violates LSP",
      },
      {
        type: "bullets",
        items: [
          "A subclass throws an exception where the parent would succeed",
          "A `Penguin(Bird)` class with `fly()` raising `NotImplementedError`",
          "Square overriding Rectangle's setters in ways that break area invariants",
          "Subclass methods that ignore or weaken parameter validations from the parent",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `# ── BAD: Penguin violates LSP — callers of Bird will break ───────────
class Bird:
    def fly(self) -> str:
        return "I'm flying!"

class Penguin(Bird):
    def fly(self):
        raise NotImplementedError("Penguins can't fly!")   # LSP violation

def make_bird_fly(bird: Bird):
    print(bird.fly())   # breaks when called with Penguin

# make_bird_fly(Penguin())  # raises NotImplementedError!


# ── GOOD: redesign the hierarchy around true capabilities ─────────────
class Bird:
    def eat(self) -> str:
        return "Eating..."

class FlyingBird(Bird):
    def fly(self) -> str:
        return "I'm flying!"

class SwimmingBird(Bird):
    def swim(self) -> str:
        return "I'm swimming!"

class Sparrow(FlyingBird): pass   # can fly — substitutable for FlyingBird
class Penguin(SwimmingBird): pass  # can swim — substitutable for SwimmingBird

def make_flying_bird_fly(bird: FlyingBird):
    print(bird.fly())   # safe — only called on birds that can fly

make_flying_bird_fly(Sparrow())   # I'm flying!`,
        caption: "Separate FlyingBird from SwimmingBird — Penguin no longer needs a broken fly() method",
      },
    ],
  },
  {
    slug: "interface-segregation-principle",
    title: "Interface Segregation Principle (ISP)",
    section: "Design Principles",
    tagline: "Many focused interfaces beat one fat interface — clients shouldn't be forced to implement what they don't use",
    blocks: [
      {
        type: "text",
        md: "The **Interface Segregation Principle** says no client should be forced to depend on methods it does not use. Fat interfaces — those with many unrelated methods — force implementing classes to stub out methods they don't need. ISP recommends splitting large interfaces into smaller, more focused ones so classes only need to implement what's relevant to them.",
      },
      {
        type: "text",
        md: "In Python terms, this means keeping ABCs small and focused. A `Printer` interface might have `print()` and `scan()` — but a simple printer that doesn't scan shouldn't be forced to implement `scan()` at all. Split into `Printable` and `Scannable` and implement only what applies. This keeps implementations lean and avoids stubbed-out 'do nothing' methods that confuse callers.",
      },
      {
        type: "heading",
        text: "What violates ISP",
      },
      {
        type: "bullets",
        items: [
          "An `Animal` interface with `fly()`, `swim()`, and `run()` — most animals can only do one",
          "A `Worker` interface with `work()` and `eat()` forced onto Robot (robots don't eat)",
          "A reporting interface that mixes data fetching, formatting, and emailing",
          "One large ABC that all subclasses implement but most stub with `pass`",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `from abc import ABC, abstractmethod


# ── BAD: fat interface forces Robot to implement eat() ────────────────
class Worker(ABC):
    @abstractmethod
    def work(self): ...
    @abstractmethod
    def eat(self): ...   # Robots don't eat!

class Robot(Worker):
    def work(self): print("Robot working")
    def eat(self): pass   # meaningless stub — ISP violation


# ── GOOD: segregated into two focused interfaces ──────────────────────
class Workable(ABC):
    @abstractmethod
    def work(self): ...

class Eatable(ABC):
    @abstractmethod
    def eat(self): ...

class HumanWorker(Workable, Eatable):
    def work(self): print("Human working")
    def eat(self):  print("Human eating lunch")

class RobotWorker(Workable):
    def work(self): print("Robot working 24/7")
    # No eat() needed — Robot doesn't implement Eatable

def run_shift(worker: Workable):
    worker.work()

run_shift(HumanWorker())   # Human working
run_shift(RobotWorker())   # Robot working 24/7`,
        caption: "Split Worker into Workable and Eatable — Robot only implements what it needs",
      },
    ],
  },
  {
    slug: "dependency-inversion-principle",
    title: "Dependency Inversion Principle (DIP)",
    section: "Design Principles",
    tagline: "Depend on abstractions, not concretions — high-level code shouldn't know about low-level details",
    blocks: [
      {
        type: "text",
        md: "The **Dependency Inversion Principle** has two rules: (1) high-level modules should not depend on low-level modules — both should depend on abstractions; and (2) abstractions should not depend on details — details should depend on abstractions. In short: depend on interfaces, not concrete classes. This is why it's called 'inversion' — instead of high-level code pointing down to low-level code, both point to an abstraction.",
      },
      {
        type: "text",
        md: "DIP is what makes dependency injection (DI) work. Instead of a `ReportService` creating its own `MySQLDatabase` internally, it accepts a `Database` interface in its constructor. You can now pass in a `MySQLDatabase`, a `PostgreSQLDatabase`, or a `MockDatabase` for tests — all without changing `ReportService`. This is the foundation of testable, loosely-coupled design.",
      },
      {
        type: "heading",
        text: "What violates DIP",
      },
      {
        type: "bullets",
        items: [
          "High-level class directly instantiates low-level class: `self.db = MySQLDatabase()`",
          "Business logic importing and calling a specific email library directly",
          "A service class that knows the concrete database type it's talking to",
          "Unit tests that can't run without a real database connection",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `from abc import ABC, abstractmethod


# ── BAD: UserService depends directly on MySQL ────────────────────────
class MySQLDatabase:
    def get_user(self, user_id: int) -> dict:
        return {"id": user_id, "name": "Alice"}   # imagine real DB call

class UserServiceBad:
    def __init__(self):
        self.db = MySQLDatabase()   # tightly coupled to MySQL!

    def get_user(self, user_id: int) -> dict:
        return self.db.get_user(user_id)


# ── GOOD: both depend on the Database abstraction ─────────────────────
class Database(ABC):
    @abstractmethod
    def get_user(self, user_id: int) -> dict: ...

class MySQLDatabase(Database):
    def get_user(self, user_id: int) -> dict:
        return {"id": user_id, "name": "Alice from MySQL"}

class InMemoryDatabase(Database):     # great for tests
    def get_user(self, user_id: int) -> dict:
        return {"id": user_id, "name": "Test User"}

class UserService:
    def __init__(self, db: Database):  # inject the abstraction
        self.db = db

    def get_user(self, user_id: int) -> dict:
        return self.db.get_user(user_id)

# Production
svc = UserService(MySQLDatabase())
print(svc.get_user(1))

# Test — swap without touching UserService
test_svc = UserService(InMemoryDatabase())
print(test_svc.get_user(1))`,
        caption: "Inject the Database abstraction — swap MySQL for a mock in tests without changing UserService",
      },
    ],
  },
  {
    slug: "solid-principles",
    title: "SOLID Principles Summary",
    section: "Design Principles",
    tagline: "All five SOLID principles in one cohesive example — the complete design checklist",
    blocks: [
      {
        type: "text",
        md: "**SOLID** is an acronym for five principles that together produce software that is easy to maintain, extend, and test. They were gathered by Robert C. Martin (Uncle Bob) and represent the best practices of object-oriented design. Each principle addresses a different type of rigidity or fragility that commonly plagues codebases.",
      },
      {
        type: "heading",
        text: "The five principles",
      },
      {
        type: "bullets",
        items: [
          "**S — Single Responsibility**: one class, one reason to change",
          "**O — Open/Closed**: open for extension, closed for modification",
          "**L — Liskov Substitution**: subclasses must be substitutable for their base",
          "**I — Interface Segregation**: many small interfaces beat one fat interface",
          "**D — Dependency Inversion**: depend on abstractions, not concretions",
        ],
      },
      {
        type: "text",
        md: "The example below shows a notification system that respects all five principles at once. Notice how each class has one job (S), new channel types can be added without changing `NotificationService` (O), all channels are freely substitutable (L), `Notifiable` is a focused interface (I), and `NotificationService` depends on the `Notifiable` abstraction injected at construction (D).",
      },
      {
        type: "code",
        lang: "python",
        code: `from abc import ABC, abstractmethod


# I — Interface Segregation: small, focused interface
class Notifiable(ABC):
    @abstractmethod
    def send(self, message: str) -> None: ...


# O — Open/Closed: new channels extend without modifying NotificationService
# L — Liskov: all channels substitutable wherever Notifiable is expected
class EmailNotifier(Notifiable):
    def __init__(self, email: str): self.email = email
    def send(self, message: str):
        print(f"Email to {self.email}: {message}")

class SMSNotifier(Notifiable):
    def __init__(self, phone: str): self.phone = phone
    def send(self, message: str):
        print(f"SMS to {self.phone}: {message}")

class PushNotifier(Notifiable):          # new channel — zero changes elsewhere
    def __init__(self, device_id: str): self.device_id = device_id
    def send(self, message: str):
        print(f"Push to {self.device_id}: {message}")


# S — Single Responsibility: only responsible for dispatching notifications
# D — Dependency Inversion: depends on Notifiable abstraction, not concrete classes
class NotificationService:
    def __init__(self, notifiers: list[Notifiable]):
        self._notifiers = notifiers

    def notify_all(self, message: str) -> None:
        for n in self._notifiers:
            n.send(message)


service = NotificationService([
    EmailNotifier("alice@example.com"),
    SMSNotifier("+447700000000"),
    PushNotifier("device-abc123"),
])
service.notify_all("Your order has shipped!")`,
        caption: "All 5 SOLID principles demonstrated in one notification system",
      },
    ],
  },
];
