# 7.2.1 Linear Search

## The Concept

Check every element, one at a time, from the start, until you find a
match or run out of elements. No assumptions about the data are
required — it works on sorted or unsorted collections equally.

**Everyday analogy:** looking for a specific document in an unorganized stack of papers — you flip through one sheet at a time,
top to bottom, until you find it (or reach the bottom and conclude it isn't there). There's no shortcut available, because nothing about the stack tells you where to look first.

The defining trait: **best case is O(1)** (the target happens to be first), but **worst case is O(n)** (the target is last, or missing entirely) — and since you can't know in advance which case you're in, linear search is *always* classified as O(n) for planning purposes.

**Space complexity:** O(1) — both implementations below only use a loop counter and no extra structures, regardless of how large `arr` gets.

**Real-world example:** a database query on a column with **no index** — e.g. `SELECT * FROM users WHERE email = 'x'` when `email`
isn't indexed. The database has no shortcut either; it performs a **full table scan**, checking every row in order until it finds a
match (or checks all of them and finds none). This is exactly why adding an index to a frequently-queried column matters in practice — it turns this O(n) scan into something closer to the O(log n) lookup covered in the next lesson.

## Python

```python
import time

def linear_search(arr, target):
    for i, value in enumerate(arr):
        if value == target:
            return i
    return -1

N = 500_000
arr = list(range(N))

# best case - target is the very first element
start = time.perf_counter()
linear_search(arr, arr[0])
print("best case  (target at index 0):   ", time.perf_counter() - start, "seconds")

# worst case - target is the last element (or missing)
start = time.perf_counter()
linear_search(arr, arr[-1])
print("worst case (target at last index):", time.perf_counter() - start, "seconds")
```

**Notes:**

- `enumerate(arr)` gives both the index and the value in one pass — idiomatic Python for "I need the position, not just the value."
- The gap between best case and worst case above is the whole story of linear search in one measurement: same function, wildly different cost, purely based on *where* the target happens to sit.

## JavaScript

```javascript
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

const N = 500_000;
const arr = Array.from({length: N}, (_, i) => i);

let start = process.hrtime.bigint();
linearSearch(arr, arr[0]);
console.log("best case  (target at index 0):   ", Number(process.hrtime.bigint() - start) / 1e6, "ms");

start = process.hrtime.bigint();
linearSearch(arr, arr[arr.length - 1]);
console.log("worst case (target at last index):", Number(process.hrtime.bigint() - start) / 1e6, "ms");
```

**Notes:**

- A plain indexed `for` loop, not `for...of` — this keeps `i` available directly, matching Python's `enumerate` role, and avoids extra iterator overhead for a hot loop like this.
- **Gotcha:** as always with single-call JS microbenchmarks, run numbers can vary between runs due to JIT warm-up — the *trend* (best case ≪ worst case) is the reliable signal, not the exact millisecond values.

## Side-by-Side

| Aspect                 | Python                              | JavaScript                                 |
| ---------------------- | ----------------------------------- | ------------------------------------------ |
| Core loop              | `for i, value in enumerate(arr)`    | `for (let i = 0; i < arr.length; i++)`     |
| Best case              | O(1) — target at index 0            | O(1) — target at index 0                   |
| Worst case             | O(n) — target at end or missing     | O(n) — target at end or missing            |
| Space complexity       | O(1) — no extra structures          | O(1) — no extra structures                 |
| Requires sorted input? | No                                  | No                                         |
| Built-in equivalent    | `list.index(x)` (raises if missing) | `array.indexOf(x)` (returns -1 if missing) |

## When to Reach for This

- The data is **unsorted**, and sorting it first isn't worth the
  cost for a one-time search (see 7.1.1 — sorting costs O(n log n),
  which is *more* work than a single O(n) linear scan).
- The collection is small enough that O(n) vs O(log n) doesn't
  meaningfully matter in practice.
- You need to search on a condition more complex than exact equality
  (e.g. "first item where `price > 100`") — binary search's halving
  trick only works for simple sorted comparisons, not arbitrary
  conditions.

## Exercises

1. Modify either example to count **how many comparisons** it takes
   (not just time it) for best case vs. worst case at `N = 10`. What
   are the two numbers, and do they match what O(1) and O(n) predict?
2. Python's built-in `list.index(x)` and JavaScript's `array.indexOf(x)`
   both perform linear search internally. Look up what each one
   returns when the target is **not found** — why might the
   difference (exception vs. `-1`) matter when you use them?
3. Predict, without running it: if you ran this same benchmark on a
   collection of **1,000** items instead of 500,000, would the *ratio*
   between best case and worst case change? Why or why not?

---

[← Back to 7.2 overview](../) · [Next: 7.2.2 Binary Search →](../7.2.2-binary-search/)
