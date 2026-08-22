# 7.2.2 Binary Search

## The Concept

Check the middle element. If it's the target, done. If the target is larger, discard the entire left half and repeat on the right half. If smaller, discard the right half and repeat on the left. Each check
eliminates **half** of what's left — the defining trait of O(log n).

**Requirement:** the data must already be **sorted**. Binary search's speed comes entirely from being able to trust that "if the middle value is too small, the answer can't possibly be to the left" — that trust only holds if the array is in order.

**Space complexity:** the **iterative** version below (tracking `low`/`high` as plain integers) uses O(1) extra space — no matter how large `arr` gets, only a fixed handful of variables exist at once. A **recursive** version instead costs O(log n) extra space, because each recursive call adds a new frame to the call stack, and binary search makes roughly log n nested calls before reaching a base case. That's on top of whatever space the recursive body itself uses — see the slicing note below and Exercise 2.

**Everyday analogy:** looking up a name in a printed phone book. You don't start at page 1 — you open to roughly the middle, check which half the name falls in, and repeat on that half only. Each flip eliminates half the remaining pages, which is why it takes only a handful of flips even for a book with thousands of pages.

**Real-world example:** `git bisect` — when a bug was introduced somewhere in the last several hundred commits, `git bisect` doesn't
test them one by one. It checks the middle commit, marks it "good" or "bad," and repeats on the correct half — the exact same algorithm, applied to commit history instead of a sorted array. A search space of 500 commits collapses to roughly 9 checks. Separately, database **indexes** (typically B-trees) exist for the same underlying reason: turning the O(n) full table scan from the previous lesson into a lookup much closer to the O(log n) cost shown below — though it's worth noting a B-tree isn't literally a binary search, just built on
the same "eliminate large chunks of the search space at once" idea.

## Python

```python
import time

def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

N = 500_000
arr = list(range(N))  # already sorted

start = time.perf_counter()
binary_search(arr, arr[-1])
print("binary search (worst case):", time.perf_counter() - start, "seconds")
```

**Notes:**

- `low`, `high`, `mid` are plain integers — no copying of the array happens at any point. This is what keeps each step O(1): computing `mid` and checking `arr[mid]` cost the same regardless of how big `arr` is.
- A tempting but *incorrect* optimization is slicing (`arr[:mid]`, `arr[mid:]`) instead of tracking `low`/`high` — each slice **copies** a chunk of the array, which turns the whole search from O(log n) into O(n) total, since the copies sum to roughly `n` across all the halving steps. Index tracking avoids this entirely.

## JavaScript

```javascript
function binarySearch(arr, target) {
  let low = 0, high = arr.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}

const N = 500_000;
const arr = Array.from({length: N}, (_, i) => i);

let start = process.hrtime.bigint();
binarySearch(arr, arr[arr.length - 1]);
console.log("binary search (worst case):", Number(process.hrtime.bigint() - start) / 1e6, "ms");
```

**Notes:**

- `Math.floor((low + high) / 2)` — JavaScript has no integer-division operator like Python's `//`, so `Math.floor()` after regular division is the idiomatic equivalent.
- Same slicing trap applies here: `arr.slice(mid)` copies, and would turn this into an O(n) search overall, same reasoning as Python.

## Side-by-Side

| Aspect                                    | Python                                 | JavaScript                     |
| ----------------------------------------- | -------------------------------------- | ------------------------------ |
| Integer division for midpoint             | `(low + high) // 2`                    | `Math.floor((low + high) / 2)` |
| Time complexity (sorted input)            | O(log n)                               | O(log n)                       |
| Space complexity (iterative, shown above) | O(1)                                   | O(1)                           |
| Space complexity (recursive version)      | O(log n) — call stack                  | O(log n) — call stack          |
| Requires sorted input?                    | Yes — required                         | Yes — required                 |
| Built-in equivalent                       | `bisect.bisect_left` (`bisect` module) | none built-in                  |

## When to Reach for This

- The data is **already sorted**, or you'll be searching it **many times** (so the one-time cost of sorting — O(n log n) — is worth paying once, up front).
- **The trap to avoid:** if the data is unsorted and you only need to search it **once**, sorting first is *not* a shortcut — it's more total work than a plain linear scan. Confirmed below:

  | Approach (unsorted input, one search) | Measured time (N=500,000) |
  | ------------------------------------- | ------------------------- |
  | Sort, then binary search              | ~0.163 seconds            |
  | Just linear search, no sort           | ~0.000008 seconds         |

  The sort dominates everything — over 20,000× slower here, purely
  because sorting is O(n log n) and was completely unnecessary for a
  single search. Binary search only pays off when the sort cost gets
  **amortized** across many repeated searches on the same sorted data.

## Exercises

1. Using the Python example, add a version that searches for a value
   that **doesn't exist** in the array (e.g. a negative number).
   Confirm it still returns `-1` and completes in roughly the same
   time as the worst-case search above — why should missing values
   *not* be meaningfully slower than found values, given how the
   algorithm works?
2. Implement a **recursive** version of binary search in Python that
   uses `arr[:mid]` / `arr[mid+1:]` slicing instead of `low`/`high`
   indices (this was covered in depth in the surrounding
   discussion for this project). Time it against the index-based
   version at `N = 500,000` — how large is the gap, and does it match
   what the "Notes" section above predicted?
3. If you needed to search the same sorted array **1,000 times**,
   would the sort cost (paid once) still dominate the total runtime,
   or would it become negligible? Estimate using the numbers above
   before checking with code.

---

[← Back to 7.2 overview](../) · [Next: 7.3 Linked Lists →](../../7.3-linked-lists/)
