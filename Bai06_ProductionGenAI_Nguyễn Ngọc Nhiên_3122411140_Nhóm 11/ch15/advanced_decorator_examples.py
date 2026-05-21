"""
CH15 - Advanced Decorator Examples
Showcasing different decorator patterns and their use cases
"""

import logging
import time
from functools import wraps
from typing import Any, Callable

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


# ============================================================================
# PATTERN 1: TIMING DECORATOR
# ============================================================================

def timer(func: Callable) -> Callable:
    """Measure and log function execution time."""
    @wraps(func)
    def wrapper(*args, **kwargs) -> Any:
        start = time.time()
        result = func(*args, **kwargs)
        elapsed = time.time() - start
        logger.info(f"{func.__name__} took {elapsed:.4f} seconds")
        return result
    return wrapper


# ============================================================================
# PATTERN 2: RETRY DECORATOR (With exponential backoff)
# ============================================================================

def retry(max_attempts: int = 3, backoff: float = 1.0):
    """Retry decorator with exponential backoff."""
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            attempt = 0
            wait = backoff
            
            while attempt < max_attempts:
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    attempt += 1
                    if attempt >= max_attempts:
                        logger.error(f"{func.__name__} failed after {max_attempts} attempts")
                        raise
                    logger.warning(f"{func.__name__} failed, retrying in {wait}s... (attempt {attempt})")
                    time.sleep(wait)
                    wait *= backoff
        return wrapper
    return decorator


# ============================================================================
# PATTERN 3: VALIDATION DECORATOR
# ============================================================================

def validate_positive(*arg_names):
    """Validate that specified arguments are positive."""
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            for name in arg_names:
                if name in kwargs and kwargs[name] <= 0:
                    raise ValueError(f"Argument '{name}' must be positive, got {kwargs[name]}")
            return func(*args, **kwargs)
        return wrapper
    return decorator


# ============================================================================
# PATTERN 4: CACHE/MEMOIZATION DECORATOR
# ============================================================================

def memoize(func: Callable) -> Callable:
    """Cache function results based on arguments."""
    cache = {}
    
    @wraps(func)
    def wrapper(*args, **kwargs) -> Any:
        # Create cache key from args and kwargs
        cache_key = (args, tuple(sorted(kwargs.items())))
        
        if cache_key in cache:
            logger.info(f"{func.__name__} (cached) {args}")
            return cache[cache_key]
        
        result = func(*args, **kwargs)
        cache[cache_key] = result
        logger.info(f"{func.__name__} computed result: {result}")
        return result
    
    return wrapper


# ============================================================================
# PATTERN 5: RATE LIMITER DECORATOR
# ============================================================================

def rate_limit(calls_per_second: float = 1.0):
    """Limit function calls to specified rate."""
    min_interval = 1.0 / calls_per_second
    last_called = [0.0]  # Use list to modify in nested function
    
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            elapsed = time.time() - last_called[0]
            if elapsed < min_interval:
                sleep_time = min_interval - elapsed
                logger.info(f"Rate limit: sleeping {sleep_time:.4f}s")
                time.sleep(sleep_time)
            
            last_called[0] = time.time()
            return func(*args, **kwargs)
        return wrapper
    return decorator


# ============================================================================
# PATTERN 6: TYPE CHECKING DECORATOR
# ============================================================================

def enforce_types(**type_checks):
    """Enforce type checks on function arguments."""
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            for arg_name, expected_type in type_checks.items():
                if arg_name in kwargs:
                    value = kwargs[arg_name]
                    if not isinstance(value, expected_type):
                        raise TypeError(
                            f"Argument '{arg_name}' must be {expected_type.__name__}, "
                            f"got {type(value).__name__}"
                        )
            return func(*args, **kwargs)
        return wrapper
    return decorator


# ============================================================================
# USAGE EXAMPLES
# ============================================================================

@timer
def fibonacci(n: int) -> int:
    """Calculate fibonacci number."""
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)


@memoize
@timer
def fibonacci_memoized(n: int) -> int:
    """Calculate fibonacci with memoization."""
    if n <= 1:
        return n
    return fibonacci_memoized(n - 1) + fibonacci_memoized(n - 2)


@rate_limit(calls_per_second=2.0)
def api_call(endpoint: str) -> str:
    """Simulate API call with rate limiting."""
    logger.info(f"Calling API: {endpoint}")
    return f"Response from {endpoint}"


@retry(max_attempts=3, backoff=0.5)
def unstable_operation(attempt_num: int = 0) -> str:
    """Operation that fails sometimes."""
    attempt_num += 1
    if attempt_num < 2:
        raise ConnectionError("Network error")
    return "Success!"


@enforce_types(n=int)
def calculate_factorial(n: int = 5) -> int:
    """Calculate factorial with validation."""
    if n <= 0:
        raise ValueError(f"n must be positive, got {n}")
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result


# ============================================================================
# TEST FUNCTIONS
# ============================================================================

if __name__ == "__main__":
    print("\n" + "="*60)
    print("PATTERN 1: TIMING DECORATOR")
    print("="*60)
    
    logger.info("Calculating fibonacci(10)...")
    result = fibonacci(10)
    print(f"Result: {result}\n")
    
    
    print("="*60)
    print("PATTERN 2: MEMOIZATION (Fibonacci with caching)")
    print("="*60)
    
    logger.info("Calculating fibonacci_memoized(20)...")
    result = fibonacci_memoized(20)
    print(f"Result: {result}")
    
    logger.info("Calling fibonacci_memoized(20) again (should use cache)...")
    result = fibonacci_memoized(20)
    print(f"Result: {result}\n")
    
    
    print("="*60)
    print("PATTERN 3: RATE LIMITING")
    print("="*60)
    
    logger.info("Making 3 API calls with rate limit (2 calls/sec)...")
    for i in range(3):
        api_call(f"/endpoint/{i}")
    print()
    
    
    print("="*60)
    print("PATTERN 4: RETRY WITH BACKOFF")
    print("="*60)
    
    try:
        logger.info("Calling unstable_operation...")
        result = unstable_operation()
        print(f"Result: {result}\n")
    except Exception as e:
        print(f"Error: {e}\n")
    
    
    print("="*60)
    print("PATTERN 5: VALIDATION")
    print("="*60)
    
    try:
        logger.info("Calculating factorial(5)...")
        result = calculate_factorial(n=5)
        print(f"Result: {result}\n")
    except Exception as e:
        print(f"Error: {e}\n")
    
    try:
        logger.info("Attempting with invalid type...")
        result = calculate_factorial(n="5")
    except TypeError as e:
        print(f"   Caught type error: {e}\n")
    
    try:
        logger.info("Attempting with negative value...")
        result = calculate_factorial(n=-5)
    except ValueError as e:
        print(f"   Caught validation error: {e}\n")
    
    
    print("="*60)
    print("SUMMARY")
    print("="*60)
    print("""
Decorator Patterns:
1. Timer - Measure execution time
2. Memoize - Cache results
3. Rate Limiter - Control call frequency
4. Retry - Handle failures gracefully
5. Validation - Check arguments
6. Type Checking - Enforce types

Key Principles:
- Always use @wraps from functools
- Include type hints: Callable, Any
- Add logging for debugging
- Stack decorators carefully
- Test with both success and error cases
    """)
