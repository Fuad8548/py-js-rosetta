# 7.1.1 Time Complexity

## The Concept

Big-O notation describes how the **cost of an operation grows** as the
size of the input (usually called `n`) grows. It deliberately ignores
constant factors and hardware speed — it's not a stopwatch, it's a
*shape of growth*.

**Dhaka traffic:** imagine you're timing a
trip across the city. Big-O isn't "it took 40 minutes" (that depends
on the car, the driver, the day) — it's "the trip time roughly
**doubles** if the distance doubles" (linear) vs. "the trip time barely
changes even if the distance doubles" (constant) vs. "the trip time
explodes even for a small increase in distance" (quadratic, e.g. every
additional stop requires checking every other stop for a route).

A more concrete analogy used throughout this book: a **theater with
fixed, bolted-down seats**. To seat a new person at seat #1, everyone
already seated has to shift over by one — the number of people who
must move grows directly with how many are already seated. That
"shifting" is exactly what an array does internally when you insert
at the front, and it's where O(n) comes from in the examples below.

The common growth rates, from cheapest to most expensive:

| Notation   | Name         | Growth as `n` increases    |
| ---------- | ------------ | -------------------------- |
| O(1)       | constant     | never changes              |
| O(log n)   | logarithmic  | grows very slowly          |
| O(n)       | linear       | grows directly with `n`    |
| O(n log n) | linearithmic | slightly worse than linear |
| O(n²)      | quadratic    | grows very fast            |

**Key rule:** when you have two costs happening one after another
(e.g. sort, *then* search), you keep only the **dominant** (fastest-
growing) term. `O(n log n) + O(log n)` simplifies to `O(n log n)` —
the smaller term gets swallowed as `n` grows large.

## Python

```python
import time

N = 300_000

# --- INSERTION ---

# Front insertion - O(n) - everything after index 0 must shift right
arr = list(range(N))
start = time.perf_counter()
arr.insert(0, 999)
print("insert(0, x):", time.perf_counter() - start, "seconds")

# End insertion - O(1) amortized - Python keeps spare capacity at the end
arr2 = list(range(N))
start = time.perf_counter()
arr2.append(999)
print("append(x):   ", time.perf_counter() - start, "seconds")

# --- REMOVAL ---

# Front removal - O(n) - everything after index 0 must shift left
arr3 = list(range(N))
start = time.perf_counter()
arr3.pop(0)
print("pop(0):      ", time.perf_counter() - start, "seconds")

# End removal - O(1) - nothing after the last element to shift
arr4 = list(range(N))
start = time.perf_counter()
arr4.pop()
print("pop():       ", time.perf_counter() - start, "seconds")
```

**Notes:**

- `list.insert(0, x)` and `list.append(x)` look similarly simple, but
  cost completely different amounts of work under the hood. The same
  is true of `pop(0)` vs `pop()` — same pairing, mirrored for removal.
- This isn't a Python-specific quirk — it comes from how a **dynamic
  array** (contiguous memory) is stored, which is true in most
  languages.
- Python's `list` always keeps some **spare room at the end**, which
  is exactly why `append()` is O(1) *amortized* rather than a fixed
  guarantee every single time — occasionally the spare room runs out
  and Python has to reallocate a bigger block and copy everything
  over. Averaged over many calls, this still counts as O(1).
- `pop()` has no such "occasional spike" — removing the last element
  never requires reallocation, only `append()` does. So `pop()` is
  O(1) *every single time*, not just amortized.

## JavaScript

