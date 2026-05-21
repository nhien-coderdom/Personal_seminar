import unittest
from ngrams import lowercase_remove_punct_numbers 
class TestDataDriven(unittest.TestCase):
    def test_cases(self):
        cases = [
            ("ABC123", "abc"),
            ("Hello!!", "hello"),
            ("123", "")
        ]
        for inp, out in cases:
            with self.subTest(inp=inp):
                self.assertEqual(
                    lowercase_remove_punct_numbers(inp),
                    out
                )
if __name__ == "__main__":
   unittest.main()
