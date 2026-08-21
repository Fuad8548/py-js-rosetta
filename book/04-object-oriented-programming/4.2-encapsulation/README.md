# 4.2 Encapsulation

## The Concept

Encapsulation means controlling how a class's internal data can be read or changed from outside — instead of letting anyone reach in and set any
attribute to any value, you draw a boundary around what's public API versus internal implementation detail, and route access through methods that can validate or compute on the fly.

Python and JavaScript enforce that boundary very differently. Python gives you **naming conventions** the language partially respects; JavaScript (with modern `#` fields) gives you a boundary the language **actually enforces**. This is the most important thing to get right here — it's easy to assume Python's underscore works like JS's `#`, and it doesn't.

## Python: Public, Protected & Private with `_` and `__`

```python
class Player:
    def __init__(self, goals, assists):
        self.name = name            # public
        self.__goals = goals        # private (name-mangled)
        self._assists = 0       # protected (convention) -- "internal use"


p = Player("Messi", 20, 10)
print(p.name)     # "Messi" -- public, freely accessible
print(p._assists)    # 0 -- works, but breaks convention to touch this directly
print(p.__goals)     # AttributeError: 'Player' object has no attribute '__goals'
```

**Notes:**
- **Single underscore** (`_assists`) means "protected" by convention only — nothing stops `p._assists` from working; it's a signal to other developers, not a lock.
- **Double underscore** (`__goals`) triggers **name mangling**: Python silently renames it internally (to `_Player__goals`). Typing `p.__goals` from outside genuinely fails, but a determined caller who knows the mangled name can still reach `p._Player__goals` directly — it's obscurity, not a hard lock.

## Python: Getters, Setters & Deleters with `@property`

```python
class Player:
    def __init__(self, name, goals, assists):
        self.name = name  
        self.__goals = goals   
        self.assists = assists 

    # the getter method
    @property
    def goals(self):
        return self.__goals   # reads from __goals (storage) -- NOT self.goals (itself)

    # the setter method with validation
    @goals.setter
    def goals(self, value):
        if value < 0:
            raise ValueError("Goals can't be negative")
        self.__goals = value   # writes to __goals (storage) -- NOT self.goals (itself)

    @property
    def total_contributions(self):    # looks like an attribute
        return self.goals + self.assists   #just reading    

    # the deleter method
    @goals.deleter
    def goals(self):
        print(f"Deleting goals record for {self.name}...")
        self.__goals = None

p = Player("Messi", 20, 10)
print(p.total_contributions)   # 30 – no parentheses; accessed like plain attribute  

p.goals = 30    # calls the setter automatically -- passes validation
print(p.total_contributions)   # 40 – no parentheses; accessed like plain attribute  

p.goals = -50   # calls the setter -- fails validation
# ValueError: goals must be between 0.0 and 4.0

del p.goals     # calls the deleter
print(p.goals)    # None
```

**Notes:**
- `@property` turns a method into something accessed **without parentheses** — `p.goals`, not `p.goals()`. This is the syntactic trick that makes **controlled access** look exactly like plain attribute access.
- `@goals.setter` intercepts `p.goals = value`, letting you validate before actually storing anything — assigning `50` never reaches `self.__goals` because the validation raises first.
- `@goals.deleter` intercepts Python's built-in `del` statement — this has **no direct JS equivalent**, see below.

**What if we did without `__`:**
```python
class Player:
    def __init__(self, goals):
        self.goals = goals   # goes through the setter below automatically

    @property
    def goals(self):
        return self.goals

    @goals.setter
    def goals(self, value):
        if value < 0:
            raise ValueError("Goals can't be negative")
        self.goals = value

p = Player(10)
print(p.goals)    # RecursionError: maximum recursion depth exceeded
```
It will throw `RecursionError`
Think about what `self.goals` means here. goals is a `@property` now — so `self.goals` doesn't mean "grab the raw stored value," it means "call the goals getter function." So:
- We call p.goals
- Python runs the getter: `return self.goals`
- But `self.goals` is the getter itself — so this triggers the getter again
- Which runs return `self.goals` again
- Which triggers the getter again... forever
Same broken logic hits the setter: `self.goals = value` doesn't "just store the value" — since goals is a property, this line calls the setter function itself, which then tries `self.goals = value` again, calling the setter again, forever.
This is exactly why the underscore convention exists — you need one name for the public property (`goals`) and a different name for the actual storage (`__goals`), so they don't collide and call each other infinitely.


## Python: Name Mangling in Inheritance

```python
class BaseConfig:
    def __init__(self):
        self.__version = "1.0"   # gets mangled to _BaseConfig__version


class AppConfig(BaseConfig):
    def __init__(self):
        super().__init__()
        self.__version = "2.0"   # gets mangled to _AppConfig__version -- does NOT collide!


c = AppConfig()
print(c.__dict__)
# {'_BaseConfig__version': '1.0', '_AppConfig__version': '2.0'}
```

**Notes:**
- This is the real *purpose* of name mangling — not security, but preventing a subclass's `__version` from silently overwriting a parent class's `__version` of the same name. Each class gets its own mangled slot, so both values survive independently on the same object.

