import requests

from flask import Flask

app = Flask(__name__)


@app.route('/')
def ipify():
    resp = requests.get("https://api.ipify.org?format=json")
    return resp.text


@app.route('/tinyurl')
def tinyurl():
    resp = requests.get("https://tinyurl.is/IDu0?sport=american-football")
    return resp.text


@app.route('/weakstreams')
def weakstreams():
    resp = requests.get(
        "https://weakstreams.com/nfl-streams/detroit-lions-vs-philadelphia-eagles/81031?sport=american-football"
    )
    return resp.text


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
