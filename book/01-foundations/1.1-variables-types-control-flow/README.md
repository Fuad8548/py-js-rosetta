# 1.1 Variables, Types & Control Flow

## The Concept

A **variable** is a name bound to a value. A **type** describes what kind of
value it is (text, number, list, etc.) and what you're allowed to do with
it. **Control flow** — `if`, `for`, `while` — decides which lines of code
actually run, and in what order.

None of this is paradigm-specific. Every language, OOP or FP, needs a way
to name things, know what they are, and decide what happens next. This is
the floor everything else in the book stands on.

## Python

```python
# a string, bound to a name written in ALL_CAPS by convention (not enforced)
GREETING_PREFIX = "Hello, "

def describe(name, age):
    if age < 18:
        category = "minor"
    elif age < 65:
        category = "adult"
    else:
        category = "senior"
    return f"{GREETING_PREFIX}{name} ({category})"

print(describe("Fuad", 27))

# Python is dynamically typed but strict about coercion:
# "5" + 3  ->  TypeError: can only concatenate str (not "int") to str
```

**Notes:**
- Python is **dynamically typed**: you never declare `GREETING_PREFIX`'s
  type — it's inferred as `str` the moment you assign it. But it's still
  **strongly typed** underneath: `"5" + 3` raises `TypeError` rather than
  silently guessing what you meant.
- `ALL_CAPS` is a naming convention signaling "treat this as a constant" —
  Python has no true `const` keyword. Nothing stops you from reassigning it;
  it's a promise between developers, not something the language enforces.
- `elif` chains are Python's way of writing multi-branch conditionals —
  there's no `switch` statement in Python (until `match` in 3.10+, which is
  structurally different, not a direct equivalent).

## JavaScript

```javascript
const GREETING_PREFIX = "Hello, ";

function describe(name, age) {
  let category;
  if (age < 18) {
    category = "minor";
  } else if (age < 65) {
    category = "adult";
  } else {
    category = "senior";
  }
  return `${GREETING_PREFIX}${name} (${category})`;
}

console.log(describe("Fuad", 27));

// JavaScript is dynamically typed and loose about coercion:
console.log("5" + 3); // "53"  (string wins)
console.log("5" - 3); // 2     (number wins)
```

**Notes:**
- `const` means the **binding** can't be reassigned — `GREETING_PREFIX = "x"`
  later throws `TypeError: Assignment to constant variable`. This is
  actually enforced, unlike Python's convention-only constants.
- `let` is for variables that will be reassigned (like `category` above);
  `var` is the old pre-2015 way and should generally be avoided — it doesn't
  respect block scope the way `let`/`const` do.
- The `"5" + 3` vs `"5" - 3` inconsistency is a classic JS gotcha: `+` is
  overloaded for both string concatenation and addition, so JS guesses
  based on the left operand; `-` only makes sense numerically, so JS
  coerces both sides to numbers. Python would raise an error in both cases
  rather than guess.
- Template literals (`` `${x}` ``) are JS's equivalent of Python's f-strings
  (`f"{x}"`) — both let you embed expressions directly in a string.

## Side-by-Side

| Aspect | Python | JavaScript |
|---|---|---|
| Type checking | Dynamic, strict about coercion | Dynamic, loose/inconsistent coercion |
| "Constant" | Naming convention only (`ALL_CAPS`) | `const` — enforced by the language |
| Multi-branch conditional | `if / elif / else` | `if / else if / else` |
| String interpolation | f-strings: `f"{x}"` | Template literals: `` `${x}` `` |
| String + number | Raises `TypeError` | Often coerces silently (`"5" + 3 → "53"`) |

## When to Reach for This

Every script starts here — there's no "advanced" version of variables and
control flow, just more of them composed together. The one thing worth
internalizing early: JS's coercion behavior causes real production bugs
(e.g., a value from a JSON API turns out to be a numeric string, and `+`
concatenates instead of adding). Python's strictness catches this class of
bug immediately; JS won't, so get in the habit of checking types explicitly
in JS when data comes from an external source.

## Exercises

1. In the JS version, change `"5" - 3` to `"5" - "abc"` and run it. What do
   you get, and why? (Hint: look up `NaN`.)
2. Rewrite the Python `describe` function using a `match` statement instead
   of `if/elif/else`. Does it read more or less clearly to you?
3. In Python, try `GREETING_PREFIX = 5` right after the original assignment
   and run the script again — nothing stops you. Now try the equivalent in
   JS with `const`. Explain the difference in one sentence.

---
[← Back to Part 1](../) · [Next → 1.2 Functions as First-Class Citizens](../1.2-functions-first-class/)
