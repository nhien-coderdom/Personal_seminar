import csv
from pathlib import Path


def generate_sample_users_csv(filename="sample_users.csv"):
    rows = [
        ["ID", "first_name", "last_name", "address", "age", "city"],
        [10001, "An", "Nguyen", "12 Le Loi St.", 20, "Hue"],
        [10002, "Binh", "Tran", "45 Tran Hung Dao St.", 21, "Da Nang"],
        [10003, "Chi", "Pham", "78 Nguyen Trai Ave.", 19, "Ha Noi"],
        [10004, "Dung", "Le", "9 Hai Ba Trung Dr.", 22, "Ho Chi Minh City"],
        [10005, "Ha", "Vo", "101 Dien Bien Phu St.", 20, "Can Tho"],
    ]

    with open(filename, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerows(rows)

    return Path(filename).resolve()


if __name__ == "__main__":
    path = generate_sample_users_csv()
    print("Created:", path)