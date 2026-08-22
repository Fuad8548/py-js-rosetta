# 4.3 Inheritance

*Aligned with freeCodeCamp: [Python — Object-Oriented Programming](https://www.freecodecamp.org/learn/python-v9/review-object-oriented-programming/review-object-oriented-programming) · [JS — Classes](https://www.freecodecamp.org/learn/javascript-v9/review-javascript-classes/review-javascript-classes). Examples below are original.*

## The Concept

Inheritance lets one class reuse and extend another's behavior instead of
rewriting it from scratch. A **child class** (subclass) inherits everything
from its **parent class** (superclass), and can **override** any method it
wants to behave differently.

Both languages use nearly identical vocabulary: `super()` calls the
parent's version of something (usually the constructor), and overriding a
method just means defining a method with the same name in the child class
— it takes priority automatically.

## Python: Single Inheritance

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def introduce(self):
        return f"Hi, I'm {self.name}, {self.age} years old."


class Teacher(Person):
    def __init__(self, name, age, subject):
        super().__init__(name, age)   # call the parent's constructor
        self.subject = subject

    def introduce(self):               # override -- Teacher's version wins
        return f"Hi, I'm {self.name}, and I teach {self.subject}."


t = Teacher("Rina", 34, "Physics")
print(t.introduce())          # "Hi, I'm Rina, and I teach Physics."
print(t.name, t.age)            # "Rina 34" -- set by the parent's __init__, via super()
print(isinstance(t, Person))     # True -- a Teacher IS a Person
```

**Notes:**
- `class Teacher(Person):` — the parent class goes in parentheses.
- `super().__init__(name, age)` calls `Person`'s constructor to handle the
  part `Teacher` doesn't need to repeat, then `Teacher` adds `self.subject`
  on top. Without this call, `Teacher` instances would never get `.name`
  or `.age` at all.
- `introduce()` is defined in both classes. Python always uses the
  **closest** definition — `Teacher`'s own `introduce()` — unless
  `Teacher` doesn't define one, in which case it falls back to `Person`'s.
- `isinstance(t, Person)` is `True` — inheritance means "is a," not just
  "reuses code from."

## JavaScript: Single Inheritance

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  introduce() {
    return `Hi, I'm ${this.name}, ${this.age} years old.`;
  }
}

class Teacher extends Person {
  constructor(name, age, subject) {
    super(name, age); // call the parent's constructor
    this.subject = subject;
  }

  introduce() { // override -- Teacher's version wins
    return `Hi, I'm ${this.name}, and I teach ${this.subject}.`;
  }
}

const t = new Teacher("Rina", 34, "Physics");
console.log(t.introduce());          // "Hi, I'm Rina, and I teach Physics."
console.log(t.name, t.age);            // "Rina 34"
console.log(t instanceof Person);        // true
```

**Notes:**
- `class Teacher extends Person` — same idea as Python's parentheses,
  different keyword.
- `super(name, age)` must be called **before** you can use `this` anywhere
  in a child constructor — and JS actually enforces this:

```javascript
class Teacher extends Person {
  constructor(name, subject) {
    this.subject = subject; // using 'this' BEFORE calling super()
    super(name);
  }
}
new Teacher("Rina", "Physics");
// ReferenceError: Must call super constructor in derived class before
// accessing 'this' or returning from derived constructor
```

  Python has **no equivalent restriction** — you're free to do work before
  calling `super().__init__(...)`, though it's usually still bad practice.
- `instanceof` is JS's equivalent of `isinstance()`.

## Side-by-Side

| Aspect | Python | JavaScript |
|---|---|---|
| Declare a subclass | `class Teacher(Person):` | `class Teacher extends Person {}` |
| Call parent constructor | `super().__init__(name, age)` | `super(name, age)` |
| Constraint on `super()` call | None — flexible about when/whether you call it | Must be called before using `this` — enforced with a real error otherwise |
| Override a method | Redefine it in the child class | Redefine it in the child class |
| Type check | `isinstance(t, Person)` | `t instanceof Person` |

## When to Reach for This

Use inheritance when a child class genuinely **is a specialized version**
of the parent — a `Teacher` is a `Person`, an `AdminUser` is a `User`. If
you're inheriting just to reuse a couple of unrelated methods, that's
usually a sign you want **composition** instead — give the class an
instance of the other class as an attribute, rather than inheriting from
it.

---

## Going Further: Multiple Inheritance (Python) vs the Prototype Chain (JS)

This is genuinely asymmetric between the two languages, worth knowing
before you hit it in real code.

**Python supports multiple inheritance** — a class can list more than one
parent:

```python
class Swimmer:
    def train(self):
        return "Swimming laps"

    def compete(self):
        return "Competing in the pool"


