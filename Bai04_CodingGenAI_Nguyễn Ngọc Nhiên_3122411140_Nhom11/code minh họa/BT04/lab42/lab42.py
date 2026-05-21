import inspect
from openai import OpenAI

# Context cho AI
SURROUND = "You are a senior Python developer."
SINGLE_TASK = "Suggest improvements for the following Python function."


# tạo prompt cho AI
def get_user_prompt(func: callable, change: str) -> str:
    code = inspect.getsource(func)

    prompt = f"""
{SURROUND}

Task: {SINGLE_TASK}

Requested change: {change}

Function code:

{code}
"""
    return prompt


# function của lab
def get_estimated_user_costs(prompts_data):
    costs = {}

    for entry in prompts_data:
        user = entry["user"]
        prompt = entry["prompt"]

        estimated_tokens = len(prompt) / 4
        cost = estimated_tokens * 0.0001

        if user not in costs:
            costs[user] = cost
        else:
            costs[user] += cost

    return costs


if __name__ == "__main__":

    # OpenAI client sẽ tự đọc OPENAI_API_KEY từ env
    client = OpenAI()

    changes = [
        "Optimize this function",
        "Improve readability",
        "Add error handling"
    ]

    for c in changes:

        user_prompt = get_user_prompt(get_estimated_user_costs, c)

        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.2
        )

        print("================================")
        print("Change request:", c)
        print("AI suggestion:")
        print(completion.choices[0].message.content)