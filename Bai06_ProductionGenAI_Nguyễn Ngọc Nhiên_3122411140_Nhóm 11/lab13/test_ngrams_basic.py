import unittest
from ngrams import lowercase_remove_punct_numbers

class TestTextProcessing(unittest.TestCase):
    def test_remove_punct(self):
        self.assertEqual(
            lowercase_remove_punct_numbers("Hello! 123"),
            "hello "
        )

if __name__ == "__main__":
    unittest.main()