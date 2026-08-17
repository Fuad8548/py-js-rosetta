# 4.1 Classes & Objects

## The Concept
The difference between a class and an object is that a class is the template or the blueprint, and an object is what is created using that template. Also, a class defines what data and behavior the object should have, and an object holds the actual data and uses that behavior. We write a class once, and we can make many objects from it, each with different data.

- **Attributes/ Properties vs Methods**
    - **JavaScript Properties**: Variables declared inside a class `constructor` using `this.variableName` or directly as class fields.
    - **Python Attributes**: Variables bound to a specific instance of a class, typically defined inside the `__init__` constructor using `self.variable_name`. Two kinds of attributes:
        - **Class attributes**: Belong to the class itself and are shared by all instances of that class. 
        - **Instance attributes**: Are unique to each object created from a class, and we usually set them with the `__init__` method. 
Python calls data fields attributes, JS calls them properties.
    - **Methods**: Are functions defined inside a class. With them, any object defined from a class can perfom actions that operate on or modify its own data, can also be accessed with dot notation. 

## Python: Defining a Class & Creating Objects

```python
class Book:
    def __init__(self, title, author):
        self.title = title
        self.author = author

    def summary(self):
        return f"{self.title} by {self.author}"


b1 = Book("Sapiens", "Yuval Noah Harari")
b2 = Book("Atomic Habits", "James Clear")
print(b1.summary())   # Sapiens by Yuval Noah Harari
print(b2.summary())    # Atomic Habits by James Clear
```

**Notes:**
- `__init__` runs automatically when `Book(...)` is called. `self` is Python's explicit reference to "the object being built" — every instance method takes it as the first parameter.
- No `new` keyword — calling `Book(...)` directly creates and returns the instance.
- `b1.summary()` — calling a method uses dot notation, same as accessing an attribute, just with parentheses to actually invoke it.

## Python: Methods & Instance vs Class Attributes

```python
class Employee:
    company = "TechCorp"  # class attribute -- shared by every instance

    def __init__(self, name, monthly_salary):
        self.name = name                      # instance attribute -- unique per object
        self.monthly_salary = monthly_salary

    def annual_salary(self):
        return self.monthly_salary * 12


alice = Employee("Alice", 5000)
bob = Employee("Bob", 6200)

print(alice.annual_salary())   # 60000
print(bob.annual_salary())      # 74400
print(alice.company)          # "TechCorp" -- accessed via the instance
print(Employee.company)       # "TechCorp" -- accessed via the class
```

**Notes:**
- A **method** is just a function defined inside a class that operates on that instance's own data via `self` — `annual_salary()` uses each object's own `monthly_salary`, producing a different result per object.
- `company` is defined directly in the class body, not inside `__init__`, so it belongs to the class itself and every instance shares the exact same value.
- Critically: **`alice.company` works.** Python looks up an attribute on the instance first, and if it's not found there, falls through to the class. Class attributes are readable through *either* the class or any instance — this will NOT be true in JavaScript, see below.

## JavaScript: Classes

```javascript
class Book {
  year = 2011;

  constructor(title, author) {
    this.title = title;
    this.author = author;
  }

  summary() {
    return `${this.title} by ${this.author} in ${this.year}`;
  }
}

const b1 = new Book("Sapiens", "Yuval Noah Harari");
const b2 = new Book("Atomic Habits", "James Clear");
console.log(b1.summary());
console.log(b2.summary());
console.log(Book.year);        // undefined
console.log(b1.year);          // Sapiens -- NOT accessible via the instance!

// Class expression -- anonymous class assigned to a variable, same behavior
const Magazine = class {
  constructor(title, issue) {
    this.title = title;
    this.issue = issue;
  }
  summary() {
    return `${this.title}, Issue #${this.issue}`;
  }
};
const m1 = new Magazine("National Geographic", 214);
console.log(m1.summary()); // National Geographic, Issue #214
```

**Notes:**
- `constructor` is JS's `__init__` equivalent, called automatically by `new`. `this` plays the role of `self`, but is implicit rather than a declared parameter.
- `new` is **mandatory** — `Book(...)` without `new` throws or misbehaves.
- A **class expression** (`const Magazine = class {...}`) behaves identically to a named `class Magazine {...}` declaration — useful when you want to assign a class to a variable conditionally, or pass it around like a value.

[Property Assignments Only: The body of a class only accepts property declarations (propertyName = value;) or method definitions, but we need static keyword - see below: JavaScript Static Properties]

Nearly identical on the surface. `constructor` ↔ `__init__`, `this` ↔ `self` — but note: `self` is not a keyword in Python. It's just a regular parameter name, the first argument every instance method automatically receives (the instance itself). You could legally name it banana and it'd still work — convention, not syntax. `this` in JS is special-cased by the language and behaves differently depending on how a function is called.


## JavaScript: Static Properties (the Class-Attribute Equivalent)

```javascript
class Employee {
  static company = "TechCorp"; // static property -- shared by every instance

  constructor(name, monthlySalary) {
    this.name = name;
    this.monthlySalary = monthlySalary;
  }

  annualSalary() {
    return this.monthlySalary * 12;
  }
}

const alice = new Employee("Alice", 5000);
const bob = new Employee("Bob", 6200);

