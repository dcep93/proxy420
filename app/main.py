import requests

from flask import Flask

# If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# called `app` in `main.py`.
app = Flask(__name__)


@app.route('/')
def ipify():
    resp = requests.get("https://api.ipify.org?format=json")
    return resp.text


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
