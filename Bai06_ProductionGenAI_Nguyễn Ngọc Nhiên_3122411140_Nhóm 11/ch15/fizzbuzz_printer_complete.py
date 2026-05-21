import logging
import time
from functools import wraps
from typing import Any

logger: logging.Logger = logging.getLogger(__name__)


def log_function_args(func: callable) -> callable:
    """Decorator to log function arguments and return value."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        logger.info(
            f"Function {func.__name__} called with args: {args}, kwargs: {kwargs}"
        )
        return func(*args, **kwargs)
    return wrapper


def increment_counter(func: callable) -> callable:
    """Decorator to increment a global counter on each function call."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        global FIZZBUZZ_COUNTER
        FIZZBUZZ_COUNTER += 1
        logger.info(f"Function {func.__name__} called {FIZZBUZZ_COUNTER} times")
        return func(*args, **kwargs)
    return wrapper


def validate_args_types_and_limits(min_limit: int, max_limit: int):
    """Decorator factory to validate argument types and limits."""
    def decorator(func: callable) -> callable:
        @wraps(func)
        def wrapper(limit: int):
            if not isinstance(limit, int):
                raise TypeError(f"Argument 'limit' must be of type int, got {type(limit)}")
            if limit < min_limit or limit > max_limit:
                raise ValueError(f"Argument 'limit' must be between {min_limit} and {max_limit}, got {limit}")
            return func(limit)
        return wrapper
    return decorator


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
    filename="fizzbuzz.log",
    datefmt="%Y-%m-%d %H:%M:%S"
)

logger = logging.getLogger(__name__)

FIZZBUZZ_COUNTER = 0


@log_function_args
@increment_counter
@validate_args_types_and_limits(0, 500)
def print_fizzbuzz(limit: int) -> None:
    for i in range(1, limit + 1):
        if i % 3 == 0 and i % 5 == 0:
            print("FizzBuzz")
        elif i % 3 == 0:
            print("Fizz")
        elif i % 5 == 0:
            print("Buzz")
        else:
            print(i)


if __name__ == "__main__":
    print("\n=== Testing FizzBuzz with Decorators ===\n")
    
    # Valid calls
    print("Test 1: print_fizzbuzz(15)")
    print_fizzbuzz(15)
    
    print("\n" + "="*40 + "\n")
    
    # Test error handling with invalid type
    print("Test 2: Invalid type - print_fizzbuzz('15')")
    try:
        print_fizzbuzz('15')
    except TypeError as e:
        print(f"   Caught error: {e}")
    
    print("\n" + "="*40 + "\n")
    
    # Test error handling with out-of-range value
    print("Test 3: Out of range - print_fizzbuzz(600)")
    try:
        print_fizzbuzz(600)
    except ValueError as e:
        print(f"   Caught error: {e}")
    
    print("\n" + "="*40 + "\n")
    print(f"Total function calls: {FIZZBUZZ_COUNTER}")
    print("Check fizzbuzz.log for full execution log")
