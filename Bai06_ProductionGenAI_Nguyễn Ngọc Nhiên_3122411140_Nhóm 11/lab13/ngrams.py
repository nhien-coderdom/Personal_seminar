import re

def lowercase_remove_punct_numbers(text):
    return re.sub(r"[^a-z\s]", "", text.lower())

def multiple_to_single_spaces(text):
    return re.sub(r" +", " ", text)

def create_ngrams(text, n):
    processed = lowercase_remove_punct_numbers(text)
    processed = multiple_to_single_spaces(processed).strip()
    return [processed[i:i+n] for i in range(len(processed)-n+1)]

if __name__ == "__main__":
    text = "This is a test."
    n = 3
    ngrams = create_ngrams(text, n)
    print(ngrams)
    
    