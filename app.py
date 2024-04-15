from flask import Flask, request, jsonify
from flask_cors import CORS
import string



from Levenshtein import distance as levenshtein_distance

def similarity(word1, word2):
    return 1 - levenshtein_distance(word1, word2) / max(len(word1), len(word2))

def helper(word1, word2):
    if word1 == word2:
        return -1
    elif word1.lower() == word2.lower():
        return 1
    elif similarity(word1, word2) >= 0.5:
        return 0
    else:
        return 2

def has_punctuation(word):
    return any(char in string.punctuation for char in word)

def count_mistakes_and_rebuild_passage(original, answer, ignore_list=[]):
    mistakes = {
        'finalstring': [],
        'spelling': [],
        'missing': [],
        'extra': [],
        'case': [],
        'paramistake': []
    }
    rebuilt_answer = []
    
    paramis = original.count("\n") - answer.count("\n")
    original = original.replace("\n", " ")
    answer = answer.replace("\n", " ")
    for _ in range(abs(paramis)):
        mistakes['paramistake'].append('a')

    original_words = original.split()
    answer_words = answer.split()

    i = 0
    j = 0

    while i < len(original_words) and j < len(answer_words):
        original_word = original_words[i]
        answer_word = answer_words[j]

        if has_punctuation(original_word) or has_punctuation(answer_word):
            rebuilt_answer.append(answer_word)
            j += 1
            i += 1
            continue
        
        current_error_type = helper(original_word, answer_word)
        if current_error_type == -1:  # No error
            rebuilt_answer.append(answer_word)
            i += 1
            j += 1
        elif current_error_type == 0:  # Spelling mistake
            if answer_word not in ignore_list:
                mistakes['spelling'].append(answer_word)
                rebuilt_answer.append(f"[{original_word}->{answer_word}]")
            i += 1
            j += 1
        elif current_error_type == 1:  # Case error
            if answer_word not in ignore_list:
                mistakes['case'].append(answer_word)
                rebuilt_answer.append(f"[{original_word}->{answer_word}]")
            i += 1
            j += 1
        else:  # Possible extra or missing words
            original_future = original_words[i:i+3]
            answer_future = answer_words[j:j+3]
            found = False
            for index in range(3):
                if i + index < len(original_words) and helper(original_words[i + index], answer_words[j]) in [-1, 0, 1]:
                    found = True
                    if i + index != i:
                        missed_words = original_words[i:i + index]
                        mistakes['missing'].extend(missed_words)
                        missed_words_formatted = ' '.join(f"[missing -> {word}]" for word in missed_words)
                        rebuilt_answer.append(missed_words_formatted)
                    i += index
                    break
            if not found:
                if answer_word not in ignore_list:
                    mistakes['extra'].append(answer_word)
                    rebuilt_answer.append(f"[-> {answer_word}]")
                j += 1

    if i < len(original_words):
        missing_rest = original_words[i:]
        mistakes['missing'].extend(missing_rest)
        missing_rest_formatted = ' '.join(f"[missing -> {word}]" for word in missing_rest)
        rebuilt_answer.append(missing_rest_formatted)

    if j < len(answer_words):
        mistakes['extra'].extend(answer_words[j:])
        extra_formatted = ' '.join(f"[-> {word}]" for word in answer_words[j:] if word not in ignore_list)
        rebuilt_answer.append(extra_formatted)

    mistakes['finalstring'].append(" ".join(rebuilt_answer))

    return mistakes


app = Flask(__name__)
CORS(app)

@app.route('/compare-text', methods=['POST'])
def compare_text():
    data = request.get_json()

    original = data.get('original')
    answer = data.get('answer')
    ignore_words=data.get('list')
    print(ignore_words)
    # ignore_words = ['//१//', '//२//', '//३//', '//४//']

    if not original or not answer:
        return jsonify({'error': 'Missing text inputs'}), 400

    result = count_mistakes_and_rebuild_passage(original, answer, ignore_words)
    print(result)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
