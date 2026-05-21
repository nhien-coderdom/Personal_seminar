import unittest
from rectangle_intersection import rect_intersection_area


class TestRectangleIntersectionArea(unittest.TestCase):
    def test_intersecting_rectangles(self):
        rect1 = (0, 0, 4, 4)
        rect2 = (2, 2, 6, 6)
        self.assertEqual(rect_intersection_area(rect1, rect2), 4)

    def test_intersecting_rectangles_swapped(self):
        rect1 = (2, 2, 6, 6)
        rect2 = (0, 0, 4, 4)
        self.assertEqual(rect_intersection_area(rect1, rect2), 4)

    def test_non_intersecting_rectangles(self):
        rect1 = (0, 0, 2, 2)
        rect2 = (3, 3, 5, 5)
        self.assertEqual(rect_intersection_area(rect1, rect2), 0)

    def test_touching_edges(self):
        rect1 = (0, 0, 2, 2)
        rect2 = (2, 0, 4, 2)
        self.assertEqual(rect_intersection_area(rect1, rect2), 0)

    def test_one_inside_another(self):
        rect1 = (0, 0, 10, 10)
        rect2 = (2, 2, 4, 4)
        self.assertEqual(rect_intersection_area(rect1, rect2), 4)

    def test_invalid_rect1(self):
        rect1 = (4, 4, 0, 0)
        rect2 = (1, 1, 2, 2)
        with self.assertRaises(ValueError):
            rect_intersection_area(rect1, rect2)

    def test_invalid_rect2(self):
        rect1 = (0, 0, 4, 4)
        rect2 = (3, 3, 3, 6)
        with self.assertRaises(ValueError):
            rect_intersection_area(rect1, rect2)


if __name__ == "__main__":
    unittest.main()