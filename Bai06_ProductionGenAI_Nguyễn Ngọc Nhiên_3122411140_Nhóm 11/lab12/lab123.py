import numpy as np

def parse_input(data):
    """Parse input data into numpy arrays."""
    a = np.array(data["a"])
    b = np.array(data["b"])
    return a, b


def get_manhattan_dist(a, b):
    """Calculate Manhattan distance."""
    return np.sum(np.abs(a - b))


def get_euclidean_dist(a, b):
    """Calculate squared Euclidean distance."""
    return np.sum((a - b) ** 2)


data = {"a": [1, 2, 3], "b": [4, 5, 6]}
a, b = parse_input(data)

print("Manhattan:", get_manhattan_dist(a, b))
print("Euclidean:", get_euclidean_dist(a, b))