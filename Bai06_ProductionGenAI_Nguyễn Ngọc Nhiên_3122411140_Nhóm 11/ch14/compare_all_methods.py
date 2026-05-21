"""
Ch14 - All Three Fibonacci Methods Comparison
Demonstrates time and space complexity of each approach
"""

import time
from fibonacci import fibonacci_recursive, fibonacci_iterative, fib_pair


def measure_performance(n):
    """Compare all 3 Fibonacci implementations"""
    print(f"\n{'='*60}")
    print(f"Testing with n = {n}")
    print(f"{'='*60}\n")

    # Test Recursive
    print("1. RECURSIVE (O(2^n) time, O(n) space)")
    try:
        start = time.time()
        result_r = fibonacci_recursive(n)
        time_r = time.time() - start
        print(f"   Result: {result_r}")
        print(f"   Time:   {time_r:.6f} seconds   ")
    except RecursionError:
        print("   ✗ RecursionError - n too large!")
        time_r = float('inf')

    # Test Iterative
    print("\n2. ITERATIVE (O(n) time, O(1) space)")
    start = time.time()
    result_i = fibonacci_iterative(n)
    time_i = time.time() - start
    print(f"   Result: {result_i}")
    print(f"   Time:   {time_i:.6f} seconds   ")

    # Test Matrix (fib_pair)
    print("\n3. MATRIX/FIB_PAIR (O(log n) time, O(1) space)")
    start = time.time()
    result_m = fib_pair(n)[0]
    time_m = time.time() - start
    print(f"   Result: {result_m}")
    print(f"   Time:   {time_m:.6f} seconds   ")

    # Speedup calculation
    print(f"\n{'─'*60}")
    if time_r != float('inf'):
        speedup_iter_vs_rec = time_r / time_i if time_i > 0 else 0
        speedup_matrix_vs_rec = time_r / time_m if time_m > 0 else 0
        print(f"Speedup (Iterative vs Recursive): {speedup_iter_vs_rec:.1f}x faster")
        print(f"Speedup (Matrix vs Recursive):    {speedup_matrix_vs_rec:.1f}x faster")
    
    speedup_matrix_vs_iter = time_i / time_m if time_m > 0 else 0
    print(f"Speedup (Matrix vs Iterative):   {speedup_matrix_vs_iter:.1f}x faster")


# Test with different sizes
if __name__ == "__main__":
    print("\n" + "="*60)
    print("CH14 - FIBONACCI PERFORMANCE COMPARISON")
    print("="*60)

    # Small n - all methods work
    measure_performance(20)

    # Medium n - recursive gets slow
    measure_performance(30)

    # Large n - recursive fails, but others work
    measure_performance(35)

    # Very large n - only matrix/iterative work
    print(f"\n{'='*60}")
    print(f"Testing with n = 1000 (extremely large)")
    print(f"{'='*60}\n")

    print("1. RECURSIVE - SKIPPED (would take forever!)")
    print("   O(2^1000) ≈ 10^301 operations - INFEASIBLE ✗\n")

    print("2. ITERATIVE")
    start = time.time()
    result_i = fibonacci_iterative(1000)
    time_i = time.time() - start
    print(f"   Time: {time_i:.6f} seconds   ")
    print(f"   Result has {len(str(result_i))} digits\n")

    print("3. MATRIX")
    start = time.time()
    result_m = fib_pair(1000)[0]
    time_m = time.time() - start
    print(f"   Time: {time_m:.6f} seconds   ")
    print(f"   Result has {len(str(result_m))} digits")

    speedup = time_i / time_m if time_m > 0 else 0
    print(f"\n   Matrix is {speedup:.1f}x faster than Iterative!")

    print("\n" + "="*60)
    print("CONCLUSION:")
    print("="*60)
    print("   Recursive = NEVER use for n > 30")
    print("   Iterative = Use for most cases")
    print("   Matrix = Use for very large n")
    print("="*60 + "\n")
