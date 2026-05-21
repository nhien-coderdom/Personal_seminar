import numpy as np

def get_manhattan_dist(a, b):
    """Calculate Manhattan distance."""
    return np.sum(np.abs(a - b))


def get_euclidean_dist(a, b):
    """Calculate squared Euclidean distance."""
    return np.sum((a - b) ** 2)

a = np.array([1, 2, 3])
b = np.array([4, 5, 6])
print (get_manhattan_dist(a, b)) 
print (get_euclidean_dist(a, b)) 