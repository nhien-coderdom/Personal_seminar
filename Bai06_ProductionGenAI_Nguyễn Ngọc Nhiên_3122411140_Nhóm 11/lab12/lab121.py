import numpy as np

def get_manhattan_dist(a, b):
    """Calculate Manhattan distance between two vectors."""
    return np.sum(np.abs(a - b))


def get_euclidean_dist(a, b):
    """Calculate squared Euclidean distance between two vectors."""
    return np.sum((a - b) ** 2)


# Test dữ liệu
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

print("Array a:", a)
print("Array b:", b)
print("Manhattan Distance:", get_manhattan_dist(a, b))
print("Euclidean Distance:", get_euclidean_dist(a, b))