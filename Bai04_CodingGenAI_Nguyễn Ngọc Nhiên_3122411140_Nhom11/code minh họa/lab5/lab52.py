import inspect
from dataclasses import dataclass
from unittest import TestCase, main
from openai import OpenAI


SURROUND = "You are a senior Python developer."
TASK = "Explain whether this code correctly implements the Singleton pattern and analyze the unit tests."


class Singleton(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]


@dataclass
class Environment(metaclass=Singleton):
    name: str = "Production"
    version: int = 1


class TestEnvironmentSingleton(TestCase):

    def test_single_instance(self):
        env1 = Environment()
        env2 = Environment()

        self.assertIs(env1, env2)

    def test_default_values(self):
        env = Environment()

        self.assertEqual(env.name, "Production")
        self.assertEqual(env.version, 1)

    def test_modify_instance(self):
        env1 = Environment()
        env1.name = "Development"

        env2 = Environment()

        self.assertEqual(env2.name, "Development")


def get_user_prompt(code_object):
    code = inspect.getsource(code_object)

    prompt = f"""
{SURROUND}

Task: {TASK}

Code to analyze:

{code}

Explain the Singleton behavior and the purpose of the tests.
"""
    return prompt


if __name__ == "__main__":

    main(exit=False)

    client = OpenAI()

    prompt = get_user_prompt(Environment)

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.2
    )

    print("\nAI Analysis:\n")
    print(completion.choices[0].message.content)