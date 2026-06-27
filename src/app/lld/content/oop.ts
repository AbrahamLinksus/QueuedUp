import type { LLDContent } from "./types";

export const OOP_CONTENT: LLDContent[] = [
  {
    slug: "classes-and-objects",
    title: "Classes & Objects",
    section: "Object Oriented Programming",
    tagline: "Blueprint vs instance — how classes define structure and objects hold state",
    blocks: [
      {
        type: "text",
        md: "A **class** is a blueprint that defines attributes (data) and methods (behaviour) that its instances will have. Think of a class like a cookie cutter — it describes the shape, but it isn't a cookie itself. Every time you call the class, Python creates a new **object** (also called an instance) from that blueprint, each with its own independent data.",
      },
      {
        type: "text",
        md: "The `__init__` method is Python's constructor — it runs automatically whenever a new object is created and is responsible for initialising the object's attributes. Methods defined inside a class always receive `self` as their first argument, which is the reference to the specific instance being operated on. This is how one class definition can power thousands of independent objects without them sharing state.",
      },
      {
        type: "heading",
        text: "Key concepts",
      },
      {
        type: "bullets",
        items: [
          "`class` keyword defines the blueprint; calling `ClassName()` creates an instance",
          "`__init__(self, ...)` initialises per-instance attributes on creation",
          "`self` refers to the current instance — always the first parameter of instance methods",
          "Attributes set on `self` belong to that object; class-level attributes are shared across all instances",
          "You can create as many objects from one class as you need — each holds its own state",
          "Calling `obj.method()` automatically passes `obj` as `self`",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `class Person:
    species = "Homo sapiens"  # class attribute — shared by all instances

    def __init__(self, name: str, age: int):
        self.name = name   # instance attributes — unique per object
        self.age = age

    def greet(self) -> str:
        return f"Hi, I'm {self.name} and I'm {self.age} years old."

    def have_birthday(self):
        self.age += 1
        print(f"Happy birthday {self.name}! Now {self.age}.")

    def __repr__(self) -> str:
        return f"Person(name={self.name!r}, age={self.age})"


# Creating objects (instances) from the class
alice = Person("Alice", 30)
bob   = Person("Bob", 25)

print(alice.greet())           # Hi, I'm Alice and I'm 30 years old.
print(bob.greet())             # Hi, I'm Bob and I'm 25 years old.
alice.have_birthday()          # Happy birthday Alice! Now 31.
print(Person.species)          # Homo sapiens (class attribute)
print(alice)                   # Person(name='Alice', age=31)`,
        caption: "A Person class with instance attributes, a class attribute, and several methods",
      },
    ],
  },
  {
    slug: "interfaces",
    title: "Interfaces",
    section: "Object Oriented Programming",
    tagline: "Contract-based programming — ABCs enforce what subclasses must implement",
    blocks: [
      {
        type: "text",
        md: "An **interface** defines a contract: a set of methods that any implementing class must provide. Python doesn't have a dedicated `interface` keyword, but the same effect is achieved through **Abstract Base Classes (ABCs)** from the `abc` module. A class that inherits from an ABC and is decorated with `@abstractmethod` cannot be instantiated directly — it forces every concrete subclass to implement the required methods.",
      },
      {
        type: "text",
        md: "Interfaces are powerful because they let you write code against the *contract*, not the *concrete type*. A function that accepts a `Shape` doesn't care whether it gets a `Circle` or a `Rectangle` — it just calls `area()` and trusts the contract. This is the foundation of **polymorphism** and makes swapping implementations trivial without touching calling code.",
      },
      {
        type: "heading",
        text: "Key concepts",
      },
      {
        type: "bullets",
        items: [
          "Import `ABC` and `abstractmethod` from the `abc` module",
          "Inherit from `ABC` and mark required methods with `@abstractmethod`",
          "Instantiating an abstract class raises `TypeError` — acts as a compile-time guard",
          "Concrete subclasses must implement ALL abstract methods to be instantiable",
          "Abstract classes can also have concrete helper methods — only marked methods are required",
          "Use `isinstance(obj, Shape)` to check if an object fulfils the interface",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `from abc import ABC, abstractmethod
import math


class Shape(ABC):
    """Interface: every Shape must be able to compute area and perimeter."""

    @abstractmethod
    def area(self) -> float: ...

    @abstractmethod
    def perimeter(self) -> float: ...

    def describe(self) -> str:           # concrete helper — shared by all
        return (f"{type(self).__name__}: "
                f"area={self.area():.2f}, perimeter={self.perimeter():.2f}")


class Circle(Shape):
    def __init__(self, radius: float):
        self.radius = radius

    def area(self) -> float:
        return math.pi * self.radius ** 2

    def perimeter(self) -> float:
        return 2 * math.pi * self.radius


class Rectangle(Shape):
    def __init__(self, width: float, height: float):
        self.width = width
        self.height = height

    def area(self) -> float:
        return self.width * self.height

    def perimeter(self) -> float:
        return 2 * (self.width + self.height)


shapes: list[Shape] = [Circle(5), Rectangle(4, 6)]
for s in shapes:
    print(s.describe())
# Circle: area=78.54, perimeter=31.42
# Rectangle: area=24.00, perimeter=20.00`,
        caption: "Shape ABC as an interface — Circle and Rectangle both fulfil the contract",
      },
    ],
  },
  {
    slug: "inheritance",
    title: "Inheritance",
    section: "Object Oriented Programming",
    tagline: "Reuse and extend — subclasses inherit and override parent class behaviour",
    blocks: [
      {
        type: "text",
        md: "**Inheritance** allows a class (the child or subclass) to acquire attributes and methods from another class (the parent or superclass). This models the IS-A relationship: a `Dog` IS-A `Animal`. The child class automatically has everything the parent has, and can add new attributes/methods or **override** existing ones with specialised behaviour.",
      },
      {
        type: "text",
        md: "Python uses `super()` to call the parent class's version of a method, most commonly in `__init__` to ensure the parent's initialisation logic still runs. Without `super().__init__()`, the parent's attributes won't be set up. Method overriding lets subclasses swap in their own logic while still being usable wherever the parent type is expected — this is what makes inheritance work hand-in-hand with polymorphism.",
      },
      {
        type: "heading",
        text: "Key concepts",
      },
      {
        type: "bullets",
        items: [
          "Subclass syntax: `class Dog(Animal):` — Dog inherits everything from Animal",
          "`super().__init__(...)` calls the parent constructor so parent attrs are initialised",
          "Override a method by redefining it in the subclass — the subclass version takes precedence",
          "Call `super().method()` from an override if you want to extend rather than replace",
          "Python supports multiple inheritance (`class C(A, B):`), resolved via MRO",
          "`isinstance(dog, Animal)` returns `True` — subclass instances satisfy parent type checks",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `class Animal:
    def __init__(self, name: str, age: int):
        self.name = name
        self.age = age

    def speak(self) -> str:
        return f"{self.name} makes a sound."

    def __repr__(self) -> str:
        return f"{type(self).__name__}(name={self.name!r}, age={self.age})"


class Dog(Animal):
    def __init__(self, name: str, age: int, breed: str):
        super().__init__(name, age)   # initialise parent attrs
        self.breed = breed            # add subclass-specific attr

    def speak(self) -> str:           # override parent method
        return f"{self.name} barks: Woof!"

    def fetch(self, item: str) -> str:
        return f"{self.name} fetches the {item}!"


class Cat(Animal):
    def speak(self) -> str:
        return f"{self.name} meows: Meow!"


rex = Dog("Rex", 3, "Labrador")
whiskers = Cat("Whiskers", 5)

print(rex.speak())            # Rex barks: Woof!
print(whiskers.speak())       # Whiskers meows: Meow!
print(rex.fetch("ball"))      # Rex fetches the ball!
print(isinstance(rex, Animal))  # True — Dog IS-A Animal`,
        caption: "Animal base class with Dog and Cat subclasses overriding speak()",
      },
    ],
  },
  {
    slug: "polymorphism",
    title: "Polymorphism",
    section: "Object Oriented Programming",
    tagline: "Same interface, different behaviour — objects of different types respond to the same call",
    blocks: [
      {
        type: "text",
        md: "**Polymorphism** means 'many forms' — the ability to call the same method on different types of objects and get behaviour appropriate to each type. The calling code doesn't need to know or care which concrete type it's dealing with; it just invokes the method and trusts each object to do the right thing. This is what lets you write generic, extensible code.",
      },
      {
        type: "text",
        md: "Python supports two kinds of polymorphism. **Subtype polymorphism** (through inheritance/ABCs) lets subclasses override a parent method — calling `shape.area()` works on any Shape subclass. **Duck typing** is Python's looser version: if an object has the right method, you can call it — no shared parent class required. The name comes from 'if it walks like a duck and quacks like a duck, it is a duck'.",
      },
      {
        type: "heading",
        text: "Key concepts",
      },
      {
        type: "bullets",
        items: [
          "Polymorphism lets one interface work across multiple types",
          "Achieved through method overriding in subclasses (subtype polymorphism)",
          "Duck typing: Python checks for the method at runtime, not the type hierarchy",
          "The `+` operator is itself polymorphic: `1+1` vs `'a'+'b'` both work",
          "Enables writing loops that process heterogeneous collections uniformly",
          "Avoids `if isinstance(...)` chains — each type handles its own logic",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `# ── 1. Subtype polymorphism via overriding ──────────────────────────
class Shape:
    def area(self) -> float:
        raise NotImplementedError

class Circle(Shape):
    def __init__(self, r): self.r = r
    def area(self): return 3.14159 * self.r ** 2

class Rectangle(Shape):
    def __init__(self, w, h): self.w = w; self.h = h
    def area(self): return self.w * self.h

class Triangle(Shape):
    def __init__(self, b, h): self.b = b; self.h = h
    def area(self): return 0.5 * self.b * self.h

shapes = [Circle(5), Rectangle(4, 6), Triangle(3, 8)]
for s in shapes:
    print(f"{type(s).__name__}: {s.area():.2f}")


# ── 2. Duck typing — no shared base class required ───────────────────
class Duck:
    def speak(self): return "Quack!"

class Person:
    def speak(self): return "I'm quacking like a duck!"

def make_it_speak(thing):   # works on anything with a speak() method
    print(thing.speak())

make_it_speak(Duck())    # Quack!
make_it_speak(Person())  # I'm quacking like a duck!`,
        caption: "Both overriding-based and duck-typing polymorphism in one example",
      },
    ],
  },
  {
    slug: "abstraction",
    title: "Abstraction",
    section: "Object Oriented Programming",
    tagline: "Hide complexity — expose only what callers need, conceal how it works",
    blocks: [
      {
        type: "text",
        md: "**Abstraction** is the principle of exposing only the essential interface to the outside world while hiding the underlying complexity. When you drive a car you don't need to know how the combustion engine works — you use the steering wheel and pedals. The car *abstracts away* its internal mechanics. In code, abstraction means designing classes so that callers interact with a clean, minimal API without needing to understand the implementation details.",
      },
      {
        type: "text",
        md: "Abstract classes in Python (via `ABC`) are one tool for enforcing abstraction — they define *what* a class must do without specifying *how*. Concrete subclasses fill in the 'how'. The caller works against the abstract interface, which means the implementation can be swapped or changed without breaking calling code. Abstraction reduces cognitive load, limits coupling, and makes systems easier to extend.",
      },
      {
        type: "heading",
        text: "Key concepts",
      },
      {
        type: "bullets",
        items: [
          "Expose a simple interface; hide the messy internals",
          "Abstract classes define WHAT to do; concrete classes define HOW",
          "Callers depend on the abstract type, not the concrete implementation",
          "Change the implementation without changing the calling code",
          "Reduces cognitive overhead — users don't need to understand internals",
          "Works alongside encapsulation: abstraction hides design, encapsulation hides data",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `from abc import ABC, abstractmethod


class Vehicle(ABC):
    """Abstraction: callers know how to start/stop/refuel — not the details."""

    @abstractmethod
    def start(self) -> None: ...

    @abstractmethod
    def stop(self) -> None: ...

    def refuel(self, litres: float) -> None:   # shared concrete behaviour
        print(f"Refuelling {type(self).__name__} with {litres}L")


class Car(Vehicle):
    def start(self) -> None:
        print("Car: turning ignition key → engine running")

    def stop(self) -> None:
        print("Car: pressing brake + turning off ignition")


class ElectricCar(Vehicle):
    def start(self) -> None:
        print("ElectricCar: pressing power button → motor engaged")

    def stop(self) -> None:
        print("ElectricCar: pressing power button → motor disengaged")

    def refuel(self, litres: float) -> None:
        print("ElectricCar doesn't use fuel — please use charge()")


def trip(v: Vehicle):
    v.start()
    v.refuel(40)
    v.stop()

trip(Car())
trip(ElectricCar())`,
        caption: "Vehicle ABC hides engine details — the trip() function works with any Vehicle",
      },
    ],
  },
  {
    slug: "encapsulation",
    title: "Encapsulation",
    section: "Object Oriented Programming",
    tagline: "Bundle data with behaviour and control access — protect object state from outside interference",
    blocks: [
      {
        type: "text",
        md: "**Encapsulation** means bundling an object's data (attributes) and the methods that operate on that data into a single unit (the class), and controlling access to the internals. By making attributes *private* you prevent external code from directly modifying state in ways that could break invariants. A `BankAccount` that exposes `self.balance` directly can have it set to a negative number by anyone — bad. Encapsulation prevents that.",
      },
      {
        type: "text",
        md: "Python uses naming conventions to signal access level: `__attr` (double underscore) triggers **name mangling** so the attribute is harder to access from outside the class. Properties (`@property`, `@x.setter`) provide controlled public getters/setters that can validate input before allowing a change. This gives you the clean syntax of direct attribute access while keeping validation logic in one place.",
      },
      {
        type: "heading",
        text: "Key concepts",
      },
      {
        type: "bullets",
        items: [
          "`__attr` name-mangles to `_ClassName__attr` — makes accidental access harder",
          "`@property` creates a getter — accessed like `obj.balance` without parens",
          "`@balance.setter` validates input before updating the private attribute",
          "Invariants (e.g. balance can't go negative) are enforced in one central place",
          "External code talks to the object through its public API, not raw attributes",
          "Single underscore `_attr` is a convention meaning 'internal use' — not enforced",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `class BankAccount:
    def __init__(self, owner: str, initial_balance: float = 0):
        self.owner = owner
        self.__balance = initial_balance   # private — name-mangled

    @property
    def balance(self) -> float:            # public read-only getter
        return self.__balance

    def deposit(self, amount: float) -> None:
        if amount <= 0:
            raise ValueError("Deposit amount must be positive")
        self.__balance += amount
        print(f"Deposited £{amount:.2f}. New balance: £{self.__balance:.2f}")

    def withdraw(self, amount: float) -> None:
        if amount <= 0:
            raise ValueError("Withdrawal amount must be positive")
        if amount > self.__balance:
            raise ValueError("Insufficient funds")
        self.__balance -= amount
        print(f"Withdrew £{amount:.2f}. New balance: £{self.__balance:.2f}")


acc = BankAccount("Alice", 100)
acc.deposit(50)          # Deposited £50.00. New balance: £150.00
acc.withdraw(30)         # Withdrew £30.00. New balance: £120.00
print(acc.balance)       # 120.0  — via property, not direct attr access
# acc.__balance = -999   # would NOT work as expected due to name mangling`,
        caption: "BankAccount uses private attrs and properties to enforce a non-negative balance invariant",
      },
    ],
  },
  {
    slug: "aggregation",
    title: "Aggregation",
    section: "Object Oriented Programming",
    tagline: "HAS-A with independence — the child can outlive the parent container",
    blocks: [
      {
        type: "text",
        md: "**Aggregation** is a HAS-A relationship where the contained object can exist independently of the container. A `Department` has `Employee` objects — but if the Department is dissolved, the Employees still exist (they can be reassigned to other departments). The container does not own the lifecycle of its parts. In code, this typically means the contained objects are created *outside* and *passed into* the container.",
      },
      {
        type: "text",
        md: "Aggregation is weaker than Composition. The key test: 'Can the part exist without the whole?' If yes, it's aggregation. This distinction matters for designing deletion behaviour. Deleting a `Department` shouldn't automatically delete its `Employee` objects. Aggregation is shown in UML with a hollow diamond on the container end of the relationship line.",
      },
      {
        type: "heading",
        text: "Key concepts",
      },
      {
        type: "bullets",
        items: [
          "HAS-A relationship where the part can exist independently of the whole",
          "Parts are typically created externally and passed into the container",
          "Container holds references to parts — doesn't own their lifecycle",
          "Deleting the container doesn't delete the parts",
          "Shown as a hollow diamond in UML class diagrams",
          "Example: University HAS-A Department, Team HAS-A Player",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `class Employee:
    def __init__(self, name: str, emp_id: int):
        self.name = name
        self.emp_id = emp_id

    def __repr__(self) -> str:
        return f"Employee({self.name!r}, id={self.emp_id})"


class Department:
    def __init__(self, name: str):
        self.name = name
        self.employees: list[Employee] = []   # aggregation — holds references

    def add_employee(self, emp: Employee) -> None:
        self.employees.append(emp)

    def remove_employee(self, emp: Employee) -> None:
        self.employees.remove(emp)

    def list_employees(self) -> None:
        print(f"Department '{self.name}': {self.employees}")


# Employees created independently
alice = Employee("Alice", 1)
bob   = Employee("Bob", 2)

engineering = Department("Engineering")
engineering.add_employee(alice)
engineering.add_employee(bob)
engineering.list_employees()   # Department 'Engineering': [Employee('Alice', id=1), ...]

# Employee can move to another department — still exists
sales = Department("Sales")
engineering.remove_employee(bob)
sales.add_employee(bob)
print(bob)   # Employee('Bob', id=2) — still alive after removal`,
        caption: "Department aggregates Employees — removing an Employee from a Department doesn't destroy it",
      },
    ],
  },
  {
    slug: "composition",
    title: "Composition",
    section: "Object Oriented Programming",
    tagline: "Strong HAS-A — the part cannot exist without its owner; lifecycle is shared",
    blocks: [
      {
        type: "text",
        md: "**Composition** is a stronger form of the HAS-A relationship where the part *cannot exist independently* of the whole. A `Room` cannot exist without a `House` — it's a physical part of the house. If the house is demolished, the rooms cease to exist. In code, this means the contained objects are created *inside* the owner's `__init__` and destroyed when the owner is destroyed. The owner controls the entire lifecycle.",
      },
      {
        type: "text",
        md: "Composition is often preferable to deep inheritance hierarchies ('favour composition over inheritance'). It keeps classes focused on a single responsibility while delegating specialised behaviour to composed parts. A `Car` composed of an `Engine` and `Transmission` is cleaner than trying to inherit from both. Composition shows up as a filled diamond in UML — the contrast with aggregation's hollow diamond is a useful mental cue.",
      },
      {
        type: "heading",
        text: "Key concepts",
      },
      {
        type: "bullets",
        items: [
          "Strong HAS-A: parts cannot exist without their owner",
          "Parts are instantiated inside the owner's `__init__` — owner controls creation",
          "Destroying the owner implicitly destroys all its parts",
          "Shown as a filled diamond in UML",
          "'Favour composition over inheritance' — keeps classes single-responsibility",
          "Example: House HAS Rooms, Order HAS OrderLines, Human HAS Heart",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `class Room:
    def __init__(self, name: str, area_sqm: float):
        self.name = name
        self.area_sqm = area_sqm

    def __repr__(self) -> str:
        return f"Room({self.name!r}, {self.area_sqm}m²)"


class House:
    def __init__(self, address: str):
        self.address = address
        # Rooms are created INSIDE House — they don't exist independently
        self.rooms: list[Room] = [
            Room("Living Room", 30),
            Room("Kitchen", 15),
            Room("Bedroom", 20),
        ]

    def add_room(self, name: str, area: float) -> None:
        self.rooms.append(Room(name, area))   # Room born here, dies with House

    def total_area(self) -> float:
        return sum(r.area_sqm for r in self.rooms)

    def __repr__(self) -> str:
        return (f"House({self.address!r}, "
                f"rooms={len(self.rooms)}, area={self.total_area()}m²)")


house = House("42 Elm Street")
house.add_room("Bathroom", 8)
print(house)
for room in house.rooms:
    print(" ", room)
# Rooms only meaningful in context of this House`,
        caption: "House composes Rooms — Rooms are created and managed entirely by the House",
      },
    ],
  },
  {
    slug: "association",
    title: "Association",
    section: "Object Oriented Programming",
    tagline: "Uses-A relationship — objects know about each other without owning each other",
    blocks: [
      {
        type: "text",
        md: "**Association** is the most general type of relationship between classes — it simply means one class *uses* or *knows about* another, without either one owning or containing the other. A `Student` can enrol in multiple `Course` objects, and a `Course` can have many `Student` objects. Neither owns the other — they just reference each other. This bidirectional relationship is the basis of most real-world object graphs.",
      },
      {
        type: "text",
        md: "Association relationships can be unidirectional (A knows about B, but B doesn't know about A) or bidirectional (both know about each other). They are the loosest coupling among the HAS-A relationships. In UML, a plain arrow represents unidirectional association. Association sits at the top of the ownership hierarchy: all Aggregations and Compositions are also Associations, but not vice versa.",
      },
      {
        type: "heading",
        text: "Key concepts",
      },
      {
        type: "bullets",
        items: [
          "Objects know about each other without a lifecycle dependency",
          "Can be unidirectional (one arrow) or bidirectional (double arrow in UML)",
          "Neither object owns or manages the other's lifecycle",
          "Most flexible relationship — basis of all object graphs",
          "Aggregation and Composition are specialised forms of Association",
          "Example: Doctor and Patient, Student and Course, Author and Book",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `class Course:
    def __init__(self, name: str, code: str):
        self.name = name
        self.code = code
        self._students: list["Student"] = []

    def enrol(self, student: "Student") -> None:
        if student not in self._students:
            self._students.append(student)

    def student_count(self) -> int:
        return len(self._students)

    def __repr__(self) -> str:
        return f"Course({self.code}: {self.name})"


class Student:
    def __init__(self, name: str, student_id: str):
        self.name = name
        self.student_id = student_id
        self._courses: list[Course] = []

    def register(self, course: Course) -> None:
        if course not in self._courses:
            self._courses.append(course)
            course.enrol(self)    # keep both sides in sync

    def course_list(self) -> list[str]:
        return [c.name for c in self._courses]


# Neither Student nor Course owns the other
alice = Student("Alice", "S001")
ml    = Course("Machine Learning", "CS401")
dsa   = Course("Data Structures", "CS301")

alice.register(ml)
alice.register(dsa)
print(alice.course_list())      # ['Machine Learning', 'Data Structures']
print(ml.student_count())       # 1`,
        caption: "Student and Course associate bidirectionally — neither owns the other",
      },
    ],
  },
];