```javascript
const N = 300_000;

// --- INSERTION ---

// Front insertion - O(n) - same shifting cost as Python's insert(0, x)
let arr = Array.from({length: N}, (_, i) => i);
let start = process.hrtime.bigint();
arr.unshift(999);
console.log("unshift(x):", Number(process.hrtime.bigint() - start) / 1e6, "ms");

// End insertion - O(1) amortized - same as Python's append(x)
let arr2 = Array.from({length: N}, (_, i) => i);
start = process.hrtime.bigint();
arr2.push(999);
console.log("push(x):   ", Number(process.hrtime.bigint() - start) / 1e6, "ms");

// --- REMOVAL ---

// Front removal - O(n) - same shifting cost as Python's pop(0)
let arr3 = Array.from({length: N}, (_, i) => i);
start = process.hrtime.bigint();
arr3.shift();
console.log("shift():   ", Number(process.hrtime.bigint() - start) / 1e6, "ms");

// End removal - O(1) - same as Python's pop()
let arr4 = Array.from({length: N}, (_, i) => i);
start = process.hrtime.bigint();
arr4.pop();
console.log("pop():     ", Number(process.hrtime.bigint() - start) / 1e6, "ms");
```

**Notes:**

- `unshift()` is JavaScript's equivalent of Python's `insert(0, x)` —
  same O(n) cost, same reason (everything shifts). `shift()` is the
  equivalent of Python's `pop(0)` — same O(n) removal cost.
- `push()` is JavaScript's equivalent of Python's `append()` — same
  O(1) amortized cost. `pop()` matches Python's `pop()` — O(1), no
  amortization needed, since removing the last element never
  triggers a reallocation.
- **Gotcha:** single-call microbenchmarks in JS are noisy due to V8's
  JIT compiler not being "warmed up" yet. The four numbers above are
  each a *single* call, so don't be surprised if `push` occasionally
  looks slower than `unshift` in one run — that's noise, not a real
  result. For a trustworthy comparison, average many repeated calls
  rather than trusting one single measurement — see Exercise 2.

## Side-by-Side

| Aspect                 | Python                            | JavaScript                        |
| ---------------------- | --------------------------------- | --------------------------------- |
| Insert at front        | `list.insert(0, x)` — O(n)        | `array.unshift(x)` — O(n)         |
| Insert at end          | `list.append(x)` — O(1) amortized | `array.push(x)` — O(1) amortized  |
| Remove from front      | `list.pop(0)` — O(n)              | `array.shift()` — O(n)            |
| Remove from end        | `list.pop()` — O(1)               | `array.pop()` — O(1)              |
| Random access by index | `arr[i]` — O(1)                   | `arr[i]` — O(1)                   |
| Underlying structure   | dynamic array (contiguous memory) | dynamic array (contiguous memory) |

## When to Reach for This

- Before choosing a data structure, ask: **which end(s) of the
  structure will I actually be adding/removing from?** If you only
  ever touch the end, a plain array/list is already optimal — no need
  to reach for anything fancier.
- If you need to add/remove from the **front** frequently and
  performance matters at scale, that's a signal to reach for
  `collections.deque` (Python) or a hand-built linked list (JavaScript
  has no built-in deque) — covered in 7.3–7.5.
- Big-O tells you the **trend**, not the actual runtime. Always
  benchmark real code when performance genuinely matters — theory and
  measured reality can diverge (see 7.4 and 7.5, where this happens in
  practice).

## Exercises

1. Re-run the Python `pop(0)` vs `pop()` comparison above at
   `N = 1_000_000` instead of `300_000`. Does the *ratio* between them
   grow, shrink, or stay about the same as `N` grows? What does that
   tell you about what "O(n)" actually predicts as data scales?
2. The JavaScript example above uses a single call, which is noisy.
   Rewrite it to run the operation 1,000 times in a loop (after a
   warm-up loop of ~20 calls) and report the **average** time per
   call. Does `push` still clearly beat `unshift` once you remove the
   noise?
3. Without running any code, predict: is `arr[500000]` (direct index
   access) closer in cost to `append()` or to `insert(0, x)`? Explain
   why in one sentence, then verify with a timed test.
4. Big-O ignores constant factors. Give one real example from this
   lesson where two operations have the **same** Big-O classification
   but noticeably different real-world speed. (Hint: look at the
   "amortized" note above.)

---

[← Back to 7.1 overview](../) · [Next: 7.2 Searching →](../../7.2-searching/)
