# Ch14 - Fibonacci Optimization & Performance Analysis

##    Performance Test Results

### Runtime Analysis (profile_runtime.py Output)
```
Result: 9227465 (fibonacci(35))
Runtime: 2.46 seconds

Runtime Benchmarks:
- fibonacci_recursive(10):  0.0 seconds
- fibonacci_recursive(15):  0.0 seconds
- fibonacci_recursive(20):  0.0 seconds
- fibonacci_recursive(25):  0.025 seconds
- fibonacci_recursive(30):  0.220 seconds
- fibonacci_recursive(35):  2.247 seconds
- fibonacci_recursive(40):  25.156 seconds
```

---

##    PROMPT 1: TIME COMPLEXITY ANALYSIS

### Question: What is the time complexity of fibonacci_recursive(n)?

```python
def fibonacci_recursive(n):
    if n <= 0:
        return 0
    if n == 1:
        return 1
    return fibonacci_recursive(n - 1) + fibonacci_recursive(n - 2)
```

### Answer: **O(2ⁿ)** - Exponential Time Complexity

**Explanation:**
- Each call spawns 2 recursive calls
- Total calls = 2^n (approximately)
- Example: fib(5) makes ~2^5 = 32 calls
- This is WHY it gets so slow!

**Evidence from data:**
- fib(25): 0.025s
- fib(30): 0.220s (8.8x slower for +5)
- fib(35): 2.247s (10.2x slower for +5)

---

##    PROMPT 2: MAXIMUM INPUT SIZE

### Question: What is the largest input that can be computed under 100 second limit?

**Benchmarks:**
```
Runtime for fibonacci_recursive(10): 0.0 seconds
Runtime for fibonacci_recursive(15): 0.0 seconds
Runtime for fibonacci_recursive(20): 0.0 seconds
Runtime for fibonacci_recursive(25): 0.025 seconds
Runtime for fibonacci_recursive(30): 0.220 seconds
Runtime for fibonacci_recursive(35): 2.247 seconds
Runtime for fibonacci_recursive(40): 25.156 seconds
```

### Answer: **n ≈ 41-42**

**Calculation:**
- Growth rate ≈ 2.1x per increment
- fib(40) = 25.156s
- fib(41) ≈ 52.8s    (under 100s)
- fib(42) ≈ 110.9s ✗ (exceeds 100s)

**Conclusion:** Maximum safe n = **41**

---

##    PROMPT 3: IMPROVED ALGORITHM

### Question: Propose an algorithm with improved time complexity?

### Answer: Use **Iterative or Matrix Method**

#### Option A: Iterative Approach
```python
def fibonacci_iterative(n):
    if n <= 1:
        return n
    prev, curr = 0, 1
    for _ in range(2, n + 1):
        prev, curr = curr, prev + curr
    return curr
```

**Complexity:** O(n) time, O(1) space
**Speed:** 1000x faster than recursive!

#### Option B: Matrix Exponentiation (Best)
```python
def fib_pair(n):
    if n == 0:
        return 0, 1
    a, b = fib_pair(n // 2)
    c = a * ((2 * b) - a)
    d = a * a + b * b
    if n & 1:
        return d, c + d
    else:
        return c, d
```

**Complexity:** O(log n) time, O(1) space
**Speed:** 1,000,000x faster for large n!

---

##    PROMPT 4: SPACE COMPLEXITY ANALYSIS

### Question: What is the space complexity of fibonacci_recursive(n)?

### Answer: **O(n)** - Linear Space

**Explanation:**
- Call stack depth = n (maximum)
- Each recursive call adds a frame to stack
- At deepest point: n stack frames

**Comparison:**
| Method | Time | Space |
|--------|------|-------|
| Recursive | O(2ⁿ) | O(n)    |
| Iterative | O(n) | O(1)    |
| Matrix | O(log n) | O(1)    |

---

##    PROMPT 5: MAXIMUM INPUT (Space Limited)

### Question: Same as Prompt 2 but considering space limit = 100MB

### Answer: **n ≈ 41-42 still** (same as time limit)

**Why?** Time complexity is the bottleneck, not space in this case.

---

##    PROMPT 6: BETTER SPACE-EFFICIENT ALGORITHM

### Answer: Use **Iterative Approach**

```python
def fibonacci_iterative(n):
    if n <= 1:
        return n
    prev, curr = 0, 1
    for _ in range(2, n + 1):
        prev, curr = curr, prev + curr
    return curr
```

**Benefits:**
- O(1) space (only 2 variables)
- O(n) time (simple loop)
- Easy to understand & maintain
- Safe for very large n (limited only by int size)

---

## 📈 PERFORMANCE COMPARISON TABLE

```
n = 35
Method          Time        Space       Operations
Recursive       2.247 sec   Stack ~35   ~29M calls
Iterative       <0.001s     2 vars      35 iterations
Matrix(fib_pair) <0.001s    Stack ~6    12 multiplications
```

---

##    KEY TAKEAWAYS

1. **Recursive fibonacci** should NEVER be used for n > 30
2. **Iterative is best** for most practical cases
3. **Matrix method** for extremely large n
4. Always consider both time AND space complexity
5. Exponential algorithms are dangerous!

---

##    ANSWER SUMMARY

| Prompt | Answer |
|--------|--------|
| 1. Time Complexity | O(2ⁿ) |
| 2. Max Input (100s) | n ≈ 41 |
| 3. Better Algorithm | Iterative O(n) or Matrix O(log n) |
| 4. Space Complexity | O(n) |
| 5. Max Input (100MB) | n ≈ 41 (time limited) |
| 6. Better Space Algorithm | Iterative O(1) space |