## JavaScript: Private Fields with `#`
JS actually has real enforced privacy, which Python fundamentally lacks:

```javascript
class Player {
  #goals; // truly private -- enforced by the language

  constructor(name, goals, assists) {
    this.name = name;      // public
    this.#goals = goals;   // private
    this.assists = assists;  // public
  }

  // the getter method
  get goals() {
      return this.#goals;
  }

  // the setter method with validation
  set goals(value) {
      if (value < 0) throw new Error("Goals can't be negative");
      this.#goals = value;
  }

  get totalContributions() {   // looks like a property
      return this.#goals + this.assists;
  }
}

const p = new Player("Messi", 20, 10);
console.log(p.name);       // "Messi"
console.log(p.#goals);     // SyntaxError: Private field '#goals' must be declared in an enclosing class
// -- fails to even PARSE outside the class body
console.log(p.totalContributions);   // 30 -- no parentheses, accessed like plain property

console.log(p.goals);     // 20 -- calls the getter automatically 
p.goals = 30;         // calls the setter automatically -- passes validation
console.log(p.totalContributions);   // 40

p.goals = -50;     // calls the setter -- fails validation

console.log(delete p.goals); // true
console.log(p.goals);  // 30 -- unchanged!
```

**Notes:**
- `#goals` is **actually private** — enforced by the JS engine, not a convention. Referencing `s.#goals` from outside the class is a **syntax error**, not a catchable runtime error — the code doesn't even parse. This is a much harder boundary than Python's underscores.
- JS has no built-in equivalent to Python's "protected" — there's genuinely public (`this.assists`) or genuinely private (`this.#goals`),
  nothing in between.
- `get`/`set` play the same role as `@property`/`@goals.setter`.

**Javascript `delete` silently did nothing, why?**
Python's `del p.goals` explicitly calls whatever code you wrote under `@goals.deleter`. JavaScript's `delete` operator has no such hook for accessor (`get`/`set`) properties defined on a class — `goals` isn't actually stored as an *own property* on the instance `s` at all; it lives on `Player.prototype` as a getter/setter pair. `delete p.goals` looks for an own property called `goals` on `p`, finds nothing, and **silently succeeds doing absolutely nothing** — no error, no effect. This is a genuinely sharp gotcha: Python fails loudly if you get deletion wrong; JS fails silently.
To get equivalent "reset on delete" behavior in JS, you'd write an explicit method instead and call it yourself; there's no way to hook the `delete` keyword itself for class accessors.


**What if we did without `#`:**
```javascript
class Player {
    constructor(goals, assists) {
        this.goals = goals;
        this.assists = assists;
    }

    // the getter method
    get goals() {
        return this.goals;
    }

    // the setter method with validation
    set goals(value) {
        if (value < 0) throw new Error("Goals can't be negative");
        this.goals = value;
    }
}

const p = new Player(20);
console.log(p.goals)    // RangeError: Maximum call stack size exceeded
```

**What’s physically happening (identical in both languages)?**
Every function call reserves a small chunk of memory called a stack frame. When a function calls itself (recursion), each call stacks a new frame on top of the previous one, like plates stacking up. 

```
goals() called
  -> goals() called (again, from inside itself)
    -> goals() called (again)
      -> goals() called (again)
        ... thousands of times ...
```
Both Python and JavaScript reserve a fixed, limited amount of memory for this stack (not infinite) — because unbounded stack growth would eventually consume all your system's RAM and crash the whole process. 

