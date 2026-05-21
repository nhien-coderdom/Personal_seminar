import numpy as np

def get_euclidean_dist(a, b):
    """
    Calculate squared Euclidean distance between two vectors.

    Args:
        a (np.ndarray): First vector
        b (np.ndarray): Second vector

    Returns:
        float: Squared Euclidean distance
    """
    return np.sum((a - b) ** 2)


a = np.array([1, 2, 3])
b = np.array([4, 5, 6])

print("Distance:", get_euclidean_dist(a, b))