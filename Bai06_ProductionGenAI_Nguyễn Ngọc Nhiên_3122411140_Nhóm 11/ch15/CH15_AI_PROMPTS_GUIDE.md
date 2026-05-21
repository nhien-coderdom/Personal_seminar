# CH15 - Sử Dụng AI Prompts (ChatGPT/OpenAI)

##   3 Cách Prompt AI để Generate Decorators:

---

## **APPROACH 1: BASIC PROMPT**   

Dùng file: `decorators_chatgpt.txt`

### Prompt to Copy & Paste into ChatGPT:

```
CONTEXT: You are provided with a partial Python script in {{{ FIZZBUZZ_PRINTER }}}, 
where some of the code is missing.

TASK: Implement the decorators with the missing implementation in the code 
with the same style of the project files.

FIZZBUZZ_PRINTER: {{{
import logging

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
}}}

CODE: 
```

### Expected Output from ChatGPT:
   Will generate decorators
   Missing imports sometimes
   Style inconsistent
 Need manual review

### Quality: **70% - Acceptable but needs fixes**

---

## **APPROACH 2: FEW-SHOT PROMPT**        **RECOMMENDED**

Dùng file: `decorators_few_shot_chatgpt.txt`

### Prompt to Copy & Paste:

```
CONTEXT: You are provided with a partial Python script enclosed with {{{ FIZZBUZZ_PRINTER }}} 
where some of the code is missing, and examples of a good implementation 
enclosed with {{{ EXAMPLES }}}

TASK: Implement the decorators with the missing implementation in the code 
while following the style guide.

EXAMPLES:

INCOMPLETE_CODE: {{{
import logging
import time

logger: logging.Logger = logging.getLogger(__name__)

@time_it
def my_func(a: int, b: int) -> int:
    return a + b
}}}

COMPLETE_CODE: {{{
import logging
import time
from functools import wraps
from typing import Any

logger: logging.Logger = logging.getLogger(__name__)

def time_it(func: callable) -> callable:
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time: float = time.time()
        res: Any = func(*args, **kwargs)
        end_time: float = time.time()
        logger.info(
            "Function called.",
            extra={
                "function": func.__name__,
                "timing": f"{end_time - start_time} seconds"
            }
        )
        return res
    return wrapper

@time_it
def my_func(a: int, b: int) -> int:
    return a + b
}}}

FIZZBUZZ_PRINTER: {{{
import logging

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
}}}

CODE:
```

### Expected Output from ChatGPT:
   Learns from examples
   Includes @wraps
   Includes type hints
   Proper imports
   Style consistent

### Quality: **90% - Excellent!**

---

## **APPROACH 3: OPENAI API (Programmatic)**         

### Setup OpenAI API:

1. **Install OpenAI package**:
```bash
pip install openai
```

2. **Set API Key**:
```bash
# Windows PowerShell
$env:OPENAI_API_KEY = "sk-your-api-key-here"

# Or add to .env
echo "OPENAI_API_KEY=sk-your-api-key-here" > .env
```

3. **Get API Key** from https://platform.openai.com/account/api-keys

### Script Usage:

```python
from openai import OpenAI

client = OpenAI()  # Uses OPENAI_API_KEY from environment

# System prompt
SYSTEM_PROMPT = """You are a Python expert. 
Implement decorators with proper type hints, @wraps, and logging."""

# User prompt
USER_PROMPT = """Implement missing decorators:
- log_function_args: logs function arguments
- increment_counter: increments FIZZBUZZ_COUNTER
- validate_args_types_and_limits: validates type and range"""

# Call API
response = client.chat.completions.create(
    model="gpt-4o-mini",  # or "gpt-4"
    messages=[
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": USER_PROMPT},
    ],
    temperature=0.2,  # Lower = more consistent
)

print(response.choices[0].message.content)
```

### Run Script:
```bash
cd ch15
python decorators_openai.py
```

### Quality: **95% - Very reliable with GPT-4o-mini**

---

##    Quick Comparison:

```
Method              Tool        Quality  Cost    Speed
─────────────────────────────────────────────────────
1. Basic Prompt     ChatGPT     70%      Free    Instant
2. Few-Shot Prompt  ChatGPT     90%      Free    Instant
3. OpenAI API       GPT-4o      95%      $0.01   1-2s
4. Fine-Tuned Model GPT-3.5 FT  98%      $$$     1-2s
```

---

##    Tips for Better Results:

###    DO:

1. **Provide examples** (few-shot)
   - AI learns from examples
   - Consistency improves significantly

2. **Be specific** about requirements
   ```
      "Use @wraps, type hints, and logging"
   ✗ "Implement decorators"
   ```

3. **Set temperature low** for consistency
   ```python
   temperature=0.2  #    Consistent
   temperature=0.9  # ✗ Random
   ```

4. **Use descriptive names**
   ```
      log_function_args_and_return_value()
   ✗ log_func()
   ```

###    DON'T:

1. **Don't provide incomplete examples**
2. **Don't mix styles** in examples
3. **Don't expect perfect output** (review always!)

---

##    Output Comparison:

### Basic Prompt Output:
```python
def log_function_args(func):
    def wrapper(*args, **kwargs):
        logger.info(f"Called {func.__name__}")
        return func(*args, **kwargs)
    return wrapper
```
 Missing:
- `@wraps`
- Type hints
- Proper logging structure

### Few-Shot Prompt Output:
```python
from functools import wraps
from typing import Any

def log_function_args(func: callable) -> callable:
    @wraps(func)
    def wrapper(*args, **kwargs) -> Any:
        logger.info(
            f"Function {func.__name__} called with args: {args}, kwargs: {kwargs}"
        )
        return func(*args, **kwargs)
    return wrapper
```
   Includes:
- `@wraps`  
- Type hints
- Proper logging

---

##    Iterative Improvement Process:

```
1. Generate with Few-Shot Prompt
   ↓
2. Review & Test Code
   ↓
3. If issues found:
   - Clarify prompt
   - Add more examples
   - Specify constraints
   ↓
4. Generate again
   ↓
5. Fine-tune model (if repeated)
   ↓
6. Deploy when satisfied
```

---

##    Summary:

| Prompt Type | Best For | Effort | Quality |
|-------------|----------|--------|---------|
| Basic | Quick exploration | Low | 70% |
| Few-Shot | Production code | Medium | 90% |
| API + Few-Shot | Automation | High | 95%+ |

**Recommendation for CH15: Use Few-Shot Prompt with ChatGPT!   **
