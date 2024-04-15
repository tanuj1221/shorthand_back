from flask import Flask, jsonify

app = Flask(__name__)

# JSON data to be served
json_data = {
    "latestVersion": "1.1.0.0",
    "url": "http://localhost:5000/downloads/YourApp_v1.1.0.0.exe"
}

# Create a route that returns the JSON data with a .json extension in the URL
@app.route('/api/data.json', methods=['GET'])
def get_json_data():
    return jsonify(json_data)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=4000)