# def rect_intersection_area(rect1, rect2):
   # return None

def rect_intersection_area(rect1, rect2):
    """
    Tính diện tích phần giao nhau giữa 2 hình chữ nhật.
    Mỗi hình chữ nhật có dạng:
    (x1, y1, x2, y2)
    với (x1, y1) là góc dưới trái,
    (x2, y2) là góc trên phải.
    """
    x1_1, y1_1, x2_1, y2_1 = rect1
    x1_2, y1_2, x2_2, y2_2 = rect2

    if x1_1 >= x2_1 or y1_1 >= y2_1:
        raise ValueError(f"Invalid rect1: {rect1}")

    if x1_2 >= x2_2 or y1_2 >= y2_2:
        raise ValueError(f"Invalid rect2: {rect2}")

    x_left = max(x1_1, x1_2)
    y_bottom = max(y1_1, y1_2)
    x_right = min(x2_1, x2_2)
    y_top = min(y2_1, y2_2)

    if x_left < x_right and y_bottom < y_top:
        return (x_right - x_left) * (y_top - y_bottom)

    return 0