console.log(alice.annualSalary());   // 60000
console.log(bob.annualSalary());      // 74400
console.log(Employee.company);          // "TechCorp" -- accessed via the class
console.log(alice.company);              // undefined -- NOT accessible via the instance!
```

**Notes:**
- `static company = ...` is JS's version of a Python class attribute — but note the sharp difference: **`alice.company` is `undefined`**. Unlike Python, JS does not fall through from instance to static lookup. You must always write `Employee.company`, never `alice.company`.

**Why We Absolutely Need the static Keyword**
Without static, every variable you declare inside a class gets cloned every single time you type new Book().
We need static for three critical reasons:
    - **Namespace Organization & Shared Configs**: If you have a configuration, you don't want to waste memory copying it onto 10,000 separate book instances.
    - **Factory Methods (Creating objects differently)**: Sometimes you want to create a Book instance from an API response or a JSON string. You cannot use a regular instance method because the object does not exist yet. (see below:)
    
```javascript
class Book {
    constructor(title, author) {
        this.title = title;
        this.author = author;
    }

    // A static factory method
    static fromJSON(jsonString) {
        const data = JSON.parse(jsonString);
        return new Book(data.t, data.a); // Returns a new instance
    }
}

// You call it directly on the class to manufacture an object
const b3 = Book.fromJSON('{"t": "Deep Work", "a": "Cal Newport"}');
```

|                               |              company = "TechCorp" (no static)              |      static company = "TechCorp"       |
| :---------------------------: | :--------------------------------------------------------: | :------------------------------------: |
|        Where it lives         |           Copied onto every instance separately            |        Lives once, on the class        |
| Changing one instance's value |               Doesn't affect other instances               | N/A — there's only one value to change |
|            Memory             | One copy per instance (wasteful if the value never varies) |            One copy, period            |
|       Employee.company        |                         undefined                          |                 Works                  |
|         alice.company         |                           Works                            |               undefined                |

## JavaScript: Static & Factory Methods 

```javascript
class Temperature {
  constructor(celsius) {
    this.celsius = celsius;
  }

  static celsiusToFahrenheit(celsius) {
    return (celsius * 9) / 5 + 32;
  }

  static fromFahrenheit(fahrenheit) {
    const celsius = ((fahrenheit - 32) * 5) / 9;
    return new this(celsius); // factory method -- builds and returns a new instance
  }
}

console.log(Temperature.celsiusToFahrenheit(20)); // 68 -- utility calc, no instance needed
const t = Temperature.fromFahrenheit(98.6);          // factory method -- builds an instance
console.log(Math.round(t.celsius * 10) / 10);          // 37
```

## Python's `@staticmethod` and `@classmethod`:

```python
class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius

    @staticmethod
    def celsius_to_fahrenheit(celsius):
        return celsius * 9 / 5 + 32

    @classmethod
    def from_fahrenheit(cls, fahrenheit):
        celsius = (fahrenheit - 32) * 5 / 9
        return cls(celsius)   # builds and returns a new instance


print(Temperature.celsius_to_fahrenheit(20))   # 68.0 -- utility calc, no instance needed
t = Temperature.from_fahrenheit(98.6)   # factory method -- builds an instance
print(round(t.celsius, 1))        # 37.0
```

**Notes:**
- `@staticmethod` strips away the automatic `self` parameter — the method behaves like a plain function that just happens to live inside the class's namespace, called on the class itself. This matches JS's `static celsiusToFahrenheit`.
- `@classmethod` receives the class itself (`cls`) as its first argument instead of `self`, letting it construct and return a brand-new instance — this matches JS's `static fromFahrenheit` using `new this(...)`.

## Side-by-Side

| Aspect                                        | Python                          | JavaScript                                                           |
| --------------------------------------------- | ------------------------------- | -------------------------------------------------------------------- |
| Constructor                                   | `__init__(self, ...)`           | `constructor(...)`                                                   |
| Instance reference                            | `self` (explicit parameter)     | `this` (implicit)                                                    |
| Class attribute / static property             | Plain assignment in class body  | `static` keyword required                                            |
| Accessible via instance?                      | **Yes** — `alice.company` works | **No** — `alice.company` is `undefined`, must use `Employee.company` |
| Static/utility method                         | `@staticmethod`                 | `static methodName() {}`                                             |
| Factory method (builds + returns an instance) | `@classmethod`, uses `cls(...)` | `static` method, uses `new this(...)`                                |
| Anonymous class                               | Not really idiomatic            | Class expression: `const X = class {...}`                            |
| Creating an instance                          | `Book(...)`                     | `new Book(...)` — required                                           |

## Exercises

1. In Python, set `alice.company = "StartupCo"` and then check
   `Employee.company` again — did it change? Now check `bob.company`. Explain what happened (hint: this creates a new *instance* attribute
   that shadows the class attribute, only for `alice`).
2. In JS, try `alice.company = "StartupCo"` then `console.log(alice.company)` — does this behave the way you'd expect coming from Python? What does `Employee.company` show afterward?
3. Add a `Temperature.from_kelvin` classmethod (Python) and `Temperature.fromKelvin` static method (JS) — `kelvin - 273.15` gives celsius. Test both against a known value (0°C = 273.15K).

---
[← Back to Part 4](../) · [Next → 4.2 Encapsulation](../4.2-encapsulation/)
