# 1.2 Functions as First-Class Citizens

## The Concept

"First-class" means a function is a value like any other — you can store
it in a variable, pass it as an argument, return it from another function.
This single property is the seed that **all of functional programming
(Part 3) grows from.** If a language didn't have first-class functions,
none of Part 3 would be possible.

## Python

```python
def shout(text):
    return text.upper() + "!"

def whisper(text):
    return text.lower() + "..."

def apply_and_print(fn, text):
    """Takes a FUNCTION as an argument — this only works because
    functions are first-class values in Python."""
    print(fn(text))

apply_and_print(shout, "hello")     # HELLO!
apply_and_print(whisper, "HELLO")   # hello...

# functions are values — this is legal and meaningful:
task = shout
print(task("hi"))  # HI!  (calling task is calling shout)
```

**Notes:**
- `def` creates a function object and binds it to a name — that's why
  `task = shout` (no parentheses!) works: you're copying the function
  *itself*, not calling it and copying its result. `task = shout()` would
  call it immediately and bind the *return value* instead — a common
  beginner slip.
- Passing `shout` (not `shout()`) into `apply_and_print` is exactly what
  "first-class function" means in practice.
- Python's `lambda` is a shorthand for small anonymous functions:
  `apply_and_print(lambda t: t[::-1], "hello")` reverses the string inline,
  without a separate `def`.

## JavaScript

```javascript
function shout(text) {
  return text.toUpperCase() + "!";
}

function whisper(text) {
  return text.toLowerCase() + "...";
}

function applyAndPrint(fn, text) {
  console.log(fn(text));
}

applyAndPrint(shout, "hello");    // HELLO!
applyAndPrint(whisper, "HELLO");  // hello...

// functions are values here too:
const task = shout;
console.log(task("hi")); // HI!

// arrow function equivalent, passed inline:
applyAndPrint((t) => t.split("").reverse().join(""), "hello"); // olleh
```

**Notes:**
- Identical idea to Python — `const task = shout` (no parens) copies the
  function value; `task()` invokes it.
- JavaScript leans on **anonymous and arrow functions** far more heavily
  than Python leans on `lambda`. Passing `(t) => ...` inline as an argument
  is completely idiomatic JS; Python developers tend to prefer a named
  `def` even for short functions, reserving `lambda` for truly trivial
  one-liners (often inside `sorted(..., key=lambda x: ...)`).
- Arrow functions also behave differently from `function` declarations
  regarding `this` binding — not relevant yet, but worth remembering once
  you hit classes in Part 4.

## Side-by-Side

| Aspect | Python | JavaScript |
|---|---|---|
| Define a function | `def name():` | `function name() {}` |
| Assign function to a variable | `task = shout` | `const task = shout` |
| Anonymous function | `lambda x: x + 1` (single expression only) | `x => x + 1` (can have a full block body) |
| Idiomatic inline use | Named `def`, `lambda` mostly for `key=` args | Arrow functions used constantly inline |
| Async function | `async def` + `await` | `async function` + `await` |

## When to Reach for This

Any time you catch yourself copy-pasting a block of logic with one small
change, that's the signal to extract it into a function and pass in the
thing that varies — exactly what `apply_and_print`/`applyAndPrint` does
above with `shout` vs `whisper`. This single habit eliminates a large
fraction of beginner bugs (fixing a bug in one copy, forgetting the other
three).

## Exercises

1. Write a third function, `pig_latin(text)`, and pass it into
   `apply_and_print` / `applyAndPrint` without changing that function at
   all. This is the whole point of first-class functions — the "container"
   function never needs to know what specific transformation it's running.
2. In Python, write `task = shout()` (with parentheses) by mistake, then
   try `task("hi")`. Read the error message carefully — what type is
   `task` actually holding now?
3. Convert the JS `whisper` function into an arrow function assigned to a
   `const`. Does anything about calling it change?

---
[← Previous: 1.1 Variables, Types & Control Flow](../1.1-variables-types-control-flow/) · [Back to Part 1](../) · [Next → Part 2: Data & Collections](../../02-data-and-collections/)