class Runner:
    def train(self):
        return "Running sprints"

    def compete(self):
        return "Competing on the track"


class Triathlete(Swimmer, Runner):
    pass


t = Triathlete()
print(t.train())    # "Swimming laps" -- Swimmer wins, comes first in the parent list
print(t.compete())    # "Competing in the pool" -- same reason

print(Triathlete.__mro__)
# (<class 'Triathlete'>, <class 'Swimmer'>, <class 'Runner'>, <class 'object'>)
```

Both `Swimmer` and `Runner` define `train()` and `compete()`. Python
resolves this using the **Method Resolution Order (MRO)** — a precomputed
list, following an algorithm called C3 linearization, that determines
exactly which class's version wins. `Swimmer` comes first in the
parentheses, so its methods win across the board. `Triathlete.__mro__`
lets you see this order directly — nothing is hidden or guessed at
runtime.

**JavaScript's `extends` only supports single inheritance** —
`class Triathlete extends Swimmer, Runner` isn't legal syntax, so this
exact conflict can't happen with classes. If you need to combine behavior
from multiple independent sources, the idiomatic JS pattern is a
**mixin** — a function that takes a base class and returns a new class
extending it:

```javascript
const Swimmer = (Base) => class extends Base {
  swim() {
    return "Swimming laps";
  }
};
const Runner = (Base) => class extends Base {
  run() {
    return "Running sprints";
  }
};

class Athlete {}
class Triathlete extends Swimmer(Runner(Athlete)) {}

const t = new Triathlete();
console.log(t.swim());  // "Swimming laps"
console.log(t.run());     // "Running sprints"
```

Each mixin wraps the previous class in a new layer of the (still single!)
prototype chain — `Triathlete → Swimmer-wrapped → Runner-wrapped →
Athlete → Object`. There's no MRO-style conflict to resolve because each
mixin contributes different method names here; if two mixins *did* define
the same method name, the outermost one (applied last, closest to
`Triathlete`) would simply win — a single, predictable chain, not a
computed resolution order.

| Aspect | Python | JavaScript |
|---|---|---|
| Multiple inheritance | Yes — `class Triathlete(Swimmer, Runner):` | No — `extends` takes one class only |
| Conflict resolution | MRO (C3 linearization), computed once at class definition | N/A for classes; a mixin chain is still just one linear prototype chain |
| Combining independent behaviors | Multiple inheritance (use cautiously) | Mixins — functions wrapping a base class |
| Inspect the resolution order | `Triathlete.__mro__` | Manually: `Object.getPrototypeOf()`, walked one link at a time |

## Exercises

1. Swap the parent order to `class Triathlete(Runner, Swimmer):` and
   predict what `t.train()` will print *before* running it. Check
   `Triathlete.__mro__` to confirm.
2. In the JS mixin example, add a `swim()` method to `Runner` too (so both
   mixins define `swim()`). Which one wins when you call `t.swim()`?
   Explain why, referencing the order the mixins were applied.
3. Rewrite the Python `Teacher`/`Person` example so `Teacher.introduce()`
   calls `Person`'s original version *and* adds to it — i.e.
   `super().introduce() + " I specialize in Physics."` Do the same in JS
   with `super.introduce()`.

---
[← Previous: 4.2 Encapsulation](../4.2-encapsulation/) · [Back to Part 4](../) · [Next → 4.4 Dunder Methods](../4.4-dunder-methods/)
