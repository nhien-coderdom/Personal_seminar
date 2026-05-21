import numpy as np

def get_euclidean_dist(a, b):
    """Return squared Euclidean distance"""
    return np.sqrt(np.sum((a - b) ** 2))
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

print("Distance:", get_euclidean_dist(a, b))