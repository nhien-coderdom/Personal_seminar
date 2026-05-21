import numpy as np
from flask import Flask, request, jsonify

app = Flask(__name__)

def parse_request_parameters(data):
    a = np.array(data.get("df1"))
    b = np.array(data.get("df2"))
    dist_type = data.get("distance")
    return a, b, dist_type

def get_manhattan_dist(a, b):
    return np.sum(np.abs(a - b))


def get_euclidean_dist(a, b):
    return np.sqrt(np.sum((a - b) ** 2))

@app.route("/distances", methods=["POST"])
def calculate_distance():
    data = request.get_json()
    a, b, dist_type = parse_request_parameters(data)
    dist_func = {
        "L1": get_manhattan_dist,
        "L2": get_euclidean_dist
    }.get(dist_type)

    dist = dist_func(a, b)
    return jsonify({"distance": dist})

if __name__ == "__main__":
    app.run(debug=True)