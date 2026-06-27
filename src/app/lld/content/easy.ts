import type { LLDContent } from "./types";

export const EASY_CONTENT: LLDContent[] = [
  {
    slug: "tic-tac-toe",
    title: "Tic Tac Toe",
    section: "Interview Questions — Easy",
    tagline: "Classic grid game — Board, Player, win detection, turn management",
    blocks: [
      {
        type: "text",
        md: "Design a two-player Tic Tac Toe game that can be played in a terminal. The game manages a 3×3 board, alternates turns between two players, validates moves, and detects wins (3 in a row/column/diagonal) or draws.",
      },
      {
        type: "heading",
        text: "Functional Requirements",
      },
      {
        type: "bullets",
        items: [
          "Support exactly 2 players — one plays 'X', the other 'O'",
          "Players take turns choosing a cell (row, col) on the 3×3 grid",
          "Validate that the chosen cell is empty and within bounds",
          "Detect a win: 3 matching symbols in any row, column, or diagonal",
          "Detect a draw: all cells filled with no winner",
          "Allow the game to be reset and played again",
        ],
      },
      {
        type: "heading",
        text: "Key Classes",
      },
      {
        type: "bullets",
        items: [
          "`Player`: name, symbol ('X' or 'O')",
          "`Board`: 3×3 grid, place_mark(), check_winner(), is_full(), display()",
          "`Game`: holds board + players, manages turn loop, declares result",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `from enum import Enum
from typing import Optional


class Symbol(Enum):
    X = "X"
    O = "O"
    EMPTY = " "


class Player:
    """Represents one of the two players."""

    def __init__(self, name: str, symbol: Symbol):
        self.name = name
        self.symbol = symbol

    def __repr__(self) -> str:
        return f"Player({self.name!r}, {self.symbol.value!r})"


class Board:
    """3x3 game board. Tracks marks and determines game outcomes."""

    SIZE = 3

    def __init__(self):
        self._grid: list[list[Symbol]] = [
            [Symbol.EMPTY] * self.SIZE for _ in range(self.SIZE)
        ]

    def place_mark(self, row: int, col: int, symbol: Symbol) -> bool:
        """Place symbol at (row, col). Returns False if cell is taken or out of range."""
        if not (0 <= row < self.SIZE and 0 <= col < self.SIZE):
            return False
        if self._grid[row][col] != Symbol.EMPTY:
            return False
        self._grid[row][col] = symbol
        return True

    def check_winner(self) -> Optional[Symbol]:
        """Return winning symbol if there is one, else None."""
        g = self._grid
        lines = (
            [g[r] for r in range(self.SIZE)] +                          # rows
            [[g[r][c] for r in range(self.SIZE)] for c in range(self.SIZE)] +  # cols
            [[g[i][i] for i in range(self.SIZE)]],                      # diag 1
        )
        lines.append([g[i][self.SIZE - 1 - i] for i in range(self.SIZE)])  # diag 2
        for line in lines:
            if line[0] != Symbol.EMPTY and len(set(line)) == 1:
                return line[0]
        return None

    def is_full(self) -> bool:
        return all(self._grid[r][c] != Symbol.EMPTY
                   for r in range(self.SIZE) for c in range(self.SIZE))

    def reset(self) -> None:
        self._grid = [[Symbol.EMPTY] * self.SIZE for _ in range(self.SIZE)]

    def display(self) -> None:
        for i, row in enumerate(self._grid):
            print(" | ".join(cell.value for cell in row))
            if i < self.SIZE - 1:
                print("-" * (self.SIZE * 4 - 1))


class Game:
    """Controls game flow — alternates turns, declares winner or draw."""

    def __init__(self, player1: Player, player2: Player):
        self.board = Board()
        self.players = [player1, player2]
        self._turn_index = 0

    @property
    def current_player(self) -> Player:
        return self.players[self._turn_index]

    def switch_turn(self) -> None:
        self._turn_index = 1 - self._turn_index

    def play_turn(self, row: int, col: int) -> str:
        """Play one turn. Returns status: 'ok', 'invalid', 'win', or 'draw'."""
        player = self.current_player
        if not self.board.place_mark(row, col, player.symbol):
            return "invalid"
        winner = self.board.check_winner()
        if winner:
            return "win"
        if self.board.is_full():
            return "draw"
        self.switch_turn()
        return "ok"

    def reset(self) -> None:
        self.board.reset()
        self._turn_index = 0


# --- Demo ---
p1 = Player("Alice", Symbol.X)
p2 = Player("Bob",   Symbol.O)
game = Game(p1, p2)

moves = [(0,0),(1,1),(0,1),(2,0),(0,2)]   # Alice wins top row
for row, col in moves:
    status = game.play_turn(row, col)
    if status == "win":
        print(f"{game.current_player.name} wins!")
        break
    elif status == "draw":
        print("It's a draw!")
        break
game.board.display()`,
        caption: "Complete Tic Tac Toe — Board, Player, Game with win detection and turn management",
      },
      {
        type: "heading",
        text: "Design Decisions to Mention",
      },
      {
        type: "bullets",
        items: [
          "Symbol enum prevents invalid marker strings and enables easy equality checks",
          "`check_winner()` checks all 8 lines (3 rows + 3 cols + 2 diags) uniformly",
          "Game delegates board logic to Board (SRP) and only manages turn flow",
          "Extensible to larger boards: parameterise SIZE and generalise win check to N-in-a-row",
          "For a web version, replace the terminal `play_turn` loop with an event-driven API",
        ],
      },
    ],
  },
  {
    slug: "snake-and-ladder",
    title: "Snake and Ladder",
    section: "Interview Questions — Easy",
    tagline: "Board game simulation — snakes, ladders, dice, player movement",
    blocks: [
      {
        type: "text",
        md: "Design a Snake and Ladder board game for 2+ players. Players roll a die, move their piece, and either slide down a snake or climb a ladder if they land on one. The first player to reach (or exceed) the final square wins.",
      },
      {
        type: "heading",
        text: "Functional Requirements",
      },
      {
        type: "bullets",
        items: [
          "Support 2 or more players with customisable board size (default 100 squares)",
          "On each turn, the player rolls a die (1-6) and moves forward",
          "If the player lands on a snake head, they slide to the snake's tail",
          "If the player lands on a ladder bottom, they climb to the ladder top",
          "A player wins when they reach exactly square 100 (or the configured end)",
          "A roll that would take a player past the end square is ignored (must land exactly)",
        ],
      },
      {
        type: "heading",
        text: "Key Classes",
      },
      {
        type: "bullets",
        items: [
          "`Snake`: head, tail (head > tail — moves player backward)",
          "`Ladder`: bottom, top (bottom < top — moves player forward)",
          "`Die`: num_faces, roll() -> int",
          "`Player`: name, position",
          "`Board`: size, dict of teleports (snakes + ladders), get_destination(pos)",
          "`Game`: board, players, play_turn(), check_winner()",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `import random
from dataclasses import dataclass


@dataclass
class Snake:
    head: int
    tail: int

    def __post_init__(self):
        assert self.head > self.tail, "Snake head must be above tail"


@dataclass
class Ladder:
    bottom: int
    top: int

    def __post_init__(self):
        assert self.top > self.bottom, "Ladder top must be above bottom"


class Die:
    def __init__(self, faces: int = 6):
        self.faces = faces

    def roll(self) -> int:
        return random.randint(1, self.faces)


class Player:
    def __init__(self, name: str):
        self.name = name
        self.position = 0

    def move(self, steps: int, board_size: int) -> bool:
        """Move forward. Returns True if the move is legal."""
        new_pos = self.position + steps
        if new_pos > board_size:
            return False   # can't overshoot
        self.position = new_pos
        return True

    def __repr__(self) -> str:
        return f"{self.name}@{self.position}"


class Board:
    def __init__(self, size: int = 100,
                 snakes: list[Snake] | None = None,
                 ladders: list[Ladder] | None = None):
        self.size = size
        # Map from landing square -> destination
        self._teleports: dict[int, int] = {}
        for s in (snakes or []):
            self._teleports[s.head] = s.tail
        for l in (ladders or []):
            self._teleports[l.bottom] = l.top

    def get_destination(self, position: int) -> tuple[int, str]:
        """Return (final_position, event) — event is 'snake', 'ladder', or ''."""
        if position in self._teleports:
            dest = self._teleports[position]
            event = "snake" if dest < position else "ladder"
            return dest, event
        return position, ""


class Game:
    def __init__(self, board: Board, players: list[Player]):
        self.board = board
        self.players = players
        self.die = Die()
        self._turn_index = 0

    @property
    def current_player(self) -> Player:
        return self.players[self._turn_index]

    def play_turn(self) -> dict:
        player = self.current_player
        roll = self.die.roll()
        moved = player.move(roll, self.board.size)
        event = ""
        if moved:
            player.position, event = self.board.get_destination(player.position)
        won = player.position == self.board.size
        self._turn_index = (self._turn_index + 1) % len(self.players)
        return {"player": player.name, "roll": roll, "position": player.position,
                "event": event, "won": won, "moved": moved}


# --- Demo ---
board = Board(
    size=20,
    snakes=[Snake(17, 7), Snake(15, 3)],
    ladders=[Ladder(2, 11), Ladder(6, 16)],
)
players = [Player("Alice"), Player("Bob")]
game = Game(board, players)

for _ in range(50):
    result = game.play_turn()
    extra = f" ({result['event']})" if result["event"] else ""
    skip  = " (overshot — stay)" if not result["moved"] else ""
    print(f"{result['player']} rolled {result['roll']} → sq {result['position']}{extra}{skip}")
    if result["won"]:
        print(f"*** {result['player']} wins! ***")
        break`,
        caption: "Full Snake and Ladder: Board maps landing squares to teleport destinations for both snakes and ladders",
      },
      {
        type: "heading",
        text: "Design Decisions to Mention",
      },
      {
        type: "bullets",
        items: [
          "Snakes and ladders unified in one `_teleports` dict — same lookup regardless of type",
          "Board.get_destination() also returns event type so the Game can log what happened",
          "Can't overshoot: Player.move() returns False and position is unchanged",
          "Easily extensible: add special squares (bonus rolls, lose-a-turn) in the teleports map",
          "Die is injectable — swap for a loaded die in tests or a custom multi-die variant",
        ],
      },
    ],
  },
  {
    slug: "lru-cache",
    title: "LRU Cache",
    section: "Interview Questions — Easy",
    tagline: "Least Recently Used eviction — O(1) get/put using a hash map and doubly linked list",
    blocks: [
      {
        type: "text",
        md: "Design an LRU (Least Recently Used) Cache with a fixed capacity. When the cache is full and a new item is added, the least recently used item is evicted. Both `get` and `put` operations must run in O(1) time.",
      },
      {
        type: "heading",
        text: "Functional Requirements",
      },
      {
        type: "bullets",
        items: [
          "`get(key)`: return the value if present, else -1; mark key as recently used",
          "`put(key, value)`: insert or update; if full, evict the least recently used key first",
          "Both operations must be O(1) — this forces a doubly linked list + hash map design",
          "Capacity is set at construction time and cannot change",
          "Cache should correctly handle updating an existing key (moves to most-recent position)",
        ],
      },
      {
        type: "heading",
        text: "Key Classes",
      },
      {
        type: "bullets",
        items: [
          "`Node`: key, value, prev, next — doubly linked list node",
          "`LRUCache`: capacity, cache dict (key→Node), dummy head/tail sentinel nodes",
          "Head.next = most recently used; Tail.prev = least recently used",
          "On access: remove node from current position, insert after head",
          "On eviction: remove node before tail (LRU), delete from dict",
        ],
      },
      {
        type: "code",
        lang: "python",
        code: `class Node:
    """Doubly linked list node."""

    def __init__(self, key: int = 0, value: int = 0):
        self.key   = key
        self.value = value
        self.prev: "Node | None" = None
        self.next: "Node | None" = None


class LRUCache:
    """
    O(1) get and put using:
      - dict (key -> Node) for O(1) lookup
      - doubly linked list to track recency order
    Head.next = MRU (most recently used)
    Tail.prev = LRU (least recently used)
    """

    def __init__(self, capacity: int):
        if capacity <= 0:
            raise ValueError("Capacity must be positive")
        self.capacity = capacity
        self._cache: dict[int, Node] = {}
        # Sentinel nodes eliminate edge-case checks
        self._head = Node()   # dummy head
        self._tail = Node()   # dummy tail
        self._head.next = self._tail
        self._tail.prev = self._head

    def get(self, key: int) -> int:
        """Return value for key, or -1 if not in cache."""
        if key not in self._cache:
            return -1
        node = self._cache[key]
        self._move_to_front(node)
        return node.value

    def put(self, key: int, value: int) -> None:
        """Insert or update key. Evicts LRU if over capacity."""
        if key in self._cache:
            node = self._cache[key]
            node.value = value
            self._move_to_front(node)
        else:
            if len(self._cache) >= self.capacity:
                self._evict_lru()
            node = Node(key, value)
            self._cache[key] = node
            self._insert_at_front(node)

    def _insert_at_front(self, node: Node) -> None:
        """Insert node right after head (MRU position)."""
        node.prev = self._head
        node.next = self._head.next
        self._head.next.prev = node  # type: ignore[union-attr]
        self._head.next = node

    def _remove(self, node: Node) -> None:
        """Detach node from its current position."""
        node.prev.next = node.next  # type: ignore[union-attr]
        node.next.prev = node.prev  # type: ignore[union-attr]

    def _move_to_front(self, node: Node) -> None:
        self._remove(node)
        self._insert_at_front(node)

    def _evict_lru(self) -> None:
        """Remove least recently used node (just before tail)."""
        lru = self._tail.prev
        if lru is self._head:
            return   # empty cache
        self._remove(lru)
        del self._cache[lru.key]  # type: ignore[union-attr]

    def __repr__(self) -> str:
        items = []
        curr = self._head.next
        while curr is not self._tail:
            items.append(f"{curr.key}:{curr.value}")
            curr = curr.next
        return f"LRUCache([{', '.join(items)}])"   # MRU first


cache = LRUCache(3)
cache.put(1, 10)
cache.put(2, 20)
cache.put(3, 30)
print(cache)          # LRUCache([3:30, 2:20, 1:10])
cache.get(1)          # access key 1 — moves to front
cache.put(4, 40)      # evicts key 2 (LRU)
print(cache)          # LRUCache([4:40, 1:10, 3:30])
print(cache.get(2))   # -1 — evicted`,
        caption: "LRU Cache with doubly linked list + dict for O(1) get and put with correct eviction order",
      },
      {
        type: "heading",
        text: "Design Decisions to Mention",
      },
      {
        type: "bullets",
        items: [
          "Sentinel head/tail nodes avoid null checks in insert/remove — crucial for clean code",
          "Dict provides O(1) key lookup; DLL provides O(1) reordering and LRU removal",
          "Python's `collections.OrderedDict` achieves the same result in fewer lines — mention both",
          "Thread-safety: in production, wrap get/put with a threading.Lock",
          "For LFU cache, need two levels of ordering — count first, then recency within count",
        ],
      },
    ],
  },
  {
    slug: "parking-lot",
    title: "Parking Lot",
    section: "Interview Questions — Easy",
    tagline: "Multi-floor parking management — spot allocation, ticketing, payment, capacity tracking",
    blocks: [
      {
        type: "text",
        md: "Design a parking lot system that manages multiple floors, different spot sizes, vehicle entry/exit, ticketing, and payment calculation. This is a very common LLD interview question that tests your ability to model a real-world system.",
      },
      {
        type: "heading",
        text: "Functional Requirements",
      },
      {
        type: "bullets",
        items: [
          "Support multiple floors, each with multiple parking spots",
          "Spot sizes: SMALL (bikes), MEDIUM (cars), LARGE (trucks/buses)",
          "On entry: find the nearest available spot of the correct size, issue a ticket",
          "On exit: calculate fee based on duration, mark spot as free, collect payment",
          "Query available spot count by size at any time",
          "Reject entry when no suitable spot is available",
        ],
      },
      {
        type: "heading",
        text: "Key Classes",
      },
      {
        type: "bullets",
        items: [
          "`SpotSize` enum: SMALL, MEDIUM, LARGE",
          "`VehicleType` enum: MOTORBIKE, CAR, TRUCK",
          "`Vehicle`: plate, vehicle_type",
          "`ParkingSpot`: spot_id, size, floor_num, is_occupied, vehicle",
          "`ParkingFloor`: floor_num, list of spots, find_available_spot(size)",
          "`Ticket`: ticket_id, vehicle, spot, entry_time",
          "`ParkingLot`: name, floors, park(vehicle), unpark(ticket), available_count(size)",
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


class SpotSize(Enum):
    SMALL  = auto()
    MEDIUM = auto()
    LARGE  = auto()


class VehicleType(Enum):
    MOTORBIKE = auto()
    CAR       = auto()
    TRUCK     = auto()


VEHICLE_TO_SPOT: dict[VehicleType, SpotSize] = {
    VehicleType.MOTORBIKE: SpotSize.SMALL,
    VehicleType.CAR:       SpotSize.MEDIUM,
    VehicleType.TRUCK:     SpotSize.LARGE,
}

HOURLY_RATE: dict[SpotSize, float] = {
    SpotSize.SMALL:  1.00,
    SpotSize.MEDIUM: 2.50,
    SpotSize.LARGE:  4.00,
}


@dataclass
class Vehicle:
    plate: str
    vehicle_type: VehicleType


class ParkingSpot:
    """A single spot on a floor."""

    def __init__(self, spot_id: str, size: SpotSize, floor_num: int):
        self.spot_id   = spot_id
        self.size      = size
        self.floor_num = floor_num
        self.vehicle: Optional[Vehicle] = None

    @property
    def is_free(self) -> bool:
        return self.vehicle is None

    def occupy(self, vehicle: Vehicle) -> None:
        if not self.is_free:
            raise RuntimeError(f"Spot {self.spot_id} already occupied")
        self.vehicle = vehicle

    def vacate(self) -> None:
        self.vehicle = None

    def __repr__(self) -> str:
        status = "FREE" if self.is_free else f"OCCUPIED({self.vehicle.plate})"
        return f"Spot[{self.spot_id} {self.size.name} F{self.floor_num}] {status}"


@dataclass
class Ticket:
    ticket_id: str
    vehicle: Vehicle
    spot: ParkingSpot
    entry_time: datetime = field(default_factory=datetime.now)

    def duration_hours(self) -> float:
        delta = datetime.now() - self.entry_time
        return max(delta.total_seconds() / 3600, 1/60)   # minimum 1 minute


class ParkingFloor:
    def __init__(self, floor_num: int):
        self.floor_num = floor_num
        self._spots: list[ParkingSpot] = []

    def add_spot(self, spot: ParkingSpot) -> None:
        self._spots.append(spot)

    def find_available_spot(self, size: SpotSize) -> Optional[ParkingSpot]:
        for spot in self._spots:
            if spot.is_free and spot.size == size:
                return spot
        return None

    def available_count(self, size: SpotSize) -> int:
        return sum(1 for s in self._spots if s.is_free and s.size == size)


class ParkingLot:
    def __init__(self, name: str):
        self.name    = name
        self._floors: list[ParkingFloor] = []
        self._active_tickets: dict[str, Ticket] = {}   # ticket_id -> Ticket

    def add_floor(self, floor: ParkingFloor) -> None:
        self._floors.append(floor)

    def park(self, vehicle: Vehicle) -> Optional[Ticket]:
        """Find a spot and issue a ticket. Returns None if lot is full."""
        size = VEHICLE_TO_SPOT[vehicle.vehicle_type]
        for floor in self._floors:
            spot = floor.find_available_spot(size)
            if spot:
                spot.occupy(vehicle)
                ticket = Ticket(
                    ticket_id=str(uuid.uuid4())[:8],
                    vehicle=vehicle,
                    spot=spot,
                )
                self._active_tickets[ticket.ticket_id] = ticket
                return ticket
        return None

    def unpark(self, ticket_id: str) -> float:
        """Process exit. Returns fee charged."""
        ticket = self._active_tickets.pop(ticket_id, None)
        if not ticket:
            raise ValueError(f"Unknown ticket: {ticket_id}")
        hours = ticket.duration_hours()
        rate  = HOURLY_RATE[ticket.spot.size]
        fee   = round(hours * rate, 2)
        ticket.spot.vacate()
        return fee

    def available_count(self, size: SpotSize) -> int:
        return sum(f.available_count(size) for f in self._floors)


# --- Demo ---
lot = ParkingLot("City Centre Parking")
floor1 = ParkingFloor(1)
for i in range(3):
    floor1.add_spot(ParkingSpot(f"1M{i}", SpotSize.MEDIUM, 1))
    floor1.add_spot(ParkingSpot(f"1S{i}", SpotSize.SMALL,  1))
lot.add_floor(floor1)

car   = Vehicle("AB12 XYZ", VehicleType.CAR)
bike  = Vehicle("BC34 DEF", VehicleType.MOTORBIKE)

t1 = lot.park(car)
t2 = lot.park(bike)
print(f"Car parked at {t1.spot.spot_id}, ticket {t1.ticket_id}")
print(f"Available MEDIUM: {lot.available_count(SpotSize.MEDIUM)}")   # 2
fee = lot.unpark(t1.ticket_id)
print(f"Car fee: £{fee:.2f}")`,
        caption: "Full Parking Lot: multi-floor, spot sizing, ticket issuance, duration-based fee on exit",
      },
      {
        type: "heading",
        text: "Design Decisions to Mention",
      },
      {
        type: "bullets",
        items: [
          "VEHICLE_TO_SPOT map keeps vehicle-to-spot mapping in one place (DRY, easy to change)",
          "Ticket stores entry_time so fee calculation needs no external state",
          "ParkingLot keeps `_active_tickets` dict for O(1) exit lookup by ticket_id",
          "Floor-by-floor search is O(floors × spots/floor); a production system would maintain a priority queue of free spots per size",
          "Thread-safety: concurrent `park()` calls need a lock around spot selection + occupation",
        ],
      },
    ],
  },
  {
    slug: "task-management-system",
    title: "Task Management System",
    section: "Interview Questions — Easy",
    tagline: "Personal todo tracker — tasks, priorities, statuses, user assignment, filtering",
    blocks: [
      {
        type: "text",
        md: "Design a task management system similar to Trello or a personal todo app. Users can create tasks, assign them to other users, set priorities, update statuses, and search/filter tasks by various criteria.",
      },
      {
        type: "heading",
        text: "Functional Requirements",
      },
      {
        type: "bullets",
        items: [
          "Create, update, and delete tasks with title, description, due date, priority, status",
          "Assign tasks to one or more users",
          "Status transitions: TODO → IN_PROGRESS → DONE (and CANCELLED from any state)",
          "Filter tasks by status, priority, assignee, or due date range",
          "Add comments to tasks",
          "Search tasks by title/description keyword",
        ],
      },
      {
        type: "heading",
        text: "Key Classes",
      },
      {
        type: "bullets",
        items: [
          "`Priority` enum: LOW, MEDIUM, HIGH, CRITICAL",
          "`Status` enum: TODO, IN_PROGRESS, DONE, CANCELLED",
          "`User`: user_id, name, email",
          "`Comment`: comment_id, author (User), content, created_at",
          "`Task`: task_id, title, description, priority, status, assignees, comments, due_date",
          "`TaskManager`: create_task(), assign(), update_status(), filter_tasks(), search()",
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


class Priority(Enum):
    LOW      = 1
    MEDIUM   = 2
    HIGH     = 3
    CRITICAL = 4


class Status(Enum):
    TODO        = auto()
    IN_PROGRESS = auto()
    DONE        = auto()
    CANCELLED   = auto()


VALID_TRANSITIONS: dict[Status, set[Status]] = {
    Status.TODO:        {Status.IN_PROGRESS, Status.CANCELLED},
    Status.IN_PROGRESS: {Status.DONE, Status.CANCELLED},
    Status.DONE:        set(),
    Status.CANCELLED:   set(),
}


@dataclass
class User:
    user_id: str
    name: str
    email: str

    def __hash__(self): return hash(self.user_id)
    def __eq__(self, other): return isinstance(other, User) and self.user_id == other.user_id


@dataclass
class Comment:
    comment_id: str
    author: User
    content: str
    created_at: datetime = field(default_factory=datetime.now)


class Task:
    """Core domain entity — a unit of work."""

    def __init__(self, title: str, description: str,
                 priority: Priority, due_date: Optional[date] = None):
        self.task_id     = str(uuid.uuid4())[:8]
        self.title       = title
        self.description = description
        self.priority    = priority
        self.status      = Status.TODO
        self.due_date    = due_date
        self.assignees:  set[User]    = set()
        self.comments:   list[Comment] = []
        self.created_at  = datetime.now()
        self.updated_at  = datetime.now()

    def assign(self, user: User) -> None:
        """Add user to assignees."""
        self.assignees.add(user)
        self._touch()

    def unassign(self, user: User) -> None:
        self.assignees.discard(user)
        self._touch()

    def transition(self, new_status: Status) -> None:
        """Change status if the transition is valid."""
        if new_status not in VALID_TRANSITIONS[self.status]:
            raise ValueError(
                f"Cannot move from {self.status.name} to {new_status.name}"
            )
        self.status = new_status
        self._touch()

    def add_comment(self, author: User, content: str) -> Comment:
        comment = Comment(str(uuid.uuid4())[:8], author, content)
        self.comments.append(comment)
        self._touch()
        return comment

    def is_overdue(self) -> bool:
        return (self.due_date is not None
                and self.status not in {Status.DONE, Status.CANCELLED}
                and self.due_date < date.today())

    def _touch(self) -> None:
        self.updated_at = datetime.now()

    def __repr__(self) -> str:
        return (f"Task({self.task_id}: {self.title!r} "
                f"[{self.priority.name}] {self.status.name})")


class TaskManager:
    """Application service — manages the collection of tasks."""

    def __init__(self):
        self._tasks: dict[str, Task] = {}

    def create_task(self, title: str, description: str,
                    priority: Priority, due_date: Optional[date] = None) -> Task:
        task = Task(title, description, priority, due_date)
        self._tasks[task.task_id] = task
        return task

    def get_task(self, task_id: str) -> Task:
        task = self._tasks.get(task_id)
        if not task:
            raise KeyError(f"Task {task_id!r} not found")
        return task

    def delete_task(self, task_id: str) -> None:
        self._tasks.pop(task_id, None)

    def filter_tasks(self, status: Optional[Status] = None,
                     priority: Optional[Priority] = None,
                     assignee: Optional[User] = None) -> list[Task]:
        result = list(self._tasks.values())
        if status:
            result = [t for t in result if t.status == status]
        if priority:
            result = [t for t in result if t.priority == priority]
        if assignee:
            result = [t for t in result if assignee in t.assignees]
        return sorted(result, key=lambda t: (-t.priority.value, t.created_at))

    def search(self, keyword: str) -> list[Task]:
        kw = keyword.lower()
        return [t for t in self._tasks.values()
                if kw in t.title.lower() or kw in t.description.lower()]

    def overdue_tasks(self) -> list[Task]:
        return [t for t in self._tasks.values() if t.is_overdue()]


# --- Demo ---
manager = TaskManager()
alice = User("u1", "Alice", "alice@example.com")
bob   = User("u2", "Bob",   "bob@example.com")

t = manager.create_task("Fix login bug", "JWT tokens expire too fast",
                        Priority.HIGH, due_date=date(2025, 1, 1))
t.assign(alice)
t.assign(bob)
t.add_comment(alice, "Traced to TokenService.issue()")
t.transition(Status.IN_PROGRESS)
print(t)
print(manager.filter_tasks(status=Status.IN_PROGRESS))`,
        caption: "Full Task Management System with status machine, filtering, search, and comments",
      },
      {
        type: "heading",
        text: "Design Decisions to Mention",
      },
      {
        type: "bullets",
        items: [
          "VALID_TRANSITIONS dict encodes the state machine — adding a new transition is a one-liner",
          "Assignees is a set (not list) so the same user can't be assigned twice",
          "TaskManager is the single entry point — callers don't construct Tasks directly",
          "filter_tasks sorts by priority then creation time — interviewers love seeing sort criteria",
          "For a real system: persist to DB, add pagination to filter results, add event sourcing for audit",
        ],
      },
    ],
  },
];
