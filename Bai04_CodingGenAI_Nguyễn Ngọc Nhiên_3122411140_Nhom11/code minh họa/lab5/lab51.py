import inspect
from openai import OpenAI

SURROUND = "You are an expert Python developer."
SINGLE_TASK = """
Generate a Python docstring using Google style format.
Explain purpose, parameters, and return value.
"""

class Singleton(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]


def get_user_prompt(func: callable) -> str:
    code = inspect.getsource(func)

    prompt = f"""
{SURROUND}

Task: {SINGLE_TASK}

Function code:

{code}

Return only the docstring.
"""
    return prompt


if __name__ == "__main__":

    client = OpenAI()

    user_prompt = get_user_prompt(Singleton)

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.2
    )

    print("Generated Docstring:\n")
    print(completion.choices[0].message.content)