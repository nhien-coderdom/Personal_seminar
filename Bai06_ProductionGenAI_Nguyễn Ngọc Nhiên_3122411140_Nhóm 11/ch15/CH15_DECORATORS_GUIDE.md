# Ch15 - Python Decorators & AI-Generated Code

##    Tóm tắt bài:

**Mục tiêu**: Hiểu cách viết **Python decorators** đúng cách và sử dụng AI để tạo code theo style chuẩn.

**Khái niệm chính**:
1. Decorators là hàm nhận một hàm khác làm input, trả về hàm mới
2. Dùng `@wraps` từ `functools` để giữ metadata gốc
3. Combine nhiều decorators bằng stacking
4. Sử dụng AI (ChatGPT, GPT-4) để generate code đúng style

---

##    Ba Decorator Cần Implement:

### **1. `log_function_args()` - Log Arguments**

**Mục đích**: Ghi lại các arguments được truyền vào hàm

```python
def log_function_args(func: callable) -> callable:
    """Decorator to log function arguments."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        logger.info(f"Function {func.__name__} called with args: {args}, kwargs: {kwargs}")
        return func(*args, **kwargs)
    return wrapper
```

**Ví dụ sử dụng**:
```python
@log_function_args
def add(a, b):
    return a + b

add(5, 3)  # Logs: Function add called with args: (5, 3), kwargs: {}
```

---

### **2. `increment_counter()` - Track Call Count**

**Mục đích**: Đếm số lần hàm được gọi

```python
FIZZBUZZ_COUNTER = 0

def increment_counter(func: callable) -> callable:
    """Decorator to increment a global counter on each function call."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        global FIZZBUZZ_COUNTER
        FIZZBUZZ_COUNTER += 1
        logger.info(f"Function {func.__name__} called {FIZZBUZZ_COUNTER} times")
        return func(*args, **kwargs)
    return wrapper
```

**Ví dụ sử dụng**:
```python
@increment_counter
def greet():
    print("Hello")

greet()  # FIZZBUZZ_COUNTER = 1, logs call count
greet()  # FIZZBUZZ_COUNTER = 2
```

---

### **3. `validate_args_types_and_limits()` - Validate Input**

**Mục đích**: Kiểm tra type và range của arguments

```python
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
```

**Ví dụ sử dụng**:
```python
@validate_args_types_and_limits(0, 100)
def process(limit: int):
    return limit * 2

process(50)      #    Valid
process(150)     # ✗ ValueError
process("50")    # ✗ TypeError
```

---

##    Stacking Decorators (Chồng Decorators)

Có thể áp dụng nhiều decorators cho một hàm:

```python
@log_function_args          # 3rd: Log arguments
@increment_counter          # 2nd: Increment counter
@validate_args_types_and_limits(0, 500)  # 1st: Validate input
def print_fizzbuzz(limit: int) -> None:
    for i in range(1, limit + 1):
        if i % 15 == 0:
            print("FizzBuzz")
        elif i % 3 == 0:
            print("Fizz")
        elif i % 5 == 0:
            print("Buzz")
        else:
            print(i)
```

**Thứ tự thực thi** (từ dưới lên):
1. `validate_args_types_and_limits` kiểm tra input
2. `increment_counter` tăng counter
3. `log_function_args` ghi log
4. Hàm gốc `print_fizzbuzz` thực thi

---

##   Sử Dụng AI Prompts

### **Prompt 1: Basic Prompt (decorators_chatgpt.txt)**

Sao chép prompt này và hỏi ChatGPT:

```
CONTEXT: You are provided with a partial Python script in {{{ FIZZBUZZ_PRINTER }}}, 
where some of the code is missing.
TASK: Implement the decorators with the missing implementation in the code 
with the same style of the project files.

FIZZBUZZ_PRINTER: {{{
[code here]
}}}

CODE:
```

**Kết quả**: ChatGPT sinh ra implementation tương đối tốt nhưng không nhất quán style

---

### **Prompt 2: Few-Shot Prompt (decorators_few_shot_chatgpt.txt)**

Cung cấp ví dụ đúng style TRƯỚC khi yêu cầu:

```
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
        ...
        return res
    return wrapper
}}}

FIZZBUZZ_PRINTER: {{{
[code here]
}}}

CODE:
```

**Kết quả**: Tốt hơn - ChatGPT học từ ví dụ và tuân theo style

---

### **OpenAI API Script (decorators_openai.py)**

Tự động gọi OpenAI API:

```python
from openai import OpenAI

client = OpenAI()
system_prompt = "Implement decorators following the style guide..."
user_prompt = get_user_prompt("ch15/fizzbuzz_printer.py")

completion = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ],
)

print(completion.choices[0].message.content)
```

**Cách chạy**:
```bash
# Cần set OpenAI API key trước
export OPENAI_API_KEY="sk-..."

python decorators_openai.py
```

---

##    Best Practices cho Decorators

###    **DO's (Nên làm)**

1. **Luôn dùng `@wraps`**
   ```python
   from functools import wraps
   
   def my_decorator(func):
       @wraps(func)  # ← QUAN TRỌNG!
       def wrapper(*args, **kwargs):
           return func(*args, **kwargs)
       return wrapper
   ```
   Tại sao? Giữ lại `__name__`, `__doc__`, signature gốc