**Why the different names?**
- Python calls it `RecursionError` — Python actually tracks a specific counter: how many function calls deep are we? (default limit ~1000, you can check with `sys.getrecursionlimit()`.
- JavaScript calls it `RangeError` — JS doesn't count function-call depth as a specific number; it measures the actual memory size the call stack has grown to, and when that memory range is exceeded, it throws the error.


## Side-by-Side

| Aspect                           | Python                                                                                   | JavaScript                                                                   |
| -------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Public                           | Plain name: `self.name`                                                                  | Plain name: `this.name`                                                      |
| "Protected"                      | Single underscore `_study_hours` — convention only                                       | No equivalent — doesn't exist as a distinct level                            |
| Private                          | Double underscore `__goals` — name-mangled, still reachable if you know the mangled name | `#goals` — enforced by the engine; unreachable, fails to parse               |
| Computed/controlled read         | `@property`                                                                              | `get name() {}`                                                              |
| Controlled write                 | `@name.setter`                                                                           | `set name(value) {}`                                                         |
| Controlled delete                | `@name.deleter`, triggered by `del obj.name`                                             | **No equivalent** — `delete obj.name` silently no-ops on accessor properties |
| Error type when privacy violated | `AttributeError` (unless mangled name is known)                                          | `SyntaxError` — code won't parse at all                                      |

## When to use `@property`/ `@property.setter` and `get`/ `set` instead of plain attributes and properties? 
- **Reason 1 — Validation**:
```python
class Player:
    def __init__(self, goals):
        self.goals = goals

    @property
    def goals(self):
      return self.goals

p = Player(10)
p.goals = -500       # ...this just silently works. A player can't have -500 goals, but Python doesn't care.
p.goals = "banana"   # this "works" too. Nonsense data, no error.
```
Plain attributes are just raw storage — anyone can shove any value in, at any time, with zero checks. 
```python
# the setter method with validation
    @goals.setter
    def goals(self, value):
        if value < 0:
            raise ValueError("Goals can't be negative")
        self._goals = value

p = Player(10)
p.goals = -3   # ValueError: Goals can't be negative -- caught immediately, right at the mistake
```
Now invalid data is rejected at the exact line that tried to create it, instead of silently poisoning your object and causing a confusing bug.

- **Reason 2 — Computed/ derived values that update automatically**
What if we stored plain data in both cases, let's the example below:
```python
class Player:
    def __init__(self, goals, assists):
        self.goals = goals
        self.assists = assists
        self.total_contributions = goals + assists   # calculated ONCE, then just sits there as data

p = Player(20, 10)
print(p.total_contributions)    # 30

p.goals = 25    # change the raw data
print(p.total_contributions)    # STILL 30 -- WRONG! not updated yet
```

```javaScript
class Player {
  constructor(goals, assists) {
    this.goals = goals;
    this.assists = assists;
    this.totalContributions = goals + assists;   // frozen snapshot, calculated once
  }
}

const p = new Player(20, 10);
console.log(p.totalContributions);   // 30

p.goals = 25;
console.log(p.totalContributions);   // STILL 30 
```

This is the bug `@property`/ `get` prevents. `total_contributions` is just a number frozen at `__init__` time. The moment we change goals afterward, it is not updated. To be precise, Python doesn't have this dual terminology problem because it uses two different words from the start: `attribute` (plain) vs `property` (computed, via `@property`). JS actually distinguishes them internally as:
  - **data property** — a plain stored value (`this.goals = 20`)
  - **accessor property** — a get/set pair pretending to be a value

- **Reason 3 — Changing internals without breaking anyone's code**
Say we start with a plain attribute and other code all over our project does:
```python
p.goals = 15
print(p.goals)
```
If we'd have used a plain attribute, adding validation later means changing the public interface — everyone calling `p.goals = value` still needs that to keep working exactly the same way syntactically. `@property` lets us swap plain storage for validated logic without changing a single line of code anywhere else that uses `p.goals`

**Why the getter uses `@property`, not `@goals.getter`?**
Look at the order things happen, when Python hits `@property` on top of `def goals(self):`, this is the very first time the name goals is being created in this class. There's no existing goals object yet. But technically we can write, it’s needlessly roundabout:
```python
goals = property()   # create an empty property manually first (rare, unusual)

@goals.getter
def goals(self):
    return self._goals
```

**Why the setter uses `@goals.setter`, not `@property.setter`?**
By the time we write the setter, goals already exists — it's that property object created a moment ago. We're not creating a new property; we're adding a setter behavior to the existing one.

**Why must the function name be goals both times?**
Because both def goals(...) blocks are reassigning the same variable name, goals, in the class body — just like normal Python variable reassignment:
```python
x = 5
x = x + 1   # reads the OLD x, creates a NEW x with same name

# same thing
goals = property(<getter function>)  # step 1: goals = property object (get-only)
goals = goals.setter(<setter function>)  # step 2: goals = NEW property object (get + set), reusing name "goals"
```
If we used a different name for the setter function, like `def set_goals(self, value):`, then `@goals.setter` would still work (since `.setter` just needs some function as input); but convention says, keep the name identical (goals) both times, since they're really just two functions being fused into one property.

**Single underscore _name — a convention, not enforcement**`
In python, `_name`(one leading underscore) means: “this is internal – don’t touch it from outside the class; keep privacy” But Python doesn't actually stop us. And users interact with `p.goals`, never `p._goals`. 

**Double underscore __name — actual enforcement (mangling)**
```python
class Player:
    def __init__(self, name):
        self.__secret = name    # double underscore

p = Player("Messi")
print(p.__secret)    # AttributeError! Doesn't exist under this name
print(p._Player__secret) # Messi -- Python renamed it internally to _ClassName__attr
```
Python mangles the name into `_Player__secret` behind the scenes, mainly to avoid accidental name clashes in inheritance - it's not really "true privacy," it's more of a collision-avoidance trick. 


## Exercises

1. In the Python example, try `p.__goals = 50` (bypassing the setter) from outside the class. Does it raise an error? Now check `p._Player__goals` afterward — did the *real* private value change, or did you just create a brand-new public attribute called `__goals`?
2. In JS, write a `reset()` method that sets `#goals` back to `null`, to replace the deleter functionality JS can't hook via `delete`.
3. Add a `version` getter (no setter) to both `BaseConfig`/`AppConfig` and a JS equivalent using `#version`, to reinforce that read-only computed properties work the same way regardless of whether the underlying field is public, protected, or private.

---
[← Previous: 4.1 Classes & Objects](../4.1-classes-constructors/) · [Back to Part 4](../) · [Next → 4.3 Inheritance](../4.3-inheritance/)
