# The Rosetta Developer
### Python ⇄ JavaScript, Concept by Concept

> A free, open-source book for developers crossing between Python and JavaScript — learning both languages, and both major programming paradigms (OOP and Functional Programming), side by side.

---

## Why this book?

Most resources teach Python *or* JavaScript, and most teach OOP *or* FP — rarely both at once, and rarely with an explicit map between them. If you already know one language and are learning the other, or if you're comfortable with one paradigm and want to understand the other, this book is built for you.

## How it's organized

Each **chapter** covers one topic area, broken into **subsections**. Every
subsection is self-contained — a focused, minimal example, not tied to a
larger running app — so you can jump straight to the exact syntax
difference you're trying to understand:

1. **The concept**, explained once, paradigm-agnostic
2. **Python** — a minimal idiomatic example
3. **JavaScript** — a minimal idiomatic example
4. **Side-by-side table** — syntax and behavior differences at a glance
5. **When to reach for this** — practical guidance
6. **Exercises**

```
book/0X-chapter-name/
├── README.md                      # chapter index, links to subsections below
├── X.Y-subsection-name/
│   ├── README.md                  # the actual lesson
│   ├── python/example.py          # runnable
│   └── js/example.js              # runnable
└── X.Z-another-subsection/
    └── ...
```

Once you've been through Parts 1–6, **Part 7** hosts optional full-stack
capstone projects (starting with a Bangla news aggregator) where those
concepts get combined into one real, deployable app — proof the pieces fit
together, not a prerequisite for anything earlier.

## Table of Contents

### Part 1 — Foundations
- [1.1 Variables, Types & Control Flow](book/01-foundations/1.1-variables-types-control-flow/)
- [1.2 Functions as First-Class Citizens](book/01-foundations/1.2-functions-first-class/)

### Part 2 — Data & Collections
- [2.1 Lists/Arrays, Dicts/Objects, Sets](book/02-data-and-collections/2.1-lists-dicts-sets/)
- [2.2 Comprehensions vs map/filter/reduce](book/02-data-and-collections/2.2-comprehensions-vs-map-filter-reduce/)

### Part 3 — Functional Programming
- [3.1 Pure Functions & Immutability](book/03-functional-programming/3.1-pure-functions-immutability/)
- [3.2 Closures & Higher-Order Functions](book/03-functional-programming/3.2-closures-higher-order-functions/)
- [3.3 Composition, Currying & Partial Application](book/03-functional-programming/3.3-composition-currying/)
- [3.4 functools/itertools vs Array Methods](book/03-functional-programming/3.4-functools-itertools-vs-array-methods/)

### Part 4 — Object-Oriented Programming
- [4.1 Classes & Constructors](book/04-object-oriented-programming/4.1-classes-constructors/)
- [4.2 Encapsulation: @property vs Getters/Setters](book/04-object-oriented-programming/4.2-encapsulation/)
- [4.3 Inheritance: MRO vs Prototype Chain](book/04-object-oriented-programming/4.3-inheritance/)
- [4.4 Dunder Methods vs Operator Behavior](book/04-object-oriented-programming/4.4-dunder-methods/)

### Part 5 — Paradigm Synthesis
- [5.1 When to Reach for OOP vs FP](book/05-paradigm-synthesis/5.1-oop-vs-fp-when/)
- [5.2 Mixing Both in Real Code](book/05-paradigm-synthesis/5.2-mixing-both/)
- [5.3 Case Study: Refactoring Between Paradigms](book/05-paradigm-synthesis/5.3-refactor-case-study/)

### Part 6 — Advanced & Idiomatic Patterns
- [6.1 Error Handling: Exceptions vs Error-as-Value](book/06-advanced-patterns/6.1-error-handling/)
- [6.2 Async: async/await vs Promises](book/06-advanced-patterns/6.2-async/)
- [6.3 Decorators vs Higher-Order Functions](book/06-advanced-patterns/6.3-decorators/)

### Part 7 — Applied Projects (optional capstones)
- [Bangla News Aggregator & Summarizer](book/07-applied-projects/news-aggregator/)

## Getting started

```bash
git clone https://github.com/<your-username>/py-js-rosetta.git
cd py-js-rosetta/book/01-foundations/1.1-variables-types-control-flow
```

Every subsection works the same way — `cd` in, run both examples, read the
README.

## Status

🚧 **Work in progress.** 1.1 and 1.2 are fully written; the rest are
scaffolded stubs. See [Issues](../../issues) for progress tracking.

## Contributing

Corrections, clarifications, and new subsections/exercises are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE) — free to use, fork, and adapt.