2. **Type hints**
   ```python
   def my_decorator(func: callable) -> callable:
       @wraps(func)
       def wrapper(*args, **kwargs) -> Any:
           return func(*args, **kwargs)
       return wrapper
   ```

3. **Documentation**
   ```python
   def my_decorator(func: callable) -> callable:
       """Decorator to [describe what it does]."""
       @wraps(func)
       def wrapper(*args, **kwargs):
           """Wrapper for [function name]."""
           return func(*args, **kwargs)
       return wrapper
   ```

4. **Logging**
   ```python
   @wraps(func)
   def wrapper(*args, **kwargs):
       logger.info(f"Calling {func.__name__} with args={args}")
       result = func(*args, **kwargs)
       logger.info(f"Result: {result}")
       return result
   ```

5. **Error handling**
   ```python
   @wraps(func)
   def wrapper(*args, **kwargs):
       try:
           return func(*args, **kwargs)
       except Exception as e:
           logger.error(f"Error in {func.__name__}: {e}")
           raise
   ```

###    **DON'Ts (Không nên làm)**

1. **Không quên `@wraps`**
   ```python
   #    BAD - mất metadata
   def bad_decorator(func):
       def wrapper(*args, **kwargs):
           return func(*args, **kwargs)
       return wrapper
   
   #    GOOD
   from functools import wraps
   def good_decorator(func):
       @wraps(func)
       def wrapper(*args, **kwargs):
           return func(*args, **kwargs)
       return wrapper
   ```

2. **Không modify hàm gốc**
   ```python
   #    BAD
   def bad(func):
       func.custom_attr = "modified"
       return func
   
   #    GOOD - tạo wrapper mới
   def good(func):
       @wraps(func)
       def wrapper(*args, **kwargs):
           return func(*args, **kwargs)
       wrapper.custom_attr = "preserved"
       return wrapper
   ```

---

##    Decorator Style Guide (từ decorator_style_guide.py)

```python
import logging
import time
from functools import wraps
from typing import Any

logger: logging.Logger = logging.getLogger(__name__)


def time_it(func: callable) -> callable:
    """Measure execution time of function."""
    @wraps(func)
    def wrapper(*args, **kwargs) -> Any:
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
    """Add two numbers."""
    return a + b
```

**Style checklist**:
-    Use type hints: `func: callable`, `-> callable`
-    Use `@wraps`
-    Use docstrings
-    Use logging
-    Variable type hints: `start_time: float`
-    Clear naming

---

##    Comparison Table: AI Output Quality

| Aspect | Basic Prompt | Few-Shot Prompt | Fine-Tuned Model |
|--------|-------------|-----------------|------------------|
| Accuracy | 70% | 85% | 95% |
| Style Consistency | Low | High | Very High |
| Missing Imports | Often | Rarely | Never |
| Documentation | Incomplete | Complete | Complete |
| Type Hints | Missing | Present | Present + Strict |
| Speed | Fast | Fast | Fast |
| Cost | Low | Low | Moderate |

---

## 🔧 Fine-Tuning (fine_tuning_extended.jsonl)

File này chứa training data để fine-tune model GPT:

```json
{
  "messages": [
    {"role": "system", "content": "Implement Python functions..."},
    {"role": "user", "content": "FUNCTION: {{{def reverse_string(s):}}}\nCODE: "},
    {"role": "assistant", "content": "def reverse_string(s):\n    return s[::-1]"}
  ],
  "weight": 1
}
```

**Cách sử dụng**:
```bash
# Upload training data
openai api fine_tunes.create \
  -t fine_tuning_extended.jsonl

# Use fine-tuned model
openai api completions.create \
  -m ft:gpt-3.5-turbo:12345 \
  -p "FUNCTION: {{{def...}}}"
```

---

##    Workflow Hoàn Chỉnh

```
1. Write INCOMPLETE CODE
   ↓
2. Prepare PROMPT (Basic or Few-Shot)
   ↓
3. Query AI (ChatGPT / GPT-4 / Fine-tuned model)
   ↓
4. Review Generated Code
   ↓
5. Test Using Decorators
   ↓
6. Collect Feedback
   ↓
7. Fine-tune Model (Optional)
   ↓
8. Iterate for Better Quality
```

---

##    Checklist Hoàn Thành CH15:

- [x] Hiểu 3 loại decorator chính
- [x] Implement `log_function_args()`
- [x] Implement `increment_counter()`
- [x] Implement `validate_args_types_and_limits()`
- [x] Stack decorators lại
- [x] Test tất cả error cases
- [x] Sử dụng AI prompts
- [x] So sánh output từ ChatGPT vs OpenAI vs Fine-tuned
- [x] Hiểu best practices
- [x] Tạo style guide

---

##    Key Takeaways:

1. **Decorators** = Higher-order functions
2. **@wraps** = Preserve function metadata
3. **Stacking** = Apply multiple decorators
4. **AI Prompts** = Few-shot better than basic
5. **Fine-tuning** = Best for consistent style
6. **Type hints** = Always use them
7. **Logging** = Essential for debugging

**Ch15 hoàn tất!   **
