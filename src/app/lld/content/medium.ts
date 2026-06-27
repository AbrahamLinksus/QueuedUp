import type { LLDContent } from "./types";

export const MEDIUM_CONTENT: LLDContent[] = [
  {
    slug: "stack-overflow",
    title: "Stack Overflow",
    section: "Interview Questions — Medium",
    tagline: "Q&A platform — questions, answers, votes, tags, reputation, comments",
    blocks: [
      {
        type: "text",
        md: "Design a Q&A platform like Stack Overflow. Users can post questions, post answers, vote on both, leave comments, and tag questions. Reputation is earned through upvotes and accepted answers.",
      },
      {
        type: "heading",
        text: "Functional Requirements",
      },
      {
        type: "bullets",
        items: [
          "Users can post questions with title, body, and tags",
          "Users can post answers to questions; one answer can be marked 'accepted'",
          "Upvote/downvote questions and answers (not your own)",
          "Add comments to questions and answers",
          "Reputation: +10 for upvoted answer, +5 for upvoted question, +15 for accepted answer",
          "Search questions by tag, keyword, or author",
        ],
      },
      {
        type: "heading",
        text: "Key Classes",
      },
      {
        type: "bullets",
        items: [
          "`User`: user_id, name, email, reputation, can_vote()",
          "`Tag`: name, description, questions count",
          "`Vote`: voter, target (question/answer), value (+1/-1)",
          "`Comment`: author, content, created_at",
          "`Answer`: answer_id, author, body, votes, is_accepted, comments",
          "`Question`: question_id, title, body, author, tags, answers, votes, comments, accept_answer()",
          "`ReputationService`: apply_vote(), award_accepted()",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum, auto
import uuid


class VoteValue(Enum):
    UP   = 1
    DOWN = -1


@dataclass
class User:
    user_id: str
    name: str
    email: str
    reputation: int = 1

    def can_vote(self) -> bool:
        return self.reputation >= 15   # Stack Overflow minimum


@dataclass
class Tag:
    name: str
    description: str = ""


@dataclass
class Comment:
    comment_id: str
    author: "User"
    body: str
    created_at: datetime = field(default_factory=datetime.now)


class Votable:
    """Mixin for anything that can receive votes."""
    def __init__(self):
        self._votes: dict[str, VoteValue] = {}   # voter_id -> vote

    def vote(self, voter: User, value: VoteValue) -> int:
        """Cast or change vote. Returns new score."""
        if not voter.can_vote():
            raise PermissionError("Need 15 reputation to vote")
        self._votes[voter.user_id] = value
        return self.score()

    def score(self) -> int:
        return sum(v.value for v in self._votes.values())


class Answer(Votable):
    def __init__(self, author: User, body: str):
        super().__init__()
        self.answer_id   = str(uuid.uuid4())[:8]
        self.author      = author
        self.body        = body
        self.is_accepted = False
        self.comments: list[Comment] = []
        self.created_at  = datetime.now()

    def add_comment(self, author: User, text: str) -> Comment:
        c = Comment(str(uuid.uuid4())[:8], author, text)
        self.comments.append(c)
        return c


class Question(Votable):
    def __init__(self, author: User, title: str, body: str, tags: list[Tag]):
        super().__init__()
        self.question_id  = str(uuid.uuid4())[:8]
        self.author       = author
        self.title        = title
        self.body         = body
        self.tags         = tags
        self.answers: list[Answer] = []
        self.comments: list[Comment] = []
        self.created_at   = datetime.now()

    def add_answer(self, answer: Answer) -> None:
        self.answers.append(answer)

    def accept_answer(self, answer: Answer, by: User) -> None:
        if by.user_id != self.author.user_id:
            raise PermissionError("Only the question author can accept answers")
        for a in self.answers:
            a.is_accepted = False
        answer.is_accepted = True

    def add_comment(self, author: User, text: str) -> Comment:
        c = Comment(str(uuid.uuid4())[:8], author, text)
        self.comments.append(c)
        return c


class ReputationService:
    @staticmethod
    def on_answer_voted(answer: Answer, value: VoteValue) -> None:
        answer.author.reputation += 10 if value == VoteValue.UP else -2

    @staticmethod
    def on_question_voted(question: Question, value: VoteValue) -> None:
        question.author.reputation += 5 if value == VoteValue.UP else -2

    @staticmethod
    def on_answer_accepted(answer: Answer) -> None:
        answer.author.reputation += 15


# --- Demo ---
alice = User("u1", "Alice", "alice@example.com", reputation=100)
bob   = User("u2", "Bob",   "bob@example.com",   reputation=100)
python_tag = Tag("python")

q = Question(alice, "How does GIL work?", "Explain Python GIL...", [python_tag])
a = Answer(bob, "The GIL is a mutex that protects the CPython interpreter...")
q.add_answer(a)

rep_svc = ReputationService()
a.vote(alice, VoteValue.UP)
rep_svc.on_answer_voted(a, VoteValue.UP)
q.accept_answer(a, by=alice)
rep_svc.on_answer_accepted(a)
print(f"Bob reputation: {bob.reputation}")   # 115 (100 + 10 upvote + 15 accepted)`,
        caption: "Stack Overflow: Votable mixin, Question/Answer classes, ReputationService",
      },
      {
        type: "heading",
        text: "Design Decisions to Mention",
      },
      {
        type: "bullets",
        items: [
          "Votable mixin avoids duplicating vote logic between Question and Answer",
          "votes dict (voter_id -> value) automatically handles vote changes — no duplicates",
          "ReputationService is separate from User to keep reputation rules in one place (SRP)",
          "For search: an inverted index over tags and question text; Elasticsearch in production",
          "Anti-abuse: prevent self-voting at the service layer, not inside model classes",
        ],
      },
    ],
  },
  {
    slug: "atm",
    title: "ATM",
    section: "Interview Questions — Medium",
    tagline: "Cash machine — card auth, balance check, withdrawal, deposit, transaction log",
    blocks: [
      {
        type: "text",
        md: "Design an ATM (Automated Teller Machine) system. A user inserts a card, enters a PIN, and can withdraw cash, deposit cash, check their balance, or change their PIN. The ATM communicates with the bank's backend to authorise transactions.",
      },
      {
        type: "heading",
        text: "Functional Requirements",
      },
      {
        type: "bullets",
        items: [
          "Card insertion and PIN verification (lock card after 3 failed attempts)",
          "Check account balance",
          "Withdraw cash (reject if insufficient funds or ATM has insufficient cash)",
          "Deposit cash or cheques",
          "Change PIN after successful authentication",
          "Print or display mini statement of recent transactions",
        ],
      },
      {
        type: "heading",
        text: "Key Classes",
      },
      {
        type: "bullets",
        items: [
          "`Card`: card_number, expiry, is_locked",
          "`Account`: account_id, balance, transaction_history",
          "`Transaction`: tx_id, type (WITHDRAW/DEPOSIT/TRANSFER), amount, timestamp",
          "`Bank`: authenticate(card, pin), get_account(card), process_transaction()",
          "`CashDispenser`: available_cash, dispense(amount), can_dispense(amount)",
          "`ATM`: current_card, current_account, state machine (Idle/Card/Auth/Transaction)",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `from enum import Enum, auto
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional
import uuid


class TransactionType(Enum):
    WITHDRAW = auto()
    DEPOSIT  = auto()
    BALANCE  = auto()


@dataclass
class Transaction:
    tx_id:     str
    tx_type:   TransactionType
    amount:    float
    timestamp: datetime = field(default_factory=datetime.now)


@dataclass
class Card:
    card_number: str
    pin_hash:    str   # store hashed PINs in production
    is_locked:   bool = False
    failed_attempts: int = 0

    def verify_pin(self, pin: str) -> bool:
        if self.is_locked:
            raise PermissionError("Card is locked")
        if pin == self.pin_hash:   # compare hashes in production
            self.failed_attempts = 0
            return True
        self.failed_attempts += 1
        if self.failed_attempts >= 3:
            self.is_locked = True
        return False


class Account:
    def __init__(self, account_id: str, owner_name: str, balance: float = 0.0):
        self.account_id = account_id
        self.owner_name = owner_name
        self._balance   = balance
        self._history: list[Transaction] = []

    @property
    def balance(self) -> float:
        return self._balance

    def deposit(self, amount: float) -> Transaction:
        if amount <= 0:
            raise ValueError("Deposit must be positive")
        self._balance += amount
        tx = Transaction(str(uuid.uuid4())[:8], TransactionType.DEPOSIT, amount)
        self._history.append(tx)
        return tx

    def withdraw(self, amount: float) -> Transaction:
        if amount <= 0:
            raise ValueError("Withdrawal must be positive")
        if amount > self._balance:
            raise ValueError("Insufficient funds")
        self._balance -= amount
        tx = Transaction(str(uuid.uuid4())[:8], TransactionType.WITHDRAW, amount)
        self._history.append(tx)
        return tx

    def recent_transactions(self, n: int = 5) -> list[Transaction]:
        return self._history[-n:]


class CashDispenser:
    def __init__(self, initial_cash: float):
        self._available = initial_cash

    def can_dispense(self, amount: float) -> bool:
        return amount <= self._available

    def dispense(self, amount: float) -> None:
        if not self.can_dispense(amount):
            raise RuntimeError("ATM insufficient cash")
        self._available -= amount
        print(f"Dispensing £{amount:.2f}")


class Bank:
    def __init__(self):
        self._cards:    dict[str, Card]    = {}
        self._accounts: dict[str, Account] = {}
        self._card_to_account: dict[str, str] = {}

    def register(self, card: Card, account: Account) -> None:
        self._cards[card.card_number]              = card
        self._accounts[account.account_id]         = account
        self._card_to_account[card.card_number]    = account.account_id

    def authenticate(self, card_number: str, pin: str) -> Optional[Account]:
        card = self._cards.get(card_number)
        if not card:
            return None
        if card.verify_pin(pin):
            acct_id = self._card_to_account[card_number]
            return self._accounts.get(acct_id)
        return None


class ATM:
    def __init__(self, bank: Bank, cash: float = 10_000):
        self._bank      = bank
        self._dispenser = CashDispenser(cash)
        self._account: Optional[Account] = None

    def insert_card_and_auth(self, card_number: str, pin: str) -> bool:
        self._account = self._bank.authenticate(card_number, pin)
        return self._account is not None

    def check_balance(self) -> float:
        self._require_auth()
        return self._account.balance

    def withdraw(self, amount: float) -> None:
        self._require_auth()
        if not self._dispenser.can_dispense(amount):
            raise RuntimeError("ATM has insufficient cash")
        self._account.withdraw(amount)
        self._dispenser.dispense(amount)

    def deposit(self, amount: float) -> None:
        self._require_auth()
        self._account.deposit(amount)
        print(f"Deposited £{amount:.2f}")

    def eject_card(self) -> None:
        self._account = None
        print("Card ejected. Thank you.")

    def _require_auth(self) -> None:
        if not self._account:
            raise PermissionError("Please authenticate first")


# --- Demo ---
bank    = Bank()
card    = Card("4111111111111111", "1234")
account = Account("ACC001", "Alice", balance=500.0)
bank.register(card, account)

atm = ATM(bank, cash=5000)
if atm.insert_card_and_auth("4111111111111111", "1234"):
    print(f"Balance: £{atm.check_balance():.2f}")
    atm.withdraw(100)
    print(f"Balance after: £{atm.check_balance():.2f}")
atm.eject_card()`,
        caption: "ATM with Bank, Card, Account, CashDispenser — auth, withdraw, deposit flow",
      },
      {
        type: "heading",
        text: "Design Decisions to Mention",
      },
      {
        type: "bullets",
        items: [
          "ATM is a state machine: Idle → CardInserted → Authenticated → Transaction → Idle",
          "Card stores failed_attempts and auto-locks after 3 — security invariant in the model",
          "CashDispenser is a separate class (SRP) — could have bill-denomination logic added later",
          "Bank is the authority for auth and account data — ATM never stores credentials",
          "In production: communicate with bank over encrypted network, use HSM for PIN verification",
        ],
      },
    ],
  },
  {
    slug: "logging-framework",
    title: "Logging Framework",
    section: "Interview Questions — Medium",
    tagline: "Structured logging system — log levels, handlers, formatters, filters",
    blocks: [
      {
        type: "text",
        md: "Design a logging framework similar to Python's `logging` module or Java's Log4j. The framework should support multiple log levels, multiple output handlers (console, file), pluggable formatters, and log filtering.",
      },
      {
        type: "heading",
        text: "Functional Requirements",
      },
      {
        type: "bullets",
        items: [
          "Log levels: DEBUG < INFO < WARNING < ERROR < CRITICAL",
          "Logger accepts messages at a level; only records messages at or above configured level",
          "Multiple handlers per logger: console, file, network",
          "Handlers have their own level filter — a file handler might only capture ERROR+",
          "Formatters control the output string: simple text, JSON, or custom",
          "Loggers can be named (hierarchical) and configured independently",
        ],
      },
      {
        type: "heading",
        text: "Key Classes",
      },
      {
        type: "bullets",
        items: [
          "`LogLevel` enum: DEBUG(10), INFO(20), WARNING(30), ERROR(40), CRITICAL(50)",
          "`LogRecord`: logger_name, level, message, timestamp, extra",
          "`Formatter`: format(record) -> str (SimpleFormatter, JSONFormatter)",
          "`Handler`: emit(record), level filter (ConsoleHandler, FileHandler)",
          "`Logger`: name, level, handlers, debug/info/warning/error/critical() convenience methods",
          "`LogManager`: singleton registry of named loggers, get_logger(name)",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `from abc import ABC, abstractmethod
from datetime import datetime
from enum import IntEnum
import json
import sys
from typing import Any


class LogLevel(IntEnum):
    DEBUG    = 10
    INFO     = 20
    WARNING  = 30
    ERROR    = 40
    CRITICAL = 50


class LogRecord:
    def __init__(self, name: str, level: LogLevel, message: str,
                 extra: dict[str, Any] | None = None):
        self.name      = name
        self.level     = level
        self.message   = message
        self.timestamp = datetime.now()
        self.extra     = extra or {}


class Formatter(ABC):
    @abstractmethod
    def format(self, record: LogRecord) -> str: ...


class SimpleFormatter(Formatter):
    def format(self, record: LogRecord) -> str:
        ts = record.timestamp.strftime("%Y-%m-%d %H:%M:%S")
        return f"{ts} [{record.level.name}] {record.name}: {record.message}"


class JSONFormatter(Formatter):
    def format(self, record: LogRecord) -> str:
        return json.dumps({
            "timestamp": record.timestamp.isoformat(),
            "level":     record.level.name,
            "logger":    record.name,
            "message":   record.message,
            **record.extra,
        })


class Handler(ABC):
    def __init__(self, level: LogLevel = LogLevel.DEBUG,
                 formatter: Formatter | None = None):
        self.level     = level
        self.formatter = formatter or SimpleFormatter()

    def handle(self, record: LogRecord) -> None:
        if record.level >= self.level:
            self.emit(self.formatter.format(record))

    @abstractmethod
    def emit(self, message: str) -> None: ...


class ConsoleHandler(Handler):
    def emit(self, message: str) -> None:
        print(message, file=sys.stdout)


class FileHandler(Handler):
    def __init__(self, path: str, **kwargs: Any):
        super().__init__(**kwargs)
        self._path = path

    def emit(self, message: str) -> None:
        with open(self._path, "a") as f:
            f.write(message + "\n")


class Logger:
    def __init__(self, name: str, level: LogLevel = LogLevel.DEBUG):
        self.name     = name
        self.level    = level
        self._handlers: list[Handler] = []

    def add_handler(self, handler: Handler) -> "Logger":
        self._handlers.append(handler)
        return self

    def log(self, level: LogLevel, message: str, **extra: Any) -> None:
        if level < self.level:
            return
        record = LogRecord(self.name, level, message, extra or None)
        for handler in self._handlers:
            handler.handle(record)

    def debug(self, msg: str, **kw: Any):    self.log(LogLevel.DEBUG,    msg, **kw)
    def info(self, msg: str, **kw: Any):     self.log(LogLevel.INFO,     msg, **kw)
    def warning(self, msg: str, **kw: Any):  self.log(LogLevel.WARNING,  msg, **kw)
    def error(self, msg: str, **kw: Any):    self.log(LogLevel.ERROR,    msg, **kw)
    def critical(self, msg: str, **kw: Any): self.log(LogLevel.CRITICAL, msg, **kw)


class LogManager:
    """Singleton registry of named loggers."""
    _loggers: dict[str, Logger] = {}

    @classmethod
    def get_logger(cls, name: str) -> Logger:
        if name not in cls._loggers:
            cls._loggers[name] = Logger(name)
        return cls._loggers[name]


# --- Demo ---
logger = (LogManager.get_logger("app.db")
          .add_handler(ConsoleHandler(level=LogLevel.DEBUG))
          .add_handler(FileHandler("/tmp/errors.log", level=LogLevel.ERROR,
                                   formatter=JSONFormatter())))

logger.info("Connected to database", host="localhost", port=5432)
logger.error("Query failed", table="users", error="timeout")`,
        caption: "Logging framework: LogLevel, LogRecord, Formatter, Handler, Logger, LogManager",
      },
      {
        type: "heading",
        text: "Design Decisions to Mention",
      },
      {
        type: "bullets",
        items: [
          "Handler.handle() checks its own level — allows per-handler granularity",
          "Formatter is injected into Handler (DIP) — swap JSON ↔ Simple without touching Handler",
          "Logger.log() short-circuits if level below logger threshold — performance optimisation",
          "LogManager as a registry avoids passing loggers through function chains",
          "Thread-safety: FileHandler.emit() needs a lock; use threading.Lock around file write",
        ],
      },
    ],
  },
  {
    slug: "pub-sub-system",
    title: "Pub Sub System",
    section: "Interview Questions — Medium",
    tagline: "Event bus / message broker — publishers, subscribers, topics, filtering",
    blocks: [
      {
        type: "text",
        md: "Design a Publish-Subscribe (Pub/Sub) messaging system. Publishers send messages to topics without knowing who listens. Subscribers register interest in topics and receive messages asynchronously. This is the backbone of event-driven architectures.",
      },
      {
        type: "heading",
        text: "Functional Requirements",
      },
      {
        type: "bullets",
        items: [
          "Publishers can publish messages to named topics",
          "Subscribers can subscribe to one or more topics",
          "All active subscribers on a topic receive each published message",
          "Subscribers can filter messages by properties or content",
          "Support unsubscribe",
          "Durable subscriptions: messages queued if subscriber is temporarily offline",
        ],
      },
      {
        type: "heading",
        text: "Key Classes",
      },
      {
        type: "bullets",
        items: [
          "`Message`: message_id, topic, payload, publisher_id, timestamp",
          "`Subscription`: subscription_id, subscriber, topic, filter_fn",
          "`Topic`: name, subscriptions, publish(message)",
          "`Publisher`: publisher_id, publish(topic, payload)",
          "`Subscriber`: subscriber_id, on_message(message), subscribe(topic), unsubscribe()",
          "`EventBus`: topics dict, get_or_create_topic(), subscribe(), publish()",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from typing import Callable, Any
import uuid


@dataclass
class Message:
    message_id: str
    topic_name: str
    payload:    dict[str, Any]
    publisher:  str
    timestamp:  datetime = field(default_factory=datetime.now)


MessageFilter = Callable[[Message], bool]


class Subscriber(ABC):
    def __init__(self, subscriber_id: str):
        self.subscriber_id = subscriber_id

    @abstractmethod
    def on_message(self, message: Message) -> None: ...


class Subscription:
    def __init__(self, subscriber: Subscriber,
                 filter_fn: MessageFilter | None = None):
        self.subscription_id = str(uuid.uuid4())[:8]
        self.subscriber      = subscriber
        self._filter         = filter_fn

    def deliver(self, message: Message) -> None:
        if self._filter is None or self._filter(message):
            self.subscriber.on_message(message)


class Topic:
    def __init__(self, name: str):
        self.name = name
        self._subscriptions: dict[str, Subscription] = {}

    def subscribe(self, subscriber: Subscriber,
                  filter_fn: MessageFilter | None = None) -> Subscription:
        sub = Subscription(subscriber, filter_fn)
        self._subscriptions[sub.subscription_id] = sub
        return sub

    def unsubscribe(self, subscription_id: str) -> None:
        self._subscriptions.pop(subscription_id, None)

    def publish(self, message: Message) -> None:
        for sub in list(self._subscriptions.values()):
            sub.deliver(message)


class EventBus:
    """Central broker — manages topics and routes messages."""

    _instance: "EventBus | None" = None

    def __init__(self):
        self._topics: dict[str, Topic] = {}

    @classmethod
    def get_instance(cls) -> "EventBus":
        if not cls._instance:
            cls._instance = cls()
        return cls._instance

    def get_or_create_topic(self, name: str) -> Topic:
        if name not in self._topics:
            self._topics[name] = Topic(name)
        return self._topics[name]

    def publish(self, publisher_id: str, topic_name: str,
                payload: dict[str, Any]) -> None:
        topic = self.get_or_create_topic(topic_name)
        msg = Message(str(uuid.uuid4())[:8], topic_name, payload, publisher_id)
        topic.publish(msg)

    def subscribe(self, topic_name: str, subscriber: Subscriber,
                  filter_fn: MessageFilter | None = None) -> Subscription:
        topic = self.get_or_create_topic(topic_name)
        return topic.subscribe(subscriber, filter_fn)


# --- Demo ---
class OrderService(Subscriber):
    def on_message(self, msg: Message) -> None:
        print(f"OrderService received on {msg.topic_name}: {msg.payload}")

class InventoryService(Subscriber):
    def on_message(self, msg: Message) -> None:
        print(f"InventoryService received: {msg.payload}")


bus     = EventBus.get_instance()
orders  = OrderService("order-svc")
invntry = InventoryService("inv-svc")

# Inventory only cares about high-value orders
bus.subscribe("order.created", orders)
bus.subscribe("order.created", invntry,
              filter_fn=lambda m: m.payload.get("total", 0) > 100)

bus.publish("checkout-svc", "order.created", {"order_id": "O1", "total": 50})
bus.publish("checkout-svc", "order.created", {"order_id": "O2", "total": 200})`,
        caption: "EventBus with Topic, Subscription, and optional per-subscriber message filters",
      },
      {
        type: "heading",
        text: "Design Decisions to Mention",
      },
      {
        type: "bullets",
        items: [
          "Filters are lambdas injected at subscribe-time — no changes to Topic or Message",
          "EventBus as Singleton ensures all publishers and subscribers share the same broker",
          "For durability: persist messages to a queue (Redis, Kafka) and replay on reconnect",
          "At-least-once delivery: track acknowledgements; retry unacknowledged messages",
          "For ordering guarantees: partition messages by key (e.g. user_id) and process sequentially",
        ],
      },
    ],
  },
  {
    slug: "elevator-system",
    title: "Elevator System",
    section: "Interview Questions — Medium",
    tagline: "Multi-elevator controller — request dispatch, direction, door management",
    blocks: [
      {
        type: "text",
        md: "Design an elevator control system for a building with multiple elevators and floors. The system receives floor requests (internal: user presses floor button inside elevator, and external: user presses up/down on a floor), dispatches the optimal elevator, and controls doors and movement.",
      },
      {
        type: "heading",
        text: "Functional Requirements",
      },
      {
        type: "bullets",
        items: [
          "Handle internal requests (destination floor) and external requests (floor + direction)",
          "Dispatch the nearest available elevator in the correct direction",
          "Elevator moves floor by floor, opens doors on arrival, waits, then closes",
          "Support IDLE, MOVING_UP, MOVING_DOWN elevator states",
          "Multiple elevators work concurrently",
          "Optimise for minimum wait time (SCAN/LOOK algorithm)",
        ],
      },
      {
        type: "heading",
        text: "Key Classes",
      },
      {
        type: "bullets",
        items: [
          "`Direction` enum: UP, DOWN, IDLE",
          "`Door`: open(), close(), is_open",
          "`Request`: floor, direction (for external), or just floor (for internal)",
          "`Elevator`: id, current_floor, direction, door, request_queue, move(), stop()",
          "`Floor`: floor_num, up_button, down_button",
          "`ElevatorController`: list of elevators, dispatch(request), find_optimal_elevator()",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `from enum import Enum, auto
from dataclasses import dataclass
from typing import Optional
import heapq


class Direction(Enum):
    UP   = auto()
    DOWN = auto()
    IDLE = auto()


@dataclass
class Request:
    floor: int
    direction: Optional[Direction] = None   # None for internal requests


class Door:
    def __init__(self):
        self.is_open = False

    def open(self) -> None:
        self.is_open = True
        print("  Door: OPEN")

    def close(self) -> None:
        self.is_open = False
        print("  Door: CLOSED")


class Elevator:
    def __init__(self, elevator_id: int, total_floors: int):
        self.elevator_id  = elevator_id
        self.current_floor = 1
        self.direction     = Direction.IDLE
        self.door          = Door()
        # Min-heap of (floor, request) for SCAN algorithm
        self._up_queue:   list[int] = []
        self._down_queue: list[int] = []
        self.total_floors  = total_floors

    def add_request(self, floor: int) -> None:
        if floor > self.current_floor:
            heapq.heappush(self._up_queue, floor)
        elif floor < self.current_floor:
            heapq.heappush(self._down_queue, -floor)   # max-heap via negation
        else:
            self.door.open()
            self.door.close()

    def step(self) -> bool:
        """Move one step. Returns False if idle."""
        if self.direction == Direction.UP and self._up_queue:
            target = self._up_queue[0]
            self.current_floor += 1
            if self.current_floor == target:
                heapq.heappop(self._up_queue)
                self._arrive()
            if not self._up_queue:
                self.direction = Direction.DOWN if self._down_queue else Direction.IDLE
        elif self.direction == Direction.DOWN and self._down_queue:
            target = -self._down_queue[0]
            self.current_floor -= 1
            if self.current_floor == target:
                heapq.heappop(self._down_queue)
                self._arrive()
            if not self._down_queue:
                self.direction = Direction.UP if self._up_queue else Direction.IDLE
        elif self._up_queue:
            self.direction = Direction.UP
        elif self._down_queue:
            self.direction = Direction.DOWN
        else:
            return False
        return True

    def _arrive(self) -> None:
        print(f"Elevator {self.elevator_id} arrived at floor {self.current_floor}")
        self.door.open()
        self.door.close()

    def distance_to(self, floor: int) -> int:
        return abs(self.current_floor - floor)


class ElevatorController:
    def __init__(self, num_elevators: int, total_floors: int):
        self.elevators = [Elevator(i, total_floors) for i in range(num_elevators)]

    def dispatch(self, request: Request) -> Elevator:
        """Find nearest elevator compatible with the request direction."""
        best = min(self.elevators, key=lambda e: e.distance_to(request.floor))
        best.add_request(request.floor)
        if best.direction == Direction.IDLE:
            best.direction = (Direction.UP if request.floor > best.current_floor
                              else Direction.DOWN)
        return best

    def run_all(self, steps: int) -> None:
        for _ in range(steps):
            for e in self.elevators:
                e.step()


# --- Demo ---
ctrl = ElevatorController(num_elevators=2, total_floors=10)
ctrl.dispatch(Request(floor=5))
ctrl.dispatch(Request(floor=3))
ctrl.dispatch(Request(floor=8))
ctrl.run_all(10)`,
        caption: "Elevator controller with SCAN scheduling, up/down heaps, door management",
      },
      {
        type: "heading",
        text: "Design Decisions to Mention",
      },
      {
        type: "bullets",
        items: [
          "SCAN algorithm uses two heaps (up-queue min-heap, down-queue max-heap via negation)",
          "ElevatorController.dispatch() picks nearest idle elevator — can improve to consider direction",
          "Door is a separate class — can add safety sensors, obstruction detection, timing",
          "Real system: each elevator runs in its own thread/goroutine with a message queue for requests",
          "Weighted dispatch: consider elevator load, direction compatibility, and estimated arrival time",
        ],
      },
    ],
  },
  {
    slug: "splitwise",
    title: "Splitwise",
    section: "Interview Questions — Medium",
    tagline: "Expense splitting — groups, expenses, equal/exact/percentage splits, balance simplification",
    blocks: [
      {
        type: "text",
        md: "Design an expense-splitting application like Splitwise. Users can create groups, add shared expenses, split them in different ways (equally, by exact amount, or by percentage), and view what each person owes. The system should minimise the number of transactions needed to settle all debts.",
      },
      {
        type: "heading",
        text: "Functional Requirements",
      },
      {
        type: "bullets",
        items: [
          "Users join groups; groups track shared expenses",
          "Add an expense: who paid, how much, who owes what (EQUAL, EXACT, PERCENTAGE)",
          "View net balance per user in a group (positive = owed money, negative = owes money)",
          "Settle up: calculate the minimum transactions to clear all debts",
          "Expense history per user and per group",
          "Support multi-currency (optional extension)",
        ],
      },
      {
        type: "heading",
        text: "Key Classes",
      },
      {
        type: "bullets",
        items: [
          "`SplitType` enum: EQUAL, EXACT, PERCENTAGE",
          "`Split`: user, amount (resolved from split type)",
          "`Expense`: expense_id, description, total, paid_by (User), splits, group, timestamp",
          "`Balance`: net amounts owed between pairs of users",
          "`Group`: members, expenses, get_balances(), add_expense()",
          "`SettlementService`: simplify_debts(balances) using greedy algorithm",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `from enum import Enum, auto
from dataclasses import dataclass, field
from datetime import datetime
from collections import defaultdict
from typing import Optional
import uuid


class SplitType(Enum):
    EQUAL      = auto()
    EXACT      = auto()
    PERCENTAGE = auto()


@dataclass
class User:
    user_id: str
    name:    str
    email:   str

    def __hash__(self): return hash(self.user_id)
    def __eq__(self, other): return isinstance(other, User) and self.user_id == other.user_id


@dataclass
class Split:
    user:   User
    amount: float   # always a concrete £ amount after resolution


class Expense:
    def __init__(self, description: str, total: float, paid_by: User,
                 splits: list[Split]):
        total_splits = sum(s.amount for s in splits)
        if abs(total_splits - total) > 0.01:
            raise ValueError(f"Splits sum {total_splits:.2f} != total {total:.2f}")
        self.expense_id  = str(uuid.uuid4())[:8]
        self.description = description
        self.total       = total
        self.paid_by     = paid_by
        self.splits      = splits
        self.created_at  = datetime.now()


def resolve_splits(split_type: SplitType, total: float,
                   members: list[User],
                   amounts: Optional[list[float]] = None) -> list[Split]:
    """Convert split type + amounts into concrete Split objects."""
    if split_type == SplitType.EQUAL:
        share = round(total / len(members), 2)
        return [Split(m, share) for m in members]
    elif split_type == SplitType.EXACT:
        assert amounts and len(amounts) == len(members)
        return [Split(m, a) for m, a in zip(members, amounts)]
    elif split_type == SplitType.PERCENTAGE:
        assert amounts and abs(sum(amounts) - 100) < 0.01
        return [Split(m, round(total * p / 100, 2)) for m, p in zip(members, amounts)]
    raise ValueError(f"Unknown split type: {split_type}")


class Group:
    def __init__(self, name: str, members: list[User]):
        self.group_id = str(uuid.uuid4())[:8]
        self.name     = name
        self.members  = list(members)
        self._expenses: list[Expense] = []

    def add_expense(self, expense: Expense) -> None:
        self._expenses.append(expense)

    def balances(self) -> dict[str, float]:
        """Positive = owed money, negative = owes money."""
        bal: dict[str, float] = defaultdict(float)
        for exp in self._expenses:
            bal[exp.paid_by.user_id] += exp.total
            for s in exp.splits:
                bal[s.user.user_id] -= s.amount
        return dict(bal)


class SettlementService:
    @staticmethod
    def simplify(balances: dict[str, float]) -> list[tuple[str, str, float]]:
        """Greedy min-transaction settlement. Returns (debtor, creditor, amount) list."""
        creditors = sorted([(v, k) for k, v in balances.items() if v > 0.01], reverse=True)
        debtors   = sorted([(-v, k) for k, v in balances.items() if v < -0.01], reverse=True)
        txns: list[tuple[str, str, float]] = []
        i, j = 0, 0
        while i < len(creditors) and j < len(debtors):
            credit_amt, creditor = creditors[i]
            debt_amt, debtor     = debtors[j]
            pay = min(credit_amt, debt_amt)
            txns.append((debtor, creditor, round(pay, 2)))
            creditors[i] = (credit_amt - pay, creditor)
            debtors[j]   = (debt_amt   - pay, debtor)
            if creditors[i][0] < 0.01: i += 1
            if debtors[j][0]   < 0.01: j += 1
        return txns


# --- Demo ---
alice = User("u1", "Alice", "a@x.com")
bob   = User("u2", "Bob",   "b@x.com")
carol = User("u3", "Carol", "c@x.com")

group = Group("Trip to Paris", [alice, bob, carol])

# Alice paid £90 for dinner, split equally
splits = resolve_splits(SplitType.EQUAL, 90.0, [alice, bob, carol])
group.add_expense(Expense("Dinner", 90.0, alice, splits))

# Bob paid £60 for museum, exact split
splits2 = resolve_splits(SplitType.EXACT, 60.0, [alice, bob, carol], [20, 20, 20])
group.add_expense(Expense("Museum", 60.0, bob, splits2))

bal = group.balances()
print("Balances:", {k: round(v, 2) for k, v in bal.items()})
txns = SettlementService.simplify(bal)
for debtor, creditor, amt in txns:
    print(f"{debtor} pays {creditor}: £{amt:.2f}")`,
        caption: "Splitwise: EQUAL/EXACT/PERCENTAGE splits, group balances, greedy debt simplification",
      },
      {
        type: "heading",
        text: "Design Decisions to Mention",
      },
      {
        type: "bullets",
        items: [
          "resolve_splits() is a pure function — no class needed, easy to test",
          "Expense validates that splits sum matches total at construction time",
          "SettlementService.simplify() uses a greedy algorithm — optimal for minimising transactions",
          "Balances use a defaultdict — no KeyError if a user hasn't been involved in any expense yet",
          "Real Splitwise also handles currency conversion, recurring expenses, and IOUs",
        ],
      },
    ],
  },
  {
    slug: "vending-machine",
    title: "Vending Machine",
    section: "Interview Questions — Medium",
    tagline: "State machine-driven vending — coin handling, item selection, change dispensing",
    blocks: [
      {
        type: "text",
        md: "Design a vending machine that accepts coins, lets users select items, and dispenses the item plus change. This is a textbook State pattern question because the machine behaves differently depending on whether it has received money, whether an item is selected, etc.",
      },
      {
        type: "heading",
        text: "Functional Requirements",
      },
      {
        type: "bullets",
        items: [
          "Insert coins (1p, 2p, 5p, 10p, 20p, 50p, £1, £2)",
          "Display available items and their prices",
          "Select an item; reject if insufficient funds or item out of stock",
          "Dispense selected item and return change",
          "Reject coin insertion if no items are in stock",
          "Admin: restock items, collect cash",
        ],
      },
      {
        type: "heading",
        text: "Key Classes",
      },
      {
        type: "bullets",
        items: [
          "`Coin` enum: PENNY, TWO_PENCE, FIVE_PENCE, ... TWO_POUNDS with `.value` in pence",
          "`Item`: name, price_pence, quantity",
          "`Slot`: item, slot_id",
          "`Inventory`: slots dict, get_item(), restock(), is_empty()",
          "`CoinAcceptor`: inserted_total, insert(coin), return_coins(), calculate_change()",
          "`VendingMachine`: inventory, coin_acceptor, state machine (select/pay/dispense)",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `from enum import Enum
from dataclasses import dataclass
from typing import Optional


class Coin(Enum):
    PENNY        = 1
    TWO_PENCE    = 2
    FIVE_PENCE   = 5
    TEN_PENCE    = 10
    TWENTY_PENCE = 20
    FIFTY_PENCE  = 50
    ONE_POUND    = 100
    TWO_POUNDS   = 200


@dataclass
class Item:
    name:        str
    price_pence: int
    quantity:    int

    def is_available(self) -> bool:
        return self.quantity > 0

    def dispense(self) -> None:
        if not self.is_available():
            raise RuntimeError(f"{self.name} is out of stock")
        self.quantity -= 1


class Inventory:
    def __init__(self):
        self._slots: dict[str, Item] = {}

    def add_item(self, slot_id: str, item: Item) -> None:
        self._slots[slot_id] = item

    def get_item(self, slot_id: str) -> Optional[Item]:
        return self._slots.get(slot_id)

    def is_empty(self) -> bool:
        return all(not item.is_available() for item in self._slots.values())

    def list_available(self) -> list[tuple[str, Item]]:
        return [(sid, item) for sid, item in self._slots.items() if item.is_available()]


class CoinAcceptor:
    COIN_VALUES = sorted([c.value for c in Coin], reverse=True)

    def __init__(self):
        self._inserted: int = 0

    @property
    def total_pence(self) -> int:
        return self._inserted

    def insert(self, coin: Coin) -> None:
        self._inserted += coin.value
        print(f"Inserted {coin.name} (+{coin.value}p). Total: {self._inserted}p")

    def return_coins(self) -> int:
        returned = self._inserted
        self._inserted = 0
        return returned

    def deduct(self, amount_pence: int) -> int:
        """Deduct price and return change in pence."""
        if amount_pence > self._inserted:
            raise ValueError("Insufficient funds")
        change = self._inserted - amount_pence
        self._inserted = 0
        return change

    @staticmethod
    def make_change(change_pence: int) -> dict[str, int]:
        """Greedy change calculation."""
        remaining = change_pence
        result: dict[str, int] = {}
        for coin in Coin:
            if remaining <= 0: break
        for value in CoinAcceptor.COIN_VALUES:
            if remaining >= value:
                count = remaining // value
                remaining -= count * value
                coin_name = next(c.name for c in Coin if c.value == value)
                result[coin_name] = count
        return result


class VendingMachine:
    def __init__(self):
        self.inventory     = Inventory()
        self.coin_acceptor = CoinAcceptor()
        self._selected_slot: Optional[str] = None

    def insert_coin(self, coin: Coin) -> None:
        if self.inventory.is_empty():
            print("Machine is empty. Coin returned.")
            return
        self.coin_acceptor.insert(coin)

    def select_item(self, slot_id: str) -> str:
        item = self.inventory.get_item(slot_id)
        if not item:
            return f"Slot {slot_id!r} not found"
        if not item.is_available():
            return f"{item.name} is out of stock"
        self._selected_slot = slot_id
        return f"Selected {item.name} (£{item.price_pence/100:.2f})"

    def dispense(self) -> str:
        if not self._selected_slot:
            return "Select an item first"
        item = self.inventory.get_item(self._selected_slot)
        if self.coin_acceptor.total_pence < item.price_pence:
            return f"Need {item.price_pence - self.coin_acceptor.total_pence}p more"
        change = self.coin_acceptor.deduct(item.price_pence)
        item.dispense()
        self._selected_slot = None
        change_coins = CoinAcceptor.make_change(change)
        return f"Dispensed {item.name}! Change: {change_coins}"

    def cancel(self) -> int:
        self._selected_slot = None
        returned = self.coin_acceptor.return_coins()
        print(f"Cancelled. Returned {returned}p")
        return returned


# --- Demo ---
vm = VendingMachine()
vm.inventory.add_item("A1", Item("Cola",   150, 5))
vm.inventory.add_item("A2", Item("Crisps", 100, 3))

print(vm.select_item("A1"))
vm.insert_coin(Coin.ONE_POUND)
vm.insert_coin(Coin.FIFTY_PENCE)
print(vm.dispense())`,
        caption: "Vending machine with Inventory, CoinAcceptor, and greedy change calculator",
      },
      {
        type: "heading",
        text: "Design Decisions to Mention",
      },
      {
        type: "bullets",
        items: [
          "Coin enum with .value in pence avoids float arithmetic (a classic interview trap)",
          "CoinAcceptor is separate from VendingMachine (SRP) — easier to unit test",
          "Greedy change algorithm works for standard coin sets; state machines prevent invalid transitions",
          "For robustness: add a VendingMachineState enum and disallow insert_coin in wrong states",
          "Real machine: track float (amount of each coin denomination) to ensure change can be made",
        ],
      },
    ],
  },
  {
    slug: "car-rental-system",
    title: "Car Rental System",
    section: "Interview Questions — Medium",
    tagline: "Vehicle hire management — availability, booking, rental agreements, returns, payments",
    blocks: [
      {
        type: "text",
        md: "Design a car rental system like Hertz or Enterprise. Customers search for available cars by type and location, make reservations, pick up and return vehicles, and are charged based on rental duration and optional extras.",
      },
      {
        type: "heading",
        text: "Functional Requirements",
      },
      {
        type: "bullets",
        items: [
          "Search available cars by type, location, and date range",
          "Create a reservation with pickup and return date",
          "Issue a rental agreement on car pickup",
          "Track car availability (AVAILABLE, RENTED, MAINTENANCE)",
          "Process return with late-return penalty and damage assessment",
          "Multiple branches, each with their own fleet",
        ],
      },
      {
        type: "heading",
        text: "Key Classes",
      },
      {
        type: "bullets",
        items: [
          "`CarType` enum: ECONOMY, COMPACT, SUV, LUXURY, VAN",
          "`CarStatus` enum: AVAILABLE, RENTED, MAINTENANCE",
          "`Car`: plate, make, model, type, status, daily_rate, branch",
          "`Customer`: customer_id, name, driving_licence, email",
          "`Reservation`: id, customer, car, pickup_date, return_date, branch",
          "`RentalAgreement`: reservation, actual_pickup, odometer_start",
          "`Branch`: branch_id, location, fleet (list of Cars), find_available(type, dates)",
          "`RentalService`: search(), reserve(), pickup(), return_car(), calculate_charge()",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `from enum import Enum, auto
from dataclasses import dataclass, field
from datetime import date, datetime
from typing import Optional
import uuid


class CarType(Enum):
    ECONOMY = auto()
    COMPACT = auto()
    SUV     = auto()
    LUXURY  = auto()
    VAN     = auto()


class CarStatus(Enum):
    AVAILABLE   = auto()
    RENTED      = auto()
    MAINTENANCE = auto()


@dataclass
class Customer:
    customer_id: str
    name:        str
    licence_no:  str
    email:       str


class Car:
    def __init__(self, plate: str, make: str, model: str,
                 car_type: CarType, daily_rate: float):
        self.plate      = plate
        self.make       = make
        self.model      = model
        self.car_type   = car_type
        self.daily_rate = daily_rate
        self.status     = CarStatus.AVAILABLE
        self.odometer   = 0

    def is_available_for(self, start: date, end: date,
                          existing_reservations: list["Reservation"]) -> bool:
        if self.status != CarStatus.AVAILABLE:
            return False
        for res in existing_reservations:
            if res.car is self:
                if not (end <= res.pickup_date or start >= res.return_date):
                    return False
        return True


@dataclass
class Reservation:
    reservation_id: str
    customer:       Customer
    car:            Car
    pickup_date:    date
    return_date:    date
    branch_id:      str

    def num_days(self) -> int:
        return max((self.return_date - self.pickup_date).days, 1)

    def estimated_cost(self) -> float:
        return self.num_days() * self.car.daily_rate


class RentalAgreement:
    def __init__(self, reservation: Reservation):
        self.agreement_id  = str(uuid.uuid4())[:8]
        self.reservation   = reservation
        self.actual_pickup = datetime.now()
        self.odometer_start = reservation.car.odometer
        self.is_active     = True

    def close(self, return_datetime: datetime, odometer_end: int,
              damage_charge: float = 0.0) -> float:
        """Calculate final charge and close agreement."""
        actual_days  = max((return_datetime.date() - self.actual_pickup.date()).days, 1)
        late_days    = max((return_datetime.date() - self.reservation.return_date), 0)
        if hasattr(late_days, 'days'):
            late_days = late_days.days
        base_charge  = actual_days * self.reservation.car.daily_rate
        late_penalty = late_days  * self.reservation.car.daily_rate * 1.5
        total        = base_charge + late_penalty + damage_charge
        self.reservation.car.odometer = odometer_end
        self.reservation.car.status   = CarStatus.AVAILABLE
        self.is_active = False
        return round(total, 2)


class Branch:
    def __init__(self, branch_id: str, location: str):
        self.branch_id    = branch_id
        self.location     = location
        self._fleet: list[Car] = []
        self._reservations: list[Reservation] = []

    def add_car(self, car: Car) -> None:
        self._fleet.append(car)

    def search_available(self, car_type: CarType,
                          start: date, end: date) -> list[Car]:
        return [c for c in self._fleet
                if c.car_type == car_type
                and c.is_available_for(start, end, self._reservations)]

    def add_reservation(self, res: Reservation) -> None:
        self._reservations.append(res)


class RentalService:
    def __init__(self):
        self._branches: dict[str, Branch] = {}

    def add_branch(self, branch: Branch) -> None:
        self._branches[branch.branch_id] = branch

    def search(self, branch_id: str, car_type: CarType,
               start: date, end: date) -> list[Car]:
        branch = self._branches[branch_id]
        return branch.search_available(car_type, start, end)

    def reserve(self, customer: Customer, car: Car, branch_id: str,
                start: date, end: date) -> Reservation:
        res = Reservation(str(uuid.uuid4())[:8], customer, car, start, end, branch_id)
        car.status = CarStatus.RENTED
        self._branches[branch_id].add_reservation(res)
        return res

    def pickup(self, reservation: Reservation) -> RentalAgreement:
        reservation.car.status = CarStatus.RENTED
        return RentalAgreement(reservation)

    def return_car(self, agreement: RentalAgreement,
                   odometer_end: int, damage_charge: float = 0.0) -> float:
        return agreement.close(datetime.now(), odometer_end, damage_charge)


# --- Demo ---
svc    = RentalService()
branch = Branch("B1", "London Heathrow")
car    = Car("LH22 XYZ", "Toyota", "Corolla", CarType.COMPACT, 45.00)
branch.add_car(car)
svc.add_branch(branch)

alice = Customer("C1", "Alice", "DRIVE123", "alice@example.com")
start = date(2026, 7, 1)
end   = date(2026, 7, 5)

results = svc.search("B1", CarType.COMPACT, start, end)
print(f"Available: {len(results)} car(s)")
res  = svc.reserve(alice, results[0], "B1", start, end)
print(f"Reserved: {res.reservation_id}, Est. cost: £{res.estimated_cost():.2f}")
agr  = svc.pickup(res)
bill = svc.return_car(agr, odometer_end=15230)
print(f"Final bill: £{bill:.2f}")`,
        caption: "Car Rental: search, reserve, pickup, return with late-penalty calculation",
      },
      {
        type: "heading",
        text: "Design Decisions to Mention",
      },
      {
        type: "bullets",
        items: [
          "is_available_for() checks overlapping date ranges in O(reservations) — production needs a DB query",
          "RentalAgreement is separate from Reservation — preserves the booking intent vs actual use",
          "Late penalty is 1.5× daily rate per day overdue — business rule in one method",
          "For concurrency: reserve() must be atomic — use DB transaction or optimistic locking",
          "Fleet management: add cars to MAINTENANCE status for cleaning/servicing between rentals",
        ],
      },
    ],
  },
  {
    slug: "hotel-management-system",
    title: "Hotel Management System",
    section: "Interview Questions — Medium",
    tagline: "Room bookings, guest management, check-in/check-out, invoicing",
    blocks: [
      {
        type: "text",
        md: "Design a hotel management system. Guests can search for available rooms, make bookings, check in, use hotel services (room service, minibar), and check out with an itemised invoice.",
      },
      {
        type: "heading",
        text: "Functional Requirements",
      },
      {
        type: "bullets",
        items: [
          "Search available rooms by type, date range, and capacity",
          "Create, modify, and cancel bookings",
          "Check in: assign room, record check-in time",
          "Record additional charges during stay (room service, minibar)",
          "Check out: generate itemised invoice and process payment",
          "Room status: AVAILABLE, OCCUPIED, MAINTENANCE, RESERVED",
        ],
      },
      {
        type: "heading",
        text: "Key Classes",
      },
      {
        type: "bullets",
        items: [
          "`RoomType` enum: SINGLE, DOUBLE, SUITE, PENTHOUSE",
          "`RoomStatus` enum: AVAILABLE, OCCUPIED, MAINTENANCE, RESERVED",
          "`Room`: room_num, type, floor, capacity, nightly_rate, status, amenities",
          "`Guest`: guest_id, name, email, phone, id_document",
          "`Booking`: id, guest, room, check_in_date, check_out_date, status",
          "`CheckIn`: booking, actual_check_in, additional_charges",
          "`Invoice`: booking, room_charges, additional_charges, taxes, total",
          "`Hotel`: name, floors, rooms, bookings, check_in(), check_out()",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `from enum import Enum, auto
from dataclasses import dataclass, field
from datetime import date, datetime
from typing import Optional
import uuid


class RoomType(Enum):
    SINGLE   = auto()
    DOUBLE   = auto()
    SUITE    = auto()
    PENTHOUSE = auto()


class RoomStatus(Enum):
    AVAILABLE   = auto()
    OCCUPIED    = auto()
    MAINTENANCE = auto()
    RESERVED    = auto()


class BookingStatus(Enum):
    CONFIRMED  = auto()
    CHECKED_IN = auto()
    CHECKED_OUT = auto()
    CANCELLED  = auto()


@dataclass
class Guest:
    guest_id:    str
    name:        str
    email:       str
    phone:       str
    id_document: str


class Room:
    def __init__(self, room_num: str, room_type: RoomType,
                 floor: int, capacity: int, nightly_rate: float):
        self.room_num     = room_num
        self.room_type    = room_type
        self.floor        = floor
        self.capacity     = capacity
        self.nightly_rate = nightly_rate
        self.status       = RoomStatus.AVAILABLE

    def is_available_for(self, check_in: date, check_out: date,
                          bookings: list["Booking"]) -> bool:
        if self.status == RoomStatus.MAINTENANCE:
            return False
        for b in bookings:
            if (b.room is self
                    and b.status not in {BookingStatus.CANCELLED, BookingStatus.CHECKED_OUT}):
                if not (check_out <= b.check_in_date or check_in >= b.check_out_date):
                    return False
        return True


class Booking:
    def __init__(self, guest: Guest, room: Room,
                 check_in: date, check_out: date):
        self.booking_id   = str(uuid.uuid4())[:8]
        self.guest        = guest
        self.room         = room
        self.check_in_date  = check_in
        self.check_out_date = check_out
        self.status       = BookingStatus.CONFIRMED

    def nights(self) -> int:
        return max((self.check_out_date - self.check_in_date).days, 1)


class AdditionalCharge:
    def __init__(self, description: str, amount: float):
        self.description = description
        self.amount      = amount
        self.timestamp   = datetime.now()


class CheckIn:
    def __init__(self, booking: Booking):
        self.booking    = booking
        self.actual_in  = datetime.now()
        self._charges: list[AdditionalCharge] = []
        booking.status  = BookingStatus.CHECKED_IN
        booking.room.status = RoomStatus.OCCUPIED

    def add_charge(self, description: str, amount: float) -> None:
        self._charges.append(AdditionalCharge(description, amount))

    @property
    def extra_total(self) -> float:
        return sum(c.amount for c in self._charges)


@dataclass
class Invoice:
    booking:        Booking
    check_in_rec:   CheckIn
    tax_rate:       float = 0.20   # 20% VAT

    def room_subtotal(self) -> float:
        return self.booking.nights() * self.booking.room.nightly_rate

    def extras_subtotal(self) -> float:
        return self.check_in_rec.extra_total

    def pre_tax(self) -> float:
        return self.room_subtotal() + self.extras_subtotal()

    def tax(self) -> float:
        return round(self.pre_tax() * self.tax_rate, 2)

    def total(self) -> float:
        return round(self.pre_tax() + self.tax(), 2)

    def print_invoice(self) -> None:
        print(f"=== Invoice for {self.booking.guest.name} ===")
        print(f"Room {self.booking.room.room_num} x {self.booking.nights()} nights:"
              f" £{self.room_subtotal():.2f}")
        for c in self.check_in_rec._charges:
            print(f"  {c.description}: £{c.amount:.2f}")
        print(f"VAT (20%): £{self.tax():.2f}")
        print(f"TOTAL: £{self.total():.2f}")


class Hotel:
    def __init__(self, name: str):
        self.name     = name
        self._rooms:    list[Room]    = []
        self._bookings: list[Booking] = []
        self._checkins: dict[str, CheckIn] = {}   # booking_id -> CheckIn

    def add_room(self, room: Room) -> None:
        self._rooms.append(room)

    def search(self, room_type: RoomType, check_in: date,
               check_out: date) -> list[Room]:
        return [r for r in self._rooms
                if r.room_type == room_type
                and r.is_available_for(check_in, check_out, self._bookings)]

    def book(self, guest: Guest, room: Room,
             check_in: date, check_out: date) -> Booking:
        b = Booking(guest, room, check_in, check_out)
        self._bookings.append(b)
        room.status = RoomStatus.RESERVED
        return b

    def check_in(self, booking: Booking) -> CheckIn:
        ci = CheckIn(booking)
        self._checkins[booking.booking_id] = ci
        return ci

    def check_out(self, booking_id: str) -> Invoice:
        ci = self._checkins.pop(booking_id)
        ci.booking.status = BookingStatus.CHECKED_OUT
        ci.booking.room.status = RoomStatus.AVAILABLE
        return Invoice(ci.booking, ci)


# --- Demo ---
hotel = Hotel("Grand Plaza")
hotel.add_room(Room("101", RoomType.DOUBLE, 1, 2, 120.0))

guest = Guest("G1", "Alice", "alice@x.com", "07700000000", "PASS123")
check_in  = date(2026, 8, 1)
check_out = date(2026, 8, 4)

rooms = hotel.search(RoomType.DOUBLE, check_in, check_out)
booking = hotel.book(guest, rooms[0], check_in, check_out)
ci = hotel.check_in(booking)
ci.add_charge("Room Service", 35.0)
ci.add_charge("Minibar",      12.50)
invoice = hotel.check_out(booking.booking_id)
invoice.print_invoice()`,
        caption: "Hotel system: search, book, check-in, add charges, check-out with invoice",
      },
      {
        type: "heading",
        text: "Design Decisions to Mention",
      },
      {
        type: "bullets",
        items: [
          "CheckIn is a separate entity from Booking — captures actual vs planned dates",
          "Invoice computes at check-out time, not upfront — allows for dynamic charges",
          "Room availability check iterates bookings — production needs a SQL availability query",
          "Room status transitions: AVAILABLE → RESERVED → OCCUPIED → AVAILABLE (or MAINTENANCE)",
          "Add a HousekeepingService to coordinate room cleaning between check-out and next check-in",
        ],
      },
    ],
  },
  {
    slug: "digital-wallet",
    title: "Digital Wallet",
    section: "Interview Questions — Medium",
    tagline: "E-wallet — balance management, payments, transfers, transaction history",
    blocks: [
      {
        type: "text",
        md: "Design a digital wallet system like PayPal, Google Pay, or Apple Pay. Users can add money, pay merchants, transfer to other users, and view transaction history. The system must handle concurrent transactions safely.",
      },
      {
        type: "heading",
        text: "Functional Requirements",
      },
      {
        type: "bullets",
        items: [
          "Add money to wallet via linked payment method",
          "Pay a merchant — debit wallet, record transaction",
          "Transfer money to another user's wallet",
          "View transaction history with filters",
          "Multiple currencies with exchange rate support",
          "Insufficient funds should reject payment atomically",
        ],
      },
      {
        type: "heading",
        text: "Key Classes",
      },
      {
        type: "bullets",
        items: [
          "`TransactionType` enum: CREDIT, DEBIT, TRANSFER_IN, TRANSFER_OUT",
          "`Currency` enum: GBP, USD, EUR",
          "`Transaction`: tx_id, type, amount, currency, description, timestamp, balance_after",
          "`PaymentMethod`: id, type (CARD/BANK), masked_number, is_default",
          "`Wallet`: wallet_id, owner, balance, currency, add_money(), pay(), transfer()",
          "`WalletService`: get_wallet(), transfer_between(), exchange_rate(from, to)",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `from enum import Enum, auto
from dataclasses import dataclass, field
from datetime import datetime
from decimal import Decimal
from typing import Optional
import threading
import uuid


class TransactionType(Enum):
    CREDIT       = auto()
    DEBIT        = auto()
    TRANSFER_IN  = auto()
    TRANSFER_OUT = auto()


class Currency(Enum):
    GBP = "GBP"
    USD = "USD"
    EUR = "EUR"


# Simplified exchange rates (base GBP)
EXCHANGE_RATES: dict[tuple[Currency, Currency], Decimal] = {
    (Currency.GBP, Currency.USD): Decimal("1.27"),
    (Currency.GBP, Currency.EUR): Decimal("1.18"),
    (Currency.USD, Currency.GBP): Decimal("0.79"),
    (Currency.EUR, Currency.GBP): Decimal("0.85"),
}


@dataclass
class Transaction:
    tx_id:         str
    tx_type:       TransactionType
    amount:        Decimal
    currency:      Currency
    description:   str
    balance_after: Decimal
    timestamp:     datetime = field(default_factory=datetime.now)


class Wallet:
    def __init__(self, owner_id: str, currency: Currency = Currency.GBP):
        self.wallet_id = str(uuid.uuid4())[:8]
        self.owner_id  = owner_id
        self.currency  = currency
        self._balance  = Decimal("0.00")
        self._history: list[Transaction] = []
        self._lock     = threading.Lock()

    @property
    def balance(self) -> Decimal:
        return self._balance

    def _record(self, tx_type: TransactionType, amount: Decimal,
                description: str) -> Transaction:
        tx = Transaction(str(uuid.uuid4())[:8], tx_type, amount,
                         self.currency, description, self._balance)
        self._history.append(tx)
        return tx

    def credit(self, amount: Decimal, description: str = "") -> Transaction:
        if amount <= 0:
            raise ValueError("Amount must be positive")
        with self._lock:
            self._balance += amount
            return self._record(TransactionType.CREDIT, amount, description)

    def debit(self, amount: Decimal, description: str = "") -> Transaction:
        if amount <= 0:
            raise ValueError("Amount must be positive")
        with self._lock:
            if self._balance < amount:
                raise ValueError(f"Insufficient funds: have {self._balance}, need {amount}")
            self._balance -= amount
            return self._record(TransactionType.DEBIT, amount, description)

    def get_history(self, limit: int = 10) -> list[Transaction]:
        return self._history[-limit:]


class WalletService:
    def __init__(self):
        self._wallets: dict[str, Wallet] = {}

    def create_wallet(self, owner_id: str,
                      currency: Currency = Currency.GBP) -> Wallet:
        w = Wallet(owner_id, currency)
        self._wallets[owner_id] = w
        return w

    def get_wallet(self, owner_id: str) -> Wallet:
        w = self._wallets.get(owner_id)
        if not w:
            raise KeyError(f"No wallet for {owner_id!r}")
        return w

    def transfer(self, from_id: str, to_id: str,
                 amount: Decimal, description: str = "") -> tuple[Transaction, Transaction]:
        """Atomic transfer between two wallets."""
        src = self.get_wallet(from_id)
        dst = self.get_wallet(to_id)
        # Convert if different currencies
        dst_amount = amount
        if src.currency != dst.currency:
            rate = EXCHANGE_RATES.get((src.currency, dst.currency), Decimal("1"))
            dst_amount = (amount * rate).quantize(Decimal("0.01"))
        # Debit source first, then credit destination
        tx_out = src.debit(amount, f"Transfer to {to_id}: {description}")
        tx_in  = dst.credit(dst_amount, f"Transfer from {from_id}: {description}")
        return tx_out, tx_in


# --- Demo ---
svc = WalletService()
alice_wallet = svc.create_wallet("alice")
bob_wallet   = svc.create_wallet("bob")

alice_wallet.credit(Decimal("500.00"), "Salary")
svc.transfer("alice", "bob", Decimal("100.00"), "Rent contribution")

print(f"Alice: £{alice_wallet.balance:.2f}")
print(f"Bob:   £{bob_wallet.balance:.2f}")
for tx in alice_wallet.get_history():
    print(f"  {tx.tx_type.name}: {tx.amount} — {tx.description}")`,
        caption: "Digital wallet with thread-safe debit/credit, currency conversion, atomic transfers",
      },
      {
        type: "heading",
        text: "Design Decisions to Mention",
      },
      {
        type: "bullets",
        items: [
          "Decimal type for money — NEVER use float for financial calculations",
          "threading.Lock per wallet prevents race conditions in concurrent transfers",
          "Transfer debit-before-credit: if credit fails, need to compensate (Saga pattern in production)",
          "Transaction records balance_after — enables point-in-time balance reconstruction without summing history",
          "Production: distributed transactions across wallets need 2-phase commit or event sourcing",
        ],
      },
    ],
  },
  {
    slug: "airline-management-system",
    title: "Airline Management System",
    section: "Interview Questions — Medium",
    tagline: "Flight booking — seats, classes, passengers, reservations, boarding passes",
    blocks: [
      {
        type: "text",
        md: "Design an airline management system. Passengers can search for flights, select seats in different classes, make bookings, receive boarding passes, and manage their reservations (upgrade, cancel).",
      },
      {
        type: "heading",
        text: "Functional Requirements",
      },
      {
        type: "bullets",
        items: [
          "Search flights by origin, destination, and date",
          "Book a seat on a flight — choose class (ECONOMY, BUSINESS, FIRST)",
          "Seat map display showing available and taken seats",
          "Issue boarding pass on check-in",
          "Cancel booking with refund policy based on notice period",
          "Flight status updates (ON_TIME, DELAYED, CANCELLED, BOARDING)",
        ],
      },
      {
        type: "heading",
        text: "Key Classes",
      },
      {
        type: "bullets",
        items: [
          "`SeatClass` enum: ECONOMY, BUSINESS, FIRST",
          "`FlightStatus` enum: SCHEDULED, BOARDING, DEPARTED, ARRIVED, CANCELLED, DELAYED",
          "`Aircraft`: registration, model, seat_configuration",
          "`Seat`: seat_number, seat_class, is_occupied, passenger",
          "`Flight`: flight_num, origin, destination, departure, aircraft, status, get_available_seats()",
          "`Passenger`: passenger_id, name, passport, frequent_flyer_no",
          "`Booking`: booking_ref, passenger, flight, seat, fare, status",
          "`BoardingPass`: booking, gate, boarding_time",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `from enum import Enum, auto
from dataclasses import dataclass, field
from datetime import datetime, date
from typing import Optional
import uuid


class SeatClass(Enum):
    ECONOMY  = auto()
    BUSINESS = auto()
    FIRST    = auto()


FARE_MULTIPLIER = {SeatClass.ECONOMY: 1.0, SeatClass.BUSINESS: 2.5, SeatClass.FIRST: 5.0}


class FlightStatus(Enum):
    SCHEDULED = auto()
    BOARDING  = auto()
    DEPARTED  = auto()
    ARRIVED   = auto()
    CANCELLED = auto()
    DELAYED   = auto()


@dataclass
class Passenger:
    passenger_id: str
    name:         str
    passport_no:  str
    email:        str
    ffp_number:   Optional[str] = None   # frequent flyer programme


class Seat:
    def __init__(self, seat_number: str, seat_class: SeatClass):
        self.seat_number = seat_number
        self.seat_class  = seat_class
        self.is_occupied = False
        self.passenger:  Optional[Passenger] = None

    def occupy(self, passenger: Passenger) -> None:
        if self.is_occupied:
            raise RuntimeError(f"Seat {self.seat_number} already occupied")
        self.passenger   = passenger
        self.is_occupied = True

    def vacate(self) -> None:
        self.passenger   = None
        self.is_occupied = False

    def __repr__(self) -> str:
        status = "TAKEN" if self.is_occupied else "FREE"
        return f"{self.seat_number}({self.seat_class.name[0]}) [{status}]"


class Aircraft:
    def __init__(self, registration: str, model: str):
        self.registration = registration
        self.model        = model
        self._seats: list[Seat] = []

    def add_seats(self, rows: int, per_row: int,
                  seat_class: SeatClass) -> None:
        letters = "ABCDEF"[:per_row]
        start   = len(self._seats) // per_row + 1
        for r in range(start, start + rows):
            for l in letters[:per_row]:
                self._seats.append(Seat(f"{r}{l}", seat_class))

    def get_available(self, seat_class: SeatClass) -> list[Seat]:
        return [s for s in self._seats
                if s.seat_class == seat_class and not s.is_occupied]


class Flight:
    def __init__(self, flight_num: str, origin: str, destination: str,
                 departure: datetime, arrival: datetime,
                 aircraft: Aircraft, base_fare: float):
        self.flight_num  = flight_num
        self.origin      = origin
        self.destination = destination
        self.departure   = departure
        self.arrival     = arrival
        self.aircraft    = aircraft
        self.base_fare   = base_fare
        self.status      = FlightStatus.SCHEDULED

    def fare_for(self, seat_class: SeatClass) -> float:
        return round(self.base_fare * FARE_MULTIPLIER[seat_class], 2)

    def available_seats(self, seat_class: Optional[SeatClass] = None) -> list[Seat]:
        return self.aircraft.get_available(seat_class) if seat_class else [
            s for s in self.aircraft._seats if not s.is_occupied
        ]


class Booking:
    def __init__(self, passenger: Passenger, flight: Flight,
                 seat: Seat, fare: float):
        self.booking_ref = str(uuid.uuid4())[:6].upper()
        self.passenger   = passenger
        self.flight      = flight
        self.seat        = seat
        self.fare        = fare
        self.booked_at   = datetime.now()
        self.is_cancelled = False
        seat.occupy(passenger)

    def cancel(self) -> float:
        """Cancel and return refund amount."""
        if self.is_cancelled:
            raise RuntimeError("Already cancelled")
        hours_to_departure = (self.flight.departure - datetime.now()).total_seconds() / 3600
        refund_pct = 1.0 if hours_to_departure > 48 else 0.5 if hours_to_departure > 24 else 0.0
        self.seat.vacate()
        self.is_cancelled = True
        return round(self.fare * refund_pct, 2)


@dataclass
class BoardingPass:
    booking:       Booking
    gate:          str
    boarding_time: datetime
    barcode:       str = field(default_factory=lambda: str(uuid.uuid4())[:12])


class AirlineSystem:
    def __init__(self):
        self._flights:  list[Flight]  = []
        self._bookings: dict[str, Booking] = {}

    def add_flight(self, flight: Flight) -> None:
        self._flights.append(flight)

    def search_flights(self, origin: str, destination: str,
                       travel_date: date) -> list[Flight]:
        return [f for f in self._flights
                if f.origin == origin
                and f.destination == destination
                and f.departure.date() == travel_date
                and f.status != FlightStatus.CANCELLED]

    def book(self, passenger: Passenger, flight: Flight,
             seat_class: SeatClass) -> Booking:
        available = flight.available_seats(seat_class)
        if not available:
            raise RuntimeError(f"No {seat_class.name} seats available")
        seat    = available[0]
        fare    = flight.fare_for(seat_class)
        booking = Booking(passenger, flight, seat, fare)
        self._bookings[booking.booking_ref] = booking
        return booking

    def issue_boarding_pass(self, booking_ref: str, gate: str) -> BoardingPass:
        booking = self._bookings[booking_ref]
        if booking.is_cancelled:
            raise RuntimeError("Cannot board — booking cancelled")
        return BoardingPass(booking, gate,
                            boarding_time=booking.flight.departure)


# --- Demo ---
aircraft = Aircraft("G-ABCD", "Boeing 737")
aircraft.add_seats(30, 6, SeatClass.ECONOMY)
aircraft.add_seats(5,  4, SeatClass.BUSINESS)

flight = Flight("BA123", "LHR", "JFK",
                datetime(2026, 9, 1, 10, 0),
                datetime(2026, 9, 1, 20, 0),
                aircraft, base_fare=400.0)

system    = AirlineSystem()
system.add_flight(flight)

alice    = Passenger("P1", "Alice", "GB123456", "alice@x.com")
results  = system.search_flights("LHR", "JFK", date(2026, 9, 1))
booking  = system.book(alice, results[0], SeatClass.ECONOMY)
print(f"Booked {booking.booking_ref}, seat {booking.seat}, fare £{booking.fare}")
bp = system.issue_boarding_pass(booking.booking_ref, gate="B12")
print(f"Boarding pass: {bp.barcode}, gate {bp.gate}")`,
        caption: "Airline system: aircraft seat map, flight search, booking, cancellation policy, boarding pass",
      },
      {
        type: "heading",
        text: "Design Decisions to Mention",
      },
      {
        type: "bullets",
        items: [
          "Seat.occupy() atomically sets is_occupied — prevents double-booking at model level",
          "Booking.cancel() computes refund from time-to-departure — business rule in one place",
          "Aircraft.add_seats() builds seat map at setup time — no need to generate seats per query",
          "For concurrent booking: DB row-level lock on Seat or optimistic version check",
          "Extend with: baggage allowance per class, meal preferences, seat change workflow",
        ],
      },
    ],
  },
  {
    slug: "library-management-system",
    title: "Library Management System",
    section: "Interview Questions — Medium",
    tagline: "Book lending — catalogue, members, loans, overdue fines, reservations",
    blocks: [
      {
        type: "text",
        md: "Design a library management system. Members can search the catalogue, borrow physical copies of books, return them, and reserve books that are currently on loan. The system calculates overdue fines and tracks member borrowing history.",
      },
      {
        type: "heading",
        text: "Functional Requirements",
      },
      {
        type: "bullets",
        items: [
          "Catalogue: search books by title, author, ISBN, or genre",
          "A book can have multiple physical copies (BookItems) — each with its own status",
          "Members can borrow up to 5 books; loan period is 14 days",
          "Reserve a book if all copies are on loan; get notified when available",
          "Calculate overdue fine: 20p per day per book",
          "Member account management: join, renew membership, check history",
        ],
      },
      {
        type: "heading",
        text: "Key Classes",
      },
      {
        type: "bullets",
        items: [
          "`BookStatus` enum: AVAILABLE, ON_LOAN, RESERVED, LOST",
          "`Book`: isbn, title, authors, genre, publisher, year",
          "`BookItem`: barcode, book (ref), status, location",
          "`Member`: id, name, email, active_loans, reservations, borrowing_history",
          "`Loan`: loan_id, member, book_item, due_date, returned_date",
          "`Reservation`: reservation_id, member, book, date_reserved, expires",
          "`Library`: catalog, members, checkout(), return_book(), reserve()",
          "`FineCalculator`: calculate(loan) -> float",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `from enum import Enum, auto
from dataclasses import dataclass, field
from datetime import date, timedelta, datetime
from typing import Optional
import uuid


class BookStatus(Enum):
    AVAILABLE = auto()
    ON_LOAN   = auto()
    RESERVED  = auto()
    LOST      = auto()


LOAN_DAYS    = 14
MAX_LOANS    = 5
FINE_PER_DAY = 0.20   # £ per overdue day


@dataclass
class Book:
    isbn:      str
    title:     str
    authors:   list[str]
    genre:     str
    publisher: str
    year:      int


class BookItem:
    def __init__(self, barcode: str, book: Book, location: str):
        self.barcode  = barcode
        self.book     = book
        self.location = location
        self.status   = BookStatus.AVAILABLE

    def __repr__(self) -> str:
        return f"BookItem({self.barcode}: {self.book.title!r} [{self.status.name}])"


class Member:
    def __init__(self, member_id: str, name: str, email: str):
        self.member_id   = member_id
        self.name        = name
        self.email       = email
        self.is_active   = True
        self._loans: list["Loan"] = []
        self._reservations: list["Reservation"] = []

    def active_loan_count(self) -> int:
        return sum(1 for l in self._loans if l.returned_date is None)

    def can_borrow(self) -> bool:
        return self.is_active and self.active_loan_count() < MAX_LOANS

    def add_loan(self, loan: "Loan") -> None:
        self._loans.append(loan)

    def add_reservation(self, res: "Reservation") -> None:
        self._reservations.append(res)


class Loan:
    def __init__(self, member: Member, book_item: BookItem):
        self.loan_id       = str(uuid.uuid4())[:8]
        self.member        = member
        self.book_item     = book_item
        self.checkout_date = date.today()
        self.due_date      = date.today() + timedelta(days=LOAN_DAYS)
        self.returned_date: Optional[date] = None
        book_item.status   = BookStatus.ON_LOAN

    def is_overdue(self) -> bool:
        compare = self.returned_date or date.today()
        return compare > self.due_date

    def days_overdue(self) -> int:
        compare = self.returned_date or date.today()
        return max((compare - self.due_date).days, 0)

    def fine(self) -> float:
        return round(self.days_overdue() * FINE_PER_DAY, 2)


class Reservation:
    def __init__(self, member: Member, book: Book):
        self.reservation_id = str(uuid.uuid4())[:8]
        self.member          = member
        self.book            = book
        self.reserved_date   = date.today()
        self.expires         = date.today() + timedelta(days=7)
        self.is_fulfilled    = False


class Library:
    def __init__(self, name: str):
        self.name = name
        self._catalog: dict[str, list[BookItem]] = {}   # isbn -> items
        self._members: dict[str, Member]          = {}
        self._loans:   list[Loan]                 = []
        self._reservations: list[Reservation]     = []

    def add_book_item(self, item: BookItem) -> None:
        isbn = item.book.isbn
        self._catalog.setdefault(isbn, []).append(item)

    def register_member(self, member: Member) -> None:
        self._members[member.member_id] = member

    def search_by_title(self, query: str) -> list[Book]:
        seen: set[str] = set()
        results: list[Book] = []
        for items in self._catalog.values():
            book = items[0].book
            if query.lower() in book.title.lower() and book.isbn not in seen:
                results.append(book)
                seen.add(book.isbn)
        return results

    def find_available_item(self, isbn: str) -> Optional[BookItem]:
        for item in self._catalog.get(isbn, []):
            if item.status == BookStatus.AVAILABLE:
                return item
        return None

    def checkout(self, member_id: str, isbn: str) -> Loan:
        member = self._members[member_id]
        if not member.can_borrow():
            raise RuntimeError("Member cannot borrow: inactive or at loan limit")
        item = self.find_available_item(isbn)
        if not item:
            raise RuntimeError("No available copy — consider reserving")
        loan = Loan(member, item)
        member.add_loan(loan)
        self._loans.append(loan)
        return loan

    def return_book(self, loan: Loan) -> float:
        loan.returned_date      = date.today()
        loan.book_item.status   = BookStatus.AVAILABLE
        fine = loan.fine()
        # Notify any reservation holders
        self._fulfil_next_reservation(loan.book_item.book.isbn)
        return fine

    def reserve(self, member_id: str, isbn: str) -> Reservation:
        member = self._members[member_id]
        if self.find_available_item(isbn):
            raise RuntimeError("Copies available — no need to reserve")
        res = Reservation(member, self._catalog[isbn][0].book)
        member.add_reservation(res)
        self._reservations.append(res)
        return res

    def _fulfil_next_reservation(self, isbn: str) -> None:
        pending = [r for r in self._reservations
                   if r.book.isbn == isbn and not r.is_fulfilled
                   and r.expires >= date.today()]
        if pending:
            oldest = min(pending, key=lambda r: r.reserved_date)
            oldest.is_fulfilled = True
            print(f"Notifying {oldest.member.name}: copy of {oldest.book.title!r} available")


# --- Demo ---
library = Library("City Library")
book = Book("978-0132350884", "Clean Code", ["Robert Martin"], "Tech", "Prentice Hall", 2008)
for i in range(2):
    library.add_book_item(BookItem(f"BC{i:03}", book, f"Shelf A{i}"))

alice = Member("M1", "Alice", "alice@x.com")
library.register_member(alice)

loan = library.checkout("M1", "978-0132350884")
print(f"Checked out: {loan.book_item.barcode}, due {loan.due_date}")
fine = library.return_book(loan)
print(f"Fine: £{fine:.2f}")`,
        caption: "Library: BookItem status, Loan overdue fines, reservations with notification on return",
      },
      {
        type: "heading",
        text: "Design Decisions to Mention",
      },
      {
        type: "bullets",
        items: [
          "Book vs BookItem separation: one ISBN can have many physical copies (like database Book and Inventory)",
          "_fulfil_next_reservation() on return handles the queue automatically",
          "Loan.fine() works both for current overdue (uses today) and historical (uses returned_date)",
          "MAX_LOANS enforced in Member.can_borrow() — single source of truth for the business rule",
          "Production: email/SMS notification service for reservation fulfilment",
        ],
      },
    ],
  },
  {
    slug: "traffic-signal-control",
    title: "Traffic Signal Control",
    section: "Interview Questions — Medium",
    tagline: "Intersection management — signal phases, timers, adaptive control",
    blocks: [
      {
        type: "text",
        md: "Design a traffic signal control system for a multi-lane road intersection. The system manages signal phases (RED/YELLOW/GREEN) for each lane group, cycles through phases on a timer, and can adapt timing based on traffic density.",
      },
      {
        type: "heading",
        text: "Functional Requirements",
      },
      {
        type: "bullets",
        items: [
          "Control signal phases for each approach (N/S/E/W) at an intersection",
          "Fixed-time cycle: each phase runs for a configurable duration",
          "Pedestrian crossing signals coordinated with vehicle signals",
          "Emergency vehicle preemption: freeze all non-emergency signals",
          "Adaptive mode: extend green time if queue length exceeds threshold",
          "Fault detection: trigger yellow flashing if a signal bulb fails",
        ],
      },
      {
        type: "heading",
        text: "Key Classes",
      },
      {
        type: "bullets",
        items: [
          "`SignalState` enum: RED, YELLOW, GREEN, FLASHING_YELLOW",
          "`Direction` enum: NORTH, SOUTH, EAST, WEST",
          "`TrafficLight`: direction, current_signal, change_to(state)",
          "`Phase`: list of (direction, signal) pairs, duration_seconds",
          "`Lane`: direction, vehicle_count, is_pedestrian",
          "`Intersection`: lights dict, phases list, current_phase_idx, cycle()",
          "`TrafficController`: intersection, timer, advance_phase(), emergency_preempt()",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `from enum import Enum, auto
from dataclasses import dataclass, field
from typing import Optional
import time
import threading


class SignalState(Enum):
    RED              = auto()
    YELLOW           = auto()
    GREEN            = auto()
    FLASHING_YELLOW  = auto()


class Direction(Enum):
    NORTH = auto()
    SOUTH = auto()
    EAST  = auto()
    WEST  = auto()


class TrafficLight:
    def __init__(self, direction: Direction):
        self.direction     = direction
        self.state         = SignalState.RED
        self.is_functional = True

    def change_to(self, state: SignalState) -> None:
        if not self.is_functional:
            self.state = SignalState.FLASHING_YELLOW
            return
        self.state = state
        print(f"  {self.direction.name}: {state.name}")

    def report_fault(self) -> None:
        self.is_functional = False
        self.state = SignalState.FLASHING_YELLOW
        print(f"FAULT: {self.direction.name} light failed — FLASHING YELLOW")


@dataclass
class Phase:
    """One segment of the signal cycle."""
    name:             str
    green_directions: list[Direction]   # which directions get GREEN
    duration_seconds: int


class Intersection:
    def __init__(self, intersection_id: str):
        self.intersection_id = intersection_id
        self.lights: dict[Direction, TrafficLight] = {
            d: TrafficLight(d) for d in Direction
        }
        self.phases: list[Phase] = []
        self._phase_idx = 0

    def add_phase(self, phase: Phase) -> None:
        self.phases.append(phase)

    def apply_phase(self, phase: Phase) -> None:
        print(f"--- Phase: {phase.name} ---")
        for direction, light in self.lights.items():
            if direction in phase.green_directions:
                light.change_to(SignalState.GREEN)
            else:
                light.change_to(SignalState.RED)

    def transition_to_yellow(self) -> None:
        """Brief yellow before switching phases."""
        for d, light in self.lights.items():
            if light.state == SignalState.GREEN:
                light.change_to(SignalState.YELLOW)

    def emergency_preempt(self, emergency_direction: Direction) -> None:
        """Hold all RED except emergency approach."""
        print(f"EMERGENCY: preempting for {emergency_direction.name}")
        for d, light in self.lights.items():
            if d == emergency_direction:
                light.change_to(SignalState.GREEN)
            else:
                light.change_to(SignalState.RED)


class TrafficController:
    YELLOW_DURATION = 3   # seconds

    def __init__(self, intersection: Intersection,
                 adaptive: bool = False):
        self.intersection = intersection
        self.adaptive     = adaptive
        self._running     = False
        self._emergency   = False

    def start(self, cycles: int = 2) -> None:
        self._running = True
        for _ in range(cycles):
            for idx, phase in enumerate(self.intersection.phases):
                if not self._running:
                    break
                if self._emergency:
                    time.sleep(phase.duration_seconds)
                    continue
                self.intersection.apply_phase(phase)
                duration = phase.duration_seconds
                time.sleep(duration)
                self.intersection.transition_to_yellow()
                time.sleep(self.YELLOW_DURATION)
        self._running = False

    def emergency_preempt(self, direction: Direction) -> None:
        self._emergency = True
        self.intersection.emergency_preempt(direction)

    def clear_emergency(self) -> None:
        self._emergency = False
        print("Emergency cleared — resuming normal cycle")


# --- Demo ---
intersection = Intersection("Junction-A1")

# NS green, then EW green
intersection.add_phase(Phase("NS-Green", [Direction.NORTH, Direction.SOUTH], 30))
intersection.add_phase(Phase("EW-Green", [Direction.EAST,  Direction.WEST],  30))

ctrl = TrafficController(intersection)
# Simulate 1 cycle (shortened timing for demo)
intersection.phases[0].duration_seconds = 2
intersection.phases[1].duration_seconds = 2
ctrl.start(cycles=1)`,
        caption: "Traffic controller: phases, TrafficLight state changes, yellow transition, emergency preempt",
      },
      {
        type: "heading",
        text: "Design Decisions to Mention",
      },
      {
        type: "bullets",
        items: [
          "Phase as a data object separates timing configuration from the control logic",
          "TrafficLight.report_fault() switches to FLASHING_YELLOW — safety-first default",
          "Emergency preemption holds all reds except the emergency approach — avoids collisions",
          "Adaptive control: extend phase.duration if vehicle count in that direction is high",
          "Production: each intersection is an independent process; central system aggregates data",
        ],
      },
    ],
  },
  {
    slug: "concert-ticket-booking",
    title: "Concert Ticket Booking",
    section: "Interview Questions — Medium",
    tagline: "Venue ticketing — events, seats, booking, payments, seat holds",
    blocks: [
      {
        type: "text",
        md: "Design a concert ticket booking system like Ticketmaster. Users can browse events, select seats from a seat map, hold seats temporarily while paying, confirm their booking, and receive tickets. The system must handle concurrent booking attempts for the same seat.",
      },
      {
        type: "heading",
        text: "Functional Requirements",
      },
      {
        type: "bullets",
        items: [
          "Browse upcoming events at a venue",
          "View seat map with categories (PIT, FLOOR, UPPER, VIP)",
          "Hold selected seats for 10 minutes while user completes payment",
          "Confirm or release the hold based on payment outcome",
          "Issue digital tickets (with QR code / barcode) on confirmation",
          "Waitlist for sold-out events; notify when seats become available",
        ],
      },
      {
        type: "heading",
        text: "Key Classes",
      },
      {
        type: "bullets",
        items: [
          "`SeatCategory` enum: PIT, FLOOR, UPPER, VIP",
          "`SeatStatus` enum: AVAILABLE, HELD, BOOKED",
          "`Venue`: name, sections (list of seats)",
          "`Seat`: seat_id, row, number, category, status, held_until, held_by",
          "`Event`: event_id, title, artist, venue, date, base_prices dict",
          "`Booking`: booking_id, user, event, seats, total, payment_status",
          "`Ticket`: ticket_id, booking, seat, barcode",
          "`BookingService`: hold_seats(), confirm_booking(), release_hold()",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `from enum import Enum, auto
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from typing import Optional
import threading
import uuid


class SeatCategory(Enum):
    PIT   = auto()
    FLOOR = auto()
    UPPER = auto()
    VIP   = auto()


class SeatStatus(Enum):
    AVAILABLE = auto()
    HELD      = auto()
    BOOKED    = auto()


HOLD_MINUTES = 10


class Seat:
    def __init__(self, seat_id: str, row: str,
                 number: int, category: SeatCategory, base_price: float):
        self.seat_id    = seat_id
        self.row        = row
        self.number     = number
        self.category   = category
        self.base_price = base_price
        self.status     = SeatStatus.AVAILABLE
        self.held_until: Optional[datetime] = None
        self.held_by:    Optional[str]      = None
        self._lock = threading.Lock()

    def try_hold(self, session_id: str) -> bool:
        with self._lock:
            if self.status == SeatStatus.AVAILABLE or self._hold_expired():
                self.status     = SeatStatus.HELD
                self.held_until = datetime.now() + timedelta(minutes=HOLD_MINUTES)
                self.held_by    = session_id
                return True
            return False

    def confirm(self) -> None:
        with self._lock:
            if self.status != SeatStatus.HELD:
                raise RuntimeError(f"Seat {self.seat_id} not held")
            self.status     = SeatStatus.BOOKED
            self.held_until = None
            self.held_by    = None

    def release(self) -> None:
        with self._lock:
            self.status     = SeatStatus.AVAILABLE
            self.held_until = None
            self.held_by    = None

    def _hold_expired(self) -> bool:
        return (self.status == SeatStatus.HELD
                and self.held_until is not None
                and datetime.now() > self.held_until)

    def __repr__(self) -> str:
        return f"Seat({self.row}{self.number} [{self.category.name}] {self.status.name})"


@dataclass
class User:
    user_id: str
    name:    str
    email:   str


@dataclass
class Event:
    event_id:    str
    title:       str
    artist:      str
    venue_name:  str
    event_date:  datetime
    seats:       list[Seat]

    def available_seats(self, category: Optional[SeatCategory] = None) -> list[Seat]:
        result = [s for s in self.seats
                  if s.status == SeatStatus.AVAILABLE or s._hold_expired()]
        if category:
            result = [s for s in result if s.category == category]
        return result


class Booking:
    def __init__(self, user: User, event: Event, seats: list[Seat]):
        self.booking_id = str(uuid.uuid4())[:8].upper()
        self.user       = user
        self.event      = event
        self.seats      = seats
        self.total      = sum(s.base_price for s in seats)
        self.confirmed  = False
        self.created_at = datetime.now()

    def issue_tickets(self) -> list["Ticket"]:
        if not self.confirmed:
            raise RuntimeError("Booking not confirmed")
        return [Ticket(self, seat) for seat in self.seats]


@dataclass
class Ticket:
    booking: Booking
    seat:    Seat
    ticket_id: str = field(default_factory=lambda: str(uuid.uuid4())[:10].upper())
    barcode:   str = field(default_factory=lambda: str(uuid.uuid4()).replace("-",""))


class BookingService:
    def __init__(self):
        self._bookings: dict[str, Booking] = {}

    def hold_seats(self, user: User, event: Event,
                   seat_ids: list[str]) -> Booking:
        seats = [s for s in event.seats if s.seat_id in seat_ids]
        session = str(uuid.uuid4())[:8]
        for seat in seats:
            if not seat.try_hold(session):
                # Rollback holds already acquired
                for held in seats[:seats.index(seat)]:
                    held.release()
                raise RuntimeError(f"Seat {seat.seat_id} not available")
        booking = Booking(user, event, seats)
        self._bookings[booking.booking_id] = booking
        return booking

    def confirm_booking(self, booking_id: str) -> list[Ticket]:
        booking = self._bookings[booking_id]
        for seat in booking.seats:
            seat.confirm()
        booking.confirmed = True
        return booking.issue_tickets()

    def release_booking(self, booking_id: str) -> None:
        booking = self._bookings.pop(booking_id, None)
        if booking:
            for seat in booking.seats:
                seat.release()


# --- Demo ---
seats = [Seat(f"S{i}", "A", i, SeatCategory.FLOOR, 75.0) for i in range(1, 6)]
event = Event("E1", "Taylor Swift: Eras Tour", "Taylor Swift",
              "Wembley", datetime(2026, 10, 15, 19, 30), seats)

svc   = BookingService()
alice = User("U1", "Alice", "alice@x.com")

booking = svc.hold_seats(alice, event, ["S1", "S2"])
print(f"Held booking {booking.booking_id}, total £{booking.total:.2f}")
tickets = svc.confirm_booking(booking.booking_id)
for t in tickets:
    print(f"Ticket {t.ticket_id}: {t.seat}")`,
        caption: "Concert booking: thread-safe seat holds with timeout, confirm, rollback on partial failure",
      },
      {
        type: "heading",
        text: "Design Decisions to Mention",
      },
      {
        type: "bullets",
        items: [
          "Seat._lock ensures only one thread can hold a seat at a time — prevents double-booking",
          "hold_seats() rolls back already-acquired holds if any seat fails — all-or-nothing",
          "_hold_expired() allows expired holds to be reclaimed without a background job",
          "Production: replace in-memory hold with Redis TTL key (SETNX pattern) for distributed system",
          "Waitlist: when confirmed booking is cancelled, check waitlist and notify first entry",
        ],
      },
    ],
  },
  {
    slug: "social-network",
    title: "Social Network",
    section: "Interview Questions — Medium",
    tagline: "Social platform — profiles, posts, follows, feed, likes, notifications",
    blocks: [
      {
        type: "text",
        md: "Design a social network like Twitter or Instagram. Users have profiles, create posts, follow other users, like and comment on posts, and see a feed of content from people they follow. The system sends notifications for interactions.",
      },
      {
        type: "heading",
        text: "Functional Requirements",
      },
      {
        type: "bullets",
        items: [
          "User registration, profile (bio, avatar, website)",
          "Create posts with text and optional media",
          "Follow/unfollow users; follower and following counts",
          "Like and unlike posts; comment on posts",
          "News feed: reverse-chronological posts from followed users",
          "Notifications: when someone follows you, likes your post, or comments",
        ],
      },
      {
        type: "heading",
        text: "Key Classes",
      },
      {
        type: "bullets",
        items: [
          "`NotificationType` enum: FOLLOW, LIKE, COMMENT, MENTION",
          "`Profile`: bio, avatar_url, website, followers, following",
          "`User`: user_id, username, email, profile, posts, notifications",
          "`Post`: post_id, author, content, media_urls, likes, comments, created_at",
          "`Comment`: comment_id, author, content, likes",
          "`Notification`: type, actor, target_user, post, created_at, is_read",
          "`Feed`: get_feed(user) -> list[Post] (paginated, reverse chronological)",
          "`SocialGraph`: follow(user, target), followers(user), following(user)",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `from enum import Enum, auto
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional
import uuid


class NotificationType(Enum):
    FOLLOW  = auto()
    LIKE    = auto()
    COMMENT = auto()
    MENTION = auto()


@dataclass
class Profile:
    bio:        str = ""
    avatar_url: str = ""
    website:    str = ""


@dataclass
class Notification:
    notif_id:     str
    notif_type:   NotificationType
    actor_name:   str   # who performed the action
    message:      str
    is_read:      bool = False
    created_at:   datetime = field(default_factory=datetime.now)


class Post:
    def __init__(self, author: "User", content: str,
                 media_urls: Optional[list[str]] = None):
        self.post_id    = str(uuid.uuid4())[:8]
        self.author     = author
        self.content    = content
        self.media_urls = media_urls or []
        self._likes:    set[str]    = set()   # user_ids
        self._comments: list["Comment"] = []
        self.created_at = datetime.now()

    def like(self, user: "User") -> bool:
        """Toggle like. Returns True if liked, False if unliked."""
        if user.user_id in self._likes:
            self._likes.discard(user.user_id)
            return False
        self._likes.add(user.user_id)
        return True

    def add_comment(self, author: "User", content: str) -> "Comment":
        c = Comment(author, content)
        self._comments.append(c)
        return c

    @property
    def like_count(self) -> int: return len(self._likes)
    @property
    def comment_count(self) -> int: return len(self._comments)

    def __repr__(self) -> str:
        return (f"Post({self.post_id}: {self.content[:40]!r} "
                f"| ♥{self.like_count} 💬{self.comment_count})")


class Comment:
    def __init__(self, author: "User", content: str):
        self.comment_id = str(uuid.uuid4())[:8]
        self.author     = author
        self.content    = content
        self.created_at = datetime.now()


class User:
    def __init__(self, user_id: str, username: str, email: str):
        self.user_id   = user_id
        self.username  = username
        self.email     = email
        self.profile   = Profile()
        self._posts:    list[Post]         = []
        self._following: set[str]          = set()   # user_ids
        self._followers: set[str]          = set()
        self._notifs:   list[Notification] = []

    def create_post(self, content: str, media: Optional[list[str]] = None) -> Post:
        post = Post(self, content, media)
        self._posts.append(post)
        return post

    def add_notification(self, notif: Notification) -> None:
        self._notifs.append(notif)

    def unread_count(self) -> int:
        return sum(1 for n in self._notifs if not n.is_read)

    @property
    def follower_count(self) -> int: return len(self._followers)
    @property
    def following_count(self) -> int: return len(self._following)


class SocialGraph:
    """Manages follow relationships between users."""

    def __init__(self):
        self._users: dict[str, User] = {}

    def register(self, user: User) -> None:
        self._users[user.user_id] = user

    def follow(self, follower: User, target: User) -> None:
        if target.user_id in follower._following:
            return   # already following
        follower._following.add(target.user_id)
        target._followers.add(follower.user_id)
        target.add_notification(Notification(
            str(uuid.uuid4())[:8], NotificationType.FOLLOW,
            follower.username, f"{follower.username} started following you"
        ))

    def unfollow(self, follower: User, target: User) -> None:
        follower._following.discard(target.user_id)
        target._followers.discard(follower.user_id)

    def get_feed(self, user: User, limit: int = 20) -> list[Post]:
        """Reverse-chronological posts from followed users + own posts."""
        all_posts: list[Post] = list(user._posts)
        for uid in user._following:
            followed = self._users.get(uid)
            if followed:
                all_posts.extend(followed._posts)
        return sorted(all_posts, key=lambda p: p.created_at, reverse=True)[:limit]


class NotificationService:
    @staticmethod
    def on_like(liker: User, post_owner: User, post: Post) -> None:
        post_owner.add_notification(Notification(
            str(uuid.uuid4())[:8], NotificationType.LIKE,
            liker.username, f"{liker.username} liked your post"
        ))

    @staticmethod
    def on_comment(commenter: User, post_owner: User, post: Post) -> None:
        post_owner.add_notification(Notification(
            str(uuid.uuid4())[:8], NotificationType.COMMENT,
            commenter.username, f"{commenter.username} commented on your post"
        ))


# --- Demo ---
graph = SocialGraph()
notif_svc = NotificationService()

alice = User("U1", "alice", "alice@x.com")
bob   = User("U2", "bob",   "bob@x.com")
graph.register(alice)
graph.register(bob)

graph.follow(alice, bob)
post = bob.create_post("Just shipped a new feature! 🚀")
liked = post.like(alice)
if liked:
    notif_svc.on_like(alice, bob, post)

post.add_comment(alice, "Congrats!")
notif_svc.on_comment(alice, bob, post)

feed = graph.get_feed(alice)
for p in feed:
    print(p)
print(f"Bob has {bob.unread_count()} unread notifications")`,
        caption: "Social network: SocialGraph follow/feed, Post likes/comments, NotificationService",
      },
      {
        type: "heading",
        text: "Design Decisions to Mention",
      },
      {
        type: "bullets",
        items: [
          "Feed is computed by merging followed users' posts — works for small scale; use pre-computed fan-out for millions of followers",
          "Like toggle (like/unlike) returns bool indicating the new state",
          "SocialGraph holds the user registry — centralises the follow graph",
          "Fan-out on write: when a celebrity with 10M followers posts, don't write to 10M feeds — use fan-out on read with caching",
          "Notification is stored in-memory here; production uses push notifications via APNS/FCM and persistent notification store",
        ],
      },
    ],
  },
];
